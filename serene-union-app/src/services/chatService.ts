import type { Conversation, ChatMessage, UserProfile } from '../types';
import { API_BASE } from './apiConfig';
import { profileService } from './profileService';

export const CONVERSATIONS_KEY = 'serene_real_conversations_v3';

export const chatService = {
  getConversations(): Conversation[] {
    const user = profileService.getCurrentUser();
    if (!user?.id || user.id === 'usr_guest') return [];

    const data = localStorage.getItem(CONVERSATIONS_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const realOnly = (parsed as Conversation[]).filter((c: Conversation) => {
            if (c.messages?.some((m: ChatMessage) => m.id === 'msg_seed_1')) return false;
            return c.participantOne === user.id || c.participantTwo === user.id;
          });
          return realOnly;
        }
      } catch {}
    }
    return [];
  },

  async fetchLiveConversations(): Promise<Conversation[]> {
    try {
      const user = profileService.getCurrentUser();
      if (!user?.id || user.id === 'usr_guest') return [];
      const res = await fetch(`${API_BASE}/conversations?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        const localConvs = this.getConversations();
        const convMap = new Map<string, Conversation>();

        localConvs.forEach(c => {
          if (c && c.id) convMap.set(c.id, c);
        });

        data.conversations
          .filter((rc: any) => rc.participantOne === user.id || rc.participantTwo === user.id)
          .forEach((rc: any) => {
            const existing = convMap.get(rc.id);
            const isPhotoRevealed = typeof rc.isPhotoRevealed === 'boolean' 
              ? rc.isPhotoRevealed 
              : (existing?.isPhotoRevealed ?? false);
            const hasRevealedToPartner = typeof rc.hasRevealedToPartner === 'boolean'
              ? rc.hasRevealedToPartner
              : (existing?.hasRevealedToPartner ?? false);

            const otherUserMerged = {
              ...(rc.otherUser || existing?.otherUser),
              isPhotoRevealed,
              hasRevealedToPartner
            };

            const lastTimestamp = rc.lastMessageTime 
              ? new Date(rc.lastMessageTime).getTime() 
              : (existing?.lastMessageTimestamp || Date.now());

            convMap.set(rc.id, {
              id: rc.id,
              participantOne: rc.participantOne,
              participantTwo: rc.participantTwo,
              otherUser: otherUserMerged,
              lastMessageText: rc.lastMessageText || existing?.lastMessageText || 'You matched! Start with Bismillah.',
              lastMessageSenderId: rc.lastMessageSenderId || existing?.lastMessageSenderId || 'system',
              lastMessageTime: rc.lastMessageTime || existing?.lastMessageTime || 'Just now',
              lastMessageTimestamp: isNaN(lastTimestamp) ? Date.now() : lastTimestamp,
              unreadCount: typeof rc.unreadCount === 'number' ? rc.unreadCount : (existing?.unreadCount || 0),
              waliName: rc.waliName || existing?.waliName,
              status: rc.status || existing?.status || 'active',
              messages: existing?.messages && existing.messages.length > 0 ? existing.messages : (rc.messages || []),
              isPhotoRevealed,
              hasRevealedToPartner
            });
          });

        const mergedList = Array.from(convMap.values());
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(mergedList));
        return mergedList;
      }
    } catch {}
    return this.getConversations();
  },

  createMatchConversation(profile: UserProfile): Conversation {
    const user = profileService.getCurrentUser();
    const convId = `conv_${[user.id, profile.id].sort().join('_')}`;

    const conversations = this.getConversations();
    const existing = conversations.find(c => c.id === convId || c.otherUser?.id === profile.id);
    if (existing) return existing;

    const newConv: Conversation = {
      id: convId,
      participantOne: user.id,
      participantTwo: profile.id,
      otherUser: profile,
      lastMessageText: "You matched! Start with Bismillah.",
      lastMessageSenderId: 'system',
      lastMessageTime: 'Just now',
      lastMessageTimestamp: Date.now(),
      unreadCount: 0,
      status: 'active',
      messages: []
    };

    conversations.unshift(newConv);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));

    fetch(`${API_BASE}/conversations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantOne: user.id, participantTwo: profile.id })
    }).catch(() => {});

    return newConv;
  },

  async fetchConversationMessages(conversationId: string, userId?: string): Promise<ChatMessage[]> {
    if (!conversationId) return [];
    try {
      const user = profileService.getCurrentUser();
      const uId = userId || user.id;
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages?userId=${encodeURIComponent(uId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
        const mappedMessages: ChatMessage[] = data.messages.map((m: any) => ({
          id: m.id || 'msg_' + Math.random().toString(36).substring(2, 7),
          senderId: m.senderId || m.sender_id,
          senderName: m.senderName || m.sender_name || 'Member',
          text: m.text || m.content || '',
          timestamp: m.timestamp || (m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'),
          isRead: Boolean(m.isRead ?? m.is_read),
          waliNotified: Boolean(m.waliNotified ?? m.wali_notified ?? true)
        }));

        if (conv) {
          conv.messages = mappedMessages;
          let revealChanged = false;
          if (typeof data.isPhotoRevealed === 'boolean' && conv.isPhotoRevealed !== data.isPhotoRevealed) {
            conv.isPhotoRevealed = data.isPhotoRevealed;
            if (conv.otherUser) conv.otherUser.isPhotoRevealed = data.isPhotoRevealed;
            revealChanged = true;
          }
          if (typeof data.hasRevealedToPartner === 'boolean' && conv.hasRevealedToPartner !== data.hasRevealedToPartner) {
            conv.hasRevealedToPartner = data.hasRevealedToPartner;
            if (conv.otherUser) conv.otherUser.hasRevealedToPartner = data.hasRevealedToPartner;
            revealChanged = true;
          }
          if (mappedMessages.length > 0) {
            const last = mappedMessages[mappedMessages.length - 1];
            conv.lastMessageText = last.text;
            conv.lastMessageSenderId = last.senderId;
            conv.lastMessageTime = last.timestamp;
            conv.lastMessageTimestamp = Date.now();
          }
          localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
          if (revealChanged) {
            window.dispatchEvent(new CustomEvent('serene_reveal_updated', {
              detail: {
                conversationId,
                isPhotoRevealed: conv.isPhotoRevealed,
                hasRevealedToPartner: conv.hasRevealedToPartner
              }
            }));
          }
        }
        return mappedMessages;
      }
    } catch (e) {
      console.warn('Fetch messages notice:', e);
    }

    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
    return conv ? conv.messages : [];
  },

  async sendLiveMessage(conversationId: string, text: string): Promise<ChatMessage> {
    const user = profileService.getCurrentUser();
    const msg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      senderName: user.fullName || 'Member',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: true
    };

    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
    if (conv) {
      if (!conv.messages) conv.messages = [];
      conv.messages.push(msg);
      conv.lastMessageText = text;
      conv.lastMessageSenderId = user.id;
      conv.lastMessageTime = msg.timestamp;
      conv.lastMessageTimestamp = Date.now();
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    }

    try {
      await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: msg.id,
          senderId: user.id,
          senderName: user.fullName,
          text,
          receiverId: conv?.otherUser?.id
        })
      });
    } catch {}

    return msg;
  },

  markConversationAsRead(conversationId: string): void {
    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
    if (conv && conv.unreadCount && conv.unreadCount > 0) {
      conv.unreadCount = 0;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    }
  },

  isPhotoRevealedTo(myUserId: string, targetUserId: string): boolean {
    try {
      // 1. Check canonical array key (dbService compatible)
      const list: string[] = JSON.parse(localStorage.getItem(`serene_revealed_${myUserId}`) || '[]');
      if (list.includes(targetUserId)) return true;

      // 2. Fallback check object key
      const key = `serene_photo_reveals_${myUserId}`;
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      return Boolean(saved[targetUserId]);
    } catch {
      return false;
    }
  },

  async togglePhotoRevealLive(conversationId: string, myUserId: string, targetUserId: string, isRevealed: boolean): Promise<boolean> {
    const targetId = conversationId || `conv_${[myUserId, targetUserId].sort().join('_')}`;

    // 1. Immediately update both local storage representations
    try {
      // Canonical array key
      const arrayKey = `serene_revealed_${myUserId}`;
      const list: string[] = JSON.parse(localStorage.getItem(arrayKey) || '[]');
      const idx = list.indexOf(targetUserId);
      if (isRevealed) {
        if (idx === -1) list.push(targetUserId);
      } else {
        if (idx > -1) list.splice(idx, 1);
      }
      localStorage.setItem(arrayKey, JSON.stringify(list));

      // Object key for backward compatibility
      const objKey = `serene_photo_reveals_${myUserId}`;
      const saved = JSON.parse(localStorage.getItem(objKey) || '{}');
      saved[targetUserId] = isRevealed;
      localStorage.setItem(objKey, JSON.stringify(saved));
    } catch {}

    // 2. Update conversation state in-memory and local storage
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === targetId || (c.otherUser && c.otherUser.id === targetUserId));
    if (conv) {
      conv.hasRevealedToPartner = isRevealed;
      if (conv.otherUser) {
        conv.otherUser.hasRevealedToPartner = isRevealed;
      }
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
    }

    // 3. Dispatch unified events
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    window.dispatchEvent(new CustomEvent('serene_photo_reveal_updated', {
      detail: { ownerId: myUserId, viewerId: targetUserId, isRevealed }
    }));
    window.dispatchEvent(new CustomEvent('serene_reveal_updated', {
      detail: { conversationId: targetId, targetUserId, hasRevealedToPartner: isRevealed, isRevealed }
    }));

    // 4. Persist to Cloudflare D1 with correct parameterized route
    try {
      await fetch(`${API_BASE}/conversations/${targetId}/photo-reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId: myUserId, viewerId: targetUserId, isRevealed })
      });
    } catch {}

    return true;
  }
};
