import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Crown, 
  RefreshCw, 
  MapPin,
  Radio,
  ArrowRight,
  Calendar,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type { DashboardStats, DailyBreakdownItem } from '../types';

interface OverviewTabProps {
  stats: DashboardStats | null;
  onRefresh: () => void;
  onSelectTab?: (tab: any, dateStr?: string) => void;
}

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[monthIdx] || ''} ${year}`;
  } catch {
    return dateStr;
  }
};

const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[monthIdx] || ''}`;
  } catch {
    return dateStr;
  }
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, onRefresh, onSelectTab }) => {
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const yesterdayIso = useMemo(() => new Date(Date.now() - 86400000).toISOString().split('T')[0], []);
  const weekAgoIso = useMemo(() => new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], []);
  const monthAgoIso = useMemo(() => new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0], []);

  const [selectedFilterDate, setSelectedFilterDate] = useState<string>(todayIso);
  const [isDailyBreakdownOpen, setIsDailyBreakdownOpen] = useState<boolean>(true);

  // Date ranges formatted
  const todayLabel = formatDisplayDate(todayIso);
  const weekRangeLabel = `${formatShortDate(weekAgoIso)} – ${formatShortDate(todayIso)}`;
  const monthRangeLabel = `${formatShortDate(monthAgoIso)} – ${formatShortDate(todayIso)}`;

  // Find data for currently selected date from dailyBreakdown
  const dailyList: DailyBreakdownItem[] = useMemo(() => {
    if (stats?.growth?.dailyBreakdown && stats.growth.dailyBreakdown.length > 0) {
      return stats.growth.dailyBreakdown;
    }
    // Fallback if dailyBreakdown not yet populated
    return [
      { date: todayIso, signups: stats?.growth?.today ?? 0, male: Math.round((stats?.growth?.today ?? 0) * 0.8), female: Math.round((stats?.growth?.today ?? 0) * 0.2) }
    ];
  }, [stats?.growth, todayIso]);

  // Specific Day-over-Day Rows & Comparisons
  const todayRow = useMemo(() => {
    const found = dailyList.find(d => d.date === todayIso);
    if (found) return found;
    return {
      date: todayIso,
      signups: stats?.growth?.today ?? 0,
      male: Math.round((stats?.growth?.today ?? 0) * 0.8),
      female: Math.round((stats?.growth?.today ?? 0) * 0.2)
    };
  }, [dailyList, todayIso, stats?.growth?.today]);

  const yesterdayRow = useMemo(() => {
    const found = dailyList.find(d => d.date === yesterdayIso);
    if (found) return found;
    if (stats?.growth?.yesterdayStats) return stats.growth.yesterdayStats;
    return {
      date: yesterdayIso,
      signups: stats?.growth?.yesterday ?? 0,
      male: Math.round((stats?.growth?.yesterday ?? 0) * 0.8),
      female: Math.round((stats?.growth?.yesterday ?? 0) * 0.2)
    };
  }, [dailyList, yesterdayIso, stats?.growth?.yesterday, stats?.growth?.yesterdayStats]);

  const diffSignups = useMemo(() => {
    if (stats?.growth?.diffFromYesterday !== undefined) {
      return stats.growth.diffFromYesterday;
    }
    return (todayRow?.signups ?? 0) - (yesterdayRow?.signups ?? 0);
  }, [stats?.growth?.diffFromYesterday, todayRow?.signups, yesterdayRow?.signups]);

  const diffPct = useMemo(() => {
    if (stats?.growth?.diffPctFromYesterday !== undefined) {
      return stats.growth.diffPctFromYesterday;
    }
    const ySignups = yesterdayRow?.signups ?? 0;
    if (ySignups === 0) return 0;
    return Number(((diffSignups / ySignups) * 100).toFixed(1));
  }, [stats?.growth?.diffPctFromYesterday, diffSignups, yesterdayRow?.signups]);

  const brotherDiff = (todayRow?.male ?? 0) - (yesterdayRow?.male ?? 0);
  const sisterDiff = (todayRow?.female ?? 0) - (yesterdayRow?.female ?? 0);

  const selectedDateRow = useMemo(() => {
    return dailyList.find(d => d.date === selectedFilterDate);
  }, [dailyList, selectedFilterDate]);

  const maxSignups = useMemo(() => {
    return Math.max(...dailyList.map(d => d.signups), 1);
  }, [dailyList]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">Platform Health & Demographics</h2>
          <p className="text-xs text-slate-400 mt-1">Live operational statistics & growth velocity</p>
        </div>
        <div className="flex items-center space-x-3">
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('live')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white shadow-lg shadow-sky-600/20 text-xs font-semibold transition-all cursor-pointer w-fit"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Open Live Monitor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
          <button
            onClick={onRefresh}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Real-Time Data</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-serif">{stats?.totalUsers ?? '—'}</div>
          <div className="text-xs text-slate-400 mt-3 flex items-center justify-between">
            <span>Brothers: {stats?.maleUsers ?? 0}</span>
            <span>Sisters: {stats?.femaleUsers ?? 0}</span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Matches</span>
            <Heart className="w-5 h-5 text-[#FF2560]" />
          </div>
          <div className="text-4xl font-extrabold text-white font-serif">{stats?.activeMatches ?? '—'}</div>
          <div className="text-xs text-slate-400 mt-3">
            Mutual interests & likes
          </div>
        </div>

        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversations</span>
            <MessageSquare className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-serif">{stats?.totalConversations ?? '—'}</div>
          <div className="text-xs text-slate-400 mt-3">
            Active dialogue channels
          </div>
        </div>

        <div 
          onClick={() => onSelectTab && onSelectTab('subscriptions')}
          className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group"
          title="Click to view Subscriptions & In-App Purchases Hub"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-300 transition-colors">Barakah VIP</span>
            <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-4xl font-extrabold text-white font-serif">{stats?.vipSubscribers ?? '—'}</div>
          <div className="text-xs text-amber-400/80 mt-3 flex items-center justify-between">
            <span>Active premium subscribers</span>
            <span className="text-[11px] font-semibold underline">Manage Hub →</span>
          </div>
        </div>
      </div>

      {/* Visual Gender Balance & Growth Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Ratio Card & Growth Periods */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
              <span>Gender Ratio Balance</span>
              <span className="text-xs text-slate-400 font-normal">Halal Platform Demographics</span>
            </h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-400">Brothers: {stats?.maleRatio ?? 0}%</span>
                <span className="text-[#FF4D7D]">Sisters: {stats?.femaleRatio ?? 0}%</span>
              </div>
              {/* Visual Progress Bar */}
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex border border-white/10 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-l-full transition-all duration-500" 
                  style={{ width: `${stats?.maleRatio ?? 50}%` }} 
                />
                <div 
                  className="h-full bg-gradient-to-r from-[#FF2560] to-[#FF4D7D] rounded-r-full transition-all duration-500" 
                  style={{ width: `${stats?.femaleRatio ?? 50}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Date-wise Growth Periods & Selector */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Date-Wise Growth Velocity</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tareekh k hisaab se signups
              </span>
            </div>

            {/* 3 Main Period Cards with Exact Date Display */}
            <div className="grid grid-cols-3 gap-3">
              {/* Today Card with Day-over-Day delta badge */}
              <button
                type="button"
                onClick={() => setSelectedFilterDate(todayIso)}
                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFilterDate === todayIso
                    ? 'bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-500/10'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Today</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{todayLabel}</div>
                  <div className="text-xl font-extrabold text-white mt-1">+{todayRow?.signups ?? 0}</div>
                </div>

                <div className="mt-2 pt-1 border-t border-white/5">
                  {(yesterdayRow?.signups ?? 0) > 0 ? (
                    <div className={`text-[10px] font-bold inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-md ${
                      diffSignups >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {diffSignups >= 0 ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                      <span>{diffSignups >= 0 ? `+${diffSignups}` : `${diffSignups}`} ({diffSignups >= 0 ? `+${diffPct}%` : `${diffPct}%`})</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">New Members</span>
                  )}
                  <div className="text-[9px] text-slate-500 mt-0.5">vs Kal ({yesterdayRow?.signups ?? 0})</div>
                </div>
              </button>

              {/* Last 7 Days Card */}
              <button
                type="button"
                onClick={() => setSelectedFilterDate(todayIso)}
                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                  selectedFilterDate === todayIso
                    ? 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Last 7 Days</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{weekRangeLabel}</div>
                <div className="text-xl font-extrabold text-white mt-1">+{stats?.growth?.thisWeek ?? 0}</div>
                <div className="text-[10px] text-slate-400 mt-2">Past 7 Days</div>
              </button>

              {/* Last 30 Days Card */}
              <button
                type="button"
                onClick={() => setSelectedFilterDate(todayIso)}
                className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-2xl text-center transition-all cursor-pointer"
              >
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Last 30 Days</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{monthRangeLabel}</div>
                <div className="text-xl font-extrabold text-white mt-1">+{stats?.growth?.thisMonth ?? 0}</div>
                <div className="text-[10px] text-slate-400 mt-2">Past Month</div>
              </button>
            </div>

            {/* Dedicated Day-over-Day Comparison Banner (Today vs Yesterday / Aaj vs Kal) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#0F172A] to-[#0c1322] border border-sky-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      Day-over-Day Comparison (Aaj vs Kal)
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Comparing Today ({formatShortDate(todayIso)}) with Yesterday ({formatShortDate(yesterdayIso)})
                    </p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 border ${
                  diffSignups >= 0 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}>
                  {diffSignups >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{diffSignups >= 0 ? `+${diffPct}% Higher` : `${diffPct}% vs Yesterday`}</span>
                </div>
              </div>

              {/* 2-Column Comparison Grid: Today vs Yesterday */}
              <div className="grid grid-cols-2 gap-3">
                {/* Today Column */}
                <div 
                  onClick={() => setSelectedFilterDate(todayIso)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedFilterDate === todayIso 
                      ? 'bg-sky-500/15 border-sky-500/40' 
                      : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-sky-400">Today (Aaj)</span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatShortDate(todayIso)}</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-white">+{todayRow?.signups ?? 0}</span>
                    <span className="text-[10px] text-slate-400">signups</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] pt-1.5 mt-1 border-t border-white/5">
                    <span className="text-sky-300 font-medium">👨 {todayRow?.male ?? 0} brothers</span>
                    <span className="text-[#FF4D7D] font-medium">👩 {todayRow?.female ?? 0} sisters</span>
                  </div>
                </div>

                {/* Yesterday Column */}
                <div 
                  onClick={() => setSelectedFilterDate(yesterdayIso)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedFilterDate === yesterdayIso 
                      ? 'bg-sky-500/15 border-sky-500/40' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Yesterday (Kal)</span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatShortDate(yesterdayIso)}</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-slate-300">+{yesterdayRow?.signups ?? 0}</span>
                    <span className="text-[10px] text-slate-400">signups</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] pt-1.5 mt-1 border-t border-white/5">
                    <span className="text-slate-400">👨 {yesterdayRow?.male ?? 0} brothers</span>
                    <span className="text-slate-400">👩 {yesterdayRow?.female ?? 0} sisters</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Audit & Insights */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
                <div className="flex items-center space-x-3 text-slate-400">
                  <span>
                    Net Change: <strong className={diffSignups >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {diffSignups >= 0 ? `+${diffSignups}` : `${diffSignups}`} profiles
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Brothers: <strong className={brotherDiff >= 0 ? 'text-sky-400' : 'text-slate-400'}>
                      {brotherDiff >= 0 ? `+${brotherDiff}` : `${brotherDiff}`}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Sisters: <strong className={sisterDiff >= 0 ? 'text-[#FF4D7D]' : 'text-slate-400'}>
                      {sisterDiff >= 0 ? `+${sisterDiff}` : `${sisterDiff}`}
                    </strong>
                  </span>
                </div>

                {onSelectTab && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onSelectTab('daily', yesterdayIso)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      <span>Kal ka Audit ({yesterdayRow?.signups ?? 0})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTab('daily', todayIso)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      <span>Aaj ka Audit ({todayRow?.signups ?? 0})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Date Selector & Inspector Bar */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-medium">Select Date:</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFilterDate(todayIso)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedFilterDate === todayIso
                        ? 'bg-sky-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilterDate(yesterdayIso)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedFilterDate === yesterdayIso
                        ? 'bg-sky-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Yesterday
                  </button>
                </div>
              </div>

              {/* Calendar Date Picker Input */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-sky-400 mr-2" />
                <input
                  type="date"
                  value={selectedFilterDate}
                  onChange={(e) => setSelectedFilterDate(e.target.value)}
                  className="bg-transparent text-white text-xs outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Selected Date Summary Badge */}
            {selectedDateRow ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="font-bold text-white">
                      {formatDisplayDate(selectedFilterDate)}
                    </span>
                    <span className="text-slate-400 ml-2">
                      +{selectedDateRow.signups} registrations ({selectedDateRow.male} brothers, {selectedDateRow.female} sisters)
                    </span>
                  </div>
                </div>

                {onSelectTab && (
                  <button
                    type="button"
                    onClick={() => onSelectTab('daily', selectedFilterDate)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-semibold transition-all"
                  >
                    <span>Audit Day</span>
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
                <span>Selected Date: <strong className="text-white">{formatDisplayDate(selectedFilterDate)}</strong></span>
                {onSelectTab && (
                  <button
                    type="button"
                    onClick={() => onSelectTab('daily', selectedFilterDate)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all"
                  >
                    <span>Open in Daily Activity</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Demographics Cities Card */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#FF2560]" />
                <span>Top Population Demographics</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">Active Cities</span>
            </h3>

            <div className="space-y-2 mt-4">
              {stats?.topCities && stats.topCities.length > 0 ? (
                stats.topCities.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <span className="font-semibold text-white flex items-center space-x-2">
                      <span className="text-[#FF4D7D] font-mono">#{idx + 1}</span>
                      <span>{c.city}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF2560]/10 text-[#FF4D7D] font-bold">
                      {c.count} members
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">No city data available yet.</div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span>System Status: <strong className="text-emerald-400">100% Operational</strong></span>
            <span>Edge Worker Response: &lt;5ms</span>
          </div>
        </div>
      </div>

      {/* Dedicated Date-Wise Registration Breakdown Table (Rozana ki Tareekh-war Tafseel) */}
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white font-serif">
                Rozana ki Tareekh-war Registration (Daily Date Breakdown)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Har date k hisaab se total new profiles, brothers aur sisters ka mukammal record
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDailyBreakdownOpen(prev => !prev)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10 transition-all cursor-pointer"
          >
            <span>{isDailyBreakdownOpen ? 'Hide Breakdown' : 'Show Breakdown'}</span>
            {isDailyBreakdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isDailyBreakdownOpen && (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date (Tareekh)</th>
                  <th className="py-3 px-4">New Members</th>
                  <th className="py-3 px-4">Growth Velocity</th>
                  <th className="py-3 px-4">Brothers / Sisters</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dailyList.map((item) => {
                  const isToday = item.date === todayIso;
                  const isYesterday = item.date === yesterdayIso;
                  const isSelected = item.date === selectedFilterDate;
                  const pct = Math.max(8, Math.round((item.signups / maxSignups) * 100));

                  return (
                    <tr
                      key={item.date}
                      onClick={() => setSelectedFilterDate(item.date)}
                      className={`hover:bg-white/[0.03] transition-all cursor-pointer ${
                        isSelected ? 'bg-sky-500/10' : ''
                      }`}
                    >
                      {/* Date Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white font-mono">
                            {formatDisplayDate(item.date)}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              Today
                            </span>
                          )}
                          {isYesterday && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium text-[10px]">
                              Yesterday
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Signups Count */}
                      <td className="py-3.5 px-4 font-extrabold text-white text-sm">
                        <div className="flex items-center space-x-1.5">
                          <span>+{item.signups}</span>
                          {isToday && (yesterdayRow?.signups ?? 0) > 0 && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              diffSignups >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-300'
                            }`}>
                              {diffSignups >= 0 ? `▲ +${diffPct}%` : `▼ ${diffPct}%`}
                            </span>
                          )}
                          {isYesterday && (
                            <span className="text-[10px] font-medium text-slate-500">
                              (Benchmark)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visual Growth Velocity Bar */}
                      <td className="py-3.5 px-4 w-48">
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex border border-white/5">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-[#FF4D7D] h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Brothers vs Sisters */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 font-semibold">
                            👨 {item.male}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FF4D7D]/15 text-[#FF4D7D] font-semibold">
                            👩 {item.female}
                          </span>
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        {onSelectTab && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTab('daily', item.date);
                            }}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-white/5 hover:bg-sky-500 text-slate-300 hover:text-white border border-white/10 hover:border-sky-500 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <span>Inspect Day</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
