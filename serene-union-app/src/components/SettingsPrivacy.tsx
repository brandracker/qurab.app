import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  ArrowUpRight, 
  CheckCircle2, 
  Heart, 
  MessageCircle, 
  Eye, 
  Shield, 
  TrendingUp, 
  Infinity, 
  ShieldCheck,
  LogOut,
  PlayCircle
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { MembershipUpgradeModal } from './MembershipUpgradeModal';
import { RewardedAdModal } from './RewardedAdModal';
import type { UserProfile } from '../types';


interface Props {
  currentUser?: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onLogout?: () => void;
}

export const SettingsPrivacy: React.FC<Props> = ({ currentUser: propUser, onUpdateUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => propUser || dbService.getCurrentUser());
  const [blurPhotos, setBlurPhotos] = useState<boolean>(currentUser.blurPhotosByDefault ?? true);
  const [profileVisibility, setProfileVisibility] = useState<string>(currentUser.profileVisibility || 'all_users');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);

  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip);
  });

  const getTodayLikeKey = () => `serene_likes_left_${currentUser.id}_${new Date().toISOString().slice(0, 10)}`;
  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  useEffect(() => {
    setIsVip(Boolean(localStorage.getItem(`serene_vip_${currentUser.id}`) || currentUser.isVip));
    
    dbService.fetchLikesRemaining(currentUser.id).then(({ likesRemaining: liveRem, isVip: liveVip }) => {
      setLikesRemaining(liveRem);
      setIsVip(liveVip);
    });

    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setIsVip(true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);

    const handleActivity = () => {
      const saved = localStorage.getItem(getTodayLikeKey());
      setLikesRemaining(saved !== null ? parseInt(saved, 10) : 50);
    };
    const handleLikes = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === currentUser.id) {
        if (typeof e.detail?.likesRemaining === 'number') {
          setLikesRemaining(e.detail.likesRemaining);
        }
      }
    };
    window.addEventListener('serene_activity_updated', handleActivity);
    window.addEventListener('serene_likes_updated', handleLikes);

    return () => {
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
      window.removeEventListener('serene_activity_updated', handleActivity);
      window.removeEventListener('serene_likes_updated', handleLikes);
    };
  }, [currentUser.id, currentUser.isVip]);


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

        {/* Membership & Subscription Status Section */}
        <section className="space-y-2">
          <h2 className="font-serif text-xs font-bold text-on-surface">Membership & Plan Privileges</h2>

          <div className="bg-pastel-amber rounded-3xl p-4 sm:p-5 border border-pastel-amber-border shadow-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs shrink-0">
                  <Crown className="w-5 h-5 fill-amber-500/20 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-on-surface">
                    {isVip ? 'Barakah VIP Active' : 'Free Tier Member'}
                  </h3>
                  <p className="text-[10px] text-secondary mt-0.5">
                    {isVip 
                      ? 'All Premium Features Unlocked · Unlimited Likes & Direct Salam' 
                      : `${likesRemaining} / 50 Daily Free Likes Left Today`}
                  </p>
                </div>
              </div>

              {!isVip ? (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active</span>
                </span>
              )}
            </div>

            {/* Grid of Key Quotas */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pastel-amber-border/40 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-pastel-amber-border flex items-center justify-between gap-1.5 shadow-subtle">
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary block">Likes Quota</span>
                    <strong className="text-[11px] text-on-surface truncate block">
                      {isVip ? 'Unlimited' : `${likesRemaining} / 50 Left`}
                    </strong>
                  </div>
                </div>

                {!isVip && (
                  <button
                    onClick={() => setShowAdModal(true)}
                    className="px-2 py-1 rounded-lg bg-pastel-rose text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-0.5 shadow-2xs shrink-0"
                    title="Watch 15s ad for +10 likes"
                  >
                    <PlayCircle className="w-3 h-3" />
                    <span>+10</span>
                  </button>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-pastel-amber-border flex items-center gap-2 shadow-subtle">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-secondary block">Mutual Messaging</span>
                  <strong className="text-[11px] text-primary font-bold">100% Free</strong>
                </div>
              </div>
            </div>


            {/* Unlocked VIP Privileges List */}
            <div className="pt-2 border-t border-pastel-amber-border/40 space-y-1.5">
              <h4 className="font-serif font-bold text-[10px] text-pastel-amber-text uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isVip ? 'Your Active VIP Privileges:' : 'VIP Privileges Preview:'}</span>
              </h4>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pastel-amber-border shadow-subtle">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface font-medium text-xs">See Who Liked You (Unblurred)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Unlocked' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pastel-amber-border shadow-subtle">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface font-medium text-xs">100% Ad-Free (Zero Video Ads)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Active' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pastel-amber-border shadow-subtle">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface font-medium text-xs">Priority Stream Ranking (3x Views)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Active' : 'VIP Only'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pastel-amber-border shadow-subtle">
                  <div className="flex items-center gap-2">
                    <Infinity className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface font-medium text-xs">Unlimited Daily Likes (No 50 Cap)</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isVip ? 'text-primary' : 'text-secondary'}`}>
                    {isVip ? '✓ Unlimited' : '50 / day'}
                  </span>
                </div>
              </div>
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
        <section className="bg-white rounded-2xl p-4 border border-outline space-y-3 shadow-subtle">
          <div>
            <h4 className="font-serif font-bold text-xs text-on-surface">Account & Session</h4>
            <p className="text-xs text-secondary mt-0.5">
              Logged in as <strong className="text-on-surface">{currentUser.email || currentUser.phone || currentUser.fullName}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-pastel-rose text-error border border-pastel-rose-border hover:bg-error hover:text-white transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-subtle active:scale-98"
          >
            <LogOut className="w-4 h-4" />
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
          rewardType="likes"
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onRewardClaimed={() => {
            const nextLikes = likesRemaining + 10;
            setLikesRemaining(nextLikes);
            localStorage.setItem(getTodayLikeKey(), nextLikes.toString());
            window.dispatchEvent(new CustomEvent('serene_activity_updated'));
          }}
        />
      )}
    </div>
  );
};
export default SettingsPrivacy;


