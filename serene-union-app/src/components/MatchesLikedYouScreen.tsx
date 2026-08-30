import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { dbService } from '../services/dbService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenDiscover: () => void;
}

export const MatchesLikedYouScreen: React.FC<Props> = ({ onOpenChat, onOpenDiscover }) => {
  const currentUser = dbService.getCurrentUser();
  const [interestedProfiles, setInterestedProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(true);
    dbService.fetchLikedYouCandidates().then(list => {
      setInterestedProfiles(list || []);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleInstantMatch = async (candidate: UserProfile) => {
    const res = await dbService.sendMatchAction(candidate.id, 'liked');
    // Remove from received list
    setInterestedProfiles(prev => prev.filter(p => p.id !== candidate.id));
    
    const convId = res.conversationId || `conv_${[currentUser.id, candidate.id].sort().join('_')}`;
    const newConv = dbService.createMatchConversation(candidate);
    onOpenChat(convId || newConv.id);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto pb-28 font-sans bg-background">
      {/* Header */}
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Interests & Matches</h1>
          <p className="text-xs text-secondary">Candidates who expressed interest in you</p>
        </div>
        {isVip && (
          <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span>VIP Unlocked</span>
          </span>
        )}
      </header>

      {/* VIP Unlock Banner for Free Users */}
      {!isVip && (
        <div className="bg-gradient-to-r from-primary/15 via-surface to-tertiary-container/20 rounded-3xl p-5 border border-primary/30 shadow-sm mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-xl">visibility</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-on-surface">
                {interestedProfiles.length} Candidates Liked You!
              </h3>
              <p className="text-[11px] text-secondary">
                Upgrade to Barakah VIP to unblur and match immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">lock_open</span>
            <span>Unlock "Who Liked You" with VIP</span>
          </button>
        </div>
      )}

      {/* Grid of Interested Candidates */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">
          Prospective Seekers ({interestedProfiles.length})
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">progress_activity</span>
            <p className="text-xs text-secondary">Checking candidates who expressed interest...</p>
          </div>
        ) : interestedProfiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {interestedProfiles.map(candidate => {
              const photo = candidate.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
              return (
                <div
                  key={candidate.id}
                  className="bg-surface rounded-2xl border border-surface-variant/40 overflow-hidden flex flex-col shadow-sm relative group"
                >
                {/* Photo with VIP blur control */}
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
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white p-2 text-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">lock</span>
                      <span className="text-[10px] font-bold">VIP Only</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-on-surface">
                    {candidate.location?.split(',')[0]}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xs text-on-surface truncate">
                      {isVip ? candidate.fullName : `${candidate.fullName.split(' ')[0]} (Liked You)`}
                    </h3>
                    <p className="text-[10px] text-secondary truncate mt-0.5">
                      {candidate.profession || 'Professional'} · {candidate.religiousProfile?.sect || 'Sunni'}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-surface-variant/20">
                    {isVip ? (
                      <button
                        onClick={() => handleInstantMatch(candidate)}
                        className="w-full py-2 rounded-xl bg-primary text-white text-[10px] font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">favorite</span>
                        <span>Match & Chat</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-2 rounded-xl bg-surface-container-high text-primary text-[10px] font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
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
              When prospective matches like your profile on Discover, they will appear here for you to connect!
            </p>
          </div>
        )}

        {/* Discover more button */}
        <div className="pt-6 text-center">
          <button
            onClick={onOpenDiscover}
            className="px-6 py-2.5 rounded-full bg-surface-container-high text-primary font-sans text-xs font-bold hover:bg-surface-variant transition-all inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>Explore More on Discover</span>
          </button>
        </div>
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
