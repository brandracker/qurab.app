import { Hono } from 'hono';
import type { AppContext } from '../types';
import { calculateDistanceKm, getBoundingBox } from '../utils/geo';

export const usersRouter = new Hono<AppContext>();

// 1. Save Complete Rich Onboarding Data to D1
usersRouter.post('/complete-onboarding', async (c) => {
  try {
    const data = await c.req.json();
    const { 
      userId, fullName, dob, gender, location, city, country, latitude, longitude, height, bio, 
      blurPhotosByDefault, timeline, profession, education, university,
      familyStructure, livingPreference, siblingsCount, willingnessToRelocate,
      smokingStatus, languagesSpoken, mahrPhilosophy, childrenDesire,
      practiceLevel, sect, madhhab, prayerFrequency, halalDiet,
      quranRecitation, modestyPractice, hajjUmrahStatus, photos 
    } = data;

    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    const latNum = typeof latitude === 'number' ? latitude : (latitude ? parseFloat(latitude) : null);
    const lonNum = typeof longitude === 'number' ? longitude : (longitude ? parseFloat(longitude) : null);

    // 1. Update users table with extended biodata and location coordinates
    await c.env.DB.prepare(`
      UPDATE users 
      SET full_name = ?, dob = ?, gender = ?, location = ?, city = ?, country = ?, 
          latitude = ?, longitude = ?, height = ?, bio = ?, 
          profession = ?, education = ?, university = ?, family_structure = ?,
          living_preference = ?, siblings_count = ?, willingness_to_relocate = ?,
          smoking_status = ?, languages_spoken = ?, mahr_philosophy = ?,
          children_desire = ?, blur_photos_by_default = ?, marriage_timeline = ?,
          is_profile_completed = 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      fullName || 'Member',
      dob || '1998-01-01',
      gender || 'male',
      location || (city ? `${city}, ${country || ''}`.trim() : 'Global'),
      city || null,
      country || null,
      latNum,
      lonNum,
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
        const photoId = `ph_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${i}`;
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

    const birthYear = user.dob ? new Date(user.dob).getFullYear() : 1998;
    const age = new Date().getFullYear() - (birthYear || 1998);

    return c.json({
      success: true,
      profile: {
        id: user.id,
        phone: user.phone || '',
        email: user.email,
        fullName: user.full_name,
        dob: user.dob,
        age: age || 28,
        gender: user.gender,
        location: user.location,
        city: user.city,
        country: user.country,
        latitude: user.latitude,
        longitude: user.longitude,
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
        profileVisibility: user.profile_visibility || 'all_users',
        isVip: Boolean(user.is_vip),
        isProfileCompleted: Boolean(user.is_profile_completed),
        voiceGreetingUrl: user.voice_greeting_url || undefined,
        voiceGreetingDuration: user.voice_greeting_duration || 0,
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

// 3. Update User Islamic Modesty & Privacy Preferences in D1
usersRouter.post('/privacy', async (c) => {
  try {
    const { userId, blurPhotosByDefault, profileVisibility } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE users 
      SET blur_photos_by_default = ?, 
          profile_visibility = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      blurPhotosByDefault ? 1 : 0,
      profileVisibility || 'all_users',
      userId
    ).run();

    return c.json({
      success: true,
      message: 'Privacy settings updated in D1 database successfully.',
      blurPhotosByDefault: Boolean(blurPhotosByDefault),
      profileVisibility
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export const profilesRouter = new Hono<AppContext>();

profilesRouter.post('/privacy', async (c) => {
  try {
    const { userId, blurPhotosByDefault, profileVisibility } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE users 
      SET blur_photos_by_default = ?, 
          profile_visibility = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      blurPhotosByDefault ? 1 : 0,
      profileVisibility || 'all_users',
      userId
    ).run();

    return c.json({
      success: true,
      message: 'Privacy settings updated in D1 database successfully.',
      blurPhotosByDefault: Boolean(blurPhotosByDefault),
      profileVisibility
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Discover Profiles with Islamic Opposite-Gender Matching & Dynamic Distance
profilesRouter.get('/discover', async (c) => {
  try {
    const currentUserId = c.req.query('userId') || '';
    const queryLat = c.req.query('lat') ? parseFloat(c.req.query('lat')!) : null;
    const queryLon = c.req.query('lon') ? parseFloat(c.req.query('lon')!) : null;
    const maxDistanceKm = c.req.query('maxDistance') ? parseFloat(c.req.query('maxDistance')!) : null;
    
    const queryGender = c.req.query('gender');
    const queryTargetGender = c.req.query('targetGender');
    
    let targetGender: string | null = null;
    if (queryTargetGender && (queryTargetGender.toLowerCase() === 'male' || queryTargetGender.toLowerCase() === 'female')) {
      targetGender = queryTargetGender.toLowerCase();
    } else if (queryGender && (queryGender.toLowerCase() === 'male' || queryGender.toLowerCase() === 'female')) {
      targetGender = queryGender.toLowerCase() === 'female' ? 'male' : 'female';
    }

    let viewerLat: number | null = (queryLat !== null && !isNaN(queryLat)) ? queryLat : null;
    let viewerLon: number | null = (queryLon !== null && !isNaN(queryLon)) ? queryLon : null;

    if (currentUserId) {
      const userRow: any = await c.env.DB.prepare(`SELECT gender, latitude, longitude FROM users WHERE id = ?`).bind(currentUserId).first();
      if (!targetGender && userRow?.gender) {
        targetGender = userRow.gender.toLowerCase() === 'female' ? 'male' : (userRow.gender.toLowerCase() === 'male' ? 'female' : null);
      }
      if (viewerLat === null && typeof userRow?.latitude === 'number') {
        viewerLat = userRow.latitude;
      }
      if (viewerLon === null && typeof userRow?.longitude === 'number') {
        viewerLon = userRow.longitude;
      }
    }

    // Determine bounding box if maxDistance is specified
    const box = (maxDistanceKm && viewerLat !== null && viewerLon !== null)
      ? getBoundingBox(viewerLat, viewerLon, maxDistanceKm)
      : null;

    const genderFilter = targetGender ? `AND LOWER(u.gender) = ?` : '';
    const geoFilter = box ? `AND u.latitude BETWEEN ? AND ? AND u.longitude BETWEEN ? AND ?` : '';

    const query = `
      SELECT 
        u.id, u.phone, u.email, u.full_name as fullName, u.dob, u.gender, 
        u.location, u.city, u.country, u.latitude, u.longitude,
        u.profession, u.education, u.university, u.height, 
        u.ethnicity, u.marriage_timeline as marriageTimeline, u.bio, 
        u.family_structure as familyStructure, u.living_preference as livingPreference,
        u.siblings_count as siblingsCount, u.willingness_to_relocate as willingnessToRelocate,
        u.smoking_status as smokingStatus, u.languages_spoken as languagesSpoken,
        u.mahr_philosophy as mahrPhilosophy, u.children_desire as childrenDesire,
        u.blur_photos_by_default as blurPhotosByDefault, u.profile_visibility as profileVisibility,
        u.is_vip as isVip,
        u.voice_greeting_url as voiceGreetingUrl,
        u.voice_greeting_duration as voiceGreetingDuration,
        rp.practice_level as practiceLevel, rp.sect, rp.madhhab, rp.prayer_frequency as prayerFrequency, 
        rp.halal_diet as halalDiet, rp.quran_recitation as quranRecitation,
        rp.modesty_practice as modestyPractice, rp.hajj_umrah_status as hajjUmrahStatus,
        rp.deen_relationship_bio as deenRelationshipBio,
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone, w.is_verified as waliVerified,
        (CASE WHEN uw.spotlight_expires_at IS NOT NULL AND datetime(uw.spotlight_expires_at) > datetime('now') THEN 1 ELSE 0 END) as isSpotlightActive
      FROM users u
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      WHERE u.id != ? 
        AND (u.full_name != 'New Member' OR u.full_name IS NULL)
        AND (u.is_profile_completed != 0 OR u.is_profile_completed IS NULL)
        AND (u.is_profile_completed = 1 OR (u.location != 'Global' AND u.location IS NOT NULL))
        ${genderFilter}
      ${geoFilter}
      ORDER BY (CASE WHEN uw.spotlight_expires_at IS NOT NULL AND datetime(uw.spotlight_expires_at) > datetime('now') THEN 1 ELSE 0 END) DESC, u.is_vip DESC, u.created_at DESC
    `;

    const bindParams: any[] = [currentUserId];
    if (targetGender) bindParams.push(targetGender);
    if (box) {
      bindParams.push(box.minLat, box.maxLat, box.minLon, box.maxLon);
    }

    const stmt = c.env.DB.prepare(query).bind(...bindParams);
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

      let distanceKm: number | null = null;
      if (
        viewerLat !== null && 
        viewerLon !== null && 
        typeof row.latitude === 'number' && 
        typeof row.longitude === 'number'
      ) {
        distanceKm = calculateDistanceKm(viewerLat, viewerLon, row.latitude, row.longitude);
      }

      // If maxDistance filter was specified, filter exact circular radius
      if (maxDistanceKm !== null && distanceKm !== null && distanceKm > maxDistanceKm) {
        return null;
      }

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
        latitude: row.latitude,
        longitude: row.longitude,
        distanceKm,
        profession: row.profession || 'Professional',
        education: row.education || 'Graduate',
        university: row.university || '',
        height: row.height || "5'11\"",
        ethnicity: row.ethnicity || 'South Asian',
        citizenship: 'Citizen',
        workArrangement: 'remote',
        incomeBracket: '40k_80k',
        hobbies: ['📚 Books & Islamic History', '✈️ Travel & Umrah', '☕ Specialty Coffee'],
        personalityTraits: ['🤍 Family-Oriented', '🌿 Calm & Patient'],
        maritalStatus: 'never_married',
        dualIncomePreference: 'career_supportive',
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
        isVip: Boolean(row.isVip),
        isSpotlightActive: Boolean(row.isSpotlightActive),
        voiceGreetingUrl: row.voiceGreetingUrl || undefined,
        voiceGreetingDuration: row.voiceGreetingDuration || undefined,
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
    }).filter(Boolean) as any[];

    // Sort: Spotlight first, then VIP, then by closest distance if distance is known
    formatted.sort((a, b) => {
      if (b.isSpotlightActive !== a.isSpotlightActive) return (b.isSpotlightActive ? 1 : 0) - (a.isSpotlightActive ? 1 : 0);
      if (b.isVip !== a.isVip) return (b.isVip ? 1 : 0) - (a.isVip ? 1 : 0);
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;
      return 0;
    });

    return c.json({ success: true, count: formatted.length, profiles: formatted });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Create / Save Profile Alias (POST /api/profiles)
profilesRouter.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const { 
      id, userId, fullName, dob, gender, location, city, country, latitude, longitude, height, bio, 
      blurPhotosByDefault, marriageTimeline, timeline, profession, education, university,
      familyStructure, livingPreference, siblingsCount, willingnessToRelocate,
      smokingStatus, languagesSpoken, mahrPhilosophy, childrenDesire,
      religiousProfile, practiceLevel, sect, madhhab, prayerFrequency, halalDiet,
      quranRecitation, modestyPractice, hajjUmrahStatus, photos 
    } = data;

    const targetUserId = id || userId;
    if (!targetUserId) {
      return c.json({ success: false, error: 'User ID is required' }, 400);
    }

    const latNum = typeof latitude === 'number' ? latitude : (latitude ? parseFloat(latitude) : null);
    const lonNum = typeof longitude === 'number' ? longitude : (longitude ? parseFloat(longitude) : null);

    // Insert or update users table
    await c.env.DB.prepare(`
      INSERT INTO users (
        id, phone, email, full_name, dob, gender, location, city, country, latitude, longitude, height, bio,
        profession, education, university, family_structure, living_preference,
        siblings_count, willingness_to_relocate, smoking_status, languages_spoken,
        mahr_philosophy, children_desire, blur_photos_by_default, marriage_timeline,
        is_profile_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET
        full_name = excluded.full_name,
        dob = excluded.dob,
        gender = excluded.gender,
        location = excluded.location,
        city = COALESCE(excluded.city, users.city),
        country = COALESCE(excluded.country, users.country),
        latitude = COALESCE(excluded.latitude, users.latitude),
        longitude = COALESCE(excluded.longitude, users.longitude),
        height = excluded.height,
        bio = excluded.bio,
        profession = excluded.profession,
        education = excluded.education,
        university = excluded.university,
        family_structure = excluded.family_structure,
        living_preference = excluded.living_preference,
        siblings_count = excluded.siblings_count,
        willingness_to_relocate = excluded.willingness_to_relocate,
        smoking_status = excluded.smoking_status,
        languages_spoken = excluded.languages_spoken,
        mahr_philosophy = excluded.mahr_philosophy,
        children_desire = excluded.children_desire,
        blur_photos_by_default = excluded.blur_photos_by_default,
        marriage_timeline = excluded.marriage_timeline,
        is_profile_completed = 1,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      targetUserId,
      data.phone || `+1${Date.now().toString().slice(-10)}`,
      data.email || `${targetUserId}@sereneunion.app`,
      fullName || 'Member',
      dob || '1998-01-01',
      (gender === 'female' || gender === 'male') ? gender : ((fullName && (fullName.toLowerCase().includes('fatima') || fullName.toLowerCase().includes('zainab') || fullName.toLowerCase().includes('maryam') || fullName.toLowerCase().includes('aisha') || fullName.toLowerCase().includes('sarah') || fullName.toLowerCase().includes('noor'))) ? 'female' : 'male'),
      location || (city ? `${city}, ${country || ''}`.trim() : 'Global'),
      city || null,
      country || null,
      latNum,
      lonNum,
      height || "5'10\"",
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
      marriageTimeline || timeline || 'within_1_year'
    ).run();

    // Religious Profile
    const relPractice = religiousProfile?.practiceLevel || practiceLevel || 'practicing';
    const relSect = religiousProfile?.sect || sect || 'Sunni';
    const relMadhhab = religiousProfile?.madhhab || madhhab || 'Hanafi';
    const relPrayer = religiousProfile?.prayerFrequency || prayerFrequency || '5 times daily';
    const relHalal = religiousProfile?.halalDiet || halalDiet || 'Strictly Halal';
    const relQuran = religiousProfile?.quranRecitation || quranRecitation || 'regular';
    const relModesty = religiousProfile?.modestyPractice || modestyPractice || 'modest';
    const relHajj = religiousProfile?.hajjUmrahStatus || hajjUmrahStatus || 'planning';
    const relBio = religiousProfile?.deenRelationshipBio || bio || 'Seeking half my deen.';

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO religious_profiles (
        user_id, practice_level, sect, madhhab, prayer_frequency, halal_diet,
        quran_recitation, modesty_practice, hajj_umrah_status, deen_relationship_bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      targetUserId, relPractice, relSect, relMadhhab, relPrayer, relHalal,
      relQuran, relModesty, relHajj, relBio
    ).run();

    // User Photos
    if (Array.isArray(photos) && photos.length > 0) {
      await c.env.DB.prepare(`DELETE FROM user_photos WHERE user_id = ?`).bind(targetUserId).run();
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i]) continue;
        const photoId = `ph_${Date.now()}_${i}`;
        await c.env.DB.prepare(`
          INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
          VALUES (?, ?, ?, ?, ?)
        `).bind(photoId, targetUserId, photos[i], i === 0 ? 1 : 0, i + 1).run();
      }
    }

    return c.json({
      success: true,
      message: 'Profile saved successfully in Cloudflare D1',
      userId: targetUserId
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

