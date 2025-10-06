import fs from 'fs';

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function pickTodaysRepo() {
  const repos = JSON.parse(fs.readFileSync('data/repos.json', 'utf8'));
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return repos[dayOfYear % repos.length];
}

async function generateCaption(repo) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Create a WizofAI-style Instagram caption for: ${repo.metadata.name} - ${repo.metadata.description}. Hook + benefit in 2-3 sentences. End with 8 hashtags including #AIArt #TechNews #Innovation.`
      }],
      max_tokens: 200
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateImage(repo) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `Vibrant abstract digital art representing ${repo.metadata.description}. NO TEXT, NO WORDS, NO LABELS. Color palette: electric pinks, purples, blues, oranges. Surreal futuristic aesthetic with flowing shapes, glowing orbs, tech elements. Dreamlike professional finish. Style: similar to that ComfyUI detector/detailer/pipe visualization but more abstract and colorful. 3D rendered feel.`,
      size: '1024x1024',
      quality: 'hd'
    })
  });
  const data = await response.json();
  return data.data[0].url;
}

const repo = await pickTodaysRepo();
const caption = await generateCaption(repo);
const imageUrl = await generateImage(repo);
console.log('REPO:', repo.metadata.name);
console.log('\nCAPTION:\n', caption);
console.log('\nIMAGE:', imageUrl);
