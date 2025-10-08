import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchTopAIArtStory() {
  console.log('📰 Finding the TOP AI art story of the day...');
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `Find THE SINGLE most impactful AI art/generative AI story from today or this week.
      
      Focus on: major announcements, breakthrough tools, artist perspectives, legal/ethical debates, industry shifts.
      
      Return JSON with ONE story:
      {
        "title": "Compelling headline (max 60 chars)",
        "hook": "Opening sentence that grabs attention",
        "context": "What happened - 2-3 sentences of clear facts",
        "why_matters": "The significance and impact - 2-3 sentences",
        "capabilities": "Concrete details - What can it do? What changed? 2-3 key points",
        "source": "Publication Name",
        "url": "https://real-working-url.com",
        "hashtags": ["AIArt", "GenerativeAI", "MachineLearning", "TechNews", "DigitalArt"]
      }
      
      CRITICAL: URL must be real and accessible.`
    }],
    response_format: { type: "json_object" }
  });
  
  const data = JSON.parse(completion.choices[0].message.content);
  return data.story || data;
}

async function generateFeaturedImage(story) {
  console.log('🎨 Generating stunning featured image...');
  
  const prompt = `Create a striking, high-impact AI-generated artwork inspired by: "${story.title}". 
  
  Style: Vibrant neon colors (cyan, magenta, electric blue, hot pink, purple), abstract or surreal composition, futuristic tech aesthetic, high visual drama perfect for Instagram. Premium quality, eye-catching, professional.
  
  NO text, NO words - pure visual art that captures the essence of this AI advancement.`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "hd"
  });
  
  return response.data[0].url;
}

function formatInstagramCaption(story) {
  let caption = `${story.title}\n\n`;
  caption += `${story.hook}\n\n`;
  caption += `THE CONTEXT:\n${story.context}\n\n`;
  caption += `WHY IT MATTERS:\n${story.why_matters}\n\n`;
  caption += `THE CAPABILITIES:\n${story.capabilities}\n\n`;
  caption += `READ MORE: ${story.url}\n\n`;
  caption += `📰 Source: ${story.source}\n\n`;
  
  // Ensure at least 5 hashtags
  const hashtags = story.hashtags.slice(0, 10);
  caption += hashtags.map(tag => `#${tag}`).join(' ');
  
  return caption;
}

async function sendToZapier(post) {
  if (!process.env.ZAPIER_WEBHOOK_URL) {
    console.log('⚠️  No ZAPIER_WEBHOOK_URL configured, skipping...');
    return;
  }
  
  try {
    const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'instagram_single_post',
        imageUrl: post.imageUrl,
        caption: post.caption,
        story: post.story,
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log('✅ Zapier webhook triggered successfully!');
    } else {
      console.log(`⚠️  Zapier webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.log('⚠️  Zapier error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Single Instagram Post Generator\n');
  
  try {
    // 1. Get the story
    const story = await fetchTopAIArtStory();
    console.log(`✅ Found story: "${story.title}"\n`);
    
    // 2. Generate the image
    const imageUrl = await generateFeaturedImage(story);
    console.log(`✅ Generated image\n`);
    
    // 3. Format caption
    const caption = formatInstagramCaption(story);
    console.log('✅ Caption formatted\n');
    
    // 4. Save output
    const output = {
      story,
      imageUrl,
      caption,
      generated: new Date().toISOString()
    };
    
    const outputDir = path.join(process.cwd(), 'instagram-generator', 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    
    const filename = `single-post-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(
      path.join(outputDir, filename),
      JSON.stringify(output, null, 2)
    );
    
    console.log(`✅ Saved to: ${filename}\n`);
    
    // 5. Preview
    console.log('📱 INSTAGRAM POST PREVIEW:\n');
    console.log('─'.repeat(50));
    console.log(caption);
    console.log('─'.repeat(50));
    console.log(`\n🖼️  Image: ${imageUrl}\n`);
    
    // 6. Send to Zapier
    await sendToZapier(output);
    
    console.log('🎉 Done! Ready to post to Instagram.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
