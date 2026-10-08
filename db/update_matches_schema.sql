PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS matches_and_likes_new (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    action TEXT CHECK(action IN ('liked', 'passed', 'mutual_match', 'direct_salam')) NOT NULL,
    photo_reveal_requested BOOLEAN DEFAULT 0,
    photo_reveal_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sender_id, receiver_id)
);

INSERT INTO matches_and_likes_new (id, sender_id, receiver_id, action, photo_reveal_requested, photo_reveal_approved, created_at)
SELECT id, sender_id, receiver_id, action, photo_reveal_requested, photo_reveal_approved, created_at
FROM matches_and_likes;

DROP TABLE matches_and_likes;

ALTER TABLE matches_and_likes_new RENAME TO matches_and_likes;

PRAGMA foreign_keys = ON;
