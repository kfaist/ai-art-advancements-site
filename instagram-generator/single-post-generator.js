import Parser from 'rss-parser';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple, reliable sources
const NEWS_SOURCES = [
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://huggingface.co/blog/feed.xml'
];

const KEYWORDS = ['ai art', 'generative', 'dall-e', 'midjourney', 'stable diffusion', 'image generation'];

async function fetchNews() {
  console.log('📰 Fetching news...\n');
  
  const allArticles = [];
  
  for (const url of NEWS_SOURCES) {
    try {
      console.log(`Fetching ${url}...`);
      const feed = await parser.parseURL(url);
      allArticles.push(...feed.items.slice(0, 10));
      console.log(`✅ Got ${feed.items.length} items\n`);
    } catch (error) {
      console.log(`⚠️  Failed: ${error.message}\n`);
    }
  }
  
  // Filter for AI art content
  const relevant = allArticles.filter(item => {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(keyword => text.includes(keyword));
  });
  
  if (relevant.length === 0) {
    throw new Error('No AI art news found');
  }
  
  // Get most recent
  relevant.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  console.log(`Found ${relevant.length} relevant articles`);
  console.log(`Top story: ${relevant[0].title}\n`);
  
  return relevant[0];
}

async function generateCaption(article) {
  console.log('✍️  Generating caption...\n');
  
  const prompt = `Write an Instagram caption for this article:

Title: ${article.title}
Summary: ${article.contentSnippet || 'No summary'}
URL: ${article.link}

Format:
[Title]

[Hook sentence]

THE CONTEXT:
[What happened]

WHY IT MATTERS:
[Why it matters]

THE CAPABILITIES:
• [Point 1]
• [Point 2]

READ MORE: ${article.link}

#AIArt #GenerativeAI #MachineLearning #StableDiffusion #DigitalArt`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500
  });
  
  console.log('✅ Caption generated\n');
  return completion.choices[0].message.content.trim();
}

async function generateImage(article) {
  console.log('🎨 Generating image...\n');
  
  const prompt = `Vibrant abstract AI art inspired by: "${article.title}". Neon colors (cyan, magenta, purple, pink), futuristic, high impact. NO TEXT.`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "hd"
  });
  
  console.log('✅ Image generated\n');
  return response.data[0].url;
}

async function main() {
  console.log('🚀 Instagram Post Generator\n');
  console.log('='.repeat(50));
  console.log('\n');
  
  try {
    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }
    console.log('✅ OpenAI API key found\n');
    
    // 1. Fetch news
    const article = await fetchNews();
    
    // 2. Generate caption
    const caption = await generateCaption(article);
    
    // 3. Generate image
    const imageUrl = await generateImage(article);
    
    // 4. Save output
    const output = {
      article: {
        title: article.title,
        link: article.link,
        pubDate: article.pubDate
      },
      imageUrl,
      caption,
      generated: new Date().toISOString()
    };
    
    const outputDir = path.join(__dirname, 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    
    const filename = `post-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
    
    console.log('='.repeat(50));
    console.log('\n📱 POST PREVIEW:\n');
    console.log(caption);
    console.log('\n' + '='.repeat(50));
    console.log(`\n🖼️  Image: ${imageUrl}`);
    console.log(`💾 Saved: ${filename}\n`);
    console.log('✅ SUCCESS!\n');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
