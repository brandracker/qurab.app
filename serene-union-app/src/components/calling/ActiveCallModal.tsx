import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw, 
  MapPin, Crown, ShieldCheck, Volume2, VolumeX, Lock, Radio
} from 'lucide-react';
import { webRtcService, type CallState, type CallType, type CallerInfo } from '../../services/webRtcService';

interface ActiveCallModalProps {
  callState: CallState;
  callType: CallType;
  partner: CallerInfo | null;
  isOpen: boolean;
}

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  callState,
  callType,
  partner,
  isOpen
}) => {
  const [durationSecs, setDurationSecs] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(callType === 'video');
  const [isFrontCam, setIsFrontCam] = useState<boolean>(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(callType === 'video');
  const [pipPosition, setPipPosition] = useState<'top-right' | 'top-left' | 'bottom-right'>('top-right');
  const [isRemoteVideoActive, setIsRemoteVideoActive] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const outgoingPreviewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync streams with video and audio elements
  useEffect(() => {
    if (!isOpen) {
      setDurationSecs(0);
      setIsRemoteVideoActive(false);
      return;
    }

    const attachStreams = (localStream: MediaStream | null, remoteStream: MediaStream | null) => {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (outgoingPreviewVideoRef.current && localStream) {
        outgoingPreviewVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }
      if (remoteAudioRef.current && remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(() => {});
      }
      if (remoteStream) {
        const vTracks = remoteStream.getVideoTracks();
        setIsRemoteVideoActive(vTracks.length > 0 && vTracks.some(t => t.enabled));
      } else {
        setIsRemoteVideoActive(false);
      }
    };

    // Immediately attach current streams if already acquired
    attachStreams(webRtcService.getLocalStream(), webRtcService.getRemoteStream());

    const unsubStreams = webRtcService.subscribeStreams((localStream, remoteStream) => {
      attachStreams(localStream, remoteStream);
    });

    return () => {
      unsubStreams();
    };
  }, [isOpen, callState]);

  // Duration counter when connected
  useEffect(() => {
    if (callState !== 'connected') {
      setDurationSecs(0);
      return;
    }

    const timer = setInterval(() => {
      setDurationSecs(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen || !partner) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const nextMuted = webRtcService.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleVideo = async () => {
    const nextVideo = await webRtcService.toggleVideo();
    setIsVideoOn(nextVideo);
  };

  const handleSwitchCamera = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFrontCam(prev => !prev);
    await webRtcService.switchCamera();
    const curLocal = webRtcService.getLocalStream();
    if (localVideoRef.current && curLocal) localVideoRef.current.srcObject = curLocal;
    if (outgoingPreviewVideoRef.current && curLocal) outgoingPreviewVideoRef.current.srcObject = curLocal;
  };

  const handleToggleSpeaker = () => {
    const nextSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(nextSpeakerState);
    webRtcService.setSpeakerphoneOn(nextSpeakerState);
  };

  const cyclePipPosition = () => {
    if (pipPosition === 'top-right') setPipPosition('top-left');
    else if (pipPosition === 'top-left') setPipPosition('bottom-right');
    else setPipPosition('top-right');
  };

  const isOutgoingRinging = callState === 'outgoing_calling';
  const isConnected = callState === 'connected';

  return (
    <div className="fixed inset-0 z-[9999] bg-[#03060E] text-white flex flex-col justify-between overflow-hidden select-none animate-fade-in font-sans">
      
      {/* ----------------- 1. VIDEO CALL: OUTGOING RINGING FULL-SCREEN PREVIEW ----------------- */}
      {callType === 'video' && isOutgoingRinging && (
        <div className="absolute inset-0 bg-black">
          <video
            ref={outgoingPreviewVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror-mode"
            style={{ transform: isFrontCam ? 'scaleX(-1)' : 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/85" />
        </div>
      )}

      {/* Dedicated Global Audio Playback Element for WebRTC audio tracks */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* ----------------- 2. VIDEO CALL: CONNECTED REMOTE STREAM ----------------- */}
      {callType === 'video' && isConnected && (
        <div className="absolute inset-0 bg-[#03060E] flex items-center justify-center overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/15 blur-[110px] pointer-events-none" />

          {/* Actual Remote Video Feed */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onPlaying={() => setIsRemoteVideoActive(true)}
            onPause={() => setIsRemoteVideoActive(false)}
            onEnded={() => setIsRemoteVideoActive(false)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isRemoteVideoActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Luxury Video Stream Connecting / Paused State Placeholder */}
          {!isRemoteVideoActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-6 z-10 animate-fade-in select-none">
              <div className="relative">
                <div className="absolute inset-0 -m-8 rounded-full border-2 border-emerald-400/30 animate-ping opacity-50" />
                <div className="absolute inset-0 -m-16 rounded-full border border-sky-400/20 animate-pulse" />

                <div className="w-38 h-38 sm:w-46 sm:h-46 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-sky-400 shadow-[0_0_60px_rgba(16,185,129,0.35)] relative">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    {partner.photoUrl ? (
                      <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-serif text-white bg-gradient-to-tr from-slate-900 to-slate-800">
                        {partner.fullName?.charAt(0) || 'M'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
                  {partner.fullName}
                </h3>
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300 font-semibold tracking-wide">Optimizing encrypted HD video stream...</span>
                </div>
              </div>
            </div>
          )}

          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
        </div>
      )}

      {/* ----------------- 3. AUDIO CALL BACKGROUND (Deep Cosmos Aurora) ----------------- */}
      {callType === 'audio' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060E] via-[#070E20] to-[#02050B]">
          <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-sky-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
        </div>
      )}

      {/* ----------------- TOP FLOATING ISLAND BAR ----------------- */}
      <div className="relative z-30 pt-8 sm:pt-10 px-5 sm:px-6 flex items-center justify-between gap-3">
        {/* Partner Information Capsule */}
        <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-2xl border border-white/15 px-3.5 py-1.5 rounded-full shadow-2xl min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400/50 bg-slate-800 shrink-0">
            {partner.photoUrl ? (
              <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-slate-700">
                {partner.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>
          <div className="min-w-0 pr-1">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[160px]">{partner.fullName}</span>
              {partner.isVip && <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <div className="text-[10px] text-slate-300 flex items-center space-x-1">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="truncate">{partner.city || 'Pakistan'}</span>
            </div>
          </div>
        </div>

        {/* Live Call Duration & P2P Security Chip */}
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/15 text-xs font-mono font-bold tracking-wider shadow-2xl flex items-center space-x-2 shrink-0">
          {isOutgoingRinging ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 font-sans text-xs font-semibold">Ringing...</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-emerald-300">{formatDuration(durationSecs)}</span>
              <Lock className="w-3 h-3 text-emerald-400/80 ml-1" />
            </>
          )}
        </div>
      </div>

      {/* ----------------- CENTER HUD: AUDIO CALL OR OUTGOING RINGING HUD ----------------- */}
      {(callType === 'audio' || (callType === 'video' && isOutgoingRinging)) && (
        <div className="relative z-20 flex flex-col items-center justify-center my-auto space-y-6">
          <div className="relative">
            {/* Concentric Sonic Rings */}
            {isOutgoingRinging ? (
              <>
                <div className="absolute inset-0 -m-8 rounded-full border-2 border-sky-400/30 animate-ping opacity-60" />
                <div className="absolute inset-0 -m-16 rounded-full border border-sky-400/20 animate-pulse" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 -m-8 rounded-full border border-emerald-400/25 animate-pulse" />
                <div className="absolute inset-0 -m-14 rounded-full border border-teal-400/15 animate-pulse [animation-delay:0.5s]" />
              </>
            )}

            {/* Main Avatar Centerpiece */}
            <div className="w-38 h-38 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-sky-400 shadow-[0_0_60px_rgba(16,185,129,0.35)] relative">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                {partner.photoUrl ? (
                  <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl font-serif text-white bg-gradient-to-tr from-slate-900 to-slate-800">
                    {partner.fullName?.charAt(0) || 'M'}
                  </div>
                )}
              </div>
            </div>

            {partner.isVip && (
              <div className="absolute -bottom-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] flex items-center space-x-1 shadow-xl border border-white/40">
                <Crown className="w-3 h-3 fill-slate-950" />
                <span>VIP</span>
              </div>
            )}
          </div>

          <div className="text-center space-y-2 px-4 max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight drop-shadow-lg">
              {partner.fullName}
            </h2>

            {/* Audio Wave Sound Spectrum Equalizer (Connected Audio Call) */}
            {callType === 'audio' && isConnected && (
              <div className="flex items-center justify-center space-x-1.5 pt-2">
                <span className="w-1 h-3 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:-0.4s]" />
                <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-8 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-10 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="w-1.5 h-7 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.35s]" />
                <span className="w-1 h-9 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.1s]" />
                <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.25s]" />
                <span className="w-1 h-3 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:-0.05s]" />
              </div>
            )}

            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-300/90 flex items-center justify-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isOutgoingRinging 
                    ? 'Connecting peer-to-peer call...' 
                    : 'Encrypted Halal Matrimony Call'}
                </span>
              </span>
            </div>

            {callType === 'audio' && isConnected && (
              <div className="text-[11px] text-emerald-300/90 font-medium flex items-center justify-center gap-1.5 pt-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Opus 48kHz HD Audio Active</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- PICTURE-IN-PICTURE (PIP) LOCAL VIDEO WINDOW ----------------- */}
      {callType === 'video' && isConnected && (
        <div 
          onClick={cyclePipPosition}
          className={`absolute z-30 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-900 cursor-pointer transition-all duration-300 group ${
            pipPosition === 'top-right' ? 'top-22 right-4' :
            pipPosition === 'top-left' ? 'top-22 left-4' : 'bottom-32 right-4'
          }`}
          title="Tap to reposition preview"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoOn ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: isFrontCam ? 'scaleX(-1)' : 'none' }}
          />

          {!isVideoOn && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center select-none">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mb-1 shadow-inner">
                <VideoOff className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium">Camera Off</span>
            </div>
          )}

          {/* Quick Flip Camera Button right on PiP */}
          <button
            type="button"
            onClick={handleSwitchCamera}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:rotate-180"
            title="Flip Camera"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] text-white font-semibold backdrop-blur-xs flex items-center gap-1 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>You</span>
          </div>
        </div>
      )}

      {/* ----------------- CALL ENDED OVERLAY ----------------- */}
      {callState === 'ended' && (
        <div 
          data-testid="call-ended-overlay"
          className="absolute inset-0 z-50 bg-[#03060E]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 space-y-4 animate-fade-in select-none"
        >
          <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_50px_rgba(244,63,94,0.35)]">
            <PhoneOff className="w-9 h-9" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-extrabold text-white font-serif">Call Ended</h3>
            <p className="text-xs text-slate-300 font-mono">
              {durationSecs > 0 ? `Duration: ${formatDuration(durationSecs)}` : 'Call Disconnected'}
            </p>
          </div>
        </div>
      )}

      {/* ----------------- BOTTOM FLOATING LUXURY CONTROL DOCK ----------------- */}
      <div className="relative z-30 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-xs sm:max-w-sm mx-auto p-3.5 rounded-full bg-[#050914]/85 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center justify-between px-4 sm:px-5">
          {/* 1. Mic Mute / Unmute */}
          <button
            type="button"
            data-testid="mute-btn"
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isMuted 
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-500/25' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* 2. Speakerphone Toggle */}
          <button
            type="button"
            data-testid="speaker-btn"
            onClick={handleToggleSpeaker}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isSpeakerOn 
                ? 'bg-sky-500/25 text-sky-300 border border-sky-400/50 shadow-lg shadow-sky-500/25' 
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
            }`}
            title={isSpeakerOn ? 'Speakerphone Active' : 'Earpiece Mode'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* 3. Switch Camera (Video Call Only) */}
          {callType === 'video' && (
            <button
              type="button"
              data-testid="switch-cam-btn"
              onClick={handleSwitchCamera}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
              title={isFrontCam ? 'Switch to Rear Camera' : 'Switch to Front Camera'}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          {/* 4. Video Camera Toggle (Video Call Only) */}
          {callType === 'video' && (
            <button
              type="button"
              data-testid="toggle-video-btn"
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                !isVideoOn 
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-500/25' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          )}

          {/* 5. End Call Button (Big Glowing Ruby Red Circle) */}
          <button
            type="button"
            data-testid="end-call-btn"
            onClick={() => webRtcService.endCall('user_hung_up')}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-90 text-white flex items-center justify-center shadow-2xl shadow-rose-600/60 transition-all cursor-pointer border border-rose-300/50"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[10px] sm:text-[11px] text-center text-slate-400/80 mt-3 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Qurb Matrimony · 100% Peer-to-Peer Encrypted Calling</span>
        </p>
      </div>
    </div>
  );
};
