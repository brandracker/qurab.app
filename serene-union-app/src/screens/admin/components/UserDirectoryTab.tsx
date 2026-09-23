import React from 'react';
import { 
  Search, 
  RefreshCw, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Crown, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import type { CandidateUser, CityStat } from '../types';

interface UserDirectoryTabProps {
  users: CandidateUser[];
  totalUsersCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  userSearch: string;
  genderFilter: string;
  cityFilter: string;
  statusFilter: string;
  membershipFilter: string;
  sortOrder: string;
  availableCities: CityStat[];
  onSearchChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onGenderChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onMembershipChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onPageSizeChange: (val: number) => void;
  onPageChange: (newPage: number) => void;
  onExportCSV: () => void;
  onRefresh: () => void;
  onInspectUser: (userId: string) => void;
  onToggleBan: (userId: string, currentStatus: string, currentBanned: boolean) => void;
  onToggleVip: (userId: string, currentVip: boolean) => void;
  isInspectingLoading: boolean;
}

export const UserDirectoryTab: React.FC<UserDirectoryTabProps> = ({
  users,
  totalUsersCount,
  totalPages,
  currentPage,
  pageSize,
  isLoading,
  userSearch,
  genderFilter,
  cityFilter,
  statusFilter,
  membershipFilter,
  sortOrder,
  availableCities,
  onSearchChange,
  onCityChange,
  onGenderChange,
  onStatusChange,
  onMembershipChange,
  onSortChange,
  onPageSizeChange,
  onPageChange,
  onExportCSV,
  onRefresh,
  onInspectUser,
  onToggleBan,
  onToggleVip,
  isInspectingLoading
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">User Directory & Scale Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing {users.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0}–{Math.min(currentPage * pageSize, totalUsersCount)} of {totalUsersCount} registered candidates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onRefresh}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Multi-Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, phone, bio..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF2560]/50"
          />
        </div>

        {/* Dynamic Cities Dropdown */}
        <select
          value={cityFilter}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Cities</option>
          {availableCities.map((c) => (
            <option key={c.city} value={c.city}>
              {c.city} ({c.count})
            </option>
          ))}
        </select>

        <select
          value={genderFilter}
          onChange={(e) => onGenderChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Genders</option>
          <option value="male">Brothers</option>
          <option value="female">Sisters</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>

        <select
          value={membershipFilter}
          onChange={(e) => onMembershipChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Memberships</option>
          <option value="vip">Barakah VIP</option>
          <option value="free">Standard</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name_asc">Name (A-Z)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0A0F1D] text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">User & Photos</th>
                <th className="px-6 py-4">Gender & City</th>
                <th className="px-6 py-4">Profession</th>
                <th className="px-6 py-4">Membership</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {isLoading ? 'Fetching candidates from Cloudflare D1...' : 'No users match the criteria.'}
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isBanned = u.account_status === 'banned' || Boolean(u.is_banned);
                  const isVip = Boolean(u.is_vip);

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="relative w-11 h-11 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10 shadow">
                            {u.primary_photo ? (
                              <img src={u.primary_photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold font-serif">
                                {u.full_name?.slice(0, 1) || 'U'}
                              </div>
                            )}
                            {isVip && (
                              <div className="absolute top-0 right-0 bg-amber-500 p-0.5 rounded-bl-lg">
                                <Crown className="w-2.5 h-2.5 text-black" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center space-x-1.5">
                              <span>{u.full_name}</span>
                              {isVip && <span className="text-[10px] text-amber-400 font-bold">★ VIP</span>}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{u.email || u.phone}</div>
                            <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                              <span>ID: {u.id?.slice(0, 10)}...</span>
                              <span>•</span>
                              <span className="text-[10px] text-slate-500">{u.photo_count || 0} pics</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold mr-2 ${
                          u.gender === 'female' ? 'bg-[#FF2560]/15 text-[#FF4D7D] border border-[#FF2560]/30' : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}>
                          {u.gender}
                        </span>
                        <span className="text-slate-400 text-xs">{u.city || u.location || 'Global'}</span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-300">
                        {u.profession || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => onToggleVip(u.id, isVip)}
                          className={`text-xs px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                            isVip
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isVip ? 'Barakah VIP' : 'Standard'}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
                          isBanned
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isBanned ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{isBanned ? 'Banned' : 'Active'}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => onInspectUser(u.id)}
                          disabled={isInspectingLoading}
                          className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 text-slate-300 font-semibold cursor-pointer"
                        >
                          {isInspectingLoading ? 'Loading...' : 'Inspect & Photos'}
                        </button>

                        <button
                          onClick={() => onToggleBan(u.id, u.account_status, Boolean(u.is_banned))}
                          className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                            isBanned
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                              : 'bg-[#FF2560]/20 text-rose-300 hover:bg-[#FF2560]/30 border border-[#FF2560]/30'
                          }`}
                        >
                          {isBanned ? 'Unban' : 'Ban User'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="px-6 py-4 bg-[#0B101E] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[#0F172A] border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-semibold text-white px-2">
              {currentPage}
            </span>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
