import { Hono } from 'hono';
import type { AppContext } from '../types';
import { hashPassword } from '../utils/crypto';
import { ensureSeedProfiles, SEED_PASSWORD } from '../utils/seedData';

export const adminRouter = new Hono<AppContext>();

// Default Superadmin seed hash for 'QurbAdmin2026!Secure'
const DEFAULT_ADMIN_HASH = 'e510d5bb3f30257c52849f4f7fdd2b2417b6c11f2803924fad888dcbf39de858';

// Helper to auto-ensure admins table exists in D1 and seed initial admin if empty
async function ensureAdminTableAndSeed(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'superadmin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const existingCount = await db.prepare('SELECT COUNT(*) as count FROM admins').first();
    if (!existingCount || Number(existingCount.count) === 0) {
      await db.prepare(`
        INSERT OR IGNORE INTO admins (id, username, password_hash, name, role)
        VALUES ('adm_root', 'admin', ?, 'Qurb Super Admin', 'superadmin')
      `).bind(DEFAULT_ADMIN_HASH).run();
    }

    // Auto-migrate missing columns in live D1 tables safely
    try {
      await db.prepare('ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT 0').run();
    } catch {}
    try {
      await db.prepare("ALTER TABLE users ADD COLUMN account_status TEXT DEFAULT 'active'").run();
    } catch {}
    try {
      await db.prepare("ALTER TABLE users ADD COLUMN ban_reason TEXT DEFAULT NULL").run();
    } catch {}

    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS user_wallets (
          user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          direct_salams_balance INTEGER DEFAULT 2,
          daily_messages_quota INTEGER DEFAULT 15,
          messages_sent_today INTEGER DEFAULT 0,
          subscription_tier TEXT DEFAULT 'free',
          is_spotlight_active BOOLEAN DEFAULT 0,
          spotlight_expires_at TEXT DEFAULT NULL,
          ads_watched_for_salam INTEGER DEFAULT 0,
          daily_likes_quota INTEGER DEFAULT 50,
          likes_used_today INTEGER DEFAULT 0,
          last_likes_reset_date TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    } catch {}

    try {
      await ensureSeedProfiles(db);
    } catch (e) {
      console.warn('ensureSeedProfiles notice:', e);
    }
  } catch (err) {
    console.warn('ensureAdminTable notice:', err);
  }
}

// 1. Admin Authentication: Login
adminRouter.post('/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ success: false, error: 'Username and password are required' }, 400);
    }

    await ensureAdminTableAndSeed(c.env.DB);

    const cleanUser = username.trim().toLowerCase();
    const hashed = await hashPassword(password);

    const admin = await c.env.DB.prepare(
      'SELECT id, username, password_hash, name, role FROM admins WHERE LOWER(username) = ?'
    ).bind(cleanUser).first();

    if (!admin || admin.password_hash !== hashed) {
      return c.json({ success: false, error: 'Invalid admin credentials' }, 401);
    }

    const token = `adm_tok_${admin.id}.${Math.random().toString(36).substring(2, 12)}.${Date.now()}`;

    return c.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Login failed' }, 500);
  }
});

// Admin Authorization Middleware for Protected Admin Routes
adminRouter.use('*', async (c, next) => {
  if (c.req.path.endsWith('/auth/login')) {
    return next();
  }

  const authHeader = c.req.header('Authorization') || '';
  const customHeader = c.req.header('x-admin-token') || '';
  let token = customHeader;

  if (!token && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Strict check: Regular user tokens (st_*) are strictly forbidden!
  if (!token || !token.startsWith('adm_tok_')) {
    return c.json({ success: false, error: 'Forbidden: Admin authorization required' }, 403);
  }

  const tokenBody = token.slice('adm_tok_'.length);
  const [adminId] = tokenBody.split('.');

  if (!adminId) {
    return c.json({ success: false, error: 'Unauthorized: Malformed admin token' }, 401);
  }

  await ensureAdminTableAndSeed(c.env.DB);
  const adminExists = await c.env.DB.prepare('SELECT id, name, role FROM admins WHERE id = ?').bind(adminId).first();
  if (!adminExists) {
    return c.json({ success: false, error: 'Unauthorized: Admin record not found' }, 401);
  }

  c.set('adminUser' as any, adminExists);
  return next();
});

// 2. Distinct Populated Cities for Dynamic Filtering
adminRouter.get('/cities', async (c) => {
  try {
    const citiesRes = await c.env.DB.prepare(`
      SELECT city, COUNT(*) as count 
      FROM users 
      WHERE city IS NOT NULL AND TRIM(city) != '' AND city != 'Global'
      GROUP BY city 
      ORDER BY count DESC, city ASC
      LIMIT 100
    `).all();

    return c.json({
      success: true,
      cities: citiesRes?.results || []
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Deep Dashboard Analytics & Executive Metrics
adminRouter.get('/dashboard/stats', async (c) => {
  try {
    const totalUsersRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
    const maleUsersRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE gender = 'male'").first();
    const femaleUsersRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE gender = 'female'").first();
    const vipUsersRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users WHERE is_vip = 1').first();

    let bannedCount = 0;
    try {
      const bRes = await c.env.DB.prepare(
        "SELECT COUNT(*) as c FROM users WHERE (account_status = 'banned' OR is_banned = 1)"
      ).first();
      bannedCount = Number(bRes?.c || 0);
    } catch {}

    let matchesCount = 0;
    try {
      const mRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM matches_and_likes WHERE action IN ('liked', 'mutual_match')").first();
      matchesCount = Number(mRes?.c || 0);
    } catch {}

    let conversationsCount = 0;
    try {
      const cRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM conversations').first();
      conversationsCount = Number(cRes?.c || 0);
    } catch {}

    let pendingWaliCount = 0;
    try {
      const wRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM wali_details WHERE is_verified = 0').first();
      pendingWaliCount = Number(wRes?.c || 0);
    } catch {}

    // Signups growth periods
    let todaySignups = 0;
    let weekSignups = 0;
    let monthSignups = 0;
    try {
      const todayRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = date('now')").first();
      todaySignups = Number(todayRes?.c || 0);

      const weekRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', '-7 days')").first();
      weekSignups = Number(weekRes?.c || 0);

      const monthRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', '-30 days')").first();
      monthSignups = Number(monthRes?.c || 0);
    } catch {}

    // Top 5 populated cities
    let topCities: any[] = [];
    try {
      const topCitiesRes = await c.env.DB.prepare(`
        SELECT city, COUNT(*) as count 
        FROM users 
        WHERE city IS NOT NULL AND TRIM(city) != '' AND city != 'Global'
        GROUP BY city 
        ORDER BY count DESC 
        LIMIT 5
      `).all();
      topCities = topCitiesRes?.results || [];
    } catch {}

    const total = Number(totalUsersRes?.c || 0);
    const male = Number(maleUsersRes?.c || 0);
    const female = Number(femaleUsersRes?.c || 0);

    const maleRatio = total > 0 ? Math.round((male / total) * 100) : 0;
    const femaleRatio = total > 0 ? Math.round((female / total) * 100) : 0;

    return c.json({
      success: true,
      stats: {
        totalUsers: total,
        maleUsers: male,
        femaleUsers: female,
        maleRatio,
        femaleRatio,
        vipSubscribers: Number(vipUsersRes?.c || 0),
        bannedUsers: bannedCount,
        activeMatches: matchesCount,
        totalConversations: conversationsCount,
        pendingWalis: pendingWaliCount,
        growth: {
          today: todaySignups,
          thisWeek: weekSignups,
          thisMonth: monthSignups
        },
        topCities,
        systemStatus: 'healthy',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. High-Scale User Directory (Server-Side Pagination, Sorting & Multi-Filters)
adminRouter.get('/users', async (c) => {
  try {
    const search = c.req.query('search') || '';
    const gender = c.req.query('gender') || '';
    const city = c.req.query('city') || '';
    const status = c.req.query('status') || '';
    const membership = c.req.query('membership') || '';
    const sort = c.req.query('sort') || 'newest';

    const page = Math.max(1, Number(c.req.query('page')) || 1);
    const limit = Math.min(Math.max(10, Number(c.req.query('limit')) || 25), 100);
    const offset = (page - 1) * limit;

    let baseFilter = ' WHERE 1=1';
    const params: any[] = [];

    if (search.trim()) {
      baseFilter += ` AND (LOWER(u.full_name) LIKE ? OR LOWER(u.email) LIKE ? OR u.phone LIKE ? OR LOWER(u.city) LIKE ? OR LOWER(u.profession) LIKE ?)`;
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term, term, term);
    }

    if (gender) {
      baseFilter += ` AND u.gender = ?`;
      params.push(gender);
    }

    if (city.trim()) {
      baseFilter += ` AND LOWER(u.city) = ?`;
      params.push(city.trim().toLowerCase());
    }

    if (status === 'banned') {
      baseFilter += ` AND (u.account_status = 'banned' OR u.is_banned = 1)`;
    } else if (status === 'deleted') {
      baseFilter += ` AND u.account_status = 'deleted'`;
    } else if (status === 'active') {
      baseFilter += ` AND (u.account_status != 'banned' AND u.account_status != 'deleted' AND (u.is_banned = 0 OR u.is_banned IS NULL))`;
    }

    if (membership === 'vip') {
      baseFilter += ` AND u.is_vip = 1`;
    } else if (membership === 'free') {
      baseFilter += ` AND (u.is_vip = 0 OR u.is_vip IS NULL)`;
    }

    // Sorting order
    let orderBy = ' ORDER BY u.created_at DESC';
    if (sort === 'oldest') {
      orderBy = ' ORDER BY u.created_at ASC';
    } else if (sort === 'name_asc') {
      orderBy = ' ORDER BY u.full_name ASC';
    }

    // 1. Count matching records
    const countSql = `SELECT COUNT(*) as total FROM users u ${baseFilter}`;
    const countRes = await c.env.DB.prepare(countSql).bind(...params).first();
    const totalMatching = Number(countRes?.total || 0);

    // 2. Query paginated slice
    const query = `
      SELECT u.id, u.full_name, u.email, u.phone, u.gender, u.city, u.location, 
             u.profession, u.education, u.is_vip, u.account_status, u.is_banned, u.created_at,
             (SELECT photo_url FROM user_photos up WHERE up.user_id = u.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as primary_photo,
             (SELECT COUNT(*) FROM user_photos up WHERE up.user_id = u.id) as photo_count
      FROM users u
      ${baseFilter}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const usersResult = await c.env.DB.prepare(query).bind(...params, limit, offset).all();

    return c.json({
      success: true,
      users: usersResult?.results || [],
      total: totalMatching,
      page,
      limit,
      totalPages: Math.ceil(totalMatching / limit) || 1
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. Detailed User Profile Card with all Photos & Wallet Data
adminRouter.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const religious = await c.env.DB.prepare('SELECT * FROM religious_profiles WHERE user_id = ?').bind(id).first();
    const wali = await c.env.DB.prepare('SELECT * FROM wali_details WHERE user_id = ?').bind(id).first();
    const photos = await c.env.DB.prepare('SELECT * FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC, sort_order ASC').bind(id).all();
    
    let wallet: any = null;
    try {
      wallet = await c.env.DB.prepare('SELECT * FROM user_wallets WHERE user_id = ?').bind(id).first();
    } catch {}

    return c.json({
      success: true,
      user: {
        ...user,
        religious_profile: religious || null,
        wali_details: wali || null,
        photos: photos?.results || [],
        wallet: wallet || null
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Update User Status (Ban / Unban / Suspend with Audit Reason)
adminRouter.post('/users/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, isBanned, reason } = await c.req.json();

    const targetStatus = status || (isBanned ? 'banned' : 'active');
    const bannedFlag = targetStatus === 'banned' ? 1 : 0;
    const banReason = bannedFlag ? (reason || 'Administrative suspension') : null;

    try {
      await c.env.DB.prepare(`
        UPDATE users 
        SET account_status = ?, is_banned = ?, ban_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(targetStatus, bannedFlag, banReason, id).run();
    } catch {
      // Fallback if ban_reason column not yet migrated
      await c.env.DB.prepare(`
        UPDATE users 
        SET account_status = ?, is_banned = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(targetStatus, bannedFlag, id).run();
    }

    return c.json({
      success: true,
      message: `User status successfully updated to ${targetStatus}`,
      status: targetStatus,
      isBanned: Boolean(bannedFlag),
      reason: banReason
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7. Update User VIP Status & Sync with User Wallet
adminRouter.post('/users/:id/vip', async (c) => {
  try {
    const id = c.req.param('id');
    const { isVip } = await c.req.json();
    const vipVal = isVip ? 1 : 0;
    const subTier = vipVal ? 'barakah_vip' : 'free';
    const msgQuota = vipVal ? 9999 : 15;

    await c.env.DB.prepare(`
      UPDATE users 
      SET is_vip = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(vipVal, id).run();

    try {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, subscription_tier, daily_messages_quota, direct_salams_balance)
        VALUES (?, ?, ?, CASE WHEN ? = 1 THEN 20 ELSE 2 END)
        ON CONFLICT(user_id) DO UPDATE SET 
          subscription_tier = excluded.subscription_tier,
          daily_messages_quota = excluded.daily_messages_quota,
          direct_salams_balance = CASE WHEN ? = 1 AND user_wallets.direct_salams_balance < 20 THEN 20 ELSE user_wallets.direct_salams_balance END
      `).bind(id, subTier, msgQuota, vipVal, vipVal).run();
    } catch (err) {
      console.warn('Wallet VIP sync notice:', err);
    }

    return c.json({
      success: true,
      message: `User VIP status updated to ${Boolean(vipVal)}`,
      isVip: Boolean(vipVal),
      tier: subTier
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7.1 Comprehensive Manual Subscription & Quotas Manager
adminRouter.post('/users/:id/subscription', async (c) => {
  try {
    const id = c.req.param('id');
    const { tier, directSalams, isVip, resetQuotas } = await c.req.json();

    const isVipActive = isVip !== undefined ? Boolean(isVip) : (tier === 'barakah_vip');
    const vipVal = isVipActive ? 1 : 0;
    const subTier = isVipActive ? 'barakah_vip' : 'free';
    const msgQuota = isVipActive ? 9999 : 15;
    const bonusSalams = Number(directSalams) || 0;

    // 1. Update users table
    await c.env.DB.prepare(`
      UPDATE users 
      SET is_vip = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(vipVal, id).run();

    // 2. Atomically sync user_wallets
    try {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, subscription_tier, daily_messages_quota, direct_salams_balance)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET 
          subscription_tier = excluded.subscription_tier,
          daily_messages_quota = excluded.daily_messages_quota,
          direct_salams_balance = CASE 
            WHEN ? > 0 THEN user_wallets.direct_salams_balance + ? 
            WHEN ? = 0 AND ? = 1 AND user_wallets.direct_salams_balance < 20 THEN 20
            ELSE user_wallets.direct_salams_balance 
          END,
          likes_used_today = CASE WHEN ? = 1 THEN 0 ELSE user_wallets.likes_used_today END,
          messages_sent_today = CASE WHEN ? = 1 THEN 0 ELSE user_wallets.messages_sent_today END
      `).bind(
        id, subTier, msgQuota, Math.max(2, bonusSalams),
        bonusSalams, bonusSalams,
        bonusSalams, vipVal,
        resetQuotas ? 1 : 0, resetQuotas ? 1 : 0
      ).run();
    } catch (err) {
      console.warn('Subscription manager wallet sync notice:', err);
    }

    let updatedWallet: any = null;
    try {
      updatedWallet = await c.env.DB.prepare('SELECT * FROM user_wallets WHERE user_id = ?').bind(id).first();
    } catch {}

    return c.json({
      success: true,
      message: `User subscription successfully updated to ${subTier}`,
      isVip: Boolean(vipVal),
      tier: subTier,
      wallet: updatedWallet
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7.2 Switch User Gender with Islamic Safe Interaction Reset
adminRouter.post('/users/:id/gender', async (c) => {
  try {
    const id = c.req.param('id');
    const { gender, reason } = await c.req.json();

    if (!gender || (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female')) {
      return c.json({ success: false, error: 'Valid gender (male or female) is required' }, 400);
    }

    const targetGender = gender.toLowerCase().trim();

    // Verify user exists
    const user = await c.env.DB.prepare('SELECT id, full_name, gender FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // 1. Update user's gender
    await c.env.DB.prepare(`
      UPDATE users 
      SET gender = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(targetGender, id).run();

    // 2. Safeguard matching invariants: Reset existing likes & matches
    await c.env.DB.prepare(`
      DELETE FROM matches_and_likes WHERE sender_id = ? OR receiver_id = ?
    `).bind(id, id).run();

    // 3. Reset active conversations to prevent invalid opposite-gender pairings
    try {
      await c.env.DB.prepare(`
        DELETE FROM conversations WHERE participant_one = ? OR participant_two = ?
      `).bind(id, id).run();
    } catch {}

    // 4. Reset photo reveals
    try {
      await c.env.DB.prepare(`
        DELETE FROM photo_reveals WHERE owner_id = ? OR viewer_id = ?
      `).bind(id, id).run();
    } catch {}

    // 5. If changed to 'male', remove obsolete wali details (brothers don't have walis)
    if (targetGender === 'male') {
      try {
        await c.env.DB.prepare('DELETE FROM wali_details WHERE user_id = ?').bind(id).run();
      } catch {}
    } else {
      // If changed to 'female', default to modest blurred photos for modesty protection
      try {
        await c.env.DB.prepare('UPDATE users SET blur_photos_by_default = 1 WHERE id = ?').bind(id).run();
      } catch {}
    }

    return c.json({
      success: true,
      message: `User gender successfully updated to ${targetGender}. All prior likes, matches, and chats have been safely reset to protect matrimonial matching integrity.`,
      gender: targetGender,
      user: {
        id: user.id,
        full_name: user.full_name,
        gender: targetGender
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7.3 Remove User (Soft Deactivate or Permanent Purge)
adminRouter.delete('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const isPermanentQuery = c.req.query('permanent') === 'true';
    let isPermanentBody = false;
    let reason = 'Administrative removal';

    try {
      const body = await c.req.json();
      if (body?.permanent) isPermanentBody = true;
      if (body?.reason) reason = body.reason;
    } catch {}

    const isPermanent = isPermanentQuery || isPermanentBody;

    // Verify user exists
    const user = await c.env.DB.prepare('SELECT id, full_name, email FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    if (isPermanent) {
      // Hard delete: relies on ON DELETE CASCADE in SQLite/D1
      await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

      return c.json({
        success: true,
        message: `User ${user.full_name || id} and all associated records permanently removed.`,
        permanent: true,
        deletedId: id
      });
    } else {
      // Soft delete: marks as deleted, bans, and clears active likes/matches
      try {
        await c.env.DB.prepare(`
          UPDATE users 
          SET account_status = 'deleted', is_banned = 1, ban_reason = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(reason, id).run();
      } catch {
        await c.env.DB.prepare(`
          UPDATE users 
          SET account_status = 'deleted', is_banned = 1, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(id).run();
      }

      // Clear pending likes/matches so they no longer appear in anyone's queue
      try {
        await c.env.DB.prepare('DELETE FROM matches_and_likes WHERE sender_id = ? OR receiver_id = ?').bind(id, id).run();
      } catch {}

      return c.json({
        success: true,
        message: `User ${user.full_name || id} safely deactivated and marked as deleted.`,
        permanent: false,
        deletedId: id
      });
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 8. Photos Moderation Queue
adminRouter.get('/photos/moderation', async (c) => {
  try {
    const gender = c.req.query('gender') || '';
    let query = `
      SELECT up.id, up.user_id, up.photo_url, up.is_primary, up.sort_order,
             u.full_name, u.email, u.gender, u.city, u.profession, u.bio, u.account_status, u.is_vip
      FROM user_photos up
      JOIN users u ON up.user_id = u.id
    `;
    const params: any[] = [];
    if (gender) {
      query += ` WHERE u.gender = ?`;
      params.push(gender);
    }
    query += ` ORDER BY up.id DESC LIMIT 100`;

    const photos = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({
      success: true,
      photos: photos?.results || []
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 9. Photo Arrangement: Set as Primary Photo
adminRouter.post('/photos/:id/primary', async (c) => {
  try {
    const photoId = c.req.param('id');
    const photo = await c.env.DB.prepare('SELECT id, user_id FROM user_photos WHERE id = ?').bind(photoId).first();
    if (!photo) {
      return c.json({ success: false, error: 'Photo not found' }, 404);
    }

    // Set all other photos for this user to is_primary = 0
    await c.env.DB.prepare('UPDATE user_photos SET is_primary = 0 WHERE user_id = ?').bind(photo.user_id).run();
    // Set this photo as primary
    await c.env.DB.prepare('UPDATE user_photos SET is_primary = 1 WHERE id = ?').bind(photoId).run();

    return c.json({
      success: true,
      message: 'Photo set as primary profile cover successfully'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 10. Delete Inappropriate Photo
adminRouter.delete('/photos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const photo = await c.env.DB.prepare('SELECT id, user_id, is_primary FROM user_photos WHERE id = ?').bind(id).first();
    if (!photo) {
      return c.json({ success: false, error: 'Photo not found' }, 404);
    }

    await c.env.DB.prepare('DELETE FROM user_photos WHERE id = ?').bind(id).run();

    // If deleted photo was primary, assign next photo as primary
    if (photo.is_primary) {
      const nextPhoto = await c.env.DB.prepare(
        'SELECT id FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC LIMIT 1'
      ).bind(photo.user_id).first();
      if (nextPhoto) {
        await c.env.DB.prepare('UPDATE user_photos SET is_primary = 1 WHERE id = ?').bind(nextPhoto.id).run();
      }
    }

    return c.json({
      success: true,
      message: 'Photo removed from user profile successfully'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 11. Wali Chaperone Registry & Verification
adminRouter.get('/wali/list', async (c) => {
  try {
    const walis = await c.env.DB.prepare(`
      SELECT w.*, u.full_name as member_name, u.email as member_email, u.gender as member_gender
      FROM wali_details w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.is_verified ASC, w.created_at DESC
      LIMIT 100
    `).all();

    return c.json({
      success: true,
      walis: walis?.results || []
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminRouter.post('/wali/:id/verify', async (c) => {
  try {
    const id = c.req.param('id');
    const { isVerified } = await c.req.json();
    const val = isVerified ? 1 : 0;

    await c.env.DB.prepare('UPDATE wali_details SET is_verified = ? WHERE id = ?').bind(val, id).run();
    return c.json({
      success: true,
      message: `Wali verification updated to ${Boolean(val)}`,
      isVerified: Boolean(val)
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 12. Global Broadcast Announcement
adminRouter.post('/broadcast', async (c) => {
  try {
    const { title, message } = await c.req.json();
    if (!title?.trim() || !message?.trim()) {
      return c.json({ success: false, error: 'Title and message are required for broadcast' }, 400);
    }

    // Fetch all user IDs
    const usersRes = await c.env.DB.prepare('SELECT id FROM users').all();
    const usersList = usersRes?.results || [];

    let count = 0;
    for (const u of usersList) {
      try {
        const notifId = `notif_bc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await c.env.DB.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, is_read)
          VALUES (?, ?, 'system_broadcast', ?, ?, 0)
        `).bind(notifId, u.id, title.trim(), message.trim()).run();
        count++;
      } catch {}
    }

    return c.json({
      success: true,
      message: `Broadcast delivered to ${count} members successfully`,
      deliveredCount: count
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 13. Pakistani Female Seed Profiles Management
adminRouter.get('/seed-profiles', async (c) => {
  try {
    await ensureAdminTableAndSeed(c.env.DB);

    // Get global setting
    let globalEnabled = true;
    try {
      const setting: any = await c.env.DB.prepare("SELECT value FROM app_settings WHERE key = 'seed_profiles_enabled'").first();
      if (setting && (setting.value === '0' || setting.value === 0)) {
        globalEnabled = false;
      }
    } catch {}

    const query = `
      SELECT 
        u.id, u.full_name as fullName, u.email, u.phone, u.dob, u.city, u.location,
        u.profession, u.education, u.university, u.height, u.ethnicity,
        u.bio, u.seed_active as seedActive, u.seed_password as seedPassword,
        u.is_seed as isSeed, u.created_at as createdAt,
        up.photo_url as photoUrl,
        rp.sect, rp.practice_level as practiceLevel, rp.modesty_practice as modestyPractice,
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone
      FROM users u
      LEFT JOIN user_photos up ON up.user_id = u.id AND up.is_primary = 1
      LEFT JOIN religious_profiles rp ON rp.user_id = u.id
      LEFT JOIN wali_details w ON w.user_id = u.id
      WHERE u.is_seed = 1
      ORDER BY u.id ASC
    `;

    const { results } = await c.env.DB.prepare(query).all();
    const profiles = results || [];

    const totalCount = profiles.length;
    const activeCount = profiles.filter((p: any) => p.seedActive === 1 || p.seedActive === true).length;

    return c.json({
      success: true,
      globalEnabled,
      defaultPassword: SEED_PASSWORD,
      totalCount,
      activeCount,
      profiles
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminRouter.post('/seed-profiles/toggle-global', async (c) => {
  try {
    await ensureAdminTableAndSeed(c.env.DB);
    const body = await c.req.json().catch(() => ({}));
    let enabled: boolean;

    if (typeof body.enabled === 'boolean') {
      enabled = body.enabled;
    } else {
      const current: any = await c.env.DB.prepare("SELECT value FROM app_settings WHERE key = 'seed_profiles_enabled'").first();
      enabled = current ? current.value !== '1' : false;
    }

    const valStr = enabled ? '1' : '0';
    await c.env.DB.prepare(`
      INSERT INTO app_settings (key, value, updated_at) 
      VALUES ('seed_profiles_enabled', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(valStr).run();

    return c.json({
      success: true,
      globalEnabled: enabled,
      message: `Seed profiles discover feed visibility set to ${enabled ? 'ENABLED' : 'DISABLED'}`
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminRouter.post('/seed-profiles/toggle-active/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    
    let active: number;
    if (typeof body.active === 'boolean') {
      active = body.active ? 1 : 0;
    } else {
      const user: any = await c.env.DB.prepare('SELECT seed_active FROM users WHERE id = ? AND is_seed = 1').bind(id).first();
      if (!user) {
        return c.json({ success: false, error: 'Seed profile not found' }, 404);
      }
      active = user.seed_active === 1 ? 0 : 1;
    }

    await c.env.DB.prepare('UPDATE users SET seed_active = ? WHERE id = ? AND is_seed = 1').bind(active, id).run();

    return c.json({
      success: true,
      id,
      seedActive: active === 1,
      message: `Seed profile ${id} visibility set to ${active === 1 ? 'ACTIVE' : 'INACTIVE'}`
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminRouter.post('/seed-profiles/reset', async (c) => {
  try {
    const count = await ensureSeedProfiles(c.env.DB);
    return c.json({
      success: true,
      message: `Seed profiles ensured/synchronized (${count} profiles)`,
      count
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminRouter.delete('/seed-profiles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM users WHERE id = ? AND is_seed = 1').bind(id).run();
    await c.env.DB.prepare('DELETE FROM user_photos WHERE user_id = ?').bind(id).run();
    await c.env.DB.prepare('DELETE FROM religious_profiles WHERE user_id = ?').bind(id).run();
    await c.env.DB.prepare('DELETE FROM wali_details WHERE user_id = ?').bind(id).run();

    return c.json({
      success: true,
      message: `Seed profile ${id} removed successfully`,
      id
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
