@echo off
REM Production startup script for backend (Windows)

echo.
echo ======================================
echo Smart Event Booking System Backend
echo ======================================
echo.

REM Check Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    pause
    exit /b 1
)

echo [INFO] Node version: 
node -v

echo [INFO] npm version:
npm -v
echo.

REM Check if we're in the backend directory
if not exist "server.js" (
    echo [ERROR] server.js not found. Run this script from the backend directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install --production
)

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found
    echo.
    echo [INFO] Please create .env file with required variables:
    echo   PORT=5000
    echo   NODE_ENV=production
    echo   JWT_SECRET=your_secret_key
    echo   FRONTEND_URL=your_frontend_url
    pause
    exit /b 1
)

echo [CHECK] .env file found
echo [SUCCESS] All checks passed
echo.
echo [INFO] Starting server...
echo.

REM Start the server
node server.js

pause
