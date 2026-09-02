import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppContext } from './types';
import { authRouter } from './routes/auth';
import { usersRouter, profilesRouter } from './routes/users';
import { matchesRouter } from './routes/matches';
import { chatRouter } from './routes/chat';
import { photosRouter } from './routes/photos';
import { waliRouter } from './routes/wali';
import { compatibilityRouter } from './routes/compatibility';
import { walletRouter } from './routes/wallet';

const app = new Hono<AppContext>();

// Global CORS Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Root & Health Check Endpoints
app.get('/', (c) => {
  return c.json({
    service: 'Serene Union Halal Matrimony API',
    status: 'online',
    version: '2.0.0',
    frontend: 'https://serene-union.pages.dev',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      profiles: '/api/profiles/discover',
      matches: '/api/matches',
      conversations: '/api/conversations'
    }
  });
});

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'Serene Union Modular Cloudflare Workers API',
    database: 'Cloudflare D1 (Live)',
    architecture: 'Layered Modular Edge Routers',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'serene-union-api',
    database: 'Cloudflare D1 (Live)',
    architecture: 'Layered Modular Edge Routers',
    timestamp: new Date().toISOString()
  });
});

// Mount Modular Sub-Routers
app.route('/api/auth', authRouter);
app.route('/api/users', usersRouter);
app.route('/api/profiles', profilesRouter);
app.route('/api/matches', matchesRouter);
app.route('/api/conversations', chatRouter);
app.route('/api/photos', photosRouter);
app.route('/api/wali', waliRouter);
app.route('/api/compatibility', compatibilityRouter);
app.route('/api/wallet', walletRouter);

// Global 404 & Error Handler
app.notFound((c) => {
  return c.json({ success: false, error: 'API Endpoint not found' }, 404);
});

app.onError((err, c) => {
  console.error('Unhandled API Error:', err);
  return c.json({ success: false, error: err.message || 'Internal Server Error' }, 500);
});

export default app;
