// AI Art Advancements - Complete Content Generator
// Fetches news, generates images, creates Instagram carousels
// Runs automatically via GitHub Actions

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Parser = require('rss-parser');
const { createCanvas } = require('canvas');
require('dotenv').config();

// Configuration
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const INSTAGRAM_DIR = path.join(__dirname, '..', 'instagram-posts');

// Ensure directories exist
[OUTPUT_DIR, INSTAGRAM_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Account configurations with day-glo aesthetics
const ACCOUNTS = {
  art: {
    name: "ai.advancements.art",
    colorPalette: ["magenta and cyan", "electric blue and hot pink", "ultraviolet purple and neon lime"],
    bgColors: {
      primary: "#0F0326",
      secondary: "#650D89"
    },
    textColors: {
      primary: "#FF36AB",
      secondary: "#00FFFF"
    },
    hashtags: "#AIArt #GenerativeAI #3DArt #DigitalArt #TechArt"
  },
  nonprofit: {
    name: "nonprofit_ai",
    colorPalette: ["toxic green and radioactive orange", "laser lime and volcanic orange", "neon green and amber"],
    bgColors: {
      primary: "#0A2615",
      secondary: "#663300"
    },
    textColors: {
      primary: "#39FF14",
      secondary: "#FF7700"
    },
    hashtags: "#AIForGood #OpenSource #TechForGood #SocialImpact #Innovation"
  }
};

// RSS Feeds to scan
const NEWS_SOURCES = [
  { url: 'https://huggingface.co/blog/feed.xml', name: 'Hugging Face' },
  { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI' },
  { url: 'https://www.reddit.com/r/MachineLearning/hot.rss', name: 'Reddit ML' },
  { url: 'https://www.reddit.com/r/StableDiffusion/hot.rss', name: 'Reddit SD' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI' }
];

// Visual variety system
const VISUAL_VARIETY = {
  subjects: {
    "3d": ["3D holographic glowing orbs emerging from a digital canvas", "floating crystalline geometric shapes"],
    "brain": ["bioluminescent neural network with hexagonal patterns", "geometric brain structure"],
    "solar": ["solar flare erupting with flowing data streams", "cosmic energy shield protecting satellites"],
    "research": ["glowing research papers transforming into interactive holograms", "data visualizations"],
    "projection": ["360-degree immersive projection dome", "real-time 3D mapping on architectural surfaces"]
  },
  compositions: ["circular orbital patterns", "asymmetrical diagonal energy flow", "grid matrix arrangement"],
  lighting: ["volumetric rays with particle effects", "rim lighting with chromatic aberration"],
  effects: ["digital data corruption aesthetic", "quantum glitch distortion fields", "holographic interference"]
};

// Fetch news from RSS feeds
async function fetchNews() {
  const parser = new Parser();
  const allItems = [];

  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        description: item.contentSnippet || item.content || '',
        url: item.link,
        source: source.name,
        pubDate: new Date(item.pubDate || Date.now())
      }));
      allItems.push(...items);
    } catch (error) {
      console.log(`Failed to fetch ${source.name}: ${error.message}`);
    }
  }

  return allItems.sort((a, b) => b.pubDate - a.pubDate);
}

// Score content for relevance
function scoreContent(item) {
  let score = 0;
  const keywords = {
    high: ['stable diffusion', 'dall-e', 'midjourney', 'hugging face', 'open source', 'nonprofit', 'social impact', '3d', 'touchdesigner'],
    medium: ['ai art', 'generative', 'neural', 'model', 'research', 'paper', 'breakthrough'],
    low: ['update', 'release', 'new', 'launch', 'available']
  };

  const text = `${item.title} ${item.description}`.toLowerCase();
  
  keywords.high.forEach(kw => { if (text.includes(kw)) score += 10; });
  keywords.medium.forEach(kw => { if (text.includes(kw)) score += 5; });
  keywords.low.forEach(kw => { if (text.includes(kw)) score += 2; });
  
  // Recency bonus
  const hoursSincePost = (Date.now() - item.pubDate) / (1000 * 60 * 60);
  if (hoursSincePost < 24) score += 10;
  else if (hoursSincePost < 72) score += 5;

  item.score = score;
  item.account = text.includes('nonprofit') || text.includes('social') || text.includes('open source') ? 'nonprofit' : 'art';
  
  return item;
}

// Generate DALL-E prompt with visual variety
function generatePrompt(item) {
  const account = ACCOUNTS[item.account];
  const colors = account.colorPalette[Math.floor(Math.random() * account.colorPalette.length)];
  
  // Determine subject based on content
  let subject = "digital abstract art";
  if (item.title.toLowerCase().includes('3d')) subject = VISUAL_VARIETY.subjects["3d"][0];
  else if (item.title.toLowerCase().includes('brain') || item.title.toLowerCase().includes('neural')) subject = VISUAL_VARIETY.subjects["brain"][0];
  else if (item.title.toLowerCase().includes('solar') || item.title.toLowerCase().includes('space')) subject = VISUAL_VARIETY.subjects["solar"][0];
  else if (item.title.toLowerCase().includes('research') || item.title.toLowerCase().includes('paper')) subject = VISUAL_VARIETY.subjects["research"][0];
  else if (item.title.toLowerCase().includes('projection') || item.title.toLowerCase().includes('touchdesigner')) subject = VISUAL_VARIETY.subjects["projection"][0];
  
  const composition = VISUAL_VARIETY.compositions[Math.floor(Math.random() * VISUAL_VARIETY.compositions.length)];
  const lighting = VISUAL_VARIETY.lighting[Math.floor(Math.random() * VISUAL_VARIETY.lighting.length)];
  const effect = VISUAL_VARIETY.effects[Math.floor(Math.random() * VISUAL_VARIETY.effects.length)];
  
  return `A surreal, dramatic, glowy, photorealistic scene featuring ${subject}, with ${composition} composition, bathed in ${colors} light, ${lighting}, ${effect}, maximum vibrancy, oversaturated to the max, cinematic volumetric lighting, 8K hyper-detail, ethereal glow, day-glo neon aesthetic, ultra-vibrant colors, surreal yet hyperrealistic`;
}

// Generate image with DALL-E
async function generateImage(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data[0].url;
  } catch (error) {
    console.error('DALL-E error:', error);
    return null;
  }
}

// Create text slide for carousel
function createTextSlide(text, account, slideType) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, account.bgColors.primary);
  gradient.addColorStop(1, account.bgColors.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add glow effects
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 150 + 50;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, i % 2 === 0 ? account.textColors.primary : account.textColors.secondary);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  
  // Text
  const parts = text.split(':');
  const title = parts[0];
  const content = parts[1] || '';
  
  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = account.textColors.primary;
  ctx.font = 'bold 60px Arial';
  ctx.shadowColor = account.textColors.primary;
  ctx.shadowBlur = 20;
  ctx.fillText(title, width / 2, height / 3);
  
  // Content
  if (content) {
    ctx.fillStyle = account.textColors.secondary;
    ctx.font = 'bold 35px Arial';
    ctx.shadowColor = account.textColors.secondary;
    ctx.shadowBlur = 10;
    
    const words = content.trim().split(' ');
    let line = '';
    let y = height / 2;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > width * 0.8 && line !== '') {
        ctx.fillText(line, width / 2, y);
        line = word + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);
  }
  
  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// Save image from URL
async function saveImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

// Create Instagram carousel post
async function createCarousel(item) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const postDir = path.join(INSTAGRAM_DIR, `${item.account}_${timestamp}`);
  fs.mkdirSync(postDir, { recursive: true });
  
  const account = ACCOUNTS[item.account];
  const carousel = [];
  
  // 1. Generate main image
  const prompt = generatePrompt(item);
  const imageUrl = await generateImage(prompt);
  if (imageUrl) {
    await saveImage(imageUrl, path.join(postDir, '01_main.jpg'));
    carousel.push('01_main.jpg');
  }
  
  // 2. Create text slides
  const slides = [
    { text: `THE CONTEXT: ${item.title}`, type: 'context' },
    { text: `WHY IT MATTERS: ${item.description.substring(0, 150)}...`, type: 'impact' },
    { text: `READ MORE: ${item.url}`, type: 'link' }
  ];
  
  for (let i = 0; i < slides.length; i++) {
    const slideBuffer = createTextSlide(slides[i].text, account, slides[i].type);
    const filename = `0${i + 2}_${slides[i].type}.jpg`;
    fs.writeFileSync(path.join(postDir, filename), slideBuffer);
    carousel.push(filename);
  }
  
  // Create caption
  const caption = `${item.title}\n\n${account.hashtags}`;
  fs.writeFileSync(path.join(postDir, 'caption.txt'), caption);
  
  // Create metadata
  const metadata = {
    account: item.account,
    title: item.title,
    url: item.url,
    created: new Date().toISOString(),
    carousel: carousel,
    caption: caption,
    prompt: prompt
  };
  
  fs.writeFileSync(path.join(postDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  
  return metadata;
}

// Main execution
async function main() {
  console.log('🎨 AI Art Advancements Content Generator\n');
  
  if (!OPENAI_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  console.log('📡 Fetching latest AI news...');
  const newsItems = await fetchNews();
  console.log(`Found ${newsItems.length} items\n`);
  
  console.log('📊 Scoring content...');
  const scored = newsItems.map(scoreContent).sort((a, b) => b.score - a.score);
  
  console.log('🎯 Top stories:');
  const topStories = scored.slice(0, 6);
  topStories.forEach((item, i) => {
    console.log(`${i + 1}. [${item.account}] ${item.title} (score: ${item.score})`);
  });
  
  console.log('\n🖼️ Generating Instagram carousels...');
  const results = [];
  
  for (const item of topStories) {
    console.log(`\nCreating carousel for: ${item.title}`);
    try {
      const result = await createCarousel(item);
      results.push(result);
      console.log(`✅ Created carousel in ${result.account}_*`);
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`);
    }
  }
  
  // Save summary
  const summary = {
    generated: new Date().toISOString(),
    posts: results.length,
    accounts: {
      art: results.filter(r => r.account === 'art').length,
      nonprofit: results.filter(r => r.account === 'nonprofit').length
    },
    items: results
  };
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'latest-generation.json'), JSON.stringify(summary, null, 2));
  
  console.log('\n✨ Generation complete!');
  console.log(`📁 Posts saved to: ${INSTAGRAM_DIR}`);
  console.log(`📊 Summary saved to: ${OUTPUT_DIR}/latest-generation.json`);
  
  return summary;
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, fetchNews, scoreContent, generatePrompt };
