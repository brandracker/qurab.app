export const WORKER_API_BASE = 'https://serene-union-api.brandracker.workers.dev/api';
export const LOCAL_API_BASE = 'http://localhost:8787/api';
export const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_USE_LOCAL_API === 'true' ? LOCAL_API_BASE : WORKER_API_BASE);

