import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Bell,
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  Crown, 
  BookOpen, 
  GraduationCap, 
  Home, 
  User, 
  FileText,
  Hand, 
  PlayCircle, 
  Loader2, 
  Heart, 
  HeartHandshake, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  FileCheck2, 
  Plane, 
  Sparkles
} from 'lucide-react';
import type { UserProfile, FilterState } from '../types';
import { FilterModal } from './FilterModal';
import { MutualMatchModal } from './MutualMatchModal';
import { ProfileDetailModal } from './ProfileDetailModal';
import { RewardedAdModal } from './RewardedAdModal';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { dbService, API_BASE } from '../services/dbService';
import { notificationService } from '../services/notificationService';
import { CountryFlag } from '../utils/countryFlags';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenFilters?: () => void;
  onOpenMatches?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  // Backward compatibility callbacks
  onSelectProfile?: (profile: UserProfile) => void;
  onLikeProfile?: (profile: UserProfile) => void;
  onDirectSalam?: (profile: UserProfile) => void;
}

type CardTab = 'deen' | 'career' | 'family' | 'bio' | 'requirements';

export const DiscoverFeed: React.FC<Props> = ({ 
  onOpenChat, 
  onOpenMatches, 
  onOpenNotifications,
  onSelectProfile,
  onLikeProfile,
  onDirectSalam 
}) => {
  const currentUser = dbService.getCurrentUser();
  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  const getTodayLikeKey = () => `serene_likes_left_${currentUser.id}_${new Date().toISOString().slice(0, 10)}`;

  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  const [directSalams, setDirectSalams] = useState<number>(() => {
    return dbService.getDirectSalams(currentUser.id);
  });

  const [showLikesLimitModal, setShowLikesLimitModal] = useState<boolean>(false);
  const [showSalamRefillModal, setShowSalamRefillModal] = useState<boolean>(false);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam'>('likes');
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(() => notificationService.hasUnread());

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<CardTab>('deen');
  
  const [filters, setFilters] = useState<FilterState>({
    minAge: 18,
    maxAge: 65,
    maxDistance: 0,
    sects: [],
    practiceLevels: [],
    marriageTimelines: [],
    languages: []
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => dbService.getDiscoverFeed(filters));
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Touch gesture tracking for Swipe-Up Biodata Drawer
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const stopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingVoice(false);
  };

  const togglePlayVoice = (e?: React.MouseEvent, voiceUrl?: string) => {
    if (e) e.stopPropagation();
    if (!voiceUrl) return;

    if (isPlayingVoice) {
      stopVoice();
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(voiceUrl);
      } else {
        audioRef.current.src = voiceUrl;
      }
      audioRef.current.onended = () => setIsPlayingVoice(false);
      audioRef.current.onerror = () => setIsPlayingVoice(false);
      audioRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch(() => {
        setIsPlayingVoice(false);
      });
    }
  };

  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  // Fetch live profiles from Cloudflare D1
  useEffect(() => {
    let isMounted = true;
    dbService.fetchLiveProfiles(filters).then(live => {
      if (!isMounted) return;
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(filters, live));
      }
    }).catch(() => {
      if (!isMounted) return;
      setProfiles(dbService.getDiscoverFeed(filters));
    });

    dbService.fetchLikesRemaining(currentUser.id).then(({ directSalams: s, isVip: v }) => {
      if (!isMounted) return;
      if (typeof s === 'number') setDirectSalams(s);
      if (typeof v === 'boolean') {
        setIsVip(v);
        localStorage.setItem(`serene_vip_${currentUser.id}`, String(v));
      }
    });

    return () => { isMounted = false; };
  }, [currentUser.id]);

  useEffect(() => {
    const handleLikesUpdate = (e: any) => {
      if (e.detail?.likesRemaining !== undefined) {
        setLikesRemaining(e.detail.likesRemaining);
      }
    };
    const handleSalamsUpdate = (e: any) => {
      if (e.detail?.directSalams !== undefined) {
        setDirectSalams(e.detail.directSalams);
      }
    };
    window.addEventListener('serene_likes_updated', handleLikesUpdate);
    window.addEventListener('serene_salams_updated', handleSalamsUpdate);
    return () => {
      window.removeEventListener('serene_likes_updated', handleLikesUpdate);
      window.removeEventListener('serene_salams_updated', handleSalamsUpdate);
    };
  }, [currentUser.id]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
    setCurrentIndex(0);
    setCurrentPhotoIdx(0);
    setIsDrawerOpen(false);
    stopVoice();
    dbService.fetchLiveProfiles(newFilters).then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(newFilters));
      }
    });
  };

  const handleLike = async (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopVoice();

    // Check daily like limit for non-VIP users
    if (!isVip && likesRemaining <= 0) {
      setShowLikesLimitModal(true);
      return;
    }

    if (!isVip) {
      const nextLikes = Math.max(0, likesRemaining - 1);
      setLikesRemaining(nextLikes);
      dbService.consumeDailyLike(currentUser.id);
      if (nextLikes === 0) {
        setTimeout(() => setShowLikesLimitModal(true), 600);
      }
    }

    if (onLikeProfile) {
      onLikeProfile(profile);
    }

    setProfiles(prev => {
      const nextRemaining = prev.filter(p => p.id !== profile.id);
      setCurrentIndex(curr => Math.max(0, Math.min(curr, nextRemaining.length - 1)));
      return nextRemaining;
    });
    setCurrentPhotoIdx(0);
    setIsDrawerOpen(false);

    const result = await dbService.sendMatchAction(profile.id, 'liked');
    if (result.isMutual) {
      setMatchedProfile(profile);
      notificationService.addNotification({
        type: 'match',
        title: `Connected with ${profile.fullName.split(' ')[0]} 🎉`,
        message: `You and ${profile.fullName} both expressed mutual interest. Chat is now unlocked!`,
        actionLabel: 'Start Chat',
        targetId: result.conversationId,
        avatarUrl: profile.photos?.[0]
      });
    } else {
      setToastMessage(`Interest expressed to ${profile.fullName.split(' ')[0]}. You will be notified when they connect!`);
      setTimeout(() => setToastMessage(null), 3500);
      notificationService.addNotification({
        type: 'like',
        title: 'Interest Expressed',
        message: `You expressed matrimonial interest in ${profile.fullName}'s biodata.`,
        actionLabel: 'View in Matches',
        avatarUrl: profile.photos?.[0]
      });
    }
  };

  const handleClaimAdLikes = async () => {
    const nextLikes = likesRemaining + 10;
    setLikesRemaining(nextLikes);
    localStorage.setItem(getTodayLikeKey(), nextLikes.toString());
    setToastMessage('+10 Extra Discover Likes added! 🎉');
    setTimeout(() => setToastMessage(null), 3500);

    try {
      await fetch(`${API_BASE}/wallet/reward-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, rewardType: 'likes' })
      });
    } catch {}
  };

  const handlePass = (profileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopVoice();
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => {
      const nextRemaining = prev.filter(p => p.id !== profileId);
      setCurrentIndex(curr => Math.max(0, Math.min(curr, nextRemaining.length - 1)));
      return nextRemaining;
    });
    setCurrentPhotoIdx(0);
    setIsDrawerOpen(false);
  };

  // Search filtering
  const filteredFeed = profiles.filter(p => {
    return (
      (p.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.profession?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  const currentProfile = filteredFeed[currentIndex] || null;

  useEffect(() => {
    if (currentProfile && onSelectProfile) {
      onSelectProfile(currentProfile);
    }
  }, [currentProfile?.id, onSelectProfile]);

  const photos = currentProfile?.photos || [];

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length <= 1) return;
    if (currentPhotoIdx < photos.length - 1) {
      setCurrentPhotoIdx(prev => prev + 1);
    } else {
      setCurrentPhotoIdx(0);
    }
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length <= 1) return;
    if (currentPhotoIdx > 0) {
      setCurrentPhotoIdx(prev => prev - 1);
    } else {
      setCurrentPhotoIdx(photos.length - 1);
    }
  };

  // Touch handlers for Vertical Swipe (Drawer Open/Close)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    // Detect Vertical Swipe Up (to open Drawer)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -40 && !isDrawerOpen) {
        setIsDrawerOpen(true);
      } else if (deltaY > 50 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <div 
      className="w-full h-full flex flex-col relative bg-stone-950 overflow-hidden font-sans select-none text-on-surface"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header: Frosted Glass Search Bar + Live Likes + Notification Bell + Filter */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md px-3.5 py-2 border-b border-outline flex items-center gap-2 shadow-subtle">
        {/* Left: Clean Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-3.5 h-3.5" />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
              setCurrentPhotoIdx(0);
            }}
            className="w-full bg-surface-variant border border-outline rounded-full py-1.5 pl-8 pr-7 text-xs text-on-surface focus:bg-white focus:border-primary outline-none transition-all placeholder:text-secondary/70 shadow-2xs"
            placeholder="Search candidates by city, profession..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentIndex(0);
                setCurrentPhotoIdx(0);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Daily Likes Counter / VIP Unlimited Badge */}
        {isVip ? (
          <span 
            className="px-2.5 py-1.5 rounded-full bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs cursor-default"
            title="Barakah VIP: Unlimited Likes Active"
          >
            <Crown className="w-3.5 h-3.5 text-pastel-amber-text" />
            <span className="hidden xs:inline">VIP</span>
            <span>Unlimited</span>
          </span>
        ) : (
          <button
            onClick={() => {
              if (likesRemaining <= 10) setShowLikesLimitModal(true);
            }}
            className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all border shadow-2xs active:scale-95 ${
              likesRemaining <= 5
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                : 'bg-pastel-rose text-primary border-pastel-rose-border hover:bg-pastel-rose/80'
            }`}
            title={`${likesRemaining} daily free likes remaining. Tap to add more.`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-primary" />
            <span>{likesRemaining} Left</span>
          </button>
        )}

        {/* Notification Bell Button */}
        <button
          onClick={() => {
            if (onOpenNotifications) {
              onOpenNotifications();
            } else {
              setShowNotificationsModal(true);
            }
            setHasUnreadNotifications(false);
          }}
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-outline text-secondary hover:text-on-surface hover:bg-surface-variant transition-all shadow-subtle relative shrink-0"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="w-2 h-2 bg-primary rounded-full absolute top-1 right-1 ring-2 ring-white" />
          )}
        </button>

        {/* Filter Option Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          aria-label="Filters"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-outline text-primary hover:bg-surface-variant transition-all shadow-subtle relative shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          {(filters.sects.length > 0 || filters.practiceLevels.length > 0) && (
            <span className="w-2 h-2 bg-primary rounded-full absolute top-1 right-1 ring-2 ring-white" />
          )}
        </button>
      </header>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="bg-primary text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-brand animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area: Habitual Story Viewport */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col justify-between">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center my-auto">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-white/70 mt-2">Loading prospective matches...</p>
          </div>
        ) : !currentProfile ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 bg-white rounded-3xl border border-outline m-4 shadow-card my-auto">
            <div className="w-14 h-14 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-3">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface">No Profiles Found</h3>
            <p className="text-xs text-secondary max-w-xs mt-1.5 leading-relaxed">
              You have viewed all candidates or your filters are very specific. Reset your filters to explore more profiles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                dbService.resetPassedProfiles(currentUser.id);
                handleApplyFilters({
                  minAge: 18,
                  maxAge: 65,
                  maxDistance: 0,
                  sects: [],
                  practiceLevels: [],
                  marriageTimelines: [],
                  languages: []
                });
              }}
              className="mt-5 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-900 select-none">
            
            {/* Story Background Visual */}
            <div className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden">
              {photos.length > 0 ? (
                <img
                  alt={currentProfile.fullName}
                  src={photos[currentPhotoIdx] || photos[0]}
                  className={`w-full h-full object-cover transition-all duration-300 select-none pointer-events-none ${
                    currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved
                      ? 'filter blur-2xl scale-110 opacity-75 brightness-90'
                      : 'scale-100'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white/50">
                  <User className="w-24 h-24 opacity-30" />
                  <span className="text-xs text-white/50 mt-2 font-medium">No Photos Uploaded</span>
                </div>
              )}

              {/* Modesty Photo Blur Indicator Overlay */}
              {currentProfile.blurPhotosByDefault && !currentProfile.photoRevealApproved && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs p-6 text-center z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-2.5 shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-sm drop-shadow-md">Modesty Photo Blur Active</h4>
                  <p className="text-white/80 text-[11px] max-w-xs mt-1 leading-snug drop-shadow-sm">
                    Photos are respectfully blurred. Full photos unlock once mutual matrimonial interest or permission is granted.
                  </p>
                </div>
              )}
            </div>

            {/* Top Overlay: Story Segment Progress Bars */}
            <div className="relative z-20 w-full pt-3 px-3">
              <div className="flex items-center gap-1.5 w-full">
                {(photos.length > 0 ? photos : ['placeholder']).map((_, pIdx) => {
                  const isActive = pIdx === currentPhotoIdx;
                  const isPast = pIdx < currentPhotoIdx;
                  return (
                    <div
                      key={pIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (photos.length > 1) setCurrentPhotoIdx(pIdx);
                      }}
                      className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden cursor-pointer backdrop-blur-xs transition-all"
                    >
                      <div
                        className={`h-full transition-all duration-200 ${
                          isActive ? 'bg-white w-full shadow-xs' : (isPast ? 'bg-white w-full' : 'w-0')
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Story Top Info Chips: Photos count / Match score & VIP */}
              <div className="flex items-center justify-between mt-2.5">
                {/* Left: Values Match badge & Photo count */}
                <div className="flex items-center gap-1.5">
                  <div className="bg-black/50 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-md">
                    <HeartHandshake className="w-3 h-3 text-emerald-400" />
                    <span>94% Match</span>
                  </div>
                  {photos.length > 1 && (
                    <span className="bg-black/50 text-white/80 border border-white/20 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md">
                      {currentPhotoIdx + 1}/{photos.length}
                    </span>
                  )}
                </div>

                {/* Right: Feature Badges (Spotlight, VIP) */}
                <div className="flex items-center gap-1.5">
                  {currentProfile.isSpotlightActive && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-brand animate-pulse">
                      <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                      <span>Featured</span>
                    </div>
                  )}
                  {currentProfile.isVip && (
                    <div className="bg-amber-500/90 text-white border border-amber-300/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-md">
                      <Crown className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                      <span>VIP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Tap Navigation Zones (Instagram / WhatsApp Story Muscle Memory) */}
            <div className="absolute inset-0 z-10 flex">
              {/* Left 35% Tap Zone: Previous Photo */}
              <div 
                onClick={handlePrevPhoto} 
                className="w-[35%] h-full cursor-pointer group"
                aria-label="Previous Photo"
              >
                {photos.length > 1 && (
                  <div className="w-full h-full flex items-center pl-2 opacity-0 group-hover:opacity-40 transition-opacity">
                    <ChevronLeft className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                )}
              </div>

              {/* Right 65% Tap Zone: Next Photo */}
              <div 
                onClick={handleNextPhoto} 
                className="w-[65%] h-full cursor-pointer group"
                aria-label="Next Photo"
              >
                {photos.length > 1 && (
                  <div className="w-full h-full flex items-center justify-end pr-2 opacity-0 group-hover:opacity-40 transition-opacity">
                    <ChevronRight className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Surface: Minimal Overlay Info + Swipe Up Peek Handle */}
            <div className="relative z-20 w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-16 pb-3 px-4 flex flex-col gap-2.5">
              
              {/* Candidate Quick Headline: Name, Age, Location + Flag, Voice Greeting */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight drop-shadow-md truncate flex items-center gap-1.5">
                      <span>{currentProfile.fullName.split(' ')[0]}, {currentProfile.age}</span>
                      {currentProfile.isVip && (
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </h2>
                  </div>

                  {/* Location with Real National Flag Placed Right Under Name */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-xs font-semibold border border-white/20 shadow-xs">
                      <CountryFlag 
                        location={currentProfile.location} 
                        country={currentProfile.country} 
                        citizenship={currentProfile.citizenship}
                        flagClassName="w-4.5 h-3.5"
                      />
                      <span className="truncate">{currentProfile.location}</span>
                      {typeof currentProfile.distanceKm === 'number' && (
                        <span className="text-emerald-300 text-[10px] font-bold">· {currentProfile.distanceKm}km</span>
                      )}
                    </div>
                  </div>

                  {/* Profession & Work Arrangement */}
                  <p className="text-white/90 text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-1 drop-shadow-sm">
                    <span className="truncate">{currentProfile.profession}</span>
                    {currentProfile.workArrangement && (
                      <span className="bg-white/20 text-white border border-white/30 px-2 py-0.2 rounded-full text-[9px] uppercase font-bold tracking-wider shrink-0 backdrop-blur-xs">
                        {currentProfile.workArrangement.replace('_', ' ')}
                      </span>
                    )}
                  </p>
                </div>

                {/* Interactive Voice Intro Pill Button */}
                {currentProfile.voiceGreetingUrl ? (
                  <button
                    type="button"
                    onClick={(e) => togglePlayVoice(e, currentProfile.voiceGreetingUrl)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-md active:scale-95 shrink-0 ${
                      isPlayingVoice
                        ? 'bg-sky-500 text-white border-sky-400 animate-pulse'
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md'
                    }`}
                    title="Play Voice Greeting"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingVoice ? 'Playing...' : `Voice (${currentProfile.voiceGreetingDuration ? `${currentProfile.voiceGreetingDuration}s` : 'Intro'})`}</span>
                    {isPlayingVoice && (
                      <span className="flex items-center gap-0.5 ml-0.5">
                        <span className="w-0.5 h-2 bg-white animate-pulse" />
                        <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-white animate-pulse delay-150" />
                      </span>
                    )}
                  </button>
                ) : (
                  <span 
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-white/20 bg-black/40 text-white/50 flex items-center gap-1 shrink-0 backdrop-blur-xs select-none"
                    title="Candidate has not recorded a voice introduction"
                  >
                    <VolumeX className="w-3 h-3 text-white/40" />
                    <span>No Voice</span>
                  </span>
                )}
              </div>

              {/* Minimal Matrimonial Badges: Sect, Namaz, Marriage Timeline */}
              <div className="flex items-center gap-1.5 flex-wrap text-white/90 text-xs">
                <span className="bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{currentProfile.religiousProfile?.prayerFrequency || '5x Daily Prayers'}</span>
                </span>

                <span className="bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 text-sky-200">
                  <BookOpen className="w-3 h-3 text-sky-300" />
                  <span>{currentProfile.religiousProfile?.sect || 'Sunni'}</span>
                </span>

                {currentProfile.marriageTimeline && (
                  <span className="bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-pastel-rose capitalize">
                    {currentProfile.marriageTimeline.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Habitual Peek Handle: "Swipe Up for Full Biodata" */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-full py-1 flex flex-col items-center justify-center text-white/80 hover:text-white transition-all active:scale-98 group cursor-pointer"
                title="Swipe up or tap to read complete matrimonial details"
              >
                <ChevronUp className="w-4 h-4 text-white/70 animate-bounce group-hover:text-white" />
                <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-0.5 rounded-full border border-white/25 shadow-sm flex items-center gap-1 text-white">
                  <FileText className="w-3 h-3" />
                  <span>Swipe up for Full Biodata</span>
                </span>
              </button>

              {/* Floating Matrimonial Action Bar (Pass, Direct Salam, Connect) */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Pass Button */}
                <button
                  type="button"
                  onClick={(e) => handlePass(currentProfile.id, e)}
                  aria-label="Pass"
                  className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-rose-500/80 hover:border-rose-400 active:scale-90 flex items-center justify-center transition-all shadow-lg"
                  title="Pass"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Direct Salam Button */}
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    stopVoice();
                    if (onDirectSalam) {
                      onDirectSalam(currentProfile);
                    }
                    if (directSalams <= 0) {
                      setShowSalamRefillModal(true);
                      return;
                    }
                    await dbService.consumeDirectSalam(currentUser.id);
                    const conv = dbService.createMatchConversation(currentProfile);
                    notificationService.addNotification({
                      type: 'salam',
                      title: 'Direct Salam Sent',
                      message: `Your Direct Salam pass was sent to ${currentProfile.fullName}.`,
                      actionLabel: 'Open Conversation',
                      targetId: conv.id,
                      avatarUrl: currentProfile.photos?.[0]
                    });
                    onOpenChat(conv.id);
                  }}
                  className="flex-1 h-13 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/30 active:scale-95 transition-all shadow-lg"
                  title="Send Direct Salam (instant message without waiting for mutual like)"
                >
                  <Hand className="w-4 h-4 text-emerald-300" />
                  <span>Direct Salam</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    directSalams > 0 ? 'bg-emerald-500 text-white' : 'bg-white/30 text-white/80'
                  }`}>
                    {directSalams} Left
                  </span>
                </button>

                {/* Connect / Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(currentProfile, e)}
                  aria-label="Connect"
                  className="w-13 h-13 rounded-2xl bg-primary text-white hover:bg-primary-dark active:scale-90 flex items-center justify-center transition-all shadow-brand border border-primary-light"
                  title="Express Interest / Like"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SWIPE-UP BIODATA BOTTOM SHEET DRAWER                         */}
            {/* ============================================================ */}
            {isDrawerOpen && (
              <div 
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
                onClick={() => setIsDrawerOpen(false)}
              >
                <div 
                  className="w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl border-t border-outline flex flex-col max-h-[85vh] overflow-hidden animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Drag Pill & Header */}
                  <div className="pt-2 px-4 pb-2 border-b border-outline flex flex-col items-center">
                    <div className="w-12 h-1.5 bg-secondary/30 rounded-full mb-2 cursor-grab" onClick={() => setIsDrawerOpen(false)} />
                    
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <CountryFlag 
                          location={currentProfile.location} 
                          country={currentProfile.country} 
                          citizenship={currentProfile.citizenship}
                        />
                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-base text-on-surface truncate">
                            {currentProfile.fullName}, {currentProfile.age}
                          </h3>
                          <span className="text-[11px] text-secondary block truncate">
                            {currentProfile.profession} · {currentProfile.location}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-on-surface flex items-center justify-center transition-all"
                        aria-label="Close Biodata Drawer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Drawer Quick Navigation Tabs */}
                  <div className="p-1.5 bg-surface-variant/70 border-b border-outline flex gap-1 overflow-x-auto">
                    {[
                      { id: 'deen', label: 'Deen & Taqwa', Icon: BookOpen, activeColor: 'bg-white text-emerald-700 border-emerald-300 shadow-2xs' },
                      { id: 'career', label: 'Career', Icon: GraduationCap, activeColor: 'bg-white text-sky-700 border-sky-300 shadow-2xs' },
                      { id: 'family', label: 'Family', Icon: Home, activeColor: 'bg-white text-amber-700 border-amber-300 shadow-2xs' },
                      { id: 'bio', label: 'Bio & Values', Icon: User, activeColor: 'bg-white text-purple-700 border-purple-300 shadow-2xs' },
                      { id: 'requirements', label: 'Seeking', Icon: Heart, activeColor: 'bg-white text-rose-700 border-rose-300 shadow-2xs' }
                    ].map(({ id, label, Icon, activeColor }) => {
                      const isActive = activeTab === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setActiveTab(id as CardTab)}
                          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition-all border shrink-0 ${
                            isActive
                              ? activeColor
                              : 'border-transparent text-secondary hover:text-on-surface hover:bg-white/40'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Drawer Scrollable Content Body */}
                  <div className="p-4 overflow-y-auto space-y-3 min-h-[220px]">
                    
                    {/* 1. DEEN & TAQWA TAB */}
                    {activeTab === 'deen' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-pastel-mint p-3 rounded-2xl border border-pastel-mint-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Daily Prayers</span>
                              <strong className="text-on-surface text-xs truncate block">{currentProfile.religiousProfile?.prayerFrequency || '5 times daily'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-mint p-3 rounded-2xl border border-pastel-mint-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Sect & Madhhab</span>
                              <strong className="text-on-surface text-xs truncate block">{currentProfile.religiousProfile?.sect} · {currentProfile.religiousProfile?.madhhab || 'Hanafi'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-mint p-3 rounded-2xl border border-pastel-mint-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Dietary Standard</span>
                              <strong className="text-on-surface text-xs truncate block">{currentProfile.religiousProfile?.halalDiet || 'Strictly Halal'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-mint p-3 rounded-2xl border border-pastel-mint-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Modesty / Attire</span>
                              <strong className="text-on-surface text-xs capitalize truncate block">{currentProfile.religiousProfile?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                            </div>
                          </div>
                        </div>

                        {currentProfile.religiousProfile?.deenRelationshipBio && (
                          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                            <span className="font-bold text-[10px] uppercase text-emerald-700 block mb-1">Relationship with Deen</span>
                            "{currentProfile.religiousProfile.deenRelationshipBio}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. CAREER & EDUCATION TAB */}
                    {activeTab === 'career' && (
                      <div className="space-y-2.5 animate-fade-in text-xs">
                        <div className="flex items-center gap-3 bg-pastel-sky p-3 rounded-2xl border border-pastel-sky-border">
                          <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-sky-700" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] text-pastel-sky-text font-bold uppercase block">Education</span>
                            <span className="font-bold text-on-surface text-xs truncate block">{currentProfile.education} {currentProfile.university ? `· ${currentProfile.university}` : ''}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-pastel-sky p-3 rounded-2xl border border-pastel-sky-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4 text-sky-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sky-text font-bold uppercase block truncate">Work Setup</span>
                              <strong className="text-on-surface capitalize text-xs truncate block">{currentProfile.workArrangement?.replace('_', ' ') || 'Full-Time'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-sky p-3 rounded-2xl border border-pastel-sky-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                              <Briefcase className="w-4 h-4 text-indigo-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sky-text font-bold uppercase block truncate">Income Bracket</span>
                              <strong className="text-on-surface text-xs capitalize truncate block">{currentProfile.incomeBracket ? currentProfile.incomeBracket.replace('_', ' ') : 'Professional'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. FAMILY & LIVING TAB */}
                    {activeTab === 'family' && (
                      <div className="space-y-2.5 animate-fade-in text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-pastel-sand p-3 rounded-2xl border border-pastel-sand-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                              <Home className="w-4 h-4 text-amber-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Living</span>
                              <strong className="text-primary capitalize text-xs truncate block">{currentProfile.livingPreference?.replace('_', ' ') || 'Independent'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-sand p-3 rounded-2xl border border-pastel-sand-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                              <FileCheck2 className="w-4 h-4 text-amber-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Marital Status</span>
                              <strong className="text-on-surface text-xs capitalize truncate block">{currentProfile.maritalStatus ? currentProfile.maritalStatus.replace('_', ' ') : 'Never Married'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-sand p-3 rounded-2xl border border-pastel-sand-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                              <CountryFlag 
                                location={currentProfile.location} 
                                country={currentProfile.country} 
                                citizenship={currentProfile.citizenship}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Citizenship</span>
                              <strong className="text-on-surface text-xs truncate block">{currentProfile.citizenship || 'Citizen'}</strong>
                            </div>
                          </div>

                          <div className="bg-pastel-sand p-3 rounded-2xl border border-pastel-sand-border flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                              <Plane className="w-4 h-4 text-sky-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Relocation</span>
                              <strong className="text-on-surface text-xs truncate block">{currentProfile.willingnessToRelocate === 'willing' ? 'Open to Relocate' : 'Local Only'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. BIO & VALUES TAB */}
                    {activeTab === 'bio' && (
                      <div className="space-y-2.5 animate-fade-in text-xs">
                        <div className="bg-pastel-lavender p-3.5 rounded-2xl border border-pastel-lavender-border relative">
                          <span className="absolute top-1.5 right-2.5 text-3xl font-serif text-purple-300 select-none">“</span>
                          <p className="text-xs text-on-surface leading-relaxed italic pr-4">
                            {currentProfile.bio || currentProfile.religiousProfile?.deenRelationshipBio || "Seeking a righteous partner on the Sunnah to complete half my deen."}
                          </p>
                        </div>

                        {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {currentProfile.hobbies.map((h, i) => (
                              <span key={i} className="bg-pastel-rose text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-pastel-rose-border shadow-2xs flex items-center gap-1">
                                <Bookmark className="w-2.5 h-2.5 text-primary" />
                                <span>{h.replace(/[^\w\s()-]/gi, '').trim()}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 5. SEEKING / PARTNER REQUIREMENTS TAB */}
                    {activeTab === 'requirements' && (
                      <div className="space-y-2.5 animate-fade-in text-xs">
                        <div className="bg-pastel-amber p-3 rounded-2xl border border-pastel-amber-border flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                            <Heart className="w-4 h-4 text-amber-700 fill-amber-700/20" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] text-pastel-amber-text font-bold uppercase block truncate">Seeking Age Preference</span>
                            <strong className="text-on-surface text-xs truncate block">
                              {currentProfile.partnerRequirements?.minAge && currentProfile.partnerRequirements?.maxAge
                                ? `${currentProfile.partnerRequirements.minAge} - ${currentProfile.partnerRequirements.maxAge} yrs`
                                : 'Compatible Age Range'}
                            </strong>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                          <span className="font-bold text-[10px] uppercase text-amber-800 block mb-1">Ideal Spouse Description</span>
                          <p className="text-xs text-on-surface leading-relaxed italic">
                            "{currentProfile.partnerRequirements?.description || 'Seeking a practicing, kind-hearted spouse with good Islamic manners.'}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Bottom Actions: Connect or Pass */}
                  <div className="p-3.5 bg-surface-variant/40 border-t border-outline flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handlePass(currentProfile.id, e)}
                      className="flex-1 py-3 rounded-xl bg-white border border-outline text-secondary hover:text-error hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-subtle"
                    >
                      <X className="w-4 h-4" />
                      <span>Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleLike(currentProfile, e)}
                      className="flex-2 py-3 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-brand hover:bg-primary-dark active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Express Matrimonial Interest</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              <Heart className="w-6 h-6 text-primary fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">
                {likesRemaining <= 0 ? 'Daily Likes Limit Reached' : `${likesRemaining} Likes Remaining`}
              </h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                {likesRemaining <= 0 
                  ? 'You have used your daily free likes. Watch a quick 15s sponsored ad to unlock +10 More Likes right now, or get unlimited likes with Barakah VIP!'
                  : 'Want more likes today? Watch a quick 15s sponsored ad for +10 Extra Likes, or upgrade to VIP for unlimited daily likes.'}
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
                <span>Upgrade to VIP (Unlimited Likes)</span>
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

      {/* Out of Direct Salam Passes Modal */}
      {showSalamRefillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 font-sans animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-outline text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pastel-rose text-primary flex items-center justify-center">
              <Hand className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">
                No Direct Salam Passes Left
              </h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Direct Salam lets you reach out directly to candidates without waiting for a mutual match. Watch 3 short ads to earn 1 free pass, or get 20 passes with Barakah VIP!
              </p>
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowSalamRefillModal(false);
                  setAdRewardType('salam');
                  setShowRewardedAdModal(true);
                }}
                className="w-full py-3 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Watch Ads (Earn Free Pass)</span>
              </button>

              <button
                onClick={() => {
                  setShowSalamRefillModal(false);
                  setShowVipModal(true);
                }}
                className="w-full py-2.5 rounded-full bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border hover:bg-pastel-amber/80 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-pastel-amber-text" />
                <span>Get Barakah VIP (20 Salams Included)</span>
              </button>

              <button
                onClick={() => setShowSalamRefillModal(false)}
                className="text-[11px] text-secondary hover:text-on-surface pt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewarded Ad Modal */}
      {showRewardedAdModal && (
        <RewardedAdModal
          userId={currentUser.id}
          rewardType={adRewardType}
          isOpen={showRewardedAdModal}
          onClose={() => setShowRewardedAdModal(false)}
          onRewardClaimed={() => {
            if (adRewardType === 'likes') {
              handleClaimAdLikes();
            } else {
              dbService.fetchLikesRemaining(currentUser.id).then(({ directSalams: s }) => {
                if (typeof s === 'number') setDirectSalams(s);
              });
            }
          }}
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

      {/* Notifications Center Native Full-Screen View */}
      {showNotificationsModal && (
        <NotificationsScreen
          isOpen={showNotificationsModal}
          onBack={() => setShowNotificationsModal(false)}
          onNavigateToMatches={onOpenMatches}
          onNavigateToChat={(convId) => onOpenChat(convId || '')}
        />
      )}
    </div>
  );
};

export default DiscoverFeed;
