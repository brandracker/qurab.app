import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';
import { sampleBrotherUser, sampleSisterUser } from '../helpers/mock-data';

describe('Chat Voice Messages and Media Attachments API Integration Tests', () => {
  let env: any;
  const conversationId = `conv_${[sampleBrotherUser.id, sampleSisterUser.id].sort().join('_')}`;

  beforeEach(async () => {
    env = createTestEnv();

    // Seed baseline users
    await env.DB.prepare(`
      INSERT INTO users (id, phone, email, full_name, dob, gender, location)
      VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sampleBrotherUser.id, sampleBrotherUser.phone, sampleBrotherUser.email, sampleBrotherUser.full_name, sampleBrotherUser.dob, sampleBrotherUser.gender, sampleBrotherUser.location,
      sampleSisterUser.id, sampleSisterUser.phone, sampleSisterUser.email, sampleSisterUser.full_name, sampleSisterUser.dob, sampleSisterUser.gender, sampleSisterUser.location
    ).run();

    // Create mutual match conversation
    await env.DB.prepare(`
      INSERT INTO conversations (id, participant_one, participant_two, jsonl_log_path, last_message_text, last_message_time)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(conversationId, sampleBrotherUser.id, sampleSisterUser.id, `logs/${conversationId}.jsonl`, 'Initial match message').run();
  });

  describe('POST /api/conversations/upload-media', () => {
    it('rejects upload when fileBase64 or senderId is missing', async () => {
      const res = await app.request('/api/conversations/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: ''
        })
      }, env);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('fileBase64 is required');
    });

    it('successfully uploads audio voice note to R2 and returns mediaUrl', async () => {
      // Mock base64 webm audio payload
      const mockAudioBase64 = 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAATFCi3bXVkZXh0ZW5zaW9ucw==';

      const res = await app.request('/api/conversations/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: sampleBrotherUser.id,
          fileBase64: mockAudioBase64,
          mediaType: 'audio',
          duration: 14,
          fileName: 'voice_12345.webm',
          fileType: 'audio/webm'
        })
      }, env);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.mediaUrl).toContain('/api/photos/media/chat_');
      expect(data.mediaType).toBe('audio');
      expect(data.duration).toBe(14);
      expect(data.fileSize).toBeGreaterThan(0);
    });

    it('successfully uploads compressed image to R2 and returns mediaUrl', async () => {
      // Mock base64 jpeg image payload
      const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

      const res = await app.request('/api/conversations/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: sampleSisterUser.id,
          fileBase64: mockImageBase64,
          mediaType: 'image',
          fileName: 'photo_test.jpg',
          fileType: 'image/jpeg'
        })
      }, env);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.mediaUrl).toContain('/api/photos/media/chat_');
      expect(data.mediaType).toBe('image');
      expect(data.fileName).toBe('photo_test.jpg');
    });

    it('successfully uploads document attachment to R2', async () => {
      const mockDocBase64 = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAwCj4+CmVuZG9iago=';

      const res = await app.request('/api/conversations/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: sampleBrotherUser.id,
          fileBase64: mockDocBase64,
          mediaType: 'file',
          fileName: 'biodata.pdf',
          fileType: 'application/pdf'
        })
      }, env);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.mediaUrl).toBeDefined();
      expect(data.mediaType).toBe('file');
      expect(data.fileName).toBe('biodata.pdf');
    });
  });

  describe('POST & GET /api/conversations/:id/messages with media', () => {
    it('dispatches voice note without text caption and sets fallback caption', async () => {
      const voiceUrl = 'https://serene-union-api.brandracker.workers.dev/api/photos/media/chat_voice_001.webm';

      const sendRes = await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleBrotherUser.id,
          senderName: sampleBrotherUser.full_name,
          receiverId: sampleSisterUser.id,
          mediaUrl: voiceUrl,
          mediaType: 'audio',
          mediaDuration: 18,
          fileSize: 32400
        })
      }, env);

      expect(sendRes.status).toBe(200);
      const sendData = await sendRes.json();
      expect(sendData.success).toBe(true);
      expect(sendData.messageId).toBeDefined();

      // Verify conversation preview reflects voice message
      const convRow = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(convRow.last_message_text).toBe('🎤 Voice message');

      // Fetch messages and verify all media fields are correctly populated
      const getRes = await app.request(`/api/conversations/${conversationId}/messages`, { method: 'GET' }, env);
      expect(getRes.status).toBe(200);
      const getData = await getRes.json();
      expect(getData.success).toBe(true);
      expect(getData.messages.length).toBe(1);

      const msg = getData.messages[0];
      expect(msg.mediaUrl).toBe(voiceUrl);
      expect(msg.mediaType).toBe('audio');
      expect(msg.mediaDuration).toBe(18);
      expect(msg.fileSize).toBe(32400);
      expect(msg.text).toBe('🎤 Voice message');
    });

    it('dispatches photo attachment with text caption and verifies persistence', async () => {
      const photoUrl = 'https://serene-union-api.brandracker.workers.dev/api/photos/media/chat_photo_002.jpg';

      const sendRes = await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleSisterUser.id,
          senderName: sampleSisterUser.full_name,
          receiverId: sampleBrotherUser.id,
          text: 'Here is a photo from our family gathering',
          mediaUrl: photoUrl,
          mediaType: 'image',
          fileName: 'family.jpg',
          fileSize: 185000
        })
      }, env);

      expect(sendRes.status).toBe(200);

      // Verify last_message_text preserves the custom caption
      const convRow = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(convRow.last_message_text).toBe('Here is a photo from our family gathering');

      // Verify message fields
      const getRes = await app.request(`/api/conversations/${conversationId}/messages`, { method: 'GET' }, env);
      const getData = await getRes.json();
      const photoMsg = getData.messages.find((m: any) => m.mediaType === 'image');
      expect(photoMsg).toBeDefined();
      expect(photoMsg.mediaUrl).toBe(photoUrl);
      expect(photoMsg.fileName).toBe('family.jpg');
      expect(photoMsg.fileSize).toBe(185000);
    });

    it('handles auto-fallback labels for photos, videos, and files without text', async () => {
      // 1. Photo without caption
      await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleBrotherUser.id,
          mediaUrl: 'https://test/image.jpg',
          mediaType: 'image'
        })
      }, env);

      let conv = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(conv.last_message_text).toBe('📷 Photo');

      // 2. Video without caption
      await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleSisterUser.id,
          mediaUrl: 'https://test/video.mp4',
          mediaType: 'video'
        })
      }, env);

      conv = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(conv.last_message_text).toBe('🎥 Video');

      // 3. Document without caption
      await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleBrotherUser.id,
          mediaUrl: 'https://test/doc.pdf',
          mediaType: 'file',
          fileName: 'biodata.pdf'
        })
      }, env);

      conv = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(conv.last_message_text).toBe('📎 biodata.pdf');
    });

    it('handles View Once (1-Time Show) photo send, open, and redaction flow', async () => {
      const photoUrl = 'https://serene-union-api.brandracker.workers.dev/api/photos/media/chat_vo_photo.jpg';

      // 1. Brother sends a View Once photo to Sister
      const sendRes = await app.request(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: sampleBrotherUser.id,
          senderName: sampleBrotherUser.full_name,
          receiverId: sampleSisterUser.id,
          mediaUrl: photoUrl,
          mediaType: 'image',
          isViewOnce: true
        })
      }, env);

      expect(sendRes.status).toBe(200);
      const sendData = await sendRes.json();
      expect(sendData.success).toBe(true);
      expect(sendData.message.isViewOnce).toBe(true);
      expect(sendData.message.isOpened).toBe(false);
      const msgId = sendData.messageId;

      // Verify conversation preview shows View Once label
      const conv = await env.DB.prepare('SELECT last_message_text FROM conversations WHERE id = ?').bind(conversationId).first();
      expect(conv.last_message_text).toBe('📷 Photo (View Once)');

      // 2. Sister queries messages before opening - mediaUrl should still be visible
      const beforeRes = await app.request(`/api/conversations/${conversationId}/messages?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
      const beforeData = await beforeRes.json();
      const msgBefore = beforeData.messages.find((m: any) => m.id === msgId);
      expect(msgBefore.isViewOnce).toBe(true);
      expect(msgBefore.isOpened).toBe(false);
      expect(msgBefore.mediaUrl).toBe(photoUrl);

      // 3. Sister opens and closes the view once media -> calls open-view-once
      const openRes = await app.request(`/api/conversations/${conversationId}/messages/${msgId}/open-view-once`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewerId: sampleSisterUser.id })
      }, env);

      expect(openRes.status).toBe(200);
      const openData = await openRes.json();
      expect(openData.success).toBe(true);
      expect(openData.isOpened).toBe(true);

      // 4. Sister queries messages again after opening -> mediaUrl MUST be redacted (null) for privacy!
      const afterRes = await app.request(`/api/conversations/${conversationId}/messages?userId=${sampleSisterUser.id}`, { method: 'GET' }, env);
      const afterData = await afterRes.json();
      const msgAfter = afterData.messages.find((m: any) => m.id === msgId);
      expect(msgAfter.isViewOnce).toBe(true);
      expect(msgAfter.isOpened).toBe(true);
      expect(msgAfter.mediaUrl).toBeNull();
    });
  });

  describe('GET /api/photos/media/:fileId', () => {
    it('serves uploaded chat media from R2 storage with audio/webm mime type', async () => {
      const mockAudioBase64 = 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAATFCi3bXVkZXh0ZW5zaW9ucw==';

      const uploadRes = await app.request('/api/conversations/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: sampleBrotherUser.id,
          fileBase64: mockAudioBase64,
          mediaType: 'audio',
          duration: 10,
          fileName: 'note.webm',
          fileType: 'audio/webm'
        })
      }, env);

      const uploadData = await uploadRes.json();
      const fileId = uploadData.mediaUrl.split('/').pop();

      // Retrieve via GET /api/photos/media/:fileId
      const streamRes = await app.request(`/api/photos/media/${fileId}`, { method: 'GET' }, env);
      expect(streamRes.status).toBe(200);
      expect(streamRes.headers.get('Content-Type')).toContain('audio/webm');
      expect(streamRes.headers.get('Accept-Ranges')).toBe('bytes');
      expect(streamRes.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });
});
