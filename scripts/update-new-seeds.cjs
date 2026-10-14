const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_female_26_1792000808688.jpg', dest: 'seed_female_26.jpg' },
  { src: 'seed_female_27_1792000862403.jpg', dest: 'seed_female_27.jpg' },
  { src: 'seed_female_28_1792000910587.jpg', dest: 'seed_female_28.jpg' },
  { src: 'seed_female_29_1792000967880.jpg', dest: 'seed_female_29.jpg' },
  { src: 'seed_female_30_1792020514873.jpg', dest: 'seed_female_30.jpg' }
];

for (const m of mappings) {
  const srcPath = path.join(brainDir, m.src);
  const destPath = path.join(seedsDir, m.dest);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${m.src} -> ${m.dest}`);

  const relPath = path.relative(serverDir, destPath).replace(/\\/g, '/');
  console.log(`Uploading ${m.dest} to Cloudflare R2...`);
  try {
    execSync(
      `npx wrangler r2 object put serene-union-media/${m.dest} --file="${relPath}" --content-type="image/jpeg"`,
      { cwd: serverDir, stdio: 'inherit' }
    );
  } catch (e) {
    console.error(`Error uploading ${m.dest}:`, e.message);
  }
}

console.log('All images (26 to 30) copied and uploaded to R2!');
