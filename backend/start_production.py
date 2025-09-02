#!/usr/bin/env python3
"""
Production startup script for Smart Rental Tracker
This script is used by Render to start the backend service
"""

import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv('config.env.production', override=True)

if __name__ == "__main__":
    # Initialize production database first
    print("🚀 Initializing production environment...")
    
    try:
        # Import and run database initialization
        from init_production_db import init_production_database
        init_production_database()
    except Exception as e:
        print(f"⚠️ Database initialization warning: {e}")
        print("Continuing with startup...")
    
    # Get port from environment (Render sets this)
    port = int(os.getenv("PORT", 8000))
    
    print(f"🌐 Starting FastAPI server on port {port}...")
    
    # Start the FastAPI application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    )
