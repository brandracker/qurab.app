import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('End-to-End Matrimonial Flow & Integrity Tests', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  // -------------------------------------------------------------
  // TEST 1: Full Onboarding & Cloudflare D1 Persistence
  // -------------------------------------------------------------
  it('1. Successfully saves full rich matrimonial onboarding data into D1', async () => {
    const maleOnboarding = {
      userId: 'usr_male_101',
      phone: '+14165551122',
      fullName: 'Brother Bilal Siddiqui',
      dob: '1995-05-12',
      gender: 'male',
      location: 'Toronto, Canada',
      height: "6'1\" (185 cm)",
      bio: 'Practicing engineer striving to build a peaceful Islamic home.',
      profession: 'Software Architect',
      education: 'Master of Engineering',
      university: 'University of Toronto',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 2,
      willingnessToRelocate: 'open',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English, Urdu',
      mahrPhilosophy: 'mutual_agreement',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      blurPhotosByDefault: false,
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      quranRecitation: 'daily',
      modestyPractice: 'modest',
      hajjUmrahStatus: 'performed_umrah',
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600']
    };

    const res = await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maleOnboarding)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.userId).toBe('usr_male_101');

    // Verify directly in D1 tables
    const userRow: any = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind('usr_male_101').first();
    expect(userRow).toBeTruthy();
    expect(userRow.full_name).toBe('Brother Bilal Siddiqui');
    expect(userRow.gender).toBe('male');
    expect(userRow.height).toBe("6'1\" (185 cm)");
    expect(userRow.profession).toBe('Software Architect');

    const relRow: any = await env.DB.prepare(`SELECT * FROM religious_profiles WHERE user_id = ?`).bind('usr_male_101').first();
    expect(relRow).toBeTruthy();
    expect(relRow.sect).toBe('Sunni');
    expect(relRow.madhhab).toBe('Hanafi');
    expect(relRow.prayer_frequency).toBe('5 times daily');

    const photoRow: any = await env.DB.prepare(`SELECT * FROM user_photos WHERE user_id = ?`).bind('usr_male_101').first();
    expect(photoRow).toBeTruthy();
    expect(photoRow.is_primary).toBe(1);
  });

  // -------------------------------------------------------------
  // TEST 2: Strict Opposite-Gender Matching on Discover
  // -------------------------------------------------------------
  it('2. Strictly isolates Discover Feed by Islamic opposite-gender rules', async () => {
    // Register Male User
    await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_brother_ahmed',
        phone: '+14165559988',
        fullName: 'Ahmed Farooq',
        gender: 'male',
        dob: '1994-08-10',
        location: 'Chicago, USA',
        profession: 'Pharmacist'
      })
    }, env);

    // Register Female User
    await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_sister_fatima',
        phone: '+14165557766',
        fullName: 'Fatima Noor',
        gender: 'female',
        dob: '1997-04-18',
        location: 'Dallas, USA',
        profession: 'Pediatrician'
      })
    }, env);

    // Sister Fatima searches Discover -> MUST ONLY see males
    const femaleDiscoverRes = await app.request('/api/profiles/discover?userId=usr_sister_fatima', { method: 'GET' }, env);
    expect(femaleDiscoverRes.status).toBe(200);
    const femaleDiscoverData = await femaleDiscoverRes.json();
    expect(femaleDiscoverData.success).toBe(true);
    expect(femaleDiscoverData.profiles.length).toBeGreaterThanOrEqual(1);

    // Ensure NO females appear in sister's feed
    const anyFemales = femaleDiscoverData.profiles.some((p: any) => p.gender?.toLowerCase() === 'female');
    expect(anyFemales).toBe(false);

    // Ensure brother Ahmed is found
    const brotherFound = femaleDiscoverData.profiles.some((p: any) => p.id === 'usr_brother_ahmed');
    expect(brotherFound).toBe(true);

    // Brother Ahmed searches Discover -> MUST ONLY see females
    const maleDiscoverRes = await app.request('/api/profiles/discover?userId=usr_brother_ahmed', { method: 'GET' }, env);
    expect(maleDiscoverRes.status).toBe(200);
    const maleDiscoverData = await maleDiscoverRes.json();
    expect(maleDiscoverData.success).toBe(true);

    // Ensure NO males appear in brother's feed
    const anyMales = maleDiscoverData.profiles.some((p: any) => p.gender?.toLowerCase() === 'male');
    expect(anyMales).toBe(false);

    // Ensure sister Fatima is found
    const sisterFound = maleDiscoverData.profiles.some((p: any) => p.id === 'usr_sister_fatima');
    expect(sisterFound).toBe(true);
  });

  // -------------------------------------------------------------
  // TEST 3: 100% Genuine Zero-State Likes & Real Match Flow
  // -------------------------------------------------------------
  it('3. Brand-new account starts with 0 incoming likes and receives genuine like on real action', async () => {
    // 1. Fresh user creation
    await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_new_sister',
        phone: '+14165553311',
        fullName: 'Sister Maryam',
        gender: 'female',
        dob: '1999-01-01',
        location: 'London, UK'
      })
    }, env);

    await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_suitor_zayn',
        phone: '+14165554422',
        fullName: 'Brother Zayn',
        gender: 'male',
        dob: '1996-03-03',
        location: 'London, UK'
      })
    }, env);

    // 2. Check initial "Liked You" state -> MUST BE 0 (NO FAKE / MOCK LIKES)
    const initialLikesRes = await app.request('/api/matches/received?userId=usr_new_sister', { method: 'GET' }, env);
    const initialLikesData = await initialLikesRes.json();
    expect(initialLikesData.success).toBe(true);
    expect(initialLikesData.count).toBe(0);
    expect(initialLikesData.candidates).toEqual([]);

    // 3. Brother Zayn likes Sister Maryam on Discover
    const likeActionRes = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_suitor_zayn',
        receiverId: 'usr_new_sister',
        action: 'liked'
      })
    }, env);
    expect(likeActionRes.status).toBe(200);

    // 4. Check Sister Maryam's "Liked You" tab again -> MUST NOW BE EXACTLY 1 GENUINE LIKE
    const updatedLikesRes = await app.request('/api/matches/received?userId=usr_new_sister', { method: 'GET' }, env);
    const updatedLikesData = await updatedLikesRes.json();
    expect(updatedLikesData.success).toBe(true);
    expect(updatedLikesData.count).toBe(1);
    expect(updatedLikesData.candidates[0].id).toBe('usr_suitor_zayn');
    expect(updatedLikesData.candidates[0].fullName).toBe('Brother Zayn');

    // 5. Sister Maryam accepts / matches with Brother Zayn -> Mutual Match Created!
    const matchActionRes = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_new_sister',
        receiverId: 'usr_suitor_zayn',
        action: 'liked'
      })
    }, env);
    const matchData = await matchActionRes.json();
    expect(matchData.success).toBe(true);
    expect(matchData.isMutual).toBe(true);
    expect(matchData.conversationId).toBeTruthy();
  });

  // -------------------------------------------------------------
  // TEST 4: Chat Messaging & Voice Greeting Upload
  // -------------------------------------------------------------
  it('4. Handles halal conversation messaging and voice greeting flow', async () => {
    // Insert users first
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location)
      VALUES ('usr_b1', '+14160001111', 'Brother Bilal', '1995-01-01', 'male', 'Toronto'),
             ('usr_s1', '+14160002222', 'Sister Sarah', '1998-01-01', 'female', 'London')
    `).run();


    // Setup matched conversation
    const convId = 'conv_test_halal_1';
    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, status)
      VALUES (?, ?, ?, ?, 'active')
    `).bind(convId, 'usr_b1', 'usr_s1', `conversations/${convId}.jsonl`).run();


    // Send a message
    const msgRes = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_b1',
        senderName: 'Brother Bilal',
        text: 'Assalamu Alaikum wa Rahmatullah'
      })
    }, env);

    expect(msgRes.status).toBe(200);
    const msgData = await msgRes.json();
    expect(msgData.success).toBe(true);
    expect(msgData.message.text).toBe('Assalamu Alaikum wa Rahmatullah');

    // Test Voice Greeting Upload
    const voiceRes = await app.request('/api/photos/upload-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_b1',
        audioBase64: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8USA==',
        duration: 45
      })
    }, env);
    expect(voiceRes.status).toBe(200);
    const voiceData = await voiceRes.json();
    expect(voiceData.success).toBe(true);
    expect(voiceData.duration).toBe(45);
  });
});
