import React from 'react';
import { Phone, PhoneOff, Video, Crown, MapPin, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-10 select-none animate-fade-in">
      {/* Top Header */}
      <div className="w-full text-center pt-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold uppercase tracking-widest">
          {callType === 'video' ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5 text-sky-400" />}
          <span>Incoming {callType === 'video' ? 'Video' : 'Audio'} Call</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          100% Free Halal Matrimony Connection
        </p>
      </div>

      {/* Center Caller Profile */}
      <div className="flex flex-col items-center space-y-4 my-auto">
        <div className="relative">
          {/* Pulsating Radar Rings */}
          <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-emerald-500/30 to-sky-500/30 animate-ping opacity-75" />
          <div className="absolute inset-0 -m-6 rounded-full bg-emerald-500/10 animate-pulse" />

          {/* Caller Avatar */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-emerald-400/80 shadow-2xl bg-slate-900">
            {caller.photoUrl ? (
              <img
                src={caller.photoUrl}
                alt={caller.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-slate-800 to-slate-900 font-serif">
                {caller.fullName?.charAt(0) || 'M'}
              </div>
            )}
          </div>

          {/* VIP Badge */}
          {caller.isVip && (
            <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center space-x-1 shadow-lg">
              <Crown className="w-3 h-3 fill-slate-950" />
              <span>VIP</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">
            {caller.fullName}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 mt-1">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{caller.city || 'Pakistan'}</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Match</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full max-w-sm pb-8 space-y-4">
        <div className="flex items-center justify-center space-x-6">
          {/* Decline Button */}
          <div className="flex flex-col items-center space-y-1.5">
            <button
              type="button"
              onClick={() => webRtcService.rejectCall('declined')}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              title="Decline"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <span className="text-xs text-slate-400 font-medium">Decline</span>
          </div>

          {/* Accept with Voice Button */}
          <div className="flex flex-col items-center space-y-1.5">
            <button
              type="button"
              onClick={() => webRtcService.acceptCall(false)}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              title="Accept Audio"
            >
              <Phone className="w-7 h-7" />
            </button>
            <span className="text-xs text-slate-300 font-medium">Voice Call</span>
          </div>

          {/* Accept with Video Button (if video was initiated) */}
          {callType === 'video' && (
            <div className="flex flex-col items-center space-y-1.5">
              <button
                type="button"
                onClick={() => webRtcService.acceptCall(true)}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
                title="Accept Video"
              >
                <Video className="w-7 h-7" />
              </button>
              <span className="text-xs text-sky-300 font-medium">Video Call</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-center text-slate-400">
          Islamic Matrimony: Audio or Video with complete consent & dignity
        </p>
      </div>
    </div>
  );
};
