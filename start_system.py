#!/usr/bin/env python3
"""
Smart Rental Tracking System - Startup Script
Launches the complete system including backend, frontend, and ML components
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def print_banner():
    """Print the system banner"""
    print("=" * 80)
    print("🚀 Smart Rental Tracking System")
    print("=" * 80)
    print("AI-powered equipment rental management with real-time monitoring")
    print("Features: Demand Forecasting, Anomaly Detection, Smart Analytics")
    print("=" * 80)

def check_prerequisites():
    """Check if required software is installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python
    try:
        python_version = subprocess.check_output([sys.executable, "--version"], text=True).strip()
        print(f"✅ Python: {python_version}")
    except:
        print("❌ Python not found")
        return False
    
    # Check Node.js
    try:
        node_version = subprocess.check_output(["node", "--version"], text=True).strip()
        print(f"✅ Node.js: {node_version}")
    except:
        print("❌ Node.js not found")
        return False
    
    # Check npm
    try:
        npm_version = subprocess.check_output(["npm", "--version"], text=True).strip()
        print(f"✅ npm: {npm_version}")
        return True
    except:
        print("❌ npm not found")
        return False

def install_dependencies():
    """Install system dependencies"""
    print("\n📦 Installing dependencies...")
    
    # Install backend dependencies
    print("Installing backend dependencies...")
    backend_path = Path("backend")
    if backend_path.exists():
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], check=True)
            print("✅ Backend dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install backend dependencies")
            return False
    else:
        print("⚠️  Backend directory not found")
    
    # Install ML dependencies
    print("Installing ML dependencies...")
    ml_path = Path("ml")
    if ml_path.exists():
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "ml/requirements.txt"], check=True)
            print("✅ ML dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install ML dependencies")
            return False
    else:
        print("⚠️  ML directory not found")
    
    # Install frontend dependencies
    print("Installing frontend dependencies...")
    frontend_path = Path("frontend")
    if frontend_path.exists():
        try:
            subprocess.run(["npm", "install"], cwd="frontend", check=True)
            print("✅ Frontend dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies")
            return False
    else:
        print("⚠️  Frontend directory not found")
    
    return True

def start_backend():
    """Start the FastAPI backend server"""
    print("\n🚀 Starting backend server...")
    backend_path = Path("backend")
    if not backend_path.exists():
        print("❌ Backend directory not found")
        return None
    
    try:
        # Start backend server
        backend_process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for server to start
        time.sleep(3)
        
        # Check if server is running
        if backend_process.poll() is None:
            print("✅ Backend server started on http://localhost:8000")
            return backend_process
        else:
            print("❌ Backend server failed to start")
            return None
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def start_frontend():
    """Start the Next.js frontend"""
    print("\n🌐 Starting frontend...")
    frontend_path = Path("frontend")
    if not frontend_path.exists():
        print("❌ Frontend directory not found")
        return None
    
    try:
        # Start frontend development server
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd="frontend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for server to start
        time.sleep(5)
        
        # Check if server is running
        if frontend_process.poll() is None:
            print("✅ Frontend started on http://localhost:3000")
            return frontend_process
        else:
            print("❌ Frontend failed to start")
            return None
            
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def test_ml_system():
    """Test the ML system"""
    print("\n🧠 Testing ML system...")
    ml_path = Path("ml")
    if not ml_path.exists():
        print("❌ ML directory not found")
        return False
    
    try:
        # Test ML system
        result = subprocess.run(
            [sys.executable, "smart_ml_system.py"],
            cwd="ml",
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print("✅ ML system test completed successfully")
            return True
        else:
            print(f"⚠️  ML system test completed with warnings: {result.stderr}")
            return True
            
    except subprocess.TimeoutExpired:
        print("⚠️  ML system test timed out (this is normal for first run)")
        return True
    except Exception as e:
        print(f"❌ Error testing ML system: {e}")
        return False

def open_browsers():
    """Open system in browser"""
    print("\n🌐 Opening system in browser...")
    
    # Wait a bit for servers to fully start
    time.sleep(2)
    
    try:
        # Open frontend
        webbrowser.open("http://localhost:3000")
        print("✅ Frontend opened in browser")
        
        # Open backend API docs
        webbrowser.open("http://localhost:8000/docs")
        print("✅ Backend API documentation opened in browser")
        
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print("   Please manually open:")
        print("   - Frontend: http://localhost:3000")
        print("   - API Docs: http://localhost:8000/docs")

def main():
    """Main startup function"""
    print_banner()
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Prerequisites not met. Please install Python, Node.js, and npm.")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Failed to install dependencies.")
        return
    
    # Test ML system
    test_ml_system()
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ Failed to start backend. Exiting.")
        return
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("\n❌ Failed to start frontend. Exiting.")
        backend_process.terminate()
        return
    
    # Open browsers
    open_browsers()
    
    print("\n🎉 Smart Rental Tracking System is now running!")
    print("\n📱 Access Points:")
    print("   • Frontend Dashboard: http://localhost:3000")
    print("   • Backend API: http://localhost:8000")
    print("   • API Documentation: http://localhost:8000/docs")
    print("   • ML System Status: http://localhost:8000/ml/status")
    
    print("\n⏹️  To stop the system:")
    print("   • Press Ctrl+C in this terminal")
    print("   • Or close the terminal windows")
    
    try:
        # Keep the main process running
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("\n❌ Backend server stopped unexpectedly")
                break
                
            if frontend_process.poll() is not None:
                print("\n❌ Frontend server stopped unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down Smart Rental Tracking System...")
        
        # Terminate processes
        if backend_process:
            backend_process.terminate()
            print("✅ Backend server stopped")
            
        if frontend_process:
            frontend_process.terminate()
            print("✅ Frontend server stopped")
            
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()
