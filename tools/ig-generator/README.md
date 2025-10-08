# 📸 Instagram Carousel Generator

Generate beautiful Instagram carousel posts with AI-powered images and captions!

## ✨ Features

- **DALL-E 3 Integration**: Creates stunning AI-generated cover images
- **4-Slide Carousels**: Cover + 3 informative slides
- **Two Themes**: AI Art (neon/cyberpunk) and Nonprofit Tech (warm/hopeful)
- **Auto-Generated Captions**: Complete with relevant hashtags
- **Organized Output**: Each post in its own timestamped folder

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Your Setup
```bash
node test-connection.js
```

### 3. Generate Carousels
```bash
node generate-carousel.js
```
Or just double-click `run.bat`

## 📁 Output Structure

Each post creates a folder in `drafts/` with:
```
drafts/
└── 2025-10-08-aiArt/
    ├── carousel/
    │   ├── 01_cover.jpg      # AI-generated cover image
    │   ├── 02_slide.txt      # Context slide
    │   ├── 03_slide.txt      # Impact slide
    │   └── 04_slide.txt      # Call-to-action slide
    ├── caption.txt           # Instagram caption with hashtags
    ├── image_prompt.txt      # DALL-E prompt used
    └── metadata.json         # Post metadata
```

## 🎨 Customization

Edit `generate-carousel.js` to:
- Add new content ideas to `CONTENT_IDEAS`
- Modify color schemes in `THEMES`
- Change hashtags for each theme
- Adjust image generation prompts

## 💡 Content Ideas

The generator includes sample content for:
- AI art breakthroughs
- Nonprofit technology impacts
- Creative AI applications
- Accessibility innovations

## 🔧 Troubleshooting

### No images generating?
- Check your OpenAI API key in `.env`
- Verify you have DALL-E 3 access
- Check API credits at platform.openai.com

### Text files instead of images?
- This is the fallback when Canvas isn't installed
- Install Canvas: `npm install canvas`
- Or use the text as guides for manual design

## 📱 Posting to Instagram

1. **Review**: Check generated content in `drafts/`
2. **Edit**: Adjust captions or regenerate if needed
3. **Upload**: Use Buffer, Later, or Creator Studio
4. **Schedule**: Post during peak engagement times

## 🤝 Integration with Main Site

This generator works with the main AI Art Advancements site:
- Content can be triggered via GitHub Actions
- Zapier webhooks can automate posting
- Generated content matches site themes

## 📊 Best Practices

- Post carousels 2-3 times per week
- Alternate between AI Art and Nonprofit themes
- Engage with comments within first hour
- Use all 10 carousel slots for maximum reach
- Include strong CTAs on final slides

## 🛠️ Advanced Usage

### Batch Generation
```javascript
// In generate-carousel.js, modify CONTENT_IDEAS array
// to include more posts, then run
```

### Custom Themes
```javascript
// Add to THEMES object:
THEMES.education = {
  colors: ['blue', 'green', 'purple'],
  style: 'academic, clean, professional',
  hashtags: '#EdTech #AIEducation #Learning'
};
```

## 📈 Performance Tips

- DALL-E 3 costs ~$0.04 per image
- Generate in batches to save time
- Reuse successful prompts
- Track engagement to optimize content

---

**Need help?** Check the main project README or open an issue!