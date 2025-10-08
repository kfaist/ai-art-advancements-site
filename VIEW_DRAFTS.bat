@echo off
echo ============================================
echo    Open Instagram Drafts Folder
echo ============================================
echo.

set DRAFTS_PATH=C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator\drafts

if exist "%DRAFTS_PATH%" (
    echo Opening drafts folder...
    explorer "%DRAFTS_PATH%"
    echo.
    dir "%DRAFTS_PATH%" /b
    echo.
    echo Drafts folder opened in Windows Explorer!
) else (
    echo No drafts folder found yet!
    echo.
    echo Run one of these first:
    echo - TEST_INSTAGRAM.bat (to create 1 test post)
    echo - GENERATE_INSTAGRAM.bat (to create 4 posts)
    echo.
)

pause