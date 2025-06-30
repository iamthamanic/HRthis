"""
Employee Schemas
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

# Enums for validation
class EmploymentType(str, Enum):
    FULLTIME = "fulltime"
    PARTTIME = "parttime"
    MINIJOB = "minijob"
    INTERN = "intern"
    OTHER = "other"

class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    PROBATION = "probation"
    INACTIVE = "inactive"
    TERMINATED = "terminated"

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"

# Clothing Sizes Schema
class ClothingSizes(BaseModel):
    top: Optional[str] = Field(None, description="Oberteil Größe (S, M, L, XL, etc.)")
    pants: Optional[str] = Field(None, description="Hosen Größe (28, 30, 32, etc.)")
    shoes: Optional[str] = Field(None, description="Schuh Größe (40, 41, 42, etc.)")

# Emergency Contact Schema
class EmergencyContact(BaseModel):
    name: str = Field(..., description="Name der Kontaktperson")
    phone: str = Field(..., description="Telefonnummer")
    relation: str = Field(..., description="Beziehung (Partner, Mutter, etc.)")

# Base Employee Schema
class EmployeeBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    birth_date: Optional[datetime] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[EmergencyContact] = None
    
    # Employment
    employment_type: EmploymentType
    employment_type_custom: Optional[str] = Field(None, description="Für 'Sonstige' Beschäftigungsart")
    position: str = Field(..., min_length=1, max_length=100)
    department: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    probation_end: Optional[datetime] = None
    
    # NEW: Clothing Sizes
    clothing_sizes: Optional[ClothingSizes] = None
    
    # Status
    status: EmployeeStatus = EmployeeStatus.ACTIVE
    role: UserRole = UserRole.USER
    
    # HR Data
    salary: Optional[int] = Field(None, description="Gehalt in Cent")
    vacation_days: int = Field(24, description="Urlaubstage pro Jahr")
    
    @validator('employment_type_custom')
    def validate_custom_employment_type(cls, v, values):
        """Validate that custom employment type is provided when 'other' is selected"""
        if values.get('employment_type') == EmploymentType.OTHER and not v:
            raise ValueError('employment_type_custom is required when employment_type is "other"')
        return v
    
    @validator('clothing_sizes')
    def validate_clothing_sizes(cls, v):
        """Ensure at least one clothing size is provided if sizes are given"""
        if v and not any([v.top, v.pants, v.shoes]):
            raise ValueError('At least one clothing size must be provided')
        return v

# Create Employee Schema
class EmployeeCreate(EmployeeBase):
    password: str = Field(..., min_length=8, description="Passwort (min. 8 Zeichen)")
    employee_number: str = Field(..., description="Eindeutige Mitarbeiternummer")
    
    # Onboarding
    send_onboarding_email: bool = Field(False, description="Onboarding Email versenden")
    onboarding_preset: Optional[str] = Field(None, description="Email Preset (driver, accounting, etc.)")
    
    @validator('onboarding_preset')
    def validate_onboarding_preset(cls, v, values):
        """Validate that preset is provided when sending onboarding email"""
        if values.get('send_onboarding_email') and not v:
            raise ValueError('onboarding_preset is required when send_onboarding_email is True')
        return v

# Update Employee Schema
class EmployeeUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    birth_date: Optional[datetime] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[EmergencyContact] = None
    
    employment_type: Optional[EmploymentType] = None
    employment_type_custom: Optional[str] = None
    position: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = None
    end_date: Optional[datetime] = None
    probation_end: Optional[datetime] = None
    
    clothing_sizes: Optional[ClothingSizes] = None
    
    status: Optional[EmployeeStatus] = None
    role: Optional[UserRole] = None
    
    salary: Optional[int] = None
    vacation_days: Optional[int] = None

# Response Schema
class EmployeeResponse(EmployeeBase):
    id: str
    employee_number: str
    full_name: str
    employment_type_display: str
    is_active: bool
    is_admin: bool
    
    # Onboarding
    onboarding_completed: bool
    onboarding_email_sent: Optional[datetime] = None
    onboarding_preset: Optional[str] = None
    
    # Documents
    documents: List[str] = Field(default_factory=list, description="Liste von Dokument IDs")
    
    # Metadata
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

# List Response
class EmployeeList(BaseModel):
    employees: List[EmployeeResponse]
    total: int
    page: int
    size: int

# Filters for employee search
class EmployeeFilters(BaseModel):
    search: Optional[str] = Field(None, description="Suche in Name, Email, Mitarbeiternummer")
    department: Optional[str] = None
    status: Optional[EmployeeStatus] = None
    employment_type: Optional[EmploymentType] = None
    role: Optional[UserRole] = None
    page: int = Field(1, ge=1)
    size: int = Field(50, ge=1, le=100)