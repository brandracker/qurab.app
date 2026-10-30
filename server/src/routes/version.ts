import { Hono } from 'hono';
import type { AppContext } from '../types';

export const versionRouter = new Hono<AppContext>();

// Auto-ensure system_settings table exists
async function ensureSystemSettingsTable(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (e) {
    console.warn('ensureSystemSettingsTable notice:', e);
  }
}

// 1. Public App Version & Force Update Check
// GET /api/version/check or GET /api/version
versionRouter.get('/check', async (c) => {
  return handleVersionCheck(c);
});

versionRouter.get('/', async (c) => {
  return handleVersionCheck(c);
});

async function handleVersionCheck(c: any) {
  try {
    await ensureSystemSettingsTable(c.env.DB);

    const rows = await c.env.DB.prepare(`
      SELECT key, value FROM system_settings 
      WHERE key IN (
        'min_supported_version_code',
        'latest_version_code',
        'latest_version_name',
        'force_update_enabled',
        'update_title',
        'update_message',
        'play_store_url'
      )
    `).all();

    const configMap: Record<string, string> = {};
    if (rows && rows.results) {
      for (const row of rows.results as any[]) {
        configMap[row.key] = row.value;
      }
    }

    const minSupportedVersionCode = parseInt(configMap['min_supported_version_code'] || '43', 10);
    const latestVersionCode = parseInt(configMap['latest_version_code'] || '43', 10);
    const latestVersionName = configMap['latest_version_name'] || '1.0.42';
    const forceUpdateEnabled = configMap['force_update_enabled'] !== undefined 
      ? configMap['force_update_enabled'] === '1' 
      : true;
    const updateTitle = configMap['update_title'] || 'Critical Update Required';
    const updateMessage = configMap['update_message'] || 
      'A new version of Qurb is required to continue. Please update now from the Google Play Store for critical features and fixes.';
    const playStoreUrl = configMap['play_store_url'] || 
      'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share';

    // Parse client version from query parameters
    const clientCodeStr = c.req.query('versionCode');
    const clientName = c.req.query('versionName') || '';
    const clientCode = clientCodeStr ? parseInt(clientCodeStr, 10) : 0;

    let forceUpdateRequired = false;
    let softUpdateAvailable = false;

    if (clientCode > 0) {
      if (forceUpdateEnabled && clientCode < minSupportedVersionCode) {
        forceUpdateRequired = true;
      } else if (clientCode < latestVersionCode) {
        softUpdateAvailable = true;
      }
    }

    return c.json({
      success: true,
      minSupportedVersionCode,
      latestVersionCode,
      latestVersionName,
      forceUpdateEnabled,
      forceUpdateRequired,
      softUpdateAvailable,
      clientVersionCode: clientCode,
      clientVersionName: clientName,
      title: updateTitle,
      message: updateMessage,
      playStoreUrl
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message || 'Failed to check app version'
    }, 500);
  }
}
