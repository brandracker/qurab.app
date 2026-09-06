import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('1-to-1 Modesty Photo Reveal API Integration (Cloudflare D1 Single Source of Truth)', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // 1. Seed two active users (User A - Brother, User B - Sister)
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, blur_photos_by_default, is_profile_completed)
      VALUES 
        ('usr_brother_1', '+447000111222', 'brother@test.com', 'Tariq Mahmood', '1994-05-12', 'male', 'London, UK', 1, 1),
        ('usr_sister_1', '+447000333444', 'sister@test.com', 'Aisha Farooq', '1997-08-20', 'female', 'London, UK', 1, 1)
    `).run();

    // 2. Seed photos for Sister
    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
      VALUES ('ph_sister_1', 'usr_sister_1', 'https://example.com/aisha.jpg', 1, 1)
    `).run();

    // 3. Seed active conversation between them
    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
      VALUES ('conv_usr_brother_1_usr_sister_1', 'usr_brother_1', 'usr_sister_1', 'logs/conv.jsonl', 'Assalamu Alaikum', CURRENT_TIMESTAMP)
    `).run();
  });

  it('1. GET /api/conversations initially reflects blurred status (isPhotoRevealed = false) for both users', async () => {
    // Brother checks conversation with Sister
    const resB = await app.request('/api/conversations?userId=usr_brother_1', { method: 'GET' }, env);
    expect(resB.status).toBe(200);
    const dataB = await resB.json();
    expect(dataB.success).toBe(true);
    expect(dataB.conversations.length).toBe(1);
    expect(dataB.conversations[0].otherUser.isPhotoRevealed).toBe(false);
    expect(dataB.conversations[0].hasRevealedToPartner).toBe(false);

    // Sister checks conversation with Brother
    const resS = await app.request('/api/conversations?userId=usr_sister_1', { method: 'GET' }, env);
    expect(resS.status).toBe(200);
    const dataS = await resS.json();
    expect(dataS.success).toBe(true);
    expect(dataS.conversations[0].otherUser.isPhotoRevealed).toBe(false);
    expect(dataS.conversations[0].hasRevealedToPartner).toBe(false);
  });

  it('2. POST /api/conversations/:id/photo-reveal records reveal in D1 and dispatches system notification message', async () => {
    const payload = {
      ownerId: 'usr_sister_1',
      viewerId: 'usr_brother_1',
      isRevealed: true
    };

    const res = await app.request('/api/conversations/conv_usr_brother_1_usr_sister_1/photo-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isRevealed).toBe(true);
    expect(data.statusMsg).toContain('Aisha revealed their unblurred photos');

    // Verify D1 table record exists
    const revealRow: any = await env.DB.prepare(`
      SELECT owner_id, viewer_id FROM photo_reveals 
      WHERE owner_id = 'usr_sister_1' AND viewer_id = 'usr_brother_1'
    `).first();
    expect(revealRow).toBeDefined();
    expect(revealRow.owner_id).toBe('usr_sister_1');
    expect(revealRow.viewer_id).toBe('usr_brother_1');

    // Verify system chat message was inserted into chat_messages in D1
    const messagesRes = await app.request('/api/conversations/conv_usr_brother_1_usr_sister_1/messages', { method: 'GET' }, env);
    const messagesData = await messagesRes.json();
    expect(messagesData.success).toBe(true);
    const systemMessage = messagesData.messages.find((m: any) => m.senderId === 'system');
    expect(systemMessage).toBeDefined();
    expect(systemMessage.text).toContain('Aisha revealed their unblurred photos');
  });

  it('3. After Sister reveals photos, Brother GET /api/conversations returns isPhotoRevealed = true', async () => {
    // 1. Sister reveals photos to Brother
    await app.request('/api/conversations/conv_usr_brother_1_usr_sister_1/photo-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'usr_sister_1',
        viewerId: 'usr_brother_1',
        isRevealed: true
      })
    }, env);

    // 2. Brother fetches conversations
    const resB = await app.request('/api/conversations?userId=usr_brother_1', { method: 'GET' }, env);
    const dataB = await resB.json();
    expect(dataB.conversations[0].otherUser.id).toBe('usr_sister_1');
    expect(dataB.conversations[0].otherUser.isPhotoRevealed).toBe(true);
    // Brother has NOT revealed his photos to Sister yet
    expect(dataB.conversations[0].hasRevealedToPartner).toBe(false);

    // 3. Sister fetches conversations
    const resS = await app.request('/api/conversations?userId=usr_sister_1', { method: 'GET' }, env);
    const dataS = await resS.json();
    // Sister has revealed to Brother
    expect(dataS.conversations[0].hasRevealedToPartner).toBe(true);
    // Brother has NOT revealed to Sister
    expect(dataS.conversations[0].otherUser.isPhotoRevealed).toBe(false);
  });

  it('4. POST /api/conversations/:id/photo-reveal with isRevealed = false revokes access and restores blur', async () => {
    // 1. First reveal
    await app.request('/api/conversations/conv_usr_brother_1_usr_sister_1/photo-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'usr_sister_1',
        viewerId: 'usr_brother_1',
        isRevealed: true
      })
    }, env);

    // 2. Then un-reveal (restore blur)
    const revokeRes = await app.request('/api/conversations/conv_usr_brother_1_usr_sister_1/photo-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'usr_sister_1',
        viewerId: 'usr_brother_1',
        isRevealed: false
      })
    }, env);

    expect(revokeRes.status).toBe(200);
    const revokeData = await revokeRes.json();
    expect(revokeData.isRevealed).toBe(false);
    expect(revokeData.statusMsg).toContain('restored photo blur');

    // 3. Verify record was removed from D1
    const revealRow: any = await env.DB.prepare(`
      SELECT * FROM photo_reveals 
      WHERE owner_id = 'usr_sister_1' AND viewer_id = 'usr_brother_1'
    `).first();
    expect(revealRow).toBeNull();

    // 4. Verify Brother now sees isPhotoRevealed = false
    const resB = await app.request('/api/conversations?userId=usr_brother_1', { method: 'GET' }, env);
    const dataB = await resB.json();
    expect(dataB.conversations[0].otherUser.isPhotoRevealed).toBe(false);
  });
});
