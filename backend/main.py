"""
Zippy - WhatsApp Swiggy AI Assistant Backend Service
"""

import os
import sys
from pathlib import Path

# Automatically add project root directory to sys.path to prevent ModuleNotFoundError
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.api.routes import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend service integrating OpenAI/Gemini AI Agent with Swiggy MCP APIs and WhatsApp Evolution API."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "running",
        "docs": "/docs",
        "whatsapp_webhook": "/api/whatsapp/webhook",
        "mcp_tools": "/api/mcp/tools"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
