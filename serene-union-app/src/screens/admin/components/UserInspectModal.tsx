import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Star, 
  Trash2, 
  ShieldAlert, 
  Heart, 
  Sparkles, 
  UserCheck, 
  Coins,
  RefreshCw 
} from 'lucide-react';
import type { CandidateUser, CandidatePhoto } from '../types';

interface UserInspectModalProps {
  user: CandidateUser | null;
  userPhotos: CandidatePhoto[];
  onClose: () => void;
  onSetPrimaryPhoto: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onToggleVip: (userId: string, currentVip: boolean) => void;
  onToggleBan: (userId: string, currentStatus: string, currentBanned: boolean) => void;
  onChangeGender?: (userId: string, targetGender: string) => void;
  onRemoveUser?: (userId: string, permanent: boolean) => void;
  onOpenSubscription?: () => void;
}

export const UserInspectModal: React.FC<UserInspectModalProps> = ({
  user,
  userPhotos,
  onClose,
  onSetPrimaryPhoto,
  onDeletePhoto,
  onToggleVip,
  onToggleBan,
  onChangeGender,
  onRemoveUser,
  onOpenSubscription
}) => {
  const [confirmBanModal, setConfirmBanModal] = useState<boolean>(false);
  const [confirmGenderModal, setConfirmGenderModal] = useState<boolean>(false);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState<boolean>(false);

  if (!user) return null;

  const isBanned = user.account_status === 'banned' || Boolean(user.is_banned);
  const isVip = Boolean(user.is_vip);
  const currentGender = (user.gender || 'male').toLowerCase();
  const targetGender = currentGender === 'male' ? 'female' : 'male';

  // Calculate age from dob if age is missing
  let displayAge = user.age;
  if (!displayAge && user.dob) {
    const birthYear = new Date(user.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (!isNaN(birthYear) && birthYear > 1900) {
      displayAge = currentYear - birthYear;
    }
  }

  // Religious Profile resolution (from religious_profile object or root fallback)
  const religious = user.religious_profile;
  const sect = religious?.sect || user.sect || 'Sunni';
  const madhhab = religious?.madhhab || 'Hanafi';
  const practiceLevel = religious?.practice_level || 'practicing';
  const prayerFrequency = religious?.prayer_frequency || '5 times daily';
  const halalDiet = religious?.halal_diet || 'Strictly Halal';
  const deenBio = religious?.deen_relationship_bio;

  // Wali details
  const wali = user.wali_details;

  // Wallet / Subscription
  const wallet = user.wallet;
  const salamsBalance = wallet?.direct_salams_balance ?? (isVip ? 20 : 2);

  const handleBanConfirm = () => {
    onToggleBan(user.id, user.account_status, isBanned);
    setConfirmBanModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
              <span>{user.full_name}</span>
              {displayAge ? <span className="text-sm font-sans font-normal text-slate-400">({displayAge} yrs)</span> : null}
            </h3>
            {isVip && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-bold uppercase">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Barakah VIP</span>
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
              isBanned 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isBanned ? 'Banned' : 'Active'}
            </span>
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
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center space-x-1.5">
              <span>Uploaded Photos Gallery ({userPhotos.length})</span>
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
        <div className="space-y-3 pt-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Personal Biodata & Contact</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div>
              <span className="text-slate-500 block text-[11px]">Gender:</span> 
              <div className="flex items-center space-x-2 mt-0.5">
                <strong className="text-white capitalize">{user.gender}</strong>
                {onChangeGender && (
                  <button
                    onClick={() => setConfirmGenderModal(true)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-semibold cursor-pointer transition-all flex items-center space-x-1"
                    title="Change user gender"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Change</span>
                  </button>
                )}
              </div>
            </div>
            <div><span className="text-slate-500 block text-[11px]">Location:</span> <strong className="text-white">{user.city || user.location || 'Global'}</strong></div>
            <div><span className="text-slate-500 block text-[11px]">Email:</span> <span className="text-slate-300 font-mono text-[11px] truncate block">{user.email || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Phone:</span> <span className="text-slate-300 font-mono text-[11px]">{user.phone || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Profession:</span> <span className="text-white">{user.profession || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Education:</span> <span className="text-white">{user.education || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Height:</span> <span className="text-white">{user.height || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Ethnicity:</span> <span className="text-white">{user.ethnicity || '—'}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Marriage Timeline:</span> <span className="text-white">{user.marriage_timeline ? user.marriage_timeline.replace(/_/g, ' ') : '—'}</span></div>
          </div>
        </div>

        {/* Deen & Religious Profile */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Deen & Religious Dossier</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 p-3.5 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl">
            <div><span className="text-slate-500 block text-[11px]">Practice Level:</span> <strong className="text-emerald-300 capitalize">{practiceLevel.replace(/_/g, ' ')}</strong></div>
            <div><span className="text-slate-500 block text-[11px]">Sect & Madhhab:</span> <strong className="text-white">{sect} ({madhhab})</strong></div>
            <div><span className="text-slate-500 block text-[11px]">Prayer:</span> <span className="text-white">{prayerFrequency}</span></div>
            <div><span className="text-slate-500 block text-[11px]">Diet:</span> <span className="text-white">{halalDiet}</span></div>
          </div>
          {deenBio && (
            <p className="text-xs text-slate-300 italic px-2">"{deenBio}"</p>
          )}
        </div>

        {/* Wali / Guardian Details (if present) */}
        {wali && wali.wali_name ? (
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Wali / Guardian Chaperone</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 p-3.5 bg-sky-500/[0.03] border border-sky-500/20 rounded-2xl">
              <div><span className="text-slate-500 block text-[11px]">Guardian Name:</span> <strong className="text-white">{wali.wali_name}</strong></div>
              <div><span className="text-slate-500 block text-[11px]">Relationship:</span> <strong className="text-sky-300">{wali.wali_relationship}</strong></div>
              <div><span className="text-slate-500 block text-[11px]">Phone:</span> <span className="font-mono text-slate-300">{wali.wali_phone}</span></div>
              <div>
                <span className="text-slate-500 block text-[11px]">Status:</span>
                <span className={`inline-block font-semibold ${wali.is_verified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {wali.is_verified ? '✓ Verified Chaperone' : '⏳ Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Wallet & Subscription Details */}
        <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white flex items-center space-x-1.5">
                <span>Tier: {isVip ? 'Barakah VIP Club' : 'Standard Free'}</span>
                {isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="text-[11px] text-slate-400">
                Direct Salams Balance: <span className="text-emerald-400 font-semibold">{salamsBalance}</span>
              </div>
            </div>
          </div>

          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold cursor-pointer transition-all text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manage Subscription</span>
            </button>
          )}
        </div>

        {/* Bio / About Me */}
        {user.about_me || user.bio ? (
          <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">About Me / Bio</div>
            <p className="italic text-slate-300 leading-relaxed">"{user.about_me || user.bio}"</p>
          </div>
        ) : null}

        {/* Confirmation Modal Overlay for Ban / Unban */}
        {confirmBanModal && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-300 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>{isBanned ? 'Confirm Account Unban' : 'Confirm Account Suspension'}</span>
            </div>
            <p className="text-slate-300">
              {isBanned 
                ? `Are you sure you want to unban ${user.full_name}? The user will regain full platform access.`
                : `Are you sure you want to ban ${user.full_name}? This will instantly revoke platform access and hide the profile from discovery.`}
            </p>
            <div className="flex items-center space-x-2 justify-end">
              <button
                onClick={() => setConfirmBanModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBanConfirm}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isBanned
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isBanned ? 'Confirm Unban' : 'Confirm Ban'}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal Overlay for Gender Change */}
        {confirmGenderModal && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <RefreshCw className="w-4 h-4" />
              <span>Confirm Gender Switch to {targetGender === 'female' ? 'Female (Sister)' : 'Male (Brother)'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Are you sure you want to change {user.full_name}'s gender from <strong className="capitalize text-white">{currentGender}</strong> to <strong className="capitalize text-white">{targetGender}</strong>?
              <span className="block mt-1 text-amber-400 font-medium">
                ⚠️ All prior likes, matches, and chats will be cleanly reset to preserve Islamic opposite-gender matching integrity.
              </span>
            </p>
            <div className="flex items-center space-x-2 justify-end">
              <button
                onClick={() => setConfirmGenderModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onChangeGender) onChangeGender(user.id, targetGender);
                  setConfirmGenderModal(false);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                Confirm Switch to {targetGender === 'female' ? 'Female' : 'Male'}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal Overlay for Remove User */}
        {confirmRemoveModal && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-300 font-bold">
              <Trash2 className="w-4 h-4" />
              <span>Remove User: {user.full_name}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Select removal type for this member:
              <span className="block mt-1 text-slate-400">
                • <strong>Deactivate (Soft Delete)</strong>: Safely hides the account, disables login, and preserves audit/billing integrity.
              </span>
              <span className="block mt-0.5 text-rose-400 font-medium">
                • <strong>Permanent Purge</strong>: Completely wipes this user and all related records from the database.
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                onClick={() => setConfirmRemoveModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onRemoveUser) onRemoveUser(user.id, false);
                  setConfirmRemoveModal(false);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
              >
                Deactivate (Soft Delete)
              </button>
              <button
                onClick={() => {
                  if (onRemoveUser) onRemoveUser(user.id, true);
                  setConfirmRemoveModal(false);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all bg-rose-500 hover:bg-rose-600 text-white"
              >
                Permanent Purge
              </button>
            </div>
          </div>
        )}

        {/* Actions Footer inside Modal */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => setConfirmBanModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                isBanned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#FF2560]/20 text-rose-300 border-[#FF2560]/40'
              }`}
            >
              {isBanned ? 'Unban Account' : 'Ban Account'}
            </button>

            {onChangeGender && (
              <button
                onClick={() => setConfirmGenderModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch to {targetGender === 'female' ? 'Female' : 'Male'}</span>
              </button>
            )}

            {onRemoveUser && (
              <button
                onClick={() => setConfirmRemoveModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove User</span>
              </button>
            )}
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
