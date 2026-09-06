import React, { useState, useEffect } from 'react';
import { Compass, Heart, MessageCircle, User, Settings, CheckCircle2, X } from 'lucide-react';
import type { UserProfile } from './types';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { BasicInfoScreen } from './screens/BasicInfoScreen';
import { ReligiousPracticeScreen } from './screens/ReligiousPracticeScreen';
import { FamilyLifestyleScreen } from './screens/FamilyLifestyleScreen';
import { YourIntentScreen } from './screens/YourIntentScreen';
import { CreateProfileScreen } from './screens/CreateProfileScreen';
import { MyProfileScreen } from './screens/MyProfileScreen';
import { DiscoverFeed } from './components/DiscoverFeed';
import { MatchesLikedYouScreen } from './components/MatchesLikedYouScreen';
import { ChatScreen } from './components/ChatScreen';
import { SettingsPrivacy } from './components/SettingsPrivacy';
import { ResetPasswordScreen } from './screens/ResetPasswordScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { TermsScreen } from './screens/TermsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { dbService, API_BASE } from './services/dbService';
import { notificationService } from './services/notificationService';

type OnboardingStep = 
  | 'welcome' 
  | 'auth' 
  | 'reset_password'
  | 'privacy_policy'
  | 'terms'
  | 'basic_info' 
  | 'practice' 
  | 'family_lifestyle' 
  | 'career_intent' 
  | 'photos_modesty' 
  | 'main_app';

type MainTab = 'discover' | 'matches' | 'chat' | 'my_profile' | 'settings';

export const App: React.FC = () => {
  const [resetCode] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('oobCode') || '';
  });

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('privacy')) return 'privacy_policy';
    if (path.includes('terms')) return 'terms';

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'resetPassword' || (params.get('oobCode') && params.get('mode') !== 'verifyEmail')) {
      return 'reset_password';
    }
    
    // 1. Check if user has an ongoing onboarding draft in progress
    const savedDraft = localStorage.getItem('serene_onboarding_draft_v1');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft?.step && draft.step !== 'main_app' && draft.step !== 'welcome') {
          return draft.step;
        }
      } catch {}
    }

    // 2. Check saved session in localStorage
    const saved = localStorage.getItem('serene_current_user_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed.id !== 'usr_guest') {
          // If profile is fully completed, allow into main_app
          const isComplete = parsed.isProfileCompleted ?? (parsed.city || (parsed.location && parsed.location !== 'Global'));
          if (isComplete) {
            return 'main_app';
          }
          return 'basic_info';
        }
      } catch {}
    }
    return 'welcome';
  });

  const [activeTab, setActiveTab] = useState<MainTab>('discover');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'signup' | 'login'>('signup');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState<boolean>(() => notificationService.hasUnread());

  // Active User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => dbService.getCurrentUser());

  useEffect(() => {
    // Live Cloudflare D1 Wallet & VIP status sync on app boot
    if (currentUser.id && currentUser.id !== 'usr_guest') {
      dbService.fetchLikesRemaining(currentUser.id).then(({ isVip }) => {
        if (typeof isVip === 'boolean' && isVip !== currentUser.isVip) {
          setCurrentUser(prev => ({ ...prev, isVip }));
        }
      });
    }

    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setCurrentUser(prev => ({ ...prev, isVip: true }));
      }
    };
    const handleProfileUpdate = (e: any) => {
      if (e.detail?.user) {
        setCurrentUser({ ...e.detail.user });
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    window.addEventListener('serene_user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('serene_vip_updated', handleVipUpdate);
      window.removeEventListener('serene_user_profile_updated', handleProfileUpdate);
    };
  }, [currentUser.id]);

  // Stripe Checkout Post-Payment Verification
  const [stripeSuccessNotice, setStripeSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeStatus = params.get('stripe_status');
    const sessionId = params.get('session_id');

    if (stripeStatus === 'success' && sessionId) {
      fetch(`${API_BASE}/wallet/stripe/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.fulfilled) {
            setStripeSuccessNotice('Barakah VIP Activated! Unlimited likes & VIP features are now active.');
            const uid = data.userId || currentUser.id;
            if (uid) {
              localStorage.setItem(`serene_vip_${uid}`, 'true');
              dbService.fetchLikesRemaining(uid).then(({ isVip }) => {
                if (isVip) {
                  setCurrentUser(prev => ({ ...prev, isVip: true }));
                }
              });
              window.dispatchEvent(new CustomEvent('serene_vip_updated', { detail: { userId: uid, isVip: true } }));
            }
          }
        })
        .catch(console.error)
        .finally(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('stripe_status');
          url.searchParams.delete('session_id');
          window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
          setTimeout(() => setStripeSuccessNotice(null), 6000);
        });
    } else if (stripeStatus === 'cancelled') {
      const url = new URL(window.location.href);
      url.searchParams.delete('stripe_status');
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
    }
  }, [currentUser.id]);


  // Onboarding In-Progress Data (persisted in draft)
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>(() => {
    try {
      const savedDraft = localStorage.getItem('serene_onboarding_draft_v1');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.data) return parsed.data;
      }
    } catch {}
    return {};
  });

  const goToStep = (step: OnboardingStep, nextData?: Record<string, any>) => {
    const updated = nextData || onboardingData;
    if (nextData) {
      setOnboardingData(updated);
    }
    localStorage.setItem('serene_onboarding_draft_v1', JSON.stringify({ step, data: updated }));
    setCurrentStep(step);
  };

  const handleAuthSuccess = (session: { token: string; user: any; isNewUser: boolean }) => {
    const user = session.user;
    const isProfileCompleted = user?.isProfileCompleted ?? (user?.city || (user?.location && user?.location !== 'Global'));
    const needsOnboarding = session.isNewUser || !isProfileCompleted;

    if (needsOnboarding) {
      setCurrentUser(dbService.getGuestUser());
      const initialDraft = {
        userId: user?.id,
        email: user?.email,
        fullName: user?.fullName,
        gender: user?.gender,
        photos: user?.photos || [],
        sessionToken: session.token
      };
      setOnboardingData(initialDraft);
      localStorage.setItem('serene_onboarding_draft_v1', JSON.stringify({ step: 'basic_info', data: initialDraft }));
      setCurrentStep('basic_info');
    } else {
      // Existing user with saved completed profile
      if (user) {
        const fullProfile: UserProfile = {
          id: user.id || 'usr_004',
          phone: user.phone || user.email || '',
          email: user.email || '',
          fullName: user.fullName || 'Member',
          dob: user.dob || '1998-01-01',
          age: user.dob ? (new Date().getFullYear() - new Date(user.dob).getFullYear()) : 28,
          gender: user.gender || 'male',
          location: user.location || user.city || 'Global',
          city: user.city,
          country: user.country,
          latitude: user.latitude,
          longitude: user.longitude,
          profession: user.profession || 'Professional',
          education: user.education || 'Graduate Degree',
          university: user.university || '',
          height: user.height || "5'10\" (178 cm)",
          ethnicity: user.ethnicity || 'South Asian',
          familyStructure: user.familyStructure || 'nuclear',
          livingPreference: user.livingPreference || 'independent',
          siblingsCount: user.siblingsCount ?? 2,
          willingnessToRelocate: user.willingnessToRelocate || 'open',
          smokingStatus: user.smokingStatus || 'non_smoker',
          languagesSpoken: user.languagesSpoken || 'English, Urdu',
          mahrPhilosophy: user.mahrPhilosophy || 'mutual_agreement',
          childrenDesire: user.childrenDesire || 'desires_children',
          marriageTimeline: user.marriageTimeline || 'within_1_year',
          bio: user.bio || '',
          blurPhotosByDefault: Boolean(user.blurPhotosByDefault),
          profileVisibility: 'all_users',
          photos: user.photos?.length > 0 ? user.photos : [],
          religiousProfile: {
            practiceLevel: user.religiousProfile?.practiceLevel || 'practicing',
            sect: user.religiousProfile?.sect || 'Sunni',
            madhhab: user.religiousProfile?.madhhab || 'Hanafi',
            prayerFrequency: user.religiousProfile?.prayerFrequency || '5 times daily',
            halalDiet: user.religiousProfile?.halalDiet || 'Strictly Halal',
            quranRecitation: user.religiousProfile?.quranRecitation || 'daily',
            modestyPractice: user.religiousProfile?.modestyPractice || 'modest',
            hajjUmrahStatus: user.religiousProfile?.hajjUmrahStatus || 'planning',
            deenRelationshipBio: user.religiousProfile?.deenRelationshipBio || user.bio
          },
          wali: user.wali || null,
          isProfileCompleted: true
        };
        setCurrentUser(fullProfile);
        dbService.setCurrentUser(fullProfile);
        dbService.fetchLiveProfiles();
      }
      localStorage.removeItem('serene_onboarding_draft_v1');
      setCurrentStep('main_app');
      setActiveTab('discover');
    }
  };

  const handleFinishOnboarding = async (photoData: { blurPhotos: boolean; photos: string[] }) => {
    const merged: UserProfile = {
      id: onboardingData.userId || currentUser.id || 'usr_' + Date.now(),
      phone: onboardingData.email || currentUser.email || '',
      email: onboardingData.email || currentUser.email || 'user@sereneunion.com',
      fullName: onboardingData.fullName || currentUser.fullName || 'Member',
      dob: onboardingData.dob || currentUser.dob || '1998-01-01',
      age: onboardingData.dob ? (new Date().getFullYear() - new Date(onboardingData.dob).getFullYear()) : 28,
      gender: onboardingData.gender || currentUser.gender || 'male',
      location: onboardingData.location || currentUser.location || 'London, UK',
      city: onboardingData.city || currentUser.city,
      country: onboardingData.country || currentUser.country,
      latitude: onboardingData.latitude ?? currentUser.latitude,
      longitude: onboardingData.longitude ?? currentUser.longitude,
      profession: onboardingData.profession || currentUser.profession || 'Professional',
      education: onboardingData.education || currentUser.education || 'Graduate Degree',
      university: onboardingData.university || '',
      height: onboardingData.height || currentUser.height || "5'10\" (178 cm)",
      ethnicity: onboardingData.ethnicity || 'South Asian',
      citizenship: onboardingData.citizenship || 'Citizen',
      workArrangement: onboardingData.workArrangement || 'remote',
      incomeBracket: onboardingData.incomeBracket || '40k_80k',
      hobbies: onboardingData.hobbies || ['📚 Books & Islamic History', '✈️ Travel & Umrah', '☕ Specialty Coffee'],
      personalityTraits: onboardingData.personalityTraits || ['🤍 Family-Oriented', '🌿 Calm & Patient'],
      maritalStatus: onboardingData.maritalStatus || 'never_married',
      dualIncomePreference: onboardingData.dualIncomePreference || 'career_supportive',
      familyStructure: onboardingData.familyStructure || 'nuclear',
      livingPreference: onboardingData.livingPreference || 'independent',
      siblingsCount: onboardingData.siblingsCount ?? 2,
      willingnessToRelocate: onboardingData.willingnessToRelocate || 'open',
      smokingStatus: onboardingData.smokingStatus || 'non_smoker',
      languagesSpoken: onboardingData.languagesSpoken || 'English, Urdu',
      mahrPhilosophy: onboardingData.mahrPhilosophy || 'mutual_agreement',
      childrenDesire: onboardingData.childrenDesire || 'desires_children',
      marriageTimeline: onboardingData.timeline || 'within_1_year',
      bio: onboardingData.bio || 'Seeking a practicing partner on the Sunnah.',
      partnerRequirements: onboardingData.partnerRequirements || {
        minAge: 20,
        maxAge: 35,
        maritalStatus: 'any',
        practiceLevel: 'practicing',
        relocation: 'open',
        description: 'Seeking a pious, practicing spouse with good character.'
      },
      blurPhotosByDefault: photoData.blurPhotos,
      profileVisibility: 'all_users',
      photos: photoData.photos,
      religiousProfile: {
        practiceLevel: onboardingData.practiceLevel || 'practicing',
        sect: onboardingData.sect || 'Sunni',
        madhhab: onboardingData.madhhab || 'Hanafi',
        prayerFrequency: onboardingData.prayerFrequency || '5 times daily',
        halalDiet: onboardingData.halalDiet || 'Strictly Halal',
        quranRecitation: onboardingData.quranRecitation || 'daily',
        modestyPractice: onboardingData.modestyPractice || 'modest',
        hajjUmrahStatus: onboardingData.hajjUmrahStatus || 'planning',
        deenRelationshipBio: onboardingData.bio
      },
      isProfileCompleted: true
    };

    try {
      setCurrentUser(merged);
      dbService.setCurrentUser(merged);
    } catch (err) {
      console.warn('Local session state notice:', err);
    }

    // Save permanently to Cloudflare D1
    try {
      await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      await dbService.fetchLiveProfiles();
    } catch (err) {
      console.warn('Remote profile save notice:', err);
    }

    localStorage.removeItem('serene_onboarding_draft_v1');
    setCurrentStep('main_app');
    setActiveTab('discover');
  };

  const handleLogout = () => {
    localStorage.removeItem('serene_onboarding_draft_v1');
    localStorage.removeItem('serene_current_user_v1');
    localStorage.removeItem('serene_auth_token');
    setCurrentUser(dbService.getGuestUser());
    setCurrentStep('welcome');
    setActiveTab('discover');
  };

  const handleOpenChat = (convId: string) => {
    setActiveConvId(convId);
    setActiveTab('chat');
  };

  return (
    <div className="w-full min-h-screen bg-[#121212] flex items-center justify-center font-sans antialiased text-on-surface">
      {/* Centered Mobile Screen Container */}
      <div className="w-full max-w-[440px] h-[100dvh] sm:h-[90vh] sm:max-h-[900px] bg-white sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col relative border border-[#262626]">
        
        {/* Top Simulated Status Bar on Mobile View */}
        <div className="hidden sm:flex w-full bg-white px-6 pt-3 pb-1 items-center justify-between z-40 select-none text-[11px] text-[#737373] font-medium border-b border-[#F4F4F5]">
          <span>9:41</span>
          <div className="w-20 h-4 bg-[#171717] rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2.5 border border-[#737373] rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-[#737373] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Stripe Success Notification Banner */}
        {stripeSuccessNotice && (
          <div className="absolute top-12 left-4 right-4 z-50 p-3 rounded-2xl bg-[#01875f] text-white shadow-xl flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
              <p className="text-xs font-semibold leading-snug">{stripeSuccessNotice}</p>
            </div>
            <button onClick={() => setStripeSuccessNotice(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* STEP 0: WELCOME & HALAL TRUST VALUE PROP */}
        {currentStep === 'welcome' && (
          <WelcomeScreen 
            onGetStarted={() => {
              setAuthInitialTab('signup');
              setCurrentStep('auth');
            }}
            onLogin={() => {
              setAuthInitialTab('login');
              setCurrentStep('auth');
            }}
          />
        )}

        {/* STEP 0.5: EMAIL & GOOGLE AUTHENTICATION */}
        {currentStep === 'auth' && (
          <AuthScreen 
            initialTab={authInitialTab}
            onBack={() => setCurrentStep('welcome')}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* STEP 0.6: CUSTOM FIREBASE PASSWORD RESET */}
        {currentStep === 'reset_password' && (
          <ResetPasswordScreen 
            oobCode={resetCode}
            onComplete={() => {
              window.history.replaceState({}, document.title, window.location.pathname);
              setCurrentStep('auth');
            }}
          />
        )}

        {/* STEP 0.7: PUBLIC PRIVACY POLICY SCREEN */}
        {currentStep === 'privacy_policy' && (
          <PrivacyPolicyScreen
            onBack={() => {
              window.history.pushState({}, '', '/');
              setCurrentStep(currentUser?.id && currentUser.id !== 'usr_guest' ? 'main_app' : 'welcome');
            }}
          />
        )}

        {/* STEP 0.8: PUBLIC TERMS OF SERVICE SCREEN */}
        {currentStep === 'terms' && (
          <TermsScreen
            onBack={() => {
              window.history.pushState({}, '', '/');
              setCurrentStep(currentUser?.id && currentUser.id !== 'usr_guest' ? 'main_app' : 'welcome');
            }}
          />
        )}

        {/* ONBOARDING STEP 1: BASIC BIODATA */}
        {currentStep === 'basic_info' && (
          <BasicInfoScreen
            data={onboardingData as any}
            onBack={() => setCurrentStep('auth')}
            onContinue={(basicData: any) => {
              goToStep('practice', { ...onboardingData, ...basicData });
            }}
          />
        )}

        {/* ONBOARDING STEP 2: DEEN & SUNNAH ROUTINE */}
        {currentStep === 'practice' && (
          <ReligiousPracticeScreen
            data={onboardingData as any}
            onBack={() => goToStep('basic_info')}
            onContinue={(relData) => {
              goToStep('family_lifestyle', { ...onboardingData, ...relData });
            }}
          />
        )}

        {/* ONBOARDING STEP 3: FAMILY & LIVING PREFERENCES */}
        {currentStep === 'family_lifestyle' && (
          <FamilyLifestyleScreen
            data={onboardingData as any}
            onBack={() => goToStep('practice')}
            onNext={(famData) => {
              goToStep('career_intent', { ...onboardingData, ...famData });
            }}
          />
        )}

        {/* ONBOARDING STEP 4: CAREER, MAHR & INTENT */}
        {currentStep === 'career_intent' && (
          <YourIntentScreen
            data={onboardingData as any}
            onBack={() => goToStep('family_lifestyle')}
            onContinue={(careerData) => {
              goToStep('photos_modesty', { ...onboardingData, ...careerData });
            }}
          />
        )}

        {/* ONBOARDING STEP 5: PHOTOS & MODESTY */}
        {currentStep === 'photos_modesty' && (
          <CreateProfileScreen
            userId={onboardingData.userId || currentUser.id}
            initialPhotos={onboardingData.photos || []}
            initialBlurPhotos={true}
            onBack={() => goToStep('career_intent')}
            onComplete={handleFinishOnboarding}
          />
        )}

        {/* MAIN APPLICATION (5-TAB BOTTOM NAVIGATION) */}
        {currentStep === 'main_app' && (
          <div className="w-full h-full flex flex-col justify-between overflow-hidden relative bg-background">
            
            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'discover' && (
                <DiscoverFeed 
                  onOpenChat={handleOpenChat} 
                  onOpenMatches={() => setActiveTab('matches')}
                  onOpenNotifications={() => setShowNotifications(true)}
                />
              )}


              {activeTab === 'matches' && (
                <MatchesLikedYouScreen
                  onOpenChat={handleOpenChat}
                  onOpenDiscover={() => setActiveTab('discover')}
                />
              )}

              {activeTab === 'chat' && (
                <ChatScreen
                  initialConvId={activeConvId || undefined}
                  onBackToDiscover={() => setActiveTab('discover')}
                />
              )}

              {activeTab === 'my_profile' && (
                <MyProfileScreen 
                  user={currentUser}
                  onEditProfile={() => setCurrentStep('basic_info')}
                  onLogout={handleLogout}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPrivacy currentUser={currentUser} onLogout={handleLogout} />
              )}

            </div>

            {/* Global Notifications Screen Modal */}
            {showNotifications && (
              <NotificationsScreen
                isOpen={showNotifications}
                onBack={() => {
                  setShowNotifications(false);
                  setHasUnreadNotifs(notificationService.hasUnread());
                }}
                onNavigateToMatches={() => {
                  setShowNotifications(false);
                  setActiveTab('matches');
                  setHasUnreadNotifs(notificationService.hasUnread());
                }}
                onNavigateToChat={(convId) => {
                  setShowNotifications(false);
                  handleOpenChat(convId || '');
                  setHasUnreadNotifs(notificationService.hasUnread());
                }}
              />
            )}

            {/* CLEAN SOLID BOTTOM NAVIGATION BAR (No Gradients, Lucide Icons) */}
            <nav className="w-full bg-white border-t border-outline px-2 py-2 flex items-center justify-around z-30 shadow-subtle">
              {[
                { id: 'discover', label: 'Discover', Icon: Compass },
                { id: 'matches', label: 'Matches', Icon: Heart },
                { id: 'chat', label: 'Chat', Icon: MessageCircle },
                { id: 'my_profile', label: 'Profile', Icon: User },
                { id: 'settings', label: 'Settings', Icon: Settings }
              ].map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id as MainTab);
                      if (id !== 'chat') setActiveConvId(null);
                    }}
                    className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.75px]'}`} />
                    {(id === 'matches' || id === 'chat') && hasUnreadNotifs && (
                      <span className="w-2 h-2 bg-primary rounded-full absolute top-1 right-3 ring-2 ring-white" />
                    )}
                    <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
