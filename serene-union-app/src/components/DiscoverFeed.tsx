import React, { useState, useEffect } from 'react';
import type { UserProfile, FilterState } from '../types';
import { FilterModal } from './FilterModal';
import { MutualMatchModal } from './MutualMatchModal';
import { ProfileDetailModal } from './ProfileDetailModal';
import { dbService } from '../services/dbService';

interface Props {
  onOpenChat: (convId: string) => void;
  onOpenFilters?: () => void;
  onOpenMatches?: () => void;
  onOpenProfile?: () => void;
}

export const DiscoverFeed: React.FC<Props> = ({ onOpenChat }) => {
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
  }, []);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const updated = dbService.getDiscoverFeed(newFilters);
    setProfiles(updated);
  };

  const handleLike = async (profile: UserProfile) => {
    // Remove from current view
    setProfiles(prev => prev.filter(p => p.id !== profile.id));

    const result = await dbService.sendMatchAction(profile.id, 'liked');
    if (result.isMutual) {
      // True mutual match celebration
      setMatchedProfile(profile);
    } else {
      // One-sided like feedback toast
      setToastMessage(`Interest expressed to ${profile.fullName.split(' ')[0]}. You will be notified when they connect!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePass = (profileId: string) => {
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const handleToggleReveal = (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dbService.requestPhotoReveal(userId);
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          blurPhotosByDefault: false,
          photoRevealApproved: true,
          photoRevealRequested: true
        };
      }
      return p;
    }));
  };

  const filteredFeed = profiles.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden font-sans">
      {/* Top App Bar (Search + Filter) */}
      <header className="w-full sticky top-0 z-40 bg-background/90 backdrop-blur-md px-container-padding py-4 flex items-center justify-between gap-4 border-b border-surface-variant/30">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-full py-3 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-on-surface-variant"
            placeholder="Search by name, city, or career..."
            type="text"
          />
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          aria-label="Filters"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors flex-shrink-0 relative"
        >
          <span className="material-symbols-outlined">tune</span>
          {(filters.sects.length > 0 || filters.practiceLevels.length > 0) && (
            <span className="w-2.5 h-2.5 bg-tertiary-container rounded-full absolute top-2 right-2 border border-surface" />
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

      {/* Main Content Canvas - Scrollable Feed */}
      <main className="flex-1 overflow-y-auto px-container-padding pb-28 pt-2 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-xs text-secondary mt-2">Loading prospective matches from Cloudflare D1...</p>
          </div>
        ) : filteredFeed.length > 0 ? (
          filteredFeed.map(profile => (
            <article
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest flex flex-col animate-fade-in cursor-pointer hover:border-primary/40 transition-all group"
            >
              {/* Photo Area */}
              <div className="relative w-full h-80 bg-surface-container-high overflow-hidden">
                <img
                  alt={profile.fullName}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    profile.blurPhotosByDefault && !profile.photoRevealApproved
                      ? 'filter blur-xl scale-110 opacity-80'
                      : 'scale-100 group-hover:scale-105'
                  }`}
                  src={profile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'}
                />

                {/* Unblur Overlay Button */}
                {profile.blurPhotosByDefault && !profile.photoRevealApproved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <button
                      type="button"
                      onClick={(e) => handleToggleReveal(profile.id, e)}
                      className="bg-background/90 backdrop-blur-md px-6 py-3 rounded-full text-on-background font-sans text-xs font-semibold shadow-sm flex items-center gap-2 hover:bg-background transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>Tap to reveal photo</span>
                    </button>
                  </div>
                )}

                {/* Location Pill & Spotlight Boost Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <div className="bg-background/85 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-on-surface shadow-sm">
                    <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                    <span className="font-sans text-xs font-semibold">{profile.location}</span>
                  </div>

                  {Boolean(profile.isSpotlightActive) && (
                    <div className="bg-gradient-to-r from-amber-500 to-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                      <span className="material-symbols-outlined text-[13px]">bolt</span>
                      <span>#1 City Spotlight</span>
                    </div>
                  )}
                </div>

                {/* Wali & VIP Crown Badges */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
                  {profile.wali && (
                    <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-primary text-xs font-semibold border border-primary/20 shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      <span>Wali Verified</span>
                    </div>
                  )}

                  {Boolean(profile.isVip) && (
                    <div className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                      <span>Barakah VIP</span>
                    </div>
                  )}
                </div>

                {/* Tap to view full profile hint */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-2xl font-bold text-on-surface">
                    {profile.fullName.split(' ')[0]}, {profile.age}
                  </h2>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {profile.marriageTimeline?.replace('_', ' ') || 'Within 1 Year'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">mosque</span>
                  <span>{profile.religiousProfile.practiceLevel.replace('_', ' ')} · {profile.religiousProfile.sect}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">work</span>
                  <span>{profile.profession} {profile.workArrangement ? `(${profile.workArrangement.toUpperCase()})` : ''}</span>
                </div>

                {/* Visual Quick Badges */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.ethnicity && (
                    <span className="bg-surface-container-high text-on-surface text-[10px] font-semibold px-2 py-0.5 rounded-full border border-surface-variant/40">
                      🌍 {profile.ethnicity}
                    </span>
                  )}
                  {profile.citizenship && (
                    <span className="bg-surface-container-high text-on-surface text-[10px] font-semibold px-2 py-0.5 rounded-full border border-surface-variant/40">
                      🛂 {profile.citizenship}
                    </span>
                  )}
                  {profile.willingnessToRelocate && (
                    <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      ✈️ {profile.willingnessToRelocate === 'willing' ? 'Relocation: Open' : 'Local Preference'}
                    </span>
                  )}
                  {profile.hobbies && profile.hobbies.length > 0 && (
                    <span className="bg-surface-container-high text-secondary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-surface-variant/40">
                      {profile.hobbies[0]}
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                  {profile.bio || profile.religiousProfile?.deenRelationshipBio}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-surface-container-highest">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePass(profile.id);
                    }}
                    aria-label="Pass"
                    className="w-12 h-12 rounded-full border border-secondary text-secondary flex items-center justify-center hover:bg-surface-variant active:scale-95 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>

                  {/* Direct Salam Instant Connect Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Instant Direct Salam without waiting for mutual match
                      const convId = `conv_direct_${Date.now()}`;
                      const user = dbService.getCurrentUser();
                      const convs = dbService.getConversations();
                      convs.unshift({
                        id: convId,
                        participantOne: user.id,
                        participantTwo: profile.id,
                        otherUser: profile,
                        lastMessageText: 'Assalamu Alaikum! (Direct Salam Sent)',
                        lastMessageSenderId: user.id,
                        lastMessageTime: 'Just now',
                        unreadCount: 0,
                        waliName: profile.wali?.name,
                        status: 'active' as const,
                        messages: [
                          {
                            id: 'msg_salam_' + Date.now(),
                            senderId: user.id,
                            senderName: user.fullName,
                            text: 'Assalamu Alaikum! I came across your profile on Serene Union and would be honored to introduce myself for matrimonial consideration.',
                            timestamp: 'Just now',
                            isRead: true,
                            waliNotified: Boolean(profile.wali)
                          }
                        ]
                      });
                      localStorage.setItem('serene_conversations_v1', JSON.stringify(convs));
                      onOpenChat(convId);
                    }}
                    aria-label="Direct Salam"
                    className="px-4 py-3 rounded-full bg-surface-container-high border border-primary/40 text-primary font-sans text-xs font-bold hover:bg-primary/10 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">send_time_extension</span>
                    <span>Direct Salam</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(profile);
                    }}
                    aria-label="Like"
                    className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-xl fill">favorite</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">sentiment_satisfied</span>
            <p className="font-serif text-lg font-bold text-on-surface">No more profiles nearby</p>
            <p className="font-sans text-xs text-on-surface-variant mt-1">Try adjusting your filters to see more people.</p>
            <button
              onClick={() => {
                setFilters({
                  minAge: 18,
                  maxAge: 50,
                  maxDistance: 100,
                  sects: [],
                  practiceLevels: [],
                  marriageTimelines: [],
                  languages: ['English']
                });
                setProfiles(dbService.getDiscoverFeed());
              }}
              className="mt-4 px-4 py-2 bg-primary/10 text-primary font-sans text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Full Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
          onLike={handleLike}
          onPass={handlePass}
        />
      )}

      {/* Filter Modal */}
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
    </div>
  );
};
