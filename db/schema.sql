-- Serene Union - Cloudflare D1 Database Schema
-- Run with: npx wrangler d1 execute serene-union-db --file=./db/schema.sql

-- 1. USERS & ACCOUNT DETAILS
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
    location TEXT NOT NULL,
    city TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL,
    profession TEXT,
    education TEXT,
    height TEXT,
    ethnicity TEXT,
    marriage_timeline TEXT CHECK(marriage_timeline IN ('within_1_year', 'right_person', 'exploring')),
    bio TEXT,
    blur_photos_by_default BOOLEAN DEFAULT 1,
    profile_visibility TEXT DEFAULT 'approved_only',
    is_vip BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. RELIGIOUS PRACTICE & DEEN PROFILE
CREATE TABLE IF NOT EXISTS religious_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    practice_level TEXT CHECK(practice_level IN ('practicing', 'moderately_practicing', 'cultural', 'revert')) NOT NULL,
    sect TEXT CHECK(sect IN ('Sunni', 'Shia', 'Just Muslim', 'Other')) NOT NULL,
    madhhab TEXT,
    prayer_frequency TEXT,
    halal_diet TEXT,
    deen_relationship_bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. WALI / GUARDIAN CHAPERONE
CREATE TABLE IF NOT EXISTS wali_details (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    wali_name TEXT NOT NULL,
    wali_phone TEXT NOT NULL,
    wali_relationship TEXT CHECK(wali_relationship IN ('Father', 'Brother', 'Uncle', 'Guardian')) NOT NULL,
    is_verified BOOLEAN DEFAULT 0,
    chat_observer_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROFILE PHOTOS
CREATE TABLE IF NOT EXISTS user_photos (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    sort_order INTEGER DEFAULT 1
);

-- 5. MATCHES & INTERACTIONS
CREATE TABLE IF NOT EXISTS matches_and_likes (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    action TEXT CHECK(action IN ('liked', 'passed', 'mutual_match')) NOT NULL,
    photo_reveal_requested BOOLEAN DEFAULT 0,
    photo_reveal_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sender_id, receiver_id)
);

-- 6. CONVERSATIONS & JSONL RECALL INDEX
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    participant_one TEXT REFERENCES users(id) ON DELETE CASCADE,
    participant_two TEXT REFERENCES users(id) ON DELETE CASCADE,
    jsonl_log_path TEXT NOT NULL,
    last_message_text TEXT,
    last_message_sender_id TEXT,
    last_message_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    unread_count_p1 INTEGER DEFAULT 0,
    unread_count_p2 INTEGER DEFAULT 0,
    wali_observer_id TEXT REFERENCES wali_details(id),
    status TEXT CHECK(status IN ('active', 'respectfully_closed', 'blocked')) DEFAULT 'active'
);

-- 7. 1-TO-1 MODESTY PHOTO REVEAL SYSTEM
CREATE TABLE IF NOT EXISTS photo_reveals (
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(owner_id, viewer_id)
);

-- 8. PERFORMANCE INDEXES FOR HORIZONTAL SCALABILITY
CREATE INDEX IF NOT EXISTS idx_users_gender_created ON users(gender, created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_matches_sender_receiver ON matches_and_likes(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_p1_p2 ON conversations(participant_one, participant_two);
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON conversations(last_message_time);
CREATE INDEX IF NOT EXISTS idx_religious_profiles_user ON religious_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_wali_details_user ON wali_details(user_id);
CREATE INDEX IF NOT EXISTS idx_users_lat_lon ON users(latitude, longitude);

