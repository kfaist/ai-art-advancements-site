# Push the environment variable fix to GitHub
Write-Host "📦 Pushing environment variable fix to GitHub..." -ForegroundColor Green

# Navigate to the project directory
Set-Location -Path "C:\Users\Krista\Desktop\ai-art-advancements-site"

# Show what changed
Write-Host "`n📝 Changes made:" -ForegroundColor Yellow
git diff .env

# Stage the changes
Write-Host "`n📤 Staging changes..." -ForegroundColor Cyan
git add .env START_HERE_NEXT_CHAT.md

# Commit the changes
Write-Host "💾 Committing..." -ForegroundColor Cyan
git commit -m "Fix: Correct Astro environment variable names (ASTRO_SITE and ASTRO_BASE)"

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "`n✅ Fix pushed successfully!" -ForegroundColor Green
Write-Host "⏰ Wait 3-5 minutes for GitHub Actions to rebuild" -ForegroundColor Yellow
Write-Host "🌐 Then check: https://kfaist.github.io/ai-art-advancements-site/" -ForegroundColor Cyan

# Show the Actions URL
Write-Host "`n📊 Monitor deployment at:" -ForegroundColor Magenta
Write-Host "https://github.com/kfaist/ai-art-advancements-site/actions" -ForegroundColor White
