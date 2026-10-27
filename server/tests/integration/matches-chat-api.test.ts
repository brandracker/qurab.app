import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleSisterUser } from '../helpers/mock-data';

describe('Matches, Chat, Wali & Monetization API Integration Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // Insert baseline users
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sampleBrotherUser.id, sampleBrotherUser.phone, sampleBrotherUser.email, sampleBrotherUser.full_name, sampleBrotherUser.dob, sampleBrotherUser.gender, sampleBrotherUser.location,
      sampleSisterUser.id, sampleSisterUser.phone, sampleSisterUser.email, sampleSisterUser.full_name, sampleSisterUser.dob, sampleSisterUser.gender, sampleSisterUser.location
    ).run();
  });

  it('POST /api/matches/action handles one-sided like and true mutual match flow', async () => {
    // 1. Brother likes Sister (one-sided)
    const res1 = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        action: 'liked'
      })
    }, env);

    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.success).toBe(true);
    expect(data1.isMutual).toBe(false);
    expect(data1.conversationId).toBeNull();

    // 2. Sister checks her "Liked You" list
    const receivedRes = await app.request(`/api/matches/received?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
    expect(receivedRes.status).toBe(200);
    const receivedData = await receivedRes.json();
    expect(receivedData.success).toBe(true);
    expect(receivedData.count).toBe(1);
    expect(receivedData.candidates[0].id).toBe(sampleBrotherUser.id);
    expect(receivedData.candidates[0].fullName).toBe(sampleBrotherUser.full_name);

    // 3. Sister likes Brother back (True Mutual Match!)
    const res2 = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleSisterUser.id,
        receiverId: sampleBrotherUser.id,
        action: 'liked'
      })
    }, env);

    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.success).toBe(true);
    expect(data2.isMutual).toBe(true);
    expect(data2.conversationId).toBeDefined();

    // 4. Verify conversation row was automatically initialized in D1
    const convRow = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(data2.conversationId).first();
    expect(convRow).toBeDefined();
    expect(convRow.id).toBe(data2.conversationId);
  });

  it('POST & GET /api/conversations handles chat messages and sync', async () => {
    // 1. Create conversation
    const convRes = await app.request('/api/conversations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantOne: sampleBrotherUser.id,
        participantTwo: sampleSisterUser.id
      })
    }, env);

    expect(convRes.status).toBe(200);
    const convData = await convRes.json();
    expect(convData.success).toBe(true);
    const convId = convData.conversationId;

    // 2. Send message
    const msgRes = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        senderName: sampleBrotherUser.full_name,
        text: 'Assalamu Alaikum wa Rahmatullah!'
      })
    }, env);

    expect(msgRes.status).toBe(200);
    const msgData = await msgRes.json();
    expect(msgData.success).toBe(true);
    expect(msgData.message.text).toBe('Assalamu Alaikum wa Rahmatullah!');
    expect(msgData.message.waliNotified).toBe(true);

    // 3. Fetch conversation messages
    const getMsgRes = await app.request(`/api/conversations/${convId}/messages`, { method: 'GET' }, env);
    expect(getMsgRes.status).toBe(200);
    const getMsgData = await getMsgRes.json();
    expect(getMsgData.success).toBe(true);
    expect(getMsgData.messages).toHaveLength(1);
    expect(getMsgData.messages[0].text).toBe('Assalamu Alaikum wa Rahmatullah!');
  });

  it('POST /api/conversations/:id/messages handles idempotency on duplicate retry without double incrementing unread count', async () => {
    // 1. Create conversation
    const convRes = await app.request('/api/conversations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantOne: sampleBrotherUser.id,
        participantTwo: sampleSisterUser.id
      })
    }, env);
    const convId = (await convRes.json()).conversationId;

    const retryMsgId = 'msg_idempotent_test_123';

    // 2. Send message 1st time
    const res1 = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: retryMsgId,
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        senderName: sampleBrotherUser.full_name,
        text: 'Test message for idempotency'
      })
    }, env);

    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.success).toBe(true);
    expect(data1.messageId).toBe(retryMsgId);

    // Verify unread count was incremented to 1
    const conv1 = await env.DB.prepare('SELECT unread_count_p1, unread_count_p2, participant_one, participant_two FROM conversations WHERE id = ?').bind(convId).first();
    const unreadAfterFirst = conv1.participant_one === sampleSisterUser.id ? conv1.unread_count_p1 : conv1.unread_count_p2;
    expect(unreadAfterFirst).toBe(1);

    // 3. Send the exact same message a 2nd time (simulating a mobile network retry)
    const res2 = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: retryMsgId,
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        senderName: sampleBrotherUser.full_name,
        text: 'Test message for idempotency'
      })
    }, env);

    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.success).toBe(true);
    expect(data2.isDuplicate).toBe(true);

    // Verify chat_messages has exactly 1 record, NOT 2
    const { results: msgs } = await env.DB.prepare('SELECT id FROM chat_messages WHERE id = ?').bind(retryMsgId).all();
    expect(msgs).toHaveLength(1);

    // Verify unread count did NOT increment again
    const conv2 = await env.DB.prepare('SELECT unread_count_p1, unread_count_p2, participant_one, participant_two FROM conversations WHERE id = ?').bind(convId).first();
    const unreadAfterSecond = conv2.participant_one === sampleSisterUser.id ? conv2.unread_count_p1 : conv2.unread_count_p2;
    expect(unreadAfterSecond).toBe(1);
  });

  it('POST /api/wali/invite creates a verified Wali observer chaperone record', async () => {
    const res = await app.request('/api/wali/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sampleSisterUser.id,
        waliName: 'Farooq Zahra',
        waliPhone: '+15553334444',
        waliRelationship: 'Father'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.inviteLink).toBeDefined();
    expect(data.whatsappShareUrl).toContain('5553334444');
  });

  it('POST /api/wallet/reward-ad awards free messages quota and direct salams', async () => {
    // 1. Initial wallet fetch (creates free tier record)
    const walletRes = await app.request(`/api/wallet/${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(walletRes.status).toBe(200);
    const initialWallet = (await walletRes.json()).wallet;
    expect(initialWallet.dailyMessagesQuota).toBe(15);

    // 2. Claim rewarded ad for messages
    const adRes = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sampleBrotherUser.id,
        rewardType: 'messages'
      })
    }, env);

    expect(adRes.status).toBe(200);

    // 3. Verify upgraded quota
    const updatedWalletRes = await app.request(`/api/wallet/${sampleBrotherUser.id}`, { method: 'GET' }, env);
    const updatedWallet = (await updatedWalletRes.json()).wallet;
    expect(updatedWallet.dailyMessagesQuota).toBeGreaterThan(15);
  });

  it('Enforces true two-way block across Discover, Conversations, Matches, and Chat Messaging', async () => {
    // 1. Establish mutual match and conversation between Brother and Sister
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sampleBrotherUser.id, receiverId: sampleSisterUser.id, action: 'liked', isMutualMatch: true })
    }, env);

    // Verify conversation exists
    const convsBefore = await app.request(`/api/conversations?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    const convsBeforeData = await convsBefore.json();
    expect(convsBeforeData.conversations).toHaveLength(1);

    // Verify mutual match appears
    const mutualBefore = await app.request(`/api/matches/mutual?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    const mutualBeforeData = await mutualBefore.json();
    expect(mutualBeforeData.matches).toHaveLength(1);

    // 2. Brother blocks Sister
    const blockRes = await app.request('/api/matches/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: sampleBrotherUser.id, targetId: sampleSisterUser.id, reason: 'Test block' })
    }, env);
    expect(blockRes.status).toBe(200);

    // 3. Verify neither Brother nor Sister sees the conversation in /api/conversations
    const convsBrother = await (await app.request(`/api/conversations?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env)).json();
    expect(convsBrother.conversations).toHaveLength(0);

    const convsSister = await (await app.request(`/api/conversations?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(convsSister.conversations).toHaveLength(0);

    // 4. Verify neither Brother nor Sister sees the other in /api/matches/mutual
    const mutualBrother = await (await app.request(`/api/matches/mutual?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env)).json();
    expect(mutualBrother.matches).toHaveLength(0);

    const mutualSister = await (await app.request(`/api/matches/mutual?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(mutualSister.matches).toHaveLength(0);

    // 5. Verify neither Brother nor Sister sees the other in /api/profiles/discover
    const discoverBrother = await (await app.request(`/api/profiles/discover?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env)).json();
    expect(discoverBrother.profiles.some((p: any) => p.id === sampleSisterUser.id)).toBe(false);

    const discoverSister = await (await app.request(`/api/profiles/discover?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(discoverSister.profiles.some((p: any) => p.id === sampleBrotherUser.id)).toBe(false);

    // 6. Verify sending a message to a blocked partner is rejected with 403 Forbidden
    const convId = `conv_${[sampleBrotherUser.id, sampleSisterUser.id].sort().join('_')}`;
    const blockedMsgRes = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleSisterUser.id,
        senderName: sampleSisterUser.full_name,
        receiverId: sampleBrotherUser.id,
        text: 'Hello, are you there?'
      })
    }, env);
    expect(blockedMsgRes.status).toBe(403);
    const blockedMsgData = await blockedMsgRes.json();
    expect(blockedMsgData.success).toBe(false);
    expect(blockedMsgData.error).toContain('blocked');
  });

  it('Separates tabs cleanly: mutual match is excluded from /api/matches/received', async () => {
    // 1. Brother likes Sister
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sampleBrotherUser.id, receiverId: sampleSisterUser.id, action: 'liked' })
    }, env);

    // Sister receives it in Liked You
    const received1 = await (await app.request(`/api/matches/received?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(received1.candidates.some((c: any) => c.id === sampleBrotherUser.id)).toBe(true);

    // 2. Sister accepts and matches back
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sampleSisterUser.id, receiverId: sampleBrotherUser.id, action: 'liked', isMutualMatch: true })
    }, env);

    // Sister now checks /received: Brother MUST NOT appear in pending Liked You!
    const received2 = await (await app.request(`/api/matches/received?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(received2.candidates.some((c: any) => c.id === sampleBrotherUser.id)).toBe(false);

    // Brother MUST appear exclusively in /mutual
    const mutualSister = await (await app.request(`/api/matches/mutual?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    expect(mutualSister.matches.some((m: any) => m.id === sampleBrotherUser.id)).toBe(true);
  });

  it('Limits photo payloads in /received, /mutual, and /conversations to 1 primary photo per candidate', async () => {
    // Insert 5 test photos for sampleBrotherUser
    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
      VALUES 
        ('ph_br_1', ?, 'https://example.com/photo1.jpg', 1, 1),
        ('ph_br_2', ?, 'https://example.com/photo2.jpg', 0, 2),
        ('ph_br_3', ?, 'https://example.com/photo3.jpg', 0, 3),
        ('ph_br_4', ?, 'https://example.com/photo4.jpg', 0, 4),
        ('ph_br_5', ?, 'https://example.com/photo5.jpg', 0, 5)
    `).bind(sampleBrotherUser.id, sampleBrotherUser.id, sampleBrotherUser.id, sampleBrotherUser.id, sampleBrotherUser.id).run();

    // Brother likes Sister
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sampleBrotherUser.id, receiverId: sampleSisterUser.id, action: 'liked' })
    }, env);

    // Verify /matches/received returns only 1 photo for Brother
    const recRes = await (await app.request(`/api/matches/received?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    const candidate = recRes.candidates.find((c: any) => c.id === sampleBrotherUser.id);
    expect(candidate).toBeDefined();
    expect(candidate.photos).toHaveLength(1);
    expect(candidate.photos[0]).toBe('https://example.com/photo1.jpg');

    // Sister accepts match
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sampleSisterUser.id, receiverId: sampleBrotherUser.id, action: 'liked', isMutualMatch: true })
    }, env);

    // Verify /matches/mutual returns only 1 photo for Brother
    const mutRes = await (await app.request(`/api/matches/mutual?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    const match = mutRes.matches.find((m: any) => m.id === sampleBrotherUser.id);
    expect(match).toBeDefined();
    expect(match.photos).toHaveLength(1);
    expect(match.photos[0]).toBe('https://example.com/photo1.jpg');

    // Verify /conversations returns only 1 photo for Brother
    const convRes = await (await app.request(`/api/conversations?userId=${sampleSisterUser.id}`, { method: 'GET' }, env)).json();
    const conv = convRes.conversations.find((c: any) => c.otherUser?.id === sampleBrotherUser.id);
    expect(conv).toBeDefined();
    expect(conv.otherUser.photos).toHaveLength(1);
    expect(conv.otherUser.photos[0]).toBe('https://example.com/photo1.jpg');
  });

  it('Successfully fetches conversations for users with 100+ conversation partners using chunked queries', async () => {
    // Generate and insert 110 mock users and conversations for sampleSisterUser
    for (let i = 1; i <= 110; i++) {
      const partnerId = `usr_partner_mock_${i}`;
      await env.DB.prepare(`
        INSERT INTO users (id, phone, email, full_name, dob, gender, location)
        VALUES (?, ?, ?, ?, '1995-01-01', 'male', 'Lahore, PK')
      `).bind(partnerId, `phone_${i}`, `partner_${i}@test.com`, `Partner ${i}`).run();

      await env.DB.prepare(`
        INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
        VALUES (?, ?, ?, 'logs/test.jsonl', 'Salam', datetime('now', '-${i} minutes'))
      `).bind(`conv_${sampleSisterUser.id}_${partnerId}`, sampleSisterUser.id, partnerId).run();

      await env.DB.prepare(`
        INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
        VALUES (?, ?, ?, 1, 1)
      `).bind(`ph_${partnerId}`, partnerId, `https://example.com/${partnerId}.jpg`).run();
    }

    const res = await app.request(`/api/conversations?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.conversations.length).toBeGreaterThanOrEqual(110);
  });
});

