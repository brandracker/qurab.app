import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw, 
  MapPin, Crown, ShieldCheck 
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

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync streams with video elements
  useEffect(() => {
    if (!isOpen) {
      setDurationSecs(0);
      return;
    }

    const unsubStreams = webRtcService.subscribeStreams((localStream, remoteStream) => {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    return () => {
      unsubStreams();
    };
  }, [isOpen]);

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
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0F1D] text-white flex flex-col justify-between overflow-hidden select-none animate-fade-in">
      {/* Background Remote Video (If video call and connected) */}
      {callType === 'video' && callState === 'connected' ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        /* Subtle Gradient Background for Audio / Ringing */
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#04070D]" />
      )}

      {/* Top Header Overlay */}
      <div className="relative z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-slate-800">
            {partner.photoUrl ? (
              <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-slate-700">
                {partner.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-sm sm:text-base">{partner.fullName}</span>
              {partner.isVip && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
            </div>
            <div className="text-[11px] text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{partner.city || 'Pakistan'}</span>
            </div>
          </div>
        </div>

        {/* Call Status / Timer */}
        <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono font-semibold tracking-wider">
          {callState === 'outgoing_calling' ? (
            <span className="text-amber-400 animate-pulse">Ringing...</span>
          ) : (
            <span className="text-emerald-400">{formatDuration(durationSecs)}</span>
          )}
        </div>
      </div>

      {/* Center Display (When in Audio call or Outgoing Ringing) */}
      {(callType === 'audio' || callState === 'outgoing_calling') && (
        <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-6">
          <div className="relative">
            {callState === 'outgoing_calling' && (
              <div className="absolute inset-0 -m-4 rounded-full bg-sky-500/20 animate-ping opacity-60" />
            )}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-900">
              {partner.photoUrl ? (
                <img src={partner.photoUrl} alt={partner.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-serif text-white bg-slate-800">
                  {partner.fullName?.charAt(0) || 'M'}
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {partner.fullName}
            </h2>
            <p className="text-xs text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Peer-to-Peer Matrimony Call</span>
            </p>
          </div>
        </div>
      )}

      {/* Picture-in-Picture Local Video Preview (Draggable/Corner) */}
      {callType === 'video' && (
        <div className="absolute top-20 right-4 z-20 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-900">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoOn && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-[10px] text-slate-400">
              <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
              <span>Camera Off</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="relative z-20 pb-8 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-md mx-auto flex items-center justify-center space-x-4 sm:space-x-6">
          {/* Mute Toggle Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Video Toggle Button (If Video Call) */}
          {callType === 'video' && (
            <button
              type="button"
              onClick={handleToggleVideo}
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                !isVideoOn 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          )}

          {/* Flip Camera Button (If Video Call) */}
          {callType === 'video' && (
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
              title={isFrontCam ? "Switch to Rear Camera" : "Switch to Front Camera"}
            >
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* End Call Button (Big Red) */}
          <button
            type="button"
            onClick={() => webRtcService.endCall('user_hung_up')}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-4">
          Qurb Halal Matrimony · Secure P2P Audio & Video
        </p>
      </div>
    </div>
  );
};
