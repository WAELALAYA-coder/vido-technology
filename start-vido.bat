@echo off
setlocal
cd /d "%~dp0"

if not exist .env (
  copy .env.example .env >nul
  echo.
  echo .env wurde aus .env.example erstellt.
  echo Bitte JWT_SECRET, OWNER_EMAIL und OWNER_PASSWORD eintragen und erneut starten.
  pause
  exit /b 1
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker Desktop wurde nicht gefunden.
  echo Installiere Docker Desktop und starte dieses Script danach erneut.
  pause
  exit /b 1
)

docker compose --env-file .env up -d
if errorlevel 1 (
  echo VIDO konnte nicht gestartet werden.
  pause
  exit /b 1
)

echo.
echo VIDO Technology V39 laeuft unter: http://127.0.0.1:3001
echo API Health: http://127.0.0.1:3001/api/health
pause
