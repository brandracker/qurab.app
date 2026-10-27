import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { MockD1Database } from '../helpers/test-db';

describe('Qurb Official Channel (Broadcast & Announcement) Integration', () => {
  let mockDb: MockD1Database;
  let env: any;
  const adminToken = 'adm_tok_adm_root.fake_signature';
  const testUserId = 'usr_seeker_test_99';

  beforeEach(async () => {
    mockDb = new MockD1Database();
    env = {
      DB: mockDb,
      ENVIRONMENT: 'test',
      JWT_SECRET: 'test_jwt_secret'
    };

    // Seed test user
    await mockDb.getRawDb().prepare(`
      INSERT OR REPLACE INTO users (id, phone, full_name, dob, gender, location, profession, education, bio)
      VALUES (?, '+923001234567', 'Brother Zain', '1996-01-01', 'male', 'Lahore', 'Engineer', 'BS', 'Deen first')
    `).run(testUserId);

    // Seed root admin
    await mockDb.getRawDb().prepare(`
      INSERT OR REPLACE INTO admins (id, username, password_hash, name, role)
      VALUES ('adm_root', 'admin', 'fakehash', 'Qurb Super Admin', 'superadmin')
    `).run();
  });

  it('1. GET /api/conversations injects Qurb Official Channel at top of conversations list', async () => {
    const res = await app.request(`/api/conversations?userId=${testUserId}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.conversations)).toBe(true);
    expect(data.conversations.length).toBeGreaterThanOrEqual(1);

    const officialConv = data.conversations[0];
    expect(officialConv.id).toBe(`conv_qurb_official_${testUserId}`);
    expect(officialConv.isOfficial).toBe(true);
    expect(officialConv.otherUser.id).toBe('usr_qurb_official');
    expect(officialConv.otherUser.fullName).toBe('Qurb Team ✓');
    expect(officialConv.otherUser.isVerified).toBe(true);
    expect(officialConv.otherUser.photos.length).toBeGreaterThan(0);
    expect(officialConv.messages.length).toBeGreaterThanOrEqual(2);
    expect(officialConv.messages.some((m: any) => m.text.includes('play.google.com'))).toBe(true);
  });

  it('2. GET /api/conversations/:id/messages returns official broadcast messages', async () => {
    const res = await app.request(`/api/conversations/conv_qurb_official_${testUserId}/messages`, { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.messages)).toBe(true);
    expect(data.messages.length).toBeGreaterThanOrEqual(2);

    const firstMsg = data.messages[0];
    expect(firstMsg.senderId).toBe('usr_qurb_official');
    expect(firstMsg.senderName).toBe('Qurb Team ✓');
    expect(firstMsg.text).toContain('Welcome to the official Qurb Channel');

    const updateMsg = data.messages.find((m: any) => m.text.includes('v1.0.37'));
    expect(updateMsg).toBeDefined();
    expect(updateMsg.text).toContain('play.google.com');
  });

  it('3. POST /api/conversations/:id/messages returns friendly auto-reply if user replies to official channel', async () => {
    const res = await app.request(`/api/conversations/conv_qurb_official_${testUserId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: testUserId,
        senderName: 'Brother Zain',
        text: 'Assalamu Alaikum! How do I verify my CNIC?'
      })
    }, env);

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBeDefined();
    expect(data.message.senderId).toBe('usr_qurb_official');
    expect(data.message.text).toContain('automated broadcast channel');
  });

  it('4. POST /api/admin/broadcast automatically appends announcement to official channel', async () => {
    const bcRes = await app.request('/api/admin/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        title: 'Ramadan Mubarak Announcement',
        message: 'May this blessed Ramadan bring tranquility and righteousness to you and your family! 🌙'
      })
    }, env);

    const bcData: any = await bcRes.json();
    expect(bcRes.status).toBe(200);

    // Verify it appears in the official messages endpoint
    const msgRes = await app.request(`/api/conversations/conv_qurb_official_${testUserId}/messages`, { method: 'GET' }, env);
    const msgData: any = await msgRes.json();
    expect(msgData.messages.some((m: any) => m.text.includes('Ramadan Mubarak'))).toBe(true);
  });
});
