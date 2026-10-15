-- ====================================================================
-- Qurb Matrimony: 15 Authentic Pakistani Male Seed Profiles
-- Generated with Login Credentials, GPS Coordinates, & Deen Biodata
-- ====================================================================


-- Profile: Engr. Muhammad Hamza (Lahore, Age: 30, Principal Software Architect (Remote US))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_01', '+923001239901', 'hamza.tech@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Engr. Muhammad Hamza', '1996-04-12', 'male', 'DHA Phase 6, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4704, 74.4287, '5''11" (180 cm)',
  'Assalamu Alaikum. Alhumdulillah balanced in modern professional ambitions and deep rooted Islamic adab. Working as a Software Architect for a US tech company from Lahore. Fond of books, cricket, and weekend charity. Seeking an educated, pious partner who values family harmony, kindness, and mutual growth.',
  'Principal Software Architect (Remote US)', 'BS Computer Science (LUMS)', 'Lahore University of Management Sciences (LUMS)',
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
  'usr_seed_pk_male_01', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest, beard & sunnah attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_01', 'usr_seed_pk_male_01', 'Chaudhry Tariq Mahmood', '+923009876901', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_01_1', 'usr_seed_pk_male_01', '/seeds/seed_male_1.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_1.jpg' WHERE user_id = 'usr_seed_pk_male_01';

-- Profile: Dr. Daniyal Qureshi (Islamabad, Age: 32, Consultant Cardiologist (FCPS Resident))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_02', '+923001239902', 'daniyal.cardio@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Daniyal Qureshi', '1994-11-20', 'male', 'Sector F-8/3, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.7155, 73.041, '6''0" (183 cm)',
  'Doctor at PIMS Islamabad. Passionate about medical service, morning runs in the Margallas, and reading seerah. Seeking a family-centered, practicing Muslimah who values companionship, emotional maturity, and deen.',
  'Consultant Cardiologist (FCPS Resident)', 'MBBS, FCPS Cardiology Part-II', 'Rawalpindi Medical University / PIMS',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_02', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest & professional', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_02', 'usr_seed_pk_male_02', 'Prof. Dr. Munir Qureshi', '+923009876902', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_02_1', 'usr_seed_pk_male_02', '/seeds/seed_male_2.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_2.jpg' WHERE user_id = 'usr_seed_pk_male_02';

-- Profile: Zayd Farooq, CA (Karachi, Age: 31, Chartered Accountant (Big 4 Director))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_03', '+923001239903', 'zayd.audit@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Zayd Farooq, CA', '1995-07-15', 'male', 'Clifton Block 4, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.821, 67.0315, '5''10" (178 cm)',
  'Chartered Accountant based in Clifton, Karachi. Alhumdulillah grounded in prayer, halal earnings, and respect for elders. Seeking an educated, well-mannered spouse with good moral values to build a peaceful, loving home.',
  'Chartered Accountant (Big 4 Director)', 'FCA (ICAP), B.Sc Finance', 'Institute of Chartered Accountants of Pakistan (ICAP) / IBA',
  'Memoni', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_03', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest eastern & formal attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_03', 'usr_seed_pk_male_03', 'Farooq Usman', '+923009876903', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_03_1', 'usr_seed_pk_male_03', '/seeds/seed_male_3.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_3.jpg' WHERE user_id = 'usr_seed_pk_male_03';

-- Profile: Bilal Ahmad Niazi (Rawalpindi, Age: 29, Aeronautical Engineer (PAF Complex / Aviation))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_04', '+923001239904', 'bilal.aero@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Bilal Ahmad Niazi', '1997-02-18', 'male', 'Bahria Town Phase 7, Rawalpindi, Pakistan', 'Rawalpindi', 'Pakistan',
  33.5186, 73.1098, '6''1" (185 cm)',
  'Aviation engineer in Rawalpindi/Islamabad. Disciplined, grounded, and keen on hiking, sports, and community welfare. Seeking a modest, warm-hearted practicing sister to share life''s blessings and joys.',
  'Aeronautical Engineer (PAF Complex / Aviation)', 'BE Aerospace Engineering', 'National University of Sciences & Technology (NUST)',
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
  'usr_seed_pk_male_04', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest & respectful', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_04', 'usr_seed_pk_male_04', 'Brig. (R) Asad Niazi', '+923009876904', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_04_1', 'usr_seed_pk_male_04', '/seeds/seed_male_4.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_4.jpg' WHERE user_id = 'usr_seed_pk_male_04';

-- Profile: Syed Omar Kazmi (Lahore, Age: 31, Senior Civil Engineer & Project Manager)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_05', '+923001239905', 'omar.civil@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Syed Omar Kazmi', '1995-10-05', 'male', 'Model Town Block C, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4886, 74.3168, '5''11" (180 cm)',
  'Civil engineer managing major infrastructure developments in Lahore. Respect for parents and family ties is core to my worldview. Seeking an intelligent, kind, and graceful life partner.',
  'Senior Civil Engineer & Project Manager', 'MS Structural Engineering', 'UET Lahore',
  'Syed', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_05', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest, beard & sunnah', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_05', 'usr_seed_pk_male_05', 'Syed Jalal Kazmi', '+923009876905', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_05_1', 'usr_seed_pk_male_05', '/seeds/seed_male_5.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_5.jpg' WHERE user_id = 'usr_seed_pk_male_05';

-- Profile: Usman Ali Khan (Peshawar, Age: 30, Tech Entrepreneur (E-commerce Founder))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_06', '+923001239906', 'usman.founder@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Usman Ali Khan', '1996-09-30', 'male', 'Hayatabad Phase 4, Peshawar, Pakistan', 'Peshawar', 'Pakistan',
  33.985, 71.439, '6''0" (183 cm)',
  'Founder of a cross-border e-commerce brand. Alhumdulillah independent, respectful, and family-oriented. Looking for a practicing, supportive Muslimah who shares Islamic values and mutual ambitions.',
  'Tech Entrepreneur (E-commerce Founder)', 'BSc Business & Information Systems', 'FAST-NUCES Peshawar',
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
  'usr_seed_pk_male_06', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal',
  'Regular with translation', 'Modest & dignified', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_06', 'usr_seed_pk_male_06', 'Inamullah Khan', '+923009876906', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_06_1', 'usr_seed_pk_male_06', '/seeds/seed_male_6.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_6.jpg' WHERE user_id = 'usr_seed_pk_male_06';

-- Profile: Saad Rabbani (Faisalabad, Age: 29, Textile Mill Director (Family Business))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_07', '+923001239907', 'saad.textile@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Saad Rabbani', '1997-06-14', 'male', 'Kohinoor City, Faisalabad, Pakistan', 'Faisalabad', 'Pakistan',
  31.4187, 73.1165, '5''10" (178 cm)',
  'Managing family textile operations in Faisalabad. Value humility, integrity, and warmth in home life. Seeking a cultured, religious, and educated partner.',
  'Textile Mill Director (Family Business)', 'BBA / Supply Chain Management', 'Lahore School of Economics (LSE)',
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
  'usr_seed_pk_male_07', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest eastern attire', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_07', 'usr_seed_pk_male_07', 'Mian Rabbani', '+923009876907', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_07_1', 'usr_seed_pk_male_07', '/seeds/seed_male_7.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_7.jpg' WHERE user_id = 'usr_seed_pk_male_07';

-- Profile: Haris Mehmood (Multan, Age: 32, Agriculture Landlord & Agro-Industrialist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_08', '+923001239908', 'haris.agro@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Haris Mehmood', '1994-03-25', 'male', 'Cantt Officers Colony, Multan, Pakistan', 'Multan', 'Pakistan',
  30.1984, 71.4687, '6''2" (188 cm)',
  'Grounded in traditional family values with a modern vision for sustainable agriculture. Seeking a modest, respectful life partner who loves family gatherings, peace, and spiritual growth.',
  'Agriculture Landlord & Agro-Industrialist', 'BS Agribusiness Management', 'University of Agriculture Faisalabad / LUMS Exec',
  'Siraiki / Punjabi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_08', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest traditional & smart casual', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_08', 'usr_seed_pk_male_08', 'Malik Mehmood', '+923009876908', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_08_1', 'usr_seed_pk_male_08', '/seeds/seed_male_8.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_8.jpg' WHERE user_id = 'usr_seed_pk_male_08';

-- Profile: Taimur Shahzad (Islamabad, Age: 31, AI Research Scientist & Data Lead)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_09', '+923001239909', 'taimur.ai@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Taimur Shahzad', '1995-12-08', 'male', 'Sector E-11/2, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.702, 72.986, '5''11" (180 cm)',
  'Working in machine learning and data research. Hobbies include photography, fitness, and reading Islamic philosophy. Seeking an intellectually compatible, kind Muslim life partner.',
  'AI Research Scientist & Data Lead', 'MS Artificial Intelligence', 'GIKI (Ghulam Ishaq Khan Institute)',
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
  'usr_seed_pk_male_09', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal',
  'Regular with translation', 'Modest & respectful', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_09', 'usr_seed_pk_male_09', 'Shahzad Akhtar', '+923009876909', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_09_1', 'usr_seed_pk_male_09', '/seeds/seed_male_9.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_9.jpg' WHERE user_id = 'usr_seed_pk_male_09';

-- Profile: Ammar Siddique, ACCA (Karachi, Age: 30, Senior Investment Analyst (Sovereign Wealth))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_10', '+923001239910', 'ammar.finance@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Ammar Siddique, ACCA', '1996-01-19', 'male', 'PECHS Block 2, Karachi & Downtown Dubai', 'Karachi', 'Pakistan',
  24.8607, 67.0511, '5''10" (178 cm)',
  'Investment analyst split between Dubai and Karachi. Regular at the masjid, focused on halal wealth and early family settlement. Looking for a modest, loving partner ready for relocation to UAE or Pakistan.',
  'Senior Investment Analyst (Sovereign Wealth)', 'ACCA, CFA Charterholder (Level II)', 'University of London International / ACCA UK',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_10', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest formal & eastern', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_10', 'usr_seed_pk_male_10', 'Rashid Siddique', '+923009876910', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_10_1', 'usr_seed_pk_male_10', '/seeds/seed_male_10.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_10.jpg' WHERE user_id = 'usr_seed_pk_male_10';

-- Profile: Dr. Shahmeer Tareen (Quetta, Age: 33, Assistant Professor (Dentistry / Orthodontist))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_11', '+923001239911', 'shahmeer.dental@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Dr. Shahmeer Tareen', '1993-08-11', 'male', 'Chaman Housing Scheme, Quetta, Pakistan', 'Quetta', 'Pakistan',
  30.1798, 66.975, '6''1" (185 cm)',
  'Orthodontist and medical college faculty member. Warm-tempered, deeply rooted in Islamic ethics and hospitality. Seeking a pious, respectful spouse.',
  'Assistant Professor (Dentistry / Orthodontist)', 'BDS, FCPS Orthodontics', 'Bolan University of Medical & Health Sciences',
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
  'usr_seed_pk_male_11', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal',
  'Regular with translation', 'Modest & respectful', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_11', 'usr_seed_pk_male_11', 'Haji Abdul Ghaffar Tareen', '+923009876911', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_11_1', 'usr_seed_pk_male_11', '/seeds/seed_male_11.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_11.jpg' WHERE user_id = 'usr_seed_pk_male_11';

-- Profile: Ibrahim Tariq (Lahore, Age: 29, Lead UI/UX Designer & Brand Strategist)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_12', '+923001239912', 'ibrahim.design@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Ibrahim Tariq', '1997-08-03', 'male', 'Johar Town Phase 2, Lahore, Pakistan', 'Lahore', 'Pakistan',
  31.4697, 74.2728, '5''9" (175 cm)',
  'Design lead working with international clients. Fond of coffee culture, architecture, and Islamic geometry. Looking for a practicing, family-oriented partner.',
  'Lead UI/UX Designer & Brand Strategist', 'BS Media Sciences (BNU)', 'Beaconhouse National University (BNU)',
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
  'usr_seed_pk_male_12', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest casual & sunnah', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_12', 'usr_seed_pk_male_12', 'Tariq Jamil', '+923009876912', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_12_1', 'usr_seed_pk_male_12', '/seeds/seed_male_12.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_12.jpg' WHERE user_id = 'usr_seed_pk_male_12';

-- Profile: Waleed Bin Tahir (Islamabad, Age: 31, Civil Services Officer (CSP / Assistant Commissioner))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_13', '+923001239913', 'waleed.csp@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Waleed Bin Tahir', '1995-05-22', 'male', 'Sector G-10/4, Islamabad, Pakistan', 'Islamabad', 'Pakistan',
  33.6844, 73.0169, '6''0" (183 cm)',
  'Serving in the civil services of Pakistan. Dedicated to public welfare, ethics, and justice. Seeking a graceful, well-educated partner with strong moral character.',
  'Civil Services Officer (CSP / Assistant Commissioner)', 'CSS Passed, BS Economics', 'LUMS / Civil Services Academy',
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
  'usr_seed_pk_male_13', 'practicing', 'Sunni', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest & humble demeanor', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_13', 'usr_seed_pk_male_13', 'Tahir Mehmood', '+923009876913', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_13_1', 'usr_seed_pk_male_13', '/seeds/seed_male_13.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_13.jpg' WHERE user_id = 'usr_seed_pk_male_13';

-- Profile: Rehan Ahmed Abbasi (Abbottabad, Age: 32, Commercial Airline Pilot (First Officer))
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_14', '+923001239914', 'rehan.pilot@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Rehan Ahmed Abbasi', '1994-12-19', 'male', 'Kakul Road, Abbottabad, Pakistan', 'Abbottabad', 'Pakistan',
  34.1688, 73.2215, '6''1" (185 cm)',
  'First Officer flying international routes. Love mountains, nature, and peaceful family life. Seeking a loving, practicing Muslimah who values trust and mutual support.',
  'Commercial Airline Pilot (First Officer)', 'Commercial Pilot License (CPL/ATPL), BSc Aviation', 'Pakistan Aviation Academy',
  'Hindko / Abbasi', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_14', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal',
  'Regular with translation', 'Modest & disciplined', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_14', 'usr_seed_pk_male_14', 'Col. (R) Rafiq Abbasi', '+923009876914', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_14_1', 'usr_seed_pk_male_14', '/seeds/seed_male_14.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_14.jpg' WHERE user_id = 'usr_seed_pk_male_14';

-- Profile: Hassan Raza Jafri (Karachi, Age: 30, Cybersecurity Analyst & Penetration Tester)
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash, full_name, dob, gender, location, city, country,
  latitude, longitude, height, bio, profession, education, university,
  ethnicity, family_structure, living_preference, siblings_count,
  willingness_to_relocate, smoking_status, languages_spoken, mahr_philosophy,
  children_desire, marriage_timeline, blur_photos_by_default, profile_visibility,
  is_phone_verified, is_id_verified, is_vip, is_profile_completed,
  is_seed, seed_active, seed_password, account_status, is_banned
) VALUES (
  'usr_seed_pk_male_15', '+923001239915', 'hassan.security@qurb.app', '260e9527ca8267314c8424c10cf9c457d619ffbf850ffb84c0bc2d9486667942',
  'Hassan Raza Jafri', '1996-03-01', 'male', 'Gulshan-e-Iqbal Block 13-D, Karachi, Pakistan', 'Karachi', 'Pakistan',
  24.918, 67.0971, '5''11" (180 cm)',
  'Information security professional at a multinational financial institution. Dedicated to honesty, prayer, and family respect. Seeking a devout, caring partner.',
  'Cybersecurity Analyst & Penetration Tester', 'BS Cyber Security, CEH, CISSP', 'NED University of Engineering & Technology',
  'Muhajir', 'nuclear', 'independent', 2,
  'open', 'non_smoker', 'Urdu, English', 'mutual_agreement',
  'desires_children', 'within_1_year', 0, 'all_users',
  1, 1, 0, 1,
  1, 1, 'QurbSeed@2026', 'active', 0
);

INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
  quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
) VALUES (
  'usr_seed_pk_male_15', 'practicing', 'Shia', 'Hanafi', 'Always (5 times daily)', 'Strictly Halal',
  'Regular with translation', 'Modest & respectful', 'Planning insha''Allah',
  'Striving to implement Islamic principles in everyday conduct, kindness, and character.'
);

INSERT OR REPLACE INTO wali_details (
  id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active
) VALUES (
  'wali_usr_seed_pk_male_15', 'usr_seed_pk_male_15', 'Syed Raza Jafri', '+923009876915', 'Father', 1, 1
);

INSERT OR REPLACE INTO user_photos (
  id, user_id, photo_url, is_primary, sort_order
) VALUES (
  'photo_usr_seed_pk_male_15_1', 'usr_seed_pk_male_15', '/seeds/seed_male_15.jpg', 1, 1
);

UPDATE user_photos SET photo_url = '/seeds/seed_male_15.jpg' WHERE user_id = 'usr_seed_pk_male_15';
