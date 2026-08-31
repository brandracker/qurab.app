import React, { useState, useEffect } from 'react';
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

  return (
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden font-sans">
      {/* Top Header: Clean Search Bar + Filter Button + Counter */}
      <header className="w-full sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 py-3 border-b border-surface-variant/30 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
              setCurrentPhotoIdx(0);
            }}
            className="w-full bg-surface-container-high border-none rounded-full py-2.5 pl-10 pr-4 text-xs text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-secondary"
            placeholder="Search by name, city, profession..."
            type="text"
          />
        </div>

        {filteredFeed.length > 0 && (
          <span className="text-[11px] font-bold bg-primary/10 text-primary px-3 py-2 rounded-full shrink-0 border border-primary/20">
            {currentIndex + 1} of {filteredFeed.length}
          </span>
        )}

        {isVip && (
          <span className="text-[11px] font-bold bg-primary text-white px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span>VIP</span>
          </span>
        )}

        <button
          onClick={() => setShowFilterModal(true)}
          aria-label="Filters"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors shrink-0 relative"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          {(filters.sects.length > 0 || filters.practiceLevels.length > 0) && (
            <span className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1 right-1 border-2 border-surface" />
          )}
        </button>
      </header>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="bg-primary/95 text-on-primary px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      )}

      {/* Main Coverflow Perspective Stage */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-28 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-xs text-secondary mt-2">Loading prospective matches...</p>
          </div>
        ) : !currentProfile ? (
          <div className="flex flex-col items-center justify-center py-28 text-center px-4">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">favorite_border</span>
            <h3 className="font-serif text-base font-bold text-on-surface">No Profiles Found</h3>
            <p className="text-xs text-secondary max-w-xs mt-1">
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
              className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow hover:brightness-110"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* 3D PERSPECTIVE COVERFLOW CARD WITH IN-CARD DEEP TABS                     */
          /* ========================================================================= */
          <div className="w-full flex flex-col flex-1 justify-between gap-3 animate-fade-in">
            {/* Card Shell */}
            <article className="w-full bg-surface rounded-3xl overflow-hidden border border-surface-variant/40 shadow-md flex flex-col">
              {/* Top Photo & Multi-Image Header */}
              <div className="relative w-full h-72 bg-surface-container-high overflow-hidden group">
                <img
                  alt={currentProfile.fullName}
                  src={photos[currentPhotoIdx] || photos[0]}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved
                      ? 'filter blur-xl scale-110 opacity-85'
                      : 'scale-100'
                  }`}
                />

                {/* Segmented Story/Progress Bars for Multiple Photos */}
                {photos.length > 1 && (
                  <div className="absolute top-2.5 inset-x-3 flex items-center gap-1.5 z-20">
                    {photos.map((_, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIdx(pIdx);
                        }}
                        className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${
                          pIdx === currentPhotoIdx
                            ? 'bg-white shadow'
                            : 'bg-white/40 hover:bg-white/60'
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
                      onClick={handlePrevPhoto}
                      aria-label="Previous Photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      aria-label="Next Photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </>
                )}

                {/* Modesty Shield Badge */}
                {currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
                    <div className="bg-background/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-on-surface font-sans text-[10px] font-bold shadow-xs flex items-center gap-1.5 border border-surface-variant/40">
                      <span className="material-symbols-outlined text-[15px] text-primary">shield</span>
                      <span>Modesty Shield Active</span>
                    </div>
                  </div>
                )}

                {/* Top Location & Photo Counter Pill */}
                <div className="absolute top-6 left-3 flex items-center gap-1.5 z-10">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                    <span>{currentProfile.location}</span>
                  </div>
                  {photos.length > 1 && (
                    <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">photo_camera</span>
                      <span>{currentPhotoIdx + 1}/{photos.length}</span>
                    </div>
                  )}
                </div>

                {/* Top Right Wali / Chaperone Badge */}
                {currentProfile.wali && (
                  <div className="absolute top-6 right-3 bg-primary/95 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-sm z-10">
                    <span className="material-symbols-outlined text-[13px]">verified_user</span>
                    <span>Wali Observed</span>
                  </div>
                )}

                {/* Candidate Name & Timeline Overlay on Photo */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-white leading-tight flex items-center gap-2">
                      <span>{currentProfile.fullName.split(' ')[0]}, {currentProfile.age}</span>
                      {currentProfile.isVip && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                          <span>VIP</span>
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-white/90 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{currentProfile.profession}</span>
                      {currentProfile.workArrangement && (
                        <span className="bg-white/20 px-2 py-0.2 rounded-full text-[9px] uppercase font-mono">
                          {currentProfile.workArrangement}
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs">
                    {currentProfile.marriageTimeline?.replace('_', ' ') || 'Within 1 Year'}
                  </span>
                </div>
              </div>

              {/* In-Card Deep Navigation Tabs */}
              <div className="flex border-b border-surface-variant/40 bg-surface-container-high/60">
                {[
                  { id: 'deen', label: 'Deen & Taqwa', icon: 'mosque' },
                  { id: 'career', label: 'Career & Pedigree', icon: 'school' },
                  { id: 'family', label: 'Family & Home', icon: 'home' },
                  { id: 'bio', label: 'Bio & Values', icon: 'person' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as CardTab)}
                    className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 border-b-2 text-[10px] font-bold transition-all ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-surface'
                        : 'border-transparent text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic In-Card Content Body based on Tab */}
              <div className="p-4 bg-surface min-h-[145px] flex flex-col justify-center">
                {/* 1. DEEN & TAQWA TAB */}
                {activeTab === 'deen' && (
                  <div className="space-y-2.5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Daily Prayers</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.prayerFrequency || '5 times daily'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Sect & Madhhab</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.sect} · {currentProfile.religiousProfile?.madhhab || 'Hanafi'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Dietary Standard</span>
                        <strong className="text-on-surface text-[11px]">{currentProfile.religiousProfile?.halalDiet || 'Strictly Halal'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Modesty / Attire</span>
                        <strong className="text-on-surface text-[11px] capitalize">{currentProfile.religiousProfile?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CAREER & PEDIGREE TAB */}
                {activeTab === 'career' && (
                  <div className="space-y-2.5 animate-fade-in text-xs">
                    <div className="flex items-center gap-2 bg-surface-container-high/70 p-2.5 rounded-xl border border-surface-variant/30">
                      <span className="material-symbols-outlined text-[18px] text-primary">school</span>
                      <div>
                        <span className="text-[9px] text-secondary font-bold uppercase block">Education</span>
                        <span className="font-semibold text-on-surface">{currentProfile.education} {currentProfile.university ? `· ${currentProfile.university}` : ''}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Work Arrangement</span>
                        <strong className="text-on-surface capitalize text-[11px]">💻 {currentProfile.workArrangement || 'Full-Time'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Annual Income</span>
                        <strong className="text-on-surface text-[11px]">💵 {currentProfile.incomeBracket ? currentProfile.incomeBracket.replace('_', ' ') : 'Professional'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FAMILY & HOME TAB */}
                {activeTab === 'family' && (
                  <div className="space-y-2.5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Living Preference</span>
                        <strong className="text-on-surface text-[11px] capitalize text-primary">{currentProfile.livingPreference?.replace('_', ' ') || 'Independent Home'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Marital Status</span>
                        <strong className="text-on-surface text-[11px] capitalize">💍 {currentProfile.maritalStatus ? currentProfile.maritalStatus.replace('_', ' ') : 'Never Married'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Citizenship</span>
                        <strong className="text-on-surface text-[11px]">🛂 {currentProfile.citizenship || 'Citizen'}</strong>
                      </div>
                      <div className="bg-surface-container-high/70 p-2 rounded-xl border border-surface-variant/30">
                        <span className="text-[9px] text-secondary font-bold uppercase block">Relocation</span>
                        <strong className="text-on-surface text-[11px]">✈️ {currentProfile.willingnessToRelocate === 'willing' ? 'Open to Move' : 'Local'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BIO & REFLECTIONS TAB */}
                {activeTab === 'bio' && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 bg-surface-container-high/50 p-2.5 rounded-xl border border-surface-variant/20 italic">
                      "{currentProfile.bio || currentProfile.religiousProfile?.deenRelationshipBio || "Seeking a righteous partner on the Sunnah to complete half my deen."}"
                    </p>

                    {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {currentProfile.hobbies.slice(0, 3).map((h, i) => (
                          <span key={i} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>

            {/* Bottom Perspective Navigation & Actions Control Bar */}
            <div className="space-y-3 pt-1">
              {/* Stepper Carousel Controls (Prev / Next) */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2 rounded-2xl bg-surface-container-high border border-surface-variant/40 text-on-surface text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-surface-variant transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(currentProfile)}
                  className="px-4 py-2 rounded-2xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1 hover:bg-primary/20 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">article</span>
                  <span>Full Biodata</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === filteredFeed.length - 1}
                  className="flex-1 py-2 rounded-2xl bg-surface-container-high border border-surface-variant/40 text-on-surface text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-surface-variant transition-all"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

              {/* Main Matrimonial Decision Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Pass Button */}
                <button
                  type="button"
                  onClick={(e) => handlePass(currentProfile.id, e)}
                  aria-label="Pass"
                  className="w-14 h-14 rounded-2xl bg-surface border border-surface-variant/60 text-secondary hover:bg-surface-container-low active:scale-95 flex items-center justify-center transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {/* Direct Salam Instant Connect */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const conv = dbService.createMatchConversation(currentProfile);
                    onOpenChat(conv.id);
                  }}
                  className="flex-1 h-14 rounded-2xl bg-surface-container-high text-primary border border-primary/30 text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10 active:scale-95 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">waving_hand</span>
                  <span>Direct Salam</span>
                </button>

                {/* Like / Express Interest Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(currentProfile, e)}
                  aria-label="Connect"
                  className="w-14 h-14 rounded-2xl bg-primary text-white hover:brightness-110 active:scale-95 flex items-center justify-center transition-all shadow-md shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-2xl">favorite</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans animate-fade-in">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-variant text-center flex flex-col items-center gap-4 animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-3xl">favorite_border</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Daily Free Likes Limit (50/50)</h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                You’ve used your 50 daily free likes. Watch a quick 15s sponsored ad to unlock <strong>+10 More Likes</strong> right now, or get unlimited likes with VIP!
              </p>
            </div>

            <div className="w-full space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setShowLikesLimitModal(false);
                  setShowRewardedAdModal(true);
                }}
                className="w-full py-3 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>Watch Quick Ad (+10 Likes)</span>
              </button>

              <button
                onClick={() => {
                  setShowLikesLimitModal(false);
                  setShowVipModal(true);
                }}
                className="w-full py-2.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
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
