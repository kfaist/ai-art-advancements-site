@echo off
echo ========================================
echo  Instagram Generator - Quick Setup
echo ========================================
echo.

cd /d %~dp0

echo Step 1: Installing dependencies...
echo.
call npm install

echo.
echo Step 2: Testing OpenAI connection...
echo.
call node test-connection.js

if %errorlevel% neq 0 (
  echo.
  echo ❌ Setup failed! Please check your API key in .env
  pause
  exit /b 1
)

echo.
echo ========================================
echo ✅ Setup Complete!
echo.
echo To generate Instagram carousels:
echo   - Run: node generate-carousel.js
echo   - Or double-click: run.bat
echo.
echo Carousels will appear in: drafts\
echo ========================================
echo.
pause