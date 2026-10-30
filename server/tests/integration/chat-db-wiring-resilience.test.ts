import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleSisterUser } from '../helpers/mock-data';
import { ensureChatTableAndCleanGhostUsr } from '../../src/routes/chat';

describe('Chat DB Wiring, ID Normalization & Ghost Participant Resilience Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // Baseline valid users
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, is_profile_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1), (?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(
      sampleBrotherUser.id, sampleBrotherUser.phone, sampleBrotherUser.email, sampleBrotherUser.full_name, sampleBrotherUser.dob, sampleBrotherUser.gender, sampleBrotherUser.location,
      sampleSisterUser.id, sampleSisterUser.phone, sampleSisterUser.email, sampleSisterUser.full_name, sampleSisterUser.dob, sampleSisterUser.gender, sampleSisterUser.location
    ).run();
  });

  it('1. Auto self-heal purges ghost user "usr" and corrupted conv_usr_usr records from D1', async () => {
    // Seed corrupted ghost records
    await env.DB.prepare(`
      INSERT INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES ('usr', 'ghost@serene.app', '+0011111111', 'Ghost User', '1998-01-01', 'other', 'Global'),
             ('usr_1787950367460', 'real@serene.app', '+0022222222', 'Real Candidate', '1998-01-01', 'female', 'Global')
    `).run();

    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text)
      VALUES ('conv_usr_usr_1787950367460', 'usr_1787950367460', 'usr', 'logs/conv.jsonl', 'broken message')
    `).run();

    await env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES ('msg_broken_1', 'conv_usr_usr_1787950367460', 'usr', 'Candidate', 'broken text')
    `).run();

    // Run self-heal directly
    await ensureChatTableAndCleanGhostUsr(env.DB);

    // Verify ghost records were purged
    const ghostUser = await env.DB.prepare(`SELECT * FROM users WHERE id = 'usr'`).first();
    expect(ghostUser).toBeNull();

    const brokenConv = await env.DB.prepare(`SELECT * FROM conversations WHERE id LIKE '%conv_usr_usr%'`).first();
    expect(brokenConv).toBeNull();

    const brokenMsg = await env.DB.prepare(`SELECT * FROM chat_messages WHERE sender_id = 'usr'`).first();
    expect(brokenMsg).toBeNull();
  });

  it('2. POST /api/matches/action with direct_salam orders participant_one and participant_two canonically', async () => {
    const p1Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[0];
    const p2Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[1];
    const expectedConvId = `conv_${p1Expected}_${p2Expected}`;

    const res = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        action: 'direct_salam',
        messageText: 'Assalamu Alaikum! Would love to view your matrimonial biodata.'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.conversationId).toBe(expectedConvId);

    // Verify row in D1 has canonical participant ordering
    const convRow = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(expectedConvId).first();
    expect(convRow).toBeDefined();
    expect(convRow.participant_one).toBe(p1Expected);
    expect(convRow.participant_two).toBe(p2Expected);
  });

  it('3. POST /api/matches/action mutual match initializes conversation with canonical participant ordering', async () => {
    const p1Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[0];
    const p2Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[1];
    const expectedConvId = `conv_${p1Expected}_${p2Expected}`;

    // Sender likes receiver
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        action: 'liked'
      })
    }, env);

    // Receiver likes sender back -> Mutual match!
    const res = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleSisterUser.id,
        receiverId: sampleBrotherUser.id,
        action: 'liked'
      })
    }, env);

    expect(res.status).toBe(200);
    const convRow = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(expectedConvId).first();
    expect(convRow).toBeDefined();
    expect(convRow.participant_one).toBe(p1Expected);
    expect(convRow.participant_two).toBe(p2Expected);
  });

  it('4. POST /api/conversations/:id/messages normalizes unsorted room ID to canonical room ID in D1', async () => {
    const p1Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[0];
    const p2Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[1];
    const canonicalRoom = `conv_${p1Expected}_${p2Expected}`;
    const unsortedRoom = `conv_${sampleSisterUser.id}_${sampleBrotherUser.id}`;

    const res = await app.request(`/api/conversations/${unsortedRoom}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'msg_test_wire_1',
        senderId: sampleBrotherUser.id,
        senderName: sampleBrotherUser.full_name,
        receiverId: sampleSisterUser.id,
        text: 'Testing canonical room resolution.'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify message was stored under canonical conversation ID in chat_messages table
    const storedMsg = await env.DB.prepare(`SELECT * FROM chat_messages WHERE id = 'msg_test_wire_1'`).first();
    expect(storedMsg).toBeDefined();
    expect(storedMsg.conversation_id).toBe(canonicalRoom);
    expect(storedMsg.text).toBe('Testing canonical room resolution.');

    // Verify conversation row was created under canonical ID
    const convRow = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(canonicalRoom).first();
    expect(convRow).toBeDefined();
  });

  it('5. Dual-table fallback: GET /api/conversations/:id/messages retrieves messages from legacy messages table', async () => {
    const p1Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[0];
    const p2Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[1];
    const canonicalRoom = `conv_${p1Expected}_${p2Expected}`;

    // Create conversation row
    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text)
      VALUES (?, ?, ?, 'logs/conv.jsonl', 'Legacy message test')
    `).bind(canonicalRoom, p1Expected, p2Expected).run();

    // Insert message ONLY into legacy messages table (simulating older sync)
    await env.DB.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, text, wali_notified, created_at)
      VALUES ('msg_legacy_101', ?, ?, 'Legacy hello from messages table', 1, CURRENT_TIMESTAMP)
    `).bind(canonicalRoom, sampleBrotherUser.id).run();

    const res = await app.request(`/api/conversations/${canonicalRoom}/messages?userId=${sampleBrotherUser.id}`, {
      method: 'GET'
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.messages).toHaveLength(1);
    expect(data.messages[0].id).toBe('msg_legacy_101');
    expect(data.messages[0].text).toBe('Legacy hello from messages table');
  });

  it('6. Message idempotency: resending same message ID returns duplicate without re-incrementing unread counters', async () => {
    const p1Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[0];
    const p2Expected = [sampleBrotherUser.id, sampleSisterUser.id].sort()[1];
    const canonicalRoom = `conv_${p1Expected}_${p2Expected}`;

    const payload = {
      id: 'msg_idempotent_1',
      senderId: sampleBrotherUser.id,
      senderName: sampleBrotherUser.full_name,
      receiverId: sampleSisterUser.id,
      text: 'First time send.'
    };

    // First send
    const res1 = await app.request(`/api/conversations/${canonicalRoom}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);
    expect(res1.status).toBe(200);

    const convBefore = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(canonicalRoom).first();
    const unreadBefore = sampleSisterUser.id === p1Expected ? convBefore.unread_count_p1 : convBefore.unread_count_p2;

    // Resend identical message ID
    const res2 = await app.request(`/api/conversations/${canonicalRoom}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.isDuplicate).toBe(true);

    const convAfter = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(canonicalRoom).first();
    const unreadAfter = sampleSisterUser.id === p1Expected ? convAfter.unread_count_p1 : convAfter.unread_count_p2;

    // Unread count must NOT have increased on duplicate send
    expect(unreadAfter).toBe(unreadBefore);
  });

  it('7. Rejects attempts to send a message to/from ghost user "usr"', async () => {
    const res = await app.request(`/api/conversations/conv_usr_test/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'msg_ghost_attempt',
        senderId: 'usr',
        receiverId: sampleSisterUser.id,
        text: 'This should fail.'
      })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});
