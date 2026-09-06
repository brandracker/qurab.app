import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { MockD1Database } from '../helpers/test-db';
import { usersRouter, profilesRouter } from '../../src/routes/users';
import { photosRouter } from '../../src/routes/photos';
import type { AppContext } from '../../src/types';

describe('Account Lifecycle & Voice Greetings API', () => {
  let app: Hono<AppContext>;
  let mockDb: MockD1Database;

  beforeEach(() => {
    mockDb = new MockD1Database();
    app = new Hono<AppContext>();

    app.use('*', async (c, next) => {
      c.env = {
        DB: mockDb as any,
        MEDIA_BUCKET: {} as any,
        ENVIRONMENT: 'test'
      };
      await next();
    });

    app.route('/api/users', usersRouter);
    app.route('/api/profiles', profilesRouter);
    app.route('/api/photos', photosRouter);
  });

  it('1. Boys and girls with voice greetings are prioritized and returned in Discover', async () => {
    // Insert a male profile with voice greeting
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_male_voice_1',
        fullName: 'Hamza Farooqi',
        gender: 'male',
        dob: '1996-05-12',
        location: 'London, UK',
        city: 'London',
        country: 'UK',
        profession: 'Cloud Architect',
        education: 'BSc Software Engineering',
        voiceGreetingUrl: 'https://example.com/voice_hamza.webm',
        voiceGreetingDuration: 45,
        blurPhotosByDefault: false,
        photos: ['https://example.com/hamza.jpg']
      })
    });

    // Insert a male profile WITHOUT voice greeting
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_male_novoice_2',
        fullName: 'Tariq Javed',
        gender: 'male',
        dob: '1995-03-20',
        location: 'Manchester, UK',
        city: 'Manchester',
        country: 'UK',
        profession: 'Civil Engineer',
        education: 'BEng Civil Engineering',
        blurPhotosByDefault: false,
        photos: ['https://example.com/tariq.jpg']
      })
    });

    // Discover query looking for male candidates (from a female viewer perspective)
    const res = await app.request('/api/profiles/discover?userId=usr_female_viewer&targetGender=male');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.profiles.length).toBeGreaterThanOrEqual(2);

    // Profile with voice greeting should have valid voice fields and appear before no-voice
    const withVoice = data.profiles.find((p: any) => p.id === 'usr_male_voice_1');
    expect(withVoice).toBeDefined();
    expect(withVoice.voiceGreetingUrl).toBe('https://example.com/voice_hamza.webm');
    expect(withVoice.voiceGreetingDuration).toBe(45);

    // The first candidate in the feed should have voice greeting prioritized
    expect(data.profiles[0].voiceGreetingUrl).toBeTruthy();
  });

  it('2. Deactivating an account hides the profile from Discover feed', async () => {
    // Create candidate
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_deactivate_test_1',
        fullName: 'Omar Qasim',
        gender: 'male',
        dob: '1994-08-10',
        location: 'Birmingham, UK',
        profession: 'Physician',
        photos: ['https://example.com/omar.jpg']
      })
    });

    // Verify candidate is initially visible in Discover
    const initialRes = await app.request('/api/profiles/discover?userId=usr_other&targetGender=male');
    const initialData = await initialRes.json();
    expect(initialData.profiles.some((p: any) => p.id === 'usr_deactivate_test_1')).toBe(true);

    // Deactivate account
    const deactivateRes = await app.request('/api/users/usr_deactivate_test_1/deactivate', {
      method: 'POST'
    });
    expect(deactivateRes.status).toBe(200);
    const deactData = await deactivateRes.json();
    expect(deactData.success).toBe(true);
    expect(deactData.accountStatus).toBe('deactivated');
    expect(deactData.profileVisibility).toBe('hidden');

    // Verify GET /api/users/:id reflects accountStatus = 'deactivated'
    const profileRes = await app.request('/api/users/usr_deactivate_test_1');
    const profileData = await profileRes.json();
    expect(profileData.profile.accountStatus).toBe('deactivated');
    expect(profileData.profile.profileVisibility).toBe('hidden');

    // Verify candidate is now HIDDEN from Discover feed
    const hiddenRes = await app.request('/api/profiles/discover?userId=usr_other&targetGender=male');
    const hiddenData = await hiddenRes.json();
    expect(hiddenData.profiles.some((p: any) => p.id === 'usr_deactivate_test_1')).toBe(false);
  });

  it('3. Reactivating a paused account restores visibility on Discover', async () => {
    // Create candidate
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_reactivate_test_1',
        fullName: 'Zubair Tahir',
        gender: 'male',
        dob: '1993-11-05',
        location: 'Leeds, UK',
        profession: 'Pharmacist',
        photos: ['https://example.com/zubair.jpg']
      })
    });

    // Deactivate first
    await app.request('/api/users/usr_reactivate_test_1/deactivate', { method: 'POST' });

    // Reactivate the account
    const reactivateRes = await app.request('/api/users/usr_reactivate_test_1/reactivate', {
      method: 'POST'
    });
    expect(reactivateRes.status).toBe(200);
    const reactData = await reactivateRes.json();
    expect(reactData.success).toBe(true);
    expect(reactData.accountStatus).toBe('active');
    expect(reactData.profileVisibility).toBe('all_users');

    // Candidate should now reappear in Discover feed
    const feedRes = await app.request('/api/profiles/discover?userId=usr_other&targetGender=male');
    const feedData = await feedRes.json();
    expect(feedData.profiles.some((p: any) => p.id === 'usr_reactivate_test_1')).toBe(true);
  });

  it('4. Permanent account deletion cascades and purges all user data', async () => {
    // Insert user with photo and religious profile
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_to_delete_99',
        fullName: 'User To Delete',
        gender: 'female',
        dob: '1998-01-01',
        location: 'London, UK',
        profession: 'Tester',
        photos: ['https://example.com/delete_me.jpg']
      })
    });

    // Verify profile exists
    const beforeDel = await app.request('/api/users/usr_to_delete_99');
    expect(beforeDel.status).toBe(200);

    // Call DELETE /api/users/:id
    const deleteRes = await app.request('/api/users/usr_to_delete_99', {
      method: 'DELETE'
    });
    expect(deleteRes.status).toBe(200);
    const delData = await deleteRes.json();
    expect(delData.success).toBe(true);

    // Subsequent GET /api/users/:id must return 404
    const afterDel = await app.request('/api/users/usr_to_delete_99');
    expect(afterDel.status).toBe(404);

    // Deletion should also remove photos
    const photosCheck: any = await mockDb.prepare('SELECT * FROM user_photos WHERE user_id = ?').bind('usr_to_delete_99').all();
    expect(photosCheck.results.length).toBe(0);
  });
});
