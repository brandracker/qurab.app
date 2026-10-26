-- ====================================================================
-- Qurb Matrimony: 20 New Authentic Pakistani Female Seed Profiles (81 - 100)
-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)
-- Human Touch v3.5 Standard (.agents/skills/pakistani-matrimony-generator/SKILL.md)
-- ====================================================================

-- Profile: Maham Zahid (Islamabad, Age: 19, 2nd Year BS Psychology Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_81', '+923001234581', 'maham.zahid@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Maham Zahid', '2007-04-14', 'female', 'Sector F-7/1, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.056, '5''4"',
  'Assalamu Alaikum. Psychology sophomore passionate about human empathy, mental well-being, and creative writing. Cheerful, family-centric, and grounded in Islamic adab. Seeking a kind-hearted, educated life partner who values mutual respect and shared spiritual growth.',
  '2nd Year BS Psychology Student', 'BS Psychology (In Progress)', 'NUST Islamabad',
  'Punjabi / Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-56 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_81', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Sage Linen Co-ord & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_81', 'usr_seed_pk_81', 'Zahid Mahmood Akhtar', '+923009876581', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_81_1', 'usr_seed_pk_81', '/seeds/seed_female_81.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_81.jpg' WHERE user_id = 'usr_seed_pk_81';

-- Profile: Dua Fatima (Lahore, Age: 21, 3rd Year Computer Science Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_82', '+923001234582', 'dua.fatima@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dua Fatima', '2005-09-22', 'female', 'DHA Phase 6, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.4387, '5''5"',
  'BS CS student passionate about mobile technologies, UI/UX aesthetics, and creative problem solving. Warm, grounded, and loves weekend baking with family. Seeking an ambitious, practicing Muslim brother who balances deen and worldly goals with integrity.',
  '3rd Year Computer Science Student', 'BS Computer Science (In Progress)', 'FAST-NUCES Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-19 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_82', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Mustard Yellow Kurti & White Cigarette Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_82', 'usr_seed_pk_82', 'Muhammad Arshad', '+923009876582', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_82_1', 'usr_seed_pk_82', '/seeds/seed_female_82.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_82.jpg' WHERE user_id = 'usr_seed_pk_82';

-- Profile: Dr. Anaya Malik (Rawalpindi, Age: 22, 4th Year MBBS Medical Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_83', '+923001234583', 'anaya.malik@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Anaya Malik', '2004-06-18', 'female', 'Bahria Town Phase 8, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5186, 73.0844, '5''6"',
  'Medical student dedicated to healthcare, pediatric medicine, and compassionate community service. Soft-spoken, graceful, and deeply rooted in Islamic values. Looking for an educated, respectful, and family-oriented partner with noble character.',
  '4th Year MBBS Medical Student', 'MBBS (In Progress)', 'Rawalpindi Medical University (RMU)',
  'Punjabi (Awan)', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-51 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_83', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Rose Raw Silk Shirt & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_83', 'usr_seed_pk_83', 'Dr. Tariq Malik', '+923009876583', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_83_1', 'usr_seed_pk_83', '/seeds/seed_female_83.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_83.jpg' WHERE user_id = 'usr_seed_pk_83';

-- Profile: Eshal Rehan (Karachi, Age: 20, 2nd Year Architecture Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_84', '+923001234584', 'eshal.rehan@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Eshal Rehan', '2006-02-28', 'female', 'Clifton Block 4, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8138, 67.0299, '5''4"',
  'Architecture student who appreciates sustainable design, calligraphy, and historic heritage. Approachable, polite, and family-oriented. Looking for a deen-conscious, supportive partner who appreciates learning and intellectual harmony.',
  '2nd Year Architecture Student', 'Bachelor of Architecture (In Progress)', 'Indus Valley School of Art and Architecture (IVS)',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-27 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_84', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Ivory & Peach Embroidered Kurti with Linen Trousers', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_84', 'usr_seed_pk_84', 'Rehan Farooqui', '+923009876584', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_84_1', 'usr_seed_pk_84', '/seeds/seed_female_84.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_84.jpg' WHERE user_id = 'usr_seed_pk_84';

-- Profile: Hania Tariq (Karachi, Age: 20, 2nd Year Media Sciences Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_85', '+923001234585', 'hania.tariq@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hania Tariq', '2006-11-15', 'female', 'DHA Phase 5, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8012, 67.0421, '5''3"',
  'Passionate about digital communications, photography, and literature. Cheerful, honest, and grounded in core Islamic principles. Seeking a sincere, mature life partner who values warmth, family ties, and mutual encouragement.',
  '2nd Year Media Sciences Student', 'BS Media Sciences (In Progress)', 'SZABIST Karachi',
  'Muhajir / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-38 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_85', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Mint Kurti with White Trousers', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_85', 'usr_seed_pk_85', 'Tariq Javed', '+923009876585', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_85_1', 'usr_seed_pk_85', '/seeds/seed_female_85.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_85.jpg' WHERE user_id = 'usr_seed_pk_85';

-- Profile: Zainab Kamran (Islamabad, Age: 19, 2nd Year Industrial Design Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_86', '+923001234586', 'zainab.kamran@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zainab Kamran', '2007-07-05', 'female', 'Sector F-10/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6938, 73.0033, '5''5"',
  'Design student with a keen eye for aesthetics, minimalist interiors, and nature walks. Peaceful, polite, and close to my parents. Seeking an educated, upright practicing partner with noble moral values.',
  '2nd Year Industrial Design Student', 'Bachelor of Design (In Progress)', 'COMSATS University Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-28 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_86', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Powder Blue Co-ord Set & Lightweight Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_86', 'usr_seed_pk_86', 'Kamran Hafeez', '+923009876586', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_86_1', 'usr_seed_pk_86', '/seeds/seed_female_86.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_86.jpg' WHERE user_id = 'usr_seed_pk_86';

-- Profile: Minahil Usman (Lahore, Age: 21, 3rd Year Visual Communications & UI Intern)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_87', '+923001234587', 'minahil.usman@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Minahil Usman', '2005-03-12', 'female', 'Model Town Block C, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4852, 74.3214, '5''4"',
  'Graphic design student and freelance UI creator. Love gardening, Islamic history podcasts, and spending time with younger siblings. Looking for an ambitious, humble, and deen-loving husband.',
  '3rd Year Visual Communications & UI Intern', 'BFA Graphic Design (In Progress)', 'PUCAD Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-34 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_87', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Lavender Linen Kurti & White Culottes', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_87', 'usr_seed_pk_87', 'Usman Ghani', '+923009876587', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_87_1', 'usr_seed_pk_87', '/seeds/seed_female_87.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_87.jpg' WHERE user_id = 'usr_seed_pk_87';

-- Profile: Palwasha Khattak (Peshawar, Age: 21, 3rd Year BS Artificial Intelligence Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_88', '+923001234588', 'palwasha.khattak@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Palwasha Khattak', '2005-10-30', 'female', 'Hayatabad Phase 5, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.985, 71.4395, '5''5"',
  'Pashtun tech enthusiast studying artificial intelligence. Grounded in family traditions, hospitality, and daily prayers. Seeking an educated, respectful, and career-supportive Pashtun or Urdu-speaking Muslim brother.',
  '3rd Year BS Artificial Intelligence Student', 'BS AI (In Progress)', 'UET Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-11 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_88', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Peach Kurti & Matching Traditional Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_88', 'usr_seed_pk_88', 'Zahid Khan Khattak', '+923009876588', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_88_1', 'usr_seed_pk_88', '/seeds/seed_female_88.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_88.jpg' WHERE user_id = 'usr_seed_pk_88';

-- Profile: Ayla Noor (Rawalpindi, Age: 18, 1st Year BS Biotechnology Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_89', '+923001234589', 'ayla.noor@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Ayla Noor', '2008-05-19', 'female', 'Chaklala Scheme 3, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5855, 73.0822, '5''3"',
  'Freshman student enthusiastic about biosciences and genetics. Sincere, cheerful, and raised with strong Islamic principles. Seeking a well-educated, respectful partner whose family values modesty and kindness.',
  '1st Year BS Biotechnology Student', 'BS Biotechnology (In Progress)', 'Foundation University Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-32 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_89', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Soft Pink Lawn Kurti & White Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_89', 'usr_seed_pk_89', 'Noor-ul-Hassan', '+923009876589', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_89_1', 'usr_seed_pk_89', '/seeds/seed_female_89.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_89.jpg' WHERE user_id = 'usr_seed_pk_89';

-- Profile: Kinza Mueen (Faisalabad, Age: 19, 2nd Year English Literature Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_90', '+923001234590', 'kinza.mueen@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Kinza Mueen', '2007-12-08', 'female', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.4187, 73.1118, '5''4"',
  'Literature student who loves classic novels, Urdu poetry, and baking. Calm, thoughtful, and deeply respectful of elders. Looking for an educated, caring life partner who values peace of heart and Islamic virtue.',
  '2nd Year English Literature Student', 'BS English Literature (In Progress)', 'GC University Faisalabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-35 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_90', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Sea-Green Cotton Kurti & White Cigarette Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_90', 'usr_seed_pk_90', 'Mueen-ud-Din', '+923009876590', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_90_1', 'usr_seed_pk_90', '/seeds/seed_female_90.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_90.jpg' WHERE user_id = 'usr_seed_pk_90';

-- Profile: Maryam Bukhari (Multan, Age: 22, Clinical Psychology Trainee & BS Honors)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_91', '+923001234591', 'maryam.bukhari@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Maryam Bukhari', '2004-08-25', 'female', 'Multan Cantt, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1984, 71.4485, '5''4"',
  'Psychology graduate focusing on child and family counseling. Soft-spoken, family-oriented, and proud of our spiritual heritage. Seeking a pious, mature, and supportive life companion.',
  'Clinical Psychology Trainee & BS Honors', 'BS Clinical Psychology', 'Bahauddin Zakariya University (BZU)',
  'Syed', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-14 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_91', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Ochre-Gold Embroidered Kurti & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_91', 'usr_seed_pk_91', 'Syed Qasim Bukhari', '+923009876591', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_91_1', 'usr_seed_pk_91', '/seeds/seed_female_91.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_91.jpg' WHERE user_id = 'usr_seed_pk_91';

-- Profile: Rameen Abbasi (Abbottabad, Age: 21, 3rd Year BS Environmental Sciences)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_92', '+923001234592', 'rameen.abbasi@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rameen Abbasi', '2005-01-16', 'female', 'Jinnahabad, Abbottabad, Pakistan', 'Abbottabad', 'Pakistan',
  34.1688, 73.2215, '5''5"',
  'Nature enthusiast and environmental science student. Growing up in the hills has given me a deep appreciation for peaceful simple living and nature. Looking for an educated, humble, and deen-loving husband.',
  '3rd Year BS Environmental Sciences', 'BS Environmental Sciences (In Progress)', 'COMSATS Abbottabad',
  'Abbasi / Hindko', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-48 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_92', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Beige Woolen Kurti with Cream Pashmina Shawl', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_92', 'usr_seed_pk_92', 'Raja Zaheer Abbasi', '+923009876592', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_92_1', 'usr_seed_pk_92', '/seeds/seed_female_92.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_92.jpg' WHERE user_id = 'usr_seed_pk_92';

-- Profile: Zunaira Dar (Sialkot, Age: 23, Fresh BBA Supply Chain Graduate & Associate)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_93', '+923001234593', 'zunaira.dar@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zunaira Dar', '2003-10-04', 'female', 'Sialkot Cantt, Sialkot, Pakistan', 'Sialkot', 'Pakistan',
  32.5112, 74.5422, '5''5"',
  'Business graduate working in export supply chain logistics. Balanced, goal-oriented, and deeply connected to family. Seeking an ambitious, honest, and practicing gentleman who values mutual respect.',
  'Fresh BBA Supply Chain Graduate & Associate', 'BBA Supply Chain & Logistics', 'University of Sialkot',
  'Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-59 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_93', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Navy & Cream Linen Kurti with Straight Trousers', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_93', 'usr_seed_pk_93', 'Naveed Dar', '+923009876593', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_93_1', 'usr_seed_pk_93', '/seeds/seed_female_93.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_93.jpg' WHERE user_id = 'usr_seed_pk_93';

-- Profile: Meerab Cheema (Gujranwala, Age: 20, 2nd Year Clinical Nutrition & Dietetics Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_94', '+923001234594', 'meerab.cheema@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Meerab Cheema', '2006-08-14', 'female', 'DC Colony, Gujranwala, Pakistan', 'Gujranwala', 'Pakistan',
  32.1877, 74.1945, '5''4"',
  'Studying clinical dietetics and nutrition. Passionate about healthy halal lifestyles, cooking nutritious family meals, and community welfare. Looking for a deen-focused, caring partner.',
  '2nd Year Clinical Nutrition & Dietetics Student', 'BS Human Nutrition (In Progress)', 'GIFT University Gujranwala',
  'Punjabi (Jat)', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-31 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_94', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Canary Yellow & White Embroidered Kurti', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_94', 'usr_seed_pk_94', 'Chaudhry Bilal Cheema', '+923009876594', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_94_1', 'usr_seed_pk_94', '/seeds/seed_female_94.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_94.jpg' WHERE user_id = 'usr_seed_pk_94';

-- Profile: Syeda Bareera Kazmi (Islamabad, Age: 23, Islamic Studies Scholar & Junior UI Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_95', '+923001234595', 'bareera.kazmi@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Syeda Bareera Kazmi', '2003-04-20', 'female', 'Sector G-11/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6682, 72.9984, '5''4"',
  'Alimah and UI design practitioner. Striving to blend Islamic classical knowledge with contemporary technology. Seeking a pious, practicing Syed or non-Syed brother with noble character and genuine taqwa.',
  'Islamic Studies Scholar & Junior UI Designer', 'BS Islamic Studies & UI Certification', 'International Islamic University Islamabad (IIUI)',
  'Syed', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-49 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_95', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Olive-Green Chiffon Hijab & Camel Trench Tunic', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_95', 'usr_seed_pk_95', 'Syed Yousaf Kazmi', '+923009876595', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_95_1', 'usr_seed_pk_95', '/seeds/seed_female_95.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_95.jpg' WHERE user_id = 'usr_seed_pk_95';

-- Profile: Rimsha Sohail (Lahore, Age: 22, Associate Software QA Engineer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_96', '+923001234596', 'rimsha.sohail@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rimsha Sohail', '2004-11-02', 'female', 'Johar Town Phase 2, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4697, 74.2728, '5''5"',
  'Software QA engineer who enjoys precision, coding automation, and reading books on weekends. Cheerful, honest, and values harmonious home life. Seeking a practicing, kind-hearted professional.',
  'Associate Software QA Engineer', 'BS Software Engineering', 'FAST-NUCES Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-12 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_96', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Oat-Milk Linen Tunic & Straight Trousers', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_96', 'usr_seed_pk_96', 'Sohail Aslam', '+923009876596', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_96_1', 'usr_seed_pk_96', '/seeds/seed_female_96.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_96.jpg' WHERE user_id = 'usr_seed_pk_96';

-- Profile: Natasha Baig (Karachi, Age: 18, 1st Year BBA Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_97', '+923001234597', 'natasha.baig@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Natasha Baig', '2008-09-10', 'female', 'PECHS Block 2, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8716, 67.0599, '5''3"',
  'Freshman business administration student. Cheerful, humble, and deeply devoted to my family. Looking for a well-mannered, deen-conscious partner with good educational background.',
  '1st Year BBA Student', 'BBA (In Progress)', 'IBA Karachi',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-52 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_97', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Peach Kurti & White Cigarette Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_97', 'usr_seed_pk_97', 'Mirza Baig', '+923009876597', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_97_1', 'usr_seed_pk_97', '/seeds/seed_female_97.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_97.jpg' WHERE user_id = 'usr_seed_pk_97';

-- Profile: Hafsa Farooq (Rawalpindi, Age: 23, Alimah & Quran Recitation Teacher)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_98', '+923001234598', 'hafsa.farooq@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hafsa Farooq', '2003-07-27', 'female', 'Westridge 1, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.6015, 73.0235, '5''3"',
  'Completed Alimah course Alhumdulillah. Dedicated to teaching Quran and Tajweed to young girls. Seeking a practicing Muslim brother who loves Sunnah, prays with congregation, and values an Islamic household.',
  'Alimah & Quran Recitation Teacher', 'Shahadat-ul-Alimiyyah (Equivalent MA Islamic Studies)', 'Wifaq-ul-Madaris Al-Arabia Pakistan',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-18 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_98', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Black Abaya with Matching Chiffon Hijab', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_98', 'usr_seed_pk_98', 'Farooq Ahmed Cheema', '+923009876598', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_98_1', 'usr_seed_pk_98', '/seeds/seed_female_98.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_98.jpg' WHERE user_id = 'usr_seed_pk_98';

-- Profile: Aleena Gul (Peshawar, Age: 20, 2nd Year Pharm-D Pharmacy Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_99', '+923001234599', 'aleena.gul@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Aleena Gul', '2006-05-06', 'female', 'University Town, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.9984, 71.4889, '5''5"',
  'Pharmacy student passionate about pharmaceutical sciences and patient care. Humble, cheerful, and cultured in Pashtun hospitality and Islamic values. Looking for an educated, pious partner with sincere family values.',
  '2nd Year Pharm-D Pharmacy Student', 'Doctor of Pharmacy (In Progress)', 'University of Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-29 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_99', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Deep Maroon Traditional Kurti & Printed Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_99', 'usr_seed_pk_99', 'Gulzar Khan', '+923009876599', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_99_1', 'usr_seed_pk_99', '/seeds/seed_female_99.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_99.jpg' WHERE user_id = 'usr_seed_pk_99';

-- Profile: Fatima Al-Zahra (Islamabad, Age: 23, Associate Machine Learning Engineer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_100', '+923001234600', 'fatima.alzahra@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Fatima Al-Zahra', '2003-02-14', 'female', 'Sector E-11/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7001, 72.9812, '5''6"',
  'AI researcher and associate engineer who loves hiking in the Margallas, reading, and tech innovation. Grounded, warm, and deeply committed to daily prayers. Seeking an ambitious, honest, and practicing Muslim partner.',
  'Associate Machine Learning Engineer', 'BS Artificial Intelligence & Data Science', 'NUST Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-16 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_100', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Blush-Pink Linen Co-ord & Georgette Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_100', 'usr_seed_pk_100', 'Zahid Mahmood Akhtar', '+923009876600', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_100_1', 'usr_seed_pk_100', '/seeds/seed_female_100.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_100.jpg' WHERE user_id = 'usr_seed_pk_100';

