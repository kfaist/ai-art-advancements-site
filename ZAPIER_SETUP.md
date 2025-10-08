# 🔥 ZAPIER + INSTAGRAM GENERATOR SETUP

## ✅ YOUR STATUS
- **Generator:** Working perfectly! ✅
- **OpenAI Issue:** Need to add credits (billing limit reached)
- **Zapier:** Ready to connect!

---

## 💳 FIRST: Fix OpenAI Credits (Required)

1. Go to: https://platform.openai.com/account/billing
2. Add $5-10 in credits
3. This gives you ~125-250 carousel images

**Why it failed:** "Billing hard limit has been reached"
**Quick fix:** Add credits, takes 2 minutes

---

## 🚀 ZAPIER AUTOMATION SETUP

### Option 1: Local Webhook (Testing)

1. **Install webhook dependencies:**
```bash
cd tools\ig-generator
npm install express cors
```

2. **Start webhook server:**
```bash
node zapier-webhook.js
```

3. **Expose to internet with ngrok:**
```bash
ngrok http 3456
```
You'll get a public URL like: `https://abc123.ngrok.io`

### Option 2: Zapier Direct Integration

Create this Zap:

#### Trigger: Schedule by Zapier
- **When:** Every day at 11 AM EST
- **Or:** RSS Feed (for news-triggered posts)

#### Action 1: Webhooks by Zapier
- **Event:** POST
- **URL:** Your webhook URL
- **Data:** 
  ```json
  {
    "theme": "aiArt",
    "count": 1,
    "trigger": "scheduled"
  }
  ```

#### Action 2: Delay by Zapier
- **Time:** 30 seconds (let generation complete)

#### Action 3: HTTP Request
- **Method:** GET
- **URL:** `your-webhook/latest-draft`
- **Gets the generated content**

#### Action 4: Google Drive
- **Event:** Upload File
- **File:** From webhook response
- **Folder:** Instagram Drafts

#### Action 5: Buffer (or your posting tool)
- **Event:** Create Post
- **Profile:** Your Instagram
- **Text:** From webhook caption
- **Media:** From Google Drive URL

---

## 📦 COMPLETE ZAPIER PACKAGE

### 1. Install Package
```bash
cd tools\ig-generator
npm install express cors ngrok
```

### 2. Run All-in-One Setup
Save as `zapier-setup.bat`:

```batch
@echo off
echo Setting up Zapier Integration...
cd tools\ig-generator
start cmd /k "node zapier-webhook.js"
timeout 3
start cmd /k "ngrok http 3456"
echo.
echo Webhook server started!
echo Get your public URL from the ngrok window
echo Use that URL in Zapier
pause
```

### 3. Test Your Webhook
```bash
curl -X POST http://localhost:3456/webhook/generate-instagram \
  -H "Content-Type: application/json" \
  -d '{"theme":"aiArt","count":1}'
```

---

## 🎯 SIMPLER ALTERNATIVE: Zapier Code Step

Instead of webhooks, use Zapier's Code step:

#### Zap Structure:
1. **Trigger:** Schedule
2. **Action:** Code by Zapier (JavaScript)
   ```javascript
   // This runs on Zapier's servers
   const response = await fetch('YOUR_ENDPOINT/generate', {
     method: 'POST',
     body: JSON.stringify({ theme: 'aiArt' })
   });
   return await response.json();
   ```
3. **Action:** Buffer/Later/Google Drive

---

## 🔄 ZAPIER WORKFLOWS YOU CAN BUILD

### Daily AI Art Post
- **Trigger:** Every day at 11 AM
- **Action:** Generate carousel
- **Action:** Post to Buffer

### News-Triggered Posts
- **Trigger:** New item in RSS feed
- **Action:** Generate themed carousel
- **Action:** Save to Google Drive
- **Action:** Notify via Slack

### Weekly Batch Generation
- **Trigger:** Every Monday at 9 AM
- **Action:** Generate 7 carousels
- **Action:** Save all to Drive
- **Action:** Create Buffer queue

---

## 📱 CONNECTING TO INSTAGRAM VIA ZAPIER

Since Instagram doesn't allow direct posting, use:

### Buffer (Recommended)
1. Connect Buffer to Zapier
2. Connect Instagram to Buffer
3. Zapier → Buffer → Instagram

### Google Drive + Manual
1. Zapier generates content
2. Saves to Google Drive
3. You post from Drive app

### Slack/Discord Notification
1. Zapier generates content
2. Sends notification with files
3. Quick manual post

---

## 🚦 QUICK START STEPS

1. **Fix OpenAI billing** (add $5 credits)
2. **Test generator works:**
   ```bash
   cd tools\ig-generator
   node test-generate.js
   ```

3. **Choose Zapier method:**
   - Local webhook (complex but powerful)
   - Zapier Code (simpler)
   - Just notifications (easiest)

4. **Create your first Zap:**
   - Schedule → Generate → Notify

---

## 💡 EASIEST PATH

**Without complex setup:**

1. **Zapier Scheduler** → Every day at 11 AM
2. **Email by Zapier** → Send you a reminder
3. **You run:** `GENERATE_INSTAGRAM.bat`
4. **Post manually** (takes 2 minutes)

This is simple and still saves tons of time!

---

**Want help setting up the Zapier webhook?** First add OpenAI credits, then we can test!