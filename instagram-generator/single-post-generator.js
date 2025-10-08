import Parser from 'rss-parser';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const NEWS_SOURCES = [
  'https://huggingface.co/blog/feed.xml',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/'
];

const KEYWORDS = ['ai art', 'generative', 'dall-e', 'midjourney', 'stable diffusion', 'image generation', 'diffusion'];

async function fetchNews() {
  console.log('📰 Fetching AI art news...\n');
  const allArticles = [];
  
  for (const url of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      allArticles.push(...feed.items.slice(0, 10));
      console.log(`  ✅ ${new URL(url).hostname}`);
    } catch (error) {
      console.log(`  ⚠️  ${new URL(url).hostname}: ${error.message}`);
    }
  }
  
  const relevant = allArticles.filter(item => {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(kw => text.includes(kw));
  });
  
  relevant.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  if (relevant.length === 0) {
    throw new Error('No AI art news found');
  }
  
  const story = relevant[0];
  console.log(`\n🏆 Selected: "${story.title}"\n`);
  return story;
}

async function generateCaption(article) {
  console.log('✍️  Generating caption...');
  
  const prompt = `Write an Instagram caption for:

Title: ${article.title}
Summary: ${article.contentSnippet || 'See link'}
URL: ${article.link}

Format exactly like this:

[Compelling title - max 60 chars]

[One sentence hook that grabs attention]

THE CONTEXT:
[2-3 sentences - what happened, the facts]

WHY IT MATTERS:
[2-3 sentences - significance and impact]

THE CAPABILITIES:
• [Specific capability 1]
• [Specific capability 2]  
• [Specific capability 3]

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
  console.log('🎨 Generating image...');
  
  const prompt = `Create a striking abstract AI artwork for: "${article.title}". 
  Vibrant neon colors (cyan, magenta, purple, hot pink), futuristic tech aesthetic, 
  high visual drama perfect for Instagram. NO text or words.`;
  
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
  console.log('🚀 Instagram Single Post Generator\n');
  console.log('='.repeat(50) + '\n');
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }
    
    const article = await fetchNews();
    const caption = await generateCaption(article);
    const imageUrl = await generateImage(article);
    
    const output = {
      article: {
        title: article.title,
        link: article.link,
        pubDate: article.pubDate,
        snippet: article.contentSnippet
      },
      imageUrl,
      caption,
      generated: new Date().toISOString()
    };
    
    const outputDir = path.join(__dirname, 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    
    const filename = `post-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(
      path.join(outputDir, filename),
      JSON.stringify(output, null, 2)
    );
    
    console.log('='.repeat(50));
    console.log('\n✅ POST GENERATED!\n');
    console.log(`📄 Saved: ${filename}`);
    console.log(`🖼️  Image: ${imageUrl}`);
    console.log(`📰 Article: ${article.link}\n`);
    console.log('CAPTION:\n');
    console.log('='.repeat(50));
    console.log(caption);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

main();
