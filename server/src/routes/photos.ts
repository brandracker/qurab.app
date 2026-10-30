import { Hono } from 'hono';
import type { AppContext } from '../types';

export const photosRouter = new Hono<AppContext>();

// 1. Photo Upload (Cloudflare R2 Storage + D1 integration)
photosRouter.post('/upload', async (c) => {
  try {
    const { userId, photoBase64, isPrimary, blurByDefault } = await c.req.json();
    if (!userId || !photoBase64) {
      return c.json({ success: false, error: 'userId and photoBase64 are required' }, 400);
    }

    const photoId = `ph_${Date.now()}`;
    let photoUrl = photoBase64.startsWith('data:') ? photoBase64 : `data:image/jpeg;base64,${photoBase64}`;

    // Extract mime type if available
    let contentType = 'image/jpeg';
    const mimeMatch = photoBase64.match(/^data:([^;]+);/);
    if (mimeMatch && mimeMatch[1]) {
      contentType = mimeMatch[1];
    }
    const ext = contentType.includes('png') ? 'png' : (contentType.includes('webp') ? 'webp' : 'jpg');
    const fileId = `photo_${userId}_${Date.now()}.${ext}`;

    // Upload to Cloudflare R2 if available
    if (c.env.MEDIA_BUCKET) {
      try {
        const commaIdx = photoBase64.indexOf(',');
        const rawBase64 = commaIdx !== -1 ? photoBase64.substring(commaIdx + 1) : photoBase64;
        const base64Clean = rawBase64.replace(/[^A-Za-z0-9+/=]/g, '');
        const binaryString = atob(base64Clean);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await c.env.MEDIA_BUCKET.put(fileId, bytes.buffer, {
          httpMetadata: { contentType }
        });
        photoUrl = `https://serene-union-api.brandracker.workers.dev/api/photos/media/${fileId}`;
      } catch (r2Err) {
        console.warn('R2 photo storage warning, preserving base64 fallback:', r2Err);
      }
    }

    if (isPrimary) {
      await c.env.DB.prepare(`UPDATE user_photos SET is_primary = 0 WHERE user_id = ?`).bind(userId).run();
    }

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
        const rawBase64 = commaIdx !== -1 ? audioBase64.substring(commaIdx + 1) : audioBase64;
        const base64Clean = rawBase64.replace(/[^A-Za-z0-9+/=]/g, '');
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
        INSERT OR IGNORE INTO users (id, created_at) VALUES (?, CURRENT_TIMESTAMP)
      `).bind(userId).run();

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

// 3. Stream Voice & Video Media directly from R2 Storage with HTTP 206 Range Support
photosRouter.get('/media/:fileId', async (c) => {
  try {
    const fileId = c.req.param('fileId');
    if (!c.env.MEDIA_BUCKET) {
      return c.text('Media bucket not configured', 404);
    }

    const rangeHeader = c.req.header('range');
    let object: any;
    if (rangeHeader) {
      object = await c.env.MEDIA_BUCKET.get(fileId, {
        range: c.req.raw.headers,
        onlyIf: c.req.raw.headers
      });
    } else {
      object = await c.env.MEDIA_BUCKET.get(fileId);
    }

    if (!object) {
      return c.text('Media file not found in storage', 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);

    const ext = fileId.split('.').pop()?.toLowerCase() || '';
    let fallbackMime = 'application/octet-stream';
    if (ext === 'jpg' || ext === 'jpeg') fallbackMime = 'image/jpeg';
    else if (ext === 'png') fallbackMime = 'image/png';
    else if (ext === 'webp') fallbackMime = 'image/webp';
    else if (ext === 'gif') fallbackMime = 'image/gif';
    else if (ext === 'mp4') fallbackMime = 'video/mp4';
    else if (ext === 'webm') fallbackMime = fileId.includes('voice_') ? 'audio/webm' : 'video/webm';
    else if (ext === 'mov') fallbackMime = 'video/quicktime';
    else if (ext === 'mp3') fallbackMime = 'audio/mpeg';
    else if (ext === 'm4a') fallbackMime = 'audio/mp4';
    else if (ext === 'aac') fallbackMime = 'audio/aac';
    else if (ext === 'ogg') fallbackMime = 'audio/ogg';
    else if (ext === 'wav') fallbackMime = 'audio/wav';

    headers.set('Content-Type', object.httpMetadata?.contentType || fallbackMime);
    headers.set('Accept-Ranges', 'bytes');
    
    // ETag & Conditional 304 Not Modified
    const etag = object.httpEtag || `"${fileId}"`;
    headers.set('ETag', etag);

    const clientEtag = c.req.header('if-none-match');
    if (clientEtag && (clientEtag === etag || clientEtag === `W/${etag}`)) {
      return new Response(null, { status: 304, headers });
    }

    // Media & Photos are content-addressed immutable files: Cache permanently for 1 year
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

    // If HTTP Range was requested, return 206 Partial Content with proper Content-Range
    if (rangeHeader && object.range) {
      const start = object.range.offset;
      const end = object.range.offset + object.range.length - 1;
      const total = object.size;
      headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
      headers.set('Content-Length', String(object.range.length));
      return new Response(object.body, { status: 206, headers });
    }

    return new Response(object.body, { status: 200, headers });
  } catch (error: any) {
    return c.text(`Error reading media: ${error.message}`, 500);
  }
});


