import React, { useEffect, useState } from 'react';
import { ShieldAlert, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { backNavigationService } from '../services/backNavigationService';
import { googlePlayUpdateService } from '../services/googlePlayUpdateService';

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  latestVersionName?: string;
  playStoreUrl?: string;
  onCheckAgain?: () => Promise<void>;
}

export const HardUpdateModal: React.FC<Props> = ({
  isOpen,
  title = 'Critical Update Required',
  message = 'A new version of Qurb is required to continue. Please update now from the Google Play Store for critical features, enhanced audio/video calling, and stability.',
  latestVersionName = '1.0.37',
  playStoreUrl = 'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share',
  onCheckAgain
}) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Strict Hardware Back Button Trap: Cannot dismiss or bypass
  useEffect(() => {
    if (!isOpen) return;
    return backNavigationService.register(() => {
      // Consumed: Prevent exiting modal or returning to app
      return true;
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenPlayStore = async () => {
    if (googlePlayUpdateService.isNativeAndroid()) {
      const launched = await googlePlayUpdateService.startImmediateUpdate();
      if (launched) return;
    }

    try {
      const marketUri = 'market://details?id=app.qurb.serene';
      window.open(marketUri, '_system') || window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRecheck = async () => {
    if (!onCheckAgain || isChecking) return;
    setIsChecking(true);
    try {
      await onCheckAgain();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 font-sans select-none text-on-surface animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-neutral-950 p-6 text-white relative overflow-hidden text-center">
          {/* Subtle Ambient circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full border border-amber-400/20 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full border border-emerald-400/20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xl mb-3 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-amber-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Mandatory App Update • v{latestVersionName}</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-white leading-snug">
              {title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-secondary leading-relaxed text-center whitespace-pre-line">
            {message}
          </p>

          {/* Key Improvements Highlights */}
          <div className="bg-surface-variant/50 rounded-2xl p-3.5 border border-outline/50 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>What's Inside The New Release:</span>
            </div>
            <ul className="text-xs text-secondary space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Crystal-clear VoIP Audio & Video Calling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero-lag real-time chat & photo reveal updates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Critical bug fixes & background notifications</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleOpenPlayStore}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer border border-emerald-400/40"
            >
              <ExternalLink className="w-4 h-4 text-emerald-200" />
              <span>Update on Google Play Store 🚀</span>
            </button>

            {onCheckAgain && (
              <button
                type="button"
                onClick={handleRecheck}
                disabled={isChecking}
                className="w-full py-3 rounded-2xl font-bold text-xs bg-surface-variant hover:bg-outline text-secondary border border-outline transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-primary' : ''}`} />
                <span>{isChecking ? 'Verifying Version...' : 'Check Again'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
