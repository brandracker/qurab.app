import React from 'react';
import type { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
  onRequestPhoto: () => void;
}

export const FullProfileModal: React.FC<Props> = ({
  profile,
  onClose,
  onLike,
  onPass,
  onRequestPhoto
}) => {
  const isBlurred = profile.blurPhotosByDefault && !profile.photoRevealApproved;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm px-0 sm:px-4">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-surface-variant overflow-hidden animate-slide-up">
        {/* Header Photo Carousel */}
        <div className="relative w-full h-80 bg-surface-container-high shrink-0 overflow-hidden">
          <img
            src={profile.photos[0]}
            alt={profile.fullName}
            className={`w-full h-full object-cover transition-all ${isBlurred ? 'blur-2xl scale-110' : ''}`}
          />
          {isBlurred && (
            <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined text-white text-3xl mb-2">lock</span>
              <p className="text-white text-sm font-medium">Photos Protected by Modesty Mode</p>
              <button
                onClick={onRequestPhoto}
                className="mt-3 px-5 py-2.5 bg-white/90 text-primary font-medium text-xs rounded-full shadow hover:bg-white transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                {profile.photoRevealRequested ? 'Photo Access Requested' : 'Request to View Photos'}
              </button>
            </div>
          )}

          {/* Close Floating Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Wali Badge */}
          {profile.wali && (
            <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Wali Verified
            </div>
          )}
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Main Info */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-on-surface">
                {profile.fullName}, {profile.age}
              </h1>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {profile.religiousProfile.practiceLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">location_on</span>
              {profile.location}
            </p>
          </div>

          {/* Quick Pillars Bento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <span className="text-xs text-secondary font-medium block mb-1">Profession & Education</span>
              <span className="text-sm font-semibold text-on-surface block">{profile.profession}</span>
              <span className="text-xs text-on-surface-variant">{profile.education}</span>
            </div>
            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <span className="text-xs text-secondary font-medium block mb-1">Tradition & Madhhab</span>
              <span className="text-sm font-semibold text-on-surface block">{profile.religiousProfile.sect}</span>
              <span className="text-xs text-on-surface-variant">{profile.religiousProfile.madhhab || 'General'}</span>
            </div>
          </div>

          {/* About Bio */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-primary">About Me</h3>
            <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
              {profile.bio}
            </p>
          </div>

          {/* Deen & Practice */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-primary">My Practice & Deen</h3>
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Daily Prayers:</span>
                <span className="font-semibold text-on-surface">{profile.religiousProfile.prayerFrequency}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Halal Diet:</span>
                <span className="font-semibold text-on-surface">{profile.religiousProfile.halalDiet}</span>
              </div>
              {profile.religiousProfile.deenRelationshipBio && (
                <p className="text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20 italic">
                  "{profile.religiousProfile.deenRelationshipBio}"
                </p>
              )}
            </div>
          </div>

          {/* Wali & Guardian Info */}
          {profile.wali && (
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">supervisor_account</span>
              <div className="text-xs">
                <span className="font-bold text-primary block">Wali Chaperone Active</span>
                <span className="text-on-surface-variant">
                  {profile.wali.name} ({profile.wali.relationship}) participates in discussions for modesty and transparency.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <footer className="p-4 bg-surface/90 backdrop-blur-md border-t border-surface-variant flex items-center justify-around">
          <button
            onClick={() => {
              onPass();
              onClose();
            }}
            className="w-14 h-14 rounded-full border border-secondary text-secondary flex items-center justify-center hover:bg-surface-variant active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <button
            onClick={() => {
              onLike();
              onClose();
            }}
            className="px-8 h-14 rounded-full bg-primary text-on-primary font-semibold text-sm flex items-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">favorite</span>
            Express Interest
          </button>
        </footer>
      </div>
    </div>
  );
};
