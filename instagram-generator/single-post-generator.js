import Parser from 'rss-parser';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ===== REDDIT SOURCES =====
const REDDIT_FEEDS = [
  'https://www.reddit.com/r/StableDiffusion/hot/.rss',
  'https://www.reddit.com/r/StableDiffusion/new/.rss',
  'https://www.reddit.com/r/AIArt/hot/.rss',
  'https://www.reddit.com/r/ArtificialIntelligence/hot/.rss',
  'https://www.reddit.com/r/MachineLearning/hot/.rss',
  'https://www.reddit.com/r/OpenAI/hot/.rss',
  'https://www.reddit.com/r/midjourney/hot/.rss',
  'https://www.reddit.com/r/dalle2/hot/.rss'
];

// ===== TRADITIONAL NEWS SOURCES =====
const NEWS_SOURCES = [
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://huggingface.co/blog/feed.xml',
  'https://stability.ai/news/feed',
  'https://siggraph.org/feed/',
  'https://openai.com/blog/rss.xml'
];

// ===== TWITTER/X VIA NITTER (Twitter killed RSS) =====
const TWITTER_ACCOUNTS = [
  'https://nitter.net/OpenAI/rss',
  'https://nitter.net/StabilityAI/rss',
  'https://nitter.net/midjourney/rss',
  'https://nitter.net/poolsuite/rss',  // AI art enthusiast
  'https://nitter.net/emollick/rss'     // AI researcher who covers creative AI
];

const KEYWORDS = [
  'ai art', 'generative', 'dall-e', 'midjourney', 'stable diffusion', 
  'image generation', 'ai image', 'creative ai', 'text-to-image',
  'flux', 'comfyui', 'automatic1111', 'controlnet', 'lora'
];

// ===== GITHUB TRENDING & STAR GROWTH DETECTION =====
async function fetchGitHubTrending() {
  console.log('🐙 Checking GitHub for trending AI art repos...');
  
  try {
    // GitHub doesn't have official trending RSS, but we can scrape or use unofficial API
    const trendingUrl = 'https://github-trending-api.now.sh/repositories?language=python&since=daily';
    
    const response = await fetch(trendingUrl);
    const repos = await response.json();
    
    // Filter for AI art related repos
    const aiArtRepos = repos.filter(repo => {
      const text = (repo.name + ' ' + repo.description).toLowerCase();
      return KEYWORDS.some(keyword => text.includes(keyword));
    });
    
    if (aiArtRepos.length > 0) {
      const topRepo = aiArtRepos[0];
      console.log(`  ✅ Found trending: ${topRepo.name}`);
      console.log(`     Stars: ${topRepo.stars} | ${topRepo.description.substring(0, 80)}...`);
      
      return {
        title: `🔥 GitHub: ${topRepo.name} is trending`,
        link: topRepo.url,
        contentSnippet: topRepo.description,
        pubDate: new Date().toISOString(),
        source: 'GitHub Trending',
        stars: topRepo.stars,
        type: 'github'
      };
    }
  } catch (error) {
    console.log(`  ⚠️  GitHub trending fetch failed: ${error.message}`);
  }
  
  return null;
}

async function detectSuddenStarGrowth() {
  console.log('⭐ Detecting repos with SUDDEN star growth...');
  
  try {
    // Check recently created repos with rapid star growth
    const query = 'ai art OR stable diffusion OR midjourney created:>2024-10-01 stars:>100';
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Art-News-Bot'
      }
    });
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const novelRepo = data.items[0];
      const daysOld = Math.floor((Date.now() - new Date(novelRepo.created_at)) / (1000 * 60 * 60 * 24));
      const starsPerDay = Math.floor(novelRepo.stargazers_count / daysOld);
      
      console.log(`  ✅ Found novel work: ${novelRepo.full_name}`);
      console.log(`     ${novelRepo.stargazers_count} stars in ${daysOld} days (${starsPerDay}/day!)`);
      
      return {
        title: `🚀 Breakout GitHub Project: ${novelRepo.name}`,
        link: novelRepo.html_url,
        contentSnippet: `${novelRepo.description} | Gained ${novelRepo.stargazers_count} stars in just ${daysOld} days!`,
        pubDate: new Date().toISOString(),
        source: 'GitHub Novel Work',
        stars: novelRepo.stargazers_count,
        starsPerDay: starsPerDay,
        type: 'github_novel'
      };
    }
  } catch (error) {
    console.log(`  ⚠️  GitHub star growth detection failed: ${error.message}`);
  }
  
  return null;
}

// ===== DISCORD (Limited - Public Webhooks Only) =====
async function fetchDiscordUpdates() {
  console.log('💬 Checking Discord public channels...');
  
  // Note: Discord RSS is limited to public announcement channels
  // You'd need webhook URLs or RSS bridge services
  // For now, this is a placeholder - user would need to add specific webhook URLs
  
  const DISCORD_RSS_BRIDGES = [
    // Example: 'https://rsshub.app/discord/webhook/YOUR_WEBHOOK_ID'
    // Users can add their own Discord RSS bridges here
  ];
  
  const articles = [];
  for (const url of DISCORD_RSS_BRIDGES) {
    try {
      const feed = await parser.parseURL(url);
      articles.push(...feed.items);
    } catch (error) {
      // Silent fail - most users won't have Discord RSS set up
    }
  }
  
  return articles;
}

// ===== MAIN NEWS AGGREGATION =====
async function fetchAllNews() {
  console.log('📰 MULTI-PLATFORM NEWS AGGREGATION\n');
  console.log('='.repeat(50));
  
  const allArticles = [];
  
  // 1. Reddit
  console.log('\n📱 REDDIT SOURCES:');
  for (const url of REDDIT_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 10).map(item => ({
        ...item,
        source: 'Reddit',
        subreddit: url.match(/r\/([^/]+)/)?.[1]
      }));
      allArticles.push(...items);
      console.log(`  ✅ ${url.match(/r\/([^/]+)/)?.[1]}: ${items.length} posts`);
    } catch (error) {
      console.log(`  ⚠️  Failed to fetch ${url.split('/')[4]}`);
    }
  }
  
  // 2. Traditional News
  console.log('\n📰 NEWS SOURCES:');
  for (const url of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 15).map(item => ({
        ...item,
        source: 'News',
        outlet: new URL(url).hostname
      }));
      allArticles.push(...items);
      console.log(`  ✅ ${new URL(url).hostname}: ${items.length} articles`);
    } catch (error) {
      console.log(`  ⚠️  Failed to fetch ${new URL(url).hostname}`);
    }
  }
  
  // 3. Twitter/X via Nitter
  console.log('\n🐦 TWITTER/X (via Nitter):');
  for (const url of TWITTER_ACCOUNTS) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 5).map(item => ({
        ...item,
        source: 'Twitter',
        account: url.match(/nitter.net\/([^/]+)/)?.[1]
      }));
      allArticles.push(...items);
      console.log(`  ✅ @${url.match(/nitter.net\/([^/]+)/)?.[1]}: ${items.length} tweets`);
    } catch (error) {
      console.log(`  ⚠️  Failed to fetch @${url.match(/nitter.net\/([^/]+)/)?.[1]}`);
    }
  }
  
  // 4. GitHub Trending
  console.log('\n🐙 GITHUB:');
  const trendingRepo = await fetchGitHubTrending();
  if (trendingRepo) {
    allArticles.push(trendingRepo);
  }
  
  // 5. GitHub Novel Work (Sudden Star Growth)
  const novelRepo = await detectSuddenStarGrowth();
  if (novelRepo) {
    allArticles.push(novelRepo);
  }
  
  // 6. Discord (if configured)
  const discordPosts = await fetchDiscordUpdates();
  if (discordPosts.length > 0) {
    console.log('\n💬 DISCORD:');
    console.log(`  ✅ Found ${discordPosts.length} updates`);
    allArticles.push(...discordPosts);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 TOTAL ARTICLES FOUND: ${allArticles.length}\n`);
  
  // Filter for AI art keywords
  const relevantArticles = allArticles.filter(item => {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(keyword => text.includes(keyword));
  });
  
  console.log(`🎯 RELEVANT ARTICLES: ${relevantArticles.length}\n`);
  
  // Prioritize GitHub novel work, then sort by date
  relevantArticles.sort((a, b) => {
    if (a.type === 'github_novel') return -1;
    if (b.type === 'github_novel') return 1;
    if (a.type === 'github') return -1;
    if (b.type === 'github') return 1;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  
  if (relevantArticles.length === 0) {
    throw new Error('No relevant AI art content found across all platforms');
  }
  
  const topStory = relevantArticles[0];
  console.log('🏆 TOP STORY SELECTED:');
  console.log(`   Title: ${topStory.title}`);
  console.log(`   Source: ${topStory.source}`);
  console.log(`   Link: ${topStory.link}`);
  if (topStory.type === 'github_novel') {
    console.log(`   ⭐ ${topStory.stars} stars (${topStory.starsPerDay}/day) - NOVEL WORK!`);
  }
  console.log('');
  
  return topStory;
}

async function generateStructuredCaption(article) {
  console.log('✍️  Generating structured Instagram caption...');
  
  let contextNote = '';
  if (article.type === 'github_novel') {
    contextNote = `\n\nNOTE: This is a GitHub repo that gained ${article.stars} stars in just ${Math.floor(article.stars / article.starsPerDay)} days - indicating breakthrough/novel work in the community!`;
  }
  
  const prompt = `Based on this ${article.source} content:
Title: ${article.title}
Summary: ${article.contentSnippet || 'See link for details'}
URL: ${article.link}${contextNote}

Write an Instagram caption in this EXACT format:

[Compelling title - max 60 chars]

[Hook - one sentence that grabs attention]

THE CONTEXT:
[2-3 sentences explaining what happened - clear facts]

WHY IT MATTERS:
[2-3 sentences on the significance and impact]

THE CAPABILITIES:
[2-3 key points about what this enables or changes - use bullet points]

READ MORE: ${article.link}

📰 Source: ${article.source}${article.subreddit ? ` (r/${article.subreddit})` : ''}${article.account ? ` (@${article.account})` : ''}${article.stars ? ` (${article.stars}⭐)` : ''}

#AIArt #GenerativeAI #MachineLearning #StableDiffusion #Midjourney #DigitalArt #CreativeAI #TechNews

IMPORTANT: 
- Keep sections labeled EXACTLY as shown (ALL CAPS)
- Be concrete and specific
- If this is a GitHub repo with rapid growth, emphasize the community excitement
- Include the exact URL provided`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 600
  });
  
  console.log('✅ Caption generated\n');
  return completion.choices[0].message.content.trim();
}

async function generateFeaturedImage(article) {
  console.log('🎨 Generating featured image...');
  
  const prompt = `Create a striking, high-impact AI-generated artwork inspired by: "${article.title}". 
  
  Style: Vibrant neon colors (cyan, magenta, electric blue, hot pink, purple), abstract or surreal composition, futuristic tech aesthetic, high visual drama perfect for Instagram. Premium quality, eye-catching, professional gradient design.
  
  ${article.type === 'github' ? 'Include subtle circuit board or code-inspired patterns to hint at open source development.' : ''}
  
  NO text, NO words - pure visual art that captures the essence of this AI advancement.`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "hd"
  });
  
  console.log('✅ Image generated\n');
  return response.data[0].url;
}

async function sendToZapier(post) {
  if (!process.env.ZAPIER_WEBHOOK_URL) {
    console.log('⚠️  No ZAPIER_WEBHOOK_URL configured, skipping...');
    return;
  }
  
  try {
    const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'instagram_single_post',
        imageUrl: post.imageUrl,
        caption: post.caption,
        articleTitle: post.article.title,
        articleUrl: post.article.link,
        source: post.article.source,
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log('✅ Zapier webhook triggered!');
    } else {
      console.log(`⚠️  Zapier failed: ${response.status}`);
    }
  } catch (error) {
    console.log('⚠️  Zapier error:', error.message);
  }
}

async function main() {
  console.log('🚀 MULTI-PLATFORM INSTAGRAM POST GENERATOR\n');
  console.log('='.repeat(50));
  
  try {
    // 1. Fetch news from ALL platforms
    const article = await fetchAllNews();
    
    // 2. Generate structured caption
    const caption = await generateStructuredCaption(article);
    
    // 3. Generate featured image
    const imageUrl = await generateFeaturedImage(article);
    
    // 4. Save output
    const output = {
      article: {
        title: article.title,
        link: article.link,
        source: article.source,
        type: article.type,
        pubDate: article.pubDate,
        contentSnippet: article.contentSnippet,
        metadata: {
          subreddit: article.subreddit,
          account: article.account,
          stars: article.stars,
          starsPerDay: article.starsPerDay
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
    
    console.log(`💾 Saved to: ${filename}\n`);
    
    // 5. Preview
    console.log('='.repeat(50));
    console.log('📱 INSTAGRAM POST PREVIEW:\n');
    console.log(caption);
    console.log('\n' + '='.repeat(50));
    console.log(`\n🖼️  Image: ${imageUrl}`);
    console.log(`📄 Source: ${article.link}\n`);
    
    // 6. Send to Zapier
    await sendToZapier(output);
    
    console.log('🎉 Post ready for Instagram!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
