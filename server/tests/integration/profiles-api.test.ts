import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleBrotherReligious, sampleSisterUser, sampleSisterReligious, sampleSisterWali } from '../helpers/mock-data';

describe('Profiles & Discovery API Integration Tests', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  it('POST /api/users/complete-onboarding persists complete biodata and deen profile', async () => {
    // 1. Pre-insert a base user record
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, marriage_timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sampleBrotherUser.id,
      sampleBrotherUser.phone,
      sampleBrotherUser.email,
      sampleBrotherUser.full_name,
      sampleBrotherUser.dob,
      sampleBrotherUser.gender,
      sampleBrotherUser.location,
      sampleBrotherUser.marriage_timeline
    ).run();

    // 2. Submit onboarding data
    const onboardingPayload = {
      userId: sampleBrotherUser.id,
      fullName: sampleBrotherUser.full_name,
      dob: sampleBrotherUser.dob,
      gender: sampleBrotherUser.gender,
      location: sampleBrotherUser.location,
      height: sampleBrotherUser.height,
      bio: sampleBrotherUser.bio,
      profession: sampleBrotherUser.profession,
      education: sampleBrotherUser.education,
      university: sampleBrotherUser.university,
      familyStructure: sampleBrotherUser.family_structure,
      livingPreference: sampleBrotherUser.living_preference,
      siblingsCount: sampleBrotherUser.siblings_count,
      willingnessToRelocate: sampleBrotherUser.willingness_to_relocate,
      smokingStatus: sampleBrotherUser.smoking_status,
      languagesSpoken: sampleBrotherUser.languages_spoken,
      mahrPhilosophy: sampleBrotherUser.mahr_philosophy,
      childrenDesire: sampleBrotherUser.children_desire,
      practiceLevel: sampleBrotherReligious.practice_level,
      sect: sampleBrotherReligious.sect,
      madhhab: sampleBrotherReligious.madhhab,
      prayerFrequency: sampleBrotherReligious.prayer_frequency,
      halalDiet: sampleBrotherReligious.halal_diet,
      quranRecitation: sampleBrotherReligious.quran_recitation,
      modestyPractice: sampleBrotherReligious.modesty_practice,
      hajjUmrahStatus: sampleBrotherReligious.hajj_umrah_status,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800']
    };

    const res = await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingPayload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // 3. Verify through GET /api/users/:id
    const getRes = await app.request(`/api/users/${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();

    expect(getData.success).toBe(true);
    expect(getData.profile.fullName).toBe(sampleBrotherUser.full_name);
    expect(getData.profile.profession).toBe(sampleBrotherUser.profession);
    expect(getData.profile.religiousProfile.prayerFrequency).toBe(sampleBrotherReligious.prayer_frequency);
    expect(getData.profile.religiousProfile.sect).toBe(sampleBrotherReligious.sect);
    expect(getData.profile.photos).toHaveLength(1);
  });

  it('GET /api/profiles/discover returns active members excluding the requesting user', async () => {
    // Insert Brother
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sampleBrotherUser.id,
      sampleBrotherUser.phone,
      sampleBrotherUser.email,
      sampleBrotherUser.full_name,
      sampleBrotherUser.dob,
      sampleBrotherUser.gender,
      sampleBrotherUser.location
    ).run();

    // Insert Sister with Wali
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sampleSisterUser.id,
      sampleSisterUser.phone,
      sampleSisterUser.email,
      sampleSisterUser.full_name,
      sampleSisterUser.dob,
      sampleSisterUser.gender,
      sampleSisterUser.location
    ).run();

    await env.DB.prepare(`
      INSERT INTO wali_details (id, user_id, wali_name, wali_phone, wali_relationship, is_verified)
      VALUES (?, ?, ?, ?, ?, 1)
    `).bind(
      sampleSisterWali.id,
      sampleSisterWali.user_id,
      sampleSisterWali.wali_name,
      sampleSisterWali.wali_phone,
      sampleSisterWali.wali_relationship
    ).run();

    // Brother calls Discover feed
    const res = await app.request(`/api/profiles/discover?userId=${sampleBrotherUser.id}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.profiles.length).toBeGreaterThanOrEqual(1);

    // Ensure Brother himself is NOT in the discover list
    const foundSelf = data.profiles.some((p: any) => p.id === sampleBrotherUser.id);
    expect(foundSelf).toBe(false);

    // Ensure Sister is found with Wali details
    const foundSister = data.profiles.find((p: any) => p.id === sampleSisterUser.id);
    expect(foundSister).toBeDefined();
    expect(foundSister.wali).toBeDefined();
    expect(foundSister.wali.name).toBe(sampleSisterWali.wali_name);
  });

  it('POST /api/users/privacy updates blur_photos_by_default and profile_visibility in D1', async () => {
    // 1. Pre-insert a base user record
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, blur_photos_by_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(
      sampleBrotherUser.id,
      sampleBrotherUser.phone,
      sampleBrotherUser.email,
      sampleBrotherUser.full_name,
      sampleBrotherUser.dob,
      sampleBrotherUser.gender,
      sampleBrotherUser.location
    ).run();

    // 2. User turns OFF photo blur
    const res = await app.request('/api/users/privacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: sampleBrotherUser.id,
        blurPhotosByDefault: false,
        profileVisibility: 'verified_only'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.blurPhotosByDefault).toBe(false);

    // 3. Verify in D1 database
    const userRow = await env.DB.prepare('SELECT blur_photos_by_default, profile_visibility FROM users WHERE id = ?').bind(sampleBrotherUser.id).first();
    expect(userRow.blur_photos_by_default).toBe(0);
    expect(userRow.profile_visibility).toBe('verified_only');
  });

  it('GET /api/profiles/discover accurately computes distances and filters by maxDistance', async () => {
    // 1. Pre-insert current user in London (51.5074, -0.1278)
    const viewerId = 'viewer_001';
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location, city, country, latitude, longitude)
      VALUES (?, '+447000000001', 'Viewer Brother', '1995-01-01', 'male', 'London, UK', 'London', 'UK', 51.5074, -0.1278)
    `).bind(viewerId).run();

    // 2. Insert candidate in Manchester (53.4808, -2.2426) - ~260 km away
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location, city, country, latitude, longitude)
      VALUES ('cand_manchester', '+447000000002', 'Sister Manchester', '1997-01-01', 'female', 'Manchester, UK', 'Manchester', 'UK', 53.4808, -2.2426)
    `).run();

    // 3. Insert candidate in Dubai (25.2048, 55.2708) - ~5500 km away
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location, city, country, latitude, longitude)
      VALUES ('cand_dubai', '+971500000001', 'Sister Dubai', '1998-01-01', 'female', 'Dubai, UAE', 'Dubai', 'UAE', 25.2048, 55.2708)
    `).run();

    // Call discover without maxDistance -> should return both with distanceKm
    const allRes = await app.request(`/api/profiles/discover?userId=${viewerId}`, { method: 'GET' }, env);
    expect(allRes.status).toBe(200);
    const allData = await allRes.json();
    expect(allData.profiles.length).toBeGreaterThanOrEqual(2);

    const manchesterProfile = allData.profiles.find((p: any) => p.id === 'cand_manchester');
    expect(manchesterProfile).toBeDefined();
    expect(manchesterProfile.distanceKm).toBeGreaterThan(250);
    expect(manchesterProfile.distanceKm).toBeLessThan(275);

    // Call discover with maxDistance=300 km -> should return Manchester (~260 km) but EXCLUDE Dubai (~5500 km)
    const filteredRes = await app.request(`/api/profiles/discover?userId=${viewerId}&maxDistance=300`, { method: 'GET' }, env);
    expect(filteredRes.status).toBe(200);
    const filteredData = await filteredRes.json();
    
    expect(filteredData.profiles.some((p: any) => p.id === 'cand_manchester')).toBe(true);
    expect(filteredData.profiles.some((p: any) => p.id === 'cand_dubai')).toBe(false);
  });

  it('GET /api/profiles/discover strictly excludes accounts with incomplete onboarding (is_profile_completed = 0)', async () => {
    const viewerId = 'usr_brother_test_guard';
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location, is_profile_completed)
      VALUES ('${viewerId}', '+15550009999', 'Brother Viewer', '1995-01-01', 'male', 'London, UK', 1)
    `).run();

    // Incomplete user who dropped out during onboarding
    const incompleteUserId = 'usr_sister_incomplete_999';
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location, is_profile_completed)
      VALUES ('${incompleteUserId}', '+15550008888', 'incomplete@example.com', 'Sister Incomplete', '1998-01-01', 'female', 'London, UK', 0)
    `).run();

    const res = await app.request(`/api/profiles/discover?userId=${viewerId}`, { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();

    // The incomplete user MUST NOT appear in Discover feed
    const foundIncomplete = data.profiles.some((p: any) => p.id === incompleteUserId);
    expect(foundIncomplete).toBe(false);

    // Now user completes onboarding
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: incompleteUserId,
        fullName: 'Sister Completed',
        dob: '1998-01-01',
        gender: 'female',
        city: 'London',
        country: 'United Kingdom',
        practiceLevel: 'practicing'
      })
    }, env);

    // Now check discover again -> completed user MUST now appear
    const secondRes = await app.request(`/api/profiles/discover?userId=${viewerId}`, { method: 'GET' }, env);
    const secondData = await secondRes.json();
    const foundNow = secondData.profiles.some((p: any) => p.id === incompleteUserId);
    expect(foundNow).toBe(true);
  });
});


