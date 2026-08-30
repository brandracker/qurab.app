import { Hono } from 'hono';
import type { AppContext } from '../types';

export const chatRouter = new Hono<AppContext>();

// 1. Get Conversations for User (with robust LEFT JOIN fallback)
chatRouter.get('/', async (c) => {
  try {
    const userId = c.req.query('userId') || '';
    if (!userId) {
      return c.json({ success: true, conversations: [] });
    }

    const { results } = await c.env.DB.prepare(`
      SELECT c.*, 
        COALESCE(u1.full_name, 'Member') as p1_name, 
        COALESCE(u2.full_name, 'Member') as p2_name,
        COALESCE(u1.location, 'Global') as p1_location,
        COALESCE(u2.location, 'Global') as p2_location,
        p1.photo_url as p1_photo,
        p2.photo_url as p2_photo,
        w1.wali_name as w1_name,
        w2.wali_name as w2_name
      FROM conversations c
      LEFT JOIN users u1 ON c.participant_one = u1.id
      LEFT JOIN users u2 ON c.participant_two = u2.id
      LEFT JOIN user_photos p1 ON u1.id = p1.user_id AND p1.is_primary = 1
      LEFT JOIN user_photos p2 ON u2.id = p2.user_id AND p2.is_primary = 1
      LEFT JOIN wali_details w1 ON u1.id = w1.user_id
      LEFT JOIN wali_details w2 ON u2.id = w2.user_id
      WHERE c.participant_one = ? OR c.participant_two = ?
      ORDER BY c.last_message_time DESC
    `).bind(userId, userId).all();

    // Map to user-friendly otherUser payload
    const formatted = (results || []).map((row: any) => {
      const isUserP1 = row.participant_one === userId;
      const otherId = isUserP1 ? row.participant_two : row.participant_one;
      const otherName = isUserP1 ? row.p2_name : row.p1_name;
      const otherLocation = isUserP1 ? row.p2_location : row.p1_location;
      const otherPhoto = isUserP1 ? row.p2_photo : row.p1_photo;
      const otherWali = isUserP1 ? row.w2_name : row.w1_name;

      return {
        id: row.id,
        participantOne: row.participant_one,
        participantTwo: row.participant_two,
        lastMessageText: row.last_message_text,
        lastMessageSenderId: row.last_message_sender_id,
        lastMessageTime: row.last_message_time,
        status: row.status || 'active',
        otherUser: {
          id: otherId,
          fullName: otherName || 'Muslim Seeker',
          location: otherLocation || 'Global',
          photos: otherPhoto ? [otherPhoto] : []
        },
        waliName: otherWali,
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

// 3. Get Messages for a Conversation
chatRouter.get('/:id/messages', async (c) => {
  try {
    const convId = c.req.param('id');
    const { results } = await c.env.DB.prepare(`
      SELECT id, conversation_id, sender_id as senderId, sender_name as senderName, text, created_at as timestamp
      FROM chat_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `).bind(convId).all();

    return c.json({ success: true, messages: results || [] });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Send Message to a Conversation (Auto-ensures conversation exists)
chatRouter.post('/:id/messages', async (c) => {
  try {
    const convId = c.req.param('id');
    const { senderId, senderName, text, receiverId } = await c.req.json();
    const msgId = `msg_${Date.now()}`;

    if (!text || !text.trim()) {
      return c.json({ success: false, error: 'Message text is required' }, 400);
    }

    // 1. Ensure conversation row exists in DB to prevent foreign key issues
    const parts = convId.startsWith('conv_') ? convId.replace('conv_', '').split('_') : [];
    const p1 = parts[0] || senderId || 'usr_p1';
    const p2 = parts[1] || receiverId || 'usr_p2';

    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(convId, p1, p2, `logs/${convId}.jsonl`, text.trim()).run();

    // 2. Insert into chat_messages
    await c.env.DB.prepare(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text)
      VALUES (?, ?, ?, ?, ?)
    `).bind(msgId, convId, senderId, senderName || 'Member', text.trim()).run();

    // 3. Update conversation last message
    await c.env.DB.prepare(`
      UPDATE conversations 
      SET last_message_text = ?, last_message_sender_id = ?, last_message_time = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(text.trim(), senderId, convId).run();

    return c.json({
      success: true,
      message: {
        id: msgId,
        senderId,
        senderName: senderName || 'Member',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        waliNotified: true
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
