import React from 'react';
import { X, Crown, Star, Trash2 } from 'lucide-react';
import type { CandidateUser, CandidatePhoto } from '../types';

interface UserInspectModalProps {
  user: CandidateUser | null;
  userPhotos: CandidatePhoto[];
  onClose: () => void;
  onSetPrimaryPhoto: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onToggleVip: (userId: string, currentVip: boolean) => void;
  onToggleBan: (userId: string, currentStatus: string, currentBanned: boolean) => void;
}

export const UserInspectModal: React.FC<UserInspectModalProps> = ({
  user,
  userPhotos,
  onClose,
  onSetPrimaryPhoto,
  onDeletePhoto,
  onToggleVip,
  onToggleBan
}) => {
  if (!user) return null;

  const isBanned = user.account_status === 'banned' || Boolean(user.is_banned);
  const isVip = Boolean(user.is_vip);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white font-serif">{user.full_name}</h3>
            {isVip && <Crown className="w-4 h-4 text-amber-400" />}
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Picture Arrangement Gallery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Uploaded Photos Gallery ({userPhotos.length})
            </h4>
            <span className="text-[11px] text-slate-400">Click star to set Primary Discover cover</span>
          </div>

          {userPhotos.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-500">
              No photos uploaded by this candidate.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {userPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group bg-slate-900 shadow-md">
                  <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                  
                  {/* Primary badge */}
                  {photo.is_primary ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#FF2560] text-white text-[10px] font-bold shadow">
                      Primary
                    </span>
                  ) : null}

                  {/* Photo Arrangement Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    {!photo.is_primary && (
                      <button
                        onClick={() => onSetPrimaryPhoto(photo.id)}
                        className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                        title="Set as Primary Cover"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeletePhoto(photo.id)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
                      title="Delete Inappropriate Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Biodata Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 pt-4 border-t border-white/10">
          <div><span className="text-slate-500">Gender:</span> <strong className="text-white capitalize ml-1">{user.gender}</strong></div>
          <div><span className="text-slate-500">Location:</span> <strong className="text-white ml-1">{user.city || user.location}</strong></div>
          <div><span className="text-slate-500">Email:</span> <span className="text-slate-300 ml-1">{user.email || '—'}</span></div>
          <div><span className="text-slate-500">Phone:</span> <span className="text-slate-300 ml-1">{user.phone || '—'}</span></div>
          <div><span className="text-slate-500">Profession:</span> <span className="text-white ml-1">{user.profession || '—'}</span></div>
          <div><span className="text-slate-500">Education:</span> <span className="text-white ml-1">{user.education || '—'}</span></div>
          <div><span className="text-slate-500">Sect:</span> <span className="text-white ml-1">{user.sect || '—'}</span></div>
          <div><span className="text-slate-500">Marital Status:</span> <span className="text-white ml-1">{user.marital_status || '—'}</span></div>
        </div>

        {user.about_me || user.bio ? (
          <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">About Me / Bio</div>
            <p className="italic text-slate-300 leading-relaxed">"{user.about_me || user.bio}"</p>
          </div>
        ) : null}

        {/* Actions Footer inside Modal */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleVip(user.id, isVip)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                isVip 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {isVip ? '★ Remove VIP' : '★ Grant VIP'}
            </button>

            <button
              onClick={() => onToggleBan(user.id, user.account_status, isBanned)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                isBanned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#FF2560]/20 text-rose-300 border-[#FF2560]/40'
              }`}
            >
              {isBanned ? 'Unban Account' : 'Ban Account'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
