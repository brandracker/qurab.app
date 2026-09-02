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

// 2. Voice Greeting Upload (Cloudflare R2 Storage + D1 integration)
photosRouter.post('/upload-voice', async (c) => {
  try {
    const { userId, audioBase64, duration } = await c.req.json();
    if (!userId || !audioBase64) {
      return c.json({ success: false, error: 'userId and audioBase64 are required' }, 400);
    }

    const fileId = `voice_${userId}_${Date.now()}.webm`;
    let voiceUrl = audioBase64;

    // Extract mime type if available
    let contentType = 'audio/webm';
    const mimeMatch = audioBase64.match(/^data:([^;]+);/);
    if (mimeMatch && mimeMatch[1]) {
      contentType = mimeMatch[1];
    }

    // Upload to Cloudflare R2 if available
    if (c.env.MEDIA_BUCKET) {
      try {
        const commaIdx = audioBase64.indexOf(',');
        const base64Clean = commaIdx !== -1 ? audioBase64.substring(commaIdx + 1) : audioBase64;
        const binaryString = atob(base64Clean);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await c.env.MEDIA_BUCKET.put(fileId, bytes.buffer, {
          httpMetadata: { contentType }
        });
        voiceUrl = `https://serene-union-api.brandracker.workers.dev/api/photos/media/${fileId}`;
      } catch (r2Err) {
        console.warn('R2 voice storage warning, preserving audio payload:', r2Err);
      }
    }

    // Save to Cloudflare D1
    try {
      await c.env.DB.prepare(`
        UPDATE users 
        SET voice_greeting_url = ?, voice_greeting_duration = ? 
        WHERE id = ?
      `).bind(voiceUrl, duration || 0, userId).run();
    } catch (d1Err) {
      console.warn('D1 voice columns update:', d1Err);
    }

    return c.json({
      success: true,
      voiceUrl,
      duration: duration || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Stream Voice Media directly from R2 Storage
photosRouter.get('/media/:fileId', async (c) => {
  try {
    const fileId = c.req.param('fileId');
    if (!c.env.MEDIA_BUCKET) {
      return c.text('Media bucket not configured', 404);
    }

    const object = await c.env.MEDIA_BUCKET.get(fileId);
    if (!object) {
      return c.text('Audio file not found in storage', 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Content-Type', object.httpMetadata?.contentType || 'audio/webm');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=31536000');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    return new Response(object.body, { headers });
  } catch (error: any) {
    return c.text(`Error reading media: ${error.message}`, 500);
  }

});


