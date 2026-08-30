export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSessionToken(userId: string): string {
  const randomPart = Math.random().toString(36).substring(2, 12);
  const timestamp = Date.now().toString(36);
  return `st_${userId.replace(/[^a-zA-Z0-9]/g, '')}_${randomPart}_${timestamp}`;
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
