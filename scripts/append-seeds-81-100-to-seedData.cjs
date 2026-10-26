const fs = require('fs');
const path = require('path');
const { profiles } = require('./generate-females-81-100-sql.cjs');

const seedDataPath = path.join(__dirname, '..', 'server', 'src', 'utils', 'seedData.ts');
let content = fs.readFileSync(seedDataPath, 'utf8');

const targetStr = "ed_female_80.jpg'\r\n  }\r\n];\r\n\r\nexport const PAKISTANI_MALE_SEEDS:";
const targetStrLf = "ed_female_80.jpg'\n  }\n];\n\nexport const PAKISTANI_MALE_SEEDS:";

const isCrlf = content.includes(targetStr);
const target = isCrlf ? targetStr : targetStrLf;
const eol = isCrlf ? '\r\n' : '\n';

if (!content.includes(target)) {
  console.error('Target pattern (seed_female_80.jpg) not found in seedData.ts');
  process.exit(1);
}

const tsSnippets = profiles.map(p => {
  return `  {` + eol +
    `    id: '${p.id}',` + eol +
    `    name: '${p.name.replace(/'/g, "\\'")}',` + eol +
    `    email: '${p.email}',` + eol +
    `    phone: '${p.phone}',` + eol +
    `    dob: '${p.dob}',` + eol +
    `    city: '${p.city}',` + eol +
    `    location: '${p.location.replace(/'/g, "\\'")}',` + eol +
    `    lat: ${p.lat},` + eol +
    `    lon: ${p.lon},` + eol +
    `    profession: '${p.profession.replace(/'/g, "\\'")}',` + eol +
    `    education: '${p.education.replace(/'/g, "\\'")}',` + eol +
    `    university: '${p.university.replace(/'/g, "\\'")}',` + eol +
    `    height: "${p.height.replace(/"/g, '\\"')}",` + eol +
    `    ethnicity: '${p.ethnicity.replace(/'/g, "\\'")}',` + eol +
    `    sect: '${p.sect}',` + eol +
    `    practiceLevel: '${p.practiceLevel}',` + eol +
    `    prayer: '${p.prayer}',` + eol +
    `    modesty: '${p.modesty.replace(/'/g, "\\'")}',` + eol +
    `    bio: '${p.bio.replace(/'/g, "\\'")}',` + eol +
    `    waliName: '${p.waliName.replace(/'/g, "\\'")}',` + eol +
    `    waliRelation: '${p.waliRelation}',` + eol +
    `    waliPhone: '${p.waliPhone}',` + eol +
    `    photo: '${p.photo}'` + eol +
    `  }`;
}).join(',' + eol);

const replacement = `ed_female_80.jpg'` + eol +
  `  },` + eol +
  tsSnippets + eol +
  `];` + eol + eol +
  `export const PAKISTANI_MALE_SEEDS:`;

const newContent = content.replace(target, replacement);

fs.writeFileSync(seedDataPath, newContent, 'utf8');
console.log('Successfully updated seedData.ts with female seeds 81 to 100!');
