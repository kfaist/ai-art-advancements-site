/**
 * WORKING Instagram Generator - No Canvas Required
 * Generates: AI visual + structured caption with source
 * Add text in Canva or use ChatGPT to add it
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const DRAFTS_DIR = path.join(__dirname, 'drafts');
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

const SD_API_URL = process.env.SD_API_URL || 'http://127.0.0.1:7860';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function getScrapedNews() {
  const newsPath = path.join(__dirname, '../../content/daily-output.json');
  if (fs.existsSync(newsPath)) {
    return JSON.parse(fs.readFileSync(newsPath, 'utf8')).news;
  }
  return null;
}

async function generateWithOpenAI(prompt) {
  if (!OPENAI_API_KEY) return null;
  
  try {
    console.log('  🎨 Generating with DALL-E...');
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
      quality: 'hd'
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      timeout: 60000
    });
    
    if (response.data?.data?.[0]?.url) {
      const imageResponse = await axios.get(response.data.data[0].url, {
        responseType: 'arraybuffer'
      });
      console.log('  ✅ Image generated!');
      return Buffer.from(imageResponse.data);
    }
  } catch (error) {
    console.log('  ❌ Error:', error.message);
  }
  return null;
}

async function analyzeNews(news) {
  if (!OPENAI_API_KEY) {
    return {
      headline: news.title.substring(0, 50).toUpperCase(),
      hook: news.title,
      summary: news.summary || '',
      context: news.summary || '',
      whyItMatters: 'This represents a significant development in AI.',
      hashtags: '#AI #Tech #Innovation',
      visualPrompt: `vibrant futuristic digital art about ${news.title}, neon colors`
    };
  }

  try {
    console.log('  🤖 Analyzing with GPT...');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Create Instagram post content from this news:

Title: ${news.title}
Summary: ${news.summary || ''}

Return JSON with:
{
  "headline": "SHORT PUNCHY HEADLINE (3-6 words)",
  "hook": "Attention-grabbing first sentence",
  "summary": "One sentence with emoji",
  "context": "2 sentences explaining what this is",
  "whyItMatters": "2 sentences on impact",
  "features": "Key points if applicable",
  "hashtags": "5-7 hashtags",
  "visualPrompt": "Vibrant digital art visual (NO TEXT)"
}`
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
  } catch (error) {
    console.log('  ⚠️ Analysis failed:', error.message);
  }
  
  return {
    headline: news.title.substring(0, 50).toUpperCase(),
    hook: news.title,
    summary: news.summary || '',
    context: news.summary || '',
    whyItMatters: 'This represents a significant development.',
    hashtags: '#AI #Tech',
    visualPrompt: `digital art about ${news.title}`
  };
}

function createCaption(news, analysis) {
  return `${analysis.hook}

${analysis.summary}

${analysis.context}

WHY IT MATTERS:
${analysis.whyItMatters}

${analysis.features ? `THE FEATURES:\n${analysis.features}\n\n` : ''}READ MORE:
${news.link}

${analysis.hashtags}`;
}

async function generatePost() {
  console.log('\n🎨 Instagram Post Generator (No Canvas)');
  console.log('========================================\n');
  
  const news = getScrapedNews();
  if (!news) {
    console.log('❌ No news in daily-output.json');
    return;
  }
  console.log(`✅ News: ${news.title}\n`);
  
  const analysis = await analyzeNews(news);
  console.log('✅ Analysis complete\n');
  
  console.log('🎨 Generating visual...');
  const prompt = `${analysis.visualPrompt}, vibrant neon colors, professional digital art, instagram quality, NO TEXT, NO LETTERS, pure visual`;
  const image = await generateWithOpenAI(prompt);
  
  if (!image) {
    console.log('❌ Image generation failed');
    return;
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const folder = path.join(DRAFTS_DIR, `post-${timestamp}`);
  fs.mkdirSync(folder, { recursive: true });
  
  fs.writeFileSync(path.join(folder, 'image.jpg'), image);
  console.log(`✅ Image: ${folder}/image.jpg`);
  
  const caption = createCaption(news, analysis);
  fs.writeFileSync(path.join(folder, 'caption.txt'), caption, 'utf8');
  console.log(`✅ Caption: ${folder}/caption.txt`);
  
  // Save headline for adding text later
  fs.writeFileSync(path.join(folder, 'headline.txt'), analysis.headline, 'utf8');
  console.log(`✅ Headline: ${folder}/headline.txt`);
  
  const metadata = {
    timestamp: new Date().toISOString(),
    newsTitle: news.title,
    sourceLink: news.link,
    headline: analysis.headline
  };
  fs.writeFileSync(path.join(folder, 'metadata.json'), JSON.stringify(metadata, null, 2));
  
  console.log('\n✅ POST READY!');
  console.log('================');
  console.log(`📁 ${folder}`);
  console.log('📸 image.jpg - AI visual (add headline text in Canva)');
  console.log('📝 caption.txt - Full structured caption with source');
  console.log('✏️ headline.txt - Text to add to image\n');
  console.log('💡 NEXT STEP: Add headline text to image in Canva!');
}

if (require.main === module) {
  generatePost().catch(console.error);
}

module.exports = { generatePost };
