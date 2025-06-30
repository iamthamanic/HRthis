"""
File Management Models
SQLAlchemy models for file metadata and document management
"""

from sqlalchemy import Column, String, Integer, DateTime, Enum, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum

Base = declarative_base()

class FileCategory(PyEnum):
    """Document categories for HR files"""
    PROFILE_PHOTO = "profile_photo"
    CONTRACT = "contract"
    ID_DOCUMENT = "id_document"          # Personalausweis, Reisepass
    DRIVERS_LICENSE = "drivers_license"   # Führerschein
    INSURANCE_CARD = "insurance_card"     # Krankenkassenkarte
    BANK_DETAILS = "bank_details"         # Bankverbindung
    APPLICATION_DOCS = "application_docs" # Bewerbungsunterlagen
    CERTIFICATE = "certificate"          # Zertifikate, Abschlüsse
    MEDICAL_RECORD = "medical_record"     # Gesundheitszeugnis
    TRAINING_RECORD = "training_record"   # Schulungsnachweis
    OTHER = "other"

class FileMetadata(Base):
    """File metadata and storage information"""
    __tablename__ = "file_metadata"
    
    # Primary Info
    id = Column(String, primary_key=True)
    filename = Column(String, nullable=False)           # Original filename
    stored_filename = Column(String, nullable=False)    # UUID filename on disk
    file_path = Column(String, nullable=False)          # Full file path
    
    # File Properties
    file_size = Column(Integer, nullable=False)         # Size in bytes
    mime_type = Column(String, nullable=False)          # MIME type
    file_hash = Column(String, nullable=True)           # SHA256 for deduplication
    
    # Categorization
    category = Column(Enum(FileCategory), default=FileCategory.OTHER)
    description = Column(Text, nullable=True)
    tags = Column(String, nullable=True)                # Comma-separated tags
    
    # Relationships
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    # employee = relationship("Employee", back_populates="documents")
    
    # OCR and Search (future)
    extracted_text = Column(Text, nullable=True)        # OCR extracted text
    is_processed = Column(String, default=False)        # OCR processing status
    
    # Metadata
    uploaded_by = Column(String, ForeignKey("employees.id"), nullable=False)
    uploaded_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Access Control
    is_confidential = Column(String, default=False)     # Requires special permissions
    retention_date = Column(DateTime, nullable=True)    # Auto-delete date
    
    def __repr__(self):
        return f"<FileMetadata {self.filename} ({self.category.value})>"
    
    @property
    def file_size_mb(self):
        """File size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    @property
    def is_image(self):
        """Check if file is an image"""
        return self.mime_type.startswith('image/')
    
    @property
    def is_document(self):
        """Check if file is a document"""
        document_types = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        return self.mime_type in document_types
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "filename": self.filename,
            "fileSize": self.file_size,
            "fileSizeMB": self.file_size_mb,
            "mimeType": self.mime_type,
            "category": self.category.value,
            "description": self.description,
            "tags": self.tags.split(',') if self.tags else [],
            "employeeId": self.employee_id,
            "isImage": self.is_image,
            "isDocument": self.is_document,
            "isConfidential": self.is_confidential,
            "isProcessed": self.is_processed,
            "extractedText": self.extracted_text,
            "uploadedBy": self.uploaded_by,
            "uploadedAt": self.uploaded_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
            "retentionDate": self.retention_date.isoformat() if self.retention_date else None
        }