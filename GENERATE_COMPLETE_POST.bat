@echo off
color 0A
cls
echo.
echo    ===================================================
echo    ^|                                                 ^|
echo    ^|     COMPLETE INSTAGRAM POST GENERATOR           ^|
echo    ^|                                                 ^|
echo    ===================================================
echo.
echo    This creates:
echo    - AI visual from your scraped news
echo    - Headline text overlay on image
echo    - Structured caption with source link
echo.
echo    Like your Midjourney V7 post!
echo.
echo    ===================================================
echo.
pause

SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo.
echo Step 1: Installing canvas (for text overlay)...
call npm install --no-save canvas

echo.
echo Step 2: Installing axios...
call npm install --no-save axios

echo.
echo Step 3: Generating complete post...
"C:\Program Files\nodejs\node.exe" generate-complete.js

echo.
echo ===================================================
echo DONE! Check the drafts folder
echo ===================================================
echo.
pause
