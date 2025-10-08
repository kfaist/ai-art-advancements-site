@echo off
color 0A
cls
echo.
echo    ==================================================
echo    ^|                                                ^|
echo    ^|     INSTAGRAM GENERATOR - ONE CLICK TEST      ^|
echo    ^|                                                ^|
echo    ==================================================
echo.
echo    This will:
echo    1. Test your API connection
echo    2. Generate 1 test post
echo    3. Show you the results
echo.
echo    Cost: About $0.04
echo.
echo    ==================================================
echo.
pause

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo.
echo STEP 1: Testing API Connection...
echo --------------------------------
node test-connection.js

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: API connection failed!
    echo Please check your API key in tools\ig-generator\.env
    echo.
    pause
    exit /b 1
)

echo.
echo STEP 2: Generating Test Post...
echo --------------------------------
node test-generate.js

echo.
echo ==================================================
echo.
echo COMPLETE! Check tools\ig-generator\drafts\
echo.

if exist drafts (
    echo Found these in drafts folder:
    dir drafts /b
    echo.
    set /p open="Open drafts folder? (Y/N): "
    if /i "%open%"=="Y" explorer drafts
) else (
    echo No drafts folder found - check errors above.
)

echo.
pause