@echo off
echo.
echo === Pushing Environment Variable Fix to GitHub ===
echo.

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site

echo Staging changes...
git add .env START_HERE_NEXT_CHAT.md

echo.
echo Committing fix...
git commit -m "Fix: Correct Astro environment variable names (ASTRO_SITE and ASTRO_BASE)"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ===============================================
echo Fix pushed successfully!
echo.
echo Next steps:
echo 1. Wait 3-5 minutes for GitHub Actions to deploy
echo 2. Check: https://kfaist.github.io/ai-art-advancements-site/
echo 3. Monitor: https://github.com/kfaist/ai-art-advancements-site/actions
echo ===============================================
echo.
pause
