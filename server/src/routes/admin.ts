import { Hono } from 'hono';
import type { AppContext } from '../types';
import { hashPassword } from '../utils/crypto';

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
    } else if (status === 'active') {
      baseFilter += ` AND (u.account_status != 'banned' AND (u.is_banned = 0 OR u.is_banned IS NULL))`;
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

// 5. Detailed User Profile Card with all Photos
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

    return c.json({
      success: true,
      user: {
        ...user,
        religious_profile: religious || null,
        wali_details: wali || null,
        photos: photos?.results || []
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Update User Status (Ban / Unban / Suspend)
adminRouter.post('/users/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, isBanned } = await c.req.json();

    const targetStatus = status || (isBanned ? 'banned' : 'active');
    const bannedFlag = targetStatus === 'banned' ? 1 : 0;

    await c.env.DB.prepare(`
      UPDATE users 
      SET account_status = ?, is_banned = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(targetStatus, bannedFlag, id).run();

    return c.json({
      success: true,
      message: `User status successfully updated to ${targetStatus}`,
      status: targetStatus,
      isBanned: Boolean(bannedFlag)
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7. Update User VIP Status
adminRouter.post('/users/:id/vip', async (c) => {
  try {
    const id = c.req.param('id');
    const { isVip } = await c.req.json();
    const vipVal = isVip ? 1 : 0;

    await c.env.DB.prepare(`
      UPDATE users 
      SET is_vip = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(vipVal, id).run();

    return c.json({
      success: true,
      message: `User VIP status updated to ${Boolean(vipVal)}`,
      isVip: Boolean(vipVal)
    });
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
