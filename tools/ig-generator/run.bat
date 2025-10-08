@echo off
setlocal
cd /d %~dp0

echo ===================================
echo    Instagram Carousel Generator
echo ===================================
echo.

if not exist "node_modules" (
  echo Installing dependencies...
  npm install canvas dotenv openai
  echo.
)

if not exist ".env" (
  echo ERROR: .env not found in tools\ig-generator.
  echo Copy .env.example to .env and add OPENAI_API_KEY.
  pause
  exit /b 1
)

echo Generating Instagram carousels...
node generate-carousel.js

echo.
echo Done! Carousels are in %cd%\drafts
echo.
pause