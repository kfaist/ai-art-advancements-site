/**
 * Comprehensive API Test & Troubleshooting Script
 * This will help identify any issues with your setup
 */

require('dotenv').config();

console.log('🔍 Instagram Generator Troubleshooting');
console.log('=====================================\n');

// 1. Check Node version
console.log('1️⃣ Checking Node.js version...');
console.log(`   Current version: ${process.version}`);
if (parseInt(process.version.split('.')[0].substring(1)) < 14) {
  console.warn('   ⚠️ Warning: Node.js 14+ recommended');
} else {
  console.log('   ✅ Node version OK');
}

// 2. Check environment
console.log('\n2️⃣ Checking environment...');
console.log(`   Working directory: ${__dirname}`);
console.log(`   .env file exists: ${require('fs').existsSync('.env')}`);

// 3. Check API key
console.log('\n3️⃣ Checking OpenAI API key...');
if (!process.env.OPENAI_API_KEY) {
  console.error('   ❌ No API key found in .env file');
  console.error('   Please add: OPENAI_API_KEY=your-key-here');
  process.exit(1);
}

const key = process.env.OPENAI_API_KEY;
console.log(`   ✅ API key found`);
console.log(`   Key format: ${key.substring(0, 3)}-****-${key.substring(key.length - 4)}`);
console.log(`   Key length: ${key.length} characters`);

// Check if it looks like a valid key
if (!key.startsWith('sk-')) {
  console.warn('   ⚠️ Warning: OpenAI keys usually start with "sk-"');
}

// 4. Check OpenAI module
console.log('\n4️⃣ Checking OpenAI module...');
let OpenAI;
try {
  OpenAI = require('openai');
  console.log('   ✅ OpenAI module loaded');
} catch (error) {
  console.error('   ❌ OpenAI module not found');
  console.error('   Run: npm install openai');
  process.exit(1);
}

// 5. Test API connection
console.log('\n5️⃣ Testing OpenAI API connection...');

async function testAPI() {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
  
  // Test 1: Simple chat completion
  console.log('\n   📝 Test 1: Chat completion...');
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Reply with just: OK" }
      ],
      max_tokens: 10
    });
    
    const response = completion.choices[0].message.content;
    console.log(`   ✅ Chat works! Response: "${response}"`);
  } catch (error) {
    console.error('   ❌ Chat test failed:', error.message);
    if (error.message.includes('401')) {
      console.error('   💡 This is an authentication error. Your API key may be invalid.');
    } else if (error.message.includes('429')) {
      console.error('   💡 Rate limit hit. Wait a moment and try again.');
    } else if (error.message.includes('insufficient_quota')) {
      console.error('   💡 Your OpenAI account has no credits. Add billing at platform.openai.com');
    }
    return false;
  }
  
  // Test 2: DALL-E 3 access
  console.log('\n   🎨 Test 2: DALL-E 3 image generation...');
  try {
    console.log('      Creating test image (this costs ~$0.04)...');
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple colorful geometric pattern, abstract art, minimal",
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    
    if (imageResponse.data && imageResponse.data[0]) {
      const url = imageResponse.data[0].url;
      console.log(`   ✅ DALL-E 3 works!`);
      console.log(`      Image URL: ${url.substring(0, 50)}...`);
      
      // Try to save a test image
      console.log('\n   💾 Test 3: Saving test image...');
      const fs = require('fs');
      const path = require('path');
      const testDir = path.join(__dirname, 'test-output');
      
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      // Download and save test image
      if (typeof fetch !== 'undefined') {
        try {
          const imgResponse = await fetch(url);
          const arrayBuffer = await imgResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const testImagePath = path.join(testDir, 'test-image.jpg');
          fs.writeFileSync(testImagePath, buffer);
          console.log(`   ✅ Test image saved to: test-output/test-image.jpg`);
        } catch (err) {
          console.log('   ⚠️ Could not save test image:', err.message);
        }
      } else {
        console.log('   ℹ️ Fetch not available, skipping download test');
      }
      
      return true;
    }
  } catch (error) {
    console.error('   ❌ DALL-E 3 test failed:', error.message);
    
    if (error.message.includes('billing')) {
      console.error('   💡 Billing issue detected. Check your OpenAI account.');
      console.error('      Visit: https://platform.openai.com/account/billing');
    } else if (error.message.includes('insufficient_quota')) {
      console.error('   💡 No credits for DALL-E 3. Add funds to your OpenAI account.');
    } else if (error.message.includes('model_not_found')) {
      console.error('   💡 DALL-E 3 may not be available on your account.');
    }
    
    return false;
  }
  
  return true;
}

// 6. Check file system
console.log('\n6️⃣ Checking file system...');
const fs = require('fs');
const path = require('path');

const draftsDir = path.join(__dirname, 'drafts');
try {
  if (!fs.existsSync(draftsDir)) {
    fs.mkdirSync(draftsDir, { recursive: true });
    console.log('   ✅ Created drafts directory');
  } else {
    console.log('   ✅ Drafts directory exists');
  }
  
  // Test write permissions
  const testFile = path.join(draftsDir, 'test.txt');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('   ✅ Write permissions OK');
} catch (error) {
  console.error('   ❌ File system error:', error.message);
}

// Run the async tests
testAPI().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('🎉 All tests passed! Your setup is ready.');
    console.log('\nYou can now run: node generate-carousel.js');
  } else {
    console.log('⚠️ Some tests failed. Please fix the issues above.');
    console.log('\nCommon solutions:');
    console.log('1. Check your API key is valid');
    console.log('2. Ensure you have credits at platform.openai.com');
    console.log('3. Verify DALL-E 3 is available on your account');
  }
  console.log('='.repeat(50));
});