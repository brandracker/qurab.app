import React from 'react';
import { Megaphone, LogOut } from 'lucide-react';
import type { AdminProfile } from '../types';

interface AdminHeaderProps {
  adminProfile: AdminProfile | null;
  onOpenBroadcast: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminProfile,
  onOpenBroadcast,
  onLogout
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2560] to-[#FF4D7D] flex items-center justify-center font-serif font-black text-white text-lg shadow-lg shadow-[#FF2560]/30">
          Q
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide text-base font-serif">Qurb Admin</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF2560]/15 text-[#FF4D7D] border border-[#FF2560]/30">
              Enterprise Node
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Pure Halal Matrimonial Administration</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenBroadcast}
          className="px-3 py-1.5 rounded-xl bg-[#FF2560]/20 hover:bg-[#FF2560]/30 text-rose-200 border border-[#FF2560]/40 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Megaphone className="w-3.5 h-3.5 text-[#FF2560]" />
          <span className="hidden sm:inline">Broadcast</span>
        </button>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-white">{adminProfile?.name || 'Administrator'}</div>
          <div className="text-[10px] text-[#FF4D7D] uppercase tracking-wider font-semibold">
            {adminProfile?.role || 'Superadmin'}
          </div>
        </div>

        <button
          id="admin-logout-btn"
          onClick={onLogout}
          className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2560]/20 text-slate-300 hover:text-[#FF4D7D] border border-white/10 transition-colors flex items-center space-x-1.5 text-xs cursor-pointer"
          title="Logout Session"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline font-medium">Exit</span>
        </button>
      </div>
    </header>
  );
};
