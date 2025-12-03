@echo off
cd /d "%~dp0server"
echo Starting Ad-Orchestrator Backend Server...
echo.
node index.js
pause
