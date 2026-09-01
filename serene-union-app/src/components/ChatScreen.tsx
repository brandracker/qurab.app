import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, ChatMessage } from '../types';
import { dbService, API_BASE } from '../services/dbService';

interface Props {
  initialConvId?: string;
  onBackToDiscover: () => void;
}

export const ChatScreen: React.FC<Props> = ({ initialConvId, onBackToDiscover }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => dbService.getConversations());
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId || null);
  const [inputText, setInputText] = useState<string>('');
  const [showRespectfulCloseModal, setShowRespectfulCloseModal] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentUser = dbService.getCurrentUser();

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
      <div className="flex-1 flex flex-col h-full bg-background font-sans select-none pb-24">
        <header className="sticky top-0 bg-surface/90 backdrop-blur-xl px-5 py-3 border-b border-surface-variant/40 flex items-center justify-between z-20 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
              <span>Messages & Chaperone</span>
              <span className="font-arabic text-primary text-base font-bold">قُرب</span>
            </h1>
            <p className="text-xs text-secondary mt-0.5">Respectful & Intentional Matrimonial Discussions</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-surface-variant/40 p-3 space-y-1.5">
          {conversations.length > 0 ? (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className="p-3.5 bg-surface rounded-2xl border border-surface-variant/80 hover:border-primary/40 hover:shadow-card flex items-center gap-3.5 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/40 bg-surface-variant flex items-center justify-center group-hover:scale-105 transition-transform">
                  {conv.otherUser.photos && conv.otherUser.photos.length > 0 ? (
                    <img
                      src={conv.otherUser.photos[0]}
                      alt={conv.otherUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-base font-bold text-primary">
                      {conv.otherUser.fullName.charAt(0)}
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-serif font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {conv.otherUser.fullName}
                    </h3>
                    <span className="text-[10px] text-secondary font-medium">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{conv.lastMessageText || 'Tap to start conversation...'}</p>
                  {conv.waliName && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1.5 border border-primary/20">
                      <span className="material-symbols-outlined text-[11px]">supervisor_account</span>
                      Wali Observed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-surface rounded-3xl border border-surface-variant/80 my-8 shadow-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">chat</span>
              </div>
              <h3 className="font-serif text-base font-bold text-on-surface">No Conversations Yet</h3>
              <p className="text-xs text-secondary max-w-xs mt-1 leading-relaxed">
                Explore profiles in the Discover tab and express mutual interest or send a Direct Salam to start a blessed conversation.
              </p>
              <button
                onClick={onBackToDiscover}
                className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all"
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
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden font-sans select-none pb-20">
      {/* Chat Top Header */}
      <header className="sticky top-0 bg-surface/90 backdrop-blur-xl px-4 py-2.5 border-b border-surface-variant/40 flex items-center justify-between z-20 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveConvId(null)}
            className="w-9 h-9 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-surface-variant flex items-center justify-center">
            {activeConv.otherUser.photos && activeConv.otherUser.photos.length > 0 ? (
              <img
                src={activeConv.otherUser.photos[0]}
                alt={activeConv.otherUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-sm font-bold text-primary">
                {activeConv.otherUser.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span>{activeConv.otherUser.fullName.split(' ')[0]}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
            </h2>
            <p className="text-[10px] text-secondary">{activeConv.otherUser.location || 'Global'}</p>
          </div>
        </div>

        <button
          onClick={() => setShowRespectfulCloseModal(true)}
          className="text-[11px] text-secondary hover:text-error px-3 py-1 rounded-full border border-surface-variant hover:border-error/40 transition-colors flex items-center gap-1 font-semibold"
          title="End Conversation Respectfully"
        >
          <span className="material-symbols-outlined text-[15px]">archive</span>
          <span>Close Chat</span>
        </button>
      </header>

      {/* Advisory & Wali Chaperone Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-surface to-accent-gold-light/20 px-4 py-2 border-b border-surface-variant/40 flex items-center justify-between text-xs text-on-surface z-10 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">supervisor_account</span>
          <span className="text-[11px] font-semibold text-primary-dark">
            {activeConv.waliName ? `Wali: ${activeConv.waliName}` : 'Wali Mode: Active & Chaperoned'}
          </span>
        </div>
        <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-xs">
          Halal Monitored
        </span>
      </div>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Date Marker */}
        <div className="flex justify-center">
          <span className="text-[10px] text-secondary bg-surface px-3 py-1 rounded-full border border-surface-variant/80 font-medium shadow-2xs">
            ✨ Conversation Began with Bismillah
          </span>
        </div>

        {activeConv.messages && activeConv.messages.length > 0 ? (
          activeConv.messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col gap-1 max-w-[82%] ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-br from-primary to-primary-light text-white rounded-br-xs shadow-emerald'
                      : 'bg-surface text-on-surface rounded-bl-xs border border-surface-variant/80 shadow-card'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-secondary px-1 font-medium">
                  <span>{msg.timestamp || 'Just now'}</span>
                  {isMe && <span className="material-symbols-outlined text-[12px] text-primary">done_all</span>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-secondary text-xs">
            <span className="material-symbols-outlined text-3xl mb-1 text-primary">chat_bubble_outline</span>
            <p>No messages yet. Send a respectful salam to begin.</p>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* Clean Message Input Footer */}
      <footer className="p-3 bg-surface/90 backdrop-blur-xl border-t border-surface-variant/40 flex items-center gap-2 z-20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Write a respectful message..."
          className="flex-1 bg-background border border-surface-variant/80 rounded-full px-4 py-2.5 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs placeholder:text-secondary/70"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-center shadow-emerald hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </footer>

      {/* Respectful Close Modal */}
      {showRespectfulCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-variant text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface">End Conversation with Grace</h3>
            <p className="text-xs text-secondary leading-relaxed">
              In accordance with Islamic adab, closing a conversation sends a respectful closing du'a to {activeConv.otherUser.fullName.split(' ')[0]}.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRespectfulCloseModal(false)}
                className="flex-1 py-2.5 rounded-full border border-surface-variant text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRespectfulCloseModal(false);
                  setActiveConvId(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-light text-white text-xs font-semibold shadow-emerald hover:brightness-110 transition-all"
              >
                Close with Du'a
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatScreen;

