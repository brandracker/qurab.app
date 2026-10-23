-- ============================================================
-- Qurb App - Google Play Store Review Demo Account
-- ============================================================
-- PURPOSE : Demo credentials for Google Play Store review team
--
-- LOGIN CREDENTIALS:
--   Email    : reviewer@qurab.app
--   Password : Review@1234
--
-- HOW TO RUN (production D1):
--   npx wrangler d1 execute serene-union-db --remote --file=./db/seed_playstore_reviewer.sql
--
-- HOW TO RUN (local D1):
--   npx wrangler d1 execute serene-union-db --local --file=./db/seed_playstore_reviewer.sql
-- ============================================================

-- 1. REVIEWER USER ACCOUNT
--    password_hash = SHA-256("Review@1234")
INSERT OR REPLACE INTO users (
  id, phone, email, password_hash,
  full_name, dob, gender,
  location, city, country,
  latitude, longitude,
  profession, education,
  height, ethnicity,
  marriage_timeline, bio,
  blur_photos_by_default,
  profile_visibility,
  is_vip,
  is_profile_completed,
  account_status
) VALUES (
  'usr_reviewer_001',
  '+923001234567',
  'reviewer@qurab.app',
  'e20a29b0d21af3863f1010521cae92ea9d4dedb0cba430aa36305a267491c04c',
  'Ahmad Hassan',
  '1996-05-15',
  'male',
  'Karachi, Pakistan',
  'Karachi',
  'Pakistan',
  24.8607, 67.0011,
  'Software Engineer',
  'BSc Computer Science, FAST-NUCES',
  '5''10"',
  'South Asian',
  'within_1_year',
  'A practicing Muslim seeking a righteous life partner. Family-oriented, tech professional, and community-involved. Alhamdulillah grateful for every blessing.',
  0,
  'all_users',
  1,
  1,
  'active'
);

-- 2. RELIGIOUS PROFILE
INSERT OR REPLACE INTO religious_profiles (
  user_id, practice_level, sect, madhhab,
  prayer_frequency, halal_diet, deen_relationship_bio
) VALUES (
  'usr_reviewer_001',
  'practicing',
  'Sunni',
  'Hanafi',
  '5 times daily',
  'Strictly Halal',
  'Deen comes first in all decisions. Seeking a spouse to build a sunnah household with mutual respect and growth.'
);

-- 3. PROFILE PHOTO
INSERT OR REPLACE INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
VALUES (
  'ph_reviewer_001',
  'usr_reviewer_001',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
  1, 1
);

-- 4. MUTUAL MATCH (so reviewer can see the Matches feature)
INSERT OR REPLACE INTO matches_and_likes (
  id, sender_id, receiver_id, action,
  photo_reveal_requested, photo_reveal_approved
) VALUES (
  'mat_reviewer_001',
  'usr_reviewer_001',
  'usr_001',
  'mutual_match',
  1, 1
);

-- 5. A CONVERSATION (so reviewer can see Chat feature)
INSERT OR REPLACE INTO conversations (
  id, participant_one, participant_two,
  jsonl_log_path,
  last_message_text, last_message_sender_id,
  unread_count_p1, unread_count_p2,
  status
) VALUES (
  'conv_reviewer_001',
  'usr_reviewer_001',
  'usr_001',
  'conversations/conv_reviewer_001.jsonl',
  'Assalamu Alaikum, JazakAllah Khair for accepting my Salam.',
  'usr_reviewer_001',
  0, 1,
  'active'
);
