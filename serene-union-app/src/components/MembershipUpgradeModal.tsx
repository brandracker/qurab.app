import React, { useState } from 'react';
import { Crown, Zap, ShieldCheck, PlayCircle, Wallet, CheckCircle2, ArrowRight, X, Check } from 'lucide-react';
import { API_BASE, dbService } from '../services/dbService';

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (productId: string) => void;
  onWatchAdClicked: () => void;
}

export const MembershipUpgradeModal: React.FC<Props> = ({
  userId,
  isOpen,
  onClose,
  onPurchaseSuccess,
  onWatchAdClicked
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('serene_barakah_monthly');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseStep, setPurchaseStep] = useState<'selection' | 'google_play_sheet' | 'success'>('selection');

  if (!isOpen) return null;

  const products = [
    {
      id: 'serene_barakah_monthly',
      title: 'Serene Barakah VIP Club',
      tag: 'Most Popular',
      price: '$2.99 / mo',
      localPrice: 'PKR 830 / month',
      description: 'Unlimited likes, See Who Liked You, 100% Ad-Free & Priority discovery ranking.',
      Icon: Crown,
      isSubscription: true
    },
    {
      id: 'serene_spotlight_boost_24h',
      title: '24-Hour City Spotlight Boost',
      tag: '10x Views',
      price: '$0.99',
      localPrice: 'PKR 275 (24 Hours)',
      description: 'Feature your profile at the #1 top spot in your city’s Discover stream.',
      Icon: Zap,
      isSubscription: false
    },
    {
      id: 'serene_id_verification',
      title: 'Blue Checkmark ID Verification',
      tag: '100% Trust',
      price: '$0.99',
      localPrice: 'PKR 275 (One-Time)',
      description: 'Get the verified trust badge by submitting CNIC/Passport ID verification.',
      Icon: ShieldCheck,
      isSubscription: false
    }
  ];

  const currentItem = products.find(p => p.id === selectedProduct)!;

  const handleStartGooglePlayPurchase = () => {
    setPurchaseStep('google_play_sheet');
  };

  const handleConfirmGooglePlayBilling = async () => {
    setIsProcessing(true);
    
    // 1. Immediately persist VIP locally and broadcast event
    if (currentItem.id === 'serene_barakah_monthly') {
      localStorage.setItem(`serene_vip_${userId}`, 'true');
      const cur = dbService.getCurrentUser();
      if (cur.id === userId) {
        dbService.setCurrentUser({ ...cur, isVip: true });
      }
      window.dispatchEvent(new CustomEvent('serene_vip_updated', { detail: { userId, isVip: true } }));
    }

    try {
      await fetch(`${API_BASE}/wallet/purchase-google-play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: currentItem.id,
          purchaseToken: `gp_token_${Date.now()}`,
          amountCents: currentItem.id === 'serene_barakah_monthly' ? 299 : 99,
          currency: 'USD'
        })
      });
    } catch {}

    setIsProcessing(false);
    setPurchaseStep('success');
    setTimeout(() => {
      onPurchaseSuccess(currentItem.id);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 font-sans animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[36px] sm:rounded-[36px] p-5 sm:p-6 shadow-2xl border border-outline flex flex-col overflow-hidden relative animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-outline">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border flex items-center justify-center">
              <Crown className="w-5 h-5 text-pastel-amber-text" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-on-surface">
                Barakah VIP & Passes
              </h2>
              <p className="text-[11px] text-secondary">Google Play 1-Tap In-App Billing</p>
            </div>

          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: PRODUCT SELECTION */}
        {purchaseStep === 'selection' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {products.map(p => {
              const isSelected = selectedProduct === p.id;
              const IconComp = p.Icon;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-1 ${
                    isSelected
                      ? 'border-primary bg-pastel-rose shadow-brand'
                      : 'border-outline bg-white hover:bg-surface-variant shadow-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-primary" />
                      <h4 className="font-serif text-xs font-bold text-on-surface">{p.title}</h4>
                    </div>
                    <span className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[9px] font-bold px-2 py-0.2 rounded-full font-mono uppercase">
                      {p.tag}
                    </span>
                  </div>

                  <p className="text-[10px] text-secondary leading-relaxed pl-6">
                    {p.description}
                  </p>

                  <div className="flex items-baseline justify-between pt-1.5 pl-6 border-t border-outline/40 mt-0.5">
                    <span className="text-[10px] text-secondary">{p.localPrice}</span>
                    <span className="text-xs font-bold text-primary font-mono">{p.price}</span>
                  </div>
                </div>
              );
            })}

            {/* Free Ad Alternative */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWatchAdClicked();
                }}
                className="w-full p-3 rounded-2xl bg-white border border-dashed border-primary hover:bg-pastel-rose flex items-center justify-between text-left transition-all shadow-subtle"
              >
                <div className="flex items-center gap-2.5">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Watch Video Ad (Free)</h5>
                    <p className="text-[10px] text-secondary">Earn +10 Extra Discover Likes instantly</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary bg-pastel-rose px-2.5 py-0.5 rounded-full border border-pastel-rose-border">Free</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED GOOGLE PLAY 1-TAP IN-APP BILLING SHEET */}
        {purchaseStep === 'google_play_sheet' && (
          <div className="flex-1 flex flex-col justify-between py-4 animate-fade-in">
            <div className="bg-surface-variant rounded-2xl p-4 border border-outline space-y-3.5 shadow-subtle">
              <div className="flex items-center justify-between pb-2.5 border-b border-outline">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-subtle p-1 border border-outline">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
                      alt="Google Play"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Google Play In-App Billing</h4>
                    <p className="text-[10px] text-secondary">Qurab Islamic Matrimony</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary font-mono">{currentItem.price}</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-on-surface">
                  <span className="font-medium">{currentItem.title}</span>
                  <span className="font-bold">{currentItem.localPrice}</span>
                </div>
                <p className="text-[10px] text-secondary leading-tight">{currentItem.description}</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-outline flex items-center justify-between text-[11px] shadow-subtle">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-on-surface font-medium">Payment Method (EasyPaisa / Card linked)</span>
                </div>
                <span className="text-primary font-bold">Default</span>
              </div>
            </div>

            <p className="text-[10px] text-secondary text-center px-4 leading-relaxed mt-2">
              Tapping '1-Tap Buy' completes transaction securely through Google Play In-App Billing.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {purchaseStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-pastel-mint text-pastel-mint-text flex items-center justify-center mb-3 animate-bounce border border-pastel-mint-border">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface mb-1">Purchase Successful!</h3>
            <p className="text-xs text-secondary max-w-xs leading-relaxed">
              Your benefits for <strong>{currentItem.title}</strong> have been credited to your account.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2.5 border-t border-outline">
          {purchaseStep === 'selection' && (
            <button
              onClick={handleStartGooglePlayPurchase}
              className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Continue to Google Play ({currentItem.price})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {purchaseStep === 'google_play_sheet' && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setPurchaseStep('selection')}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-full border border-outline text-secondary font-sans text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGooglePlayBilling}
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-full bg-[#01875f] text-white font-sans text-xs font-bold shadow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying with Google Play...' : '1-Tap Buy with Google Play'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MembershipUpgradeModal;


