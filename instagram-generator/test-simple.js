// SIMPLE TEST VERSION - Verify basics work first
import Parser from 'rss-parser';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 TESTING BASIC FUNCTIONALITY\n');

// Test 1: Check API key
console.log('1️⃣ Checking OpenAI API key...');
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not set!');
  process.exit(1);
}
console.log('✅ API key found\n');

// Test 2: Test RSS parsing
console.log('2️⃣ Testing RSS parser...');
const parser = new Parser();
try {
  const feed = await parser.parseURL('https://huggingface.co/blog/feed.xml');
  console.log(`✅ RSS works - got ${feed.items.length} items`);
  console.log(`   Latest: ${feed.items[0].title}\n`);
} catch (error) {
  console.error('❌ RSS failed:', error.message);
  process.exit(1);
}

// Test 3: Test OpenAI
console.log('3️⃣ Testing OpenAI connection...');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
try {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Say 'test successful' and nothing else" }],
    max_tokens: 10
  });
  console.log(`✅ OpenAI works: ${completion.choices[0].message.content}\n`);
} catch (error) {
  console.error('❌ OpenAI failed:', error.message);
  process.exit(1);
}

// Test 4: Test file writing
console.log('4️⃣ Testing file system...');
try {
  const outputDir = path.join(__dirname, 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const testFile = path.join(outputDir, 'test.json');
  fs.writeFileSync(testFile, JSON.stringify({ test: 'success' }, null, 2));
  
  console.log(`✅ File system works - wrote to ${testFile}\n`);
} catch (error) {
  console.error('❌ File system failed:', error.message);
  process.exit(1);
}

console.log('🎉 ALL TESTS PASSED!\n');
console.log('Ready to run full generator.');
