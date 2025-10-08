@echo off
color 0B
cls
echo.
echo  ======================================================
echo  ^|                                                    ^|
echo  ^|        INSTAGRAM COMPLETE WORKFLOW                ^|  
echo  ^|     Generate Content + Post to Instagram          ^|
echo  ^|                                                    ^|
echo  ======================================================
echo.
echo  This wizard will help you:
echo  1. Generate Instagram carousels
echo  2. Post them to Instagram
echo.
pause

:menu
cls
echo.
echo  ======================================================
echo                    MAIN MENU
echo  ======================================================
echo.
echo  [1] Generate NEW carousels (4 posts)
echo  [2] View existing drafts
echo  [3] Post to Instagram (Manual)
echo  [4] Set up Creator Studio (Free scheduling)
echo  [5] Set up Buffer (Paid automation)
echo  [6] View posting guide
echo  [7] Exit
echo.
set /p choice="Select option (1-7): "

if "%choice%"=="1" goto generate
if "%choice%"=="2" goto view
if "%choice%"=="3" goto manual
if "%choice%"=="4" goto creator
if "%choice%"=="5" goto buffer
if "%choice%"=="6" goto guide
if "%choice%"=="7" exit

:generate
cls
echo.
echo  ======================================================
echo           GENERATING INSTAGRAM CAROUSELS
echo  ======================================================
echo.
echo  This will create 4 carousel posts:
echo  - 2 AI Art themed
echo  - 2 Nonprofit Tech themed
echo  Cost: ~$0.16 (for DALL-E images)
echo.
set /p confirm="Continue? (Y/N): "
if /i "%confirm%"=="Y" (
    cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator
    node generate-carousel.js
    echo.
    echo Generation complete!
    echo.
    pause
    goto postmenu
)
goto menu

:postmenu
cls
echo.
echo  ======================================================
echo         CONTENT GENERATED! NOW POST IT
echo  ======================================================
echo.
echo  Your carousels are ready in the drafts folder.
echo  How would you like to post them?
echo.
echo  [1] Open Instagram Web (manual upload)
echo  [2] Open Creator Studio (schedule posts)
echo  [3] Open Buffer (if configured)
echo  [4] View files only
echo  [5] Back to menu
echo.
set /p post="Select option (1-5): "

if "%post%"=="1" (
    start https://www.instagram.com/
    explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
    goto instructions
)
if "%post%"=="2" (
    start https://business.facebook.com/creatorstudio
    explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
    goto instructions
)
if "%post%"=="3" (
    start https://buffer.com/
    explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
    goto instructions
)
if "%post%"=="4" (
    explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
    pause
    goto menu
)
goto menu

:instructions
echo.
echo  ======================================================
echo              POSTING INSTRUCTIONS
echo  ======================================================
echo.
echo  1. IMAGES: Upload from carousel folder (01-04)
echo  2. CAPTION: Copy from caption.txt
echo  3. TIMING: Best at 11 AM or 7 PM EST
echo.
echo  Files are open in Explorer.
echo  Website is open in browser.
echo.
pause
goto menu

:view
explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
pause
goto menu

:manual
cls
echo.
echo  ======================================================
echo           MANUAL POSTING (Instant)
echo  ======================================================
echo.
echo  1. Opening Instagram web...
echo  2. Opening your drafts folder...
echo.
start https://www.instagram.com/
explorer C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts
echo.
echo  STEPS:
echo  ------
echo  1. Click the + button on Instagram
echo  2. Select "Post" 
echo  3. Choose multiple photos (carousel)
echo  4. Upload images from carousel folder
echo  5. Copy and paste caption.txt
echo  6. Share!
echo.
pause
goto menu

:creator
cls
echo.
echo  ======================================================
echo        META CREATOR STUDIO SETUP (Free)
echo  ======================================================
echo.
echo  Opening Creator Studio setup...
echo.
start https://business.facebook.com/creatorstudio
echo.
echo  SETUP STEPS:
echo  -----------
echo  1. Connect your Instagram account
echo  2. Must be Business or Creator account
echo  3. Link to Facebook Page (required)
echo  4. Then you can schedule posts!
echo.
echo  BENEFITS:
echo  - Schedule posts in advance
echo  - Post carousels from desktop
echo  - See analytics
echo  - Completely free
echo.
pause
goto menu

:buffer
cls
echo.
echo  ======================================================
echo           BUFFER SETUP (Automation)
echo  ======================================================
echo.
echo  Opening Buffer...
echo.
start https://buffer.com/
echo.
echo  SETUP STEPS:
echo  -----------
echo  1. Create Buffer account ($15/month)
echo  2. Connect Instagram via Facebook
echo  3. Get API credentials
echo  4. Save in tools\ig-generator\.env
echo.
echo  BENEFITS:
echo  - Fully automated posting
echo  - Optimal time scheduling
echo  - Analytics and insights
echo  - Queue management
echo.
echo  See BUFFER_SETUP.md for detailed instructions.
echo.
pause
goto menu

:guide
start notepad C:\Users\Krista\Desktop\ai-art-advancements-site\INSTAGRAM_POSTING_GUIDE.md
goto menu