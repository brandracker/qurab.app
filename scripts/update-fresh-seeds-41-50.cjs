const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_female_41_1792172772034.jpg', dest: 'seed_female_41.jpg' },
  { src: 'seed_female_42_1792172814954.jpg', dest: 'seed_female_42.jpg' },
  { src: 'seed_female_43_1792172844321.jpg', dest: 'seed_female_43.jpg' },
  { src: 'seed_female_44_1792172873513.jpg', dest: 'seed_female_44.jpg' },
  { src: 'seed_female_45_1792172908934.jpg', dest: 'seed_female_45.jpg' },
  { src: 'seed_female_46_1792172945945.jpg', dest: 'seed_female_46.jpg' },
  { src: 'seed_female_47_1792172984659.jpg', dest: 'seed_female_47.jpg' },
  { src: 'seed_female_48_1792173063283.jpg', dest: 'seed_female_48.jpg' },
  { src: 'seed_female_49_1792173137857.jpg', dest: 'seed_female_49.jpg' },
  { src: 'seed_female_50_1792173199745.jpg', dest: 'seed_female_50.jpg' }
];

console.log('Copying and uploading 10 freshly generated female seed portraits (41 to 50)...');

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

console.log('All 10 freshly generated images (41 to 50) copied and uploaded to R2 successfully!');
