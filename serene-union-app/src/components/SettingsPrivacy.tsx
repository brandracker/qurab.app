import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import type { UserProfile } from '../types';

interface Props {
  currentUser?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const SettingsPrivacy: React.FC<Props> = ({ currentUser: propUser, onUpdateUser }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => propUser || dbService.getCurrentUser());
  const [blurPhotos, setBlurPhotos] = useState<boolean>(currentUser.blurPhotosByDefault ?? true);
  const [profileVisibility, setProfileVisibility] = useState<string>(currentUser.profileVisibility || 'all_users');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  useEffect(() => {
    setIsVip(Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip));
    
    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => window.removeEventListener('serene_vip_updated', handleVipUpdate);
  }, [currentUser.id, currentUser.isVip]);

  const handleToggleBlur = () => {
    const nextVal = !blurPhotos;
    setBlurPhotos(nextVal);
    const updated = { ...currentUser, blurPhotosByDefault: nextVal };
    setCurrentUser(updated);
    dbService.updatePrivacy(nextVal, profileVisibility);
    if (onUpdateUser) onUpdateUser(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 bg-surface/90 backdrop-blur-xl px-5 py-3.5 border-b border-surface-variant/40 z-10 flex items-center justify-between shadow-2xs">
        <div>
          <h1 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
            <span>Settings & Privacy</span>
            <span className="font-arabic text-primary text-sm font-bold">قُرب</span>
          </h1>
          <p className="text-xs text-secondary">Manage your halal preferences and security</p>
        </div>
        {savedNotice && (
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full animate-fade-in shadow-2xs">
            Saved!
          </span>
        )}
      </header>

      {/* Main Settings Body */}
      <main className="p-4 sm:p-6 space-y-5">
        {/* Account Summary Card */}
        <section className="bg-surface rounded-2xl p-4 border border-surface-variant/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-serif text-xl font-bold border border-primary/20 shrink-0 shadow-emerald">
            {currentUser.photos && currentUser.photos.length > 0 && currentUser.photos[0] ? (
              <img src={currentUser.photos[0]} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-base text-on-surface truncate">{currentUser.fullName || 'Member'}</h3>
            <p className="text-xs text-secondary truncate">{currentUser.email || currentUser.phone || 'Account Active'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              Account ID: {currentUser.id}
            </span>
          </div>
        </section>

        {/* Privacy & Modesty Section */}
        <section className="space-y-2.5">
          <h2 className="font-serif text-sm font-bold text-on-surface">Islamic Modesty & Privacy</h2>

          <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 shadow-2xs space-y-4 divide-y divide-surface-variant/40">
            {/* Photo Blur */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-bold text-xs text-on-surface block">Blur My Photos</span>
                <span className="text-[11px] text-secondary leading-relaxed">
                  Protect facial modesty in Discover until a mutual match or approved request.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleBlur}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 shadow-xs ${
                  blurPhotos ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                    blurPhotos ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-bold text-xs text-on-surface block">Profile Visibility</span>
                <span className="text-[11px] text-secondary leading-relaxed">
                  Control who can discover your matrimonial profile.
                </span>
              </div>
              <select
                value={profileVisibility}
                onChange={(e) => {
                  setProfileVisibility(e.target.value);
                  dbService.updatePrivacy(blurPhotos, e.target.value);
                  showNotice();
                }}
                className="bg-surface border border-surface-variant/80 rounded-xl py-1.5 px-3 text-xs font-sans text-on-surface outline-none focus:border-primary shadow-2xs"
              >
                <option value="all_users">All Verified Users</option>
                <option value="approved_only">Approved Matches Only</option>
                <option value="hidden">Hidden / Paused</option>
              </select>
            </div>
          </div>
        </section>

        {/* Membership & Subscription Status Section */}
        <section className="space-y-2.5">
          <h2 className="font-serif text-sm font-bold text-on-surface">Membership & Plan Privileges</h2>

          <div className="bg-gradient-to-br from-primary/10 via-surface to-accent-gold-light/25 rounded-3xl p-5 border border-primary/30 shadow-card flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center shadow-emerald">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm text-on-surface">
                      {isVip ? 'Barakah VIP Active' : 'Free Tier Member'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isVip ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs' : 'bg-surface text-secondary border border-surface-variant'
                    }`}>
                      {isVip ? '👑 VIP Member' : 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {isVip 
                      ? 'All Premium Features Unlocked (Google Play Billing)' 
                      : '50 Free Discover Likes / day · 100% Free Chat'}
                  </p>
                </div>
              </div>

              {!isVip ? (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold shadow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">upgrade</span>
                  <span>Upgrade</span>
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Active</span>
                </span>
              )}
            </div>

            {/* Grid of Key Quotas */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-variant/40 text-xs">
              <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/80 flex items-center gap-2.5 shadow-2xs">
                <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                <div>
                  <span className="text-[10px] text-secondary block">Likes Quota</span>
                  <strong className="text-[11px] text-on-surface">
                    {isVip ? 'Unlimited (No Cap)' : '50 Likes / Day'}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/80 flex items-center gap-2.5 shadow-2xs">
                <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
                <div>
                  <span className="text-[10px] text-secondary block">Mutual Messaging</span>
                  <strong className="text-[11px] text-primary">100% Free</strong>
                </div>
              </div>
            </div>

            {/* Unlocked VIP Privileges List */}
            <div className="pt-2 border-t border-surface-variant/40 space-y-2">
              <h4 className="font-serif font-bold text-[11px] text-primary uppercase tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>{isVip ? 'Your Active VIP Privileges:' : 'VIP Privileges Preview:'}</span>
              </h4>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-surface-variant/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">visibility</span>
                    <span className="text-on-surface font-medium">See Who Liked You (Unblurred)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Unlocked' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-surface-variant/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">block</span>
                    <span className="text-on-surface font-medium">100% Ad-Free (Zero Video Ads)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Active' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-surface-variant/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                    <span className="text-on-surface font-medium">Priority Stream Ranking (3x Views)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Active' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-surface-variant/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">all_inclusive</span>
                    <span className="text-on-surface font-medium">Unlimited Daily Likes (No 50 Cap)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Unlimited' : '50 / day'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Halal Guidelines Notice */}
        <section className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <h4 className="font-serif font-bold text-xs">Halal Matrimony Code of Conduct</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Qurab is designed for sincere, faith-first marriage intentions. Inappropriate behavior, disrespect, or harassment will result in permanent account removal to protect our community.
          </p>
        </section>
      </main>

      {/* Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${currentUser.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
};
export default SettingsPrivacy;

