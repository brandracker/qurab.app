import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { UserProfile } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  profile: UserProfile;
  currentUser?: UserProfile;
  onClose: () => void;
  onStartChat: () => void;
}

export const MutualMatchModal: React.FC<Props> = ({ profile, currentUser: propUser, onStartChat, onClose }) => {
  const currentUser = propUser || dbService.getCurrentUser();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2d5a27', '#cca730', '#bcf0ae', '#ffffff']
    });
  }, []);

  const myPhoto = currentUser?.photos && currentUser.photos.length > 0 && currentUser.photos[0]
    ? currentUser.photos[0]
    : null;

  const otherPhoto = profile?.photos && profile.photos.length > 0 && profile.photos[0]
    ? profile.photos[0]
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-fade-in">
      <div className="w-full max-w-[420px] bg-surface rounded-3xl p-6 shadow-2xl border border-surface-variant flex flex-col items-center text-center relative overflow-hidden">
        {/* Background Islamic glow */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-tertiary-container/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">favorite</span>
          Alhamdulillah! It's a Match
        </div>

        <h2 className="font-serif text-3xl font-bold text-on-surface mb-2">
          Mutual Interest
        </h2>
        <p className="text-secondary text-sm mb-6 max-w-[280px]">
          You and <span className="font-semibold text-primary">{profile.fullName.split(' ')[0]}</span> have expressed mutual interest.
        </p>

        {/* Overlapping Photos (Your Real Photo + Matched Person Photo) */}
        <div className="flex items-center justify-center -space-x-4 mb-6 relative">
          {/* Your Photo */}
          <div className="w-24 h-24 rounded-full border-4 border-surface overflow-hidden shadow-lg bg-surface-container-high flex items-center justify-center">
            {myPhoto ? (
              <img
                src={myPhoto}
                alt={currentUser.fullName || 'You'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-2xl font-bold text-primary">
                {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
              </span>
            )}
          </div>

          {/* Matched Profile Photo */}
          <div className="w-24 h-24 rounded-full border-4 border-surface overflow-hidden shadow-lg relative bg-surface-container-high flex items-center justify-center">
            <img
              src={otherPhoto}
              alt={profile.fullName}
              className={`w-full h-full object-cover ${profile.blurPhotosByDefault && !profile.photoRevealApproved ? 'filter blur-md' : ''}`}
            />
            {profile.blurPhotosByDefault && !profile.photoRevealApproved && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">visibility_off</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onStartChat}
          className="w-full py-4 rounded-full bg-primary text-on-primary font-sans text-sm font-semibold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Begin Halal Conversation</span>
        </button>

        <button
          onClick={onClose}
          className="text-xs font-semibold text-secondary hover:text-on-surface transition-colors py-2"
        >
          Keep Exploring
        </button>
      </div>
    </div>
  );
};
