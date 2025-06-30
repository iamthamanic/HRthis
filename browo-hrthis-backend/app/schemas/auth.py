"""
Authentication Schemas
Pydantic models for auth requests/responses
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.employee import EmploymentType, UserRole

class LoginRequest(BaseModel):
    """Login request schema"""
    username: str  # email or employee_number
    password: str

class RegisterRequest(BaseModel):
    """Registration request schema"""
    email: EmailStr
    password: str
    employee_number: str
    first_name: str
    last_name: str
    position: str
    department: Optional[str] = None
    employment_type: EmploymentType
    start_date: Optional[datetime] = None
    role: Optional[UserRole] = UserRole.USER

class UserInfo(BaseModel):
    """User information schema"""
    id: str
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: str
    is_admin: bool
    employee_number: str
    position: str
    department: Optional[str]
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str
    expires_in: int

class LoginResponse(TokenResponse):
    """Login response with user info"""
    user: UserInfo