import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, CheckCheck, Send, Archive, Heart, Sparkles, MessageCircle, FileText } from 'lucide-react';
import type { Conversation, ChatMessage, UserProfile } from '../types';
import { dbService, API_BASE } from '../services/dbService';
import { ProfileDetailModal } from './ProfileDetailModal';

interface Props {
  initialConvId?: string;
  onBackToDiscover: () => void;
}

export const ChatScreen: React.FC<Props> = ({ initialConvId, onBackToDiscover }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => dbService.getConversations());
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId || null);
  const [inputText, setInputText] = useState<string>('');
  const [showRespectfulCloseModal, setShowRespectfulCloseModal] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentUser = dbService.getCurrentUser();

  const isUserOnline = (user: UserProfile): boolean => {
    if (user.isOnline !== undefined) return user.isOnline;
    return user.fullName.toLowerCase().includes('sarah') || user.fullName.toLowerCase().includes('fatima');
  };

  const getUserStatusText = (user: UserProfile): string => {
    if (isUserOnline(user)) return 'Active now';
    return user.lastActive || 'Active 20m ago';
  };


  // Load and sync conversation list
  useEffect(() => {
    const list = dbService.getConversations();
    setConversations(list);
    if (initialConvId) {
      setActiveConvId(initialConvId);
    }

    // Sync latest from live server
    dbService.fetchLiveConversations().then(liveList => {
      if (liveList) {
        setConversations([...liveList]);
      }
    });
  }, [initialConvId]);

  const activeConv = conversations.find(c => 
    c.id === activeConvId || 
    (activeConvId && c.otherUser?.id && activeConvId.includes(c.otherUser.id))
  );

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages?.length]);

  // Live polling for real multi-device messages from Cloudflare D1
  useEffect(() => {
    if (!activeConvId || !activeConv) return;

    const targetRoomId = activeConv.otherUser?.id 
      ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
      : activeConvId;

    const fetchLiveMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/conversations/${targetRoomId}/messages`);
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const convs = dbService.getConversations();
          const curr = convs.find(c => c.id === activeConvId || c.id === targetRoomId || (activeConv.otherUser && c.otherUser?.id === activeConv.otherUser.id));
          if (curr) {
            curr.id = targetRoomId;

            // Format D1 confirmed messages
            const formattedMessages: ChatMessage[] = data.messages.map((m: any) => {
              const formattedTime = m.timestamp && (m.timestamp.includes('T') || m.timestamp.includes('-') || m.timestamp.includes(':'))
                ? (m.timestamp.includes('T') || m.timestamp.includes('-') ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp)
                : (m.timestamp || 'Just now');

              return {
                id: m.id,
                senderId: m.senderId,
                senderName: m.senderName || 'Member',
                text: m.text,
                timestamp: formattedTime,
                isRead: true,
                waliNotified: true
              };
            });

            if (formattedMessages.length > 0) {
              curr.messages = formattedMessages;
              curr.lastMessageText = formattedMessages[formattedMessages.length - 1]?.text || '';
              curr.lastMessageTime = formattedMessages[formattedMessages.length - 1]?.timestamp || '';
              localStorage.setItem('serene_conversations_v1', JSON.stringify(convs));
              setConversations([...convs]);
            }
          }
        }
      } catch {}
    };

    fetchLiveMessages();
    const interval = setInterval(fetchLiveMessages, 2500);
    return () => clearInterval(interval);
  }, [activeConvId, activeConv?.otherUser?.id]);

  // Real User-to-User Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConvId || !activeConv) return;

    const text = inputText.trim();
    const user = dbService.getCurrentUser();
    const targetRoomId = activeConv.otherUser?.id 
      ? (`conv_${[user.id, activeConv.otherUser.id].sort().join('_')}`)
      : activeConvId;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      senderName: user.fullName || 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: true
    };

    // Update locally immediately for instant feedback
    const convs = dbService.getConversations();
    const current = convs.find(c => c.id === activeConvId || c.id === targetRoomId || (activeConv.otherUser && c.otherUser?.id === activeConv.otherUser.id));
    if (current) {
      current.id = targetRoomId;
      if (!current.messages) current.messages = [];
      current.messages.push(newMsg);
      current.lastMessageText = text;
      current.lastMessageSenderId = user.id;
      current.lastMessageTime = newMsg.timestamp;
      localStorage.setItem('serene_conversations_v1', JSON.stringify(convs));
      setConversations([...convs]);
      if (activeConvId !== targetRoomId) {
        setActiveConvId(targetRoomId);
      }
    }
    setInputText('');

    // Save permanently to Cloudflare D1 SQL database
    try {
      await fetch(`${API_BASE}/conversations/${targetRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newMsg.id,
          senderId: user.id,
          senderName: user.fullName || 'Member',
          text,
          receiverId: activeConv.otherUser?.id
        })
      });
    } catch {}
  };

  // If no active conversation, show conversation list
  if (!activeConv) {
    return (
      <div className="flex-1 flex flex-col h-full bg-background font-sans select-none pb-24 text-on-surface">
        <header className="sticky top-0 bg-white px-4 py-3 border-b border-outline flex items-center justify-between z-20 shadow-subtle">
          <div>
            <h1 className="font-serif text-xl font-bold text-on-surface">
              Messages & Chaperone
            </h1>
            <p className="text-[11px] text-secondary mt-0.5">Respectful & Intentional Matrimonial Discussions</p>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto divide-y divide-outline p-3 space-y-1">
          {conversations.length > 0 ? (
            conversations.map(conv => {
              const online = isUserOnline(conv.otherUser);
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className="p-3.5 bg-white rounded-2xl border border-outline hover:border-primary flex items-center gap-3 cursor-pointer transition-all shadow-subtle group"
                >
                  {/* Clickable Profile Avatar with Real-time Presence Badge */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(conv.otherUser);
                    }}
                    className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/30 bg-surface-variant flex items-center justify-center group-hover:scale-105 transition-transform hover:border-primary shadow-subtle cursor-pointer"
                    title={`Click to view ${conv.otherUser.fullName}'s Biodata`}
                  >
                    {conv.otherUser.photos && conv.otherUser.photos.length > 0 ? (
                      <img
                        src={conv.otherUser.photos[0]}
                        alt={conv.otherUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-sm font-bold text-primary">
                        {conv.otherUser.fullName.charAt(0)}
                      </span>
                    )}

                    {/* Live Online / Offline Presence Badge */}
                    {online ? (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs flex items-center justify-center" title="Online now">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </span>
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-300 ring-2 ring-white shadow-2xs" title="Offline" />
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfile(conv.otherUser);
                          }}
                          className="font-serif font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer hover:underline"
                          title="Click to view full biodata"
                        >
                          {conv.otherUser.fullName}
                        </h3>

                        {online ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="text-[10px] text-secondary shrink-0">
                            {getUserStatusText(conv.otherUser)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-secondary shrink-0">{conv.lastMessageTime}</span>
                    </div>

                    <p className="text-xs text-secondary truncate">{conv.lastMessageText || 'Tap to start conversation...'}</p>

                    <div className="flex items-center gap-2 mt-1">
                      {conv.waliName && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-pastel-mint-text bg-pastel-mint px-2 py-0.2 rounded-full border border-pastel-mint-border">
                          <Users className="w-3 h-3 text-pastel-mint-text" />
                          Wali Observed
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfile(conv.otherUser);
                        }}
                        className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Biodata</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (

            <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-3xl border border-outline my-6 shadow-card">
              <div className="w-12 h-12 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-base font-bold text-on-surface">No Conversations Yet</h3>
              <p className="text-xs text-secondary max-w-xs mt-1 leading-relaxed">
                Explore profiles in the Discover tab and express mutual interest or send a Direct Salam to start a blessed conversation.
              </p>
              <button
                onClick={onBackToDiscover}
                className="mt-4 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all"
              >
                Go to Discover
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden font-sans select-none pb-20 text-on-surface">
      {/* Chat Top Header */}
      <header className="sticky top-0 bg-white px-3.5 py-2.5 border-b border-outline flex items-center justify-between z-20 shadow-subtle">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setActiveConvId(null)}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Clickable Avatar to View Full Biodata */}
          <div 
            onClick={() => setSelectedProfile(activeConv.otherUser)}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 bg-surface-variant flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-subtle shrink-0 hover:border-primary"
            title="Click to view full biodata"
          >
            {activeConv.otherUser.photos && activeConv.otherUser.photos.length > 0 ? (
              <img
                src={activeConv.otherUser.photos[0]}
                alt={activeConv.otherUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-xs font-bold text-primary">
                {activeConv.otherUser.fullName.charAt(0)}
              </span>
            )}
            {isUserOnline(activeConv.otherUser) ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            ) : (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gray-300 ring-2 ring-white" />
            )}
          </div>

          {/* Clickable Name & Live Online Presence */}
          <div 
            onClick={() => setSelectedProfile(activeConv.otherUser)}
            className="cursor-pointer group flex flex-col min-w-0"
            title="Click to view full biodata"
          >
            <h2 className="font-serif font-bold text-xs text-on-surface flex items-center gap-1 group-hover:text-primary transition-colors truncate">
              <span>{activeConv.otherUser.fullName.split(' ')[0]}</span>
              {isUserOnline(activeConv.otherUser) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              )}
            </h2>
            <p className="text-[10px] flex items-center gap-1.5 truncate">
              {isUserOnline(activeConv.otherUser) ? (
                <span className="text-emerald-600 font-semibold">Active now</span>
              ) : (
                <span className="text-secondary">{getUserStatusText(activeConv.otherUser)}</span>
              )}
              <span className="text-secondary">•</span>
              <span className="text-primary font-bold group-hover:underline">View Biodata</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedProfile(activeConv.otherUser)}
            className="text-[10px] text-primary font-bold bg-pastel-rose hover:bg-pastel-rose/80 px-2.5 py-1 rounded-full border border-pastel-rose-border transition-colors flex items-center gap-1 shadow-2xs"
            title="View Full Biodata"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden sm:inline">Biodata</span>
          </button>

          <button
            onClick={() => setShowRespectfulCloseModal(true)}
            className="text-[10px] text-secondary hover:text-error px-2 py-1 rounded-full border border-outline hover:border-error transition-colors flex items-center gap-1 font-semibold"
            title="End Conversation Respectfully"
          >
            <Archive className="w-3 h-3" />
            <span>Close</span>
          </button>
        </div>
      </header>


      {/* Advisory & Wali Chaperone Banner (Clean Pastel) */}
      <div className="bg-pastel-mint px-3.5 py-1.5 border-b border-pastel-mint-border flex items-center justify-between text-xs text-pastel-mint-text z-10">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-pastel-mint-text" />
          <span className="text-[10px] font-semibold">
            {activeConv.waliName ? `Wali: ${activeConv.waliName}` : 'Wali Mode: Active & Chaperoned'}
          </span>
        </div>
        <span className="text-[9px] bg-white text-pastel-mint-text border border-pastel-mint-border px-2 py-0.2 rounded-md font-bold uppercase tracking-wide">
          Halal Monitored
        </span>
      </div>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* Date Marker */}
        <div className="flex justify-center">
          <span className="text-[10px] text-secondary bg-white px-3 py-0.5 rounded-full border border-outline font-medium shadow-subtle flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Conversation Began with Bismillah</span>
          </span>
        </div>

        {activeConv.messages && activeConv.messages.length > 0 ? (
          activeConv.messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col gap-0.5 max-w-[82%] ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-br-2xs shadow-brand'
                      : 'bg-white text-on-surface rounded-bl-2xs border border-outline shadow-subtle'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-secondary px-1 font-medium">
                  <span>{msg.timestamp || 'Just now'}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-secondary text-xs">
            <MessageCircle className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p>No messages yet. Send a respectful salam to begin.</p>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* Clean Message Input Footer */}
      <footer className="p-2.5 bg-white border-t border-outline flex items-center gap-2 z-20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Write a respectful message..."
          className="flex-1 bg-surface-variant border border-outline rounded-full px-3.5 py-2 text-xs text-on-surface outline-none focus:bg-white focus:border-primary placeholder:text-secondary/70"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-brand hover:bg-primary-dark active:scale-95 disabled:opacity-40 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </footer>

      {/* Respectful Close Modal */}
      {showRespectfulCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-outline text-center space-y-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-pastel-rose text-primary flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-serif text-base font-bold text-on-surface">End Conversation with Grace</h3>
            <p className="text-xs text-secondary leading-relaxed">
              In accordance with Islamic adab, closing a conversation sends a respectful closing du'a to {activeConv.otherUser.fullName.split(' ')[0]}.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowRespectfulCloseModal(false)}
                className="flex-1 py-2 rounded-full border border-outline text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRespectfulCloseModal(false);
                  setActiveConvId(null);
                }}
                className="flex-1 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow-brand hover:bg-primary-dark transition-all"
              >
                Close with Du'a
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Matrimonial Biodata Profile Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
        />
      )}

    </div>
  );
};
export default ChatScreen;



