import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchAIArtNews() {
  console.log('📰 Fetching latest AI art news...');
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `Find the 3 most interesting AI art/generative AI news stories from today or this week. 
      
      Focus on: new AI art tools, major announcements, breakthroughs in image generation, artist perspectives, legal/ethical debates.
      
      Return JSON: {"stories": [{"title": "Short headline (max 50 chars)", "summary": "2-3 sentences", "source": "Publication", "url": "https://real-url.com", "why_matters": "Why this matters", "hashtags": ["AIArt", "GenerativeAI", "tags"]}]}
      
      CRITICAL: URLs must be real and working.`
    }],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content).stories;
}

async function generateCarouselImages(stories) {
  console.log('🎨 Generating carousel images...');
  const images = [];
  
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const slideNum = i + 1;
    const isHeadlineSlide = (slideNum % 3 === 0);
    
    let prompt = isHeadlineSlide 
      ? `Create stunning abstract AI art with prominent text "${story.title}" in Space Mono font. Vibrant neon colors (cyan, magenta, electric blue, hot pink), high contrast, futuristic aesthetic, text must be large and readable.`
      : `Create stunning AI-generated art for: "${story.title}". Vibrant neon colors (cyan, magenta, electric blue, hot pink), abstract or surreal, futuristic tech-aesthetic, high visual impact for Instagram. NO text overlay - pure visual art.`;
    
    console.log(`  Generating slide ${slideNum}/${stories.length}${isHeadlineSlide ? ' (HEADLINE)' : ''}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "hd"
    });
    
    images.push({ 
      url: response.data[0].url, 
      slideNum, 
      isHeadline: isHeadlineSlide, 
      story: story.title 
    });
    
    if (i < stories.length - 1) await new Promise(r => setTimeout(r, 2000));
  }
  
  return images;
}

function generateInstagramCaption(stories) {
  let caption = `${stories[0].title}\n\n${stories[0].summary}\n\nWHY IT MATTERS: ${stories[0].why_matters}\n\n📖 READ MORE:\n`;
  stories.forEach((s, i) => { 
    caption += `${i+1}. ${s.title}\n   ${s.url}\n\n`; 
  });
  caption += `📰 Sources: ${stories.map(s => s.source).join(', ')}\n\n`;
  
  const tags = new Set();
  stories.forEach(s => s.hashtags.forEach(t => tags.add(t)));
  caption += Array.from(tags).slice(0, 15).map(t => `#${t}`).join(' ');
  
  return caption;
}

async function sendToZapier(data) {
  if (!process.env.ZAPIER_WEBHOOK_URL) {
    console.log('⚠️  No ZAPIER_WEBHOOK_URL, skipping');
    return;
  }
  
  try {
    const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log(response.ok ? '✅ Zapier notified!' : '⚠️  Zapier failed');
  } catch (error) {
    console.log('⚠️  Zapier error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Improved Instagram Carousel Generator\n');
  
  try {
    const stories = await fetchAIArtNews();
    console.log(`✅ Found ${stories.length} stories\n`);
    
    const images = await generateCarouselImages(stories);
    console.log(`✅ Generated ${images.length} images\n`);
    
    const caption = generateInstagramCaption(stories);
    console.log('✅ Caption created\n');
    
    const outputDir = 'output';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const output = {
      timestamp: new Date().toISOString(),
      stories, 
      images, 
      caption,
      metadata: {
        totalSlides: images.length,
        headlineSlides: images.filter(img => img.isHeadline).length,
        regularSlides: images.filter(img => !img.isHeadline).length
      }
    };
    
    fs.writeFileSync(path.join(outputDir, 'carousel-data.json'), JSON.stringify(output, null, 2));
    
    await sendToZapier({
      caption,
      images: images.map(img => img.url),
      stories: stories.map(s => ({ title: s.title, url: s.url })),
      timestamp: new Date().toISOString()
    });
    
    console.log('\n🎉 SUCCESS!\n📁 Output:', path.join(outputDir, 'carousel-data.json'));
    console.log('\n📱 CAPTION:\n' + '─'.repeat(50));
    console.log(caption);
    console.log('─'.repeat(50) + '\n🖼️  SLIDES:');
    images.forEach(img => {
      console.log(`  ${img.slideNum}. ${img.isHeadline ? '📰 HEADLINE:' : '🎨 ART:'} ${img.story}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
