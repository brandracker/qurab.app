import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleSisterUser } from '../helpers/mock-data';

describe('Matches LEFT JOIN Resilience, Instant Match & Guest Migration Tests', () => {
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

  it('1. POST /api/matches/action automatically satisfies foreign keys and GET /api/matches/received returns candidates with LEFT JOIN', async () => {
    // A mock candidate expresses interest in Sister via API
    const actionRes = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_new_suitor_999',
        receiverId: sampleSisterUser.id,
        action: 'liked'
      })
    }, env);
    expect(actionRes.status).toBe(200);

    const res = await app.request(`/api/matches/received?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.candidates.length).toBe(1);
    expect(data.candidates[0].id).toBe('usr_new_suitor_999');
    expect(data.candidates[0].fullName).toBeDefined();
  });

  it('2. POST /api/matches/action with isMutualMatch=true creates mutual match bidirectionally & conversation in D1', async () => {
    const res = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleSisterUser.id,
        receiverId: sampleBrotherUser.id,
        action: 'liked',
        isMutualMatch: true
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isMutual).toBe(true);
    expect(data.conversationId).toBeDefined();

    // Verify conversation was created in D1
    const convRow = await env.DB.prepare(`SELECT * FROM conversations WHERE id = ?`).bind(data.conversationId).first();
    expect(convRow).toBeDefined();

    // Verify mutual matches endpoint returns it
    const mutualRes = await app.request(`/api/matches/mutual?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
    const mutualData = await mutualRes.json();
    expect(mutualData.success).toBe(true);
    expect(mutualData.matches.some((m: any) => m.id === sampleBrotherUser.id)).toBe(true);
  });

  it('3. GET /api/matches/activity returns passed and blocked records (LEFT JOIN)', async () => {
    // Pass on candidate via API
    const passRes = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: sampleBrotherUser.id,
        receiverId: 'usr_passed_candidate_1',
        action: 'passed'
      })
    }, env);
    expect(passRes.status).toBe(200);

    // Block candidate via API
    const blockRes = await app.request('/api/matches/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sampleBrotherUser.id,
        targetId: 'usr_blocked_candidate_2',
        reason: 'Inappropriate content'
      })
    }, env);
    expect(blockRes.status).toBe(200);

    const res = await app.request(`/api/matches/activity?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify passed list includes candidate
    expect(data.passed.length).toBe(1);
    expect(data.passed[0].id).toBe('usr_passed_candidate_1');
    expect(data.passed[0].fullName).toBeDefined();

    // Verify blocked list includes candidate
    expect(data.blocked.length).toBe(1);
    expect(data.blocked[0].id).toBe('usr_blocked_candidate_2');
    expect(data.blocked[0].fullName).toBeDefined();
    expect(data.blocked[0].reason).toBe('Inappropriate content');
  });

  it('4. POST /api/matches/migrate-guest migrates likes and blocks to authenticated user', async () => {
    // Guest likes sister
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_guest',
        receiverId: sampleSisterUser.id,
        action: 'liked'
      })
    }, env);

    // Guest blocks someone
    await app.request('/api/matches/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_guest',
        targetId: 'usr_spammer_3',
        reason: 'Spam'
      })
    }, env);

    // Call migration endpoint
    const migrateRes = await app.request('/api/matches/migrate-guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId: 'usr_guest',
        authenticatedId: sampleBrotherUser.id
      })
    }, env);

    expect(migrateRes.status).toBe(200);
    const migrateData = await migrateRes.json();
    expect(migrateData.success).toBe(true);

    // Verify likes now belong to sampleBrotherUser
    const likeRow: any = await env.DB.prepare(`SELECT * FROM matches_and_likes WHERE sender_id = ? AND action = 'liked'`).bind(sampleBrotherUser.id).first();
    expect(likeRow).toBeDefined();
    expect(likeRow.receiver_id).toBe(sampleSisterUser.id);

    // Verify blocks now belong to sampleBrotherUser
    const blockRow: any = await env.DB.prepare(`SELECT * FROM blocked_users WHERE blocker_id = ?`).bind(sampleBrotherUser.id).first();
    expect(blockRow).toBeDefined();
    expect(blockRow.blocked_id).toBe('usr_spammer_3');
  });
});
