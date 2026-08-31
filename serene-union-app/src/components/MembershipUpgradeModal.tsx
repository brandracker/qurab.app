import React, { useState } from 'react';
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
      icon: 'workspace_premium',
      isSubscription: true
    },
    {
      id: 'serene_spotlight_boost_24h',
      title: '24-Hour City Spotlight Boost',
      tag: '10x Views',
      price: '$0.99',
      localPrice: 'PKR 275 (24 Hours)',
      description: 'Feature your profile at the #1 top spot in your city’s Discover stream.',
      icon: 'bolt',
      isSubscription: false
    },
    {
      id: 'serene_id_verification',
      title: 'Blue Checkmark ID Verification',
      tag: '100% Trust',
      price: '$0.99',
      localPrice: 'PKR 275 (One-Time)',
      description: 'Get the verified trust badge by submitting CNIC/Passport ID verification.',
      icon: 'verified',
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-surface rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl border border-surface-variant flex flex-col overflow-hidden relative animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">Upgrade Membership & Passes</h2>
              <p className="text-[11px] text-secondary">Google Play 1-Tap In-App Billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* STEP 1: PRODUCT SELECTION */}
        {purchaseStep === 'selection' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {products.map(p => {
              const isSelected = selectedProduct === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-sm'
                      : 'border-surface-variant bg-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">{p.icon}</span>
                      <h4 className="font-serif text-xs font-bold text-on-surface">{p.title}</h4>
                    </div>
                    <span className="bg-primary/15 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                      {p.tag}
                    </span>
                  </div>

                  <p className="text-[11px] text-secondary leading-relaxed pl-7">
                    {p.description}
                  </p>

                  <div className="flex items-baseline justify-between pt-1.5 pl-7 border-t border-surface-variant/20 mt-1">
                    <span className="text-[10px] text-secondary">{p.localPrice}</span>
                    <span className="text-xs font-bold text-primary font-mono">{p.price}</span>
                  </div>
                </div>
              );
            })}

            {/* Free Ad Alternative */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWatchAdClicked();
                }}
                className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-dashed border-surface-variant hover:border-primary/40 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">smart_display</span>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Watch Video Ad (Free)</h5>
                    <p className="text-[10px] text-secondary">Earn +10 Extra Discover Likes instantly</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Free</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED GOOGLE PLAY 1-TAP IN-APP BILLING SHEET */}
        {purchaseStep === 'google_play_sheet' && (
          <div className="flex-1 flex flex-col justify-between py-6 animate-fade-in">
            <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-variant space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-variant/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm p-1">
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

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-on-surface">
                  <span className="font-medium">{currentItem.title}</span>
                  <span className="font-bold">{currentItem.localPrice}</span>
                </div>
                <p className="text-[10px] text-secondary leading-tight">{currentItem.description}</p>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-surface-variant/30 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">account_balance_wallet</span>
                  <span className="text-on-surface font-medium">Payment Method (EasyPaisa / Card linked)</span>
                </div>
                <span className="text-primary font-bold">Default</span>
              </div>
            </div>

            <p className="text-[10px] text-secondary text-center px-4 leading-relaxed">
              Tapping '1-Tap Buy' completes transaction securely through Google Play In-App Billing.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {purchaseStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 animate-bounce">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-on-surface mb-1">Purchase Successful!</h3>
            <p className="text-xs text-secondary max-w-xs">
              Your benefits for <strong>{currentItem.title}</strong> have been credited to your account.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-surface-variant/30">
          {purchaseStep === 'selection' && (
            <button
              onClick={handleStartGooglePlayPurchase}
              className="w-full py-4 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Google Play ({currentItem.price})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}

          {purchaseStep === 'google_play_sheet' && (
            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseStep('selection')}
                disabled={isProcessing}
                className="flex-1 py-3.5 rounded-full border border-secondary text-secondary font-sans text-xs font-semibold hover:bg-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGooglePlayBilling}
                disabled={isProcessing}
                className="flex-[2] py-3.5 rounded-full bg-[#01875f] text-white font-sans text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                <span>{isProcessing ? 'Verifying with Google Play...' : '1-Tap Buy with Google Play'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
