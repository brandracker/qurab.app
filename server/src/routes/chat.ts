import { Hono } from 'hono';
import type { AppContext } from '../types';
import { sendFcmNotification } from '../utils/fcm';
import { processAiSeedResponse } from '../utils/ai-chat-agent';

export const chatRouter = new Hono<AppContext>();

// 1. Get Conversations for User (with rich otherUser payload and auto mutual-match sync)
chatRouter.get('/', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({ success: true, conversations: [] });
    }

    // Auto-ensure any confirmed mutual matches have a conversation initialized
    try {
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
        SELECT 
          'conv_' || CASE WHEN m.sender_id < m.receiver_id THEN m.sender_id || '_' || m.receiver_id ELSE m.receiver_id || '_' || m.sender_id END,
          m.sender_id,
          m.receiver_id,
          'logs/conv.jsonl',
          'You matched! Start with Bismillah.',
          m.created_at
        FROM matches_and_likes m
        WHERE (m.sender_id = ? OR m.receiver_id = ?) 
          AND (
            m.action = 'mutual_match' 
            OR (m.action = 'liked' AND EXISTS (
              SELECT 1 FROM matches_and_likes m2 
              WHERE m2.sender_id = m.receiver_id AND m2.receiver_id = m.sender_id AND (m2.action = 'liked' OR m2.action = 'mutual_match')
            ))
          )
      `).bind(userId, userId).run();
    } catch {}

    const { results } = await c.env.DB.prepare(`
      SELECT c.*, 
        u1.full_name as p1_name, u2.full_name as p2_name,
        u1.gender as p1_gender, u2.gender as p2_gender,
        u1.dob as p1_dob, u2.dob as p2_dob,
        u1.location as p1_location, u2.location as p2_location,
        u1.city as p1_city, u2.city as p2_city,
        u1.country as p1_country, u2.country as p2_country,
        u1.profession as p1_profession, u2.profession as p2_profession,
        u1.education as p1_education, u2.education as p2_education,
        u1.university as p1_university, u2.university as p2_university,
        u1.height as p1_height, u2.height as p2_height,
        u1.marriage_timeline as p1_timeline, u2.marriage_timeline as p2_timeline,
        u1.bio as p1_bio, u2.bio as p2_bio,
        u1.blur_photos_by_default as p1_blur, u2.blur_photos_by_default as p2_blur,
        w1.wali_name as w1_wali_name, w2.wali_name as w2_wali_name,
        w1.wali_relationship as w1_wali_rel, w2.wali_relationship as w2_wali_rel,
        rp1.sect as p1_sect, rp2.sect as p2_sect,
        rp1.madhhab as p1_madhhab, rp2.madhhab as p2_madhhab,
        rp1.practice_level as p1_practice, rp2.practice_level as p2_practice,
        rp1.prayer_frequency as p1_prayer, rp2.prayer_frequency as p2_prayer
      FROM conversations c
      LEFT JOIN users u1 ON c.participant_one = u1.id
      LEFT JOIN users u2 ON c.participant_two = u2.id
      LEFT JOIN wali_details w1 ON u1.id = w1.user_id
      LEFT JOIN wali_details w2 ON u2.id = w2.user_id
      LEFT JOIN religious_profiles rp1 ON u1.id = rp1.user_id
      LEFT JOIN religious_profiles rp2 ON u2.id = rp2.user_id
      WHERE (c.participant_one = ? OR c.participant_two = ?)
        AND NOT EXISTS (
          SELECT 1 FROM blocked_users b
          WHERE (b.blocker_id = c.participant_one AND b.blocked_id = c.participant_two)
             OR (b.blocker_id = c.participant_two AND b.blocked_id = c.participant_one)
        )
      ORDER BY c.last_message_time DESC
    `).bind(userId, userId).all();

    // Fetch primary photos for all conversation partners in bulk
    const partnerIds: string[] = [];
    (results || []).forEach((row: any) => {
      const isUserP1 = row.participant_one === userId;
      const otherId = isUserP1 ? row.participant_two : row.participant_one;
      if (otherId && !partnerIds.includes(otherId)) partnerIds.push(otherId);
    });

    const photoMap: Record<string, string[]> = {};
    if (partnerIds.length > 0) {
      const placeholders = partnerIds.map(() => '?').join(',');
      const { results: photos } = await c.env.DB.prepare(`
        SELECT user_id, photo_url FROM user_photos
        WHERE user_id IN (${placeholders})
        ORDER BY is_primary DESC, sort_order ASC
      `).bind(...partnerIds).all();

      (photos || []).forEach((p: any) => {
        if (!photoMap[p.user_id]) photoMap[p.user_id] = [];
        if (photoMap[p.user_id].length < 1) {
          photoMap[p.user_id].push(p.photo_url);
        }
      });
    }

    // Fetch 1-to-1 photo reveals between currentUser and conversation partners from Cloudflare D1
    const partnerRevealedSet = new Set<string>();
    const myRevealedSet = new Set<string>();

    if (partnerIds.length > 0) {
      try {
        const placeholders = partnerIds.map(() => '?').join(',');
        const { results: reveals } = await c.env.DB.prepare(`
          SELECT owner_id, viewer_id FROM photo_reveals
          WHERE (owner_id IN (${placeholders}) AND viewer_id = ?)
             OR (owner_id = ? AND viewer_id IN (${placeholders}))
        `).bind(...partnerIds, userId, userId, ...partnerIds).all();

        (reveals || []).forEach((r: any) => {
          if (r.viewer_id === userId) partnerRevealedSet.add(r.owner_id);
          if (r.owner_id === userId) myRevealedSet.add(r.viewer_id);
        });
      } catch {}
    }

    // Map to rich user-friendly payload
    const formatted = (results || []).map((row: any) => {
      const isUserP1 = row.participant_one === userId;
      const otherId = isUserP1 ? row.participant_two : row.participant_one;
      const otherName = isUserP1 ? row.p2_name : row.p1_name;
      const otherGender = isUserP1 ? row.p2_gender : row.p1_gender;
      const otherDob = isUserP1 ? row.p2_dob : row.p1_dob;
      const otherLocation = isUserP1 ? row.p2_location : row.p1_location;
      const otherCity = isUserP1 ? row.p2_city : row.p1_city;
      const otherCountry = isUserP1 ? row.p2_country : row.p1_country;
      const otherProfession = isUserP1 ? row.p2_profession : row.p1_profession;
      const otherEducation = isUserP1 ? row.p2_education : row.p1_education;
      const otherUniversity = isUserP1 ? row.p2_university : row.p1_university;
      const otherHeight = isUserP1 ? row.p2_height : row.p1_height;
      const otherTimeline = isUserP1 ? row.p2_timeline : row.p1_timeline;
      const otherBio = isUserP1 ? row.p2_bio : row.p1_bio;
      const otherBlur = isUserP1 ? Boolean(row.p2_blur) : Boolean(row.p1_blur);
      const otherWaliName = isUserP1 ? row.w2_wali_name : row.w1_wali_name;
      const otherWaliRel = isUserP1 ? row.w2_wali_rel : row.w1_wali_rel;
      const otherSect = isUserP1 ? row.p2_sect : row.p1_sect;
      const otherMadhhab = isUserP1 ? row.p2_madhhab : row.p1_madhhab;
      const otherPractice = isUserP1 ? row.p2_practice : row.p1_practice;
      const otherPrayer = isUserP1 ? row.p2_prayer : row.p1_prayer;

      const birthYear = otherDob ? new Date(otherDob).getFullYear() : 1998;
      const age = new Date().getFullYear() - (birthYear || 1998);
      const userPhotos = photoMap[otherId] || [];
      const isPhotoRevealed = partnerRevealedSet.has(otherId);
      const hasRevealedToPartner = myRevealedSet.has(otherId);
      const unreadCount = isUserP1 ? (row.unread_count_p1 || 0) : (row.unread_count_p2 || 0);

      return {
        id: row.id,
        participantOne: row.participant_one,
        participantTwo: row.participant_two,
        lastMessageText: row.last_message_text || 'You matched! Start with Bismillah.',
        lastMessageSenderId: row.last_message_sender_id,
        lastMessageTime: row.last_message_time,
        unreadCount,
        status: row.status || 'active',
        hasRevealedToPartner,
        otherUser: {
          id: otherId,
          fullName: otherName || 'Muslim Seeker',
          age: age || 26,
          gender: otherGender || 'female',
          location: otherLocation || 'Global',
          city: otherCity,
          country: otherCountry,
          profession: otherProfession || 'Professional',
          education: otherEducation || 'Graduate',
          university: otherUniversity || '',
          height: otherHeight || "5'10\"",
          marriageTimeline: otherTimeline || 'within_1_year',
          bio: otherBio || 'Seeking half my deen.',
          blurPhotosByDefault: otherBlur,
          isPhotoRevealed,
          hasRevealedToPartner,
          photos: userPhotos.length > 0 ? userPhotos : [],
          religiousProfile: {
            sect: otherSect || 'Sunni',
            madhhab: otherMadhhab || 'Hanafi',
            practiceLevel: otherPractice || 'practicing',
            prayerFrequency: otherPrayer || '5 times daily',
            halalDiet: 'Strictly Halal'
          },
          wali: otherWaliName ? {
            name: otherWaliName,
            relationship: otherWaliRel || 'Guardian'
          } : undefined
        },
        waliName: otherWaliName ? `${otherWaliName} (${otherWaliRel || 'Guardian'})` : undefined,
        messages: []
      };
    });

    return c.json({ success: true, conversations: formatted });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Create / Open Conversation
chatRouter.post('/create', async (c) => {
  try {
    const { participantOne, participantTwo } = await c.req.json();
    if (!participantOne || !participantTwo) {
      return c.json({ success: false, error: 'participantOne and participantTwo are required' }, 400);
    }

    const p1 = participantOne;
    const p2 = participantTwo;
    const convId = `conv_${[p1, p2].sort().join('_')}`;

    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
      VALUES (?, ?, ?, ?, 'You matched! Start with Bismillah.', CURRENT_TIMESTAMP)
    `).bind(convId, p1, p2, `logs/${convId}.jsonl`).run();

    return c.json({ success: true, conversationId: convId });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2.1 Upload Media for Chat (Voice Notes, Compressed Photos, Videos, Files)
chatRouter.post('/upload-media', async (c) => {
  try {
    const { conversationId, senderId, fileBase64, fileName, fileType, mediaType, duration } = await c.req.json();

    if (!fileBase64) {
      return c.json({ success: false, error: 'fileBase64 is required' }, 400);
    }

    let contentType = fileType || (mediaType === 'audio' ? 'audio/webm' : (mediaType === 'image' ? 'image/jpeg' : 'application/octet-stream'));
    const mimeMatch = fileBase64.match(/^data:([^;]+);/);
    if (mimeMatch && mimeMatch[1]) {
      contentType = mimeMatch[1];
    }

    const ext = fileName?.split('.').pop()?.toLowerCase() || (mediaType === 'audio' ? 'webm' : (mediaType === 'image' ? 'jpg' : (mediaType === 'video' ? 'mp4' : 'bin')));
    const safeConv = (conversationId || 'chat').replace(/[^a-zA-Z0-9_-]/g, '');
    const fileId = `chat_${safeConv}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    let mediaUrl = `https://serene-union-api.brandracker.workers.dev/api/photos/media/${fileId}`;
    let size = 0;

    if (c.env.MEDIA_BUCKET) {
      try {
        const commaIdx = fileBase64.indexOf(',');
        const rawBase64 = commaIdx !== -1 ? fileBase64.substring(commaIdx + 1) : fileBase64;
        const base64Clean = rawBase64.replace(/[^A-Za-z0-9+/=]/g, '');
        const binaryString = atob(base64Clean);
        size = binaryString.length;
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await c.env.MEDIA_BUCKET.put(fileId, bytes.buffer, {
          httpMetadata: { contentType }
        });
      } catch (r2Err) {
        console.warn('[R2 Storage Notice] chat media upload fallback to data URL:', r2Err);
        mediaUrl = fileBase64;
      }
    } else {
      // In-memory or test fallback: provide direct url or data URL
      mediaUrl = `https://serene-union-api.brandracker.workers.dev/api/photos/media/${fileId}`;
    }

    return c.json({
      success: true,
      mediaUrl,
      mediaType: mediaType || 'file',
      fileName: fileName || fileId,
      fileSize: size || fileBase64.length,
      duration: duration || null
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Get Messages for a Conversation (Normalized with bidirectional lookup)
chatRouter.get('/:id/messages', async (c) => {
  try {
    const rawConvId = c.req.param('id');
    let targetConvId = rawConvId;

    const existingConv: any = await c.env.DB.prepare(`
      SELECT id, participant_one, participant_two FROM conversations WHERE id = ?
    `).bind(rawConvId).first();

    if (existingConv) {
      targetConvId = existingConv.id;
    } else if (rawConvId.startsWith('conv_')) {
      const trimmed = rawConvId.replace('conv_', '');
      const anyConv: any = await c.env.DB.prepare(`
        SELECT id FROM conversations 
        WHERE ? LIKE '%' || participant_one || '%' AND ? LIKE '%' || participant_two || '%'
        LIMIT 1
      `).bind(trimmed, trimmed).first();

      if (anyConv) {
        targetConvId = anyConv.id;
      }
    }

    const { results } = await c.env.DB.prepare(`
      SELECT id, conversation_id, sender_id as senderId, sender_name as senderName, text,
             media_url as mediaUrl, media_type as mediaType, media_duration as mediaDuration,
             file_name as fileName, file_size as fileSize,
             is_view_once as isViewOnce, is_opened as isOpened, opened_at as openedAt,
             created_at as timestamp
      FROM chat_messages
      WHERE conversation_id = ? OR conversation_id = ?
      ORDER BY created_at ASC
    `).bind(rawConvId, targetConvId).all();

    // Check 1-to-1 photo reveals if userId query param is provided
    const userId = c.req.query('userId');
    let isPhotoRevealed = false;
    let hasRevealedToPartner = false;

    // Secure view-once media: If viewed and receiver queries, redact mediaUrl
    const sanitizedMessages = (results || []).map((row: any) => {
      const isVO = Boolean(row.isViewOnce);
      const isOp = Boolean(row.isOpened);
      if (isVO && isOp && userId && userId !== row.senderId) {
        return {
          ...row,
          isViewOnce: true,
          isOpened: true,
          mediaUrl: null // Redacted from network payload once opened
        };
      }
      return {
        ...row,
        isViewOnce: isVO,
        isOpened: isOp
      };
    });

    if (userId) {
      let p1 = existingConv?.participant_one;
      let p2 = existingConv?.participant_two;

      if (!p1 || !p2) {
        if (rawConvId.startsWith('conv_')) {
          const parts = rawConvId.replace('conv_', '').split('_');
          p1 = parts[0];
          p2 = parts[1];
        }
      }

      const partnerId = p1 === userId ? p2 : (p2 === userId ? p1 : (p1 || p2));

      if (partnerId && partnerId !== userId) {
        try {
          const { results: reveals } = await c.env.DB.prepare(`
            SELECT owner_id, viewer_id FROM photo_reveals
            WHERE (owner_id = ? AND viewer_id = ?)
               OR (owner_id = ? AND viewer_id = ?)
          `).bind(partnerId, userId, userId, partnerId).all();

          (reveals || []).forEach((r: any) => {
            if (r.owner_id === partnerId && r.viewer_id === userId) {
              isPhotoRevealed = true;
            }
            if (r.owner_id === userId && r.viewer_id === partnerId) {
              hasRevealedToPartner = true;
            }
          });
        } catch {}
        try {
          await c.env.DB.prepare(`
            UPDATE conversations 
            SET unread_count_p1 = CASE WHEN participant_one = ? THEN 0 ELSE unread_count_p1 END,
                unread_count_p2 = CASE WHEN participant_two = ? THEN 0 ELSE unread_count_p2 END
            WHERE id = ? OR id = ?
          `).bind(userId, userId, targetConvId, rawConvId).run();
        } catch {}
      }
    }

    return c.json({ 
      success: true, 
      messages: sanitizedMessages || [],
      isPhotoRevealed,
      hasRevealedToPartner
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3.5 Real-Time WebSocket Upgrade Endpoint for Active Chat Room
chatRouter.get('/:id/ws', async (c) => {
  const upgradeHeader = c.req.header('Upgrade');
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 426);
  }
  if (!c.env.CHAT_ROOM) {
    return c.text('Durable Objects not enabled in current environment', 503);
  }

  const rawConvId = c.req.param('id');
  const userId = c.req.query('userId') || 'guest';
  let targetRoomId = rawConvId;

  // Normalize room ID if participants are present in the ID
  if (rawConvId.startsWith('conv_')) {
    const parts = rawConvId.replace('conv_', '').split('_');
    if (parts.length === 2) {
      targetRoomId = `conv_${parts.sort().join('_')}`;
    }
  }

  const doId = c.env.CHAT_ROOM.idFromName(targetRoomId);
  const roomStub = c.env.CHAT_ROOM.get(doId);

  const url = new URL(c.req.url);
  url.pathname = '/websocket';
  url.searchParams.set('userId', userId);
  url.searchParams.set('roomId', targetRoomId);

  return roomStub.fetch(new Request(url.toString(), c.req.raw));
});

// 4. Send Message to a Conversation (Auto-ensures conversation exists with verified real partner)
chatRouter.post('/:id/messages', async (c) => {
  try {
    const rawConvId = c.req.param('id');
    const { 
      senderId, 
      senderName, 
      text, 
      receiverId, 
      id, 
      mediaUrl, 
      mediaType, 
      mediaDuration, 
      fileName, 
      fileSize,
      isViewOnce
    } = await c.req.json();
    const msgId = id || `msg_${Date.now()}`;

    let messageText = (text || '').trim();
    if (!messageText && mediaUrl) {
      if (mediaType === 'audio') messageText = '🎤 Voice message';
      else if (mediaType === 'image') messageText = isViewOnce ? '📷 Photo (View Once)' : '📷 Photo';
      else if (mediaType === 'video') messageText = isViewOnce ? '🎥 Video (View Once)' : '🎥 Video';
      else messageText = fileName ? `📎 ${fileName}` : '📎 Attachment';
    }

    if (!messageText && !mediaUrl) {
      return c.json({ success: false, error: 'Message text is required' }, 400);
    }

    // 1. Resolve conversation and partner
    let targetConvId = rawConvId;
    let p1 = senderId;
    let p2 = receiverId;

    // Check if conversation already exists in DB
    const existingConv: any = await c.env.DB.prepare(`
      SELECT id, participant_one, participant_two FROM conversations WHERE id = ?
    `).bind(rawConvId).first();

    if (existingConv) {
      targetConvId = existingConv.id;
      p1 = existingConv.participant_one;
      p2 = existingConv.participant_two;
    } else {
      // Try resolving partner from convId format
      if (!p2 && rawConvId.startsWith('conv_')) {
        const trimmed = rawConvId.replace('conv_', '');
        if (trimmed.startsWith(senderId + '_')) {
          p2 = trimmed.slice(senderId.length + 1);
        } else if (trimmed.endsWith('_' + senderId)) {
          p2 = trimmed.slice(0, trimmed.length - senderId.length - 1);
        }
      }

      if (p1 && p2) {
        targetConvId = `conv_${[p1, p2].sort().join('_')}`;
        await c.env.DB.prepare(`
          INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(targetConvId, p1, p2, `logs/${targetConvId}.jsonl`, messageText).run();
      }
    }

    // Check if either participant has blocked the other
    if (p1 && p2) {
      const isBlocked = await c.env.DB.prepare(`
        SELECT 1 FROM blocked_users 
        WHERE (blocker_id = ? AND blocked_id = ?)
           OR (blocker_id = ? AND blocked_id = ?)
      `).bind(p1, p2, p2, p1).first();

      if (isBlocked) {
        return c.json({ success: false, error: 'Cannot send message: This user is blocked.' }, 403);
      }
    }

    // 2. Insert into chat_messages
    try {
      await c.env.DB.prepare(`
        INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text, media_url, media_type, media_duration, file_name, file_size, is_view_once, is_opened)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).bind(
        msgId, 
        targetConvId, 
        senderId, 
        senderName || 'Member', 
        messageText,
        mediaUrl || null,
        mediaType || null,
        typeof mediaDuration === 'number' ? mediaDuration : null,
        fileName || null,
        typeof fileSize === 'number' ? fileSize : null,
        isViewOnce ? 1 : 0
      ).run();
    } catch (insertErr) {
      // Fallback if media columns missing in some environment
      await c.env.DB.prepare(`
        INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
        VALUES (?, ?, ?, ?, ?)
      `).bind(msgId, targetConvId, senderId, senderName || 'Member', messageText).run();
    }

    // 3. Update conversation last message & increment recipient unread count
    await c.env.DB.prepare(`
      UPDATE conversations 
      SET last_message_text = ?, 
          last_message_sender_id = ?, 
          last_message_time = CURRENT_TIMESTAMP,
          unread_count_p1 = CASE WHEN participant_one != ? THEN unread_count_p1 + 1 ELSE unread_count_p1 END,
          unread_count_p2 = CASE WHEN participant_two != ? THEN unread_count_p2 + 1 ELSE unread_count_p2 END
      WHERE id = ? OR id = ?
    `).bind(messageText, senderId, senderId, senderId, targetConvId, rawConvId).run();

    try {
      await c.env.DB.prepare("UPDATE users SET last_active_at = datetime('now') WHERE id = ?").bind(senderId).run();
    } catch {}

    // 4. Centralized notification in D1 for recipient
    const recipientId = p1 === senderId ? p2 : p1;
    if (recipientId) {
      const senderFirstName = (senderName || 'Member').split(' ')[0];
      const preview = messageText.length > 60 ? `${messageText.slice(0, 57)}...` : messageText;

      try {
        const notifId = `notif_msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await c.env.DB.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, target_id, action_label, is_read, created_at)
          VALUES (?, ?, 'message', ?, ?, ?, 'Open Chat', 0, CURRENT_TIMESTAMP)
        `).bind(notifId, recipientId, `New Message from ${senderFirstName}`, preview, targetConvId).run();
      } catch {}

      // 5. Remote Android Push Notification via FCM
      try {
        const recipientUser: any = await c.env.DB.prepare(
          "SELECT fcm_token FROM users WHERE id = ?"
        ).bind(recipientId).first();

        if (recipientUser?.fcm_token) {
          c.executionCtx.waitUntil(
            sendFcmNotification(c.env, {
              token: recipientUser.fcm_token,
              title: `New Message from ${senderFirstName} 💬`,
              body: preview,
              data: {
                conversationId: targetConvId,
                senderId: senderId,
                type: 'chat_message'
              }
            })
          );
        }
      } catch (pushErr) {
        console.warn('[PushNotification] FCM dispatch notice:', pushErr);
      }
    }

    // 6. Autonomous AI Agent: Auto-reply disabled per Admin configuration.
    // Responses are managed and dispatched on one-click via Admin Portal ("Reply All").

    const msgObj = {
      id: msgId,
      senderId,
      senderName: senderName || 'Member',
      text: messageText,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      mediaDuration: typeof mediaDuration === 'number' ? mediaDuration : null,
      fileName: fileName || null,
      fileSize: typeof fileSize === 'number' ? fileSize : null,
      isViewOnce: Boolean(isViewOnce),
      isOpened: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: true
    };

    // 7. Real-Time Broadcast via Durable Object WebSockets
    if (c.env.CHAT_ROOM) {
      try {
        const doId = c.env.CHAT_ROOM.idFromName(targetConvId);
        const roomStub = c.env.CHAT_ROOM.get(doId);
        const broadcastPromise = roomStub.fetch('http://internal/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_message',
            conversationId: targetConvId,
            message: msgObj
          })
        }).catch(() => {});

        if (c.executionCtx && typeof c.executionCtx.waitUntil === 'function') {
          c.executionCtx.waitUntil(broadcastPromise);
        }
      } catch (wsErr) {
        console.warn('[WebSocket] Broadcast notice:', wsErr);
      }
    }

    return c.json({
      success: true,
      messageId: msgId,
      message: msgObj
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4.1 Mark View-Once Media as Opened (Permanent Expire / Redact)
chatRouter.post('/:id/messages/:msgId/open-view-once', async (c) => {
  try {
    const rawConvId = c.req.param('id');
    const msgId = c.req.param('msgId');

    await c.env.DB.prepare(`
      UPDATE chat_messages 
      SET is_opened = 1, opened_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND is_view_once = 1
    `).bind(msgId).run();

    return c.json({
      success: true,
      messageId: msgId,
      isOpened: true
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. 1-to-1 Modesty Photo Reveal Live Toggle (Cloudflare D1 Single Source of Truth)
chatRouter.post('/:id/photo-reveal', async (c) => {
  try {
    const rawConvId = c.req.param('id');
    const { ownerId, viewerId, isRevealed } = await c.req.json();

    if (!ownerId || !viewerId) {
      return c.json({ success: false, error: 'ownerId and viewerId are required' }, 400);
    }

    // 1. Ensure table exists & update D1 photo_reveals
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS photo_reveals (
        owner_id TEXT NOT NULL,
        viewer_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(owner_id, viewer_id)
      )
    `).run();

    if (isRevealed) {
      await c.env.DB.prepare(`
        INSERT OR REPLACE INTO photo_reveals (owner_id, viewer_id, created_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `).bind(ownerId, viewerId).run();
    } else {
      await c.env.DB.prepare(`
        DELETE FROM photo_reveals WHERE owner_id = ? AND viewer_id = ?
      `).bind(ownerId, viewerId).run();
    }

    // 2. Fetch owner name to craft real system message
    const owner: any = await c.env.DB.prepare(`SELECT full_name FROM users WHERE id = ?`).bind(ownerId).first();
    const ownerFirstName = owner?.full_name ? owner.full_name.split(' ')[0] : 'Member';

    const statusMsg = isRevealed 
      ? `📸 ${ownerFirstName} revealed their unblurred photos for this conversation.` 
      : `🔒 ${ownerFirstName} restored photo blur for modesty.`;

    // 3. Resolve targetConvId
    let targetConvId = rawConvId;
    const existingConv: any = await c.env.DB.prepare(`SELECT id FROM conversations WHERE id = ?`).bind(rawConvId).first();
    if (!existingConv && rawConvId.startsWith('conv_')) {
      targetConvId = `conv_${[ownerId, viewerId].sort().join('_')}`;
    }

    const msgId = `sys_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4. Insert real system notification message in chat_messages in D1 so both parties see it
    try {
      await c.env.DB.prepare(`
        INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
        VALUES (?, ?, 'system', 'Modesty Shield', ?)
      `).bind(msgId, targetConvId, statusMsg).run();

      await c.env.DB.prepare(`
        UPDATE conversations 
        SET last_message_text = ?, last_message_sender_id = 'system', last_message_time = CURRENT_TIMESTAMP
        WHERE id = ? OR id = ?
      `).bind(statusMsg, targetConvId, rawConvId).run();
    } catch {}

    // Real-Time Broadcast via Durable Object WebSockets
    if (c.env.CHAT_ROOM) {
      try {
        const doId = c.env.CHAT_ROOM.idFromName(targetConvId);
        const roomStub = c.env.CHAT_ROOM.get(doId);
        const broadcastPromise = roomStub.fetch('http://internal/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'photo_reveal',
            conversationId: targetConvId,
            ownerId,
            viewerId,
            isRevealed: Boolean(isRevealed),
            statusMsg,
            messageId: msgId
          })
        }).catch(() => {});

        if (c.executionCtx && typeof c.executionCtx.waitUntil === 'function') {
          c.executionCtx.waitUntil(broadcastPromise);
        }
      } catch {}
    }

    return c.json({
      success: true,
      isRevealed: Boolean(isRevealed),
      ownerId,
      viewerId,
      statusMsg,
      messageId: msgId
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. High-Priority Remote VoIP Call Wakeup via FCM (WhatsApp-Style Background & Lock Screen Wakeup)
chatRouter.post('/call/initiate', async (c) => {
  try {
    const { callerId, recipientId, callType, callerInfo, conversationId } = await c.req.json();
    if (!callerId || !recipientId) {
      return c.json({ success: false, error: 'callerId and recipientId required' }, 400);
    }

    const recipientUser: any = await c.env.DB.prepare(
      "SELECT fcm_token, full_name FROM users WHERE id = ?"
    ).bind(recipientId).first();

    if (recipientUser?.fcm_token) {
      const callerFirstName = callerInfo?.fullName?.split(' ')[0] || 'Match Candidate';
      const callTypeName = callType === 'video' ? 'Video Call 📹' : 'Audio Call 📞';
      const convId = conversationId || `conv_${[callerId, recipientId].sort().join('_')}`;

      // High-priority FCM push notification
      c.executionCtx.waitUntil(
        sendFcmNotification(c.env, {
          token: recipientUser.fcm_token,
          title: `Incoming ${callTypeName}`,
          body: `${callerFirstName} is calling you on Qurb...`,
          channelId: 'qurb_calls',
          isCall: true,
          data: {
            type: 'incoming_call',
            callType: callType || 'audio',
            callerId: callerId,
            callerName: callerInfo?.fullName || 'Match Candidate',
            callerCity: callerInfo?.city || 'Pakistan',
            callerPhoto: callerInfo?.photoUrl || '',
            callerGender: callerInfo?.gender || '',
            callerVip: callerInfo?.isVip ? 'true' : 'false',
            conversationId: convId,
            timestamp: String(Date.now())
          }
        })
      );
    }

    return c.json({ success: true, message: 'Call push notification queued' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
