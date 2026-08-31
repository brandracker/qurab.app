import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { CompatibilityQuizModal } from '../components/CompatibilityQuizModal';
import { MembershipUpgradeModal } from '../components/MembershipUpgradeModal';
import { RewardedAdModal } from '../components/RewardedAdModal';

interface Props {
  user: UserProfile;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export const MyProfileScreen: React.FC<Props> = ({ user, onEditProfile, onLogout }) => {
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam' | 'messages' | 'photo_unblur'>('likes');
  const [isVip, setIsVip] = useState<boolean>(false);

  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_quiz_${user.id}`));
  });
  const rel = user.religiousProfile;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-background font-sans pb-28">
      {/* Top Header */}
      <header className="sticky top-0 bg-surface/90 backdrop-blur-md px-6 py-4 border-b border-surface-variant/30 flex items-center justify-between z-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">My Profile</h1>
          <p className="text-xs text-secondary">Your live matrimonial profile</p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-xs text-error font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Logout</span>
          </button>
        )}
      </header>

      {/* Main Profile Body */}
      <main className="p-6 space-y-6">
        {/* WALLET & GOOGLE PLAY MEMBERSHIP PASS CARD */}
        <div className="bg-gradient-to-br from-primary/15 via-surface to-tertiary-container/20 rounded-3xl p-5 border border-primary/30 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span>{isVip ? 'Barakah VIP Active' : 'Free Member'}</span>
                  {isVip && <span className="bg-primary text-white text-[9px] px-1.5 py-0.2 rounded font-bold">VIP</span>}
                </h3>
                <p className="text-[11px] text-secondary">
                  {isVip ? 'Unlimited Discover Likes · 100% Ad-Free' : '50 Free Discover Likes / day · Free Chat'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-full shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Upgrade</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-variant/30 text-xs">
            <button
              onClick={() => {
                setAdRewardType('likes');
                setShowAdModal(true);
              }}
              className="p-2.5 rounded-xl bg-surface border border-surface-variant/40 hover:bg-surface-container-low text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">smart_display</span>
              <div>
                <strong className="block text-[11px] text-on-surface">+10 Extra Likes</strong>
                <span className="text-[9px] text-secondary">Watch 15s ad</span>
              </div>
            </button>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="p-2.5 rounded-xl bg-surface border border-primary/30 hover:bg-primary/5 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
              <div>
                <strong className="block text-[11px] text-primary">Barakah VIP</strong>
                <span className="text-[9px] text-secondary">PKR 830 / mo</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest flex flex-col">
          {/* Main Photo Banner */}
          <div className="relative w-full h-80 bg-surface-container-high overflow-hidden">
            {user.photos && user.photos.length > 0 && user.photos[0] ? (
              <img
                src={user.photos[0]}
                alt={user.fullName}
                className={`w-full h-full object-cover transition-all ${user.blurPhotosByDefault ? 'filter blur-md scale-110' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-5xl mb-2">account_circle</span>
                <span className="text-xs">No profile photo uploaded</span>
              </div>
            )}
            
            {user.blurPhotosByDefault && user.photos && user.photos.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                  <span>Modesty Protection Active</span>
                </span>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-on-surface text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              <span>{user.location || 'Global'}</span>
            </div>
            
            {user.wali && (
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Wali Protected</span>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="p-6 space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {user.fullName}, {user.age || 28}
              </h2>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {rel?.sect || 'Sunni'} ({rel?.madhhab || 'Hanafi'}) · {user.profession || 'Professional'}
              </p>
            </div>

            {/* Photo Gallery Grid */}
            {user.photos && user.photos.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  My Photos ({user.photos.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {user.photos.map((p, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-surface-variant relative">
                      <img src={p} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1. Deen & Religious Routine */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-3">
              <h3 className="font-serif text-xs font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">mosque</span>
                <span>Deen & Religious Routine</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Daily Prayers</span>
                  <strong className="text-on-surface">{rel?.prayerFrequency || '5 times daily'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Quran Engagement</span>
                  <strong className="text-on-surface capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Modesty Style</span>
                  <strong className="text-on-surface capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Hajj / Umrah</span>
                  <strong className="text-on-surface capitalize">{rel?.hajjUmrahStatus || 'Planning'}</strong>
                </div>
              </div>
            </div>

            {/* 2. Family & Post-Marriage Living */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-variant/30 space-y-3">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">home</span>
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Post-Marriage Living</span>
                  <strong className="text-primary capitalize">{user.livingPreference?.replace('_', ' ') || 'Independent'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Family Structure</span>
                  <strong className="text-on-surface capitalize">{user.familyStructure || 'Nuclear'} ({user.siblingsCount ?? 2} Siblings)</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Relocation</span>
                  <strong className="text-on-surface capitalize">{user.willingnessToRelocate?.replace('_', ' ') || 'Open'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/40">
                  <span className="text-[10px] text-secondary font-medium block">Smoking Status</span>
                  <strong className="text-on-surface capitalize">{user.smokingStatus?.replace('_', ' ') || 'Non-Smoker'}</strong>
                </div>
              </div>
            </div>

            {/* 3. Career & Education */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-variant/30 space-y-2 text-xs">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Education & Career</h3>
              <p className="text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">school</span>
                <span>{user.education || 'Graduate'} {user.university ? `· ${user.university}` : ''}</span>
              </p>
              <p className="text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">work</span>
                <span>{user.profession || 'Professional'}</span>
              </p>
              <p className="text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">translate</span>
                <span>Languages: {user.languagesSpoken || 'English, Urdu'}</span>
              </p>
            </div>

            {/* 4. About My Deen */}
            <div className="bg-surface-container-high rounded-2xl p-4 space-y-1">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">mosque</span>
                <span>About My Deen</span>
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {user.bio || rel?.deenRelationshipBio || "Seeking a righteous spouse to complete half our deen in harmony and mutual respect."}
              </p>
            </div>
          </div>
        </div>

        {/* 20-Questions Values Alignment Card */}
        <div className="bg-gradient-to-r from-primary/10 to-tertiary-container/20 p-5 rounded-3xl border border-primary/20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-on-surface">Islamic Values Questionnaire</h3>
              <p className="text-[11px] text-secondary">20 Guided Scenarios on Deen, Finance, Family & Lifestyle</p>
            </div>
          </div>
          <button
            onClick={() => setShowQuizModal(true)}
            className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>{hasCompletedQuiz ? 'Update 20-Questions Answers' : 'Take Compatibility Quiz (20 Qs)'}</span>
          </button>
        </div>

        {/* Action Button */}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="w-full py-3.5 rounded-full border border-primary text-primary font-sans text-xs font-semibold hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profile Details</span>
          </button>
        )}
      </main>

      {/* Google Play Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={user.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly') setIsVip(true);
          }}
          onWatchAdClicked={() => {
            setAdRewardType('likes');
            setShowAdModal(true);
          }}
        />
      )}

      {/* Rewarded Video Ad Modal */}
      {showAdModal && (
        <RewardedAdModal
          userId={user.id}
          rewardType={adRewardType}
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onRewardClaimed={() => {}}
        />
      )}

      {/* Compatibility Quiz Modal */}
      {showQuizModal && (
        <CompatibilityQuizModal
          userId={user.id}
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          onCompleted={() => setHasCompletedQuiz(true)}
        />
      )}
    </div>
  );
};
