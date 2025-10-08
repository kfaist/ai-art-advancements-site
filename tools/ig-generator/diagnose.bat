@echo off
echo ============================================
echo   Instagram Generator - Diagnostic Run
echo ============================================
echo.

cd /d %~dp0

echo Step 1: Checking environment...
echo --------------------------------
if exist ".env" (
    echo [OK] .env file found
) else (
    echo [ERROR] .env file not found!
    echo Please create .env with your OPENAI_API_KEY
    pause
    exit /b 1
)

echo.
echo Step 2: Installing dependencies...
echo --------------------------------
call npm install openai dotenv

echo.
echo Step 3: Running connection test...
echo --------------------------------
call node test-connection.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Connection test failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Step 4: Generating carousels...
echo --------------------------------
call node generate-carousel.js

echo.
echo ============================================
echo Process complete! Check the drafts folder.
echo ============================================
echo.

dir drafts /b 2>nul
if %errorlevel% neq 0 (
    echo No drafts found. Check errors above.
) else (
    echo.
    echo Drafts created successfully!
)

echo.
pause