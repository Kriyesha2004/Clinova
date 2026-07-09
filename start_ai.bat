@echo off
echo Starting Clinova AI Service...
cd ai_service

if not exist "venv\" (
    echo Virtual environment not found. Creating one now...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

python app.py
pause
