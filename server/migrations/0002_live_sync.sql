ALTER TABLE user_wallets ADD COLUMN daily_likes_quota INTEGER DEFAULT 50;
ALTER TABLE user_wallets ADD COLUMN likes_used_today INTEGER DEFAULT 0;
ALTER TABLE user_wallets ADD COLUMN last_likes_reset_date TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_id TEXT,
  avatar_url TEXT,
  action_label TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
