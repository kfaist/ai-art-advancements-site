@echo off
echo ========================================
echo  PUSHING ZAPIER WORKFLOW TO GITHUB
echo ========================================
echo.

echo Adding workflow file...
git add .github\workflows\zapier-instagram.yml

echo Committing...
git commit -m "Add Zapier Instagram workflow - LETS POST NOW"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  PUSHED! Now go to GitHub:
echo ========================================
echo.
echo 1. Add secrets at:
echo    https://github.com/kfaist/ai-art-advancements-site/settings/secrets/actions
echo.
echo 2. Add these secrets:
echo    - OPENAI_API_KEY (copy from .env file)
echo    - ZAPIER_WEBHOOK_URL (get from Zapier in next step)
echo.
echo 3. Then run: SETUP_ZAPIER.bat
echo.
pause
