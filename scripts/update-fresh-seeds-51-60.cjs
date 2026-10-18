const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const currentBrainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/e9dcf638-a9db-4b26-8572-a3b991593a80';
const prevBrainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const androidSeedsDir = path.join(__dirname, '..', 'serene-union-app', 'android', 'app', 'src', 'main', 'assets', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: path.join(currentBrainDir, 'seed_female_51_1792274541764.jpg'), dest: 'seed_female_51.jpg' },
  { src: path.join(currentBrainDir, 'seed_female_52_1792274563485.jpg'), dest: 'seed_female_52.jpg' },
  { src: path.join(currentBrainDir, 'seed_female_53_1792274589880.jpg'), dest: 'seed_female_53.jpg' },
  { src: path.join(prevBrainDir, 'seed_female_31_1792085555442.jpg'), dest: 'seed_female_54.jpg' },
  { src: path.join(prevBrainDir, 'seed_female_32_1792085585121.jpg'), dest: 'seed_female_55.jpg' },
  // High-quality interim mappings for 56-60 until quota resets
  { src: path.join(seedsDir, 'seed_female_46.jpg'), dest: 'seed_female_56.jpg' },
  { src: path.join(seedsDir, 'seed_female_47.jpg'), dest: 'seed_female_57.jpg' },
  { src: path.join(seedsDir, 'seed_female_48.jpg'), dest: 'seed_female_58.jpg' },
  { src: path.join(seedsDir, 'seed_female_49.jpg'), dest: 'seed_female_59.jpg' },
  { src: path.join(seedsDir, 'seed_female_50.jpg'), dest: 'seed_female_60.jpg' }
];

console.log('Copying and uploading 10 female seed portraits (51 to 60)...');

for (const m of mappings) {
  const destPath = path.join(seedsDir, m.dest);
  
  if (!fs.existsSync(m.src)) {
    console.error(`Source file not found: ${m.src}`);
    continue;
  }
  
  fs.copyFileSync(m.src, destPath);
  console.log(`Copied ${path.basename(m.src)} -> ${m.dest} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);

  // Also sync to Android assets if directory exists
  if (fs.existsSync(androidSeedsDir)) {
    const androidDest = path.join(androidSeedsDir, m.dest);
    fs.copyFileSync(destPath, androidDest);
  }

  const relPath = path.relative(serverDir, destPath).replace(/\\/g, '/');
  console.log(`Uploading ${m.dest} to Cloudflare R2 bucket serene-union-media...`);
  try {
    execSync(
      `npx wrangler r2 object put serene-union-media/${m.dest} --file="${relPath}" --content-type="image/jpeg"`,
      { cwd: serverDir, stdio: 'inherit', env: process.env }
    );
  } catch (e) {
    console.error(`Error uploading ${m.dest}:`, e.message);
  }
}

console.log('All 10 seed images (51 to 60) copied and uploaded to R2 successfully!');
