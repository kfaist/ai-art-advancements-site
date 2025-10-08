@echo off
echo ============================================
echo    Instagram Posting Helper
echo ============================================
echo.
echo This will help you post your generated content!
echo.
echo STEP 1: Generate Content
echo ------------------------
set /p generate="Generate new carousels now? (Y/N): "
if /i "%generate%"=="Y" (
    cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator
    node generate-carousel.js
    echo.
)

echo STEP 2: Open Your Drafts
echo ------------------------
set DRAFTS=C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
if exist "%DRAFTS%" (
    echo Opening drafts folder...
    explorer "%DRAFTS%"
) else (
    echo No drafts found! Generate content first.
    pause
    exit /b 1
)

echo.
echo STEP 3: Choose Posting Method
echo ------------------------
echo.
echo 1. Open Instagram Web (manual upload)
echo 2. Open Meta Creator Studio (schedule posts)
echo 3. Open Buffer.com (if you have account)
echo 4. Open Later.com (if you have account)
echo 5. Just view the files
echo.
set /p method="Choose method (1-5): "

if "%method%"=="1" start https://www.instagram.com/
if "%method%"=="2" start https://business.facebook.com/creatorstudio
if "%method%"=="3" start https://buffer.com/
if "%method%"=="4" start https://later.com/
if "%method%"=="5" echo Files are open in Explorer

echo.
echo ============================================
echo POSTING INSTRUCTIONS:
echo.
echo 1. Upload images from the carousel folder
echo 2. Copy caption from caption.txt
echo 3. Post or schedule your carousel!
echo.
echo BEST TIMES TO POST:
echo - Weekdays: 11 AM or 7 PM
echo - Weekends: 10 AM or 8 PM
echo ============================================
echo.
pause