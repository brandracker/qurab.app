import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { AddWaliModal } from './AddWaliModal';
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
  const [showWaliModal, setShowWaliModal] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  const handleToggleBlur = () => {
    const nextVal = !blurPhotos;
    setBlurPhotos(nextVal);
    const updated = { ...currentUser, blurPhotosByDefault: nextVal };
    setCurrentUser(updated);
    dbService.updatePrivacy(nextVal, profileVisibility);
    if (onUpdateUser) onUpdateUser(updated);
    showNotice();
  };

  const handleSaveWali = (waliData: { name: string; phone: string; relationship: string }) => {
    dbService.addWali(waliData);
    const updated = { ...currentUser, wali: { ...waliData, isVerified: true } };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-surface-variant/30 z-10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Settings & Privacy</h1>
          <p className="text-xs text-secondary">Manage your halal preferences and security</p>
        </div>
        {savedNotice && (
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full animate-fade-in">
            Saved!
          </span>
        )}
      </header>

      {/* Main Settings Body */}
      <main className="p-6 space-y-6">
        {/* Account Summary Card */}
        <section className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/15 text-primary flex items-center justify-center font-serif text-xl font-bold border border-primary/20 shrink-0">
            {currentUser.photos && currentUser.photos.length > 0 && currentUser.photos[0] ? (
              <img src={currentUser.photos[0]} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-base text-on-surface truncate">{currentUser.fullName || 'Member'}</h3>
            <p className="text-xs text-secondary truncate">{currentUser.email || currentUser.phone || 'Account Active'}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              Account ID: {currentUser.id}
            </span>
          </div>
        </section>

        {/* Privacy & Modesty Section */}
        <section className="space-y-3">
          <h2 className="font-serif text-base font-bold text-on-surface">Islamic Modesty & Privacy</h2>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 space-y-4 divide-y divide-outline-variant/20">
            {/* Photo Blur */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-semibold text-sm text-on-surface block">Blur My Photos</span>
                <span className="text-xs text-on-surface-variant">
                  Protect facial modesty in Discover until a mutual match or request approval.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleBlur}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  blurPhotos ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                    blurPhotos ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-semibold text-sm text-on-surface block">Profile Visibility</span>
                <span className="text-xs text-on-surface-variant">
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
                className="bg-surface border border-outline-variant rounded-xl py-1.5 px-3 text-xs font-sans text-on-surface outline-none focus:border-primary"
              >
                <option value="all_users">All Verified Users</option>
                <option value="approved_only">Approved Matches Only</option>
                <option value="hidden">Hidden / Paused</option>
              </select>
            </div>
          </div>
        </section>

        {/* Wali / Guardian Section */}
        <section className="space-y-3">
          <h2 className="font-serif text-base font-bold text-on-surface">Family & Wali Involvement</h2>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
            {currentUser.wali ? (
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-on-surface">{currentUser.wali.name}</h4>
                    <p className="text-xs text-secondary">{currentUser.wali.relationship} · {currentUser.wali.phone}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Chaperone Portal Active
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWaliModal(true)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">group_add</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-on-surface">Add a Guardian / Wali</h4>
                    <p className="text-xs text-secondary max-w-[200px]">
                      Invite a father, brother, or guardian to view matches and participate with full transparency.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWaliModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shrink-0"
                >
                  Add Wali
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Membership & Subscription Status Section */}
        <section className="space-y-3">
          <h2 className="font-serif text-base font-bold text-on-surface">Membership & Daily Limits</h2>

          <div className="bg-gradient-to-br from-primary/15 via-surface-container-low to-tertiary-container/20 rounded-2xl p-4 border border-primary/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm text-on-surface">
                      {isVip ? 'Barakah VIP Active' : 'Free Tier Member'}
                    </h3>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                      isVip ? 'bg-primary text-white' : 'bg-surface text-secondary border border-surface-variant/50'
                    }`}>
                      {isVip ? 'VIP' : 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {isVip 
                      ? 'Unlimited Discover Likes · 100% Ad-Free' 
                      : '50 Free Discover Likes / day · Unlimited Free Chat'}
                  </p>
                </div>
              </div>

              {!isVip && (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">upgrade</span>
                  <span>Upgrade</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-variant/20 text-xs">
              <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                <div>
                  <span className="text-[10px] text-secondary block">Likes Quota</span>
                  <strong className="text-[11px] text-on-surface">
                    {isVip ? 'Unlimited' : '50 Likes / Day'}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface border border-surface-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
                <div>
                  <span className="text-[10px] text-secondary block">Mutual Messaging</span>
                  <strong className="text-[11px] text-primary">100% Free</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Halal Guidelines Notice */}
        <section className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <h4 className="font-serif font-bold text-xs">Halal Matrimony Code of Conduct</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Serene Union is designed for sincere, faith-first marriage intentions. Inappropriate behavior, disrespect, or harassment will result in permanent account removal to protect our community.
          </p>
        </section>
      </main>

      {/* Add Wali Modal */}
      {showWaliModal && (
        <AddWaliModal
          onClose={() => setShowWaliModal(false)}
          onSave={handleSaveWali}
        />
      )}

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
