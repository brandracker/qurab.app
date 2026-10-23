import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { processAiSeedResponse, determinePersona } from '../../src/utils/ai-chat-agent';

describe('AI Seed Profiles Chat Agent Integration', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // 1. Seed user (Alizeh Shah Mir - Media student)
    await env.DB.prepare(`
      INSERT INTO users (
        id, phone, email, full_name, dob, gender, location, city, profession, education, university, bio, is_seed, is_profile_completed
      ) VALUES (
        'usr_seed_pk_51', '+923001234551', 'alizeh@qurb.app', 'Alizeh Shah Mir', '2004-04-18', 'female',
        'Sector F-7/1, Islamabad', 'Islamabad', 'BS Media Sciences Student', 'BS Media Sciences', 'NUST',
        'Media Sciences student. Cheerful, family-centric, and grounded in Islamic values.', 1, 1
      )
    `).run();

    await env.DB.prepare(`
      INSERT INTO wali_details (id, user_id, wali_name, wali_phone, wali_relationship)
      VALUES ('wali_seed_51', 'usr_seed_pk_51', 'Shahmir Farooq', '+923009876551', 'Father')
    `).run();

    // 2. Real user (Hamza - Seeker)
    await env.DB.prepare(`
      INSERT INTO users (
        id, phone, email, full_name, dob, gender, location, city, profession, is_profile_completed
      ) VALUES (
        'usr_real_male_1', '+923001112233', 'hamza@test.com', 'Hamza Khan', '1998-05-12', 'male',
        'Gulberg, Lahore', 'Lahore', 'Software Engineer', 1
      )
    `).run();

    // 3. Conversation between Hamza and Seed Profile
    await env.DB.prepare(`
      INSERT INTO conversations (
        id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time
      ) VALUES (
        'conv_usr_real_male_1_usr_seed_pk_51', 'usr_real_male_1', 'usr_seed_pk_51', 'logs/conv.jsonl',
        'You matched! Start with Bismillah.', CURRENT_TIMESTAMP
      )
    `).run();

    // 4. Ensure system_settings & admins tables
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'superadmin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await env.DB.prepare(`
      INSERT OR IGNORE INTO admins (id, username, password_hash, name, role)
      VALUES ('adm_root', 'admin', 'hash', 'Super Admin', 'superadmin')
    `).run();
  });

  it('1. Correctly classifies persona archetypes based on profile details', () => {
    expect(determinePersona({ profession: 'MBBS Doctor', bio: 'Resident doctor at hospital' })).toBe('professional');
    expect(determinePersona({ profession: 'BS Media Sciences', bio: 'Creative student' })).toBe('professional');
    expect(determinePersona({ profession: 'Homemaker', bio: 'Deeply grounded in deen, sunnah and family values' })).toBe('traditional');
    expect(determinePersona({ age: 19, profession: 'Student', bio: 'Simple girl' })).toBe('shy');
  });

  it('2. Turn 1: Seed profile generates polite greeting and asks for biodata/profile', async () => {
    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Salam alaikum! Kaisi hain aap?',
      db: env.DB,
      delayMs: 0
    });

    expect(result.replied).toBe(true);
    expect(result.turnCount).toBe(1);
    expect(result.replyText).toBeDefined();

    // Verify message was stored in DB
    const { results: msgs } = await env.DB.prepare(`
      SELECT * FROM chat_messages WHERE conversation_id = 'conv_usr_real_male_1_usr_seed_pk_51'
    `).all();

    expect(msgs.length).toBe(1);
    expect(msgs[0].sender_id).toBe('usr_seed_pk_51');
    expect(msgs[0].text.toLowerCase()).toContain('salam');
  });

  it('3. Turn 2: Gates conversation on biodata if user gives casual reply', async () => {
    // Simulate Turn 1 already answered
    await env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES 
        ('m1', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_real_male_1', 'Hamza', 'Salam! Kaisi hain?'),
        ('m2', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'Walaikum Assalam. Kheriyat? Please share your biodata first.')
    `).run();

    // User dodges biodata and sends casual text
    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Aap bohot pyari lag rahi hain, WhatsApp pe baat karte hain',
      db: env.DB,
      delayMs: 0
    });

    expect(result.replied).toBe(true);
    expect(result.turnCount).toBe(2);
    // Should insist on biodata / family
    expect(result.replyText?.toLowerCase()).toMatch(/(biodata|family|serious|details|guftagu)/);
  });

  it('4. Turn 3: Concludes gracefully with Wali hand-off instruction', async () => {
    // Simulate 2 previous AI turns
    await env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES 
        ('m1', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_real_male_1', 'Hamza', 'Salam!'),
        ('m2', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'Walaikum Assalam. Aap apna biodata bhej dein.'),
        ('m3', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_real_male_1', 'Hamza', 'Main Software Engineer hoon Lahore se, age 27, family business bhi hai.'),
        ('m4', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'MashaAllah, achi qualification hai. Family se discuss karna hoga.')
    `).run();

    // User Turn 3 message
    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Jee zaroor, aage ka kya process hoga?',
      db: env.DB,
      delayMs: 0
    });

    expect(result.replied).toBe(true);
    // Turn 3 must conclude with family consultation and Allah Hafiz
    expect(result.replyText?.toLowerCase()).toMatch(/(family|parents|ghar|allah hafiz)/);
  });

  it('5. Turn 4+: AI quits and stops responding after 3 turns', async () => {
    // Insert 3 AI messages already
    await env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES 
        ('m1', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'Turn 1 reply'),
        ('m2', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'Turn 2 reply'),
        ('m3', 'conv_usr_real_male_1_usr_seed_pk_51', 'usr_seed_pk_51', 'Alizeh', 'Turn 3 reply: Allah hafiz')
    `).run();

    // User sends a 4th message
    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Are you there? Hello?',
      db: env.DB,
      delayMs: 0
    });

    // Should decline to reply
    expect(result.replied).toBe(false);
    expect(result.reason).toBe('turn_limit_exceeded');

    // Message count from AI should remain 3
    const { results: aiMsgs } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM chat_messages 
      WHERE conversation_id = 'conv_usr_real_male_1_usr_seed_pk_51' AND sender_id = 'usr_seed_pk_51'
    `).all();

    expect(Number(aiMsgs[0].count)).toBe(3);
  });

  it('6. Kill Switch: AI immediately halts when admin disables ai_agent_enabled in system_settings', async () => {
    // Admin turns off AI agent globally
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at DATETIME)
    `).run();
    await env.DB.prepare(`
      INSERT INTO system_settings (key, value) VALUES ('ai_agent_enabled', '0')
      ON CONFLICT(key) DO UPDATE SET value = '0'
    `).run();

    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Salam alaikum! Kaisi hain aap?',
      db: env.DB,
      delayMs: 0
    });

    expect(result.replied).toBe(false);
    expect(result.reason).toBe('ai_agent_disabled_by_admin');
  });

  it('7. Individual Switch: Profile halts when seed_active = 0', async () => {
    // Deactivate specific profile
    await env.DB.prepare("UPDATE users SET seed_active = 0 WHERE id = 'usr_seed_pk_51'").run();

    const result = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Salam alaikum! Kaisi hain aap?',
      db: env.DB,
      delayMs: 0
    });

    expect(result.replied).toBe(false);
    expect(result.reason).toBe('seed_profile_deactivated');
  });

  it('8. Admin API: /api/admin/ai-agent/toggle and /api/admin/ai-agent/status toggle system state', async () => {
    // 1. Create admin user & auth token
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'superadmin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await env.DB.prepare(`
      INSERT OR IGNORE INTO admins (id, username, password_hash, name, role)
      VALUES ('adm_root', 'admin', 'hash', 'Super Admin', 'superadmin')
    `).run();

    const adminToken = 'adm_tok_adm_root.mocktoken.12345';

    // 2. Query initial status
    const statusRes = await app.request('/api/admin/ai-agent/status', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);
    expect(statusRes.status).toBe(200);
    const statusData = await statusRes.json();
    expect(statusData.success).toBe(true);
    expect(statusData.enabled).toBe(true);

    // 3. Toggle OFF
    const toggleOffRes = await app.request('/api/admin/ai-agent/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ enabled: false })
    }, env);
    expect(toggleOffRes.status).toBe(200);
    const toggleOffData = await toggleOffRes.json();
    expect(toggleOffData.success).toBe(true);
    expect(toggleOffData.enabled).toBe(false);

    // 4. Verify system_settings reflects '0'
    const dbRow = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'ai_agent_enabled'").first();
    expect(dbRow.value).toBe('0');
  });

  it('9. Admin API: /api/admin/ai-agent/pending-count accurately detects unreplied chats and matches', async () => {
    const adminToken = 'adm_tok_adm_root.mocktoken.12345';
    // Ensure system is enabled
    await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ai_agent_enabled', '1')").run();

    const countRes = await app.request('/api/admin/ai-agent/pending-count', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);
    expect(countRes.status).toBe(200);
    const countData = await countRes.json();
    expect(countData.success).toBe(true);
    // conv_usr_real_male_1_usr_seed_pk_51 has 0 replies yet, so count is at least 1
    expect(countData.pendingCount).toBeGreaterThanOrEqual(1);
  });

  it('10. Admin API: /api/admin/ai-agent/catchup processes pending conversations and auto-replies', async () => {
    const adminToken = 'adm_tok_adm_root.mocktoken.12345';
    await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ai_agent_enabled', '1')").run();

    const catchupRes = await app.request('/api/admin/ai-agent/catchup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ limit: 10 })
    }, env);

    expect(catchupRes.status).toBe(200);
    const catchupData = await catchupRes.json();
    expect(catchupData.success).toBe(true);
    expect(catchupData.repliedCount).toBeGreaterThanOrEqual(1);
    expect(catchupData.processedConvs).toContain('conv_usr_real_male_1_usr_seed_pk_51');

    // Verify chat message was created in DB
    const { results: msgs } = await env.DB.prepare(`
      SELECT * FROM chat_messages WHERE conversation_id = 'conv_usr_real_male_1_usr_seed_pk_51'
    `).all();
    expect(msgs.length).toBeGreaterThanOrEqual(1);
    expect(msgs[0].sender_id).toBe('usr_seed_pk_51');
  });

  it('11. Direct Salam to seed profile initiates conversation with proper sender tracking', async () => {
    // Re-enable AI
    await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ai_agent_enabled', '1')").run();

    const salamRes = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_real_male_1',
        receiverId: 'usr_seed_pk_51',
        action: 'direct_salam',
        messageText: 'Assalamu Alaikum! Would love to connect.'
      })
    }, env);

    expect(salamRes.status).toBe(200);
    const data = await salamRes.json();
    expect(data.success).toBe(true);

    // Verify conversation record has last_message_sender_id
    const conv = await env.DB.prepare(`
      SELECT * FROM conversations WHERE id = ?
    `).bind(data.conversationId).first();
    expect(conv.last_message_sender_id).toBe('usr_real_male_1');
  });

  it('12. Strict 1-to-1 Turn Taking: Seed profile refuses to send consecutive messages while awaiting human reply', async () => {
    await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ai_agent_enabled', '1')").run();

    // 1. First reply succeeds (Turn 1 greeting)
    const reply1 = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Assalamu Alaikum!',
      db: env.DB,
      delayMs: 0
    });
    expect(reply1.replied).toBe(true);

    // 2. Second immediate call without human replying must be BLOCKED
    const reply2 = await processAiSeedResponse({
      conversationId: 'conv_usr_real_male_1_usr_seed_pk_51',
      seedUserId: 'usr_seed_pk_51',
      realUserId: 'usr_real_male_1',
      userMessageText: 'Assalamu Alaikum!',
      db: env.DB,
      delayMs: 0
    });
    expect(reply2.replied).toBe(false);
    expect(reply2.reason).toBe('already_responded_awaiting_user_reply');
  });
});


