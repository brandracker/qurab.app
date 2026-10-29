import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Crown, 
  Clock, 
  Lock, 
  Unlock, 
  Undo2, 
  Ban, 
  MessageCircle, 
  Eye, 
  Compass, 
  CheckCircle2, 
  X,
  Send,
  Loader2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import type { UserProfile } from '../types';

import { dbService } from '../services/dbService';
import { notificationService } from '../services/notificationService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { getThumbnailUrl } from '../utils/mediaCompressor';
import { isUserOnline } from '../utils/onlineStatus';


import { ProfileDetailModal } from './ProfileDetailModal';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenDiscover: () => void;
  currentUser?: UserProfile;
  initialTab?: TabType;
}

type TabType = 'received' | 'sent' | 'mutual' | 'passed' | 'blocked';

export const MatchesLikedYouScreen: React.FC<Props> = ({ onOpenChat, onOpenDiscover, initialTab }) => {
  const currentUser = dbService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'sent');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
  // Instant SWR cache initialization: loads immediately from local memory with 0ms delay
  const initialCache = dbService.getCachedMatchesHub(currentUser.id);
  const hasCachedData = initialCache.received.length > 0 || initialCache.mutual.length > 0 || initialCache.sentLikes.length > 0;

  const [interestedProfiles, setInterestedProfiles] = useState<UserProfile[]>(() => initialCache.received);
  const [mutualMatches, setMutualMatches] = useState<UserProfile[]>(() => initialCache.mutual);
  const [sentLikes, setSentLikes] = useState<any[]>(() => initialCache.sentLikes);
  const [passedProfiles, setPassedProfiles] = useState<any[]>(() => initialCache.passed);
  const [blockedProfiles, setBlockedProfiles] = useState<any[]>(() => initialCache.blocked);
  
  const [isLoading, setIsLoading] = useState<boolean>(!hasCachedData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isVip, setIsVip] = useState<boolean>(() => {
    const vipVal = localStorage.getItem(`serene_vip_${currentUser.id}`);
    return vipVal !== null ? vipVal === 'true' : Boolean(currentUser.isVip);
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const loadAllData = (isInitial: boolean = false) => {
    if (isInitial && !hasCachedData) {
      setIsLoading(true);
    }
    Promise.allSettled([
      dbService.fetchMatchesHub(currentUser.id),
      dbService.fetchLikedYouCandidates(),
      dbService.fetchMutualMatches(),
      dbService.fetchActivityHub()
    ]).then(([hubRes, receivedRes, mutualRes, activityRes]) => {
      const hub = hubRes.status === 'fulfilled' && hubRes.value ? hubRes.value : null;
      const remoteReceived = receivedRes.status === 'fulfilled' ? receivedRes.value : [];
      let remoteMutual = mutualRes.status === 'fulfilled' ? mutualRes.value : [];
      const remoteActivity = activityRes.status === 'fulfilled' && activityRes.value
        ? activityRes.value 
        : { sentLikes: [], passed: [], blocked: [] };

      // Prefer hub if populated, fallback to individual fetchers (e.g. from unit/pipeline test mocks)
      const received = (hub?.received && hub.received.length > 0) ? hub.received : remoteReceived;
      let mutual = (hub?.mutual && hub.mutual.length > 0) ? hub.mutual : remoteMutual;
      const likes = (hub?.sentLikes && hub.sentLikes.length > 0) ? hub.sentLikes : (remoteActivity.sentLikes || []);
      const passedList = (hub?.passed && hub.passed.length > 0) ? hub.passed : (remoteActivity.passed || []);
      const blockedList = (hub?.blocked && hub.blocked.length > 0) ? hub.blocked : (remoteActivity.blocked || []);

      // Auto-heal mutual matches from confirmed mutual likes if API response was lagged
      if ((!mutual || mutual.length === 0) && likes.some((l: any) => l.action === 'mutual_match')) {
        const derivedMutual = likes
          .filter((l: any) => l.action === 'mutual_match')
          .map((l: any) => ({
            id: l.id,
            fullName: l.fullName || 'Match',
            location: l.location || 'Global',
            profession: l.profession || 'Professional',
            marriageTimeline: l.marriageTimeline || 'within_1_year',
            photos: (l.photos && l.photos.length > 0) ? l.photos.filter((p: string) => !p.includes('photo-1534528741775-53994a69daeb')) : [],
            blurPhotosByDefault: false
          }));
        mutual = derivedMutual as any;
      }

      const cleanMutual = (mutual || []).map((m: any) => ({
        ...m,
        photos: Array.isArray(m.photos) ? m.photos.filter((p: string) => !p.includes('photo-1534528741775-53994a69daeb')) : []
      }));
      const mutualIds = new Set(cleanMutual.map((m: any) => m.id));

      const cleanReceived = (received || [])
        .filter((r: any) => r.action !== 'mutual_match' && !mutualIds.has(r.id))
        .map((r: any) => ({
          ...r,
          photos: Array.isArray(r.photos) ? r.photos.filter((p: string) => !p.includes('photo-1534528741775-53994a69daeb')) : []
        }));

      setInterestedProfiles(prev => JSON.stringify(prev) === JSON.stringify(cleanReceived) ? prev : cleanReceived);
      setMutualMatches(prev => JSON.stringify(prev) === JSON.stringify(cleanMutual) ? prev : cleanMutual);
      setSentLikes(prev => JSON.stringify(prev) === JSON.stringify(likes) ? prev : likes);
      setPassedProfiles(prev => JSON.stringify(prev) === JSON.stringify(passedList) ? prev : passedList);
      setBlockedProfiles(prev => JSON.stringify(prev) === JSON.stringify(blockedList) ? prev : blockedList);
    }).catch(err => {
      console.warn('Notice: Background sync for matches completed with fallback:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // Initial fetch with spinner only on empty load
    loadAllData(true);
    
    // Background silent events listener without screen flicker or spinner
    const handleSync = () => loadAllData(false);
    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(e.detail?.isVip !== undefined ? Boolean(e.detail.isVip) : true);
      }
    };
    window.addEventListener('serene_activity_updated', handleSync);
    window.addEventListener('serene_block_updated', handleSync);
    window.addEventListener('serene_vip_updated', handleVipUpdate);

    // Live background silent polling (25s interval)
    const pollInterval = setInterval(() => {
      loadAllData(false);
    }, 25000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('serene_activity_updated', handleSync);
      window.removeEventListener('serene_block_updated', handleSync);
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
    };
  }, [currentUser.id]);


  const handleInstantMatch = (candidate: UserProfile) => {
    // 1. Immediately and smoothly transition profile to Mutual Matches
    setInterestedProfiles(prev => prev.filter(p => p.id !== candidate.id));
    setMutualMatches(prev => {
      if (prev.some(m => m.id === candidate.id)) return prev;
      return [candidate, ...prev];
    });

    // Remove from local liked_you cache
    const localKey = `serene_liked_you_${currentUser.id}`;
    try {
      const saved = JSON.parse(localStorage.getItem(localKey) || '[]');
      const filtered = saved.filter((p: any) => p.id !== candidate.id);
      localStorage.setItem(localKey, JSON.stringify(filtered));
    } catch {}

    // Add to local mutual cache
    const mutualKey = `serene_mutual_matches_${currentUser.id}`;
    try {
      const saved = JSON.parse(localStorage.getItem(mutualKey) || '[]');
      if (!saved.some((p: any) => p.id === candidate.id)) {
        localStorage.setItem(mutualKey, JSON.stringify([candidate, ...saved]));
      }
    } catch {}

    // 0ms INSTANT CONVERSATION & NAVIGATION (Zero blank screen, Zero network freeze)
    const convId = `conv_${[currentUser.id, candidate.id].sort().join('_')}`;
    const newConv = dbService.createMatchConversation(candidate);

    const candidateName = candidate.fullName || 'Member';
    const firstName = candidateName.split(' ')[0] || 'Member';
    notificationService.addNotification({
      type: 'match',
      title: `Connected with ${firstName} 🎉`,
      message: `You and ${candidateName} both expressed mutual interest. Chaperoned chat is now unlocked!`,
      actionLabel: 'Open Chat',
      targetId: convId || newConv.id,
      avatarUrl: candidate.photos?.[0]
    });

    // Navigate to chat immediately at 0ms
    onOpenChat(convId || newConv.id);

    // 2. Transmit to server asynchronously in background with guaranteed mutual match flag
    dbService.sendMatchAction(candidate.id, 'liked', undefined, candidate, true).catch(err => {
      console.warn('Background instant match sync error:', err);
    });
  };


  const handlePassCandidate = (candidate: UserProfile) => {
    // 0ms Optimistic removal
    setInterestedProfiles(prev => prev.filter(p => p.id !== candidate.id));

    const localKey = `serene_liked_you_${currentUser.id}`;
    try {
      const saved = JSON.parse(localStorage.getItem(localKey) || '[]');
      const filtered = saved.filter((p: any) => p.id !== candidate.id);
      localStorage.setItem(localKey, JSON.stringify(filtered));
    } catch {}

    const candidateFirstName = (candidate.fullName || 'Candidate').split(' ')[0];
    setToastMessage(`Passed on ${candidateFirstName}. Moved to your Passed History.`);
    setTimeout(() => setToastMessage(null), 3500);

    // Background sync to server
    dbService.sendMatchAction(candidate.id, 'passed', undefined, candidate).catch(err => {
      console.warn('Background pass sync error:', err);
    });
  };

  const handleUndoPass = async (targetId: string, name: string) => {
    const ok = await dbService.undoPass(targetId);
    if (ok) {
      setPassedProfiles(prev => prev.filter(p => p.id !== targetId));
      setToastMessage(`Pass undone for ${name}. They will reappear in your Discover feed!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };


  const handleUnblock = async (targetId: string, name: string) => {
    const ok = await dbService.unblockProfile(targetId);
    if (ok) {
      setBlockedProfiles(prev => prev.filter(p => p.id !== targetId));
      setToastMessage(`Unblocked ${name}. They will reappear in your Discover feed!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const [mainSection, setMainSection] = useState<'activity' | 'privacy'>('activity');

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-y-auto pb-24 font-sans bg-slate-50/50 select-none text-on-surface relative">
      {/* Subtle Ambient Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-24 left-0 w-48 h-48 bg-emerald-500/4 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <header className="mb-3.5 flex items-center justify-between pt-1 relative z-10">
        <div>
          <h1 className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Matches & Activity</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage connections, sent interests & privacy history</p>
        </div>

        {isVip && (
          <span className="bg-gradient-to-r from-amber-50 to-amber-100/90 text-amber-700 border border-amber-300/60 text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>VIP Active</span>
          </span>
        )}
      </header>

      {/* Main 2-Section Segmented Control */}
      <div className="bg-slate-200/60 p-1 rounded-2xl flex items-center mb-3 border border-slate-200/80 shadow-2xs backdrop-blur-xs relative z-10">
        <button
          onClick={() => {
            setMainSection('activity');
            if (activeTab === 'passed' || activeTab === 'blocked') {
              setActiveTab('sent');
            }
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mainSection === 'activity'
              ? 'bg-white text-primary shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Match Activity</span>
        </button>

        <button
          onClick={() => {
            setMainSection('privacy');
            if (activeTab !== 'passed' && activeTab !== 'blocked') {
              setActiveTab('passed');
            }
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mainSection === 'privacy'
              ? 'bg-white text-primary shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Passes</span>
        </button>
      </div>

      {/* Sub-Tabs Selector based on Main Section */}
      <div className="flex items-center gap-2 mb-3.5 relative z-10">
        {mainSection === 'activity' ? (
          <>
            {/* 1. You Liked */}
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'sent'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-brand'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span>You Liked</span>
            </button>

            {/* 2. Mutual */}
            <button
              onClick={() => setActiveTab('mutual')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'mutual'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-brand'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span>Mutual</span>
            </button>

            {/* 3. Liked You */}
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'received'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-brand'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span>Liked You</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('passed')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'passed'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-brand'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Passed History</span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'blocked'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-brand'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Blocked</span>
            </button>
          </>
        )}
      </div>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="mb-3.5 bg-primary text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between shadow-brand animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. RECEIVED LIKES TAB */}
      {activeTab === 'received' && (
        <div className="space-y-3.5">
          {/* VIP Banner */}
          {!isVip && interestedProfiles.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 rounded-2xl p-3.5 border border-amber-200/80 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif text-xs font-bold text-slate-800">
                    {interestedProfiles.length} Candidates Liked You!
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Upgrade to VIP to unblur photos and connect immediately.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-[11px] font-bold shadow-brand hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock "Who Liked You" with VIP</span>
              </button>
            </div>
          )}

          {isLoading && interestedProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
              <p className="text-xs text-slate-500">Checking incoming likes...</p>
            </div>
          ) : interestedProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {interestedProfiles.map(candidate => {
                const hasPhoto = Boolean(
                  candidate.photos && 
                  candidate.photos.length > 0 && 
                  candidate.photos[0] && 
                  !candidate.photos[0].includes('photo-1534528741775-53994a69daeb')
                );
                const photo = hasPhoto ? getThumbnailUrl(candidate.photos![0]) : null;
                const initial = (candidate.fullName || 'M').charAt(0).toUpperCase();

                return (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-primary/40 transition-all duration-200 relative group"
                  >
                    <div 
                      onClick={() => setSelectedProfile(candidate)}
                      className="relative aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={candidate.fullName}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.halal-grid-avatar-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                          className={`w-full h-full object-cover transition-all ${
                            !isVip ? 'filter blur-md scale-110 opacity-70' : 'scale-100'
                          }`}
                        />
                      ) : null}
                      <div className={`halal-grid-avatar-fallback w-full h-full items-center justify-center bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-950 text-amber-200 ${photo ? 'hidden' : 'flex'} flex-col shadow-inner`}>
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-amber-200/30 shadow-inner flex items-center justify-center text-xl font-serif font-bold text-amber-200">
                          {initial}
                        </div>
                        <span className="text-[10px] font-medium text-amber-100/80 mt-2">Verified Profile</span>
                      </div>
                      {!isVip && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUpgradeModal(true);
                          }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 text-white p-2 text-center cursor-pointer transition-colors backdrop-blur-[2px]"
                          title="Click to unlock VIP photo unblur"
                        >
                          <Lock className="w-4 h-4 mb-1 text-amber-300" />
                          <span className="text-[9px] font-bold">VIP Photo</span>
                          <span className="text-[8px] text-white/90 mt-0.5 underline">View Biodata</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white pointer-events-none flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-white/80" />
                        <span>{candidate.location?.split(',')[0]}</span>
                        {typeof candidate.distanceKm === 'number' && ` · ${candidate.distanceKm} km`}
                      </div>
                    </div>

                    <div className="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
                      <div onClick={() => setSelectedProfile(candidate)} className="cursor-pointer">
                        <h3 className="font-serif font-bold text-xs text-slate-800 truncate hover:text-primary transition-colors">
                          {isVip ? (candidate.fullName || 'Member') : `${(candidate.fullName || 'Member').split(' ')[0]} (Liked You)`}
                        </h3>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {candidate.profession || 'Professional'} · {candidate.religiousProfile?.sect || 'Sunni'}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleInstantMatch(candidate)}
                            className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-[10px] font-bold shadow-brand hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            <Heart className="w-3 h-3 fill-current" />
                            <span>Match & Chat</span>
                          </button>

                          <button
                            onClick={() => handlePassCandidate(candidate)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition-all"
                            title="Pass"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (

            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-2.5 border border-rose-100">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-slate-800">No New Likes Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                When prospective matches like your profile on Discover, they will appear here!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. SENT LIKES TAB */}
      {activeTab === 'sent' && (
        <div className="space-y-2.5">
          {sentLikes.length > 0 ? (
            <div className="space-y-2.5">
              {sentLikes.map(item => {
                const matchedProf = dbService.getAllProfiles().find(p => p.id === item.id);
                const displayName = (item.fullName && item.fullName !== 'Candidate' && item.fullName !== 'Member')
                  ? item.fullName
                  : (matchedProf?.fullName || item.fullName || 'Candidate');
                const rawPhotos = (item.photos && item.photos.length > 0)
                  ? item.photos
                  : (matchedProf?.photos && matchedProf.photos.length > 0 ? matchedProf.photos : (item.id && item.id.startsWith('seed_') ? [`/seeds/${item.id}.jpg`] : []));
                const firstPhoto = rawPhotos.find((p: string) => typeof p === 'string' && !p.includes('photo-1534528741775-53994a69daeb'));
                const thumbUrl = firstPhoto ? getThumbnailUrl(firstPhoto) : null;
                const initial = (displayName || 'C').charAt(0).toUpperCase();

                const profession = matchedProf?.profession || item.profession || 'Member';
                const location = matchedProf?.location || item.location || 'Global';
                const timeline = item.marriageTimeline || matchedProf?.marriageTimeline;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const prof = matchedProf || {
                        ...item,
                        fullName: displayName,
                        photos: rawPhotos,
                        email: item.email || '',
                        education: item.education || '',
                        practiceLevel: item.practiceLevel || 'practicing',
                        hobbies: item.hobbies || []
                      };
                      setSelectedProfile(prof as UserProfile);
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-primary/40 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center shrink-0">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={displayName}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.halal-sent-avatar-fallback');
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
                        <div
                          className={`halal-sent-avatar-fallback w-full h-full bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-950 text-amber-200 items-center justify-center font-serif font-bold text-base shadow-inner ${
                            thumbUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          {initial}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm text-slate-800 truncate group-hover:text-primary transition-colors">
                          {displayName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="truncate max-w-[130px]">{profession}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                          <span className="flex items-center gap-0.5 text-slate-400 shrink-0 truncate max-w-[120px]">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {location}
                          </span>
                        </div>
                        {timeline && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                              <Clock className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                              <span>Timeline: {timeline.replace(/_/g, ' ')}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                        item.action === 'mutual_match'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/90 shadow-2xs group-hover:border-primary/40 group-hover:text-primary'
                      }`}>
                        {item.action === 'mutual_match' ? (
                          <>
                            <Heart className="w-3 h-3 text-emerald-600 fill-current" />
                            <span>Matched</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-2.5 border border-rose-100">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-slate-800">No Sent Likes Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Explore Discover and express interest to candidates you feel aligned with.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MUTUAL MATCHES TAB */}
      {activeTab === 'mutual' && (
        <div className="space-y-2.5">
          {mutualMatches.length > 0 ? (
            <div className="space-y-2.5">
              {mutualMatches.map(match => {
                const hasPhoto = Boolean(
                  match.photos && 
                  match.photos.length > 0 && 
                  match.photos[0] && 
                  !match.photos[0].includes('photo-1534528741775-53994a69daeb')
                );
                const photo = hasPhoto ? getThumbnailUrl(match.photos![0]) : null;
                const initial = (match.fullName || 'M').charAt(0).toUpperCase();

                return (
                  <div
                    key={match.id}
                    onClick={() => {
                      const newConv = dbService.createMatchConversation(match);
                      onOpenChat(newConv.id);
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-primary/40 flex items-center justify-between gap-3 cursor-pointer group transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-primary/40 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                        {photo ? (
                          <img
                            src={photo}
                            alt={match.fullName}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.halal-mutual-avatar-fallback');
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                            className={`w-full h-full object-cover ${
                              match.blurPhotosByDefault && !match.photoRevealApproved ? 'blur-xs' : ''
                            }`}
                          />
                        ) : null}
                        <div
                          className={`halal-mutual-avatar-fallback w-full h-full bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-950 text-amber-200 items-center justify-center font-serif font-bold text-base shadow-inner ${
                            photo ? 'hidden' : 'flex'
                          }`}
                        >
                          {initial}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-bold text-sm text-slate-800 group-hover:text-primary transition-colors truncate">
                            {match.fullName}
                          </h4>
                          {isUserOnline(match) ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0 shadow-2xs" title="Online" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100 shrink-0 shadow-2xs" title="Offline / Away" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="text-primary font-semibold truncate max-w-[130px]">{match.profession || 'Professional'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                          <span className="flex items-center gap-0.5 text-slate-400 shrink-0 truncate max-w-[120px]">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {match.location}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Tap to chat · Tap eye for biodata
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfile(match);
                        }}
                        title="View Full Profile"
                        className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-200 flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newConv = dbService.createMatchConversation(match);
                          onOpenChat(newConv.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-brand hover:brightness-105 active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 border border-emerald-100">
                <Heart className="w-6 h-6 text-emerald-600 fill-current" />
              </div>
              <h3 className="font-serif font-bold text-sm text-slate-800">No Mutual Matches Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                When two profiles mutually like each other, you can immediately start a respectful chat here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. PASSED PROFILES */}
      {activeTab === 'passed' && (
        <div className="space-y-2.5">
          {passedProfiles.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-500 font-medium">
                You passed on these profiles. You can reconsider or undo any pass below to return them to Discover:
              </p>
              {passedProfiles.map(item => {
                const matchedProf = dbService.getAllProfiles().find(p => p.id === item.id);
                const displayName = (item.fullName && item.fullName !== 'Candidate' && item.fullName !== 'Member')
                  ? item.fullName
                  : (matchedProf?.fullName || item.fullName || 'Candidate');
                const rawPhotos = (item.photos && item.photos.length > 0)
                  ? item.photos
                  : (matchedProf?.photos && matchedProf.photos.length > 0 ? matchedProf.photos : (item.id && item.id.startsWith('seed_') ? [`/seeds/${item.id}.jpg`] : []));
                const firstPhoto = rawPhotos.find((p: string) => typeof p === 'string' && !p.includes('photo-1534528741775-53994a69daeb'));
                const thumbUrl = firstPhoto ? getThumbnailUrl(firstPhoto) : null;
                const initial = (displayName || 'C').charAt(0).toUpperCase();

                return (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-100 flex items-center justify-center shrink-0">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-950 text-amber-200 flex items-center justify-center font-serif font-bold text-sm shadow-inner">
                            {initial}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs text-slate-800 truncate">{displayName}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-0.5">
                          <span className="truncate max-w-[120px]">{(matchedProf?.profession || item.profession || 'Professional')}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                          <span className="flex items-center gap-0.5 text-slate-400 shrink-0 truncate max-w-[110px]">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            {(matchedProf?.location || item.location || 'Global')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUndoPass(item.id, displayName)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-primary/70 text-primary hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs shrink-0"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo Pass</span>
                    </button>
                  </div>
                );
              })}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-2.5 border border-slate-200">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm text-slate-800">No Passed Profiles</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Any candidate profiles you pass on will appear here with an option to reconsider.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. BLOCKED USERS */}
      {activeTab === 'blocked' && (
        <div className="space-y-2.5">
          {blockedProfiles.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-500 font-medium">
                Profiles you have shielded or blocked for privacy:
              </p>
              {blockedProfiles.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-xs text-slate-800 truncate">{item.fullName}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.reason || 'Blocked'} · {item.location || 'Global'}</p>
                  </div>

                  <button
                    onClick={() => handleUnblock(item.id, item.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unblock</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-2.5 border border-rose-100">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-slate-800">No Blocked Profiles</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                You have not blocked any members. Your account privacy shield is active.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Discover CTA */}
      <div className="pt-4 text-center">
        <button
          onClick={onOpenDiscover}
          className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary font-medium text-xs shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
        >
          <Compass className="w-4 h-4 text-primary" />
          <span>Explore More on Discover</span>
        </button>
      </div>

      {/* Google Play Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly' || productId === 'qurb_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${currentUser.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => {}}
        />
      )}

      {/* Full Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
          onLike={activeTab === 'received' ? (p) => {
            handleInstantMatch(p);
            setSelectedProfile(null);
          } : undefined}
          onPass={activeTab === 'received' ? (pid) => {
            dbService.sendMatchAction(pid, 'passed', undefined, selectedProfile);
            setSelectedProfile(null);
            loadAllData();
          } : undefined}
          customAction={
            activeTab === 'sent' ? (
              <div className="w-full flex items-center justify-between gap-3">
                {sentLikes.find(s => s.id === selectedProfile.id)?.action === 'mutual_match' ? (
                  <>
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className="flex-1 py-2.5 rounded-full bg-surface-variant text-on-surface hover:bg-outline font-sans text-xs font-bold transition-all flex items-center justify-center shadow-subtle"
                    >
                      Close Biodata
                    </button>
                    <button
                      onClick={() => {
                        const newConv = dbService.createMatchConversation(selectedProfile);
                        setSelectedProfile(null);
                        onOpenChat(newConv.id);
                      }}
                      className="flex-1 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open Chat</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-variant text-secondary text-xs font-semibold border border-outline">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span>Interest Sent · Pending</span>
                    </div>
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className="flex-1 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      Close Biodata
                    </button>
                  </>
                )}
              </div>
            ) : activeTab === 'mutual' ? (
              <div className="w-full flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="flex-1 py-2.5 rounded-full bg-surface-variant text-on-surface hover:bg-outline font-sans text-xs font-bold transition-all flex items-center justify-center shadow-subtle"
                >
                  Close Biodata
                </button>
                <button
                  onClick={() => {
                    const newConv = dbService.createMatchConversation(selectedProfile);
                    setSelectedProfile(null);
                    onOpenChat(newConv.id);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Chat</span>
                </button>
              </div>
            ) : undefined
          }
        />
      )}
    </div>
  );
};
export default MatchesLikedYouScreen;



