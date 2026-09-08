import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserProfile, FilterState } from '../types';
import { dbService, API_BASE } from '../services/dbService';
import { notificationService } from '../services/notificationService';

interface UseDiscoverFeedOptions {
  onOpenChat?: (convId: string) => void;
  onLikeProfile?: (profile: UserProfile) => void;
  onDirectSalam?: (profile: UserProfile) => void;
}

export function useDiscoverFeed(options?: UseDiscoverFeedOptions) {
  const currentUser = dbService.getCurrentUser();

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  const getTodayLikeKey = useCallback(() => {
    return `serene_likes_left_${currentUser.id}_${new Date().toISOString().slice(0, 10)}`;
  }, [currentUser.id]);

  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  const [directSalams, setDirectSalams] = useState<number>(() => {
    const saved = localStorage.getItem(`serene_salams_left_${currentUser.id}`);
    return saved !== null ? parseInt(saved, 10) : 2;
  });

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showLikesLimitModal, setShowLikesLimitModal] = useState<boolean>(false);
  const [showSalamRefillModal, setShowSalamRefillModal] = useState<boolean>(false);
  const [salamModalProfile, setSalamModalProfile] = useState<UserProfile | null>(null);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam'>('likes');
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
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
    window.addEventListener('serene_likes_updated', handleLikesUpdate);
    window.addEventListener('serene_salams_updated', handleSalamsUpdate);
    return () => {
      window.removeEventListener('serene_likes_updated', handleLikesUpdate);
      window.removeEventListener('serene_salams_updated', handleSalamsUpdate);
    };
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
    setCurrentIndex(0);
    dbService.fetchLiveProfiles(newFilters).then(live => {
      if (live && live.length > 0) {
        setProfiles(dbService.getDiscoverFeed(newFilters));
      }
    });
  }, []);

  const handleLike = useCallback(async (profile: UserProfile, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();

    // Check daily like limit for non-VIP users
    if (!isVip && likesRemaining <= 0) {
      setShowLikesLimitModal(true);
      return;
    }

    if (!isVip) {
      const res = await dbService.consumeDailyLike(currentUser.id);
      setLikesRemaining(res.likesRemaining);
      if (res.likesRemaining === 0) {
        setTimeout(() => setShowLikesLimitModal(true), 600);
      }
    }

    if (options?.onLikeProfile) {
      options.onLikeProfile(profile);
    }

    // Immediately pop candidate from queue
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
    setCurrentIndex(curr => Math.max(0, curr));

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
  }, [isVip, likesRemaining, currentUser.id, options]);

  const handlePass = useCallback((profileId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if ('preventDefault' in e && e.type === 'touchend') {
        e.preventDefault();
      }
    }
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    setCurrentIndex(curr => Math.max(0, curr));
  }, []);

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

    await dbService.consumeDirectSalam(currentUser.id);
    const conv = dbService.createMatchConversation(target, customMessage);
    await dbService.sendMatchAction(target.id, 'direct_salam', customMessage);

    notificationService.addNotification({
      type: 'salam',
      title: 'Direct Salam Sent',
      message: `Your Direct Salam was sent to ${target.fullName}.`,
      actionLabel: 'Open Conversation',
      targetId: conv.id,
      avatarUrl: target.photos?.[0]
    });

    setToastMessage(`Direct Salam sent to ${target.fullName.split(' ')[0]}! ✨`);
    setTimeout(() => setToastMessage(null), 3500);

    // Advance queue by removing candidate
    setProfiles(prev => prev.filter(p => p.id !== target.id));
    setCurrentIndex(curr => Math.max(0, curr));

    if (options?.onOpenChat) {
      options.onOpenChat(conv.id);
    }
  }, [salamModalProfile, currentUser.id, options]);

  const handleCloseDirectSalam = useCallback(() => {
    setSalamModalProfile(null);
  }, []);

  const handleClaimAdLikes = useCallback(async () => {
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
  }, [likesRemaining, getTodayLikeKey, currentUser.id]);

  const handleResetFilters = useCallback(() => {
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
  }, [currentUser.id, handleApplyFilters]);

  return {
    currentUser,
    isVip,
    setIsVip,
    likesRemaining,
    directSalams,
    setDirectSalams,
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
    showNotificationsModal,
    setShowNotificationsModal,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    // Action handlers
    handleApplyFilters,
    handleLike,
    handlePass,
    handleDirectSalam,
    handleConfirmDirectSalam,
    handleCloseDirectSalam,
    handleClaimAdLikes,
    handleResetFilters
  };
}
