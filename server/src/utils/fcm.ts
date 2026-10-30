/**
 * Firebase Cloud Messaging (FCM HTTP v1) Dispatcher for Cloudflare Workers
 * Generates Google OAuth2 JWT using Web Crypto API and dispatches push payloads.
 */

interface FcmPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  channelId?: string;
  isCall?: boolean;
}

// Convert PEM private key to CryptoKey
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const cleanPem = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');

  const binaryDer = Uint8Array.from(atob(cleanPem), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' }
    },
    false,
    ['sign']
  );
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getGoogleAccessToken(serviceAccount: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claimSet));
  const unsignedToken = `${encodedHeader}.${encodedClaim}`;

  const privateKey = await importPrivateKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const jwt = `${unsignedToken}.${encodedSignature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google OAuth2 token exchange failed: ${errText}`);
  }

  const tokenData: any = await tokenRes.json();
  return tokenData.access_token;
}

export async function sendFcmNotification(env: any, payload: FcmPayload): Promise<boolean> {
  try {
    const rawSa = env?.FIREBASE_SERVICE_ACCOUNT;
    if (!rawSa) {
      console.log('[FCM] FIREBASE_SERVICE_ACCOUNT secret not set in Worker environment. Push notification skipped.');
      return false;
    }

    let serviceAccount: any;
    try {
      serviceAccount = typeof rawSa === 'string' ? JSON.parse(rawSa) : rawSa;
    } catch {
      // Might be base64-encoded JSON
      try {
        serviceAccount = JSON.parse(atob(rawSa));
      } catch {
        console.warn('[FCM] Failed to parse FIREBASE_SERVICE_ACCOUNT');
        return false;
      }
    }

    const projectId = serviceAccount.project_id || 'marriage-app-1ca27';
    const accessToken = await getGoogleAccessToken(serviceAccount);

    const targetChannel = payload.channelId || (payload.isCall ? 'qurb_calls_v2' : 'qurb_messages');

    const isCall = Boolean(payload.isCall);
    const fcmMessage: any = {
      message: {
        token: payload.token,
        android: {
          priority: 'high',
          ...(isCall ? { ttl: '45s' } : {})
        },
        data: {
          ...(payload.data || {}),
          title: payload.title,
          body: payload.body
        }
      }
    };

    // For standard chat messages/notifications, include system notification object
    // For incoming VoIP calls, omit notification object to prevent Android OS system tray suppression
    if (!isCall) {
      fcmMessage.message.notification = {
        title: payload.title,
        body: payload.body
      };
      fcmMessage.message.android.notification = {
        channel_id: targetChannel,
        sound: 'default',
        default_vibrate_timings: true,
        notification_priority: 'PRIORITY_HIGH'
      };
    }

    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fcmMessage)
    });

    if (res.ok) {
      console.log('[FCM] Successfully delivered push notification to token:', payload.token.slice(0, 10) + '...');
      return true;
    } else {
      const err = await res.text();
      console.warn('[FCM] Send error:', err);
      return false;
    }
  } catch (err) {
    console.warn('[FCM] Dispatch error:', err);
    return false;
  }
}
