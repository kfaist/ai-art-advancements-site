const fs = require('fs');
const path = require('path');

// Get the latest draft folder
const draftsDir = path.join(__dirname, 'drafts');
const folders = fs.readdirSync(draftsDir)
  .filter(f => fs.statSync(path.join(draftsDir, f)).isDirectory())
  .sort((a, b) => b.localeCompare(a));

if (folders.length === 0) {
  console.log('No drafts found');
  process.exit(1);
}

const latestFolder = folders[0];
const draftPath = path.join(draftsDir, latestFolder);

// Read metadata
const metadata = JSON.parse(fs.readFileSync(path.join(draftPath, 'metadata.json'), 'utf8'));
const caption = fs.readFileSync(path.join(draftPath, 'caption.txt'), 'utf8');

// Create public URLs for GitHub raw content
const repoBase = 'https://raw.githubusercontent.com/kfaist/ai-art-advancements-site/main/tools/ig-generator/drafts';
const imageUrls = metadata.files
  .filter(f => f.endsWith('.png'))
  .map(f => `${repoBase}/${latestFolder}/${f}`);

// Create Instagram-ready JSON
const instagramData = {
  caption: caption,
  media: imageUrls,
  timestamp: new Date().toISOString(),
  draftFolder: latestFolder,
  theme: metadata.theme || 'aiArt'
};

// Save to root for easy access
fs.writeFileSync(
  path.join(__dirname, 'latest-instagram.json'),
  JSON.stringify(instagramData, null, 2)
);

console.log('✅ Created latest-instagram.json');
console.log(JSON.stringify(instagramData, null, 2));
