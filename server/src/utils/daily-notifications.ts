import { sendFcmNotification } from './fcm';

export interface DailyTriggerOptions {
  triggerType?: 'manual' | 'cron';
  category?: 'smart_psych' | 'curated' | 'curiosity' | 'incomplete' | 'custom';
  customTitle?: string;
  customMessage?: string;
  targetType?: 'all' | 'inactive' | 'incomplete';
}

export async function ensureNotificationTables(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS notification_campaigns (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT DEFAULT 'daily_curated',
        target_type TEXT DEFAULT 'all',
        sent_count INTEGER DEFAULT 0,
        clicked_count INTEGER DEFAULT 0,
        trigger_type TEXT DEFAULT 'manual',
        target_screen TEXT DEFAULT 'matches',
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS notification_clicks (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        notification_id TEXT,
        user_id TEXT NOT NULL,
        target_screen TEXT,
        user_agent TEXT,
        clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_notification_clicks_camp ON notification_clicks(campaign_id, clicked_at DESC)
    `).run();

    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_notification_clicks_user ON notification_clicks(user_id, clicked_at DESC)
    `).run();

    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_notification_campaigns_created ON notification_campaigns(created_at DESC)
    `).run();
  } catch (err) {
    console.warn('[Notifications] Table initialization notice:', err);
  }
}

export async function triggerDailyNotifications(env: any, options: DailyTriggerOptions = {}) {
  const db = env.DB;
  await ensureNotificationTables(db);

  const triggerType = options.triggerType || 'manual';
  const categoryMode = options.category || 'smart_psych';
  const targetType = options.targetType || 'all';

  // 1. Fetch eligible users (active and not banned)
  let userQuery = `
    SELECT id, full_name, city, gender, fcm_token, is_profile_completed, last_active_at
    FROM users
    WHERE account_status = 'active' AND (is_banned = 0 OR is_banned IS NULL)
  `;

  if (targetType === 'incomplete') {
    userQuery += ` AND (is_profile_completed = 0 OR is_profile_completed IS NULL)`;
  }

  const { results: rawUsers } = await db.prepare(userQuery).all();
  const users: any[] = rawUsers || [];

  if (users.length === 0) {
    return {
      success: true,
      message: 'No eligible users found for daily notification',
      sentCount: 0,
      campaignId: null
    };
  }

  const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;

  let totalSent = 0;
  let pushDispatched = 0;
  let defaultCampaignTitle = 'Aaj ka Rishta of the Day ✨';
  let defaultCampaignMsg = 'Kisi ne aapki profile shortlist ki hai! Dekhein aaj aapke liye perfect match kon hai.';

  for (const user of users) {
    let title = defaultCampaignTitle;
    let message = defaultCampaignMsg;
    let targetScreen = 'matches';
    let userCategory = 'daily_curated';

    if (categoryMode === 'custom' && options.customTitle && options.customMessage) {
      title = options.customTitle.trim();
      message = options.customMessage.trim();
      targetScreen = 'discover';
      userCategory = 'custom';
    } else if (categoryMode === 'curiosity') {
      title = 'Aapki profile view hui hai 👀';
      message = 'Pichle 24 ghanton mein logon ne aapki profile check ki. Dekhein kahan se inquiry aayi hai.';
      targetScreen = 'matches';
      userCategory = 'curiosity_view';
    } else if (categoryMode === 'incomplete' || (categoryMode === 'smart_psych' && !user.is_profile_completed)) {
      title = 'Aapki profile adhoori hai! 🌟';
      message = 'Sirf 2 zaroori details daal kar 3x zyada rishte dekhein. Log aapka intezar kar rahe hain.';
      targetScreen = 'my_profile';
      userCategory = 'incomplete_profile';
    } else if (categoryMode === 'smart_psych') {
      const lastActive = user.last_active_at ? new Date(user.last_active_at).getTime() : 0;
      if (lastActive > 0 && lastActive < threeDaysAgo) {
        title = `${user.city || 'Aapke shahar'} se naye rishtay add huay hain 💍`;
        message = 'Aaj aapke criteria se 95% match karti hui verified profiles add hui hain. Dekhein kon hai.';
        targetScreen = 'discover';
        userCategory = 'inactive_reengagement';
      } else {
        title = 'Aaj ka Rishta of the Day ✨';
        message = 'Kisi ne aapki profile shortlist ki hai! Dekhein aaj aapke liye perfect match kon hai.';
        targetScreen = 'matches';
        userCategory = 'daily_curated';
      }
    }

    const notifId = `notif_daily_${campaignId}_${user.id}`;

    // 1. In-app notification insertion
    try {
      await db.prepare(`
        INSERT INTO notifications (id, user_id, type, title, message, target_id, action_label, is_read, created_at)
        VALUES (?, ?, 'daily_engagement', ?, ?, ?, ?, 0, datetime('now'))
      `).bind(notifId, user.id, title, message, targetScreen, 'Open').run();
      totalSent++;
    } catch (notifErr) {
      console.warn(`[DailyNotification] In-app insert notice for ${user.id}:`, notifErr);
    }

    // 2. High-Priority FCM Push Dispatch
    if (user.fcm_token) {
      try {
        const pushPromise = sendFcmNotification(env, {
          token: user.fcm_token,
          title,
          body: message,
          channelId: 'qurb_messages',
          data: {
            campaignId,
            notificationId: notifId,
            type: 'daily_engagement',
            targetTab: targetScreen,
            title,
            body: message
          }
        });

        // If execution context is available (in Worker runtime), wait until; otherwise await
        if (env?.ctx?.waitUntil) {
          env.ctx.waitUntil(pushPromise);
        } else {
          await pushPromise;
        }
        pushDispatched++;
      } catch (fcmErr) {
        console.warn(`[DailyNotification] Push send notice for ${user.id}:`, fcmErr);
      }
    }
  }

  // 3. Record Campaign in notification_campaigns
  try {
    const summaryTitle = categoryMode === 'custom' && options.customTitle 
      ? options.customTitle 
      : categoryMode === 'smart_psych' 
        ? 'Smart Psychological Mix (Retention & Matches)'
        : categoryMode === 'curiosity'
          ? 'Profile Views & Curiosity Gap'
          : defaultCampaignTitle;

    const summaryMsg = categoryMode === 'custom' && options.customMessage
      ? options.customMessage
      : `Dispatched to ${totalSent} members (${pushDispatched} push devices). Categorized by smart psychology.`;

    await db.prepare(`
      INSERT INTO notification_campaigns (id, title, message, category, target_type, sent_count, clicked_count, trigger_type, target_screen, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'matches', ?, datetime('now'))
    `).bind(
      campaignId,
      summaryTitle,
      summaryMsg,
      categoryMode,
      targetType,
      totalSent,
      triggerType,
      JSON.stringify({ pushDispatched, totalEligible: users.length })
    ).run();
  } catch (campErr) {
    console.warn('[DailyNotification] Campaign log error:', campErr);
  }

  return {
    success: true,
    campaignId,
    sentCount: totalSent,
    pushDispatched,
    targetedUsers: users.length,
    triggerType
  };
}

