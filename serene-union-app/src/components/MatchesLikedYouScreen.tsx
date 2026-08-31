import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { dbService } from '../services/dbService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenDiscover: () => void;
}

type TabType = 'received' | 'sent' | 'mutual' | 'passed' | 'blocked';

export const MatchesLikedYouScreen: React.FC<Props> = ({ onOpenChat, onOpenDiscover }) => {
  const currentUser = dbService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  
  const [interestedProfiles, setInterestedProfiles] = useState<UserProfile[]>([]);
  const [mutualMatches, setMutualMatches] = useState<UserProfile[]>([]);
  const [sentLikes, setSentLikes] = useState<any[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<any[]>([]);
  const [blockedProfiles, setBlockedProfiles] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const loadAllData = () => {
    setIsLoading(true);
    Promise.all([
      dbService.fetchLikedYouCandidates(),
      dbService.fetchMutualMatches(),
      dbService.fetchActivityHub()
    ]).then(([received, mutual, activity]) => {
      setInterestedProfiles(received || []);
      setMutualMatches(mutual || []);
      setSentLikes(activity.sentLikes || []);
      setPassedProfiles(activity.passed || []);
      setBlockedProfiles(activity.blocked || []);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleInstantMatch = async (candidate: UserProfile) => {
    const res = await dbService.sendMatchAction(candidate.id, 'liked');
    setInterestedProfiles(prev => prev.filter(p => p.id !== candidate.id));
    
    const convId = res.conversationId || `conv_${[currentUser.id, candidate.id].sort().join('_')}`;
    const newConv = dbService.createMatchConversation(candidate);
    onOpenChat(convId || newConv.id);
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
      setToastMessage(`Unblocked ${name}.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto pb-28 font-sans bg-background">
      {/* Top Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Matches & Activity Hub</h1>
          <p className="text-xs text-secondary">Your connections, sent interests & privacy history</p>
        </div>
        {isVip && (
          <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span>VIP Active</span>
          </span>
        )}
      </header>

      {/* Activity Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4">
        {[
          { id: 'received', label: '💖 Liked You', count: interestedProfiles.length },
          { id: 'sent', label: '🏹 You Liked', count: sentLikes.length },
          { id: 'mutual', label: '🤝 Mutual', count: mutualMatches.length },
          { id: 'passed', label: '↩️ Passed', count: passedProfiles.length },
          { id: 'blocked', label: '🚫 Blocked', count: blockedProfiles.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-high text-secondary hover:text-on-surface'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-surface text-primary'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="mb-4 bg-primary/95 text-on-primary px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. RECEIVED LIKES TAB ("Liked You")                                       */}
      {/* ========================================================================= */}
      {activeTab === 'received' && (
        <div className="space-y-4 animate-fade-in">
          {/* VIP Banner */}
          {!isVip && interestedProfiles.length > 0 && (
            <div className="bg-gradient-to-r from-primary/15 via-surface to-tertiary-container/20 rounded-3xl p-4 border border-primary/30 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </div>
                <div>
                  <h3 className="font-serif text-xs font-bold text-on-surface">
                    {interestedProfiles.length} Candidates Liked You!
                  </h3>
                  <p className="text-[10px] text-secondary">
                    Upgrade to Barakah VIP to unblur photos and match instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-2 rounded-full bg-primary text-white text-[11px] font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">lock_open</span>
                <span>Unlock "Who Liked You" with VIP</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin mb-2">progress_activity</span>
              <p className="text-xs text-secondary">Checking incoming likes...</p>
            </div>
          ) : interestedProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {interestedProfiles.map(candidate => {
                const photo = candidate.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                return (
                  <div
                    key={candidate.id}
                    className="bg-surface rounded-2xl border border-surface-variant/40 overflow-hidden flex flex-col shadow-xs relative group"
                  >
                    <div className="relative aspect-[3/4] bg-surface-container-high overflow-hidden">
                      <img
                        src={photo}
                        alt={candidate.fullName}
                        className={`w-full h-full object-cover transition-all ${
                          !isVip ? 'filter blur-md scale-110 opacity-70' : 'scale-100'
                        }`}
                      />
                      {!isVip && (
                        <div 
                          onClick={() => setShowUpgradeModal(true)}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 text-white p-2 text-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-2xl mb-1 text-primary">lock</span>
                          <span className="text-[10px] font-bold">VIP Only</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-on-surface">
                        {candidate.location?.split(',')[0]}
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between gap-1.5">
                      <div>
                        <h3 className="font-serif font-bold text-xs text-on-surface truncate">
                          {isVip ? candidate.fullName : `${candidate.fullName.split(' ')[0]} (Liked You)`}
                        </h3>
                        <p className="text-[10px] text-secondary truncate">
                          {candidate.profession || 'Professional'} · {candidate.religiousProfile?.sect || 'Sunni'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-surface-variant/20">
                        {isVip ? (
                          <button
                            onClick={() => handleInstantMatch(candidate)}
                            className="w-full py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">favorite</span>
                            <span>Match & Chat</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full py-1.5 rounded-xl bg-surface-container-high text-primary text-[10px] font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                            <span>Reveal Profile</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-surface-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">favorite_border</span>
              <h3 className="font-serif font-bold text-sm text-on-surface">No New Likes Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                When prospective matches like your profile on Discover, they will appear here!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SENT LIKES TAB (Profiles You Liked)                                    */}
      {/* ========================================================================= */}
      {activeTab === 'sent' && (
        <div className="space-y-3 animate-fade-in">
          {sentLikes.length > 0 ? (
            <div className="space-y-2.5">
              {sentLikes.map(item => (
                <div
                  key={item.id}
                  className="bg-surface p-3.5 rounded-2xl border border-surface-variant/40 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-sm border border-primary/20">
                      {item.fullName ? item.fullName[0] : 'S'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                      <p className="text-[10px] text-secondary">{item.profession || 'Professional'} · {item.location || 'Global'}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    item.action === 'mutual_match'
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high text-primary border border-primary/20'
                  }`}>
                    {item.action === 'mutual_match' ? (
                      <>
                        <span className="material-symbols-outlined text-[12px]">favorite</span>
                        <span>Matched</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-surface-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">send</span>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Sent Likes Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                Explore Discover and express interest to candidates you feel aligned with.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MUTUAL MATCHES TAB                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'mutual' && (
        <div className="space-y-3 animate-fade-in">
          {mutualMatches.length > 0 ? (
            <div className="space-y-2.5">
              {mutualMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-surface p-3.5 rounded-2xl border border-primary/30 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary shrink-0">
                      <img
                        src={match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                        alt={match.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-on-surface">{match.fullName}</h4>
                      <p className="text-[10px] text-primary font-semibold">{match.profession || 'Professional'} · {match.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const convId = `conv_${[currentUser.id, match.id].sort().join('_')}`;
                      onOpenChat(convId);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>Chat</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-surface-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">handshake</span>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Mutual Matches Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                When two profiles mutually like each other, you can immediately start a respectful chat here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PASSED PROFILES (WITH 1-TAP UNDO)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'passed' && (
        <div className="space-y-3 animate-fade-in">
          {passedProfiles.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-[11px] text-secondary">
                You passed on these profiles. You can reconsider or undo any pass below to return them to Discover:
              </p>
              {passedProfiles.map(item => (
                <div
                  key={item.id}
                  className="bg-surface p-3.5 rounded-2xl border border-surface-variant/40 shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                    <p className="text-[10px] text-secondary">{item.profession || 'Professional'} · {item.location || 'Global'}</p>
                  </div>

                  <button
                    onClick={() => handleUndoPass(item.id, item.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-high text-primary hover:bg-primary/10 border border-primary/20 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">undo</span>
                    <span>Undo Pass</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-surface-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">history</span>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Passed Profiles</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                Any candidate profiles you pass on will appear here with an option to reconsider.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BLOCKED USERS (WITH 1-TAP UNBLOCK)                                     */}
      {/* ========================================================================= */}
      {activeTab === 'blocked' && (
        <div className="space-y-3 animate-fade-in">
          {blockedProfiles.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-[11px] text-secondary">
                Profiles you have shielded or blocked for privacy:
              </p>
              {blockedProfiles.map(item => (
                <div
                  key={item.id}
                  className="bg-surface p-3.5 rounded-2xl border border-error/30 shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                    <p className="text-[10px] text-secondary">{item.reason || 'Blocked'} · {item.location || 'Global'}</p>
                  </div>

                  <button
                    onClick={() => handleUnblock(item.id, item.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-high text-error hover:bg-error/10 border border-error/20 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    <span>Unblock</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-surface-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">shield</span>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Blocked Profiles</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs">
                You have not blocked any members. Your account privacy shield is active.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Discover CTA */}
      <div className="pt-6 text-center">
        <button
          onClick={onOpenDiscover}
          className="px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-sans text-xs font-bold hover:bg-surface-variant transition-all inline-flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">explore</span>
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
            if (productId === 'serene_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${currentUser.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => {}}
        />
      )}
    </div>
  );
};

