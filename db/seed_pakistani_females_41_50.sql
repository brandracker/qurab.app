-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (41 - 50)
-- Strict Demographic: Ages 18 to 23 Years Old
-- ====================================================================


-- Profile: Minahil Tariq (Islamabad, Age: 19, 2nd Year Media & Communications Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_41', '+923001234541', 'minahil.media@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Minahil Tariq', '2007-04-18', 'female', 'Sector F-7/1, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.056, '5''4"',
  'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
  '2nd Year Media & Communications Student', 'BS Media Sciences (In Progress)', 'NUST Islamabad',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-6 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_41', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Co-ord & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_41', 'usr_seed_pk_41', 'Tariq Mehmood', '+923009876541', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_41_1', 'usr_seed_pk_41', '/seeds/seed_female_41.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_41.jpg' WHERE user_id = 'usr_seed_pk_41';

-- Profile: Ayesha Imran Malik (Lahore, Age: 21, 3rd Year Computer Science Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_42', '+923001234542', 'ayesha.cs@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Ayesha Imran Malik', '2005-09-12', 'female', 'DHA Phase 5, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.3987, '5''5"',
  'CS student with a passion for web technologies, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
  '3rd Year Computer Science Student', 'BS Computer Science (In Progress)', 'FAST-NUCES Lahore',
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
  'usr_seed_pk_42', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Contemporary Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_42', 'usr_seed_pk_42', 'Imran Malik', '+923009876542', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_42_1', 'usr_seed_pk_42', '/seeds/seed_female_42.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_42.jpg' WHERE user_id = 'usr_seed_pk_42';

-- Profile: Dr. Hania Zahra (Rawalpindi, Age: 22, 4th Year MBBS Medical Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_43', '+923001234543', 'hania.med@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Hania Zahra', '2004-03-25', 'female', 'Chaklala Scheme 3, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5851, 73.0869, '5''5"',
  'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
  '4th Year MBBS Medical Student', 'MBBS (Doctor of Medicine, 4th Year)', 'Rawalpindi Medical University (RMU)',
  'Potohari / Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-18 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_43', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Raw Silk & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_43', 'usr_seed_pk_43', 'Zahid Hussain', '+923009876543', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_43_1', 'usr_seed_pk_43', '/seeds/seed_female_43.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_43.jpg' WHERE user_id = 'usr_seed_pk_43';

-- Profile: Rameen Farhan (Karachi, Age: 20, 2nd Year BBA Marketing & Finance Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_44', '+923001234544', 'rameen.bba@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rameen Farhan', '2006-05-14', 'female', 'Clifton Block 4, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8157, 67.0311, '5''4"',
  'BBA student at IBA Karachi. Enthusiastic, loves literature, sea walks, and baking. Firm believer in mutual respect and emotional harmony. Seeking a kind, responsible, and practicing spouse.',
  '2nd Year BBA Marketing & Finance Student', 'BBA (In Progress)', 'Institute of Business Administration (IBA Karachi)',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-24 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_44', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest High-Street Linen & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_44', 'usr_seed_pk_44', 'Farhan Azmat', '+923009876544', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_44_1', 'usr_seed_pk_44', '/seeds/seed_female_44.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_44.jpg' WHERE user_id = 'usr_seed_pk_44';

-- Profile: Zainab Bilal (Lahore, Age: 18, Freshman Pre-Med / Biological Sciences Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_45', '+923001234545', 'zainab.premed@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zainab Bilal', '2008-02-28', 'female', 'Gulberg III, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.5104, 74.3487, '5''3"',
  'Fresh university student with big dreams and humble roots. Deeply attached to family, loves gardening and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
  'Freshman Pre-Med / Biological Sciences Student', 'BS Biological Sciences (1st Year)', 'Forman Christian College (FCCU Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-30 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_45', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Lilac Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_45', 'usr_seed_pk_45', 'Bilal Qureshi', '+923009876545', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_45_1', 'usr_seed_pk_45', '/seeds/seed_female_45.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_45.jpg' WHERE user_id = 'usr_seed_pk_45';

-- Profile: Maryam Siddiqui (Islamabad, Age: 23, Junior UI/UX Product Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_46', '+923001234546', 'maryam.uiux@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Maryam Siddiqui', '2003-11-09', 'female', 'Sector F-6/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7288, 73.0787, '5''5"',
  'Product designer working at a creative digital agency in Islamabad. Observing hijab. Balanced between career and Islamic ethics. Seeking a mature, respectful, and deen-conscious Muslim brother.',
  'Junior UI/UX Product Designer', 'BS Visual Communication & Design', 'COMSATS University Islamabad',
  'Urdu Speaking / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-36 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_46', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab (Chiffon Hijab & Tunic)', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_46', 'usr_seed_pk_46', 'Siddiq Ahmed', '+923009876546', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_46_1', 'usr_seed_pk_46', '/seeds/seed_female_46.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_46.jpg' WHERE user_id = 'usr_seed_pk_46';

-- Profile: Kinza Shakeel (Faisalabad, Age: 20, 3rd Year Interior Architecture Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_47', '+923001234547', 'kinza.interior@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Kinza Shakeel', '2006-08-19', 'female', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.4304, 73.115, '5''4"',
  'Interior design student passionate about home aesthetics, Islamic architecture, and family comfort. Warm, cheerful, and down to earth. Looking for an educated, caring, and trustworthy partner.',
  '3rd Year Interior Architecture Student', 'B.Des (Interior Architecture)', 'GC University Faisalabad (GCUF)',
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
  'usr_seed_pk_47', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Embroidered Kurti & Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_47', 'usr_seed_pk_47', 'Shakeel Akhtar', '+923009876547', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_47_1', 'usr_seed_pk_47', '/seeds/seed_female_47.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_47.jpg' WHERE user_id = 'usr_seed_pk_47';

-- Profile: Dua Aslam (Karachi, Age: 22, Fresh Economics Graduate & Analyst Trainee)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_48', '+923001234548', 'dua.econ@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dua Aslam', '2004-06-30', 'female', 'DHA Phase 8, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.782, 67.075, '5''5"',
  'Fresh economics graduate working in finance consultancy. Friendly, observant of Islamic morals, fond of badminton and seaside walks. Seeking a devout, caring, and accomplished spouse.',
  'Fresh Economics Graduate & Analyst Trainee', 'BSc (Honours) Economics', 'LUMS / IBA Karachi',
  'Muhajir / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-48 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_48', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Peach Kurti & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_48', 'usr_seed_pk_48', 'Muhammad Aslam', '+923009876548', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_48_1', 'usr_seed_pk_48', '/seeds/seed_female_48.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_48.jpg' WHERE user_id = 'usr_seed_pk_48';

-- Profile: Mahnoor Khan (Peshawar, Age: 21, 3rd Year Software Engineering Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_49', '+923001234549', 'mahnoor.swe@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Mahnoor Khan', '2005-01-15', 'female', 'Hayatabad Phase 3, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.988, 71.439, '5''4"',
  'Pashtun software engineering student from Peshawar. Respectful of traditions, passionate about coding and machine learning. Looking for a respectful, educated, and pious gentleman.',
  '3rd Year Software Engineering Student', 'BS Software Engineering (In Progress)', 'UET Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-54 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_49', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Traditional Attire & Printed Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_49', 'usr_seed_pk_49', 'Alamgir Khan', '+923009876549', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_49_1', 'usr_seed_pk_49', '/seeds/seed_female_49.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_49.jpg' WHERE user_id = 'usr_seed_pk_49';

-- Profile: Fatima Javed (Lahore, Age: 19, 2nd Year Visual Arts & Design Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_50', '+923001234550', 'fatima.visual@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Fatima Javed', '2007-07-22', 'female', 'Model Town Block C, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4854, 74.3211, '5''4"',
  'Art student at NCA. Lively, fond of road trips with family, coffee, and painting. Grounded in Islamic adab and family respect. Seeking a kind, understanding, and practicing life partner.',
  '2nd Year Visual Arts & Design Student', 'BFA (Visual Arts, In Progress)', 'National College of Arts (NCA Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-60 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_50', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Casual Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_50', 'usr_seed_pk_50', 'Javed Iqbal', '+923009876550', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_50_1', 'usr_seed_pk_50', '/seeds/seed_female_50.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_50.jpg' WHERE user_id = 'usr_seed_pk_50';
