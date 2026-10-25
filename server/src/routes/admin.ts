import { Hono } from 'hono';
import type { AppContext } from '../types';
import { hashPassword } from '../utils/crypto';
import { ensureSeedProfiles, SEED_PASSWORD } from '../utils/seedData';
import { getPendingCatchupCount, processCatchupReplies } from '../utils/ai-chat-agent';

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
      await db.prepare("ALTER TABLE users ADD COLUMN last_active_at DATETIME").run();
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
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      await db.prepare(`
        INSERT OR IGNORE INTO system_settings (key, value) VALUES ('ai_agent_enabled', '1')
      `).run();
    } catch {}

    try {
      const seedCheck = await db.prepare("SELECT COUNT(*) as count FROM users WHERE is_seed = 1").first();
      if (!seedCheck || Number(seedCheck.count) === 0) {
        await ensureSeedProfiles(db);
      }
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
        AND (is_seed = 0 OR is_seed IS NULL)
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
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    const totalUsersRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users WHERE (is_seed = 0 OR is_seed IS NULL)').first();
    const maleUsersRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE gender = 'male' AND (is_seed = 0 OR is_seed IS NULL)").first();
    const femaleUsersRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE gender = 'female' AND (is_seed = 0 OR is_seed IS NULL)").first();
    const vipUsersRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users WHERE is_vip = 1 AND (is_seed = 0 OR is_seed IS NULL)').first();

    let bannedCount = 0;
    try {
      const bRes = await c.env.DB.prepare(
        "SELECT COUNT(*) as c FROM users WHERE (account_status = 'banned' OR is_banned = 1) AND (is_seed = 0 OR is_seed IS NULL)"
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

    // Signups growth periods (excluding seed profiles)
    let todaySignups = 0;
    let weekSignups = 0;
    let monthSignups = 0;
    let dailyBreakdown: any[] = [];
    let selectedDateStats: any = null;
    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const targetDate = c.req.query('date') || todayStr;

    try {
      const todayRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = date('now') AND (is_seed = 0 OR is_seed IS NULL)").first();
      todaySignups = Number(todayRes?.c || 0);

      const weekRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', '-7 days') AND (is_seed = 0 OR is_seed IS NULL)").first();
      weekSignups = Number(weekRes?.c || 0);

      const monthRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', '-30 days') AND (is_seed = 0 OR is_seed IS NULL)").first();
      monthSignups = Number(monthRes?.c || 0);

      // Date-wise daily breakdown for past 14 days
      const breakdownRes = await c.env.DB.prepare(`
        SELECT 
          date(created_at) as date, 
          COUNT(*) as signups, 
          SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) as male, 
          SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female 
        FROM users 
        WHERE created_at >= datetime('now', '-30 days') 
          AND (is_seed = 0 OR is_seed IS NULL) 
        GROUP BY date(created_at) 
        ORDER BY date DESC 
        LIMIT 14
      `).all();
      dailyBreakdown = (breakdownRes?.results || []).map((row: any) => ({
        date: row.date,
        signups: Number(row.signups || 0),
        male: Number(row.male || 0),
        female: Number(row.female || 0)
      }));

      // Stats for selected date
      const selUserRes = await c.env.DB.prepare(`
        SELECT 
          COUNT(*) as signups,
          SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) as male,
          SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female
        FROM users 
        WHERE date(created_at) = ? AND (is_seed = 0 OR is_seed IS NULL)
      `).bind(targetDate).first();

      const selMatchRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM matches_and_likes WHERE date(created_at) = ?
      `).bind(targetDate).first();

      const selMsgRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM chat_messages WHERE date(created_at) = ?
      `).bind(targetDate).first();

      selectedDateStats = {
        date: targetDate,
        signups: Number(selUserRes?.signups || 0),
        male: Number(selUserRes?.male || 0),
        female: Number(selUserRes?.female || 0),
        matches: Number(selMatchRes?.c || 0),
        messages: Number(selMsgRes?.c || 0)
      };
    } catch {}

    // Top 5 populated cities (real organic users only)
    let topCities: any[] = [];
    try {
      const topCitiesRes = await c.env.DB.prepare(`
        SELECT city, COUNT(*) as count 
        FROM users 
        WHERE city IS NOT NULL AND TRIM(city) != '' AND city != 'Global'
          AND (is_seed = 0 OR is_seed IS NULL)
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
          thisMonth: monthSignups,
          dates: {
            todayDate: todayStr,
            weekStart: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            monthStart: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
          },
          dailyBreakdown,
          selectedDate: targetDate,
          selectedDateStats
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

// 3. Live Platform Radar & Real-Time Activity (Active Users & Live Conversations)
adminRouter.get('/live-activity', async (c) => {
  try {
    // A. Live summary metrics (100% Strictly Real Organic Users)
    let onlineUsersCount = 0;
    let activeUsersTodayCount = 0;
    try {
      // 1. Real human users online in the last 10 minutes
      const onRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM users 
        WHERE (is_banned = 0 OR is_banned IS NULL)
          AND (is_seed = 0 OR is_seed IS NULL)
          AND COALESCE(last_active_at, created_at) >= datetime('now', '-10 minutes')
      `).first();
      onlineUsersCount = Number(onRes?.c || 0);

      // 2. Real human users active today
      const todayRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM users 
        WHERE (is_banned = 0 OR is_banned IS NULL)
          AND (is_seed = 0 OR is_seed IS NULL)
          AND date(COALESCE(last_active_at, created_at)) = date('now')
      `).first();
      activeUsersTodayCount = Number(todayRes?.c || 0);
    } catch {}

    let totalConversationsCount = 0;
    try {
      const convRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM conversations').first();
      totalConversationsCount = Number(convRes?.c || 0);
    } catch {}

    let totalMessagesCount = 0;
    let messagesTodayCount = 0;
    try {
      const msgRes = await c.env.DB.prepare('SELECT COUNT(*) as c FROM chat_messages').first();
      totalMessagesCount = Number(msgRes?.c || 0);

      const msgTodayRes = await c.env.DB.prepare("SELECT COUNT(*) as c FROM chat_messages WHERE date(created_at) = date('now')").first();
      messagesTodayCount = Number(msgTodayRes?.c || 0);
    } catch {}

    // B. Live / Active Real Users (Strictly real members ordered by most recent activity)
    const { results: rawUsers } = await c.env.DB.prepare(`
      SELECT 
        u.id, u.full_name as fullName, u.gender, u.city, u.country, u.profession,
        u.is_vip as isVip, u.is_seed as isSeed, u.account_status as accountStatus,
        u.last_active_at as lastActiveAt, u.created_at as createdAt,
        CAST((strftime('%s', 'now') - strftime('%s', COALESCE(u.last_active_at, u.created_at))) AS INTEGER) as secondsAgo
      FROM users u
      WHERE (u.is_banned = 0 OR u.is_banned IS NULL)
        AND (u.is_seed = 0 OR u.is_seed IS NULL)
      ORDER BY COALESCE(u.last_active_at, u.created_at) DESC
      LIMIT 100
    `).all();

    // Fetch primary photos for all users in liveUsers
    const userIds = (rawUsers || []).map((u: any) => u.id);
    const photoMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const chunkSize = 25;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: photos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();
        (photos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = p.photo_url;
        });
      }
    }

    const liveUsers = (rawUsers || []).map((u: any) => {
      const sec = typeof u.secondsAgo === 'number' && !isNaN(u.secondsAgo) && u.secondsAgo >= 0 
        ? u.secondsAgo 
        : Math.max(0, Math.floor((Date.now() - new Date(u.lastActiveAt || u.createdAt).getTime()) / 1000));

      let status: 'online' | 'away' | 'recent' | 'offline' = 'offline';
      let currentAction = 'Offline';

      if (sec <= 600) {
        status = 'online';
        currentAction = sec <= 120 ? 'Active in app now' : `Active ${Math.round(sec / 60)}m ago`;
      } else if (sec <= 1800) {
        status = 'away';
        currentAction = `Away (${Math.round(sec / 60)}m ago)`;
      } else if (sec <= 86400) {
        status = 'recent';
        currentAction = `Active ${Math.round(sec / 3600)}h ago`;
      } else {
        status = 'offline';
        currentAction = 'Offline';
      }

      let photoUrl = photoMap[u.id] || (u.gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg');
      if (photoUrl && photoUrl.includes('/seeds/') && !photoUrl.includes('?v=')) {
        photoUrl = `${photoUrl}?v=ht3_20261014`;
      }

      return {
        id: u.id,
        fullName: u.fullName || 'Anonymous Member',
        gender: u.gender || 'male',
        city: u.city || 'Pakistan',
        country: u.country || 'Pakistan',
        profession: u.profession || 'Professional',
        isVip: Boolean(u.isVip),
        isSeed: false,
        photoUrl,
        lastActiveAt: u.lastActiveAt || u.createdAt,
        secondsAgo: sec,
        status,
        currentAction
      };
    });

    // C. Live Conversations (All conversations with participant details & recent messages)
    const { results: rawConvs } = await c.env.DB.prepare(`
      SELECT 
        c.id, c.participant_one as p1_id, c.participant_two as p2_id,
        c.last_message_text as lastMessageText, c.last_message_sender_id as lastMessageSenderId,
        c.last_message_time as lastMessageTime, c.status,
        c.unread_count_p1 as unreadP1, c.unread_count_p2 as unreadP2,
        CAST((strftime('%s', 'now') - strftime('%s', c.last_message_time)) AS INTEGER) as secondsAgo,
        u1.full_name as p1_name, u1.gender as p1_gender, u1.city as p1_city, u1.is_vip as p1_vip,
        u2.full_name as p2_name, u2.gender as p2_gender, u2.city as p2_city, u2.is_vip as p2_vip,
        w1.wali_name as w1_name, w2.wali_name as w2_name,
        (SELECT COUNT(*) FROM chat_messages cm WHERE cm.conversation_id = c.id) as messageCount
      FROM conversations c
      LEFT JOIN users u1 ON c.participant_one = u1.id
      LEFT JOIN users u2 ON c.participant_two = u2.id
      LEFT JOIN wali_details w1 ON u1.id = w1.user_id
      LEFT JOIN wali_details w2 ON u2.id = w2.user_id
      ORDER BY c.last_message_time DESC
      LIMIT 60
    `).all();

    // Fetch photos for participants in conversations
    const convUserIds: string[] = [];
    (rawConvs || []).forEach((row: any) => {
      if (row.p1_id && !convUserIds.includes(row.p1_id)) convUserIds.push(row.p1_id);
      if (row.p2_id && !convUserIds.includes(row.p2_id)) convUserIds.push(row.p2_id);
    });

    const convPhotoMap: Record<string, string> = {};
    if (convUserIds.length > 0) {
      const chunkSize = 25;
      for (let i = 0; i < convUserIds.length; i += chunkSize) {
        const chunk = convUserIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: photos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();
        (photos || []).forEach((p: any) => {
          if (!convPhotoMap[p.user_id]) convPhotoMap[p.user_id] = p.photo_url;
        });
      }
    }

    const liveConversations = (rawConvs || []).map((row: any) => {
      let p1Photo = convPhotoMap[row.p1_id] || (row.p1_gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg');
      let p2Photo = convPhotoMap[row.p2_id] || (row.p2_gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg');
      if (p1Photo && p1Photo.includes('/seeds/') && !p1Photo.includes('?v=')) p1Photo = `${p1Photo}?v=ht3_20261014`;
      if (p2Photo && p2Photo.includes('/seeds/') && !p2Photo.includes('?v=')) p2Photo = `${p2Photo}?v=ht3_20261014`;

      const waliObserver = row.w1_name || row.w2_name || null;

      const sec = typeof row.secondsAgo === 'number' && !isNaN(row.secondsAgo) && row.secondsAgo >= 0
        ? row.secondsAgo
        : Math.max(0, Math.floor((Date.now() - new Date(row.lastMessageTime).getTime()) / 1000));

      return {
        id: row.id,
        lastMessageText: row.lastMessageText || 'Matched. Started dialogue.',
        lastMessageSenderId: row.lastMessageSenderId,
        lastMessageTime: row.lastMessageTime,
        secondsAgo: sec,
        status: row.status || 'active',
        messageCount: Number(row.messageCount || 0),
        waliObserver,
        participantOne: {
          id: row.p1_id,
          fullName: row.p1_name || 'Brother',
          gender: row.p1_gender || 'male',
          city: row.p1_city || 'Pakistan',
          isVip: Boolean(row.p1_vip),
          photoUrl: p1Photo
        },
        participantTwo: {
          id: row.p2_id,
          fullName: row.p2_name || 'Sister',
          gender: row.p2_gender || 'female',
          city: row.p2_city || 'Pakistan',
          isVip: Boolean(row.p2_vip),
          photoUrl: p2Photo
        }
      };
    });

    return c.json({
      success: true,
      summary: {
        onlineUsers: onlineUsersCount,
        activeUsersToday: activeUsersTodayCount,
        activeConversations: totalConversationsCount,
        totalMessages: totalMessagesCount,
        messagesToday: messagesTodayCount
      },
      liveUsers,
      liveConversations,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3.1 Get Specific Conversation Transcript for Super Admin Chaperone Oversight
adminRouter.get('/conversations/:id/messages', async (c) => {
  try {
    const convId = c.req.param('id');
    const conv: any = await c.env.DB.prepare(`
      SELECT c.*, 
        u1.full_name as p1_name, u1.gender as p1_gender, u1.city as p1_city,
        u2.full_name as p2_name, u2.gender as p2_gender, u2.city as p2_city,
        w1.wali_name as w1_name, w2.wali_name as w2_name
      FROM conversations c
      LEFT JOIN users u1 ON c.participant_one = u1.id
      LEFT JOIN users u2 ON c.participant_two = u2.id
      LEFT JOIN wali_details w1 ON u1.id = w1.user_id
      LEFT JOIN wali_details w2 ON u2.id = w2.user_id
      WHERE c.id = ?
    `).bind(convId).first();

    if (!conv) {
      return c.json({ success: false, error: 'Conversation not found' }, 404);
    }

    const { results: messages } = await c.env.DB.prepare(`
      SELECT id, conversation_id, sender_id as senderId, sender_name as senderName, text, created_at as timestamp
      FROM chat_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `).bind(convId).all();

    return c.json({
      success: true,
      conversation: {
        id: conv.id,
        status: conv.status || 'active',
        lastMessageTime: conv.last_message_time,
        waliObserver: conv.w1_name || conv.w2_name || null,
        participantOne: {
          id: conv.participant_one,
          fullName: conv.p1_name || 'Brother',
          gender: conv.p1_gender || 'male',
          city: conv.p1_city || 'Pakistan'
        },
        participantTwo: {
          id: conv.participant_two,
          fullName: conv.p2_name || 'Sister',
          gender: conv.p2_gender || 'female',
          city: conv.p2_city || 'Pakistan'
        }
      },
      messages: messages || []
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 3.2 Live Stream of Recent Platform Messages
adminRouter.get('/messages/recent', async (c) => {
  try {
    const limit = Math.min(100, Math.max(10, Number(c.req.query('limit')) || 60));
    const { results: rawMessages } = await c.env.DB.prepare(`
      SELECT 
        cm.id, cm.conversation_id as conversationId, cm.sender_id as senderId, 
        cm.sender_name as senderName, cm.text, cm.created_at as timestamp,
        u.city as senderCity, u.gender as senderGender, u.is_vip as senderVip,
        c.participant_one as p1_id, c.participant_two as p2_id,
        u1.full_name as p1_name, u2.full_name as p2_name,
        CAST((strftime('%s', 'now') - strftime('%s', cm.created_at)) AS INTEGER) as secondsAgo
      FROM chat_messages cm
      LEFT JOIN users u ON cm.sender_id = u.id
      LEFT JOIN conversations c ON cm.conversation_id = c.id
      LEFT JOIN users u1 ON c.participant_one = u1.id
      LEFT JOIN users u2 ON c.participant_two = u2.id
      ORDER BY cm.created_at DESC
      LIMIT ?
    `).bind(limit).all();

    // Fetch primary photos for senders
    const senderIds = Array.from(new Set((rawMessages || []).map((m: any) => m.senderId).filter(Boolean)));
    const photoMap: Record<string, string> = {};
    if (senderIds.length > 0) {
      const chunkSize = 25;
      for (let i = 0; i < senderIds.length; i += chunkSize) {
        const chunk = senderIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: photos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();
        (photos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = p.photo_url;
        });
      }
    }

    const messages = (rawMessages || []).map((m: any) => {
      let photoUrl = photoMap[m.senderId] || (m.senderGender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg');
      if (photoUrl && photoUrl.includes('/seeds/') && !photoUrl.includes('?v=')) {
        photoUrl = `${photoUrl}?v=ht3_20261014`;
      }
      return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName || 'Member',
        senderCity: m.senderCity || 'Pakistan',
        senderGender: m.senderGender || 'male',
        senderVip: Boolean(m.senderVip),
        photoUrl,
        text: m.text,
        timestamp: m.timestamp,
        secondsAgo: typeof m.secondsAgo === 'number' && !isNaN(m.secondsAgo) && m.secondsAgo >= 0 
          ? m.secondsAgo 
          : Math.max(0, Math.floor((Date.now() - new Date(m.timestamp).getTime()) / 1000)),
        recipientName: m.senderId === m.p1_id ? (m.p2_name || 'Member') : (m.p1_name || 'Member')
      };
    });

    return c.json({
      success: true,
      messages
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
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

    let baseFilter = ' WHERE (u.is_seed = 0 OR u.is_seed IS NULL)';
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
      WHERE (u.is_seed = 0 OR u.is_seed IS NULL)
    `;
    const params: any[] = [];
    if (gender) {
      query += ` AND u.gender = ?`;
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
        w.wali_name as waliName, w.wali_relationship as waliRelationship, w.wali_phone as waliPhone,
        (SELECT COUNT(*) FROM matches_and_likes ml WHERE ml.receiver_id = u.id AND ml.action = 'liked') as likesReceivedCount,
        (SELECT COUNT(*) FROM matches_and_likes ml WHERE (ml.sender_id = u.id OR ml.receiver_id = u.id) AND ml.action = 'mutual_match') as mutualMatchesCount,
        (SELECT COUNT(*) FROM conversations c WHERE c.participant_one = u.id OR c.participant_two = u.id) as conversationsCount
      FROM users u
      LEFT JOIN user_photos up ON up.user_id = u.id AND up.is_primary = 1
      LEFT JOIN religious_profiles rp ON rp.user_id = u.id
      LEFT JOIN wali_details w ON w.user_id = u.id
      WHERE u.is_seed = 1
      ORDER BY u.id ASC
    `;

    const { results } = await c.env.DB.prepare(query).all();
    const profiles = (results || []).map((p: any) => {
      let finalPhoto = p.photoUrl;
      if (finalPhoto && !finalPhoto.includes('?v=')) {
        finalPhoto = `${finalPhoto}?v=ht3_20261014`;
      }
      return {
        ...p,
        photoUrl: finalPhoto
      };
    });

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

// ====================================================================
// 12. Daily User Activity & On-Demand Audit Engine
// Tracks active duration, daily matches, conversations, and edge IP telemetry
// ====================================================================

// 12.1 Get Daily Activity Summary & User Roster for a specific date
adminRouter.get('/daily-activity', async (c) => {
  try {
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = c.req.query('date') || todayStr;

    // 1. Fetch total distinct active users count without arbitrary limit
    let totalActiveUsersCount = 0;
    try {
      const totalActiveRes = await c.env.DB.prepare(`
        SELECT COUNT(DISTINCT u.id) as total_active 
        FROM users u
        LEFT JOIN user_daily_activity uda ON u.id = uda.user_id AND uda.activity_date = ?
        WHERE (u.is_banned = 0 OR u.is_banned IS NULL)
          AND (
            uda.activity_date = ? 
            OR date(COALESCE(u.last_active_at, u.created_at)) = ?
            OR u.id IN (
              SELECT sender_id FROM matches_and_likes WHERE date(created_at) = ?
              UNION
              SELECT receiver_id FROM matches_and_likes WHERE date(created_at) = ?
              UNION
              SELECT sender_id FROM chat_messages WHERE date(created_at) = ?
            )
          )
      `).bind(targetDate, targetDate, targetDate, targetDate, targetDate, targetDate).first();
      totalActiveUsersCount = Number(totalActiveRes?.total_active || 0);
    } catch (e) {
      console.warn('Failed to count total active users:', e);
    }

    // 2. Fetch users active on this target date (capacity up to 250 for audit table)
    const { results: rawRows } = await c.env.DB.prepare(`
      SELECT 
        u.id, u.full_name as fullName, u.gender, u.dob, u.city, u.country, u.profession,
        u.is_vip as isVip, u.is_seed as isSeed, u.account_status as accountStatus,
        u.last_active_at as userLastActive, u.created_at as userCreatedAt,
        u.last_ip as masterIp, u.last_ip_city as masterIpCity, u.last_ip_country as masterIpCountry, u.last_ip_isp as masterIpIsp,
        uda.total_active_seconds as totalActiveSeconds,
        uda.first_active_at as firstActiveAt,
        uda.last_active_at as lastActiveAt,
        uda.last_ip as dailyIp,
        uda.last_city as dailyCity,
        uda.last_country as dailyCountry,
        uda.last_isp as dailyIsp,
        uda.user_agent as userAgent,
        uda.matches_count as loggedMatches,
        uda.likes_count as loggedLikes,
        uda.messages_sent_count as loggedMessages
      FROM users u
      LEFT JOIN user_daily_activity uda ON u.id = uda.user_id AND uda.activity_date = ?
      WHERE (u.is_banned = 0 OR u.is_banned IS NULL)
        AND (
          uda.activity_date = ? 
          OR date(COALESCE(u.last_active_at, u.created_at)) = ?
          OR u.id IN (
            SELECT sender_id FROM matches_and_likes WHERE date(created_at) = ?
            UNION
            SELECT receiver_id FROM matches_and_likes WHERE date(created_at) = ?
            UNION
            SELECT sender_id FROM chat_messages WHERE date(created_at) = ?
          )
        )
      ORDER BY COALESCE(uda.last_active_at, u.last_active_at, u.created_at) DESC
      LIMIT 250
    `).bind(targetDate, targetDate, targetDate, targetDate, targetDate, targetDate).all();

    const userList = rawRows || [];
    const userIds = userList.map((r: any) => r.id);

    // If totalActiveUsersCount was 0 or failed, fallback to actual returned list length
    if (totalActiveUsersCount === 0) {
      totalActiveUsersCount = userList.length;
    }

    // 3. Batch fetch primary photos
    const photoMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const chunkSize = 30;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');
        const { results: photos } = await c.env.DB.prepare(`
          SELECT user_id, photo_url FROM user_photos 
          WHERE user_id IN (${placeholders})
          ORDER BY is_primary DESC, sort_order ASC
        `).bind(...chunk).all();
        (photos || []).forEach((p: any) => {
          if (!photoMap[p.user_id]) photoMap[p.user_id] = p.photo_url;
        });
      }
    }

    // 4. Batch fetch real user activity counts (matches, likes, messages)
    const userLikesMap: Record<string, number> = {};
    const userMatchesMap: Record<string, number> = {};
    const userMessagesMap: Record<string, number> = {};

    if (userIds.length > 0) {
      const chunkSize = 40;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '?').join(',');

        try {
          const { results: likesRows } = await c.env.DB.prepare(`
            SELECT sender_id, COUNT(*) as c FROM matches_and_likes 
            WHERE action IN ('liked', 'direct_salam') AND date(created_at) = ? AND sender_id IN (${placeholders})
            GROUP BY sender_id
          `).bind(targetDate, ...chunk).all();
          (likesRows || []).forEach((r: any) => { userLikesMap[r.sender_id] = Number(r.c || 0); });
        } catch {}

        try {
          const { results: matchRows } = await c.env.DB.prepare(`
            SELECT u_id, COUNT(*) as c FROM (
              SELECT sender_id as u_id FROM matches_and_likes WHERE action = 'mutual_match' AND date(created_at) = ? AND sender_id IN (${placeholders})
              UNION ALL
              SELECT receiver_id as u_id FROM matches_and_likes WHERE action = 'mutual_match' AND date(created_at) = ? AND receiver_id IN (${placeholders})
            ) GROUP BY u_id
          `).bind(targetDate, ...chunk, targetDate, ...chunk).all();
          (matchRows || []).forEach((r: any) => { userMatchesMap[r.u_id] = Number(r.c || 0); });
        } catch {}

        try {
          const { results: msgRows } = await c.env.DB.prepare(`
            SELECT sender_id, COUNT(*) as c FROM chat_messages 
            WHERE date(created_at) = ? AND sender_id IN (${placeholders})
            GROUP BY sender_id
          `).bind(targetDate, ...chunk).all();
          (msgRows || []).forEach((r: any) => { userMessagesMap[r.sender_id] = Number(r.c || 0); });
        } catch {}
      }
    }

    // 5. Dynamic aggregates for matches, likes, messages, and total engagement on target date
    let matchesCountToday = 0;
    let likesCountToday = 0;
    let messagesCountToday = 0;
    let totalRealActiveSeconds = 0;

    try {
      const matchRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM matches_and_likes 
        WHERE action = 'mutual_match' AND date(created_at) = ?
      `).bind(targetDate).first();
      matchesCountToday = Number(matchRes?.c || 0);

      const likeRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM matches_and_likes 
        WHERE action IN ('liked', 'direct_salam') AND date(created_at) = ?
      `).bind(targetDate).first();
      likesCountToday = Number(likeRes?.c || 0);

      const msgRes = await c.env.DB.prepare(`
        SELECT COUNT(*) as c FROM chat_messages 
        WHERE date(created_at) = ?
      `).bind(targetDate).first();
      messagesCountToday = Number(msgRes?.c || 0);

      const timeRes = await c.env.DB.prepare(`
        SELECT SUM(total_active_seconds) as total_sec FROM user_daily_activity 
        WHERE activity_date = ?
      `).bind(targetDate).first();
      totalRealActiveSeconds = Number(timeRes?.total_sec || 0);
    } catch {}

    // 6. Format each active user row with genuine telemetry and duration
    let fallbackSecondsLogged = 0;
    const cityCounts: Record<string, number> = {};

    const items = userList.map((u: any) => {
      const uMatches = userMatchesMap[u.id] || Number(u.loggedMatches || 0);
      const uLikes = userLikesMap[u.id] || Number(u.loggedLikes || 0);
      const uMsgs = userMessagesMap[u.id] || Number(u.loggedMessages || 0);

      // Calculate genuine active duration (seconds)
      let activeSec = Number(u.totalActiveSeconds || 0);
      if (activeSec <= 0) {
        // If user engaged today (likes or msgs), calculate natural engagement duration
        if (uMatches > 0 || uLikes > 0 || uMsgs > 0) {
          activeSec = Math.max(240, (uLikes * 60) + (uMsgs * 90) + (uMatches * 180));
        } else {
          activeSec = 0;
        }
      }
      fallbackSecondsLogged += activeSec;

      // Seconds since last activity (if today)
      const lastActiveTimestamp = u.lastActiveAt || u.userLastActive || u.userCreatedAt;
      const lastActiveDate = new Date(lastActiveTimestamp);
      const secondsAgo = Math.max(0, Math.floor((Date.now() - lastActiveDate.getTime()) / 1000));

      let status: 'online' | 'away' | 'recent' | 'offline' = 'offline';
      if (targetDate === todayStr) {
        if (secondsAgo <= 300) status = 'online';
        else if (secondsAgo <= 900) status = 'away';
        else if (secondsAgo <= 3600) status = 'recent';
      }

      // Resolved IP and location
      const resolvedIp = u.dailyIp || u.masterIp || 'Cloudflare Edge (Masked)';
      const resolvedCity = u.dailyCity || u.masterIpCity || u.city || 'Pakistan';
      const resolvedCountry = u.dailyCountry || u.masterIpCountry || u.country || 'PK';
      const resolvedIsp = u.dailyIsp || u.masterIpIsp || 'Mobile Broadband';

      if (resolvedCity && resolvedCity !== 'Pakistan' && resolvedCity !== 'Global') {
        cityCounts[resolvedCity] = (cityCounts[resolvedCity] || 0) + 1;
      }

      // Age calculation
      let age = 24;
      if (u.dob) {
        const birthYear = parseInt(String(u.dob).split('-')[0], 10);
        if (!isNaN(birthYear)) age = 2026 - birthYear;
      }

      return {
        id: u.id,
        fullName: u.fullName || 'Member',
        gender: u.gender,
        age,
        dob: u.dob,
        city: resolvedCity,
        country: resolvedCountry,
        profession: u.profession || 'Professional',
        isVip: Boolean(u.isVip),
        isSeed: Boolean(u.isSeed),
        photoUrl: photoMap[u.id] || (u.gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg'),
        totalActiveSeconds: activeSec,
        activeDurationFormatted: formatDuration(activeSec),
        firstActiveAt: u.firstActiveAt || lastActiveTimestamp,
        lastActiveAt: lastActiveTimestamp,
        secondsAgo,
        status,
        matchesCountToday: uMatches,
        likesCountToday: uLikes,
        messagesSentCount: uMsgs,
        ip: resolvedIp,
        isp: resolvedIsp,
        userAgent: u.userAgent || 'Qurb Mobile App'
      };
    });

    const topCities = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const effectiveTotalHours = totalRealActiveSeconds > 0
      ? (totalRealActiveSeconds / 3600).toFixed(1)
      : (fallbackSecondsLogged / 3600).toFixed(1);

    return c.json({
      success: true,
      targetDate,
      summary: {
        activeUsersCount: totalActiveUsersCount,
        totalActiveHours: effectiveTotalHours,
        matchesCountToday,
        likesCountToday,
        messagesCountToday,
        topCities
      },
      users: items
    });
  } catch (error: any) {
    console.error('Error fetching daily activity:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 12.2 Get On-Demand In-Depth User Audit & Conversation Details ("On-Call")
adminRouter.get('/daily-activity/user-details', async (c) => {
  try {
    const userId = c.req.query('userId');
    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = c.req.query('date') || todayStr;

    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    // A. Fetch User Record
    const user = await c.env.DB.prepare(`
      SELECT 
        u.*,
        w.wali_name, w.wali_relationship, w.wali_phone, w.is_verified as wali_verified,
        r.practice_level, r.sect, r.prayer_frequency, r.modesty_practice
      FROM users u
      LEFT JOIN wali_details w ON u.id = w.user_id
      LEFT JOIN religious_profiles r ON u.id = r.user_id
      WHERE u.id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // User Photos
    const { results: photos } = await c.env.DB.prepare(`
      SELECT photo_url, is_primary FROM user_photos 
      WHERE user_id = ?
      ORDER BY is_primary DESC, sort_order ASC
    `).bind(userId).all();

    // B. Fetch Daily Metric Record
    const dailyMetric = await c.env.DB.prepare(`
      SELECT * FROM user_daily_activity 
      WHERE user_id = ? AND activity_date = ?
    `).bind(userId, targetDate).first();

    // C. Matches Formed on target date
    const { results: matchesRaw } = await c.env.DB.prepare(`
      SELECT 
        m.id as matchId, m.created_at as matchedAt, m.action as matchType,
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END as partnerId
      FROM matches_and_likes m
      WHERE (m.sender_id = ? OR m.receiver_id = ?)
        AND (m.action = 'match' OR m.action = 'direct_salam')
        AND date(m.created_at) = ?
      ORDER BY m.created_at DESC
      LIMIT 20
    `).bind(userId, userId, userId, targetDate).all();

    const matchesList = [];
    for (const m of (matchesRaw || [])) {
      const partner = await c.env.DB.prepare(`
        SELECT id, full_name, city, profession, gender FROM users WHERE id = ?
      `).bind(m.partnerId).first();

      const partnerPhoto = await c.env.DB.prepare(`
        SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC LIMIT 1
      `).bind(m.partnerId).first();

      matchesList.push({
        matchId: m.matchId,
        matchedAt: m.matchedAt,
        matchType: m.matchType === 'direct_salam' ? 'Direct Salam' : 'Mutual Match',
        partner: {
          id: partner?.id || m.partnerId,
          fullName: partner?.full_name || 'Matched Candidate',
          city: partner?.city || 'Pakistan',
          profession: partner?.profession || 'Professional',
          gender: partner?.gender,
          photoUrl: partnerPhoto?.photo_url || '/seeds/seed_female_1.jpg'
        }
      });
    }

    // D. Likes Sent on target date
    const { results: likesRaw } = await c.env.DB.prepare(`
      SELECT 
        m.id as likeId, m.created_at as likedAt, m.receiver_id as recipientId
      FROM matches_and_likes m
      WHERE m.sender_id = ?
        AND (m.action = 'like' OR m.action = 'direct_salam')
        AND date(m.created_at) = ?
      ORDER BY m.created_at DESC
      LIMIT 20
    `).bind(userId, targetDate).all();

    const likesList = [];
    for (const l of (likesRaw || [])) {
      const recipient = await c.env.DB.prepare(`
        SELECT id, full_name, city, profession, gender FROM users WHERE id = ?
      `).bind(l.recipientId).first();

      const recPhoto = await c.env.DB.prepare(`
        SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC LIMIT 1
      `).bind(l.recipientId).first();

      likesList.push({
        likeId: l.likeId,
        likedAt: l.likedAt,
        recipient: {
          id: recipient?.id || l.recipientId,
          fullName: recipient?.full_name || 'Candidate',
          city: recipient?.city || 'Pakistan',
          profession: recipient?.profession || 'Professional',
          gender: recipient?.gender,
          photoUrl: recPhoto?.photo_url || '/seeds/seed_female_1.jpg'
        }
      });
    }

    // E. Conversations & Message Transcripts on target date
    const { results: convsRaw } = await c.env.DB.prepare(`
      SELECT 
        c.id as conversationId, c.last_message_text, c.last_message_time,
        CASE WHEN c.participant_one = ? THEN c.participant_two ELSE c.participant_one END as partnerId
      FROM conversations c
      WHERE c.participant_one = ? OR c.participant_two = ?
      ORDER BY c.last_message_time DESC
      LIMIT 10
    `).bind(userId, userId, userId).all();

    const conversationsList = [];
    for (const cv of (convsRaw || [])) {
      const partner = await c.env.DB.prepare(`
        SELECT id, full_name, city, profession, gender FROM users WHERE id = ?
      `).bind(cv.partnerId).first();

      const partnerPhoto = await c.env.DB.prepare(`
        SELECT photo_url FROM user_photos WHERE user_id = ? ORDER BY is_primary DESC LIMIT 1
      `).bind(cv.partnerId).first();

      // Messages in this conversation on this date (or latest 25 messages)
      const { results: msgs } = await c.env.DB.prepare(`
        SELECT id, sender_id, sender_name, text, created_at, wali_notified
        FROM chat_messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT 40
      `).bind(cv.conversationId).all();

      conversationsList.push({
        conversationId: cv.conversationId,
        lastMessageText: cv.last_message_text,
        lastMessageTime: cv.last_message_time,
        partner: {
          id: partner?.id || cv.partnerId,
          fullName: partner?.full_name || 'Chat Partner',
          city: partner?.city || 'Pakistan',
          profession: partner?.profession || 'Professional',
          gender: partner?.gender,
          photoUrl: partnerPhoto?.photo_url || '/seeds/seed_female_1.jpg'
        },
        messages: (msgs || []).map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: m.sender_name || (m.sender_id === userId ? user.full_name : partner?.full_name),
          text: m.text,
          createdAt: m.created_at,
          isFromCurrentUser: m.sender_id === userId,
          waliNotified: Boolean(m.wali_notified)
        }))
      });
    }

    // F. Telemetry payload
    const totalActiveSeconds = Number(dailyMetric?.total_active_seconds || 2400);
    const telemetry = {
      ip: dailyMetric?.last_ip || user.last_ip || '111.119.187.42',
      city: dailyMetric?.last_city || user.last_ip_city || user.city || 'Islamabad',
      country: dailyMetric?.last_country || user.last_ip_country || user.country || 'PK',
      isp: dailyMetric?.last_isp || user.last_ip_isp || 'PTCL Fiber / Edge Network',
      userAgent: dailyMetric?.user_agent || 'Mozilla/5.0 (iPhone; CPU iOS 17_4) Mobile/15E148 Safari/604.1',
      totalActiveSeconds,
      activeDurationFormatted: formatDuration(totalActiveSeconds),
      firstActiveAt: dailyMetric?.first_active_at || user.last_active_at || user.created_at,
      lastActiveAt: dailyMetric?.last_active_at || user.last_active_at || user.created_at
    };

    return c.json({
      success: true,
      targetDate,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        city: user.city,
        country: user.country,
        profession: user.profession,
        education: user.education,
        isVip: Boolean(user.is_vip),
        isSeed: Boolean(user.is_seed),
        photos: (photos || []).map((p: any) => p.photo_url),
        waliName: user.wali_name,
        waliRelationship: user.wali_relationship,
        waliPhone: user.wali_phone
      },
      telemetry,
      matchesToday: matchesList,
      likesToday: likesList,
      conversationsToday: conversationsList
    });
  } catch (error: any) {
    console.error('Error fetching on-demand user details:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Helper formatting seconds to "Xh Ym" or "Ym"
function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}h ${remM}m`;
  }
  return `${Math.max(1, remM)}m`;
}

// 21. AI Agent System Status
adminRouter.get('/ai-agent/status', async (c) => {
  try {
    let enabled = true;
    try {
      const row = await c.env.DB.prepare("SELECT value FROM system_settings WHERE key = 'ai_agent_enabled'").first();
      if (row) {
        enabled = row.value === '1' || row.value === 'true';
      }
    } catch {}

    let apiKey = c.env.GEMINI_API_KEY || '';
    try {
      const keyRow = await c.env.DB.prepare("SELECT value FROM system_settings WHERE key = 'gemini_api_key'").first();
      if (keyRow?.value) {
        apiKey = keyRow.value;
      }
    } catch {}

    const maskedKey = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : null;
    const seedCount = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE is_seed = 1").first();

    return c.json({
      success: true,
      enabled,
      hasApiKey: Boolean(apiKey),
      maskedKey,
      model: 'gemini-2.5-flash',
      activeSeedProfiles: Number(seedCount?.c || 0)
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 22. AI Agent System Kill-Switch Toggle (ON / OFF)
adminRouter.post('/ai-agent/toggle', async (c) => {
  try {
    const { enabled } = await c.req.json();
    const val = enabled ? '1' : '0';

    try {
      await c.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
    } catch {}

    await c.env.DB.prepare(`
      INSERT INTO system_settings (key, value, updated_at) 
      VALUES ('ai_agent_enabled', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).bind(val).run();

    return c.json({
      success: true,
      enabled: val === '1',
      message: `AI Chat Agent is now ${val === '1' ? 'ENABLED' : 'DISABLED'}`
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 22b. AI Agent Configure Gemini API Key
adminRouter.post('/ai-agent/config', async (c) => {
  try {
    const { apiKey } = await c.req.json();
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return c.json({ success: false, error: 'Valid Gemini API key required.' }, 400);
    }

    const cleanKey = apiKey.trim();

    // Verify key with quick test call
    try {
      const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });
      if (!testRes.ok) {
        const errData: any = await testRes.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${testRes.status}`;
        return c.json({ success: false, error: `Google API rejected key: ${errMsg}` }, 400);
      }
    } catch (testErr: any) {
      return c.json({ success: false, error: `Connection to Gemini failed: ${testErr.message}` }, 400);
    }

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await c.env.DB.prepare(`
      INSERT INTO system_settings (key, value, updated_at) 
      VALUES ('gemini_api_key', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).bind(cleanKey).run();

    return c.json({
      success: true,
      hasApiKey: true,
      maskedKey: `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}`,
      message: 'Gemini API Key successfully verified and saved!'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 23. AI Agent Pending Chats Count (Unread Salams & Matches)
adminRouter.get('/ai-agent/pending-count', async (c) => {
  try {
    const pendingCount = await getPendingCatchupCount(c.env.DB);
    return c.json({
      success: true,
      pendingCount
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 24. AI Agent Trigger Batch Catchup Replies
adminRouter.post('/ai-agent/catchup', async (c) => {
  try {
    let body: any = {};
    try {
      body = await c.req.json();
    } catch {}

    const limit = body?.limit || 50;

    let apiKey = c.env.GEMINI_API_KEY;
    try {
      const keyRow = await c.env.DB.prepare("SELECT value FROM system_settings WHERE key = 'gemini_api_key'").first();
      if (keyRow?.value) {
        apiKey = keyRow.value;
      }
    } catch {}

    const result = await processCatchupReplies(c.env.DB, apiKey, { limit });
    const remainingCount = await getPendingCatchupCount(c.env.DB);

    return c.json({
      success: true,
      repliedCount: result.repliedCount,
      processedConvs: result.processedConvs,
      remainingCount,
      message: `Successfully replied to ${result.repliedCount} pending chat${result.repliedCount === 1 ? '' : 's'}.`
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
