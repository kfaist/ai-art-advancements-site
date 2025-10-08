const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Visual themes matching the main generator
const THEMES = {
  aiArt: {
    colors: ['#00D9FF', '#FF006E', '#A855F7', '#00F5FF'], // electric blue, hot pink, neon purple, cyan
    bgColor: '#0a0a14',
    accentColor: '#FF006E'
  },
  nonprofit: {
    colors: ['#10B981', '#F59E0B', '#FCD34D'], // emerald green, warm orange, golden yellow
    bgColor: '#1a1a2e',
    accentColor: '#10B981'
  }
};

/**
 * Create a text slide as an image
 */
function createTextSlideImage(title, body, theme, slideNumber) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const themeColors = THEMES[theme];
  
  // Background
  ctx.fillStyle = themeColors.bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, themeColors.colors[0] + '20');
  gradient.addColorStop(1, themeColors.colors[1] + '20');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Slide number indicator
  ctx.fillStyle = themeColors.accentColor;
  ctx.fillRect(40, 40, 60, 8);
  
  ctx.fillStyle = '#ffffff40';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`${slideNumber}/4`, 40, 90);
  
  // Title
  ctx.fillStyle = themeColors.accentColor;
  ctx.font = 'bold 56px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 400);
  
  // Body text with word wrap
  ctx.fillStyle = '#ffffff';
  ctx.font = '38px Arial';
  ctx.textAlign = 'center';
  
  const words = body.split(' ');
  let line = '';
  let y = 520;
  const maxWidth = width - 160;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, width / 2, y);
      line = word + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, y);
  
  // Bottom accent
  ctx.fillStyle = themeColors.accentColor + '40';
  ctx.fillRect(0, height - 100, width, 100);
  
  // Theme emoji
  const emoji = theme === 'aiArt' ? '🎨' : '💚';
  ctx.font = '48px Arial';
  ctx.fillText(emoji, width / 2, height - 40);
  
  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

/**
 * Convert text slide files to images
 */
async function convertTextSlidesToImages(draftFolder) {
  const carouselFolder = path.join(draftFolder, 'carousel');
  
  if (!fs.existsSync(carouselFolder)) {
    console.error('Carousel folder not found');
    return;
  }
  
  // Read metadata to get theme
  const metadata = JSON.parse(fs.readFileSync(path.join(draftFolder, 'metadata.json'), 'utf8'));
  const theme = metadata.theme || 'aiArt';
  
  console.log(`\n🎨 Converting text slides to images for theme: ${theme}`);
  
  // Define slides
  const slides = [
    { file: '02_the_context.txt', title: 'THE CONTEXT', number: 2 },
    { file: '03_why_it_matters.txt', title: 'WHY IT MATTERS', number: 3 },
    { file: '04_learn_more.txt', title: 'LEARN MORE', number: 4 }
  ];
  
  for (const slide of slides) {
    const textFile = path.join(carouselFolder, slide.file);
    
    if (fs.existsSync(textFile)) {
      // Read text content
      const content = fs.readFileSync(textFile, 'utf8');
      
      // Extract the actual body text (after the title section)
      const lines = content.split('\n').filter(l => l.trim());
      const bodyLines = lines.filter(l => 
        !l.includes('====') && 
        !l.includes('POST') && 
        !l.includes(slide.title) &&
        !l.startsWith('Theme:') &&
        !l.startsWith('Colors:') &&
        !l.startsWith('Style:')
      );
      const body = bodyLines.join(' ').trim();
      
      // Create image
      const imageBuffer = createTextSlideImage(slide.title, body, theme, slide.number);
      
      // Save as JPG
      const imageFile = textFile.replace('.txt', '.jpg');
      fs.writeFileSync(imageFile, imageBuffer);
      console.log(`  ✅ Created: ${path.basename(imageFile)}`);
      
      // Optionally delete text file
      // fs.unlinkSync(textFile);
    }
  }
  
  console.log('\n✅ All text slides converted to images!');
}

// Run if called directly
if (require.main === module) {
  // Get the latest draft folder
  const draftsDir = path.join(__dirname, 'drafts');
  const folders = fs.readdirSync(draftsDir)
    .filter(f => fs.statSync(path.join(draftsDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a));
  
  if (folders.length === 0) {
    console.log('No draft folders found');
    process.exit(1);
  }
  
  const latestFolder = path.join(draftsDir, folders[0]);
  console.log(`Processing: ${folders[0]}`);
  
  convertTextSlidesToImages(latestFolder)
    .then(() => console.log('\n🎉 Done!'))
    .catch(err => console.error('Error:', err));
}

module.exports = { createTextSlideImage, convertTextSlidesToImages };
