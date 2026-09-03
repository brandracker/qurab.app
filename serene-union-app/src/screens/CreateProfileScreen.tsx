import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Plus, X, EyeOff, Eye, Check } from 'lucide-react';
import { API_BASE } from '../services/dbService';
import { optimizeImage } from '../utils/imageOptimizer';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Hardware-accelerated client-side compression (1200px Retina HD, ~150KB)
      const optimized = await optimizeImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const photoPayload = optimized || '';
      if (!photoPayload) return;

      const newPhotos = [...photos];
      newPhotos[activeSlot] = photoPayload;
      setPhotos(newPhotos);

      // Fast background sync to Cloudflare R2 if userId exists
      if (userId) {
        fetch(`${API_BASE}/photos/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            photoBase64: photoPayload,
            isPrimary: activeSlot === 0,
            blurByDefault: blurPhotos
          })
        }).catch(err => {
          console.warn('Background photo upload warning:', err);
        });
      }
    } catch (err) {
      console.error('Photo optimization error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
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
            className="w-9 h-9 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 5 of 5</span>
            <span className="text-[11px] text-secondary">· Modesty & Photos</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Photos & Modesty Protection
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Upload up to 6 clear, modest photos. Enable modesty blur to protect your pictures until you mutually approve reveal.
        </p>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {photos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-subtle ${
                p
                  ? 'border-primary bg-white'
                  : 'border-outline bg-white hover:border-primary'
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
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-2 py-0.2 rounded shadow-2xs">
                      Main
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-secondary group-hover:text-primary transition-colors">
                  <div className="w-7 h-7 rounded-full bg-pastel-rose flex items-center justify-center text-primary">
                    {idx === 0 ? <Camera className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] font-semibold">{idx === 0 ? 'Main Photo' : `Slot ${idx + 1}`}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modesty Blur Shield Toggle */}
        <div className="bg-white rounded-2xl p-3.5 border border-outline flex items-center justify-between gap-3 shadow-card">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pastel-rose text-primary flex items-center justify-center shrink-0">
              {blurPhotos ? <EyeOff className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-primary" />}
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
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={isUploading || activePhotos.length === 0}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
        >
          <span>{isUploading ? 'Saving Profile...' : 'Complete Matrimonial Profile 🎉'}</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default CreateProfileScreen;


