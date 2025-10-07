import Parser from 'rss-parser';
import fs from 'fs';

const parser = new Parser();
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('OPENAI_API_KEY is not set');
  process.exit(1);
}

const NEWS_SOURCES = [
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://huggingface.co/blog/feed.xml',
  'https://stability.ai/news/feed',
  'https://siggraph.org/feed/'
];

const KEYWORDS = ['ai', 'generative', 'new media', 'interactive', 'installation', 'projection', 'vr', 'ar', 'touchdesigner'];
const ORGS = ['siggraph', 'currents', 'meow wolf', 'otherworld', 'isea'];

// Fully randomized palettes - pick one per day
const COLOR_PALETTES = [
  'deep blue, vibrant magenta, electric purple, orange, cyan',
  'cobalt blue, hot pink, violet, gold, teal',
  'navy, fuchsia, indigo, coral, turquoise',
  'sapphire, rose, lavender, amber, mint',
  'royal blue, crimson, purple, peach, aqua',
  'midnight blue, neon pink, plum, tangerine, lime',
  'ultramarine, magenta, grape, copper, seafoam',
  'prussian blue, ruby, orchid, bronze, jade'
];

async function fetchNews() {
  const all = [];
  for (const url of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      all.push(...feed.items.slice(0, 10));
    } catch (e) {}
  }
  const filtered = all.filter(item => {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return KEYWORDS.some(kw => text.includes(kw)) || ORGS.some(org => text.includes(org));
  });
  filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return filtered[0];
}

async function generateCaption(news) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + OPENAI_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Write a WizofAI-style Instagram caption about: ${news.title}. Summarize why it matters in 2-3 sentences, include a hook and a question to the audience. Use relevant hashtags like #AIArt, #GenerativeArt, #DigitalArt.`
          }
        ],
        max_tokens: 200
      })
    });
    const data = await res.json();
    if (!res.ok || !data.choices || !data.choices[0]) {
      throw new Error(data.error?.message ?? 'No caption generated');
    }
    return data.choices[0].message.content.trim();
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function generateImage(news) {
  const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + OPENAI_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `NO TEXT. Abstract digital art representing ${news.title}. Colors: ${palette}. Flowing shapes, glowing ribbons, particles, futuristic polished.`,
        size: '1024x1024',
        quality: 'hd'
      })
    });
    const data = await res.json();
    if (!res.ok || !data.data || !data.data[0]) {
      throw new Error(data.error?.message ?? 'No image generated');
    }
    return data.data[0].url;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function main() {
  const news = await fetchNews();
  if (!news) {
    console.log('No news');
    process.exit(0);
  }
  const caption = await generateCaption(news);
  const imageUrl = await generateImage(news);
  console.log('NEWS:', news.title);
  console.log('CAPTION:', caption);
  console.log('IMAGE:', imageUrl);

  // ensure content directory exists
  if (!fs.existsSync('content')) {
    fs.mkdirSync('content', { recursive: true });
  }

  fs.writeFileSync('content/daily-output.json', JSON.stringify({ news, caption, imageUrl, timestamp: new Date() }, null, 2));
}

main().catch((err) => {
  console.error(err);
});
