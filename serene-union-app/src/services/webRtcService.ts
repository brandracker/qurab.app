// Qurb (Serene Union) — Production WebRTC Calling Engine
// Handles P2P Audio/Video negotiation, ICE traversal, media tracks, and acoustic feedback.

import { API_BASE } from './apiConfig';

declare global {
  interface Window {
    AndroidAudioBridge?: {
      setCallMode: (inCall: boolean) => void;
      setSpeakerphoneOn: (on: boolean) => void;
      isSpeakerphoneOn: () => boolean;
    };
  }
}

export type CallState = 'idle' | 'outgoing_calling' | 'incoming_ringing' | 'connected' | 'ended';
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
  signal: 'initiate' | 'ringing' | 'accept' | 'reject' | 'sdp_offer' | 'sdp_answer' | 'ice_candidate' | 'end';
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
  // OpenRelay Public STUN & TURN (Metered WebRTC Project for Symmetric NAT / 4G Mobile Data)
  { urls: 'stun:stun.relay.metered.ca:80' },
  {
    urls: 'turn:standard.relay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:standard.relay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:standard.relay.metered.ca:443?transport=tcp',
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

  private audioCtx: AudioContext | null = null;
  private ringToneInterval: any = null;
  private callTimeoutTimer: any = null;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  public init(currentUserId: string, sendSignalFn: (payload: CallSignalPayload) => void) {
    this.currentUserId = currentUserId;
    this.signalSender = sendSignalFn;
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

  // --- Step 1: Start an Outgoing Call (Initiator / Caller) ---
  public async startCall(partnerId: string, partnerInfo: CallerInfo, callType: CallType, currentUserInfo: CallerInfo) {
    if (this.currentCallState !== 'idle') {
      if (this.currentCallState === 'ended') {
        this.cleanup();
      } else {
        return;
      }
    }

    this.currentPartnerId = partnerId;
    this.currentPartnerInfo = partnerInfo;
    this.currentCallType = callType;
    this.isMuted = false;
    this.isVideoEnabled = callType === 'video';
    this.isFrontCamera = true;

    // WhatsApp-Style: Immediately open camera preview before & during ringing!
    if (callType === 'video') {
      await this.setupLocalMedia(true);
    } else {
      await this.setupLocalMedia(false);
    }

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
      }).catch(err => {
        console.warn('Call initiate push notification notice:', err);
      });
    } catch {}
  }

  // --- Step 2: Handle Incoming Signals from Partner ---
  public async handleIncomingSignal(payload: CallSignalPayload) {
    if (!this.currentUserId) return;
    if (payload.senderId === this.currentUserId) return;

    switch (payload.signal) {
      case 'initiate': {
        // If already in a call, send busy signal
        if (this.currentCallState !== 'idle') {
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

        this.currentPartnerId = payload.senderId;
        this.currentPartnerInfo = payload.callerInfo || {
          id: payload.senderId,
          fullName: 'Match Candidate',
          gender: 'female',
          city: 'Global'
        };
        this.currentCallType = payload.callType;
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
        if (this.currentCallState === 'outgoing_calling') {
          this.notifyState('outgoing_calling', { status: 'ringing' });
        }
        break;
      }

      case 'accept': {
        // Receiver accepted the call! Caller proceeds to create WebRTC Offer
        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
        this.playTone(523, 784, 0.25); // Happy connect tone

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
        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
        this.playTone(400, 200, 0.4); // Descending reject tone
        const reason = payload.payload?.reason || 'declined';
        this.cleanup();
        this.notifyState('ended', { reason });
        setTimeout(() => this.notifyState('idle'), 2500);
        break;
      }

      case 'sdp_offer': {
        // Receiver receives SDP offer from Caller
        if (payload.payload?.sdp) {
          await this.handleRemoteOffer(payload.payload.sdp);
        }
        break;
      }

      case 'sdp_answer': {
        // Caller receives SDP answer from Receiver
        if (this.peerConnection && payload.payload?.sdp) {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.payload.sdp));
          await this.processPendingIceCandidates();
        }
        break;
      }

      case 'ice_candidate': {
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
        this.stopRingtone();
        if (this.callTimeoutTimer) clearTimeout(this.callTimeoutTimer);
        this.playTone(500, 250, 0.3);
        this.cleanup();
        this.notifyState('ended', { reason: 'call_ended_by_partner' });
        setTimeout(() => this.notifyState('idle'), 2500);
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

    this.notifyState('connected', { partner: this.currentPartnerInfo, callType: this.currentCallType });
    this.playTone(523, 784, 0.25);

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
    this.cleanup();
    this.notifyState('ended', { reason });
    setTimeout(() => this.notifyState('idle'), 1500);
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
    this.cleanup();
    this.notifyState('ended', { reason });
    setTimeout(() => this.notifyState('idle'), 2000);
  }

  // --- Media Setup & WebRTC Negotiation ---
  private async setupLocalMedia(video: boolean): Promise<MediaStream | null> {
    try {
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

      this.notifyState('connected', { partner: this.currentPartnerInfo, callType: this.currentCallType });
    } catch (err) {
      console.error('Error creating SDP offer:', err);
    }
  }

  private async handleRemoteOffer(sdp: RTCSessionDescriptionInit) {
    // Safety check: ensure localStream is acquired before initPeerConnection attaches tracks
    if (!this.localStream) {
      await this.setupLocalMedia(this.currentCallType === 'video');
    }

    this.initPeerConnection();
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

      this.notifyState('connected', { partner: this.currentPartnerInfo, callType: this.currentCallType });
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
      if (this.peerConnection?.iceConnectionState === 'disconnected' || 
          this.peerConnection?.iceConnectionState === 'failed') {
        // Graceful handle network drop
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
    this.notifyStreams();
    return this.isMuted;
  }

  public toggleVideo(): boolean {
    if (!this.localStream) return this.isVideoEnabled;
    this.isVideoEnabled = !this.isVideoEnabled;
    this.localStream.getVideoTracks().forEach(track => {
      track.enabled = this.isVideoEnabled;
    });
    this.notifyStreams();
    return this.isVideoEnabled;
  }

  public async switchCamera(): Promise<void> {
    if (!this.localStream) return;
    this.isFrontCamera = !this.isFrontCamera;
    await this.setupLocalMedia(this.isVideoEnabled);
    if (this.peerConnection && this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const sender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }
    }
  }

  private sendSignal(payload: CallSignalPayload) {
    if (this.signalSender) {
      try {
        this.signalSender(payload);
      } catch (err) {
        console.error('Failed to send call signal:', err);
      }
    }
  }

  private cleanup() {
    this.stopRingtone();
    if (this.callTimeoutTimer) {
      clearTimeout(this.callTimeoutTimer);
      this.callTimeoutTimer = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
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
  }
}

export const webRtcService = new WebRtcService();
