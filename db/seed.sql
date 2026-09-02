-- Serene Union - Cloudflare D1 Seed Data
-- Run with: npx wrangler d1 execute serene-union-db --file=./db/seed.sql

-- USERS
INSERT OR REPLACE INTO users (id, phone, email, full_name, dob, gender, location, city, country, profession, education, height, ethnicity, marriage_timeline, bio, blur_photos_by_default, profile_visibility, is_vip)
VALUES 
('usr_001', '+447700900101', 'aisha@example.com', 'Aisha Al-Mansoor', '1998-04-15', 'female', 'London, UK', 'London', 'United Kingdom', 'Data Analyst', 'MSc Data Science, UCL', '5''5"', 'Arab / Middle Eastern', 'within_1_year', 'Family-oriented, love weekend nature walks, reading, and Quran circles. Seeking a practicing companion with kindness and good humor.', 1, 'approved_only', 0),
('usr_002', '+14165550192', 'zayn@example.com', 'Zayn Malik', '1996-08-22', 'male', 'Toronto, Canada', 'Toronto', 'Canada', 'Software Engineer', 'BSc Computer Science, Waterloo', '6''0"', 'South Asian', 'right_person', 'Tech enthusiast, love soccer, specialty coffee, and mosque community work. Striving for 5 daily prayers.', 0, 'all_users', 1),
('usr_003', '+971501234567', 'maryam@example.com', 'Maryam Khan', '1999-01-10', 'female', 'Dubai, UAE', 'Dubai', 'UAE', 'Architect', 'B.Arch, AUS Dubai', '5''4"', 'South Asian', 'within_1_year', 'Creative soul passionate about Islamic architecture, art, and family gatherings. Wali actively involved.', 1, 'approved_only', 1),
('usr_004', '+12125550188', 'tariq@example.com', 'Tariq Hussain', '1995-11-05', 'male', 'New York, USA', 'New York', 'United States', 'Financial Analyst', 'MBA, Columbia', '5''11"', 'Arab / Levantine', 'within_1_year', 'Balancing deen and ambition. Enjoy outdoor hiking, volunteering at Islamic relief centers, and cooking.', 0, 'all_users', 0),
('usr_005', '+13125550199', 'bilal@example.com', 'Bilal Siddiqui', '1994-06-18', 'male', 'Chicago, USA', 'Chicago', 'United States', 'Clinical Pharmacist', 'PharmD, UIC', '6''1"', 'South Asian', 'within_1_year', 'Grounded in sunnah. Passionate about community health, youth mentorship, and Quran memorization.', 0, 'all_users', 1),
('usr_006', '+447911123456', 'fatima@example.com', 'Fatima Zahra', '1997-03-25', 'female', 'Manchester, UK', 'Manchester', 'United Kingdom', 'Speech Therapist', 'BSc Speech Sciences, Manchester', '5''6"', 'North African', 'within_1_year', 'Calm and patient temperament. Love baking, charity projects, and striving to learn classical Arabic.', 1, 'approved_only', 0),
('usr_007', '+14155550144', 'hamza@example.com', 'Hamza Qureshi', '1996-02-14', 'male', 'San Francisco, USA', 'San Francisco', 'United States', 'Product Designer', 'BFA Design, Stanford', '5''10"', 'South Asian', 'right_person', 'Creative designer, outdoor photographer, and mosque volunteer. Seeking a pious life partner.', 0, 'all_users', 0),
('usr_008', '+61411223344', 'safiyyah@example.com', 'Safiyyah Ahmed', '1998-09-09', 'female', 'Sydney, Australia', 'Sydney', 'Australia', 'Education Consultant', 'M.Ed, Sydney University', '5''4"', 'Arab / Middle Eastern', 'within_1_year', 'Teacher at heart, family centered, enjoy coastal walks, and attending Islamic halaqas.', 1, 'approved_only', 1);

-- RELIGIOUS PROFILES
INSERT OR REPLACE INTO religious_profiles (user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet, deen_relationship_bio)
VALUES
('usr_001', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal', 'Deen is the anchor of my daily routine and decisions.'),
('usr_002', 'practicing', 'Sunni', 'Shafi''i', '5 times daily (often at mosque)', 'Strictly Halal', 'Constantly striving to learn more and improve my character.'),
('usr_003', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal', 'Family has strong Islamic traditions, seeking someone to build a peaceful sunnah household with.'),
('usr_004', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal', 'Prioritizing deen, halal income, and righteous upbringing.'),
('usr_005', 'practicing', 'Sunni', 'Hanafi', '5 times daily (mosque regular)', 'Strictly Halal', 'Committed to Quran tajweed, daily sunnah prayers, and halal living.'),
('usr_006', 'practicing', 'Sunni', 'Maliki', '5 times daily', 'Strictly Halal', 'Observes proper hijab, deen-centric family values.'),
('usr_007', 'practicing', 'Sunni', 'Hanafi', '5 times daily', 'Strictly Halal', 'Striving on the path of piety and character development.'),
('usr_008', 'practicing', 'Sunni', 'Shafi''i', '5 times daily', 'Strictly Halal', 'Seeking a spouse with whom we can complete half our deen and raise righteous children.');

-- WALI DETAILS
INSERT OR REPLACE INTO wali_details (id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active)
VALUES
('wali_001', 'usr_001', 'Tariq Al-Mansoor', '+447700900077', 'Father', 1, 1),
('wali_003', 'usr_003', 'Bilal Khan', '+971509998877', 'Brother', 1, 1),
('wali_006', 'usr_006', 'Omar Zahra', '+447911998877', 'Father', 1, 1),
('wali_008', 'usr_008', 'Mustafa Ahmed', '+61411998877', 'Father', 1, 1);

-- USER PHOTOS
INSERT OR REPLACE INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
VALUES
('ph_001', 'usr_001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80', 1, 1),
('ph_002', 'usr_002', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', 1, 1),
('ph_003', 'usr_003', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80', 1, 1),
('ph_004', 'usr_004', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80', 1, 1),
('ph_005', 'usr_005', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80', 1, 1),
('ph_006', 'usr_006', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80', 1, 1),
('ph_007', 'usr_007', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80', 1, 1),
('ph_008', 'usr_008', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', 1, 1);


-- MATCHES & CONVERSATION INDEX
INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action, photo_reveal_requested, photo_reveal_approved)
VALUES
('mat_001', 'usr_004', 'usr_001', 'mutual_match', 1, 1);

INSERT OR REPLACE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_sender_id, unread_count_p1, unread_count_p2, wali_observer_id, status)
VALUES
('conv_001', 'usr_004', 'usr_001', 'conversations/conv_001.jsonl', 'Family is very important to me too. I try to visit my parents every weekend...', 'usr_004', 0, 0, 'wali_001', 'active');
