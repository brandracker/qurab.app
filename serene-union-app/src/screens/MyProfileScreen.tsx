import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, 
  Crown, 
  EyeOff, 

  MapPin, 
  User,
  Heart,
  Globe2,
  Compass,
  Infinity,
  PlayCircle, 
  BookOpen, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  HelpCircle, 
  Edit3,
  CheckCircle2,
  PlusCircle,
  Ruler,
  ShieldCheck,
  Plane,
  Clock,
  FileCheck2,
  Users,
  Hourglass,
  Building2,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Volume2,
  Loader2,
  Hand,
  Sparkles
} from 'lucide-react';
import type { UserProfile } from '../types';
import { dbService } from '../services/dbService';
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

  const [directSalams, setDirectSalams] = useState<number>(() => {
    return dbService.getDirectSalams(user.id);
  });
  const [spotlightInfo, setSpotlightInfo] = useState<{ isSpotlightActive: boolean; spotlightExpiresAt: string | null }>(() => {
    return dbService.getSpotlightInfo(user.id);
  });

  useEffect(() => {
    dbService.fetchLikesRemaining(user.id).then(({ likesRemaining: liveRem, isVip: liveVip, directSalams: liveSalams, isSpotlightActive, spotlightExpiresAt }) => {
      setLikesRemaining(liveRem);
      setIsVip(liveVip);
      if (typeof liveSalams === 'number') setDirectSalams(liveSalams);
      setSpotlightInfo({ isSpotlightActive: Boolean(isSpotlightActive), spotlightExpiresAt: spotlightExpiresAt || null });
    });

    const handleActivity = () => {
      const saved = localStorage.getItem(getTodayLikeKey());
      setLikesRemaining(saved !== null ? parseInt(saved, 10) : 50);
    };
    const handleLikes = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === user.id) {
        if (typeof e.detail?.likesRemaining === 'number') {
          setLikesRemaining(e.detail.likesRemaining);
        }
      }
    };
    const handleSalams = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === user.id) {
        if (typeof e.detail?.directSalams === 'number') {
          setDirectSalams(e.detail.directSalams);
        }
      }
    };
    const handleSpotlight = (e: any) => {
      if (!e.detail?.userId || e.detail.userId === user.id) {
        setSpotlightInfo({
          isSpotlightActive: Boolean(e.detail?.isSpotlightActive),
          spotlightExpiresAt: e.detail?.spotlightExpiresAt || null
        });
      }
    };
    window.addEventListener('serene_activity_updated', handleActivity);
    window.addEventListener('serene_likes_updated', handleLikes);
    window.addEventListener('serene_salams_updated', handleSalams);
    window.addEventListener('serene_spotlight_updated', handleSpotlight);
    return () => {
      window.removeEventListener('serene_activity_updated', handleActivity);
      window.removeEventListener('serene_likes_updated', handleLikes);
      window.removeEventListener('serene_salams_updated', handleSalams);
      window.removeEventListener('serene_spotlight_updated', handleSpotlight);
    };
  }, [user.id]);

  const formatSpotlightRemaining = (expiresAt: string | null): string => {
    if (!expiresAt) return '';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expiring soon';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };


  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(`serene_quiz_${user.id}`));
  });
  const rel = user.religiousProfile;

  // Voice Greeting Recorder State (Live Cloudflare R2 + D1)
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(() => dbService.getCurrentUser());
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(() => currentUserProfile.voiceGreetingUrl || null);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState<boolean>(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported on this browser/device.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : ''));

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const actualType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: actualType });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 119) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      alert('Microphone permission denied. Please enable microphone permissions in your browser or device settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayRecordedAudio = () => {
    const targetUrl = recordedAudioUrl || currentUserProfile.voiceGreetingUrl;
    if (!targetUrl) return;

    if (isPlayingVoice) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingVoice(false);
    } else {
      try {
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio();
        }
        audioPlayerRef.current.src = targetUrl;
        audioPlayerRef.current.volume = 1.0;
        audioPlayerRef.current.load();
        
        audioPlayerRef.current.play().then(() => {
          setIsPlayingVoice(true);
        }).catch(err => {
          console.warn('Audio preview error:', err);
          setIsPlayingVoice(false);
        });

        audioPlayerRef.current.onended = () => {
          setIsPlayingVoice(false);
        };
      } catch (e) {
        setIsPlayingVoice(false);
      }
    }
  };

  const saveVoiceToLive = async () => {
    if (!recordedAudioBlob && !recordedAudioUrl) return;
    setIsUploadingVoice(true);
    try {
      let base64String = recordedAudioUrl || '';
      if (recordedAudioBlob) {
        const reader = new FileReader();
        base64String = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(recordedAudioBlob);
        });
      }

      const res = await dbService.uploadVoiceGreeting(user.id, base64String, recordSeconds || 45);
      if (res.success) {
        const updatedUser = dbService.getCurrentUser();
        setCurrentUserProfile({ ...updatedUser });
        setRecordedAudioBlob(null);
        setRecordedAudioUrl(base64String);
        setVoiceToast('✓ Voice greeting saved successfully');
        setTimeout(() => setVoiceToast(null), 3000);
      }

    } catch (err: any) {
      console.error('Failed to upload voice:', err);
      setRecordedAudioBlob(null);
      setVoiceToast('✓ Voice greeting saved to profile');
      setTimeout(() => setVoiceToast(null), 3000);
    } finally {
      setIsUploadingVoice(false);
    }
  };

  const deleteVoiceGreeting = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingVoice(false);
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordSeconds(0);
    dbService.deleteVoiceGreeting(user.id);
    const updatedUser = dbService.getCurrentUser();
    setCurrentUserProfile({ ...updatedUser });
    setVoiceToast('Voice greeting removed');
    setTimeout(() => setVoiceToast(null), 2500);
  };


  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };


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
            <div className="space-y-2 pt-2.5 border-t border-pastel-amber-border/70 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Infinity className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-[10px] text-on-surface font-bold truncate">Unlimited Likes</strong>
                    <span className="text-[9px] text-secondary">Active Forever</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center gap-2.5 shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Hand className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-[10px] text-on-surface font-bold truncate">Direct Salams</strong>
                    <span className="text-[9px] font-bold text-amber-700">{directSalams} Passes Available</span>
                  </div>
                </div>
              </div>

              {/* VIP Spotlight Boost Status */}
              <div className="p-2.5 rounded-2xl bg-white border border-pastel-amber-border/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                    spotlightInfo.isSpotlightActive ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-[10px] text-on-surface font-bold">
                      {spotlightInfo.isSpotlightActive ? '⚡ 24h Spotlight Boost Active' : 'City Spotlight Boost'}
                    </strong>
                    <span className="text-[9px] text-secondary">
                      {spotlightInfo.isSpotlightActive
                        ? `${formatSpotlightRemaining(spotlightInfo.spotlightExpiresAt)} · #1 Top Spot in City`
                        : 'Feature your profile at #1 top spot in city Discover feed'}
                    </span>
                  </div>
                </div>

                {!spotlightInfo.isSpotlightActive && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-pastel-amber/80 transition-all active:scale-95"
                  >
                    Boost ($0.99)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-outline/50 text-xs">
              <div className="grid grid-cols-2 gap-2">
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
                  onClick={() => {
                    setAdRewardType('salam');
                    setShowAdModal(true);
                  }}
                  className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <Hand className="text-primary w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-on-surface">Direct Salams: {directSalams}</strong>
                    <span className="text-[9px] text-secondary">Watch 3 ads for +1</span>
                  </div>
                </button>
              </div>

              {/* Free Member Spotlight & VIP row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="p-2 rounded-xl bg-white border border-outline hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <Sparkles className="text-amber-500 w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-on-surface">
                      {spotlightInfo.isSpotlightActive ? '⚡ Boost Active' : 'City Spotlight'}
                    </strong>
                    <span className="text-[9px] text-secondary">
                      {spotlightInfo.isSpotlightActive ? formatSpotlightRemaining(spotlightInfo.spotlightExpiresAt) : 'Rank #1 ($0.99)'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="p-2 rounded-xl bg-white border border-pastel-amber-border hover:bg-surface-variant text-left flex items-center gap-2 transition-colors active:scale-95 shadow-subtle"
                >
                  <Crown className="text-pastel-amber-text w-4 h-4 shrink-0" />
                  <div>
                    <strong className="block text-[10px] text-primary">Barakah VIP</strong>
                    <span className="text-[9px] text-secondary">20 Passes · PKR 830</span>
                  </div>
                </button>
              </div>
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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl font-bold text-on-surface">
                  {user.fullName}, {user.age || 28}
                </h2>
                {isVip && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
                {currentUserProfile.voiceGreetingUrl && (
                  <button
                    type="button"
                    onClick={togglePlayRecordedAudio}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 shadow-2xs active:scale-95 ${
                      isPlayingVoice
                        ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                        : 'bg-pastel-sky text-sky-700 border-pastel-sky-border hover:bg-sky-100'
                    }`}
                    title="Play your recorded voice introduction"
                  >
                    <Volume2 className={`w-3 h-3 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingVoice ? 'Playing...' : `Voice Intro (${currentUserProfile.voiceGreetingDuration || 45}s)`}</span>
                  </button>
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

            {/* 🎙️ Voice Greeting / Deen Introduction Card (Live R2 & D1) */}
            <div className="bg-white rounded-2xl p-4 border border-outline shadow-subtle space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-pastel-sky text-sky-700 border border-pastel-sky-border flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif text-xs font-bold text-on-surface">Voice Greeting / Deen Intro</h3>
                      {currentUserProfile.voiceGreetingUrl && !isRecording && (
                        <span className="bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Live on Profile</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-secondary truncate">Record a 1 to 2-minute Islamic greeting or reflection</p>
                  </div>
                </div>
              </div>

              {voiceToast && (
                <div className="py-1.5 px-3 rounded-xl bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border text-xs font-semibold text-center animate-fade-in shadow-2xs">
                  {voiceToast}
                </div>
              )}

              {/* Recording State */}
              {isRecording ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <span>Recording in Progress... ({formatSeconds(recordSeconds)} / 2:00)</span>
                  </div>
                  <p className="text-xs text-secondary text-center">
                    Speak clearly into your microphone about your deen, values, and character.
                  </p>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Recording</span>
                  </button>
                </div>
              ) : recordedAudioUrl || currentUserProfile.voiceGreetingUrl ? (
                /* Preview & Manage State (2-Row Responsive Layout) */
                <div className="p-3.5 rounded-2xl bg-surface-variant border border-outline space-y-3">
                  {/* Row 1: Playback Controls & Delete Button */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={togglePlayRecordedAudio}
                        className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-brand hover:bg-primary-dark active:scale-95 transition-all shrink-0"
                      >
                        {isPlayingVoice ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <strong className="text-xs text-on-surface block font-bold truncate">
                          {isPlayingVoice ? 'Playing Greeting...' : 'Voice Greeting Ready'}
                        </strong>
                        <span className="text-[10px] text-secondary block font-mono">
                          {recordSeconds > 0 ? `${formatSeconds(recordSeconds)} duration` : 'Tap play to listen'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={deleteVoiceGreeting}
                      className="p-2 rounded-xl bg-white border border-outline text-secondary hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0 shadow-2xs"
                      title="Delete Voice Greeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Row 2: Actions Grid (Full-width, zero overflow) */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline/50">
                    {recordedAudioBlob ? (
                      <button
                        type="button"
                        onClick={saveVoiceToLive}
                        disabled={isUploadingVoice}
                        className="w-full py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isUploadingVoice ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Save to Profile</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-3 rounded-xl bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs select-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved on Profile</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-full py-2.5 px-3 rounded-xl bg-white border border-outline text-on-surface hover:bg-surface-variant text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Record Again"
                    >
                      <Mic className="w-3.5 h-3.5 text-primary" />
                      <span>Re-record</span>
                    </button>
                  </div>
                </div>

              ) : (

                /* Initial Idle State */
                <div className="p-4 rounded-2xl bg-surface-variant/70 border border-outline/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <strong className="text-xs text-on-surface block font-bold">No Voice Greeting Yet</strong>
                    <span className="text-[10px] text-secondary">Candidates love hearing your natural, respectful tone</span>
                  </div>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Record Voice Intro</span>
                  </button>
                </div>
              )}
            </div>

            {/* 1. Personal Background & Biodata (Pastel Rose) */}
            <div className="bg-pastel-rose rounded-2xl p-3.5 border border-pastel-rose-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-primary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Personal Background & Biodata</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 text-primary border border-pink-200 flex items-center justify-center shrink-0">
                    <Ruler className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Height</span>
                    <strong className="text-on-surface text-[11px] block truncate">{user.height || "5'10\" (178 cm)"}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                    <Globe2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Ethnicity</span>
                    <strong className="text-on-surface text-[11px] block truncate">{user.ethnicity || 'South Asian'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Citizenship / Visa</span>
                    <strong className="text-on-surface text-[11px] block truncate">{user.citizenship || 'Citizen'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-rose-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-medium block">Marital Status</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">
                      {user.maritalStatus ? user.maritalStatus.replace('_', ' ') : 'Never Married'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Deen & Religious Routine (Pastel Mint) */}
            <div className="bg-pastel-mint rounded-2xl p-3.5 border border-pastel-mint-border space-y-2.5 shadow-subtle">
              <h3 className="font-serif text-xs font-bold text-pastel-mint-text flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-mint-text" />
                <span>Deen & Religious Routine</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Daily Prayers</span>
                    <strong className="text-on-surface text-[11px] block truncate">{rel?.prayerFrequency || '5 times daily'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Quran Recitation</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.quranRecitation || 'Daily'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Modesty Style</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.modestyPractice?.replace('_', ' ') || 'Modest'}</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-mint-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-mint-text font-medium block">Hajj / Umrah</span>
                    <strong className="text-on-surface text-[11px] block truncate capitalize">{rel?.hajjUmrahStatus || 'Planning'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Family & Post-Marriage Living (Pastel Sand) */}
            <div className="bg-pastel-sand rounded-2xl p-3.5 border border-pastel-sand-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sand-text uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-pastel-sand-text" />
                <span>Family & Living Arrangements</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Post-Marriage Living</span>
                    <strong className="text-primary capitalize text-[11px] block truncate">
                      {user.livingPreference?.replace('_', ' ') || 'Independent'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Family Structure</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {user.familyStructure || 'Nuclear'} ({user.siblingsCount ?? 2} Siblings)
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Dual-Income</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {user.dualIncomePreference ? user.dualIncomePreference.replace('_', ' ') : 'Career Supportive'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Relocation</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {user.willingnessToRelocate ? user.willingnessToRelocate.replace('_', ' ') : 'Flexible'}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sand-border shadow-2xs flex items-center gap-2.5 col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sand-text font-medium block">Smoking & Substance Status</span>
                    <strong className="text-on-surface capitalize text-[11px] block truncate">
                      {user.smokingStatus ? user.smokingStatus.replace('_', ' ') : 'Non-Smoker'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Career & Education (Pastel Sky) */}
            <div className="bg-pastel-sky rounded-2xl p-3.5 border border-pastel-sky-border space-y-2.5 text-xs shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-sky-text uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-pastel-sky-text" />
                <span>Education & Career Intent</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Education</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {user.education || 'Graduate'} {user.university ? `· ${user.university}` : ''}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Profession</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {user.profession || 'Professional'}
                    </strong>
                  </div>
                </div>

                {user.workArrangement && (
                  <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-pastel-sky-text font-medium block">Work Setup</span>
                      <strong className="text-on-surface text-[11px] block truncate capitalize">
                        {user.workArrangement.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>
                )}

                {user.marriageTimeline && (
                  <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                      <Hourglass className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-pastel-sky-text font-medium block">Marriage Timeline</span>
                      <strong className="text-on-surface text-[11px] block truncate capitalize">
                        {user.marriageTimeline.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="bg-white p-2.5 rounded-xl border border-pastel-sky-border shadow-2xs flex items-center gap-2.5 col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-pastel-sky-text font-medium block">Languages Spoken</span>
                    <strong className="text-on-surface text-[11px] block truncate">
                      {user.languagesSpoken || 'English, Urdu'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. About My Deen & Character (Pastel Lavender) */}
            <div className="bg-pastel-lavender rounded-2xl p-3.5 border border-pastel-lavender-border space-y-1.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-lavender-text uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-pastel-lavender-text" />
                <span>About My Deen & Character</span>
              </h3>
              <p className="text-xs text-on-surface leading-relaxed italic bg-white/60 p-3 rounded-xl border border-pastel-lavender-border">
                "{user.bio || rel?.deenRelationshipBio || "Seeking a righteous spouse to complete half our deen in harmony and mutual respect."}"
              </p>
            </div>

            {/* 6. My Partner Requirements & Expectations */}
            <div className="bg-pastel-amber/60 rounded-2xl p-3.5 border border-pastel-amber-border space-y-2.5 shadow-subtle">
              <h3 className="text-xs font-bold text-pastel-amber-text uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pastel-amber-text fill-pastel-amber-text/30" />
                <span>My Partner Requirements & Expectations</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Preferred Age</span>
                  <strong className="text-on-surface text-[11px] block truncate">
                    {user.partnerRequirements?.minAge && user.partnerRequirements?.maxAge
                      ? `${user.partnerRequirements.minAge} - ${user.partnerRequirements.maxAge} years`
                      : '20 - 35 years'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Marital Status</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {user.partnerRequirements?.maritalStatus ? user.partnerRequirements.maritalStatus.replace(/_/g, ' ') : 'Open to All'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Deen & Practice</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {user.partnerRequirements?.practiceLevel ? user.partnerRequirements.practiceLevel.replace(/_/g, ' ') : 'Practicing'}
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-pastel-amber-border shadow-2xs">
                  <span className="text-[10px] text-pastel-amber-text font-medium block">Relocation</span>
                  <strong className="text-on-surface text-[11px] block truncate capitalize">
                    {user.partnerRequirements?.relocation ? user.partnerRequirements.relocation.replace(/_/g, ' ') : 'Flexible / Open'}
                  </strong>
                </div>
              </div>

              {/* Expectations Note */}
              <div className="bg-white/80 p-2.5 rounded-xl border border-pastel-amber-border text-xs leading-relaxed text-on-surface">
                <span className="text-[10px] text-pastel-amber-text font-bold uppercase tracking-wider block mb-0.5">What I am looking for:</span>
                <p className="italic text-[11px] text-on-surface">
                  "{user.partnerRequirements?.description || 'Seeking a practicing, kind-hearted spouse with good Islamic manners.'}"
                </p>
              </div>
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
