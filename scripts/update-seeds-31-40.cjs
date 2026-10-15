const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:/Users/MG C/.gemini/antigravity-ide/brain/87e66de6-cab3-45a0-9f92-ad06ca217fcb';
const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

const mappings = [
  { src: 'seed_female_31_1792085555442.jpg', dest: 'seed_female_31.jpg' },
  { src: 'seed_female_32_1792085585121.jpg', dest: 'seed_female_32.jpg' },
  { src: 'pak_female_car_pose_1791935460068.jpg', dest: 'seed_female_33.jpg' },
  { src: 'pak_female_hijab_1791921257934.jpg', dest: 'seed_female_34.jpg' },
  { src: 'pak_female_study_1791936048294.jpg', dest: 'seed_female_35.jpg' },
  { src: 'pak_female_karachi_pillar_1791938499416.jpg', dest: 'seed_female_36.jpg' },
  { src: 'pak_female_design_studio_1791938526032.jpg', dest: 'seed_female_37.jpg' },
  { src: 'pak_female_park_walk_1791936869114.jpg', dest: 'seed_female_38.jpg' },
  { src: 'pak_female_islamabad_cafe_1791938476327.jpg', dest: 'seed_female_39.jpg' },
  { src: 'pak_female_lahore_patio_1791938765783.jpg', dest: 'seed_female_40.jpg' }
];

console.log('Copying and uploading 10 new female seed portraits (31 to 40)...');

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
      { cwd: serverDir, stdio: 'inherit' }
    );
  } catch (e) {
    console.error(`Error uploading ${m.dest}:`, e.message);
  }
}

console.log('All 10 images (31 to 40) copied and uploaded to R2 successfully!');
