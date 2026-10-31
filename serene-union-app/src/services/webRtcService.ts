// Qurb (Serene Union) — Production WebRTC Calling Engine
// Handles P2P Audio/Video negotiation, ICE traversal, media tracks, and acoustic feedback.

import { API_BASE } from './apiConfig';
import { dbService } from './dbService';

declare global {
  interface Window {
    AndroidAudioBridge?: {
      setCallMode: (inCall: boolean) => void;
      setSpeakerphoneOn: (on: boolean) => void;
      isSpeakerphoneOn: () => boolean;
      requestCallPermissions?: (withVideo: boolean) => void;
      getPendingIncomingCall?: () => string | null;
    };
  }
}

export type CallState = 'idle' | 'outgoing_calling' | 'incoming_ringing' | 'connecting' | 'connected' | 'ended';
export type CallType = 'audio' | 'video';

export interface CallerInfo {
  id: string;
  fullName: string;
  gender: string;
  city: string;
  photoUrl?: string;
  isVip?: boolean;
}

export interface CallSignalPayload {
  type: 'call_signal';
  signal: 'initiate' | 'ringing' | 'accept' | 'reject' | 'sdp_offer' | 'sdp_answer' | 'ice_candidate' | 'end' | 'video_toggle' | 'partner_audio_toggle';
  senderId: string;
  targetUserId?: string;
  callType: CallType;
  callerInfo?: CallerInfo | null;
  payload?: any;
  timestamp?: number;
}

const ICE_SERVERS: RTCIceServer[] = [
  // Google Public STUN
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  // Cloudflare Public STUN
  { urls: 'stun:stun.cloudflare.com:3478' },
  // OpenRelay Public STUN & TURN (Metered WebRTC Project for Symmetric NAT / 4G Mobile Data)
  { urls: 'stun:stun.relay.metered.ca:80' },
  {
    urls: [
      'turn:standard.relay.metered.ca:80',
      'turn:standard.relay.metered.ca:80?transport=tcp',
      'turn:standard.relay.metered.ca:443',
      'turn:standard.relay.metered.ca:443?transport=tcp'
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: [
      'turns:standard.relay.metered.ca:443?transport=tcp',
      'turns:standard.relay.metered.ca:5349'
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

export class WebRtcService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private iceCandidateQueue: RTCIceCandidateInit[] = [];
  
  private currentCallState: CallState = 'idle';
  private currentCallType: CallType = 'audio';
  private currentPartnerInfo: CallerInfo | null = null;
  private currentPartnerId: string | null = null;
  private currentUserId: string | null = null;

  private isMuted: boolean = false;
  private isVideoEnabled: boolean = true;
  private isFrontCamera: boolean = true;

  private signalSender: ((payload: CallSignalPayload) => void) | null = null;
  private listeners: Set<(state: CallState, data?: any) => void> = new Set();
  private streamListeners: Set<(localStream: MediaStream | null, remoteStream: MediaStream | null) => void> = new Set();

  private callWs: WebSocket | null = null;
  private callWsRetryTimer: any = null;
  private connectionFallbackTimer: any = null;
  private activeConversationId: string | null = null;

  private audioCtx: AudioContext | null = null;
  private ringToneInterval: any = null;
  private callTimeoutTimer: any = null;
  private signalingPollInterval: any = null;
  private processedSignals: Set<string> = new Set();
  private iceDisconnectTimer: any = null;

  private isInitiator: boolean = false;
  private activeCallerInfo: CallerInfo | null = null;
  private callConnectedTime: number | null = null;
  private hasLoggedCall: boolean = false;

  constructor() {
    // Network Switch ICE Restart Listener (WiFi <-> 4G Data) - Bug #4
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.peerConnection && this.currentCallState === 'connected') {
          console.log('[WebRTC] Network reconnected (online event), triggering ICE restart...');
          try {
            if (typeof this.peerConnection.restartIce === 'function') {
              this.peerConnection.restartIce();
              if (this.isInitiator && this.peerConnection.signalingState === 'stable') {
                this.peerConnection.createOffer({
                  iceRestart: true,
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: this.currentCallType === 'video'
                }).then(async (offer) => {
                  if (this.peerConnection) {
                    await this.peerConnection.setLocalDescription(offer);
                    this.sendSignal({
                      type: 'call_signal',
                      signal: 'sdp_offer',
                      senderId: this.currentUserId || '',
                      targetUserId: this.currentPartnerId || '',
                      callType: this.currentCallType,
                      payload: { sdp: offer, isIceRestart: true }
                    });
                  }
                }).catch(e => {
                  console.warn('[WebRTC] restartIce on online offer error:', e);
                });
              }
            }
          } catch (e) {
            console.warn('[WebRTC] restartIce on online failed:', e);
          }
        }
      });
    }
  }

  public init(currentUserId: string, sendSignalFn?: (payload: CallSignalPayload) => void) {
    this.currentUserId = currentUserId;
    if (sendSignalFn) {
      this.signalSender = sendSignalFn;
    }
  }

  public subscribe(cb: (state: CallState, data?: any) => void) {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  public subscribeStreams(cb: (localStream: MediaStream | null, remoteStream: MediaStream | null) => void) {
    this.streamListeners.add(cb);
    return () => { this.streamListeners.delete(cb); };
  }

  private notifyState(state: CallState, data?: any) {
    this.currentCallState = state;
    if (state === 'connected') {
      if (!this.callConnectedTime) {
        this.callConnectedTime = Date.now();
      }
      this.setCallMode(true);
      if (this.currentCallType === 'video') {
        this.setSpeakerphoneOn(true);
      } else {
        this.setSpeakerphoneOn(false);
      }
    } else if (state === 'ended' || state === 'idle') {
      this.setCallMode(false);
    }
    this.listeners.forEach(cb => {
      try { cb(state, data); } catch {}
    });
  }

  public setSpeakerphoneOn(on: boolean) {
    try {
      if (typeof window !== 'undefined' && window.AndroidAudioBridge) {
        window.AndroidAudioBridge.setSpeakerphoneOn(on);
      }
    } catch (e) {
      console.warn('Native speakerphone control error:', e);
    }
  }

  public setCallMode(inCall: boolean) {
    try {
      if (typeof window !== 'undefined' && window.AndroidAudioBridge) {
        window.AndroidAudioBridge.setCallMode(inCall);
      }
    } catch (e) {
      console.warn('Native call mode control error:', e);
    }
  }

  private notifyStreams() {
    this.streamListeners.forEach(cb => {
      try { cb(this.localStream, this.remoteStream); } catch {}
    });
  }

  public getState(): CallState {
    return this.currentCallState;
  }

  public getCallType(): CallType {
    return this.currentCallType;
  }

  public getActiveConversationId(): string | null {
    return this.activeConversationId;
  }

  public getPartnerInfo(): CallerInfo | null {
    return this.currentPartnerInfo;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  public getVideoState(): boolean {
    return this.isVideoEnabled;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  // Sound Synthesizer via Web Audio API (100% offline, zero missing file errors)
  private playRingtone() {
    this.stopRingtone();
    const playChime = () => {
      try {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35); // A5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      } catch {}
    };

    playChime();
    this.ringToneInterval = setInterval(playChime, 2400);
  }

  private stopRingtone() {
    if (this.ringToneInterval) {
      clearInterval(this.ringToneInterval);
      this.ringToneInterval = null;
    }
  }

  private playTone(freqStart: number, freqEnd: number, duration: number = 0.3) {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  // --- Dedicated Call WebSocket Channel (Direct P2P Relay across all tabs - Bug #2) ---
  private connectCallWebSocket(conversationId: string) {
    this.closeCallWebSocket();
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;

    try {
      const wsProtocol = API_BASE.startsWith('https:') ? 'wss:' : (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
      const wsBase = API_BASE.replace(/^https?:/, wsProtocol);
      const wsUrl = `${wsBase}/conversations/${encodeURIComponent(conversationId)}/ws?userId=${encodeURIComponent(this.currentUserId || 'caller')}`;

      const ws = new WebSocket(wsUrl);
      this.callWs = ws;

      ws.onopen = () => {
        console.log('[WebRTC Socket] Connected to call room:', conversationId);
        try { ws.send(JSON.stringify({ type: 'ping' })); } catch {}
      };

      ws.onmessage = async (event) => {
        try {
          const raw = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data);
          const data = JSON.parse(raw);
          if (data.type === 'call_signal' && data.signal) {
            await this.handleIncomingSignal(data);
          }
        } catch {}
      };

      ws.onerror = (e) => {
        console.warn('[WebRTC Socket] Error notice:', e);
      };

      ws.onclose = () => {
        this.callWs = null;
        // Auto-reconnect if call is still active/connecting (Bug #7)
        if (
          this.currentCallState === 'connected' ||
          this.currentCallState === 'connecting' ||
          this.currentCallState === 'outgoing_calling' ||
          this.currentCallState === 'incoming_ringing'
        ) {
          if (!this.callWsRetryTimer) {
            this.callWsRetryTimer = setTimeout(() => {
              this.callWsRetryTimer = null;
              if (this.currentCallState !== 'idle' && this.currentCallState !== 'ended') {
                this.connectCallWebSocket(conversationId);
              }
            }, 1200);
          }
        }
      };
    } catch (e) {
      console.warn('[WebRTC Socket] Init error:', e);
    }
  }

  private closeCallWebSocket() {
    if (this.callWsRetryTimer) {
      clearTimeout(this.callWsRetryTimer);
      this.callWsRetryTimer = null;
    }
    if (this.callWs) {
      try {
        this.callWs.onclose = null;
        this.callWs.close();
      } catch {}
      this.callWs = null;
    }
  }

  // --- Dedicated HTTP Calling Signal Polling Engine ---
  private startSignalingPoll(conversationId: string) {
    this.stopSignalingPoll();
    if (!conversationId) return;

    const poll = async () => {
      if (this.currentCallState === 'idle') {
        this.stopSignalingPoll();
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/conversations/call/signal?conversationId=${encodeURIComponent(conversationId)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.signals)) {
          // Prune processed signals cache if it grows too large (Bug #6)
          if (this.processedSignals.size > 200) {
            const arr = Array.from(this.processedSignals);
            this.processedSignals = new Set(arr.slice(-100));
          }

          for (const sig of data.signals) {
            const candPart = sig.payload?.candidate?.candidate || sig.payload?.sdp?.type || sig.payload?.reason || '';
            const sigKey = `${sig.signal}_${sig.senderId}_${sig.timestamp || ''}_${candPart}`;
            if (!this.processedSignals.has(sigKey)) {
              this.processedSignals.add(sigKey);
              if (sig.senderId !== this.currentUserId) {
                console.log('[WebRTC Polling Relay] Received signal:', sig.signal);
                await this.handleIncomingSignal(sig);
              }
            }
          }
        }
      } catch {}
    };

    poll();
    this.signalingPollInterval = setInterval(poll, 700);
  }

  private stopSignalingPoll() {
    if (this.signalingPollInterval) {
      clearInterval(this.signalingPollInterval);
      this.signalingPollInterval = null;
    }
    // Bug #6 Fix: Do NOT clear processedSignals here to prevent re-processing old signals
  }

  // --- Step 1: Start an Outgoing Call (Initiator / Caller) ---
  public async startCall(partnerId: string, partnerInfo: CallerInfo, callType: CallType, currentUserInfo: CallerInfo) {
    if (this.currentCallState !== 'idle') {
      if (this.currentCallState === 'ended') {
        this.cleanup();
      } else {
        return;
      }
    }

    if (currentUserInfo?.id) {
      this.currentUserId = currentUserInfo.id;
    }
    this.currentPartnerId = partnerId;
    this.currentPartnerInfo = partnerInfo;
    this.currentCallType = callType;
    this.isMuted = false;
    this.isVideoEnabled = callType === 'video';
    this.isFrontCamera = true;
    this.isInitiator = true;
    this.activeCallerInfo = currentUserInfo;
    this.callConnectedTime = null;
    this.hasLoggedCall = false;
    this.processedSignals.clear();

    // WhatsApp-Style: Immediately open camera preview before & during ringing!
    if (callType === 'video') {
      await this.setupLocalMedia(true);
    } else {
      await this.setupLocalMedia(false);
    }

    const conversationId = `conv_${[this.currentUserId || currentUserInfo.id, partnerId].sort().join('_')}`;
    this.activeConversationId = conversationId;
    this.connectCallWebSocket(conversationId);
    this.startSignalingPoll(conversationId);

    this.notifyState('outgoing_calling', { partner: partnerInfo, callType });
    this.playRingtone();

    // Auto timeout after 40s (missed call)
    this.callTimeoutTimer = setTimeout(() => {
      this.endCall('No answer');
    }, 40000);

    // Send initiate signal to partner over WebSocket (instant in-room peer)
    this.sendSignal({
      type: 'call_signal',
      signal: 'initiate',
      senderId: this.currentUserId || currentUserInfo.id,
      targetUserId: partnerId,
      callType,
      callerInfo: currentUserInfo
    });

    // High-Priority Remote Call Wakeup via REST/FCM (wakes up receiver even if phone is locked or app is in background)
    try {
      fetch(`${API_BASE}/conversations/call/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerId: this.currentUserId || currentUserInfo.id,
          recipientId: partnerId,
          callType,
          callerInfo: currentUserInfo,
          conversationId: `conv_${[this.currentUserId || currentUserInfo.id, partnerId].sort().join('_')}`
        })
      }).then(r => r.json()).then(res => {
        console.log('[WebRTC] Call initiate push notification response:', res);
      }).catch(err => {
        console.warn('Call initiate push notification notice:', err);
      });
    } catch {}
  }

  // --- Step 2: Handle Incoming Signals from Partner ---
  public async handleIncomingSignal(payload: CallSignalPayload) {
    if (!payload || !payload.signal) return;
    if (!this.currentUserId && payload.targetUserId) {
      this.currentUserId = payload.targetUserId;
    }
    if (!this.currentUserId) return;
    if (payload.senderId === this.currentUserId) return;

    switch (payload.signal) {
      case 'initiate': {
        // 1. If caller is self, ignore!
        if (payload.senderId === this.currentUserId) return;

        // 2. If already ringing or connected with THIS specific partner, ignore duplicate initiate signal
        if (
          (this.currentCallState === 'incoming_ringing' || this.currentCallState === 'connected') &&
          this.currentPartnerId === payload.senderId
        ) {
          console.log('[WebRTC] Duplicate initiate signal from current caller, safely ignoring.');
          return;
        }

        // 3. Only send busy/reject if we are ACTUALLY already on another call with someone ELSE!
        if (
          this.currentCallState === 'connected' ||
          (this.currentCallState === 'incoming_ringing' && this.currentPartnerId !== payload.senderId)
        ) {
          console.warn('[WebRTC] Genuinely busy with another call, sending reject to:', payload.senderId);
          this.sendSignal({
            type: 'call_signal',
            signal: 'reject',
            senderId: this.currentUserId,
            targetUserId: payload.senderId,
            callType: payload.callType,
            payload: { reason: 'busy' }
          });
          return;
        }

        // 4. If currentCallState was 'outgoing_calling':
        if (this.currentCallState === 'outgoing_calling') {
          if (this.currentPartnerId === payload.senderId) {
            // Simultaneous call tie-break: lower ID yields
            if ((this.currentUserId || '') > payload.senderId) {
              console.log('[WebRTC] Simultaneous call tie-break: yielding to caller.');
              this.cleanup('simultaneous_call');
            } else {
              console.log('[WebRTC] Simultaneous call tie-break: caller keeps outgoing call.');
              return;
            }
          } else {
            // Already calling someone else
            this.sendSignal({
              type: 'call_signal',
              signal: 'reject',
              senderId: this.currentUserId,
              targetUserId: payload.senderId,
              callType: payload.callType,
              payload: { reason: 'busy' }
            });
            return;
          }
        }

        this.currentPartnerId = payload.senderId;
        this.currentPartnerInfo = payload.callerInfo || {
          id: payload.senderId,
          fullName: 'Match Candidate',
          gender: 'female',
          city: 'Global'
        };
        this.currentCallType = payload.callType;
        this.isInitiator = false;
        this.activeCallerInfo = payload.callerInfo || null;
        this.callConnectedTime = null;
        this.hasLoggedCall = false;

        const conversationId = `conv_${[this.currentUserId, payload.senderId].sort().join('_')}`;
        this.activeConversationId = conversationId;
        this.connectCallWebSocket(conversationId);
        this.startSignalingPoll(conversationId);

        this.notifyState('incoming_ringing', { caller: this.currentPartnerInfo, callType: payload.callType });
        this.playRingtone();

        // Acknowledge ringing back to caller
        this.sendSignal({
          type: 'call_signal',
          signal: 'ringing',
          senderId: this.currentUserId,
          targetUserId: payload.senderId,
          callType: payload.callType
        });
        break;
      }

      case 'ringing': {
        // Caller gets ringing confirmation
        if (this.currentCallState === 'outgoing_calling' && (!this.currentPartnerId || this.currentPartnerId === payload.senderId)) {
          this.notifyState('outgoing_calling', { status: 'ringing' });
        }
        break;
      }

      case 'accept': {
        // Only accept if currently waiting for this partner to answer
        if (this.currentCallState !== 'outgoing_calling') return;
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;

        // Receiver accepted the call! Caller proceeds to create WebRTC Offer
        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);

        // Bug #1 & #9 Fix: Transition to 'connecting', NOT premature 'connected'!
        this.notifyState('connecting', { partner: this.currentPartnerInfo, callType: this.currentCallType });

        const acceptedWithVideo = Boolean(payload.payload?.withVideo);
        if (!acceptedWithVideo) {
          this.currentCallType = 'audio';
          this.isVideoEnabled = false;
          if (this.localStream) {
            this.localStream.getVideoTracks().forEach(t => { t.enabled = false; t.stop(); });
          }
        } else if (!this.localStream) {
          await this.setupLocalMedia(true);
        }

        await this.createPeerConnectionAndOffer();
        break;
      }

      case 'reject': {
        if (this.currentCallState === 'idle') return;
        // Ignore reject signals from strangers / other sessions
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) {
          console.warn('[WebRTC] Ignored reject signal from non-partner:', payload.senderId);
          return;
        }

        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
        this.playTone(400, 200, 0.4); // Descending reject tone
        const reason = payload.payload?.reason || 'declined';
        this.stopSignalingPoll();
        this.triggerCallHistoryLog(reason);
        if (this.localStream) {
          this.localStream.getTracks().forEach(t => t.stop());
          this.localStream = null;
        }
        if (this.peerConnection) {
          try { this.peerConnection.close(); } catch {}
          this.peerConnection = null;
        }
        this.notifyState('ended', { reason });
        setTimeout(() => {
          this.cleanup(reason);
          this.notifyState('idle');
        }, 1500);
        break;
      }

      case 'sdp_offer': {
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;
        // Receiver receives SDP offer from Caller
        if (payload.payload?.sdp) {
          await this.handleRemoteOffer(payload.payload.sdp);
        }
        break;
      }

      case 'sdp_answer': {
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;
        // Caller receives SDP answer from Receiver
        if (this.peerConnection && payload.payload?.sdp) {
          try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.payload.sdp));
            await this.processPendingIceCandidates();
            this.armConnectionFallbackTimer();
          } catch (err) {
            console.error('Error handling remote SDP answer:', err);
          }
        }
        break;
      }

      case 'video_toggle': {
        // Bug #3 Fix: Handle partner camera toggle in real-time
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;
        const isPartnerVideoOn = Boolean(payload.payload?.isVideoEnabled);
        this.notifyState(this.currentCallState, {
          partner: this.currentPartnerInfo,
          callType: this.currentCallType,
          partnerVideoEnabled: isPartnerVideoOn
        });
        break;
      }

      case 'partner_audio_toggle': {
        // Handle partner mic mute/unmute notification in real-time
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;
        const isPartnerMuted = Boolean(payload.payload?.isMuted);
        this.notifyState(this.currentCallState, {
          partner: this.currentPartnerInfo,
          callType: this.currentCallType,
          partnerMuted: isPartnerMuted
        });
        break;
      }

      case 'ice_candidate': {
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) return;
        const candidate = payload.payload?.candidate;
        if (candidate) {
          if (this.peerConnection && this.peerConnection.remoteDescription && this.peerConnection.remoteDescription.type) {
            try {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.warn('Queuing ICE candidate after add failed:', err);
              this.iceCandidateQueue.push(candidate);
            }
          } else {
            // Buffer candidate until setRemoteDescription completes
            this.iceCandidateQueue.push(candidate);
          }
        }
        break;
      }

      case 'end': {
        if (this.currentCallState === 'idle') return;
        if (this.currentPartnerId && payload.senderId !== this.currentPartnerId) {
          console.warn('[WebRTC] Ignored end signal from non-partner:', payload.senderId);
          return;
        }

        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
        this.playTone(500, 250, 0.3);
        const reason = payload.payload?.reason || 'call_ended_by_partner';
        this.stopSignalingPoll();
        this.triggerCallHistoryLog(reason);
        if (this.localStream) {
          this.localStream.getTracks().forEach(t => t.stop());
          this.localStream = null;
        }
        if (this.peerConnection) {
          try { this.peerConnection.close(); } catch {}
          this.peerConnection = null;
        }
        this.notifyState('ended', { reason });
        setTimeout(() => {
          this.cleanup(reason);
          this.notifyState('idle');
        }, 1500);
        break;
      }
    }
  }

  // --- Step 3: Accept Incoming Call (Receiver) ---
  public async acceptCall(withVideo: boolean = false) {
    if (this.currentCallState !== 'incoming_ringing') return;
    this.stopRingtone();

    this.currentCallType = withVideo ? 'video' : 'audio';
    this.isVideoEnabled = withVideo;
    this.isMuted = false;

    if (this.currentPartnerId) {
      const convId = `conv_${[this.currentUserId || '', this.currentPartnerId].sort().join('_')}`;
      this.activeConversationId = convId;
      this.connectCallWebSocket(convId);
      this.startSignalingPoll(convId);
    }

    // Bug #1 Fix: Transition to 'connecting', NOT premature 'connected'!
    this.notifyState('connecting', { partner: this.currentPartnerInfo, callType: this.currentCallType });

    // 1. Acquire local mic / camera FIRST so tracks are 100% active before caller creates SDP offer!
    await this.setupLocalMedia(withVideo);

    // 2. Send accept signal to caller now that local media is fully prepared
    this.sendSignal({
      type: 'call_signal',
      signal: 'accept',
      senderId: this.currentUserId || '',
      targetUserId: this.currentPartnerId || '',
      callType: this.currentCallType,
      payload: { withVideo }
    });
  }

  // --- Step 4: Reject Incoming Call (Receiver) ---
  public rejectCall(reason: string = 'declined') {
    this.stopRingtone();
    if (this.currentCallState === 'incoming_ringing') {
      this.sendSignal({
        type: 'call_signal',
        signal: 'reject',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId || '',
        callType: this.currentCallType,
        payload: { reason }
      });
    }
    this.stopSignalingPoll();
    this.triggerCallHistoryLog(reason);
    if (this.localStream) {
      if (typeof this.localStream.getTracks === 'function') {
        this.localStream.getTracks().forEach(t => t.stop());
      }
      this.localStream = null;
    }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }
    this.notifyState('ended', { reason });
    setTimeout(() => {
      this.cleanup(reason);
      this.notifyState('idle');
    }, 1200);
  }

  // --- Step 5: End Call ---
  public endCall(reason: string = 'user_hung_up') {
    this.stopRingtone();
    if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);

    if (this.currentCallState !== 'idle' && this.currentPartnerId) {
      this.sendSignal({
        type: 'call_signal',
        signal: 'end',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId,
        callType: this.currentCallType,
        payload: { reason }
      });
    }

    this.playTone(500, 250, 0.3);
    this.stopSignalingPoll();
    this.triggerCallHistoryLog(reason);
    if (this.localStream) {
      if (typeof this.localStream.getTracks === 'function') {
        this.localStream.getTracks().forEach(t => t.stop());
      }
      this.localStream = null;
    }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }
    this.notifyState('ended', { reason });
    setTimeout(() => {
      this.cleanup(reason);
      this.notifyState('idle');
    }, 1500);
  }

  // --- Media Setup & WebRTC Negotiation ---
  private async setupLocalMedia(video: boolean): Promise<MediaStream | null> {
    try {
      // Just-In-Time native calling permissions request
      if (typeof window !== 'undefined' && window.AndroidAudioBridge?.requestCallPermissions) {
        try {
          window.AndroidAudioBridge.requestCallPermissions(video);
        } catch (bridgeErr) {
          console.warn('[WebRTC] Native audio bridge permission request notice:', bridgeErr);
        }
      }

      if (this.localStream) {
        this.localStream.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: video ? {
          facingMode: this.isFrontCamera ? 'user' : 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      this.notifyStreams();
      return stream;
    } catch (err: any) {
      console.warn('Camera/Mic permission failed or not available:', err);
      // Fallback to audio only if video failed
      if (video) {
        return this.setupLocalMedia(false);
      }
      // Ultimate audio fallback for devices with strict AEC flags
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.localStream = stream;
        this.notifyStreams();
        return stream;
      } catch (fallbackErr) {
        console.error('Basic audio fallback also failed:', fallbackErr);
        return null;
      }
    }
  }



  private armConnectionFallbackTimer() {
    if (this.connectionFallbackTimer) clearTimeout(this.connectionFallbackTimer);
    this.connectionFallbackTimer = setTimeout(() => {
      this.connectionFallbackTimer = null;
      if (this.currentCallState === 'connecting' || this.currentCallState === 'outgoing_calling') {
        console.log('[WebRTC] Connection fallback timer triggered, activating connected state.');
        this.transitionToConnected();
      }
    }, 6000);
  }

  private transitionToConnected() {
    if (this.connectionFallbackTimer) {
      clearTimeout(this.connectionFallbackTimer);
      this.connectionFallbackTimer = null;
    }
    if (this.currentCallState === 'connected') return;
    this.playTone(523, 784, 0.25);
    this.notifyState('connected', { partner: this.currentPartnerInfo, callType: this.currentCallType });
  }

  private async createPeerConnectionAndOffer() {
    this.initPeerConnection();
    if (!this.peerConnection) return;

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.currentCallType === 'video'
      });
      await this.peerConnection.setLocalDescription(offer);

      this.sendSignal({
        type: 'call_signal',
        signal: 'sdp_offer',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId || '',
        callType: this.currentCallType,
        payload: { sdp: offer }
      });

      // Bug #1 & #9: State remains 'connecting' until peer connection actually establishes
      this.notifyState('connecting', { partner: this.currentPartnerInfo, callType: this.currentCallType });
    } catch (err) {
      console.error('Error creating SDP offer:', err);
    }
  }

  private async handleRemoteOffer(sdp: RTCSessionDescriptionInit) {
    // Safety check: ensure localStream is acquired before initPeerConnection attaches tracks
    if (!this.localStream) {
      await this.setupLocalMedia(this.currentCallType === 'video');
    }

    // SDP Glare Handling (Bug #10):
    if (this.peerConnection) {
      if (this.peerConnection.signalingState === 'have-local-offer') {
        if (!this.isInitiator) {
          try {
            await this.peerConnection.setLocalDescription({ type: 'rollback' });
          } catch (rbErr) {
            console.warn('[WebRTC] Rollback error during glare resolution:', rbErr);
          }
        } else {
          console.log('[WebRTC] Impolite peer ignoring conflicting offer to avoid glare.');
          return;
        }
      }
    } else {
      this.initPeerConnection();
    }

    if (!this.peerConnection) return;

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      await this.processPendingIceCandidates();

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.sendSignal({
        type: 'call_signal',
        signal: 'sdp_answer',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId || '',
        callType: this.currentCallType,
        payload: { sdp: answer }
      });

      // Bug #1 & #9: State remains 'connecting', start safety fallback timer
      this.notifyState('connecting', { partner: this.currentPartnerInfo, callType: this.currentCallType });
      this.armConnectionFallbackTimer();
    } catch (err) {
      console.error('Error handling remote offer / creating answer:', err);
    }
  }

  private async processPendingIceCandidates() {
    if (!this.peerConnection || !this.peerConnection.remoteDescription) return;
    while (this.iceCandidateQueue.length > 0) {
      const candidate = this.iceCandidateQueue.shift();
      if (candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('Error processing queued ICE candidate:', err);
        }
      }
    }
  }

  private initPeerConnection() {
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
    }

    this.peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.remoteStream = new MediaStream();

    // Attach local media tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
    }

    // Handle remote tracks arrival
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
      } else if (event.track) {
        this.remoteStream?.addTrack(event.track);
      }
      this.notifyStreams();
      if (
        this.currentCallState === 'connecting' ||
        this.currentCallState === 'outgoing_calling' ||
        this.currentCallState === 'incoming_ringing'
      ) {
        this.transitionToConnected();
      }
    };

    // Handle local ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentPartnerId) {
        this.sendSignal({
          type: 'call_signal',
          signal: 'ice_candidate',
          senderId: this.currentUserId || '',
          targetUserId: this.currentPartnerId,
          callType: this.currentCallType,
          payload: { candidate: event.candidate }
        });
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState;
      if (state === 'connected' || state === 'completed') {
        if (
          this.currentCallState === 'connecting' ||
          this.currentCallState === 'outgoing_calling' ||
          this.currentCallState === 'incoming_ringing'
        ) {
          this.transitionToConnected();
        }
      }
      if (state === 'disconnected') {
        // Attempt immediate ICE restart on network transition (WiFi <-> 4G) - Bug #4
        console.warn('[WebRTC] ICE state disconnected, attempting ICE restart...');
        try {
          if (this.peerConnection && typeof this.peerConnection.restartIce === 'function') {
            this.peerConnection.restartIce();
            if (this.isInitiator && this.currentCallState === 'connected' && this.peerConnection.signalingState === 'stable') {
              this.peerConnection.createOffer({
                iceRestart: true,
                offerToReceiveAudio: true,
                offerToReceiveVideo: this.currentCallType === 'video'
              }).then(async (offer) => {
                if (this.peerConnection) {
                  await this.peerConnection.setLocalDescription(offer);
                  this.sendSignal({
                    type: 'call_signal',
                    signal: 'sdp_offer',
                    senderId: this.currentUserId || '',
                    targetUserId: this.currentPartnerId || '',
                    callType: this.currentCallType,
                    payload: { sdp: offer, isIceRestart: true }
                  });
                }
              }).catch(e => {
                console.warn('[WebRTC] restartIce offer error:', e);
              });
            }
          }
        } catch (e) {
          console.warn('[WebRTC] restartIce error:', e);
        }
      }
      if (state === 'disconnected' || state === 'failed') {
        if (!this.iceDisconnectTimer) {
          this.iceDisconnectTimer = setTimeout(() => {
            const curState = this.peerConnection?.iceConnectionState;
            if (curState === 'disconnected' || curState === 'failed') {
              console.warn('[WebRTC] Network connection lost permanently, ending call.');
              this.endCall('connection_lost');
            }
          }, 4500);
        }
      } else if (state === 'connected' || state === 'completed') {
        if (this.iceDisconnectTimer) {
          clearTimeout(this.iceDisconnectTimer);
          this.iceDisconnectTimer = null;
        }
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      if (state === 'connected') {
        if (
          this.currentCallState === 'connecting' ||
          this.currentCallState === 'outgoing_calling' ||
          this.currentCallState === 'incoming_ringing'
        ) {
          this.transitionToConnected();
        }
      } else if (state === 'failed' || state === 'closed') {
        this.endCall('connection_lost');
      }
    };
  }

  // --- In-Call Controls ---
  public toggleMute(): boolean {
    if (!this.localStream) return this.isMuted;
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach(track => {
      track.enabled = !this.isMuted;
    });

    // Notify partner in real-time so they receive visual feedback
    if (this.currentPartnerId && this.currentCallState === 'connected') {
      this.sendSignal({
        type: 'call_signal',
        signal: 'partner_audio_toggle',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId,
        callType: this.currentCallType,
        payload: { isMuted: this.isMuted }
      });
    }

    this.notifyStreams();
    return this.isMuted;
  }

  public async toggleVideo(): Promise<boolean> {
    this.isVideoEnabled = !this.isVideoEnabled;

    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = this.isVideoEnabled;
        });
      } else if (this.isVideoEnabled && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        // Upgrade from audio to video dynamically
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: this.isFrontCamera ? 'user' : 'environment',
              width: { ideal: 640 },
              height: { ideal: 480 }
            },
            audio: false
          });
          const newTrack = videoStream.getVideoTracks()[0];
          if (newTrack) {
            this.localStream.addTrack(newTrack);
            if (this.peerConnection) {
              this.peerConnection.addTrack(newTrack, this.localStream);
              // Perfect renegotiation offer for dynamic audio->video upgrade (Bug #10 Glare Guard)
              if (this.currentPartnerId && this.currentCallState === 'connected' && this.peerConnection.signalingState === 'stable') {
                try {
                  this.currentCallType = 'video';
                  const offer = await this.peerConnection.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                  });
                  await this.peerConnection.setLocalDescription(offer);
                  this.sendSignal({
                    type: 'call_signal',
                    signal: 'sdp_offer',
                    senderId: this.currentUserId || '',
                    targetUserId: this.currentPartnerId,
                    callType: 'video',
                    payload: { sdp: offer }
                  });
                } catch (renegErr) {
                  console.warn('Dynamic video renegotiation notice:', renegErr);
                }
              }
            }
          }
        } catch (err) {
          console.warn('Dynamic video track request failed:', err);
          this.isVideoEnabled = false;
        }
      }
    }

    // Broadcast video toggle state to call partner
    if (this.currentPartnerId && this.currentCallState === 'connected') {
      this.sendSignal({
        type: 'call_signal',
        signal: 'video_toggle',
        senderId: this.currentUserId || '',
        targetUserId: this.currentPartnerId,
        callType: this.currentCallType,
        payload: { isVideoEnabled: this.isVideoEnabled }
      });
    }

    this.notifyStreams();
    return this.isVideoEnabled;
  }

  public getIsFrontCamera(): boolean {
    return this.isFrontCamera;
  }

  public async switchCamera(): Promise<boolean> {
    if (!this.isVideoEnabled) return this.isFrontCamera;

    const targetFacingMode = this.isFrontCamera ? 'environment' : 'user';

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        // Android Camera2 Hardware Lock Fix:
        // Must stop existing video track FIRST to release hardware sensor lock on Android
        const oldVideo = this.localStream?.getVideoTracks()[0];
        if (oldVideo) {
          try {
            oldVideo.stop();
            if (this.localStream) {
              this.localStream.removeTrack(oldVideo);
            }
          } catch (stopErr) {
            console.warn('[WebRTC] Stopping old video track notice:', stopErr);
          }
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacingMode },
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });

        const newVideoTrack = newStream.getVideoTracks()[0];
        if (newVideoTrack) {
          this.isFrontCamera = !this.isFrontCamera;
          if (this.localStream) {
            this.localStream.addTrack(newVideoTrack);
          }

          // Swap track on WebRTC sender if active
          if (this.peerConnection) {
            const videoSender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(newVideoTrack);
            }
          }
          this.notifyStreams();
          return this.isFrontCamera;
        }
      }
    } catch (err) {
      console.warn('[WebRTC] Switch camera notice, attempting recovery:', err);
      // Fallback/recovery: restore front/previous camera if environment camera unavailable
      try {
        const recoveryStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: this.isFrontCamera ? 'user' : 'environment' },
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
        const recTrack = recoveryStream.getVideoTracks()[0];
        if (recTrack && this.localStream) {
          this.localStream.addTrack(recTrack);
          if (this.peerConnection) {
            const videoSender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(recTrack);
            }
          }
          this.notifyStreams();
        }
      } catch (recErr) {
        console.error('[WebRTC] Camera recovery failed:', recErr);
      }
    }
    return this.isFrontCamera;
  }

  private sendSignal(payload: CallSignalPayload) {
    let sentViaWs = false;

    // 1. Direct real-time WebSocket delivery over dedicated call room (Bug #2)
    if (this.callWs && this.callWs.readyState === WebSocket.OPEN) {
      try {
        this.callWs.send(JSON.stringify(payload));
        sentViaWs = true;
      } catch (err) {
        console.warn('Failed to send call signal via dedicated callWs:', err);
      }
    }

    // 2. Supplementary delivery via external signalSender if provided
    if (!sentViaWs && this.signalSender) {
      try {
        this.signalSender(payload);
        sentViaWs = true;
      } catch (err) {
        console.error('Failed to send call signal via socket:', err);
      }
    }

    // 3. Guaranteed secondary HTTP relay through Cloudflare Durable Object broadcast
    const partnerId = payload.targetUserId || this.currentPartnerId;
    const currentId = payload.senderId || this.currentUserId;
    if (currentId && partnerId) {
      // If ICE candidate was already sent via live WebSocket, avoid duplicate HTTP relay flood
      if (payload.signal === 'ice_candidate' && sentViaWs) {
        return;
      }
      const convId = `conv_${[currentId, partnerId].sort().join('_')}`;
      try {
        fetch(`${API_BASE}/conversations/call/signal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: convId, payload })
        }).catch(() => {});
      } catch {}
    }
  }

  private triggerCallHistoryLog(reason: string = 'ended') {
    if (this.hasLoggedCall) return;
    this.hasLoggedCall = true;

    const partnerId = this.currentPartnerId;
    const currentId = this.currentUserId;
    if (!partnerId || !currentId) return;

    const conversationId = `conv_${[currentId, partnerId].sort().join('_')}`;
    const isConnected = Boolean(this.callConnectedTime);
    const durationSecs = this.callConnectedTime 
      ? Math.max(1, Math.floor((Date.now() - this.callConnectedTime) / 1000))
      : 0;

    let status: 'completed' | 'missed' | 'declined' = 'missed';
    if (isConnected) {
      status = 'completed';
    } else if (reason.includes('decline') || reason.includes('reject') || reason.includes('busy')) {
      status = 'declined';
    } else {
      status = 'missed';
    }

    // Initiator records the call log into the chat conversation
    if (this.isInitiator) {
      const callerId = currentId;
      const callerName = this.activeCallerInfo?.fullName || 'Member';
      dbService.recordCallMessage(
        conversationId,
        callerId,
        callerName,
        this.currentCallType,
        status,
        durationSecs
      ).catch(err => console.warn('Call message log error:', err));
    }
  }

  private cleanup(reason: string = 'ended') {
    this.stopSignalingPoll();
    this.closeCallWebSocket();
    if (this.connectionFallbackTimer) {
      clearTimeout(this.connectionFallbackTimer);
      this.connectionFallbackTimer = null;
    }
    this.processedSignals.clear();
    if (this.iceDisconnectTimer) {
      clearTimeout(this.iceDisconnectTimer);
      this.iceDisconnectTimer = null;
    }
    this.triggerCallHistoryLog(reason);
    this.stopRingtone();
    if (this.callTimeoutTimer) {
      clearTimeout(this.callTimeoutTimer);
      this.callTimeoutTimer = null;
    }

    if (this.localStream) {
      if (typeof this.localStream.getTracks === 'function') {
        this.localStream.getTracks().forEach(t => t.stop());
      }
      this.localStream = null;
    }

    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.iceCandidateQueue = [];
    this.currentPartnerId = null;
    this.currentPartnerInfo = null;
    this.isMuted = false;
    this.isVideoEnabled = true;
    this.setCallMode(false);
    this.notifyStreams();
    this.callConnectedTime = null;
    // Bug #5 Fix: Do NOT reset hasLoggedCall to false here! It is only reset on new calls.
  }
}

export const webRtcService = new WebRtcService();
