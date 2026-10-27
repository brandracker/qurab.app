const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const seedsDir = path.join(__dirname, '..', 'serene-union-app', 'public', 'seeds');
const thumbsDir = path.join(seedsDir, 'thumbs');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

async function generateThumbnails() {
  const files = fs.readdirSync(seedsDir).filter(file => {
    return /\.(jpe?g|png)$/i.test(file);
  });

  console.log(`Found ${files.length} seed images in ${seedsDir}. Generating 140x140 WebP thumbnails...`);

  let totalOriginalBytes = 0;
  let totalThumbBytes = 0;

  for (const file of files) {
    const srcPath = path.join(seedsDir, file);
    const destName = file.replace(/\.(jpe?g|png)$/i, '.webp');
    const destPath = path.join(thumbsDir, destName);

    const srcStat = fs.statSync(srcPath);
    totalOriginalBytes += srcStat.size;

    await sharp(srcPath)
      .resize(140, 140, {
        fit: 'cover',
        position: sharp.strategy.entropy // Focus on faces/interesting detail
      })
      .webp({ quality: 80, effort: 4 })
      .toFile(destPath);

    const destStat = fs.statSync(destPath);
    totalThumbBytes += destStat.size;

    console.log(`✓ ${file} (${Math.round(srcStat.size / 1024)}KB) -> thumbs/${destName} (${Math.round(destStat.size / 1024)}KB)`);
  }

  const origMB = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const thumbMB = (totalThumbBytes / (1024 * 1024)).toFixed(2);
  const savings = Math.round((1 - totalThumbBytes / totalOriginalBytes) * 100);

  console.log(`\n🎉 Success! Generated ${files.length} thumbnails.`);
  console.log(`Original total: ${origMB} MB`);
  console.log(`Thumbnails total: ${thumbMB} MB (${savings}% bandwidth saved!)`);
}

generateThumbnails().catch(err => {
  console.error('Error generating thumbnails:', err);
  process.exit(1);
});
