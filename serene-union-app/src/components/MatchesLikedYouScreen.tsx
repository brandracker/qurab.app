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
  Loader2
} from 'lucide-react';
import type { UserProfile } from '../types';
import { dbService } from '../services/dbService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { ProfileDetailModal } from './ProfileDetailModal';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenDiscover: () => void;
}

type TabType = 'received' | 'sent' | 'mutual' | 'passed' | 'blocked';

export const MatchesLikedYouScreen: React.FC<Props> = ({ onOpenChat, onOpenDiscover }) => {
  const currentUser = dbService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
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
    const handleSync = () => loadAllData();
    window.addEventListener('serene_activity_updated', handleSync);
    window.addEventListener('serene_block_updated', handleSync);
    return () => {
      window.removeEventListener('serene_activity_updated', handleSync);
      window.removeEventListener('serene_block_updated', handleSync);
    };
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

  const [mainSection, setMainSection] = useState<'activity' | 'privacy'>('activity');

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-y-auto pb-24 font-sans bg-background select-none text-on-surface">
      {/* Top Header */}
      <header className="mb-3.5 flex items-center justify-between pt-1">
        <div>
          <h1 className="font-serif text-xl font-bold text-on-surface">
            Matches & Activity
          </h1>
          <p className="text-[11px] text-secondary mt-0.5">Manage connections, sent interests & privacy history</p>
        </div>

        {isVip && (
          <span className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3 text-pastel-amber-text" />
            <span>VIP Active</span>
          </span>
        )}
      </header>

      {/* Main 2-Section Segmented Control */}
      <div className="bg-surface-variant p-1 rounded-2xl flex items-center mb-3 border border-outline">
        <button
          onClick={() => {
            setMainSection('activity');
            if (activeTab === 'passed' || activeTab === 'blocked') {
              setActiveTab('received');
            }
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mainSection === 'activity'
              ? 'bg-white text-primary shadow-subtle'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Match Activity</span>
          {(interestedProfiles.length + mutualMatches.length + sentLikes.length) > 0 && (
            <span className="bg-pastel-rose text-primary px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
              {interestedProfiles.length + mutualMatches.length + sentLikes.length}
            </span>
          )}
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
              ? 'bg-white text-primary shadow-subtle'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Passes</span>
          {(passedProfiles.length + blockedProfiles.length) > 0 && (
            <span className="bg-surface-variant text-secondary px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
              {passedProfiles.length + blockedProfiles.length}
            </span>
          )}
        </button>
      </div>

      {/* Sub-Tabs Selector based on Main Section */}
      <div className="flex items-center gap-2 mb-3.5">
        {mainSection === 'activity' ? (
          <>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'received'
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-white text-secondary border-outline hover:bg-surface-variant'
              }`}
            >
              <span>Liked You</span>
              {interestedProfiles.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'received' ? 'bg-white/20 text-white' : 'bg-pastel-rose text-primary'
                }`}>
                  {interestedProfiles.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'sent'
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-white text-secondary border-outline hover:bg-surface-variant'
              }`}
            >
              <span>You Liked</span>
              {sentLikes.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'sent' ? 'bg-white/20 text-white' : 'bg-pastel-rose text-primary'
                }`}>
                  {sentLikes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('mutual')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'mutual'
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-white text-secondary border-outline hover:bg-surface-variant'
              }`}
            >
              <span>Mutual</span>
              {mutualMatches.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'mutual' ? 'bg-white/20 text-white' : 'bg-pastel-rose text-primary'
                }`}>
                  {mutualMatches.length}
                </span>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('passed')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'passed'
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-white text-secondary border-outline hover:bg-surface-variant'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Passed History</span>
              {passedProfiles.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'passed' ? 'bg-white/20 text-white' : 'bg-surface-variant text-secondary'
                }`}>
                  {passedProfiles.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                activeTab === 'blocked'
                  ? 'bg-primary text-white border-primary shadow-brand'
                  : 'bg-white text-secondary border-outline hover:bg-surface-variant'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Blocked</span>
              {blockedProfiles.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'blocked' ? 'bg-white/20 text-white' : 'bg-pastel-rose text-primary'
                }`}>
                  {blockedProfiles.length}
                </span>
              )}
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
        <div className="space-y-3.5 animate-fade-in">
          {/* VIP Banner */}
          {!isVip && interestedProfiles.length > 0 && (
            <div className="bg-pastel-amber rounded-3xl p-3.5 border border-pastel-amber-border flex flex-col gap-2 shadow-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-pastel-amber-text flex items-center justify-center shadow-subtle shrink-0">
                  <Crown className="w-4 h-4 text-pastel-amber-text" />
                </div>
                <div>
                  <h3 className="font-serif text-xs font-bold text-on-surface">
                    {interestedProfiles.length} Candidates Liked You!
                  </h3>
                  <p className="text-[10px] text-secondary">
                    Upgrade to VIP to unblur photos and connect immediately.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-2.5 rounded-full bg-primary text-white text-[11px] font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock "Who Liked You" with VIP</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
              <p className="text-xs text-secondary">Checking incoming likes...</p>
            </div>
          ) : interestedProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {interestedProfiles.map(candidate => {
                const photo = candidate.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                return (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-2xl border border-outline overflow-hidden flex flex-col shadow-subtle relative group"
                  >
                    <div className="relative aspect-[3/4] bg-surface-variant overflow-hidden">
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
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-2 text-center cursor-pointer backdrop-blur-xs"
                        >
                          <Lock className="w-5 h-5 mb-1 text-pastel-amber-border" />
                          <span className="text-[10px] font-bold">VIP Only</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white">
                        {candidate.location?.split(',')[0]}
                      </div>
                    </div>

                    <div className="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
                      <div>
                        <h3 className="font-serif font-bold text-xs text-on-surface truncate">
                          {isVip ? candidate.fullName : `${candidate.fullName.split(' ')[0]} (Liked You)`}
                        </h3>
                        <p className="text-[10px] text-secondary truncate">
                          {candidate.profession || 'Professional'} · {candidate.religiousProfile?.sect || 'Sunni'}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-outline">
                        {isVip ? (
                          <button
                            onClick={() => handleInstantMatch(candidate)}
                            className="w-full py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            <Heart className="w-3 h-3 fill-current" />
                            <span>Match & Chat</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full py-1.5 rounded-xl bg-pastel-rose text-primary text-[10px] font-bold hover:bg-pastel-rose/80 transition-all flex items-center justify-center gap-1"
                          >
                            <Crown className="w-3 h-3" />
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
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-outline shadow-card">
              <div className="w-10 h-10 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">No New Likes Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
                When prospective matches like your profile on Discover, they will appear here!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. SENT LIKES TAB */}
      {activeTab === 'sent' && (
        <div className="space-y-2.5 animate-fade-in">
          {sentLikes.length > 0 ? (
            <div className="space-y-2">
              {sentLikes.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-outline shadow-subtle flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-pastel-rose text-primary flex items-center justify-center font-serif font-bold text-xs border border-pastel-rose-border">
                      {item.fullName ? item.fullName[0] : 'S'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                      <p className="text-[10px] text-secondary">{item.profession || 'Professional'} · {item.location || 'Global'}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    item.action === 'mutual_match'
                      ? 'bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border'
                      : 'bg-surface-variant text-secondary border border-outline'
                  }`}>
                    {item.action === 'mutual_match' ? (
                      <>
                        <Heart className="w-3 h-3 text-pastel-mint-text fill-current" />
                        <span>Matched</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-secondary" />
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-outline shadow-card">
              <div className="w-10 h-10 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-2">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Sent Likes Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
                Explore Discover and express interest to candidates you feel aligned with.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MUTUAL MATCHES TAB */}
      {activeTab === 'mutual' && (
        <div className="space-y-2.5 animate-fade-in">
          {mutualMatches.length > 0 ? (
            <div className="space-y-2">
              {mutualMatches.map(match => (
                <div
                  key={match.id}
                  onClick={() => setSelectedProfile(match)}
                  className="bg-white p-3 rounded-2xl border border-outline shadow-subtle flex items-center justify-between gap-3 hover:border-primary transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-full bg-surface-variant overflow-hidden border-2 border-primary shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <img
                        src={match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
                        alt={match.fullName}
                        className={`w-full h-full object-cover ${
                          match.blurPhotosByDefault && !match.photoRevealApproved ? 'blur-xs' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-serif font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                          {match.fullName}
                        </h4>
                      </div>

                      <p className="text-[10px] text-primary font-semibold">
                        {match.profession || 'Professional'} · {match.location}
                      </p>
                      <span className="text-[9px] text-secondary">
                        Tap to view complete biodata
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfile(match);
                      }}
                      title="View Full Profile"
                      className="w-8 h-8 rounded-xl bg-surface-variant border border-outline text-on-surface hover:bg-outline flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const convId = `conv_${[currentUser.id, match.id].sort().join('_')}`;
                        onOpenChat(convId);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-brand hover:bg-primary-dark active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-outline shadow-card">
              <div className="w-10 h-10 rounded-full bg-pastel-mint text-pastel-mint-text flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-pastel-mint-text fill-current" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Mutual Matches Yet</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
                When two profiles mutually like each other, you can immediately start a respectful chat here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. PASSED PROFILES */}
      {activeTab === 'passed' && (
        <div className="space-y-2.5 animate-fade-in">
          {passedProfiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] text-secondary">
                You passed on these profiles. You can reconsider or undo any pass below to return them to Discover:
              </p>
              {passedProfiles.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-outline shadow-subtle flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                    <p className="text-[10px] text-secondary">{item.profession || 'Professional'} · {item.location || 'Global'}</p>
                  </div>

                  <button
                    onClick={() => handleUndoPass(item.id, item.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-primary text-primary hover:bg-pastel-rose text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-subtle"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo Pass</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-outline shadow-card">
              <div className="w-10 h-10 rounded-full bg-surface-variant text-secondary flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Passed Profiles</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
                Any candidate profiles you pass on will appear here with an option to reconsider.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. BLOCKED USERS */}
      {activeTab === 'blocked' && (
        <div className="space-y-2.5 animate-fade-in">
          {blockedProfiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] text-secondary">
                Profiles you have shielded or blocked for privacy:
              </p>
              {blockedProfiles.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-outline shadow-subtle flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-serif font-bold text-xs text-on-surface">{item.fullName}</h4>
                    <p className="text-[10px] text-secondary">{item.reason || 'Blocked'} · {item.location || 'Global'}</p>
                  </div>

                  <button
                    onClick={() => handleUnblock(item.id, item.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-error text-error hover:bg-pastel-rose text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-subtle"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unblock</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white rounded-3xl border border-outline shadow-card">
              <div className="w-10 h-10 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-sm text-on-surface">No Blocked Profiles</h3>
              <p className="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
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
          className="px-5 py-2.5 rounded-full bg-white border border-outline text-primary font-sans text-xs font-bold hover:bg-surface-variant transition-all inline-flex items-center gap-1.5 shadow-subtle"
        >
          <Compass className="w-4 h-4" />
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

      {/* Full Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
          onLike={(p) => {
            handleInstantMatch(p);
            setSelectedProfile(null);
          }}
          onPass={(pid) => {
            dbService.sendMatchAction(pid, 'passed');
            setSelectedProfile(null);
            loadAllData();
          }}
        />
      )}
    </div>
  );
};
export default MatchesLikedYouScreen;



