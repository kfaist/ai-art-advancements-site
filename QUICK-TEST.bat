@echo off
SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo Testing OpenAI connection...
node test-generate.js
pause
