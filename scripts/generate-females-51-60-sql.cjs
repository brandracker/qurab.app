const fs = require('fs');
const path = require('path');

const SEED_PASSWORD = 'QurbSeed@2026';
const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

const profiles = [
  {
    id: 'usr_seed_pk_51',
    name: 'Alizeh Shah Mir',
    email: 'alizeh.media@qurb.app',
    phone: '+923001234551',
    dob: '2006-04-18', // Age 20
    city: 'Islamabad',
    location: 'Sector F-7/1, Islamabad, Pakistan',
    lat: 33.7215,
    lon: 73.0560,
    profession: '2nd Year Media & Communications Student',
    education: 'BS Media Sciences (In Progress)',
    university: 'NUST Islamabad',
    height: "5'4\"",
    ethnicity: 'Punjabi / Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Mint Kurti & White Dupatta',
    bio: 'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
    waliName: 'Shahmir Farooq',
    waliRelation: 'Father',
    waliPhone: '+923009876551',
    photo: '/seeds/seed_female_51.jpg'
  },
  {
    id: 'usr_seed_pk_52',
    name: 'Hareem Tariq',
    email: 'hareem.cs@qurb.app',
    phone: '+923001234552',
    dob: '2005-08-20', // Age 21
    city: 'Lahore',
    location: 'DHA Phase 6, Lahore, Pakistan',
    lat: 31.4704,
    lon: 74.4287,
    profession: '3rd Year Computer Science Student',
    education: 'BS Computer Science (In Progress)',
    university: 'FAST-NUCES Lahore',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Lilac Co-ord Set & Dupatta',
    bio: 'CS student with a passion for web technologies, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
    waliName: 'Tariq Mahmood',
    waliRelation: 'Father',
    waliPhone: '+923009876552',
    photo: '/seeds/seed_female_52.jpg'
  },
  {
    id: 'usr_seed_pk_53',
    name: 'Dr. Iman Rafiq',
    email: 'iman.med@qurb.app',
    phone: '+923001234553',
    dob: '2004-03-25', // Age 22
    city: 'Rawalpindi',
    location: 'Bahria Town Phase 7, Rawalpindi, Pakistan',
    lat: 33.5186,
    lon: 73.1098,
    profession: '4th Year MBBS Medical Student',
    education: 'MBBS (Doctor of Medicine, 4th Year)',
    university: 'Rawalpindi Medical University (RMU)',
    height: "5'5\"",
    ethnicity: 'Potohari',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Rose Raw Silk & Chiffon Dupatta',
    bio: 'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
    waliName: 'Dr. Rafiq Ahmed',
    waliRelation: 'Father',
    waliPhone: '+923009876553',
    photo: '/seeds/seed_female_53.jpg'
  },
  {
    id: 'usr_seed_pk_54',
    name: 'Anoushey Siddiqui',
    email: 'anoushey.bba@qurb.app',
    phone: '+923001234554',
    dob: '2007-06-18', // Age 19
    city: 'Karachi',
    location: 'Clifton Block 2, Karachi, Pakistan',
    lat: 24.8157,
    lon: 67.0311,
    profession: '2nd Year BBA Marketing Student',
    education: 'BBA (In Progress)',
    university: 'IBA Karachi',
    height: "5'4\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Powder-Blue Linen Co-ord & Dupatta',
    bio: 'BBA student at IBA Karachi. Enthusiastic, loves literature, coastal walks, and baking. Firm believer in mutual respect and emotional harmony. Seeking a kind, responsible, and practicing spouse.',
    waliName: 'Kamran Siddiqui',
    waliRelation: 'Father',
    waliPhone: '+923009876554',
    photo: '/seeds/seed_female_54.jpg'
  },
  {
    id: 'usr_seed_pk_55',
    name: 'Laiba Noor',
    email: 'laiba.premed@qurb.app',
    phone: '+923001234555',
    dob: '2008-02-14', // Age 18
    city: 'Islamabad',
    location: 'Sector F-8/2, Islamabad, Pakistan',
    lat: 33.7155,
    lon: 73.0410,
    profession: 'Freshman Pre-Med & Biological Sciences Student',
    education: 'BS Biological Sciences (1st Year)',
    university: 'Quaid-i-Azam University (QAU Islamabad)',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Rose Lawn Kurti & White Dupatta',
    bio: 'Fresh university student with big dreams and humble roots. Deeply attached to family, loves nature and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
    waliName: 'Noor-ul-Hassan',
    waliRelation: 'Father',
    waliPhone: '+923009876555',
    photo: '/seeds/seed_female_55.jpg'
  },
  {
    id: 'usr_seed_pk_56',
    name: 'Zoya Rehman',
    email: 'zoya.arch@qurb.app',
    phone: '+923001234556',
    dob: '2003-09-05', // Age 23
    city: 'Lahore',
    location: 'Gulberg II, Lahore, Pakistan',
    lat: 31.5150,
    lon: 74.3520,
    profession: 'Junior Architect & Heritage Restoration Trainee',
    education: 'B.Arch (Architecture)',
    university: 'National College of Arts (NCA Lahore)',
    height: "5'6\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab (Taupe Modal Hijab & Linen Long Shirt)',
    bio: 'Junior architect working on heritage restoration and modern homes in Lahore. Modest hijabi with deep reverence for sunnah and family harmony. Looking for an educated, deen-conscious, and compassionate husband.',
    waliName: 'Rehman Bashir',
    waliRelation: 'Father',
    waliPhone: '+923009876556',
    photo: '/seeds/seed_female_56.jpg'
  },
  {
    id: 'usr_seed_pk_57',
    name: 'Malaika Jahangir',
    email: 'malaika.finance@qurb.app',
    phone: '+923001234557',
    dob: '2004-04-16', // Age 22
    city: 'Karachi',
    location: 'DHA Phase 6, Karachi, Pakistan',
    lat: 24.7930,
    lon: 67.0650,
    profession: 'Junior Financial Analyst & Economics Graduate',
    education: 'BSc Accounting & Finance',
    university: 'Institute of Business Administration (IBA Karachi)',
    height: "5'5\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Sage-Green Linen Co-ord & Chiffon Dupatta',
    bio: 'Fresh finance graduate working at a financial consultancy in Karachi. Balances modern corporate focus with traditional home warmth and daily prayers. Seeking a kind, dependable, and practicing gentleman.',
    waliName: 'Jahangir Alam',
    waliRelation: 'Father',
    waliPhone: '+923009876557',
    photo: '/seeds/seed_female_57.jpg'
  },
  {
    id: 'usr_seed_pk_58',
    name: 'Sehar Batool',
    email: 'sehar.ai@qurb.app',
    phone: '+923001234558',
    dob: '2005-02-14', // Age 21
    city: 'Peshawar',
    location: 'Hayatabad Phase 5, Peshawar, Pakistan',
    lat: 33.9820,
    lon: 71.4350,
    profession: '3rd Year AI & Data Science Student',
    education: 'BS Artificial Intelligence (In Progress)',
    university: 'FAST-NUCES Peshawar',
    height: "5'4\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Traditional Embroidered Kurti & Dupatta',
    bio: 'Pashtun AI student from Peshawar. Respectful of cultural heritage, passionate about computer vision and Islamic philosophy. Seeking an upright, well-mannered, and religious partner.',
    waliName: 'Inamullah Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876558',
    photo: '/seeds/seed_female_58.jpg'
  },
  {
    id: 'usr_seed_pk_59',
    name: 'Hiba Waqar',
    email: 'hiba.design@qurb.app',
    phone: '+923001234559',
    dob: '2006-10-08', // Age 20
    city: 'Faisalabad',
    location: 'Kohinoor City, Faisalabad, Pakistan',
    lat: 31.4250,
    lon: 73.1180,
    profession: '3rd Year Interior Design Student',
    education: 'B.Des Interior Architecture (In Progress)',
    university: 'GC University Faisalabad (GCUF)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Lilac Kurti & White Cigarette Pants',
    bio: 'Interior design student passionate about home aesthetics, Islamic architecture, and family comfort. Warm, cheerful, and down to earth. Looking for an educated, caring, and trustworthy partner.',
    waliName: 'Waqar Munir',
    waliRelation: 'Father',
    waliPhone: '+923009876559',
    photo: '/seeds/seed_female_59.jpg'
  },
  {
    id: 'usr_seed_pk_60',
    name: 'Eshal Fatima',
    email: 'eshal.lit@qurb.app',
    phone: '+923001234560',
    dob: '2007-12-03', // Age 19
    city: 'Multan',
    location: 'Cantt Officers Colony, Multan, Pakistan',
    lat: 30.1984,
    lon: 71.4687,
    profession: '2nd Year English Literature Student',
    education: 'BS English Literature & Linguistics (In Progress)',
    university: 'Bahauddin Zakariya University (BZU Multan)',
    height: "5'3\"",
    ethnicity: 'Punjabi / Siraiki',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Ivory & Peach Lawn Attire with Dupatta',
    bio: 'Literature student fond of classic poetry, nature photography, and family traditions. Gentle, cheerful, and regular with prayers. Seeking an educated, pious, and emotionally mature partner.',
    waliName: 'Col. (R) Tariq Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876560',
    photo: '/seeds/seed_female_60.jpg'
  }
];

let sql = `-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (51 - 60)
-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)
-- Human Touch v3.5 Standard
-- ====================================================================

`;

for (let i = 0; i < profiles.length; i++) {
  const p = profiles[i];
  const birthYear = parseInt(p.dob.split('-')[0], 10);
  const age = 2026 - birthYear;
  const minutesAgo = (i + 1) * 7; // Staggered recent activity for real-time live presence

  sql += `
-- Profile: ${p.name} (${p.city}, Age: ${age}, ${p.profession})
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  '${p.id}', '${p.phone}', '${p.email}', '${SEED_PASSWORD_HASH}',
  '${p.name}', '${p.dob}', 'female', '${p.location}', '${p.city}', 'Pakistan',
  ${p.lat}, ${p.lon}, '${p.height.replace(/'/g, "''")}',
  '${p.bio.replace(/'/g, "''")}',
  '${p.profession.replace(/'/g, "''")}', '${p.education.replace(/'/g, "''")}', '${p.university.replace(/'/g, "''")}',
  '${p.ethnicity}', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, '${SEED_PASSWORD}', 'active', 0, datetime('now', '-${minutesAgo} minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  '${p.id}', '${p.practiceLevel}', '${p.sect}', 'Hanafi', '${p.prayer}', 'Strictly Halal',
  'Regular with translation', '${p.modesty}', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_${p.id}', '${p.id}', '${p.waliName}', '${p.waliPhone}', '${p.waliRelation}', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_${p.id}_1', '${p.id}', '${p.photo}', 1, 1
);

UPDATE user_photos SET photo_url = '${p.photo}' WHERE user_id = '${p.id}';
`;
}

const outPath = path.join(__dirname, '..', 'db', 'seed_pakistani_females_51_60.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Saved SQL script to', outPath, 'size:', sql.length);

module.exports = { profiles };
