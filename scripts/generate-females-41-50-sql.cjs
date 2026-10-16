const fs = require('fs');
const path = require('path');

const SEED_PASSWORD = 'QurbSeed@2026';
const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

const profiles = [
  {
    id: 'usr_seed_pk_41',
    name: 'Minahil Tariq',
    email: 'minahil.media@qurb.app',
    phone: '+923001234541',
    dob: '2007-04-18', // Age 19
    city: 'Islamabad',
    location: 'Sector F-7/1, Islamabad, Pakistan',
    lat: 33.7215,
    lon: 73.0560,
    profession: '2nd Year Media & Communications Student',
    education: 'BS Media Sciences (In Progress)',
    university: 'NUST Islamabad',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Co-ord & Dupatta',
    bio: 'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
    waliName: 'Tariq Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876541',
    photo: '/seeds/seed_female_41.jpg'
  },
  {
    id: 'usr_seed_pk_42',
    name: 'Ayesha Imran Malik',
    email: 'ayesha.cs@qurb.app',
    phone: '+923001234542',
    dob: '2005-09-12', // Age 21
    city: 'Lahore',
    location: 'DHA Phase 5, Lahore, Pakistan',
    lat: 31.4704,
    lon: 74.3987,
    profession: '3rd Year Computer Science Student',
    education: 'BS Computer Science (In Progress)',
    university: 'FAST-NUCES Lahore',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Contemporary Kurti & Dupatta',
    bio: 'CS student with a passion for web technologies, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
    waliName: 'Imran Malik',
    waliRelation: 'Father',
    waliPhone: '+923009876542',
    photo: '/seeds/seed_female_42.jpg'
  },
  {
    id: 'usr_seed_pk_43',
    name: 'Dr. Hania Zahra',
    email: 'hania.med@qurb.app',
    phone: '+923001234543',
    dob: '2004-03-25', // Age 22
    city: 'Rawalpindi',
    location: 'Chaklala Scheme 3, Rawalpindi, Pakistan',
    lat: 33.5851,
    lon: 73.0869,
    profession: '4th Year MBBS Medical Student',
    education: 'MBBS (Doctor of Medicine, 4th Year)',
    university: 'Rawalpindi Medical University (RMU)',
    height: "5'5\"",
    ethnicity: 'Potohari / Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Raw Silk & Chiffon Dupatta',
    bio: 'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
    waliName: 'Zahid Hussain',
    waliRelation: 'Father',
    waliPhone: '+923009876543',
    photo: '/seeds/seed_female_43.jpg'
  },
  {
    id: 'usr_seed_pk_44',
    name: 'Rameen Farhan',
    email: 'rameen.bba@qurb.app',
    phone: '+923001234544',
    dob: '2006-05-14', // Age 20
    city: 'Karachi',
    location: 'Clifton Block 4, Karachi, Pakistan',
    lat: 24.8157,
    lon: 67.0311,
    profession: '2nd Year BBA Marketing & Finance Student',
    education: 'BBA (In Progress)',
    university: 'Institute of Business Administration (IBA Karachi)',
    height: "5'4\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest High-Street Linen & Dupatta',
    bio: 'BBA student at IBA Karachi. Enthusiastic, loves literature, sea walks, and baking. Firm believer in mutual respect and emotional harmony. Seeking a kind, responsible, and practicing spouse.',
    waliName: 'Farhan Azmat',
    waliRelation: 'Father',
    waliPhone: '+923009876544',
    photo: '/seeds/seed_female_44.jpg'
  },
  {
    id: 'usr_seed_pk_45',
    name: 'Zainab Bilal',
    email: 'zainab.premed@qurb.app',
    phone: '+923001234545',
    dob: '2008-02-28', // Age 18
    city: 'Lahore',
    location: 'Gulberg III, Lahore, Pakistan',
    lat: 31.5104,
    lon: 74.3487,
    profession: 'Freshman Pre-Med / Biological Sciences Student',
    education: 'BS Biological Sciences (1st Year)',
    university: 'Forman Christian College (FCCU Lahore)',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Lilac Kurti & Dupatta',
    bio: 'Fresh university student with big dreams and humble roots. Deeply attached to family, loves gardening and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
    waliName: 'Bilal Qureshi',
    waliRelation: 'Father',
    waliPhone: '+923009876545',
    photo: '/seeds/seed_female_45.jpg'
  },
  {
    id: 'usr_seed_pk_46',
    name: 'Maryam Siddiqui',
    email: 'maryam.uiux@qurb.app',
    phone: '+923001234546',
    dob: '2003-11-09', // Age 23
    city: 'Islamabad',
    location: 'Sector F-6/2, Islamabad, Pakistan',
    lat: 33.7288,
    lon: 73.0787,
    profession: 'Junior UI/UX Product Designer',
    education: 'BS Visual Communication & Design',
    university: 'COMSATS University Islamabad',
    height: "5'5\"",
    ethnicity: 'Urdu Speaking / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab (Chiffon Hijab & Tunic)',
    bio: 'Product designer working at a creative digital agency in Islamabad. Observing hijab. Balanced between career and Islamic ethics. Seeking a mature, respectful, and deen-conscious Muslim brother.',
    waliName: 'Siddiq Ahmed',
    waliRelation: 'Father',
    waliPhone: '+923009876546',
    photo: '/seeds/seed_female_46.jpg'
  },
  {
    id: 'usr_seed_pk_47',
    name: 'Kinza Shakeel',
    email: 'kinza.interior@qurb.app',
    phone: '+923001234547',
    dob: '2006-08-19', // Age 20
    city: 'Faisalabad',
    location: 'Kohinoor City, Faisalabad, Pakistan',
    lat: 31.4304,
    lon: 73.1150,
    profession: '3rd Year Interior Architecture Student',
    education: 'B.Des (Interior Architecture)',
    university: 'GC University Faisalabad (GCUF)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Embroidered Kurti & Pants',
    bio: 'Interior design student passionate about home aesthetics, Islamic architecture, and family comfort. Warm, cheerful, and down to earth. Looking for an educated, caring, and trustworthy partner.',
    waliName: 'Shakeel Akhtar',
    waliRelation: 'Father',
    waliPhone: '+923009876547',
    photo: '/seeds/seed_female_47.jpg'
  },
  {
    id: 'usr_seed_pk_48',
    name: 'Dua Aslam',
    email: 'dua.econ@qurb.app',
    phone: '+923001234548',
    dob: '2004-06-30', // Age 22
    city: 'Karachi',
    location: 'DHA Phase 8, Karachi, Pakistan',
    lat: 24.7820,
    lon: 67.0750,
    profession: 'Fresh Economics Graduate & Analyst Trainee',
    education: 'BSc (Honours) Economics',
    university: 'LUMS / IBA Karachi',
    height: "5'5\"",
    ethnicity: 'Muhajir / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Peach Kurti & Chiffon Dupatta',
    bio: 'Fresh economics graduate working in finance consultancy. Friendly, observant of Islamic morals, fond of badminton and seaside walks. Seeking a devout, caring, and accomplished spouse.',
    waliName: 'Muhammad Aslam',
    waliRelation: 'Father',
    waliPhone: '+923009876548',
    photo: '/seeds/seed_female_48.jpg'
  },
  {
    id: 'usr_seed_pk_49',
    name: 'Mahnoor Khan',
    email: 'mahnoor.swe@qurb.app',
    phone: '+923001234549',
    dob: '2005-01-15', // Age 21
    city: 'Peshawar',
    location: 'Hayatabad Phase 3, Peshawar, Pakistan',
    lat: 33.9880,
    lon: 71.4390,
    profession: '3rd Year Software Engineering Student',
    education: 'BS Software Engineering (In Progress)',
    university: 'UET Peshawar',
    height: "5'4\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Traditional Attire & Printed Dupatta',
    bio: 'Pashtun software engineering student from Peshawar. Respectful of traditions, passionate about coding and machine learning. Looking for a respectful, educated, and pious gentleman.',
    waliName: 'Alamgir Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876549',
    photo: '/seeds/seed_female_49.jpg'
  },
  {
    id: 'usr_seed_pk_50',
    name: 'Fatima Javed',
    email: 'fatima.visual@qurb.app',
    phone: '+923001234550',
    dob: '2007-07-22', // Age 19
    city: 'Lahore',
    location: 'Model Town Block C, Lahore, Pakistan',
    lat: 31.4854,
    lon: 74.3211,
    profession: '2nd Year Visual Arts & Design Student',
    education: 'BFA (Visual Arts, In Progress)',
    university: 'National College of Arts (NCA Lahore)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Casual Kurti & Dupatta',
    bio: 'Art student at NCA. Lively, fond of road trips with family, coffee, and painting. Grounded in Islamic adab and family respect. Seeking a kind, understanding, and practicing life partner.',
    waliName: 'Javed Iqbal',
    waliRelation: 'Father',
    waliPhone: '+923009876550',
    photo: '/seeds/seed_female_50.jpg'
  }
];

let sql = `-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (41 - 50)
-- Strict Demographic: Ages 18 to 23 Years Old
-- ====================================================================

`;

for (let i = 0; i < profiles.length; i++) {
  const p = profiles[i];
  const birthYear = parseInt(p.dob.split('-')[0], 10);
  const age = 2026 - birthYear;
  const minutesAgo = (i + 1) * 6; // Staggered recent activity for real-time live presence

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

const outPath = path.join(__dirname, '..', 'db', 'seed_pakistani_females_41_50.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Saved SQL script to', outPath, 'size:', sql.length);

module.exports = { profiles };
