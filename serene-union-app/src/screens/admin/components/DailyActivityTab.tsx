import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Search,
  RefreshCw,
  Eye,
  X,
  Shield,
  Wifi,
  MapPin,
  AlertCircle,
  User,
  Crown,
  ExternalLink
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';
import type { 
  DailyActivityResponse, 
  UserAuditDetail 
} from '../types';

interface DailyActivityTabProps {
  adminToken: string;
  onInspectUser?: (userId: string) => void;
}

export const DailyActivityTab: React.FC<DailyActivityTabProps> = ({
  adminToken,
  onInspectUser
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [data, setData] = useState<DailyActivityResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'has_matches' | 'real_only'>('all');
  
  // On-Demand ("On-Call") Audit Modal State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [auditDetail, setAuditDetail] = useState<UserAuditDetail | null>(null);
  const [isAuditLoading, setIsAuditLoading] = useState<boolean>(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'matches' | 'conversations' | 'telemetry'>('matches');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // 1. Fetch Daily Activity Data
  const fetchDailyActivity = useCallback(async (isSilent = false) => {
    if (!adminToken) return;
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/daily-activity?date=${selectedDate}&t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${adminToken}`
        },
        cache: 'no-store'
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch daily activity:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken, selectedDate]);

  useEffect(() => {
    fetchDailyActivity();
  }, [fetchDailyActivity]);

  // 2. Fetch On-Demand User Details ("On-Call")
  const handleOpenAudit = async (userId: string) => {
    setSelectedUserId(userId);
    setAuditDetail(null);
    setIsAuditLoading(true);
    setSelectedConversationId(null);
    setActiveAuditTab('matches');

    try {
      const res = await fetch(`${API_BASE}/admin/daily-activity/user-details?userId=${userId}&date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const json = await res.json();
      if (json.success) {
        setAuditDetail(json);
        if (json.conversationsToday && json.conversationsToday.length > 0) {
          setSelectedConversationId(json.conversationsToday[0].conversationId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user audit details:', err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter(u => {
      const matchesSearch = 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.profession.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'online') return u.status === 'online';
      if (statusFilter === 'has_matches') return u.matchesCountToday > 0;
      if (statusFilter === 'real_only') return !u.isSeed;

      return true;
    });
  }, [data?.users, searchQuery, statusFilter]);

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      {/* Top Title & Date Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-sky-500/20 to-blue-500/20 border border-sky-500/30 text-sky-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Daily Activity & Session Audits
            </h1>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-400">
            Monitor active durations, daily matches, network IP telemetry, and on-demand conversation audits.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDate === todayStr
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Today
          </button>
          
          <button
            onClick={() => {
              const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
              setSelectedDate(yesterday);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDate !== todayStr && selectedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Yesterday
          </button>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => fetchDailyActivity()}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white shadow-lg shadow-sky-600/20 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Real-Time Data'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Today */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Members</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {summary?.activeUsersCount ?? '--'}
          </div>
          <div className="mt-1 text-[11px] text-sky-400 font-medium">
            Active on {selectedDate}
          </div>
        </div>

        {/* Total Time Logged */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Active Time</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {summary?.totalActiveHours ?? '--'} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            Accumulated engagement
          </div>
        </div>

        {/* Matches Formed */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Matches Formed</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF2560]/10 border border-[#FF2560]/20 flex items-center justify-center text-[#FF2560]">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {summary?.matchesCountToday ?? '--'}
          </div>
          <div className="mt-1 text-[11px] text-pink-400 font-medium">
            {summary?.likesCountToday ?? 0} likes & greetings sent
          </div>
        </div>

        {/* Messages Exchanged */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Messages Exchanged</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {summary?.messagesCountToday ?? '--'}
          </div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">
            {summary?.topCities?.[0]?.name ? `Top city: ${summary.topCities[0].name}` : 'Halal chat interactions'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, city, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Active ({summary?.activeUsersCount || data?.users?.length || 0})
          </button>
          
          <button
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              statusFilter === 'online'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online Now</span>
          </button>

          <button
            onClick={() => setStatusFilter('has_matches')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === 'has_matches'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Matched Today
          </button>

          <button
            onClick={() => setStatusFilter('real_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === 'real_only'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Organic Users Only
          </button>
        </div>
      </div>

      {/* Daily User Roster Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Active Time Today</th>
                <th className="py-3.5 px-4">Today's Matches</th>
                <th className="py-3.5 px-4">Cloudflare Edge IP & City</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details On-Call</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && !data ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-400 mb-2" />
                    <span>Loading daily sessions and metrics...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                    <span>No active user sessions recorded for {selectedDate}.</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={u.photoUrl}
                              alt={u.fullName}
                              className="w-10 h-10 rounded-2xl object-cover border border-white/10 shadow"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/seeds/seed_female_1.jpg';
                              }}
                            />
                            {u.isVip && (
                              <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-500 text-black">
                                <Crown className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                                {u.fullName}
                              </span>
                              {u.isSeed && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                                  Seed
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {u.age}y • {u.profession}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Active Time Today */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 font-bold text-xs">
                            {u.activeDurationFormatted}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Last seen: {new Date(u.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Matches & Likes */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                            u.matchesCountToday > 0 
                              ? 'bg-[#FF2560]/20 text-[#FF2560] border border-[#FF2560]/30'
                              : 'bg-white/5 text-slate-400'
                          }`}>
                            {u.matchesCountToday} Matches
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {u.likesCountToday} Likes
                          </span>
                        </div>
                      </td>

                      {/* IP & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{u.city}, {u.country}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Wifi className="w-3 h-3 text-sky-400" />
                          <span className="font-mono text-[10px]">{u.ip}</span>
                          <span className="text-slate-500">• {u.isp.split(' ')[0]}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {u.status === 'online' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Online</span>
                          </span>
                        ) : u.status === 'away' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
                            <span>Away</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-[11px]">
                            <span>Offline</span>
                          </span>
                        )}
                      </td>

                      {/* On-Call Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAudit(u.id)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center space-x-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit On-Call</span>
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

      {/* ==================================================================== */}
      {/* On-Demand ("On-Call") In-Depth Audit Modal */}
      {/* Fetches messages, matches, and network telemetry ONLY on click */}
      {/* ==================================================================== */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Shield className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>Member Telemetry & Daily Audit</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-normal">
                      Date: {selectedDate}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    On-demand telemetry, today's matches, and conversation inspection.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserId(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {isAuditLoading ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-sky-400 mb-3" />
                <span className="text-sm font-medium">Fetching on-call audit records from edge nodes...</span>
              </div>
            ) : !auditDetail ? (
              <div className="p-12 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                <span>Unable to load audit details for this member.</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* User Profile Mini Banner */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={auditDetail.user.photos?.[0] || '/seeds/seed_female_1.jpg'}
                      alt={auditDetail.user.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-bold text-white">
                          {auditDetail.user.fullName}
                        </h4>
                        {auditDetail.user.isVip && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            VIP
                          </span>
                        )}
                        {auditDetail.user.isSeed && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Seed Profile
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {auditDetail.user.profession} • {auditDetail.user.city}, {auditDetail.user.country}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        ID: {auditDetail.user.id} • Phone: {auditDetail.user.phone || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Active Duration Badge */}
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Active Today</div>
                    <div className="text-xl font-bold text-sky-400">
                      {auditDetail.telemetry.activeDurationFormatted}
                    </div>
                  </div>
                </div>

                {/* Subtabs for Modal */}
                <div className="flex border-b border-white/10 space-x-4">
                  <button
                    onClick={() => setActiveAuditTab('matches')}
                    className={`pb-2.5 text-xs font-semibold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
                      activeAuditTab === 'matches'
                        ? 'border-pink-500 text-pink-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Matches & Likes Today ({auditDetail.matchesToday.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('conversations')}
                    className={`pb-2.5 text-xs font-semibold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
                      activeAuditTab === 'conversations'
                        ? 'border-sky-500 text-sky-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Conversations Today ({auditDetail.conversationsToday.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('telemetry')}
                    className={`pb-2.5 text-xs font-semibold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
                      activeAuditTab === 'telemetry'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    <span>IP & Edge Telemetry</span>
                  </button>
                </div>

                {/* Tab 1: Matches & Likes */}
                {activeAuditTab === 'matches' && (
                  <div className="space-y-4">
                    {auditDetail.matchesToday.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 bg-white/[0.02] rounded-2xl border border-white/5">
                        No matches were initiated or formed by this member on {selectedDate}.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {auditDetail.matchesToday.map((m) => (
                          <div
                            key={m.matchId}
                            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={m.partner.photoUrl}
                                alt={m.partner.fullName}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10"
                              />
                              <div>
                                <div className="font-semibold text-white text-xs">
                                  {m.partner.fullName}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {m.partner.profession} • {m.partner.city}
                                </div>
                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-medium">
                                  {m.matchType}
                                </span>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-500 text-right">
                              {new Date(m.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Conversations Transcripts */}
                {activeAuditTab === 'conversations' && (
                  <div className="space-y-4">
                    {auditDetail.conversationsToday.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 bg-white/[0.02] rounded-2xl border border-white/5">
                        No messages exchanged on {selectedDate}.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Conversations list sidebar */}
                        <div className="space-y-2 md:col-span-1">
                          {auditDetail.conversationsToday.map((cv) => (
                            <button
                              key={cv.conversationId}
                              onClick={() => setSelectedConversationId(cv.conversationId)}
                              className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                                selectedConversationId === cv.conversationId
                                  ? 'bg-sky-500/15 border-sky-500/40 text-white'
                                  : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={cv.partner.photoUrl}
                                  alt={cv.partner.fullName}
                                  className="w-8 h-8 rounded-xl object-cover"
                                />
                                <div className="truncate">
                                  <div className="text-xs font-semibold truncate">
                                    {cv.partner.fullName}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {cv.lastMessageText || 'No message'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Selected conversation message transcript bubble view */}
                        <div className="md:col-span-2 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col h-80">
                          {(() => {
                            const activeConv = auditDetail.conversationsToday.find(
                              (c) => c.conversationId === selectedConversationId
                            ) || auditDetail.conversationsToday[0];

                            if (!activeConv) return null;

                            return (
                              <div className="flex flex-col h-full">
                                <div className="pb-3 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-white">
                                  <span>Chat with {activeConv.partner.fullName}</span>
                                  <span className="text-[10px] text-slate-400">
                                    {activeConv.messages.length} messages
                                  </span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                                  {activeConv.messages.map((msg) => (
                                    <div
                                      key={msg.id}
                                      className={`flex flex-col ${
                                        msg.isFromCurrentUser ? 'items-end' : 'items-start'
                                      }`}
                                    >
                                      <div className="text-[10px] text-slate-400 mb-1">
                                        {msg.senderName}
                                      </div>
                                      <div
                                        className={`px-3 py-2 rounded-2xl max-w-[80%] text-xs ${
                                          msg.isFromCurrentUser
                                            ? 'bg-sky-500 text-white rounded-br-none'
                                            : 'bg-white/10 text-slate-200 rounded-bl-none'
                                        }`}
                                      >
                                        {msg.text}
                                      </div>
                                      <div className="text-[9px] text-slate-500 mt-0.5">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: IP & Edge Telemetry */}
                {activeAuditTab === 'telemetry' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="text-xs font-semibold text-sky-400 flex items-center space-x-1.5">
                        <Wifi className="w-4 h-4" />
                        <span>Cloudflare Edge Network Telemetry</span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">Connecting IP: </span>
                        <span className="font-mono text-white">{auditDetail.telemetry.ip}</span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">ISP / Network Org: </span>
                        <span className="text-white">{auditDetail.telemetry.isp}</span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">Edge Location: </span>
                        <span className="text-white">{auditDetail.telemetry.city}, {auditDetail.telemetry.country}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Session Time Boundaries</span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">First Active: </span>
                        <span className="text-white">
                          {new Date(auditDetail.telemetry.firstActiveAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">Last Seen: </span>
                        <span className="text-white">
                          {new Date(auditDetail.telemetry.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">Device User-Agent: </span>
                        <span className="text-slate-400 text-[10px] break-all block mt-0.5">
                          {auditDetail.telemetry.userAgent}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              {onInspectUser && auditDetail ? (
                <button
                  onClick={() => {
                    onInspectUser(auditDetail.user.id);
                    setSelectedUserId(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border border-white/10"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Open Full User Directory Card</span>
                </button>
              ) : <div />}
              <button
                onClick={() => setSelectedUserId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
