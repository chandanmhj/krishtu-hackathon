#!/usr/bin/env python3
"""
Setup script for Emergency Response Assistant
"""

import os
import sys
import subprocess

def check_python_version():
    """Check Python version"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher required")
        sys.exit(1)
    print("✅ Python version OK")

def create_env_file():
    """Create .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("""# Emergency Response Assistant Configuration
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_SECRET_KEY=change_this_to_a_secure_random_string
PORT=5000

# Get Gemini API key from: https://makersuite.google.com/app/apikey
""")
        print("✅ Created .env file")
        print("⚠️  Please edit .env and add your Gemini API key")
    else:
        print("✅ .env file already exists")

def install_requirements():
    """Install required packages"""
    print("Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        sys.exit(1)

def create_directory_structure():
    """Create necessary directories"""
    directories = [
        'static/js',
        'static/css',
        'static/images',
        'templates'
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created directory: {directory}")
    
    # Check if index.html exists in templates
    if not os.path.exists('templates/index.html'):
        print("⚠️  index.html not found in templates/ directory")
        print("   Please make sure your index.html is in templates/")

def main():
    print("🚨 Emergency Response Assistant Setup")
    print("=" * 50)
    
    check_python_version()
    create_env_file()
    install_requirements()
    create_directory_structure()
    
    print("\n" + "=" * 50)
    print("✅ Setup complete!")
    print("\nNext steps:")
    print("1. Get Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Add the key to .env file")
    print("3. Run the application: python app.py")
    print("4. Open browser to: http://localhost:5000")
    print("\nFor production:")
    print("  - Change FLASK_SECRET_KEY in .env")
    print("  - Use HTTPS")
    print("  - Set up proper hosting")

if __name__ == "__main__":
    main()