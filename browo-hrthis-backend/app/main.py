"""
HRthis Backend API
FastAPI application for HR management system
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

# Create uploads directory
uploads_dir = Path("./uploads")
uploads_dir.mkdir(exist_ok=True)

app = FastAPI(
    title="HRthis Backend API",
    description="Backend API for HRthis HR Management System",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:1996", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {
        "message": "HRthis Backend API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Import routers
from app.api import employees, auth, files
from app.core.database import create_tables

# Create tables on startup
@app.on_event("startup")
def startup_event():
    create_tables()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(files.router, prefix="/api/files", tags=["file-management"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)