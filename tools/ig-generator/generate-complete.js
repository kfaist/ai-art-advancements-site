/**
 * Complete Instagram Generator
 * Takes scraped news → AI visual + text overlay → Structured caption
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
require('dotenv').config();

const DRAFTS_DIR = path.join(__dirname, 'drafts');
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

const SD_API_URL = process.env.SD_API_URL || 'http://127.0.0.1:7860';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Read scraped news content
 */
function getScrapedNews() {
  const newsPath = path.join(__dirname, '../../content/daily-output.json');
  if (fs.existsSync(newsPath)) {
    const data = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    return data.news;
  }
  return null;
}

/**
 * Generate AI visual (Stable Diffusion or OpenAI)
 */
async function generateAIVisual(prompt, useSD = true) {
  if (useSD) {
    try {
      console.log('  🎨 Generating with Stable Diffusion...');
      const response = await axios.post(`${SD_API_URL}/sdapi/v1/txt2img`, {
        prompt: prompt,
        negative_prompt: 'text, words, letters, typography, blurry, low quality',
        steps: 30,
        cfg_scale: 7,
        width: 1080,
        height: 1080,
        sampler_name: 'DPM++ 2M Karras'
      }, { timeout: 120000 });
      
      if (response.data?.images?.[0]) {
        const buffer = Buffer.from(response.data.images[0], 'base64');
        console.log('  ✅ SD image generated!');
        return buffer;
      }
    } catch (error) {
      console.log('  ⚠️ Stable Diffusion failed, trying OpenAI...');
    }
  }
  
  // Fallback to OpenAI DALL-E
  if (OPENAI_API_KEY) {
    try {
      console.log('  🎨 Generating with DALL-E...');
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'hd'
      }, {
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
      });
      
      if (response.data?.data?.[0]?.url) {
        const imageResponse = await axios.get(response.data.data[0].url, {
          responseType: 'arraybuffer'
        });
        console.log('  ✅ DALL-E image generated!');
        return Buffer.from(imageResponse.data);
      }
    } catch (error) {
      console.log('  ❌ DALL-E failed:', error.message);
    }
  }
  
  return null;
}

/**
 * Add professional text overlay to image
 */
async function addTextOverlay(imageBuffer, headline) {
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext('2d');
  
  // Load and draw base image
  const baseImage = await loadImage(imageBuffer);
  ctx.drawImage(baseImage, 0, 0, 1080, 1080);
  
  // Add dark gradient overlay for text readability
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 400);
  
  // Draw headline text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 20;
  
  // Word wrap for headline
  const words = headline.toUpperCase().split(' ');
  let lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > 900 && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  
  // Draw lines centered
  const startY = 150;
  const lineHeight = 85;
  lines.forEach((line, i) => {
    ctx.fillText(line, 540, startY + (i * lineHeight));
  });
  
  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

/**
 * Create structured Instagram caption
 */
function createStructuredCaption(news, analysis) {
  const caption = `${analysis.hook}

${analysis.summary}

${analysis.context}

WHY IT MATTERS:
${analysis.whyItMatters}

${analysis.features ? `THE FEATURES:\n${analysis.features}\n\n` : ''}READ MORE:
${news.link}

${analysis.hashtags}`;

  return caption;
}

/**
 * Use GPT to analyze news and create structured content
 */
async function analyzeNews(news) {
  try {
    console.log('  🤖 Analyzing news with GPT...');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Analyze this AI news and create Instagram post content:

Title: ${news.title}
Summary: ${news.summary || news.contentSnippet || ''}

Create:
1. headline: Short punchy headline (3-6 words, all caps style)
2. hook: Attention-grabbing first sentence
3. summary: One-line summary with emoji
4. context: 2-sentence explanation of what this is
5. whyItMatters: 2 sentences on impact/significance
6. features: Key bullet points or stats (optional, only if applicable)
7. hashtags: 5-7 relevant hashtags
8. visualPrompt: Description for AI art (NO TEXT in image, just visual metaphor)

Format as JSON.`
      }],
      max_tokens: 500
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });
    
    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.log('  ❌ GPT analysis failed:', error.message);
    // Fallback structure
    return {
      headline: news.title.substring(0, 50).toUpperCase(),
      hook: news.title,
      summary: news.summary || '',
      context: news.summary || '',
      whyItMatters: 'This development signals important changes in the AI landscape.',
      hashtags: '#AI #ArtificialIntelligence #Tech #Innovation #AIArt',
      visualPrompt: `Futuristic digital art representing ${news.title}, vibrant neon colors, cyberpunk style`
    };
  }
}

/**
 * Main generation function
 */
async function generatePost() {
  console.log('\n🎨 Complete Instagram Post Generator');
  console.log('=====================================\n');
  
  // 1. Get scraped news
  console.log('📰 Loading scraped news...');
  const news = getScrapedNews();
  if (!news) {
    console.log('❌ No news found in daily-output.json');
    console.log('   Run the news scraper first!');
    return;
  }
  console.log(`✅ Found: ${news.title}\n`);
  
  // 2. Analyze with GPT
  const analysis = await analyzeNews(news);
  console.log(`✅ Analysis complete\n`);
  
  // 3. Generate AI visual
  console.log('🎨 Generating AI visual...');
  const visualPrompt = `${analysis.visualPrompt}, NO TEXT, NO LETTERS, NO WORDS, vibrant colors, professional digital art, instagram quality`;
  const baseImage = await generateAIVisual(visualPrompt, true);
  
  if (!baseImage) {
    console.log('❌ Image generation failed');
    return;
  }
  
  // 4. Add text overlay
  console.log('✏️ Adding text overlay...');
  const finalImage = await addTextOverlay(baseImage, analysis.headline);
  
  // 5. Save everything
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const folder = path.join(DRAFTS_DIR, `post-${timestamp}`);
  fs.mkdirSync(folder, { recursive: true });
  
  fs.writeFileSync(path.join(folder, 'image.jpg'), finalImage);
  console.log(`✅ Image saved: ${folder}/image.jpg`);
  
  const caption = createStructuredCaption(news, analysis);
  fs.writeFileSync(path.join(folder, 'caption.txt'), caption, 'utf8');
  console.log(`✅ Caption saved: ${folder}/caption.txt`);
  
  const metadata = {
    timestamp: new Date().toISOString(),
    newsTitle: news.title,
    sourceLink: news.link,
    headline: analysis.headline,
    folder: folder
  };
  fs.writeFileSync(path.join(folder, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');
  
  console.log('\n✅ POST COMPLETE!');
  console.log('=====================================');
  console.log(`📁 Folder: ${folder}`);
  console.log(`📸 Image: image.jpg (with headline overlay)`);
  console.log(`📝 Caption: caption.txt (structured with source link)`);
  console.log('\n📱 Ready to post to Instagram!\n');
}

// Run
if (require.main === module) {
  generatePost().catch(console.error);
}

module.exports = { generatePost };
