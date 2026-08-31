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

type ViewMode = 'grid' | 'detailed';

export const DiscoverFeed: React.FC<Props> = ({ onOpenChat }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
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

  const handleLike = async (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProfiles(prev => prev.filter(p => p.id !== profile.id));

    const result = await dbService.sendMatchAction(profile.id, 'liked');
    if (result.isMutual) {
      setMatchedProfile(profile);
    } else {
      setToastMessage(`Interest expressed to ${profile.fullName.split(' ')[0]}. You will be notified when they connect!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePass = (profileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dbService.sendMatchAction(profileId, 'passed');
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // Category & search filtering
  const filteredFeed = profiles.filter(p => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === 'practicing') {
      return p.religiousProfile?.practiceLevel === 'practicing' || p.religiousProfile?.prayerFrequency?.includes('5');
    }
    if (activeCategory === 'relocation') {
      return p.willingnessToRelocate === 'willing' || p.willingnessToRelocate === 'open';
    }
    if (activeCategory === 'citizens') {
      return p.citizenship && p.citizenship.toLowerCase().includes('citizen');
    }
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden font-sans">
      {/* Top Header: Search + Filters */}
      <header className="w-full sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-surface-variant/30 space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-full py-2.5 pl-10 pr-4 text-xs text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-secondary"
              placeholder="Search by name, city, career..."
              type="text"
            />
          </div>

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
        </div>

        {/* View Switcher & Quick Category Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Matches' },
              { id: 'practicing', label: '🕌 Practicing' },
              { id: 'relocation', label: '✈️ Relocation Open' },
              { id: 'citizens', label: '🛂 Citizens' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-high text-secondary hover:text-on-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dual-View Switcher Toggle (Grid vs Detailed) */}
          <div className="flex items-center bg-surface-container-high p-0.5 rounded-full border border-surface-variant/40 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              title="Detailed Feed"
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                viewMode === 'detailed'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            </button>
          </div>
        </div>
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-xs text-secondary mt-2">Loading prospective matches...</p>
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">favorite_border</span>
            <h3 className="font-serif text-base font-bold text-on-surface">No Prospective Profiles Right Now</h3>
            <p className="text-xs text-secondary max-w-xs mt-1">
              Try adjusting your search criteria or filters to view more global matrimonial candidates.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
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
        ) : viewMode === 'grid' ? (
          /* ========================================================= */
          /* 1. GRID GALLERY VIEW (2-Column Sleek Matrimonial Cards)  */
          /* ========================================================= */
          <div className="grid grid-cols-2 gap-3 pb-6">
            {filteredFeed.map(profile => (
              <article
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className="bg-surface rounded-2xl overflow-hidden border border-surface-variant/40 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between cursor-pointer group"
              >
                {/* Photo Header */}
                <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
                  <img
                    alt={profile.fullName}
                    src={profile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      profile.blurPhotosByDefault && !profile.photoRevealApproved
                        ? 'filter blur-xl scale-110 opacity-80'
                        : 'scale-100 group-hover:scale-105'
                    }`}
                  />

                  {/* Modesty Shield Badge */}
                  {profile.blurPhotosByDefault && !profile.photoRevealApproved && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
                      <div className="bg-background/85 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface font-sans text-[9px] font-bold shadow-xs flex items-center gap-1 border border-surface-variant/40">
                        <span className="material-symbols-outlined text-[13px] text-primary">shield</span>
                        <span>Modesty Shield</span>
                      </div>
                    </div>
                  )}

                  {/* Wali Badge */}
                  {profile.wali && (
                    <div className="absolute top-2 right-2 bg-primary/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                      <span className="material-symbols-outlined text-[11px]">verified_user</span>
                      <span>Wali</span>
                    </div>
                  )}

                  {/* Location Pill */}
                  <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[10px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    <span className="truncate max-w-[100px]">{profile.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-on-surface truncate">
                      {profile.fullName.split(' ')[0]}, {profile.age}
                    </h3>
                    <p className="text-[11px] text-primary font-semibold truncate mt-0.5">
                      {profile.profession}
                    </p>
                    <p className="text-[10px] text-secondary truncate mt-0.5">
                      {profile.religiousProfile?.practiceLevel?.replace('_', ' ')} · {profile.religiousProfile?.sect}
                    </p>
                  </div>

                  {/* Quick Pills */}
                  <div className="flex flex-wrap gap-1">
                    {profile.ethnicity && (
                      <span className="bg-surface-container-high text-on-surface text-[9px] font-medium px-1.5 py-0.5 rounded border border-surface-variant/30">
                        {profile.ethnicity}
                      </span>
                    )}
                    {profile.willingnessToRelocate && (
                      <span className="bg-primary/10 text-primary text-[9px] font-medium px-1.5 py-0.5 rounded">
                        ✈️ {profile.willingnessToRelocate === 'willing' ? 'Reloc Open' : 'Local'}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-surface-variant/30 mt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProfile(profile)}
                      className="flex-1 py-1.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant text-[10px] font-bold text-center transition-colors"
                    >
                      Biodata
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleLike(profile, e)}
                      title="Express Interest"
                      className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-xs shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ========================================================= */
          /* 2. DETAILED EDITORIAL STREAM VIEW                        */
          /* ========================================================= */
          <div className="space-y-6 pb-6">
            {filteredFeed.map(profile => (
              <article
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className="bg-surface rounded-3xl overflow-hidden shadow-xs border border-surface-variant/40 flex flex-col cursor-pointer hover:border-primary/40 transition-all group"
              >
                {/* Photo Banner */}
                <div className="relative w-full h-80 bg-surface-container-high overflow-hidden">
                  <img
                    alt={profile.fullName}
                    src={profile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      profile.blurPhotosByDefault && !profile.photoRevealApproved
                        ? 'filter blur-xl scale-110 opacity-80'
                        : 'scale-100 group-hover:scale-105'
                    }`}
                  />

                  {/* Modesty Shield Badge */}
                  {profile.blurPhotosByDefault && !profile.photoRevealApproved && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
                      <div className="bg-background/85 backdrop-blur-md px-4 py-2 rounded-full text-on-surface font-sans text-[11px] font-semibold shadow-sm flex items-center gap-1.5 border border-surface-variant/40">
                        <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                        <span>Modesty Shield Active</span>
                      </div>
                    </div>
                  )}

                  {/* Top Left Location */}
                  <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-on-surface shadow-xs text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                    <span>{profile.location}</span>
                  </div>

                  {/* Top Right Wali / VIP */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                    {profile.wali && (
                      <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-primary text-xs font-semibold border border-primary/20 shadow-xs">
                        <span className="material-symbols-outlined text-[15px]">verified_user</span>
                        <span>Wali Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info & Biodata Section */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-on-surface">
                        {profile.fullName.split(' ')[0]}, {profile.age}
                      </h2>
                      <p className="text-xs text-primary font-bold mt-0.5">
                        {profile.profession} {profile.workArrangement ? `(${profile.workArrangement.toUpperCase()})` : ''}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {profile.marriageTimeline?.replace('_', ' ') || 'Within 1 Year'}
                    </span>
                  </div>

                  {/* Deen & Education line */}
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[18px] text-primary">mosque</span>
                    <span>{profile.religiousProfile?.practiceLevel?.replace('_', ' ')} · {profile.religiousProfile?.sect} ({profile.religiousProfile?.madhhab || 'Hanafi'})</span>
                  </div>

                  {/* Visual Badges Strip */}
                  <div className="flex flex-wrap gap-1.5">
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
                    {profile.maritalStatus && (
                      <span className="bg-surface-container-high text-on-surface text-[10px] font-semibold px-2 py-0.5 rounded-full border border-surface-variant/40">
                        💍 {profile.maritalStatus.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {profile.bio || profile.religiousProfile?.deenRelationshipBio}
                  </p>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-surface-variant/40 mt-1">
                    <button
                      type="button"
                      onClick={(e) => handlePass(profile.id, e)}
                      className="px-4 py-2.5 rounded-full border border-surface-variant bg-surface text-secondary hover:bg-surface-container-low text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProfile(profile)}
                      className="px-4 py-2.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Biodata</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleLike(profile, e)}
                      className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Profile Detail Modal */}
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
    </div>
  );
};
