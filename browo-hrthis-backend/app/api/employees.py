"""
Employee API Endpoints
CRUD operations for employee management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models.employee import Employee, EmploymentType, EmployeeStatus, UserRole
from app.schemas.employee import (
    EmployeeCreate, 
    EmployeeUpdate, 
    EmployeeResponse, 
    EmployeeList,
    EmployeeFilters
)
from app.services.auth import get_password_hash, verify_password

router = APIRouter()

@router.get("/", response_model=EmployeeList)
def get_employees(
    search: Optional[str] = Query(None, description="Suche in Name, Email, Mitarbeiternummer"),
    department: Optional[str] = Query(None),
    status: Optional[EmployeeStatus] = Query(None),
    employment_type: Optional[EmploymentType] = Query(None),
    role: Optional[UserRole] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all employees with optional filters"""
    
    query = db.query(Employee)
    
    # Apply filters
    if search:
        search_filter = or_(
            Employee.first_name.ilike(f"%{search}%"),
            Employee.last_name.ilike(f"%{search}%"),
            Employee.email.ilike(f"%{search}%"),
            Employee.employee_number.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if department:
        query = query.filter(Employee.department == department)
    
    if status:
        query = query.filter(Employee.status == status)
    
    if employment_type:
        query = query.filter(Employee.employment_type == employment_type)
    
    if role:
        query = query.filter(Employee.role == role)
    
    # Count total
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    employees = query.offset(offset).limit(size).all()
    
    return EmployeeList(
        employees=[EmployeeResponse.from_orm(emp) for emp in employees],
        total=total,
        page=page,
        size=size
    )

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Get employee by ID"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return EmployeeResponse.from_orm(employee)

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    """Create new employee"""
    
    # Check if email already exists
    existing_email = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if employee number already exists
    existing_number = db.query(Employee).filter(
        Employee.employee_number == employee_data.employee_number
    ).first()
    if existing_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee number already exists"
        )
    
    # Create employee
    employee = Employee(
        id=str(uuid.uuid4()),
        employee_number=employee_data.employee_number,
        email=employee_data.email,
        password_hash=get_password_hash(employee_data.password),
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        birth_date=employee_data.birth_date,
        phone=employee_data.phone,
        address=employee_data.address,
        emergency_contact=employee_data.emergency_contact.dict() if employee_data.emergency_contact else None,
        employment_type=employee_data.employment_type,
        employment_type_custom=employee_data.employment_type_custom,
        position=employee_data.position,
        department=employee_data.department,
        start_date=employee_data.start_date,
        end_date=employee_data.end_date,
        probation_end=employee_data.probation_end,
        clothing_sizes=employee_data.clothing_sizes.dict() if employee_data.clothing_sizes else None,
        status=employee_data.status,
        role=employee_data.role,
        salary=employee_data.salary,
        vacation_days=employee_data.vacation_days
    )
    
    # Handle onboarding email
    if employee_data.send_onboarding_email:
        employee.onboarding_preset = employee_data.onboarding_preset
        employee.onboarding_email_sent = datetime.utcnow()
        # TODO: Trigger email sending service
    
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    return EmployeeResponse.from_orm(employee)

@router.patch("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: str, 
    employee_data: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    """Update employee"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update fields
    update_data = employee_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "emergency_contact" and value:
            value = value.dict()
        elif field == "clothing_sizes" and value:
            value = value.dict()
        
        setattr(employee, field, value)
    
    employee.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(employee)
    
    return EmployeeResponse.from_orm(employee)

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete employee (soft delete by setting inactive)"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Soft delete
    employee.is_active = False
    employee.status = EmployeeStatus.TERMINATED
    employee.updated_at = datetime.utcnow()
    
    db.commit()

@router.get("/{employee_id}/onboarding-status")
def get_onboarding_status(employee_id: str, db: Session = Depends(get_db)):
    """Get onboarding status for employee"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return {
        "employee_id": employee_id,
        "onboarding_completed": employee.onboarding_completed,
        "onboarding_email_sent": employee.onboarding_email_sent,
        "onboarding_preset": employee.onboarding_preset
    }

@router.post("/{employee_id}/send-onboarding-email")
def send_onboarding_email(
    employee_id: str, 
    preset: str,
    db: Session = Depends(get_db)
):
    """Send onboarding email to employee"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update onboarding status
    employee.onboarding_preset = preset
    employee.onboarding_email_sent = datetime.utcnow()
    
    db.commit()
    
    # TODO: Trigger actual email sending via Brevo service
    
    return {
        "message": "Onboarding email sent successfully",
        "employee_id": employee_id,
        "preset": preset,
        "sent_at": employee.onboarding_email_sent
    }