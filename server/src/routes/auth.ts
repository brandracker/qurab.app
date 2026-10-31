import { Hono } from 'hono';
import type { AppContext } from '../types';
import { hashPassword, generateSessionToken, generateOtpCode } from '../utils/crypto';

export const authRouter = new Hono<AppContext>();

// 1. Email + Password Sign Up
authRouter.post('/signup', async (c) => {
  try {
    const { email, password, fullName, gender } = await c.req.json();
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await c.env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(cleanEmail).first();
    if (existingUser) {
      return c.json({ success: false, error: 'An account with this email already exists. Please log in.' }, 400);
    }

    const userId = `usr_${Date.now()}`;
    const passwordHash = await hashPassword(password);
    const name = fullName?.trim() || cleanEmail.split('@')[0];
    const userGender = gender === 'female' ? 'female' : (gender === 'male' ? 'male' : (name.toLowerCase().includes('zainab') || name.toLowerCase().includes('fatima') || name.toLowerCase().includes('maryam') || name.toLowerCase().includes('aisha') ? 'female' : 'male'));
    const sessionToken = generateSessionToken(userId);

    await c.env.DB.prepare(`
      INSERT INTO users (id, phone, email, password_hash, full_name, dob, gender, location, marriage_timeline, blur_photos_by_default, is_profile_completed, current_session_token)
      VALUES (?, ?, ?, ?, ?, '1998-01-01', ?, 'Global', 'within_1_year', 0, 0, ?)
    `).bind(userId, cleanEmail, cleanEmail, passwordHash, name, userGender, sessionToken).run();

    return c.json({
      success: true,
      message: 'Account created successfully!',
      token: sessionToken,
      user: {
        id: userId,
        email: cleanEmail,
        fullName: name,
        gender: userGender,
        isNewUser: true,
        isProfileCompleted: false
      }
    });

  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Email + Password Log In
authRouter.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

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
      WHERE (LOWER(u.email) = ? OR u.phone = ? OR u.phone = ?) AND (u.password_hash = ? OR u.password_hash IS NULL)
    `).bind(cleanEmail, cleanEmail, email.trim(), passwordHash).first();

    if (!user) {
      return c.json({ success: false, error: 'Invalid email or password. Please try again.' }, 401);
    }

    if (user.account_status === 'banned' || user.is_banned === 1) {
      return c.json({
        success: false,
        error: 'Your account has been suspended by administration. If you believe this is a mistake, please contact support.',
        isBanned: true
      }, 403);
    }

    const { results: photos } = await c.env.DB.prepare(`
      SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC
    `).bind(user.id).all();

    const sessionToken = generateSessionToken(user.id);

    try {
      await c.env.DB.prepare(`
        UPDATE users SET current_session_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(sessionToken, user.id).run();
    } catch (sessionErr) {
      console.warn('Session token update notice:', sessionErr);
    }

    return c.json({
      success: true,
      message: 'Logged in successfully!',
      token: sessionToken,
      user: {
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
        wali: user.waliName ? { name: user.waliName, phone: user.waliPhone, relationship: user.waliRelationship } : null,
        isNewUser: false,
        isProfileCompleted: user.is_profile_completed === 1 || (user.is_profile_completed === null && user.location !== 'Global' && user.full_name !== 'New Member')
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Send Phone OTP
authRouter.post('/send-phone-otp', async (c) => {
  try {
    const { phone } = await c.req.json();
    if (!phone) {
      return c.json({ success: false, error: 'Phone number is required' }, 400);
    }

    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO phone_otps (phone, otp_code, expires_at, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(cleanPhone, otpCode, expiresAt).run();

    return c.json({
      success: true,
      message: `Verification code generated successfully for ${cleanPhone}`,
      otpPreview: otpCode
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Verify Phone OTP
authRouter.post('/verify-phone-otp', async (c) => {
  try {
    const { phone, otpCode, fullName } = await c.req.json();
    if (!phone || !otpCode) {
      return c.json({ success: false, error: 'Phone and OTP code are required' }, 400);
    }

    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const record: any = await c.env.DB.prepare(`
      SELECT * FROM phone_otps WHERE phone = ? AND otp_code = ?
    `).bind(cleanPhone, otpCode.trim()).first();

    if (!record) {
      return c.json({ success: false, error: 'Invalid verification code. Please try again.' }, 400);
    }

    let user: any = await c.env.DB.prepare(`SELECT * FROM users WHERE phone = ?`).bind(cleanPhone).first();
    let isNewUser = false;

    if (user && (user.account_status === 'banned' || user.is_banned === 1)) {
      return c.json({
        success: false,
        error: 'Your account has been suspended by administration. If you believe this is a mistake, please contact support.',
        isBanned: true
      }, 403);
    }

    if (!user) {
      isNewUser = true;
      const userId = `usr_${Date.now()}`;
      const name = fullName?.trim() || 'Muslim Seeker';

      await c.env.DB.prepare(`
        INSERT INTO users (id, phone, email, full_name, dob, gender, location, marriage_timeline, blur_photos_by_default, is_phone_verified)
        VALUES (?, ?, ?, ?, '1998-01-01', 'male', 'Global', 'within_1_year', 0, 1)
      `).bind(userId, cleanPhone, `${cleanPhone}@phone.sereneunion.com`, name).run();

      user = {
        id: userId,
        phone: cleanPhone,
        email: `${cleanPhone}@phone.sereneunion.com`,
        full_name: name
      };
    }

    await c.env.DB.prepare(`DELETE FROM phone_otps WHERE phone = ?`).bind(cleanPhone).run();
    const sessionToken = generateSessionToken(user.id);

    try {
      await c.env.DB.prepare(`
        UPDATE users SET current_session_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(sessionToken, user.id).run();
    } catch (sessionErr) {
      console.warn('Session token update notice:', sessionErr);
    }

    return c.json({
      success: true,
      message: 'Phone verified successfully!',
      token: sessionToken,
      user: {
        id: user.id,
        phone: cleanPhone,
        email: user.email,
        fullName: user.full_name || 'Member',
        isNewUser
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. Google Social Login Sync
authRouter.post('/google-login', async (c) => {
  try {
    const { email, fullName, photoUrl, googleUid, gender } = await c.req.json();
    if (!email) {
      return c.json({ success: false, error: 'Email is required from Google profile' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user: any = await c.env.DB.prepare(`
      SELECT u.*, 
             rp.practice_level as practiceLevel, rp.sect, rp.madhhab, 
             rp.prayer_frequency as prayerFrequency, rp.halal_diet as halalDiet,
             rp.quran_recitation as quranRecitation, rp.modesty_practice as modestyPractice,
             rp.hajj_umrah_status as hajjUmrahStatus, rp.deen_relationship_bio as deenBio,
             w.wali_name as waliName, w.wali_phone as waliPhone, w.wali_relationship as waliRelationship
      FROM users u
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE u.email = ?
    `).bind(cleanEmail).first();

    let isNewUser = false;

    if (user && (user.account_status === 'banned' || user.is_banned === 1)) {
      return c.json({
        success: false,
        error: 'Your account has been suspended by administration. If you believe this is a mistake, please contact support.',
        isBanned: true
      }, 403);
    }

    if (!user) {
      isNewUser = true;
      const userId = `usr_${Date.now()}`;
      const name = fullName?.trim() || cleanEmail.split('@')[0];
      const userGender = (gender === 'female' || gender === 'male') ? gender : 'male';

      await c.env.DB.prepare(`
        INSERT INTO users (id, phone, email, full_name, dob, gender, location, marriage_timeline, blur_photos_by_default, is_profile_completed)
        VALUES (?, ?, ?, ?, '1998-01-01', ?, 'Global', 'within_1_year', 0, 0)
      `).bind(userId, cleanEmail, cleanEmail, name, userGender).run();

      if (photoUrl) {
        await c.env.DB.prepare(`
          INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
          VALUES (?, ?, ?, 1, 1)
        `).bind(`p_${Date.now()}`, userId, photoUrl).run();
      }

      user = {
        id: userId,
        email: cleanEmail,
        full_name: name,
        dob: '1998-01-01',
        gender: userGender,
        location: 'Global',
        isNewUser: true,
        is_profile_completed: 0
      };
    }

    const { results: photos } = await c.env.DB.prepare(`
      SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC
    `).bind(user.id).all();

    const sessionToken = generateSessionToken(user.id);

    try {
      await c.env.DB.prepare(`
        UPDATE users SET current_session_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(sessionToken, user.id).run();
    } catch (sessionErr) {
      console.warn('Session token update notice:', sessionErr);
    }
    const isProfileCompleted = user.is_profile_completed === 1 || (user.is_profile_completed === null && user.location !== 'Global' && user.full_name !== 'New Member');
    const needsOnboarding = isNewUser || !isProfileCompleted;

    return c.json({
      success: true,
      message: isNewUser ? 'Welcome to Qurb! Profile initialized.' : 'Welcome back!',
      token: sessionToken,
      user: {
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
        photos: (photos || []).map((p: any) => p.photo_url),
        isNewUser: Boolean(isNewUser),
        isProfileCompleted,
        needsOnboarding
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Firebase Email Auth User Sync
authRouter.post('/email-sync', async (c) => {
  try {
    const { email, fullName, gender, firebaseUid, isSignUp, photoUrl } = await c.req.json();
    if (!email) {
      return c.json({ success: false, error: 'Email is required' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user: any = await c.env.DB.prepare(`
      SELECT u.*, 
             rp.practice_level as practiceLevel, rp.sect, rp.madhhab, 
             rp.prayer_frequency as prayerFrequency, rp.halal_diet as halalDiet,
             rp.quran_recitation as quranRecitation, rp.modesty_practice as modestyPractice,
             rp.hajj_umrah_status as hajjUmrahStatus, rp.deen_relationship_bio as deenBio,
             w.wali_name as waliName, w.wali_phone as waliPhone, w.wali_relationship as waliRelationship
      FROM users u
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE u.email = ?
    `).bind(cleanEmail).first();

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const userId = `usr_${Date.now()}`;
      const name = fullName?.trim() || cleanEmail.split('@')[0];
      const userGender = gender === 'female' ? 'female' : (gender === 'male' ? 'male' : (name.toLowerCase().includes('zainab') || name.toLowerCase().includes('fatima') || name.toLowerCase().includes('maryam') || name.toLowerCase().includes('aisha') ? 'female' : 'male'));

      await c.env.DB.prepare(`
        INSERT INTO users (id, phone, email, full_name, dob, gender, location, marriage_timeline, blur_photos_by_default, is_profile_completed)
        VALUES (?, ?, ?, ?, '1998-01-01', ?, 'Global', 'within_1_year', 0, 0)
      `).bind(userId, cleanEmail, cleanEmail, name, userGender).run();

      user = {
        id: userId,
        email: cleanEmail,
        full_name: name,
        dob: '1998-01-01',
        gender: userGender,
        location: 'Global',
        isNewUser: true,
        is_profile_completed: 0
      };
    }

    // Direct Profile Picture auto-save from Facebook/Google
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim().length > 0) {
      const cleanPhoto = photoUrl.trim();
      const existingPhoto: any = await c.env.DB.prepare(`
        SELECT id FROM user_photos WHERE user_id = ? LIMIT 1
      `).bind(user.id).first();

      if (!existingPhoto) {
        const photoId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await c.env.DB.prepare(`
          INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
          VALUES (?, ?, ?, 1, 1)
        `).bind(photoId, user.id, cleanPhoto).run();
      }
    }

    const { results: photos } = await c.env.DB.prepare(`
      SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC, sort_order ASC
    `).bind(user.id).all();

    const sessionToken = generateSessionToken(user.id);

    try {
      await c.env.DB.prepare(`
        UPDATE users SET current_session_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(sessionToken, user.id).run();
    } catch (sessionErr) {
      console.warn('Session token update notice:', sessionErr);
    }
    const isProfileCompleted = user.is_profile_completed === 1 || (user.is_profile_completed === null && user.location !== 'Global' && user.full_name !== 'New Member');
    const needsOnboarding = isNewUser || !isProfileCompleted;

    return c.json({
      success: true,
      message: isNewUser ? 'Account synchronized successfully!' : 'Welcome back!',
      token: sessionToken,
      user: {
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
        religiousProfile: user.practiceLevel ? {
          practiceLevel: user.practiceLevel,
          sect: user.sect,
          madhhab: user.madhhab,
          prayerFrequency: user.prayerFrequency,
          halalDiet: user.halalDiet,
          quranRecitation: user.quranRecitation,
          modestyPractice: user.modestyPractice,
          hajjUmrahStatus: user.hajjUmrahStatus,
          deenRelationshipBio: user.deenBio
        } : undefined,
        photos: (photos || []).map((p: any) => p.photo_url),
        wali: user.waliName ? { name: user.waliName, phone: user.waliPhone, relationship: user.waliRelationship } : null,
        isNewUser: Boolean(isNewUser),
        isProfileCompleted,
        needsOnboarding
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Strict Single Active Device Session Validation
authRouter.post('/validate-session', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') || '';
    const body = await c.req.json().catch(() => ({}));
    const token = body.token || authHeader.replace(/^Bearer\s+/i, '').trim();
    const userId = body.userId;

    if (!userId || !token) {
      return c.json({ success: false, error: 'userId and token are required' }, 400);
    }

    const user: any = await c.env.DB.prepare(`
      SELECT current_session_token, is_banned FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    if (user.is_banned) {
      return c.json({ success: false, code: 'USER_BANNED', error: 'Account has been suspended' }, 403);
    }

    if (user.current_session_token && user.current_session_token !== token) {
      return c.json({
        success: false,
        code: 'SESSION_TERMINATED_CONCURRENT_LOGIN',
        error: 'This account was opened on another device. For your security, you have been logged out of this session.'
      }, 401);
    }

    return c.json({ success: true, valid: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


