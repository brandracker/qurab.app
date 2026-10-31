import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('TASK-I1: Voice Greeting Delete Endpoint & Persistence Integration Tests', () => {
  let env: any;
  const testUserId = 'usr_voice_del_test';

  beforeEach(async () => {
    env = createTestEnv();

    // Insert user with existing voice greeting
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, voice_greeting_url, voice_greeting_duration)
      VALUES (?, '+923123456789', 'voice_del@example.com', 'Ayesha Malik', '1998-05-15', 'female', 'Islamabad', 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_voice_del_test_1700000.webm', 24)
    `).bind(testUserId).run();
  });

  it('1. Rejects deletion if userId is missing', async () => {
    const res = await app.request('/api/photos/delete-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('userId is required');
  });

  it('2. Successfully deletes voice greeting and clears fields in D1', async () => {
    const res = await app.request('/api/photos/delete-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('deleted successfully');

    // Query DB to verify voice columns are cleared
    const userRow: any = await env.DB.prepare(`
      SELECT voice_greeting_url, voice_greeting_duration FROM users WHERE id = ?
    `).bind(testUserId).first();

    expect(userRow).toBeDefined();
    expect(userRow.voice_greeting_url).toBeNull();
    expect(userRow.voice_greeting_duration).toBe(0);
  });
});
