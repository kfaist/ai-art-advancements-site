import fs from 'fs';

async function fetchRepoMetadata(slug) {
  const url = `https://api.github.com/repos/${slug}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`❌ Failed to fetch ${slug}`);
      return null;
    }
    
    const data = await response.json();
    return {
      slug: slug,
      name: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      url: data.html_url,
      language: data.language,
      updated: data.pushed_at
    };
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error.message);
    return null;
  }
}

const seedData = JSON.parse(fs.readFileSync('data/repos-seed.json', 'utf8'));
console.log(`Fetching metadata for ${seedData.length} repositories...\n`);

const enriched = [];

for (const item of seedData) {
  process.stdout.write(`Fetching ${item.slug}... `);
  
  const metadata = await fetchRepoMetadata(item.slug);
  
  if (metadata) {
    console.log('✅');
    enriched.push({ ...item, metadata });
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

fs.writeFileSync('data/repos.json', JSON.stringify(enriched, null, 2));
console.log(`\n✅ Saved ${enriched.length} repositories to data/repos.json`);
