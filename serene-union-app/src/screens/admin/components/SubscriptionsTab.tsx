import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Crown, 
  ShoppingBag, 
  Calendar, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  Sliders, 
  TrendingUp,
  Send,
  Layers,
  Users,
  Coins,
  PieChart,
  MapPin,
  Filter,
  ArrowRight
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

export interface ProductStatRow {
  product_id: string;
  order_count: number;
  buyer_count: number;
  revenue_cents: number;
  last_purchased_at?: string;
}

export interface WalletInsights {
  totalSalamsInWallets: number;
  usersWithSalams: number;
  activeSpotlights: number;
  totalAdsWatched: number;
  totalLikesUsedToday: number;
}

export interface Demographics {
  topCities: { city: string; order_count: number; revenue_cents: number }[];
  byGender: { gender: string; order_count: number; revenue_cents: number }[];
}

export interface ProductMeta {
  name: string;
  badge: string;
  category: 'subscription' | 'salams' | 'spotlight' | 'other';
  priceLabel: string;
  priceUsd: number;
  pkrEst: number;
  description: string;
  features: string[];
}

const KNOWN_PRODUCTS: Record<string, ProductMeta> = {
  'qurb_barakah_monthly': {
    name: 'Qurb Barakah VIP Club',
    badge: 'Monthly Subscription',
    category: 'subscription',
    priceLabel: '$2.99 / mo',
    priceUsd: 2.99,
    pkrEst: 830,
    description: 'Premier matrimonial tier with 7-day free trial, unlimited likes, rewinds, and secret admirers reveal.',
    features: ['Unlimited Likes & Rewind', '20 Direct Salams / mo', 'See Who Liked You', '0 In-App Ads', 'City Feed Top Priority']
  },
  'serene_barakah_monthly': {
    name: 'Serene Barakah VIP Club (Legacy)',
    badge: 'Monthly Subscription',
    category: 'subscription',
    priceLabel: '$2.99 / mo',
    priceUsd: 2.99,
    pkrEst: 830,
    description: 'Legacy VIP Club subscription SKU.',
    features: ['VIP Matchmaking Access', 'Direct Salams', 'Ad-Free Experience']
  },
  'qurb_direct_salam_20': {
    name: '20 Direct Salam Passes',
    badge: 'Instant Connect Pack',
    category: 'salams',
    priceLabel: '$1.99',
    priceUsd: 1.99,
    pkrEst: 550,
    description: 'Send direct intro messages to candidate profiles immediately without waiting for a mutual match.',
    features: ['20 Direct Introductions', 'Bypasses Mutual Match Gate', 'Permanent until used', 'Direct In-Chat Message']
  },
  'serene_direct_salam_20': {
    name: '20 Direct Salam Passes (Legacy)',
    badge: 'Instant Connect Pack',
    category: 'salams',
    priceLabel: '$1.99',
    priceUsd: 1.99,
    pkrEst: 550,
    description: 'Legacy 20 Direct Salams pack SKU.',
    features: ['20 Direct Introductions', 'Legacy Pack']
  },
  'qurb_direct_salam_5': {
    name: '5 Direct Salam Passes',
    badge: 'Starter Pack',
    category: 'salams',
    priceLabel: '$0.99',
    priceUsd: 0.99,
    pkrEst: 275,
    description: 'Affordable starter pack to reach out to high-compatibility profiles instantly.',
    features: ['5 Direct Introductions', 'Instant Reachout', 'No Match Required']
  },
  'serene_direct_salam_5': {
    name: '5 Direct Salam Passes (Legacy)',
    badge: 'Starter Pack',
    category: 'salams',
    priceLabel: '$0.99',
    priceUsd: 0.99,
    pkrEst: 275,
    description: 'Legacy 5 Direct Salams pack SKU.',
    features: ['5 Direct Introductions']
  },
  'qurb_spotlight_boost_24h': {
    name: '24-Hour City Spotlight Boost',
    badge: '10x City Visibility',
    category: 'spotlight',
    priceLabel: '$0.99',
    priceUsd: 0.99,
    pkrEst: 275,
    description: 'Pins profile at the #1 top spot in the user’s local city Discover feed for a full 24 hours.',
    features: ['#1 Pinned in City Feed', '10x Profile Views', 'Glow Ring & Spotlight Badge', 'Lasts 24 Hours']
  },
  'serene_spotlight_boost_24h': {
    name: '24-Hour City Spotlight Boost (Legacy)',
    badge: '10x City Visibility',
    category: 'spotlight',
    priceLabel: '$0.99',
    priceUsd: 0.99,
    pkrEst: 275,
    description: 'Legacy 24h Spotlight Boost SKU.',
    features: ['City Feed Boost', '24 Hours Duration']
  }
};

const getKnownProductMeta = (productId: string): ProductMeta => {
  if (KNOWN_PRODUCTS[productId]) return KNOWN_PRODUCTS[productId];
  
  if (productId.includes('salam')) {
    return {
      name: `${productId.replace(/_/g, ' ')}`,
      badge: 'Direct Salams',
      category: 'salams',
      priceLabel: '$1.99',
      priceUsd: 1.99,
      pkrEst: 550,
      description: 'Direct message introductions pack.',
      features: ['Direct Reachout']
    };
  }
  if (productId.includes('spotlight') || productId.includes('boost')) {
    return {
      name: `${productId.replace(/_/g, ' ')}`,
      badge: 'Profile Boost',
      category: 'spotlight',
      priceLabel: '$0.99',
      priceUsd: 0.99,
      pkrEst: 275,
      description: 'City Discover feed priority spotlight.',
      features: ['10x Views', 'City Spotlight']
    };
  }
  if (productId.includes('vip') || productId.includes('barakah') || productId.includes('monthly')) {
    return {
      name: `${productId.replace(/_/g, ' ')}`,
      badge: 'Subscription',
      category: 'subscription',
      priceLabel: '$2.99 / mo',
      priceUsd: 2.99,
      pkrEst: 830,
      description: 'VIP Matrimonial membership.',
      features: ['VIP Access']
    };
  }
  return {
    name: productId,
    badge: 'In-App Product',
    category: 'other',
    priceLabel: 'In-App',
    priceUsd: 1.0,
    pkrEst: 280,
    description: 'In-app digital product purchase.',
    features: ['Digital Product']
  };
};

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  adminToken,
  onManageSubscription,
  onInspectUser,
  onShowToast
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [purchases, setPurchases] = useState<RawPurchaseRow[]>([]);
  const [productStats, setProductStats] = useState<ProductStatRow[]>([]);
  const [walletInsights, setWalletInsights] = useState<WalletInsights>({
    totalSalamsInWallets: 0,
    usersWithSalams: 0,
    activeSpotlights: 0,
    totalAdsWatched: 0,
    totalLikesUsedToday: 0
  });
  const [demographics, setDemographics] = useState<Demographics>({
    topCities: [],
    byGender: []
  });
  const [stats, setStats] = useState<{ totalVip: number; totalOrders: number; totalRevenueCents: number }>({
    totalVip: 0,
    totalOrders: 0,
    totalRevenueCents: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'subscription' | 'salams' | 'spotlight'>('all');
  const [ledgerProductFilter, setLedgerProductFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'products' | 'ledger'>('subscribers');
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
        if (data.stats) setStats(data.stats);
        if (data.productBreakdown) setProductStats(data.productBreakdown);
        if (data.walletInsights) setWalletInsights(data.walletInsights);
        if (data.demographics) setDemographics(data.demographics);
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
    if (onShowToast) onShowToast('Copied to clipboard');
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

  // Aggregated Product Catalog & Category Insights
  const productInsights = useMemo(() => {
    const allKnownIds = Object.keys(KNOWN_PRODUCTS);
    const purchasedIds = productStats.map(p => p.product_id);
    const combinedIds = Array.from(new Set([...allKnownIds, ...purchasedIds]));

    const catalogList = combinedIds.map(id => {
      const meta = getKnownProductMeta(id);
      const stat = productStats.find(p => p.product_id === id);
      return {
        id,
        ...meta,
        orderCount: stat?.order_count || 0,
        buyerCount: stat?.buyer_count || 0,
        revenueCents: stat?.revenue_cents || 0,
        lastPurchasedAt: stat?.last_purchased_at
      };
    });

    const subRevenue = catalogList.filter(p => p.category === 'subscription').reduce((sum, p) => sum + p.revenueCents, 0);
    const subOrders = catalogList.filter(p => p.category === 'subscription').reduce((sum, p) => sum + p.orderCount, 0);

    const salamsRevenue = catalogList.filter(p => p.category === 'salams').reduce((sum, p) => sum + p.revenueCents, 0);
    const salamsOrders = catalogList.filter(p => p.category === 'salams').reduce((sum, p) => sum + p.orderCount, 0);

    const spotlightRevenue = catalogList.filter(p => p.category === 'spotlight').reduce((sum, p) => sum + p.revenueCents, 0);
    const spotlightOrders = catalogList.filter(p => p.category === 'spotlight').reduce((sum, p) => sum + p.orderCount, 0);

    const totalRev = Math.max(1, subRevenue + salamsRevenue + spotlightRevenue);

    return {
      catalogList,
      categories: {
        subscriptions: { revenue: subRevenue, orders: subOrders, sharePct: Math.round((subRevenue / totalRev) * 100) },
        salams: { revenue: salamsRevenue, orders: salamsOrders, sharePct: Math.round((salamsRevenue / totalRev) * 100) },
        spotlights: { revenue: spotlightRevenue, orders: spotlightOrders, sharePct: Math.round((spotlightRevenue / totalRev) * 100) }
      }
    };
  }, [productStats]);

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

  // Filtered product catalog list for "Products" tab
  const filteredProducts = useMemo(() => {
    return productInsights.catalogList.filter((prod) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        prod.name.toLowerCase().includes(q) ||
        prod.id.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.badge.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (productCategoryFilter !== 'all' && prod.category !== productCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [productInsights.catalogList, searchTerm, productCategoryFilter]);

  // Filtered purchases list for "Ledger" tab
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        p.id?.toLowerCase().includes(q) ||
        p.product_id?.toLowerCase().includes(q) ||
        p.purchase_token?.toLowerCase().includes(q) ||
        p.user_name?.toLowerCase().includes(q) ||
        p.user_email?.toLowerCase().includes(q) ||
        p.user_phone?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (ledgerProductFilter !== 'all') {
        if (ledgerProductFilter === 'subscription' && !p.product_id?.includes('monthly') && !p.product_id?.includes('vip')) return false;
        if (ledgerProductFilter === 'salams' && !p.product_id?.includes('salam')) return false;
        if (ledgerProductFilter === 'spotlight' && !p.product_id?.includes('spotlight') && !p.product_id?.includes('boost')) return false;
        if (ledgerProductFilter.startsWith('exact:') && p.product_id !== ledgerProductFilter.replace('exact:', '')) return false;
      }

      return true;
    });
  }, [purchases, searchTerm, ledgerProductFilter]);

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

  const handleFilterByProductInLedger = (productId: string) => {
    setLedgerProductFilter(`exact:${productId}`);
    setActiveSubTab('ledger');
    if (onShowToast) onShowToast(`Filtered ledger to ${productId}`);
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
                Products, Subscriptions & In-App Purchases Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-product monetization metrics, Direct Salams, City Spotlights, VIP memberships & Google Play Ledger
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

      {/* 4 Multi-Product KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Barakah VIP Subscriptions */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">VIP Subscriptions</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">{stats.totalVip}</div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-sky-400 font-medium">{activeTrialCount} Active Trials</span>
            <span className="text-amber-400 font-semibold">{productInsights.categories.subscriptions.sharePct}% Sales Share</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            PKR {((productInsights.categories.subscriptions.revenue || 0) / 100).toLocaleString()} Volume
          </div>
        </div>

        {/* 2. Direct Salam Passes (Consumable) */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Direct Salam Passes</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">
            {walletInsights.totalSalamsInWallets.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">{walletInsights.usersWithSalams} Wallets Funded</span>
            <span className="text-emerald-300 font-semibold">{productInsights.categories.salams.orders} Packs Sold</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {walletInsights.totalAdsWatched} Free Salams via Rewarded Ads
          </div>
        </div>

        {/* 3. 24h City Spotlight Boosts (Consumable) */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Spotlight City Boosts</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">
            {walletInsights.activeSpotlights}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-purple-300 font-medium">Active #1 City Pins</span>
            <span className="text-purple-400 font-semibold">{productInsights.categories.spotlights.orders} Total Boosts</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            PKR {((productInsights.categories.spotlights.revenue || 0) / 100).toLocaleString()} Boost Revenue
          </div>
        </div>

        {/* 4. Total In-App Gross Revenue & Orders */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Store Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-serif">
            PKR {((stats.totalRevenueCents || 0) / 100).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-indigo-300 font-medium">${((stats.totalRevenueCents || 0) / 100 / 278).toFixed(1)} USD</span>
            <span className="text-emerald-400 font-semibold">{stats.totalOrders} Orders</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Across Subscriptions & Consumables
          </div>
        </div>
      </div>

      {/* Sub-tab Pill Switcher & Filters */}
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-2xl border border-white/5 w-fit flex-wrap">
            {/* Tab 1: Subscribers */}
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

            {/* Tab 2: Products & Consumables Catalog */}
            <button
              onClick={() => setActiveSubTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'products'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Products & Insights</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-black/30 font-mono">
                {productInsights.catalogList.length}
              </span>
            </button>

            {/* Tab 3: Purchase Ledger */}
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
              placeholder={
                activeSubTab === 'subscribers' 
                  ? "Search by name, email, phone, city, or order ID..."
                  : activeSubTab === 'products'
                    ? "Search products by name, SKU, price, or features..."
                    : "Search transactions by user, token, order ID, or product..."
              }
              className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Filter chips (Subscribers Tab) */}
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

        {/* Filter chips (Products Tab) */}
        {activeSubTab === 'products' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-white/5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Category:</span>
            {[
              { id: 'all', label: 'All Products' },
              { id: 'subscription', label: '👑 Subscriptions' },
              { id: 'salams', label: '💌 Direct Salam Passes' },
              { id: 'spotlight', label: '🚀 Spotlight Boosts' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setProductCategoryFilter(cat.id as any)}
                className={`text-xs px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                  productCategoryFilter === cat.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Filter Dropdown (Ledger Tab) */}
        {activeSubTab === 'ledger' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-white/5 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-medium mr-1">Product Filter:</span>
            <select
              value={ledgerProductFilter}
              onChange={(e) => setLedgerProductFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Products (All Transactions)</option>
              <option value="subscription">👑 All VIP Subscriptions</option>
              <option value="salams">💌 All Direct Salam Passes</option>
              <option value="spotlight">🚀 All City Spotlight Boosts</option>
              <option disabled>────────── Specific SKUs ──────────</option>
              <option value="exact:qurb_barakah_monthly">Qurb Barakah VIP Monthly ($2.99)</option>
              <option value="exact:qurb_direct_salam_20">20 Direct Salam Passes ($1.99)</option>
              <option value="exact:qurb_direct_salam_5">5 Direct Salam Passes ($0.99)</option>
              <option value="exact:qurb_spotlight_boost_24h">24-Hour City Spotlight Boost ($0.99)</option>
              <option value="exact:serene_barakah_monthly">Serene Barakah VIP (Legacy)</option>
            </select>

            {ledgerProductFilter !== 'all' && (
              <button
                onClick={() => setLedgerProductFilter('all')}
                className="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded-lg bg-rose-500/10 cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: SUBSCRIBERS & MEMBERSHIPS TABLE
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'subscribers' && (
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B101E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-medium">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Tier & Quotas</th>
                  <th className="px-6 py-4">Activation Date</th>
                  <th className="px-6 py-4">Subscription Status</th>
                  <th className="px-6 py-4">Last IAP Transaction</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Loading subscribers from Cloudflare D1...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No subscribers found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => {
                    const expiry = getExpiryDetails(sub.subscription_expiry, sub.is_vip);
                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* User Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 font-bold font-serif shadow-xs">
                              {sub.full_name ? sub.full_name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-xs flex items-center space-x-1.5">
                                <span>{sub.full_name}</span>
                                {sub.is_vip ? (
                                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold border border-amber-500/30">
                                    VIP
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {sub.phone || sub.email}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {sub.city || 'Pakistan'} • <span className="capitalize">{sub.gender}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Tier & Quotas */}
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/25">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="capitalize">{sub.subscription_tier ? sub.subscription_tier.replace('_', ' ') : 'Barakah VIP'}</span>
                          </div>
                          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center space-x-1">
                            <Send className="w-3 h-3 text-emerald-400" />
                            <span>{sub.direct_salams_balance ?? 20} Direct Salams</span>
                          </div>
                        </td>

                        {/* Activation Date */}
                        <td className="px-6 py-4 text-xs text-slate-300">
                          <div className="flex items-center space-x-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
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
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: ALL PRODUCTS CATALOG & DEEP MONETIZATION INSIGHTS
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          {/* Executive Product Insights & Economics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Category Share Breakdown */}
            <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-xs font-serif uppercase tracking-wider">
                    Revenue By Product Line
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Gross Volume</span>
              </div>

              <div className="space-y-3">
                {/* VIP Subscriptions */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-300 font-medium flex items-center gap-1.5">
                      <Crown className="w-3 h-3 text-amber-400" />
                      VIP Subscriptions
                    </span>
                    <span className="text-white font-mono font-bold">
                      PKR {((productInsights.categories.subscriptions.revenue || 0) / 100).toLocaleString()} ({productInsights.categories.subscriptions.sharePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(5, productInsights.categories.subscriptions.sharePct))}%` }} 
                    />
                  </div>
                </div>

                {/* Direct Salam Packs */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                      <Send className="w-3 h-3 text-emerald-400" />
                      Direct Salam Passes
                    </span>
                    <span className="text-white font-mono font-bold">
                      PKR {((productInsights.categories.salams.revenue || 0) / 100).toLocaleString()} ({productInsights.categories.salams.sharePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(5, productInsights.categories.salams.sharePct))}%` }} 
                    />
                  </div>
                </div>

                {/* City Spotlight Boosts */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-300 font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-purple-400" />
                      Spotlight City Boosts
                    </span>
                    <span className="text-white font-mono font-bold">
                      PKR {((productInsights.categories.spotlights.revenue || 0) / 100).toLocaleString()} ({productInsights.categories.spotlights.sharePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(5, productInsights.categories.spotlights.sharePct))}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Top Purchasing Cities Demographics */}
            <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-white text-xs font-serif uppercase tracking-wider">
                    Top Paying Cities
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Geographic Demand</span>
              </div>

              {demographics.topCities.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Transaction city telemetry will appear here as orders process.
                </div>
              ) : (
                <div className="space-y-2">
                  {demographics.topCities.slice(0, 4).map((city, cIdx) => (
                    <div key={city.city || cIdx} className="flex items-center justify-between text-xs bg-slate-900/60 px-3 py-2 rounded-xl border border-white/5">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[10px] flex items-center justify-center">
                          #{cIdx + 1}
                        </span>
                        <span className="font-semibold text-white">{city.city}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-emerald-400 font-semibold text-[11px]">
                          PKR {((city.revenue_cents || 0) / 100).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {city.order_count} {city.order_count === 1 ? 'order' : 'orders'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Gender Buyer Breakdown & Consumables Circulation */}
            <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-xs font-serif uppercase tracking-wider">
                    Buyer Gender Split
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Demographics</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Male Buyers */}
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-sky-500/20 text-center">
                  <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider">Brothers (Male)</div>
                  <div className="text-xl font-extrabold text-white mt-1">
                    {demographics.byGender.find(g => g.gender === 'male')?.order_count || 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    PKR {(((demographics.byGender.find(g => g.gender === 'male')?.revenue_cents || 0)) / 100).toLocaleString()}
                  </div>
                </div>

                {/* Female Buyers */}
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-pink-500/20 text-center">
                  <div className="text-[11px] text-pink-400 font-bold uppercase tracking-wider">Sisters (Female)</div>
                  <div className="text-xl font-extrabold text-white mt-1">
                    {demographics.byGender.find(g => g.gender === 'female')?.order_count || 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    PKR {(((demographics.byGender.find(g => g.gender === 'female')?.revenue_cents || 0)) / 100).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wallet Salams in Circulation</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {walletInsights.totalSalamsInWallets.toLocaleString()} Salams
                </span>
              </div>
            </div>
          </div>

          {/* Product Cards Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const IconComponent = prod.category === 'subscription' 
                ? Crown 
                : prod.category === 'salams' 
                  ? Send 
                  : prod.category === 'spotlight' 
                    ? TrendingUp 
                    : ShoppingBag;

              const badgeColor = prod.category === 'subscription'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : prod.category === 'salams'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

              return (
                <div 
                  key={prod.id} 
                  className="bg-[#0F172A] border border-white/10 hover:border-white/20 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header: Icon, Name & Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-2xl border shadow-sm ${
                          prod.category === 'subscription'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : prod.category === 'salams'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm font-serif">{prod.name}</h4>
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border mt-1 ${badgeColor}`}>
                            {prod.badge}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-white font-mono">{prod.priceLabel}</div>
                        <div className="text-[10px] text-slate-400">~PKR {prod.pkrEst}</div>
                      </div>
                    </div>

                    {/* SKU ID with 1-click copy */}
                    <div className="flex items-center justify-between bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
                      <span className="truncate mr-2">SKU: {prod.id}</span>
                      <button
                        onClick={() => copyToClipboard(prod.id, prod.id)}
                        className="hover:text-white p-0.5 transition-colors cursor-pointer shrink-0"
                        title="Copy SKU ID"
                      >
                        {copiedToken === prod.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Sales Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
                      <div className="bg-slate-900/50 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Orders</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">{prod.orderCount}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Buyers</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">{prod.buyerCount}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Volume</div>
                        <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                          PKR {((prod.revenueCents || 0) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1 pt-1">
                      {prod.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Last: {formatDate(prod.lastPurchasedAt)}
                    </span>

                    <button
                      onClick={() => handleFilterByProductInLedger(prod.id)}
                      className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer font-medium"
                    >
                      <span>View in Ledger</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: GOOGLE PLAY PURCHASE LEDGER
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ledger' && (
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B101E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-medium">
                <tr>
                  <th className="px-6 py-4">Transaction / Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product Name & SKU</th>
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
                      No Google Play in-app purchase records found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((p) => {
                    const prodMeta = getKnownProductMeta(p.product_id);
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
                          <div className="font-medium text-white text-xs">{prodMeta.name}</div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-amber-300 border border-white/10 font-semibold inline-block mt-0.5">
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
