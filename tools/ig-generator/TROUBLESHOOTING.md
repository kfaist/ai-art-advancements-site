# 🔧 Instagram Generator - Troubleshooting Guide

## No drafts folder appearing?

Follow these steps in order:

### 1. Quick Test (Do This First!)
```bash
cd tools\ig-generator
node test-generate.js
```
This creates ONE test post to verify everything works.

### 2. Full Diagnostic
Double-click `diagnose.bat` - it will:
- Check your .env file
- Install dependencies
- Test your API connection
- Run the generator
- Show you what was created

### 3. Manual Testing

#### Test Your API Key:
```bash
node test-connection.js
```

#### Generate Carousels:
```bash
node generate-carousel.js
```

## Common Issues & Solutions

### ❌ "No API key found"
**Solution:** Make sure your `.env` file has:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### ❌ "401 Unauthorized"
**Solution:** Your API key is invalid. Get a new one from platform.openai.com

### ❌ "insufficient_quota"
**Solution:** No credits in your OpenAI account. Add billing at:
https://platform.openai.com/account/billing

### ❌ "Cannot find module 'openai'"
**Solution:** Run:
```bash
npm install openai dotenv
```

### ❌ Images not generating but text files appear
**Possible causes:**
- No DALL-E 3 access on your account
- Out of image generation credits
- Network issues downloading images

**Solution:** Check test-connection.js output for specific error

### ❌ "fetch is not defined"
**Solution:** You're using an older Node.js version. The generator has a fallback for this, but consider updating Node.js to v18+

## File Structure When Working

After successful generation, you should see:
```
tools\ig-generator\
├── drafts\
│   ├── 2025-10-08-0-aiArt\
│   │   ├── carousel\
│   │   │   ├── 01_cover.jpg          ← AI-generated image
│   │   │   ├── 02_the_context.txt
│   │   │   ├── 03_why_it_matters.txt
│   │   │   └── 04_learn_more.txt
│   │   ├── caption.txt
│   │   ├── image_prompt.txt
│   │   └── metadata.json
│   └── test-[timestamp]\              ← From test-generate.js
│       ├── test-image.jpg
│       ├── slide-1.txt
│       ├── slide-2.txt
│       └── caption.txt
```

## Quick Verification Steps

1. **Check API Key Format:**
   - Should start with `sk-`
   - Should be about 51 characters long
   - No spaces or quotes around it

2. **Check OpenAI Account:**
   - Visit: https://platform.openai.com/usage
   - Verify you have credits
   - Check DALL-E 3 is available

3. **Test Minimal Generation:**
   ```bash
   node test-generate.js
   ```
   This costs only $0.04 and creates one test image

## Still Not Working?

Run this command and share the output:
```bash
node test-connection.js > debug-output.txt 2>&1
```

The debug-output.txt file will contain detailed error information.

## Cost Breakdown

- Each DALL-E 3 image: ~$0.04
- Text generation: ~$0.001
- Full 4-post run: ~$0.16

## Working? Next Steps!

Once your drafts folder has content:

1. **Review generated images** in `drafts\[timestamp]\carousel\`
2. **Use the text files** as templates in Canva/Figma
3. **Copy captions** from `caption.txt`
4. **Upload to Instagram** via Buffer/Later/Creator Studio

---

**Quick Commands:**
- Test: `node test-generate.js` (1 post, $0.04)
- Full: `node generate-carousel.js` (4 posts, $0.16)
- Diagnose: `diagnose.bat` (full diagnostic)