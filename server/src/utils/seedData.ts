export interface SeedProfileDefinition {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  location: string;
  lat: number;
  lon: number;
  profession: string;
  education: string;
  university: string;
  height: string;
  ethnicity: string;
  sect: string;
  practiceLevel: string;
  prayer: string;
  modesty: string;
  bio: string;
  waliName: string;
  waliRelation: string;
  waliPhone: string;
  photo: string;
}

export const SEED_PASSWORD = 'QurbSeed@2026';
export const SEED_PASSWORD_HASH = '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942';

export const PAKISTANI_FEMALE_SEEDS: SeedProfileDefinition[] = [
  {
    id: 'usr_seed_pk_01',
    name: 'Dr. Ayesha Siddiqui',
    email: 'ayesha.doctor@qurb.app',
    phone: '+923001234501',
    dob: '1998-05-14',
    city: 'Lahore',
    location: 'DHA Phase 5, Lahore, Pakistan',
    lat: 31.4704,
    lon: 74.3987,
    profession: 'Medical Doctor (MBBS / Post-Grad Resident)',
    education: 'MBBS (Doctor of Medicine)',
    university: 'King Edward Medical University (KEMU)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dupatta & Eastern Dress',
    bio: 'Assalamu Alaikum. I am an MBBS doctor currently pursuing specialization in Lahore. Alhumdulillah balanced between my profession and deen. Looking for an educated, pious, and family-oriented life partner who values mutual respect, kindness, and Islamic values.',
    waliName: 'Tariq Siddiqui',
    waliRelation: 'Father',
    waliPhone: '+923009876501',
    photo: '/seeds/seed_female_1.jpg'
  },
  {
    id: 'usr_seed_pk_02',
    name: 'Fatima Noor Zahra',
    email: 'fatima.tech@qurb.app',
    phone: '+923001234502',
    dob: '2000-09-21',
    city: 'Islamabad',
    location: 'F-7/2, Islamabad, Pakistan',
    lat: 33.7215,
    lon: 73.0566,
    profession: 'Senior Software Engineer (Full-Stack)',
    education: 'BS Software Engineering',
    university: 'NUST (SEECS Islamabad)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Attire & Dupatta',
    bio: 'Software engineer working with a US-based remote tech firm from Islamabad. Passionate about technology, reading Islamic history, and coffee. Seeking an ambitious, honest Muslim brother who prays regularly and believes in building a harmonious, supportive home.',
    waliName: 'Zahoor Ahmed',
    waliRelation: 'Father',
    waliPhone: '+923009876502',
    photo: '/seeds/seed_female_2.jpg'
  },
  {
    id: 'usr_seed_pk_03',
    name: 'Zainab Al-Hassan',
    email: 'zainab.lecturer@qurb.app',
    phone: '+923001234503',
    dob: '1997-03-10',
    city: 'Lahore',
    location: 'Gulberg III, Lahore, Pakistan',
    lat: 31.5104,
    lon: 74.3487,
    profession: 'University Lecturer (English Literature)',
    education: 'M.Phil English Literature',
    university: 'Kinnaird College for Women / PU',
    height: "5'3\"",
    ethnicity: 'Kashmiri',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Observant hijabi and university lecturer in Lahore. Literature enthusiast, fond of gardening and calligraphy. Seeking a practicing Muslim life partner with good akhlaq, emotional maturity, and a genuine commitment to sunnah.',
    waliName: 'Hassan Mir',
    waliRelation: 'Father',
    waliPhone: '+923009876503',
    photo: '/seeds/seed_female_3.jpg'
  },
  {
    id: 'usr_seed_pk_04',
    name: 'Maryam Nawaz Khan',
    email: 'maryam.psych@qurb.app',
    phone: '+923001234504',
    dob: '1998-11-28',
    city: 'Karachi',
    location: 'Clifton Block 4, Karachi, Pakistan',
    lat: 24.8157,
    lon: 67.0311,
    profession: 'Clinical Psychologist',
    education: 'MS Clinical Psychology',
    university: 'Institute of Professional Psychology (Bahria Uni)',
    height: "5'4\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Eastern Attire & Dupatta',
    bio: 'Practicing psychologist working at a private clinic in Karachi. Warm, family-centric, and empathetic. Looking for a practicing Sunni brother with a balanced outlook on life, career, and deen.',
    waliName: 'Nawazish Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876504',
    photo: '/seeds/seed_female_4.jpg'
  },
  {
    id: 'usr_seed_pk_05',
    name: 'Mahnoor Tariq',
    email: 'mahnoor.design@qurb.app',
    phone: '+923001234505',
    dob: '2001-07-19',
    city: 'Lahore',
    location: 'Model Town, Lahore, Pakistan',
    lat: 31.4854,
    lon: 74.3211,
    profession: 'UI/UX Product Designer',
    education: 'B.Des (Visual Communication Design)',
    university: 'Beaconhouse National University (BNU)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'moderately_practicing',
    prayer: 'Usually / Striving',
    modesty: 'Modest Shalwar Kameez',
    bio: 'Designer by profession, creative and lively by nature. I value honesty, mutual laughter, and respect for elders. Seeking someone supportive, down to earth, and focused on building a peaceful family.',
    waliName: 'Tariq Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876505',
    photo: '/seeds/seed_female_5.jpg'
  },
  {
    id: 'usr_seed_pk_06',
    name: 'Hania Bilal Malik',
    email: 'hania.finance@qurb.app',
    phone: '+923001234506',
    dob: '1996-12-05',
    city: 'Islamabad',
    location: 'G-11/3, Islamabad, Pakistan',
    lat: 33.6688,
    lon: 72.9987,
    profession: 'Financial Analyst / ACCA Member',
    education: 'ACCA Member & B.Sc Applied Accounting',
    university: 'Oxford Brookes / SKANS',
    height: "5'6\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dupatta',
    bio: 'Senior analyst at a multinational consultancy in Islamabad. Grounded in Islamic morals with a modern professional career. Looking for an educated, career-oriented gentleman who respects his religion and family values.',
    waliName: 'Bilal Malik',
    waliRelation: 'Father',
    waliPhone: '+923009876506',
    photo: '/seeds/seed_female_6.jpg'
  },
  {
    id: 'usr_seed_pk_07',
    name: 'Sara Batool Rizvi',
    email: 'sara.architect@qurb.app',
    phone: '+923001234507',
    dob: '1999-04-12',
    city: 'Karachi',
    location: 'DHA Phase 6, Karachi, Pakistan',
    lat: 24.7957,
    lon: 67.0611,
    profession: 'Architect & Heritage Conservator',
    education: 'B.Arch (Bachelor of Architecture)',
    university: 'Indus Valley School of Art and Architecture (IVS)',
    height: "5'5\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Shia',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Architect with a deep love for Islamic history, heritage preservation, and creative design. Practicing Shia Muslim. Seeking a kind, well-settled, and pious companion.',
    waliName: 'Syed Ali Rizvi',
    waliRelation: 'Father',
    waliPhone: '+923009876507',
    photo: '/seeds/seed_female_7.jpg'
  },
  {
    id: 'usr_seed_pk_08',
    name: 'Laiba Rehman',
    email: 'laiba.pharm@qurb.app',
    phone: '+923001234508',
    dob: '2002-02-18',
    city: 'Faisalabad',
    location: 'Kohinoor City, Faisalabad, Pakistan',
    lat: 31.4304,
    lon: 73.1150,
    profession: 'Pharmacist (Pharm.D)',
    education: 'Doctor of Pharmacy (Pharm.D)',
    university: 'Government College University Faisalabad (GCUF)',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Shalwar Kameez with Dupatta',
    bio: 'Pharm.D graduate from Faisalabad. Simple, family-oriented, and religious. Looking for a decent, educated, and caring life partner from Punjab or Islamabad.',
    waliName: 'Abdul Rehman',
    waliRelation: 'Father',
    waliPhone: '+923009876508',
    photo: '/seeds/seed_female_8.jpg'
  },
  {
    id: 'usr_seed_pk_09',
    name: 'Khadija Tul Kubra',
    email: 'khadija.teacher@qurb.app',
    phone: '+923001234509',
    dob: '1998-08-08',
    city: 'Multan',
    location: 'Cantt, Multan, Pakistan',
    lat: 30.1875,
    lon: 71.4649,
    profession: 'High School Biology Teacher',
    education: 'M.Sc Zoology & B.Ed',
    university: 'Bahauddin Zakariya University Multan',
    height: "5'4\"",
    ethnicity: 'Saraiki / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Educator dedicated to mentoring students. Loving, gentle-natured, and committed to deen. Hoping to find a sincere, humble Muslim man who values a tranquil, barakah-filled domestic life.',
    waliName: 'Muhammad Ismail',
    waliRelation: 'Father',
    waliPhone: '+923009876509',
    photo: '/seeds/seed_female_9.jpg'
  },
  {
    id: 'usr_seed_pk_10',
    name: 'Dr. Amina Sheikh',
    email: 'amina.dentist@qurb.app',
    phone: '+923001234510',
    dob: '1997-10-15',
    city: 'Lahore',
    location: 'Johar Town, Lahore, Pakistan',
    lat: 31.4654,
    lon: 74.2911,
    profession: 'Dental Surgeon (BDS / RDS)',
    education: 'BDS (Bachelor of Dental Surgery)',
    university: 'CMH Lahore Medical College',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Eastern Attire',
    bio: 'Dental surgeon practicing in Lahore. Alhumdulillah family-centric and optimistic. Seeking an accomplished, respectful doctor, engineer, or professional who values family ties and deen.',
    waliName: 'Sheikh Farooq',
    waliRelation: 'Father',
    waliPhone: '+923009876510',
    photo: '/seeds/seed_female_10.jpg'
  },
  {
    id: 'usr_seed_pk_11',
    name: 'Rameen Qureshi',
    email: 'rameen.pm@qurb.app',
    phone: '+923001234511',
    dob: '2000-01-25',
    city: 'Islamabad',
    location: 'E-11/2, Islamabad, Pakistan',
    lat: 33.7088,
    lon: 72.9887,
    profession: 'Technical Product Manager',
    education: 'BS Computer Science',
    university: 'FAST-NUCES Islamabad',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'moderately_practicing',
    prayer: 'Usually / Striving',
    modesty: 'Modest Casual Kurti',
    bio: 'Product manager in fintech. Love travelling, fitness, and reading. Seeking an intellectually compatible, supportive, and kind life partner with strong moral character.',
    waliName: 'Amjad Qureshi',
    waliRelation: 'Father',
    waliPhone: '+923009876511',
    photo: '/seeds/seed_female_11.jpg'
  },
  {
    id: 'usr_seed_pk_12',
    name: 'Zunaira Aslam',
    email: 'zunaira.prof@qurb.app',
    phone: '+923001234512',
    dob: '1995-06-30',
    city: 'Karachi',
    location: 'PECHS Block 2, Karachi, Pakistan',
    lat: 24.8687,
    lon: 67.0611,
    profession: 'Assistant Professor of Economics',
    education: 'MS Economics',
    university: 'Institute of Business Administration (IBA Karachi)',
    height: "5'4\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dupatta & Shalwar Kameez',
    bio: 'Academician at a premier university in Karachi. Calm, mature, and deeply respectful of cultural and religious traditions. Seeking a mature, well-educated, and compassionate spouse.',
    waliName: 'Muhammad Aslam',
    waliRelation: 'Father',
    waliPhone: '+923009876512',
    photo: '/seeds/seed_female_12.jpg'
  },
  {
    id: 'usr_seed_pk_13',
    name: 'Hafsa Munir',
    email: 'hafsa.merch@qurb.app',
    phone: '+923001234513',
    dob: '2001-04-05',
    city: 'Sialkot',
    location: 'Cantt, Sialkot, Pakistan',
    lat: 32.5045,
    lon: 74.5329,
    profession: 'Textile Merchandiser',
    education: 'BS Textile Design & Marketing',
    university: 'PIFD Lahore',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Textile professional from a respected business family in Sialkot. Observes hijab and values modesty. Seeking a trustworthy, hardworking, and devout Muslim partner.',
    waliName: 'Munir Dar',
    waliRelation: 'Father',
    waliPhone: '+923009876513',
    photo: '/seeds/seed_female_13.jpg'
  },
  {
    id: 'usr_seed_pk_14',
    name: 'Syeda Dua Kazmi',
    email: 'dua.data@qurb.app',
    phone: '+923001234514',
    dob: '1999-10-10',
    city: 'Rawalpindi',
    location: 'Chaklala Scheme 3, Rawalpindi, Pakistan',
    lat: 33.5851,
    lon: 73.0869,
    profession: 'Data Scientist (Machine Learning)',
    education: 'BS Data Science',
    university: 'COMSATS University Islamabad',
    height: "5'5\"",
    ethnicity: 'Syed / Punjabi',
    sect: 'Shia',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Shalwar Kameez & Chador',
    bio: 'Data scientist based in Rawalpindi/Islamabad. Quiet, thoughtful, and deeply devoted to my deen. Looking for a gentle, practicing partner who values intellectual conversation and family harmony.',
    waliName: 'Syed Baqir Kazmi',
    waliRelation: 'Father',
    waliPhone: '+923009876514',
    photo: '/seeds/seed_female_14.jpg'
  },
  {
    id: 'usr_seed_pk_15',
    name: 'Dr. Mehwish Altaf',
    email: 'mehwish.health@qurb.app',
    phone: '+923001234515',
    dob: '1997-02-14',
    city: 'Peshawar',
    location: 'Hayatabad Phase 2, Peshawar, Pakistan',
    lat: 33.9851,
    lon: 71.4449,
    profession: 'Public Health Specialist (MBBS, MSPH)',
    education: 'MBBS, Master of Science in Public Health',
    university: 'Khyber Medical University (KMU)',
    height: "5'6\"",
    ethnicity: 'Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab & Abaya',
    bio: 'Medical professional working in healthcare policy. From an educated family in Peshawar. Observing hijab. Seeking an educated, honorable Pashtun or Urdu-speaking Muslim gentleman.',
    waliName: 'Altaf Khan',
    waliRelation: 'Father',
    waliPhone: '+923009876515',
    photo: '/seeds/seed_female_15.jpg'
  },
  {
    id: 'usr_seed_pk_16',
    name: 'Anum Javed',
    email: 'anum.hr@qurb.app',
    phone: '+923001234516',
    dob: '1999-08-20',
    city: 'Lahore',
    location: 'Askari 11, Lahore, Pakistan',
    lat: 31.4504,
    lon: 74.4387,
    profession: 'Human Resources Lead',
    education: 'BSc (Honours) Management Science',
    university: 'LUMS (Lahore University of Management Sciences)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Dupatta',
    bio: 'LUMS graduate currently heading talent acquisition at an MNC. Cheerful, family-first, and respectful. Looking for an ambitious, humble, and pious spouse with good communication skills.',
    waliName: 'Javed Iqbal',
    waliRelation: 'Father',
    waliPhone: '+923009876516',
    photo: '/seeds/seed_female_16.jpg'
  },
  {
    id: 'usr_seed_pk_17',
    name: 'Iqra Shahzadi',
    email: 'iqra.content@qurb.app',
    phone: '+923001234517',
    dob: '2000-12-12',
    city: 'Gujranwala',
    location: 'DC Colony, Gujranwala, Pakistan',
    lat: 32.2077,
    lon: 74.2045,
    profession: 'Content Strategist & Copywriter',
    education: 'BS Mass Communication',
    university: 'Punjab University Lahore',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'moderately_practicing',
    prayer: 'Usually / Striving',
    modesty: 'Modest Shalwar Kameez',
    bio: 'Content writer and freelance creative. Warm, down-to-earth, and fond of baking and family gatherings. Looking for a loyal, caring, and hardworking companion.',
    waliName: 'Shahzad Rafiq',
    waliRelation: 'Father',
    waliPhone: '+923009876517',
    photo: '/seeds/seed_female_17.jpg'
  },
  {
    id: 'usr_seed_pk_18',
    name: 'Sana Mir',
    email: 'sana.law@qurb.app',
    phone: '+923001234518',
    dob: '1995-01-18',
    city: 'Islamabad',
    location: 'F-10/1, Islamabad, Pakistan',
    lat: 33.6988,
    lon: 73.0187,
    profession: 'Corporate Lawyer (Advocate High Court)',
    education: 'LL.B (Honours) / Bar Transfer',
    university: 'University of London International Programmes',
    height: "5'6\"",
    ethnicity: 'Kashmiri / Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Elegant Suit & Dupatta',
    bio: 'High Court advocate practicing commercial law in Islamabad. Independent yet deeply respectful of family bonds and deen. Seeking a mature, professionally accomplished, and grounded gentleman.',
    waliName: 'Mir Alam',
    waliRelation: 'Father',
    waliPhone: '+923009876518',
    photo: '/seeds/seed_female_18.jpg'
  },
  {
    id: 'usr_seed_pk_19',
    name: 'Bushra Farooq',
    email: 'bushra.ca@qurb.app',
    phone: '+923001234519',
    dob: '1996-07-22',
    city: 'Karachi',
    location: 'Gulshan-e-Iqbal Block 6, Karachi, Pakistan',
    lat: 24.9187,
    lon: 67.0911,
    profession: 'Chartered Accountant (ACA / ICAP)',
    education: 'Chartered Accountant (ICAP)',
    university: 'Institute of Chartered Accountants of Pakistan',
    height: "5'4\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Chartered accountant working at a Big 4 firm in Karachi. Observing hijab. Alhumdulillah focused on halal livelihood and religious growth. Looking for an educated, god-fearing brother.',
    waliName: 'Farooq Ahmed',
    waliRelation: 'Father',
    waliPhone: '+923009876519',
    photo: '/seeds/seed_female_19.jpg'
  },
  {
    id: 'usr_seed_pk_20',
    name: 'Aleena Tariq',
    email: 'aleena.interior@qurb.app',
    phone: '+923001234520',
    dob: '2001-09-09',
    city: 'Lahore',
    location: 'WAPDA Town, Lahore, Pakistan',
    lat: 31.4254,
    lon: 74.2611,
    profession: 'Interior Designer',
    education: 'B.Des (Interior Architecture)',
    university: 'National College of Arts (NCA Lahore)',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'moderately_practicing',
    prayer: 'Usually / Striving',
    modesty: 'Modest Shalwar Kameez',
    bio: 'Interior designer running her own studio in Lahore. Creative, warm, and values simple joyful moments with family. Seeking an understanding, honest, and caring partner.',
    waliName: 'Tariq Butt',
    waliRelation: 'Father',
    waliPhone: '+923009876520',
    photo: '/seeds/seed_female_20.jpg'
  },
  {
    id: 'usr_seed_pk_21',
    name: 'Noor-ul-Huda',
    email: 'noor.scholar@qurb.app',
    phone: '+923001234521',
    dob: '1999-03-03',
    city: 'Islamabad',
    location: 'I-8/2, Islamabad, Pakistan',
    lat: 33.6788,
    lon: 73.0687,
    profession: 'Islamic Studies Lecturer & Researcher',
    education: 'BS & MS Islamic Studies / Usul-ud-Din',
    university: 'International Islamic University Islamabad (IIUI)',
    height: "5'3\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Abaya & Hijab',
    bio: 'Hafiza and scholar of Usul-ud-Din teaching in Islamabad. Seeking a practicing Sunni brother who prioritizes Quran and Sunnah, treats his spouse with kindness, and has a clean moral character.',
    waliName: 'Hafiz Abdul Qadir',
    waliRelation: 'Father',
    waliPhone: '+923009876521',
    photo: '/seeds/seed_female_21.jpg'
  },
  {
    id: 'usr_seed_pk_22',
    name: 'Haleema Sadia',
    email: 'haleema.slp@qurb.app',
    phone: '+923001234522',
    dob: '1998-10-04',
    city: 'Abbottabad',
    location: 'PMA Road, Abbottabad, Pakistan',
    lat: 34.1888,
    lon: 73.2315,
    profession: 'Speech & Language Pathologist',
    education: 'BS Speech & Language Pathology',
    university: 'Ayub Medical College / Riphah',
    height: "5'4\"",
    ethnicity: 'Hindko / Pashtun',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Speech therapist helping children develop communication skills. Calm, gentle, and family-oriented. Looking for a respectful, well-educated, and religious partner.',
    waliName: 'Sadia Khan',
    waliRelation: 'Brother',
    waliPhone: '+923009876522',
    photo: '/seeds/seed_female_22.jpg'
  },
  {
    id: 'usr_seed_pk_23',
    name: 'Mishal Waseem',
    email: 'mishal.marketing@qurb.app',
    phone: '+923001234523',
    dob: '2000-06-16',
    city: 'Lahore',
    location: 'Cantt, Lahore, Pakistan',
    lat: 31.5304,
    lon: 74.3787,
    profession: 'Growth & Brand Marketing Lead',
    education: 'BSc (Hons) Business Administration',
    university: 'Forman Christian College (FCCU Lahore)',
    height: "5'5\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'moderately_practicing',
    prayer: 'Usually / Striving',
    modesty: 'Modest Eastern Attire',
    bio: 'Brand marketer for an e-commerce platform. Outgoing, polite, and deeply attached to my parents. Seeking an open-minded, loving, and practicing life partner.',
    waliName: 'Waseem Akram',
    waliRelation: 'Father',
    waliPhone: '+923009876523',
    photo: '/seeds/seed_female_23.jpg'
  },
  {
    id: 'usr_seed_pk_24',
    name: 'Dr. Rabia Basri',
    email: 'rabia.eye@qurb.app',
    phone: '+923001234524',
    dob: '1994-08-30',
    city: 'Karachi',
    location: 'DHA Phase 5, Karachi, Pakistan',
    lat: 24.7857,
    lon: 67.0511,
    profession: 'Consultant Ophthalmologist (FCPS)',
    education: 'MBBS, FCPS Ophthalmology',
    university: 'Dow University of Health Sciences (DUHS)',
    height: "5'5\"",
    ethnicity: 'Urdu Speaking',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Observes Hijab',
    bio: 'Eye surgeon at a tertiary care hospital in Karachi. Observant of hijab, grounded in Islamic values and ethical practice. Looking for a doctor, engineer, or professional who shares similar values.',
    waliName: 'Basir Ahmed',
    waliRelation: 'Father',
    waliPhone: '+923009876524',
    photo: '/seeds/seed_female_24.jpg'
  },
  {
    id: 'usr_seed_pk_25',
    name: 'Momina Zafar',
    email: 'momina.security@qurb.app',
    phone: '+923001234525',
    dob: '2001-11-03',
    city: 'Rawalpindi',
    location: 'Westridge 1, Rawalpindi, Pakistan',
    lat: 33.6051,
    lon: 73.0369,
    profession: 'Cyber Security Analyst',
    education: 'BS Cyber Security',
    university: 'Air University Islamabad',
    height: "5'4\"",
    ethnicity: 'Punjabi',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    prayer: 'Always (5 times daily)',
    modesty: 'Modest Shalwar Kameez & Dupatta',
    bio: 'Cyber security analyst in a defense consultancy. Tech enthusiast who loves archery, cooking, and reading hadith. Seeking a devout, caring, and trustworthy Muslim companion.',
    waliName: 'Zafar Mehmood',
    waliRelation: 'Father',
    waliPhone: '+923009876525',
    photo: '/seeds/seed_female_25.jpg'
  }
];

export async function ensureSeedProfiles(db: any): Promise<number> {
  try {
    // 1. Ensure columns exist on users
    try {
      await db.prepare('ALTER TABLE users ADD COLUMN is_seed BOOLEAN DEFAULT 0').run();
    } catch {}
    try {
      await db.prepare('ALTER TABLE users ADD COLUMN seed_active BOOLEAN DEFAULT 1').run();
    } catch {}
    try {
      await db.prepare(`ALTER TABLE users ADD COLUMN seed_password TEXT DEFAULT '${SEED_PASSWORD}'`).run();
    } catch {}

    // 2. Ensure app_settings table exists
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      await db.prepare(`
        INSERT OR IGNORE INTO app_settings (key, value) VALUES ('seed_profiles_enabled', '1')
      `).run();
    } catch {}

    // 3. Check existing count of seeds
    const existing = await db.prepare('SELECT COUNT(*) as count FROM users WHERE is_seed = 1').first();
    const count = existing ? Number(existing.count) : 0;
    if (count >= PAKISTANI_FEMALE_SEEDS.length) {
      return count;
    }

    // 4. Insert seeds
    for (const p of PAKISTANI_FEMALE_SEEDS) {
      await db.prepare(`
        INSERT OR REPLACE INTO users (
          id, phone, email, password_hash, full_name, dob, gender, location, city, country,
          latitude, longitude, height, bio, profession, education, university,
          ethnicity, family_structure, living_preference, siblings_count,
          willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
          children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
          is_phone_verified, is_id_verified, is_vip, is_profile_completed,
          is_seed, seed_active, seed_password, account_status, is_banned
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, 'female', ?, ?, 'Pakistan',
          ?, ?, ?,
          ?,
          ?, ?, ?,
          ?, 'nuclear', 'independent', 2,
          'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
          'desires_children', 'within_1_year', 0, 'all_users',
          1, 1, 0, 1,
          1, 1, ?, 'active', 0
        )
      `).bind(
        p.id, p.phone, p.email, SEED_PASSWORD_HASH,
        p.name, p.dob, p.location, p.city,
        p.lat, p.lon, p.height,
        p.bio,
        p.profession, p.education, p.university,
        p.ethnicity, SEED_PASSWORD
      ).run();

      await db.prepare(`
        INSERT OR REPLACE INTO religious_profiles (
          user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
          quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
        ) VALUES (
          ?, ?, ?, 'Hanafi', ?, 'Strictly Halal',
          'Regular with translation', ?, 'Planning insha''Allah',
          'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
        )
      `).bind(
        p.id, p.practiceLevel, p.sect, p.prayer, p.modesty
      ).run();

      await db.prepare(`
        INSERT OR REPLACE INTO wali_details (
          id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
        ) VALUES (
          ?, ?, ?, ?, ?, 1, 1
        )
      `).bind(
        `wali_${p.id}`, p.id, p.waliName, p.waliPhone, p.waliRelation
      ).run();

      const finalPhoto = p.photo.startsWith('http')
        ? p.photo
        : `https://serene-union-api.brandracker.workers.dev/api/photos/media/${p.photo.replace(/^\/seeds\//, '')}`;

      await db.prepare(`
        INSERT OR REPLACE INTO user_photos (
          id, user_id, photo_url, is_primary, sort_order
        ) VALUES (
          ?, ?, ?, 1, 1
        )
      `).bind(
        `photo_${p.id}_1`, p.id, finalPhoto
      ).run();
    }

    return PAKISTANI_FEMALE_SEEDS.length;
  } catch (err) {
    console.error('Error ensuring seed profiles:', err);
    return 0;
  }
}
