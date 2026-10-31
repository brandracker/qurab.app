import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Eye, 
  Shield, 
  TrendingUp, 
  Infinity, 
  ShieldCheck,
  LogOut,
  PlayCircle,
  Hand,
  AlertTriangle,
  Trash2,
  PauseCircle,
  RefreshCw,
  X,
  PlusCircle,
  Gift,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { walletService } from '../services/walletService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { RewardedAdModal } from './RewardedAdModal';
import { ReferralHubModal } from './ReferralHubModal';
import { themeService } from '../services/themeService';
import type { UserProfile } from '../types';


interface Props {
  currentUser?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onLogout?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

export const SettingsPrivacy: React.FC<Props> = ({ 
  currentUser: propUser, 
  onUpdateUser, 
  onLogout,
  onOpenPrivacyPolicy,
  onOpenTerms
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => propUser || dbService.getCurrentUser());
  const [blurPhotos, setBlurPhotos] = useState<boolean>(currentUser.blurPhotosByDefault ?? true);
  const [profileVisibility, setProfileVisibility] = useState<string>(currentUser.profileVisibility || 'all_users');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam' | 'messages' | 'photo_unblur'>('likes');
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [spotlightInfo, setSpotlightInfo] = useState<{ isSpotlightActive: boolean; spotlightExpiresAt: string | null }>(() => {
    return dbService.getSpotlightInfo(currentUser.id);
  });
  const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => themeService.isDark());

  useEffect(() => {
    return themeService.subscribe((theme) => {
      setIsDarkMode(theme === 'dark');
    });
  }, []);

  const handleToggleTheme = () => {
    themeService.toggleTheme();
    showNotice();
  };

  const isDeactivated = currentUser.accountStatus === 'deactivated' || profileVisibility === 'hidden';

  const [isVip, setIsVip] = useState<boolean>(() => {
    const vipVal = localStorage.getItem(`serene_vip_${currentUser.id}`);
    return vipVal !== null ? vipVal === 'true' : Boolean(currentUser.isVip);
  });

  const getLikeKey = () => `serene_likes_left_${currentUser.id}`;
  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  const [directSalams, setDirectSalams] = useState<number>(() => {
    return dbService.getDirectSalams(currentUser.id);
  });

  useEffect(() => {
    const vipVal = localStorage.getItem(`serene_vip_${currentUser.id}`);
    setIsVip(vipVal !== null ? vipVal === 'true' : Boolean(currentUser.isVip));
    
    dbService.fetchLikesRemaining(currentUser.id).then(({ likesRemaining: liveRem, isVip: liveVip, directSalams: liveSalams, isSpotlightActive, spotlightExpiresAt }) => {
      setLikesRemaining(liveRem);
      setIsVip(liveVip);
      if (typeof liveSalams === 'number') setDirectSalams(liveSalams);
      setSpotlightInfo({ isSpotlightActive: Boolean(isSpotlightActive), spotlightExpiresAt: spotlightExpiresAt || null });
    });

    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(e.detail?.isVip !== undefined ? Boolean(e.detail.isVip) : true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);

    const handleActivity = () => {
      const saved = localStorage.getItem(walletService.getTodayLikeKey(currentUser.id));
      setLikesRemaining(saved !== null ? parseInt(saved, 10) : 50);
    };
    const handleLikes = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === currentUser.id) {
        if (typeof e.detail?.likesRemaining === 'number') {
          setLikesRemaining(e.detail.likesRemaining);
        }
      }
    };
    const handleSalams = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === currentUser.id) {
        if (typeof e.detail?.directSalams === 'number') {
          setDirectSalams(e.detail.directSalams);
        }
      }
    };
    const handleSpotlight = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setSpotlightInfo({
          isSpotlightActive: Boolean(e.detail?.isSpotlightActive),
          spotlightExpiresAt: e.detail?.spotlightExpiresAt || null
        });
      }
    };

    window.addEventListener('serene_activity_updated', handleActivity);
    window.addEventListener('serene_likes_updated', handleLikes);
    window.addEventListener('serene_salams_updated', handleSalams);
    window.addEventListener('serene_spotlight_updated', handleSpotlight);

    return () => {
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
      window.removeEventListener('serene_activity_updated', handleActivity);
      window.removeEventListener('serene_likes_updated', handleLikes);
      window.removeEventListener('serene_salams_updated', handleSalams);
      window.removeEventListener('serene_spotlight_updated', handleSpotlight);
    };
  }, [currentUser.id, currentUser.isVip]);

  const formatSpotlightRemaining = (expiresAt: string | null): string => {
    if (!expiresAt) return 'Active';
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return 'Expiring';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };


  const handleToggleBlur = () => {
    const nextVal = !blurPhotos;
    setBlurPhotos(nextVal);
    const updated = { ...currentUser, blurPhotosByDefault: nextVal };
    setCurrentUser(updated);
    dbService.updatePrivacy(nextVal, profileVisibility);
    if (onUpdateUser) onUpdateUser(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('serene_current_user_v1');
      localStorage.removeItem('serene_auth_token_v1');
      window.location.reload();
    }
  };

  const handleDeactivate = async () => {
    setIsProcessingAction(true);
    try {
      await dbService.deactivateAccount(currentUser.id);
      const updated = { ...currentUser, accountStatus: 'deactivated' as const, profileVisibility: 'hidden' };
      setCurrentUser(updated);
      setProfileVisibility('hidden');
      if (onUpdateUser) onUpdateUser(updated);
      setShowDeactivateModal(false);
      setActionMessage('Your profile is now paused and hidden from Discover.');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      console.error('Deactivate failed:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReactivate = async () => {
    setIsProcessingAction(true);
    try {
      await dbService.reactivateAccount(currentUser.id);
      const updated = { ...currentUser, accountStatus: 'active' as const, profileVisibility: 'all_users' };
      setCurrentUser(updated);
      setProfileVisibility('all_users');
      if (onUpdateUser) onUpdateUser(updated);
      setActionMessage('Alhamdulillah! Your profile is active and visible on Discover.');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      console.error('Reactivate failed:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') return;
    setIsProcessingAction(true);
    try {
      await dbService.deleteAccount(currentUser.id);
      setShowDeleteModal(false);
      handleLogout();
    } catch (err: any) {
      console.error('Delete failed:', err);
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto font-sans select-none text-on-surface">
      {/* Top Header */}
      <header className="sticky top-0 bg-white px-5 py-3 border-b border-outline z-10 flex items-center justify-between shadow-subtle">
        <div>
          <h1 className="font-serif text-xl font-bold text-on-surface">
            Settings & Privacy
          </h1>
          <p className="text-xs text-secondary">Manage your halal preferences and security</p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs font-bold text-primary bg-pastel-rose border border-pastel-rose-border px-3 py-0.5 rounded-full animate-fade-in shadow-subtle">
              Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle Theme"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 rounded-full border border-outline hover:bg-surface-variant text-on-surface transition-all shadow-2xs cursor-pointer"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-error font-semibold hover:bg-pastel-rose px-3 py-1.5 rounded-full border border-error/20 transition-all shadow-subtle"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>


      {/* Main Settings Body */}
      <main className="p-4 sm:p-6 space-y-4">
        {/* Account Summary Card */}
        <section className="bg-white rounded-2xl p-4 border border-outline shadow-subtle flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-pastel-rose text-primary flex items-center justify-center font-serif text-lg font-bold border border-pastel-rose-border shrink-0 shadow-subtle">
            {currentUser.photos && currentUser.photos.length > 0 && currentUser.photos[0] ? (
              <img src={currentUser.photos[0]} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <span>{currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-sm text-on-surface truncate">{currentUser.fullName || 'Member'}</h3>
            <p className="text-[11px] text-secondary truncate">{currentUser.email || currentUser.phone || 'Account Active'}</p>
            <span className="inline-block mt-0.5 text-[10px] font-bold text-primary bg-pastel-rose px-2 py-0.2 rounded-full border border-pastel-rose-border">
              Account ID: {currentUser.id}
            </span>
          </div>
        </section>

        {/* MEMBERSHIP PASS CARD (The exact Pink card from user's image) */}
        <section className={`rounded-3xl p-4 sm:p-5 border transition-all ${
          isVip 
            ? 'bg-pastel-amber border-pastel-amber-border' 
            : 'bg-pastel-rose border-pastel-rose-border'
        } flex flex-col gap-3 shadow-subtle`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isVip 
                  ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                  : 'bg-rose-50 text-primary border border-rose-200'
              }`}>
                <Crown className={`w-5 h-5 ${isVip ? 'text-amber-600 fill-amber-500/20' : 'text-primary'}`} />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-on-surface">
                  {isVip ? 'Barakah VIP Active' : 'Free Member'}
                </h3>
                <p className="text-[10px] text-secondary mt-0.5">
                  {isVip 
                    ? 'All Premium Features Unlocked · Unlimited Likes & Direct Salam' 
                    : `${likesRemaining} / ${Math.max(50, likesRemaining)} Daily Likes Left Today · Free Tier Member · Free Halal Chat`}
                </p>
              </div>
            </div>

            {!isVip ? (
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="bg-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upgrade</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-white text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active</span>
              </span>
            )}
          </div>

          {isVip ? (
            <div className="space-y-2 pt-2.5 border-t border-pastel-amber-border/70 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Infinity className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-[10px] text-on-surface font-bold truncate">Unlimited Likes</strong>
                    <span className="text-[9px] text-secondary">Active Forever</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Hand className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-[10px] text-on-surface font-bold truncate">Direct Salams</strong>
                    <span className="text-[9px] font-bold text-amber-700">{directSalams} Passes Available</span>
                  </div>
                </div>
              </div>

              {/* VIP Spotlight Boost Status */}
              <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                    spotlightInfo.isSpotlightActive ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-[10px] text-on-surface font-bold">
                      {spotlightInfo.isSpotlightActive ? '24h Spotlight Boost Active' : 'City Spotlight Boost'}
                    </strong>
                    <span className="text-[9px] text-secondary">
                      {spotlightInfo.isSpotlightActive
                        ? `${formatSpotlightRemaining(spotlightInfo.spotlightExpiresAt)} · #1 Top Spot in City`
                        : 'Feature your profile at #1 top spot in city Discover feed'}
                    </span>
                  </div>
                </div>

                {!spotlightInfo.isSpotlightActive && (
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-pastel-amber/80 transition-all active:scale-95"
                  >
                    Boost ($0.99)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-outline/50 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdRewardType('likes');
                    setShowAdModal(true);
                  }}
                  className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <PlayCircle className="text-primary w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-on-surface">+10 Extra Likes</strong>
                    <span className="text-[9px] text-secondary">Watch 15s ad</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdRewardType('salam');
                    setShowAdModal(true);
                  }}
                  className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <Hand className="text-primary w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-on-surface">Direct Salams: {directSalams}</strong>
                    <span className="text-[9px] text-secondary">Watch 3 ads for +1</span>
                  </div>
                </button>
              </div>

              {/* Free Member Spotlight & VIP row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <TrendingUp className="text-amber-500 w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-on-surface">
                      {spotlightInfo.isSpotlightActive ? 'Boost Active' : 'City Spotlight'}
                    </strong>
                    <span className="text-[9px] text-secondary">
                      {spotlightInfo.isSpotlightActive ? formatSpotlightRemaining(spotlightInfo.spotlightExpiresAt) : 'Rank #1 ($0.99)'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="p-2 rounded-xl bg-white border border-pastel-amber-border hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <Crown className="text-pastel-amber-text w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-primary">Barakah VIP</strong>
                    <span className="text-[9px] text-secondary">20 Passes · PKR 830</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* REFERRAL PERK BANNER: 30 Invites -> 1 Month Free VIP */}
        <section className="rounded-3xl p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md border border-emerald-700/60 flex items-center justify-between gap-3 relative overflow-hidden group">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  Free 1-Month VIP Perk
                </span>
              </div>
              <h3 className="font-serif text-sm font-bold text-white truncate mt-0.5">
                Invite Friends & Unlock Free VIP
              </h3>
              <p className="text-[10px] text-emerald-100/80 leading-tight">
                Invite 30 genuine friends to earn 1 month Barakah VIP 100% Free!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReferralModal(true)}
            className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 text-xs font-bold px-3.5 py-2 rounded-full shadow-md transition-all shrink-0 flex items-center gap-1"
          >
            <span>Invite</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Appearance & Theme Section */}
        <section className="space-y-2">
          <h2 className="font-serif text-xs font-bold text-on-surface">Appearance & Theme</h2>

          <div className="bg-white rounded-2xl p-4 border border-outline shadow-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 pr-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  isDarkMode 
                    ? 'bg-zinc-800 text-amber-400 border-zinc-700' 
                    : 'bg-pastel-amber text-amber-600 border-pastel-amber-border'
                }`}>
                  {isDarkMode ? <Moon className="w-5 h-5 fill-amber-400/20" /> : <Sun className="w-5 h-5" />}
                </div>
                <div className="space-y-0.5">
                  <span className="font-serif font-bold text-xs text-on-surface block">Dark Theme</span>
                  <span className="text-[11px] text-secondary leading-relaxed">
                    {isDarkMode ? 'Eye-comfort dark mode active for low-light environments.' : 'Clean daylight appearance with bright surfaces.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Toggle Dark Theme"
                onClick={handleToggleTheme}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 cursor-pointer ${
                  isDarkMode ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Modesty Section */}
        <section className="space-y-2">
          <h2 className="font-serif text-xs font-bold text-on-surface">Islamic Modesty & Privacy</h2>

          <div className="bg-white rounded-2xl p-4 border border-outline shadow-subtle space-y-3.5 divide-y divide-outline">
            {/* Photo Blur */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-bold text-xs text-on-surface block">Blur My Photos</span>
                <span className="text-[11px] text-secondary leading-relaxed">
                  Protect facial modesty in Discover until a mutual match or approved request.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleBlur}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  blurPhotos ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                    blurPhotos ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between pt-3.5">
              <div className="space-y-0.5 pr-4">
                <span className="font-serif font-bold text-xs text-on-surface block">Profile Visibility</span>
                <span className="text-[11px] text-secondary leading-relaxed">
                  Control who can discover your matrimonial profile.
                </span>
              </div>
              <select
                value={profileVisibility}
                onChange={(e) => {
                  setProfileVisibility(e.target.value);
                  dbService.updatePrivacy(blurPhotos, e.target.value);
                  showNotice();
                }}
                className="bg-white border border-outline rounded-xl py-1.5 px-2.5 text-xs font-sans text-on-surface outline-none focus:border-primary shadow-subtle"
              >
                <option value="all_users">All Verified Users</option>
                <option value="approved_only">Approved Matches Only</option>
                <option value="hidden">Hidden / Paused</option>
              </select>
            </div>
          </div>
        </section>

        {/* VIP Privileges Overview Section */}
        <section className="space-y-2">
          <h2 className="font-serif text-xs font-bold text-on-surface">VIP Privileges Overview</h2>
          <div className="bg-white rounded-2xl p-3.5 border border-outline shadow-subtle space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-variant/50 border border-outline/50 shadow-2xs">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span className="text-on-surface font-medium text-xs">See Who Liked You (Unblurred)</span>
              </div>
              <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                {isVip ? '✓ Unlocked' : 'VIP Only'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-variant/50 border border-outline/50 shadow-2xs">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-on-surface font-medium text-xs">100% Ad-Free (Zero Video Ads)</span>
              </div>
              <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                {isVip ? '✓ Active' : 'VIP Only'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-variant/50 border border-outline/50 shadow-2xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-on-surface font-medium text-xs">Priority Stream Ranking (3x Views)</span>
              </div>
              <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                {isVip ? '✓ Active' : 'VIP Only'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-variant/50 border border-outline/50 shadow-2xs">
              <div className="flex items-center gap-2">
                <Infinity className="w-3.5 h-3.5 text-primary" />
                <span className="text-on-surface font-medium text-xs">Unlimited Daily Likes (No 50 Cap)</span>
              </div>
              <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                {isVip ? '✓ Unlimited' : '50 / day'}
              </span>
            </div>
          </div>
        </section>

        {/* Halal Guidelines Notice */}
        <section className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border space-y-1 shadow-subtle">
          <div className="flex items-center gap-1.5 text-pastel-mint-text">
            <ShieldCheck className="w-4 h-4 text-pastel-mint-text" />
            <h4 className="font-serif font-bold text-xs">Halal Matrimony Code of Conduct</h4>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Qurb is designed for sincere, faith-first marriage intentions. Inappropriate behavior, disrespect, or harassment will result in permanent account removal to protect our community.
          </p>
        </section>

        {/* Account & Session Management */}
        <section className="bg-white rounded-2xl p-4 border border-outline space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-xs text-on-surface">Account Status & Controls</h4>
              <p className="text-xs text-secondary mt-0.5">
                Logged in as <strong className="text-on-surface">{currentUser.email || currentUser.phone || currentUser.fullName}</strong>
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
              isDeactivated 
                ? 'bg-pastel-amber text-pastel-amber-text border-pastel-amber-border' 
                : 'bg-pastel-mint text-pastel-mint-text border-pastel-mint-border'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDeactivated ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span>{isDeactivated ? 'Paused / Hidden' : 'Active on Discover'}</span>
            </span>
          </div>

          {actionMessage && (
            <div className="p-3 rounded-xl bg-pastel-sky border border-pastel-sky-border text-xs text-pastel-sky-text font-medium animate-fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Pause / Reactivate Profile Card */}
          <div className="p-3 rounded-xl bg-surface-variant/40 border border-outline flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <PauseCircle className="w-4 h-4 text-secondary" />
                <strong className="text-xs text-on-surface font-semibold">
                  {isDeactivated ? 'Reactivate Your Profile' : 'Pause / Deactivate Profile'}
                </strong>
              </div>
              <p className="text-[11px] text-secondary leading-tight">
                {isDeactivated 
                  ? 'Resume your profile visibility so compatible matches can find you.'
                  : 'Take a break without losing chats or matches. Profile is hidden from Discover.'}
              </p>
            </div>

            {isDeactivated ? (
              <button
                type="button"
                onClick={handleReactivate}
                disabled={isProcessingAction}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all shrink-0 flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingAction ? 'animate-spin' : ''}`} />
                <span>Reactivate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white border border-outline text-secondary hover:text-on-surface hover:bg-surface text-xs font-semibold shadow-2xs active:scale-95 transition-all shrink-0 flex items-center gap-1"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}
          </div>

          {/* Permanent Delete Card */}
          <div className="p-3 rounded-xl bg-pastel-rose/30 border border-pastel-rose-border flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-error">
                <Trash2 className="w-4 h-4" />
                <strong className="text-xs font-bold">Delete Profile Permanently</strong>
              </div>
              <p className="text-[11px] text-secondary leading-tight">
                Permanently purge all matrimonial data, photos, chats & matches from Cloudflare D1.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeleteConfirmText('');
                setShowDeleteModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-error border border-error/30 hover:bg-error hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          {/* Legal & Compliance Policies */}
          <div className="p-3.5 rounded-2xl bg-white border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-1.5 text-on-surface">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-serif text-xs font-bold">Legal & Policies</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenPrivacyPolicy}
                className="py-2 px-3 rounded-xl bg-surface border border-outline hover:bg-surface-variant text-[11px] font-semibold text-secondary hover:text-on-surface text-center transition-all cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={onOpenTerms}
                className="py-2 px-3 rounded-xl bg-surface border border-outline hover:bg-surface-variant text-[11px] font-semibold text-secondary hover:text-on-surface text-center transition-all cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
            <div className="text-[10px] text-muted text-center pt-0.5">
              Qurb Matrimony · Version 1.0.4 · <a href="https://qurb.app" target="_blank" rel="noreferrer" className="underline hover:text-primary">qurb.app</a>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-surface border border-outline hover:bg-surface-variant text-secondary hover:text-on-surface transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-98"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out of Qurb</span>
          </button>
        </section>
      </main>


      {/* Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={currentUser.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${currentUser.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <RewardedAdModal
          userId={currentUser.id}
          rewardType={adRewardType}
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onRewardClaimed={() => {
            if (adRewardType === 'likes') {
              const nextLikes = likesRemaining + 10;
              setLikesRemaining(nextLikes);
              localStorage.setItem(walletService.getTodayLikeKey(currentUser.id), nextLikes.toString());
              window.dispatchEvent(new CustomEvent('serene_activity_updated'));
            } else if (adRewardType === 'salam') {
              const nextSalams = directSalams + 1;
              setDirectSalams(nextSalams);
              localStorage.setItem(`serene_salams_left_${currentUser.id}`, nextSalams.toString());
              window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId: currentUser.id, directSalams: nextSalams } }));
            }
          }}
        />
      )}

      {/* Referral Hub Modal */}
      {showReferralModal && (
        <ReferralHubModal
          userId={currentUser.id}
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
        />
      )}

      {/* Deactivate Profile Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-outline shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-pastel-amber flex items-center justify-center text-pastel-amber-text border border-pastel-amber-border">
                <PauseCircle className="w-5 h-5 text-amber-600" />
              </div>
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-on-surface">
                Pause / Deactivate Profile?
              </h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Taking a break? Deactivating your account temporarily hides you from the Discover feed so nobody new can find or like you.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-surface-variant/50 border border-outline space-y-1.5 text-xs text-secondary">
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Existing chats & matches are preserved safely</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Reactivate anytime with 1-click in Settings</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={isProcessingAction}
                className="flex-1 py-2.5 rounded-xl border border-outline bg-white text-on-surface text-xs font-semibold hover:bg-surface active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={isProcessingAction}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isProcessingAction ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PauseCircle className="w-3.5 h-3.5" />}
                <span>Confirm Pause</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Permanently Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-outline shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-pastel-rose flex items-center justify-center text-error border border-pastel-rose-border">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-error">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                This is permanent and <strong>cannot be undone</strong>. Your matrimonial profile, uploaded photos, voice recordings, messages, and match history will be wiped from Cloudflare D1.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-secondary block">
                Type <span className="font-mono font-bold text-error">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-xl border border-outline bg-surface text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-error focus:ring-1 focus:ring-error"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isProcessingAction}
                className="flex-1 py-2.5 rounded-xl border border-outline bg-white text-on-surface text-xs font-semibold hover:bg-surface active:scale-95 transition-all"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isProcessingAction || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                className="flex-1 py-2.5 rounded-xl bg-error text-white text-xs font-bold shadow-md hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-40"
              >
                {isProcessingAction ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsPrivacy;


