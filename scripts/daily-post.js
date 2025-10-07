import fs from 'fs';

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Ensure data directory exists
if (!fs.existsSync('data')) fs.mkdirSync('data');

// Choose today's repository deterministically
async function pickTodaysRepo() {
  const path = fs.existsSync('data/repos.json') ? 'data/repos.json' : 'data/repos-seed.json';
  const repos = JSON.parse(fs.readFileSync(path, 'utf8'));
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return repos[dayOfYear % repos.length];
}

// Generate caption using GPT-4
async function generateCaption(repo) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Create a WizofAI-style Instagram caption for: ${repo.metadata.name} - ${repo.metadata.description}. Sensationalist but accurate, 2-3 sentences, 8 hashtags including #AIArt #TechNews #Innovation.`
          }
        ],
        max_tokens: 200
      })
    });
    const data = await response.json();
    if (data.error || !data.choices) throw new Error(data.error?.message ?? 'No caption choices');
    return data.choices[0].message.content.trim();
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// Generate image using DALL-E 3
async function generateImage(repo) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `NO TEXT. Abstract digital art representing ${repo.metadata.description}. Vibrant magenta, cyan, electric blue and hot pink colours; surreal, glowy, futuristic aesthetic; flowing shapes, glowing orbs, tech elements. 3D rendered feel.`,
        size: '1024x1024',
        quality: 'hd'
      })
    });
    const data = await response.json();
    if (data.error || !data.data) throw new Error(data.error?.message ?? 'No image data');
    return data.data[0].url;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// Persist posts to data/posts.json
function recordPost(post) {
  const file = 'data/posts.json';
  const posts = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  posts.push(post);
  fs.writeFileSync(file, JSON.stringify(posts, null, 2));
}

const repo = await pickTodaysRepo();
const caption = await generateCaption(repo);
const imageUrl = await generateImage(repo);

if (!caption.startsWith('Error') && !imageUrl.startsWith('Error')) {
  recordPost({
    date: new Date().toISOString(),
    repo: repo.metadata.name,
    caption,
    imageUrl
  });
  console.log('Caption:', caption);
  console.log('Image:', imageUrl);
} else {
  console.error('Failed to generate post:', caption, imageUrl);
}
