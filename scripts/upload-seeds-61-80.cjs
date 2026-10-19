const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const publicSeedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const serverDir = path.join(__dirname, '..', 'server');

console.log('Uploading female seed images 61 to 80 to Cloudflare R2 (serene-union-media)...');

for (let i = 61; i <= 80; i++) {
  const filename = `seed_female_${i}.jpg`;
  const filePath = path.join(publicSeedsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    continue;
  }

  const destPath = `serene-union-media/${filename}`;
  const relPath = path.relative(serverDir, filePath).replace(/\\/g, '/');

  console.log(`[${i}/80] Uploading ${filename}...`);
  try {
    execSync(
      `npx wrangler r2 object put ${destPath} --file="${relPath}" --content-type="image/jpeg"`,
      { cwd: serverDir, stdio: 'inherit' }
    );
  } catch (err) {
    console.error(`Failed uploading ${filename}:`, err.message);
  }
}

console.log('All 20 female seed images (61 to 80) uploaded to Cloudflare R2 successfully!');
