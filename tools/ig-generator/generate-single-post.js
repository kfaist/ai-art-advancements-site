import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchAIArtNews() {
  console.log('📰 Fetching latest AI art news...');
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `Find the most interesting AI art or generative AI news story from today or this week.
      
      Focus on: new AI art tools, major announcements, breakthroughs in image generation, artist perspectives.
      
      Return JSON with this structure:
      {
        "title": "Short punchy headline (max 60 chars)",
        "hook": "One compelling opening sentence",
        "context": "2-3 sentences explaining what happened",
        "why_matters": "2-3 sentences on impact and significance",
        "capabilities": "2-3 concrete details or capabilities",
        "source": "Publication name (TechCrunch, The Verge, etc.)",
        "url": "https://actual-working-url.com/article",
        "hashtags": ["AIArt", "GenerativeAI", "specific", "relevant", "tags"]
      }
      
      CRITICAL: URL must be real and working. Focus on concrete, specific information.`
    }],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

async function generateImage(story) {
  console.log('🎨 Generating stunning AI art image...');
  
  const prompt = `Create a stunning futuristic AI art image representing: "${story.title}"
  
  Style:
  - Vibrant neon colors (electric blue, hot pink, cyan, magenta)
  - Ultra-modern, tech-inspired aesthetic
  - Abstract or surreal interpretation
  - High visual impact for Instagram
  - Professional quality, magazine-worthy
  - NO text overlay - pure visual art
  - Dramatic lighting, trending on artstation
  
  Theme: ${story.context}`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "hd"
  });
  
  return response.data[0].url;
}

function generateInstagramCaption(story) {
  let caption = `${story.title}\n\n`;
  caption += `${story.hook}\n\n`;
  caption += `THE CONTEXT: ${story.context}\n\n`;
  caption += `WHY IT MATTERS: ${story.why_matters}\n\n`;
  caption += `THE CAPABILITIES: ${story.capabilities}\n\n`;
  caption += `READ MORE:\n${story.url}\n\n`;
  caption += `📰 Source: ${story.source}\n\n`;
  caption += story.hashtags.map(tag => `#${tag}`).join(' ');
  
  return caption;
}

async function sendToZapier(data) {
  if (!process.env.ZAPIER_WEBHOOK_URL) {
    console.log('⚠️  No ZAPIER_WEBHOOK_URL, skipping');
    return;
  }
  
  try {
    await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('✅ Zapier notified!');
  } catch (error) {
    console.log('⚠️  Zapier error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Instagram Post Generator\n');
  
  try {
    const story = await fetchAIArtNews();
    console.log(`✅ Found story: ${story.title}\n`);
    
    const imageUrl = await generateImage(story);
    console.log(`✅ Generated image\n`);
    
    const caption = generateInstagramCaption(story);
    console.log('✅ Caption created\n');
    
    const outputDir = 'drafts';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const postFolder = path.join(outputDir, `${timestamp}-post`);
    fs.mkdirSync(postFolder, { recursive: true });
    
    const output = {
      timestamp: new Date().toISOString(),
      story,
      imageUrl,
      caption
    };
    
    fs.writeFileSync(
      path.join(postFolder, 'post-data.json'), 
      JSON.stringify(output, null, 2)
    );
    
    fs.writeFileSync(
      path.join(postFolder, 'caption.txt'), 
      caption
    );
    
    await sendToZapier({
      caption,
      imageUrl,
      title: story.title,
      url: story.url,
      timestamp: new Date().toISOString()
    });
    
    console.log('\n🎉 SUCCESS!');
    console.log('📁 Output:', postFolder);
    console.log('\n📱 INSTAGRAM CAPTION:');
    console.log('─'.repeat(60));
    console.log(caption);
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
