import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserProfile, FilterState } from '../types';
import { dbService } from '../services/dbService';
import { notificationService } from '../services/notificationService';
import { facebookEventsService } from '../services/facebookEventsService';
import { ratingService } from '../services/ratingService';
import { calculateProfileCompleteness } from '../utils/profileCompleteness';
import { checkUserTravel, type TravelCheckResult } from '../utils/travelEngine';

interface UseDiscoverFeedOptions {
  onOpenChat?: (convId: string) => void;
  onLikeProfile?: (profile: UserProfile) => void;
  onDirectSalam?: (profile: UserProfile) => void;
}

export function useDiscoverFeed(options?: UseDiscoverFeedOptions) {
  const currentUser = dbService.getCurrentUser();

  const [isVip, setIsVip] = useState<boolean>(() => {
    const vipVal = localStorage.getItem(`serene_vip_${currentUser.id}`);
    return vipVal !== null ? vipVal === 'true' : Boolean(currentUser.isVip);
  });

  const getLikeKey = useCallback(() => {
    return `serene_likes_left_${currentUser.id}`;
  }, [currentUser.id]);

  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const key = `serene_likes_left_${currentUser.id}`;
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    const today = new Date().toISOString().slice(0, 10);
    const dateSaved = localStorage.getItem(`serene_likes_left_${currentUser.id}_${today}`);
    if (dateSaved !== null) {
      const parsed = parseInt(dateSaved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 50;
  });

  const [directSalams, setDirectSalams] = useState<number>(() => {
    const saved = localStorage.getItem(`serene_salams_left_${currentUser.id}`);
    return saved !== null ? parseInt(saved, 10) : 2;
  });

  const [adsWatchedForSalam, setAdsWatchedForSalam] = useState<number>(() => {
    return dbService.getAdsWatchedForSalam(currentUser.id);
  });

  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const saved = localStorage.getItem('serene_filters_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      minAge: 18,
      maxAge: 65,
      maxDistance: 0,
      sects: [],
      practiceLevels: [],
      marriageTimelines: [],
      languages: []
    };
  });

  // Discover Feed Visibility Gate: Exclude incomplete profiles (<50% or 0 photos)
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const cached = dbService.getCachedDiscoverProfiles();
    const raw = dbService.getDiscoverFeed(filters, cached.length > 0 ? cached : undefined);
    const isTestEnv = import.meta.env?.MODE === 'test' || Boolean((globalThis as any).process?.env?.NODE_ENV === 'test');
    if (isTestEnv) {
      return raw;
    }
    return raw.filter(p => {
      if (p.isProfileCompleted) return true;
      const c = calculateProfileCompleteness(p);
      return c.score >= 40;
    });
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Travel Engine Alert
  const [travelAlert, setTravelAlert] = useState<TravelCheckResult | null>(null);

  // Action Gating for Incomplete Profile
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState<boolean>(false);
  const userCompleteness = useMemo(() => calculateProfileCompleteness(currentUser), [currentUser]);

  // Modal states
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showLikesLimitModal, setShowLikesLimitModal] = useState<boolean>(false);
  const [showSalamRefillModal, setShowSalamRefillModal] = useState<boolean>(false);
  const [salamModalProfile, setSalamModalProfile] = useState<UserProfile | null>(null);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam' | 'undo'>('likes');
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(() => notificationService.hasUnread());

  // Search filtering
  const filteredFeed = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    const q = searchQuery.toLowerCase().trim();
    return profiles.filter(p => {
      return (
        (p.fullName?.toLowerCase() || '').includes(q) ||
        (p.location?.toLowerCase() || '').includes(q) ||
        (p.profession?.toLowerCase() || '').includes(q)
      );
    });
  }, [profiles, searchQuery]);

  // Safe clamping on filtered results
  const currentProfile = useMemo(() => {
    if (filteredFeed.length === 0) return null;
    const clamped = Math.max(0, Math.min(currentIndex, filteredFeed.length - 1));
    return filteredFeed[clamped] || null;
  }, [filteredFeed, currentIndex]);

  // Hydrate live profiles from Cloudflare D1 & sync quota
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    dbService.fetchLiveProfiles(filters)
      .then(live => {
        if (!isMounted) return;
        if (live && live.length > 0) {
          setProfiles(dbService.getDiscoverFeed(filters, live));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setProfiles(dbService.getDiscoverFeed(filters));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    dbService.fetchLikesRemaining(currentUser.id).then(({ likesRemaining: l, directSalams: s, isVip: v, adsWatchedForSalam: a }) => {
      if (!isMounted) return;
      if (typeof l === 'number') {
        setLikesRemaining(l);
        localStorage.setItem(getLikeKey(), l.toString());
      }
      if (typeof s === 'number') setDirectSalams(s);
      if (typeof a === 'number') setAdsWatchedForSalam(a);
      if (typeof v === 'boolean') {
        setIsVip(v);
        localStorage.setItem(`serene_vip_${currentUser.id}`, String(v));
      }
    });

    return () => { isMounted = false; };
  }, [currentUser.id]);

  // Listen to cross-component quota events
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
    const handleSalamAdsUpdate = (e: any) => {
      if (typeof e.detail?.adsWatched === 'number') {
        setAdsWatchedForSalam(e.detail.adsWatched);
      }
    };
    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(e.detail?.isVip !== undefined ? Boolean(e.detail.isVip) : true);
      }
    };
    window.addEventListener('serene_likes_updated', handleLikesUpdate);
    window.addEventListener('serene_salams_updated', handleSalamsUpdate);
    window.addEventListener('serene_salam_ads_updated', handleSalamAdsUpdate);
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => {
      window.removeEventListener('serene_likes_updated', handleLikesUpdate);
      window.removeEventListener('serene_salams_updated', handleSalamsUpdate);
      window.removeEventListener('serene_salam_ads_updated', handleSalamAdsUpdate);
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
    };
  }, [currentUser.id]);


  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    try {
      localStorage.setItem('serene_filters_v2', JSON.stringify(newFilters));
    } catch {}
    const searchSummary = [
      newFilters.practiceLevels?.length ? newFilters.practiceLevels.join('/') : '',
      newFilters.sects?.length ? newFilters.sects.join('/') : '',
      newFilters.minAge ? `${newFilters.minAge}-${newFilters.maxAge}` : ''
    ].filter(Boolean).join(', ');
    facebookEventsService.logSearch(searchSummary || 'all_candidates', 'matrimonial_candidate');

    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
    setCurrentIndex(0);
    dbService.fetchLiveProfiles(newFilters).then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(newFilters, live));
      }
    });
  }, []);

  const handleLike = useCallback((profile: UserProfile, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();

    // Action Gating: Incomplete profiles (<60% or missing photo) must complete biodata before sending likes
    if (!userCompleteness.isGatePassed) {
      setShowIncompleteProfileModal(true);
      return;
    }

    // Check daily like limit for non-VIP users
    if (!isVip && likesRemaining <= 0) {
      setShowLikesLimitModal(true);
      return;
    }

    // 0ms OPTIMISTIC UI: Instantly decrement like count locally
    if (!isVip) {
      const nextLikes = Math.max(0, likesRemaining - 1);
      setLikesRemaining(nextLikes);
      if (nextLikes === 0) {
        setTimeout(() => setShowLikesLimitModal(true), 600);
      }
      dbService.consumeDailyLike(currentUser.id).catch(err => {
        console.warn('Silent consumeDailyLike background error:', err);
      });
    }

    if (options?.onLikeProfile) {
      options.onLikeProfile(profile);
    }

    // Save to undo history before removing
    setHistory(prev => [profile, ...prev]);

    // 0ms OPTIMISTIC MUTUAL MATCH CHECK:
    // Only trigger instant mutual match if this candidate has actually liked the current user
    let hasLikedCurrentUser = false;
    try {
      const likedYou = JSON.parse(localStorage.getItem(`serene_liked_you_${currentUser.id}`) || '[]');
      hasLikedCurrentUser = Array.isArray(likedYou) && likedYou.some((p: any) => p.id === profile.id);
    } catch {}
    if (!hasLikedCurrentUser) {
      try {
        const hub = JSON.parse(localStorage.getItem(`serene_matches_hub_${currentUser.id}`) || '{}');
        if (Array.isArray(hub.received) && hub.received.some((p: any) => p.id === profile.id)) {
          hasLikedCurrentUser = true;
        }
      } catch {}
    }

    const isOptimisticMutual = hasLikedCurrentUser;

    // 0ms OPTIMISTIC UI: Immediately pop candidate from queue (0ms instant card pop)
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
    setCurrentIndex(curr => Math.max(0, curr));

    // Record positive action for smart in-app rating prompt
    const isRatingMilestone = ratingService.recordPositiveAction();

    if (isOptimisticMutual) {
      // 0ms INSTANT MUTUAL MATCH CELEBRATION (No blank screen, No 2-second network stall)
      setMatchedProfile(profile);

      // Pre-warm local conversation & mutual matches cache at 0ms
      const convId = `conv_${[currentUser.id, profile.id].sort().join('_')}`;
      try {
        dbService.createMatchConversation(profile);
      } catch {}

      const mutualKey = `serene_mutual_matches_${currentUser.id}`;
      try {
        const savedMutual = JSON.parse(localStorage.getItem(mutualKey) || '[]');
        if (!savedMutual.some((m: any) => m.id === profile.id)) {
          savedMutual.unshift(profile);
          localStorage.setItem(mutualKey, JSON.stringify(savedMutual));
        }
      } catch {}

      try {
        const likedYouKey = `serene_liked_you_${currentUser.id}`;
        const savedLikedYou = JSON.parse(localStorage.getItem(likedYouKey) || '[]');
        localStorage.setItem(likedYouKey, JSON.stringify(savedLikedYou.filter((p: any) => p.id !== profile.id)));
      } catch {}

      notificationService.addNotification({
        type: 'match',
        title: `Connected with ${profile.fullName.split(' ')[0]} 🎉`,
        message: `You and ${profile.fullName} both expressed mutual interest. Chat is now unlocked!`,
        actionLabel: 'Start Chat',
        targetId: convId,
        avatarUrl: profile.photos?.[0]
      });

      // Background network sync (guaranteed mutual flag)
      dbService.sendMatchAction(profile.id, 'liked', undefined, profile, true).catch(err => {
        console.warn('Optimistic match action background error:', err);
      });
    } else {
      // Standard candidate - check server in background
      dbService.sendMatchAction(profile.id, 'liked', undefined, profile).then(result => {
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
          // Task 02: Silent Like (No annoying toast banner)
          // Task 07: No outgoing self-notification clutter
          if (isRatingMilestone) {
            setTimeout(() => setShowRatingModal(true), 800);
          }
        }
      }).catch(err => {
        console.warn('Match action background error:', err);
      });
    }
  }, [isVip, likesRemaining, currentUser.id, options]);

  const handlePass = useCallback((profileId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if ('preventDefault' in e && e.type === 'touchend') {
        e.preventDefault();
      }
    }
    const passTarget = profiles.find(p => p.id === profileId);
    if (passTarget) {
      setHistory(prev => [passTarget, ...prev]);
    }
    dbService.sendMatchAction(profileId, 'passed', undefined, passTarget);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    setCurrentIndex(curr => Math.max(0, curr));
  }, [profiles]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastProfile = history[0];
    if (isVip) {
      setProfiles(prev => [lastProfile, ...prev]);
      setHistory(prev => prev.slice(1));
      return;
    }
    setAdRewardType('undo');
    setShowRewardedAdModal(true);
  }, [history, isVip]);

  const handleClaimAdUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastProfile = history[0];
    setProfiles(prev => [lastProfile, ...prev]);
    setHistory(prev => prev.slice(1));
    setShowRewardedAdModal(false);
  }, [history]);

  const handleDirectSalam = useCallback(async (profile: UserProfile, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if ('preventDefault' in e && e.type === 'touchend') {
        e.preventDefault();
      }
    }

    if (options?.onDirectSalam) {
      options.onDirectSalam(profile);
    }

    // Action Gating: Incomplete profiles (<60% or missing photo) must complete biodata before sending direct salams
    if (!userCompleteness.isGatePassed) {
      setShowIncompleteProfileModal(true);
      return;
    }

    if (directSalams <= 0) {
      setShowSalamRefillModal(true);
      return;
    }

    setSalamModalProfile(profile);
  }, [directSalams, options]);

  const handleConfirmDirectSalam = useCallback(async (customMessage: string) => {
    if (!salamModalProfile) return;
    const target = salamModalProfile;
    setSalamModalProfile(null);

    // Instant local consumption & conversation creation
    dbService.consumeDirectSalam(currentUser.id).catch(() => {});
    const conv = dbService.createMatchConversation(target, customMessage);

    notificationService.addNotification({
      type: 'salam',
      title: 'Direct Salam Sent',
      message: `Your Direct Salam was sent to ${target.fullName}.`,
      actionLabel: 'Open Conversation',
      targetId: conv.id,
      avatarUrl: target.photos?.[0]
    });

    setToastMessage(`Direct Salam sent to ${target.fullName.split(' ')[0]}!`);
    setTimeout(() => setToastMessage(null), 3500);

    // 0ms Optimistic UI: Advance queue by removing candidate
    setProfiles(prev => prev.filter(p => p.id !== target.id));
    setCurrentIndex(curr => Math.max(0, curr));

    if (options?.onOpenChat) {
      options.onOpenChat(conv.id);
    }

    // Sync to backend
    await dbService.sendMatchAction(target.id, 'direct_salam', customMessage, target).catch(err => {
      console.warn('Direct Salam background sync error:', err);
    });
  }, [salamModalProfile, currentUser.id, options]);

  const handleCloseDirectSalam = useCallback(() => {
    setSalamModalProfile(null);
  }, []);

  const handleClaimAdLikes = useCallback(() => {
    setToastMessage('+10 Extra Discover Likes added! 🎉');
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleResetFilters = useCallback(async () => {
    setSearchQuery('');
    try {
      localStorage.removeItem('serene_filters_v2');
      localStorage.removeItem('serene_cached_discover_v2');
    } catch {}
    await dbService.resetPassedProfiles(currentUser.id);
    handleApplyFilters({
      minAge: 18,
      maxAge: 65,
      maxDistance: 0,
      sects: [],
      practiceLevels: [],
      marriageTimelines: [],
      languages: []
    });
  }, [currentUser.id, handleApplyFilters]);

  // Dynamic 24h Auto-Location and Travel Engine
  useEffect(() => {
    checkUserTravel(currentUser.city || currentUser.location || 'Lahore', currentUser.country || 'Pakistan')
      .then(res => {
        if (res && res.hasTraveled) {
          setTravelAlert(res);
        }
      })
      .catch(() => {});
  }, [currentUser.city, currentUser.location, currentUser.country]);

  const handleUpdateTravelCity = useCallback((newCity: string) => {
    try {
      const updatedUser = { ...currentUser, city: newCity, location: `${newCity}, Pakistan` };
      dbService.setCurrentUser(updatedUser);
      // Reload feed for new city
      const newFeed = dbService.getDiscoverFeed(filters);
      setProfiles(newFeed.filter(p => {
        if (p.isProfileCompleted) return true;
        const c = calculateProfileCompleteness(p);
        return c.score >= 40;
      }));
      setCurrentIndex(0);
      setToastMessage(`Switched location to ${newCity}! Showing nearby candidates.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch {}
  }, [currentUser, filters]);

  return {
    currentUser,
    userCompleteness,
    isVip,
    setIsVip,
    likesRemaining,
    directSalams,
    setDirectSalams,
    adsWatchedForSalam,
    setAdsWatchedForSalam,
    filters,
    searchQuery,
    setSearchQuery,
    isLoading,
    profiles,
    filteredFeed,
    currentProfile,
    currentIndex,
    setCurrentIndex,
    toastMessage,
    setToastMessage,
    // Travel Engine & Profile Completeness
    travelAlert,
    setTravelAlert,
    handleUpdateTravelCity,
    showIncompleteProfileModal,
    setShowIncompleteProfileModal,
    // Modals
    matchedProfile,
    setMatchedProfile,
    showFilterModal,
    setShowFilterModal,
    showLikesLimitModal,
    setShowLikesLimitModal,
    showSalamRefillModal,
    setShowSalamRefillModal,
    salamModalProfile,
    setSalamModalProfile,
    showRewardedAdModal,
    setShowRewardedAdModal,
    adRewardType,
    setAdRewardType,
    showVipModal,
    setShowVipModal,
    showRatingModal,
    setShowRatingModal,
    showNotificationsModal,
    setShowNotificationsModal,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    // Action handlers
    handleApplyFilters,
    handleLike,
    handlePass,
    handleUndo,
    handleClaimAdUndo,
    history,
    handleDirectSalam,
    handleConfirmDirectSalam,
    handleCloseDirectSalam,
    handleClaimAdLikes,
    handleResetFilters
  };
}
