import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, CheckCheck, Send, Heart, MessageCircle, FileText, Ban, 
  MoreVertical, Eye, EyeOff, ShieldCheck, Paperclip, Mic, Play, Pause, 
  Trash2, X, Download, File, Loader2, Volume2, VolumeX, Maximize2,
  Phone, Video, PhoneCall, PhoneOff, Search, CheckSquare, Square,
  ExternalLink, Megaphone, Pin, Lock, Hand, Sparkles, Check, Clock
} from 'lucide-react';
import { VerifiedBlueTick } from './VerifiedBlueTick';
import type { Conversation, ChatMessage, UserProfile } from '../types';

import { dbService, API_BASE } from '../services/dbService';
import { ProfileDetailModal } from './ProfileDetailModal';
import { 
  VoiceRecorder, 
  processAttachedFile, 
  formatBytes, 
  formatSeconds,
  getThumbnailUrl
} from '../utils/mediaCompressor';
import { webRtcService, type CallType, type CallerInfo } from '../services/webRtcService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { isUserOnline } from '../utils/onlineStatus';

interface ChatVideoPlayerProps {
  src: string;
  className?: string;
  onOpenLightbox?: () => void;
}

const ChatVideoPlayer: React.FC<ChatVideoPlayerProps> = ({ src, className, onOpenLightbox }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setProgress((cur / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden bg-black group select-none shadow-xs ${className || 'w-full max-h-60'}`}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
        className="w-full h-full max-h-60 object-contain bg-black cursor-pointer"
      />

      {/* Center Play / Pause Button Overlay */}
      <div 
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-200 ${
          isPlaying ? 'opacity-0 group-hover:opacity-100 bg-black/25' : 'opacity-100 bg-black/40'
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current text-slate-900" />
          ) : (
            <Play className="w-5 h-5 fill-current text-slate-900 ml-0.5" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2 pt-3 flex flex-col gap-1 transition-opacity opacity-90 group-hover:opacity-100">
        {/* Scrubber track */}
        <div 
          className="h-1 bg-white/30 hover:h-1.5 rounded-full overflow-hidden cursor-pointer transition-all"
          onClick={(e) => {
            e.stopPropagation();
            if (!videoRef.current || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = clickPos * duration;
          }}
        >
          <div className="h-full bg-primary transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between text-white text-[10px]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="font-mono text-[9px] opacity-90">{formatSeconds(Math.floor(currentTime))} / {formatSeconds(Math.floor(duration))}</span>
          </div>

          {onOpenLightbox && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current && isPlaying) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
                onOpenLightbox();
              }}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title="Full screen view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  initialConvId?: string;
  onBackToDiscover: () => void;
}

export const ChatScreen: React.FC<Props> = ({ initialConvId, onBackToDiscover }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => dbService.getConversations());
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId || null);
  const [inputText, setInputText] = useState<string>('');
  const [showRespectfulCloseModal, setShowRespectfulCloseModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [blockReason, setBlockReason] = useState<string>('Inappropriate messages or disrespect');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>(() => {
    if (!initialConvId) return [];
    return dbService.getCachedRoomMessages(initialConvId);
  });
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedConvIds, setSelectedConvIds] = useState<Set<string>>(new Set());
  const [showListMenuDropdown, setShowListMenuDropdown] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentUser = dbService.getCurrentUser();

  // Modern Horizontal Match Stories Strip
  const [mutualMatches, setMutualMatches] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(`serene_mutual_matches_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      dbService.fetchMutualMatches().then(list => {
        if (Array.isArray(list) && list.length > 0) {
          setMutualMatches(list);
        }
      });
    } catch {}
  }, [currentUser.id]);

  const handleOpenMatchChat = (match: UserProfile) => {
    const convId = `conv_${[currentUser.id, match.id].sort().join('_')}`;
    let existing = conversations.find(c => c.id === convId || c.otherUser?.id === match.id);
    if (!existing) {
      existing = dbService.createMatchConversation(match);
      setConversations(prev => [existing!, ...prev]);
    }
    setActiveConvId(existing.id);
  };

  // Voice Recording & Media Attachment State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    title?: string;
    isViewOnce?: boolean;
    messageId?: string;
  } | null>(null);

  // Attachment Preview Modal State (with View-Once Option)
  const [pendingAttachment, setPendingAttachment] = useState<{
    file: File;
    previewUrl: string;
    mediaType: 'image' | 'video' | 'file';
    name: string;
    size: number;
  } | null>(null);
  const [viewOnceEnabled, setViewOnceEnabled] = useState<boolean>(false);
  const [attachmentCaption, setAttachmentCaption] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const burstPollingUntilRef = useRef<number>(0);
  const syncD1MessagesRef = useRef<() => Promise<void>>(() => Promise.resolve());

  // WebSocket Live Real-Time & Typing Indicators
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const isTypingSentRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<any>(null);

  // WebRTC VIP Gating State
  const [showVipModalForCalling, setShowVipModalForCalling] = useState<boolean>(false);



  const formatChatTime = (timeInput?: string | number): string => {
    if (!timeInput) return '';
    try {
      const timeStr = String(timeInput).trim();
      const num = Number(timeStr);
      const d = !isNaN(num) && num > 1000000000 ? new Date(num) : new Date(timeStr);
      if (!isNaN(d.getTime())) {
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) {
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {}
    return String(timeInput);
  };


  // Load and sync conversation list
  useEffect(() => {
    if (initialConvId) {
      setActiveConvId(initialConvId);
      dbService.markConversationAsRead(initialConvId);
    }

    // Sync latest from live server
    dbService.fetchLiveConversations().then(liveList => {
      if (liveList) {
        setConversations([...liveList]);
      }
    });

    const handleConversationsUpdate = () => {
      const convs = dbService.getConversations();
      setConversations([...convs]);
      if (activeConvId) {
        const pId = activeConvId.startsWith('conv_')
          ? activeConvId.replace('conv_', '').split('_').find(id => id !== currentUser.id && id.length > 0)
          : null;
        const cur = convs.find(c => c.id === activeConvId || (pId && c.otherUser?.id === pId));
        if (cur?.messages) {
          setRoomMessages([...cur.messages]);
        }
      }
    };

    window.addEventListener('serene_conversations_updated', handleConversationsUpdate);
    window.addEventListener('serene_reveal_updated', handleConversationsUpdate);
    return () => {
      window.removeEventListener('serene_conversations_updated', handleConversationsUpdate);
      window.removeEventListener('serene_reveal_updated', handleConversationsUpdate);
    };
  }, [initialConvId]);

  // Periodic background polling when viewing the conversations list
  useEffect(() => {
    if (activeConvId) return;

    let isMounted = true;
    const pollConversations = async () => {
      // Pause D1 queries if app is in background or phone locked
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const liveList = await dbService.fetchLiveConversations();
        if (isMounted && liveList) {
          setConversations([...liveList]);
        }
      } catch {}
    };

    const interval = setInterval(pollConversations, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeConvId]);

  const isTargetingOfficialChannel = Boolean(
    activeConvId?.includes('qurb') || 
    activeConvId?.includes('official')
  );

  const activePartnerId = isTargetingOfficialChannel
    ? 'usr_qurb_official'
    : (activeConvId?.startsWith('conv_')
        ? activeConvId.replace('conv_', '').split('_').find(id => id !== currentUser.id && id.length > 0)
        : null);

  // 0ms Local-First Cache Hydration for Instant Room Switching (Zero delay & zero bleed-through)
  useEffect(() => {
    if (!activeConvId) {
      setRoomMessages([]);
      return;
    }

    const partnerId = isTargetingOfficialChannel 
      ? 'usr_qurb_official' 
      : (activeConvId.startsWith('conv_')
          ? activeConvId.replace('conv_', '').split('_').find(id => id !== currentUser.id && id.length > 0)
          : null);

    // 1. Check granular room cache first (Fastest, 0ms paint)
    const cached = dbService.getCachedRoomMessages(activeConvId);
    if (cached.length > 0) {
      setRoomMessages(cached);
      return;
    }

    if (partnerId) {
      const partnerKey = isTargetingOfficialChannel 
        ? `conv_qurb_official_${currentUser.id}`
        : `conv_${[currentUser.id, partnerId].sort().join('_')}`;
      const partnerCached = dbService.getCachedRoomMessages(partnerKey);
      if (partnerCached.length > 0) {
        setRoomMessages(partnerCached);
        return;
      }
    }

    // 2. Fallback to conversation list cache
    const existing = dbService.getConversations().find(c => 
      c.id === activeConvId || 
      (partnerId && (c.otherUser?.id === partnerId || (isTargetingOfficialChannel && (c.isOfficial || c.otherUser?.fullName?.includes('Qurb')))))
    );

    if (existing?.messages && existing.messages.length > 0) {
      setRoomMessages([...existing.messages]);
    } else {
      setRoomMessages([]);
    }
  }, [activeConvId, isTargetingOfficialChannel, currentUser.id]);

  let activeConv = conversations.find(c => 
    c.id === activeConvId || 
    (activePartnerId && c.otherUser?.id === activePartnerId) ||
    (isTargetingOfficialChannel && (c.isOfficial || c.id.includes('qurb') || c.otherUser?.id === 'usr_qurb_official' || c.otherUser?.fullName?.includes('Qurb')))
  );

  // Fallback for Qurb Official Channel if targeting official channel
  if (isTargetingOfficialChannel || activePartnerId === 'usr_qurb_official' || activeConv?.otherUser?.id === 'usr_qurb_official' || activeConv?.otherUser?.fullName?.includes('Qurb')) {
    const fallbackAnnouncements: ChatMessage[] = [
      {
        id: 'ann_welcome_001',
        senderId: 'usr_qurb_official',
        senderName: 'Qurb Team',
        text: 'Assalamu Alaikum! 🌟 Welcome to the official Qurb Channel.\n\nHere you will receive security advice, feature updates, and official announcements directly from the Qurb Team. Your privacy, modesty, and security are our highest priority.\n\nMay Allah guide you to half your deen with Barakah and joy.',
        timestamp: 'Just now',
        isRead: true,
        waliNotified: true,
        mediaUrl: undefined,
        mediaType: undefined,
        actionUrl: 'https://qurb.app',
        actionLabel: 'Visit Official Website ↗',
        isOfficial: true
      },
      {
        id: 'ann_v1037_update',
        senderId: 'usr_qurb_official',
        senderName: 'Qurb Team',
        text: '🚀 Update Alert: Qurb v1.0.37 is now available on Google Play Store!\n\n✨ New in this version:\n• Crystal-clear HD Voice & Video Calling\n• Zero connection drops with auto-reconnect\n• Enhanced profile security & instant push notifications\n• Smooth chat and media sharing\n\nUpdate now on Google Play Store for the best halal matchmaking experience!',
        timestamp: 'Just now',
        isRead: true,
        waliNotified: true,
        mediaUrl: 'https://qurb.app/announcement_v1037_banner.jpg',
        mediaType: 'image',
        actionUrl: 'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share',
        actionLabel: 'Update on Google Play Store ↗',
        isOfficial: true
      }
    ];

    if (!activeConv || activeConv.otherUser?.fullName === 'Match Candidate' || !activeConv.isOfficial) {
      activeConv = {
        id: activeConvId || `conv_qurb_official_${currentUser.id}`,
        participantOne: currentUser.id,
        participantTwo: 'usr_qurb_official',
        otherUser: {
          id: 'usr_qurb_official',
          phone: '+923000000000',
          fullName: 'Qurb Team',
          dob: '2024-01-01',
          age: 1,
          gender: 'other',
          location: 'Pakistan & Global',
          city: 'Official Channel',
          country: 'Pakistan',
          profession: 'Verified Broadcast',
          education: 'Official Support',
          university: '',
          height: '',
          ethnicity: 'Pakistani',
          marriageTimeline: 'within_1_year',
          bio: 'Official announcements, updates, release notes, and safety tips from Qurb Team.',
          blurPhotosByDefault: false,
          profileVisibility: 'approved_only',
          photos: ['/icon.svg'],
          isVerified: true,
          isOfficial: true,
          religiousProfile: {
            practiceLevel: 'practicing',
            sect: 'Sunni',
            madhhab: 'Hanafi',
            prayerFrequency: '5 times daily',
            halalDiet: 'Strictly Halal'
          }
        } as any,
        lastMessageText: '🚀 Update Alert: Qurb v1.0.37 is now available on Google Play Store! Crystal-clear HD Voice & Video Calling.',
        lastMessageSenderId: 'usr_qurb_official',
        lastMessageTime: 'Just now',
        lastMessageTimestamp: Date.now(),
        unreadCount: 0,
        status: 'active',
        isOfficial: true,
        hasRevealedToPartner: true,
        isPhotoRevealed: true,
        messages: (activeConv?.messages && activeConv.messages.length > 0) ? activeConv.messages : fallbackAnnouncements
      };
    } else {
      if (!Array.isArray(activeConv.messages) || activeConv.messages.length === 0) {
        activeConv = {
          ...activeConv,
          messages: fallbackAnnouncements
        };
      }
      if (!activeConv.otherUser || !activeConv.otherUser.fullName) {
        activeConv = {
          ...activeConv,
          otherUser: {
            id: 'usr_qurb_official',
            phone: '+923000000000',
            fullName: 'Qurb Team',
            dob: '2024-01-01',
            age: 1,
            gender: 'other',
            location: 'Pakistan & Global',
            city: 'Official Channel',
            country: 'Pakistan',
            profession: 'Verified Broadcast',
            education: 'Official Support',
            university: '',
            height: '',
            ethnicity: 'Pakistani',
            marriageTimeline: 'within_1_year',
            bio: 'Official announcements, updates, release notes, and safety tips from Qurb Team.',
            blurPhotosByDefault: false,
            profileVisibility: 'approved_only',
            photos: ['/icon.svg'],
            isVerified: true,
            isOfficial: true,
            religiousProfile: {
              practiceLevel: 'practicing',
              sect: 'Sunni',
              madhhab: 'Hanafi',
              prayerFrequency: '5 times daily',
              halalDiet: 'Strictly Halal'
            }
          } as any
        };
      }
    }
  } else if (!activeConv && activeConvId) {
    // Dynamic fallback ONLY for real candidates:
    const rawParts = activeConvId.replace('conv_', '').split('_');
    const partnerId = rawParts.find(id => id !== currentUser.id && id.length > 0);
    if (partnerId) {
      const allProfiles = dbService.getAllProfiles();
      let candidate = allProfiles.find(p => p.id === partnerId);
      if (!candidate) {
        try {
          const likedYou = JSON.parse(localStorage.getItem(`serene_liked_you_${currentUser.id}`) || '[]');
          candidate = likedYou.find((p: any) => p.id === partnerId);
        } catch {}
      }
      if (!candidate) {
        try {
          const mutual = JSON.parse(localStorage.getItem(`serene_mutual_matches_${currentUser.id}`) || '[]');
          candidate = mutual.find((p: any) => p.id === partnerId);
        } catch {}
      }

      if (candidate) {
        activeConv = dbService.createMatchConversation(candidate);
      } else {
        activeConv = {
          id: activeConvId,
          participantOne: currentUser.id,
          participantTwo: partnerId,
          otherUser: {
            id: partnerId,
            phone: '',
            fullName: 'Match Candidate',
            dob: '1998-01-01',
            age: 26,
            gender: currentUser.gender === 'male' ? 'female' : 'male',
            location: 'Global',
            profession: 'Member',
            education: 'Graduate',
            height: "5'10\"",
            ethnicity: 'Global / Other',
            marriageTimeline: 'within_1_year',
            bio: 'Seeking half my deen.',
            blurPhotosByDefault: true,
            profileVisibility: 'all_users',
            photos: [],
            religiousProfile: {
              practiceLevel: 'practicing',
              sect: 'Sunni',
              madhhab: 'Hanafi',
              prayerFrequency: '5 times daily',
              halalDiet: 'Strictly Halal'
            }
          },
          lastMessageText: "You matched! Start with Bismillah.",
          lastMessageSenderId: 'system',
          lastMessageTime: 'Just now',
          lastMessageTimestamp: Date.now(),
          unreadCount: 0,
          status: 'active',
          messages: []
        };
      }
    }
  }

  const isOfficialChannel = Boolean(
    isTargetingOfficialChannel ||
    activeConv?.isOfficial || 
    activeConv?.otherUser?.id === 'usr_qurb_official' || 
    activeConv?.otherUser?.fullName?.includes('Qurb') ||
    activeConv?.participantOne === 'usr_qurb_official' ||
    activeConv?.participantTwo === 'usr_qurb_official'
  );

  // Live profile hydration if candidate details are minimal
  useEffect(() => {
    if (!activeConvId || isOfficialChannel) return;
    const rawParts = activeConvId.replace('conv_', '').split('_');
    const partnerId = rawParts.find(id => id !== currentUser.id && id.length > 0);
    if (!partnerId) return;

    if (!activeConv?.otherUser || activeConv.otherUser.fullName === 'Match Candidate') {
      dbService.fetchUserProfile(partnerId).then(fetched => {
        if (fetched && fetched.fullName && fetched.fullName !== 'Match Candidate') {
          setConversations(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(c => c.id === activeConvId || (c.otherUser && c.otherUser.id === partnerId));
            if (idx >= 0) {
              copy[idx] = {
                ...copy[idx],
                otherUser: { ...copy[idx].otherUser, ...fetched }
              };
            } else {
              copy.push(dbService.createMatchConversation(fetched));
            }
            return copy;
          });
        }
      }).catch(() => {});
    }
  }, [activeConvId, activeConv?.otherUser?.fullName]);

  // Live adaptive polling for messages & real-time photo reveal status from Cloudflare D1
  useEffect(() => {
    const isTargetOfficial = Boolean(
      activeConv?.isOfficial || 
      activeConv?.otherUser?.id === 'usr_qurb_official' || 
      activeConvId?.includes('qurb_official')
    );

    const targetRoomId = isTargetOfficial
      ? (activeConv?.id || activeConvId)
      : (activeConv?.otherUser?.id 
          ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
          : (activeConv?.id || activeConvId));

    if (!targetRoomId) return;

    let isMounted = true;
    const syncD1Messages = async () => {
      try {
        const liveMsgs = await dbService.fetchConversationMessages(targetRoomId, currentUser.id);
        if (isMounted && liveMsgs && liveMsgs.length > 0) {
          setRoomMessages(liveMsgs);
          setConversations([...dbService.getConversations()]);
        }
      } catch {}
    };

    syncD1MessagesRef.current = syncD1Messages;
    syncD1Messages();

    // WebSocket-first Zero Polling: When WebSocket is OPEN, pause background HTTP polling completely
    let timerId: any = null;
    const scheduleNextPoll = () => {
      // Pause D1 polling if browser or mobile app is in background
      if (typeof document !== 'undefined' && document.hidden) {
        timerId = setTimeout(scheduleNextPoll, 10000);
        return;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // WebSocket is actively streaming real-time messages via DO; check back in 25s only as safety fallback
        timerId = setTimeout(scheduleNextPoll, 25000);
        return;
      }
      const isBurst = Date.now() < burstPollingUntilRef.current;
      const delay = isBurst ? 2000 : 5000;
      timerId = setTimeout(async () => {
        if (!isMounted) return;
        await syncD1Messages();
        if (isMounted) scheduleNextPoll();
      }, delay);
    };

    scheduleNextPoll();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [activeConvId, activeConv?.id, activeConv?.otherUser?.id, currentUser.id]);

  // Real-Time Cloudflare Durable Object WebSocket (Ultra-fast Turbo Layer)
  useEffect(() => {
    const isTargetOfficial = Boolean(
      activeConv?.isOfficial || 
      activeConv?.otherUser?.id === 'usr_qurb_official' || 
      activeConvId?.includes('qurb_official')
    );

    const targetRoomId = isTargetOfficial
      ? (activeConv?.id || activeConvId)
      : (activeConv?.otherUser?.id 
          ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
          : (activeConv?.id || activeConvId));

    if (!targetRoomId) return;

    let ws: WebSocket | null = null;
    let isCleanedUp = false;
    let partnerTypingTimer: any = null;
    let pingInterval: any = null;

    try {
      // Register WebRTC signal sender immediately so calling signals can be dispatched as soon as WS is ready
      webRtcService.init(currentUser.id, (payload) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(JSON.stringify(payload));
          } catch (e) {
            console.error('Failed to send call signal:', e);
          }
        } else {
          console.warn('WebSocket not open yet when sending call signal:', payload.signal);
        }
      });

      if (typeof window !== 'undefined' && typeof WebSocket !== 'undefined') {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsBase = API_BASE.replace(/^https?:/, wsProtocol);
        const wsUrl = `${wsBase}/conversations/${targetRoomId}/ws?userId=${currentUser.id}`;

        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          try { ws?.send(JSON.stringify({ type: 'ping' })); } catch {}
          if (pingInterval) clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              try { wsRef.current.send(JSON.stringify({ type: 'ping' })); } catch {}
            }
          }, 20000);
        };

        ws.onmessage = (event) => {
          if (isCleanedUp) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'new_message' && data.message) {
              const incoming = data.message;
              setRoomMessages(prev => {
                if (prev.some(m => m.id === incoming.id)) return prev;
                const next = [...prev, incoming];
                dbService.setCachedRoomMessages(targetRoomId, next);
                return next;
              });
              // Sync local conversations cache
              const convs = dbService.getConversations();
              const current = convs.find(c => c.id === targetRoomId || (activeConv?.otherUser && c.otherUser?.id === activeConv.otherUser.id));
              if (current) {
                current.lastMessageText = incoming.text;
                current.lastMessageSenderId = incoming.senderId;
                current.lastMessageTime = incoming.timestamp;
                localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
                setConversations([...convs]);
              }
              setIsPartnerTyping(false);
            } else if (data.type === 'typing') {
              if (data.userId !== currentUser.id) {
                setIsPartnerTyping(Boolean(data.isTyping));
                if (partnerTypingTimer) clearTimeout(partnerTypingTimer);
                if (data.isTyping) {
                  partnerTypingTimer = setTimeout(() => setIsPartnerTyping(false), 3500);
                }
              }
            } else if (data.type === 'photo_reveal') {
              if (typeof data.isRevealed === 'boolean') {
                setHasRevealedToPartner(data.isRevealed);
              }
            } else if (data.type === 'call_signal') {
              webRtcService.handleIncomingSignal(data);
            }
          } catch {}
        };

        ws.onclose = () => {
          wsRef.current = null;
        };
      }
    } catch {}

    return () => {
      isCleanedUp = true;
      if (partnerTypingTimer) clearTimeout(partnerTypingTimer);
      if (pingInterval) clearInterval(pingInterval);
      if (ws) {
        try { ws.close(); } catch {}
      }
      wsRef.current = null;
      setIsPartnerTyping(false);
    };
  }, [activeConvId, activeConv?.id, activeConv?.otherUser?.id, currentUser.id]);

  // Initiate WebRTC Call (VIP Gated for Caller, Free for Receiver)
  const handleStartCall = (type: CallType) => {
    if (!activeConv?.otherUser) return;
    if (!currentUser.isVip) {
      setShowVipModalForCalling(true);
      return;
    }

    const partnerInfo: CallerInfo = {
      id: activeConv.otherUser.id,
      fullName: activeConv.otherUser.fullName,
      gender: activeConv.otherUser.gender,
      city: activeConv.otherUser.city || activeConv.otherUser.location || 'Pakistan',
      photoUrl: activeConv.otherUser.photos?.[0],
      isVip: Boolean(activeConv.otherUser.isVip)
    };

    const currentUserInfo: CallerInfo = {
      id: currentUser.id,
      fullName: currentUser.fullName,
      gender: currentUser.gender,
      city: currentUser.location || 'Pakistan',
      photoUrl: currentUser.photos?.[0],
      isVip: Boolean(currentUser.isVip)
    };

    webRtcService.startCall(activeConv.otherUser.id, partnerInfo, type, currentUserInfo);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length, activeConv?.messages?.length]);

  // 1-to-1 Modesty Photo Reveal State
  const [hasRevealedToPartner, setHasRevealedToPartner] = useState<boolean>(() => {
    return Boolean(
      activeConv?.hasRevealedToPartner || 
      activeConv?.otherUser?.hasRevealedToPartner || 
      (activeConv?.otherUser && dbService.isPhotoRevealedTo(currentUser.id, activeConv.otherUser.id))
    );
  });

  useEffect(() => {
    if (activeConv?.otherUser) {
      const fromConv = activeConv.hasRevealedToPartner ?? activeConv.otherUser.hasRevealedToPartner;
      if (typeof fromConv === 'boolean') {
        setHasRevealedToPartner(fromConv);
      } else {
        setHasRevealedToPartner(dbService.isPhotoRevealedTo(currentUser.id, activeConv.otherUser.id));
      }
    }
  }, [activeConvId, activeConv?.otherUser?.id, activeConv?.hasRevealedToPartner, activeConv?.otherUser?.hasRevealedToPartner, currentUser.id]);

  // Listen to live reveal updates dispatched from message polling
  useEffect(() => {
    const handleLiveReveal = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (typeof detail.hasRevealedToPartner === 'boolean') {
        setHasRevealedToPartner(detail.hasRevealedToPartner);
      }
      setConversations([...dbService.getConversations()]);
    };
    window.addEventListener('serene_reveal_updated', handleLiveReveal);
    return () => window.removeEventListener('serene_reveal_updated', handleLiveReveal);
  }, []);

  const handleToggleRevealPhotos = async () => {
    if (!activeConv?.otherUser) return;
    const partnerId = activeConv.otherUser.id;
    const partnerFirstName = activeConv.otherUser.fullName.split(' ')[0];
    const isNowRevealed = !hasRevealedToPartner;
    setHasRevealedToPartner(isNowRevealed);

    const targetRoomId = activeConv?.otherUser?.id 
      ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
      : (activeConv?.id || activeConvId || '');

    // Persist live to Cloudflare D1
    dbService.togglePhotoRevealLive(targetRoomId, currentUser.id, partnerId, isNowRevealed);

    const statusMsg = isNowRevealed 
      ? `📸 ${currentUser.fullName.split(' ')[0]} revealed their unblurred photos for this conversation.` 
      : `🔒 ${currentUser.fullName.split(' ')[0]} restored photo blur for modesty.`;

    // Local instant feedback in room messages
    const sysMsg: ChatMessage = {
      id: 'sys_' + Date.now(),
      senderId: 'system',
      senderName: 'Modesty Shield',
      text: statusMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: false
    };

    setRoomMessages(prev => [...prev, sysMsg]);

    const convs = dbService.getConversations();
    const curr = convs.find(c => c.id === activeConvId || (c.otherUser && c.otherUser.id === partnerId));
    if (curr) {
      if (!curr.messages) curr.messages = [];
      curr.messages.push(sysMsg);
      curr.hasRevealedToPartner = isNowRevealed;
      if (curr.otherUser) curr.otherUser.hasRevealedToPartner = isNowRevealed;
      curr.lastMessageText = statusMsg;
      curr.lastMessageTime = 'Just now';
      curr.lastMessageTimestamp = Date.now();
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
      setConversations([...convs]);
    }

    setToastMessage(isNowRevealed 
      ? `Photos revealed to ${partnerFirstName}!` 
      : `Photos blurred again for ${partnerFirstName}.`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to send message with optional media (audio, image, video, file)
  const sendMediaMessage = async (mediaData: {
    text: string;
    mediaUrl: string;
    mediaType: 'audio' | 'image' | 'video' | 'file';
    mediaDuration?: number;
    fileName?: string;
    fileSize?: number;
    isViewOnce?: boolean;
  }) => {
    if (!activeConvId || !activeConv) return;
    const user = dbService.getCurrentUser();
    const targetRoomId = activeConv.otherUser?.id 
      ? (`conv_${[user.id, activeConv.otherUser.id].sort().join('_')}`)
      : activeConvId;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      senderName: user.fullName || 'You',
      text: mediaData.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: true,
      mediaUrl: mediaData.mediaUrl,
      mediaType: mediaData.mediaType,
      mediaDuration: mediaData.mediaDuration,
      fileName: mediaData.fileName,
      fileSize: mediaData.fileSize,
      isViewOnce: mediaData.isViewOnce,
      isOpened: false
    };

    // Update locally immediately for instant feedback
    const convs = dbService.getConversations();
    const current = convs.find(c => c.id === activeConvId || c.id === targetRoomId || (activeConv.otherUser && c.otherUser?.id === activeConv.otherUser.id));
    if (current) {
      current.id = targetRoomId;
      if (!current.messages) current.messages = [];
      current.messages.push(newMsg);
      current.lastMessageText = mediaData.text;
      current.lastMessageSenderId = user.id;
      current.lastMessageTime = newMsg.timestamp;
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
      setConversations([...convs]);
      setRoomMessages(prev => [...prev, newMsg]);
      if (activeConvId !== targetRoomId) {
        setActiveConvId(targetRoomId);
      }
    } else {
      setRoomMessages(prev => [...prev, newMsg]);
    }

    // Save permanently to Cloudflare D1 SQL database
    try {
      await fetch(`${API_BASE}/conversations/${targetRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newMsg.id,
          senderId: user.id,
          senderName: user.fullName || 'Member',
          text: mediaData.text,
          receiverId: activeConv.otherUser?.id,
          mediaUrl: mediaData.mediaUrl,
          mediaType: mediaData.mediaType,
          mediaDuration: mediaData.mediaDuration,
          fileName: mediaData.fileName,
          fileSize: mediaData.fileSize,
          isViewOnce: mediaData.isViewOnce
        })
      });
      // Trigger burst polling for instant live responsiveness
      burstPollingUntilRef.current = Date.now() + 15000;
      syncD1MessagesRef.current?.();
    } catch {}
  };

  // 1. Voice Recording Handlers
  const handleStartRecording = async () => {
    if (isOfficialChannel) return;
    try {
      const recorder = new VoiceRecorder();
      await recorder.start();
      voiceRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setToastMessage('Microphone permission required to record voice notes');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    voiceRecorderRef.current?.cancel();
    voiceRecorderRef.current = null;
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleStopAndSendVoice = async () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (!voiceRecorderRef.current) return;

    try {
      setIsRecording(false);
      setIsUploadingMedia(true);
      setUploadStatus('Compressing voice message...');

      const voiceData = await voiceRecorderRef.current.stop();
      voiceRecorderRef.current = null;

      setUploadStatus('Uploading voice note...');
      const targetRoomId = activeConv?.otherUser?.id 
        ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
        : (activeConvId || 'chat');

      const res = await fetch(`${API_BASE}/conversations/upload-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: targetRoomId,
          senderId: currentUser.id,
          fileBase64: voiceData.base64,
          mediaType: 'audio',
          duration: voiceData.duration,
          fileName: `voice_${Date.now()}.webm`,
          fileType: voiceData.mimeType
        })
      });

      const data = await res.json();
      if (data.success && data.mediaUrl) {
        await sendMediaMessage({
          text: '🎤 Voice message',
          mediaUrl: data.mediaUrl,
          mediaType: 'audio',
          mediaDuration: voiceData.duration,
          fileSize: voiceData.size
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Voice send error:', err);
      setToastMessage('Failed to send voice message');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUploadingMedia(false);
      setUploadStatus('');
      setRecordingSeconds(0);
    }
  };

  // 2. File Attachment Handlers (Auto-Compress Images & Media)
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (isOfficialChannel || !file) return;
    e.target.value = ''; // Reset input for re-selecting same file if needed

    const isImg = file.type.toLowerCase().startsWith('image/');
    const isVid = file.type.toLowerCase().startsWith('video/');
    const mediaType: 'image' | 'video' | 'file' = isImg ? 'image' : (isVid ? 'video' : 'file');

    const previewUrl = URL.createObjectURL(file);
    setPendingAttachment({
      file,
      previewUrl,
      mediaType,
      name: file.name,
      size: file.size
    });
    setViewOnceEnabled(false);
    setAttachmentCaption('');
  };

  const handleConfirmSendAttachment = async () => {
    if (!pendingAttachment) return;
    const { file, mediaType } = pendingAttachment;
    setPendingAttachment(null);

    try {
      setIsUploadingMedia(true);
      const isImg = mediaType === 'image';
      setUploadStatus(isImg ? 'Auto-compressing image...' : 'Preparing attachment...');

      const processed = await processAttachedFile(file);
      setUploadStatus('Uploading to secure cloud...');

      const targetRoomId = activeConv?.otherUser?.id 
        ? (`conv_${[currentUser.id, activeConv.otherUser.id].sort().join('_')}`)
        : (activeConvId || 'chat');

      const res = await fetch(`${API_BASE}/conversations/upload-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: targetRoomId,
          senderId: currentUser.id,
          fileBase64: processed.base64,
          fileName: processed.name,
          fileType: processed.mimeType,
          mediaType: processed.mediaType
        })
      });

      const data = await res.json();
      if (data.success && data.mediaUrl) {
        let label = attachmentCaption.trim();
        if (!label) {
          if (processed.mediaType === 'image') label = viewOnceEnabled ? '📷 Photo (1 Time)' : '📷 Photo';
          else if (processed.mediaType === 'video') label = viewOnceEnabled ? '🎥 Video (1 Time)' : '🎥 Video';
          else label = `📎 ${processed.name}`;
        }

        await sendMediaMessage({
          text: label,
          mediaUrl: data.mediaUrl,
          mediaType: processed.mediaType,
          fileName: processed.name,
          fileSize: processed.size,
          isViewOnce: viewOnceEnabled
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Attachment upload error:', err);
      setToastMessage(err.message || 'Failed to upload attachment');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsUploadingMedia(false);
      setUploadStatus('');
      setViewOnceEnabled(false);
      setAttachmentCaption('');
    }
  };

  const handleCloseLightbox = async () => {
    if (!lightboxMedia) return;

    if (lightboxMedia.isViewOnce && lightboxMedia.messageId) {
      const targetMsgId = lightboxMedia.messageId;
      // Mark as opened locally in roomMessages
      setRoomMessages(prev => prev.map(m => m.id === targetMsgId ? { ...m, isOpened: true, mediaUrl: undefined } : m));
      const convs = dbService.getConversations();
      const current = convs.find(c => c.id === activeConvId);
      if (current && current.messages) {
        current.messages = current.messages.map(m => m.id === targetMsgId ? { ...m, isOpened: true, mediaUrl: undefined } : m);
        localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
        setConversations([...convs]);
      }

      // Mark as opened on backend D1 database
      try {
        await fetch(`${API_BASE}/conversations/${activeConvId}/messages/${targetMsgId}/open-view-once`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewerId: currentUser.id })
        });
      } catch {}

      setToastMessage('View-once media has expired.');
      setTimeout(() => setToastMessage(null), 3000);
    }

    setLightboxMedia(null);
  };

  // 3. Audio Message Playback
  const handleTogglePlayAudio = (msg: ChatMessage) => {
    if (!msg.mediaUrl) return;

    if (playingAudioId === msg.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(msg.mediaUrl);
    audioPlayerRef.current = audio;
    setPlayingAudioId(msg.id);
    setAudioProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setAudioProgress(Math.round((audio.currentTime / audio.duration) * 100));
      }
    };

    audio.onended = () => {
      setPlayingAudioId(null);
      setAudioProgress(0);
    };

    audio.onerror = () => {
      setPlayingAudioId(null);
      setAudioProgress(0);
      setToastMessage('Could not play audio message');
      setTimeout(() => setToastMessage(null), 3000);
    };

    audio.play().catch(() => {
      setPlayingAudioId(null);
    });
  };

  // Clean up audio & recording on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      voiceRecorderRef.current?.cancel();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Real User-to-User Send Message
  const handleSendMessage = async () => {
    if (isOfficialChannel || !inputText.trim() || !activeConvId || !activeConv) return;

    if (isPendingSalamForMe) {
      setToastMessage('Please approve the Direct Salam invitation first to send messages.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (isPendingSalamSentByMe) {
      setToastMessage('Waiting for candidate to accept your Direct Salam invitation.');
      setTimeout(() => setToastMessage(null), 3000);
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
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
      setConversations([...convs]);
      setRoomMessages(prev => [...prev, newMsg]);
      if (activeConvId !== targetRoomId) {
        setActiveConvId(targetRoomId);
      }
    } else {
      setRoomMessages(prev => [...prev, newMsg]);
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
      // Notify WebSocket peer that typing ended
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        isTypingSentRef.current = false;
        try {
          wsRef.current.send(JSON.stringify({ type: 'typing', isTyping: false, userId: user.id }));
        } catch {}
      }
      // Trigger burst polling for instant live responsiveness
      burstPollingUntilRef.current = Date.now() + 15000;
      syncD1MessagesRef.current?.();
    } catch {}
  };

  const handleTextInputChange = (val: string) => {
    setInputText(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (!isTypingSentRef.current && val.trim().length > 0) {
        isTypingSentRef.current = true;
        try {
          wsRef.current.send(JSON.stringify({ type: 'typing', isTyping: true, userId: currentUser.id }));
        } catch {}
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingSentRef.current = false;
        try {
          wsRef.current?.send(JSON.stringify({ type: 'typing', isTyping: false, userId: currentUser.id }));
        } catch {}
      }, 2500);
    }
  };

  const handleConfirmBlock = async () => {
    if (!activeConv) return;
    setIsBlocking(true);

    const targetUser = activeConv.otherUser;
    const targetId = targetUser.id;

    await dbService.blockProfile(targetId, blockReason);

    // Remove from conversation list immediately
    const updatedConvs = conversations.filter(c => c.id !== activeConv.id && c.otherUser?.id !== targetId);
    setConversations(updatedConvs);

    // Dispatch events to re-sync Activity Hub in Matches screen
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    window.dispatchEvent(new CustomEvent('serene_block_updated', { detail: { targetId } }));

    setIsBlocking(false);
    setShowBlockModal(false);
    setActiveConvId(null);

    setToastMessage(`${targetUser.fullName.split(' ')[0]} has been blocked and moved to your Blocked Users list in Matches.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCloseWithDua = async () => {
    if (!activeConv) return;
    const duaText = "Assalamu Alaikum. JazakAllah Khair for your time and respectful communication. May Allah (SWT) grant you barakah and bless you with a righteous spouse who is the coolness of your eyes. Ameen.";

    try {
      await dbService.sendLiveMessage(activeConv.id, duaText);
    } catch {}

    const convs = dbService.getConversations();
    const curr = convs.find(c => c.id === activeConv.id);
    if (curr) {
      curr.status = 'respectfully_closed';
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
      setConversations([...convs]);
    }

    setShowRespectfulCloseModal(false);
    setActiveConvId(null);
    setToastMessage("Conversation closed respectfully with a blessed Islamic du'a.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [isProcessingSalam, setIsProcessingSalam] = useState<boolean>(false);

  const isPendingSalamForMe = Boolean(
    activeConv &&
    !isOfficialChannel &&
    (activeConv.isDirectSalamPending || activeConv.salamSenderId) &&
    activeConv.salamSenderId !== currentUser.id
  );

  const isPendingSalamSentByMe = Boolean(
    activeConv &&
    !isOfficialChannel &&
    (activeConv.isDirectSalamPending || activeConv.salamSenderId) &&
    activeConv.salamSenderId === currentUser.id
  );

  const handleApproveSalam = async () => {
    if (!activeConv || !activeConv.otherUser || isProcessingSalam) return;
    setIsProcessingSalam(true);
    const partnerId = activeConv.otherUser.id;
    try {
      await dbService.approveDirectSalam(activeConv.id, partnerId);
      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id || c.otherUser?.id === partnerId) {
          return { ...c, isDirectSalamPending: false, salamSenderId: null };
        }
        return c;
      }));
      setToastMessage('Direct Salam accepted! Halal conversation is now unlocked.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsProcessingSalam(false);
    }
  };

  const handleRejectSalam = async () => {
    if (!activeConv || !activeConv.otherUser || isProcessingSalam) return;
    setIsProcessingSalam(true);
    const partnerId = activeConv.otherUser.id;
    try {
      await dbService.rejectDirectSalam(activeConv.id, partnerId);
      setConversations(prev => prev.filter(c => c.id !== activeConv.id && c.otherUser?.id !== partnerId));
      setActiveConvId(null);
      setToastMessage('Direct Salam invitation declined.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsProcessingSalam(false);
    }
  };

  // If no active conversation, show conversation list
  if (!activeConv) {
    const filteredConversations = conversations.filter(conv => {
      if (!chatSearchQuery.trim()) return true;
      const q = chatSearchQuery.toLowerCase().trim();
      const partner = conv.otherUser || {} as any;
      return (
        (partner.fullName || '').toLowerCase().includes(q) ||
        (partner.city || '').toLowerCase().includes(q) ||
        (partner.location || '').toLowerCase().includes(q) ||
        (conv.lastMessageText || '').toLowerCase().includes(q)
      );
    });

    const handleDeleteSelected = () => {
      if (selectedConvIds.size === 0) return;
      if (window.confirm(`Delete ${selectedConvIds.size} selected conversation${selectedConvIds.size > 1 ? 's' : ''}?`)) {
        dbService.deleteConversations(Array.from(selectedConvIds));
        setConversations(prev => prev.filter(c => !selectedConvIds.has(c.id)));
        setSelectedConvIds(new Set());
        setIsSelectMode(false);
        setToastMessage('Selected conversations removed.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    };

    return (
      <div className="flex-1 flex flex-col h-full bg-background font-sans select-none text-on-surface">
        {/* Luxury Qurb Brand Header */}
        <header className="sticky top-0 bg-white px-4 py-3.5 border-b border-outline z-20 shadow-subtle shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-black text-primary tracking-tight">Qurb</span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest bg-pastel-rose px-2.5 py-0.5 rounded-full border border-pastel-rose-border shadow-2xs">
                  Conversations
                </span>
              </div>
              <p className="text-[11px] text-secondary mt-0.5">Respectful & Intentional Matrimonial Discussions</p>
            </div>

            {/* 3-Dots Management Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowListMenuDropdown(prev => !prev)}
                className="w-9 h-9 rounded-full bg-surface-variant hover:bg-outline flex items-center justify-center text-secondary hover:text-on-surface transition-all shadow-subtle"
                title="Conversation Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showListMenuDropdown && (
                <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-elevated border border-outline py-1.5 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMode(prev => !prev);
                      setSelectedConvIds(new Set());
                      setShowListMenuDropdown(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-surface-variant flex items-center gap-2.5 text-on-surface"
                  >
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <span className="font-medium">{isSelectMode ? 'Cancel Selection' : 'Select Chats to Delete'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      dbService.markAllConversationsRead();
                      setConversations([...dbService.getConversations()]);
                      setShowListMenuDropdown(false);
                      setToastMessage('All conversations marked as read.');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-surface-variant flex items-center gap-2.5 text-on-surface"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Mark All as Read</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear all closed conversations from your history?')) {
                        const activeOnly = conversations.filter(c => c.status !== 'respectfully_closed');
                        localStorage.setItem('serene_real_conversations_v3', JSON.stringify(activeOnly));
                        setConversations(activeOnly);
                        setToastMessage('Closed conversations cleared.');
                        setTimeout(() => setToastMessage(null), 3000);
                      }
                      setShowListMenuDropdown(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-pastel-rose text-error flex items-center gap-2.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Clear Inactive Chats</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Candidate Search Bar */}
          <div className="relative mt-2.5">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, city, or message..."
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-surface-variant border border-outline rounded-xl focus:outline-none focus:border-primary focus:bg-white shadow-subtle transition-all"
            />
            {chatSearchQuery && (
              <button
                type="button"
                onClick={() => setChatSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Multi-Select Action Banner */}
          {isSelectMode && (
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-outline text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{selectedConvIds.size} selected</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedConvIds.size === filteredConversations.length) {
                      setSelectedConvIds(new Set());
                    } else {
                      setSelectedConvIds(new Set(filteredConversations.map(c => c.id)));
                    }
                  }}
                  className="text-[11px] text-secondary hover:text-primary underline ml-1"
                >
                  {selectedConvIds.size === filteredConversations.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSelectMode(false);
                    setSelectedConvIds(new Set());
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-outline hover:bg-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedConvIds.size === 0}
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 text-[11px] font-bold rounded-lg bg-error text-white disabled:opacity-40 flex items-center gap-1 shadow-subtle"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete ({selectedConvIds.size})</span>
                </button>
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-8">
          {/* Modern New Matches Horizontal Stories Strip */}
          {mutualMatches.length > 0 && !chatSearchQuery && (
            <div className="mb-3 px-1 pt-0.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span>New Matches</span>
                </span>
                <span className="text-[10px] text-primary font-semibold">One-Tap Halal Chat</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1.5 pt-0.5">
                {mutualMatches.map(match => (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => handleOpenMatchChat(match)}
                    className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer"
                    title={`Start chatting with ${match.fullName}`}
                  >
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-rose-500 via-primary to-amber-400 group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
                      <div className="w-13 h-13 rounded-full p-0.5 bg-white overflow-hidden flex items-center justify-center">
                        {match.photos && match.photos.length > 0 && !match.photos[0].includes('photo-1534528741775-53994a69daeb') ? (
                          <img
                            src={getThumbnailUrl(match.photos[0])}
                            alt={match.fullName}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.match-avatar-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                            className={`w-full h-full object-cover rounded-full ${
                              match.blurPhotosByDefault && !match.isPhotoRevealed ? 'blur-xs' : ''
                            }`}
                          />
                        ) : null}
                        <div
                          className={`match-avatar-fallback w-full h-full bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-200 items-center justify-center font-serif font-bold text-sm rounded-full ${
                            match.photos && match.photos.length > 0 && !match.photos[0].includes('photo-1534528741775-53994a69daeb') ? 'hidden' : 'flex'
                          }`}
                        >
                          {(match.fullName || 'M').charAt(0).toUpperCase()}
                        </div>
                      </div>
                      {isUserOnline(match) ? (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-2xs" title="Online" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full shadow-2xs" title="Offline / Away" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 mt-1.5 max-w-[62px] truncate group-hover:text-primary transition-colors">
                      {match.fullName?.split(' ')[0] || 'Match'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(() => {
            const sortedConversations = [...filteredConversations].sort((a, b) => {
              const aOfficial = a.isOfficial || a.otherUser?.id === 'usr_qurb_official' || a.id.includes('qurb_official');
              const bOfficial = b.isOfficial || b.otherUser?.id === 'usr_qurb_official' || b.id.includes('qurb_official');
              if (aOfficial && !bOfficial) return -1;
              if (!aOfficial && bOfficial) return 1;
              const tA = a.lastMessageTimestamp || (a.lastMessageTime && !isNaN(new Date(a.lastMessageTime).getTime()) ? new Date(a.lastMessageTime).getTime() : 0);
              const tB = b.lastMessageTimestamp || (b.lastMessageTime && !isNaN(new Date(b.lastMessageTime).getTime()) ? new Date(b.lastMessageTime).getTime() : 0);
              return tB - tA;
            });

            return sortedConversations.length > 0 ? (
              sortedConversations.map(conv => {
                const partner = conv.otherUser || { id: conv.participantTwo, fullName: 'Match Candidate', photos: [] } as any;
                const isConvOfficial = Boolean(
                  conv.isOfficial || 
                  partner.id === 'usr_qurb_official' || 
                  conv.id.includes('qurb') || 
                  conv.id.includes('official') || 
                  (partner.fullName && partner.fullName.includes('Qurb'))
                );
                const isIncomingUnread = !isConvOfficial && conv.lastMessageSenderId !== currentUser.id && Boolean(conv.unreadCount && conv.unreadCount > 0);
                const isSelected = selectedConvIds.has(conv.id);

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      if (isSelectMode) {
                        setSelectedConvIds(prev => {
                          const next = new Set(prev);
                          if (next.has(conv.id)) next.delete(conv.id);
                          else next.add(conv.id);
                          return next;
                        });
                      } else {
                        try {
                          dbService.markConversationAsRead(conv.id);
                        } catch {}
                        setActiveConvId(conv.id);
                      }
                    }}
                    className={`p-3.5 bg-white rounded-2xl border transition-all shadow-subtle group flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-pastel-rose/30 ring-1 ring-primary'
                        : isConvOfficial
                          ? 'border-primary/25 bg-gradient-to-r from-rose-50/50 via-white to-white hover:border-primary/50 hover:shadow-brand/5'
                          : isIncomingUnread 
                            ? 'border-primary/60 bg-pastel-rose/25 border-l-4 border-l-primary shadow-brand/10' 
                            : 'border-slate-100 hover:border-primary/40 hover:shadow-subtle'
                    }`}
                  >
                    {/* Multi-Select Checkbox */}
                    {isSelectMode && (
                      <div className="shrink-0 text-primary">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 fill-primary text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-secondary" />
                        )}
                      </div>
                    )}

                    {/* Clickable Profile Avatar (Fast 140x140 WebP Thumbnail) */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isConvOfficial) {
                          setActiveConvId(conv.id);
                        } else if (partner && partner.id !== 'usr_qurb_official') {
                          setSelectedProfile(partner);
                        } else {
                          setActiveConvId(conv.id);
                        }
                      }}
                      className="relative shrink-0 cursor-pointer group/avatar"
                      title={isConvOfficial ? "Qurb Official Channel" : `Click to view ${partner.fullName}'s Biodata`}
                    >
                      <div className={`w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center transition-all shadow-subtle ${
                        isConvOfficial
                          ? 'border-primary/20 bg-pastel-rose/40'
                          : isIncomingUnread ? 'border-primary ring-2 ring-primary/20 bg-surface-variant' : 'border-outline bg-surface-variant'
                      }`}>
                        {isConvOfficial ? (
                          <div className="w-full h-full p-2.5 flex items-center justify-center">
                            <img src="/icon.svg" alt="Qurb" className="w-full h-full object-contain" />
                          </div>
                        ) : partner.photos && partner.photos.length > 0 && !partner.photos[0].includes('photo-1534528741775-53994a69daeb') ? (
                          <img
                            src={getThumbnailUrl(partner.photos[0])}
                            alt={partner.fullName}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.halal-avatar-fallback');
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                            className={`w-full h-full object-cover ${
                              partner.blurPhotosByDefault && !partner.isPhotoRevealed && !conv.isPhotoRevealed ? 'blur-xs' : ''
                            }`}
                          />
                        ) : null}
                        {!isConvOfficial && (
                          <div
                            className={`halal-avatar-fallback w-full h-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-amber-200 items-center justify-center font-serif font-black select-none ${
                              partner.photos && partner.photos.length > 0 && !partner.photos[0].includes('photo-1534528741775-53994a69daeb') ? 'hidden' : 'flex'
                            }`}
                          >
                            <span className="text-sm tracking-wider drop-shadow-xs font-bold">
                              {(partner.fullName || 'M').trim().charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conversation Info (Clean Modern Row) */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isConvOfficial) {
                              setActiveConvId(conv.id);
                            } else if (partner && partner.id !== 'usr_qurb_official') {
                              setSelectedProfile(partner);
                            } else {
                              setActiveConvId(conv.id);
                            }
                          }}
                          className={`font-serif text-xs truncate group-hover:text-primary transition-colors cursor-pointer hover:underline flex items-center gap-1 ${
                            isIncomingUnread ? 'font-black text-primary' : 'font-bold text-on-surface'
                          }`}
                          title={isConvOfficial ? "Qurb Official Channel" : "Click to view full biodata"}
                        >
                          <span>{isConvOfficial ? 'Qurb Team' : (partner.fullName || 'Member').replace(/✓/g, '').trim()}</span>
                          {isConvOfficial && (
                            <VerifiedBlueTick size={15} className="ml-0.5" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isConvOfficial && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                              <Pin className="w-2.5 h-2.5 rotate-45 text-primary" />
                              <span>Pinned</span>
                            </span>
                          )}
                          {!isConvOfficial && (conv.isDirectSalamPending || conv.salamSenderId) && conv.salamSenderId !== currentUser.id && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Salam Request</span>
                            </span>
                          )}
                          {!isConvOfficial && (conv.isDirectSalamPending || conv.salamSenderId) && conv.salamSenderId === currentUser.id && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shadow-2xs">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              <span>Pending</span>
                            </span>
                          )}
                          <span className={`text-[11px] font-medium ${isIncomingUnread ? 'text-primary font-bold' : 'text-secondary'}`}>
                            {formatChatTime(conv.lastMessageTime)}
                          </span>
                          {isIncomingUnread && (
                            <span className="px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold shadow-2xs">
                              {conv.unreadCount || 1}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`text-xs truncate ${
                        isIncomingUnread ? 'font-bold text-on-surface' : 'text-secondary'
                      }`}>
                        {(() => {
                          const text = conv.lastMessageText || (isConvOfficial ? 'Official announcements and verified updates.' : 'Tap to start conversation...');
                          if (text.includes('restored photo blur') || text.includes('photo blur for modesty') || text.startsWith('🔒')) {
                            const cleanText = text.replace(/^[🔒\s]+/, '').replace(/^dY"'\s*/, '');
                            return (
                              <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-full">
                                <span className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-2xs">
                                  <Lock className="w-2.5 h-2.5 text-amber-700" />
                                </span>
                                <span className="truncate">{cleanText}</span>
                              </span>
                            );
                          }
                          if (text.includes('revealed their unblurred photos') || text.startsWith('📸')) {
                            const cleanText = text.replace(/^[📸\s]+/, '').replace(/^dY",\s*/, '');
                            return (
                              <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-full">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300/80 flex items-center justify-center shrink-0 shadow-2xs">
                                  <Eye className="w-2.5 h-2.5 text-emerald-700" />
                                </span>
                                <span className="truncate">{cleanText}</span>
                              </span>
                            );
                          }
                          return text;
                        })()}
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
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden font-sans select-none pb-0 text-on-surface">
      {/* Chat Top Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setActiveConvId(null)}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Clickable Avatar to View Full Biodata */}
          <div 
            onClick={() => {
              if (!isOfficialChannel && activeConv?.otherUser) setSelectedProfile(activeConv.otherUser);
            }}
            className={`relative shrink-0 ${!isOfficialChannel ? 'cursor-pointer group/avatar' : ''}`}
            title={isOfficialChannel ? "Qurb Official Channel" : "Click to view full biodata"}
          >
            <div className={`w-10 h-10 rounded-full overflow-hidden border flex items-center justify-center transition-all shadow-subtle ${
              isOfficialChannel ? 'border-primary/20 bg-pastel-rose/50' : 'border-slate-200 group-hover/avatar:border-primary/60 bg-surface-variant ring-1 ring-primary/20'
            }`}>
              {isOfficialChannel ? (
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <img src="/icon.svg" alt="Qurb" className="w-full h-full object-contain" />
                </div>
              ) : (
                <>
                  {activeConv?.otherUser?.photos && activeConv.otherUser.photos.length > 0 && !activeConv.otherUser.photos[0].includes('photo-1534528741775-53994a69daeb') ? (
                    <img
                      src={activeConv.otherUser.photos[0]}
                      alt={activeConv.otherUser.fullName}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.halal-header-avatar-fallback');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                      className={`w-full h-full object-cover transition-all ${
                        activeConv.otherUser.blurPhotosByDefault && 
                        !activeConv.otherUser.isPhotoRevealed &&
                        !activeConv.isPhotoRevealed &&
                        !dbService.isPhotoRevealedTo(activeConv.otherUser.id, currentUser.id) && 
                        !activeConv.otherUser.photoRevealApproved
                          ? 'filter blur-xs opacity-75 scale-105'
                          : 'scale-100'
                      }`}
                    />
                  ) : null}
                  <div
                    className={`halal-header-avatar-fallback w-full h-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-amber-200 items-center justify-center font-serif font-black select-none ${
                      activeConv?.otherUser?.photos && activeConv.otherUser.photos.length > 0 && !activeConv.otherUser.photos[0].includes('photo-1534528741775-53994a69daeb') ? 'hidden' : 'flex'
                    }`}
                  >
                    <span className="text-xs tracking-wider drop-shadow-xs font-bold">
                      {(activeConv?.otherUser?.fullName || 'M').trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </div>
            {!isOfficialChannel && (
              isUserOnline(activeConv?.otherUser) ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-2xs" title="Online" />
              ) : (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-400 border-2 border-white rounded-full shadow-2xs" title="Offline / Away" />
              )
            )}
          </div>

          {/* Clickable Name & Biodata Summary */}
          <div 
            onClick={() => {
              if (!isOfficialChannel && activeConv?.otherUser) setSelectedProfile(activeConv.otherUser);
            }}
            className={`flex flex-col min-w-0 ${!isOfficialChannel ? 'cursor-pointer group' : ''}`}
            title={isOfficialChannel ? "Qurb Official Channel" : "Click to view full biodata"}
          >
            <h2 className="font-serif font-bold text-xs text-on-surface group-hover:text-primary transition-colors truncate flex items-center gap-1.5">
              <span>{isOfficialChannel ? 'Qurb Team' : (activeConv?.otherUser?.fullName || '').replace(/✓/g, '').trim()}</span>
              {isOfficialChannel && (
                <VerifiedBlueTick size={15} />
              )}
            </h2>
            <div className="text-[10px] text-secondary truncate flex items-center gap-1.5">
              {isOfficialChannel ? (
                'Verified Channel · Official Updates'
              ) : (
                <>
                  <span className="truncate">{activeConv?.otherUser?.profession || 'Member'} · {activeConv?.otherUser?.city || activeConv?.otherUser?.location || 'Global'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                  {isUserOnline(activeConv?.otherUser) ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Online</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Away</span>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Call Buttons, Biodata Button & 3-Dots Kebab Menu */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          {isOfficialChannel ? null : (
            <>
              {/* Audio Call Button */}
              <button
                type="button"
                onClick={() => handleStartCall('audio')}
                className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs ${
                  currentUser.isVip 
                    ? 'bg-gradient-to-tr from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 border border-emerald-300/80 shadow-emerald-500/10' 
                    : 'bg-surface-variant hover:bg-outline text-secondary border border-outline'
                }`}
                title={currentUser.isVip ? "Audio Call (VIP)" : "Audio Call (Requires Barakah VIP)"}
              >
                <Phone className={`w-3.5 h-3.5 ${currentUser.isVip ? 'text-emerald-700' : 'text-secondary'}`} />
              </button>

              {/* Video Call Button */}
              <button
                type="button"
                onClick={() => handleStartCall('video')}
                className={`w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs ${
                  currentUser.isVip 
                    ? 'bg-gradient-to-tr from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-sky-700 border border-sky-300/80 shadow-sky-500/10' 
                    : 'bg-surface-variant hover:bg-outline text-secondary border border-outline'
                }`}
                title={currentUser.isVip ? "Video Call (VIP)" : "Video Call (Requires Barakah VIP)"}
              >
                <Video className={`w-3.5 h-3.5 ${currentUser.isVip ? 'text-sky-700' : 'text-secondary'}`} />
              </button>

              <button
                onClick={() => {
                  if (activeConv?.otherUser) setSelectedProfile(activeConv.otherUser);
                }}
                className="text-xs text-primary font-bold bg-pastel-rose hover:bg-pastel-rose/80 px-3 py-1.5 rounded-full border border-pastel-rose-border transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                title="View Full Biodata"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Biodata</span>
              </button>

              {/* 3-Dots Menu Button */}
              <button
                onClick={() => setShowMoreMenu(prev => !prev)}
                className="w-8 h-8 rounded-full bg-surface-variant hover:bg-outline border border-outline flex items-center justify-center text-secondary hover:text-on-surface transition-all active:scale-95"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </>
          )}

          {/* 3-Dots Dropdown Menu */}
          {showMoreMenu && (
            <div 
              className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-outline py-1.5 z-50 animate-fade-in divide-y divide-outline text-left"
              onClick={() => setShowMoreMenu(false)}
            >
              <button
                onClick={handleToggleRevealPhotos}
                className="w-full px-3.5 py-2.5 text-xs text-on-surface hover:text-primary hover:bg-surface-variant flex items-center gap-2.5 transition-colors font-medium text-left"
              >
                {hasRevealedToPartner ? (
                  <>
                    <EyeOff className="w-4 h-4 text-secondary shrink-0" />
                    <span>Blur My Photos</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-bold text-primary">Reveal My Photos</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowRespectfulCloseModal(true)}
                className="w-full px-3.5 py-2.5 text-xs text-secondary hover:text-primary hover:bg-surface-variant flex items-center gap-2.5 transition-colors font-medium text-left"
              >
                <Heart className="w-4 h-4 text-primary shrink-0" />
                <span>Close with Du'a</span>
              </button>
              <button
                onClick={() => setShowBlockModal(true)}
                className="w-full px-3.5 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-medium text-left"
              >
                <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Block Candidate</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 1-to-1 Modesty Photo Reveal Privacy Quick Bar (Only for candidate-to-candidate matches) */}
      {!isOfficialChannel && (
        <div className="bg-surface-variant/80 backdrop-blur-xs px-3.5 py-1.5 border-b border-outline flex items-center justify-between z-10 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-on-surface truncate">
              {(() => {
                const partnerRevealedToMe = Boolean(activeConv?.otherUser?.isPhotoRevealed || activeConv?.isPhotoRevealed);
                const partnerFirstName = activeConv?.otherUser?.fullName ? activeConv.otherUser.fullName.split(' ')[0] : 'Partner';
                if (hasRevealedToPartner && partnerRevealedToMe) {
                  return `Mutual reveal active: Photos unblurred for both`;
                }
                if (hasRevealedToPartner) {
                  return `Your photos are unblurred for ${partnerFirstName} (Waiting for theirs)`;
                }
                if (partnerRevealedToMe) {
                  return `${partnerFirstName} revealed their photos to you!`;
                }
                return `Modesty Shield: Your photos are blurred`;
              })()}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleRevealPhotos}
            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 shrink-0 shadow-2xs active:scale-95 ${
              hasRevealedToPartner
                ? 'bg-white border-outline text-secondary hover:bg-surface-variant hover:text-on-surface'
                : 'bg-primary text-white border-primary shadow-brand hover:bg-primary-dark'
            }`}
          >
            {hasRevealedToPartner ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Blur Again</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Reveal Photos</span>
              </>
            )}
          </button>
        </div>
      )}


      {/* Messages Scroll Area */}


      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FAF8F5]/60">
        {/* Date Marker */}
        <div className="flex justify-center my-1">
          <span className="text-[10px] text-amber-900/90 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-amber-200/80 font-medium shadow-2xs flex items-center gap-1.5 font-serif">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conversation Began with Bismillah</span>
          </span>
        </div>

        {(() => {
          const activeMessages = roomMessages.length > 0 ? roomMessages : (activeConv.messages || []);
          return activeMessages.length > 0 ? (
            activeMessages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser.id;
              const isOfficialMsg = Boolean(isOfficialChannel || msg.isOfficial || msg.senderId === 'usr_qurb_official');

              if (isOfficialMsg) {
                // High-End Official Announcement Showcase Card
                const rawMedia = (msg.mediaUrl && typeof msg.mediaUrl === 'string' && msg.mediaUrl.trim() !== '' && msg.mediaUrl !== 'null') ? msg.mediaUrl.trim() : null;
                const bannerUrl = rawMedia || 
                  (msg.text?.includes('v1.0.37') || msg.text?.includes('Update') || msg.text?.includes('Calling') || (isOfficialMsg && msg.text?.includes('Play Store'))
                    ? 'https://qurb.app/announcement_v1037_banner.jpg' 
                    : undefined);

                const rawText = msg.text || '';
                const urlMatch = rawText.match(/https?:\/\/[^\s]+/);
                const extractedUrl = urlMatch ? urlMatch[0] : null;

                const isPlayStoreIntent = Boolean(
                  (msg.actionUrl && msg.actionUrl.includes('play.google.com')) ||
                  (extractedUrl && extractedUrl.includes('play.google.com')) ||
                  rawText.toLowerCase().includes('google play') ||
                  rawText.toLowerCase().includes('play store') ||
                  rawText.toLowerCase().includes('v1.0.37') ||
                  rawText.toLowerCase().includes('update alert') ||
                  (isOfficialChannel && rawText.toLowerCase().includes('update'))
                );

                const destinationUrl = msg.actionUrl || 
                  (isPlayStoreIntent 
                    ? 'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share' 
                    : extractedUrl || (isOfficialChannel ? 'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share' : undefined));

                const ctaText = msg.actionLabel || 
                  (isPlayStoreIntent || destinationUrl?.includes('play.google.com')
                    ? '⚡ Update on Google Play Store ↗' 
                    : (destinationUrl?.includes('qurb.app') ? 'Visit Official Website ↗' : 'View Update Details ↗'));

                return (
                  <div key={msg.id || idx} className="w-full flex justify-center py-2.5 px-1 animate-fade-in">
                    <div className="w-full max-w-[360px] sm:max-w-[460px] bg-white rounded-3xl border border-sky-200 shadow-xl overflow-hidden ring-1 ring-sky-100/80 text-left transition-all hover:shadow-2xl">
                      {/* 1. Full-Bleed 16:9 Banner Image */}
                      {bannerUrl && (
                        <div 
                          onClick={() => setLightboxMedia({ url: bannerUrl, type: 'image', title: 'Qurb Official Announcement' })}
                          className="relative w-full aspect-video bg-slate-950 overflow-hidden cursor-pointer group/banner"
                          title="Click to view full banner"
                        >
                          <img
                            src={bannerUrl}
                            alt="Announcement Banner"
                            className="w-full h-full object-cover group-hover/banner:scale-102 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              if (!img.dataset.triedFallback) {
                                img.dataset.triedFallback = 'true';
                                img.src = '/announcement_v1037_banner.jpg';
                              }
                            }}
                          />
                          {/* Ambient Glass Badges Overlay */}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                            <span>Qurb Team</span>
                            <VerifiedBlueTick size={13} />
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-0.5" />
                            <span>v1.0.37 Live</span>
                          </div>
                        </div>
                      )}

                      {/* 2. Content Body */}
                      <div className="p-4 sm:p-5 space-y-3.5">
                        {/* Channel Header Meta */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-full bg-pastel-rose/80 border border-primary/20 p-1 flex items-center justify-center shadow-xs">
                              <img src="/icon.svg" alt="Qurb" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-xs text-slate-900 font-serif">Qurb Team</span>
                            <VerifiedBlueTick size={15} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatChatTime(msg.timestamp)}
                          </span>
                        </div>

                        {/* Formatted Text Content */}
                        <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                          {(() => {
                            const raw = msg.text || '';
                            const cleanText = raw.replace(/https?:\/\/[^\s]+/g, '').trim();
                            return (
                              <p className="leading-relaxed">
                                {cleanText}
                              </p>
                            );
                          })()}
                        </div>

                        {/* 3. Action CTA Button */}
                        {destinationUrl && (
                          <div className="pt-1.5">
                            <a
                              href={destinationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/35 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer no-underline group ring-1 ring-white/20"
                            >
                              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform shrink-0" />
                              <span className="tracking-wide text-xs">{ctaText}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                            </a>
                          </div>
                        )}

                        {/* 4. Verified Watermark Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1 text-slate-500">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>100% Verified Halal Channel</span>
                          </div>
                          <div className="flex items-center gap-1 text-sky-600 font-semibold">
                            <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                            <span>Broadcasted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const rawMsgText = msg.text || '';
              const isModestyLockMsg = rawMsgText.includes('restored photo blur') || rawMsgText.includes('photo blur for modesty') || rawMsgText.startsWith('🔒');
              const isModestyRevealMsg = rawMsgText.includes('revealed their unblurred photos') || rawMsgText.startsWith('📸');

              if (isModestyLockMsg) {
                const cleanText = rawMsgText.replace(/^[🔒\s]+/, '').replace(/^dY"'\s*/, '');
                return (
                  <div key={msg.id || idx} className="flex justify-center my-2 animate-fade-in w-full">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/90 shadow-2xs text-[11px] font-medium text-amber-900 max-w-[90%] backdrop-blur-xs">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                        <Lock className="w-3 h-3" />
                      </div>
                      <span className="truncate">{cleanText}</span>
                    </div>
                  </div>
                );
              }

              if (isModestyRevealMsg) {
                const cleanText = rawMsgText.replace(/^[📸\s]+/, '').replace(/^dY",\s*/, '');
                return (
                  <div key={msg.id || idx} className="flex justify-center my-2 animate-fade-in w-full">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/90 shadow-2xs text-[11px] font-medium text-emerald-900 max-w-[90%] backdrop-blur-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                        <Eye className="w-3 h-3" />
                      </div>
                      <span className="truncate">{cleanText}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col gap-0.5 max-w-[82%] ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed transition-all ${
                      isMe
                        ? 'bg-gradient-to-tr from-primary via-rose-600 to-rose-500 text-white rounded-br-2xs shadow-sm shadow-primary/20'
                        : 'bg-white text-slate-800 rounded-bl-2xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {/* 1. Voice Message Bubble */}
                    {msg.mediaType === 'audio' && msg.mediaUrl ? (
                      <div className="flex items-center gap-2.5 min-w-[210px] py-0.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePlayAudio(msg)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-xs ${
                            isMe ? 'bg-white text-primary' : 'bg-primary text-white'
                          }`}
                          title={playingAudioId === msg.id ? 'Pause' : 'Play'}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1 flex flex-col gap-1">
                          {/* Audio Progress Track */}
                          <div className={`h-1.5 rounded-full overflow-hidden ${isMe ? 'bg-white/30' : 'bg-outline'}`}>
                            <div 
                              className={`h-full transition-all duration-150 ${isMe ? 'bg-white' : 'bg-primary'}`}
                              style={{ width: `${playingAudioId === msg.id ? audioProgress : 0}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1 font-mono">
                              <Mic className="w-2.5 h-2.5" />
                              <span>{msg.mediaDuration ? formatSeconds(msg.mediaDuration) : '0:30'}</span>
                            </span>
                            {msg.fileSize ? (
                              <span className="opacity-75">{formatBytes(msg.fileSize)}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (msg.mediaType === 'image' || msg.mediaType === 'video') && msg.isViewOnce ? (
                      /* 2. View Once (1-Time Show) Bubble */
                      !isMe ? (
                        msg.isOpened ? (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-500 min-w-[170px]">
                            <div className="w-7 h-7 rounded-full border border-dashed border-slate-400 flex items-center justify-center font-bold text-[11px] text-slate-500">
                              1
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-[11px] text-slate-700">Opened</p>
                              <p className="text-[10px] text-slate-400">1-time media expired</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (msg.mediaUrl) {
                                setLightboxMedia({
                                  url: msg.mediaUrl,
                                  type: msg.mediaType === 'video' ? 'video' : 'image',
                                  title: msg.mediaType === 'video' ? 'View Once Video' : 'View Once Photo',
                                  isViewOnce: true,
                                  messageId: msg.id
                                });
                              }
                            }}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 min-w-[200px] transition-all cursor-pointer group shadow-2xs text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                              1
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                                <span>{msg.mediaType === 'video' ? 'Video' : 'Photo'}</span>
                                <span className="text-[9px] bg-emerald-200/90 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">1-Time</span>
                              </p>
                              <p className="text-[10px] text-emerald-800">Tap to view (Disappears)</p>
                            </div>
                          </button>
                        )
                      ) : (
                        msg.isOpened ? (
                          <div className="flex items-center gap-2.5 py-1 min-w-[170px]">
                            <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center font-bold text-[11px]">
                              1
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-[11px] leading-tight">{msg.mediaType === 'video' ? 'Video' : 'Photo'} (View Once)</p>
                              <p className="text-[9px] opacity-75">Opened by recipient</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-w-[280px]">
                            <div className="rounded-xl overflow-hidden relative shadow-xs">
                              {msg.mediaType === 'video' ? (
                                <ChatVideoPlayer 
                                  src={msg.mediaUrl!} 
                                  onOpenLightbox={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'video', title: 'Sent View Once Video' })}
                                />
                              ) : (
                                <div 
                                  onClick={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'image', title: 'Sent View Once Media' })}
                                  className="cursor-pointer group/img"
                                >
                                  <img src={msg.mediaUrl} alt="View Once" className="w-full max-h-60 object-cover group-hover/img:scale-102 transition-transform duration-200" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 border border-white/20 pointer-events-none">
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-extrabold">1</span>
                                <span>View Once</span>
                              </div>
                            </div>
                            {msg.text && !msg.text.includes('(View Once)') && !msg.text.includes('(1 Time)') && (
                              <p className="mt-1">{msg.text}</p>
                            )}
                          </div>
                        )
                      )
                    ) : msg.mediaType === 'image' && msg.mediaUrl ? (
                      /* 2. Photo Attachment Bubble / Official Announcement Banner Card */
                      (isOfficialChannel || msg.isOfficial) ? (
                        <div className="space-y-2.5 max-w-[340px] sm:max-w-[440px] text-left">
                          <div 
                            onClick={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'image', title: 'Official Announcement Banner' })}
                            className="rounded-2xl overflow-hidden cursor-pointer group/img relative shadow-md border border-slate-200/80 bg-slate-900 aspect-video"
                            title="Click to view full banner"
                          >
                            <img 
                              src={msg.mediaUrl} 
                              alt="Official Announcement Banner" 
                              className="w-full h-full object-cover group-hover/img:scale-102 transition-transform duration-300" 
                            />
                            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20">
                              <Megaphone className="w-3 h-3 text-amber-400" />
                              <span>Official Broadcast</span>
                            </div>
                          </div>
                          {msg.text && (
                            <div className="whitespace-pre-line leading-relaxed text-xs">
                              {(() => {
                                const text = msg.text || '';
                                const urlRegex = /(https?:\/\/[^\s]+)/g;
                                const parts = text.split(urlRegex);

                                return (
                                  <>
                                    {parts.map((part, pIdx) => {
                                      if (part.match(urlRegex)) {
                                        const isPlayStore = part.includes('play.google.com/store/apps');
                                        if (isPlayStore) {
                                          return (
                                            <div key={pIdx} className="my-2.5">
                                              <a
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 no-underline"
                                              >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>{msg.actionLabel || 'Update on Google Play Store'}</span>
                                                <ExternalLink className="w-3 h-3 opacity-80" />
                                              </a>
                                            </div>
                                          );
                                        }
                                        return (
                                          <a
                                            key={pIdx}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline font-semibold break-all text-primary hover:text-primary-dark"
                                          >
                                            {part}
                                          </a>
                                        );
                                      }
                                      return <span key={pIdx}>{part}</span>;
                                    })}
                                    {msg.actionUrl && !text.includes(msg.actionUrl) && (
                                      <div className="mt-2.5">
                                        <a
                                          href={msg.actionUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 no-underline"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-current" />
                                          <span>{msg.actionLabel || 'Open Link ↗'}</span>
                                          <ExternalLink className="w-3 h-3 opacity-80" />
                                        </a>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-w-[260px]">
                          <div 
                            onClick={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'image' })}
                            className="rounded-xl overflow-hidden cursor-pointer group/img relative shadow-xs"
                            title="Click to view full image"
                          >
                            <img 
                              src={msg.mediaUrl} 
                              alt="Photo Attachment" 
                              className="w-full max-h-60 object-cover group-hover/img:scale-102 transition-transform duration-200" 
                            />
                          </div>
                          {msg.text && msg.text !== '📷 Photo' && (
                            <p className="mt-1">{msg.text}</p>
                          )}
                        </div>
                      )
                    ) : msg.mediaType === 'video' && msg.mediaUrl ? (
                      /* 3. Video Attachment Bubble */
                      <div className="space-y-1.5 max-w-[280px]">
                        <ChatVideoPlayer 
                          src={msg.mediaUrl} 
                          onOpenLightbox={() => setLightboxMedia({ url: msg.mediaUrl!, type: 'video', title: 'Video Attachment' })}
                        />
                        {msg.text && msg.text !== '🎥 Video' && (
                          <p className="mt-1">{msg.text}</p>
                        )}
                      </div>
                    ) : msg.mediaType === 'file' && msg.mediaUrl ? (
                      /* 4. Document / File Attachment Bubble */
                      <a
                        href={msg.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 p-1 rounded-xl transition-all ${
                          isMe ? 'hover:bg-white/10' : 'hover:bg-surface-variant'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                          <File className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-semibold truncate text-[11px]">{msg.fileName || 'Document'}</p>
                          <p className="text-[10px] opacity-75">{msg.fileSize ? formatBytes(msg.fileSize) : 'File'}</p>
                        </div>
                        <Download className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      </a>
                    ) : msg.mediaType === 'call_log' ? (
                      /* 5. WhatsApp-Style VoIP Call Log Bubble */
                      <div className="flex items-center gap-3 py-1 px-1 min-w-[210px]">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                          msg.text.toLowerCase().includes('missed')
                            ? (isMe ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600 border border-rose-200')
                            : isMe 
                              ? 'bg-white/20 text-white' 
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {msg.text.toLowerCase().includes('video') ? (
                            <Video className="w-4 h-4" />
                          ) : msg.text.toLowerCase().includes('missed') ? (
                            <PhoneOff className="w-4 h-4" />
                          ) : (
                            <PhoneCall className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`font-bold text-xs truncate ${
                            msg.text.toLowerCase().includes('missed') && !isMe
                              ? 'text-rose-600 font-extrabold'
                              : (isMe ? 'text-white' : 'text-on-surface')
                          }`}>
                            {(() => {
                              const isVideo = msg.text.toLowerCase().includes('video');
                              const isMissed = msg.text.toLowerCase().includes('missed');
                              const isDeclined = msg.text.toLowerCase().includes('declined');
                              if (isMissed) {
                                return isMe ? `Unanswered ${isVideo ? 'Video' : 'Audio'} Call` : `Missed ${isVideo ? 'Video' : 'Audio'} Call`;
                              }
                              if (isDeclined) {
                                return `Declined ${isVideo ? 'Video' : 'Audio'} Call`;
                              }
                              return isMe ? `Outgoing ${isVideo ? 'Video' : 'Audio'} Call` : `Incoming ${isVideo ? 'Video' : 'Audio'} Call`;
                            })()}
                          </p>
                          <p className={`text-[11px] font-medium flex items-center gap-1.5 ${isMe ? 'text-white/80' : 'text-secondary'}`}>
                            {msg.mediaDuration && msg.mediaDuration > 0 ? (
                              <span>{formatSeconds(msg.mediaDuration)}</span>
                            ) : (
                              <span>{msg.text.toLowerCase().includes('missed') ? 'No answer' : 'Call ended'}</span>
                            )}
                          </p>
                        </div>
                        {/* Quick Call Back Button */}
                        {activeConv?.otherUser && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isVideo = msg.text.toLowerCase().includes('video');
                              handleStartCall(isVideo ? 'video' : 'audio');
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-2xs ${
                              isMe 
                                ? 'bg-white text-primary hover:bg-white/90' 
                                : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                            title="Call back"
                          >
                            {msg.text.toLowerCase().includes('video') ? (
                              <Video className="w-3.5 h-3.5" />
                            ) : (
                              <Phone className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Standard Text Message with URL Parsing & Play Store CTA */
                      <div className="whitespace-pre-line leading-relaxed text-xs">
                        {(() => {
                          const text = msg.text || '';
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const parts = text.split(urlRegex);

                          return (
                            <>
                              {parts.map((part, pIdx) => {
                                if (part.match(urlRegex)) {
                                  const isPlayStore = part.includes('play.google.com/store/apps');
                                  if (isPlayStore) {
                                    return (
                                      <div key={pIdx} className="my-2.5">
                                        <a
                                          href={part}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 no-underline"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-current" />
                                          <span>{msg.actionLabel || 'Update on Google Play Store'}</span>
                                          <ExternalLink className="w-3 h-3 opacity-80" />
                                        </a>
                                      </div>
                                    );
                                  }
                                  return (
                                    <a
                                      key={pIdx}
                                      href={part}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`underline font-semibold break-all ${isMe ? 'text-white hover:text-white/80' : 'text-primary hover:text-primary-dark'}`}
                                    >
                                      {part}
                                    </a>
                                  );
                                }
                                return <span key={pIdx}>{part}</span>;
                              })}
                              {msg.actionUrl && !text.includes(msg.actionUrl) && (
                                <div className="mt-2.5">
                                  <a
                                    href={msg.actionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 no-underline"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>{msg.actionLabel || 'Open Link ↗'}</span>
                                    <ExternalLink className="w-3 h-3 opacity-80" />
                                  </a>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-secondary px-1 font-medium">
                    <span>{msg.timestamp || 'Just now'}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center my-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-2.5 text-primary shadow-xs">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="font-serif font-bold text-sm text-slate-800">Start a Blessed Conversation</p>
              <p className="text-xs text-secondary max-w-xs mt-1 leading-relaxed">Send a respectful Islamic Salam to initiate matrimonial discussions.</p>
              
              {/* Quick Salam Chips */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xs">
                {['Assalamu Alaikum wa Rahmatullah 🌟', 'Kese hain aap? ✨', 'JazakAllah Khair for connecting 🤲'].map((salam, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInputText(salam);
                    }}
                    className="text-[11px] font-medium bg-white hover:bg-rose-50/80 text-slate-700 hover:text-primary px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    {salam}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Live Partner Typing Indicator */}
        {isPartnerTyping && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-secondary bg-surface-variant/90 border border-outline rounded-2xl w-fit animate-fade-in self-start mb-2 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span className="text-[11px] font-medium text-on-surface">
              {activeConv?.otherUser?.fullName?.split(' ')[0] || 'Partner'} is typing...
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* Uploading / Compressing Indicator */}
      {isUploadingMedia && (
        <div className="px-3.5 py-1.5 bg-sky-50 border-t border-sky-100 flex items-center gap-2 text-sky-700 text-xs font-medium animate-fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
          <span>{uploadStatus || 'Processing media...'}</span>
        </div>
      )}

      {/* Message Input Footer with Voice Record & Auto-Compressed Attachment */}
      {isOfficialChannel ? (
        <footer className="p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-on-surface text-center z-20 shadow-xs">
          <VerifiedBlueTick size={15} />
          <span className="font-medium text-secondary">This is an official announcement channel. Only Qurb Admins can broadcast messages.</span>
        </footer>
      ) : isPendingSalamForMe ? (
        <footer className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-t border-emerald-200/90 flex flex-col gap-2.5 z-20 shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300/50">
              <Hand className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-800 font-bold leading-tight">
                Direct Salam Invitation Received
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                <strong className="text-slate-900">{activeConv?.otherUser?.fullName?.split(' ')[0] || 'Candidate'}</strong> reached out with a Direct Salam. Accept to start halal conversation, or decline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/50">
            <button
              type="button"
              disabled={isProcessingSalam}
              onClick={handleRejectSalam}
              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>

            <button
              type="button"
              disabled={isProcessingSalam}
              onClick={handleApproveSalam}
              className="flex-[1.5] py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white text-xs font-bold transition-all shadow-brand flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessingSalam ? 'Connecting...' : 'Approve & Connect'}</span>
            </button>
          </div>
        </footer>
      ) : isPendingSalamSentByMe ? (
        <footer className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-600 text-center z-20">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Direct Salam invitation sent. Waiting for {activeConv?.otherUser?.fullName?.split(' ')[0] || 'member'} to accept your request.</span>
        </footer>
      ) : (
        <footer className="p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center gap-2 z-20 shadow-xs">
          {/* Hidden File Attachment Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf"
            className="hidden"
          />

          {isRecording ? (
            /* Live Recording Bar */
            <div className="flex-1 flex items-center justify-between bg-rose-50 border border-rose-200 rounded-full px-4 py-1.5 animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span className="text-xs font-mono font-bold text-rose-700">
                  {formatSeconds(recordingSeconds)}
                </span>
                <span className="text-xs text-rose-600/80 italic font-medium hidden sm:inline">
                  Recording voice note...
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="w-8 h-8 rounded-full bg-white hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Cancel recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Stop & Send Button */}
                <button
                  type="button"
                  onClick={handleStopAndSendVoice}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-rose-600 hover:opacity-95 text-white text-xs font-bold shadow-brand flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Send voice note"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Message Input Bar */
            <>
              {/* Attachment Button */}
              <button
                type="button"
                onClick={handleAttachmentClick}
                disabled={isUploadingMedia}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-primary transition-all active:scale-95 disabled:opacity-40 shrink-0 cursor-pointer"
                title="Attach photo, video, or document (auto-compressed)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => handleTextInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Write a respectful message..."
                disabled={isUploadingMedia}
                className="flex-1 bg-slate-100/90 border border-slate-200/80 rounded-full px-4 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all"
              />

              {/* Conditional Send vs Mic Button */}
              {inputText.trim() ? (
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isUploadingMedia}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-rose-600 text-white flex items-center justify-center shadow-md shadow-primary/25 hover:opacity-95 active:scale-95 disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isUploadingMedia}
                  className="w-9 h-9 rounded-full bg-rose-50 hover:bg-primary text-primary hover:text-white border border-rose-200/80 flex items-center justify-center shadow-xs active:scale-95 disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                  title="Record voice note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </footer>
      )}

      {/* Respectful Close Modal with Real Du'a */}
      {showRespectfulCloseModal && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-outline text-center space-y-3.5 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-pastel-rose text-primary flex items-center justify-center mx-auto shadow-subtle">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-base font-bold text-on-surface">End Conversation with Grace</h3>
            <p className="text-xs text-secondary leading-relaxed">
              In accordance with Islamic adab, closing this conversation will send this respectful closing du'a to {activeConv?.otherUser?.fullName?.split(' ')[0] || 'Candidate'}:
            </p>
            <div className="bg-pastel-mint/60 p-3 rounded-2xl border border-pastel-mint-border text-[11px] text-pastel-mint-text italic leading-relaxed text-left">
              "Assalamu Alaikum. JazakAllah Khair for your time and respectful communication. May Allah (SWT) grant you barakah and bless you with a righteous spouse who is the coolness of your eyes. Ameen."
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowRespectfulCloseModal(false)}
                className="flex-1 py-2.5 rounded-full border border-outline text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseWithDua}
                className="flex-1 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow-brand hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Send Du'a & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Block User Safety Modal */}
      {showBlockModal && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-outline space-y-3.5 animate-fade-in text-left">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6 text-rose-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-base font-bold text-on-surface">
                Block {activeConv?.otherUser?.fullName?.split(' ')[0] || 'Candidate'}?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                This will end the chat immediately and add them to your <strong>Blocked Users</strong> list in Matches. You can unblock them anytime from your Matches tab.
              </p>
            </div>

            {/* Block Reason Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface">Reason for blocking:</label>
              <div className="space-y-1">
                {[
                  'Inappropriate messages or disrespect',
                  'Not serious about marriage / time wasting',
                  'Spam or suspicious profile',
                  'Deen or lifestyle incompatibility',
                  'Other / Personal reason'
                ].map((reason) => (
                  <label
                    key={reason}
                    onClick={() => setBlockReason(reason)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      blockReason === reason 
                        ? 'border-rose-500 bg-rose-50/60 font-semibold text-rose-900' 
                        : 'border-outline hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    <input
                      type="radio"
                      name="blockReason"
                      checked={blockReason === reason}
                      onChange={() => setBlockReason(reason)}
                      className="text-rose-600 accent-rose-600"
                    />
                    <span className="text-[11px]">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowBlockModal(false)}
                disabled={isBlocking}
                className="flex-1 py-2.5 rounded-full border border-outline text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                disabled={isBlocking}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isBlocking ? (
                  <span>Blocking...</span>
                ) : (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Block & End Chat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs font-medium animate-fade-in max-w-[90%]">
          <Ban className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
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

      {/* Attachment Send Preview Modal (with View-Once Option) */}
      {pendingAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-outline"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 border-b border-outline flex items-center justify-between bg-surface-variant">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  {pendingAttachment.mediaType === 'image' ? 'Send Photo' : (pendingAttachment.mediaType === 'video' ? 'Send Video' : 'Send File')}
                </span>
                <span className="text-[10px] text-secondary font-mono">
                  ({formatBytes(pendingAttachment.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
                className="w-7 h-7 rounded-full bg-white hover:bg-outline flex items-center justify-center text-secondary hover:text-on-surface transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Preview Box */}
            <div className="relative bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[380px] overflow-hidden">
              {pendingAttachment.mediaType === 'image' ? (
                <img 
                  src={pendingAttachment.previewUrl} 
                  alt="Preview" 
                  className="max-h-[360px] max-w-full object-contain"
                />
              ) : pendingAttachment.mediaType === 'video' ? (
                <ChatVideoPlayer 
                  src={pendingAttachment.previewUrl} 
                  className="max-h-[360px] max-w-full"
                />
              ) : (
                <div className="p-8 text-center text-white space-y-2">
                  <File className="w-12 h-12 mx-auto text-primary" />
                  <p className="text-xs font-semibold">{pendingAttachment.name}</p>
                </div>
              )}

              {/* View Once Active Badge on Preview */}
              {viewOnceEnabled && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1.5 animate-fade-in">
                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black">1</span>
                  <span>1-Time View (Disappears after opened)</span>
                </div>
              )}
            </div>

            {/* Caption & Controls Footer */}
            <div className="p-3.5 bg-white border-t border-outline space-y-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachmentCaption}
                  onChange={(e) => setAttachmentCaption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmSendAttachment();
                  }}
                  placeholder="Add a caption..."
                  className="flex-1 bg-surface-variant border border-outline rounded-full px-3.5 py-2 text-xs text-on-surface outline-none focus:bg-white focus:border-primary transition-all"
                  autoFocus
                />

                {/* 1-Time View Toggle Button (WhatsApp / Instagram style) */}
                {(pendingAttachment.mediaType === 'image' || pendingAttachment.mediaType === 'video') && (
                  <button
                    type="button"
                    onClick={() => setViewOnceEnabled(prev => !prev)}
                    className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center transition-all cursor-pointer border active:scale-90 ${
                      viewOnceEnabled
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-brand ring-2 ring-emerald-200'
                        : 'bg-surface-variant hover:bg-outline border-outline text-secondary hover:text-on-surface'
                    }`}
                    title={viewOnceEnabled ? 'View once is enabled (Click to turn off)' : 'Set photo to View Once (1-Time Show)'}
                  >
                    1
                  </button>
                )}

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleConfirmSendAttachment}
                  className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-brand active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {(pendingAttachment.mediaType === 'image' || pendingAttachment.mediaType === 'video') && (
                <div className="flex items-center justify-between text-[11px] px-1 text-secondary">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Auto-compressed before upload</span>
                  </span>
                  <span className={viewOnceEnabled ? 'text-emerald-700 font-bold' : 'text-secondary/70'}>
                    {viewOnceEnabled ? '① View Once Enabled' : 'Tap ① for 1-Time Show'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Lightbox Viewer Modal */}
      {lightboxMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Top Banner for View-Once Media */}
          {lightboxMedia.isViewOnce && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-emerald-950/85 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg z-20">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>View Once: Will disappear after you close</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
          <div 
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxMedia.type === 'image' ? (
              <img
                src={lightboxMedia.url}
                alt={lightboxMedia.title || 'Attachment Preview'}
                className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
              />
            ) : (
              <ChatVideoPlayer
                src={lightboxMedia.url}
                className="w-full max-h-[80vh] rounded-2xl shadow-2xl"
              />
            )}
            {!lightboxMedia.isViewOnce && (
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={lightboxMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Original</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}



      {showVipModalForCalling && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showVipModalForCalling}
          onClose={() => setShowVipModalForCalling(false)}
          onPurchaseSuccess={() => {
            setShowVipModalForCalling(false);
            currentUser.isVip = true;
          }}
        />
      )}
    </div>
  );
};
export default ChatScreen;




