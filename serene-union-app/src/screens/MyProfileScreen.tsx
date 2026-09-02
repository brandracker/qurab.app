import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Crown, 
  EyeOff, 

  MapPin, 
  Sparkles, 
  PlayCircle, 
  BookOpen, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  HelpCircle, 
  Edit3,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import type { UserProfile } from '../types';
import { CompatibilityQuizModal } from '../components/CompatibilityQuizModal';
import { MembershipUpgradeModal } from '../components/MembershipUpgradeModal';
import { RewardedAdModal } from '../components/RewardedAdModal';

interface Props {
  user: UserProfile;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export const MyProfileScreen: React.FC<Props> = ({ user, onEditProfile, onLogout }) => {
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'likes' | 'salam' | 'messages' | 'photo_unblur'>('likes');
  const [isVip, setIsVip] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_vip_${user.id}`) || user.isVip);
  });

  useEffect(() => {
    setIsVip(Boolean(localStorage.getItem(`serene_vip_${user.id}`) || user.isVip));
    
    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === user.id) {
        setIsVip(true);
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => window.removeEventListener('serene_vip_updated', handleVipUpdate);
  }, [user.id, user.isVip]);

  const getTodayLikeKey = () => `serene_likes_left_${user.id}_${new Date().toISOString().slice(0, 10)}`;
  const [likesRemaining, setLikesRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(getTodayLikeKey());
    return saved !== null ? parseInt(saved, 10) : 50;
  });

  useEffect(() => {
    const handleActivity = () => {
      const saved = localStorage.getItem(getTodayLikeKey());
      setLikesRemaining(saved !== null ? parseInt(saved, 10) : 50);
    };
    window.addEventListener('serene_activity_updated', handleActivity);
    return () => window.removeEventListener('serene_activity_updated', handleActivity);
  }, [user.id]);


  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_quiz_${user.id}`));
  });
  const rel = user.religiousProfile;

  return (
    <div className="w-full h-full flex flex-col bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      {/* Top Header */}
      <header className="sticky top-0 bg-white px-4 py-3 border-b border-outline flex items-center justify-between z-20 shadow-subtle">
        <div>
          <h1 className="font-serif text-xl font-bold text-on-surface">
            My Matrimonial Biodata
          </h1>
          <p className="text-[11px] text-secondary mt-0.5">Manage profile, modesty settings & VIP membership</p>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-xs text-error font-semibold hover:bg-pastel-rose px-3 py-1 rounded-full border border-error/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        )}
      </header>

      {/* Main Profile Body */}
      <main className="p-4 space-y-4">
        {/* MEMBERSHIP PASS CARD (Pastel Amber or Rose) */}
        <div className={`rounded-3xl p-4 border transition-all ${
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
                    ? 'All Premium Privileges Active · Unlimited Likes & Direct Salam' 
                    : `${likesRemaining} / 50 Daily Likes Left Today · Free Halal Chat`}
                </p>
              </div>
            </div>


            {!isVip ? (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upgrade</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-white text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlocked</span>
              </span>
            )}
          </div>

          {isVip ? (
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-pastel-amber-border/70 text-xs">
              <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <strong className="block text-[10px] text-on-surface font-bold truncate">Unlimited Likes</strong>
                  <span className="text-[9px] text-secondary">No daily limits</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <strong className="block text-[10px] text-on-surface font-bold truncate">Direct Salams</strong>
                  <span className="text-[9px] text-secondary">VIP Priority</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline/50 text-xs">
              <button
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
                onClick={() => setShowUpgradeModal(true)}
                className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
              >
                <Crown className="text-pastel-amber-text w-4 h-4 shrink-0" />
                <div>
                  <strong className="block text-[10px] text-primary">Barakah VIP</strong>
                  <span className="text-[9px] text-secondary">PKR 830 / mo</span>
                </div>
              </button>
            </div>
          )}
        </div>


        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-outline flex flex-col">
          {/* Main Photo Banner */}
          <div className="relative w-full h-72 bg-surface-variant overflow-hidden">
            {user.photos && user.photos.length > 0 && user.photos[0] ? (
              <img
                src={user.photos[0]}
                alt={user.fullName}
                className={`w-full h-full object-cover transition-all ${user.blurPhotosByDefault ? 'filter blur-md scale-110' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-secondary">
                <span className="text-xs font-semibold">No profile photo uploaded</span>
              </div>
            )}
            
            {user.blurPhotosByDefault && user.photos && user.photos.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-xs">
                <span className="bg-white/95 text-on-surface text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-subtle border border-outline font-semibold">
                  <EyeOff className="w-3.5 h-3.5 text-primary" />
                  <span>Modesty Protection Active</span>
                </span>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary-light" />
              <span>{user.location || 'Global'}</span>
            </div>
            
            {isVip && (
              <div className="absolute top-4 right-4 bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-subtle z-10">
                <Crown className="w-3.5 h-3.5 text-pastel-amber-text" />
                <span>Barakah VIP</span>
              </div>
            )}
          </div>


          {/* User Details */}
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-on-surface">
                  {user.fullName}, {user.age || 28}
                </h2>
                {isVip && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {rel?.sect || 'Sunni'} ({rel?.madhhab || 'Hanafi'}) · {user.profession || 'Professional'}
              </p>
            </div>

            {/* Photo Gallery Grid */}
            {user.photos && user.photos.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  My Photos ({user.photos.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {user.photos.map((p, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-outline relative shadow-subtle">
                      <img src={p} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1. Deen & Religious Routine (Pastel Mint) */}
            <div className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-pastel-mint-text flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-mint-text" />
                <span>Deen & Religious Routine</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Daily Prayers</span>
                  <strong className="text-on-surface text-[11px]">{rel?.prayerFrequency || '5 times daily'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Quran Engagement</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Modesty Style</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-mint-border shadow-subtle">
                  <span className="text-[10px] text-pastel-mint-text font-medium block">Hajj / Umrah</span>
                  <strong className="text-on-surface text-[11px] capitalize">{rel?.hajjUmrahStatus || 'Planning'}</strong>
                </div>
              </div>
            </div>

            {/* 2. Family & Post-Marriage Living (Pastel Sand) */}
            <div className="bg-pastel-sand rounded-2xl p-3.5 border border-pastel-sand-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sand-text uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-pastel-sand-text" />
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Post-Marriage Living</span>
                  <strong className="text-primary capitalize text-[11px]">{user.livingPreference?.replace('_', ' ') || 'Independent'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Family Structure</span>
                  <strong className="text-on-surface capitalize text-[11px]">{user.familyStructure || 'Nuclear'} ({user.siblingsCount ?? 2} Siblings)</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Relocation</span>
                  <strong className="text-on-surface capitalize text-[11px]">{user.willingnessToRelocate?.replace('_', ' ') || 'Open'}</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-pastel-sand-border shadow-subtle">
                  <span className="text-[10px] text-pastel-sand-text font-medium block">Smoking Status</span>
                  <strong className="text-on-surface capitalize text-[11px]">{user.smokingStatus?.replace('_', ' ') || 'Non-Smoker'}</strong>
                </div>
              </div>
            </div>

            {/* 3. Career & Education (Pastel Sky) */}
            <div className="bg-pastel-sky rounded-2xl p-3.5 border border-pastel-sky-border space-y-2 text-xs shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sky-text uppercase tracking-wider">Education & Career</h3>
              <p className="text-on-surface flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-pastel-sky-text" />
                <span>{user.education || 'Graduate'} {user.university ? `· ${user.university}` : ''}</span>
              </p>
              <p className="text-on-surface flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-pastel-sky-text" />
                <span>{user.profession || 'Professional'}</span>
              </p>
              <p className="text-on-surface flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-pastel-sky-text" />
                <span>Languages: {user.languagesSpoken || 'English, Urdu'}</span>
              </p>
            </div>

            {/* 4. About My Deen */}
            <div className="bg-pastel-lavender rounded-2xl p-3.5 border border-pastel-lavender-border space-y-1 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-lavender-text uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pastel-lavender-text" />
                <span>About My Deen</span>
              </h3>
              <p className="text-xs text-on-surface leading-relaxed italic">
                "{user.bio || rel?.deenRelationshipBio || "Seeking a righteous spouse to complete half our deen in harmony and mutual respect."}"
              </p>
            </div>
          </div>
        </div>

        {/* 20-Questions Values Alignment Card */}
        <div className="bg-white p-4 rounded-3xl border border-outline flex flex-col gap-3 shadow-card">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose text-primary flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xs font-bold text-on-surface">Islamic Values Questionnaire</h3>
              <p className="text-[10px] text-secondary">20 Guided Scenarios on Deen, Finance, Family & Lifestyle</p>
            </div>
          </div>
          <button
            onClick={() => setShowQuizModal(true)}
            className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{hasCompletedQuiz ? 'Update 20-Questions Answers' : 'Take Compatibility Quiz (20 Qs)'}</span>
          </button>
        </div>

        {/* Action Button */}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="w-full py-3 rounded-full bg-white border border-primary text-primary font-sans text-xs font-bold hover:bg-pastel-rose active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-subtle"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile Details</span>
          </button>
        )}
      </main>

      {/* Google Play Membership Upgrade Modal */}
      {showUpgradeModal && (
        <MembershipUpgradeModal
          userId={user.id}
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onPurchaseSuccess={(productId) => {
            if (productId === 'serene_barakah_monthly') {
              setIsVip(true);
              localStorage.setItem(`serene_vip_${user.id}`, 'true');
            }
          }}
          onWatchAdClicked={() => {
            setAdRewardType('likes');
            setShowAdModal(true);
          }}
        />
      )}

      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <RewardedAdModal
          userId={user.id}
          rewardType={adRewardType}
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onRewardClaimed={() => {
            if (adRewardType === 'likes') {
              const nextLikes = likesRemaining + 10;
              setLikesRemaining(nextLikes);
              localStorage.setItem(getTodayLikeKey(), nextLikes.toString());
              window.dispatchEvent(new CustomEvent('serene_activity_updated'));
            }
          }}
        />
      )}

      {/* Compatibility Quiz Modal */}
      {showQuizModal && (
        <CompatibilityQuizModal
          userId={user.id}
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          onCompleted={() => setHasCompletedQuiz(true)}
        />
      )}
    </div>
  );
};
export default MyProfileScreen;
