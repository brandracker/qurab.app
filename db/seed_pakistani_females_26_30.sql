-- Profile: Fatima Zahra (Lahore, Age: 25, Data Scientist & AI Researcher)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_26', '+923001234526', 'fatima.ai@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Fatima Zahra', '2001-08-14', 'female', 'Gulberg III, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.5204, 74.3587, '5''5"',
  'Data scientist working at an analytics research lab in Lahore. Thoughtful, creative, fond of books, coding, and family gatherings. Seeking a grounded, educated, and pious life partner.',
  'Data Scientist & AI Researcher', 'MS Data Science', 'FAST-NUCES Lahore',
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
  'usr_seed_pk_26', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Shalwar Kameez & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_26', 'usr_seed_pk_26', 'Zahra Javed', '+923009876526', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_26_1', 'usr_seed_pk_26', '/seeds/seed_female_26.jpg', 1, 1
);

-- Profile: Hira Naveed (Islamabad, Age: 28, Clinical Psychologist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_27', '+923001234527', 'hira.psych@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hira Naveed', '1998-05-19', 'female', 'F-7/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7215, 73.056, '5''4"',
  'Practicing clinical psychologist in Islamabad. Empathetic, calm nature, loves reading Islamic psychology, gardening, and nature trips. Seeking an emotionally mature, kind, and practicing Muslim partner.',
  'Clinical Psychologist', 'M.Phil Clinical Psychology', 'Quaid-i-Azam University Islamabad',
  'Potohari / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_27', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Hijab', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_27', 'usr_seed_pk_27', 'Naveed Aslam', '+923009876527', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_27_1', 'usr_seed_pk_27', '/seeds/seed_female_27.jpg', 1, 1
);

-- Profile: Dr. Maryam Bilal (Karachi, Age: 29, Resident Pediatrician (FCPS-II))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_28', '+923001234528', 'maryam.peds@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Maryam Bilal', '1997-12-05', 'female', 'Clifton Block 5, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.8138, 67.0315, '5''6"',
  'Pediatric doctor dedicated to children healthcare in Karachi. Balancing professional duty with Islamic adab and family care. Seeking a respectful, well-settled, and supportive gentleman.',
  'Resident Pediatrician (FCPS-II)', 'MBBS, FCPS Resident', 'Dow University of Health Sciences (DUHS)',
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
  'usr_seed_pk_28', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest Elegant Suit & Dupatta', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_28', 'usr_seed_pk_28', 'Bilal Qureshi', '+923009876528', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_28_1', 'usr_seed_pk_28', '/seeds/seed_female_28.jpg', 1, 1
);

-- Profile: Anum Siddiqui (Peshawar, Age: 26, Architecture Lecturer & Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_29', '+923001234529', 'anum.arch@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Anum Siddiqui', '2000-09-28', 'female', 'Hayatabad Phase 4, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.985, 71.432, '5''5"',
  'Architecture lecturer passionate about heritage preservation and modern Islamic geometry. Values simplicity, honesty, and spiritual discipline. Seeking a god-fearing, gentle, and ambitious life partner.',
  'Architecture Lecturer & Designer', 'B.Arch (Architecture)', 'UET Peshawar',
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
  'usr_seed_pk_29', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Observes Abaya & Hijab', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_29', 'usr_seed_pk_29', 'Siddiq Khan', '+923009876529', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_29_1', 'usr_seed_pk_29', '/seeds/seed_female_29.jpg', 1, 1
);

-- Profile: Zoya Shakeel (Multan, Age: 24, UI/UX Product Designer)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_30', '+923001234530', 'zoya.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zoya Shakeel', '2002-04-10', 'female', 'Cantt, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1984, 71.4687, '5''3"',
  'Product designer working remotely for a tech company. Cheerful, family-oriented, fond of calligraphy and baking. Looking for a sincere, caring, and open-minded companion.',
  'UI/UX Product Designer', 'BS Software Engineering', 'Bahauddin Zakariya University (BZU Multan)',
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
  'usr_seed_pk_30', 'moderately_practicing', 'Sunni', 'Hanafi', 'Usually / Striving', 'Strictly Halal',
  'Regular with translation', 'Modest Traditional Attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_30', 'usr_seed_pk_30', 'Shakeel Munir', '+923009876530', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_30_1', 'usr_seed_pk_30', '/seeds/seed_female_30.jpg', 1, 1
);
