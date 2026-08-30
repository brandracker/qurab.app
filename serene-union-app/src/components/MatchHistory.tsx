import React from 'react';
import { dbService } from '../services/dbService';

interface Props {
  onSelectChat: (convId: string) => void;
}

export const MatchHistory: React.FC<Props> = ({ onSelectChat }) => {
  const conversations = dbService.getConversations();
  const allProfiles = dbService.getAllProfiles().filter(p => p.id !== 'usr_004');

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-surface-variant/30 z-10">
        <h1 className="font-serif text-2xl font-bold text-primary">Matches & Activity</h1>
        <p className="text-xs text-secondary">Your connections and mutual interests</p>
      </header>

      {/* Mutual Matches Row */}
      <section className="p-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-base font-bold text-on-surface">Mutual Matches</h2>
          <span className="text-xs text-primary font-semibold">{conversations.length} Active</span>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => onSelectChat(conv.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 border-2 border-primary overflow-hidden shadow-md transition-transform group-hover:scale-105">
                <img
                  src={conv.otherUser.photos[0]}
                  alt={conv.otherUser.fullName}
                  className={`w-full h-full object-cover rounded-full ${
                    conv.otherUser.blurPhotosByDefault && !conv.otherUser.photoRevealApproved ? 'blur-sm' : ''
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-on-surface">
                {conv.otherUser.fullName.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Liked & Suggested Profiles */}
      <section className="p-6 pt-3 space-y-4">
        <h2 className="font-serif text-base font-bold text-on-surface">Profiles You Interacted With</h2>
        <div className="grid grid-cols-2 gap-3">
          {allProfiles.map(p => (
            <div
              key={p.id}
              className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col"
            >
              <div className="relative w-full h-36 bg-surface-container-high overflow-hidden">
                <img
                  src={p.photos[0]}
                  alt={p.fullName}
                  className={`w-full h-full object-cover ${
                    p.blurPhotosByDefault && !p.photoRevealApproved ? 'blur-md' : ''
                  }`}
                />
                <div className="absolute top-2 right-2 bg-surface/85 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-primary">
                  {p.religiousProfile.sect}
                </div>
              </div>
              <div className="p-3">
                <span className="font-serif font-bold text-sm text-on-surface block truncate">
                  {p.fullName}, {p.age}
                </span>
                <span className="text-xs text-secondary truncate block">{p.location}</span>
                <span className="text-[11px] text-primary block mt-1">{p.profession}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
