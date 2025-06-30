"""
File Management Schemas
Pydantic models for file upload and metadata
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.file import FileCategory

class FileUploadResponse(BaseModel):
    """Response after successful file upload"""
    id: str
    filename: str
    file_size: int
    mime_type: str
    category: str
    upload_url: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class FileMetadataResponse(BaseModel):
    """File metadata response"""
    id: str
    filename: str
    stored_filename: str
    file_size: int
    file_size_mb: float
    mime_type: str
    category: str
    description: Optional[str]
    tags: List[str] = []
    employee_id: Optional[str]
    is_image: bool
    is_document: bool
    is_confidential: bool
    is_processed: bool
    extracted_text: Optional[str]
    uploaded_by: str
    uploaded_at: datetime
    updated_at: datetime
    retention_date: Optional[datetime]
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            filename=obj.filename,
            stored_filename=obj.stored_filename,
            file_size=obj.file_size,
            file_size_mb=obj.file_size_mb,
            mime_type=obj.mime_type,
            category=obj.category.value,
            description=obj.description,
            tags=obj.tags.split(',') if obj.tags else [],
            employee_id=obj.employee_id,
            is_image=obj.is_image,
            is_document=obj.is_document,
            is_confidential=obj.is_confidential,
            is_processed=obj.is_processed,
            extracted_text=obj.extracted_text,
            uploaded_by=obj.uploaded_by,
            uploaded_at=obj.uploaded_at,
            updated_at=obj.updated_at,
            retention_date=obj.retention_date
        )

class FileListResponse(BaseModel):
    """Paginated file list response"""
    files: List[FileMetadataResponse]
    total: int
    page: int
    size: int

class FileFilters(BaseModel):
    """File filtering options"""
    employee_id: Optional[str] = None
    category: Optional[FileCategory] = None
    mime_type: Optional[str] = None
    is_confidential: Optional[bool] = None
    search: Optional[str] = None  # Search in filename, description, extracted_text
    page: int = Field(1, ge=1)
    size: int = Field(50, ge=1, le=100)

class FileUpdateRequest(BaseModel):
    """File metadata update request"""
    category: Optional[FileCategory] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    employee_id: Optional[str] = None
    is_confidential: Optional[bool] = None

class FileStats(BaseModel):
    """File statistics"""
    total_files: int
    total_size_mb: float
    files_by_category: dict
    files_by_employee: dict
    recent_uploads: List[FileMetadataResponse]

# Email Service Schemas (Browo AI Integration vorbereitet)
class EmailTemplate(BaseModel):
    """Email template for Browo AI integration"""
    id: str
    name: str
    display_name: str
    subject: str
    template_html: str
    template_text: str
    variables: List[str]  # Available template variables
    category: str         # onboarding, notification, etc.

class EmailRequest(BaseModel):
    """Email sending request (for Browo AI)"""
    template_id: str
    recipient_email: str
    recipient_name: str
    variables: dict       # Template variable values
    attachments: Optional[List[str]] = []  # File IDs to attach

class EmailStatus(BaseModel):
    """Email sending status"""
    id: str
    template_id: str
    recipient_email: str
    status: str          # pending, sent, delivered, failed
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    error_message: Optional[str]