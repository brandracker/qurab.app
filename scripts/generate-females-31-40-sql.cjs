const fs = require('fs');
const path = require('path');

const SEED_PASSWORD = 'QurbSeed@2026';
const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

const profiles = [
  {
    id: 'usr_seed_pk_31',
    name: 'Mahnoor Tariq',
    email: 'mahnoor.cs@qurb.app',
    phone: '+923001234531',
    dob: '2007-03-18', // Age 19
    city: 'Lahore',
    location: 'Johar Town Phase 2, Lahore, Pakistan',
    lat: 31.4697,
    lon: 74.2728,
    profession: '2nd Year BS Computer Science Student',
    education: 'BS Computer Science (In Progress)',
    university: 'FAST-NUCES Lahore',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Contemporary Co-ord & Dupatta',
    bio: 'Assalamu Alaikum. 2nd-year CS student passionate about software development, digital illustration, and baking. Warm-hearted, respectful of elders, and grounded in Islamic values. Seeking a pious, kind, and supportive life partner who values mutual growth.',
    waliName: 'Tariq Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876531',
    photo: '/seeds/seed_female_31.jpg'
  },
  {
    id: 'usr_seed_pk_32',
    name: 'Dua Zahra',
    email: 'dua.psych@qurb.app',
    phone: '+923001234532',
    dob: '2006-08-24', // Age 20
    city: 'Islamabad',
    location: 'Sector F-10/2, Islamabad, Pakistan',
    lat: 33.6980,
    lon: 73.0125,
    profession: '3rd Year Psychology Student & Writer',
    education: 'BS Psychology (In Progress)',
    university: 'Quaid-i-Azam University (QAU Islamabad)',
    height: "5'5\"",
    ethnicity: 'Potohari / Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Shalwar Kameez & Dupatta',
    bio: 'Psychology student with a deep interest in human behavior, poetry, and family harmony. Calm, empathetic, and practicing. Seeking a gentle, educated, and deen-conscious partner to build a peaceful household with mutual respect.',
    waliName: 'Syed Zahid Hussain',
    waliRelation: 'Father',
    waliPhone: '+923009876532',
    photo: '/seeds/seed_female_32.jpg'
  },
  {
    id: 'usr_seed_pk_33',
    name: 'Areeba Fatima',
    email: 'areeba.bba@qurb.app',
    phone: '+923001234533',
    dob: '2005-02-12', // Age 21
    city: 'Karachi',
    location: 'DHA Phase 6, Karachi, Pakistan',
    lat: 24.7937,
    lon: 67.0645,
    profession: 'BBA Marketing Student & Boutique Designer',
    education: 'BBA Marketing (In Progress)',
    university: 'Institute of Business Administration (IBA Karachi)',
    height: "5'4\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest High-Street Pastel Attire',
    bio: 'BBA student at IBA, managing a modest pret boutique label on the side. Love photography, sea breezes, and reading Islamic history. Seeking a caring, ambitious, and practicing spouse who values family closeness.',
    waliName: 'Farhan Azmat',
    waliRelation: 'Father',
    waliPhone: '+923009876533',
    photo: '/seeds/seed_female_33.jpg'
  },
  {
    id: 'usr_seed_pk_34',
    name: 'Hania Imran',
    email: 'hania.biotech@qurb.app',
    phone: '+923001234534',
    dob: '2008-01-20', // Age 18
    city: 'Rawalpindi',
    location: 'Bahria Town Phase 4, Rawalpindi, Pakistan',
    lat: 33.5420,
    lon: 73.1180,
    profession: '1st Year Pre-Med / Biotechnology Student',
    education: 'BS Biotechnology (1st Year)',
    university: 'NUST Islamabad',
    height: "5'3\"",
    ethnicity: 'Pashtun / Niazi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Chiffon Hijab & Long Shirt',
    bio: 'Fresh university student at NUST. Soft-spoken, family-centered, fond of calligraphy and gardening. Firm in daily prayers and modesty. Looking for a practicing, respectful, and caring partner who upholds Islamic traditions.',
    waliName: 'Imran Khan Niazi',
    waliRelation: 'Father',
    waliPhone: '+923009876534',
    photo: '/seeds/seed_female_34.jpg'
  },
  {
    id: 'usr_seed_pk_35',
    name: 'Kinza Javed',
    email: 'kinza.pharm@qurb.app',
    phone: '+923001234535',
    dob: '2004-11-05', // Age 22
    city: 'Faisalabad',
    location: 'Canal Road, Faisalabad, Pakistan',
    lat: 31.4320,
    lon: 73.0980,
    profession: '4th Year Pharmacy Student (Pharm-D)',
    education: 'Doctor of Pharmacy (Pharm-D, 4th Year)',
    university: 'GC University Faisalabad (GCUF)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Traditional Kurti & Dupatta',
    bio: 'Pharm-D student dedicated to healthcare. Values honesty, humility, and family ties above all. Enjoys badminton, reading, and tea with parents. Seeking a sincere, grounded partner with good character and deen.',
    waliName: 'Javed Iqbal',
    waliRelation: 'Father',
    waliPhone: '+923009876535',
    photo: '/seeds/seed_female_35.jpg'
  },
  {
    id: 'usr_seed_pk_36',
    name: 'Maryam Bilal',
    email: 'maryam.lit@qurb.app',
    phone: '+923001234536',
    dob: '2006-06-15', // Age 20
    city: 'Peshawar',
    location: 'Hayatabad Phase 5, Peshawar, Pakistan',
    lat: 33.9910,
    lon: 71.4460,
    profession: '3rd Year English Literature & Linguistics Student',
    education: 'BS English Literature (In Progress)',
    university: 'University of Peshawar',
    height: "5'4\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Traditional Attire with Dupatta',
    bio: 'Literature student who loves books, nature, and traditional Pashtun hospitality. Dedicated to deen and family values. Looking for an educated, pious, and well-mannered life partner to build a blessed home.',
    waliName: 'Bilal Ahmad Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876536',
    photo: '/seeds/seed_female_36.jpg'
  },
  {
    id: 'usr_seed_pk_37',
    name: 'Anum Raza',
    email: 'anum.design@qurb.app',
    phone: '+923001234537',
    dob: '2003-09-10', // Age 23
    city: 'Islamabad',
    location: 'Sector G-11/3, Islamabad, Pakistan',
    lat: 33.6680,
    lon: 72.9980,
    profession: 'Junior UI/UX Designer & Fresh Graduate',
    education: 'BS Media & Visual Design',
    university: 'COMSATS University Islamabad',
    height: "5'5\"",
    ethnicity: 'Syed',
    sect: 'Shia',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Minimalist Co-ord Set',
    bio: 'Recently graduated in UI/UX design. Creative, gentle-natured, and family-oriented. Love coffee, minimal art, and weekend family dinners. Seeking a devout, kind-hearted, and emotionally mature partner.',
    waliName: 'Syed Raza Ali',
    waliRelation: 'Father',
    waliPhone: '+923009876537',
    photo: '/seeds/seed_female_37.jpg'
  },
  {
    id: 'usr_seed_pk_38',
    name: 'Rameen Shakeel',
    email: 'rameen.arts@qurb.app',
    phone: '+923001234538',
    dob: '2005-04-28', // Age 21
    city: 'Lahore',
    location: 'Model Town Block B, Lahore, Pakistan',
    lat: 31.4850,
    lon: 74.3210,
    profession: '3rd Year Graphic Design & Media Arts Student',
    education: 'BFA Visual Arts / Graphic Design',
    university: 'Beaconhouse National University (BNU Lahore)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Contemporary Eastern Attire',
    bio: 'Art and visual design student. Warm, creative, and fond of nature trips and family outings. Striving in prayers and Islamic ethics. Looking for an understanding, educated, and cheerful partner who values deen.',
    waliName: 'Shakeel Akhtar',
    waliRelation: 'Father',
    waliPhone: '+923009876538',
    photo: '/seeds/seed_female_38.jpg'
  },
  {
    id: 'usr_seed_pk_39',
    name: 'Laiba Noor',
    email: 'laiba.alimah@qurb.app',
    phone: '+923001234539',
    dob: '2004-07-14', // Age 22
    city: 'Multan',
    location: 'Officers Colony, Multan, Pakistan',
    lat: 30.2010,
    lon: 71.4720,
    profession: 'Final Year Islamic Studies & Arabic Scholar (Alimah Course)',
    education: 'Dars-e-Nizami (Alimah) & BA Islamic Studies',
    university: 'Bahauddin Zakariya University (BZU Multan)',
    height: "5'3\"",
    ethnicity: 'Saraiki / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Hijab & Abaya',
    bio: 'Final year student of Islamic Sciences and Arabic. Humble, peaceful, and devoted to family and spirituality. Looking for a practicing, humble, and hardworking Muslim who prioritizes Sunnah in daily life.',
    waliName: 'Noor Muhammad',
    waliRelation: 'Father',
    waliPhone: '+923009876539',
    photo: '/seeds/seed_female_39.jpg'
  },
  {
    id: 'usr_seed_pk_40',
    name: 'Zainab Qureshi',
    email: 'zainab.analytics@qurb.app',
    phone: '+923001234540',
    dob: '2007-10-02', // Age 19
    city: 'Karachi',
    location: 'PECHS Block 2, Karachi, Pakistan',
    lat: 24.8620,
    lon: 67.0540,
    profession: '2nd Year Computer Science / Data Analytics Student',
    education: 'BS Data Science (In Progress)',
    university: 'FAST-NUCES Karachi',
    height: "5'5\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest High-Street Dress & Dupatta',
    bio: 'Data analytics student in Karachi. Bright, enthusiastic, and rooted in family morals and Islamic values. Enjoys archery, reading, and cooking. Seeking a pious, ambitious, and kind-hearted life partner.',
    waliName: 'Mansoor Qureshi',
    waliRelation: 'Father',
    waliPhone: '+923009876540',
    photo: '/seeds/seed_female_40.jpg'
  }
];

let sql = `-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (31 - 40)
-- Strict Demographic: Ages 18 to 23 Years Old
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

const outPath = path.join(__dirname, '..', 'db', 'seed_pakistani_females_31_40.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Saved SQL script to', outPath, 'size:', sql.length);

module.exports = { profiles };
