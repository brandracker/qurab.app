import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Crown, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  Sliders, 
  TrendingUp
} from 'lucide-react';
import type { CandidateUser } from '../types';
import { API_BASE } from '../../../services/dbService';

interface SubscriptionsTabProps {
  adminToken: string;
  onManageSubscription: (user: CandidateUser) => void;
  onInspectUser: (userId: string) => void;
  onShowToast?: (msg: string) => void;
}

interface SubscriberRow {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  gender: string;
  city?: string;
  is_vip: number | boolean;
  account_created_at?: string;
  subscription_tier?: string;
  subscription_expiry?: string | null;
  direct_salams_balance?: number;
  first_purchased_at?: string | null;
  last_purchased_at?: string | null;
  last_product_id?: string | null;
  last_order_id?: string | null;
  last_amount_cents?: number | null;
}

interface RawPurchaseRow {
  id: string;
  user_id: string;
  product_id: string;
  platform: string;
  purchase_token?: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  adminToken,
  onManageSubscription,
  onInspectUser,
  onShowToast
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [purchases, setPurchases] = useState<RawPurchaseRow[]>([]);
  const [stats, setStats] = useState<{ totalVip: number; totalOrders: number; totalRevenueCents: number }>({
    totalVip: 0,
    totalOrders: 0,
    totalRevenueCents: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'ledger'>('subscribers');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/subscriptions?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setPurchases(data.purchases || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        if (onShowToast) onShowToast(data.error || 'Failed to fetch subscription data');
      }
    } catch (err: any) {
      console.error('Failed to fetch subscriptions hub data:', err);
      if (onShowToast) onShowToast('Network error loading subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, onShowToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    if (onShowToast) onShowToast('Order/Token reference copied to clipboard');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getExpiryDetails = (expiry?: string | null, isVip?: number | boolean) => {
    if (!expiry) {
      return {
        label: isVip ? 'Active (No Expiry)' : 'Standard User',
        badgeClass: isVip ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-white/5',
        isTrial: false,
        isExpired: false
      };
    }
    const expDate = new Date(expiry);
    const now = new Date();
    const diffMs = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      const pastDays = Math.abs(diffDays);
      return {
        label: `Expired (${pastDays === 0 ? 'Today' : `${pastDays}d ago`})`,
        badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        isTrial: false,
        isExpired: true
      };
    }

    if (diffDays <= 7) {
      return {
        label: `7-Day Trial (${diffDays}d left)`,
        badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        isTrial: true,
        isExpired: false
      };
    }

    if (diffDays > 3650) {
      return {
        label: 'Lifetime VIP',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        isTrial: false,
        isExpired: false
      };
    }

    return {
      label: `Active (${diffDays}d left)`,
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      isTrial: false,
      isExpired: false
    };
  };

  // Filtered subscribers list
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        sub.full_name?.toLowerCase().includes(q) ||
        sub.email?.toLowerCase().includes(q) ||
        sub.phone?.toLowerCase().includes(q) ||
        sub.city?.toLowerCase().includes(q) ||
        sub.last_product_id?.toLowerCase().includes(q) ||
        sub.last_order_id?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const expiryInfo = getExpiryDetails(sub.subscription_expiry, sub.is_vip);
      if (statusFilter === 'active') {
        return Boolean(sub.is_vip) && !expiryInfo.isExpired;
      }
      if (statusFilter === 'trial') {
        return expiryInfo.isTrial;
      }
      if (statusFilter === 'expired') {
        return expiryInfo.isExpired || (!sub.is_vip && sub.subscription_expiry);
      }
      return true;
    });
  }, [subscribers, searchTerm, statusFilter]);

  // Filtered purchases list
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      return !q ||
        p.id?.toLowerCase().includes(q) ||
        p.product_id?.toLowerCase().includes(q) ||
        p.purchase_token?.toLowerCase().includes(q) ||
        p.user_name?.toLowerCase().includes(q) ||
        p.user_email?.toLowerCase().includes(q) ||
        p.user_phone?.toLowerCase().includes(q);
    });
  }, [purchases, searchTerm]);

  // Active trial count
  const activeTrialCount = useMemo(() => {
    return subscribers.filter((s) => getExpiryDetails(s.subscription_expiry, s.is_vip).isTrial).length;
  }, [subscribers]);

  const handleOpenUserModal = (sub: SubscriberRow) => {
    const candidate: CandidateUser = {
      id: sub.id,
      full_name: sub.full_name,
      email: sub.email,
      phone: sub.phone,
      gender: sub.gender,
      city: sub.city,
      is_vip: sub.is_vip,
      account_status: 'active',
      is_banned: 0,
      created_at: sub.account_created_at,
      wallet: {
        subscription_tier: sub.subscription_tier || 'barakah_vip',
        subscription_expiry: sub.subscription_expiry,
        direct_salams_balance: sub.direct_salams_balance ?? 20,
        subscriptionStartedAt: sub.first_purchased_at || sub.account_created_at
      }
    };
    onManageSubscription(candidate);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-serif">
                Subscriptions & In-App Purchases Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Play Billing records, 7-day trials, expiry dates, and real-time subscriber control
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total VIP Subscribers */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">VIP Subscribers</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">{stats.totalVip}</div>
          <div className="text-[11px] text-amber-400/90 mt-2 flex items-center space-x-1.5 font-medium">
            <span>★ Barakah VIP Accounts</span>
          </div>
        </div>

        {/* Active 7-Day Trials */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">7-Day Free Trials</span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/25">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">{activeTrialCount}</div>
          <div className="text-[11px] text-sky-400/90 mt-2 flex items-center space-x-1.5 font-medium">
            <span>● Currently in introductory trial</span>
          </div>
        </div>

        {/* Google Play Store Orders */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Google Play Orders</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">{stats.totalOrders}</div>
          <div className="text-[11px] text-emerald-400/90 mt-2 flex items-center space-x-1.5 font-medium">
            <span>✓ Verified in-app transactions</span>
          </div>
        </div>

        {/* Gross Estimated Revenue */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Store Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">
            PKR {((stats.totalRevenueCents || 0) / 100).toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-400/90 mt-2 flex items-center space-x-1.5 font-medium">
            <span>Gross In-App Purchase Volume</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Pill Switcher & Filters */}
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-2xl border border-white/5 w-fit">
            <button
              onClick={() => setActiveSubTab('subscribers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'subscribers'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Subscribers & Memberships</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {subscribers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'ledger'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Google Play Purchase Ledger</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {purchases.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, city, or order ID..."
              className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Filter chips (only for subscribers tab) */}
        {activeSubTab === 'subscribers' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-white/5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Status:</span>
            {(['all', 'active', 'trial', 'expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1 rounded-xl font-medium transition-all cursor-pointer capitalize ${
                  statusFilter === st
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {st === 'trial' ? '7-Day Trial' : st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'subscribers' ? (
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B101E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-medium">
                <tr>
                  <th className="px-6 py-4">Candidate / User</th>
                  <th className="px-6 py-4">Account Created</th>
                  <th className="px-6 py-4">VIP Started Date</th>
                  <th className="px-6 py-4">Current Expiry & Status</th>
                  <th className="px-6 py-4">Google Play IAP Details</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Loading subscribers from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No subscribers match the current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => {
                    const isVip = Boolean(sub.is_vip);
                    const expiry = getExpiryDetails(sub.subscription_expiry, isVip);

                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Candidate User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3.5">
                            <div className="relative w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold border border-white/10 flex-shrink-0">
                              {sub.full_name?.slice(0, 1) || 'U'}
                              {isVip && (
                                <div className="absolute -top-1 -right-1 bg-amber-500 p-0.5 rounded-full">
                                  <Crown className="w-2.5 h-2.5 text-black" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center space-x-1.5">
                                <span>{sub.full_name}</span>
                                {isVip && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">
                                {sub.email || sub.phone}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                                <span className="capitalize">{sub.gender}</span>
                                <span>•</span>
                                <span>{sub.city || 'Global'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Account Created Date */}
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            <span>{formatDate(sub.account_created_at)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Registered Member</div>
                        </td>

                        {/* VIP Started Date */}
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center space-x-1.5 text-amber-300">
                            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span>{formatDate(sub.first_purchased_at || sub.account_created_at)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Initial Activation</div>
                        </td>

                        {/* Current Expiry & Status */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-xl border font-semibold ${expiry.badgeClass}`}>
                            <span>{expiry.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">
                            {sub.subscription_expiry ? formatDate(sub.subscription_expiry) : 'Permanent'}
                          </div>
                        </td>

                        {/* Google Play IAP Details */}
                        <td className="px-6 py-4 text-xs">
                          {sub.last_product_id ? (
                            <div className="space-y-1">
                              <div className="font-mono text-white text-[11px] font-semibold flex items-center space-x-1">
                                <ShoppingBag className="w-3 h-3 text-emerald-400" />
                                <span>{sub.last_product_id}</span>
                              </div>
                              {sub.last_order_id && (
                                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                                  <span>ID: {sub.last_order_id.slice(0, 16)}...</span>
                                  <button
                                    onClick={() => copyToClipboard(sub.last_order_id!, sub.id)}
                                    className="p-0.5 hover:text-white transition-colors cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedToken === sub.id ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-slate-500" />
                                    )}
                                  </button>
                                </div>
                              )}
                              {sub.last_amount_cents ? (
                                <div className="text-[10px] text-emerald-400 font-semibold">
                                  PKR {((sub.last_amount_cents || 0) / 100).toLocaleString()}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Manual Admin Grant</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenUserModal(sub)}
                            className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold cursor-pointer transition-all"
                            title="Manage Subscription, Expiry Date & Quotas"
                          >
                            <Sliders className="w-3 h-3 mr-1" />
                            <span>Manage VIP</span>
                          </button>

                          <button
                            onClick={() => onInspectUser(sub.id)}
                            className="inline-flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold cursor-pointer transition-all"
                            title="Inspect Candidate Profile"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Google Play Raw Transactions Ledger */
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B101E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-medium">
                <tr>
                  <th className="px-6 py-4">Transaction / Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Loading transactions from Cloudflare D1...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No Google Play in-app purchase records found.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((p) => {
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5 font-mono text-xs text-white">
                            <span>{p.id.slice(0, 18)}...</span>
                            <button
                              onClick={() => copyToClipboard(p.id, p.id)}
                              className="p-1 hover:text-white transition-colors cursor-pointer"
                              title="Copy Order ID"
                            >
                              {copiedToken === p.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </button>
                          </div>
                          {p.purchase_token && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                              Token: {p.purchase_token.slice(0, 20)}...
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-white text-xs">{p.user_name || 'Member'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.user_email || p.user_phone || p.user_id}</div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 border border-white/10 font-semibold">
                            {p.product_id}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-300">
                          <span className="inline-flex items-center space-x-1 text-slate-300">
                            <ShoppingBag className="w-3 h-3 text-emerald-400" />
                            <span className="capitalize">{p.platform.replace('_', ' ')}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-emerald-400 font-mono">
                          {p.currency} {((p.amount_cents || 0) / 100).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-300">
                          {formatDate(p.created_at)}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold capitalize">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{p.status}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onInspectUser(p.user_id)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Inspect User Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
