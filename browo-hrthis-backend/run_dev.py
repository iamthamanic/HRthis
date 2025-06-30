#!/usr/bin/env python3
"""
Development Server Runner
Start the FastAPI server for development
"""

import uvicorn
import os
from pathlib import Path

# Change to the project directory
os.chdir(Path(__file__).parent)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )