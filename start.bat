@echo off
echo ===================================================
echo Starting CareWash Full-Stack Application
echo ===================================================

echo.
echo Starting Spring Boot Backend (Port 8080)...
start "CareWash Backend" cmd /k "cd backend && title CareWash Backend && mvn spring-boot:run"

echo.
echo Starting React Frontend (Port 5173)...
start "CareWash Frontend" cmd /k "cd frontend && title CareWash Frontend && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Please wait a moment for them to fully initialize.
echo.
echo Backend API will be at: http://localhost:8080
echo Frontend UI will be at: http://localhost:5173
echo ===================================================
