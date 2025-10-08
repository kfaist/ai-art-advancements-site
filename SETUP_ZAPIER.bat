@echo off
echo ========================================
echo  ZAPIER SETUP - GET YOUR WEBHOOK URL
echo ========================================
echo.
echo STEP 1: Go to Zapier
echo ----------------------------------------
echo Open: https://zapier.com/app/editor
echo Click: "Create Zap"
echo.
echo STEP 2: Set up Webhook Trigger
echo ----------------------------------------
echo 1. Search for: "Webhooks by Zapier"
echo 2. Choose: "Catch Hook"
echo 3. Click Continue
echo 4. COPY THE WEBHOOK URL (it looks like:)
echo    https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
echo.
echo STEP 3: Add to GitHub Secrets
echo ----------------------------------------
echo 1. Go to: https://github.com/kfaist/ai-art-advancements-site/settings/secrets/actions
echo 2. Click: "New repository secret"
echo 3. Name: ZAPIER_WEBHOOK_URL
echo 4. Secret: Paste the webhook URL from Zapier
echo 5. Click: "Add secret"
echo.
echo STEP 4: Also add OpenAI Key
echo ----------------------------------------
echo 1. Click: "New repository secret" again
echo 2. Name: OPENAI_API_KEY
echo 3. Secret: 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
echo 4. Click: "Add secret"
echo.
echo STEP 5: Run the Workflow!
echo ----------------------------------------
echo 1. Go to: https://github.com/kfaist/ai-art-advancements-site/actions
echo 2. Click: "Zapier -> Instagram Post" (left sidebar)
echo 3. Click: "Run workflow" button
echo 4. WATCH IT GO!!!
echo.
echo ========================================
echo  DONE! Your content will post to Instagram!
echo ========================================
echo.
pause
