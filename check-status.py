#!/usr/bin/env python3
"""
Simple status check script for Karnan Solar Verification application
"""

import requests
import sys
from typing import Dict, Any

def check_service(url: str, name: str) -> bool:
    """Check if a service is running and healthy"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"✅ {name} is running (Status: {response.status_code})")
            return True
        else:
            print(f"⚠️  {name} responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ {name} is not accessible - make sure it's running")
        return False
    except requests.exceptions.Timeout:
        print(f"❌ {name} timed out - may be unresponsive")
        return False
    except Exception as e:
        print(f"❌ Error checking {name}: {e}")
        return False

def main():
    print("=== Karnan Solar Verification - Service Status Check ===\n")
    
    # Check backend services
    backend_checks = [
        ("http://localhost:8000/health", "Backend Health"),
        ("http://localhost:8000/", "Backend Root"),
        ("http://localhost:8000/api/v1/health", "Backend API Health"),
    ]
    
    # Check frontend services
    frontend_checks = [
        ("http://localhost:3000", "Frontend"),
    ]
    
    print("Checking backend services...")
    backend_status = []
    for url, name in backend_checks:
        status = check_service(url, name)
        backend_status.append(status)
    
    print("\nChecking frontend services...")
    frontend_status = []
    for url, name in frontend_checks:
        status = check_service(url, name)
        frontend_status.append(status)
    
    print("\n=== Summary ===")
    backend_healthy = all(backend_status)
    frontend_healthy = all(frontend_status)
    
    if backend_healthy:
        print("✅ Backend is fully operational")
    else:
        print("❌ Backend has issues")
        
    if frontend_healthy:
        print("✅ Frontend is fully operational")
    else:
        print("❌ Frontend has issues")
        
    if backend_healthy and frontend_healthy:
        print("\n🎉 All services are running! The application is ready to use.")
        print("\nAccess the application at: http://localhost:3000")
        print("Access the API documentation at: http://localhost:8000/docs")
    else:
        print("\n⚠️  Some services are not running properly.")
        print("Please check the logs and ensure all services are started.")

if __name__ == "__main__":
    main()