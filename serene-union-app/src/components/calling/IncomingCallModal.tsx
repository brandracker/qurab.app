import React from 'react';
import { Phone, PhoneOff, Video, Crown, MapPin, ShieldCheck } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[9999] bg-[#070B14]/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-fade-in font-sans overflow-hidden">
      
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-20 w-full text-center pt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white shadow-lg backdrop-blur-xl">
          {callType === 'video' ? (
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Incoming Video Call</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-sky-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Incoming Voice Call</span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-300 mt-2 font-medium flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Halal Matrimony Verified Connection</span>
        </p>
      </div>

      {/* Center Caller Profile HUD */}
      <div className="relative z-20 flex flex-col items-center space-y-6 my-auto">
        <div className="relative">
          {/* Animated concentric acoustic rings */}
          <div className="absolute inset-0 -m-8 rounded-full border-2 border-emerald-500/30 animate-ping opacity-60" />
          <div className="absolute inset-0 -m-16 rounded-full border border-sky-400/20 animate-pulse" />

          {/* Caller Avatar Card */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-slate-900">
            {caller.photoUrl ? (
              <img
                src={caller.photoUrl}
                alt={caller.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-serif font-bold text-white bg-gradient-to-br from-slate-800 to-slate-950">
                {caller.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>

          {/* VIP Badge */}
          {caller.isVip && (
            <div className="absolute -bottom-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] flex items-center space-x-1 shadow-xl border border-white/30">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>VIP</span>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
            {caller.fullName}
          </h2>
          <div className="flex items-center justify-center space-x-3 text-xs text-slate-300">
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{caller.city || 'Pakistan'}</span>
            </span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Rishta</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls Floating Dock */}
      <div className="relative z-20 w-full max-w-sm mx-auto pb-8 space-y-5">
        <div className="flex items-center justify-around px-4">
          {/* Decline Button */}
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              onClick={() => webRtcService.rejectCall('declined')}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 border border-rose-400/30 transition-all cursor-pointer"
              title="Decline"
            >
              <PhoneOff className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <span className="text-xs text-slate-300 font-medium tracking-wide">Decline</span>
          </div>

          {/* Accept with Voice Button */}
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              onClick={() => webRtcService.acceptCall(false)}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 border border-emerald-400/30 transition-all cursor-pointer"
              title="Accept Audio"
            >
              <Phone className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <span className="text-xs text-emerald-300 font-medium tracking-wide">Voice</span>
          </div>

          {/* Accept with Video Button (if caller initiated video) */}
          {callType === 'video' && (
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={() => webRtcService.acceptCall(true)}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-400 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-sky-600/40 border border-sky-400/30 transition-all cursor-pointer"
                title="Accept Video"
              >
                <Video className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
              <span className="text-xs text-sky-300 font-medium tracking-wide">Video</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-center text-slate-400">
          Islamic Matrimony: Secure peer-to-peer audio & video call
        </p>
      </div>
    </div>
  );
};
