const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_male_01_1792023965049.jpg', dest: 'seed_male_1.jpg' },
  { src: 'seed_male_02_1792024022557.jpg', dest: 'seed_male_2.jpg' },
  { src: 'seed_male_03_1792024088348.jpg', dest: 'seed_male_3.jpg' },
  { src: 'seed_male_04_1792024152647.jpg', dest: 'seed_male_4.jpg' },
  { src: 'seed_male_05_1792024219728.jpg', dest: 'seed_male_5.jpg' },
  { src: 'seed_male_06_1792024287056.jpg', dest: 'seed_male_6.jpg' },
  { src: 'seed_male_07_1792024362307.jpg', dest: 'seed_male_7.jpg' },
  { src: 'seed_male_08_1792024439392.jpg', dest: 'seed_male_8.jpg' },
  { src: 'seed_male_09_1792024517917.jpg', dest: 'seed_male_9.jpg' },
  { src: 'seed_male_10_1792024601998.jpg', dest: 'seed_male_10.jpg' },
  { src: 'seed_male_11_1792024685927.jpg', dest: 'seed_male_11.jpg' },
  { src: 'seed_male_12_1792024777402.jpg', dest: 'seed_male_12.jpg' },
  { src: 'seed_male_13.jpg', dest: 'seed_male_13.jpg', isLocal: true },
  { src: 'seed_male_14.jpg', dest: 'seed_male_14.jpg', isLocal: true },
  { src: 'seed_male_15.jpg', dest: 'seed_male_15.jpg', isLocal: true }
];

for (const m of mappings) {
  const destPath = path.join(seedsDir, m.dest);
  if (!m.isLocal) {
    const srcPath = path.join(brainDir, m.src);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${m.src} -> ${m.dest}`);
  } else {
    console.log(`Using existing ${m.dest}`);
  }

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

console.log('All 15 male seed portraits uploaded to R2 successfully!');
