import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  ShieldCheck, 
  MapPin, 
  Camera, 
  Crown, 
  Sparkles, 
  BookOpen, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Heart, 
  Users, 
  X
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs animate-fade-in p-0 sm:p-4 font-sans select-none text-on-surface">
      <div className="w-full max-w-[480px] h-[92vh] sm:h-[88vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-outline flex flex-col overflow-hidden animate-slide-up relative">
        
        {/* Sticky Top Header */}
        <header className="sticky top-0 bg-white px-4 py-2.5 border-b border-outline flex items-center justify-between z-30 shadow-subtle">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="font-serif text-sm font-bold text-on-surface">
            Matrimonial Profile
          </div>

          <button
            onClick={() => setIsUnblurred(!isUnblurred)}
            className="text-xs text-primary font-bold flex items-center gap-1 bg-pastel-rose border border-pastel-rose-border px-3 py-1 rounded-full hover:bg-pastel-rose/80 transition-colors"
          >
            {isUnblurred ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isUnblurred ? 'Blur' : 'Unblur'}</span>
          </button>
        </header>

        {/* Scrollable Profile Body */}
        <main className="flex-1 overflow-y-auto pb-24">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIdx(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
                  aria-label="Next Photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {!isUnblurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-xs pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-on-surface flex items-center gap-1.5 shadow-subtle border border-outline">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Modesty Shield Active</span>
                </div>
              </div>
            )}
            <div className="absolute top-5 left-4 flex items-center gap-1.5 z-10">
              <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-primary-light" />
                <span>{profile.location || 'Global'}</span>
              </div>
              {photos.length > 1 && (
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{selectedPhotoIdx + 1}/{photos.length}</span>
                </div>
              )}
            </div>

            {/* Top Right VIP or Wali Badge */}
            {profile.isVip ? (
              <div className="absolute top-5 right-4 bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-subtle z-10">
                <Crown className="w-3.5 h-3.5 text-pastel-amber-text" />
                <span>VIP Member</span>
              </div>
            ) : profile.wali ? (
              <div className="absolute top-5 right-4 bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-subtle z-10">
                <ShieldCheck className="w-3.5 h-3.5 text-pastel-mint-text" />
                <span>Wali Verified</span>
              </div>
            ) : null}
          </div>

          {/* Photo Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 px-4 py-2.5 overflow-x-auto bg-surface-variant border-b border-outline">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`w-12 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all shadow-2xs ${
                    selectedPhotoIdx === idx ? 'border-primary scale-105 shadow-brand' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={p} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Profile Core Header */}
          <div className="p-4 space-y-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-on-surface">
                  {profile.fullName}, {profile.age}
                </h1>
                {profile.isVip && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-xs text-primary font-bold mt-0.5">
                {rel?.sect || 'Sunni'} ({rel?.madhhab || 'Hanafi'}) · {profile.profession || 'Professional'}
              </p>
            </div>

            {/* Values Alignment Banner Button */}
            <button
              type="button"
              onClick={() => setShowCompatibilityModal(true)}
              className="w-full p-3.5 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-between text-left hover:bg-pastel-rose/80 transition-all shadow-subtle group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-primary flex items-center justify-center shadow-subtle shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span>94% Islamic Values Match</span>
                    <span className="bg-primary text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">High</span>
                  </h4>
                  <p className="text-[10px] text-secondary">Tap to view 4-Pillars alignment breakdown</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Universal Badges Strip */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {profile.ethnicity && (
                <span className="bg-pastel-rose text-primary px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-pastel-rose-border">
                  {profile.ethnicity}
                </span>
              )}
              {profile.citizenship && (
                <span className="bg-white border border-outline text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-subtle">
                  {profile.citizenship}
                </span>
              )}
              {profile.maritalStatus && (
                <span className="bg-white border border-outline text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-subtle capitalize">
                  {profile.maritalStatus.replace('_', ' ')}
                </span>
              )}
              {profile.workArrangement && (
                <span className="bg-white border border-outline text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-subtle capitalize">
                  {profile.workArrangement.replace('_', ' ')}
                </span>
              )}
              {profile.incomeBracket && profile.incomeBracket !== 'undisclosed' && (
                <span className="bg-white border border-outline text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-subtle capitalize">
                  {profile.incomeBracket.replace('_', ' ')}
                </span>
              )}
            </div>

            {/* 1. Deen & Religious Practice (Pastel Mint) */}
            <div className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-pastel-mint-text flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-mint-text" />
                <span>Deen & Religious Practice</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Daily Prayers</span>
                  <strong className="text-on-surface text-[11px]">{rel?.prayerFrequency || '5 times daily'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Quran Engagement</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Modesty & Attire</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Dietary Standard</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.halalDiet || 'Strictly Halal'}</strong>
                </div>
              </div>
            </div>

            {/* 2. Interests & Personality Badges */}
            {((profile.hobbies && profile.hobbies.length > 0) || (profile.personalityTraits && profile.personalityTraits.length > 0)) && (
              <div className="bg-white rounded-2xl p-3.5 border border-outline space-y-2.5 shadow-subtle">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Interests & Personality</span>
                </h3>
                
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1">Hobbies & Passions</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.hobbies.map((h, i) => (
                        <span key={i} className="bg-surface-variant px-2.5 py-0.5 rounded-full text-xs text-on-surface border border-outline font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.personalityTraits && profile.personalityTraits.length > 0 && (
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1">Personality Traits</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.personalityTraits.map((t, i) => (
                        <span key={i} className="bg-pastel-amber text-pastel-amber-text px-2.5 py-0.5 rounded-full text-xs font-medium border border-pastel-amber-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Family Setup & Post-Marriage Living (Pastel Sand) */}
            <div className="bg-pastel-sand rounded-2xl p-3.5 border border-pastel-sand-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sand-text uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-pastel-sand-text" />
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Living Post-Marriage</span>
                  <strong className="text-on-surface capitalize text-primary text-[11px]">
                    {profile.livingPreference?.replace('_', ' ') || 'Independent'}
                  </strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Dual-Income Preference</span>
                  <strong className="text-on-surface capitalize text-[11px]">
                    {profile.dualIncomePreference?.replace('_', ' ') || 'Career Supportive'}
                  </strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Relocation Outlook</span>
                  <strong className="text-on-surface capitalize text-[11px]">
                    {profile.willingnessToRelocate?.replace('_', ' ') || 'Open'}
                  </strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Smoking & Habits</span>
                  <strong className="text-on-surface capitalize text-[11px]">
                    {profile.smokingStatus?.replace('_', ' ') || 'Non-Smoker'}
                  </strong>
                </div>
              </div>
            </div>

            {/* 4. Career, Education & Mahr Philosophy (Pastel Sky) */}
            <div className="bg-pastel-sky rounded-2xl p-3.5 border border-pastel-sky-border space-y-2 text-xs shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sky-text uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-pastel-sky-text" />
                <span>Education & Career Pedigree</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-on-surface">
                  <GraduationCap className="w-3.5 h-3.5 text-pastel-sky-text" />
                  <span>{profile.education} {profile.university ? `· ${profile.university}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <Briefcase className="w-3.5 h-3.5 text-pastel-sky-text" />
                  <span>{profile.profession} {profile.workArrangement ? `(${profile.workArrangement.toUpperCase()})` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <Languages className="w-3.5 h-3.5 text-pastel-sky-text" />
                  <span>Languages: {profile.languagesSpoken || 'English, Urdu'}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <Heart className="w-3.5 h-3.5 text-pastel-sky-text" />
                  <span className="capitalize">Mahr Outlook: {profile.mahrPhilosophy?.replace('_', ' ') || 'Mutual Agreement'}</span>
                </div>
              </div>
            </div>

            {/* 5. About My Deen & Bio Essay */}
            <div className="bg-pastel-lavender rounded-2xl p-3.5 border border-pastel-lavender-border space-y-1 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-lavender-text uppercase tracking-wider">About Me & My Faith</h3>
              <p className="text-xs text-on-surface leading-relaxed italic">
                "{profile.bio || rel?.deenRelationshipBio || "Seeking a pious spouse to build a righteous Islamic household founded on mutual love and respect."}"
              </p>
            </div>

            {/* 6. Wali & Chaperone Info */}
            {profile.wali && (
              <div className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border flex items-center justify-between shadow-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-white text-pastel-mint-text flex items-center justify-center shadow-subtle shrink-0">
                    <Users className="w-4 h-4 text-pastel-mint-text" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">Wali: {profile.wali.name}</h4>
                    <p className="text-[10px] text-pastel-mint-text">{profile.wali.relationship} · Verified Chaperone</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-pastel-mint-text bg-white px-2 py-0.5 rounded-full border border-pastel-mint-border">
                  Chaperoned
                </span>
              </div>
            )}
          </div>
        </main>

        {/* Fixed Action Footer */}
        <footer className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 border-t border-outline flex items-center justify-between z-40 shadow-card">
          <button
            onClick={() => {
              onPass(profile.id);
              onClose();
            }}
            className="flex-1 max-w-[110px] py-2.5 rounded-full border border-outline text-secondary hover:text-error hover:border-error hover:bg-pastel-rose font-sans text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1 shadow-subtle"
          >
            <X className="w-4 h-4" />
            <span>Pass</span>
          </button>

          <button
            onClick={() => {
              onLike(profile);
              onClose();
            }}
            className="flex-1 ml-2.5 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-current" />
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

