/**
 * Instagram Carousel Generator v2 - Enhanced with Better Error Handling
 * Creates beautiful carousel posts with AI-generated images
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create drafts directory
const DRAFTS_DIR = path.join(__dirname, 'drafts');
console.log(`📁 Creating drafts directory at: ${DRAFTS_DIR}`);
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  console.log('✅ Drafts directory created');
} else {
  console.log('✅ Drafts directory already exists');
}

// Check for OpenAI module
let OpenAI;
try {
  OpenAI = require('openai');
  console.log('✅ OpenAI module loaded');
} catch (error) {
  console.error('❌ OpenAI module not found. Please run: npm install openai');
  console.error('   Error:', error.message);
  process.exit(1);
}

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env file');
  console.error('   Please ensure .env file contains: OPENAI_API_KEY=your-key-here');
  process.exit(1);
}

console.log('✅ API key found');
console.log(`   Key preview: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Visual themes for different content types
const THEMES = {
  aiArt: {
    colors: ['electric blue', 'hot pink', 'neon purple', 'cyan'],
    style: 'futuristic, cyberpunk, neon-lit, glowing, ultra vibrant',
    hashtags: '#AIArt #GenerativeAI #DigitalArt #FutureOfArt #CreativeAI #ArtificialIntelligence'
  },
  nonprofit: {
    colors: ['emerald green', 'warm orange', 'golden yellow'],
    style: 'hopeful, bright, community-focused, impactful, warm lighting',
    hashtags: '#AIForGood #TechForGood #SocialImpact #NonprofitTech #Innovation #CommunityImpact'
  }
};

// Sample content ideas
const CONTENT_IDEAS = [
  {
    title: "AI Creates Stunning 3D Art",
    description: "New AI model generates photorealistic 3D scenes from text prompts in seconds",
    theme: "aiArt",
    impact: "Artists can now create 3D worlds without any 3D software knowledge"
  },
  {
    title: "AI Helps Predict Natural Disasters",
    description: "Machine learning models improve disaster response time by 50% saving lives",
    theme: "nonprofit",
    impact: "Communities get critical warnings hours earlier, enabling better evacuation"
  }
];

/**
 * Generate an image using DALL-E 3
 */
async function generateImage(prompt, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  🎨 Generating image with DALL-E 3 (attempt ${attempt}/${retries})...`);
      console.log(`     Prompt preview: "${prompt.substring(0, 100)}..."`);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      });

      if (response.data && response.data[0] && response.data[0].url) {
        console.log('  ✅ Image generated successfully!');
        console.log(`     Image URL: ${response.data[0].url.substring(0, 50)}...`);
        
        // Download the image
        console.log('  📥 Downloading image...');
        const imageUrl = response.data[0].url;
        
        // Use built-in fetch if available (Node 18+) or fall back to https
        if (typeof fetch !== 'undefined') {
          const imageResponse = await fetch(imageUrl);
          const arrayBuffer = await imageResponse.arrayBuffer();
          console.log('  ✅ Image downloaded successfully');
          return Buffer.from(arrayBuffer);
        } else {
          // Fallback for older Node versions
          const https = require('https');
          return new Promise((resolve, reject) => {
            https.get(imageUrl, (response) => {
              const chunks = [];
              response.on('data', (chunk) => chunks.push(chunk));
              response.on('end', () => {
                console.log('  ✅ Image downloaded successfully');
                resolve(Buffer.concat(chunks));
              });
              response.on('error', reject);
            }).on('error', reject);
          });
        }
      } else {
        console.error('  ⚠️ No image URL in response');
        console.error('     Response:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error(`  ❌ Image generation failed (attempt ${attempt}/${retries}):`, error.message);
      
      if (error.response) {
        console.error('     Status:', error.response.status);
        console.error('     Data:', error.response.data);
      }
      
      if (error.message.includes('billing')) {
        console.error('  💳 This might be a billing issue. Check your OpenAI account credits.');
      }
      
      if (attempt === retries) {
        console.error('  ⚠️ All attempts failed. Creating text placeholder instead.');
        return null;
      }
      
      // Wait before retry
      console.log(`  ⏳ Waiting 2 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return null;
}

/**
 * Create a simple text slide (fallback if image generation fails)
 */
function createTextSlide(text, theme) {
  const content = `
====================================
${theme === 'aiArt' ? '🎨' : '💚'} ${theme.toUpperCase()} POST
====================================

${text}

====================================
Theme: ${theme}
Colors: ${THEMES[theme].colors.join(', ')}
Style: ${THEMES[theme].style}
====================================
`;
  return Buffer.from(content, 'utf8');
}

/**
 * Save image from URL or buffer
 */
async function saveImage(data, filepath) {
  try {
    if (Buffer.isBuffer(data)) {
      fs.writeFileSync(filepath, data);
      return true;
    } else if (typeof data === 'string' && data.startsWith('http')) {
      // It's a URL, download it
      if (typeof fetch !== 'undefined') {
        const response = await fetch(data);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('  ❌ Error saving image:', error.message);
    return false;
  }
}

/**
 * Generate a complete carousel post
 */
async function createCarouselPost(content, index) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const folderName = `${timestamp}-${index}-${content.theme}`;
  const postFolder = path.join(DRAFTS_DIR, folderName);
  const carouselFolder = path.join(postFolder, 'carousel');
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📸 Creating post ${index + 1}: ${content.title}`);
  console.log(`   Theme: ${content.theme}`);
  console.log(`   Folder: ${folderName}`);
  console.log(`${'='.repeat(60)}`);
  
  // Create directories
  fs.mkdirSync(carouselFolder, { recursive: true });
  console.log(`📁 Created folder: ${postFolder}`);
  
  // 1. Generate cover image WITH TEXT OVERLAY
  const theme = THEMES[content.theme];
  const imagePrompt = `${theme.style} digital art illustration with bold text overlay reading "${content.title}" prominently displayed at the top,
    featuring vibrant ${theme.colors.join(' and ')} colors, highly detailed,
    Instagram square format 1024x1024, professional quality, eye-catching composition,
    clean readable typography integrated into the design, text should be clearly visible and not bleeding over edges,
    dramatic lighting, ultra high quality, trending on artstation, magazine cover style with headline text`;
  
  console.log('\n📸 Generating cover image...');
  const coverImage = await generateImage(imagePrompt);
  
  if (coverImage) {
    fs.writeFileSync(path.join(carouselFolder, '01_cover.jpg'), coverImage);
    console.log(`  ✅ Cover image saved: 01_cover.jpg`);
  } else {
    // Create placeholder if image generation fails
    console.log('  ⚠️ Using text placeholder for cover');
    const placeholder = createTextSlide(`COVER: ${content.title}`, content.theme);
    fs.writeFileSync(path.join(carouselFolder, '01_cover_placeholder.txt'), placeholder);
    console.log(`  ✅ Placeholder saved: 01_cover_placeholder.txt`);
  }
  
  // 2. Generate text slide images with DALL-E
  console.log('\n📝 Creating carousel slides...');
  const slides = [
    { num: '02', title: 'THE CONTEXT', text: content.description },
    { num: '03', title: 'WHY IT MATTERS', text: content.impact },
    { num: '04', title: 'LEARN MORE', text: 'Follow @ai.advancements.art for daily AI innovations!' }
  ];
  
  for (const slide of slides) {
    const slidePrompt = `Clean minimalist Instagram slide design with "${slide.title}" as bold header text at top,
      and body text reading "${slide.text}" below in readable font,
      ${theme.style} background with ${theme.colors.join(' and ')} gradient colors,
      professional typography, Instagram square 1024x1024, modern social media post design,
      text clearly visible and not bleeding over edges, magazine layout style`;
    
    console.log(`  Generating slide ${slide.num}: ${slide.title}...`);
    const slideImage = await generateImage(slidePrompt);
    
    if (slideImage) {
      fs.writeFileSync(
        path.join(carouselFolder, `${slide.num}_${slide.title.toLowerCase().replace(/\s+/g, '_')}.jpg`),
        slideImage
      );
      console.log(`  ✅ Created slide image: ${slide.num} - ${slide.title}`);
    } else {
      // Fallback to text file
      const slideBuffer = createTextSlide(`${slide.title}\n\n${slide.text}`, content.theme);
      fs.writeFileSync(
        path.join(carouselFolder, `${slide.num}_${slide.title.toLowerCase().replace(/\s+/g, '_')}.txt`), 
        slideBuffer
      );
      console.log(`  ⚠️ Created text file: ${slide.num} - ${slide.title}`);
    }
  }
  
  // 3. Save prompt used
  fs.writeFileSync(
    path.join(postFolder, 'image_prompt.txt'),
    imagePrompt,
    'utf8'
  );
  console.log('\n📄 Saved image prompt');
  
  // 4. Create caption
  const caption = `${content.title}\n\n${content.description}\n\n${theme.hashtags}`;
  fs.writeFileSync(
    path.join(postFolder, 'caption.txt'),
    caption,
    'utf8'
  );
  console.log('📄 Saved Instagram caption');
  
  // 5. Save metadata
  const metadata = {
    title: content.title,
    theme: content.theme,
    created: new Date().toISOString(),
    folder: folderName,
    files: fs.readdirSync(carouselFolder),
    caption: caption,
    imagePrompt: imagePrompt,
    imageGenerated: coverImage !== null
  };
  
  fs.writeFileSync(
    path.join(postFolder, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );
  console.log('📄 Saved metadata');
  
  console.log(`\n✅ Post complete: ${postFolder}`);
  return postFolder;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎨 Instagram Carousel Generator v2');
  console.log('====================================\n');
  
  // Show configuration
  console.log('📋 Configuration:');
  console.log(`   Node version: ${process.version}`);
  console.log(`   Output directory: ${DRAFTS_DIR}`);
  console.log(`   Posts to generate: ${CONTENT_IDEAS.length}`);
  console.log('');
  
  const generatedPosts = [];
  
  // Generate posts for each content idea
  for (let i = 0; i < CONTENT_IDEAS.length; i++) {
    const content = CONTENT_IDEAS[i];
    try {
      const postPath = await createCarouselPost(content, i);
      generatedPosts.push(postPath);
    } catch (error) {
      console.error(`\n❌ Failed to create post ${i + 1}: ${error.message}`);
      console.error('   Stack:', error.stack);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Generation Complete!');
  console.log('='.repeat(60));
  console.log(`\n📊 Results:`);
  console.log(`   Posts generated: ${generatedPosts.length}/${CONTENT_IDEAS.length}`);
  console.log(`   Output location: ${DRAFTS_DIR}`);
  
  if (generatedPosts.length > 0) {
    console.log('\n📁 Generated posts:');
    generatedPosts.forEach((post, i) => {
      console.log(`   ${i + 1}. ${path.basename(post)}`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('   1. Check the drafts folder for your carousels');
    console.log('   2. Review the generated images and text');
    console.log('   3. Create visual slides using Canva or similar tools');
    console.log('   4. Upload to Instagram using Buffer, Later, or Creator Studio');
  } else {
    console.log('\n⚠️ No posts were generated. Please check the errors above.');
    console.log('   Common issues:');
    console.log('   - Invalid API key');
    console.log('   - No credits in OpenAI account');
    console.log('   - Network connectivity issues');
  }
}

// Run the generator
if (require.main === module) {
  main().catch(error => {
    console.error('\n💥 Fatal error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
}

module.exports = { generateImage, createCarouselPost };