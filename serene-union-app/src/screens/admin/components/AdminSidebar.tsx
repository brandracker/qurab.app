import React from 'react';
import { Activity, Radio, Calendar, Users, Image as ImageIcon, Database, Gift, Megaphone, Crown } from 'lucide-react';
import type { AdminTab } from '../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#0B101E] p-4 flex md:flex-col justify-between">
      <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 overflow-x-auto w-full">
        <button
          onClick={() => onSelectTab('overview')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#FF2560] to-[#D8134B] text-white shadow-lg shadow-[#FF2560]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview & Metrics</span>
        </button>

        <button
          onClick={() => onSelectTab('daily')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Daily Activity</span>
        </button>

        <button
          onClick={() => onSelectTab('live')}
          className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-lg shadow-sky-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span>Live Monitor & Chats</span>
          </div>
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
            Live
          </span>
        </button>

        <button
          onClick={() => onSelectTab('announcements')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white shadow-lg shadow-amber-500/25'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Broadcast & Banners</span>
        </button>

        <button
          onClick={() => onSelectTab('subscriptions')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Subscriptions & IAP</span>
        </button>

        <button
          onClick={() => onSelectTab('users')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-[#FF2560] to-[#D8134B] text-white shadow-lg shadow-[#FF2560]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory</span>
        </button>

        <button
          onClick={() => onSelectTab('photos')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-[#FF2560] to-[#D8134B] text-white shadow-lg shadow-[#FF2560]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photo Moderation</span>
        </button>

        <button
          onClick={() => onSelectTab('seeds')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'seeds'
              ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white shadow-lg shadow-[#059669]/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Seed Profiles (65)</span>
        </button>

        <button
          onClick={() => onSelectTab('referrals')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Invites & Referrals</span>
        </button>
      </div>

      <div className="hidden md:block p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-500">
        <div className="text-white font-medium">Qurb Matrimony Edge</div>
        <div className="mt-0.5 text-slate-400">High-Scale Cloudflare D1 Node</div>
      </div>
    </aside>
  );
};
