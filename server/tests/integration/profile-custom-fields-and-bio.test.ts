import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { MockD1Database } from '../helpers/test-db';
import { usersRouter, profilesRouter } from '../../src/routes/users';
import type { AppContext } from '../../src/types';

describe('Profile Onboarding Custom Fields & Live Bio API', () => {
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
  });

  it('1. Complete onboarding stores all custom fields & hobbies & partner requirements in D1', async () => {
    const payload = {
      userId: 'usr_custom_test_1',
      fullName: 'Zayd Al-Faruq',
      dob: '1995-06-15',
      gender: 'male',
      location: 'London, UK',
      city: 'London',
      country: 'United Kingdom',
      profession: 'Senior AI Researcher',
      education: 'PhD Computer Science',
      university: 'Oxford University',
      height: "6'1\" (185 cm)",
      ethnicity: 'Arab',
      citizenship: 'British Citizen',
      workArrangement: 'hybrid',
      incomeBracket: '80k_150k',
      hobbies: ['📚 Books & Islamic History', '✈️ Travel & Umrah', '🏋️ Fitness & Gym'],
      personalityTraits: ['🤍 Family-Oriented', '🌿 Calm & Patient', '🕌 God-Fearing (Taqwa)'],
      maritalStatus: 'never_married',
      dualIncomePreference: 'career_supportive',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 3,
      willingnessToRelocate: 'willing',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English, Arabic, Urdu',
      mahrPhilosophy: 'sunnah_modest',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      bio: 'Practicing Muslim brother seeking a righteous spouse to build a peaceful Sunnah household.',
      partnerRequirements: {
        minAge: 22,
        maxAge: 30,
        maritalStatus: 'never_married',
        practiceLevel: 'practicing',
        relocation: 'willing',
        description: 'Seeking an educated sister striving upon Quran and Sunnah.'
      },
      blurPhotosByDefault: true,
      photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg']
    };

    const res = await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    // Fetch user and verify custom fields
    const getRes = await app.request(`/api/users/${payload.userId}`);
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.success).toBe(true);
    const profile = getJson.profile;

    expect(profile.fullName).toBe('Zayd Al-Faruq');
    expect(profile.citizenship).toBe('British Citizen');
    expect(profile.workArrangement).toBe('hybrid');
    expect(profile.incomeBracket).toBe('80k_150k');
    expect(profile.hobbies).toEqual(['📚 Books & Islamic History', '✈️ Travel & Umrah', '🏋️ Fitness & Gym']);
    expect(profile.personalityTraits).toEqual(['🤍 Family-Oriented', '🌿 Calm & Patient', '🕌 God-Fearing (Taqwa)']);
    expect(profile.maritalStatus).toBe('never_married');
    expect(profile.dualIncomePreference).toBe('career_supportive');
    expect(profile.partnerRequirements.minAge).toBe(22);
    expect(profile.partnerRequirements.maxAge).toBe(30);
    expect(profile.partnerRequirements.description).toContain('Quran and Sunnah');
    expect(profile.bio).toContain('Practicing Muslim brother');
    expect(profile.religiousProfile.deenRelationshipBio).toContain('Practicing Muslim brother');
  });

  it('2. Live Bio update endpoint PUT /api/users/:id/bio persists to D1 and syncs religious profile', async () => {
    // Initial user setup
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_bio_test_2',
        fullName: 'Maryam Tariq',
        gender: 'female',
        dob: '1998-04-20',
        location: 'Toronto, Canada',
        bio: 'Initial short bio.'
      })
    });

    // Live update bio
    const newBio = 'Updated live bio: Striving upon the path of knowledge and seeking a pious life partner.';
    const updateRes = await app.request('/api/users/usr_bio_test_2/bio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: newBio })
    });

    expect(updateRes.status).toBe(200);
    const updateJson = await updateRes.json();
    expect(updateJson.success).toBe(true);
    expect(updateJson.bio).toBe(newBio);

    // Verify GET returns updated bio from DB
    const getRes = await app.request('/api/users/usr_bio_test_2');
    const getJson = await getRes.json();
    expect(getJson.profile.bio).toBe(newBio);
    expect(getJson.profile.religiousProfile.deenRelationshipBio).toBe(newBio);
  });

  it('3. PUT /api/users/:id/profile updates custom fields dynamically', async () => {
    await app.request('/api/users/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_profile_update_3',
        fullName: 'Bilal Khan',
        gender: 'male',
        dob: '1997-01-01',
        location: 'Dubai, UAE',
        profession: 'Developer'
      })
    });

    const updateRes = await app.request('/api/users/usr_profile_update_3/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Bilal Khan',
        profession: 'Principal Engineer & Founder',
        citizenship: 'UAE Golden Visa',
        workArrangement: 'entrepreneur',
        incomeBracket: '150k_plus',
        hobbies: ['💻 Tech & Coding', '☕ Specialty Coffee'],
        maritalStatus: 'never_married'
      })
    });

    expect(updateRes.status).toBe(200);

    const verifyRes = await app.request('/api/users/usr_profile_update_3');
    const verifyJson = await verifyRes.json();
    expect(verifyJson.profile.profession).toBe('Principal Engineer & Founder');
    expect(verifyJson.profile.citizenship).toBe('UAE Golden Visa');
    expect(verifyJson.profile.workArrangement).toBe('entrepreneur');
    expect(verifyJson.profile.incomeBracket).toBe('150k_plus');
    expect(verifyJson.profile.hobbies).toContain('💻 Tech & Coding');
  });
});
