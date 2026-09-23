import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import type { CandidatePhoto } from '../types';

interface PhotoModerationTabProps {
  photos: CandidatePhoto[];
  photoGenderFilter: string;
  isLoading: boolean;
  onGenderFilterChange: (gender: string) => void;
  onRefresh: () => void;
  onInspectUser: (userId: string) => void;
  onDeletePhoto: (photoId: string) => void;
}

export const PhotoModerationTab: React.FC<PhotoModerationTabProps> = ({
  photos,
  photoGenderFilter,
  isLoading,
  onGenderFilterChange,
  onRefresh,
  onInspectUser,
  onDeletePhoto
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">Photo Compliance Moderation</h2>
          <p className="text-xs text-slate-400 mt-1">Review member photos with full candidate context & profile viewer</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={photoGenderFilter}
            onChange={(e) => onGenderFilterChange(e.target.value)}
            className="bg-[#0F172A] border border-white/10 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="">All Genders</option>
            <option value="male">Brothers Only</option>
            <option value="female">Sisters Only</option>
          </select>

          <button
            onClick={onRefresh}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            {isLoading ? 'Loading photo moderation queue...' : 'No photos pending review.'}
          </div>
        ) : (
          photos.map((p) => (
            <div key={p.id} className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col group">
              <div 
                onClick={() => p.user_id && onInspectUser(p.user_id)}
                className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden cursor-pointer"
                title="Click to inspect user's profile card"
              >
                <img src={p.photo_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.is_primary ? (
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF2560] text-white shadow">
                    Primary
                  </span>
                ) : null}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div 
                    onClick={() => p.user_id && onInspectUser(p.user_id)}
                    className="text-xs font-semibold text-white truncate cursor-pointer hover:text-[#FF4D7D] transition-colors"
                  >
                    {p.full_name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.city || p.gender}</div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <button
                    onClick={() => p.user_id && onInspectUser(p.user_id)}
                    className="w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-semibold flex items-center justify-center cursor-pointer"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => onDeletePhoto(p.id)}
                    className="w-full py-1 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
