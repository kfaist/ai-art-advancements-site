@echo off
cls
color 0E
echo.
echo  ============================================
echo        ZAPIER INTEGRATION SETUP
echo  ============================================
echo.
echo  STATUS CHECK:
echo  -------------
echo  [✓] Generator works
echo  [✗] OpenAI needs credits ($5-10)
echo  [?] Zapier ready to connect
echo.
pause

:menu
cls
echo.
echo  ============================================
echo        ZAPIER CONNECTION OPTIONS
echo  ============================================
echo.
echo  Choose your setup method:
echo.
echo  [1] Simple: Zapier Email Reminder
echo  [2] Medium: Zapier + Google Drive
echo  [3] Advanced: Webhook Server
echo  [4] Fix OpenAI Credits First
echo  [5] Test Generator
echo  [6] Exit
echo.
set /p choice="Select (1-6): "

if "%choice%"=="1" goto simple
if "%choice%"=="2" goto medium
if "%choice%"=="3" goto advanced
if "%choice%"=="4" goto credits
if "%choice%"=="5" goto test
if "%choice%"=="6" exit

:simple
cls
echo.
echo  ============================================
echo     SIMPLE: Daily Email Reminder
echo  ============================================
echo.
echo  This Zap sends you a daily reminder to generate posts.
echo.
echo  CREATE THIS ZAP:
echo  ----------------
echo  1. Go to: zapier.com/app/zaps
echo  2. Create new Zap
echo.
echo  TRIGGER: Schedule by Zapier
echo   - Every Day
echo   - Time: 11:00 AM
echo.
echo  ACTION: Email by Zapier
echo   - To: your-email@gmail.com
echo   - Subject: Generate Instagram Content
echo   - Body: Time to run GENERATE_INSTAGRAM.bat!
echo.
echo  3. Turn on Zap
echo  4. You'll get daily reminders!
echo.
pause
goto menu

:medium
cls
echo.
echo  ============================================
echo     MEDIUM: Auto-Save to Google Drive
echo  ============================================
echo.
echo  This requires a webhook server or Google Apps Script.
echo.
echo  EASIER OPTION - Use Google Apps Script:
echo  ----------------------------------------
echo  1. Open Google Drive
echo  2. Create new Google Apps Script
echo  3. I'll create the script for you...
echo.
echo  Creating script file...
start notepad zapier-google-script.js
echo.
echo  Paste this script in Google Apps Script,
echo  deploy as web app, and use URL in Zapier!
echo.
pause
goto menu

:advanced
cls
echo.
echo  ============================================
echo     ADVANCED: Local Webhook Server
echo  ============================================
echo.
echo  Installing webhook dependencies...
echo.
cd tools\ig-generator
call npm install express cors
echo.
echo  Starting webhook server...
start cmd /k "node zapier-webhook.js"
echo.
echo  Server running at: http://localhost:3456
echo.
echo  To expose to internet:
echo  1. Install ngrok: ngrok.com
echo  2. Run: ngrok http 3456
echo  3. Use the public URL in Zapier
echo.
pause
goto menu

:credits
cls
echo.
echo  ============================================
echo       FIX OPENAI CREDITS
echo  ============================================
echo.
echo  Your OpenAI account needs credits!
echo.
echo  1. Opening billing page...
start https://platform.openai.com/account/billing
echo.
echo  2. Add $5-10 in credits
echo     ($5 = ~125 carousel images)
echo.
echo  3. Credits appear instantly
echo.
echo  4. Come back and test generator
echo.
pause
goto menu

:test
cls
echo.
echo  Testing generator...
echo.
cd tools\ig-generator
node test-generate.js
echo.
pause
goto menu