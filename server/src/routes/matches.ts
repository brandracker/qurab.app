import { Hono } from 'hono';
import type { AppContext } from '../types';
import { processAiSeedResponse } from '../utils/ai-chat-agent';

export const matchesRouter = new Hono<AppContext>();

// 1. Matches & Likes Action with True Mutual Match Detection & Conversation Creation
matchesRouter.post('/action', async (c) => {
  try {
    const { senderId, receiverId, action, messageText, isMutualMatch } = await c.req.json();
    if (!senderId || !receiverId || !action) {
      return c.json({ success: false, error: 'senderId, receiverId, and action are required' }, 400);
    }

    // Ensure both sender and receiver exist in users table to prevent SQLITE_CONSTRAINT_FOREIGNKEY errors
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES (?, 'member@sereneunion.app', '+00' || substr(abs(random()), 1, 10), 'Candidate', '1998-01-01', 'other', 'Global')
    `).bind(senderId).run();

    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES (?, 'member@sereneunion.app', '+00' || substr(abs(random()), 1, 10), 'Candidate', '1998-01-01', 'other', 'Global')
    `).bind(receiverId).run();

    const matchId = `mat_${senderId}_${receiverId}`;

    // Direct Salam handling (Instant conversation with custom Islamic greeting note)
    if (action === 'direct_salam') {
      const convId = `conv_${[senderId, receiverId].sort().join('_')}`;
      const introMessage = (messageText && typeof messageText === 'string' && messageText.trim().length > 0)
        ? messageText.trim()
        : 'Assalamu Alaikum! I would be honored to get to know your biodata for marriage.';

      // 1. Record Direct Salam action
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
        VALUES (?, ?, ?, 'direct_salam')
      `).bind(matchId, senderId, receiverId).run();

      // 2. Initialize Conversation in D1
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_sender_id, last_message_time)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(convId, senderId, receiverId, `logs/${convId}.jsonl`, introMessage, senderId).run();

      await c.env.DB.prepare(`
        UPDATE conversations
        SET last_message_text = ?,
            last_message_sender_id = ?,
            last_message_time = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(introMessage, senderId, convId).run();

      // 3. Insert initial message into chat_messages table (and legacy messages table)
      try {
        const msgId = `msg_salam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await c.env.DB.prepare(`
          INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
          VALUES (?, ?, ?, 'Member', ?)
        `).bind(msgId, convId, senderId, introMessage).run();

        await c.env.DB.prepare(`
          INSERT INTO messages (id, conversation_id, sender_id, text, wali_notified, created_at)
          VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        `).bind(msgId, convId, senderId, introMessage).run();
      } catch {}

      // 3b. Autonomous AI Agent: Auto-reply disabled per Admin configuration.
      // Responses are managed and dispatched on one-click via Admin Portal ("Reply All").

      // 4. Dispatch D1 notification to receiver
      try {
        const senderUser: any = await c.env.DB.prepare(`
          SELECT full_name as fullName, (SELECT photo_url FROM user_photos WHERE user_id = id ORDER BY is_primary DESC LIMIT 1) as photoUrl 
          FROM users WHERE id = ?
        `).bind(senderId).first();

        const notifId = `notif_salam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await c.env.DB.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, target_id, avatar_url, action_label, is_read)
          VALUES (?, ?, 'salam', ?, ?, ?, ?, 'Open Conversation', 0)
        `).bind(
          notifId,
          receiverId,
          `Direct Salam from ${senderUser?.fullName?.split(' ')[0] || 'A Suitor'} ✨`,
          `${senderUser?.fullName || 'Someone'} sent you a blessed Direct Salam: "${introMessage.length > 55 ? introMessage.substring(0, 55) + '...' : introMessage}"`,
          convId,
          senderUser?.photoUrl || null
        ).run();
      } catch {}

      return c.json({
        success: true,
        isMutual: false,
        conversationId: convId,
        message: 'Direct Salam sent successfully.'
      });
    }

    if (action === 'liked') {
      // Check if receiver has already liked the sender for a true mutual match or if client specified isMutualMatch
      const reverseLike: any = await c.env.DB.prepare(`
        SELECT id, action FROM matches_and_likes 
        WHERE sender_id = ? AND receiver_id = ? AND (action = 'liked' OR action = 'mutual_match' OR action = 'direct_salam')
      `).bind(receiverId, senderId).first();

      if (reverseLike || isMutualMatch) {
        // True Mutual Match!
        const convId = `conv_${[senderId, receiverId].sort().join('_')}`;

        // 1. Update both match records to mutual_match bidirectionally
        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
          VALUES (?, ?, ?, 'mutual_match')
        `).bind(matchId, senderId, receiverId).run();

        await c.env.DB.prepare(`
          INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
          VALUES (?, ?, ?, 'mutual_match')
        `).bind(`mat_${receiverId}_${senderId}`, receiverId, senderId).run();

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

// Reset passed profiles for user
matchesRouter.post('/reset-passed', async (c) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) return c.json({ success: false, error: 'userId required' }, 400);
    await c.env.DB.prepare(`DELETE FROM matches_and_likes WHERE sender_id = ? AND action = 'passed'`).bind(userId).run();
    return c.json({ success: true, message: 'Passed profiles reset successfully.' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 1.5 Fast Unified Matches Hub API (Single round-trip for received, mutual, sentLikes, passed, blocked)
matchesRouter.get('/hub', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({
        success: true,
        received: [],
        mutual: [],
        sentLikes: [],
        passed: [],
        blocked: []
      });
    }

    // Run parallel queries across D1
    const [receivedRes, mutualRes, sentLikesRes, passedRes, blockedRes] = await Promise.all([
      // A. Received likes / Direct salams
      c.env.DB.prepare(`
        SELECT 
          COALESCE(u.id, m.sender_id) as id,
          u.phone, u.email,
          COALESCE(u.full_name, 'Member') as fullName,
          COALESCE(u.dob, '1998-01-01') as dob,
          COALESCE(u.gender, 'other') as gender,
          COALESCE(u.location, 'Global') as location,
          u.city, u.country,
          COALESCE(u.profession, 'Professional') as profession,
          COALESCE(u.education, 'Graduate') as education,
          u.university,
          COALESCE(u.height, '180 cm') as height,
          COALESCE(u.ethnicity, 'Global') as ethnicity,
          COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline,
          COALESCE(u.bio, 'Seeking half my deen.') as bio,
          COALESCE(u.blur_photos_by_default, 1) as blurPhotosByDefault,
          m.action as matchAction,
          m.created_at as likedAt
        FROM matches_and_likes m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.receiver_id = ?
          AND (m.action = 'liked' OR m.action = 'direct_salam')
          AND m.sender_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
          AND m.sender_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
        ORDER BY m.created_at DESC
        LIMIT 50
      `).bind(userId, userId, userId).all(),

      // B. Mutual Matches
      c.env.DB.prepare(`
        SELECT 
          COALESCE(u.id, CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) as id,
          u.phone, u.email,
          COALESCE(u.full_name, 'Match') as fullName,
          COALESCE(u.dob, '1998-01-01') as dob,
          COALESCE(u.gender, 'other') as gender,
          COALESCE(u.location, 'Global') as location,
          u.city, u.country,
          COALESCE(u.profession, 'Professional') as profession,
          COALESCE(u.education, 'Graduate') as education,
          u.university,
          COALESCE(u.height, '180 cm') as height,
          COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline,
          COALESCE(u.bio, 'Connected on Qurb.') as bio,
          COALESCE(u.blur_photos_by_default, 1) as blurPhotosByDefault,
          m.created_at as matchedAt
        FROM matches_and_likes m
        LEFT JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
        WHERE (m.sender_id = ? OR m.receiver_id = ?)
          AND m.action = 'mutual_match'
          AND u.id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
          AND u.id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
        GROUP BY u.id
        ORDER BY m.created_at DESC
        LIMIT 50
      `).bind(userId, userId, userId, userId, userId, userId).all(),

      // C. Sent Likes
      c.env.DB.prepare(`
        SELECT 
          COALESCE(u.id, m.receiver_id) as id,
          COALESCE(u.full_name, 'Candidate') as fullName,
          COALESCE(u.location, 'Global') as location,
          COALESCE(u.profession, 'Professional') as profession,
          COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline,
          m.action, m.created_at as actionTime
        FROM matches_and_likes m
        LEFT JOIN users u ON m.receiver_id = u.id
        WHERE m.sender_id = ? AND (m.action = 'liked' OR m.action = 'mutual_match' OR m.action = 'direct_salam')
          AND m.receiver_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
          AND m.receiver_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
        ORDER BY m.created_at DESC
        LIMIT 60
      `).bind(userId, userId, userId).all(),

      // D. Passed Profiles
      c.env.DB.prepare(`
        SELECT 
          COALESCE(u.id, m.receiver_id) as id,
          COALESCE(u.full_name, 'Candidate') as fullName,
          COALESCE(u.location, 'Global') as location,
          COALESCE(u.profession, 'Professional') as profession,
          m.created_at as actionTime
        FROM matches_and_likes m
        LEFT JOIN users u ON m.receiver_id = u.id
        WHERE m.sender_id = ? AND m.action = 'passed'
          AND m.receiver_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
          AND m.receiver_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
        ORDER BY m.created_at DESC
        LIMIT 60
      `).bind(userId, userId, userId).all(),

      // E. Blocked Users
      c.env.DB.prepare(`
        SELECT 
          COALESCE(u.id, b.blocked_id) as id,
          COALESCE(u.full_name, 'Member') as fullName,
          COALESCE(u.location, 'Global') as location,
          COALESCE(b.reason, 'User requested block') as reason,
          b.created_at as actionTime
        FROM blocked_users b
        LEFT JOIN users u ON b.blocked_id = u.id
        WHERE b.blocker_id = ?
        ORDER BY b.created_at DESC
        LIMIT 50
      `).bind(userId).all()
    ]);

    // Consolidate all unique user IDs to fetch photos in a single query
    const allIds = new Set<string>();
    (receivedRes.results || []).forEach((r: any) => allIds.add(r.id));
    (mutualRes.results || []).forEach((r: any) => allIds.add(r.id));
    (sentLikesRes.results || []).forEach((r: any) => allIds.add(r.id));
    (passedRes.results || []).forEach((r: any) => allIds.add(r.id));

    const idList = Array.from(allIds).filter(Boolean);
    const photoMap: Record<string, string[]> = {};

    if (idList.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < idList.length; i += chunkSize) {
        const chunk = idList.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: photos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();

        (photos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = [];
          if (photoMap[p.user_id].length < 2) {
            photoMap[p.user_id].push(p.photo_url);
          }
        });
      }
    }

    const resolveSeedPhoto = (id: string, existingPhotos: string[]) => {
      if (existingPhotos && existingPhotos.length > 0) return existingPhotos;
      if (!id) return [];
      if (id.startsWith('seed_female_') || id.startsWith('seed_male_')) {
        return [`/seeds/${id}.jpg`];
      }
      if (id.startsWith('usr_seed_pk_')) {
        const num = parseInt(id.replace('usr_seed_pk_', ''), 10);
        return [`/seeds/seed_female_${num}.jpg`];
      }
      return [];
    };

    const mapCandidate = (row: any) => {
      const birthYear = new Date(row.dob || '1998-01-01').getFullYear();
      const age = new Date().getFullYear() - (birthYear || 1998);
      const photos = resolveSeedPhoto(row.id, photoMap[row.id] || []);
      return {
        ...row,
        age: age || 26,
        photos
      };
    };

    return c.json({
      success: true,
      received: (receivedRes.results || []).map(mapCandidate),
      mutual: (mutualRes.results || []).map(mapCandidate),
      sentLikes: (sentLikesRes.results || []).map((row: any) => ({
        ...row,
        photos: resolveSeedPhoto(row.id, photoMap[row.id] || [])
      })),
      passed: (passedRes.results || []).map((row: any) => ({
        ...row,
        photos: resolveSeedPhoto(row.id, photoMap[row.id] || [])
      })),
      blocked: blockedRes.results || []
    });
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
        COALESCE(u.id, m.sender_id) as id, 
        u.phone, u.email, 
        COALESCE(u.full_name, 'Member') as fullName, 
        COALESCE(u.dob, '1998-01-01') as dob, 
        COALESCE(u.gender, 'other') as gender, 
        COALESCE(u.location, 'Global') as location, 
        u.city, u.country, 
        COALESCE(u.profession, 'Professional') as profession, 
        COALESCE(u.education, 'Graduate') as education, 
        u.university, 
        COALESCE(u.height, '180 cm') as height, 
        COALESCE(u.ethnicity, 'Global') as ethnicity, 
        COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline, 
        COALESCE(u.bio, 'Seeking half my deen.') as bio, 
        COALESCE(u.family_structure, 'nuclear') as familyStructure, 
        COALESCE(u.living_preference, 'independent') as livingPreference,
        COALESCE(u.siblings_count, 0) as siblingsCount, 
        COALESCE(u.willingness_to_relocate, 'open') as willingnessToRelocate,
        COALESCE(u.smoking_status, 'non_smoker') as smokingStatus, 
        COALESCE(u.languages_spoken, 'English, Urdu') as languagesSpoken,
        COALESCE(u.mahr_philosophy, 'mutual_agreement') as mahrPhilosophy, 
        COALESCE(u.children_desire, 'desires_children') as childrenDesire,
        COALESCE(u.blur_photos_by_default, 1) as blurPhotosByDefault, 
        COALESCE(u.profile_visibility, 'all_users') as profileVisibility,
        rp.practice_level as practiceLevel, rp.sect, rp.madhhab, rp.prayer_frequency as prayerFrequency, 
        rp.halal_diet as halalDiet, rp.quran_recitation as quranRecitation,
        rp.modesty_practice as modestyPractice, rp.hajj_umrah_status as hajjUmrahStatus,
        rp.deen_relationship_bio as deenRelationshipBio,
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone, w.is_verified as waliVerified,
        m.action as matchAction,
        m.created_at as likedAt
      FROM matches_and_likes m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE m.receiver_id = ? 
        AND (m.action = 'liked' OR m.action = 'direct_salam')
        AND m.sender_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
        AND m.sender_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
      ORDER BY m.created_at DESC
    `;

    const { results } = await c.env.DB.prepare(query).bind(userId, userId, userId).all();

    // Fetch photos
    const userIds = (results || []).map((r: any) => r.id);
    let photoMap: Record<string, string[]> = {};

    if (userIds.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: chunkPhotos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();

        (chunkPhotos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = [];
          if (photoMap[p.user_id].length < 1) {
            photoMap[p.user_id].push(p.photo_url);
          }
        });
      }
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
        photos: userPhotos.length > 0 ? userPhotos : [],
        action: row.matchAction || 'liked',
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
        COALESCE(u.id, CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) as id, 
        u.phone, u.email, 
        COALESCE(u.full_name, 'Member') as fullName, 
        COALESCE(u.dob, '1998-01-01') as dob, 
        COALESCE(u.gender, 'other') as gender, 
        COALESCE(u.location, 'Global') as location, 
        u.city, u.country, 
        COALESCE(u.profession, 'Professional') as profession, 
        COALESCE(u.education, 'Graduate') as education, 
        u.university, 
        COALESCE(u.height, '180 cm') as height, 
        COALESCE(u.ethnicity, 'Global') as ethnicity, 
        COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline, 
        COALESCE(u.bio, 'Seeking half my deen.') as bio, 
        COALESCE(u.family_structure, 'nuclear') as familyStructure, 
        COALESCE(u.living_preference, 'independent') as livingPreference,
        COALESCE(u.siblings_count, 0) as siblingsCount, 
        COALESCE(u.willingness_to_relocate, 'open') as willingnessToRelocate,
        COALESCE(u.smoking_status, 'non_smoker') as smokingStatus, 
        COALESCE(u.languages_spoken, 'English, Urdu') as languagesSpoken,
        COALESCE(u.mahr_philosophy, 'mutual_agreement') as mahrPhilosophy, 
        COALESCE(u.children_desire, 'desires_children') as childrenDesire,
        COALESCE(u.blur_photos_by_default, 1) as blurPhotosByDefault, 
        COALESCE(u.profile_visibility, 'all_users') as profileVisibility,
        rp.practice_level as practiceLevel, rp.sect, rp.madhhab, rp.prayer_frequency as prayerFrequency, 
        rp.halal_diet as halalDiet, rp.quran_recitation as quranRecitation,
        rp.modesty_practice as modestyPractice, rp.hajj_umrah_status as hajjUmrahStatus,
        rp.deen_relationship_bio as deenRelationshipBio,
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone, w.is_verified as waliVerified
      FROM matches_and_likes m
      LEFT JOIN users u ON (m.sender_id = u.id OR m.receiver_id = u.id) AND u.id != ?
      LEFT JOIN religious_profiles rp ON u.id = rp.user_id
      LEFT JOIN wali_details w ON u.id = w.user_id
      WHERE (m.sender_id = ? OR m.receiver_id = ?) 
        AND (
          m.action = 'mutual_match' 
          OR ((m.action = 'liked' OR m.action = 'direct_salam') AND EXISTS (
            SELECT 1 FROM matches_and_likes m2 
            WHERE m2.sender_id = m.receiver_id AND m2.receiver_id = m.sender_id AND (m2.action = 'liked' OR m2.action = 'mutual_match' OR m2.action = 'direct_salam')
          ))
        )
        AND u.id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
        AND u.id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
      ORDER BY m.created_at DESC
    `;

    const { results } = await c.env.DB.prepare(query).bind(userId, userId, userId, userId, userId, userId).all();

    // Fetch photos
    const userIds = (results || []).map((r: any) => r.id);
    let photoMap: Record<string, string[]> = {};

    if (userIds.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: chunkPhotos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();

        (chunkPhotos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = [];
          if (photoMap[p.user_id].length < 1) {
            photoMap[p.user_id].push(p.photo_url);
          }
        });
      }
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
        photos: userPhotos.length > 0 ? userPhotos : [],
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
        COALESCE(u.id, m.receiver_id) as id, 
        COALESCE(u.full_name, 'Candidate') as fullName, 
        COALESCE(u.location, 'Global') as location, 
        COALESCE(u.profession, 'Professional') as profession, 
        COALESCE(u.marriage_timeline, 'within_1_year') as marriageTimeline,
        (SELECT photo_url FROM user_photos WHERE user_id = u.id ORDER BY is_primary DESC LIMIT 1) as photoUrl,
        m.action, m.created_at as actionTime
      FROM matches_and_likes m
      LEFT JOIN users u ON m.receiver_id = u.id
      WHERE m.sender_id = ? AND (m.action = 'liked' OR m.action = 'mutual_match' OR m.action = 'direct_salam')
        AND m.receiver_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
        AND m.receiver_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
      ORDER BY m.created_at DESC
    `).bind(userId, userId, userId).all();

    const resolveActivityPhoto = (id: string, photoUrl: string | null) => {
      if (photoUrl) return [photoUrl];
      if (!id) return [];
      if (id.startsWith('seed_female_') || id.startsWith('seed_male_')) {
        return [`/seeds/${id}.jpg`];
      }
      if (id.startsWith('usr_seed_pk_')) {
        const num = parseInt(id.replace('usr_seed_pk_', ''), 10);
        return [`/seeds/seed_female_${num}.jpg`];
      }
      return [];
    };

    const sentLikes = (sentLikesRows || []).map((row: any) => ({
      id: row.id,
      fullName: row.fullName,
      location: row.location,
      profession: row.profession,
      marriageTimeline: row.marriageTimeline,
      action: row.action,
      actionTime: row.actionTime,
      photos: resolveActivityPhoto(row.id, row.photoUrl)
    }));

    // B. Passed Profiles
    const { results: passedRows } = await c.env.DB.prepare(`
      SELECT 
        COALESCE(u.id, m.receiver_id) as id,
        COALESCE(u.full_name, 'Candidate') as fullName,
        COALESCE(u.location, 'Global') as location,
        COALESCE(u.profession, 'Professional') as profession,
        (SELECT photo_url FROM user_photos WHERE user_id = u.id ORDER BY is_primary DESC LIMIT 1) as photoUrl,
        m.created_at as actionTime
      FROM matches_and_likes m
      LEFT JOIN users u ON m.receiver_id = u.id
      WHERE m.sender_id = ? AND m.action = 'passed'
        AND m.receiver_id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
        AND m.receiver_id NOT IN (SELECT blocker_id FROM blocked_users WHERE blocked_id = ?)
      ORDER BY m.created_at DESC
    `).bind(userId, userId, userId).all();

    const passed = (passedRows || []).map((row: any) => ({
      id: row.id,
      fullName: row.fullName,
      location: row.location,
      profession: row.profession,
      actionTime: row.actionTime,
      photos: resolveActivityPhoto(row.id, row.photoUrl)
    }));

    // C. Blocked Users
    const { results: blocked } = await c.env.DB.prepare(`
      SELECT 
        COALESCE(u.id, b.blocked_id) as id,
        COALESCE(u.full_name, 'Member') as fullName,
        COALESCE(u.location, 'Global') as location,
        COALESCE(b.reason, 'User requested block') as reason,
        b.created_at as actionTime
      FROM blocked_users b
      LEFT JOIN users u ON b.blocked_id = u.id
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

// 5. Migrate Guest Activities to Newly Logged-In User
matchesRouter.post('/migrate-guest', async (c) => {
  try {
    const { guestId, authenticatedId } = await c.req.json();
    if (!guestId || !authenticatedId || guestId === authenticatedId) {
      return c.json({ success: false, error: 'Valid guestId and authenticatedId are required' }, 400);
    }

    // Ensure authenticated user exists in users table
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES (?, 'member@sereneunion.app', '+00' || substr(abs(random()), 1, 10), 'Member', '1998-01-01', 'other', 'Global')
    `).bind(authenticatedId).run();

    // Delete conflicting matches where authenticatedId already acted on receiver
    await c.env.DB.prepare(`
      DELETE FROM matches_and_likes 
      WHERE sender_id = ? AND receiver_id IN (SELECT receiver_id FROM matches_and_likes WHERE sender_id = ?)
    `).bind(authenticatedId, guestId).run();

    // Migrate matches_and_likes
    await c.env.DB.prepare(`
      UPDATE matches_and_likes 
      SET sender_id = ?, id = 'mat_' || ? || '_' || receiver_id 
      WHERE sender_id = ?
    `).bind(authenticatedId, authenticatedId, guestId).run();

    // Delete conflicting blocks
    await c.env.DB.prepare(`
      DELETE FROM blocked_users 
      WHERE blocker_id = ? AND blocked_id IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
    `).bind(authenticatedId, guestId).run();

    // Migrate blocked_users
    await c.env.DB.prepare(`
      UPDATE blocked_users 
      SET blocker_id = ?, id = 'blk_' || ? || '_' || blocked_id 
      WHERE blocker_id = ?
    `).bind(authenticatedId, authenticatedId, guestId).run();

    return c.json({ success: true, message: 'Guest activities migrated successfully.' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
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

    // Ensure users exist to satisfy foreign key constraints
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES (?, 'member@sereneunion.app', '+00' || substr(abs(random()), 1, 10), 'Member', '1998-01-01', 'other', 'Global')
    `).bind(userId).run();

    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, email, phone, full_name, dob, gender, location)
      VALUES (?, 'member@sereneunion.app', '+00' || substr(abs(random()), 1, 10), 'Member', '1998-01-01', 'other', 'Global')
    `).bind(targetId).run();

    const blockId = `blk_${userId}_${targetId}`;
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO blocked_users (id, blocker_id, blocked_id, reason)
      VALUES (?, ?, ?, ?)
    `).bind(blockId, userId, targetId, reason || 'User requested block').run();

    // Mark in matches_and_likes bidirectionally
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES (?, ?, ?, 'blocked')
    `).bind(`mat_${userId}_${targetId}`, userId, targetId).run();

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES (?, ?, ?, 'blocked')
    `).bind(`mat_${targetId}_${userId}`, targetId, userId).run();

    // Delete active conversation row from D1 so it is immediately removed from live polling
    const convId = `conv_${[userId, targetId].sort().join('_')}`;
    await c.env.DB.prepare(`
      DELETE FROM conversations 
      WHERE id = ? 
         OR (participant_one = ? AND participant_two = ?) 
         OR (participant_one = ? AND participant_two = ?)
    `).bind(convId, userId, targetId, targetId, userId).run();

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

