const fs = require('fs');
const path = require('path');

const SEED_PASSWORD = 'QurbSeed@2026';
const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

const profiles = [
  {
    id: 'usr_seed_pk_81',
    name: 'Maham Zahid',
    email: 'maham.zahid@qurb.app',
    phone: '+923001234581',
    dob: '2007-04-14', // Age 19
    city: 'Islamabad',
    location: 'Sector F-7/1, Islamabad, Pakistan',
    lat: 33.7215,
    lon: 73.0560,
    profession: '2nd Year BS Psychology Student',
    education: 'BS Psychology (In Progress)',
    university: 'NUST Islamabad',
    height: "5'4\"",
    ethnicity: 'Punjabi / Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Sage Linen Co-ord & Chiffon Dupatta',
    bio: 'Assalamu Alaikum. Psychology sophomore passionate about human empathy, mental well-being, and creative writing. Cheerful, family-centric, and grounded in Islamic adab. Seeking a kind-hearted, educated life partner who values mutual respect and shared spiritual growth.',
    waliName: 'Zahid Mahmood Akhtar',
    waliRelation: 'Father',
    waliPhone: '+923009876581',
    photo: '/seeds/seed_female_81.jpg'
  },
  {
    id: 'usr_seed_pk_82',
    name: 'Dua Fatima',
    email: 'dua.fatima@qurb.app',
    phone: '+923001234582',
    dob: '2005-09-22', // Age 21
    city: 'Lahore',
    location: 'DHA Phase 6, Lahore, Pakistan',
    lat: 31.4704,
    lon: 74.4387,
    profession: '3rd Year Computer Science Student',
    education: 'BS Computer Science (In Progress)',
    university: 'FAST-NUCES Lahore',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Mustard Yellow Kurti & White Cigarette Pants',
    bio: 'BS CS student passionate about mobile technologies, UI/UX aesthetics, and creative problem solving. Warm, grounded, and loves weekend baking with family. Seeking an ambitious, practicing Muslim brother who balances deen and worldly goals with integrity.',
    waliName: 'Muhammad Arshad',
    waliRelation: 'Father',
    waliPhone: '+923009876582',
    photo: '/seeds/seed_female_82.jpg'
  },
  {
    id: 'usr_seed_pk_83',
    name: 'Dr. Anaya Malik',
    email: 'anaya.malik@qurb.app',
    phone: '+923001234583',
    dob: '2004-06-18', // Age 22
    city: 'Rawalpindi',
    location: 'Bahria Town Phase 8, Rawalpindi, Pakistan',
    lat: 33.5186,
    lon: 73.0844,
    profession: '4th Year MBBS Medical Student',
    education: 'MBBS (In Progress)',
    university: 'Rawalpindi Medical University (RMU)',
    height: "5'6\"",
    ethnicity: 'Punjabi (Awan)',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dusty-Rose Raw Silk Shirt & Chiffon Dupatta',
    bio: 'Medical student dedicated to healthcare, pediatric medicine, and compassionate community service. Soft-spoken, graceful, and deeply rooted in Islamic values. Looking for an educated, respectful, and family-oriented partner with noble character.',
    waliName: 'Dr. Tariq Malik',
    waliRelation: 'Father',
    waliPhone: '+923009876583',
    photo: '/seeds/seed_female_83.jpg'
  },
  {
    id: 'usr_seed_pk_84',
    name: 'Eshal Rehan',
    email: 'eshal.rehan@qurb.app',
    phone: '+923001234584',
    dob: '2006-02-28', // Age 20
    city: 'Karachi',
    location: 'Clifton Block 4, Karachi, Pakistan',
    lat: 24.8138,
    lon: 67.0299,
    profession: '2nd Year Architecture Student',
    education: 'Bachelor of Architecture (In Progress)',
    university: 'Indus Valley School of Art and Architecture (IVS)',
    height: "5'4\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Ivory & Peach Embroidered Kurti with Linen Trousers',
    bio: 'Architecture student who appreciates sustainable design, calligraphy, and historic heritage. Approachable, polite, and family-oriented. Looking for a deen-conscious, supportive partner who appreciates learning and intellectual harmony.',
    waliName: 'Rehan Farooqui',
    waliRelation: 'Father',
    waliPhone: '+923009876584',
    photo: '/seeds/seed_female_84.jpg'
  },
  {
    id: 'usr_seed_pk_85',
    name: 'Hania Tariq',
    email: 'hania.tariq@qurb.app',
    phone: '+923001234585',
    dob: '2006-11-15', // Age 20
    city: 'Karachi',
    location: 'DHA Phase 5, Karachi, Pakistan',
    lat: 24.8012,
    lon: 67.0421,
    profession: '2nd Year Media Sciences Student',
    education: 'BS Media Sciences (In Progress)',
    university: 'SZABIST Karachi',
    height: "5'3\"",
    ethnicity: 'Muhajir / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Mint Kurti with White Trousers',
    bio: 'Passionate about digital communications, photography, and literature. Cheerful, honest, and grounded in core Islamic principles. Seeking a sincere, mature life partner who values warmth, family ties, and mutual encouragement.',
    waliName: 'Tariq Javed',
    waliRelation: 'Father',
    waliPhone: '+923009876585',
    photo: '/seeds/seed_female_85.jpg'
  },
  {
    id: 'usr_seed_pk_86',
    name: 'Zainab Kamran',
    email: 'zainab.kamran@qurb.app',
    phone: '+923001234586',
    dob: '2007-07-05', // Age 19
    city: 'Islamabad',
    location: 'Sector F-10/2, Islamabad, Pakistan',
    lat: 33.6938,
    lon: 73.0033,
    profession: '2nd Year Industrial Design Student',
    education: 'Bachelor of Design (In Progress)',
    university: 'COMSATS University Islamabad',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Powder Blue Co-ord Set & Lightweight Dupatta',
    bio: 'Design student with a keen eye for aesthetics, minimalist interiors, and nature walks. Peaceful, polite, and close to my parents. Seeking an educated, upright practicing partner with noble moral values.',
    waliName: 'Kamran Hafeez',
    waliRelation: 'Father',
    waliPhone: '+923009876586',
    photo: '/seeds/seed_female_86.jpg'
  },
  {
    id: 'usr_seed_pk_87',
    name: 'Minahil Usman',
    email: 'minahil.usman@qurb.app',
    phone: '+923001234587',
    dob: '2005-03-12', // Age 21
    city: 'Lahore',
    location: 'Model Town Block C, Lahore, Pakistan',
    lat: 31.4852,
    lon: 74.3214,
    profession: '3rd Year Visual Communications & UI Intern',
    education: 'BFA Graphic Design (In Progress)',
    university: 'PUCAD Lahore',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Lavender Linen Kurti & White Culottes',
    bio: 'Graphic design student and freelance UI creator. Love gardening, Islamic history podcasts, and spending time with younger siblings. Looking for an ambitious, humble, and deen-loving husband.',
    waliName: 'Usman Ghani',
    waliRelation: 'Father',
    waliPhone: '+923009876587',
    photo: '/seeds/seed_female_87.jpg'
  },
  {
    id: 'usr_seed_pk_88',
    name: 'Palwasha Khattak',
    email: 'palwasha.khattak@qurb.app',
    phone: '+923001234588',
    dob: '2005-10-30', // Age 21
    city: 'Peshawar',
    location: 'Hayatabad Phase 5, Peshawar, Pakistan',
    lat: 33.9850,
    lon: 71.4395,
    profession: '3rd Year BS Artificial Intelligence Student',
    education: 'BS AI (In Progress)',
    university: 'UET Peshawar',
    height: "5'5\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Peach Kurti & Matching Traditional Dupatta',
    bio: 'Pashtun tech enthusiast studying artificial intelligence. Grounded in family traditions, hospitality, and daily prayers. Seeking an educated, respectful, and career-supportive Pashtun or Urdu-speaking Muslim brother.',
    waliName: 'Zahid Khan Khattak',
    waliRelation: 'Father',
    waliPhone: '+923009876588',
    photo: '/seeds/seed_female_88.jpg'
  },
  {
    id: 'usr_seed_pk_89',
    name: 'Ayla Noor',
    email: 'ayla.noor@qurb.app',
    phone: '+923001234589',
    dob: '2008-05-19', // Age 18
    city: 'Rawalpindi',
    location: 'Chaklala Scheme 3, Rawalpindi, Pakistan',
    lat: 33.5855,
    lon: 73.0822,
    profession: '1st Year BS Biotechnology Student',
    education: 'BS Biotechnology (In Progress)',
    university: 'Foundation University Islamabad',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Soft Pink Lawn Kurti & White Dupatta',
    bio: 'Freshman student enthusiastic about biosciences and genetics. Sincere, cheerful, and raised with strong Islamic principles. Seeking a well-educated, respectful partner whose family values modesty and kindness.',
    waliName: 'Noor-ul-Hassan',
    waliRelation: 'Father',
    waliPhone: '+923009876589',
    photo: '/seeds/seed_female_89.jpg'
  },
  {
    id: 'usr_seed_pk_90',
    name: 'Kinza Mueen',
    email: 'kinza.mueen@qurb.app',
    phone: '+923001234590',
    dob: '2007-12-08', // Age 19
    city: 'Faisalabad',
    location: 'Kohinoor City, Faisalabad, Pakistan',
    lat: 31.4187,
    lon: 73.1118,
    profession: '2nd Year English Literature Student',
    education: 'BS English Literature (In Progress)',
    university: 'GC University Faisalabad',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Sea-Green Cotton Kurti & White Cigarette Pants',
    bio: 'Literature student who loves classic novels, Urdu poetry, and baking. Calm, thoughtful, and deeply respectful of elders. Looking for an educated, caring life partner who values peace of heart and Islamic virtue.',
    waliName: 'Mueen-ud-Din',
    waliRelation: 'Father',
    waliPhone: '+923009876590',
    photo: '/seeds/seed_female_90.jpg'
  },
  {
    id: 'usr_seed_pk_91',
    name: 'Maryam Bukhari',
    email: 'maryam.bukhari@qurb.app',
    phone: '+923001234591',
    dob: '2004-08-25', // Age 22
    city: 'Multan',
    location: 'Multan Cantt, Multan, Pakistan',
    lat: 30.1984,
    lon: 71.4485,
    profession: 'Clinical Psychology Trainee & BS Honors',
    education: 'BS Clinical Psychology',
    university: 'Bahauddin Zakariya University (BZU)',
    height: "5'4\"",
    ethnicity: 'Syed',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Ochre-Gold Embroidered Kurti & Chiffon Dupatta',
    bio: 'Psychology graduate focusing on child and family counseling. Soft-spoken, family-oriented, and proud of our spiritual heritage. Seeking a pious, mature, and supportive life companion.',
    waliName: 'Syed Qasim Bukhari',
    waliRelation: 'Father',
    waliPhone: '+923009876591',
    photo: '/seeds/seed_female_91.jpg'
  },
  {
    id: 'usr_seed_pk_92',
    name: 'Rameen Abbasi',
    email: 'rameen.abbasi@qurb.app',
    phone: '+923001234592',
    dob: '2005-01-16', // Age 21
    city: 'Abbottabad',
    location: 'Jinnahabad, Abbottabad, Pakistan',
    lat: 34.1688,
    lon: 73.2215,
    profession: '3rd Year BS Environmental Sciences',
    education: 'BS Environmental Sciences (In Progress)',
    university: 'COMSATS Abbottabad',
    height: "5'5\"",
    ethnicity: 'Abbasi / Hindko',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Beige Woolen Kurti with Cream Pashmina Shawl',
    bio: 'Nature enthusiast and environmental science student. Growing up in the hills has given me a deep appreciation for peaceful simple living and nature. Looking for an educated, humble, and deen-loving husband.',
    waliName: 'Raja Zaheer Abbasi',
    waliRelation: 'Father',
    waliPhone: '+923009876592',
    photo: '/seeds/seed_female_92.jpg'
  },
  {
    id: 'usr_seed_pk_93',
    name: 'Zunaira Dar',
    email: 'zunaira.dar@qurb.app',
    phone: '+923001234593',
    dob: '2003-10-04', // Age 23
    city: 'Sialkot',
    location: 'Sialkot Cantt, Sialkot, Pakistan',
    lat: 32.5112,
    lon: 74.5422,
    profession: 'Fresh BBA Supply Chain Graduate & Associate',
    education: 'BBA Supply Chain & Logistics',
    university: 'University of Sialkot',
    height: "5'5\"",
    ethnicity: 'Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Navy & Cream Linen Kurti with Straight Trousers',
    bio: 'Business graduate working in export supply chain logistics. Balanced, goal-oriented, and deeply connected to family. Seeking an ambitious, honest, and practicing gentleman who values mutual respect.',
    waliName: 'Naveed Dar',
    waliRelation: 'Father',
    waliPhone: '+923009876593',
    photo: '/seeds/seed_female_93.jpg'
  },
  {
    id: 'usr_seed_pk_94',
    name: 'Meerab Cheema',
    email: 'meerab.cheema@qurb.app',
    phone: '+923001234594',
    dob: '2006-08-14', // Age 20
    city: 'Gujranwala',
    location: 'DC Colony, Gujranwala, Pakistan',
    lat: 32.1877,
    lon: 74.1945,
    profession: '2nd Year Clinical Nutrition & Dietetics Student',
    education: 'BS Human Nutrition (In Progress)',
    university: 'GIFT University Gujranwala',
    height: "5'4\"",
    ethnicity: 'Punjabi (Jat)',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Canary Yellow & White Embroidered Kurti',
    bio: 'Studying clinical dietetics and nutrition. Passionate about healthy halal lifestyles, cooking nutritious family meals, and community welfare. Looking for a deen-focused, caring partner.',
    waliName: 'Chaudhry Bilal Cheema',
    waliRelation: 'Father',
    waliPhone: '+923009876594',
    photo: '/seeds/seed_female_94.jpg'
  },
  {
    id: 'usr_seed_pk_95',
    name: 'Syeda Bareera Kazmi',
    email: 'bareera.kazmi@qurb.app',
    phone: '+923001234595',
    dob: '2003-04-20', // Age 23
    city: 'Islamabad',
    location: 'Sector G-11/3, Islamabad, Pakistan',
    lat: 33.6682,
    lon: 72.9984,
    profession: 'Islamic Studies Scholar & Junior UI Designer',
    education: 'BS Islamic Studies & UI Certification',
    university: 'International Islamic University Islamabad (IIUI)',
    height: "5'4\"",
    ethnicity: 'Syed',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Olive-Green Chiffon Hijab & Camel Trench Tunic',
    bio: 'Alimah and UI design practitioner. Striving to blend Islamic classical knowledge with contemporary technology. Seeking a pious, practicing Syed or non-Syed brother with noble character and genuine taqwa.',
    waliName: 'Syed Yousaf Kazmi',
    waliRelation: 'Father',
    waliPhone: '+923009876595',
    photo: '/seeds/seed_female_95.jpg'
  },
  {
    id: 'usr_seed_pk_96',
    name: 'Rimsha Sohail',
    email: 'rimsha.sohail@qurb.app',
    phone: '+923001234596',
    dob: '2004-11-02', // Age 22
    city: 'Lahore',
    location: 'Johar Town Phase 2, Lahore, Pakistan',
    lat: 31.4697,
    lon: 74.2728,
    profession: 'Associate Software QA Engineer',
    education: 'BS Software Engineering',
    university: 'FAST-NUCES Lahore',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Oat-Milk Linen Tunic & Straight Trousers',
    bio: 'Software QA engineer who enjoys precision, coding automation, and reading books on weekends. Cheerful, honest, and values harmonious home life. Seeking a practicing, kind-hearted professional.',
    waliName: 'Sohail Aslam',
    waliRelation: 'Father',
    waliPhone: '+923009876596',
    photo: '/seeds/seed_female_96.jpg'
  },
  {
    id: 'usr_seed_pk_97',
    name: 'Natasha Baig',
    email: 'natasha.baig@qurb.app',
    phone: '+923001234597',
    dob: '2008-09-10', // Age 18
    city: 'Karachi',
    location: 'PECHS Block 2, Karachi, Pakistan',
    lat: 24.8716,
    lon: 67.0599,
    profession: '1st Year BBA Student',
    education: 'BBA (In Progress)',
    university: 'IBA Karachi',
    height: "5'3\"",
    ethnicity: 'Muhajir',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Pastel Peach Kurti & White Cigarette Pants',
    bio: 'Freshman business administration student. Cheerful, humble, and deeply devoted to my family. Looking for a well-mannered, deen-conscious partner with good educational background.',
    waliName: 'Mirza Baig',
    waliRelation: 'Father',
    waliPhone: '+923009876597',
    photo: '/seeds/seed_female_97.jpg'
  },
  {
    id: 'usr_seed_pk_98',
    name: 'Hafsa Farooq',
    email: 'hafsa.farooq@qurb.app',
    phone: '+923001234598',
    dob: '2003-07-27', // Age 23
    city: 'Rawalpindi',
    location: 'Westridge 1, Rawalpindi, Pakistan',
    lat: 33.6015,
    lon: 73.0235,
    profession: 'Alimah & Quran Recitation Teacher',
    education: 'Shahadat-ul-Alimiyyah (Equivalent MA Islamic Studies)',
    university: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Black Abaya with Matching Chiffon Hijab',
    bio: 'Completed Alimah course Alhumdulillah. Dedicated to teaching Quran and Tajweed to young girls. Seeking a practicing Muslim brother who loves Sunnah, prays with congregation, and values an Islamic household.',
    waliName: 'Farooq Ahmed Cheema',
    waliRelation: 'Father',
    waliPhone: '+923009876598',
    photo: '/seeds/seed_female_98.jpg'
  },
  {
    id: 'usr_seed_pk_99',
    name: 'Aleena Gul',
    email: 'aleena.gul@qurb.app',
    phone: '+923001234599',
    dob: '2006-05-06', // Age 20
    city: 'Peshawar',
    location: 'University Town, Peshawar, Pakistan',
    lat: 33.9984,
    lon: 71.4889,
    profession: '2nd Year Pharm-D Pharmacy Student',
    education: 'Doctor of Pharmacy (In Progress)',
    university: 'University of Peshawar',
    height: "5'5\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Deep Maroon Traditional Kurti & Printed Dupatta',
    bio: 'Pharmacy student passionate about pharmaceutical sciences and patient care. Humble, cheerful, and cultured in Pashtun hospitality and Islamic values. Looking for an educated, pious partner with sincere family values.',
    waliName: 'Gulzar Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876599',
    photo: '/seeds/seed_female_99.jpg'
  },
  {
    id: 'usr_seed_pk_100',
    name: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@qurb.app',
    phone: '+923001234600',
    dob: '2003-02-14', // Age 23
    city: 'Islamabad',
    location: 'Sector E-11/2, Islamabad, Pakistan',
    lat: 33.7001,
    lon: 72.9812,
    profession: 'Associate Machine Learning Engineer',
    education: 'BS Artificial Intelligence & Data Science',
    university: 'NUST Islamabad',
    height: "5'6\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Blush-Pink Linen Co-ord & Georgette Dupatta',
    bio: 'AI researcher and associate engineer who loves hiking in the Margallas, reading, and tech innovation. Grounded, warm, and deeply committed to daily prayers. Seeking an ambitious, honest, and practicing Muslim partner.',
    waliName: 'Zahid Mahmood Akhtar',
    waliRelation: 'Father',
    waliPhone: '+923009876600',
    photo: '/seeds/seed_female_100.jpg'
  }
];

function generateSql(profileList) {
  let sql = `-- ====================================================================\n` +
    `-- Qurb Matrimony: 20 New Authentic Pakistani Female Seed Profiles (81 - 100)\n` +
    `-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)\n` +
    `-- Human Touch v3.5 Standard (.agents/skills/pakistani-matrimony-generator/SKILL.md)\n` +
    `-- ====================================================================\n\n`;

  for (const p of profileList) {
    const safeName = p.name.replace(/'/g, "''");
    const safeLoc = p.location.replace(/'/g, "''");
    const safeBio = p.bio.replace(/'/g, "''");
    const safeProf = p.profession.replace(/'/g, "''");
    const safeEdu = p.education.replace(/'/g, "''");
    const safeUni = p.university.replace(/'/g, "''");
    const safeEthnicity = p.ethnicity.replace(/'/g, "''");
    const safeModesty = p.modesty.replace(/'/g, "''");
    const safeWaliName = p.waliName.replace(/'/g, "''");
    const safeHeight = p.height.replace(/'/g, "''");

    sql += `-- Profile: ${p.name} (${p.city}, Age: ${2026 - parseInt(p.dob.slice(0, 4))}, ${p.profession})\n`;
    sql += `INSERT OR REPLACE INTO users (\n` +
      `  id, phone, email, password_hash, full_name, dob, gender, location, city, country,\n` +
      `  latitude, longitude, height, bio, profession, education, university,\n` +
      `  ethnicity, family_structure, living_preference, siblings_count,\n` +
      `  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,\n` +
      `  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,\n` +
      `  is_phone_verified, is_id_verified, is_vip, is_profile_completed,\n` +
      `  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at\n` +
      `) VALUES (\n` +
      `  '${p.id}', '${p.phone}', '${p.email}', '${SEED_PASSWORD_HASH}',\n` +
      `  '${safeName}', '${p.dob}', 'female', '${safeLoc}', '${p.city}', 'Pakistan',\n` +
      `  ${p.lat}, ${p.lon}, '${safeHeight}',\n` +
      `  '${safeBio}',\n` +
      `  '${safeProf}', '${safeEdu}', '${safeUni}',\n` +
      `  '${safeEthnicity}', 'nuclear', 'independent', 2,\n` +
      `  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',\n` +
      `  'desires_children', 'within_1_year', 0, 'all_users',\n` +
      `  1, 1, 0, 1,\n` +
      `  1, 1, '${SEED_PASSWORD}', 'active', 0, datetime('now', '-${Math.floor(Math.random() * 50) + 10} minutes')\n` +
      `);\n\n`;

    sql += `INSERT OR REPLACE INTO religious_profiles (\n` +
      `  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,\n` +
      `  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio\n` +
      `) VALUES (\n` +
      `  '${p.id}', '${p.practiceLevel}', '${p.sect}', 'Hanafi', '${p.prayer}', 'Strictly Halal',\n` +
      `  'Regular with translation', '${safeModesty}', 'Planning insha''Allah',\n` +
      `  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'\n` +
      `);\n\n`;

    sql += `INSERT OR REPLACE INTO wali_details (\n` +
      `  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active\n` +
      `) VALUES (\n` +
      `  'wali_${p.id}', '${p.id}', '${safeWaliName}', '${p.waliPhone}', '${p.waliRelation}', 1, 1\n` +
      `);\n\n`;

    sql += `INSERT OR REPLACE INTO user_photos (\n` +
      `  id, user_id, photo_url, is_primary, sort_order\n` +
      `) VALUES (\n` +
      `  'photo_${p.id}_1', '${p.id}', '${p.photo}', 1, 1\n` +
      `);\n\n`;

    sql += `UPDATE user_photos SET photo_url = '${p.photo}' WHERE user_id = '${p.id}';\n\n`;
  }

  return sql;
}

const sqlOutput = generateSql(profiles);
const sqlPath = path.join(__dirname, '..', 'db', 'seed_pakistani_females_81_100.sql');
fs.writeFileSync(sqlPath, sqlOutput, 'utf8');
console.log(`Generated SQL for 20 profiles at ${sqlPath}`);

module.exports = { profiles, generateSql };
