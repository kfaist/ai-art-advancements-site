@echo off
SET PATH=%PATH%;C:\Program Files\nodejs

cd /d C:\Users\Krista\Desktop\ai-art-advancements-site\tools\ig-generator

echo Converting text slides to images...
"C:\Program Files\nodejs\node.exe" create-text-slides.js

pause
