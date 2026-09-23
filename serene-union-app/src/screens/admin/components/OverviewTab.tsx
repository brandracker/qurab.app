import React from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Crown, 
  RefreshCw, 
  MapPin 
} from 'lucide-react';
import type { DashboardStats } from '../types';

interface OverviewTabProps {
  stats: DashboardStats | null;
  onRefresh: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, onRefresh }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">Platform Health & Demographics</h2>
          <p className="text-xs text-slate-400 mt-1">Live operational statistics & growth velocity</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Real-Time Data</span>
        </button>
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

        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Barakah VIP</span>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-4xl font-extrabold text-white font-serif">{stats?.vipSubscribers ?? '—'}</div>
          <div className="text-xs text-slate-400 mt-3">
            Active premium subscribers
          </div>
        </div>
      </div>

      {/* Visual Gender Balance & Growth Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Ratio Card */}
        <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl">
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

          {/* Growth Periods */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Today</div>
              <div className="text-xl font-bold text-white mt-1">+{stats?.growth?.today ?? 0}</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Last 7 Days</div>
              <div className="text-xl font-bold text-white mt-1">+{stats?.growth?.thisWeek ?? 0}</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Last 30 Days</div>
              <div className="text-xl font-bold text-white mt-1">+{stats?.growth?.thisMonth ?? 0}</div>
            </div>
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
    </div>
  );
};
