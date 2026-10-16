ALTER TABLE users ADD COLUMN last_ip TEXT;
ALTER TABLE users ADD COLUMN last_ip_city TEXT;
ALTER TABLE users ADD COLUMN last_ip_country TEXT;
ALTER TABLE users ADD COLUMN last_ip_isp TEXT;

CREATE TABLE IF NOT EXISTS user_daily_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_date TEXT NOT NULL,
  total_active_seconds INTEGER DEFAULT 0,
  first_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_ip TEXT,
  last_city TEXT,
  last_country TEXT,
  last_isp TEXT,
  user_agent TEXT,
  matches_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  messages_sent_count INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_date ON user_daily_activity(activity_date);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user ON user_daily_activity(user_id);
