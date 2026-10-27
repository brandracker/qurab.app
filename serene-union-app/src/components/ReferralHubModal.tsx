import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Crown, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MessageCircle
} from 'lucide-react';
import { referralService, type ReferralStats, type ReferredFriend } from '../services/referralService';

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onVipUnlocked?: () => void;
}

export const ReferralHubModal: React.FC<Props> = ({
  userId,
  isOpen,
  onClose,
  onVipUnlocked
}) => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'friends' | 'rules'>('progress');

  useEffect(() => {
    if (!isOpen || !userId) return;
    setIsLoading(true);
    referralService.getStats(userId).then(data => {
      setStats(data);
      setIsLoading(false);
      if (data.isVipRewarded && onVipUnlocked) {
        onVipUnlocked();
      }
    }).catch(() => {
      setIsLoading(false);
    });
  }, [isOpen, userId, onVipUnlocked]);

  if (!isOpen) return null;

  const target = stats?.targetCount || 30;
  const completed = stats?.completedCount || 0;
  const pending = stats?.pendingCount || 0;
  const percent = Math.min(100, Math.round((completed / target) * 100));
  const isUnlocked = stats?.isVipRewarded || completed >= target;
  const friends = stats?.friends || [];

  const handleCopy = async () => {
    const success = await referralService.copyInviteLink(stats?.referralCode || userId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    referralService.shareOnWhatsApp(stats?.referralCode || userId, target);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-outline/40">
        {/* Header with Islamic Pattern Accent & Gradient */}
        <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>Special Matrimonial Perk</span>
            </span>
          </div>

          <h2 id="referral-modal-title" className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Invite Friends & Get Free VIP</span>
            <Crown className="w-6 h-6 text-amber-400 fill-amber-400/30 shrink-0" />
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Invite <strong className="text-amber-300 font-bold">{target} genuine users</strong> to complete their matrimony profile and enjoy <strong className="text-white font-bold">1 Month Barakah VIP ($2.99 value) 100% Free!</strong>
          </p>

          {/* Quick Sub-tabs */}
          <div className="flex items-center gap-1.5 mt-4 bg-emerald-950/40 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'progress' 
                  ? 'bg-white text-emerald-900 shadow-sm font-bold' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Progress ({completed}/{target})
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'friends' 
                  ? 'bg-white text-emerald-900 shadow-sm font-bold' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Invited Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'rules' 
                  ? 'bg-white text-emerald-900 shadow-sm font-bold' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Fair Rules & Anti-Fraud
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/50 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-secondary space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Checking your referral barakah...</p>
            </div>
          ) : activeTab === 'progress' ? (
            <>
              {/* STATUS CARD */}
              <div className={`p-4 rounded-3xl border transition-all ${
                isUnlocked 
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300 shadow-sm' 
                  : 'bg-white border-outline/70 shadow-xs'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                      isUnlocked ? 'bg-amber-500 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isUnlocked ? <Crown className="w-5 h-5 fill-white" /> : <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        {isUnlocked ? '🎉 Reward Achieved!' : 'Your Live Milestone'}
                      </h3>
                      <p className="text-[11px] text-secondary">
                        {isUnlocked 
                          ? '1 Month Barakah VIP Membership is Active on your account!' 
                          : `${target - completed} more verified friend${(target - completed) === 1 ? '' : 's'} needed`}
                      </p>
                    </div>
                  </div>

                  <span className="text-base font-serif font-bold text-emerald-800">
                    {completed} <span className="text-xs text-secondary font-sans font-normal">/ {target}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-outline/30 relative">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${
                      isUnlocked ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-secondary mt-2 px-0.5">
                  <span>{percent}% Completed</span>
                  {pending > 0 && (
                    <span className="text-amber-700 font-medium">
                      ⏳ {pending} friend{pending === 1 ? '' : 's'} pending profile completion
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS: WhatsApp & Copy */}
              <div className="space-y-2.5">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-700/20 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Share on WhatsApp (1-Tap)</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-outline/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs text-secondary truncate shadow-xs">
                    <span className="truncate select-all font-mono font-medium text-stone-700">
                      {stats?.shareLink || `https://qurb.app/join?ref=${userId}`}
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                      copied 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                        : 'bg-white border-outline hover:bg-stone-50 text-on-surface'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* REWARD HIGHLIGHTS */}
              <div className="bg-white rounded-3xl p-4 border border-outline/60 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-500" />
                  <span>What You Unlock Free For 1 Month:</span>
                </h4>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-stone-800">Unlimited Likes</strong>
                      <span className="text-[10px] text-secondary leading-tight">No daily swipe cap</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-stone-800">+20 Direct Salams</strong>
                      <span className="text-[10px] text-secondary leading-tight">Instant intros without match</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-stone-800">See Who Liked You</strong>
                      <span className="text-[10px] text-secondary leading-tight">Instant reveal in Likes hub</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-stone-800">100% Ad-Free</strong>
                      <span className="text-[10px] text-secondary leading-tight">Clean, distraction-free search</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'friends' ? (
            /* FRIENDS LIST TAB */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-secondary px-1">
                <span>Total Invited: <strong className="text-on-surface">{friends.length}</strong></span>
                <span className="text-emerald-700 font-bold">Verified: {completed}</span>
              </div>

              {friends.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-outline/60 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">No invites yet</h4>
                    <p className="text-xs text-secondary mt-1">
                      Share your link with friends, family or community members looking for marriage.
                    </p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Invite via WhatsApp</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((friend: ReferredFriend) => {
                    const isVerified = friend.status === 'completed';
                    const isDisqualified = friend.status === 'disqualified';

                    return (
                      <div 
                        key={friend.id} 
                        className="bg-white p-3 rounded-2xl border border-outline/60 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isVerified 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isDisqualified 
                                ? 'bg-rose-100 text-rose-800' 
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {friend.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-stone-800 truncate">
                              {friend.name}
                            </span>
                            <span className="text-[10px] text-secondary flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Joined {new Date(friend.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          {isVerified ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified ✅</span>
                            </span>
                          ) : isDisqualified ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200" title={friend.disqualifiedReason || 'Disqualified'}>
                              Flagged 🚩
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 flex items-center gap-1" title="Dost ko bolain photo aur profile mukammal karein">
                              <Clock className="w-3 h-3" />
                              <span>Pending ⏳</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* FAIR RULES & FRAUD EXPLANATION TAB */
            <div className="bg-white rounded-3xl p-5 border border-outline/60 shadow-xs space-y-4 text-xs leading-relaxed text-stone-700">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Halal & Fair Play Rules</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-stone-50 border border-outline/50 space-y-1">
                  <strong className="block text-stone-900 font-bold">1. Genuine Profiles Only:</strong>
                  <p className="text-secondary text-[11px]">
                    Naye member ko kam az kam apni profile details aur 1 picture zaroor upload karni hogi taake invite confirm ho sake.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-outline/50 space-y-1">
                  <strong className="block text-stone-900 font-bold">2. Anti-Fraud Device Check:</strong>
                  <p className="text-secondary text-[11px]">
                    Ek hi phone ya device par bar bar naye accounts bana kar referrals count nahi honge. Har friend ka apna alag device hona zaroori hai.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-outline/50 space-y-1">
                  <strong className="block text-stone-900 font-bold">3. Disposable / Temp Emails Blocked:</strong>
                  <p className="text-secondary text-[11px]">
                    Fake ya 10-minute temporary emails allow nahi hain. Sirf standard verified email accounts count honge.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-outline/50 space-y-1">
                  <strong className="block text-stone-900 font-bold">4. Automatic Instant Unlock:</strong>
                  <p className="text-secondary text-[11px]">
                    Jaise hi aap ke {target} friends criteria poora karenge, aap ke account par 1 Month Barakah VIP khud-ba-khud unlock ho jayega!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-outline/40 flex items-center justify-between shrink-0 px-4">
          <span className="text-[11px] text-secondary flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privacy Guaranteed · Halal Matrimony</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
