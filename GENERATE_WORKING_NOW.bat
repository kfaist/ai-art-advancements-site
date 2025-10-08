@echo off
color 0A
cls
echo.
echo    ===================================================
echo    ^|                                                 ^|
echo    ^|     WORKING INSTAGRAM GENERATOR                 ^|
echo    ^|                                                 ^|
echo    ===================================================
echo.
echo    No canvas required - works immediately!
echo.
echo    Creates:
echo    - AI visual
echo    - Structured caption with source
echo    - Headline text file (add to image in Canva)
echo.
echo    ===================================================
echo.
pause

SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo.
echo Installing axios...
call npm install --no-save axios

echo.
echo Generating post...
"C:\Program Files\nodejs\node.exe" generate-working.js

echo.
echo ===================================================
echo DONE! Check drafts folder
echo ===================================================
echo.
echo Next: Add headline text to image in Canva
echo.
pause
