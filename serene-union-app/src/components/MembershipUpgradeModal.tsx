import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, PlayCircle, Wallet, CheckCircle2, X, Check, Send, Gift, ShieldCheck, Lock } from 'lucide-react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { API_BASE, dbService } from '../services/dbService';
import { facebookEventsService } from '../services/facebookEventsService';
import { backNavigationService } from '../services/backNavigationService';
import { ReferralHubModal } from './ReferralHubModal';

const GooglePlayBilling = registerPlugin<any>('GooglePlayBillingPlugin');

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (productId: string) => void;
  onWatchAdClicked?: () => void;
  onOpenReferral?: () => void;
}

export const MembershipUpgradeModal: React.FC<Props> = ({
  userId,
  isOpen,
  onClose,
  onPurchaseSuccess,
  onWatchAdClicked,
  onOpenReferral
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('qurb_barakah_monthly');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseStep, setPurchaseStep] = useState<'selection' | 'google_play_sheet' | 'success'>('selection');
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    return backNavigationService.register(() => {
      onClose();
      return true;
    });
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleVipUpdated = (e: any) => {
      if (e?.detail?.isVip === false) return;
      onPurchaseSuccess('qurb_barakah_monthly');
      onClose();
    };
    window.addEventListener('serene_vip_updated', handleVipUpdated);

    let sub: any = null;
    if (Capacitor.isNativePlatform()) {
      try {
        sub = (GooglePlayBilling as any).addListener?.('onPurchaseCompleted', async (event: any) => {
          if (event?.productId && (event.productId === 'qurb_barakah_monthly' || event.productId === 'serene_barakah_monthly')) {
            try {
              await fetch(`${API_BASE}/wallet/purchase-google-play`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  productId: event.productId,
                  purchaseToken: event.purchaseToken,
                  orderId: event.orderId,
                  amountCents: 0,
                  currency: 'USD',
                  isTrial: true,
                  durationDays: 7
                })
              });
              await dbService.fetchLikesRemaining(userId);
            } catch (e) {
              console.warn('Auto-sync listener notice:', e);
            }
          }
        });
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('serene_vip_updated', handleVipUpdated);
      if (sub && typeof sub.remove === 'function') sub.remove();
    };
  }, [onClose, userId]);

  if (!isOpen) return null;

  const products = [
    {
      id: 'qurb_barakah_monthly',
      title: 'Qurb Barakah VIP Club',
      tag: '7-Day Free Trial',
      price: '$2.99 / mo',
      localPrice: 'PKR 0 today · then PKR 830/mo',
      description: 'Start with 7 days 100% free: Unlimited likes, Unlimited Undo / Rewind, See Who Liked You, 20 Direct Salams, Zero Ads & Top Priority.',
      Icon: Crown,
      isSubscription: true,
      hasFreeTrial: true
    },
    {
      id: 'qurb_direct_salam_20',
      title: '20 Direct Salam Passes',
      tag: 'Instant Connect',
      price: '$1.99',
      localPrice: 'PKR 550 (20 Passes)',
      description: 'Send 20 direct intro messages to candidates without waiting for a mutual match.',
      Icon: Send,
      isSubscription: false
    },
    {
      id: 'qurb_spotlight_boost_24h',
      title: '24-Hour City Spotlight Boost',
      tag: '10x Views',
      price: '$0.99',
      localPrice: 'PKR 275 (24 Hours)',
      description: 'Feature your profile at the #1 top spot in your city’s Discover stream for 24 hours.',
      Icon: TrendingUp,
      isSubscription: false
    }
  ];

  const currentItem = products.find(p => p.id === selectedProduct)!;
  const currentPriceVal = currentItem.id === 'qurb_barakah_monthly' ? 2.99 : (currentItem.id === 'qurb_direct_salam_20' ? 1.99 : 0.99);

  const handleInitiatePurchase = async () => {
    facebookEventsService.logInitiateCheckout(currentItem.id, currentPriceVal, 'USD');
    if (Capacitor.isNativePlatform()) {
      await handleConfirmGooglePlayBilling();
    } else {
      setIsProcessing(true);
      try {
        const successUrl = `${window.location.origin}/?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${window.location.origin}/?stripe_status=cancelled`;

        const res = await fetch(`${API_BASE}/wallet/stripe/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: currentItem.id,
            successUrl,
            cancelUrl
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          console.warn('Google Pay session fallback:', data?.error);
          await handleConfirmGooglePlayBilling();
        }
      } catch (err: any) {
        console.warn('Google Pay session network error, fallback to simulated checkout:', err);
        await handleConfirmGooglePlayBilling();
      }
    }
  };

  const handleConfirmGooglePlayBilling = async () => {
    setIsProcessing(true);
    let purchaseToken = `gp_token_${Date.now()}`;
    let orderId: string | null = null;

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await GooglePlayBilling.launchBillingFlow({
          productId: currentItem.id,
          productType: currentItem.isSubscription ? 'subs' : 'inapp',
          userId,
          preferTrial: Boolean(currentItem.hasFreeTrial)
        });

        if (result?.userCancelled) {
          setIsProcessing(false);
          return;
        }

        if (result?.success || result?.alreadyOwned) {
          purchaseToken = result.purchaseToken || purchaseToken;
          orderId = result.orderId || null;
        } else {
          alert(result?.message || 'Google Play billing was not completed. Please try again.');
          setIsProcessing(false);
          return;
        }
      } catch (err: any) {
        console.warn('Native Google Play billing error, fallback mode:', err);
        // If testing on desktop / browser or developer environment without Play Store
        if (Capacitor.isNativePlatform()) {
          try {
            const restored = await (GooglePlayBilling as any).restorePurchases?.();
            if (restored?.hasActiveSubscription && restored.purchaseToken) {
              purchaseToken = restored.purchaseToken;
              orderId = restored.orderId || null;
            } else {
              alert(err.message || 'Google Play payment failed. Please check your internet or Google account.');
              setIsProcessing(false);
              return;
            }
          } catch {
            alert(err.message || 'Google Play payment failed. Please check your internet or Google account.');
            setIsProcessing(false);
            return;
          }
        }
      }
    }
    
    // Log Meta App Events for Purchase & Subscription
    if (currentItem.isSubscription) {
      facebookEventsService.logSubscribe('barakah_vip', currentPriceVal, 'USD');
    }
    facebookEventsService.logPurchase(currentPriceVal, 'USD', currentItem.id);

    try {
      const res = await fetch(`${API_BASE}/wallet/purchase-google-play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: currentItem.id,
          purchaseToken,
          orderId,
          amountCents: currentItem.hasFreeTrial ? 0 : (currentItem.id === 'serene_barakah_monthly' || currentItem.id === 'qurb_barakah_monthly' ? 299 : 99),
          currency: 'USD',
          isTrial: Boolean(currentItem.hasFreeTrial),
          durationDays: currentItem.hasFreeTrial ? 7 : 30
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data?.error || 'Failed to confirm purchase with server. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Persist VIP locally only AFTER server confirmation
      if (currentItem.id === 'serene_barakah_monthly' || currentItem.id === 'qurb_barakah_monthly') {
        localStorage.setItem(`serene_vip_${userId}`, 'true');
        const cur = dbService.getCurrentUser();
        if (cur.id === userId) {
          dbService.setCurrentUser({ ...cur, isVip: true });
        }
        window.dispatchEvent(new CustomEvent('serene_vip_updated', { detail: { userId, isVip: true } }));
      }

      await dbService.fetchLikesRemaining(userId);
      setIsProcessing(false);
      setPurchaseStep('success');
      setTimeout(() => {
        onPurchaseSuccess(currentItem.id);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Purchase confirmation error:', err);
      alert('Network error confirming purchase with server. Please check your connection.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 font-sans animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white dark:bg-[#121218] rounded-t-[36px] sm:rounded-[36px] p-5 sm:p-6 shadow-2xl border border-slate-100 dark:border-[#272733] flex flex-col overflow-hidden relative animate-slide-up">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 -left-10 w-44 h-44 bg-rose-400/8 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#272733] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-amber-600/20 text-amber-600 border border-amber-300/60 dark:border-amber-500/40 shadow-xs flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Barakah VIP & Passes
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Google Play 1-Tap In-App Billing</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-700/50 px-2 py-0.2 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Secure</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1c1c24] hover:bg-slate-200 dark:hover:bg-[#252532] border border-slate-200/80 dark:border-[#272733] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: PRODUCT SELECTION */}
        {purchaseStep === 'selection' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 relative z-10 no-scrollbar">
            {products.map(p => {
              const isSelected = selectedProduct === p.id;
              const IconComp = p.Icon;
              const isVipClub = p.id === 'qurb_barakah_monthly';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-1.5 ${
                    isSelected
                      ? isVipClub
                        ? 'border-2 border-primary bg-gradient-to-br from-rose-50/70 via-white to-amber-50/30 dark:from-rose-950/40 dark:via-[#191418] dark:to-amber-950/30 shadow-[0_4px_20px_rgba(244,63,94,0.12)] ring-1 ring-primary/20'
                        : 'border-2 border-primary bg-rose-50/30 dark:bg-rose-950/30 shadow-[0_4px_16px_rgba(244,63,94,0.1)] ring-1 ring-primary/20'
                      : 'border-slate-200/90 dark:border-[#272733] bg-white dark:bg-[#16161c] hover:bg-slate-50/80 dark:hover:bg-[#1c1c24] hover:border-slate-300 dark:hover:border-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                  } group`}
                >
                  {isVipClub && (
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full shadow-xs tracking-wider uppercase flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 text-amber-100 fill-amber-100" />
                      <span>RECOMMENDED</span>
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Selection Checkmark Radio */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected 
                          ? 'bg-primary text-white shadow-2xs' 
                          : 'border-2 border-slate-300 dark:border-[#353545] group-hover:border-slate-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isVipClub 
                          ? 'bg-rose-100/80 dark:bg-rose-950/50 text-primary dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/40' 
                          : p.id === 'qurb_direct_salam_20'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40'
                            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-900/40'
                      }`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-white truncate">{p.title}</h4>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wide shrink-0 ${
                      isVipClub
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-400 shadow-2xs'
                        : p.id === 'qurb_direct_salam_20'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 shadow-2xs'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/40 shadow-2xs'
                    }`}>
                      {p.tag}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    {p.description}
                  </p>

                  <div className="flex items-baseline justify-between pt-2 pl-7 border-t border-slate-100 dark:border-[#272733] mt-0.5">
                    <span className={`text-[10px] font-semibold ${
                      isVipClub && isSelected 
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-700/50' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {p.localPrice}
                    </span>
                    <span className="text-xs font-bold text-primary dark:text-rose-400 font-mono">{p.price}</span>
                  </div>
                </div>
              );
            })}

            {/* Free Ad Alternative */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onWatchAdClicked) onWatchAdClicked();
                }}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#16161c] border border-dashed border-rose-300 dark:border-rose-900/60 hover:border-primary hover:bg-rose-50/40 dark:hover:bg-[#1c1c24] flex items-center justify-between text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-primary border border-rose-100 dark:border-rose-900/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <PlayCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Watch Video Ad (Free)</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Earn +10 Extra Discover Likes instantly</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800/40 shadow-2xs group-hover:bg-primary group-hover:text-white transition-all">
                  Free
                </span>
              </button>
            </div>

            {/* Free Referral Alternative */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenReferral) {
                    onClose();
                    onOpenReferral();
                  } else {
                    setShowReferralModal(true);
                  }
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 dark:from-emerald-950/40 dark:via-[#101c16] dark:to-teal-950/30 border border-emerald-200/90 dark:border-emerald-700/50 hover:border-emerald-400 flex items-center justify-between text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                      <span>Invite Friends (1 Month VIP Free)</span>
                      <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                    </h5>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300/90">Invite 30 genuine friends to earn 1 month Barakah VIP free</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/50 shadow-2xs">
                  0 PKR
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED GOOGLE PLAY 1-TAP IN-APP BILLING SHEET */}
        {purchaseStep === 'google_play_sheet' && (
          <div className="flex-1 flex flex-col justify-between py-4 animate-fade-in relative z-10">
            <div className="bg-slate-50/90 dark:bg-[#181822] rounded-2xl p-4 border border-slate-200/80 dark:border-[#272733] space-y-3.5 shadow-subtle">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-[#272733]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#121218] flex items-center justify-center shadow-subtle p-1.5 border border-slate-200 dark:border-[#272733]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
                      alt="Google Play"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Google Play In-App Billing</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Qurb Islamic Matrimony</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary dark:text-rose-400 font-mono">{currentItem.price}</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-900 dark:text-white">
                  <span className="font-semibold">{currentItem.title}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{currentItem.localPrice}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{currentItem.description}</p>
              </div>

              <div className="bg-white dark:bg-[#121218] p-3 rounded-xl border border-slate-200/80 dark:border-[#272733] flex items-center justify-between text-[11px] shadow-2xs">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">Payment Method (EasyPaisa / Card linked)</span>
                </div>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-700/50 text-[10px]">Active</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center px-4 leading-relaxed mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline shrink-0" />
              <span>Tapping '1-Tap Buy' completes transaction securely through Google Play In-App Billing.</span>
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {purchaseStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in relative z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 animate-bounce border-2 border-emerald-200 dark:border-emerald-700/50 shadow-md">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">Purchase Successful!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
              Your benefits for <strong>{currentItem.title}</strong> have been credited to your account.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#272733] space-y-2 relative z-10">
          {purchaseStep === 'selection' && (
            <>
              <button
                onClick={handleInitiatePurchase}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-rose-600 dark:via-primary dark:to-rose-700 text-white font-sans text-xs font-bold shadow-lg shadow-slate-900/25 dark:shadow-rose-900/30 hover:from-black hover:to-black active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-slate-700/80 dark:border-rose-500/50"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
                  alt="Google Pay"
                  className="w-4 h-4 object-contain"
                />
                <span>
                  {isProcessing
                    ? 'Connecting to Google...'
                    : currentItem.isSubscription
                      ? 'Start 7-Day Free Trial ($0 Today)'
                      : Capacitor.isNativePlatform()
                        ? `Google Play 1-Tap Buy (${currentItem.price})`
                        : `Pay with Google Pay (${currentItem.price})`
                  }
                </span>
              </button>
              <p className="text-[10px] text-slate-500 text-center leading-tight flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600 shrink-0 inline" />
                <span>
                  {currentItem.isSubscription
                    ? '7 days 100% free · Then PKR 830/month · Cancel anytime in Google Play Subscriptions'
                    : 'Instant activation · 256-bit encrypted secure checkout via Google'}
                </span>
              </p>
            </>
          )}

          {purchaseStep === 'google_play_sheet' && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setPurchaseStep('selection')}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-sans text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGooglePlayBilling}
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-2xl bg-[#01875f] text-white font-sans text-xs font-bold shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying with Google Play...' : '1-Tap Buy with Google Play'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ReferralHubModal
        userId={userId}
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        onVipUnlocked={() => {
          onPurchaseSuccess('qurb_barakah_monthly');
          setShowReferralModal(false);
          onClose();
        }}
      />
    </div>
  );
};
export default MembershipUpgradeModal;


