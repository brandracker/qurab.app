import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Database Table Binding & Query Integrity Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // Seed test users: Male A, Female B, Female C
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, latitude, longitude)
      VALUES 
        ('usr_bind_m1', '+1001', 'm1@test.com', 'Male Seeker', '1995-01-01', 'male', 'New York, USA', 40.7128, -74.0060),
        ('usr_bind_f1', '+1002', 'f1@test.com', 'Female Seeker 1', '1998-01-01', 'female', 'New York, USA', 40.7128, -74.0060),
        ('usr_bind_f2', '+1003', 'f2@test.com', 'Female Seeker 2', '1999-01-01', 'female', 'London, UK', 51.5074, -0.1278)
    `).run();

    // Attach photos with primary flags
    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
      VALUES
        ('ph_1', 'usr_bind_f1', 'https://example.com/f1_primary.jpg', 1, 1),
        ('ph_2', 'usr_bind_f1', 'https://example.com/f1_secondary.jpg', 0, 2),
        ('ph_3', 'usr_bind_f2', 'https://example.com/f2_primary.jpg', 1, 1)
    `).run();
  });

  it('1. Discover Feed strictly isolates candidates by opposite gender and includes primary photos', async () => {
    const res = await app.request('/api/profiles/discover?userId=usr_bind_m1', { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.profiles.length).toBeGreaterThanOrEqual(2);

    // Every profile returned must be female
    data.profiles.forEach((p: any) => {
      expect(p.gender).toBe('female');
      expect(p.photos).toBeDefined();
      expect(p.photos.length).toBeGreaterThan(0);
    });

    const f1 = data.profiles.find((p: any) => p.id === 'usr_bind_f1');
    expect(f1).toBeDefined();
    // Primary photo should be first
    expect(f1.photos[0]).toBe('https://example.com/f1_primary.jpg');
  });

  it('2. Chat messages preserve strict chronological ASC ordering and participant association', async () => {
    const convId = 'conv_usr_bind_f1_usr_bind_m1';

    // Insert conversation
    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path)
      VALUES (?, 'usr_bind_m1', 'usr_bind_f1', 'logs/test.jsonl')
    `).bind(convId).run();

    // Send 3 sequential messages
    await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: 'usr_bind_m1', senderName: 'Male Seeker', text: 'Message 1' })
    }, env);

    await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: 'usr_bind_f1', senderName: 'Female Seeker', text: 'Message 2' })
    }, env);

    await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: 'usr_bind_m1', senderName: 'Male Seeker', text: 'Message 3' })
    }, env);

    // Fetch messages
    const res = await app.request(`/api/conversations/${convId}/messages`, { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.messages).toHaveLength(3);

    expect(data.messages[0].text).toBe('Message 1');
    expect(data.messages[1].text).toBe('Message 2');
    expect(data.messages[2].text).toBe('Message 3');
  });

  it('3. Wallet & Ad Reward accurately credits daily likes quota in D1', async () => {
    const res = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_bind_m1' })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.likesAdded).toBe(10);
    expect(data.newDailyQuota).toBeGreaterThanOrEqual(10);
  });
});
