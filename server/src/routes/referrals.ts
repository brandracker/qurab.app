import { Hono } from 'hono';
import type { AppContext } from '../types';

export const referralsRouter = new Hono<AppContext>();

// Common temporary / throwaway email domains to block
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'mailinator.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'fakemailgenerator.com',
  'throwawaymail.com',
  'sharklasers.com',
  'getairmail.com',
  'tempmail.net',
  'burnermail.io',
  'crazymailing.com',
  'emailondeck.com',
  'inboxkitten.com'
]);

export function isDisposableEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export function maskName(fullName?: string | null): string {
  if (!fullName || typeof fullName !== 'string') return 'Member';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

// Ensure database tables exist dynamically on Cloudflare D1
export async function ensureReferralTables(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        device_id TEXT,
        ip_address TEXT,
        status TEXT DEFAULT 'pending',
        disqualified_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        UNIQUE(referee_id)
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS referral_rewards (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invites_milestone INTEGER NOT NULL DEFAULT 30,
        reward_type TEXT DEFAULT 'barakah_vip_1_month',
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, invites_milestone)
      )
    `).run();

    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON referrals(referrer_id, status)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_referrals_device ON referrals(device_id)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id)`).run();
  } catch (e) {
    console.warn('ensureReferralTables notice:', e);
  }
}

// Helper: Check and grant VIP reward if milestone is reached
export async function checkAndFulfillReferralReward(db: any, referrerId: string, milestoneTarget: number = 30) {
  try {
    // 1. Count completed referrals for this referrer
    const completedRes: any = await db.prepare(`
      SELECT COUNT(*) as cnt FROM referrals WHERE referrer_id = ? AND status = 'completed'
    `).bind(referrerId).first();

    const completedCount = Number(completedRes?.cnt || 0);

    if (completedCount >= milestoneTarget) {
      // 2. Check if reward already claimed for this milestone
      const rewardCheck: any = await db.prepare(`
        SELECT id FROM referral_rewards WHERE user_id = ? AND invites_milestone = ?
      `).bind(referrerId, milestoneTarget).first();

      if (!rewardCheck) {
        const rewardId = `rew_${referrerId}_${milestoneTarget}_${Date.now()}`;
        await db.prepare(`
          INSERT INTO referral_rewards (id, user_id, invites_milestone, reward_type)
          VALUES (?, ?, ?, 'barakah_vip_1_month')
        `).bind(rewardId, referrerId, milestoneTarget).run();

        // 3. Grant Barakah VIP: is_vip = 1 on users table
        await db.prepare(`
          UPDATE users SET is_vip = 1 WHERE id = ?
        `).bind(referrerId).run();

        // 4. Update user_wallets: subscription_tier = 'barakah_vip', add 20 direct salams, 9999 daily messages
        await db.prepare(`
          INSERT INTO user_wallets (user_id, subscription_tier, direct_salams_balance, daily_messages_quota)
          VALUES (?, 'barakah_vip', 22, 9999)
          ON CONFLICT(user_id) DO UPDATE SET 
            subscription_tier = 'barakah_vip',
            direct_salams_balance = direct_salams_balance + 20,
            daily_messages_quota = 9999
        `).bind(referrerId).run();

        // 5. In-app notification for the user
        const notifId = `notif_ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, action_label)
          VALUES (?, ?, 'vip_awarded', 'Mubarak! 1 Month Free VIP Unlocked 🎁', 'Aap ke 30 doston ne join kar liya! Aap ka 1 Month Barakah VIP gift activate ho gaya hai.', 'View VIP')
        `).bind(notifId, referrerId).run();

        return { rewarded: true, completedCount };
      }
    }
    return { rewarded: false, completedCount };
  } catch (err: any) {
    console.error('checkAndFulfillReferralReward error:', err);
    return { rewarded: false, error: err.message };
  }
}

// 1. Get User Referral Stats, Progress & Invited Friends List
referralsRouter.get('/stats/:userId', async (c) => {
  try {
    await ensureReferralTables(c.env.DB);
    const userId = c.req.param('userId');

    // Fetch dynamic campaign target from app_settings if configured, default 30
    let targetCount = 30;
    try {
      const setting: any = await c.env.DB.prepare(`
        SELECT value FROM app_settings WHERE key = 'referral_target_invites'
      `).first();
      if (setting?.value && !isNaN(Number(setting.value))) {
        targetCount = Number(setting.value);
      }
    } catch {}

    // Verify user exists
    const user: any = await c.env.DB.prepare(`
      SELECT id, full_name, phone, is_vip FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // Referral code is user ID or clean phone identifier
    const referralCode = user.id;
    const shareLink = `https://qurb.app/join?ref=${encodeURIComponent(referralCode)}`;

    // Query referrals
    const referralsList: any = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.referee_id,
        r.status,
        r.disqualified_reason,
        r.created_at,
        r.completed_at,
        u.full_name as referee_name,
        u.is_profile_completed,
        (SELECT COUNT(*) FROM user_photos WHERE user_id = r.referee_id) as photo_count
      FROM referrals r
      JOIN users u ON r.referee_id = u.id
      WHERE r.referrer_id = ?
      ORDER BY r.created_at DESC
    `).bind(userId).all();

    const items = (referralsList?.results || []).map((row: any) => ({
      id: row.id,
      refereeId: row.referee_id,
      name: maskName(row.referee_name),
      status: row.status, // 'pending' | 'completed' | 'disqualified'
      hasPhoto: Number(row.photo_count || 0) > 0,
      isProfileCompleted: Boolean(row.is_profile_completed),
      createdAt: row.created_at,
      completedAt: row.completed_at,
      disqualifiedReason: row.disqualified_reason || null
    }));

    const completedCount = items.filter((i: any) => i.status === 'completed').length;
    const pendingCount = items.filter((i: any) => i.status === 'pending').length;
    const totalInvited = items.length;

    // Check if reward already issued
    const rewardRow: any = await c.env.DB.prepare(`
      SELECT id, granted_at FROM referral_rewards WHERE user_id = ? AND invites_milestone = ?
    `).bind(userId, targetCount).first();

    let isVipRewarded = Boolean(rewardRow);

    // If milestone reached and not rewarded yet, trigger reward immediately
    if (completedCount >= targetCount && !isVipRewarded) {
      const grantResult = await checkAndFulfillReferralReward(c.env.DB, userId, targetCount);
      if (grantResult.rewarded) {
        isVipRewarded = true;
      }
    }

    return c.json({
      success: true,
      referralCode,
      shareLink,
      targetCount,
      completedCount,
      pendingCount,
      totalInvited,
      isVipRewarded,
      rewardGrantedAt: rewardRow?.granted_at || null,
      friends: items
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Claim / Bind Referral Code during Signup or First Launch
referralsRouter.post('/claim', async (c) => {
  try {
    await ensureReferralTables(c.env.DB);
    const { refereeId, referralCode, deviceId } = await c.req.json();

    if (!refereeId || !referralCode) {
      return c.json({ success: false, error: 'refereeId and referralCode are required' }, 400);
    }

    const cleanCode = String(referralCode).trim();

    // 1. Identify Referrer by id or phone
    const referrer: any = await c.env.DB.prepare(`
      SELECT id, full_name FROM users WHERE id = ? OR phone = ?
    `).bind(cleanCode, cleanCode).first();

    if (!referrer) {
      return c.json({ success: false, error: 'Invalid referral code or link' }, 404);
    }

    // 2. Prevent self-referral
    if (referrer.id === refereeId) {
      return c.json({ success: false, error: 'Apne aap ko refer nahi kiya ja sakta' }, 400);
    }

    // 3. Check referee profile with resilience for in-flight async profile saves
    let referee: any = await c.env.DB.prepare(`
      SELECT id, full_name, email, is_profile_completed FROM users WHERE id = ?
    `).bind(refereeId).first();

    if (!referee) {
      // In case user profile is still being asynchronously saved to D1, wait briefly and retry
      await new Promise(r => setTimeout(r, 400));
      referee = await c.env.DB.prepare(`
        SELECT id, full_name, email, is_profile_completed FROM users WHERE id = ?
      `).bind(refereeId).first();
    }

    if (!referee) {
      return c.json({ success: false, error: 'Referee user not found' }, 404);
    }

    // 4. Anti-fraud: Block disposable / temporary email domains
    if (isDisposableEmail(referee.email)) {
      return c.json({ 
        success: false, 
        error: 'Temporary or disposable email addresses are not eligible for referral program' 
      }, 400);
    }

    // 5. Check if referee was already referred by someone
    const existingRef: any = await c.env.DB.prepare(`
      SELECT id, referrer_id FROM referrals WHERE referee_id = ?
    `).bind(refereeId).first();

    if (existingRef) {
      return c.json({ success: false, error: 'User has already claimed a referral invite' }, 409);
    }

    // 6. Anti-fraud: Device ID Check
    // If deviceId is provided, check if that physical device was already used for referral
    const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || '127.0.0.1';
    let status = 'pending';
    let disqualifiedReason: string | null = null;

    if (deviceId && deviceId.trim()) {
      const cleanDevice = deviceId.trim();
      const deviceCheck: any = await c.env.DB.prepare(`
        SELECT COUNT(*) as count FROM referrals WHERE device_id = ? AND referrer_id = ?
      `).bind(cleanDevice, referrer.id).first();

      if (Number(deviceCheck?.count || 0) >= 1) {
        status = 'disqualified';
        disqualifiedReason = 'Multiple accounts detected on the same physical device';
      }
    }

    // 7. Check if referee already completed profile
    if (status === 'pending') {
      const photoCheck: any = await c.env.DB.prepare(`
        SELECT COUNT(*) as cnt FROM user_photos WHERE user_id = ?
      `).bind(refereeId).first();

      const hasPhoto = Number(photoCheck?.cnt || 0) > 0;
      if (Boolean(referee.is_profile_completed) && hasPhoto) {
        status = 'completed';
      }
    }

    // 8. Insert referral record
    const referralId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await c.env.DB.prepare(`
      INSERT INTO referrals (id, referrer_id, referee_id, device_id, ip_address, status, disqualified_reason, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      referralId,
      referrer.id,
      refereeId,
      deviceId ? deviceId.trim() : null,
      clientIp,
      status,
      disqualifiedReason,
      status === 'completed' ? new Date().toISOString() : null
    ).run();

    // 9. If status is completed, evaluate referrer milestone
    let milestoneRewarded = false;
    if (status === 'completed') {
      const rewardResult = await checkAndFulfillReferralReward(c.env.DB, referrer.id);
      milestoneRewarded = Boolean(rewardResult.rewarded);
    }

    return c.json({
      success: true,
      referralId,
      status,
      rewarded: milestoneRewarded,
      referrerName: maskName(referrer.full_name),
      message: status === 'completed' 
        ? 'Referral verified successfully!' 
        : (status === 'disqualified' 
            ? 'Account flagged for multi-account abuse' 
            : 'Referral linked! Complete profile and photo to verify.')
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Evaluate Profile Completion (Call after profile save / photo upload)
referralsRouter.post('/evaluate/:refereeId', async (c) => {
  try {
    await ensureReferralTables(c.env.DB);
    const refereeId = c.req.param('refereeId');

    const referral: any = await c.env.DB.prepare(`
      SELECT * FROM referrals WHERE referee_id = ?
    `).bind(refereeId).first();

    if (!referral) {
      return c.json({ success: true, evaluated: false, message: 'No referral found for user' });
    }

    if (referral.status === 'completed' || referral.status === 'disqualified') {
      const rewardCheck: any = await c.env.DB.prepare(`
        SELECT id FROM referral_rewards WHERE user_id = ?
      `).bind(referral.referrer_id).first();

      return c.json({ 
        success: true, 
        evaluated: true, 
        status: referral.status, 
        rewarded: Boolean(rewardCheck) 
      });
    }

    // Check referee profile completeness & photos
    const user: any = await c.env.DB.prepare(`
      SELECT is_profile_completed FROM users WHERE id = ?
    `).bind(refereeId).first();

    const photoCheck: any = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_photos WHERE user_id = ?
    `).bind(refereeId).first();

    const isComplete = Boolean(user?.is_profile_completed);
    const hasPhotos = Number(photoCheck?.count || 0) > 0;

    if (isComplete && hasPhotos) {
      await c.env.DB.prepare(`
        UPDATE referrals 
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(referral.id).run();

      // Check referrer milestone reward
      const milestoneResult = await checkAndFulfillReferralReward(c.env.DB, referral.referrer_id);

      return c.json({
        success: true,
        evaluated: true,
        status: 'completed',
        rewarded: milestoneResult.rewarded
      });
    }

    return c.json({
      success: true,
      evaluated: true,
      status: 'pending',
      reason: !hasPhotos ? 'Photo required' : 'Profile completion required'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Admin Overview & Management
referralsRouter.get('/admin/overview', async (c) => {
  try {
    await ensureReferralTables(c.env.DB);

    const totalRes: any = await c.env.DB.prepare('SELECT COUNT(*) as c FROM referrals').first();
    const completedRes: any = await c.env.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE status = 'completed'").first();
    const pendingRes: any = await c.env.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE status = 'pending'").first();
    const disqualifiedRes: any = await c.env.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE status = 'disqualified'").first();
    const rewardsRes: any = await c.env.DB.prepare('SELECT COUNT(*) as c FROM referral_rewards').first();

    // Target setting from app_settings
    const targetRow: any = await c.env.DB.prepare(`
      SELECT value FROM app_settings WHERE key = 'referral_target_invites'
    `).first();
    const targetInvites = targetRow?.value ? parseInt(targetRow.value, 10) : 30;

    // Top referrers leaderboard
    const topReferrers: any = await c.env.DB.prepare(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.is_vip,
        COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_count,
        COUNT(r.id) as total_invites,
        (SELECT COUNT(*) FROM referral_rewards WHERE user_id = u.id) as rewards_won
      FROM referrals r
      JOIN users u ON r.referrer_id = u.id
      GROUP BY u.id
      ORDER BY completed_count DESC, total_invites DESC
      LIMIT 15
    `).all();

    // Suspicious multi-device or multi-account activities
    const suspiciousDevices: any = await c.env.DB.prepare(`
      SELECT device_id, COUNT(*) as signup_count 
      FROM referrals 
      WHERE device_id IS NOT NULL 
      GROUP BY device_id 
      HAVING signup_count > 1 
      LIMIT 10
    `).all();

    // Recent individual invites log (last 50)
    const recentInvites: any = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.referrer_id,
        r.referee_id,
        r.device_id,
        r.status,
        r.disqualified_reason,
        r.created_at,
        r.completed_at,
        u_ref.full_name as referrer_name,
        u_ref.email as referrer_email,
        u_referee.full_name as referee_name,
        u_referee.email as referee_email
      FROM referrals r
      LEFT JOIN users u_ref ON r.referrer_id = u_ref.id
      LEFT JOIN users u_referee ON r.referee_id = u_referee.id
      ORDER BY r.created_at DESC
      LIMIT 50
    `).all();

    return c.json({
      success: true,
      targetInvites,
      metrics: {
        totalInvites: Number(totalRes?.c || 0),
        completedSignups: Number(completedRes?.c || 0),
        pendingSignups: Number(pendingRes?.c || 0),
        disqualified: Number(disqualifiedRes?.c || 0),
        freeVipRewardsGiven: Number(rewardsRes?.c || 0)
      },
      topReferrers: topReferrers?.results || [],
      suspiciousDevices: suspiciousDevices?.results || [],
      recentInvites: recentInvites?.results || []
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. Admin: Disqualify Referral
referralsRouter.post('/admin/disqualify', async (c) => {
  try {
    const { referralId, reason } = await c.req.json();
    if (!referralId) {
      return c.json({ success: false, error: 'referralId is required' }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE referrals 
      SET status = 'disqualified', disqualified_reason = ? 
      WHERE id = ?
    `).bind(reason || 'Disqualified by administrator', referralId).run();

    return c.json({ success: true, message: 'Referral marked as disqualified' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Admin: Update Target Invites Setting
referralsRouter.post('/admin/settings', async (c) => {
  try {
    const { targetInvites } = await c.req.json();
    if (!targetInvites || isNaN(Number(targetInvites))) {
      return c.json({ success: false, error: 'targetInvites number is required' }, 400);
    }

    await c.env.DB.prepare(`
      INSERT INTO app_settings (key, value) VALUES ('referral_target_invites', ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(String(targetInvites), String(targetInvites)).run();

    return c.json({ 
      success: true, 
      targetInvites: Number(targetInvites), 
      message: `Referral target successfully updated to ${targetInvites} invites!` 
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 7. Admin: Simulate / Generate Test Referral (to verify loop & milestones)
referralsRouter.post('/admin/simulate-invite', async (c) => {
  try {
    await ensureReferralTables(c.env.DB);
    const { referrerId, refereeName, isCompleted = true } = await c.req.json();

    if (!referrerId) {
      return c.json({ success: false, error: 'referrerId is required' }, 400);
    }

    // Verify referrer exists
    const referrer: any = await c.env.DB.prepare(`
      SELECT id, full_name, email, is_vip FROM users WHERE id = ?
    `).bind(referrerId).first();

    if (!referrer) {
      return c.json({ success: false, error: 'Referrer user not found' }, 404);
    }

    // Create a mock referee user
    const mockRefereeId = `usr_test_referee_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const mockEmail = `referee_${Date.now()}@example.com`;
    const mockName = refereeName || `Friend ${Math.floor(Math.random() * 900 + 100)}`;

    await c.env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
      VALUES (?, ?, ?, ?, '1998-05-15', 'female', 'Lahore', ?)
    `).bind(mockRefereeId, `+92300${Math.floor(Math.random() * 8999999 + 1000000)}`, mockName, mockEmail, isCompleted ? 1 : 0).run();

    if (isCompleted) {
      await c.env.DB.prepare(`
        INSERT INTO user_photos (id, user_id, photo_url, is_primary)
        VALUES (?, ?, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 1)
      `).bind(`ph_${mockRefereeId}`, mockRefereeId).run();
    }

    const refId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const status = isCompleted ? 'completed' : 'pending';

    await c.env.DB.prepare(`
      INSERT INTO referrals (id, referrer_id, referee_id, device_id, status, created_at, completed_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
    `).bind(
      refId,
      referrer.id,
      mockRefereeId,
      `dev_sim_${Math.random().toString(36).substring(2, 8)}`,
      status,
      isCompleted ? new Date().toISOString() : null
    ).run();

    // Check reward milestone
    let milestoneResult: any = { rewarded: false, milestoneTarget: 30 };
    if (isCompleted) {
      const targetRow: any = await c.env.DB.prepare(`
        SELECT value FROM app_settings WHERE key = 'referral_target_invites'
      `).first();
      const target = targetRow?.value ? parseInt(targetRow.value, 10) : 30;
      milestoneResult = await checkAndFulfillReferralReward(c.env.DB, referrer.id, target);
    }

    return c.json({
      success: true,
      message: `Simulated referral added for ${referrer.full_name}! (Status: ${status})`,
      referralId: refId,
      status,
      rewarded: milestoneResult.rewarded
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
