import React from 'react';
import { Lock, Eye, X, MapPin, Heart } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs px-0 sm:px-4 select-none text-on-surface">
      <div className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-outline overflow-hidden animate-slide-up">
        {/* Header Photo Carousel */}
        <div className="relative w-full h-80 bg-surface-variant shrink-0 overflow-hidden">
          <img
            src={profile.photos[0]}
            alt={profile.fullName}
            className={`w-full h-full object-cover transition-all ${isBlurred ? 'blur-2xl scale-110' : ''}`}
          />
          {isBlurred && (
            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center p-4 text-center">
              <Lock className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-medium">Photos Protected by Modesty Mode</p>
              <button
                onClick={onRequestPhoto}
                className="mt-3 px-4 py-2 bg-white text-primary font-bold text-xs rounded-full shadow-brand hover:bg-pastel-rose transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{profile.photoRevealRequested ? 'Photo Access Requested' : 'Request to View Photos'}</span>
              </button>
            </div>
          )}

          {/* Close Floating Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors shadow-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Main Info */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-on-surface">
                {profile.fullName}, {profile.age}
              </h1>
              <span className="text-xs bg-pastel-rose text-primary px-3 py-0.5 rounded-full font-bold border border-pastel-rose-border">
                {profile.religiousProfile.practiceLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{profile.location}</span>
            </p>
          </div>

          {/* Quick Pillars Bento */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-surface-variant rounded-2xl border border-outline shadow-subtle">
              <span className="text-[10px] text-secondary font-bold uppercase block mb-0.5">Profession & Education</span>
              <span className="text-xs font-bold text-on-surface block">{profile.profession}</span>
              <span className="text-[11px] text-secondary">{profile.education}</span>
            </div>
            <div className="p-3 bg-surface-variant rounded-2xl border border-outline shadow-subtle">
              <span className="text-[10px] text-secondary font-bold uppercase block mb-0.5">Tradition & Madhhab</span>
              <span className="text-xs font-bold text-on-surface block">{profile.religiousProfile.sect}</span>
              <span className="text-[11px] text-secondary">{profile.religiousProfile.madhhab || 'General'}</span>
            </div>
          </div>

          {/* About Bio */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-xs font-bold text-primary uppercase tracking-wider">About Me</h3>
            <p className="text-xs text-on-surface leading-relaxed bg-surface-variant p-3.5 rounded-2xl border border-outline shadow-subtle">
              {profile.bio}
            </p>
          </div>

          {/* Deen & Practice */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-xs font-bold text-primary uppercase tracking-wider">My Practice & Deen</h3>
            <div className="p-3.5 bg-pastel-mint rounded-2xl border border-pastel-mint-border space-y-2 shadow-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-pastel-mint-text font-medium">Daily Prayers:</span>
                <span className="font-bold text-on-surface">{profile.religiousProfile.prayerFrequency}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-pastel-mint-text font-medium">Halal Diet:</span>
                <span className="font-bold text-on-surface">{profile.religiousProfile.halalDiet}</span>
              </div>
              {profile.religiousProfile.deenRelationshipBio && (
                <p className="text-xs text-on-surface pt-2 border-t border-pastel-mint-border italic">
                  "{profile.religiousProfile.deenRelationshipBio}"
                </p>
              )}
            </div>
          </div>
        </div>


        {/* Floating Action Bar */}
        <footer className="p-3 bg-white border-t border-outline flex items-center justify-around shadow-card">
          <button
            onClick={() => {
              onPass();
              onClose();
            }}
            className="w-11 h-11 rounded-full border border-outline text-secondary flex items-center justify-center hover:bg-surface-variant active:scale-95 transition-all shadow-subtle"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              onLike();
              onClose();
            }}
            className="px-6 h-11 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-brand hover:bg-primary-dark active:scale-95 transition-all"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Express Interest</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
export default FullProfileModal;

