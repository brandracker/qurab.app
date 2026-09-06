import { Hono } from 'hono';
import type { AppContext } from '../types';

export const matchesRouter = new Hono<AppContext>();

// 1. Matches & Likes Action with True Mutual Match Detection & Conversation Creation
matchesRouter.post('/action', async (c) => {
  try {
    const { senderId, receiverId, action } = await c.req.json();
    if (!senderId || !receiverId || !action) {
      return c.json({ success: false, error: 'senderId, receiverId, and action are required' }, 400);
    }

    const matchId = `mat_${senderId}_${receiverId}`;

    if (action === 'liked') {
      // Check if receiver has already liked the sender for a true mutual match
      const reverseLike: any = await c.env.DB.prepare(`
        SELECT id, action FROM matches_and_likes 
        WHERE sender_id = ? AND receiver_id = ? AND (action = 'liked' OR action = 'mutual_match')
      `).bind(receiverId, senderId).first();

      if (reverseLike) {
        // True Mutual Match!
        const convId = `conv_${[senderId, receiverId].sort().join('_')}`;

        // 1. Update both match records to mutual_match
        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
          VALUES (?, ?, ?, 'mutual_match')
        `).bind(matchId, senderId, receiverId).run();

        await c.env.DB.prepare(`
          UPDATE matches_and_likes SET action = 'mutual_match' 
          WHERE sender_id = ? AND receiver_id = ?
        `).bind(receiverId, senderId).run();

        // 2. Automatically create conversation in D1
        await c.env.DB.prepare(`
          INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
          VALUES (?, ?, ?, ?, 'You matched! Start with Bismillah.', CURRENT_TIMESTAMP)
        `).bind(convId, senderId, receiverId, `logs/${convId}.jsonl`).run();

        // 3. Centralized Notifications in D1 for both users
        try {
          const senderUser: any = await c.env.DB.prepare(`SELECT full_name as fullName, (SELECT photo_url FROM user_photos WHERE user_id = id ORDER BY is_primary DESC LIMIT 1) as photoUrl FROM users WHERE id = ?`).bind(senderId).first();
          const receiverUser: any = await c.env.DB.prepare(`SELECT full_name as fullName, (SELECT photo_url FROM user_photos WHERE user_id = id ORDER BY is_primary DESC LIMIT 1) as photoUrl FROM users WHERE id = ?`).bind(receiverId).first();

          const notifOne = `notif_m_${Date.now()}_1`;
          const notifTwo = `notif_m_${Date.now()}_2`;

          await c.env.DB.prepare(`
            INSERT INTO notifications (id, user_id, type, title, message, target_id, avatar_url, action_label, is_read)
            VALUES (?, ?, 'match', ?, ?, ?, ?, 'Start Chat', 0)
          `).bind(notifOne, senderId, `Connected with ${receiverUser?.fullName?.split(' ')[0] || 'Match'} 🎉`, `You and ${receiverUser?.fullName || 'a member'} both expressed mutual interest. Chat is unlocked!`, convId, receiverUser?.photoUrl || null).run();

          await c.env.DB.prepare(`
            INSERT INTO notifications (id, user_id, type, title, message, target_id, avatar_url, action_label, is_read)
            VALUES (?, ?, 'match', ?, ?, ?, ?, 'Start Chat', 0)
          `).bind(notifTwo, receiverId, `Connected with ${senderUser?.fullName?.split(' ')[0] || 'Match'} 🎉`, `You and ${senderUser?.fullName || 'a member'} both expressed mutual interest. Chat is unlocked!`, convId, senderUser?.photoUrl || null).run();
        } catch {}

        return c.json({
          success: true,
          isMutual: true,
          conversationId: convId,
          message: "Alhamdulillah! It's a mutual match!"
        });
      }

      // One-sided Like
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
        VALUES (?, ?, ?, 'liked')
      `).bind(matchId, senderId, receiverId).run();

      // Dispatch D1 notification to receiver
      try {
        const senderUser: any = await c.env.DB.prepare(`SELECT full_name as fullName, (SELECT photo_url FROM user_photos WHERE user_id = id ORDER BY is_primary DESC LIMIT 1) as photoUrl FROM users WHERE id = ?`).bind(senderId).first();
        const notifId = `notif_like_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await c.env.DB.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, target_id, avatar_url, action_label, is_read)
          VALUES (?, ?, 'like', ?, ?, ?, ?, 'View in Matches', 0)
        `).bind(
          notifId,
          receiverId,
          `Interest Expressed by ${senderUser?.fullName?.split(' ')[0] || 'A Member'}`,
          `${senderUser?.fullName || 'Someone'} expressed matrimonial interest in your biodata.`,
          senderId,
          senderUser?.photoUrl || null
        ).run();
      } catch {}

      return c.json({
        success: true,
        isMutual: false,
        conversationId: null,
        message: 'Interest expressed successfully.'
      });
    }

    // Passed / Dismissed
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES (?, ?, ?, ?)
    `).bind(matchId, senderId, receiverId, action).run();

    return c.json({ success: true, isMutual: false });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Get Real Candidates Who Liked Current User ("Liked You" Feed)
matchesRouter.get('/received', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

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
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone, w.is_verified as waliVerified,
        m.created_at as likedAt
      FROM matches_and_likes m
      JOIN users u ON m.sender_id = u.id
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE m.receiver_id = ? AND m.action = 'liked'
      ORDER BY m.created_at DESC
    `;

    const { results } = await c.env.DB.prepare(query).bind(userId).all();

    // Fetch photos
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
        likedAt: row.likedAt
      };
    });

    return c.json({ success: true, count: formatted.length, candidates: formatted });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Get Confirmed Mutual Matches
matchesRouter.get('/mutual', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    const query = `
      SELECT DISTINCT
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
      FROM matches_and_likes m
      JOIN users u ON (m.sender_id = u.id OR m.receiver_id = u.id) AND u.id != ?
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE (m.sender_id = ? OR m.receiver_id = ?) 
        AND (
          m.action = 'mutual_match' 
          OR (m.action = 'liked' AND EXISTS (
            SELECT 1 FROM matches_and_likes m2 
            WHERE m2.sender_id = m.receiver_id AND m2.receiver_id = m.sender_id AND (m2.action = 'liked' OR m2.action = 'mutual_match')
          ))
        )
      ORDER BY m.created_at DESC
    `;

    const { results } = await c.env.DB.prepare(query).bind(userId, userId, userId).all();

    // Fetch photos
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
        } : null
      };
    });

    return c.json({ success: true, count: formatted.length, matches: formatted });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Full Activity Hub (Sent Likes, Mutual Matches, Passed History, Blocked List)
matchesRouter.get('/activity', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    // A. Sent Likes
    const { results: sentLikesRows } = await c.env.DB.prepare(`
      SELECT 
        u.id, u.full_name as fullName, u.location, u.profession, u.marriage_timeline as marriageTimeline,
        (SELECT photo_url FROM user_photos WHERE user_id = u.id ORDER BY is_primary DESC LIMIT 1) as photoUrl,
        m.action, m.created_at as actionTime
      FROM matches_and_likes m
      JOIN users u ON m.receiver_id = u.id
      WHERE m.sender_id = ? AND (m.action = 'liked' OR m.action = 'mutual_match')
      ORDER BY m.created_at DESC
    `).bind(userId).all();

    const sentLikes = (sentLikesRows || []).map((row: any) => ({
      id: row.id,
      fullName: row.fullName,
      location: row.location,
      profession: row.profession,
      marriageTimeline: row.marriageTimeline,
      action: row.action,
      actionTime: row.actionTime,
      photos: row.photoUrl ? [row.photoUrl] : []
    }));

    // B. Passed Profiles
    const { results: passed } = await c.env.DB.prepare(`
      SELECT 
        u.id, u.full_name as fullName, u.location, u.profession,
        m.created_at as actionTime
      FROM matches_and_likes m
      JOIN users u ON m.receiver_id = u.id
      WHERE m.sender_id = ? AND m.action = 'passed'
      ORDER BY m.created_at DESC
    `).bind(userId).all();

    // C. Blocked Users
    const { results: blocked } = await c.env.DB.prepare(`
      SELECT 
        u.id, u.full_name as fullName, u.location, b.reason, b.created_at as actionTime
      FROM blocked_users b
      JOIN users u ON b.blocked_id = u.id
      WHERE b.blocker_id = ?
      ORDER BY b.created_at DESC
    `).bind(userId).all();

    return c.json({
      success: true,
      sentLikes: sentLikes || [],
      passed: passed || [],
      blocked: blocked || []
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. Undo a Passed Profile
matchesRouter.post('/undo-pass', async (c) => {
  try {
    const { userId, targetId } = await c.req.json();
    if (!userId || !targetId) {
      return c.json({ success: false, error: 'userId and targetId are required' }, 400);
    }

    await c.env.DB.prepare(`
      DELETE FROM matches_and_likes 
      WHERE sender_id = ? AND receiver_id = ? AND action = 'passed'
    `).bind(userId, targetId).run();

    return c.json({ success: true, message: 'Pass action undone successfully. Profile will reappear in your Discover feed.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Block a Profile
matchesRouter.post('/block', async (c) => {
  try {
    const { userId, targetId, reason } = await c.req.json();
    if (!userId || !targetId) {
      return c.json({ success: false, error: 'userId and targetId are required' }, 400);
    }

    const blockId = `blk_${userId}_${targetId}`;
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO blocked_users (id, blocker_id, blocked_id, reason)
      VALUES (?, ?, ?, ?)
    `).bind(blockId, userId, targetId, reason || 'User requested block').run();

    // Mark in matches_and_likes
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES (?, ?, ?, 'blocked')
    `).bind(`mat_${userId}_${targetId}`, userId, targetId).run();

    return c.json({ success: true, message: 'Profile blocked successfully.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7. Unblock a Profile
matchesRouter.post('/unblock', async (c) => {
  try {
    const { userId, targetId } = await c.req.json();
    if (!userId || !targetId) {
      return c.json({ success: false, error: 'userId and targetId are required' }, 400);
    }

    // A. Delete block entry
    await c.env.DB.prepare(`
      DELETE FROM blocked_users 
      WHERE blocker_id = ? AND blocked_id = ?
    `).bind(userId, targetId).run();

    // B. Wipe matches_and_likes records in both directions so candidates become fresh
    await c.env.DB.prepare(`
      DELETE FROM matches_and_likes 
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
    `).bind(userId, targetId, targetId, userId).run();

    // C. Clean up any stale conversation row in D1
    const convId = `conv_${[userId, targetId].sort().join('_')}`;
    await c.env.DB.prepare(`
      DELETE FROM conversations 
      WHERE id = ? 
         OR (participant_one = ? AND participant_two = ?) 
         OR (participant_one = ? AND participant_two = ?)
    `).bind(convId, userId, targetId, targetId, userId).run();

    return c.json({ success: true, message: 'Profile unblocked successfully and reset as fresh candidate.' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

