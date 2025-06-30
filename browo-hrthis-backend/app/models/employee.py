"""
Employee Model
SQLAlchemy model for employee data including all new HR features
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

Base = declarative_base()

class EmploymentType(PyEnum):
    FULLTIME = "fulltime"
    PARTTIME = "parttime"
    MINIJOB = "minijob"
    INTERN = "intern"          # NEU
    OTHER = "other"            # NEU mit custom field

class EmployeeStatus(PyEnum):
    ACTIVE = "active"
    PROBATION = "probation"
    INACTIVE = "inactive"
    TERMINATED = "terminated"

class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"

class Employee(Base):
    __tablename__ = "employees"
    
    # Basic Info
    id = Column(String, primary_key=True)
    employee_number = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    
    # Personal Data
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    birth_date = Column(DateTime, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    emergency_contact = Column(JSON, nullable=True)  # {name, phone, relation}
    
    # Employment Details
    employment_type = Column(Enum(EmploymentType), nullable=False)
    employment_type_custom = Column(String, nullable=True)  # NEU: für "Sonstige"
    position = Column(String, nullable=False)
    department = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    probation_end = Column(DateTime, nullable=True)
    
    # Clothing Sizes - NEU!
    clothing_sizes = Column(JSON, nullable=True)  # {top: "L", pants: "32", shoes: "42"}
    
    # System Fields
    status = Column(Enum(EmployeeStatus), default=EmployeeStatus.ACTIVE)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    
    # Onboarding - NEU!
    onboarding_completed = Column(Boolean, default=False)
    onboarding_email_sent = Column(DateTime, nullable=True)
    onboarding_preset = Column(String, nullable=True)  # "driver", "accounting", etc.
    
    # HR Data
    salary = Column(Integer, nullable=True)  # in cents
    vacation_days = Column(Integer, default=24)
    
    # Document References
    documents = Column(JSON, nullable=True)  # Array of document IDs
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    created_by = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<Employee {self.employee_number}: {self.first_name} {self.last_name}>"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_admin(self):
        return self.role in [UserRole.ADMIN, UserRole.SUPERADMIN]
    
    @property
    def employment_type_display(self):
        """Returns display value for employment type"""
        if self.employment_type == EmploymentType.OTHER and self.employment_type_custom:
            return self.employment_type_custom
        return self.employment_type.value
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "employeeNumber": self.employee_number,
            "email": self.email,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "fullName": self.full_name,
            "birthDate": self.birth_date.isoformat() if self.birth_date else None,
            "phone": self.phone,
            "address": self.address,
            "emergencyContact": self.emergency_contact,
            "employmentType": self.employment_type.value,
            "employmentTypeCustom": self.employment_type_custom,
            "employmentTypeDisplay": self.employment_type_display,
            "position": self.position,
            "department": self.department,
            "startDate": self.start_date.isoformat(),
            "endDate": self.end_date.isoformat() if self.end_date else None,
            "probationEnd": self.probation_end.isoformat() if self.probation_end else None,
            "clothingSizes": self.clothing_sizes,
            "status": self.status.value,
            "role": self.role.value,
            "isActive": self.is_active,
            "isAdmin": self.is_admin,
            "onboardingCompleted": self.onboarding_completed,
            "onboardingEmailSent": self.onboarding_email_sent.isoformat() if self.onboarding_email_sent else None,
            "onboardingPreset": self.onboarding_preset,
            "salary": self.salary,
            "vacationDays": self.vacation_days,
            "documents": self.documents or [],
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
            "createdBy": self.created_by
        }