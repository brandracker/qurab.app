import { serve } from '@hono/node-server';
import https from 'https';
import fs from 'fs';
import path from 'path';
import app from './index';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'b25a2b1bf3f2d77575913505498ad343';
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || 'fcd8c8c6-94f1-46e1-a141-25728da9d520';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

const JSONL_DIR = path.join(__dirname, '..', '..', 'db', 'conversations');
if (!fs.existsSync(JSONL_DIR)) {
  fs.mkdirSync(JSONL_DIR, { recursive: true });
}

// Parameterized Cloudflare D1 Query Helper
async function queryD1(sql: string, params: any[] = []): Promise<any> {
  const payload = JSON.stringify({ sql, params });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success && parsed.result && parsed.result[0]) {
            resolve(parsed.result[0].results || []);
          } else {
            resolve([]);
          }
        } catch (e) {
          reject(data);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Cloudflare D1 Compatibility Adapter for Node.js runtime
const dbAdapter = {
  prepare(sql: string) {
    let boundParams: any[] = [];
    const stmtWrapper = {
      bind(...params: any[]) {
        boundParams = params;
        return stmtWrapper;
      },
      async first<T = any>(colName?: string): Promise<T | null> {
        const rows = await queryD1(sql, boundParams);
        if (!rows || rows.length === 0) return null;
        if (colName) return (rows[0][colName] as T) ?? null;
        return rows[0] as T;
      },
      async all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }> {
        const rows = await queryD1(sql, boundParams);
        return { results: (rows as T[]) || [], success: true, meta: { changes: 0 } };
      },
      async run(): Promise<{ success: boolean; meta: any }> {
        await queryD1(sql, boundParams);
        return { success: true, meta: { changes: 1 } };
      }
    };
    return stmtWrapper;
  }
};

const mediaBucketAdapter = {
  async put(key: string, value: any) {
    return { key };
  },
  async get(key: string) {
    return null;
  },
  async delete(key: string) {}
};

// Start Node Server on port 8787 wrapping Hono app with live Cloudflare D1 adapter
console.log('🚀 Serene Union Modular Edge API running on port 8787 (Cloudflare D1 Live Adapter)...');

serve({
  fetch(req) {
    return app.fetch(req, {
      DB: dbAdapter as any,
      MEDIA_BUCKET: mediaBucketAdapter as any,
      ENVIRONMENT: 'development'
    });
  },
  port: 8787
});
