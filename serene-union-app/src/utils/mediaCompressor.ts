/**
 * Client-Side Auto-Compression & Voice Recording Utilities
 * Compresses images and media before upload to ensure fast transmission and 0 server load.
 */

export interface CompressedImageResult {
  base64: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
}

export interface CompressedFileResult {
  base64: string;
  size: number;
  name: string;
  mimeType: string;
  mediaType: 'image' | 'video' | 'audio' | 'file';
  thumbnailUrl?: string;
  duration?: number;
}

export interface VoiceRecordResult {
  base64: string;
  duration: number; // in seconds
  size: number;
  mimeType: string;
}

/**
 * Auto-compresses an image file using HTML5 Canvas to <250KB JPEG/WebP
 */
export async function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.75
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG or WebP
        let mimeType = 'image/jpeg';
        let base64 = canvas.toDataURL(mimeType, quality);

        // Rough calculation of binary byte size from Base64 length
        const base64Clean = base64.split(',')[1] || base64;
        const size = Math.round((base64Clean.length * 3) / 4);

        resolve({
          base64,
          size,
          width,
          height,
          mimeType
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Handles any user-attached file with automatic compression and media classification
 */
export async function processAttachedFile(file: File): Promise<CompressedFileResult> {
  const mimeType = file.type.toLowerCase();

  // 1. Image Auto-Compression
  if (mimeType.startsWith('image/')) {
    const compressed = await compressImage(file, 1280, 0.75);
    return {
      base64: compressed.base64,
      size: compressed.size,
      name: file.name,
      mimeType: compressed.mimeType,
      mediaType: 'image'
    };
  }

  // 2. Video Attachment (Size check + base64 encoding)
  if (mimeType.startsWith('video/')) {
    const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error('Video is too large. Please select a video under 25MB.');
    }
    const base64 = await fileToBase64(file);
    return {
      base64,
      size: file.size,
      name: file.name,
      mimeType: file.type || 'video/mp4',
      mediaType: 'video'
    };
  }

  // 3. Audio file
  if (mimeType.startsWith('audio/')) {
    const base64 = await fileToBase64(file);
    return {
      base64,
      size: file.size,
      name: file.name,
      mimeType: file.type || 'audio/webm',
      mediaType: 'audio'
    };
  }

  // 4. Document / Generic File (PDF, DOCX, etc.)
  const MAX_DOC_BYTES = 15 * 1024 * 1024; // 15MB
  if (file.size > MAX_DOC_BYTES) {
    throw new Error('Attachment exceeds 15MB limit.');
  }
  const base64 = await fileToBase64(file);
  return {
    base64,
    size: file.size,
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    mediaType: 'file'
  };
}

/**
 * Helper to read raw File to Data URL Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * In-browser Voice Note Recorder using native Web MediaRecorder API
 * Automatically records in lightweight Opus/WebM format (~20-40KB per 30s)
 */
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime = 0;

  async start(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Audio recording is not supported in this environment');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Detect optimal mime type supported by platform
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ];
    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const options: MediaRecorderOptions = {
      audioBitsPerSecond: 32000 // 32kbps is crystal clear for speech while extremely lightweight
    };
    if (selectedMime) {
      options.mimeType = selectedMime;
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options);
    this.audioChunks = [];
    this.startTime = Date.now();

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(250); // Slice data every 250ms
  }

  stop(): Promise<VoiceRecordResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        reject(new Error('Recorder is not active'));
        return;
      }

      const duration = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

      this.mediaRecorder.onstop = async () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const base64 = await blobToBase64(audioBlob);
          const size = audioBlob.size;

          this.cleanup();
          resolve({
            base64,
            duration,
            size,
            mimeType
          });
        } catch (err) {
          this.cleanup();
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    this.cleanup();
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format seconds into MM:SS
 */
export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
