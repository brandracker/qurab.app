-- ====================================================================
-- Qurb Matrimony: 25 Authentic Pakistani Female Seed Profiles
-- Generated with Login Credentials, GPS Coordinates, & Deen Biodata
-- ====================================================================

-- 1. Ensure Table Schema Columns
ALTER TABLE users ADD COLUMN is_seed BOOLEAN DEFAULT 0;
ALTER TABLE users ADD COLUMN seed_active BOOLEAN DEFAULT 1;
ALTER TABLE users ADD COLUMN seed_password TEXT DEFAULT 'QurbSeed@2026';

CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR REPLACE INTO app_settings (key, value) VALUES ('seed_profiles_enabled', '1');

-- 2. Insert Profiles

-- Profile: Dr. Ayesha Siddiqui (Lahore, Age: 28, Medical Doctor (MBBS / Post-Grad Resident))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_01', '+923001234501', 'ayesha.doctor@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Ayesha Siddiqui', '1998-05-14', 'female', 'DHA Phase 5, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.3987, '5'4"',
  'Assalamu Alaikum. I am an MBBS doctor currently pursuing specialization in Lahore. Alhumdulillah balanced between my profession and deen. Looking for an educated, pious, and family-oriented life partner who values mutual respect, kindness, and Islamic values.',
  'Medical Doctor (MBBS / Post-Grad Resident)', 'MBBS (Doctor of Medicine)', 'King Edward Medical University (KEMU)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_01', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dupatta & Eastern Dress', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_01', 'usr_seed_pk_01', 'Tariq Siddiqui', '+923009876501', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_01_1', 'usr_seed_pk_01', '/seeds/seed_female_1.jpg', 1, 1
);

-- Profile: Fatima Noor Zahra (Islamabad, Age: 26, Senior Software Engineer (Full-Stack))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_02', '+923001234502', 'fatima.tech@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Fatima Noor Zahra', '2000-09-21', 'female', 'F-7/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.0566, '5'5"',
  'Software engineer working with a US-based remote tech firm from Islamabad. Passionate about technology, reading Islamic history, and coffee. Seeking an ambitious, honest Muslim brother who prays regularly and believes in building a harmonious, supportive home.',
  'Senior Software Engineer (Full-Stack)', 'BS Software Engineering', 'NUST (SEECS Islamabad)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_02', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Attire & Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_02', 'usr_seed_pk_02', 'Zahoor Ahmed', '+923009876502', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_02_1', 'usr_seed_pk_02', '/seeds/seed_female_2.jpg', 1, 1
);

-- Profile: Zainab Al-Hassan (Lahore, Age: 29, University Lecturer (English Literature))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_03', '+923001234503', 'zainab.lecturer@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zainab Al-Hassan', '1997-03-10', 'female', 'Gulberg III, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.5104, 74.3487, '5'3"',
  'Observant hijabi and university lecturer in Lahore. Literature enthusiast, fond of gardening and calligraphy. Seeking a practicing Muslim life partner with good akhlaq, emotional maturity, and a genuine commitment to sunnah.',
  'University Lecturer (English Literature)', 'M.Phil English Literature', 'Kinnaird College for Women / PU',
  'Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_03', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_03', 'usr_seed_pk_03', 'Hassan Mir', '+923009876503', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_03_1', 'usr_seed_pk_03', '/seeds/seed_female_3.jpg', 1, 1
);

-- Profile: Maryam Nawaz Khan (Karachi, Age: 28, Clinical Psychologist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_04', '+923001234504', 'maryam.psych@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Maryam Nawaz Khan', '1998-11-28', 'female', 'Clifton Block 4, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8157, 67.0311, '5'4"',
  'Practicing psychologist working at a private clinic in Karachi. Warm, family-centric, and empathetic. Looking for a practicing Sunni brother with a balanced outlook on life, career, and deen.',
  'Clinical Psychologist', 'MS Clinical Psychology', 'Institute of Professional Psychology (Bahria Uni)',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_04', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Eastern Attire & Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_04', 'usr_seed_pk_04', 'Nawazish Khan', '+923009876504', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_04_1', 'usr_seed_pk_04', '/seeds/seed_female_4.jpg', 1, 1
);

-- Profile: Mahnoor Tariq (Lahore, Age: 25, UI/UX Product Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_05', '+923001234505', 'mahnoor.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Mahnoor Tariq', '2001-07-19', 'female', 'Model Town, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4854, 74.3211, '5'5"',
  'Designer by profession, creative and lively by nature. I value honesty, mutual laughter, and respect for elders. Seeking someone supportive, down to earth, and focused on building a peaceful family.',
  'UI/UX Product Designer', 'B.Des (Visual Communication Design)', 'Beaconhouse National University (BNU)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_05', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_05', 'usr_seed_pk_05', 'Tariq Mehmood', '+923009876505', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_05_1', 'usr_seed_pk_05', '/seeds/seed_female_5.jpg', 1, 1
);

-- Profile: Hania Bilal Malik (Islamabad, Age: 30, Financial Analyst / ACCA Member)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_06', '+923001234506', 'hania.finance@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hania Bilal Malik', '1996-12-05', 'female', 'G-11/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6688, 72.9987, '5'6"',
  'Senior analyst at a multinational consultancy in Islamabad. Grounded in Islamic morals with a modern professional career. Looking for an educated, career-oriented gentleman who respects his religion and family values.',
  'Financial Analyst / ACCA Member', 'ACCA Member & B.Sc Applied Accounting', 'Oxford Brookes / SKANS',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_06', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_06', 'usr_seed_pk_06', 'Bilal Malik', '+923009876506', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_06_1', 'usr_seed_pk_06', '/seeds/seed_female_6.jpg', 1, 1
);

-- Profile: Sara Batool Rizvi (Karachi, Age: 27, Architect & Heritage Conservator)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_07', '+923001234507', 'sara.architect@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Sara Batool Rizvi', '1999-04-12', 'female', 'DHA Phase 6, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.7957, 67.0611, '5'5"',
  'Architect with a deep love for Islamic history, heritage preservation, and creative design. Practicing Shia Muslim. Seeking a kind, well-settled, and pious companion.',
  'Architect & Heritage Conservator', 'B.Arch (Bachelor of Architecture)', 'Indus Valley School of Art and Architecture (IVS)',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_07', 'practicing', 'Shia', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_07', 'usr_seed_pk_07', 'Syed Ali Rizvi', '+923009876507', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_07_1', 'usr_seed_pk_07', '/seeds/seed_female_7.jpg', 1, 1
);

-- Profile: Laiba Rehman (Faisalabad, Age: 24, Pharmacist (Pharm.D))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_08', '+923001234508', 'laiba.pharm@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Laiba Rehman', '2002-02-18', 'female', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.4304, 73.115, '5'3"',
  'Pharm.D graduate from Faisalabad. Simple, family-oriented, and religious. Looking for a decent, educated, and caring life partner from Punjab or Islamabad.',
  'Pharmacist (Pharm.D)', 'Doctor of Pharmacy (Pharm.D)', 'Government College University Faisalabad (GCUF)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_08', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez with Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_08', 'usr_seed_pk_08', 'Abdul Rehman', '+923009876508', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_08_1', 'usr_seed_pk_08', '/seeds/seed_female_8.jpg', 1, 1
);

-- Profile: Khadija Tul Kubra (Multan, Age: 28, High School Biology Teacher)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_09', '+923001234509', 'khadija.teacher@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Khadija Tul Kubra', '1998-08-08', 'female', 'Cantt, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1875, 71.4649, '5'4"',
  'Educator dedicated to mentoring students. Loving, gentle-natured, and committed to deen. Hoping to find a sincere, humble Muslim man who values a tranquil, barakah-filled domestic life.',
  'High School Biology Teacher', 'M.Sc Zoology & B.Ed', 'Bahauddin Zakariya University Multan',
  'Saraiki / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_09', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_09', 'usr_seed_pk_09', 'Muhammad Ismail', '+923009876509', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_09_1', 'usr_seed_pk_09', '/seeds/seed_female_9.jpg', 1, 1
);

-- Profile: Dr. Amina Sheikh (Lahore, Age: 29, Dental Surgeon (BDS / RDS))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_10', '+923001234510', 'amina.dentist@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Amina Sheikh', '1997-10-15', 'female', 'Johar Town, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4654, 74.2911, '5'4"',
  'Dental surgeon practicing in Lahore. Alhumdulillah family-centric and optimistic. Seeking an accomplished, respectful doctor, engineer, or professional who values family ties and deen.',
  'Dental Surgeon (BDS / RDS)', 'BDS (Bachelor of Dental Surgery)', 'CMH Lahore Medical College',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_10', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Eastern Attire', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_10', 'usr_seed_pk_10', 'Sheikh Farooq', '+923009876510', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_10_1', 'usr_seed_pk_10', '/seeds/seed_female_10.jpg', 1, 1
);

-- Profile: Rameen Qureshi (Islamabad, Age: 26, Technical Product Manager)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_11', '+923001234511', 'rameen.pm@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rameen Qureshi', '2000-01-25', 'female', 'E-11/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7088, 72.9887, '5'5"',
  'Product manager in fintech. Love travelling, fitness, and reading. Seeking an intellectually compatible, supportive, and kind life partner with strong moral character.',
  'Technical Product Manager', 'BS Computer Science', 'FAST-NUCES Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_11', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Casual Kurti', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_11', 'usr_seed_pk_11', 'Amjad Qureshi', '+923009876511', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_11_1', 'usr_seed_pk_11', '/seeds/seed_female_11.jpg', 1, 1
);

-- Profile: Zunaira Aslam (Karachi, Age: 31, Assistant Professor of Economics)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_12', '+923001234512', 'zunaira.prof@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zunaira Aslam', '1995-06-30', 'female', 'PECHS Block 2, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8687, 67.0611, '5'4"',
  'Academician at a premier university in Karachi. Calm, mature, and deeply respectful of cultural and religious traditions. Seeking a mature, well-educated, and compassionate spouse.',
  'Assistant Professor of Economics', 'MS Economics', 'Institute of Business Administration (IBA Karachi)',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_12', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dupatta & Shalwar Kameez', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_12', 'usr_seed_pk_12', 'Muhammad Aslam', '+923009876512', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_12_1', 'usr_seed_pk_12', '/seeds/seed_female_12.jpg', 1, 1
);

-- Profile: Hafsa Munir (Sialkot, Age: 25, Textile Merchandiser)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_13', '+923001234513', 'hafsa.merch@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hafsa Munir', '2001-04-05', 'female', 'Cantt, Sialkot, Pakistan', 'Sialkot', 'Pakistan',
  32.5045, 74.5329, '5'3"',
  'Textile professional from a respected business family in Sialkot. Observes hijab and values modesty. Seeking a trustworthy, hardworking, and devout Muslim partner.',
  'Textile Merchandiser', 'BS Textile Design & Marketing', 'PIFD Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_13', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_13', 'usr_seed_pk_13', 'Munir Dar', '+923009876513', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_13_1', 'usr_seed_pk_13', '/seeds/seed_female_13.jpg', 1, 1
);

-- Profile: Syeda Dua Kazmi (Rawalpindi, Age: 27, Data Scientist (Machine Learning))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_14', '+923001234514', 'dua.data@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Syeda Dua Kazmi', '1999-10-10', 'female', 'Chaklala Scheme 3, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5851, 73.0869, '5'5"',
  'Data scientist based in Rawalpindi/Islamabad. Quiet, thoughtful, and deeply devoted to my deen. Looking for a gentle, practicing partner who values intellectual conversation and family harmony.',
  'Data Scientist (Machine Learning)', 'BS Data Science', 'COMSATS University Islamabad',
  'Syed / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_14', 'practicing', 'Shia', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez & Chador', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_14', 'usr_seed_pk_14', 'Syed Baqir Kazmi', '+923009876514', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_14_1', 'usr_seed_pk_14', '/seeds/seed_female_14.jpg', 1, 1
);

-- Profile: Dr. Mehwish Altaf (Peshawar, Age: 29, Public Health Specialist (MBBS, MSPH))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_15', '+923001234515', 'mehwish.health@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Mehwish Altaf', '1997-02-14', 'female', 'Hayatabad Phase 2, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.9851, 71.4449, '5'6"',
  'Medical professional working in healthcare policy. From an educated family in Peshawar. Observing hijab. Seeking an educated, honorable Pashtun or Urdu-speaking Muslim gentleman.',
  'Public Health Specialist (MBBS, MSPH)', 'MBBS, Master of Science in Public Health', 'Khyber Medical University (KMU)',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_15', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab & Abaya', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_15', 'usr_seed_pk_15', 'Altaf Khan', '+923009876515', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_15_1', 'usr_seed_pk_15', '/seeds/seed_female_15.jpg', 1, 1
);

-- Profile: Anum Javed (Lahore, Age: 27, Human Resources Lead)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_16', '+923001234516', 'anum.hr@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Anum Javed', '1999-08-20', 'female', 'Askari 11, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4504, 74.4387, '5'5"',
  'LUMS graduate currently heading talent acquisition at an MNC. Cheerful, family-first, and respectful. Looking for an ambitious, humble, and pious spouse with good communication skills.',
  'Human Resources Lead', 'BSc (Honours) Management Science', 'LUMS (Lahore University of Management Sciences)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_16', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_16', 'usr_seed_pk_16', 'Javed Iqbal', '+923009876516', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_16_1', 'usr_seed_pk_16', '/seeds/seed_female_16.jpg', 1, 1
);

-- Profile: Iqra Shahzadi (Gujranwala, Age: 26, Content Strategist & Copywriter)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_17', '+923001234517', 'iqra.content@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Iqra Shahzadi', '2000-12-12', 'female', 'DC Colony, Gujranwala, Pakistan', 'Gujranwala', 'Pakistan',
  32.2077, 74.2045, '5'3"',
  'Content writer and freelance creative. Warm, down-to-earth, and fond of baking and family gatherings. Looking for a loyal, caring, and hardworking companion.',
  'Content Strategist & Copywriter', 'BS Mass Communication', 'Punjab University Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_17', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_17', 'usr_seed_pk_17', 'Shahzad Rafiq', '+923009876517', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_17_1', 'usr_seed_pk_17', '/seeds/seed_female_17.jpg', 1, 1
);

-- Profile: Sana Mir (Islamabad, Age: 31, Corporate Lawyer (Advocate High Court))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_18', '+923001234518', 'sana.law@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Sana Mir', '1995-01-18', 'female', 'F-10/1, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6988, 73.0187, '5'6"',
  'High Court advocate practicing commercial law in Islamabad. Independent yet deeply respectful of family bonds and deen. Seeking a mature, professionally accomplished, and grounded gentleman.',
  'Corporate Lawyer (Advocate High Court)', 'LL.B (Honours) / Bar Transfer', 'University of London International Programmes',
  'Kashmiri / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_18', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Elegant Suit & Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_18', 'usr_seed_pk_18', 'Mir Alam', '+923009876518', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_18_1', 'usr_seed_pk_18', '/seeds/seed_female_18.jpg', 1, 1
);

-- Profile: Bushra Farooq (Karachi, Age: 30, Chartered Accountant (ACA / ICAP))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_19', '+923001234519', 'bushra.ca@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Bushra Farooq', '1996-07-22', 'female', 'Gulshan-e-Iqbal Block 6, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.9187, 67.0911, '5'4"',
  'Chartered accountant working at a Big 4 firm in Karachi. Observing hijab. Alhumdulillah focused on halal livelihood and religious growth. Looking for an educated, god-fearing brother.',
  'Chartered Accountant (ACA / ICAP)', 'Chartered Accountant (ICAP)', 'Institute of Chartered Accountants of Pakistan',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_19', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_19', 'usr_seed_pk_19', 'Farooq Ahmed', '+923009876519', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_19_1', 'usr_seed_pk_19', '/seeds/seed_female_19.jpg', 1, 1
);

-- Profile: Aleena Tariq (Lahore, Age: 25, Interior Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_20', '+923001234520', 'aleena.interior@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Aleena Tariq', '2001-09-09', 'female', 'WAPDA Town, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4254, 74.2611, '5'4"',
  'Interior designer running her own studio in Lahore. Creative, warm, and values simple joyful moments with family. Seeking an understanding, honest, and caring partner.',
  'Interior Designer', 'B.Des (Interior Architecture)', 'National College of Arts (NCA Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_20', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_20', 'usr_seed_pk_20', 'Tariq Butt', '+923009876520', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_20_1', 'usr_seed_pk_20', '/seeds/seed_female_20.jpg', 1, 1
);

-- Profile: Noor-ul-Huda (Islamabad, Age: 27, Islamic Studies Lecturer & Researcher)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_21', '+923001234521', 'noor.scholar@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Noor-ul-Huda', '1999-03-03', 'female', 'I-8/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6788, 73.0687, '5'3"',
  'Hafiza and scholar of Usul-ud-Din teaching in Islamabad. Seeking a practicing Sunni brother who prioritizes Quran and Sunnah, treats his spouse with kindness, and has a clean moral character.',
  'Islamic Studies Lecturer & Researcher', 'BS & MS Islamic Studies / Usul-ud-Din', 'International Islamic University Islamabad (IIUI)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_21', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Abaya & Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_21', 'usr_seed_pk_21', 'Hafiz Abdul Qadir', '+923009876521', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_21_1', 'usr_seed_pk_21', '/seeds/seed_female_21.jpg', 1, 1
);

-- Profile: Haleema Sadia (Abbottabad, Age: 28, Speech & Language Pathologist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_22', '+923001234522', 'haleema.slp@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Haleema Sadia', '1998-10-04', 'female', 'PMA Road, Abbottabad, Pakistan', 'Abbottabad', 'Pakistan',
  34.1888, 73.2315, '5'4"',
  'Speech therapist helping children develop communication skills. Calm, gentle, and family-oriented. Looking for a respectful, well-educated, and religious partner.',
  'Speech & Language Pathologist', 'BS Speech & Language Pathology', 'Ayub Medical College / Riphah',
  'Hindko / Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_22', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_22', 'usr_seed_pk_22', 'Sadia Khan', '+923009876522', 'Brother', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_22_1', 'usr_seed_pk_22', '/seeds/seed_female_22.jpg', 1, 1
);

-- Profile: Mishal Waseem (Lahore, Age: 26, Growth & Brand Marketing Lead)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_23', '+923001234523', 'mishal.marketing@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Mishal Waseem', '2000-06-16', 'female', 'Cantt, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.5304, 74.3787, '5'5"',
  'Brand marketer for an e-commerce platform. Outgoing, polite, and deeply attached to my parents. Seeking an open-minded, loving, and practicing life partner.',
  'Growth & Brand Marketing Lead', 'BSc (Hons) Business Administration', 'Forman Christian College (FCCU Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_23', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Eastern Attire', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_23', 'usr_seed_pk_23', 'Waseem Akram', '+923009876523', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_23_1', 'usr_seed_pk_23', '/seeds/seed_female_23.jpg', 1, 1
);

-- Profile: Dr. Rabia Basri (Karachi, Age: 32, Consultant Ophthalmologist (FCPS))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_24', '+923001234524', 'rabia.eye@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Rabia Basri', '1994-08-30', 'female', 'DHA Phase 5, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.7857, 67.0511, '5'5"',
  'Eye surgeon at a tertiary care hospital in Karachi. Observant of hijab, grounded in Islamic values and ethical practice. Looking for a doctor, engineer, or professional who shares similar values.',
  'Consultant Ophthalmologist (FCPS)', 'MBBS, FCPS Ophthalmology', 'Dow University of Health Sciences (DUHS)',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_24', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_24', 'usr_seed_pk_24', 'Basir Ahmed', '+923009876524', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_24_1', 'usr_seed_pk_24', '/seeds/seed_female_24.jpg', 1, 1
);

-- Profile: Momina Zafar (Rawalpindi, Age: 25, Cyber Security Analyst)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_25', '+923001234525', 'momina.security@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Momina Zafar', '2001-11-03', 'female', 'Westridge 1, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.6051, 73.0369, '5'4"',
  'Cyber security analyst in a defense consultancy. Tech enthusiast who loves archery, cooking, and reading hadith. Seeking a devout, caring, and trustworthy Muslim companion.',
  'Cyber Security Analyst', 'BS Cyber Security', 'Air University Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_25', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez & Dupatta', 'Planning insha\'Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_25', 'usr_seed_pk_25', 'Zafar Mehmood', '+923009876525', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_25_1', 'usr_seed_pk_25', '/seeds/seed_female_25.jpg', 1, 1
);
