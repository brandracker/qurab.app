const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'pak_female_cafe_indoor_1791935984662.jpg', dest: 'seed_female_7.jpg' },
  { src: 'pak_female_study_1791936048294.jpg', dest: 'seed_female_8.jpg' }
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

console.log('Images 7 and 8 uploaded to R2!');
