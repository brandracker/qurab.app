import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw, 
  MapPin, Crown, ShieldCheck, Volume2, VolumeX 
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
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [pipPosition, setPipPosition] = useState<'top-right' | 'top-left' | 'bottom-right'>('top-right');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const outgoingPreviewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync streams with video elements
  useEffect(() => {
    if (!isOpen) {
      setDurationSecs(0);
      return;
    }

    // Immediately attach current streams if already acquired
    const curLocal = webRtcService.getLocalStream();
    const curRemote = webRtcService.getRemoteStream();

    if (localVideoRef.current && curLocal) {
      localVideoRef.current.srcObject = curLocal;
    }
    if (outgoingPreviewVideoRef.current && curLocal) {
      outgoingPreviewVideoRef.current.srcObject = curLocal;
    }
    if (remoteVideoRef.current && curRemote) {
      remoteVideoRef.current.srcObject = curRemote;
    }

    const unsubStreams = webRtcService.subscribeStreams((localStream, remoteStream) => {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (outgoingPreviewVideoRef.current && localStream) {
        outgoingPreviewVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
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

  const handleToggleVideo = () => {
    const nextVideo = webRtcService.toggleVideo();
    setIsVideoOn(nextVideo);
  };

  const handleSwitchCamera = async () => {
    setIsFrontCam(prev => !prev);
    await webRtcService.switchCamera();
    // Re-attach local stream to video refs
    const curLocal = webRtcService.getLocalStream();
    if (localVideoRef.current && curLocal) localVideoRef.current.srcObject = curLocal;
    if (outgoingPreviewVideoRef.current && curLocal) outgoingPreviewVideoRef.current.srcObject = curLocal;
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  const cyclePipPosition = () => {
    if (pipPosition === 'top-right') setPipPosition('top-left');
    else if (pipPosition === 'top-left') setPipPosition('bottom-right');
    else setPipPosition('top-right');
  };

  const isOutgoingRinging = callState === 'outgoing_calling';
  const isConnected = callState === 'connected';

  return (
    <div className="fixed inset-0 z-[9999] bg-[#070B14] text-white flex flex-col justify-between overflow-hidden select-none animate-fade-in font-sans">
      
      {/* ----------------- 1. VIDEO CALL: OUTGOING RINGING (WhatsApp Style Full Screen Camera Preview) ----------------- */}
      {callType === 'video' && isOutgoingRinging && (
        <div className="absolute inset-0 bg-black">
          {/* Full Screen Live Front Camera Preview */}
          <video
            ref={outgoingPreviewVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror-mode"
            style={{ transform: isFrontCam ? 'scaleX(-1)' : 'none' }}
          />
          {/* Dark Overlay Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        </div>
      )}

      {/* ----------------- 2. VIDEO CALL: CONNECTED REMOTE VIDEO ----------------- */}
      {callType === 'video' && isConnected && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />
        </div>
      )}

      {/* ----------------- 3. AUDIO CALL BACKGROUND (Deep Ambient Glow) ----------------- */}
      {callType === 'audio' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#060A13] via-[#0D1527] to-[#04070E]">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
        </div>
      )}

      {/* ----------------- TOP HEADER BAR ----------------- */}
      <div className="relative z-30 pt-10 px-6 flex items-center justify-between">
        {/* Partner Information Pill */}
        <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-full shadow-lg">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-slate-800 shrink-0">
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
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-[130px]">{partner.fullName}</span>
              {partner.isVip && <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <div className="text-[10px] text-slate-300 flex items-center space-x-1">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="truncate">{partner.city || 'Pakistan'}</span>
            </div>
          </div>
        </div>

        {/* Live Call Duration / Status Chip */}
        <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-mono font-bold tracking-wider shadow-lg flex items-center space-x-1.5">
          {isOutgoingRinging ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1" />
              <span className="text-amber-300 font-sans text-xs">Ringing...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
              <span className="text-emerald-300">{formatDuration(durationSecs)}</span>
            </>
          )}
        </div>
      </div>

      {/* ----------------- CENTER HUD: AUDIO CALL OR OUTGOING CALLING AVATAR ----------------- */}
      {(callType === 'audio' || (callType === 'video' && isOutgoingRinging)) && (
        <div className="relative z-20 flex flex-col items-center justify-center my-auto space-y-6">
          <div className="relative">
            {/* Pulsing Concentric Radar Rings */}
            {isOutgoingRinging && (
              <>
                <div className="absolute inset-0 -m-6 rounded-full border border-sky-400/30 animate-ping opacity-50" />
                <div className="absolute inset-0 -m-12 rounded-full border border-sky-400/15 animate-pulse" />
              </>
            )}

            {/* Main Avatar Centerpiece */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-900 relative">
              {partner.photoUrl ? (
                <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-serif text-white bg-gradient-to-tr from-slate-900 to-slate-800">
                  {partner.fullName?.charAt(0) || 'M'}
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-1.5 px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
              {partner.fullName}
            </h2>

            {/* Audio wave animation bars */}
            {callType === 'audio' && isConnected && (
              <div className="flex items-center justify-center space-x-1.5 pt-1">
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.25s]" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
              </div>
            )}

            <p className="text-xs text-slate-300/90 flex items-center justify-center space-x-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {isOutgoingRinging 
                  ? 'Initiating peer-to-peer connection...' 
                  : 'Encrypted Halal Matrimony Call'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ----------------- CORNER PICTURE-IN-PICTURE (PIP) LOCAL VIDEO (When Connected in Video Call) ----------------- */}
      {callType === 'video' && isConnected && (
        <div 
          onClick={cyclePipPosition}
          className={`absolute z-30 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-900 cursor-pointer transition-all duration-300 ${
            pipPosition === 'top-right' ? 'top-24 right-4' :
            pipPosition === 'top-left' ? 'top-24 left-4' : 'bottom-32 right-4'
          }`}
          title="Tap to move preview"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: isFrontCam ? 'scaleX(-1)' : 'none' }}
          />
          {!isVideoOn && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-[10px] text-slate-400">
              <VideoOff className="w-5 h-5 mb-1 text-rose-400" />
              <span>Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] text-white/80 font-semibold backdrop-blur-xs">
            You
          </div>
        </div>
      )}

      {/* ----------------- BOTTOM FLOATING CONTROL DOCK ----------------- */}
      <div className="relative z-30 pb-10 px-6">
        <div className="max-w-xs sm:max-w-sm mx-auto p-3 rounded-full bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-between px-5">
          {/* 1. Mute Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isMuted 
                ? 'bg-rose-500/25 text-rose-400 border border-rose-500/50 shadow-lg shadow-rose-500/20' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* 2. Speaker Output Toggle */}
          <button
            type="button"
            onClick={handleToggleSpeaker}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isSpeakerOn 
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
                : 'bg-white/10 hover:bg-white/20 text-slate-400 border border-white/10'
            }`}
            title={isSpeakerOn ? 'Speakerphone On' : 'Earpiece Mode'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* 3. Flip Camera Button (Video Call Only) */}
          {callType === 'video' && (
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
              title={isFrontCam ? 'Switch to Rear Camera' : 'Switch to Front Camera'}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          {/* 4. Video Camera Toggle (Video Call Only) */}
          {callType === 'video' && (
            <button
              type="button"
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                !isVideoOn 
                  ? 'bg-rose-500/25 text-rose-400 border border-rose-500/50 shadow-lg shadow-rose-500/20' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          )}

          {/* 5. End Call Button (Big Red Floating Circle) */}
          <button
            type="button"
            onClick={() => webRtcService.endCall('user_hung_up')}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 transition-all cursor-pointer border border-rose-400/40"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400/70 mt-3 font-medium">
          Qurb Matrimony · 100% Peer-to-Peer Encrypted Calling
        </p>
      </div>
    </div>
  );
};
