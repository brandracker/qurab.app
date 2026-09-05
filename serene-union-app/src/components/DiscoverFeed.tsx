import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  SlidersHorizontal, 
  Bell,
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Camera, 
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
  Plane
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


interface Props {
  onOpenChat: (convId: string) => void;
  onOpenFilters?: () => void;
  onOpenMatches?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

type CardTab = 'deen' | 'career' | 'family' | 'bio' | 'requirements';

export const DiscoverFeed: React.FC<Props> = ({ onOpenChat, onOpenMatches, onOpenNotifications }) => {
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
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(() => notificationService.hasUnread());


  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayVoice = (e: React.MouseEvent, voiceUrl?: string) => {
    e.stopPropagation();
    if (!voiceUrl) return;

    if (isPlayingVoice) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingVoice(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(voiceUrl);
      } else {
        audioRef.current.src = voiceUrl;
      }
      audioRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch(() => {
        setIsPlayingVoice(true);
        setTimeout(() => setIsPlayingVoice(false), 3500);
      });

      audioRef.current.onended = () => {
        setIsPlayingVoice(false);
      };
    }
  };


  useEffect(() => {
    setIsLoading(true);
    dbService.fetchLiveProfiles(filters).then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(filters, live));
      }
    }).finally(() => {
      setIsLoading(false);
    });

    const handleSync = () => {
      setProfiles(dbService.getDiscoverFeed(filters));
    };
    window.addEventListener('serene_activity_updated', handleSync);
    window.addEventListener('serene_block_updated', handleSync);

    // Sync live notifications from Cloudflare D1 immediately and every 20s
    notificationService.syncLiveNotifications();
    const notifTimer = setInterval(() => {
      notificationService.syncLiveNotifications();
    }, 20000);

    const handleNotifsUpdate = () => {
      setHasUnreadNotifications(notificationService.hasUnread());
    };
    window.addEventListener('serene_notifications_updated', handleNotifsUpdate);

    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => {
      clearInterval(notifTimer);
      window.removeEventListener('serene_activity_updated', handleSync);
      window.removeEventListener('serene_block_updated', handleSync);
      window.removeEventListener('serene_notifications_updated', handleNotifsUpdate);
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
    };
  }, [currentUser.id]);

  // Live Cloudflare D1 Wallet & Likes Quota Sync
  useEffect(() => {
    dbService.fetchLikesRemaining(currentUser.id).then(({ likesRemaining: liveRem, isVip: liveVip }) => {
      setLikesRemaining(liveRem);
      setIsVip(liveVip);
    });

    const handleLikesUpdate = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === currentUser.id) {
        if (typeof e.detail?.likesRemaining === 'number') {
          setLikesRemaining(e.detail.likesRemaining);
        }
      }
    };
    window.addEventListener('serene_likes_updated', handleLikesUpdate);
    return () => window.removeEventListener('serene_likes_updated', handleLikesUpdate);
  }, [currentUser.id]);


  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
    setCurrentIndex(0);
    setCurrentPhotoIdx(0);
    dbService.fetchLiveProfiles(newFilters).then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(newFilters));
      }
    });
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
      dbService.consumeDailyLike(currentUser.id);
      if (nextLikes === 0) {
        setTimeout(() => setShowLikesLimitModal(true), 600);
      }
    }

    setProfiles(prev => {
      const nextRemaining = prev.filter(p => p.id !== profile.id);
      setCurrentIndex(curr => Math.max(0, Math.min(curr, nextRemaining.length - 1)));
      return nextRemaining;
    });
    setCurrentPhotoIdx(0);
    setActiveTab('deen');

    // Playful matrimonial confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF2560', '#FCD34D', '#F472B6', '#10B981']
    });

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
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => {
      const nextRemaining = prev.filter(p => p.id !== profileId);
      setCurrentIndex(curr => Math.max(0, Math.min(curr, nextRemaining.length - 1)));
      return nextRemaining;
    });
    setCurrentPhotoIdx(0);
    setActiveTab('deen');
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

  const photos = currentProfile?.photos || [];

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
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden font-sans select-none text-on-surface">
      {/* Top Header: Search Bar + Notification Bell + Filter Option (No Logos / Counters) */}
      <header className="w-full sticky top-0 z-40 bg-white px-4 py-2.5 border-b border-outline flex items-center gap-2.5 shadow-subtle">
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
              className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col flex-1 justify-between gap-2.5 animate-fade-in">
            {/* Card Shell */}
            <article className="w-full bg-white rounded-3xl overflow-hidden border border-outline shadow-card flex flex-col">
              {/* Top Photo Header (Enlarged & Prominent) */}
              <div className="relative w-full h-[390px] sm:h-[410px] bg-surface-variant overflow-hidden group">

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

                {/* Top Location Pill & 94% Values Match (Playful Frosted Glass) */}
                <div className="absolute top-4 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline/80 shadow-subtle">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{currentProfile.location}</span>
                      {typeof currentProfile.distanceKm === 'number' && (
                        <span className="text-primary font-bold">· {currentProfile.distanceKm} km</span>
                      )}
                    </div>
                    {photos.length > 1 && (
                      <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-secondary text-[10px] font-bold flex items-center gap-1 border border-outline/80 shadow-subtle">
                        <Camera className="w-3 h-3 text-secondary" />
                        <span>{currentPhotoIdx + 1}/{photos.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Top Right: VIP Badge or Playful 94% Values Match Pill */}
                  <div className="flex items-center gap-1.5">
                    {currentProfile.isVip ? (
                      <div className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-subtle">
                        <Crown className="w-3.5 h-3.5 text-pastel-amber-text fill-pastel-amber-text/30" />
                        <span>VIP</span>
                      </div>
                    ) : (
                      <div className="bg-white/90 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-subtle">
                        <HeartHandshake className="w-3 h-3 text-emerald-600" />
                        <span>94% Match</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Name & Timeline Bar (Playful Frosted Glassmorphism) */}
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3.5 flex items-end justify-between text-on-surface border-t border-outline shadow-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl font-bold leading-tight flex items-center gap-1.5 text-on-surface">
                        <span>{currentProfile.fullName.split(' ')[0]}, {currentProfile.age}</span>
                        {currentProfile.isVip && (
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                        )}
                      </h2>

                      {/* Playful Voice Intro Button (or muted state if no voice recorded) */}
                      {currentProfile.voiceGreetingUrl ? (
                        <button
                          type="button"
                          onClick={(e) => togglePlayVoice(e, currentProfile.voiceGreetingUrl)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 shadow-2xs active:scale-95 ${
                            isPlayingVoice
                              ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                              : 'bg-pastel-sky text-sky-700 border-pastel-sky-border hover:bg-sky-100'
                          }`}
                          title="Play Voice Greeting"
                        >
                          <Volume2 className={`w-3 h-3 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
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
                          className="px-2 py-0.5 rounded-full text-[9px] font-medium border border-outline/50 bg-surface-variant text-secondary/50 flex items-center gap-1 select-none"
                          title="Candidate has not recorded a voice introduction"
                        >
                          <VolumeX className="w-2.5 h-2.5 text-secondary/40" />
                          <span>No Voice</span>
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-secondary font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="text-on-surface font-semibold">{currentProfile.profession}</span>
                      {currentProfile.workArrangement && (
                        <span className="bg-pastel-sky text-pastel-sky-text border border-pastel-sky-border px-2 py-0.2 rounded-full text-[9px] uppercase font-bold tracking-wider">
                          {currentProfile.workArrangement}
                        </span>
                      )}
                    </p>
                  </div>

                  {currentProfile.marriageTimeline && (
                    <span className="bg-pastel-rose text-primary border border-pastel-rose-border text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs capitalize">
                      {currentProfile.marriageTimeline.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* In-Card Deep Navigation Tabs (Playful Floating Rounded Pills) */}
              <div className="p-1.5 bg-surface-variant/70 border-b border-outline flex gap-1.5">
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
                      className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition-all border active:scale-95 ${
                        isActive
                          ? activeColor
                          : 'border-transparent text-secondary hover:text-on-surface hover:bg-white/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic In-Card Content Body based on Tab (Pastel Bento Cards with Micro Icons) */}
              <div className="p-3.5 bg-white min-h-[140px] flex flex-col justify-center">
                {/* 1. DEEN & TAQWA TAB */}
                {activeTab === 'deen' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-pastel-mint p-2.5 rounded-xl border border-pastel-mint-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Daily Prayers</span>
                          <strong className="text-on-surface text-[11px] truncate block">{currentProfile.religiousProfile?.prayerFrequency || '5 times daily'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-mint p-2.5 rounded-xl border border-pastel-mint-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Sect & Madhhab</span>
                          <strong className="text-on-surface text-[11px] truncate block">{currentProfile.religiousProfile?.sect} · {currentProfile.religiousProfile?.madhhab || 'Hanafi'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-mint p-2.5 rounded-xl border border-pastel-mint-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Dietary Standard</span>
                          <strong className="text-on-surface text-[11px] truncate block">{currentProfile.religiousProfile?.halalDiet || 'Strictly Halal'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-mint p-2.5 rounded-xl border border-pastel-mint-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-mint-text font-bold uppercase block truncate">Modesty / Attire</span>
                          <strong className="text-on-surface text-[11px] capitalize truncate block">{currentProfile.religiousProfile?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CAREER & PEDIGREE TAB */}
                {activeTab === 'career' && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center gap-2.5 bg-pastel-sky p-2.5 rounded-xl border border-pastel-sky-border hover:shadow-subtle transition-all">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-sky-700" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] text-pastel-sky-text font-bold uppercase block">Education</span>
                        <span className="font-semibold text-on-surface truncate block">{currentProfile.education} {currentProfile.university ? `· ${currentProfile.university}` : ''}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-pastel-sky p-2.5 rounded-xl border border-pastel-sky-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-sky-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sky-text font-bold uppercase block truncate">Work Setup</span>
                          <strong className="text-on-surface capitalize text-[11px] truncate block">{currentProfile.workArrangement?.replace('_', ' ') || 'Full-Time'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-sky p-2.5 rounded-xl border border-pastel-sky-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sky-text font-bold uppercase block truncate">Income</span>
                          <strong className="text-on-surface text-[11px] capitalize truncate block">{currentProfile.incomeBracket ? currentProfile.incomeBracket.replace('_', ' ') : 'Professional'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FAMILY & HOME TAB */}
                {activeTab === 'family' && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-pastel-sand p-2.5 rounded-xl border border-pastel-sand-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                          <Home className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Living</span>
                          <strong className="text-primary capitalize text-[11px] truncate block">{currentProfile.livingPreference?.replace('_', ' ') || 'Independent'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-sand p-2.5 rounded-xl border border-pastel-sand-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Marital Status</span>
                          <strong className="text-on-surface text-[11px] capitalize truncate block">{currentProfile.maritalStatus ? currentProfile.maritalStatus.replace('_', ' ') : 'Never Married'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-sand p-2.5 rounded-xl border border-pastel-sand-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Citizenship</span>
                          <strong className="text-on-surface text-[11px] truncate block">{currentProfile.citizenship || 'Citizen'}</strong>
                        </div>
                      </div>

                      <div className="bg-pastel-sand p-2.5 rounded-xl border border-pastel-sand-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                          <Plane className="w-3.5 h-3.5 text-sky-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-sand-text font-bold uppercase block truncate">Relocation</span>
                          <strong className="text-on-surface text-[11px] truncate block">{currentProfile.willingnessToRelocate === 'willing' ? 'Open to Relocate' : 'Local Only'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BIO & REFLECTIONS TAB */}
                {activeTab === 'bio' && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    <div className="bg-pastel-lavender p-3 rounded-xl border border-pastel-lavender-border relative hover:shadow-subtle transition-all">
                      <span className="absolute top-1.5 right-2.5 text-2xl font-serif text-purple-300 select-none">“</span>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 italic pr-3">
                        {currentProfile.bio || currentProfile.religiousProfile?.deenRelationshipBio || "Seeking a righteous partner on the Sunnah to complete half my deen."}
                      </p>
                    </div>

                    {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {currentProfile.hobbies.slice(0, 4).map((h, i) => (
                          <span key={i} className="bg-pastel-rose text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-pastel-rose-border shadow-2xs flex items-center gap-1">
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
                  <div className="space-y-2 animate-fade-in text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-pastel-amber p-2.5 rounded-xl border border-pastel-amber-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                          <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700/20" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-amber-text font-bold uppercase block truncate">Seeking Age</span>
                          <strong className="text-on-surface text-[11px] truncate block">
                            {currentProfile.partnerRequirements?.minAge && currentProfile.partnerRequirements?.maxAge
                              ? `${currentProfile.partnerRequirements.minAge} - ${currentProfile.partnerRequirements.maxAge} yrs`
                              : '20 - 35 yrs'}
                          </strong>
                        </div>
                      </div>

                      <div className="bg-pastel-amber p-2.5 rounded-xl border border-pastel-amber-border flex items-center gap-2 hover:shadow-subtle transition-all">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] text-pastel-amber-text font-bold uppercase block truncate">Practice Level</span>
                          <strong className="text-on-surface text-[11px] capitalize truncate block">
                            {currentProfile.partnerRequirements?.practiceLevel ? currentProfile.partnerRequirements.practiceLevel.replace(/_/g, ' ') : 'Practicing'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pastel-sand/80 p-2.5 rounded-xl border border-pastel-sand-border relative hover:shadow-subtle transition-all">
                      <p className="text-[11px] text-on-surface leading-relaxed italic line-clamp-2">
                        "{currentProfile.partnerRequirements?.description || 'Seeking a practicing, kind-hearted spouse with good Islamic manners.'}"
                      </p>
                    </div>
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
                    confetti({
                      particleCount: 30,
                      spread: 60,
                      origin: { y: 0.8 },
                      colors: ['#38BDF8', '#818CF8', '#FF2560']
                    });
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



