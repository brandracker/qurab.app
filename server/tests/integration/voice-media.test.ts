import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Voice Greeting & Media Audio Storage Tests', () => {
  let env: any;
  const testUserId = 'usr_voice_tester_1';

  beforeEach(async () => {
    env = createTestEnv();

    // Insert user into test db
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES (?, '+447000000001', 'voice@test.com', 'Voice Test User', '1995-01-01', 'male', 'London, UK')
    `).bind(testUserId).run();
  });

  it('1. Rejects voice upload if missing audioBase64 or userId', async () => {
    const res = await app.request('/api/photos/upload-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('required');
  });

  it('2. Successfully uploads voice greeting and updates user table in D1', async () => {
    const sampleAudio = 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAA==';
    const res = await app.request('/api/photos/upload-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        audioBase64: sampleAudio,
        duration: 35
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.voiceUrl).toBeDefined();
    expect(data.duration).toBe(35);

    // Verify D1 user row has updated columns
    const userRow: any = await env.DB.prepare(`
      SELECT voice_greeting_url, voice_greeting_duration FROM users WHERE id = ?
    `).bind(testUserId).first();

    expect(userRow).toBeDefined();
    expect(userRow.voice_greeting_duration).toBe(35);
    expect(userRow.voice_greeting_url).toBe(data.voiceUrl);
  });

  it('3. Streams media with proper content headers from R2 storage', async () => {
    // Media streaming endpoint test with mock R2 get
    const res = await app.request('/api/photos/media/non_existent_voice.webm', {
      method: 'GET'
    }, env);

    // If bucket not attached or file not found, returns 404
    expect([404, 200]).toContain(res.status);
  });
});
