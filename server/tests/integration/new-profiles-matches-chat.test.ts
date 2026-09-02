import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('New Profiles Matches and Real-time Chat Integration Flow', () => {
  let env: any;

  const newBrother = {
    id: 'usr_new_brother_101',
    fullName: 'Hamza Farooqi',
    email: 'hamza.f@example.com',
    dob: '1996-05-12',
    gender: 'male',
    location: 'Birmingham, UK',
    city: 'Birmingham',
    country: 'United Kingdom',
    latitude: 52.4862,
    longitude: -1.8904,
    profession: 'Software Architect',
    education: 'Masters in Computing',
    marriageTimeline: 'within_1_year',
    bio: 'Striving on the path of Sunnah.',
    photos: ['https://example.com/photos/hamza_1.jpg', 'https://example.com/photos/hamza_2.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  const newSister = {
    id: 'usr_new_sister_202',
    fullName: 'Maryam Siddiqui',
    email: 'maryam.s@example.com',
    dob: '1998-08-20',
    gender: 'female',
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    profession: 'Clinical Pharmacist',
    education: 'PharmD',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking pious spouse for half my deen.',
    photos: ['https://example.com/photos/maryam_1.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  beforeEach(async () => {
    env = createTestEnv();

    // 1. Create New Brother Profile via POST /api/profiles
    const resB = await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBrother)
    }, env);
    expect(resB.status).toBe(200);

    // 2. Create New Sister Profile via POST /api/profiles
    const resS = await app.request('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSister)
    }, env);
    expect(resS.status).toBe(200);
  });

  it('1. Handles complete matching lifecycle for two new profiles (Like -> Liked You -> Mutual Match)', async () => {
    // Brother expresses interest in Sister
    const likeRes1 = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: newBrother.id,
        receiverId: newSister.id,
        action: 'liked'
      })
    }, env);

    expect(likeRes1.status).toBe(200);
    const likeData1 = await likeRes1.json();
    expect(likeData1.success).toBe(true);
    expect(likeData1.isMutual).toBe(false);

    // Sister sees Brother in her "Liked You" incoming list with photos and biodata
    const receivedRes = await app.request(`/api/matches/received?userId=${newSister.id}`, { method: 'GET' }, env);
    expect(receivedRes.status).toBe(200);
    const receivedData = await receivedRes.json();
    expect(receivedData.success).toBe(true);
    expect(receivedData.count).toBe(1);
    expect(receivedData.candidates[0].id).toBe(newBrother.id);
    expect(receivedData.candidates[0].fullName).toBe('Hamza Farooqi');
    expect(receivedData.candidates[0].photos).toContain('https://example.com/photos/hamza_1.jpg');

    // Sister likes Brother back -> Triggers True Mutual Match
    const likeRes2 = await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: newSister.id,
        receiverId: newBrother.id,
        action: 'liked'
      })
    }, env);

    expect(likeRes2.status).toBe(200);
    const likeData2 = await likeRes2.json();
    expect(likeData2.success).toBe(true);
    expect(likeData2.isMutual).toBe(true);
    expect(likeData2.conversationId).toBeDefined();

    // Verify GET /api/matches/mutual for both users
    const mutualResSister = await app.request(`/api/matches/mutual?userId=${newSister.id}`, { method: 'GET' }, env);
    const mutualDataSister = await mutualResSister.json();
    expect(mutualDataSister.success).toBe(true);
    expect(mutualDataSister.matches).toHaveLength(1);
    expect(mutualDataSister.matches[0].id).toBe(newBrother.id);
    expect(mutualDataSister.matches[0].fullName).toBe('Hamza Farooqi');

    const mutualResBrother = await app.request(`/api/matches/mutual?userId=${newBrother.id}`, { method: 'GET' }, env);
    const mutualDataBrother = await mutualResBrother.json();
    expect(mutualDataBrother.success).toBe(true);
    expect(mutualDataBrother.matches).toHaveLength(1);
    expect(mutualDataBrother.matches[0].id).toBe(newSister.id);
    expect(mutualDataBrother.matches[0].fullName).toBe('Maryam Siddiqui');
  });

  it('2. Automatically initializes conversation with rich otherUser details for new profiles', async () => {
    // Simulate mutual match
    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: newBrother.id, receiverId: newSister.id, action: 'liked' })
    }, env);

    await app.request('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: newSister.id, receiverId: newBrother.id, action: 'liked' })
    }, env);

    // Brother queries conversation list
    const convsRes = await app.request(`/api/conversations?userId=${newBrother.id}`, { method: 'GET' }, env);
    expect(convsRes.status).toBe(200);
    const convsData = await convsRes.json();
    expect(convsData.success).toBe(true);
    expect(convsData.conversations).toHaveLength(1);

    const conv = convsData.conversations[0];
    expect(conv.otherUser.id).toBe(newSister.id);
    expect(conv.otherUser.fullName).toBe('Maryam Siddiqui');
    expect(conv.otherUser.profession).toBe('Clinical Pharmacist');
    expect(conv.otherUser.photos).toContain('https://example.com/photos/maryam_1.jpg');
    expect(conv.otherUser.religiousProfile.sect).toBe('Sunni');
  });

  it('3. Handles bidirectional messaging between new profiles with auto-resolved conversation', async () => {
    const convId = `conv_${[newBrother.id, newSister.id].sort().join('_')}`;

    // 1. Brother sends initial message to Sister
    const sendRes1 = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: newBrother.id,
        senderName: newBrother.fullName,
        text: 'Assalamu Alaikum sister Maryam, I reviewed your profile and appreciate your deen values.',
        receiverId: newSister.id
      })
    }, env);

    expect(sendRes1.status).toBe(200);
    const sendData1 = await sendRes1.json();
    expect(sendData1.success).toBe(true);
    expect(sendData1.message.waliNotified).toBe(true);

    // 2. Sister sends reply without explicit receiverId (auto-resolved from convId)
    const sendRes2 = await app.request(`/api/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: newSister.id,
        senderName: newSister.fullName,
        text: 'Wa Alaikum Assalam brother Hamza. JazakAllah Khair for reaching out!'
      })
    }, env);

    expect(sendRes2.status).toBe(200);
    const sendData2 = await sendRes2.json();
    expect(sendData2.success).toBe(true);

    // 3. Both users fetch message history
    const getMsgsRes = await app.request(`/api/conversations/${convId}/messages`, { method: 'GET' }, env);
    expect(getMsgsRes.status).toBe(200);
    const getMsgsData = await getMsgsRes.json();
    expect(getMsgsData.success).toBe(true);
    expect(getMsgsData.messages).toHaveLength(2);
    expect(getMsgsData.messages[0].senderId).toBe(newBrother.id);
    expect(getMsgsData.messages[1].senderId).toBe(newSister.id);

    // 4. Test reverse conversation ID querying returns the same messages
    const reverseConvId = `conv_${newSister.id}_${newBrother.id}`;
    const reverseMsgsRes = await app.request(`/api/conversations/${reverseConvId}/messages`, { method: 'GET' }, env);
    expect(reverseMsgsRes.status).toBe(200);
    const reverseMsgsData = await reverseMsgsRes.json();
    expect(reverseMsgsData.success).toBe(true);
    expect(reverseMsgsData.messages).toHaveLength(2);
  });
});
