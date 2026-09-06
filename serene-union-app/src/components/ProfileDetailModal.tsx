import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Camera, 
  Crown, 
  HeartHandshake,
  User,
  Globe2,
  CheckCircle2,
  Bookmark,
  BookOpen, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Heart, 
  X, 
  Ruler, 
  ShieldCheck, 
  FileCheck2, 
  Plane, 
  Clock, 
  Building2, 
  Hourglass, 
  Users,
  Volume2,
  Play,
  Pause
} from 'lucide-react';


import type { UserProfile } from '../types';
import { CompatibilityComparisonModal } from './CompatibilityComparisonModal';
import { dbService } from '../services/dbService';

interface Props {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (profile: UserProfile) => void;
  onPass?: (profileId: string) => void;
}

export const ProfileDetailModal: React.FC<Props> = ({ profile, isOpen, onClose, onLike, onPass }) => {

  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentUser = dbService.getCurrentUser();
  const isRevealedToMe = Boolean(profile.isPhotoRevealed) || dbService.isPhotoRevealedTo(profile.id, currentUser.id);
  const isUnblurred = !profile.blurPhotosByDefault || isRevealedToMe || Boolean(profile.photoRevealApproved);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlayVoice = (url: string) => {
    if (isPlayingVoice) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingVoice(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch(() => {
        setIsPlayingVoice(true);
        setTimeout(() => setIsPlayingVoice(false), 3000);
      });
      audioRef.current.onended = () => setIsPlayingVoice(false);
    }
  };

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

          <div className="w-8" />
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

            <div className="absolute top-5 left-4 flex items-center gap-1.5 z-10">
              <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-primary-light" />
                <span>{profile.location || 'Global'}</span>
                {typeof profile.distanceKm === 'number' && (
                  <span className="text-primary-light font-bold">· {profile.distanceKm} km away</span>
                )}
              </div>
              {photos.length > 1 && (
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{selectedPhotoIdx + 1}/{photos.length}</span>
                </div>
              )}
            </div>

            {/* Top Right VIP Badge */}
            {profile.isVip && (
              <div className="absolute top-5 right-4 bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-subtle z-10">
                <Crown className="w-3.5 h-3.5 text-pastel-amber-text" />
                <span>VIP Member</span>
              </div>
            )}
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

              {profile.voiceGreetingUrl && (
                <div className="mt-3 p-3 rounded-2xl bg-pastel-sky/60 border border-pastel-sky-border flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-subtle">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-sky-950 block truncate">Voice Greeting / Reflection</span>
                      <span className="text-[10px] text-sky-700 block">{profile.voiceGreetingDuration || 45}s audio intro</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePlayVoice(profile.voiceGreetingUrl!)}
                    className="px-3.5 py-1.5 rounded-full bg-sky-600 text-white text-xs font-bold shadow-subtle hover:bg-sky-700 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {isPlayingVoice ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isPlayingVoice ? 'Playing...' : 'Play Voice'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Values Alignment Banner Button */}
            <button

              type="button"
              onClick={() => setShowCompatibilityModal(true)}
              className="w-full p-3.5 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-between text-left hover:bg-pastel-rose/80 transition-all shadow-subtle group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-primary flex items-center justify-center shadow-subtle shrink-0">
                  <HeartHandshake className="w-4 h-4 text-primary" />
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
              {typeof profile.distanceKm === 'number' && (
                <span className="bg-pastel-emerald text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-pastel-emerald-border flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>{profile.distanceKm} km away</span>
                </span>
              )}
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

            {/* 1. Personal Background & Biodata (Pastel Rose) */}
            <div className="bg-pastel-rose rounded-2xl p-3.5 border border-pastel-rose-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-primary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Personal Background & Biodata</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 text-primary border border-pink-200 flex items-center justify-center shrink-0">
                    <Ruler className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Height</span>
                    <strong className="text-on-surface text-[11px] block truncate">{profile.height || "5'10\" (178 cm)"}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                    <Globe2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Ethnicity</span>
                    <strong className="text-on-surface text-[11px] block truncate">{profile.ethnicity || 'South Asian'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Citizenship / Visa</span>
                    <strong className="text-on-surface text-[11px] block truncate">{profile.citizenship || 'Citizen'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Marital Status</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">
                      {profile.maritalStatus ? profile.maritalStatus.replace('_', ' ') : 'Never Married'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Deen & Religious Practice (Pastel Mint) */}
            <div className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-pastel-mint-text flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-mint-text" />
                <span>Deen & Religious Routine</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Daily Prayers</span>
                    <strong className="text-on-surface text-[11px] block truncate">{rel?.prayerFrequency || '5 times daily'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Quran Recitation</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Modesty Style</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Dietary Standard</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.halalDiet || 'Strictly Halal'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Interests & Personality Badges */}
            {((profile.hobbies && profile.hobbies.length > 0) || (profile.personalityTraits && profile.personalityTraits.length > 0)) && (
              <div className="bg-white rounded-2xl p-3.5 border border-outline space-y-2.5 shadow-subtle">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-primary" />
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

            {/* 4. Family Setup & Post-Marriage Living (Pastel Sand) */}
            <div className="bg-pastel-sand rounded-2xl p-3.5 border border-pastel-sand-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sand-text uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-pastel-sand-text" />
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Post-Marriage Living</span>
                    <strong className="text-primary capitalize text-[11px] block truncate">
                      {profile.livingPreference?.replace('_', ' ') || 'Independent'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Family Structure</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {profile.familyStructure || 'Nuclear'} {profile.siblingsCount !== undefined ? `(${profile.siblingsCount} Siblings)` : ''}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Dual-Income</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {profile.dualIncomePreference ? profile.dualIncomePreference.replace('_', ' ') : 'Career Supportive'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Relocation</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {profile.willingnessToRelocate ? profile.willingnessToRelocate.replace('_', ' ') : 'Flexible'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5 col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Smoking & Substance Status</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {profile.smokingStatus ? profile.smokingStatus.replace('_', ' ') : 'Non-Smoker'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Career, Education & Intent (Pastel Sky) */}
            <div className="bg-pastel-sky rounded-2xl p-3.5 border border-pastel-sky-border space-y-2.5 text-xs shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sky-text uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-pastel-sky-text" />
                <span>Education & Career Pedigree</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Education</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {profile.education || 'Graduate'} {profile.university ? `· ${profile.university}` : ''}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Profession</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {profile.profession || 'Professional'}
                    </strong>
                  </div>
                </div>

                {profile.workArrangement && (
                  <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-pastel-sky-text font-medium block">Work Setup</span>
                      <strong className="text-on-surface text-[11px] block truncate capitalize">
                        {profile.workArrangement.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>
                )}

                {profile.marriageTimeline && (
                  <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                      <Hourglass className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-pastel-sky-text font-medium block">Marriage Timeline</span>
                      <strong className="text-on-surface text-[11px] block truncate capitalize">
                        {profile.marriageTimeline.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5 col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Languages Spoken</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {profile.languagesSpoken || 'English, Urdu'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. About My Deen & Bio Essay */}
            <div className="bg-pastel-lavender rounded-2xl p-3.5 border border-pastel-lavender-border space-y-1.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-lavender-text uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-lavender-text" />
                <span>About Me & My Faith</span>
              </h3>
              <p className="text-xs text-on-surface leading-relaxed italic bg-white/60 p-3 rounded-xl border border-pastel-lavender-border">
                "{profile.bio || rel?.deenRelationshipBio || "Seeking a pious spouse to build a righteous Islamic household founded on mutual love and respect."}"
              </p>
            </div>

            {/* 7. Partner Requirements & Expectations */}
            <div className="bg-pastel-amber/60 rounded-2xl p-3.5 border border-pastel-amber-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-amber-text uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pastel-amber-text fill-pastel-amber-text/30" />
                <span>Partner Requirements & Expectations</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Preferred Age</span>
                  <strong className="text-on-surface text-[11px] block truncate">
                    {profile.partnerRequirements?.minAge && profile.partnerRequirements?.maxAge
                      ? `${profile.partnerRequirements.minAge} - ${profile.partnerRequirements.maxAge} years`
                      : '20 - 35 years'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Marital Status</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {profile.partnerRequirements?.maritalStatus ? profile.partnerRequirements.maritalStatus.replace(/_/g, ' ') : 'Open to All'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Deen & Practice</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {profile.partnerRequirements?.practiceLevel ? profile.partnerRequirements.practiceLevel.replace(/_/g, ' ') : 'Practicing'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Relocation</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {profile.partnerRequirements?.relocation ? profile.partnerRequirements.relocation.replace(/_/g, ' ') : 'Flexible / Open'}
                  </strong>
                </div>
              </div>

              {/* Expectations Note */}
              <div className="bg-white/80 p-2.5 rounded-xl border border-pastel-amber-border text-xs leading-relaxed text-on-surface">
                <span className="text-[10px] text-pastel-amber-text font-bold uppercase tracking-wider block mb-0.5">Looking for in a spouse:</span>
                <p className="italic text-[11px] text-on-surface">
                  "{profile.partnerRequirements?.description || 'Seeking a practicing, kind-hearted partner who values Islamic principles and family harmony.'}"
                </p>
              </div>
            </div>

          </div>
        </main>


        {/* Bottom Actions */}
        <footer className="sticky bottom-0 bg-white p-4 border-t border-outline flex items-center justify-between z-20 shadow-lg">
          {onPass && (
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
          )}

          {onLike ? (
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
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-surface-variant text-on-surface hover:bg-outline font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <span>Close Biodata</span>
            </button>
          )}
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

