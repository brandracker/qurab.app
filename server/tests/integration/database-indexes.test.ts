import { describe, it, expect, beforeEach } from 'vitest';
import { MockD1Database } from '../helpers/test-db';

describe('Database Performance Indexes Verification Suite', () => {
  let db: MockD1Database;

  beforeEach(() => {
    db = new MockD1Database();
  });

  it('1. All high-frequency performance indexes are registered in sqlite_master', async () => {
    const rawDb = db.getRawDb();
    const rows = rawDb.prepare("SELECT name FROM sqlite_master WHERE type = 'index'").all() as { name: string }[];
    const indexNames = rows.map(r => r.name);

    // Chat Indexes
    expect(indexNames).toContain('idx_chat_messages_conv_created');
    expect(indexNames).toContain('idx_chat_messages_sender');
    expect(indexNames).toContain('idx_chat_messages_created_at');

    // Matches & Likes Indexes
    expect(indexNames).toContain('idx_matches_sender_action');
    expect(indexNames).toContain('idx_matches_receiver_action');
    expect(indexNames).toContain('idx_matches_sender_receiver');
    expect(indexNames).toContain('idx_matches_created_at');

    // Conversations Indexes
    expect(indexNames).toContain('idx_conversations_p1');
    expect(indexNames).toContain('idx_conversations_p2');
    expect(indexNames).toContain('idx_conversations_last_msg');

    // Users & Photos Indexes
    expect(indexNames).toContain('idx_users_last_active');
    expect(indexNames).toContain('idx_users_created_at');
    expect(indexNames).toContain('idx_users_gender_seed');
    expect(indexNames).toContain('idx_user_photos_user_primary');
  });

  it('2. Chat messages query uses index search instead of full table scan', async () => {
    const rawDb = db.getRawDb();
    const plan = rawDb.prepare(`
      EXPLAIN QUERY PLAN
      SELECT * FROM chat_messages 
      WHERE conversation_id = 'test_conv_id' 
      ORDER BY created_at ASC
    `).all() as { detail: string }[];

    expect(plan.length).toBeGreaterThan(0);
    const usesIndex = plan.some(p => p.detail.includes('USING INDEX idx_chat_messages_conv_created') || p.detail.includes('SEARCH'));
    expect(usesIndex).toBe(true);
    // Must NOT do a full table scan
    const doesScan = plan.some(p => p.detail.includes('SCAN TABLE chat_messages') && !p.detail.includes('USING INDEX'));
    expect(doesScan).toBe(false);
  });

  it('3. Matches and likes action query uses composite index search', async () => {
    const rawDb = db.getRawDb();
    const plan = rawDb.prepare(`
      EXPLAIN QUERY PLAN
      SELECT * FROM matches_and_likes 
      WHERE sender_id = 'user_abc' AND action = 'liked'
    `).all() as { detail: string }[];

    expect(plan.length).toBeGreaterThan(0);
    const usesIndex = plan.some(p => p.detail.includes('USING INDEX') || p.detail.includes('SEARCH'));
    expect(usesIndex).toBe(true);
  });

  it('4. Conversations participant query uses indexed search', async () => {
    const rawDb = db.getRawDb();
    const plan = rawDb.prepare(`
      EXPLAIN QUERY PLAN
      SELECT * FROM conversations 
      WHERE participant_one = 'user_abc'
      ORDER BY last_message_time DESC
    `).all() as { detail: string }[];

    expect(plan.length).toBeGreaterThan(0);
    const usesIndex = plan.some(p => p.detail.includes('USING INDEX idx_conversations_p1') || p.detail.includes('SEARCH'));
    expect(usesIndex).toBe(true);
  });

  it('5. Live online users query leverages last_active_at index', async () => {
    const rawDb = db.getRawDb();
    const plan = rawDb.prepare(`
      EXPLAIN QUERY PLAN
      SELECT id, full_name FROM users 
      WHERE last_active_at >= datetime('now', '-10 minutes')
      ORDER BY last_active_at DESC
    `).all() as { detail: string }[];

    expect(plan.length).toBeGreaterThan(0);
    const usesIndex = plan.some(p => p.detail.includes('idx_users_last_active') || p.detail.includes('SEARCH'));
    expect(usesIndex).toBe(true);
  });

  it('6. Data integrity check: insertion and indexed retrieval returns exact records', async () => {
    const rawDb = db.getRawDb();
    
    // Insert dummy users
    rawDb.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location)
      VALUES 
        ('u1', '+923001234567', 'Zayd Developer', '1995-01-01', 'male', 'Lahore'),
        ('u2', '+923007654321', 'Amina Doctor', '1997-01-01', 'female', 'Karachi')
    `).run();

    // Insert conversation
    rawDb.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, last_message_text, last_message_time, jsonl_log_path)
      VALUES ('conv_1', 'u1', 'u2', 'Assalamu Alaikum', '2026-10-25 12:00:00', 'logs/conv_1.jsonl')
    `).run();

    // Insert 10 messages
    for (let i = 1; i <= 10; i++) {
      const min = String(i).padStart(2, '0');
      rawDb.prepare(`
        INSERT INTO chat_messages (id, conversation_id, sender_id, text, created_at)
        VALUES ('msg_${i}', 'conv_1', 'u1', 'Message ${i}', '2026-10-25 12:${min}:00')
      `).run();
    }

    // Query messages via index
    const messages = rawDb.prepare(`
      SELECT id, text FROM chat_messages 
      WHERE conversation_id = 'conv_1' 
      ORDER BY created_at ASC
    `).all() as { id: string; text: string }[];

    expect(messages).toHaveLength(10);
    expect(messages[0].id).toBe('msg_1');
    expect(messages[9].id).toBe('msg_10');
  });
});
