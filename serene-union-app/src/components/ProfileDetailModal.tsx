import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { CompatibilityComparisonModal } from './CompatibilityComparisonModal';
import { dbService } from '../services/dbService';

interface Props {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onPass: (profileId: string) => void;
}

export const ProfileDetailModal: React.FC<Props> = ({ profile, isOpen, onClose, onLike, onPass }) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [isUnblurred, setIsUnblurred] = useState<boolean>(!profile.blurPhotosByDefault || Boolean(profile.photoRevealApproved));
  const [showCompatibilityModal, setShowCompatibilityModal] = useState<boolean>(false);
  const currentUser = dbService.getCurrentUser();

  if (!isOpen) return null;

  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'];

  const rel = profile.religiousProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-0 sm:p-4 font-sans select-none">
      <div className="w-full max-w-[480px] h-[92vh] sm:h-[88vh] bg-surface rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-surface-variant/80 flex flex-col overflow-hidden animate-slide-up relative">
        
        {/* Sticky Top Header */}
        <header className="sticky top-0 bg-surface/90 backdrop-blur-xl px-5 py-3 border-b border-surface-variant/40 flex items-center justify-between z-30 shadow-2xs">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif text-sm font-bold text-on-surface">
            <span>Matrimonial Profile</span>
            <span className="font-arabic text-primary text-xs font-bold">قُرب</span>
          </div>
          <button
            onClick={() => setIsUnblurred(!isUnblurred)}
            className="text-xs text-primary font-bold flex items-center gap-1 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isUnblurred ? 'visibility_off' : 'visibility'}
            </span>
            <span>{isUnblurred ? 'Blur' : 'Unblur'}</span>
          </button>
        </header>

        {/* Scrollable Profile Body */}
        <main className="flex-1 overflow-y-auto pb-28">
          {/* Main Photo Banner */}
          <div className="relative w-full h-96 bg-surface-variant overflow-hidden group">
            <img
              src={photos[selectedPhotoIdx]}
              alt={profile.fullName}
              className={`w-full h-full object-cover transition-all duration-300 ${
                !isUnblurred ? 'filter blur-xl scale-110 opacity-85' : 'scale-100'
              }`}
            />

            {/* Segmented Story Bars for Multiple Photos */}
            {photos.length > 1 && (
              <div className="absolute top-2.5 inset-x-4 flex items-center gap-1.5 z-20">
                {photos.map((_, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setSelectedPhotoIdx(pIdx)}
                    className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${
                      pIdx === selectedPhotoIdx
                        ? 'bg-white shadow'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Left / Right Photo Tap Controls */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIdx(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
                  aria-label="Previous Photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIdx(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
                  aria-label="Next Photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </>
            )}

            {!isUnblurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-xs pointer-events-none">
                <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-on-surface flex items-center gap-2 shadow-xs border border-surface-variant/60">
                  <span className="material-symbols-outlined text-[16px] text-accent-gold-dark">shield</span>
                  <span>Modesty Shield Active</span>
                </div>
              </div>
            )}
            <div className="absolute top-5 left-4 flex items-center gap-1.5 z-10">
              <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold text-white">
                <span className="material-symbols-outlined text-[14px] text-primary-light">location_on</span>
                <span>{profile.location || 'Global'}</span>
              </div>
              {photos.length > 1 && (
                <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                  <span>{selectedPhotoIdx + 1}/{photos.length}</span>
                </div>
              )}
            </div>

            {/* Top Right VIP or Wali Badge */}
            {profile.isVip ? (
              <div className="absolute top-5 right-4 bg-gradient-to-r from-amber-500 via-accent-gold to-amber-600 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg border border-amber-300/50 backdrop-blur-sm z-10 animate-pulse">
                <span className="material-symbols-outlined text-[14px] text-amber-200">workspace_premium</span>
                <span>VIP Member</span>
              </div>
            ) : profile.wali ? (
              <div className="absolute top-5 right-4 bg-primary/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold shadow-xs z-10">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                <span>Wali Verified</span>
              </div>
            ) : null}
          </div>

          {/* Photo Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 px-5 py-3 overflow-x-auto bg-surface-variant/40 border-b border-surface-variant/40">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`w-14 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all shadow-2xs ${
                    selectedPhotoIdx === idx ? 'border-primary scale-105 shadow-emerald' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={p} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Profile Core Header */}
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  {profile.fullName}, {profile.age}
                </h1>
                {profile.isVip && (
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-amber-300/40">
                    <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                    <span>VIP</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-primary font-bold mt-1">
                {rel?.sect || 'Sunni'} ({rel?.madhhab || 'Hanafi'}) · {profile.profession || 'Professional'}
              </p>
            </div>

            {/* Values Alignment Banner Button */}
            <button
              type="button"
              onClick={() => setShowCompatibilityModal(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-accent-gold-light/25 border border-primary/30 flex items-center justify-between text-left hover:brightness-105 transition-all shadow-card group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center shadow-emerald">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span>94% Islamic Values Match</span>
                    <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">High</span>
                  </h4>
                  <p className="text-[11px] text-secondary">Tap to view 4-Pillars alignment breakdown</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Quick Universal Badges Strip */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.ethnicity && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-semibold border border-primary/20">
                  {profile.ethnicity}
                </span>
              )}
              {profile.citizenship && (
                <span className="bg-surface border border-surface-variant/80 text-on-surface px-3 py-1 rounded-full text-[11px] font-semibold shadow-2xs">
                  {profile.citizenship}
                </span>
              )}
              {profile.maritalStatus && (
                <span className="bg-surface border border-surface-variant/80 text-on-surface px-3 py-1 rounded-full text-[11px] font-semibold shadow-2xs capitalize">
                  {profile.maritalStatus.replace('_', ' ')}
                </span>
              )}
              {profile.workArrangement && (
                <span className="bg-surface border border-surface-variant/80 text-on-surface px-3 py-1 rounded-full text-[11px] font-semibold shadow-2xs capitalize">
                  {profile.workArrangement.replace('_', ' ')}
                </span>
              )}
              {profile.incomeBracket && profile.incomeBracket !== 'undisclosed' && (
                <span className="bg-surface border border-surface-variant/80 text-on-surface px-3 py-1 rounded-full text-[11px] font-semibold shadow-2xs capitalize">
                  {profile.incomeBracket.replace('_', ' ')}
                </span>
              )}
            </div>

            {/* 1. Deen & Religious Practice */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-3 shadow-2xs">
              <h3 className="font-serif text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">mosque</span>
                <span>Deen & Religious Practice</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/80 shadow-2xs">
                  <span className="text-[10px] text-secondary font-medium block">Daily Prayers</span>
                  <strong className="text-on-surface">{rel?.prayerFrequency || '5 times daily'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/80 shadow-2xs">
                  <span className="text-[10px] text-secondary font-medium block">Quran Engagement</span>
                  <strong className="text-on-surface capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/80 shadow-2xs">
                  <span className="text-[10px] text-secondary font-medium block">Modesty & Attire</span>
                  <strong className="text-on-surface capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                </div>
                <div className="bg-surface p-2.5 rounded-xl border border-surface-variant/80 shadow-2xs">
                  <span className="text-[10px] text-secondary font-medium block">Dietary Standard</span>
                  <strong className="text-on-surface capitalize">{rel?.halalDiet || 'Strictly Halal'}</strong>
                </div>
              </div>
            </div>

            {/* 2. Interests & Personality Badges */}
            {((profile.hobbies && profile.hobbies.length > 0) || (profile.personalityTraits && profile.personalityTraits.length > 0)) && (
              <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 space-y-3 shadow-2xs">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">interests</span>
                  <span>Interests & Personality</span>
                </h3>
                
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1.5">Hobbies & Passions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.hobbies.map((h, i) => (
                        <span key={i} className="bg-surface-variant/60 px-2.5 py-1 rounded-full text-xs text-on-surface border border-surface-variant shadow-2xs font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.personalityTraits && profile.personalityTraits.length > 0 && (
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1.5">Personality Traits</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.personalityTraits.map((t, i) => (
                        <span key={i} className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Family Setup & Post-Marriage Living */}
            <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">home</span>
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface-variant/40 p-2.5 rounded-xl border border-surface-variant/60">
                  <span className="text-[10px] text-secondary font-medium block">Living Post-Marriage</span>
                  <strong className="text-on-surface capitalize text-primary">
                    {profile.livingPreference?.replace('_', ' ') || 'Independent'}
                  </strong>
                </div>
                <div className="bg-surface-variant/40 p-2.5 rounded-xl border border-surface-variant/60">
                  <span className="text-[10px] text-secondary font-medium block">Dual-Income Preference</span>
                  <strong className="text-on-surface capitalize">
                    {profile.dualIncomePreference?.replace('_', ' ') || 'Career Supportive'}
                  </strong>
                </div>
                <div className="bg-surface-variant/40 p-2.5 rounded-xl border border-surface-variant/60">
                  <span className="text-[10px] text-secondary font-medium block">Relocation Outlook</span>
                  <strong className="text-on-surface capitalize">
                    {profile.willingnessToRelocate?.replace('_', ' ') || 'Open'}
                  </strong>
                </div>
                <div className="bg-surface-variant/40 p-2.5 rounded-xl border border-surface-variant/60">
                  <span className="text-[10px] text-secondary font-medium block">Smoking & Habits</span>
                  <strong className="text-on-surface capitalize">
                    {profile.smokingStatus?.replace('_', ' ') || 'Non-Smoker'}
                  </strong>
                </div>
              </div>
            </div>

            {/* 4. Career, Education & Mahr Philosophy */}
            <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 space-y-2 text-xs shadow-2xs">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                <span>Education & Career Pedigree</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                  <span>{profile.education} {profile.university ? `· ${profile.university}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">work</span>
                  <span>{profile.profession} {profile.workArrangement ? `(${profile.workArrangement.toUpperCase()})` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">translate</span>
                  <span>Languages: {profile.languagesSpoken || 'English, Urdu'}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">favorite_border</span>
                  <span className="capitalize">Mahr Outlook: {profile.mahrPhilosophy?.replace('_', ' ') || 'Mutual Agreement'}</span>
                </div>
              </div>
            </div>

            {/* 5. About My Deen & Bio Essay */}
            <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 space-y-2 shadow-2xs">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">About Me & My Faith</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed italic">
                "{profile.bio || rel?.deenRelationshipBio || "Seeking a pious spouse to build a righteous Islamic household founded on mutual love and respect."}"
              </p>
            </div>

            {/* 6. Wali & Chaperone Info */}
            {profile.wali && (
              <div className="bg-surface rounded-2xl p-4 border border-primary/20 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">Wali: {profile.wali.name}</h4>
                    <p className="text-[11px] text-secondary">{profile.wali.relationship} · Verified Chaperone</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  Chaperoned
                </span>
              </div>
            )}
          </div>
        </main>

        {/* Fixed Action Footer */}
        <footer className="absolute bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl px-5 py-3.5 border-t border-surface-variant/40 flex items-center justify-between z-40 shadow-card">
          <button
            onClick={() => {
              onPass(profile.id);
              onClose();
            }}
            className="flex-1 max-w-[120px] py-3 rounded-full border border-surface-variant/80 text-secondary hover:text-error hover:border-error/40 hover:bg-error/5 font-sans text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Pass</span>
          </button>

          <button
            onClick={() => {
              onLike(profile);
              onClose();
            }}
            className="flex-1 ml-3 py-3 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] fill">favorite</span>
            <span>Express Interest (Like)</span>
          </button>
        </footer>

        {/* Values Alignment Breakdown Modal */}
        {showCompatibilityModal && (
          <CompatibilityComparisonModal
            currentUser={currentUser}
            profile={profile}
            isOpen={showCompatibilityModal}
            onClose={() => setShowCompatibilityModal(false)}
          />
        )}
      </div>
    </div>
  );
};
export default ProfileDetailModal;

