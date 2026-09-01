import React, { useState, useRef } from 'react';
import { API_BASE } from '../services/dbService';

interface Props {
  userId?: string;
  initialPhotos?: string[];
  initialBlurPhotos?: boolean;
  onBack: () => void;
  onComplete: (data: { blurPhotos: boolean; photos: string[] }) => void;
}

export const CreateProfileScreen: React.FC<Props> = ({ 
  userId = '',
  initialPhotos = [],
  initialBlurPhotos = true,
  onBack, 
  onComplete 
}) => {
  const [blurPhotos, setBlurPhotos] = useState<boolean>(initialBlurPhotos);
  
  // Fill 6 slots with initial photos or empty strings
  const [photos, setPhotos] = useState<string[]>(() => {
    const arr = ['', '', '', '', '', ''];
    if (initialPhotos && initialPhotos.length > 0) {
      for (let i = 0; i < Math.min(initialPhotos.length, 6); i++) {
        arr[i] = initialPhotos[i];
      }
    }
    return arr;
  });

  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSlotClick = (index: number) => {
    setActiveSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const newPhotos = [...photos];
      newPhotos[activeSlot] = result;
      setPhotos(newPhotos);

      // Async upload to Cloudflare R2 if userId exists
      if (userId) {
        try {
          await fetch(`${API_BASE}/photos/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              photoBase64: result,
              isPrimary: activeSlot === 0,
              blurByDefault: blurPhotos
            })
          });
        } catch (err) {
          console.error('Photo upload error:', err);
        }
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPhotos = [...photos];
    newPhotos[index] = '';
    setPhotos(newPhotos);
  };

  const activePhotos = photos.filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      blurPhotos,
      photos: activePhotos
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-28 select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 5 of 5</span>
            <span className="text-[11px] text-secondary">· Modesty & Photos</span>
          </div>
          <div className="w-10" />
        </div>

        {/* 5-Step Glowing Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-emerald" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Photos & Modesty Protection
        </h1>
        <p className="text-xs text-secondary mb-5 leading-relaxed">
          Upload up to 6 clear, modest photos. Enable modesty blur to protect your pictures until you mutually approve reveal.
        </p>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {photos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xs ${
                p
                  ? 'border-primary/50 bg-surface'
                  : 'border-surface-variant bg-surface hover:border-primary/40'
              }`}
            >
              {p ? (
                <>
                  <img
                    src={p}
                    alt={`Slot ${idx + 1}`}
                    className={`w-full h-full object-cover transition-all ${
                      blurPhotos ? 'filter blur-sm scale-105' : ''
                    }`}
                  />
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemovePhoto(idx, e)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-error transition-colors z-10"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Main
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-secondary group-hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      {idx === 0 ? 'add_a_photo' : 'add'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold">{idx === 0 ? 'Main Photo' : `Slot ${idx + 1}`}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modesty Blur Shield Toggle */}
        <div className="bg-surface rounded-2xl p-4 border border-surface-variant/80 flex items-center justify-between gap-3 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/15 text-accent-gold-dark flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                {blurPhotos ? 'visibility_off' : 'visibility'}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Modesty Shield (Blur Photos)</h4>
              <p className="text-[10px] text-secondary mt-0.5 leading-tight">
                {blurPhotos
                  ? 'Photos remain blurred until you approve reveal to a match.'
                  : 'Photos are visible to verified members on Discover.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBlurPhotos(!blurPhotos)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors relative ${
              blurPhotos ? 'bg-primary' : 'bg-surface-variant'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                blurPhotos ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={isUploading || activePhotos.length === 0}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 disabled:opacity-40 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span className="gold-shimmer absolute inset-0 opacity-40 pointer-events-none" />
          <span>{isUploading ? 'Saving Profile...' : 'Complete Matrimonial Profile 🎉'}</span>
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    </div>
  );
};
export default CreateProfileScreen;

