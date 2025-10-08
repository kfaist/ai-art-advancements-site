// Quick test to verify OpenAI API key is working
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
  } catch (error) {
    console.log('❌ Error connecting to OpenAI:', error.message);
    console.log('Please check that your API key is valid.');
  }
}

testAPI();
