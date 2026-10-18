-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (51 - 60)
-- Strict Demographic: Ages 18 to 23 Years Old (Base Year 2026)
-- Human Touch v3.5 Standard
-- ====================================================================


-- Profile: Alizeh Shah Mir (Islamabad, Age: 20, 2nd Year Media & Communications Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_51', '+923001234551', 'alizeh.media@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Alizeh Shah Mir', '2006-04-18', 'female', 'Sector F-7/1, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.056, '5''4"',
  'Assalamu Alaikum. Media Sciences student passionate about creative storytelling, writing, and photography. Cheerful, family-centric, and grounded in Islamic values. Seeking an educated, pious, and kind-hearted life partner who values mutual respect.',
  '2nd Year Media & Communications Student', 'BS Media Sciences (In Progress)', 'NUST Islamabad',
  'Punjabi / Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-7 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_51', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Pastel Mint Kurti & White Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_51', 'usr_seed_pk_51', 'Shahmir Farooq', '+923009876551', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_51_1', 'usr_seed_pk_51', '/seeds/seed_female_51.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_51.jpg' WHERE user_id = 'usr_seed_pk_51';

-- Profile: Hareem Tariq (Lahore, Age: 21, 3rd Year Computer Science Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_52', '+923001234552', 'hareem.cs@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hareem Tariq', '2005-08-20', 'female', 'DHA Phase 6, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.4287, '5''5"',
  'CS student with a passion for web technologies, robotics, and creative problem solving. Warm, family-oriented, and loves weekend tea with parents. Looking for a practicing, ambitious, and sincere partner.',
  '3rd Year Computer Science Student', 'BS Computer Science (In Progress)', 'FAST-NUCES Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-14 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_52', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Lilac Co-ord Set & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_52', 'usr_seed_pk_52', 'Tariq Mahmood', '+923009876552', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_52_1', 'usr_seed_pk_52', '/seeds/seed_female_52.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_52.jpg' WHERE user_id = 'usr_seed_pk_52';

-- Profile: Dr. Iman Rafiq (Rawalpindi, Age: 22, 4th Year MBBS Medical Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_53', '+923001234553', 'iman.med@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Iman Rafiq', '2004-03-25', 'female', 'Bahria Town Phase 7, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5186, 73.1098, '5''5"',
  'Medical student striving to serve humanity while maintaining spiritual and moral balance. Quiet, thoughtful, fond of nature and reading. Seeking a well-mannered, practicing Muslim with noble character.',
  '4th Year MBBS Medical Student', 'MBBS (Doctor of Medicine, 4th Year)', 'Rawalpindi Medical University (RMU)',
  'Potohari', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-21 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_53', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Rose Raw Silk & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_53', 'usr_seed_pk_53', 'Dr. Rafiq Ahmed', '+923009876553', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_53_1', 'usr_seed_pk_53', '/seeds/seed_female_53.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_53.jpg' WHERE user_id = 'usr_seed_pk_53';

-- Profile: Anoushey Siddiqui (Karachi, Age: 19, 2nd Year BBA Marketing Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_54', '+923001234554', 'anoushey.bba@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Anoushey Siddiqui', '2007-06-18', 'female', 'Clifton Block 2, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8157, 67.0311, '5''4"',
  'BBA student at IBA Karachi. Enthusiastic, loves literature, coastal walks, and baking. Firm believer in mutual respect and emotional harmony. Seeking a kind, responsible, and practicing spouse.',
  '2nd Year BBA Marketing Student', 'BBA (In Progress)', 'IBA Karachi',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-28 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_54', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Powder-Blue Linen Co-ord & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_54', 'usr_seed_pk_54', 'Kamran Siddiqui', '+923009876554', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_54_1', 'usr_seed_pk_54', '/seeds/seed_female_54.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_54.jpg' WHERE user_id = 'usr_seed_pk_54';

-- Profile: Laiba Noor (Islamabad, Age: 18, Freshman Pre-Med & Biological Sciences Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_55', '+923001234555', 'laiba.premed@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Laiba Noor', '2008-02-14', 'female', 'Sector F-8/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7155, 73.041, '5''3"',
  'Fresh university student with big dreams and humble roots. Deeply attached to family, loves nature and calligraphy. Seeking a God-fearing, gentle, and respectful life companion.',
  'Freshman Pre-Med & Biological Sciences Student', 'BS Biological Sciences (1st Year)', 'Quaid-i-Azam University (QAU Islamabad)',
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
  'usr_seed_pk_55', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Rose Lawn Kurti & White Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_55', 'usr_seed_pk_55', 'Noor-ul-Hassan', '+923009876555', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_55_1', 'usr_seed_pk_55', '/seeds/seed_female_55.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_55.jpg' WHERE user_id = 'usr_seed_pk_55';

-- Profile: Zoya Rehman (Lahore, Age: 23, Junior Architect & Heritage Restoration Trainee)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_56', '+923001234556', 'zoya.arch@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zoya Rehman', '2003-09-05', 'female', 'Gulberg II, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.515, 74.352, '5''6"',
  'Junior architect working on heritage restoration and modern homes in Lahore. Modest hijabi with deep reverence for sunnah and family harmony. Looking for an educated, deen-conscious, and compassionate husband.',
  'Junior Architect & Heritage Restoration Trainee', 'B.Arch (Architecture)', 'National College of Arts (NCA Lahore)',
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
  'usr_seed_pk_56', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab (Taupe Modal Hijab & Linen Long Shirt)', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_56', 'usr_seed_pk_56', 'Rehman Bashir', '+923009876556', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_56_1', 'usr_seed_pk_56', '/seeds/seed_female_56.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_56.jpg' WHERE user_id = 'usr_seed_pk_56';

-- Profile: Malaika Jahangir (Karachi, Age: 22, Junior Financial Analyst & Economics Graduate)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_57', '+923001234557', 'malaika.finance@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Malaika Jahangir', '2004-04-16', 'female', 'DHA Phase 6, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.793, 67.065, '5''5"',
  'Fresh finance graduate working at a financial consultancy in Karachi. Balances modern corporate focus with traditional home warmth and daily prayers. Seeking a kind, dependable, and practicing gentleman.',
  'Junior Financial Analyst & Economics Graduate', 'BSc Accounting & Finance', 'Institute of Business Administration (IBA Karachi)',
  'Urdu Speaking', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-49 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_57', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Sage-Green Linen Co-ord & Chiffon Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_57', 'usr_seed_pk_57', 'Jahangir Alam', '+923009876557', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_57_1', 'usr_seed_pk_57', '/seeds/seed_female_57.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_57.jpg' WHERE user_id = 'usr_seed_pk_57';

-- Profile: Sehar Batool (Peshawar, Age: 21, 3rd Year AI & Data Science Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_58', '+923001234558', 'sehar.ai@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Sehar Batool', '2005-02-14', 'female', 'Hayatabad Phase 5, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.982, 71.435, '5''4"',
  'Pashtun AI student from Peshawar. Respectful of cultural heritage, passionate about computer vision and Islamic philosophy. Seeking an upright, well-mannered, and religious partner.',
  '3rd Year AI & Data Science Student', 'BS Artificial Intelligence (In Progress)', 'FAST-NUCES Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-56 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_58', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Traditional Embroidered Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_58', 'usr_seed_pk_58', 'Inamullah Khan', '+923009876558', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_58_1', 'usr_seed_pk_58', '/seeds/seed_female_58.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_58.jpg' WHERE user_id = 'usr_seed_pk_58';

-- Profile: Hiba Waqar (Faisalabad, Age: 20, 3rd Year Interior Design Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_59', '+923001234559', 'hiba.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hiba Waqar', '2006-10-08', 'female', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.425, 73.118, '5''4"',
  'Interior design student passionate about home aesthetics, Islamic architecture, and family comfort. Warm, cheerful, and down to earth. Looking for an educated, caring, and trustworthy partner.',
  '3rd Year Interior Design Student', 'B.Des Interior Architecture (In Progress)', 'GC University Faisalabad (GCUF)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-63 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_59', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Dusty-Lilac Kurti & White Cigarette Pants', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_59', 'usr_seed_pk_59', 'Waqar Munir', '+923009876559', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_59_1', 'usr_seed_pk_59', '/seeds/seed_female_59.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_59.jpg' WHERE user_id = 'usr_seed_pk_59';

-- Profile: Eshal Fatima (Multan, Age: 19, 2nd Year English Literature Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_60', '+923001234560', 'eshal.lit@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Eshal Fatima', '2007-12-03', 'female', 'Cantt Officers Colony, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1984, 71.4687, '5''3"',
  'Literature student fond of classic poetry, nature photography, and family traditions. Gentle, cheerful, and regular with prayers. Seeking an educated, pious, and emotionally mature partner.',
  '2nd Year English Literature Student', 'BS English Literature & Linguistics (In Progress)', 'Bahauddin Zakariya University (BZU Multan)',
  'Punjabi / Siraiki', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-70 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_60', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Ivory & Peach Lawn Attire with Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_60', 'usr_seed_pk_60', 'Col. (R) Tariq Mehmood', '+923009876560', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_60_1', 'usr_seed_pk_60', '/seeds/seed_female_60.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_60.jpg' WHERE user_id = 'usr_seed_pk_60';
