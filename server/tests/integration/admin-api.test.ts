import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Admin Portal API & Security Integration Tests', () => {
  let env: any;
  let adminToken: string;

  beforeEach(async () => {
    env = createTestEnv();

    // Perform admin login to acquire valid admin token
    const loginRes = await app.request('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'QurbAdmin2026!Secure'
      })
    }, env);

    const loginData = await loginRes.json();
    adminToken = loginData.token;
  });

  it('1. Admin login with correct credentials returns 200 and adm_tok session', async () => {
    const res = await app.request('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'QurbAdmin2026!Secure'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toMatch(/^adm_tok_/);
    expect(data.admin.username).toBe('admin');
    expect(data.admin.role).toBe('superadmin');
  });

  it('2. Admin login with wrong password returns 401 Unauthorized', async () => {
    const res = await app.request('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'WrongPassword123'
      })
    }, env);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid admin credentials');
  });

  it('3. Protected endpoint rejects requests missing Authorization header with 403', async () => {
    const res = await app.request('/api/admin/dashboard/stats', {
      method: 'GET'
    }, env);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Forbidden');
  });

  it('4. Protected endpoint rejects regular user token with 403 Forbidden', async () => {
    const regularUserToken = 'st_usr_test123_abc_1700000000';
    const res = await app.request('/api/admin/dashboard/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${regularUserToken}`
      }
    }, env);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Forbidden');
  });

  it('5. GET /api/admin/dashboard/stats returns correct system aggregates and gender ratio', async () => {
    // Seed sample users
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, is_vip, account_status)
      VALUES 
        ('usr_m1', '+11111111', 'male1@test.com', 'Brother Tariq', '1995-01-01', 'male', 'London', 1, 'active'),
        ('usr_f1', '+22222222', 'female1@test.com', 'Sister Amina', '1997-01-01', 'female', 'London', 0, 'active'),
        ('usr_f2', '+33333333', 'female2@test.com', 'Sister Fatima', '1998-01-01', 'female', 'Manchester', 0, 'banned');
    `).run();

    const res = await app.request('/api/admin/dashboard/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.stats.totalUsers).toBeGreaterThanOrEqual(3);
    expect(data.stats.maleUsers).toBeGreaterThanOrEqual(1);
    expect(data.stats.femaleUsers).toBeGreaterThanOrEqual(2);
    expect(data.stats.maleRatio).toBeDefined();
    expect(data.stats.femaleRatio).toBeDefined();
    expect(data.stats.growth).toBeDefined();
  });

  it('6. GET /api/admin/users supports pagination and search', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, city, profession)
      VALUES 
        ('usr_s1', '+4401', 'zayd.engineer@test.com', 'Zayd Developer', '1994-01-01', 'male', 'London', 'London', 'Software Engineer'),
        ('usr_s2', '+4402', 'khadija.doctor@test.com', 'Khadija Rahman', '1996-01-01', 'female', 'Birmingham', 'Birmingham', 'Medical Doctor');
    `).run();

    // Search by name
    const searchRes = await app.request('/api/admin/users?search=Zayd', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);

    const searchData = await searchRes.json();
    expect(searchData.success).toBe(true);
    expect(searchData.users.some((u: any) => u.full_name.includes('Zayd'))).toBe(true);

    // Test server-side pagination
    const pageRes = await app.request('/api/admin/users?page=1&limit=1', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);

    const pageData = await pageRes.json();
    expect(pageData.success).toBe(true);
    expect(pageData.limit).toBe(10); // Clamped minimum
    expect(pageData.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('7. GET /api/admin/cities returns distinct cities list with counts', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, city)
      VALUES 
        ('usr_c1', '+1001', 'c1@test.com', 'User 1', '1990-01-01', 'male', 'London', 'London'),
        ('usr_c2', '+1002', 'c2@test.com', 'User 2', '1991-01-01', 'female', 'London', 'London'),
        ('usr_c3', '+1003', 'c3@test.com', 'User 3', '1992-01-01', 'male', 'Dubai', 'Dubai');
    `).run();

    const res = await app.request('/api/admin/cities', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.cities.some((c: any) => c.city === 'London' && c.count >= 2)).toBe(true);
    expect(data.cities.some((c: any) => c.city === 'Dubai')).toBe(true);
  });

  it('8. POST /api/admin/users/:id/status updates user ban status', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, account_status)
      VALUES ('usr_ban_test', '+99999999', 'spammer@test.com', 'Spam Account', '1990-01-01', 'male', 'Global', 'active');
    `).run();

    // Ban user
    const banRes = await app.request('/api/admin/users/usr_ban_test/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'banned', isBanned: true })
    }, env);

    expect(banRes.status).toBe(200);
    const banData = await banRes.json();
    expect(banData.success).toBe(true);
    expect(banData.status).toBe('banned');

    // Verify in database
    const dbUser = await env.DB.prepare('SELECT account_status, is_banned FROM users WHERE id = ?').bind('usr_ban_test').first();
    expect(dbUser.account_status).toBe('banned');
    expect(dbUser.is_banned).toBe(1);
  });

  it('9. POST /api/admin/photos/:id/primary sets a photo as primary cover', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES ('usr_arr_1', '+3311', 'gallery@test.com', 'Gallery User', '1995-01-01', 'male', 'London');
    `).run();

    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
      VALUES 
        ('ph_user_1', 'usr_arr_1', 'https://img1.com', 1, 1),
        ('ph_user_2', 'usr_arr_1', 'https://img2.com', 0, 2);
    `).run();

    // Set ph_user_2 as primary
    const res = await app.request('/api/admin/photos/ph_user_2/primary', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const ph1 = await env.DB.prepare('SELECT is_primary FROM user_photos WHERE id = ?').bind('ph_user_1').first();
    const ph2 = await env.DB.prepare('SELECT is_primary FROM user_photos WHERE id = ?').bind('ph_user_2').first();
    expect(ph1.is_primary).toBe(0);
    expect(ph2.is_primary).toBe(1);
  });

  it('10. DELETE /api/admin/photos/:id removes inappropriate photo', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES ('usr_photo_test', '+77777777', 'photouser@test.com', 'Photo User', '1995-01-01', 'male', 'London');
    `).run();

    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary)
      VALUES ('ph_inappropriate_1', 'usr_photo_test', 'https://bad-image.com/pic.jpg', 0);
    `).run();

    const delRes = await app.request('/api/admin/photos/ph_inappropriate_1', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }, env);

    expect(delRes.status).toBe(200);
    const delData = await delRes.json();
    expect(delData.success).toBe(true);

    const check = await env.DB.prepare('SELECT * FROM user_photos WHERE id = ?').bind('ph_inappropriate_1').first();
    expect(check).toBeNull();
  });

  it('11. POST /api/admin/broadcast sends notifications to all members', async () => {
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES 
        ('usr_bc_1', '+5001', 'bc1@test.com', 'Member 1', '1990-01-01', 'male', 'London'),
        ('usr_bc_2', '+5002', 'bc2@test.com', 'Member 2', '1991-01-01', 'female', 'London');
    `).run();

    const res = await app.request('/api/admin/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Platform Maintenance Alert',
        message: 'Qurb will undergo a 10-minute update tonight.'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.deliveredCount).toBeGreaterThanOrEqual(2);

    const notifs = await env.DB.prepare("SELECT * FROM notifications WHERE type = 'system_broadcast'").all();
    expect(notifs?.results?.length).toBeGreaterThanOrEqual(2);
  });
});
