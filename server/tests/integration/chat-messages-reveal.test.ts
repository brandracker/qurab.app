import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Chat Messages Endpoint with Real-Time Reveal Payload Integration', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, is_profile_completed)
      VALUES 
        ('usr_male_1', '+447999111222', 'male1@test.com', 'Hamza Khan', '1995-02-14', 'male', 'London, UK', 1),
        ('usr_fem_1', '+447999333444', 'fem1@test.com', 'Zara Ahmed', '1998-07-21', 'female', 'London, UK', 1)
    `).run();

    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
      VALUES ('conv_usr_male_1_usr_fem_1', 'usr_male_1', 'usr_fem_1', 'logs/conv.jsonl', 'Assalamu Alaikum', CURRENT_TIMESTAMP)
    `).run();

    await env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text, created_at)
      VALUES 
        ('msg_1', 'conv_usr_male_1_usr_fem_1', 'usr_male_1', 'Hamza', 'Assalamu Alaikum sister', '2026-09-06 10:00:00')
    `).run();
  });

  it('1. GET /api/conversations/:id/messages returns messages with isPhotoRevealed=false and hasRevealedToPartner=false by default', async () => {
    const res = await app.request('/api/conversations/conv_usr_male_1_usr_fem_1/messages?userId=usr_male_1', { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.messages.length).toBe(1);
    expect(data.isPhotoRevealed).toBe(false);
    expect(data.hasRevealedToPartner).toBe(false);
  });

  it('2. When partner reveals photo via photo-reveal endpoint, subsequent GET messages returns isPhotoRevealed=true in real-time', async () => {
    // Zara (fem_1) reveals to Hamza (male_1)
    const revealRes = await app.request('/api/conversations/conv_usr_male_1_usr_fem_1/photo-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'usr_fem_1',
        viewerId: 'usr_male_1',
        isRevealed: true
      })
    }, env);
    expect(revealRes.status).toBe(200);

    // Hamza polls messages: should see isPhotoRevealed = true and the announcement message
    const pollRes = await app.request('/api/conversations/conv_usr_male_1_usr_fem_1/messages?userId=usr_male_1', { method: 'GET' }, env);
    expect(pollRes.status).toBe(200);
    const pollData = await pollRes.json();
    expect(pollData.success).toBe(true);
    expect(pollData.isPhotoRevealed).toBe(true);
    expect(pollData.hasRevealedToPartner).toBe(false);
    expect(pollData.messages.some((m: any) => m.text.includes('revealed their unblurred photos'))).toBe(true);

    // Zara polls messages: should see hasRevealedToPartner = true and isPhotoRevealed = false (Hamza has not revealed)
    const zaraPoll = await app.request('/api/conversations/conv_usr_male_1_usr_fem_1/messages?userId=usr_fem_1', { method: 'GET' }, env);
    const zaraData = await zaraPoll.json();
    expect(zaraData.hasRevealedToPartner).toBe(true);
    expect(zaraData.isPhotoRevealed).toBe(false);
  });
});
