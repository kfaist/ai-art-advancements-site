@echo off
color 0A
cls
echo.
echo    ===================================================
echo    ^|                                                 ^|
echo    ^|    FREE INSTAGRAM GENERATOR - STABLE DIFFUSION  ^|
echo    ^|                                                 ^|
echo    ===================================================
echo.
echo    This uses FREE local AI instead of OpenAI!
echo    Cost: $0.00 (vs $0.16/day with DALL-E)
echo.
echo    ===================================================
echo.
pause

SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo.
echo Step 1: Installing axios (HTTP client)...
call npm install --no-save axios

echo.
echo Step 2: Checking Stable Diffusion...
echo.
echo NOTE: Stable Diffusion WebUI must be running!
echo If not started, open another window and run webui-user.bat
echo.
pause

echo.
echo Step 3: Generating Instagram content...
"C:\Program Files\nodejs\node.exe" generate-sd.js

echo.
echo ===================================================
echo DONE! Check the drafts folder
echo ===================================================
echo.
pause
