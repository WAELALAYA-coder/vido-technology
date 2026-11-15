@echo off
setlocal
cd /d "%~dp0"
docker compose --env-file .env down
if errorlevel 1 (
  echo VIDO konnte nicht sauber gestoppt werden.
  pause
  exit /b 1
)
echo.
echo VIDO wurde gestoppt. Datenbank-Volumes bleiben erhalten.
pause
