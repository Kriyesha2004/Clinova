@echo off
echo Starting Clinova AI Service...
cd ai_service
call venv\Scripts\activate.bat
python app.py
pause
