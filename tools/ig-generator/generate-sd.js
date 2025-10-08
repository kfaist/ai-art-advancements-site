/**
 * Instagram Generator - Stable Diffusion + Canva Version
 * FREE image generation with local Stable Diffusion!
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const DRAFTS_DIR = path.join(__dirname, 'drafts');
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

// Stable Diffusion WebUI API (default local URL)
const SD_API_URL = process.env.SD_API_URL || 'http://127.0.0.1:7860';

// Visual themes
const THEMES = {
  aiArt: {
    colors: ['electric blue', 'hot pink', 'neon purple', 'cyan'],
    prompt_style: 'futuristic cyberpunk neon-lit glowing ultra vibrant',
    canva_colors: {
      primary: '#00D9FF',
      secondary: '#FF006E',
      accent: '#A855F7'
    },
    hashtags: '#AIArt #GenerativeAI #DigitalArt #FutureOfArt #CreativeAI #ArtificialIntelligence'
  },
  nonprofit: {
    colors: ['emerald green', 'warm orange', 'golden yellow'],
    prompt_style: 'hopeful bright community-focused impactful warm lighting',
    canva_colors: {
      primary: '#10B981',
      secondary: '#F59E0B',
      accent: '#FCD34D'
    },
    hashtags: '#AIForGood #TechForGood #SocialImpact #NonprofitTech #Innovation #CommunityImpact'
  }
};

// Content ideas
const CONTENT_IDEAS = [
  {
    theme: 'aiArt',
    title: 'AI Creates Stunning 3D Art',
    description: 'New AI model generates photorealistic 3D scenes from text prompts in seconds',
    impact: 'Artists can prototype ideas 10x faster, democratizing 3D creation',
    sources: 'Research published in Nature Machine Intelligence, multiple AI labs collaborating'
  },
  {
    theme: 'nonprofit',
    title: 'AI Helps Predict Natural Disasters',
    description: 'Machine learning models improve disaster response time by 50% saving lives',
    impact: 'Communities get critical warnings hours earlier, enabling better evacuation',
    sources: 'WHO and Red Cross deploying AI systems globally, studies show significant improvement'
  }
];

/**
 * Generate image with Stable Diffusion
 */
async function generateImageSD(prompt) {
  try {
    console.log(`  🎨 Generating with Stable Diffusion...`);
    console.log(`     API: ${SD_API_URL}`);
    
    const payload = {
      prompt: prompt,
      negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy, text bleeding',
      steps: 30,
      cfg_scale: 7,
      width: 1024,
      height: 1024,
      sampler_name: 'DPM++ 2M Karras'
    };
    
    const response = await axios.post(`${SD_API_URL}/sdapi/v1/txt2img`, payload, {
      timeout: 120000 // 2 minutes
    });
    
    if (response.data && response.data.images && response.data.images[0]) {
      const imageBase64 = response.data.images[0];
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      console.log(`  ✅ Image generated! Size: ${(imageBuffer.length / 1024).toFixed(0)}KB`);
      return imageBuffer;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Stable Diffusion error: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.error(`  💡 Is Stable Diffusion WebUI running at ${SD_API_URL}?`);
      console.error(`     Start it with: webui-user.bat`);
    }
    return null;
  }
}

/**
 * Create Canva-ready text file
 */
function createCanvaTextFile(slides, theme) {
  const themeEmoji = theme === 'aiArt' ? '🎨' : '💚';
  const colors = THEMES[theme].canva_colors;
  
  let content = `CANVA INSTAGRAM CAROUSEL - ${theme.toUpperCase()}
${themeEmoji.repeat(20)}

COLOR SCHEME:
Primary: ${colors.primary}
Secondary: ${colors.secondary}
Accent: ${colors.accent}

==========================================

SLIDE 2/4: THE CONTEXT
------------------------------------------
${slides[0].text}

==========================================

SLIDE 3/4: WHY IT MATTERS
------------------------------------------
${slides[1].text}

==========================================

SLIDE 4/4: LEARN MORE
------------------------------------------
${slides[2].text}

==========================================

COPY THIS TO CANVA:
1. Open your Canva template for ${theme}
2. Copy text from each section above
3. Paste into corresponding Canva slides
4. Download all 3 slides
5. Combine with cover image for Instagram!

`;
  
  return content;
}

/**
 * Create Instagram post
 */
async function createPost(content, index) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const folderName = `${timestamp}-${index}-${content.theme}`;
  const postFolder = path.join(DRAFTS_DIR, folderName);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📸 Creating post ${index + 1}: ${content.title}`);
  console.log(`   Theme: ${content.theme}`);
  console.log(`   Folder: ${folderName}`);
  console.log(`${'='.repeat(60)}`);
  
  fs.mkdirSync(postFolder, { recursive: true });
  
  // 1. Generate cover image with Stable Diffusion
  const theme = THEMES[content.theme];
  const imagePrompt = `${theme.prompt_style} digital art illustration with bold text "${content.title}" prominently displayed,
    featuring vibrant ${theme.colors.join(' and ')} colors,
    Instagram square format 1024x1024, professional quality, magazine cover style,
    dramatic lighting, ultra high quality, trending on artstation`;
  
  console.log('\n📸 Generating cover image...');
  const coverImage = await generateImageSD(imagePrompt);
  
  if (coverImage) {
    fs.writeFileSync(path.join(postFolder, '01_cover.jpg'), coverImage);
    console.log(`  ✅ Cover saved: 01_cover.jpg`);
  } else {
    console.log(`  ⚠️  Cover generation failed - check Stable Diffusion`);
  }
  
  // 2. Create Canva text file
  console.log('\n📝 Creating Canva text file...');
  const slides = [
    { title: 'THE CONTEXT', text: content.description },
    { title: 'WHY IT MATTERS', text: content.impact },
    { title: 'LEARN MORE', text: content.sources + '\n\nFollow @ai.advancements.art for daily AI innovations!' }
  ];
  
  const canvaText = createCanvaTextFile(slides, content.theme);
  fs.writeFileSync(path.join(postFolder, 'CANVA_TEXT.txt'), canvaText, 'utf8');
  console.log(`  ✅ Canva text saved: CANVA_TEXT.txt`);
  
  // 3. Create Instagram caption
  const caption = `${content.title}

${content.description}

💡 THE CONTEXT:
${content.description}

🌍 WHY IT MATTERS:
${content.impact}

📚 SOURCES & LEARN MORE:
${content.sources}

${theme.hashtags}

Follow @ai.advancements.art for daily AI innovation updates!`;
  
  fs.writeFileSync(path.join(postFolder, 'INSTAGRAM_CAPTION.txt'), caption, 'utf8');
  console.log(`  ✅ Caption saved: INSTAGRAM_CAPTION.txt`);
  
  // 4. Save metadata
  const metadata = {
    title: content.title,
    theme: content.theme,
    created: new Date().toISOString(),
    folder: folderName,
    coverGenerated: coverImage !== null,
    imagePrompt: imagePrompt
  };
  
  fs.writeFileSync(
    path.join(postFolder, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Post complete: ${postFolder}`);
  console.log(`\n📋 NEXT STEPS:`);
  console.log(`   1. Open ${folderName}/CANVA_TEXT.txt`);
  console.log(`   2. Copy text to your Canva templates`);
  console.log(`   3. Download 3 Canva slides`);
  console.log(`   4. Upload all 4 images to Instagram!`);
  
  return postFolder;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎨 Instagram Generator - Stable Diffusion + Canva');
  console.log('===================================================\n');
  
  console.log('📋 Configuration:');
  console.log(`   Stable Diffusion API: ${SD_API_URL}`);
  console.log(`   Output directory: ${DRAFTS_DIR}`);
  console.log(`   Posts to generate: ${CONTENT_IDEAS.length}\n`);
  
  // Check if Stable Diffusion is running
  try {
    await axios.get(`${SD_API_URL}/sdapi/v1/options`, { timeout: 5000 });
    console.log('✅ Stable Diffusion is running!\n');
  } catch (error) {
    console.log('⚠️  Warning: Cannot connect to Stable Diffusion');
    console.log(`   Make sure it's running at: ${SD_API_URL}`);
    console.log(`   Start with: webui-user.bat\n`);
  }
  
  const generatedPosts = [];
  
  for (let i = 0; i < CONTENT_IDEAS.length; i++) {
    const postFolder = await createPost(CONTENT_IDEAS[i], i);
    generatedPosts.push(postFolder);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Generation Complete!');
  console.log('='.repeat(60));
  console.log(`\n📊 Results:`);
  console.log(`   Posts generated: ${generatedPosts.length}/${CONTENT_IDEAS.length}`);
  console.log(`   Output location: ${DRAFTS_DIR}\n`);
  console.log(`💰 Cost: $0 (FREE with Stable Diffusion!)\n`);
}

// Run
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createPost, generateImageSD };
