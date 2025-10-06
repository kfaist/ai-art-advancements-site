import Parser from 'rss-parser';
import fs from 'fs';

const parser = new Parser();
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const NEWS_SOURCES = [
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://ssir.org/topics/category/technology/rss',
  'https://philanthropynewsdigest.org/rss',
  'https://www.thenonprofittimes.com/feed/',
  'https://www.nten.org/feed/',
  'https://nonprofitquarterly.org/feed/'
];

const KEYWORDS = [
  'nonprofittech', 'civictech', 'tech4good', 'digital inclusion', 'ai for good', 'ai4ngo',
  'nonprofit', 'ngo', 'foundation', 'charity', 'social impact', 'humanitarian tech',
  'donor crm', 'grants management', 'case management', 'data governance', 'responsible data',
  'ai triage', 'call center', 'summarization', 'translation', 'knowledge base',
  'fundraising', 'recurring giving', 'donor stewardship', 'sms outreach',
  'nten', 'techsoup', 'candid', 'guidestar', 'datakind', 'code for america', 'nethope',
  'salesforce nonprofit', 'blackbaud', 'twilio.org', 'microsoft for nonprofits',
  'google for nonprofits', 'aws nonprofit', 'github for nonprofits',
  'dmarc', 'cybersecurity', 'cis controls', 'nist ai rmf', 'eu ai act',
  'c2pa', 'content credentials', 'deepfake', 'disinformation',
  'grantmakers', 'funders', '501c3', 'volunteers', 'underserved', 'equity', 'accessibility'
];

const COLOR_PALETTES = [
  'forest green, bright orange, golden yellow, teal, coral',
  'emerald, tangerine, sunshine yellow, lime, amber',
  'sage green, burnt orange, mustard yellow, mint, peach',
  'olive, rust orange, honey yellow, jade, copper',
  'seafoam green, coral orange, lemon yellow, turquoise, bronze'
];

async function fetchNews() {
  const all = [];
  for (const url of NEWS_SOURCES) {
    try { 
      const feed = await parser.parseURL(url); 
      all.push(...feed.items.slice(0, 10)); 
    } catch (e) { 
      console.log('Failed:', url); 
    }
  }
  const filtered = all.filter(item => {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  });
  filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return filtered[0];
}

async function generateCaption(news) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', 
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'gpt-4', 
      messages: [{ role: 'user', content: 'WizofAI style caption for nonprofits: ' + news.title + '. Hook, social impact, 2-3 sentences. Hashtags: #AIForGood #Nonprofits #SocialImpact #TechForGood #CivicTech' }], 
      max_tokens: 200 
    })
  });
  const data = await res.json();
  if (!data.choices) { 
    console.error('OpenAI error:', JSON.stringify(data)); 
    return 'Caption generation failed'; 
  }
  return data.choices[0].message.content;
}

async function extractThemes(headline) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', 
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'gpt-4', 
      messages: [{ role: 'user', content: 'Extract 2-3 visual nouns from: "' + headline + '". Comma-separated only.' }], 
      max_tokens: 30 
    })
  });
  const data = await res.json();
  if (!data.choices) return headline;
  return data.choices[0].message.content.trim();
}

async function generateImage(news) {
  const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  const themes = await extractThemes(news.title);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST', 
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'dall-e-3', 
      prompt: 'NO TEXT. Abstract 3D art: ' + themes + '. Colors: ' + palette + '. Flowing organic shapes, glowing elements, uplifting hopeful aesthetic.', 
      size: '1024x1024', 
      quality: 'hd' 
    })
  });
  const data = await res.json();
  if (!data.data) { 
    console.error('DALL-E error:', JSON.stringify(data)); 
    return null; 
  }
  return data.data[0].url;
}

const news = await fetchNews();
if (!news) { console.log('No nonprofit AI news found'); process.exit(0); }
const caption = await generateCaption(news);
const imageUrl = await generateImage(news);
console.log('NEWS:', news.title);
console.log('CAPTION:', caption);
console.log('IMAGE:', imageUrl);
fs.writeFileSync('content/nonprofit-output.json', JSON.stringify({ news, caption, imageUrl, timestamp: new Date() }, null, 2));
