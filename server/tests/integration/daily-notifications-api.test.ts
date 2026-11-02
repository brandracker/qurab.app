import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Daily Notification & Telemetry Metrics API Tests', () => {
  let env: any;
  let adminToken = '';
  const testUserId = 'usr_daily_tester_01';

  beforeEach(async () => {
    env = createTestEnv();

    // 1. Authenticate as Admin
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

    // 2. Insert test active user in database
    await env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, city, account_status, is_profile_completed, is_banned)
      VALUES (?, '+923001234567', 'Zaid Khan', 'zaid@example.com', '1996-01-01', 'male', 'Lahore, Pakistan', 'Lahore', 'active', 1, 0)
    `).bind(testUserId).run();
  });

  it('1. POST /api/admin/notifications/daily/trigger dispatches daily push campaign and logs to database', async () => {
    const res = await app.request('/api/admin/notifications/daily/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        category: 'smart_psych',
        targetType: 'all'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.campaignId).toBeDefined();
    expect(typeof data.sentCount).toBe('number');
    expect(data.sentCount).toBeGreaterThanOrEqual(1);
  });

  it('2. POST /api/notifications/track-click records click telemetry and increments campaign count', async () => {
    // First trigger a custom campaign
    const triggerRes = await app.request('/api/admin/notifications/daily/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        category: 'curiosity'
      })
    }, env);
    const triggerData = await triggerRes.json();
    const campaignId = triggerData.campaignId;

    // Simulate user clicking on notification
    const clickRes = await app.request('/api/notifications/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Qurb-Android-Native/1.0.37'
      },
      body: JSON.stringify({
        userId: testUserId,
        campaignId: campaignId,
        targetScreen: 'matches'
      })
    }, env);

    expect(clickRes.status).toBe(200);
    const clickData = await clickRes.json();
    expect(clickData.success).toBe(true);
    expect(clickData.clickId).toBeDefined();

    // Verify metrics reflect the click
    const metricsRes = await app.request('/api/admin/notifications/metrics', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-token': adminToken
      }
    }, env);

    expect(metricsRes.status).toBe(200);
    const metricsData = await metricsRes.json();
    expect(metricsData.success).toBe(true);
    expect(metricsData.metrics.summary.totalClicks).toBeGreaterThanOrEqual(1);

    // Verify recentClicks includes who clicked and when
    const foundClick = metricsData.metrics.recentClicks.find(
      (c: any) => c.userId === testUserId && c.campaignId === campaignId
    );
    expect(foundClick).toBeDefined();
    expect(foundClick.targetScreen).toBe('matches');
    expect(foundClick.clickedAt).toBeDefined();
  });

  it('3. GET /api/admin/notifications/metrics requires admin authorization (403 on missing token)', async () => {
    const unauthRes = await app.request('/api/admin/notifications/metrics', {}, env);
    expect(unauthRes.status).toBe(403);
  });
});
