import React from 'react';
import { Activity, Users, Image as ImageIcon } from 'lucide-react';
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
      </div>

      <div className="hidden md:block p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-500">
        <div className="text-white font-medium">Qurb Matrimony Edge</div>
        <div className="mt-0.5 text-slate-400">High-Scale Cloudflare D1 Node</div>
      </div>
    </aside>
  );
};
