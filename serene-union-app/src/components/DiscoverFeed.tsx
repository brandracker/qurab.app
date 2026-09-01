import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Crown, 
  BookOpen, 
  GraduationCap, 
  Home, 
  User, 
  FileText, 
  Hand, 
  Heart, 
  PlayCircle, 
  Loader2 
} from 'lucide-react';
import type { UserProfile, FilterState } from '../types';
import { FilterModal } from './FilterModal';
import { MutualMatchModal } from './MutualMatchModal';
import { ProfileDetailModal } from './ProfileDetailModal';
import { RewardedAdModal } from './RewardedAdModal';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { dbService } from '../services/dbService';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenFilters?: () => void;
  onOpenMatches?: () => void;
  onOpenProfile?: () => void;
}

type CardTab = 'deen' | 'career' | 'family' | 'bio';

export const DiscoverFeed: React.FC<Props> = ({ onOpenChat }) => {
  const currentUser = dbService.getCurrentUser();
  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  const getTodayLikeKey = () => `serene_likes_left_${currentUser.id}_${new Date().toISOString().slice(0, 10)}`;

  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  const [showLikesLimitModal, setShowLikesLimitModal] = useState<boolean>(false);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<CardTab>('deen');
  
  const [filters, setFilters] = useState<FilterState>({
    minAge: 18,
    maxAge: 45,
    maxDistance: 50,
    sects: [],
    practiceLevels: [],
    marriageTimelines: [],
    languages: ['English']
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => dbService.getDiscoverFeed(filters));
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    dbService.fetchLiveProfiles().then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(filters));
      }
    }).finally(() => {
      setIsLoading(false);
    });

    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => window.removeEventListener('serene_vip_updated', handleVipUpdate);
  }, [currentUser.id]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
    setCurrentIndex(0);
    setCurrentPhotoIdx(0);
  };

  const handleLike = async (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Check daily like limit for non-VIP users
    if (!isVip && likesRemaining <= 0) {
      setShowLikesLimitModal(true);
      return;
    }

    if (!isVip) {
      const nextLikes = Math.max(0, likesRemaining - 1);
      setLikesRemaining(nextLikes);
      localStorage.setItem(getTodayLikeKey(), nextLikes.toString());
    }

    setProfiles(prev => prev.filter(p => p.id !== profile.id));

    const result = await dbService.sendMatchAction(profile.id, 'liked');
    if (result.isMutual) {
      setMatchedProfile(profile);
    } else {
      setToastMessage(`Interest expressed to ${profile.fullName.split(' ')[0]}. You will be notified when they connect!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleClaimAdLikes = () => {
    const nextLikes = likesRemaining + 10;
    setLikesRemaining(nextLikes);
    localStorage.setItem(getTodayLikeKey(), nextLikes.toString());
    setToastMessage('+10 Extra Discover Likes added! 🎉');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePass = (profileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // Search filtering
  const filteredFeed = profiles.filter(p => {
    return (
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentProfile = filteredFeed[currentIndex] || null;

  const handleNext = () => {
    if (currentIndex < filteredFeed.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentPhotoIdx(0);
      setActiveTab('deen');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCurrentPhotoIdx(0);
      setActiveTab('deen');
    }
  };

  const photos = currentProfile?.photos && currentProfile.photos.length > 0
    ? currentProfile.photos
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIdx < photos.length - 1) {
      setCurrentPhotoIdx(prev => prev + 1);
    } else {
      setCurrentPhotoIdx(0);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIdx > 0) {
      setCurrentPhotoIdx(prev => prev - 1);
    } else {
      setCurrentPhotoIdx(photos.length - 1);
    }
  };

  const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden font-sans select-none text-on-surface">
      {/* Top Header: Ultra-Minimal & Spacious with Brand Logo + Filter Option */}
      <header className="w-full sticky top-0 z-40 bg-white px-5 py-3 border-b border-outline flex items-center justify-between shadow-subtle">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center p-1 shadow-subtle">
            <img src="/icon.svg" alt="Qurab" className="w-5 h-5 object-contain" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-base tracking-tight text-on-surface">
              Qurab
            </span>
            <span className="font-arabic text-primary text-xs font-bold leading-none">
              قُرب
            </span>
          </div>
        </div>

        {/* Right: Actions (Counter + Search toggle + Filter Button) */}
        <div className="flex items-center gap-2">
          {filteredFeed.length > 0 && (
            <span className="text-[10px] font-bold bg-pastel-rose text-primary px-2.5 py-0.5 rounded-full border border-pastel-rose-border">
              {currentIndex + 1} / {filteredFeed.length}
            </span>
          )}

          {isVip && (
            <span className="text-[10px] font-bold bg-pastel-amber text-pastel-amber-text px-2 py-0.5 rounded-full flex items-center gap-1 border border-pastel-amber-border">
              <Crown className="w-3 h-3 text-pastel-amber-text" />
              <span>VIP</span>
            </span>
          )}

          {/* Search Toggle Icon */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
              showSearch 
                ? 'bg-primary text-white border-primary shadow-brand' 
                : 'bg-white border-outline text-secondary hover:text-on-surface hover:bg-surface-variant shadow-subtle'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Filter Option Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            aria-label="Filters"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-outline text-on-surface hover:bg-surface-variant transition-all shadow-subtle relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            {(filters.sects.length > 0 || filters.practiceLevels.length > 0) && (
              <span className="w-2 h-2 bg-primary rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* Expandable Minimal Search Bar when user taps search */}
      {showSearch && (
        <div className="px-5 py-2.5 bg-surface-variant border-b border-outline animate-fade-in flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-3.5 h-3.5" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setCurrentPhotoIdx(0);
              }}
              className="w-full bg-white border border-outline rounded-full py-1.5 pl-8 pr-3 text-xs text-on-surface focus:border-primary outline-none transition-all placeholder:text-secondary/70 shadow-subtle"
              placeholder="Search by city, name, profession..."
              type="text"
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-secondary hover:text-on-surface font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="bg-primary text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-brand animate-fade-in z-30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}


      {/* Main Coverflow Stage */}
      <main className="flex-1 overflow-y-auto px-4 pt-3.5 pb-24 flex flex-col justify-between">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-secondary mt-2">Loading prospective matches...</p>
          </div>
        ) : !currentProfile ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-3xl border border-outline my-auto shadow-card">
            <div className="w-12 h-12 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-base font-bold text-on-surface">No Profiles Found</h3>
            <p className="text-xs text-secondary max-w-xs mt-1 leading-relaxed">
              You have viewed all candidates or your filters are very specific. Try resetting to explore more profiles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleApplyFilters({
                  minAge: 18,
                  maxAge: 60,
                  maxDistance: 100,
                  sects: [],
                  practiceLevels: [],
                  marriageTimelines: [],
                  languages: []
                });
              }}
              className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col flex-1 justify-between gap-2.5 animate-fade-in">
            {/* Card Shell */}
            <article className="w-full bg-white rounded-3xl overflow-hidden border border-outline shadow-card flex flex-col">
              {/* Top Photo Header */}
              <div className="relative w-full h-72 bg-surface-variant overflow-hidden group">
                <img
                  alt={currentProfile.fullName}
                  src={photos[currentPhotoIdx] || photos[0]}
                  className={`w-full h-full object-cover transition-all duration-200 ${
                    currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved
                      ? 'filter blur-xl scale-110 opacity-85'
                      : 'scale-100'
                  }`}
                />

                {/* Segmented Story Bars */}
                {photos.length > 1 && (
                  <div className="absolute top-2 inset-x-3 flex items-center gap-1.5 z-20">
                    {photos.map((_, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIdx(pIdx);
                        }}
                        className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${
                          pIdx === currentPhotoIdx
                            ? 'bg-white shadow-sm'
                            : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Photo Tap Controls */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      aria-label="Previous Photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      aria-label="Next Photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Modesty Shield Badge */}
                {currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
                    <div className="bg-white/95 px-3 py-1.5 rounded-full text-on-surface font-sans text-[10px] font-bold shadow-subtle flex items-center gap-1.5 border border-outline">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Modesty Shield Active</span>
                    </div>
                  </div>
                )}

                {/* Top Location & Photo Counter Pill */}
                <div className="absolute top-5 left-3 flex items-center gap-1.5 z-10">
                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary-light" />
                    <span>{currentProfile.location}</span>
                  </div>
                  {photos.length > 1 && (
                    <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[10px] font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{currentPhotoIdx + 1}/{photos.length}</span>
                    </div>
                  )}
                </div>

                {/* Top Right VIP or Wali Badge */}
                {currentProfile.isVip ? (
                  <div className="absolute top-5 right-3 bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm z-10">
                    <Crown className="w-3 h-3 text-pastel-amber-text" />
                    <span>VIP Member</span>
                  </div>
                ) : currentProfile.wali ? (
                  <div className="absolute top-5 right-3 bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm z-10">
                    <ShieldCheck className="w-3 h-3 text-pastel-mint-text" />
                    <span>Wali Verified</span>
                  </div>
                ) : null}

                {/* Candidate Name & Timeline Overlay on Photo (Clean Solid scrim) */}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-3.5 flex items-end justify-between text-white">
                  <div>
                    <h2 className="font-serif text-xl font-bold leading-tight flex items-center gap-1.5">
                      <span>{currentProfile.fullName.split(' ')[0]}, {currentProfile.age}</span>
                      {currentProfile.isVip && (
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                      )}
                    </h2>
                    <p className="text-xs text-white/90 font-medium flex items-center gap-1 mt-0.5">
                      <span>{currentProfile.profession}</span>
                      {currentProfile.workArrangement && (
                        <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[9px] uppercase font-mono">
                          {currentProfile.workArrangement}
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-subtle">
                    {currentProfile.marriageTimeline?.replace('_', ' ') || 'Within 1 Year'}
                  </span>
                </div>
              </div>

              {/* In-Card Deep Navigation Tabs (Clean Solid) */}
              <div className="flex border-b border-outline bg-surface-variant">
                {[
                  { id: 'deen', label: 'Deen & Taqwa', Icon: BookOpen },
                  { id: 'career', label: 'Career', Icon: GraduationCap },
                  { id: 'family', label: 'Family', Icon: Home },
                  { id: 'bio', label: 'Bio & Values', Icon: User }
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as CardTab)}
                    className={`flex-1 py-2 flex flex-col items-center gap-0.5 border-b-2 text-[10px] font-bold transition-all ${
                      activeTab === id
                        ? 'border-primary text-primary bg-white shadow-subtle'
                        : 'border-transparent text-secondary hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic In-Card Content Body based on Tab (Pastel Cards) */}
              <div className="p-3.5 bg-white min-h-[135px] flex flex-col justify-center">
                {/* 1. DEEN & TAQWA TAB */}
                {activeTab === 'deen' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-pastel-mint p-2 rounded-xl border border-pastel-mint-border">
                        <span className="text-[9px] text-pastel-mint-text font-bold uppercase block">Daily Prayers</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.prayerFrequency || '5 times daily'}</strong>
                      </div>
                      <div className="bg-pastel-mint p-2 rounded-xl border border-pastel-mint-border">
                        <span className="text-[9px] text-pastel-mint-text font-bold uppercase block">Sect & Madhhab</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.sect} · {currentProfile.religiousProfile?.madhhab || 'Hanafi'}</strong>
                      </div>
                      <div className="bg-pastel-mint p-2 rounded-xl border border-pastel-mint-border">
                        <span className="text-[9px] text-pastel-mint-text font-bold uppercase block">Dietary Standard</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.halalDiet || 'Strictly Halal'}</strong>
                      </div>
                      <div className="bg-pastel-mint p-2 rounded-xl border border-pastel-mint-border">
                        <span className="text-[9px] text-pastel-mint-text font-bold uppercase block">Modesty / Attire</span>
                        <strong className="text-on-surface text-[11px] capitalize">{currentProfile.religiousProfile?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CAREER & PEDIGREE TAB */}
                {activeTab === 'career' && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center gap-2 bg-pastel-sky p-2 rounded-xl border border-pastel-sky-border">
                      <GraduationCap className="w-4 h-4 text-pastel-sky-text" />
                      <div>
                        <span className="text-[9px] text-pastel-sky-text font-bold uppercase block">Education</span>
                        <span className="font-semibold text-on-surface">{currentProfile.education} {currentProfile.university ? `· ${currentProfile.university}` : ''}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-pastel-sky p-2 rounded-xl border border-pastel-sky-border">
                        <span className="text-[9px] text-pastel-sky-text font-bold uppercase block">Work Arrangement</span>
                        <strong className="text-on-surface capitalize text-[11px]">{currentProfile.workArrangement?.replace('_', ' ') || 'Full-Time'}</strong>
                      </div>
                      <div className="bg-pastel-sky p-2 rounded-xl border border-pastel-sky-border">
                        <span className="text-[9px] text-pastel-sky-text font-bold uppercase block">Annual Income</span>
                        <strong className="text-on-surface text-[11px] capitalize">{currentProfile.incomeBracket ? currentProfile.incomeBracket.replace('_', ' ') : 'Professional'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FAMILY & HOME TAB */}
                {activeTab === 'family' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-pastel-sand p-2 rounded-xl border border-pastel-sand-border">
                        <span className="text-[9px] text-pastel-sand-text font-bold uppercase block">Living Preference</span>
                        <strong className="text-primary capitalize text-[11px]">{currentProfile.livingPreference?.replace('_', ' ') || 'Independent Home'}</strong>
                      </div>
                      <div className="bg-pastel-sand p-2 rounded-xl border border-pastel-sand-border">
                        <span className="text-[9px] text-pastel-sand-text font-bold uppercase block">Marital Status</span>
                        <strong className="text-on-surface text-[11px] capitalize">{currentProfile.maritalStatus ? currentProfile.maritalStatus.replace('_', ' ') : 'Never Married'}</strong>
                      </div>
                      <div className="bg-pastel-sand p-2 rounded-xl border border-pastel-sand-border">
                        <span className="text-[9px] text-pastel-sand-text font-bold uppercase block">Citizenship</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.citizenship || 'Citizen'}</strong>
                      </div>
                      <div className="bg-pastel-sand p-2 rounded-xl border border-pastel-sand-border">
                        <span className="text-[9px] text-pastel-sand-text font-bold uppercase block">Relocation</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.willingnessToRelocate === 'willing' ? 'Open to Relocate' : 'Local Only'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BIO & REFLECTIONS TAB */}
                {activeTab === 'bio' && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 bg-pastel-lavender p-2.5 rounded-xl border border-pastel-lavender-border italic">
                      "{currentProfile.bio || currentProfile.religiousProfile?.deenRelationshipBio || "Seeking a righteous partner on the Sunnah to complete half my deen."}"
                    </p>

                    {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {currentProfile.hobbies.slice(0, 4).map((h, i) => (
                          <span key={i} className="bg-pastel-rose text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-pastel-rose-border">
                            {h.replace(/[^\w\s\(\)\-]/gi, '').trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>

            {/* Bottom Controls Bar */}
            <div className="space-y-2 pt-0.5">
              {/* Stepper Controls */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2 rounded-xl bg-white border border-outline text-on-surface text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-variant transition-all shadow-subtle"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(currentProfile)}
                  className="px-3.5 py-2 rounded-xl bg-pastel-rose text-primary border border-pastel-rose-border text-xs font-bold flex items-center gap-1 hover:bg-pastel-rose/80 transition-all shadow-subtle"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Full Biodata</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === filteredFeed.length - 1}
                  className="flex-1 py-2 rounded-xl bg-white border border-outline text-on-surface text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-variant transition-all shadow-subtle"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Matrimonial Decision Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-0.5">
                {/* Pass Button */}
                <button
                  type="button"
                  onClick={(e) => handlePass(currentProfile.id, e)}
                  aria-label="Pass"
                  className="w-12 h-12 rounded-2xl bg-white border border-outline text-secondary hover:text-error hover:border-error/40 hover:bg-pastel-rose active:scale-90 flex items-center justify-center transition-all shadow-subtle"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Direct Salam Instant Connect */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const conv = dbService.createMatchConversation(currentProfile);
                    onOpenChat(conv.id);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-white text-primary border border-pastel-rose-border text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-pastel-rose active:scale-95 transition-all shadow-subtle"
                >
                  <Hand className="w-4 h-4 text-primary" />
                  <span>Direct Salam</span>
                </button>

                {/* Like / Express Interest Button (Solid #FF2560) */}
                <button
                  type="button"
                  onClick={(e) => handleLike(currentProfile, e)}
                  aria-label="Connect"
                  className="w-12 h-12 rounded-2xl bg-primary text-white hover:bg-primary-dark active:scale-90 flex items-center justify-center transition-all shadow-brand"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Full Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
          onLike={(p) => {
            handleLike(p);
            setSelectedProfile(null);
          }}
          onPass={(pid) => {
            handlePass(pid);
            setSelectedProfile(null);
          }}
        />
      )}

      {/* Filter Preferences Modal */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}

      {/* Mutual Match Celebration Modal */}
      {matchedProfile && (
        <MutualMatchModal
          profile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onStartChat={() => {
            const newConv = dbService.createMatchConversation(matchedProfile);
            setMatchedProfile(null);
            onOpenChat(newConv.id);
          }}
        />
      )}

      {/* Daily Free Likes Reached Modal */}
      {showLikesLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 font-sans animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-outline text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pastel-rose text-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Daily Free Likes Limit (50/50)</h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                You’ve used your 50 daily free likes. Watch a quick 15s sponsored ad to unlock <strong>+10 More Likes</strong> right now, or get unlimited likes with VIP!
              </p>
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowLikesLimitModal(false);
                  setShowRewardedAdModal(true);
                }}
                className="w-full py-3 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Watch Quick Ad (+10 Likes)</span>
              </button>

              <button
                onClick={() => {
                  setShowLikesLimitModal(false);
                  setShowVipModal(true);
                }}
                className="w-full py-2.5 rounded-full bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border hover:bg-pastel-amber/80 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-pastel-amber-text" />
                <span>Get Unlimited Likes with VIP (PKR 799/mo)</span>
              </button>

              <button
                onClick={() => setShowLikesLimitModal(false)}
                className="text-[11px] text-secondary hover:text-on-surface pt-1"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewarded Ad Modal */}
      {showRewardedAdModal && (
        <RewardedAdModal
          userId={currentUser.id}
          rewardType="likes"
          isOpen={showRewardedAdModal}
          onClose={() => setShowRewardedAdModal(false)}
          onRewardClaimed={handleClaimAdLikes}
        />
      )}

      {/* VIP Upgrade Modal */}
      {showVipModal && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showVipModal}
          onClose={() => setShowVipModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${currentUser.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => {
            setShowVipModal(false);
            setShowRewardedAdModal(true);
          }}
        />
      )}
    </div>
  );
};

