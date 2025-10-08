@echo off
echo ============================================
echo    Test OpenAI API Connection
echo ============================================
echo.

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo Testing your OpenAI API key and DALL-E access...
echo.

node test-connection.js

echo.
echo ============================================
echo Connection test complete!
echo.
echo If all tests passed, you can run:
echo - TEST_INSTAGRAM.bat (1 test post)
echo - GENERATE_INSTAGRAM.bat (4 full posts)
echo ============================================
echo.
pause