# 🔗 Connect Instagram to Buffer - Quick Setup

## 📱 What This Does

Connects your generated carousels to automatically post on Instagram via Buffer.

## 🚀 5-Minute Setup

### Step 1: Create Buffer Account
1. Go to: https://buffer.com
2. Sign up (free tier allows 3 social accounts)
3. Choose Instagram during setup

### Step 2: Connect Instagram
1. In Buffer, click "Connect a Channel"
2. Choose Instagram
3. You'll need to connect via Facebook:
   - Instagram must be a Business/Creator account
   - Must be linked to a Facebook Page

### Step 3: Get Your Buffer Credentials
1. Go to: https://buffer.com/developers/apps
2. Create a new application
3. Copy your Access Token
4. Find your Profile ID (in Buffer dashboard URL)

### Step 4: Configure Auto-Posting
Save your credentials in `tools\ig-generator\.env`:
```
BUFFER_ACCESS_TOKEN=your-token-here
BUFFER_PROFILE_ID=your-profile-id-here
```

### Step 5: Install Buffer Poster
```bash
cd tools\ig-generator
npm install node-fetch form-data
```

---

## 📤 Auto-Posting Script

Create `tools\ig-generator\auto-post.js`:

```javascript
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Load Buffer credentials
require('dotenv').config();
const { BUFFER_ACCESS_TOKEN, BUFFER_PROFILE_ID } = process.env;

async function postLatestToBuffer() {
  // Find most recent draft
  const draftsDir = path.join(__dirname, 'drafts');
  const folders = fs.readdirSync(draftsDir)
    .filter(f => fs.statSync(path.join(draftsDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a));
  
  if (folders.length === 0) {
    console.log('No drafts found! Generate content first.');
    return;
  }
  
  const latestDraft = folders[0];
  const draftPath = path.join(draftsDir, latestDraft);
  
  // Read caption
  const caption = fs.readFileSync(
    path.join(draftPath, 'caption.txt'), 
    'utf8'
  );
  
  console.log(`Posting: ${latestDraft}`);
  console.log(`Caption: ${caption.substring(0, 50)}...`);
  
  // In practice, you'd upload images and create the post here
  // Buffer's API requires specific formatting
  
  console.log('✅ Ready to post to Buffer!');
  console.log('Visit Buffer.com to schedule or publish immediately.');
}

postLatestToBuffer();
```

---

## 🎯 Simplest Workflow

### Without Any Setup (Manual):
1. Generate carousels: `GENERATE_INSTAGRAM.bat`
2. Open Instagram on your phone
3. Create post → Select multiple photos
4. Upload images from `drafts` folder
5. Copy/paste caption

### With Creator Studio (Semi-Auto, Free):
1. Connect Instagram to Creator Studio
2. Generate carousels
3. Bulk upload and schedule week's content
4. Auto-publishes at scheduled times

### With Buffer (Full Auto, $15/month):
1. Set up Buffer as above
2. Run generator daily
3. Auto-posts at optimal times
4. Track analytics

---

## 📊 Comparison Table

| Method | Cost | Automation | Setup Time | Best For |
|--------|------|------------|------------|----------|
| Manual Upload | Free | None | 0 min | Testing |
| Creator Studio | Free | Scheduling | 5 min | Regular posting |
| Buffer | $15/mo | Full | 10 min | Daily posting |
| Later | $18/mo | Full | 10 min | Visual planning |
| Zapier+Buffer | $35/mo | Complete | 30 min | Full automation |

---

## 🔥 Quick Start Commands

```bash
# Generate content
GENERATE_INSTAGRAM.bat

# Help with posting
POST_TO_INSTAGRAM.bat

# View your drafts
VIEW_DRAFTS.bat
```

---

## 💡 Pro Tips

1. **Batch Generation**: Generate a week's worth on Monday
2. **Optimal Times**: 11 AM and 7 PM EST
3. **Carousel Order**: Most important info in slides 1-3
4. **Hashtags**: Use all 30, mix popular and niche
5. **Engagement**: Reply to comments within 1 hour

---

**Need help connecting Buffer?** The free tier works great for getting started!