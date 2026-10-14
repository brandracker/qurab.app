const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_female_17_1791998782821.jpg', dest: 'seed_female_17.jpg' },
  { src: 'seed_female_18_1791998818060.jpg', dest: 'seed_female_18.jpg' },
  { src: 'seed_female_19_1791998862221.jpg', dest: 'seed_female_19.jpg' },
  { src: 'seed_female_20_1791998907801.jpg', dest: 'seed_female_20.jpg' },
  { src: 'seed_female_21_1791998979999.jpg', dest: 'seed_female_21.jpg' },
  { src: 'seed_female_22_1791999003674.jpg', dest: 'seed_female_22.jpg' },
  { src: 'seed_female_23_1791999029157.jpg', dest: 'seed_female_23.jpg' },
  { src: 'seed_female_24_1791999062166.jpg', dest: 'seed_female_24.jpg' },
  { src: 'seed_female_25_1791999099246.jpg', dest: 'seed_female_25.jpg' }
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

console.log('All images (17 to 25) copied and uploaded to R2!');
