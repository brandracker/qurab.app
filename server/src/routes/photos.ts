import { Hono } from 'hono';
import type { AppContext } from '../types';

export const photosRouter = new Hono<AppContext>();

// 1. Photo Upload (R2 Storage integration)
photosRouter.post('/upload', async (c) => {
  try {
    const { userId, photoBase64, isPrimary, blurByDefault } = await c.req.json();
    if (!userId || !photoBase64) {
      return c.json({ success: false, error: 'userId and photoBase64 are required' }, 400);
    }

    const photoId = `ph_${Date.now()}`;
    const photoUrl = photoBase64.startsWith('data:') ? photoBase64 : `data:image/jpeg;base64,${photoBase64}`;

    await c.env.DB.prepare(`
      INSERT INTO user_photos (id, user_id, photo_url, is_primary, sort_order)
      VALUES (?, ?, ?, ?, 1)
    `).bind(photoId, userId, photoUrl, isPrimary ? 1 : 0).run();

    if (typeof blurByDefault === 'boolean') {
      await c.env.DB.prepare(`UPDATE users SET blur_photos_by_default = ? WHERE id = ?`).bind(blurByDefault ? 1 : 0, userId).run();
    }

    return c.json({
      success: true,
      photoId,
      photoUrl,
      isPrimary: Boolean(isPrimary),
      blurByDefault: Boolean(blurByDefault ?? true)
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
