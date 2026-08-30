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
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-32">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        {/* Header & Progress */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Step 5 of 5</span>
          <div className="w-10" />
        </div>

        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mb-6">
          <div className="bg-primary h-full w-[100%] transition-all duration-300" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Photos & Modesty Protection
        </h1>
        <p className="text-xs text-secondary mb-6 leading-relaxed">
          Upload up to 6 clear, modest photos. Enable modesty blur to protect your pictures until you mutually approve reveal.
        </p>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {photos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                p
                  ? 'border-primary/40 bg-surface shadow-sm'
                  : 'border-surface-variant bg-surface-container-low hover:bg-surface-variant/40'
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
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                      Main
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-outline group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">
                    {idx === 0 ? 'add_a_photo' : 'add'}
                  </span>
                  <span className="text-[10px] font-medium">{idx === 0 ? 'Main Photo' : `Slot ${idx + 1}`}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modesty Blur Shield Toggle */}
        <div className="bg-surface-container-high rounded-2xl p-4 border border-surface-variant flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {blurPhotos ? 'visibility_off' : 'visibility'}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Modesty Shield (Blur Photos)</h4>
              <p className="text-[11px] text-secondary mt-0.5">
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
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
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
          className="w-full py-4 rounded-full bg-primary text-on-primary font-sans text-xs font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        >
          <span>{isUploading ? 'Uploading to Cloudflare...' : 'Complete Matrimonial Profile 🎉'}</span>
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    </div>
  );
};
