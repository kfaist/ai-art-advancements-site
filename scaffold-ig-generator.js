const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dir = p => path.join(root, p);
const write = (filePath, content) => {
const full = dir(filePath);
fs.mkdirSync(path.dirname(full), { recursive: true });
fs.writeFileSync(full, content.replace(/\r?\n/g, '\n'), 'utf8');
console.log('Wrote', filePath);
};

const files = {
'tools/ig-generator/.env.example': OPENAI_API_KEY=your-openai-key ,
'tools/ig-generator/.gitignore': drafts/ .env *.jpg *.png *.log ,
'tools/ig-generator/run.bat': @echo off setlocal cd /d %~dp0 if not exist "node_modules" (   echo Installing dependencies...   npm i ) if not exist ".env" (   echo .env not found in tools\\ig-generator. Copy .env.example to .env and add OPENAI_API_KEY.   pause   exit /b 1 ) node variety.js echo. echo Done. Drafts are in %cd%\\drafts pause ,
'tools/ig-generator/migrate-ps-json.js': `const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'tools', 'ig-generator');

function findLatestContentQueue() {
const files = fs.readdirSync(ROOT)
.filter(f => f.startsWith('content_queue_') && f.endsWith('.json'))
.map(f => ({ f, mtime: fs.statSync(path.join(ROOT, f)).mtime }))
.sort((a, b) => b.mtime - a.mtime);
return files[0]?.f || null;
}

const latest = findLatestContentQueue();
if (!latest) {
console.error('No content_queue_*.json found at repo root. Copy one here and re-run.');
process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, latest), 'utf8'));
const tasks = raw.map(p => ({
title: p.Story?.Title || '',
description: p.Story?.Description || '',
url: p.Story?.Url || '',
account: (p.Account === 'nonprofit_ai') ? 'nonprofit' : 'art'
}));

fs.writeFileSync(path.join(OUT_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2), 'utf8');
console.log(\`Wrote tools/ig-generator/tasks.json from ${latest}\`);
,   'tools/ig-generator/tasks.json': [
{
"title": "Stable Diffusion 3.1 Drops with Text-to-3D Generation",
"description": "Stable Diffusion 3.1 released with ChromaBoost for hyper-vibrant colors and built-in text-to-3D generation. Artists can now create 3D neon scenes directly from prompts without external 3D software.",
"url": "https://huggingface.co/stabilityai/stable-diffusion-3.1",
"account": "art"
},
{
"title": "NASA and Hugging Face Open-Source AI for Solar Storm Prediction",
"description": "NASA, IBM, and Hugging Face released Surya, an open-source AI model that predicts solar storms to protect GPS systems, power grids, and satellites with 90% accuracy.",
"url": "https://www.ibm.com/blog/nasa-ibm-huggingface-solar-weather-ai",
"account": "nonprofit"
},
{
"title": "MIT and Hugging Face Turn Research Papers into Interactive AI Agents",
"description": "Paper2Agent framework converts static research papers into dynamic, interactive AI systems that can answer questions, run code, and generate visualizations from the paper's data.",
"url": "https://huggingface.co/blog/paper2agent",
"account": "art"
},
{
"title": "TouchDesigner + AI for Real-Time 3D Projection Mapping",
"description": "Artists are combining TouchDesigner with AI models to create immersive, real-time 3D projection mapping installations for live events and gallery spaces.",
"url": "https://derivative.ca/community-post/tutorial/ai-projection-mapping",
"account": "art"
},
{
"title": "Hugging Face Neon Noir LoRA for Cyberpunk Aesthetics",
"description": "Trending LoRA this week creates cyberpunk, high-contrast, neon-lit images with electric blue and magenta color palettes perfect for day-glo aesthetics.",
"url": "https://huggingface.co/models?search=neon+noir",
"account": "art"
},
{
"title": "BeeBrainNet: Ultra-Efficient AI Inspired by Bee Neurology",
"description": "Researchers trained a tiny AI model on bee brain patterns to recognize visual sequences with 98% accuracy using 100,000x fewer neurons than traditional AI. Could revolutionize low-power AI for drones and environmental sensors.",
"url": "https://arxiv.org/abs/2510.00123",
"account": "nonprofit"
}
]
,   'tools/ig-generator/variety.js': const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const HERE = __dirname;
const DRAFTS_DIR = path.join(HERE, 'drafts');
fs.mkdirSync(DRAFTS_DIR, { recursive: true });

const ACCOUNTS = {
art: {
bgColors: { primary: '#0a0014', secondary: '#1a0033' },
textColors: { primary: '#ff3bf7', secondary: '#35e2ff' },
font: 'Poppins',
hashtags: '#AIArt #GenerativeAI #3DArt #DigitalArt #TouchDesigner #Cyberpunk'
},
nonprofit: {
bgColors: { primary: '#001a10', secondary: '#00330a' },
textColors: { primary: '#2bff88', secondary: '#ff7a1a' },
font: 'Inter',
hashtags: '#AIForGood #OpenSource #TechForGood #SocialImpact #Innovation'
}
};

const VISUAL_VARIETY = {
colorRotation: {
art: [
["magenta and cyan", "electric blue", "hot pink"],
["ultraviolet purple", "neon lime", "electric blue"],
["hot pink", "turquoise", "vivid yellow"],
["magenta", "laser blue", "digital purple"]
],
nonprofit: [
["toxic green", "radioactive orange", "amber"],
["laser lime", "volcanic orange", "amber yellow"],
["emerald green", "burnt orange", "golden amber"],
["jade green", "sunset orange", "digital gold"]
]
},
subjectVariants: {
"3d": [
"3D holographic glowing orbs emerging from a digital canvas",
"floating crystalline geometric shapes suspended in digital space",
"translucent 3D polygons with data flowing through them",
"shimmering digital terrain with vibrant data visualization peaks"
],
"brain": [
"bioluminescent neural network with hexagonal patterns",
"geometric brain structure with flowing energy pathways",
"organic neural pathways with bursts of synaptic activity",
"crystalline brain structure with fibonacci patterned connections"
],
"research": [
"glowing research paper transforming into AI agents",
"digital manuscript unfolding into interactive 3D visualizations",
"floating research equations morphing into holographic entities",
"scientific diagrams self-organizing into interactive systems"
],
"projection": [
"360-degree immersive projection mapping dome",
"architectural space transformed by layers of projected light",
"geometric light patterns cascading across dimensional surfaces",
"volumetric light sculptures forming in negative space"
],
"cyberpunk": [
"cyberpunk cityscape with neon signs and rain-soaked streets",
"futuristic urban canyon with holographic billboards",
"high-tech nightclub interior with laser grid patterns",
"digital marketplace with floating UI elements and avatars"
],
"data": [
"solar flare with glowing data streams",
"digital hurricane of flowing information particles",
"crystalline data structure with energy pulses",
"organic data bloom with mathematical patterns"
]
},
compositions: [
"central focus with radial energy",
"asymmetrical diagonal energy flow",
"layered planes with depth recession",
"circular orbital patterns around focal point",
"mirrored symmetry with energy emanation",
"fibonacci spiral pattern organization"
],
lighting: [
"volumetric rays with particle effects",
"rim lighting with chromatic aberration",
"backlighting with lens flare elements",
"dramatic spotlights with volumetric fog",
"global illumination with subsurface glow"
],
effects: [
"chromatic aberration at 200% intensity",
"light refraction through prismatic surfaces",
"quantum glitch distortion fields",
"holographic interference patterns",
"digital data corruption aesthetic",
"scanner glow effect with scanlines"
],
textSlideStyles: [
{ name: "minimal", bgStyle: "gradient", elementCount: 5 },
{ name: "data-rich", bgStyle: "grid", elementCount: 15 },
{ name: "maximal", bgStyle: "particles", elementCount: 25 }
]
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const ensure = (v, name) => { if (!v) throw new Error(\`Missing ${name}\`); return v; };

function generateVariedImagePrompt(topic, accountType) {
ensure(ACCOUNTS[accountType], \`account config for ${accountType}\`);
const t = topic.title || "";
let category = "default";
if (/diffusion|stable|3d|model/i.test(t)) category = "3d";
else if (/brain|neural|network/i.test(t)) category = "brain";
else if (/research|paper|study/i.test(t)) category = "research";
else if (/projection|mapping|touchdesigner/i.test(t)) category = "projection";
else if (/cyberpunk|noir|lora|neon/i.test(t)) category = "cyberpunk";
else if (/data|stream|solar|weather/i.test(t)) category = "data";

const paletteSet = pick(VISUAL_VARIETY.colorRotation[accountType]);
const colors = pick(paletteSet);

let subject = "futuristic innovation lab with holographic displays";
if (VISUAL_VARIETY.subjectVariants[category]) subject = pick(VISUAL_VARIETY.subjectVariants[category]);

const composition = pick(VISUAL_VARIETY.compositions);
const lighting = pick(VISUAL_VARIETY.lighting);

const effectsCopy = [...VISUAL_VARIETY.effects];
const selectedEffects = [];
for (let i = 0; i < (1 + Math.floor(Math.random() * 2)) && effectsCopy.length; i++) {
const idx = Math.floor(Math.random() * effectsCopy.length);
selectedEffects.push(effectsCopy.splice(idx, 1)[0]);
}
const effectsString = selectedEffects.join(", ");

const spatial = (category === "projection" || category === "3d")
? ", 360-degree projection mapping, TouchDesigner-style real-time rendering, holographic depth"
: "";

return \`A surreal, dramatic, glowy, photorealistic scene featuring ${subject}, with ${composition} composition, bathed in ${colors} light, ${lighting}, ${effectsString}, maximum vibrancy, oversaturated to the max, cinematic volumetric lighting, 8K hyper-detail, ethereal glow, day-glo neon aesthetic, ultra-vibrant colors${spatial}, surreal yet hyperrealistic.\`;
}

async function generateImage(prompt) {
if (!process.env.OPENAI_API_KEY) return null;
try {
const res = await (new OpenAI({ apiKey: process.env.OPENAI_API_KEY })).images.generate({
model: 'gpt-image-1',
prompt,
size: '1024x1024'
});
const b64 = res.data?.[0]?.b64_json;
if (!b64) return null;
return Buffer.from(b64, 'base64');
} catch (e) {
console.error('Image gen failed:', e?.response?.data || e.message);
return null;
}
}

async function createVariedTextSlide(text, accountType, slideNumber) {
const width = 1080, height = 1080;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
const account = ensure(ACCOUNTS[accountType], \`account ${accountType}\`);
const style = VISUAL_VARIETY.textSlideStyles[slideNumber % VISUAL_VARIETY.textSlideStyles.length];

if (style.bgStyle === "gradient") {
const g = ctx.createLinearGradient(0, 0, width, height);
g.addColorStop(0, account.bgColors.primary);
g.addColorStop(1, account.bgColors.secondary);
ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
} else if (style.bgStyle === "grid") {
ctx.fillStyle = account.bgColors.primary; ctx.fillRect(0, 0, width, height);
ctx.strokeStyle = account.textColors.secondary; ctx.globalAlpha = 0.2; ctx.lineWidth = 2;
const grid = 50;
for (let x = 0; x < width; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
for (let y = 0; y < height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
ctx.globalAlpha = 1.0;
} else if (style.bgStyle === "particles") {
ctx.fillStyle = account.bgColors.primary; ctx.fillRect(0, 0, width, height);
for (let i = 0; i < 200; i++) {
const x = Math.random() * width, y = Math.random() * height, r = Math.random() * 3 + 1;
ctx.fillStyle = account.textColors.secondary; ctx.globalAlpha = Math.random() * 0.5 + 0.1;
ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
ctx.globalAlpha = 1.0;
}

ctx.globalAlpha = 0.4;
for (let i = 0; i < style.elementCount; i++) {
if (style.name === "minimal") {
const x = Math.random() * width, y = Math.random() * height, radius = Math.random() * 50 + 20;
const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
const color = (i % 2 === 0) ? account.textColors.primary : account.textColors.secondary;
glow.addColorStop(0, color); glow.addColorStop(1, 'transparent');
ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
} else if (style.name === "data-rich") {
const x1 = Math.random() * width, y1 = Math.random() * height;
const x2 = x1 + (Math.random() * 200 - 100), y2 = y1 + (Math.random() * 200 - 100);
const color = (i % 2 === 0) ? account.textColors.primary : account.textColors.secondary;
ctx.strokeStyle = color; ctx.lineWidth = Math.random() * 2 + 1;
ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();
} else if (style.name === "maximal") {
const cx = Math.random() * width, cy = Math.random() * height;
const size = Math.random() * 80 + 20, sides = Math.floor(Math.random() * 5) + 3;
const color = (i % 2 === 0) ? account.textColors.primary : account.textColors.secondary;
ctx.fillStyle = color; ctx.beginPath();
ctx.moveTo(cx + size * Math.cos(0), cy + size * Math.sin(0));
for (let j = 1; j <= sides; j++) {
const a = j * 2 * Math.PI / sides;
ctx.lineTo(cx + size * Math.cos(a), cy + size * Math.sin(a));
}
ctx.closePath(); ctx.globalAlpha = Math.random() * 0.3 + 0.1; ctx.fill();
}
}
ctx.globalAlpha = 1.0;

const [title, ...rest] = String(text).split(':');
const content = rest.join(':').trim();

ctx.textAlign = 'center';
ctx.fillStyle = account.textColors.primary;
ctx.shadowColor = account.textColors.primary;

const titleSize = 64;
ctx.font = \`bold ${titleSize}px ${account.font}, Arial, sans-serif\`;
ctx.shadowBlur = 14;
const titleY = height / 3;
ctx.fillText(title, width / 2, titleY);

ctx.shadowBlur = 8;
ctx.fillStyle = account.textColors.secondary;
const contentSize = 44;
ctx.font = \`bold ${contentSize}px ${account.font}, Arial, sans-serif\`;

const maxWidth = width * 0.85;
const words = content.split(' ');
let line = '', y = titleY + 100;
for (const w of words) {
const test = line + w + ' ';
if (ctx.measureText(test).width > maxWidth && line !== '') {
ctx.fillText(line.trim(), width / 2, y); line = w + ' '; y += 60;
} else {
line = test;
}
}
if (line) ctx.fillText(line.trim(), width / 2, y);

if (style.name === "maximal") {
ctx.lineWidth = 3; ctx.strokeStyle = account.textColors.primary;
ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(130, 30); ctx.moveTo(30, 30); ctx.lineTo(30, 130); ctx.stroke();
ctx.beginPath(); ctx.moveTo(width - 30, height - 30); ctx.lineTo(width - 130, height - 30);
ctx.moveTo(width - 30, height - 30); ctx.lineTo(width - 30, height - 130); ctx.stroke();
}

return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

function buildCaption(topic) {
const title = topic.title || '';
let caption = title;
if (/stable diffusion/i.test(title)) caption = "Stable Diffusion 3.1 just changed the game. Text-to-3D is here.";
else if (/nasa/i.test(title)) caption = "NASA + Hugging Face just gave your tech a cosmic shield.";
else if (/paper2agent/i.test(title)) caption = "MIT + Hugging Face turned research papers into AI you can talk to.";
else if (/touchdesigner/i.test(title)) caption = "TouchDesigner + AI = real-time 3D art you can step into.";
else if (/bee/i.test(title)) caption = "Scientists trained an AI on bee brains. The results are wild.";
else if (/noir|lora/i.test(title)) caption = "This LoRA turns any image into a neon-drenched masterpiece.";
const acct = ACCOUNTS[topic.account];
caption += \`\n\n${acct.hashtags}\`;
return caption;
}

function buildImpact(title) {
if (/diffusion|3d|lora/i.test(title)) return "Artists can now create without traditional 3D software - AI does it all.";
if (/nasa|solar|weather/i.test(title)) return "Critical infrastructure like GPS and power grids just got cosmic protection.";
if (/mit|research|paper/i.test(title)) return "Science becomes interactive - no more static PDFs.";
if (/touchdesigner|projection/i.test(title)) return "Live events and installations are entering a new dimension of immersivity.";
if (/bee|efficient|neurology/i.test(title)) return "Nature-inspired AI could power the next generation of low-energy devices.";
return "This changes how we think about AI applications in the real world.";
}

function sanitize(name) {
return String(name || '').substring(0, 30).replace(/[^a-z0-9]/gi, '_');
}

async function createDraftPost(topic) {
console.log(\`Creating draft post for: ${topic.title}\`);
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const folderName = \`\${timestamp}-\${topic.account}-\${sanitize(topic.title)}\`;
const draftFolder = path.join(DRAFTS_DIR, folderName);
const carouselFolder = path.join(draftFolder, 'carousel');
fs.mkdirSync(carouselFolder, { recursive: true });

const imagePrompt = generateVariedImagePrompt(topic, topic.account);
fs.writeFileSync(path.join(draftFolder, '01_prompt.txt'), imagePrompt, 'utf8');

const imgBuf = await generateImage(imagePrompt);
const coverPath = path.join(carouselFolder, '01_cover.jpg');
if (imgBuf) {
fs.writeFileSync(coverPath, imgBuf);
} else {
const cover = createCanvas(1080, 1080);
const ctx = cover.getContext('2d');
const acct = ACCOUNTS[topic.account];
const g = ctx.createLinearGradient(0, 0, 1080, 1080);
g.addColorStop(0, acct.bgColors.primary);
g.addColorStop(1, acct.bgColors.secondary);
ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1080);
ctx.fillStyle = acct.textColors.primary; ctx.textAlign = 'center';
ctx.font = \`bold 56px ${acct.font}, Arial, sans-serif\`;
ctx.fillText('Cover image pending', 540, 540);
fs.writeFileSync(coverPath, cover.toBuffer('image/jpeg', { quality: 0.95 }));
}

const caption = buildCaption(topic);
fs.writeFileSync(path.join(draftFolder, 'caption.txt'), caption, 'utf8');

const context = (topic.description || '').split('.')[0] + '.';
const impact = buildImpact(topic.title || '');

const slides = [
{ fname: '02_context.jpg', text: \`THE CONTEXT: ${context}\` },
{ fname: '03_impact.jpg', text: \`WHY IT MATTERS: ${impact}\` },
{ fname: '04_readmore.jpg', text: \`READ MORE: ${topic.url || ''}\` }
];

for (let i = 0; i < slides.length; i++) {
const buf = await createVariedTextSlide(slides[i].text, topic.account, i + 1);
fs.writeFileSync(path.join(carouselFolder, slides[i].fname), buf);
}

const meta = {
title: topic.title,
url: topic.url,
account: topic.account,
prompt: imagePrompt,
caption,
files: ['01_cover.jpg', '02_context.jpg', '03_impact.jpg', '04_readmore.jpg']
};
fs.writeFileSync(path.join(draftFolder, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log(\`Draft ready: ${draftFolder}\`);
}

async function run() {
const HERE = __dirname;
const tasksPath = path.join(HERE, 'tasks.json');
if (!fs.existsSync(tasksPath)) {
console.error('tasks.json not found in tools/ig-generator. Create it or run npm run migrate.');
process.exit(1);
}
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
for (const t of tasks) {
await createDraftPost(t);
}
}
run().catch(err => { console.error(err); process.exit(1); });
`;

// Write files
Object.entries(files).forEach(([p, c]) => write(p, c));

// Try to merge scripts/deps into root package.json (non-destructive)
const pkgPath = dir('package.json');
try {
if (fs.existsSync(pkgPath)) {
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
if (!pkg.scripts['ig:generate']) pkg.scripts['ig:generate'] = 'node tools/ig-generator/variety.js';
if (!pkg.scripts['ig:migrate']) pkg.scripts['ig:migrate'] = 'node tools/ig-generator/migrate-ps-json.js';
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies.canvas = pkg.dependencies.canvas || '^2.11.2';
pkg.dependencies.dotenv = pkg.dependencies.dotenv || '^16.4.5';
pkg.dependencies.openai = pkg.dependencies.openai || '^4.58.1';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('Updated package.json with scripts and deps.');
} else {
console.log('No package.json at repo root. You can still cd tools/ig-generator and run: npm i && node variety.js');
}
} catch (e) {
console.warn('Could not update package.json:', e.message);
}

console.log('\nScaffold complete.\nNext:');
console.log('1) cd tools/ig-generator');
console.log('2) copy .env.example .env   (then edit .env and add your OPENAI_API_KEY)');
console.log('3) npm i');
console.log('4) node variety.js   (or double-click run.bat)');
console.log('Drafts will appear in tools/ig-generator/drafts/');
