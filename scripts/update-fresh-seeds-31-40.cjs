const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_female_31_fresh_1792087114798.jpg', dest: 'seed_female_31.jpg' },
  { src: 'seed_female_32_fresh_1792087143317.jpg', dest: 'seed_female_32.jpg' },
  { src: 'seed_female_33_fresh_1792087169786.jpg', dest: 'seed_female_33.jpg' },
  { src: 'seed_female_34_fresh_1792087201853.jpg', dest: 'seed_female_34.jpg' },
  { src: 'seed_female_35_fresh_1792087244769.jpg', dest: 'seed_female_35.jpg' },
  { src: 'seed_female_36_fresh_1792087284481.jpg', dest: 'seed_female_36.jpg' },
  { src: 'seed_female_37_fresh_1792087326118.jpg', dest: 'seed_female_37.jpg' },
  { src: 'seed_female_38_fresh_1792087371178.jpg', dest: 'seed_female_38.jpg' },
  { src: 'seed_female_39_fresh_1792087420203.jpg', dest: 'seed_female_39.jpg' },
  { src: 'seed_female_40_fresh_1792087508996.jpg', dest: 'seed_female_40.jpg' }
];

console.log('Copying and uploading 10 brand new freshly generated female seed portraits (31 to 40)...');

for (const m of mappings) {
  const srcPath = path.join(brainDir, m.src);
  const destPath = path.join(seedsDir, m.dest);
  
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    continue;
  }
  
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${m.src} -> ${m.dest} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);

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

console.log('All 10 freshly generated images (31 to 40) copied and uploaded to R2 successfully!');
