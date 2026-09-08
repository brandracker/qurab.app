import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleSisterUser } from '../helpers/mock-data';

describe('Direct Salam, Guest Resilience & Discover Exclusions Integration Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // Insert baseline users
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, is_profile_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1), (?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(
      sampleBrotherUser.id, sampleBrotherUser.phone, sampleBrotherUser.email, sampleBrotherUser.full_name, sampleBrotherUser.dob, sampleBrotherUser.gender, sampleBrotherUser.location,
      sampleSisterUser.id, sampleSisterUser.phone, sampleSisterUser.email, sampleSisterUser.full_name, sampleSisterUser.dob, sampleSisterUser.gender, sampleSisterUser.location
    ).run();
  });

  it('1. POST /api/matches/action handles guest user (usr_guest) without foreign key failure', async () => {
    const res = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_guest',
        receiverId: sampleSisterUser.id,
        action: 'liked'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isMutual).toBe(false);

    // Verify record exists in matches_and_likes table
    const row = await env.DB.prepare(
      `SELECT * FROM matches_and_likes WHERE sender_id = 'usr_guest' AND receiver_id = ?`
    ).bind(sampleSisterUser.id).first();
    expect(row).toBeDefined();
    expect(row.action).toBe('liked');
  });

  it('2. POST /api/matches/action with direct_salam creates conversation, custom greeting message & recipient notification', async () => {
    const customMessage = 'Assalamu Alaikum Sister, I was truly inspired by your dedication to Quran studies and family values.';

    const res = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        action: 'direct_salam',
        messageText: customMessage
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.conversationId).toBeDefined();

    // 1. Verify conversation initialized with custom message
    const conv = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(data.conversationId).first();
    expect(conv).toBeDefined();
    expect(conv.last_message_text).toBe(customMessage);

    // 2. Verify D1 notification generated for recipient
    const notif = await env.DB.prepare(
      `SELECT * FROM notifications WHERE user_id = ? AND type = 'salam'`
    ).bind(sampleSisterUser.id).first();
    expect(notif).toBeDefined();
    expect(notif.target_id).toBe(data.conversationId);
    expect(notif.title).toContain('Direct Salam');
  });

  it('3. GET /api/profiles/discover excludes candidates that have been actioned (liked, passed, or salam)', async () => {
    // 1. Initial discover: Sister is available for Brother
    const initialRes = await app.request(`/api/profiles/discover?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(initialRes.status).toBe(200);
    const initialData = await initialRes.json();
    const foundInitial = initialData.profiles.some((p: any) => p.id === sampleSisterUser.id);
    expect(foundInitial).toBe(true);

    // 2. Brother passes Sister
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: sampleSisterUser.id,
        action: 'passed'
      })
    }, env);

    // 3. Second discover: Sister must be excluded from Brother feed
    const secondRes = await app.request(`/api/profiles/discover?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(secondRes.status).toBe(200);
    const secondData = await secondRes.json();
    const foundSecond = secondData.profiles.some((p: any) => p.id === sampleSisterUser.id);
    expect(foundSecond).toBe(false);

    // 4. Reset passes
    const resetRes = await app.request('/api/matches/reset-passed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: sampleBrotherUser.id })
    }, env);
    expect(resetRes.status).toBe(200);

    // 5. Third discover: Sister is visible again!
    const thirdRes = await app.request(`/api/profiles/discover?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    const thirdData = await thirdRes.json();
    const foundThird = thirdData.profiles.some((p: any) => p.id === sampleSisterUser.id);
    expect(foundThird).toBe(true);
  });
});
