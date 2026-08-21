@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  echo Starting Chess Royale 3D at http://localhost:8000
  start "Chess Royale 3D" http://localhost:8000
  py -m http.server 8000
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting Chess Royale 3D at http://localhost:8000
  start "Chess Royale 3D" http://localhost:8000
  python -m http.server 8000
  exit /b
)
echo Python was not found. Install Python or run: npm install && npm run dev
pause
