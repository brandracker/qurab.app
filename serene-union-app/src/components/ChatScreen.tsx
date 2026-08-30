import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, ChatMessage } from '../types';
import { dbService, API_BASE } from '../services/dbService';
import { RewardedAdModal } from './RewardedAdModal';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';

interface Props {
  initialConvId?: string;
  onBackToDiscover: () => void;
}

export const ChatScreen: React.FC<Props> = ({ initialConvId, onBackToDiscover }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => dbService.getConversations());
  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    const list = dbService.getConversations();
    return initialConvId || (list.length > 0 ? list[0].id : null);
  });
  const [inputText, setInputText] = useState<string>('');
  const [showRespectfulCloseModal, setShowRespectfulCloseModal] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [messagesQuota, setMessagesQuota] = useState<number>(15);
  const [messagesSentToday, setMessagesSentToday] = useState<number>(3);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentUser = dbService.getCurrentUser();

  // Load and sync conversation list
  useEffect(() => {
    const list = dbService.getConversations();
    setConversations(list);
    if (initialConvId) {
      setActiveConvId(initialConvId);
    } else if (list.length > 0 && !activeConvId) {
      setActiveConvId(list[0].id);
    }

    // Sync latest from live server
    dbService.fetchLiveConversations().then(liveList => {
      if (liveList && liveList.length > 0) {
        setConversations([...liveList]);
        if (!activeConvId && !initialConvId) {
          setActiveConvId(liveList[0].id);
        }
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
              const remoteIds = new Set(formattedMessages.map(m => m.id));
              // Keep pending local messages that haven't reached server yet
              const pendingLocal = (curr.messages || []).filter(m => m.id && !remoteIds.has(m.id) && m.senderId === currentUser.id);
              const merged = [...formattedMessages, ...pendingLocal];
              curr.messages = merged;
              curr.lastMessageText = merged[merged.length - 1]?.text || '';
              curr.lastMessageTime = merged[merged.length - 1]?.timestamp || '';
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

    // Check message quota
    if (messagesSentToday >= messagesQuota) {
      setShowAdModal(true);
      return;
    }

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
    setMessagesSentToday(prev => prev + 1);

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
      <div className="flex-1 flex flex-col h-full bg-surface">
        <header className="sticky top-0 bg-surface/90 backdrop-blur-md px-6 py-4 border-b border-surface-variant/30 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary">Conversations</h1>
            <p className="text-xs text-secondary">Respectful & Intentional Matrimonial Discussions</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-surface-variant/30">
          {conversations.length > 0 ? (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className="p-4 flex items-center gap-4 hover:bg-surface-container-low cursor-pointer transition-colors"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-surface-variant bg-surface-container-high flex items-center justify-center">
                  {conv.otherUser.photos && conv.otherUser.photos.length > 0 ? (
                    <img
                      src={conv.otherUser.photos[0]}
                      alt={conv.otherUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-lg font-bold text-primary">
                      {conv.otherUser.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-serif font-bold text-sm text-on-surface truncate">
                      {conv.otherUser.fullName}
                    </h3>
                    <span className="text-[11px] text-secondary">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{conv.lastMessageText}</p>
                  {conv.waliName && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                      <span className="material-symbols-outlined text-[12px]">supervisor_account</span>
                      Wali Observed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-outline mb-3">chat</span>
              <h3 className="font-serif text-lg font-bold text-on-surface">No Conversations Yet</h3>
              <p className="text-xs text-secondary max-w-xs mt-1">
                Explore profiles in the Discover tab and express mutual interest to start a blessed conversation.
              </p>
              <button
                onClick={onBackToDiscover}
                className="mt-4 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:brightness-110"
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
    <div className="flex-1 flex flex-col h-full bg-surface relative overflow-hidden font-sans">
      {/* Chat Top Header */}
      <header className="sticky top-0 bg-surface/95 backdrop-blur-md px-4 py-3 border-b border-surface-variant/40 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveConvId(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-surface-container-high flex items-center justify-center">
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
            <h2 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1">
              {activeConv.otherUser.fullName.split(' ')[0]}
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            </h2>
            <p className="text-[11px] text-secondary">{activeConv.otherUser.location || 'Global'}</p>
          </div>
        </div>

        <button
          onClick={() => setShowRespectfulCloseModal(true)}
          className="text-xs text-secondary hover:text-error px-2.5 py-1 rounded-full border border-outline-variant/30 hover:border-error/40 transition-colors flex items-center gap-1"
          title="End Conversation Respectfully"
        >
          <span className="material-symbols-outlined text-sm">archive</span>
          <span>Close Chat</span>
        </button>
      </header>

      {/* Advisory & Wali Banner */}
      <div className="bg-surface-container px-4 py-2 border-b border-surface-variant/40 flex items-center justify-between text-xs text-on-surface-variant z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">supervisor_account</span>
          <span>
            {activeConv.waliName ? `Wali: ${activeConv.waliName}` : 'Wali Mode: Active & Transparent'}
          </span>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
          Halal Verified
        </span>
      </div>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Marker */}
        <div className="flex justify-center">
          <span className="text-[11px] text-secondary bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/20">
            Conversation Began with Bismillah
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
                  className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-br-none shadow-primary/10'
                      : 'bg-surface-container-high text-on-surface rounded-bl-none border border-outline-variant/20'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-secondary px-1">
                  <span>{msg.timestamp || 'Just now'}</span>
                  {isMe && <span className="material-symbols-outlined text-[13px] text-primary">done_all</span>}
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

      {/* Message Quota Pill */}
      <div className="px-4 py-1.5 bg-surface-container-low border-t border-surface-variant/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-secondary">
          <span className="material-symbols-outlined text-[15px] text-primary">chat</span>
          <span>{Math.max(0, messagesQuota - messagesSentToday)} / {messagesQuota} Messages Left Today</span>
        </div>
        <button
          onClick={() => setShowAdModal(true)}
          className="text-primary font-bold hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">smart_display</span>
          <span>+10 Free (Watch Ad)</span>
        </button>
      </div>

      {/* Clean Message Input Footer */}
      <footer className="p-3 bg-surface border-t border-surface-variant/40 flex items-center gap-2 z-20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Write a message..."
          className="flex-1 bg-surface-container-high rounded-full px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary placeholder:text-secondary"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </footer>

      {/* Rewarded Video Ad Modal */}
      {showAdModal && (
        <RewardedAdModal
          userId={currentUser.id}
          rewardType="messages"
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onRewardClaimed={() => setMessagesQuota(prev => prev + 10)}
        />
      )}

      {/* Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={() => setMessagesQuota(9999)}
          onWatchAdClicked={() => setShowAdModal(true)}
        />
      )}

      {/* Respectful Close Modal */}
      {showRespectfulCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-variant text-center space-y-4">
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
                className="flex-1 py-2.5 rounded-full border border-outline-variant text-xs font-semibold hover:bg-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRespectfulCloseModal(false);
                  setActiveConvId(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:brightness-110"
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
