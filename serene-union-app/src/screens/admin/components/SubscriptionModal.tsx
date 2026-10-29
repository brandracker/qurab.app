import React, { useState, useEffect } from 'react';
import { 
  X, 
  Crown, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { CandidateUser, InAppPurchaseRecord } from '../types';
import { API_BASE } from '../../../services/dbService';

interface SubscriptionModalProps {
  user: CandidateUser | null;
  adminToken?: string | null;
  onClose: () => void;
  onUpdateSubscription: (
    userId: string,
    tier: string,
    directSalams: number,
    isVip: boolean,
    resetQuotas: boolean,
    durationDays?: number | 'lifetime' | string,
    expiryDate?: string
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  user,
  adminToken,
  onClose,
  onUpdateSubscription,
  isSubmitting = false
}) => {
  if (!user) return null;

  const currentIsVip = Boolean(user.is_vip);
  const currentTier = user.wallet?.subscription_tier || (currentIsVip ? 'barakah_vip' : 'free');
  const currentSalams = user.wallet?.direct_salams_balance ?? (currentIsVip ? 20 : 2);
  const currentExpiry = user.wallet?.subscription_expiry;
  const daysRemaining = user.wallet?.daysRemaining;
  const subscriptionStartedAt = user.wallet?.subscriptionStartedAt;

  const getInitialDuration = (u: CandidateUser): number | 'lifetime' | 'custom' => {
    const isVip = Boolean(u.is_vip);
    const exp = u.wallet?.subscription_expiry;
    const remaining = u.wallet?.daysRemaining;
    if (!isVip) return 7; // Default to 7 days trial
    if (!exp) return 'lifetime';
    const days = (remaining !== undefined && remaining !== null) 
      ? remaining 
      : Math.ceil((new Date(exp).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return 7;
    if (days <= 31) return 30;
    if (days <= 95) return 90;
    if (days <= 370) return 365;
    return 'custom';
  };

  const [selectedTier, setSelectedTier] = useState<string>(currentTier === 'barakah_vip' ? 'barakah_vip' : 'free');
  const [durationMode, setDurationMode] = useState<number | 'lifetime' | 'custom'>(() => getInitialDuration(user));
  const [customExpiryDate, setCustomExpiryDate] = useState<string>(() => {
    if (currentExpiry) {
      return new Date(currentExpiry).toISOString().slice(0, 10);
    }
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [salamsToAdd, setSalamsToAdd] = useState<number>(0);
  const [resetQuotas, setResetQuotas] = useState<boolean>(true);
  const [purchases, setPurchases] = useState<InAppPurchaseRecord[]>(user.purchases || []);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const isVip = Boolean(user.is_vip);
      setSelectedTier(user.wallet?.subscription_tier === 'barakah_vip' || isVip ? 'barakah_vip' : 'free');
      setDurationMode(getInitialDuration(user));
      if (user.wallet?.subscription_expiry) {
        setCustomExpiryDate(new Date(user.wallet.subscription_expiry).toISOString().slice(0, 10));
      }
    }
  }, [user.id, user.is_vip, user.wallet?.subscription_expiry, user.wallet?.daysRemaining]);

  // Fetch real-time purchase records from backend
  useEffect(() => {
    if (!user.id) return;
    const fetchPurchases = async () => {
      setIsLoadingPurchases(true);
      try {
        const token = adminToken || sessionStorage.getItem('qurb_admin_token') || sessionStorage.getItem('serene_admin_token') || localStorage.getItem('qurb_admin_token') || localStorage.getItem('serene_admin_token');
        const res = await fetch(`${API_BASE}/admin/users/${user.id}/purchases`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (data.success && data.purchases) {
          setPurchases(data.purchases);
        }
      } catch (err) {
        console.warn('Failed to load purchase history:', err);
      } finally {
        setIsLoadingPurchases(false);
      }
    };
    fetchPurchases();
  }, [user.id]);

  const handleSave = async () => {
    const isVip = selectedTier === 'barakah_vip';
    let durationParam: number | 'lifetime' | undefined = undefined;
    let customDateParam: string | undefined = undefined;

    if (isVip) {
      if (durationMode === 'lifetime') {
        durationParam = 'lifetime';
      } else if (durationMode === 'custom') {
        customDateParam = customExpiryDate;
      } else {
        durationParam = durationMode;
      }
    }

    await onUpdateSubscription(
      user.id,
      selectedTier,
      salamsToAdd,
      isVip,
      resetQuotas,
      durationParam,
      customDateParam
    );
    onClose();
  };

  const handleInstantRevoke = async () => {
    if (confirm(`Are you sure you want to immediately revoke VIP access and downgrade ${user.full_name} to Free?`)) {
      setSelectedTier('free');
      await onUpdateSubscription(user.id, 'free', 0, false, true, undefined, undefined);
      onClose();
    }
  };

  const getProductName = (productId: string) => {
    switch (productId) {
      case 'qurb_barakah_monthly':
      case 'serene_barakah_monthly':
        return 'Qurb Barakah VIP Club (Monthly)';
      case 'qurb_direct_salam_20':
      case 'serene_direct_salam_20':
        return '20 Direct Salam Passes';
      case 'qurb_spotlight_boost_24h':
      case 'serene_spotlight_boost_24h':
        return '24-Hour Spotlight Boost';
      default:
        return productId;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-[#0F172A] border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif flex items-center space-x-2">
                <span>Manage Subscription & IAP</span>
              </h3>
              <p className="text-xs text-slate-400">
                Candidate: <strong className="text-white">{user.full_name}</strong> ({user.email || user.phone})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Account & Membership Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              Account Created:
            </span>
            <span className="font-semibold text-white mt-0.5 inline-block">
              {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Current Plan:
            </span>
            <span className={`font-semibold inline-flex items-center space-x-1 mt-0.5 ${currentIsVip ? 'text-amber-400' : 'text-slate-300'}`}>
              <span>{currentIsVip ? 'Barakah VIP Active' : 'Standard Free'}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <Send className="w-3 h-3 text-emerald-400" />
              Salams Balance:
            </span>
            <span className="font-semibold text-emerald-400 mt-0.5 inline-block">
              {currentSalams} Salams
            </span>
          </div>

          {currentIsVip && (
            <>
              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  VIP Activated On:
                </span>
                <span className="font-semibold text-amber-300 mt-0.5 inline-block">
                  {subscriptionStartedAt ? new Date(subscriptionStartedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Active'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Current Expiry Date:
                </span>
                <span className="font-semibold text-amber-300 mt-0.5 inline-block">
                  {currentExpiry 
                    ? `${new Date(currentExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} (${daysRemaining !== undefined && daysRemaining !== null ? `${daysRemaining} days left` : 'active'})`
                    : 'Permanent / Lifetime VIP (No expiry)'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 2. Google Play In-App Purchase Records */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Play In-App Purchase History</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {purchases.length} {purchases.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-3 max-h-44 overflow-y-auto space-y-2">
            {isLoadingPurchases ? (
              <div className="py-4 text-center text-xs text-slate-400">Loading purchase history...</div>
            ) : purchases.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500">
                No Google Play In-App Purchases recorded yet for this candidate.
              </div>
            ) : (
              purchases.map((p) => (
                <div key={p.id} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between text-xs hover:border-white/20 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{getProductName(p.product_id)}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.platform === 'google_play' ? 'Google Play' : p.platform}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                      <span>Purchased: {new Date(p.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500 truncate max-w-[150px]">Ref: {p.id}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-emerald-400 block">${(p.amount_cents / 100).toFixed(2)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">{p.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Membership Tier Adjustment */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Membership Tier</span>
          </label>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSelectedTier('barakah_vip')}
              className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                selectedTier === 'barakah_vip'
                  ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className={`mt-0.5 p-1 rounded-lg ${selectedTier === 'barakah_vip' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                <Crown className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Barakah VIP Club</span>
                  {selectedTier === 'barakah_vip' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Unlimited daily likes (9999), 9999 messaging quota, VIP badge & top priority ranking.
                </p>
              </div>
            </button>

            {selectedTier === 'barakah_vip' && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>VIP Duration / Expiry Configuration</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '7 Days Trial', val: 7 },
                    { label: '1 Month (30d)', val: 30 },
                    { label: '3 Months (90d)', val: 90 },
                    { label: '1 Year (365d)', val: 365 },
                    { label: 'Permanent / Lifetime', val: 'lifetime' as const },
                    { label: 'Custom Date', val: 'custom' as const }
                  ].map((item) => (
                    <button
                      key={String(item.val)}
                      type="button"
                      onClick={() => setDurationMode(item.val)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        durationMode === item.val
                          ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Picker */}
                {durationMode === 'custom' && (
                  <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Set Exact Expiry Date:
                    </span>
                    <input
                      type="date"
                      value={customExpiryDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                      className="bg-black/50 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedTier('free')}
              className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                selectedTier === 'free'
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className={`mt-0.5 p-1 rounded-lg ${selectedTier === 'free' ? 'bg-sky-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Standard / Free Seeker</span>
                  {selectedTier === 'free' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Standard free quotas (50 likes/day, 15 daily messages, no VIP badge).
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 4. Bonus Direct Salams */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bonus Direct Salams to Credit</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSalamsToAdd(num)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  salamsToAdd === num
                    ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {num === 0 ? 'No Extra' : `+${num} Salams`}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Reset Quotas & Instant Revoke */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={resetQuotas}
              onChange={(e) => setResetQuotas(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <span>Instantly reset today's consumed likes and messages to 0</span>
          </label>

          {currentIsVip && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleInstantRevoke}
                disabled={isSubmitting}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Instant Revoke VIP & Downgrade to Free</span>
              </button>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save & Sync Subscription'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
