@echo off
cd /d "%~dp0"

set PORT=8000
set URL=http://localhost:%PORT%

where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Python not found. Install Python 3 or use: npx serve .
  pause
  exit /b 1
)

echo Serving portfolio at %URL% (Ctrl+C to stop)
start "" "%URL%"
python -m http.server %PORT%
