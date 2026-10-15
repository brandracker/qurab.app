-- ====================================================================
-- Qurb Matrimony: 10 New Authentic Pakistani Female Seed Profiles (31 - 40)
-- Strict Demographic: Ages 18 to 23 Years Old
-- ====================================================================


-- Profile: Mahnoor Tariq (Lahore, Age: 19, 2nd Year BS Computer Science Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_31', '+923001234531', 'mahnoor.cs@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Mahnoor Tariq', '2007-03-18', 'female', 'Johar Town Phase 2, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4697, 74.2728, '5''4"',
  'Assalamu Alaikum. 2nd-year CS student passionate about software development, digital illustration, and baking. Warm-hearted, respectful of elders, and grounded in Islamic values. Seeking a pious, kind, and supportive life partner who values mutual growth.',
  '2nd Year BS Computer Science Student', 'BS Computer Science (In Progress)', 'FAST-NUCES Lahore',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-7 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_31', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Contemporary Co-ord & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_31', 'usr_seed_pk_31', 'Tariq Mehmood', '+923009876531', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_31_1', 'usr_seed_pk_31', '/seeds/seed_female_31.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_31.jpg' WHERE user_id = 'usr_seed_pk_31';

-- Profile: Dua Zahra (Islamabad, Age: 20, 3rd Year Psychology Student & Writer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_32', '+923001234532', 'dua.psych@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dua Zahra', '2006-08-24', 'female', 'Sector F-10/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.698, 73.0125, '5''5"',
  'Psychology student with a deep interest in human behavior, poetry, and family harmony. Calm, empathetic, and practicing. Seeking a gentle, educated, and deen-conscious partner to build a peaceful household with mutual respect.',
  '3rd Year Psychology Student & Writer', 'BS Psychology (In Progress)', 'Quaid-i-Azam University (QAU Islamabad)',
  'Potohari / Kashmiri', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-14 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_32', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_32', 'usr_seed_pk_32', 'Syed Zahid Hussain', '+923009876532', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_32_1', 'usr_seed_pk_32', '/seeds/seed_female_32.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_32.jpg' WHERE user_id = 'usr_seed_pk_32';

-- Profile: Areeba Fatima (Karachi, Age: 21, BBA Marketing Student & Boutique Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_33', '+923001234533', 'areeba.bba@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Areeba Fatima', '2005-02-12', 'female', 'DHA Phase 6, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.7937, 67.0645, '5''4"',
  'BBA student at IBA, managing a modest pret boutique label on the side. Love photography, sea breezes, and reading Islamic history. Seeking a caring, ambitious, and practicing spouse who values family closeness.',
  'BBA Marketing Student & Boutique Designer', 'BBA Marketing (In Progress)', 'Institute of Business Administration (IBA Karachi)',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-21 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_33', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest High-Street Pastel Attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_33', 'usr_seed_pk_33', 'Farhan Azmat', '+923009876533', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_33_1', 'usr_seed_pk_33', '/seeds/seed_female_33.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_33.jpg' WHERE user_id = 'usr_seed_pk_33';

-- Profile: Hania Imran (Rawalpindi, Age: 18, 1st Year Pre-Med / Biotechnology Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_34', '+923001234534', 'hania.biotech@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hania Imran', '2008-01-20', 'female', 'Bahria Town Phase 4, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.542, 73.118, '5''3"',
  'Fresh university student at NUST. Soft-spoken, family-centered, fond of calligraphy and gardening. Firm in daily prayers and modesty. Looking for a practicing, respectful, and caring partner who upholds Islamic traditions.',
  '1st Year Pre-Med / Biotechnology Student', 'BS Biotechnology (1st Year)', 'NUST Islamabad',
  'Pashtun / Niazi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-28 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_34', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Chiffon Hijab & Long Shirt', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_34', 'usr_seed_pk_34', 'Imran Khan Niazi', '+923009876534', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_34_1', 'usr_seed_pk_34', '/seeds/seed_female_34.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_34.jpg' WHERE user_id = 'usr_seed_pk_34';

-- Profile: Kinza Javed (Faisalabad, Age: 22, 4th Year Pharmacy Student (Pharm-D))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_35', '+923001234535', 'kinza.pharm@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Kinza Javed', '2004-11-05', 'female', 'Canal Road, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.432, 73.098, '5''5"',
  'Pharm-D student dedicated to healthcare. Values honesty, humility, and family ties above all. Enjoys badminton, reading, and tea with parents. Seeking a sincere, grounded partner with good character and deen.',
  '4th Year Pharmacy Student (Pharm-D)', 'Doctor of Pharmacy (Pharm-D, 4th Year)', 'GC University Faisalabad (GCUF)',
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
  'usr_seed_pk_35', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Traditional Kurti & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_35', 'usr_seed_pk_35', 'Javed Iqbal', '+923009876535', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_35_1', 'usr_seed_pk_35', '/seeds/seed_female_35.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_35.jpg' WHERE user_id = 'usr_seed_pk_35';

-- Profile: Maryam Bilal (Peshawar, Age: 20, 3rd Year English Literature & Linguistics Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_36', '+923001234536', 'maryam.lit@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Maryam Bilal', '2006-06-15', 'female', 'Hayatabad Phase 5, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.991, 71.446, '5''4"',
  'Literature student who loves books, nature, and traditional Pashtun hospitality. Dedicated to deen and family values. Looking for an educated, pious, and well-mannered life partner to build a blessed home.',
  '3rd Year English Literature & Linguistics Student', 'BS English Literature (In Progress)', 'University of Peshawar',
  'Pashtun', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-42 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_36', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Traditional Attire with Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_36', 'usr_seed_pk_36', 'Bilal Ahmad Khan', '+923009876536', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_36_1', 'usr_seed_pk_36', '/seeds/seed_female_36.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_36.jpg' WHERE user_id = 'usr_seed_pk_36';

-- Profile: Anum Raza (Islamabad, Age: 23, Junior UI/UX Designer & Fresh Graduate)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_37', '+923001234537', 'anum.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Anum Raza', '2003-09-10', 'female', 'Sector G-11/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.668, 72.998, '5''5"',
  'Recently graduated in UI/UX design. Creative, gentle-natured, and family-oriented. Love coffee, minimal art, and weekend family dinners. Seeking a devout, kind-hearted, and emotionally mature partner.',
  'Junior UI/UX Designer & Fresh Graduate', 'BS Media & Visual Design', 'COMSATS University Islamabad',
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
  'usr_seed_pk_37', 'practicing', 'Shia', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Minimalist Co-ord Set', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_37', 'usr_seed_pk_37', 'Syed Raza Ali', '+923009876537', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_37_1', 'usr_seed_pk_37', '/seeds/seed_female_37.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_37.jpg' WHERE user_id = 'usr_seed_pk_37';

-- Profile: Rameen Shakeel (Lahore, Age: 21, 3rd Year Graphic Design & Media Arts Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_38', '+923001234538', 'rameen.arts@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rameen Shakeel', '2005-04-28', 'female', 'Model Town Block B, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.485, 74.321, '5''4"',
  'Art and visual design student. Warm, creative, and fond of nature trips and family outings. Striving in prayers and Islamic ethics. Looking for an understanding, educated, and cheerful partner who values deen.',
  '3rd Year Graphic Design & Media Arts Student', 'BFA Visual Arts / Graphic Design', 'Beaconhouse National University (BNU Lahore)',
  'Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-56 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_38', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Contemporary Eastern Attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_38', 'usr_seed_pk_38', 'Shakeel Akhtar', '+923009876538', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_38_1', 'usr_seed_pk_38', '/seeds/seed_female_38.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_38.jpg' WHERE user_id = 'usr_seed_pk_38';

-- Profile: Laiba Noor (Multan, Age: 22, Final Year Islamic Studies & Arabic Scholar (Alimah Course))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_39', '+923001234539', 'laiba.alimah@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Laiba Noor', '2004-07-14', 'female', 'Officers Colony, Multan, Pakistan', 'Multan', 'Pakistan',
  30.201, 71.472, '5''3"',
  'Final year student of Islamic Sciences and Arabic. Humble, peaceful, and devoted to family and spirituality. Looking for a practicing, humble, and hardworking Muslim who prioritizes Sunnah in daily life.',
  'Final Year Islamic Studies & Arabic Scholar (Alimah Course)', 'Dars-e-Nizami (Alimah) & BA Islamic Studies', 'Bahauddin Zakariya University (BZU Multan)',
  'Saraiki / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-63 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_39', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Hijab & Abaya', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_39', 'usr_seed_pk_39', 'Noor Muhammad', '+923009876539', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_39_1', 'usr_seed_pk_39', '/seeds/seed_female_39.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_39.jpg' WHERE user_id = 'usr_seed_pk_39';

-- Profile: Zainab Qureshi (Karachi, Age: 19, 2nd Year Computer Science / Data Analytics Student)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned, last_active_at
) VALUES (
  'usr_seed_pk_40', '+923001234540', 'zainab.analytics@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zainab Qureshi', '2007-10-02', 'female', 'PECHS Block 2, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.862, 67.054, '5''5"',
  'Data analytics student in Karachi. Bright, enthusiastic, and rooted in family morals and Islamic values. Enjoys archery, reading, and cooking. Seeking a pious, ambitious, and kind-hearted life partner.',
  '2nd Year Computer Science / Data Analytics Student', 'BS Data Science (In Progress)', 'FAST-NUCES Karachi',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0, datetime('now', '-70 minutes')
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_40', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest High-Street Dress & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_40', 'usr_seed_pk_40', 'Mansoor Qureshi', '+923009876540', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_40_1', 'usr_seed_pk_40', '/seeds/seed_female_40.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_female_40.jpg' WHERE user_id = 'usr_seed_pk_40';
