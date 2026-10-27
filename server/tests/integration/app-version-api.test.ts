import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { MockD1Database } from '../helpers/test-db';

describe('App Version Policy & Force Update API Integration', () => {
  let mockDb: MockD1Database;
  let env: any;
  const adminToken = 'adm_tok_adm_root.fake_signature';

  beforeEach(async () => {
    mockDb = new MockD1Database();
    env = {
      DB: mockDb,
      ENVIRONMENT: 'test',
      JWT_SECRET: 'test_jwt_secret'
    };

    // Seed root admin for admin token auth
    await mockDb.getRawDb().prepare(`
      INSERT OR REPLACE INTO admins (id, username, password_hash, name, role)
      VALUES ('adm_root', 'admin', 'fakehash', 'Qurb Super Admin', 'superadmin')
    `).run();
  });

  it('1. GET /api/version/check returns default version policy with forceUpdateRequired=false', async () => {
    const res = await app.request('/api/version/check?versionCode=37', { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.forceUpdateEnabled).toBe(false);
    expect(data.forceUpdateRequired).toBe(false);
    expect(data.minSupportedVersionCode).toBe(37);
    expect(data.latestVersionCode).toBe(38);
    expect(data.latestVersionName).toBe('1.0.37');
    expect(data.playStoreUrl).toContain('play.google.com');
  });

  it('2. Admin can view current app-version policy via GET /api/admin/app-version', async () => {
    const res = await app.request('/api/admin/app-version', {
      method: 'GET',
      headers: {
        'x-admin-token': adminToken
      }
    }, env);

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.forceUpdateEnabled).toBe(false);
    expect(data.minSupportedVersionCode).toBe(37);
  });

  it('3. Admin can update version policy to trigger Hard Force-Update lock', async () => {
    // Admin sets minimum version 38 and enables force update
    const updateRes = await app.request('/api/admin/app-version', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        minSupportedVersionCode: 38,
        latestVersionCode: 38,
        latestVersionName: '1.0.37',
        forceUpdateEnabled: true,
        updateTitle: 'Mandatory Update',
        updateMessage: 'Please update your Qurb app immediately to access critical calling fixes.'
      })
    }, env);

    expect(updateRes.status).toBe(200);
    const updateData: any = await updateRes.json();
    expect(updateData.success).toBe(true);
    expect(updateData.forceUpdateEnabled).toBe(true);
    expect(updateData.minSupportedVersionCode).toBe(38);

    // Old client with versionCode 37 checks version -> MUST be hard-locked!
    const clientCheckOld = await app.request('/api/version/check?versionCode=37', { method: 'GET' }, env);
    const clientOldData: any = await clientCheckOld.json();
    expect(clientOldData.forceUpdateRequired).toBe(true);
    expect(clientOldData.title).toBe('Mandatory Update');
    expect(clientOldData.message).toContain('Please update your Qurb app immediately');

    // New client with versionCode 38 checks version -> NOT locked!
    const clientCheckNew = await app.request('/api/version/check?versionCode=38', { method: 'GET' }, env);
    const clientNewData: any = await clientCheckNew.json();
    expect(clientNewData.forceUpdateRequired).toBe(false);
    expect(clientNewData.softUpdateAvailable).toBe(false);
  });

  it('4. Turning off forceUpdateEnabled releases the hard lock', async () => {
    // Admin disables force update
    await app.request('/api/admin/app-version', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        minSupportedVersionCode: 38,
        latestVersionCode: 38,
        latestVersionName: '1.0.37',
        forceUpdateEnabled: false
      })
    }, env);

    // Old client checks version again -> forceUpdateRequired is false!
    const clientCheck = await app.request('/api/version/check?versionCode=37', { method: 'GET' }, env);
    const clientData: any = await clientCheck.json();
    expect(clientData.forceUpdateRequired).toBe(false);
    expect(clientData.softUpdateAvailable).toBe(true);
  });
});
