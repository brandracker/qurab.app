import { Hono } from 'hono';
import type { AppContext } from '../types';

export const usersRouter = new Hono<AppContext>();

// 1. Save Complete Rich Onboarding Data to D1
usersRouter.post('/complete-onboarding', async (c) => {
  try {
    const data = await c.req.json();
    const { 
      userId, fullName, dob, gender, location, height, bio, 
      blurPhotosByDefault, timeline, profession, education, university,
      familyStructure, livingPreference, siblingsCount, willingnessToRelocate,
      smokingStatus, languagesSpoken, mahrPhilosophy, childrenDesire,
      practiceLevel, sect, madhhab, prayerFrequency, halalDiet,
      quranRecitation, modestyPractice, hajjUmrahStatus, photos 
    } = data;

    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    // 1. Update users table with extended biodata
    await c.env.DB.prepare(`
      UPDATE users 
      SET full_name = ?, dob = ?, gender = ?, location = ?, height = ?, bio = ?, 
          profession = ?, education = ?, university = ?, family_structure = ?,
          living_preference = ?, siblings_count = ?, willingness_to_relocate = ?,
          smoking_status = ?, languages_spoken = ?, mahr_philosophy = ?,
          children_desire = ?, blur_photos_by_default = ?, marriage_timeline = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      fullName || 'Member',
      dob || '1998-01-01',
      gender || 'male',
      location || 'Global',
      height || "5'11\"",
      bio || '',
      profession || 'Professional',
      education || 'Graduate',
      university || '',
      familyStructure || 'nuclear',
      livingPreference || 'independent',
      siblingsCount || 0,
      willingnessToRelocate || 'open',
      smokingStatus || 'non_smoker',
      languagesSpoken || 'English, Urdu',
      mahrPhilosophy || 'mutual_agreement',
      childrenDesire || 'desires_children',
      blurPhotosByDefault ? 1 : 0,
      timeline || 'within_1_year',
      userId
    ).run();

    // 2. Insert or replace religious profile
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO religious_profiles (
        user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
        quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      practiceLevel || 'practicing',
      sect || 'Sunni',
      madhhab || 'Hanafi',
      prayerFrequency || '5 times daily',
      halalDiet || 'Strictly Halal',
      quranRecitation || 'regular',
      modestyPractice || 'modest',
      hajjUmrahStatus || 'planning',
      bio || 'Striving on the path of deen.'
    ).run();

    // 3. Save uploaded photos
    if (Array.isArray(photos) && photos.length > 0) {
      await c.env.DB.prepare(`DELETE FROM user_photos WHERE user_id = ?`).bind(userId).run();
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i]) continue;
        const photoId = `ph_${Date.now()}_${i}`;
        await c.env.DB.prepare(`
          INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
          VALUES (?, ?, ?, ?, ?)
        `).bind(photoId, userId, photos[i], i === 0 ? 1 : 0, i + 1).run();
      }
    }

    return c.json({
      success: true,
      message: 'Comprehensive matrimonial profile saved to Cloudflare D1 permanently!',
      userId
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Get User Profile by ID
usersRouter.get('/:id', async (c) => {
  try {
    const userId = c.req.param('id');
    const user: any = await c.env.DB.prepare(`
      SELECT u.*, 
             rp.practice_level as practiceLevel, rp.sect, rp.madhhab, 
             rp.prayer_frequency as prayerFrequency, rp.halal_diet as halalDiet,
             rp.quran_recitation as quranRecitation, rp.modesty_practice as modestyPractice,
             rp.hajj_umrah_status as hajjUmrahStatus, rp.deen_relationship_bio as deenBio,
             w.wali_name as waliName, w.wali_phone as waliPhone, w.wali_relationship as waliRelationship
      FROM users u
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE u.id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const { results: photos } = await c.env.DB.prepare(`
      SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC
    `).bind(userId).all();

    return c.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        dob: user.dob,
        gender: user.gender,
        location: user.location,
        height: user.height,
        bio: user.bio,
        profession: user.profession,
        education: user.education,
        university: user.university,
        familyStructure: user.family_structure || 'nuclear',
        livingPreference: user.living_preference || 'independent',
        siblingsCount: user.siblings_count || 0,
        willingnessToRelocate: user.willingness_to_relocate || 'open',
        smokingStatus: user.smoking_status || 'non_smoker',
        languagesSpoken: user.languages_spoken || 'English, Urdu',
        mahrPhilosophy: user.mahr_philosophy || 'mutual_agreement',
        childrenDesire: user.children_desire || 'desires_children',
        marriageTimeline: user.marriage_timeline || 'within_1_year',
        blurPhotosByDefault: Boolean(user.blur_photos_by_default),
        religiousProfile: {
          practiceLevel: user.practiceLevel || 'practicing',
          sect: user.sect || 'Sunni',
          madhhab: user.madhhab || 'Hanafi',
          prayerFrequency: user.prayerFrequency || '5 times daily',
          halalDiet: user.halalDiet || 'Strictly Halal',
          quranRecitation: user.quranRecitation || 'regular',
          modestyPractice: user.modestyPractice || 'modest',
          hajjUmrahStatus: user.hajjUmrahStatus || 'planning',
          deenRelationshipBio: user.deenBio
        },
        photos: (photos || []).map((p: any) => p.photo_url),
        wali: user.waliName ? { name: user.waliName, phone: user.waliPhone, relationship: user.waliRelationship } : null
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export const profilesRouter = new Hono<AppContext>();

// 3. Discover Profiles with Islamic Opposite-Gender Matching
profilesRouter.get('/discover', async (c) => {
  try {
    const currentUserId = c.req.query('userId') || '';
    
    let targetGender: string | null = null;
    if (currentUserId) {
      const userRow: any = await c.env.DB.prepare(`SELECT gender FROM users WHERE id = ?`).bind(currentUserId).first();
      if (userRow?.gender) {
        targetGender = userRow.gender.toLowerCase() === 'female' ? 'male' : (userRow.gender.toLowerCase() === 'male' ? 'female' : null);
      }
    }

    const genderFilter = targetGender ? `AND LOWER(u.gender) = ?` : '';
    const query = `
      SELECT 
        u.id, u.phone, u.email, u.full_name as fullName, u.dob, u.gender, 
        u.location, u.city, u.country, u.profession, u.education, u.university, u.height, 
        u.ethnicity, u.marriage_timeline as marriageTimeline, u.bio, 
        u.family_structure as familyStructure, u.living_preference as livingPreference,
        u.siblings_count as siblingsCount, u.willingness_to_relocate as willingnessToRelocate,
        u.smoking_status as smokingStatus, u.languages_spoken as languagesSpoken,
        u.mahr_philosophy as mahrPhilosophy, u.children_desire as childrenDesire,
        u.blur_photos_by_default as blurPhotosByDefault, u.profile_visibility as profileVisibility,
        rp.practice_level as practiceLevel, rp.sect, rp.madhhab, rp.prayer_frequency as prayerFrequency, 
        rp.halal_diet as halalDiet, rp.quran_recitation as quranRecitation,
        rp.modesty_practice as modestyPractice, rp.hajj_umrah_status as hajjUmrahStatus,
        rp.deen_relationship_bio as deenRelationshipBio,
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone, w.is_verified as waliVerified
      FROM users u
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE u.id != ? AND u.email IS NOT NULL AND u.email != '' AND u.full_name != 'New Member'
      ${genderFilter}
      ORDER BY u.created_at DESC
    `;

    const stmt = targetGender
      ? c.env.DB.prepare(query).bind(currentUserId, targetGender)
      : c.env.DB.prepare(query).bind(currentUserId);

    const { results } = await stmt.all();

    // Fetch photos safely
    const userIds = (results || []).map((r: any) => r.id);
    let photoMap: Record<string, string[]> = {};

    if (userIds.length > 0) {
      const placeholders = userIds.map(() => '?').join(',');
      const { results: allPhotos } = await c.env.DB.prepare(`
        SELECT user_id, photo_url FROM user_photos 
        WHERE user_id IN (${placeholders})
        ORDER BY sort_order ASC
      `).bind(...userIds).all();

      (allPhotos || []).forEach((p: any) => {
        if (!photoMap[p.user_id]) photoMap[p.user_id] = [];
        photoMap[p.user_id].push(p.photo_url);
      });
    }

    const formatted = (results || []).map((row: any) => {
      const birthYear = new Date(row.dob).getFullYear();
      const age = new Date().getFullYear() - (birthYear || 1998);
      const userPhotos = photoMap[row.id] || [];

      return {
        id: row.id,
        phone: row.phone,
        email: row.email,
        fullName: row.fullName,
        age: age || 26,
        gender: row.gender,
        location: row.location || 'Global',
        city: row.city,
        country: row.country,
        profession: row.profession || 'Professional',
        education: row.education || 'Graduate',
        university: row.university || '',
        height: row.height || "5'11\"",
        ethnicity: row.ethnicity || 'Global',
        familyStructure: row.familyStructure || 'nuclear',
        livingPreference: row.livingPreference || 'independent',
        siblingsCount: row.siblingsCount || 0,
        willingnessToRelocate: row.willingnessToRelocate || 'open',
        smokingStatus: row.smokingStatus || 'non_smoker',
        languagesSpoken: row.languagesSpoken || 'English, Urdu',
        mahrPhilosophy: row.mahrPhilosophy || 'mutual_agreement',
        childrenDesire: row.childrenDesire || 'desires_children',
        marriageTimeline: row.marriageTimeline || 'within_1_year',
        bio: row.bio || row.deenRelationshipBio || 'Seeking half my deen.',
        blurPhotosByDefault: Boolean(row.blurPhotosByDefault),
        profileVisibility: row.profileVisibility || 'all_users',
        photos: userPhotos.length > 0 ? userPhotos : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'],
        religiousProfile: {
          practiceLevel: row.practiceLevel || 'practicing',
          sect: row.sect || 'Sunni',
          madhhab: row.madhhab || 'Hanafi',
          prayerFrequency: row.prayerFrequency || '5 times daily',
          halalDiet: row.halalDiet || 'Strictly Halal',
          quranRecitation: row.quranRecitation || 'regular',
          modestyPractice: row.modestyPractice || 'modest',
          hajjUmrahStatus: row.hajjUmrahStatus || 'planning',
          deenRelationshipBio: row.deenRelationshipBio
        },
        wali: row.waliName ? {
          name: row.waliName,
          relationship: row.waliRelationship,
          phone: row.waliPhone,
          isVerified: Boolean(row.waliVerified)
        } : null,
      };
    });

    return c.json({ success: true, count: formatted.length, profiles: formatted });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
