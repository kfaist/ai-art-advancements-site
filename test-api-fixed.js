// OpenAI API Test - Fixed ES Module Version
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

async function testAPI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
    console.log('❌ OpenAI API key not configured yet!');
    console.log('Please add your key to the .env file first.');
    return;
  }
  
  console.log('✅ API key found in .env file');
  console.log(`Key starts with: ${apiKey.substring(0, 10)}...`);
  console.log('Key length:', apiKey.length, 'characters');
  
  // Try a simple API call
  try {
    const openai = new OpenAI({ apiKey });
    
    console.log('\n📡 Testing connection to OpenAI...');
    const response = await openai.models.list();
    console.log('✅ Successfully connected to OpenAI!');
    console.log('Available models:', response.data.slice(0, 3).map(m => m.id).join(', '), '...');
    console.log('\n🎉 Your API key is working perfectly!');
    console.log('\nYou can now proceed with GitHub deployment!');
  } catch (error) {
    console.log('❌ Error connecting to OpenAI:', error.message);
    if (error.message.includes('401')) {
      console.log('This usually means the API key is invalid.');
    } else if (error.message.includes('429')) {
      console.log('Rate limit exceeded - but the key is valid!');
    }
    console.log('\nPlease verify your API key in the .env file.');
  }
}

testAPI();
