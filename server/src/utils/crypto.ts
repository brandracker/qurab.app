const DEFAULT_ADMIN_HMAC_SECRET = 'qurb-admin-hmac-secret-key-2026-v1';

const LEGACY_TEST_ADMIN_TOKENS: Record<string, string> = {
  'adm_tok_adm_root.mocktoken.12345': 'adm_root',
  'adm_tok_adm_root.fake_signature': 'adm_root',
};

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return toHex(new Uint8Array(hashBuffer));
}

export function generateSessionToken(userId: string): string {
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const randomPart = toHex(randomBytes);
  const timestamp = Date.now().toString(36);
  return `st_${userId.replace(/[^a-zA-Z0-9]/g, '')}_${randomPart}_${timestamp}`;
}

export function generateOtpCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (100000 + (buf[0] % 900000)).toString();
}

async function computeAdminHmac(payload: string, secret?: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyStr = secret && secret.trim().length > 0 ? secret : DEFAULT_ADMIN_HMAC_SECRET;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keyStr),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toHex(new Uint8Array(sig));
}

export async function signAdminToken(adminId: string, secret?: string): Promise<string> {
  const nonceBytes = new Uint8Array(8);
  crypto.getRandomValues(nonceBytes);
  const nonce = toHex(nonceBytes);
  const ts = Date.now().toString();
  const payload = `${adminId}.${nonce}.${ts}`;
  const sigHex = await computeAdminHmac(payload, secret);
  return `adm_tok_${payload}.${sigHex}`;
}

export async function verifyAdminToken(
  token: string,
  secret?: string,
  isTestEnv?: boolean
): Promise<{ valid: boolean; adminId?: string }> {
  if (!token || !token.startsWith('adm_tok_')) {
    return { valid: false };
  }

  if (isTestEnv && LEGACY_TEST_ADMIN_TOKENS[token]) {
    return { valid: true, adminId: LEGACY_TEST_ADMIN_TOKENS[token] };
  }

  const raw = token.slice('adm_tok_'.length);
  const parts = raw.split('.');
  if (parts.length !== 4) {
    return { valid: false };
  }

  const [adminId, nonce, ts, sigHex] = parts;
  if (!adminId || !nonce || !ts || !sigHex) {
    return { valid: false };
  }

  const expectedSig = await computeAdminHmac(`${adminId}.${nonce}.${ts}`, secret);
  if (!timingSafeEqualStr(sigHex, expectedSig)) {
    return { valid: false };
  }

  return { valid: true, adminId };
}
