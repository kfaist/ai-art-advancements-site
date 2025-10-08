@echo off
echo ============================================
echo    Instagram Generator - Menu
echo ============================================
echo.
echo What would you like to do?
echo.
echo 1. Check API Connection
echo 2. Generate TEST Post (1 post, $0.04)
echo 3. Generate FULL Batch (4 posts, $0.16)
echo 4. Open Drafts Folder
echo 5. Run Full Diagnostic
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

if "%choice%"=="1" (
    echo.
    echo Testing API connection...
    echo.
    node test-connection.js
    echo.
    pause
    goto :eof
)

if "%choice%"=="2" (
    echo.
    echo Generating test post...
    echo.
    node test-generate.js
    echo.
    pause
    goto :eof
)

if "%choice%"=="3" (
    echo.
    echo Generating full batch...
    echo.
    node generate-carousel.js
    echo.
    pause
    goto :eof
)

if "%choice%"=="4" (
    echo.
    echo Opening drafts folder...
    if exist "drafts" (
        explorer drafts
    ) else (
        echo No drafts folder found yet. Generate some posts first!
        pause
    )
    goto :eof
)

if "%choice%"=="5" (
    echo.
    echo Running full diagnostic...
    echo.
    call diagnose.bat
    goto :eof
)

if "%choice%"=="6" (
    exit
)

echo Invalid choice. Please run again and select 1-6.
pause