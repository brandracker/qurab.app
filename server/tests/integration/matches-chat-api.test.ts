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
});
