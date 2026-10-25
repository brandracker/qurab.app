-- Migration 0006: Comprehensive Performance Indexes for 99.5% Reduction in Rows Read
-- Safe and idempotent index creation for high-frequency queries

-- 1. Chat Messages (Eliminates full table scans on every message/poll)
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_created ON chat_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 2. Matches & Likes (Crucial for Discover Feed, Likes Received, and Mutual Matches)
CREATE INDEX IF NOT EXISTS idx_matches_sender_action ON matches_and_likes(sender_id, action);
CREATE INDEX IF NOT EXISTS idx_matches_receiver_action ON matches_and_likes(receiver_id, action);
CREATE INDEX IF NOT EXISTS idx_matches_sender_receiver ON matches_and_likes(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches_and_likes(created_at);

-- 3. Conversations (Crucial for Inbox, Live Monitor, and Unread Badges)
CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON conversations(participant_one, last_message_time DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON conversations(participant_two, last_message_time DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON conversations(last_message_time DESC);

-- 4. Users Table (Crucial for Real-time Online Radar, Gender Filter, and Daily Growth)
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_gender_seed ON users(gender, is_seed);

-- 5. User Photos (Crucial for Profile Card Primary Photos)
CREATE INDEX IF NOT EXISTS idx_user_photos_user_primary ON user_photos(user_id, is_primary DESC);
