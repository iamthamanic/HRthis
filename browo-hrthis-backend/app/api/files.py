"""
File Management API Endpoints
Upload, Download, Delete for HR documents
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os
from pathlib import Path
import shutil
from datetime import datetime
import magic

from app.core.database import get_db
from app.models.file import FileMetadata, FileCategory
from app.schemas.file import (
    FileUploadResponse,
    FileListResponse, 
    FileMetadataResponse,
    FileFilters
)
from app.api.auth import get_current_user
from app.models.employee import Employee

router = APIRouter()

# Configuration
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'}

@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    category: Optional[str] = None,
    employee_id: Optional[str] = None,
    description: Optional[str] = None,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a file with metadata"""
    
    # Validate file size
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Validate file extension
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    # Save file to disk
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file"
        )
    
    # Detect MIME type
    mime_type = magic.from_file(str(file_path), mime=True)
    
    # Create metadata record
    file_metadata = FileMetadata(
        id=file_id,
        filename=file.filename,
        stored_filename=filename,
        file_path=str(file_path),
        file_size=file.size,
        mime_type=mime_type,
        category=FileCategory(category) if category else FileCategory.OTHER,
        description=description,
        employee_id=employee_id,
        uploaded_by=current_user.id,
        uploaded_at=datetime.utcnow()
    )
    
    db.add(file_metadata)
    db.commit()
    db.refresh(file_metadata)
    
    return FileUploadResponse(
        id=file_metadata.id,
        filename=file_metadata.filename,
        file_size=file_metadata.file_size,
        mime_type=file_metadata.mime_type,
        category=file_metadata.category.value,
        upload_url=f"/api/files/{file_metadata.id}",
        uploaded_at=file_metadata.uploaded_at
    )

@router.get("/", response_model=FileListResponse)
def get_files(
    employee_id: Optional[str] = None,
    category: Optional[FileCategory] = None,
    page: int = 1,
    size: int = 50,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get files with filters"""
    
    query = db.query(FileMetadata)
    
    # Apply filters
    if employee_id:
        query = query.filter(FileMetadata.employee_id == employee_id)
    
    if category:
        query = query.filter(FileMetadata.category == category)
    
    # Count total
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * size
    files = query.offset(offset).limit(size).all()
    
    return FileListResponse(
        files=[FileMetadataResponse.from_orm(f) for f in files],
        total=total,
        page=page,
        size=size
    )

@router.get("/{file_id}", response_model=FileMetadataResponse)
def get_file_metadata(
    file_id: str,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get file metadata"""
    
    file_metadata = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if not file_metadata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return FileMetadataResponse.from_orm(file_metadata)

@router.get("/{file_id}/download")
def download_file(
    file_id: str,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download file"""
    
    file_metadata = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if not file_metadata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    file_path = Path(file_metadata.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk"
        )
    
    from fastapi.responses import FileResponse
    return FileResponse(
        path=file_path,
        filename=file_metadata.filename,
        media_type=file_metadata.mime_type
    )

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: str,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete file and metadata"""
    
    file_metadata = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if not file_metadata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Delete physical file
    file_path = Path(file_metadata.file_path)
    if file_path.exists():
        file_path.unlink()
    
    # Delete metadata
    db.delete(file_metadata)
    db.commit()

@router.patch("/{file_id}", response_model=FileMetadataResponse)
def update_file_metadata(
    file_id: str,
    category: Optional[FileCategory] = None,
    description: Optional[str] = None,
    employee_id: Optional[str] = None,
    current_user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update file metadata"""
    
    file_metadata = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if not file_metadata:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Update fields
    if category is not None:
        file_metadata.category = category
    if description is not None:
        file_metadata.description = description
    if employee_id is not None:
        file_metadata.employee_id = employee_id
    
    file_metadata.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(file_metadata)
    
    return FileMetadataResponse.from_orm(file_metadata)