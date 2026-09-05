import { Hono } from 'hono';
import type { AppContext } from '../types';

export const notificationsRouter = new Hono<AppContext>();

// 1. Fetch User Notifications from D1
notificationsRouter.get('/', async (c) => {
  try {
    const userId = c.req.query('userId');
    if (!userId || userId === 'usr_guest') {
      return c.json({ success: true, notifications: [] });
    }

    const { results } = await c.env.DB.prepare(`
      SELECT 
        id,
        user_id as userId,
        type,
        title,
        message,
        target_id as targetId,
        avatar_url as avatarUrl,
        action_label as actionLabel,
        is_read as isRead,
        created_at as createdAt
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(userId).all();

    const notifications = (results || []).map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      timestamp: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
      read: Boolean(n.isRead),
      actionLabel: n.actionLabel || undefined,
      targetId: n.targetId || undefined,
      avatarUrl: n.avatarUrl || undefined
    }));

    return c.json({
      success: true,
      notifications
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Mark User Notifications Read
notificationsRouter.post('/mark-read', async (c) => {
  try {
    const { userId, notificationId } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    if (notificationId) {
      await c.env.DB.prepare(`
        UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
      `).bind(notificationId, userId).run();
    } else {
      await c.env.DB.prepare(`
        UPDATE notifications SET is_read = 1 WHERE user_id = ?
      `).bind(userId).run();
    }

    return c.json({
      success: true,
      message: 'Notifications marked as read in D1'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Create a Notification
notificationsRouter.post('/create', async (c) => {
  try {
    const { userId, type, title, message, targetId, avatarUrl, actionLabel } = await c.req.json();
    if (!userId || !title || !message) {
      return c.json({ success: false, error: 'userId, title, and message are required' }, 400);
    }

    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    // Ensure user exists
    const stubPhone = `ph_${userId}`;
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
      VALUES (?, ?, 'Member', ?, '1998-01-01', 'male', 'Global', 0)
    `).bind(userId, stubPhone, `${userId}@serene-union.internal`).run();

    await c.env.DB.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, target_id, avatar_url, action_label, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(notifId, userId, type || 'system', title, message, targetId || null, avatarUrl || null, actionLabel || null).run();

    return c.json({
      success: true,
      notificationId: notifId
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
