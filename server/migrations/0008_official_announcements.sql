-- Migration 0008: Official Announcements Channel
CREATE TABLE IF NOT EXISTS official_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  action_url TEXT,
  image_url TEXT,
  action_label TEXT
);

CREATE INDEX IF NOT EXISTS idx_official_announcements_created ON official_announcements(created_at ASC);
