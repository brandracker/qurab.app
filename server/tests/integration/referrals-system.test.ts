import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Referral System & 30-Friend VIP Reward Scheme API Integration Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();

    // Seed test users: Referrer (Ahmed) and Candidates
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
      VALUES 
        ('usr_referrer_ahmed', '+923001119999', 'Ahmed Khan', 'ahmed@example.com', '1995-01-01', 'male', 'Lahore', 1),
        ('usr_friend_1', '+923001110001', 'Usman Tariq', 'usman@example.com', '1996-01-01', 'male', 'Karachi', 0),
        ('usr_friend_2', '+923001110002', 'Bilal Farooq', 'bilal@temp-mail.org', '1994-01-01', 'male', 'Islamabad', 0),
        ('usr_friend_3', '+923001110003', 'Zainab Bibi', 'zainab@gmail.com', '1998-01-01', 'female', 'Lahore', 1)
    `).run();
  });

  it('1. GET /api/referrals/stats/:userId returns initial stats with 30 target invites', async () => {
    const res = await app.request('/api/referrals/stats/usr_referrer_ahmed', { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.targetCount).toBe(30);
    expect(data.completedCount).toBe(0);
    expect(data.pendingCount).toBe(0);
    expect(data.isVipRewarded).toBe(false);
    expect(data.referralCode).toBe('usr_referrer_ahmed');
    expect(data.shareLink).toContain('usr_referrer_ahmed');
    expect(Array.isArray(data.friends)).toBe(true);
  });

  it('2. POST /api/referrals/claim successfully links referee as pending', async () => {
    const payload = {
      refereeId: 'usr_friend_1',
      referralCode: 'usr_referrer_ahmed',
      deviceId: 'device_usman_phone_1'
    };

    const res = await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.status).toBe('pending');

    // Verify in stats
    const statsRes = await app.request('/api/referrals/stats/usr_referrer_ahmed', { method: 'GET' }, env);
    const statsData = await statsRes.json();
    expect(statsData.pendingCount).toBe(1);
    expect(statsData.friends.length).toBe(1);
    expect(statsData.friends[0].name).toBe('Usman T.');
  });

  it('3. Anti-Fraud: Prevents self-referral', async () => {
    const payload = {
      refereeId: 'usr_referrer_ahmed',
      referralCode: 'usr_referrer_ahmed',
      deviceId: 'device_ahmed_self'
    };

    const res = await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Apne aap ko refer');
  });

  it('4. Anti-Fraud: Rejects disposable temporary email domains', async () => {
    const payload = {
      refereeId: 'usr_friend_2', // email: bilal@temp-mail.org
      referralCode: 'usr_referrer_ahmed',
      deviceId: 'device_bilal_123'
    };

    const res = await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('disposable email');
  });

  it('5. Anti-Fraud: Flags duplicate accounts from the same physical device ID', async () => {
    const sharedDevice = 'hardware_mac_clone_999';

    // 1st referral on device -> pending
    await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refereeId: 'usr_friend_1',
        referralCode: 'usr_referrer_ahmed',
        deviceId: sharedDevice
      })
    }, env);

    // 2nd referral on exact same device under same referrer -> disqualified
    const res2 = await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refereeId: 'usr_friend_3',
        referralCode: 'usr_referrer_ahmed',
        deviceId: sharedDevice
      })
    }, env);

    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.status).toBe('disqualified');
  });

  it('6. POST /api/referrals/evaluate/:refereeId promotes to completed once photo is added', async () => {
    // 1. Claim referral for friend 3
    await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refereeId: 'usr_friend_3',
        referralCode: 'usr_referrer_ahmed',
        deviceId: 'device_zainab_real'
      })
    }, env);

    // 2. Add photo for friend 3
    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary)
      VALUES ('ph_zainab_1', 'usr_friend_3', 'https://example.com/zainab.jpg', 1)
    `).run();

    // 3. Evaluate completion
    const evalRes = await app.request('/api/referrals/evaluate/usr_friend_3', { method: 'POST' }, env);
    expect(evalRes.status).toBe(200);
    const evalData = await evalRes.json();
    expect(evalData.status).toBe('completed');

    // 4. Check stats: now completedCount = 1
    const statsRes = await app.request('/api/referrals/stats/usr_referrer_ahmed', { method: 'GET' }, env);
    const statsData = await statsRes.json();
    expect(statsData.completedCount).toBe(1);
  });

  it('7. Automatically unlocks 1-Month Barakah VIP when 30 invites milestone is hit', async () => {
    // Insert 29 completed referrals directly
    for (let i = 1; i <= 29; i++) {
      const uId = `usr_bulk_${i}`;
      await env.DB.prepare(`
        INSERT INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
        VALUES (?, ?, 'Friend', 'bulk@gmail.com', '1995-01-01', 'male', 'Lahore', 1)
      `).bind(uId, `+9230088800${i < 10 ? '0' + i : i}`).run();

      await env.DB.prepare(`
        INSERT INTO referrals (id, referrer_id, referee_id, status, completed_at)
        VALUES (?, 'usr_referrer_ahmed', ?, 'completed', CURRENT_TIMESTAMP)
      `).bind(`ref_bulk_${i}`, uId).run();
    }

    // Now claim and complete the 30th referral
    await env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary)
      VALUES ('ph_friend_1_photo', 'usr_friend_1', 'https://example.com/photo.jpg', 1)
    `).run();
    await env.DB.prepare(`UPDATE users SET is_profile_completed = 1 WHERE id = 'usr_friend_1'`).run();

    await app.request('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refereeId: 'usr_friend_1',
        referralCode: 'usr_referrer_ahmed',
        deviceId: 'device_friend_30'
      })
    }, env);

    // Evaluate 30th
    const evalRes = await app.request('/api/referrals/evaluate/usr_friend_1', { method: 'POST' }, env);
    expect(evalRes.status).toBe(200);
    const evalData = await evalRes.json();
    expect(evalData.rewarded).toBe(true);

    // Verify referrer account is now VIP!
    const userRow: any = await env.DB.prepare('SELECT is_vip FROM users WHERE id = ?').bind('usr_referrer_ahmed').first();
    expect(Boolean(userRow.is_vip)).toBe(true);

    const walletRow: any = await env.DB.prepare('SELECT subscription_tier, direct_salams_balance FROM user_wallets WHERE user_id = ?').bind('usr_referrer_ahmed').first();
    expect(walletRow.subscription_tier).toBe('barakah_vip');
    expect(walletRow.direct_salams_balance).toBe(22); // default 2 + 20 free VIP passes

    // Verify in stats API
    const statsRes = await app.request('/api/referrals/stats/usr_referrer_ahmed', { method: 'GET' }, env);
    const statsData = await statsRes.json();
    expect(statsData.isVipRewarded).toBe(true);
    expect(statsData.completedCount).toBe(30);
  });

  it('8. Admin endpoints: View overview metrics and update dynamic target count', async () => {
    // 1. Get overview
    const overRes = await app.request('/api/referrals/admin/overview', { method: 'GET' }, env);
    expect(overRes.status).toBe(200);
    const overData = await overRes.json();
    expect(overData.success).toBe(true);
    expect(overData.metrics).toBeDefined();

    // 2. Update target from 30 to 20
    const setRes = await app.request('/api/referrals/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetInvites: 20 })
    }, env);
    expect(setRes.status).toBe(200);
    const setData = await setRes.json();
    expect(setData.targetInvites).toBe(20);

    // 3. User stats now reflects 20 target
    const statsRes = await app.request('/api/referrals/stats/usr_referrer_ahmed', { method: 'GET' }, env);
    const statsData = await statsRes.json();
    expect(statsData.targetCount).toBe(20);
  });
});
