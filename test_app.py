#!/usr/bin/env python3
"""
MPGA Web App - Quick Test Script
This script tests the Flask application locally
"""

import time
import webbrowser
import subprocess
import sys
from pathlib import Path

def main():
    print("=" * 60)
    print("  MPGA Web App - Quick Test")
    print("  Make Pluto Great Again 🚀")
    print("=" * 60)
    print()
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Error: app.py not found!")
        print("   Please run this script from the project root directory")
        sys.exit(1)
    
    print("✓ Found app.py")
    
    # Check if requirements are installed
    print("Checking dependencies...")
    try:
        import flask
        import pandas
        import requests
        print("✓ All dependencies installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("   Run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Start the Flask app
    print()
    print("Starting Flask application...")
    print("=" * 60)
    print()
    
    try:
        # Open browser after a delay
        def open_browser():
            time.sleep(2)
            print("\n🌐 Opening browser...")
            webbrowser.open("http://localhost:8080")
        
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Run Flask app
        subprocess.run([sys.executable, "app.py"])
        
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down...")
        print("=" * 60)
        sys.exit(0)

if __name__ == "__main__":
    main()
