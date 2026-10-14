import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Power,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  Trash2,
  AlertCircle,
  Heart,
  MessageSquare,
  Flame,
  X,
  Maximize2
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';
import type { SeedProfile } from '../types';

interface SeedProfilesTabProps {
  adminToken: string;
}

export const SeedProfilesTab: React.FC<SeedProfilesTabProps> = ({ adminToken }) => {
  const [profiles, setProfiles] = useState<SeedProfile[]>([]);
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [defaultPassword, setDefaultPassword] = useState<string>('QurbSeed@2026');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'has_matches' | 'has_likes'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [togglingGlobal, setTogglingGlobal] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<SeedProfile | null>(null);

  const fetchSeedProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/seed-profiles`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        setGlobalEnabled(data.globalEnabled);
        if (data.defaultPassword) {
          setDefaultPassword(data.defaultPassword);
        }
      }
    } catch (err) {
      console.error('Failed to fetch seed profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeedProfiles();
  }, [adminToken]);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleToggleGlobal = async () => {
    try {
      setTogglingGlobal(true);
      const targetState = !globalEnabled;
      const res = await fetch(`${API_BASE}/admin/seed-profiles/toggle-global`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ enabled: targetState })
      });
      const data = await res.json();
      if (data.success) {
        setGlobalEnabled(data.globalEnabled);
        showToast(
          data.globalEnabled
            ? '✅ Master switch ON: Seed profiles are now visible in Discover feed'
            : '⏸️ Master switch OFF: All seed profiles are hidden from Discover feed'
        );
      }
    } catch (err) {
      console.error('Failed to toggle master switch:', err);
    } finally {
      setTogglingGlobal(false);
    }
  };

  const handleToggleActive = async (profile: SeedProfile) => {
    try {
      setTogglingId(profile.id);
      const currentActive = profile.seedActive === 1 || profile.seedActive === true;
      const nextActive = !currentActive;

      const res = await fetch(`${API_BASE}/admin/seed-profiles/toggle-active/${profile.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ active: nextActive })
      });
      const data = await res.json();
      if (data.success) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === profile.id ? { ...p, seedActive: nextActive ? 1 : 0 } : p))
        );
        showToast(
          nextActive
            ? `Activated ${profile.fullName} in feed`
            : `Deactivated ${profile.fullName} from feed`
        );
      }
    } catch (err) {
      console.error('Failed to toggle profile active:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleResetSeeds = async () => {
    if (!window.confirm('Re-sync / restore all 25 Pakistani female seed profiles?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/seed-profiles/reset`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Synchronized ${data.count || 25} seed profiles`);
        await fetchSeedProfiles();
      }
    } catch (err) {
      console.error('Failed to sync seeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id: string, name: string) => {
    if (!window.confirm(`Permanently remove seed profile "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/seed-profiles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        showToast(`Removed seed profile ${name}`);
      }
    } catch (err) {
      console.error('Failed to delete seed profile:', err);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 25;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  // Filter logic
  const cities = Array.from(new Set(profiles.map((p) => p.city).filter(Boolean)));

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.profession && p.profession.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === 'all' || p.city === selectedCity;

    const isActive = p.seedActive === 1 || p.seedActive === true;
    const matchesCount = Number(p.mutualMatchesCount || 0);
    const likesCount = Number(p.likesReceivedCount || 0);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && isActive) ||
      (statusFilter === 'inactive' && !isActive) ||
      (statusFilter === 'has_matches' && matchesCount > 0) ||
      (statusFilter === 'has_likes' && likesCount > 0);

    return matchesSearch && matchesCity && matchesStatus;
  });

  const activeCount = profiles.filter((p) => p.seedActive === 1 || p.seedActive === true).length;
  const totalMutualMatches = profiles.reduce((sum, p) => sum + Number(p.mutualMatchesCount || 0), 0);
  const totalLikesReceived = profiles.reduce((sum, p) => sum + Number(p.likesReceivedCount || 0), 0);
  const totalConversations = profiles.reduce((sum, p) => sum + Number(p.conversationsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-[#0F172A] border border-emerald-500/40 text-emerald-300 shadow-2xl shadow-emerald-500/20 backdrop-blur-md animate-fade-in">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Header Banner & Master Toggle */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0D1527] to-[#0A101D] border border-emerald-500/20 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Pakistani Female Seed Profiles
              </h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                {profiles.length} Verified Profiles
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Authentic Pakistani matrimonial profiles with verified biodata, unblurred portraits,
              real-time active matches tracking, and pre-configured test credentials.
            </p>
          </div>

          {/* Master Global Switch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between sm:justify-start space-x-4 p-3 px-4 rounded-2xl bg-[#131D33] border border-white/10">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Discover Feed Status</div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      globalEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-bold ${
                      globalEnabled ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {globalEnabled ? 'ACTIVE & VISIBLE' : 'ALL SEEDS HIDDEN'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleGlobal}
                disabled={togglingGlobal}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  globalEnabled
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{globalEnabled ? 'Turn OFF' : 'Turn ON'}</span>
              </button>
            </div>

            <button
              onClick={handleResetSeeds}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Resynchronize / restore seed profiles"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync 25 Seeds</span>
            </button>
          </div>
        </div>

        {/* Global Stats & Matches Quick Dashboard */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 font-medium">Universal Password</div>
            <div className="flex items-center justify-between mt-1">
              <code className="text-sm font-mono font-bold text-amber-300">
                {defaultPassword}
              </code>
              <button
                onClick={() => copyToClipboard(defaultPassword, 'global-pwd')}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                title="Copy password"
              >
                {copiedKey === 'global-pwd' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 font-medium">Feed Discoverability</div>
            <div className="text-base font-bold text-white mt-1">
              {activeCount} of {profiles.length}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({globalEnabled ? 'Active' : 'Paused'})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 font-medium">Active Mutual Matches</div>
            <div className="flex items-center space-x-1.5 text-base font-bold text-rose-400 mt-1">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{totalMutualMatches} Matches</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 font-medium">Interactions Received</div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mt-1">
              <span className="text-rose-400 flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-400" />
                <span>{totalLikesReceived}</span>
              </span>
              <span>•</span>
              <span className="text-indigo-400 flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>{totalConversations}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, profession, city, email, phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0D1527] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-[#0D1527] border border-white/10 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Pakistani Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-2xl bg-[#0D1527] border border-white/10 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status ({profiles.length})</option>
            <option value="active">Active Only ({activeCount})</option>
            <option value="inactive">Inactive Only ({profiles.length - activeCount})</option>
            <option value="has_matches">Has Mutual Matches (&gt;0)</option>
            <option value="has_likes">Has Likes Received (&gt;0)</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 font-medium">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          Connecting and loading seed profiles...
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#0D1527] border border-white/10 text-center text-slate-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-base font-semibold text-slate-300">No seed profiles match your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or city selection.</p>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProfiles.map((p) => {
            const isActive = p.seedActive === 1 || p.seedActive === true;
            const age = calculateAge(p.dob);
            const pwd = p.seedPassword || defaultPassword;
            const photoUrl = p.photoUrl || '/seeds/seed_female_1.jpg';
            const likesCount = Number(p.likesReceivedCount || 0);
            const matchesCount = Number(p.mutualMatchesCount || 0);
            const convsCount = Number(p.conversationsCount || 0);

            return (
              <div
                key={p.id}
                className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0D1527] border-white/10 hover:border-emerald-500/30 shadow-lg'
                    : 'bg-[#0D1527]/50 border-white/5 opacity-70'
                }`}
              >
                <div>
                  {/* Top Row: Avatar & Name */}
                  <div className="flex items-start space-x-4">
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setPreviewProfile(p)}
                      title="Click to view full photo"
                    >
                      <img
                        src={photoUrl}
                        alt={p.fullName}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <span className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </span>
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1527] ${
                          isActive && globalEnabled ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                        title={isActive ? 'Active in Feed' : 'Inactive'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white truncate">{p.fullName}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {age} yrs
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{p.city}, Pakistan</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-0.5 truncate">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{p.profession}</span>
                      </div>
                    </div>
                  </div>

                  {/* Matches & Activity Metrics (Requested by User) */}
                  <div className="mt-3.5 p-2.5 rounded-2xl bg-[#111A2E] border border-white/5 flex items-center justify-around text-xs">
                    <div className="flex items-center space-x-1.5 text-rose-400" title="Likes received from users">
                      <Heart className="w-4 h-4 fill-rose-500/20 text-rose-400" />
                      <span className="font-bold">{likesCount}</span>
                      <span className="text-[10px] text-slate-400">Likes</span>
                    </div>

                    <div className="h-3.5 w-px bg-white/10" />

                    <div className="flex items-center space-x-1.5 text-amber-400" title="Mutual matches created">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="font-bold">{matchesCount}</span>
                      <span className="text-[10px] text-slate-400">Matches</span>
                    </div>

                    <div className="h-3.5 w-px bg-white/10" />

                    <div className="flex items-center space-x-1.5 text-indigo-400" title="Active chat conversations">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold">{convsCount}</span>
                      <span className="text-[10px] text-slate-400">Chats</span>
                    </div>
                  </div>

                  {/* Badges / Education & Deen */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2.5 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/5 flex items-center space-x-1">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[130px]">{p.education}</span>
                    </span>
                    {p.sect && (
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {p.sect}
                      </span>
                    )}
                    {p.practiceLevel && (
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium capitalize">
                        {p.practiceLevel}
                      </span>
                    )}
                  </div>

                  {/* Bio snippet */}
                  {p.bio && (
                    <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      "{p.bio}"
                    </p>
                  )}

                  {/* Wali Info */}
                  {p.waliName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Wali: <strong className="text-slate-300">{p.waliName}</strong> (
                          {p.waliRelationship || 'Father'})
                        </span>
                      </span>
                      <span className="font-mono text-slate-500">{p.waliPhone}</span>
                    </div>
                  )}

                  {/* Login Credentials Box */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-[#090E1A] border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <Key className="w-3 h-3" />
                        <span>Login Credentials</span>
                      </span>
                      <span className="text-[10px] text-slate-400 lowercase font-mono">
                        id: {p.id}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-white/[0.03] text-xs">
                      <span className="flex items-center space-x-2 text-slate-300 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-mono truncate">{p.email}</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(p.email, `email-${p.id}`)}
                        className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedKey === `email-${p.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-white/[0.03] text-xs">
                      <span className="flex items-center space-x-2 text-slate-300 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-mono truncate">{p.phone}</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(p.phone, `phone-${p.id}`)}
                        className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Phone"
                      >
                        {copiedKey === `phone-${p.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-white/[0.03] text-xs">
                      <span className="flex items-center space-x-2 text-slate-300 truncate">
                        <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-mono text-amber-300 font-bold truncate">{pwd}</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(pwd, `pwd-${p.id}`)}
                        className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedKey === `pwd-${p.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Toggle active / delete */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(p)}
                      disabled={togglingId === p.id}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-slate-700/40 text-slate-400 border border-slate-700 hover:bg-slate-700/60'
                      }`}
                    >
                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Active in Feed' : 'Inactive / Hidden'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteProfile(p.id, p.fullName)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    title="Delete Seed Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Photo & Profile Inspection Modal (Requested by user) */}
      {previewProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewProfile(null)}
        >
          <div
            className="bg-[#0D1527] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewProfile(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-square w-full bg-black/50 overflow-hidden">
              <img
                src={previewProfile.photoUrl || '/seeds/seed_female_1.jpg'}
                alt={previewProfile.fullName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1527] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{previewProfile.fullName}</h3>
                    <p className="text-sm text-emerald-400 font-medium">
                      {previewProfile.profession} • {previewProfile.city}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                    {calculateAge(previewProfile.dob)} yrs
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Likes Received</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {previewProfile.likesReceivedCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Mutual Matches</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {previewProfile.mutualMatchesCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Active Chats</div>
                  <div className="text-sm font-bold text-indigo-400 mt-0.5">
                    {previewProfile.conversationsCount || 0}
                  </div>
                </div>
              </div>

              {previewProfile.bio && (
                <div>
                  <div className="text-xs text-slate-400 font-semibold mb-1">About & Bio</div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    "{previewProfile.bio}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 text-[10px]">Education</span>
                  <div className="text-slate-200 font-medium mt-0.5 truncate">
                    {previewProfile.education}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 text-[10px]">Deen Practice</span>
                  <div className="text-slate-200 font-medium mt-0.5 capitalize">
                    {previewProfile.sect} • {previewProfile.practiceLevel}
                  </div>
                </div>
              </div>

              {previewProfile.waliName && (
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span>Wali: <strong>{previewProfile.waliName}</strong> ({previewProfile.waliRelationship || 'Father'})</span>
                  <span className="font-mono text-slate-400">{previewProfile.waliPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
