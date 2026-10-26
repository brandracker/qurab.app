import { API_BASE } from './apiConfig';

export interface ReferredFriend {
  id: string;
  refereeId: string;
  name: string;
  status: 'pending' | 'completed' | 'disqualified';
  hasPhoto: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  completedAt?: string | null;
  disqualifiedReason?: string | null;
}

export interface ReferralStats {
  referralCode: string;
  shareLink: string;
  targetCount: number;
  completedCount: number;
  pendingCount: number;
  totalInvited: number;
  isVipRewarded: boolean;
  rewardGrantedAt?: string | null;
  friends: ReferredFriend[];
}

export class ReferralService {
  private static instance: ReferralService;

  public static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  // Get or initialize persistent client device identifier for anti-fraud validation
  public getDeviceId(): string {
    if (typeof window === 'undefined') return 'server_render_device';
    const KEY = 'qurb_device_id_v1';
    let devId = localStorage.getItem(KEY);
    if (!devId) {
      devId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      try {
        localStorage.setItem(KEY, devId);
      } catch {}
    }
    return devId;
  }

  // Fetch user referral progress, live counts, and friends breakdown
  public async getStats(userId: string): Promise<ReferralStats> {
    try {
      const res = await fetch(`${API_BASE}/referrals/stats/${encodeURIComponent(userId)}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.statusText}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Unable to retrieve referral data');
      }

      return {
        referralCode: data.referralCode || userId,
        shareLink: data.shareLink || `https://qurb.app/join?ref=${userId}`,
        targetCount: data.targetCount ?? 30,
        completedCount: data.completedCount ?? 0,
        pendingCount: data.pendingCount ?? 0,
        totalInvited: data.totalInvited ?? 0,
        isVipRewarded: Boolean(data.isVipRewarded),
        rewardGrantedAt: data.rewardGrantedAt || null,
        friends: Array.isArray(data.friends) ? data.friends : []
      };
    } catch (err: any) {
      console.warn('ReferralService.getStats fallback:', err.message);
      // Fallback object so UI stays resilient even if offline
      return {
        referralCode: userId,
        shareLink: `https://qurb.app/join?ref=${userId}`,
        targetCount: 30,
        completedCount: 0,
        pendingCount: 0,
        totalInvited: 0,
        isVipRewarded: false,
        friends: []
      };
    }
  }

  // Bind a referral code for a new user
  public async claimCode(refereeId: string, referralCode: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const deviceId = this.getDeviceId();
      const res = await fetch(`${API_BASE}/referrals/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refereeId, referralCode, deviceId })
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  }

  // Evaluate profile completion and unlock reward if target reached
  public async evaluateProfile(refereeId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/referrals/evaluate/${encodeURIComponent(refereeId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {}
  }

  // Compose engaging, authentic Urdu + English invitation text for WhatsApp
  public getShareMessage(referralCode: string, _targetCount: number = 30): string {
    const link = `https://qurb.app/join?ref=${encodeURIComponent(referralCode)}`;
    return `Assalam-o-Alaikum! 🌿\n\nMain Qurb Halal Matrimony app use kar raha/rahi houn rishton ke liye. Yeh bohot safe, privacy-focused aur authentic Islamic platform hai.\n\nAap bhi is link se join karein aur verified profiles explore karein:\n👉 ${link}\n\n(Use my invite code: *${referralCode}*)`;
  }

  // 1-Tap WhatsApp share with fallback to Web Share API
  public shareOnWhatsApp(referralCode: string, targetCount: number = 30): void {
    const text = this.getShareMessage(referralCode, targetCount);
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  }

  // 1-Tap Copy invite link
  public async copyInviteLink(referralCode: string): Promise<boolean> {
    const link = `https://qurb.app/join?ref=${encodeURIComponent(referralCode)}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        return true;
      }
    } catch {}

    // Fallback prompt or textarea
    if (typeof document !== 'undefined') {
      const input = document.createElement('textarea');
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      return true;
    }
    return false;
  }
}

export const referralService = ReferralService.getInstance();
