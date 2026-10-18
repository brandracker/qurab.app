import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Plus, X, EyeOff, Eye, Check, AlertCircle } from 'lucide-react';
import { API_BASE } from '../services/dbService';
import { optimizeImage } from '../utils/imageOptimizer';

interface Props {
  userId?: string;
  initialPhotos?: string[];
  initialBlurPhotos?: boolean;
  isEditMode?: boolean;
  onBack: () => void;
  onComplete: (data: { blurPhotos: boolean; photos: string[] }) => void;
}

export const CreateProfileScreen: React.FC<Props> = ({ 
  userId = '',
  initialPhotos = [],
  initialBlurPhotos = false,
  isEditMode = false,
  onBack, 
  onComplete 
}) => {
  const [blurPhotos, setBlurPhotos] = useState<boolean>(initialBlurPhotos);
  const [photoError, setPhotoError] = useState<string | null>(null);
  
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
    setPhotoError(null);
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
        })
          .then(res => res.json())
          .then(data => {
            if (data?.success && data?.photoUrl) {
              setPhotos(prev => {
                const copy = [...prev];
                copy[activeSlot] = data.photoUrl;
                return copy;
              });
            }
          })
          .catch(err => {
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
    if (activePhotos.length === 0 && !isEditMode) {
      setPhotoError('Photo Required: Please upload at least 1 clear profile photo, or click "Skip photo for now" below.');
      const el = document.getElementById('photo-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setPhotoError(null);
    onComplete({
      blurPhotos,
      photos: activePhotos
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-[#FF2560] via-[#F31A56] to-[#DE0E46] font-sans overflow-y-auto pb-24 select-none text-white transition-all">
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
        <div className="flex items-center justify-between mb-3 pt-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white text-[#FF2560] flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            <span className="text-[11px] font-bold text-white tracking-wider uppercase">Step 5 of 5</span>
            <span className="text-[11px] font-medium text-white/90">· Modesty & Photos</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-4 px-0.5">
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-y-110" />
        </div>

        <div className="px-1 mb-2">
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
            Photos & Modesty Protection
          </h1>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Upload up to 6 clear, modest photos. Enable modesty blur to protect your pictures until you mutually approve reveal.
          </p>
        </div>

        {/* Photo Required Error Banner */}
        {photoError && (
          <div className="p-3.5 rounded-2xl bg-white text-rose-700 text-xs font-bold flex items-center gap-2 mb-4 shadow-lg border border-rose-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{photoError}</span>
          </div>
        )}

        {/* Floating White Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
          {/* 6 Photo Grid */}
          <div id="photo-grid" className="grid grid-cols-3 gap-2.5">
          {photos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-subtle ${
                p
                  ? 'border-primary bg-white'
                  : photoError
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200 animate-pulse'
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
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${photoError ? 'bg-rose-100 text-rose-600' : 'bg-pastel-rose text-primary'}`}>
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
    </div>

      {/* Submit Button */}
      <div className="pt-5 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full py-3.5 rounded-full bg-white text-[#FF2560] font-sans text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{isUploading ? 'Saving Profile...' : (isEditMode ? 'Update Matrimonial Profile 🎉' : 'Complete Matrimonial Profile 🎉')}</span>
          <Check className="w-4 h-4 stroke-[2.5]" />
        </button>

        {activePhotos.length === 0 && (
          <button
            type="button"
            onClick={() => {
              setPhotoError(null);
              onComplete({
                blurPhotos,
                photos: []
              });
            }}
            className="w-full py-2 text-[11px] font-semibold text-white/80 hover:text-white transition-colors text-center cursor-pointer"
          >
            Skip photo for now (Upload later from My Profile)
          </button>
        )}
      </div>
    </div>
  );
};
export default CreateProfileScreen;


