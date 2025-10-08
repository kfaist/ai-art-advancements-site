@echo off
color 0B
cls
echo.
echo    ===================================================
echo    ^|                                                 ^|
echo    ^|        INSTAGRAM WEBHOOK SERVER SETUP          ^|
echo    ^|                                                 ^|
echo    ===================================================
echo.
echo    This will:
echo    1. Install webhook dependencies (express, cors)
echo    2. Start your local webhook server
echo    3. Give you the URL for Zapier
echo.
echo    Ready to set up full automation!
echo.
echo    ===================================================
echo.
pause

REM Set Node path
set PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo.
echo STEP 1: Installing webhook dependencies...
echo ----------------------------------------
echo Installing express and cors...
echo.

call npm install --no-save express cors

if %errorlevel% neq 0 (
    echo.
    echo WARNING: Some dependencies may have issues but webhook might still work
    echo Press any key to continue...
    pause >nul
)

echo.
echo.
echo STEP 2: Starting Webhook Server...
echo ----------------------------------------
echo.
echo Your webhook will run at: http://localhost:3456
echo.
echo To expose to internet (for Zapier):
echo 1. Download ngrok: https://ngrok.com/download
echo 2. Run: ngrok http 3456
echo 3. Use the https URL in Zapier
echo.
echo ===================================================
echo Starting server now...
echo Press Ctrl+C to stop
echo ===================================================
echo.

node zapier-webhook.js

pause
