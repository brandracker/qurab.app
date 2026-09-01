import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, EyeOff } from 'lucide-react';
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
      colors: ['#FF2560', '#FF4D7D', '#FFF0F3', '#ffffff']
    });
  }, []);

  const myPhoto = currentUser?.photos && currentUser.photos.length > 0 && currentUser.photos[0]
    ? currentUser.photos[0]
    : null;

  const otherPhoto = profile?.photos && profile.photos.length > 0 && profile.photos[0]
    ? profile.photos[0]
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs px-4 animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[420px] bg-white rounded-[36px] p-6 sm:p-7 shadow-2xl border border-outline flex flex-col items-center text-center relative overflow-hidden animate-slide-up">
        {/* Header Badge */}
        <div className="bg-pastel-rose border border-pastel-rose-border text-primary px-4 py-1.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase mb-3 flex items-center gap-1.5 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Alhamdulillah · It's a Match</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Blessed Connection
        </h2>
        <div className="font-arabic text-primary text-base font-bold mb-2">
          بَارَكَ اللَّهُ لَكُمَا
        </div>
        <p className="text-secondary text-xs mb-5 max-w-[280px] leading-relaxed">
          You and <span className="font-bold text-primary">{profile.fullName.split(' ')[0]}</span> have mutually expressed interest to connect for marriage.
        </p>

        {/* Overlapping Photos (Your Real Photo + Matched Person Photo) */}
        <div className="flex items-center justify-center -space-x-5 mb-5 relative">
          {/* Your Photo */}
          <div className="w-22 h-22 rounded-full border-4 border-white overflow-hidden shadow-card ring-2 ring-primary/40 bg-surface-variant flex items-center justify-center z-10">
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
          <div className="w-22 h-22 rounded-full border-4 border-white overflow-hidden shadow-card ring-2 ring-primary relative bg-surface-variant flex items-center justify-center z-10">
            <img
              src={otherPhoto}
              alt={profile.fullName}
              className={`w-full h-full object-cover ${profile.blurPhotosByDefault && !profile.photoRevealApproved ? 'filter blur-md' : ''}`}
            />
            {profile.blurPhotosByDefault && !profile.photoRevealApproved && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-xs">
                <EyeOff className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onStartChat}
          className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2 mb-2.5"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Begin Chaperoned Halal Conversation</span>
        </button>

        <button
          onClick={onClose}
          className="text-xs font-bold text-secondary hover:text-on-surface transition-colors py-1.5"
        >
          Keep Exploring Discover
        </button>
      </div>
    </div>
  );
};
export default MutualMatchModal;

