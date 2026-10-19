-- ====================================================================
-- Qurb Matrimony: 20 New Authentic Pakistani Female Seed Profiles (61 - 80)
-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)
-- Human Touch v3.5 Standard (.agents/skills/pakistani-matrimony-generator/SKILL.md)
-- ====================================================================

-- Profile: Areeba Tariq (Islamabad, Age: 20, 2nd Year Media & Communications Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_61', '+923001234561', 'areeba.media@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Areeba Tariq', '2006-03-12', 'female', 'Sector F-7/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.056, '5''4"',
  'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
  '2nd Year Media & Communications Student', 'BS Media Studies (In Progress)', 'NUST Islamabad',
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
  'usr_seed_pk_61', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Green Kurti & White Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_61', 'usr_seed_pk_61', 'Tariq Mehmood', '+923009876561', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_61_1', 'usr_seed_pk_61', '/seeds/seed_female_61.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_61.jpg' WHERE user_id = 'usr_seed_pk_61';

-- Profile: Minahil Shah (Lahore, Age: 21, 3rd Year Software Engineering Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_62', '+923001234562', 'minahil.se@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Minahil Shah', '2005-07-19', 'female', 'DHA Phase 5, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.3987, '5''5"',
  'Software engineering student with a genuine love for web development, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
  '3rd Year Software Engineering Student', 'BS Software Engineering (In Progress)', 'FAST-NUCES Lahore',
  'Kashmiri / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-24 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_62', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Mustard Yellow Kurti & White Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_62', 'usr_seed_pk_62', 'Syed Shahbaz Shah', '+923009876562', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_62_1', 'usr_seed_pk_62', '/seeds/seed_female_62.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_62.jpg' WHERE user_id = 'usr_seed_pk_62';

-- Profile: Dr. Hania Babar (Rawalpindi, Age: 22, 4th Year MBBS Medical Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_63', '+923001234563', 'hania.med@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Hania Babar', '2004-11-04', 'female', 'Bahria Town Phase 8, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5186, 73.1098, '5''6"',
  'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
  '4th Year MBBS Medical Student', 'MBBS (Doctor of Medicine, 4th Year)', 'Rawalpindi Medical University (RMU)',
  'Potohari', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-30 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_63', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Rose Raw Silk & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_63', 'usr_seed_pk_63', 'Dr. Babar Ikram', '+923009876563', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_63_1', 'usr_seed_pk_63', '/seeds/seed_female_63.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_63.jpg' WHERE user_id = 'usr_seed_pk_63';

-- Profile: Syeda Mahnoor Rizvi (Karachi, Age: 23, Junior UI/UX Designer & Digital Illustrator)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_64', '+923001234564', 'mahnoor.ux@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Syeda Mahnoor Rizvi', '2003-05-28', 'female', 'Clifton Block 4, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.821, 67.0315, '5''3"',
  'Observant hijabi and UI/UX designer in Karachi. Passionate about Islamic geometric art, mobile interfaces, and coastal walks. Seeking a kind, practicing, and family-oriented partner with good akhlaq.',
  'Junior UI/UX Designer & Digital Illustrator', 'B.Des Visual Communication Design', 'Indus Valley School of Art and Architecture (IVS)',
  'Syed / Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-36 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_64', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab (Dust-Taupe Chiffon Hijab & Linen Tunic)', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_64', 'usr_seed_pk_64', 'Syed Rizvi Hassan', '+923009876564', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_64_1', 'usr_seed_pk_64', '/seeds/seed_female_64.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_64.jpg' WHERE user_id = 'usr_seed_pk_64';

-- Profile: Kinza Farooq (Faisalabad, Age: 19, 2nd Year English Literature & Linguistics Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_65', '+923001234565', 'kinza.lit@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Kinza Farooq', '2007-09-15', 'female', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.425, 73.118, '5''4"',
  'English literature student fond of classical prose, baking, and family gatherings. Grounded in Islamic morals and looking for a caring, honest, and practicing gentleman.',
  '2nd Year English Literature & Linguistics Student', 'BS English Literature (In Progress)', 'GC University Faisalabad (GCUF)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-42 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_65', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Powder-Blue Linen Co-ord & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_65', 'usr_seed_pk_65', 'Farooq Azam', '+923009876565', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_65_1', 'usr_seed_pk_65', '/seeds/seed_female_65.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_65.jpg' WHERE user_id = 'usr_seed_pk_65';

-- Profile: Palwasha Durrani (Peshawar, Age: 21, 3rd Year Artificial Intelligence Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_66', '+923001234566', 'palwasha.ai@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Palwasha Durrani', '2005-01-22', 'female', 'Hayatabad Phase 4, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.982, 71.435, '5''5"',
  'Pashtun AI student from Peshawar. Respectful of cultural heritage, passionate about machine learning and Islamic philosophy. Seeking an upright, well-mannered, and religious partner.',
  '3rd Year Artificial Intelligence Student', 'BS AI & Data Science (In Progress)', 'UET Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-48 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_66', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Contemporary Peach Kurti & Printed Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_66', 'usr_seed_pk_66', 'Jamshed Durrani', '+923009876566', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_66_1', 'usr_seed_pk_66', '/seeds/seed_female_66.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_66.jpg' WHERE user_id = 'usr_seed_pk_66';

-- Profile: Rameen Waqas (Islamabad, Age: 18, Freshman Biotechnology & Pre-Med Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_67', '+923001234567', 'rameen.bio@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rameen Waqas', '2008-04-10', 'female', 'Sector F-10/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6938, 73.0125, '5''3"',
  'Fresh university student with big dreams and humble roots. Deeply attached to family, loves nature and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
  'Freshman Biotechnology & Pre-Med Student', 'BS Biotechnology (1st Year)', 'Quaid-i-Azam University (QAU Islamabad)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-54 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_67', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Lavender Cotton Kurti & White Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_67', 'usr_seed_pk_67', 'Waqas Anwer', '+923009876567', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_67_1', 'usr_seed_pk_67', '/seeds/seed_female_67.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_67.jpg' WHERE user_id = 'usr_seed_pk_67';

-- Profile: Duaa Hashmi (Multan, Age: 22, Junior Clinical Psychologist & M.Sc Trainee)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_68', '+923001234568', 'duaa.psych@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Duaa Hashmi', '2004-08-14', 'female', 'Cantt Officers Colony, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1984, 71.4687, '5''5"',
  'Psychology graduate passionate about mental wellness and Islamic counseling. Calm, empathetic, and loves gardening. Seeking an emotionally mature, kind, and deen-conscious life partner.',
  'Junior Clinical Psychologist & M.Sc Trainee', 'BS Psychology (Honors)', 'Bahauddin Zakariya University (BZU Multan)',
  'Punjabi / Siraiki', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-60 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_68', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Sage Embroidered Suit & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_68', 'usr_seed_pk_68', 'Hashim Raza', '+923009876568', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_68_1', 'usr_seed_pk_68', '/seeds/seed_female_68.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_68.jpg' WHERE user_id = 'usr_seed_pk_68';

-- Profile: Iman Naveed (Lahore, Age: 20, 2nd Year BBA Marketing & Strategy Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_69', '+923001234569', 'iman.bba@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Iman Naveed', '2006-12-05', 'female', 'Model Town Block J, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4854, 74.3211, '5''4"',
  'BBA student at LSE. Creative, cheerful, and loves family road trips and cooking. Regular with daily prayers and seeking a responsible, supportive, and practicing spouse.',
  '2nd Year BBA Marketing & Strategy Student', 'BBA (Honors, In Progress)', 'Lahore School of Economics (LSE)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-66 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_69', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Terracotta Kurti & White Culottes', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_69', 'usr_seed_pk_69', 'Naveed Akhtar', '+923009876569', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_69_1', 'usr_seed_pk_69', '/seeds/seed_female_69.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_69.jpg' WHERE user_id = 'usr_seed_pk_69';

-- Profile: Zunaira Khalid (Sialkot, Age: 23, Junior Supply Chain Specialist & Business Trainee)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_70', '+923001234570', 'zunaira.scm@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zunaira Khalid', '2003-10-18', 'female', 'Cantt Cantt Road, Sialkot, Pakistan', 'Sialkot', 'Pakistan',
  32.4945, 74.5229, '5''6"',
  'Supply chain professional involved in family manufacturing and exports. Well-mannered, family-centered, and dedicated to daily prayers. Seeking an ambitious and pious gentleman.',
  'Junior Supply Chain Specialist & Business Trainee', 'BBA Supply Chain & International Trade', 'University of Management and Technology (UMT)',
  'Kashmiri / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-72 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_70', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Navy & Cream Linen Kurti with Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_70', 'usr_seed_pk_70', 'Khalid Mehmood', '+923009876570', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_70_1', 'usr_seed_pk_70', '/seeds/seed_female_70.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_70.jpg' WHERE user_id = 'usr_seed_pk_70';

-- Profile: Noor-ul-Ain Gilani (Abbottabad, Age: 21, 3rd Year Environmental Sciences Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_71', '+923001234571', 'noor.env@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Noor-ul-Ain Gilani', '2005-04-30', 'female', 'Jinnahabad, Abbottabad, Pakistan', 'Abbottabad', 'Pakistan',
  34.1688, 73.2215, '5''4"',
  'Environmental sciences student from Abbottabad. Enjoys mountainous outdoors, book reading, and tea. Deep respect for Islamic values and family harmony. Seeking a practicing and caring partner.',
  '3rd Year Environmental Sciences Student', 'BS Earth & Environmental Sciences', 'COMSATS University Abbottabad',
  'Hindkowan / Syed', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-78 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_71', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Rose Kurti & Pashmina Shawl', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_71', 'usr_seed_pk_71', 'Syed Gilani Shah', '+923009876571', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_71_1', 'usr_seed_pk_71', '/seeds/seed_female_71.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_71.jpg' WHERE user_id = 'usr_seed_pk_71';

-- Profile: Dania Mansoor (Karachi, Age: 19, 2nd Year Graphic Design & Illustration Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_72', '+923001234572', 'dania.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dania Mansoor', '2007-11-12', 'female', 'DHA Phase 8, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.782, 67.078, '5''3"',
  'Art and visual studies student with an eye for aesthetics and design. Cheerful, lively, and family-first. Looking for a respectful, educated, and pious gentleman.',
  '2nd Year Graphic Design & Illustration Student', 'BFA Communication Design (In Progress)', 'Karachi University (Visual Studies)',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-84 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_72', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest White & Mint Lawn Kurti with Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_72', 'usr_seed_pk_72', 'Mansoor Alam', '+923009876572', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_72_1', 'usr_seed_pk_72', '/seeds/seed_female_72.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_72.jpg' WHERE user_id = 'usr_seed_pk_72';

-- Profile: Hira Asim (Lahore, Age: 22, Junior Software QA Engineer & CS Graduate)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_73', '+923001234573', 'hira.qa@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hira Asim', '2004-06-20', 'female', 'Johar Town Block G, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4697, 74.2728, '5''5"',
  'QA engineer working with a Lahore tech company. Balances technology work with domestic peace and spiritual consistency. Seeking an honest, practicing, and understanding partner.',
  'Junior Software QA Engineer & CS Graduate', 'BS Computer Science', 'University of Central Punjab (UCP Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-90 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_73', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Oat-Milk Linen Tunic & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_73', 'usr_seed_pk_73', 'Asim Qureshi', '+923009876573', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_73_1', 'usr_seed_pk_73', '/seeds/seed_female_73.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_73.jpg' WHERE user_id = 'usr_seed_pk_73';

-- Profile: Meerab Bilal (Gujranwala, Age: 20, 2nd Year Food Sciences & Nutrition Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_74', '+923001234574', 'meerab.nutrition@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Meerab Bilal', '2006-02-17', 'female', 'DC Colony, Gujranwala, Pakistan', 'Gujranwala', 'Pakistan',
  32.1877, 74.1945, '5''4"',
  'Nutrition student enthusiastic about wholesome lifestyle, cooking, and family warmth. Grounded in Islamic adab and values. Seeking a kind, responsible, and practicing spouse.',
  '2nd Year Food Sciences & Nutrition Student', 'BS Human Nutrition & Dietetics (In Progress)', 'Gift University Gujranwala',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-96 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_74', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Canary-Yellow Embroidered Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_74', 'usr_seed_pk_74', 'Bilal Afzal', '+923009876574', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_74_1', 'usr_seed_pk_74', '/seeds/seed_female_74.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_74.jpg' WHERE user_id = 'usr_seed_pk_74';

-- Profile: Bareera Yousaf (Islamabad, Age: 23, Junior Content Strategist & Islamic Studies Scholar)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_75', '+923001234575', 'bareera.islamic@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Bareera Yousaf', '2003-08-09', 'female', 'Sector G-11/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6685, 72.9985, '5''5"',
  'Alimah graduate and educational content writer in Islamabad. Gentle, modest, and dedicated to Quranic understanding and sunnah. Looking for an educated, practicing, and noble partner.',
  'Junior Content Strategist & Islamic Studies Scholar', 'BS Islamic Studies & Alimah Graduate', 'International Islamic University Islamabad (IIUI)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-102 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_75', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab (Olive Green Modal Hijab & Trench Tunic)', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_75', 'usr_seed_pk_75', 'Muhammad Yousaf', '+923009876575', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_75_1', 'usr_seed_pk_75', '/seeds/seed_female_75.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_75.jpg' WHERE user_id = 'usr_seed_pk_75';

-- Profile: Rimsha Ijaz (Rawalpindi, Age: 21, 3rd Year Architecture Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_76', '+923001234576', 'rimsha.arch@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rimsha Ijaz', '2005-09-24', 'female', 'Chaklala Scheme 3, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.582, 73.085, '5''6"',
  'Architecture student passionate about sustainable Islamic building and community design. Cheerful, artistic, and regular with prayers. Seeking an upright, cultured, and pious life partner.',
  '3rd Year Architecture Student', 'B.Arch (Architecture, In Progress)', 'Army Public College of Management and Sciences (APCOMS)',
  'Potohari / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-108 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_76', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel-Lilac Co-ord Set & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_76', 'usr_seed_pk_76', 'Ijaz Bashir', '+923009876576', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_76_1', 'usr_seed_pk_76', '/seeds/seed_female_76.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_76.jpg' WHERE user_id = 'usr_seed_pk_76';

-- Profile: Natasha Jamali (Karachi, Age: 22, Junior Corporate Accountant & ACCA Finalist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_77', '+923001234577', 'natasha.acca@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Natasha Jamali', '2004-01-31', 'female', 'PECHS Block 6, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8615, 67.073, '5''4"',
  'Accountant working with an audit consultancy in Karachi. Ambitious yet deeply traditional and family-oriented. Looking for a dependable, honest, and practicing gentleman.',
  'Junior Corporate Accountant & ACCA Finalist', 'ACCA Affiliate, B.Com', 'TABANI''S School of Accountancy Karachi',
  'Sindhi / Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-114 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_77', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel-Peach Lawn Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_77', 'usr_seed_pk_77', 'Tariq Jamali', '+923009876577', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_77_1', 'usr_seed_pk_77', '/seeds/seed_female_77.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_77.jpg' WHERE user_id = 'usr_seed_pk_77';

-- Profile: Waniya Shahzad (Lahore, Age: 18, 1st Year Psychology Student & Aspiring Artist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_78', '+923001234578', 'waniya.psych@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Waniya Shahzad', '2008-08-16', 'female', 'Wapda Town, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.433, 74.262, '5''3"',
  'Freshman student at Kinnaird College. Sweet-tempered, fond of painting, tea, and spending quality time with family. Seeking a pious, respectful, and family-centered companion.',
  '1st Year Psychology Student & Aspiring Artist', 'BS Applied Psychology (Freshman)', 'Kinnaird College for Women Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-120 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_78', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Sky-Blue Cotton Kurti & Lace Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_78', 'usr_seed_pk_78', 'Shahzad Anwar', '+923009876578', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_78_1', 'usr_seed_pk_78', '/seeds/seed_female_78.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_78.jpg' WHERE user_id = 'usr_seed_pk_78';

-- Profile: Aleena Mukhtar (Peshawar, Age: 20, 2nd Year Doctor of Pharmacy (Pharm-D) Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_79', '+923001234579', 'aleena.pharm@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Aleena Mukhtar', '2006-05-11', 'female', 'University Town, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.998, 71.488, '5''4"',
  'Pharmacy student in Peshawar. Grounded in family traditions, quiet, thoughtful, and caring. Seeking a well-mannered, educated, and practicing life partner.',
  '2nd Year Doctor of Pharmacy (Pharm-D) Student', 'Pharm-D (In Progress)', 'University of Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-126 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_79', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Maroon & Beige Kurti with Draped Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_79', 'usr_seed_pk_79', 'Mukhtar Khan', '+923009876579', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_79_1', 'usr_seed_pk_79', '/seeds/seed_female_79.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_79.jpg' WHERE user_id = 'usr_seed_pk_79';

-- Profile: Fatima Zahid (Islamabad, Age: 23, Associate Software Engineer (Frontend / Mobile))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_80', '+923001234580', 'fatima.dev@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Fatima Zahid', '2003-12-21', 'female', 'Sector E-11/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.702, 72.978, '5''5"',
  'Mobile and frontend engineer at a remote software firm in Islamabad. Loves mountain hikes in Margalla, specialty coffee, and daily Quran recitation. Seeking a deen-conscious, supportive, and kind husband.',
  'Associate Software Engineer (Frontend / Mobile)', 'BS Computer Science', 'FAST-NUCES Islamabad',
  'Kashmiri / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-132 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_80', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Blush-Pink Linen Co-ord & Georgette Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_80', 'usr_seed_pk_80', 'Zahid Mahmood', '+923009876580', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_80_1', 'usr_seed_pk_80', '/seeds/seed_female_80.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_80.jpg' WHERE user_id = 'usr_seed_pk_80';

