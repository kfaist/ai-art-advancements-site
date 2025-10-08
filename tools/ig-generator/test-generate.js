/**
 * Simple Test Generator - Creates just ONE test post
 * Use this for troubleshooting
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🧪 Simple Test Generator');
console.log('=======================\n');

// Check API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ No OPENAI_API_KEY in .env file');
  process.exit(1);
}

console.log('✅ API key found');
console.log(`   Key: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);

// Load OpenAI
let openai;
try {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('✅ OpenAI loaded\n');
} catch (e) {
  console.error('❌ Could not load OpenAI. Run: npm install openai');
  process.exit(1);
}

// Create drafts folder
const DRAFTS = path.join(__dirname, 'drafts');
if (!fs.existsSync(DRAFTS)) {
  fs.mkdirSync(DRAFTS, { recursive: true });
  console.log('📁 Created drafts folder');
}

async function makeTestPost() {
  console.log('🎨 Creating ONE test carousel...\n');
  
  const timestamp = Date.now();
  const folder = path.join(DRAFTS, `test-${timestamp}`);
  fs.mkdirSync(folder, { recursive: true });
  
  console.log(`📁 Folder: test-${timestamp}`);
  
  // Try to generate a simple image
  console.log('\n🖼️ Generating test image...');
  console.log('   This will cost about $0.04');
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Colorful abstract digital art with geometric shapes, vibrant neon colors, futuristic style",
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    
    if (response.data && response.data[0] && response.data[0].url) {
      console.log('✅ Image generated!');
      const url = response.data[0].url;
      console.log(`   URL: ${url.substring(0, 60)}...`);
      
      // Try to download
      console.log('\n📥 Downloading image...');
      try {
        if (typeof fetch === 'undefined') {
          // Node.js < 18 fallback
          const https = require('https');
          const file = fs.createWriteStream(path.join(folder, 'test-image.jpg'));
          
          https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log('✅ Image saved: test-image.jpg');
            });
          }).on('error', (err) => {
            console.error('❌ Download failed:', err.message);
          });
        } else {
          // Modern Node.js with fetch
          const res = await fetch(url);
          const buffer = await res.arrayBuffer();
          fs.writeFileSync(path.join(folder, 'test-image.jpg'), Buffer.from(buffer));
          console.log('✅ Image saved: test-image.jpg');
        }
      } catch (err) {
        console.error('❌ Could not save image:', err.message);
        fs.writeFileSync(path.join(folder, 'image-url.txt'), url);
        console.log('💡 Saved URL instead: image-url.txt');
      }
      
    } else {
      console.error('❌ No image in response');
    }
    
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.message.includes('401')) {
      console.error('\n💡 Invalid API key. Check your .env file');
    } else if (error.message.includes('insufficient_quota')) {
      console.error('\n💡 No credits! Add funds at platform.openai.com');
    } else if (error.message.includes('429')) {
      console.error('\n💡 Rate limited. Wait a minute and try again');
    }
  }
  
  // Create text files regardless
  console.log('\n📝 Creating text slides...');
  
  const slides = [
    'SLIDE 1: This is a test carousel',
    'SLIDE 2: Testing the Instagram generator',
    'SLIDE 3: If you see this, text generation works!'
  ];
  
  slides.forEach((text, i) => {
    fs.writeFileSync(path.join(folder, `slide-${i+1}.txt`), text);
    console.log(`   Created: slide-${i+1}.txt`);
  });
  
  // Create caption
  const caption = `Test post from AI Art Generator!\n\n#AIArt #Test #GenerativeAI`;
  fs.writeFileSync(path.join(folder, 'caption.txt'), caption);
  console.log('   Created: caption.txt');
  
  console.log('\n✅ Test complete!');
  console.log(`📁 Check folder: drafts\\test-${timestamp}`);
}

makeTestPost().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});