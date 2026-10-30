import React from 'react';
import { Phone, PhoneOff, Video, Crown, MapPin, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { webRtcService, type CallerInfo, type CallType } from '../../services/webRtcService';

interface IncomingCallModalProps {
  caller: CallerInfo | null;
  callType: CallType;
  isOpen: boolean;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  caller,
  callType,
  isOpen
}) => {
  if (!isOpen || !caller) return null;

  const isVideo = callType === 'video';

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#03060E]/98 via-[#070D1D]/95 to-[#020409]/98 backdrop-blur-3xl text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-fade-in font-sans overflow-hidden">
      
      {/* Ambient background aurora glow mesh */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-sky-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Top Header Floating Badge */}
      <div className="relative z-20 w-full text-center pt-6 sm:pt-8 flex flex-col items-center gap-2.5">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white shadow-2xl backdrop-blur-xl">
          {isVideo ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <Video className="w-3.5 h-3.5 text-emerald-300" />
              <span>Incoming HD Video Call</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-300 uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
              </span>
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span>Incoming HD Voice Call</span>
            </div>
          )}
        </div>

        {/* Islamic & Modesty Verified Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Wali & Modesty Protected Connection</span>
          <Lock className="w-2.5 h-2.5 text-emerald-400/80 ml-0.5" />
        </div>
      </div>

      {/* Center Caller Profile HUD */}
      <div className="relative z-20 flex flex-col items-center space-y-6 my-auto">
        <div className="relative">
          {/* Animated Multi-tier Acoustic Ripple Rings */}
          <div className="absolute inset-0 -m-6 sm:-m-8 rounded-full border-2 border-emerald-400/30 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute inset-0 -m-12 sm:-m-16 rounded-full border border-sky-400/25 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 -m-20 sm:-m-24 rounded-full border border-emerald-500/10 pointer-events-none animate-pulse [animation-delay:0.5s]" />

          {/* Caller Avatar Card */}
          <div className="relative w-38 h-38 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-sky-400 shadow-[0_0_60px_rgba(16,185,129,0.35)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
              {caller.photoUrl ? (
                <img
                  src={caller.photoUrl}
                  alt={caller.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl font-serif font-black text-white bg-gradient-to-br from-slate-800 to-slate-950">
                  {caller.fullName?.charAt(0) || 'M'}
                </div>
              )}
            </div>
          </div>

          {/* VIP Badge */}
          {caller.isVip && (
            <div className="absolute -bottom-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-[11px] flex items-center space-x-1 shadow-2xl border border-white/40 animate-pulse">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>VIP</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-900" />
            </div>
          )}
        </div>

        <div className="text-center space-y-2.5 max-w-sm px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-lg">
            {caller.fullName}
          </h2>

          {/* Dynamic Ringing Soundwave Equalizer Visualization */}
          <div className="flex items-center justify-center space-x-1.5 py-1">
            <span className="w-1 h-3.5 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:-0.4s]" />
            <span className="w-1 h-5.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1 h-7.5 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.35s]" />
            <span className="w-1.5 h-9 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.1s]" />
            <span className="w-1.5 h-10 bg-sky-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-9 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-7.5 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.25s]" />
            <span className="w-1 h-5.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.05s]" />
            <span className="w-1 h-3.5 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-300">
            <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{caller.city || 'Pakistan'}</span>
            </span>
            <span className="text-emerald-300 font-semibold flex items-center space-x-1 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Rishta</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls Floating Dock */}
      <div className="relative z-20 w-full max-w-sm mx-auto pb-6 sm:pb-8 space-y-5">
        <div className="flex items-center justify-around px-2">
          {/* Decline Button */}
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              data-testid="decline-call-btn"
              onClick={() => webRtcService.rejectCall('declined')}
              className="w-17 h-17 sm:w-19 sm:h-19 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-92 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 border border-rose-300/40 transition-all cursor-pointer"
              title="Decline Call"
            >
              <PhoneOff className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <span className="text-xs text-rose-200 font-semibold tracking-wide">Decline</span>
          </div>

          {/* Accept with Voice Button */}
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              data-testid="accept-call-btn"
              onClick={() => webRtcService.acceptCall(false)}
              className="w-17 h-17 sm:w-19 sm:h-19 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-92 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/50 border border-emerald-300/50 transition-all cursor-pointer relative group"
              title="Accept Audio Call"
            >
              <span className="absolute inset-0 rounded-full border border-emerald-300/60 animate-ping opacity-40 pointer-events-none" />
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform" />
            </button>
            <span className="text-xs text-emerald-300 font-semibold tracking-wide">Voice</span>
          </div>

          {/* Accept with Video Button (if caller initiated video) */}
          {isVideo && (
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                data-testid="accept-video-call-btn"
                onClick={() => webRtcService.acceptCall(true)}
                className="w-17 h-17 sm:w-19 sm:h-19 rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-400 active:scale-92 text-white flex items-center justify-center shadow-2xl shadow-sky-600/50 border border-sky-300/50 transition-all cursor-pointer relative group"
                title="Accept Video Call"
              >
                <span className="absolute inset-0 rounded-full border border-sky-300/60 animate-ping opacity-40 pointer-events-none" />
                <Video className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              </button>
              <span className="text-xs text-sky-300 font-semibold tracking-wide">Video</span>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <p className="text-[11px] text-center text-slate-400/90 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Bismillah · End-to-End Encrypted Matrimonial Call</span>
        </p>
      </div>
    </div>
  );
};
