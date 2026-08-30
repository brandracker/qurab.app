import { Hono } from 'hono';
import type { AppContext } from '../types';

export const waliRouter = new Hono<AppContext>();

// 1. Wali / Guardian Invite
waliRouter.post('/invite', async (c) => {
  try {
    const { userId, waliName, waliPhone, waliRelationship } = await c.req.json();
    if (!userId || !waliName || !waliPhone || !waliRelationship) {
      return c.json({ success: false, error: 'userId, waliName, waliPhone, and waliRelationship are required' }, 400);
    }

    const waliId = `wali_${Date.now()}`;

    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO wali_details (id, user_id, wali_name, wali_phone, wali_relationship, is_verified, chat_observer_active)
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `).bind(waliId, userId, waliName, waliPhone, waliRelationship).run();

    const inviteLink = `https://serene-union.pages.dev/?view=wali_portal&invite=${waliId}`;

    return c.json({
      success: true,
      waliId,
      inviteLink,
      whatsappShareUrl: `https://wa.me/${waliPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${waliName}, I have invited you as my Wali on Serene Union: ${inviteLink}`)}`
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
