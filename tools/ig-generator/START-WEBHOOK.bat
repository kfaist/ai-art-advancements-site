@echo off
SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo Installing webhook dependencies...
call npm install --no-save express cors

echo.
echo Starting webhook server...
node zapier-webhook.js
