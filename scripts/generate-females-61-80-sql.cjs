const fs = require('fs');
const path = require('path');

const SEED_PASSWORD = 'QurbSeed@2026';
const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

const profiles = [
  {
    id: 'usr_seed_pk_61',
    name: 'Areeba Tariq',
    email: 'areeba.media@qurb.app',
    phone: '+923001234561',
    dob: '2006-03-12', // Age 20
    city: 'Islamabad',
    location: 'Sector F-7/2, Islamabad, Pakistan',
    lat: 33.7215,
    lon: 73.0560,
    profession: '2nd Year Media & Communications Student',
    education: 'BS Media Studies (In Progress)',
    university: 'NUST Islamabad',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Green Kurti & White Dupatta',
    bio: 'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
    waliName: 'Tariq Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876561',
    photo: '/seeds/seed_female_61.jpg'
  },
  {
    id: 'usr_seed_pk_62',
    name: 'Minahil Shah',
    email: 'minahil.se@qurb.app',
    phone: '+923001234562',
    dob: '2005-07-19', // Age 21
    city: 'Lahore',
    location: 'DHA Phase 5, Lahore, Pakistan',
    lat: 31.4704,
    lon: 74.3987,
    profession: '3rd Year Software Engineering Student',
    education: 'BS Software Engineering (In Progress)',
    university: 'FAST-NUCES Lahore',
    height: "5'5\"",
    ethnicity: 'Kashmiri / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Mustard Yellow Kurti & White Pants',
    bio: 'Software engineering student with a genuine love for web development, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
    waliName: 'Syed Shahbaz Shah',
    waliRelation: 'Father',
    waliPhone: '+923009876562',
    photo: '/seeds/seed_female_62.jpg'
  },
  {
    id: 'usr_seed_pk_63',
    name: 'Dr. Hania Babar',
    email: 'hania.med@qurb.app',
    phone: '+923001234563',
    dob: '2004-11-04', // Age 22
    city: 'Rawalpindi',
    location: 'Bahria Town Phase 8, Rawalpindi, Pakistan',
    lat: 33.5186,
    lon: 73.1098,
    profession: '4th Year MBBS Medical Student',
    education: 'MBBS (Doctor of Medicine, 4th Year)',
    university: 'Rawalpindi Medical University (RMU)',
    height: "5'6\"",
    ethnicity: 'Potohari',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Rose Raw Silk & Chiffon Dupatta',
    bio: 'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
    waliName: 'Dr. Babar Ikram',
    waliRelation: 'Father',
    waliPhone: '+923009876563',
    photo: '/seeds/seed_female_63.jpg'
  },
  {
    id: 'usr_seed_pk_64',
    name: 'Syeda Mahnoor Rizvi',
    email: 'mahnoor.ux@qurb.app',
    phone: '+923001234564',
    dob: '2003-05-28', // Age 23
    city: 'Karachi',
    location: 'Clifton Block 4, Karachi, Pakistan',
    lat: 24.8210,
    lon: 67.0315,
    profession: 'Junior UI/UX Designer & Digital Illustrator',
    education: 'B.Des Visual Communication Design',
    university: 'Indus Valley School of Art and Architecture (IVS)',
    height: "5'3\"",
    ethnicity: 'Syed / Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab (Dust-Taupe Chiffon Hijab & Linen Tunic)',
    bio: 'Observant hijabi and UI/UX designer in Karachi. Passionate about Islamic geometric art, mobile interfaces, and coastal walks. Seeking a kind, practicing, and family-oriented partner with good akhlaq.',
    waliName: 'Syed Rizvi Hassan',
    waliRelation: 'Father',
    waliPhone: '+923009876564',
    photo: '/seeds/seed_female_64.jpg'
  },
  {
    id: 'usr_seed_pk_65',
    name: 'Kinza Farooq',
    email: 'kinza.lit@qurb.app',
    phone: '+923001234565',
    dob: '2007-09-15', // Age 19
    city: 'Faisalabad',
    location: 'Kohinoor City, Faisalabad, Pakistan',
    lat: 31.4250,
    lon: 73.1180,
    profession: '2nd Year English Literature & Linguistics Student',
    education: 'BS English Literature (In Progress)',
    university: 'GC University Faisalabad (GCUF)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Powder-Blue Linen Co-ord & Chiffon Dupatta',
    bio: 'English literature student fond of classical prose, baking, and family gatherings. Grounded in Islamic morals and looking for a caring, honest, and practicing gentleman.',
    waliName: 'Farooq Azam',
    waliRelation: 'Father',
    waliPhone: '+923009876565',
    photo: '/seeds/seed_female_65.jpg'
  },
  {
    id: 'usr_seed_pk_66',
    name: 'Palwasha Durrani',
    email: 'palwasha.ai@qurb.app',
    phone: '+923001234566',
    dob: '2005-01-22', // Age 21
    city: 'Peshawar',
    location: 'Hayatabad Phase 4, Peshawar, Pakistan',
    lat: 33.9820,
    lon: 71.4350,
    profession: '3rd Year Artificial Intelligence Student',
    education: 'BS AI & Data Science (In Progress)',
    university: 'UET Peshawar',
    height: "5'5\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Contemporary Peach Kurti & Printed Dupatta',
    bio: 'Pashtun AI student from Peshawar. Respectful of cultural heritage, passionate about machine learning and Islamic philosophy. Seeking an upright, well-mannered, and religious partner.',
    waliName: 'Jamshed Durrani',
    waliRelation: 'Father',
    waliPhone: '+923009876566',
    photo: '/seeds/seed_female_66.jpg'
  },
  {
    id: 'usr_seed_pk_67',
    name: 'Rameen Waqas',
    email: 'rameen.bio@qurb.app',
    phone: '+923001234567',
    dob: '2008-04-10', // Age 18
    city: 'Islamabad',
    location: 'Sector F-10/3, Islamabad, Pakistan',
    lat: 33.6938,
    lon: 73.0125,
    profession: 'Freshman Biotechnology & Pre-Med Student',
    education: 'BS Biotechnology (1st Year)',
    university: 'Quaid-i-Azam University (QAU Islamabad)',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Lavender Cotton Kurti & White Dupatta',
    bio: 'Fresh university student with big dreams and humble roots. Deeply attached to family, loves nature and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
    waliName: 'Waqas Anwer',
    waliRelation: 'Father',
    waliPhone: '+923009876567',
    photo: '/seeds/seed_female_67.jpg'
  },
  {
    id: 'usr_seed_pk_68',
    name: 'Duaa Hashmi',
    email: 'duaa.psych@qurb.app',
    phone: '+923001234568',
    dob: '2004-08-14', // Age 22
    city: 'Multan',
    location: 'Cantt Officers Colony, Multan, Pakistan',
    lat: 30.1984,
    lon: 71.4687,
    profession: 'Junior Clinical Psychologist & M.Sc Trainee',
    education: 'BS Psychology (Honors)',
    university: 'Bahauddin Zakariya University (BZU Multan)',
    height: "5'5\"",
    ethnicity: 'Punjabi / Siraiki',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Sage Embroidered Suit & Dupatta',
    bio: 'Psychology graduate passionate about mental wellness and Islamic counseling. Calm, empathetic, and loves gardening. Seeking an emotionally mature, kind, and deen-conscious life partner.',
    waliName: 'Hashim Raza',
    waliRelation: 'Father',
    waliPhone: '+923009876568',
    photo: '/seeds/seed_female_68.jpg'
  },
  {
    id: 'usr_seed_pk_69',
    name: 'Iman Naveed',
    email: 'iman.bba@qurb.app',
    phone: '+923001234569',
    dob: '2006-12-05', // Age 20
    city: 'Lahore',
    location: 'Model Town Block J, Lahore, Pakistan',
    lat: 31.4854,
    lon: 74.3211,
    profession: '2nd Year BBA Marketing & Strategy Student',
    education: 'BBA (Honors, In Progress)',
    university: 'Lahore School of Economics (LSE)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Terracotta Kurti & White Culottes',
    bio: 'BBA student at LSE. Creative, cheerful, and loves family road trips and cooking. Regular with daily prayers and seeking a responsible, supportive, and practicing spouse.',
    waliName: 'Naveed Akhtar',
    waliRelation: 'Father',
    waliPhone: '+923009876569',
    photo: '/seeds/seed_female_69.jpg'
  },
  {
    id: 'usr_seed_pk_70',
    name: 'Zunaira Khalid',
    email: 'zunaira.scm@qurb.app',
    phone: '+923001234570',
    dob: '2003-10-18', // Age 23
    city: 'Sialkot',
    location: 'Cantt Cantt Road, Sialkot, Pakistan',
    lat: 32.4945,
    lon: 74.5229,
    profession: 'Junior Supply Chain Specialist & Business Trainee',
    education: 'BBA Supply Chain & International Trade',
    university: 'University of Management and Technology (UMT)',
    height: "5'6\"",
    ethnicity: 'Kashmiri / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Navy & Cream Linen Kurti with Dupatta',
    bio: 'Supply chain professional involved in family manufacturing and exports. Well-mannered, family-centered, and dedicated to daily prayers. Seeking an ambitious and pious gentleman.',
    waliName: 'Khalid Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876570',
    photo: '/seeds/seed_female_70.jpg'
  },
  {
    id: 'usr_seed_pk_71',
    name: 'Noor-ul-Ain Gilani',
    email: 'noor.env@qurb.app',
    phone: '+923001234571',
    dob: '2005-04-30', // Age 21
    city: 'Abbottabad',
    location: 'Jinnahabad, Abbottabad, Pakistan',
    lat: 34.1688,
    lon: 73.2215,
    profession: '3rd Year Environmental Sciences Student',
    education: 'BS Earth & Environmental Sciences',
    university: 'COMSATS University Abbottabad',
    height: "5'4\"",
    ethnicity: 'Hindkowan / Syed',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Rose Kurti & Pashmina Shawl',
    bio: 'Environmental sciences student from Abbottabad. Enjoys mountainous outdoors, book reading, and tea. Deep respect for Islamic values and family harmony. Seeking a practicing and caring partner.',
    waliName: 'Syed Gilani Shah',
    waliRelation: 'Father',
    waliPhone: '+923009876571',
    photo: '/seeds/seed_female_71.jpg'
  },
  {
    id: 'usr_seed_pk_72',
    name: 'Dania Mansoor',
    email: 'dania.design@qurb.app',
    phone: '+923001234572',
    dob: '2007-11-12', // Age 19
    city: 'Karachi',
    location: 'DHA Phase 8, Karachi, Pakistan',
    lat: 24.7820,
    lon: 67.0780,
    profession: '2nd Year Graphic Design & Illustration Student',
    education: 'BFA Communication Design (In Progress)',
    university: 'Karachi University (Visual Studies)',
    height: "5'3\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest White & Mint Lawn Kurti with Dupatta',
    bio: 'Art and visual studies student with an eye for aesthetics and design. Cheerful, lively, and family-first. Looking for a respectful, educated, and pious gentleman.',
    waliName: 'Mansoor Alam',
    waliRelation: 'Father',
    waliPhone: '+923009876572',
    photo: '/seeds/seed_female_72.jpg'
  },
  {
    id: 'usr_seed_pk_73',
    name: 'Hira Asim',
    email: 'hira.qa@qurb.app',
    phone: '+923001234573',
    dob: '2004-06-20', // Age 22
    city: 'Lahore',
    location: 'Johar Town Block G, Lahore, Pakistan',
    lat: 31.4697,
    lon: 74.2728,
    profession: 'Junior Software QA Engineer & CS Graduate',
    education: 'BS Computer Science',
    university: 'University of Central Punjab (UCP Lahore)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Oat-Milk Linen Tunic & Dupatta',
    bio: 'QA engineer working with a Lahore tech company. Balances technology work with domestic peace and spiritual consistency. Seeking an honest, practicing, and understanding partner.',
    waliName: 'Asim Qureshi',
    waliRelation: 'Father',
    waliPhone: '+923009876573',
    photo: '/seeds/seed_female_73.jpg'
  },
  {
    id: 'usr_seed_pk_74',
    name: 'Meerab Bilal',
    email: 'meerab.nutrition@qurb.app',
    phone: '+923001234574',
    dob: '2006-02-17', // Age 20
    city: 'Gujranwala',
    location: 'DC Colony, Gujranwala, Pakistan',
    lat: 32.1877,
    lon: 74.1945,
    profession: '2nd Year Food Sciences & Nutrition Student',
    education: 'BS Human Nutrition & Dietetics (In Progress)',
    university: 'Gift University Gujranwala',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Canary-Yellow Embroidered Kurti & Dupatta',
    bio: 'Nutrition student enthusiastic about wholesome lifestyle, cooking, and family warmth. Grounded in Islamic adab and values. Seeking a kind, responsible, and practicing spouse.',
    waliName: 'Bilal Afzal',
    waliRelation: 'Father',
    waliPhone: '+923009876574',
    photo: '/seeds/seed_female_74.jpg'
  },
  {
    id: 'usr_seed_pk_75',
    name: 'Bareera Yousaf',
    email: 'bareera.islamic@qurb.app',
    phone: '+923001234575',
    dob: '2003-08-09', // Age 23
    city: 'Islamabad',
    location: 'Sector G-11/2, Islamabad, Pakistan',
    lat: 33.6685,
    lon: 72.9985,
    profession: 'Junior Content Strategist & Islamic Studies Scholar',
    education: 'BS Islamic Studies & Alimah Graduate',
    university: 'International Islamic University Islamabad (IIUI)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab (Olive Green Modal Hijab & Trench Tunic)',
    bio: 'Alimah graduate and educational content writer in Islamabad. Gentle, modest, and dedicated to Quranic understanding and sunnah. Looking for an educated, practicing, and noble partner.',
    waliName: 'Muhammad Yousaf',
    waliRelation: 'Father',
    waliPhone: '+923009876575',
    photo: '/seeds/seed_female_75.jpg'
  },
  {
    id: 'usr_seed_pk_76',
    name: 'Rimsha Ijaz',
    email: 'rimsha.arch@qurb.app',
    phone: '+923001234576',
    dob: '2005-09-24', // Age 21
    city: 'Rawalpindi',
    location: 'Chaklala Scheme 3, Rawalpindi, Pakistan',
    lat: 33.5820,
    lon: 73.0850,
    profession: '3rd Year Architecture Student',
    education: 'B.Arch (Architecture, In Progress)',
    university: 'Army Public College of Management and Sciences (APCOMS)',
    height: "5'6\"",
    ethnicity: 'Potohari / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel-Lilac Co-ord Set & Dupatta',
    bio: 'Architecture student passionate about sustainable Islamic building and community design. Cheerful, artistic, and regular with prayers. Seeking an upright, cultured, and pious life partner.',
    waliName: 'Ijaz Bashir',
    waliRelation: 'Father',
    waliPhone: '+923009876576',
    photo: '/seeds/seed_female_76.jpg'
  },
  {
    id: 'usr_seed_pk_77',
    name: 'Natasha Jamali',
    email: 'natasha.acca@qurb.app',
    phone: '+923001234577',
    dob: '2004-01-31', // Age 22
    city: 'Karachi',
    location: 'PECHS Block 6, Karachi, Pakistan',
    lat: 24.8615,
    lon: 67.0730,
    profession: 'Junior Corporate Accountant & ACCA Finalist',
    education: 'ACCA Affiliate, B.Com',
    university: "TABANI'S School of Accountancy Karachi",
    height: "5'4\"",
    ethnicity: 'Sindhi / Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel-Peach Lawn Kurti & Dupatta',
    bio: 'Accountant working with an audit consultancy in Karachi. Ambitious yet deeply traditional and family-oriented. Looking for a dependable, honest, and practicing gentleman.',
    waliName: 'Tariq Jamali',
    waliRelation: 'Father',
    waliPhone: '+923009876577',
    photo: '/seeds/seed_female_77.jpg'
  },
  {
    id: 'usr_seed_pk_78',
    name: 'Waniya Shahzad',
    email: 'waniya.psych@qurb.app',
    phone: '+923001234578',
    dob: '2008-08-16', // Age 18
    city: 'Lahore',
    location: 'Wapda Town, Lahore, Pakistan',
    lat: 31.4330,
    lon: 74.2620,
    profession: '1st Year Psychology Student & Aspiring Artist',
    education: 'BS Applied Psychology (Freshman)',
    university: 'Kinnaird College for Women Lahore',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Sky-Blue Cotton Kurti & Lace Dupatta',
    bio: 'Freshman student at Kinnaird College. Sweet-tempered, fond of painting, tea, and spending quality time with family. Seeking a pious, respectful, and family-centered companion.',
    waliName: 'Shahzad Anwar',
    waliRelation: 'Father',
    waliPhone: '+923009876578',
    photo: '/seeds/seed_female_78.jpg'
  },
  {
    id: 'usr_seed_pk_79',
    name: 'Aleena Mukhtar',
    email: 'aleena.pharm@qurb.app',
    phone: '+923001234579',
    dob: '2006-05-11', // Age 20
    city: 'Peshawar',
    location: 'University Town, Peshawar, Pakistan',
    lat: 33.9980,
    lon: 71.4880,
    profession: '2nd Year Doctor of Pharmacy (Pharm-D) Student',
    education: 'Pharm-D (In Progress)',
    university: 'University of Peshawar',
    height: "5'4\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Maroon & Beige Kurti with Draped Dupatta',
    bio: 'Pharmacy student in Peshawar. Grounded in family traditions, quiet, thoughtful, and caring. Seeking a well-mannered, educated, and practicing life partner.',
    waliName: 'Mukhtar Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876579',
    photo: '/seeds/seed_female_79.jpg'
  },
  {
    id: 'usr_seed_pk_80',
    name: 'Fatima Zahid',
    email: 'fatima.dev@qurb.app',
    phone: '+923001234580',
    dob: '2003-12-21', // Age 23
    city: 'Islamabad',
    location: 'Sector E-11/3, Islamabad, Pakistan',
    lat: 33.7020,
    lon: 72.9780,
    profession: 'Associate Software Engineer (Frontend / Mobile)',
    education: 'BS Computer Science',
    university: 'FAST-NUCES Islamabad',
    height: "5'5\"",
    ethnicity: 'Kashmiri / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Blush-Pink Linen Co-ord & Georgette Dupatta',
    bio: 'Mobile and frontend engineer at a remote software firm in Islamabad. Loves mountain hikes in Margalla, specialty coffee, and daily Quran recitation. Seeking a deen-conscious, supportive, and kind husband.',
    waliName: 'Zahid Mahmood',
    waliRelation: 'Father',
    waliPhone: '+923009876580',
    photo: '/seeds/seed_female_80.jpg'
  }
];

function generateSql() {
  let sql = `-- ====================================================================\n`;
  sql += `-- Qurb Matrimony: 20 New Authentic Pakistani Female Seed Profiles (61 - 80)\n`;
  sql += `-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)\n`;
  sql += `-- Human Touch v3.5 Standard (.agents/skills/pakistani-matrimony-generator/SKILL.md)\n`;
  sql += `-- ====================================================================\n\n`;

  profiles.forEach((p, idx) => {
    sql += `-- Profile: ${p.name} (${p.city}, Age: ${2026 - parseInt(p.dob.slice(0,4))}, ${p.profession})\n`;
    sql += `INSERT OR REPLACE INTO users (\n`;
    sql += `  id, phone, email, password_hash, full_name, dob, gender, location, city, country,\n`;
    sql += `  latitude, longitude, height, bio, profession, education, university,\n`;
    sql += `  ethnicity, family_structure, living_preference, siblings_count,\n`;
    sql += `  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,\n`;
    sql += `  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,\n`;
    sql += `  is_phone_verified, is_id_verified, is_vip, is_profile_completed,\n`;
    sql += `  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at\n`;
    sql += `) VALUES (\n`;
    sql += `  '${p.id}', '${p.phone}', '${p.email}', '${SEED_PASSWORD_HASH}',\n`;
    sql += `  '${p.name.replace(/'/g, "''")}', '${p.dob}', 'female', '${p.location.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', 'Pakistan',\n`;
    sql += `  ${p.lat}, ${p.lon}, '${p.height.replace(/'/g, "''")}',\n`;
    sql += `  '${p.bio.replace(/'/g, "''")}',\n`;
    sql += `  '${p.profession.replace(/'/g, "''")}', '${p.education.replace(/'/g, "''")}', '${p.university.replace(/'/g, "''")}',\n`;
    sql += `  '${p.ethnicity.replace(/'/g, "''")}', 'nuclear', 'independent', 2,\n`;
    sql += `  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',\n`;
    sql += `  'desires_children', 'within_1_year', 0, 'all_users',\n`;
    sql += `  1, 1, 0, 1,\n`;
    sql += `  1, 1, '${SEED_PASSWORD}', 'active', 0, datetime('now', '-${(idx + 3) * 6} minutes')\n`;
    sql += `);\n\n`;

    sql += `INSERT OR REPLACE INTO religious_profiles (\n`;
    sql += `  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,\n`;
    sql += `  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio\n`;
    sql += `) VALUES (\n`;
    sql += `  '${p.id}', '${p.practiceLevel}', '${p.sect}', 'Hanafi', '${p.prayer}', 'Strictly Halal',\n`;
    sql += `  'Regular with translation', '${p.modesty.replace(/'/g, "''")}', 'Planning insha''Allah',\n`;
    sql += `  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'\n`;
    sql += `);\n\n`;

    sql += `INSERT OR REPLACE INTO wali_details (\n`;
    sql += `  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active\n`;
    sql += `) VALUES (\n`;
    sql += `  'wali_${p.id}', '${p.id}', '${p.waliName.replace(/'/g, "''")}', '${p.waliPhone}', '${p.waliRelation}', 1, 1\n`;
    sql += `);\n\n`;

    sql += `INSERT OR REPLACE INTO user_photos (\n`;
    sql += `  id, user_id, photo_url, is_primary, sort_order\n`;
    sql += `) VALUES (\n`;
    sql += `  'photo_${p.id}_1', '${p.id}', '${p.photo}', 1, 1\n`;
    sql += `);\n\n`;

    sql += `UPDATE user_photos SET photo_url = '${p.photo}' WHERE user_id = '${p.id}';\n\n`;
  });

  const outPath = path.join(__dirname, '..', 'db', 'seed_pakistani_females_61_80.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Successfully generated SQL for 20 profiles (61 to 80): ${outPath}`);
}

generateSql();
module.exports = { profiles };
