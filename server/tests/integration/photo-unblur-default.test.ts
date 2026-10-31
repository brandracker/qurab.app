import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('TASK-J1: Default Unblurred Photos on New Profile Creation', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  it('1. New email/password signup creates user with blur_photos_by_default = 0 (Unblurred)', async () => {
    const res = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'clearphoto_user@example.com',
        password: 'Password123!',
        fullName: 'Amina Tariq',
        gender: 'female'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const rawDb = env.DB.getRawDb();
    const userRow = rawDb.prepare('SELECT blur_photos_by_default FROM users WHERE email = ?').get('clearphoto_user@example.com');
    expect(userRow.blur_photos_by_default).toBe(0);
  });

  it('2. New Google OAuth signup creates user with blur_photos_by_default = 0 (Unblurred)', async () => {
    const res = await app.request('/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'google_seeker@gmail.com',
        fullName: 'Hamza Khan',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169',
        gender: 'male'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const rawDb = env.DB.getRawDb();
    const userRow = rawDb.prepare('SELECT blur_photos_by_default FROM users WHERE email = ?').get('google_seeker@gmail.com');
    expect(userRow.blur_photos_by_default).toBe(0);
  });

  it('3. Matches query falls back to blurPhotosByDefault = 0 for un-configured profiles', async () => {
    const rawDb = env.DB.getRawDb();
    rawDb.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, blur_photos_by_default)
      VALUES ('usr_my_id', '+923000000000', 'me@example.com', 'Current User', '1995-01-01', 'male', 'Karachi', 0)
    `).run();

    rawDb.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, blur_photos_by_default)
      VALUES ('usr_candidate_1', '+923001234567', 'candidate1@example.com', 'Sara Ahmed', '1999-01-01', 'female', 'Lahore', NULL)
    `).run();

    rawDb.prepare(`
      INSERT INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES ('match_1', 'usr_candidate_1', 'usr_my_id', 'liked')
    `).run();

    const res = await app.request('/api/matches/received?userId=usr_my_id', { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.candidates.length).toBe(1);
    expect(data.candidates[0].blurPhotosByDefault).toBe(false);
  });
});
