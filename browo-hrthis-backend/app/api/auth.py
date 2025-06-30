"""
Authentication API Endpoints
Login, Register, Token management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
import uuid

from app.core.database import get_db
from app.models.employee import Employee, UserRole, EmployeeStatus
from app.schemas.auth import (
    LoginRequest,
    LoginResponse, 
    RegisterRequest,
    TokenResponse,
    UserInfo
)
from app.services.auth import (
    verify_password, 
    get_password_hash,
    create_access_token,
    verify_token
)

router = APIRouter()

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login with email/password"""
    
    # Find user by email or employee number
    employee = db.query(Employee).filter(
        (Employee.email == form_data.username) | 
        (Employee.employee_number == form_data.username)
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, employee.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if employee is active
    if not employee.is_active or employee.status == EmployeeStatus.TERMINATED:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": employee.id, "email": employee.email, "role": employee.role.value}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=1800,  # 30 minutes
        user=UserInfo(
            id=employee.id,
            email=employee.email,
            first_name=employee.first_name,
            last_name=employee.last_name,
            full_name=employee.full_name,
            role=employee.role.value,
            is_admin=employee.is_admin,
            employee_number=employee.employee_number,
            position=employee.position,
            department=employee.department
        )
    )

@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register new employee (admin only in production)"""
    
    # Check if email already exists
    existing_email = db.query(Employee).filter(Employee.email == register_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if employee number already exists
    existing_number = db.query(Employee).filter(
        Employee.employee_number == register_data.employee_number
    ).first()
    if existing_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee number already exists"
        )
    
    # Create new employee
    employee = Employee(
        id=str(uuid.uuid4()),
        employee_number=register_data.employee_number,
        email=register_data.email,
        password_hash=get_password_hash(register_data.password),
        first_name=register_data.first_name,
        last_name=register_data.last_name,
        position=register_data.position,
        department=register_data.department,
        employment_type=register_data.employment_type,
        start_date=register_data.start_date or datetime.utcnow(),
        role=register_data.role or UserRole.USER,
        status=EmployeeStatus.ACTIVE
    )
    
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": employee.id, "email": employee.email, "role": employee.role.value}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=1800,
        user=UserInfo(
            id=employee.id,
            email=employee.email,
            first_name=employee.first_name,
            last_name=employee.last_name,
            full_name=employee.full_name,
            role=employee.role.value,
            is_admin=employee.is_admin,
            employee_number=employee.employee_number,
            position=employee.position,
            department=employee.department
        )
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    
    # Get current user first
    current_user = get_current_user(token, db)
    
    # Create new access token
    access_token = create_access_token(
        data={"sub": current_user.id, "email": current_user.email, "role": current_user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=1800
    )

@router.get("/me", response_model=UserInfo)
def get_current_user_info(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    
    # Get current user first
    current_user = get_current_user(token, db)
    
    return UserInfo(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        full_name=current_user.full_name,
        role=current_user.role.value,
        is_admin=current_user.is_admin,
        employee_number=current_user.employee_number,
        position=current_user.position,
        department=current_user.department
    )

@router.post("/logout")
def logout():
    """Logout (client-side token removal)"""
    return {"message": "Logged out successfully"}

# Dependency to get current user from token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Employee:
    """Get current user from JWT token"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    employee = db.query(Employee).filter(Employee.id == user_id).first()
    if employee is None:
        raise credentials_exception
    
    if not employee.is_active or employee.status == EmployeeStatus.TERMINATED:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    return employee

# Dependency for admin-only routes  
def get_current_admin_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Employee:
    """Require admin role"""
    
    # Get current user first
    current_user = get_current_user(token, db)
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return current_user