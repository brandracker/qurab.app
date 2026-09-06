import Database from 'better-sqlite3';

export interface MockD1PreparedStatement {
  bind(...params: any[]): MockD1PreparedStatement;
  first<T = any>(colName?: string): Promise<T | null>;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
  run(): Promise<{ success: boolean; meta: any }>;
}

export class MockD1Database {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db || new Database(':memory:');
    this.initSchema();
  }

  public getRawDb(): Database.Database {
    return this.db;
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT,
        full_name TEXT NOT NULL,
        dob DATE NOT NULL,
        gender TEXT NOT NULL,
        location TEXT NOT NULL,
        city TEXT,
        country TEXT,
        latitude REAL,
        longitude REAL,
        profession TEXT,
        education TEXT,
        university TEXT,
        height TEXT,
        ethnicity TEXT,
        family_structure TEXT,
        living_preference TEXT,
        siblings_count INTEGER DEFAULT 0,
        willingness_to_relocate TEXT,
        smoking_status TEXT,
        languages_spoken TEXT,
        mahr_philosophy TEXT,
        children_desire TEXT,
        marriage_timeline TEXT,
        bio TEXT,
        blur_photos_by_default BOOLEAN DEFAULT 1,
        profile_visibility TEXT DEFAULT 'approved_only',
        is_phone_verified BOOLEAN DEFAULT 0,
        is_id_verified BOOLEAN DEFAULT 0,
        is_vip BOOLEAN DEFAULT 0,
        is_profile_completed BOOLEAN DEFAULT 1,
        voice_greeting_url TEXT,
        voice_greeting_duration INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );


      CREATE TABLE IF NOT EXISTS religious_profiles (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        practice_level TEXT NOT NULL,
        sect TEXT NOT NULL,
        madhhab TEXT,
        prayer_frequency TEXT,
        halal_diet TEXT,
        quran_recitation TEXT,
        modesty_practice TEXT,
        hajj_umrah_status TEXT,
        deen_relationship_bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wali_details (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        wali_name TEXT NOT NULL,
        wali_phone TEXT NOT NULL,
        wali_relationship TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT 0,
        chat_observer_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_photos (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        photo_url TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT 0,
        sort_order INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS matches_and_likes (
        id TEXT PRIMARY KEY,
        sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        photo_reveal_requested BOOLEAN DEFAULT 0,
        photo_reveal_approved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sender_id, receiver_id)
      );

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
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id TEXT,
        sender_name TEXT,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS photo_reveals (
        owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        viewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(owner_id, viewer_id)
      );

      CREATE TABLE IF NOT EXISTS phone_otps (
        phone TEXT PRIMARY KEY,
        otp_code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otps (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        code TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        is_used BOOLEAN DEFAULT 0,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_wallets (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        direct_salams_balance INTEGER DEFAULT 2,
        daily_messages_quota INTEGER DEFAULT 15,
        messages_sent_today INTEGER DEFAULT 0,
        subscription_tier TEXT DEFAULT 'free',
        is_spotlight_active BOOLEAN DEFAULT 0,
        spotlight_expires_at TEXT DEFAULT NULL,
        ads_watched_for_salam INTEGER DEFAULT 0,
        daily_likes_quota INTEGER DEFAULT 50,
        likes_used_today INTEGER DEFAULT 0,
        last_likes_reset_date TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS in_app_purchases (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        product_id TEXT NOT NULL,
        purchase_token TEXT,
        amount_cents INTEGER,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_compatibility_answers (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        answers_json TEXT NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_gender_created ON users(gender, created_at);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id, sort_order);
      CREATE INDEX IF NOT EXISTS idx_matches_sender_receiver ON matches_and_likes(sender_id, receiver_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_p1_p2 ON conversations(participant_one, participant_two);
      CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON conversations(last_message_time);
      CREATE INDEX IF NOT EXISTS idx_religious_profiles_user ON religious_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_wali_details_user ON wali_details(user_id);
    `);
  }

  prepare(sql: string): MockD1PreparedStatement {
    const db = this.db;
    let boundParams: any[] = [];

    const stmtWrapper: MockD1PreparedStatement = {
      bind(...params: any[]) {
        boundParams = params;
        return stmtWrapper;
      },

      async first<T = any>(colName?: string): Promise<T | null> {
        try {
          const stmt = db.prepare(sql);
          const row: any = stmt.get(...boundParams);
          if (!row) return null;
          if (colName) return (row[colName] as T) ?? null;
          return row as T;
        } catch (err) {
          throw err;
        }
      },

      async all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }> {
        try {
          const stmt = db.prepare(sql);
          const rows = stmt.all(...boundParams);
          return {
            results: (rows as T[]) || [],
            success: true,
            meta: { changes: 0 }
          };
        } catch (err) {
          throw err;
        }
      },

      async run(): Promise<{ success: boolean; meta: any }> {
        try {
          const stmt = db.prepare(sql);
          const info = stmt.run(...boundParams);
          return {
            success: true,
            meta: {
              changes: info.changes,
              last_row_id: info.lastInsertRowid
            }
          };
        } catch (err) {
          throw err;
        }
      }
    };

    return stmtWrapper;
  }

  async batch(statements: MockD1PreparedStatement[]): Promise<any[]> {
    const results = [];
    const transaction = this.db.transaction(() => {
      // In batch each item is executed
    });
    transaction();
    for (const stmt of statements) {
      results.push(await stmt.run());
    }
    return results;
  }

  close() {
    this.db.close();
  }
}

export class MockR2Bucket {
  private store: Map<string, any> = new Map();

  async put(key: string, value: any): Promise<any> {
    this.store.set(key, value);
    return { key, size: 100 };
  }

  async get(key: string): Promise<any> {
    return this.store.get(key) || null;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export function createTestEnv() {
  const db = new MockD1Database();
  const mediaBucket = new MockR2Bucket();
  return {
    DB: db as any,
    MEDIA_BUCKET: mediaBucket as any,
    ENVIRONMENT: 'test'
  };
}
