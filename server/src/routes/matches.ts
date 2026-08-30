import { Hono } from 'hono';
import type { AppContext } from '../types';

export const matchesRouter = new Hono<AppContext>();

// 1. Matches & Likes Action
matchesRouter.post('/action', async (c) => {
  try {
    const { senderId, receiverId, action } = await c.req.json();
    if (!senderId || !receiverId || !action) {
      return c.json({ success: false, error: 'senderId, receiverId, and action are required' }, 400);
    }

    const matchId = `mat_${Date.now()}`;

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO matches_and_likes (id, sender_id, receiver_id, action)
      VALUES (?, ?, ?, ?)
    `).bind(matchId, senderId, receiverId, action).run();

    return c.json({ success: true, isMutual: action === 'liked' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
