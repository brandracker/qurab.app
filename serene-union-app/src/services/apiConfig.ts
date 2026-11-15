export const WORKER_API_BASE = 'https://serene-union-api.brandracker.workers.dev/api';
export const LOCAL_API_BASE = 'http://localhost:8787/api';
export const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_USE_LOCAL_API === 'true' ? LOCAL_API_BASE : WORKER_API_BASE);
export const isLocalEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    import.meta.env.DEV || 
    host === 'localhost' || 
    host === '127.0.0.1' || 
    host.startsWith('192.168.') || 
    host.endsWith('.local')
  );
};

export const getAuthToken = (): string => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return '';
  try {
    return localStorage.getItem('serene_auth_token_v1') || localStorage.getItem('serene_auth_token') || '';
  } catch {
    return '';
  }
};

export const authFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const token = getAuthToken();
  if (!token) {
    return init !== undefined ? globalThis.fetch(input, init) : globalThis.fetch(input);
  }
  const existingHeaders: Record<string, string> =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : Array.isArray(init?.headers)
        ? Object.fromEntries(init.headers)
        : ((init?.headers as Record<string, string>) || {});
  return globalThis.fetch(input, {
    ...(init || {}),
    headers: {
      ...existingHeaders,
      Authorization: existingHeaders.Authorization || existingHeaders.authorization || `Bearer ${token}`
    }
  });
};

export const withAuthWsUrl = (wsUrl: string): string => {
  const token = getAuthToken();
  if (!token || wsUrl.includes('token=')) return wsUrl;
  const sep = wsUrl.includes('?') ? '&' : '?';
  return `${wsUrl}${sep}token=${encodeURIComponent(token)}`;
};
