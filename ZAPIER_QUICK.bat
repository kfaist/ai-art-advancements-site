@echo off
cls
color 0A
echo.
echo  ============================================
echo      ZAPIER + INSTAGRAM QUICK SETUP
echo  ============================================
echo.
echo  ⚠️ IMPORTANT: Fix OpenAI credits first!
echo     Your account hit billing limit.
echo.
echo  Your current status:
echo  [✓] Generator code works
echo  [✗] OpenAI needs credits ($5)
echo  [✓] Zapier available
echo.
echo  ============================================
echo.
echo  Press 1 to add OpenAI credits (required)
echo  Press 2 to see simple Zapier setup
echo  Press 3 to exit
echo.
set /p fix="Choose (1-3): "

if "%fix%"=="1" (
    echo.
    echo Opening OpenAI billing page...
    start https://platform.openai.com/account/billing
    echo.
    echo Steps:
    echo 1. Click "Add to credit balance"
    echo 2. Add $5-10
    echo 3. Come back and press any key
    echo.
    pause
    goto test
)

if "%fix%"=="2" goto zapier
if "%fix%"=="3" exit

:test
cls
echo.
echo Testing if credits were added...
echo.
cd tools\ig-generator
node test-generate.js
echo.
echo Did it work? (Check for errors above)
pause
goto zapier

:zapier
cls
echo.
echo  ============================================
echo      EASIEST ZAPIER SETUP (5 minutes)
echo  ============================================
echo.
echo  CREATE THIS SIMPLE ZAP:
echo.
echo  📅 TRIGGER: Schedule by Zapier
echo     - Frequency: Every Day
echo     - Time: 11:00 AM
echo.
echo  📧 ACTION: Gmail - Send Email
echo     - To: your-email@gmail.com  
echo     - Subject: Instagram Content Ready!
echo     - Body: Your AI art carousels are ready.
echo             Click here to generate: [include link]
echo.
echo  THAT'S IT! Daily reminders to generate.
echo.
echo  ============================================
echo.
echo  Want something more automated? (Y/N)
set /p more="Choose: "

if /i "%more%"=="Y" goto advanced

echo.
echo Great! Set up that simple Zap and you're done.
pause
exit

:advanced
cls
echo.
echo  ============================================
echo    MORE AUTOMATED OPTIONS
echo  ============================================
echo.
echo  Option A: Zapier + Google Sheets
echo  ---------------------------------
echo  1. Zap saves prompts to Google Sheet
echo  2. You run generator weekly
echo  3. Batch process all prompts
echo.
echo  Option B: Zapier + Slack/Discord
echo  ---------------------------------  
echo  1. Zap sends notification
echo  2. Includes "Generate Now" button
echo  3. You click and run
echo.
echo  Option C: Zapier + Buffer
echo  ---------------------------------
echo  1. You generate content manually
echo  2. Save to Google Drive folder
echo  3. Zapier watches folder
echo  4. Auto-sends to Buffer
echo  5. Buffer posts to Instagram
echo.
echo  Which sounds best?
echo  - These all work around Instagram's limits
echo  - No complex server setup needed
echo.
pause