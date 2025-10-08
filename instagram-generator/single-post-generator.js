import Parser from 'rss-parser';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser({ timeout: 10000 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ===== REDDIT =====
const REDDIT_FEEDS = [
  'https://www.reddit.com/r/StableDiffusion/hot/.rss',
  'https://www.reddit.com/r/AIArt/hot/.rss',
  'https://www.reddit.com/r/MachineLearning/hot/.rss',
  'https://www.reddit.com/r/OpenAI/hot/.rss',
  'https://www.reddit.com/r/midjourney/hot/.rss'
];

// ===== TRADITIONAL NEWS =====
const NEWS_SOURCES = [
  'https://huggingface.co/blog/feed.xml',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/'
];

// ===== TWITTER (via Nitter) =====
const TWITTER_ACCOUNTS = [
  'https://nitter.poast.org/OpenAI/rss',
  'https://nitter.poast.org/StabilityAI/rss',
  'https://nitter.poast.org/midjourney/rss'
];

const KEYWORDS = [
  'ai art', 'generative', 'dall-e', 'midjourney', 'stable diffusion', 
  'image generation', 'diffusion', 'flux', 'comfyui', 'controlnet'
];

// ===== GITHUB NOVEL WORK DETECTION =====
async function fetchGitHubNovelWork() {
  console.log('⭐ Checking GitHub for breakthrough projects...');
  
  try {
    const query = 'ai art OR stable-diffusion OR midjourney created:>2024-09-01 stars:>100';
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Art-News-Bot'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.log(`  ⚠️  GitHub API: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      // Calculate star velocity for each repo
      const reposWithVelocity = data.items.map(repo => {
        const daysOld = Math.max(1, Math.floor((Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24)));
        const starsPerDay = Math.floor(repo.stargazers_count / daysOld);
        return { ...repo, daysOld, starsPerDay };
      });
      
      // Sort by star velocity (stars per day)
      reposWithVelocity.sort((a, b) => b.starsPerDay - a.starsPerDay);
      
      const hottest = reposWithVelocity[0];
      
      // Only consider it "novel" if gaining 50+ stars/day
      if (hottest.starsPerDay >= 50) {
        console.log(`  🔥 NOVEL WORK FOUND: ${hottest.full_name}`);
        console.log(`     ${hottest.stargazers_count}⭐ in ${hottest.daysOld} days = ${hottest.starsPerDay} stars/day!`);
        
        return {
          title: `🚀 Breakthrough: ${hottest.name}`,
          link: hottest.html_url,
          contentSnippet: `${hottest.description || 'New AI art tool'} | Gained ${hottest.stargazers_count} stars in just ${hottest.daysOld} days (${hottest.starsPerDay}/day) - community is going wild!`,
          pubDate: new Date(hottest.pushed_at).toISOString(),
          source: 'GitHub Novel Work',
          type: 'github_novel',
          stars: hottest.stargazers_count,
          starsPerDay: hottest.starsPerDay,
          daysOld: hottest.daysOld
        };
      }
    }
    
    console.log('  ℹ️  No breakthrough projects detected');
    return null;
  } catch (error) {
    console.log(`  ⚠️  GitHub check failed: ${error.message}`);
    return null;
  }
}

// ===== FETCH FROM EACH PLATFORM =====
async function fetchFromRSS(name, urls, sourceLabel) {
  console.log(`\n${name}:`);
  const articles = [];
  
  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 8).map(item => ({
        ...item,
        source: sourceLabel,
        sourceUrl: url
      }));
      articles.push(...items);
      
      const identifier = name.includes('REDDIT') 
        ? `r/${url.match(/r\/([^/]+)/)?.[1]}`
        : name.includes('TWITTER')
        ? `@${url.match(/\/([^/]+)\/rss/)?.[1]}`
        : new URL(url).hostname.replace('www.', '');
      
      console.log(`  ✅ ${identifier}: ${items.length} items`);
    } catch (error) {
      const identifier = name.includes('REDDIT')
        ? `r/${url.match(/r\/([^/]+)/)?.[1]}`
        : new URL(url).hostname;
      console.log(`  ⚠️  ${identifier}: ${error.message.substring(0, 50)}`);
    }
  }
  
  return articles;
}

// ===== MAIN AGGREGATION =====
async function fetchAllPlatforms() {
  console.log('🌐 MULTI-PLATFORM NEWS AGGREGATION');
  console.log('='.repeat(50));
  
  let allArticles = [];
  
  // 1. GitHub Novel Work (PRIORITY!)
  console.log('\n🐙 GITHUB:');
  const novelWork = await fetchGitHubNovelWork();
  if (novelWork) {
    allArticles.push(novelWork);
  }
  
  // 2. Reddit
  const redditArticles = await fetchFromRSS('📱 REDDIT', REDDIT_FEEDS, 'Reddit');
  allArticles.push(...redditArticles);
  
  // 3. Traditional News
  const newsArticles = await fetchFromRSS('📰 NEWS', NEWS_SOURCES, 'News');
  allArticles.push(...newsArticles);
  
  // 4. Twitter
  const twitterArticles = await fetchFromRSS('🐦 TWITTER', TWITTER_ACCOUNTS, 'Twitter');
  allArticles.push(...twitterArticles);
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total items: ${allArticles.length}`);
  
  // Filter for AI art relevance
  const relevant = allArticles.filter(item => {
    if (!item || !item.title) return false;
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(kw => text.includes(kw)) || item.type === 'github_novel';
  });
  
  console.log(`🎯 Relevant: ${relevant.length}`);
  
  if (relevant.length === 0) {
    throw new Error('No AI art content found across all platforms');
  }
  
  // Prioritize: GitHub novel work > Recent date
  relevant.sort((a, b) => {
    if (a.type === 'github_novel') return -1;
    if (b.type === 'github_novel') return 1;
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });
  
  const topStory = relevant[0];
  
  console.log('\n🏆 TOP STORY:');
  console.log(`   ${topStory.title}`);
  console.log(`   Source: ${topStory.source}`);
  if (topStory.type === 'github_novel') {
    console.log(`   🔥 ${topStory.starsPerDay} stars/day - BREAKTHROUGH!`);
  }
  console.log('');
  
  return topStory;
}

// ===== CAPTION GENERATION =====
async function generateCaption(article) {
  console.log('✍️  Generating caption...');
  
  let specialNote = '';
  if (article.type === 'github_novel') {
    specialNote = `\n\nIMPORTANT: This is a GitHub breakthrough - ${article.stars} stars in ${article.daysOld} days (${article.starsPerDay}/day). Emphasize the community excitement and rapid adoption!`;
  }
  
  const prompt = `Write an Instagram caption for:

Title: ${article.title}
Summary: ${article.contentSnippet || 'See link'}
Source: ${article.source}
URL: ${article.link}${specialNote}

Format EXACTLY like this:

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

📰 Source: ${article.source}${article.stars ? ` (${article.stars}⭐)` : ''}

#AIArt #GenerativeAI #MachineLearning #StableDiffusion #DigitalArt`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600
  });
  
  console.log('✅ Caption generated\n');
  return completion.choices[0].message.content.trim();
}

// ===== IMAGE GENERATION =====
async function generateImage(article) {
  console.log('🎨 Generating image...');
  
  const styleNote = article.type === 'github_novel' 
    ? 'Include subtle circuit board or code-inspired patterns.' 
    : '';
  
  const prompt = `Create a striking abstract AI artwork for: "${article.title}". 
  Vibrant neon colors (cyan, magenta, purple, hot pink), futuristic tech aesthetic, 
  high visual drama perfect for Instagram. ${styleNote} NO text or words.`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "hd"
  });
  
  console.log('✅ Image generated\n');
  return response.data[0].url;
}

// ===== MAIN =====
async function main() {
  console.log('🚀 Multi-Platform Instagram Post Generator\n');
  console.log('='.repeat(50) + '\n');
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }
    
    const article = await fetchAllPlatforms();
    const caption = await generateCaption(article);
    const imageUrl = await generateImage(article);
    
    const output = {
      article: {
        title: article.title,
        link: article.link,
        source: article.source,
        type: article.type,
        pubDate: article.pubDate,
        snippet: article.contentSnippet,
        metadata: {
          stars: article.stars,
          starsPerDay: article.starsPerDay,
          daysOld: article.daysOld
        }
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
    console.log(`📄 ${filename}`);
    console.log(`🖼️  ${imageUrl}`);
    console.log(`📰 ${article.link}\n`);
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
