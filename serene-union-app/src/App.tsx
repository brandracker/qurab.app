import React, { useState, useEffect } from 'react';
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
import { dbService, API_BASE } from './services/dbService';

type OnboardingStep = 
  | 'welcome' 
  | 'auth' 
  | 'basic_info' 
  | 'practice' 
  | 'family_lifestyle' 
  | 'career_intent' 
  | 'photos_modesty' 
  | 'main_app' 
  | 'wali_portal';

type MainTab = 'discover' | 'matches' | 'chat' | 'my_profile' | 'settings';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'wali_portal') return 'wali_portal';
    
    // Check saved session in localStorage
    const saved = localStorage.getItem('serene_current_user_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed.id !== 'usr_guest') return 'main_app';
      } catch {}
    }
    return 'welcome';
  });

  const [activeTab, setActiveTab] = useState<MainTab>('discover');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Active User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => dbService.getCurrentUser());

  useEffect(() => {
    const handleVipUpdate = (e: any) => {
      const targetUserId = e.detail?.userId;
      if (!targetUserId || targetUserId === currentUser.id) {
        setCurrentUser(prev => ({ ...prev, isVip: true }));
      }
    };
    window.addEventListener('serene_vip_updated', handleVipUpdate);
    return () => window.removeEventListener('serene_vip_updated', handleVipUpdate);
  }, [currentUser.id]);

  // Onboarding In-Progress Data
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});

  const handleAuthSuccess = (session: { token: string; user: any; isNewUser: boolean }) => {
    const user = session.user;
    if (session.isNewUser) {
      setCurrentUser(dbService.getGuestUser());
      setOnboardingData({
        userId: user?.id,
        email: user?.email,
        fullName: user?.fullName,
        photos: [],
        sessionToken: session.token
      });
      setCurrentStep('basic_info');
    } else {
      // Existing user with saved profile
      if (user) {
        const fullProfile: UserProfile = {
          id: user.id || 'usr_004',
          phone: user.phone || user.email || '',
          email: user.email || '',
          fullName: user.fullName || 'Member',
          dob: user.dob || '1998-01-01',
          age: user.dob ? (new Date().getFullYear() - new Date(user.dob).getFullYear()) : 28,
          gender: user.gender || 'male',
          location: user.location || 'Lahore, Pakistan',
          profession: user.profession || 'Professional',
          education: user.education || 'Graduate Degree',
          university: user.university || '',
          height: user.height || "5'10\" (178 cm)",
          ethnicity: user.ethnicity || 'South Asian',
          familyStructure: user.familyStructure || 'nuclear',
          livingPreference: user.livingPreference || 'independent',
          siblingsCount: user.siblingsCount || 2,
          willingnessToRelocate: user.willingnessToRelocate || 'open',
          smokingStatus: user.smokingStatus || 'non_smoker',
          languagesSpoken: user.languagesSpoken || 'English, Urdu',
          mahrPhilosophy: user.mahrPhilosophy || 'mutual_agreement',
          childrenDesire: user.childrenDesire || 'desires_children',
          marriageTimeline: user.marriageTimeline || 'within_1_year',
          bio: user.bio || 'Seeking half my deen.',
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
          wali: user.wali || null
        };
        setCurrentUser(fullProfile);
        dbService.setCurrentUser(fullProfile);
      }
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
      }
    };

    setCurrentUser(merged);
    dbService.setCurrentUser(merged);

    // Save permanently to Cloudflare D1
    try {
      await fetch(`${API_BASE}/users/complete-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: merged.id,
          fullName: merged.fullName,
          dob: merged.dob,
          gender: merged.gender,
          location: merged.location,
          height: merged.height,
          bio: merged.bio,
          profession: merged.profession,
          education: merged.education,
          university: merged.university,
          ethnicity: merged.ethnicity,
          citizenship: merged.citizenship,
          workArrangement: merged.workArrangement,
          incomeBracket: merged.incomeBracket,
          hobbies: merged.hobbies,
          personalityTraits: merged.personalityTraits,
          maritalStatus: merged.maritalStatus,
          dualIncomePreference: merged.dualIncomePreference,
          familyStructure: merged.familyStructure,
          livingPreference: merged.livingPreference,
          siblingsCount: merged.siblingsCount,
          willingnessToRelocate: merged.willingnessToRelocate,
          smokingStatus: merged.smokingStatus,
          languagesSpoken: merged.languagesSpoken,
          mahrPhilosophy: merged.mahrPhilosophy,
          childrenDesire: merged.childrenDesire,
          blurPhotosByDefault: merged.blurPhotosByDefault,
          timeline: merged.marriageTimeline,
          practiceLevel: merged.religiousProfile.practiceLevel,
          sect: merged.religiousProfile.sect,
          madhhab: merged.religiousProfile.madhhab,
          prayerFrequency: merged.religiousProfile.prayerFrequency,
          halalDiet: merged.religiousProfile.halalDiet,
          quranRecitation: merged.religiousProfile.quranRecitation,
          modestyPractice: merged.religiousProfile.modestyPractice,
          hajjUmrahStatus: merged.religiousProfile.hajjUmrahStatus,
          photos: merged.photos
        })
      });
    } catch (err) {
      console.error('Error saving onboarding:', err);
    }

    setCurrentStep('main_app');
    setActiveTab('my_profile');
  };

  const handleOpenChat = (convId: string) => {
    setActiveConvId(convId);
    setActiveTab('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('serene_current_user_v1');
    localStorage.removeItem('serene_conversations_v1');
    setOnboardingData({});
    setCurrentUser(dbService.getGuestUser());
    setActiveConvId(null);
    setActiveTab('discover');
    setCurrentStep('welcome');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#08120B] via-[#0C1A10] to-[#050C07] flex justify-center items-center font-sans overflow-hidden relative">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-gold/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Mobile Shell Container (Max 480px) */}
      <div className="w-full max-w-[480px] h-full sm:h-[95vh] sm:rounded-[42px] bg-background shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col relative sm:border sm:border-white/10 ring-1 ring-black/40 z-10">
        
        {/* Top Simulated Mobile Status Bar (Desktop Preview) */}
        <div className="hidden sm:flex w-full px-7 pt-3 pb-1 items-center justify-between text-[11px] font-semibold text-secondary select-none shrink-0 bg-transparent z-20">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>

        {/* STEP 1: WELCOME SCREEN */}
        {currentStep === 'welcome' && (
          <WelcomeScreen 
            onGetStarted={() => setCurrentStep('auth')}
            onLogin={() => setCurrentStep('auth')}
          />
        )}

        {/* STEP 2: EMAIL + PASSWORD AUTH */}
        {currentStep === 'auth' && (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onBack={() => setCurrentStep('welcome')}
          />
        )}

        {/* ONBOARDING STEP 1: PERSONAL & RELOCATION */}
        {currentStep === 'basic_info' && (
          <BasicInfoScreen
            data={onboardingData}
            onBack={() => setCurrentStep('auth')}
            onContinue={(info) => {
              setOnboardingData(prev => ({ ...prev, ...info }));
              setCurrentStep('practice');
            }}
          />
        )}

        {/* ONBOARDING STEP 2: DEEN & SUNNAH ROUTINE */}
        {currentStep === 'practice' && (
          <ReligiousPracticeScreen
            data={onboardingData as any}
            onBack={() => setCurrentStep('basic_info')}
            onContinue={(relData) => {
              setOnboardingData(prev => ({ ...prev, ...relData }));
              setCurrentStep('family_lifestyle');
            }}
          />
        )}

        {/* ONBOARDING STEP 3: FAMILY & LIVING PREFERENCES */}
        {currentStep === 'family_lifestyle' && (
          <FamilyLifestyleScreen
            data={onboardingData as any}
            onBack={() => setCurrentStep('practice')}
            onNext={(famData) => {
              setOnboardingData(prev => ({ ...prev, ...famData }));
              setCurrentStep('career_intent');
            }}
          />
        )}

        {/* ONBOARDING STEP 4: CAREER, MAHR & INTENT */}
        {currentStep === 'career_intent' && (
          <YourIntentScreen
            data={onboardingData as any}
            onBack={() => setCurrentStep('family_lifestyle')}
            onContinue={(careerData) => {
              setOnboardingData(prev => ({ ...prev, ...careerData }));
              setCurrentStep('photos_modesty');
            }}
          />
        )}

        {/* ONBOARDING STEP 5: PHOTOS & MODESTY */}
        {currentStep === 'photos_modesty' && (
          <CreateProfileScreen
            userId={onboardingData.userId || currentUser.id}
            initialPhotos={onboardingData.photos || []}
            initialBlurPhotos={true}
            onBack={() => setCurrentStep('career_intent')}
            onComplete={handleFinishOnboarding}
          />
        )}

        {/* MAIN APPLICATION (5-TAB BOTTOM NAVIGATION) */}
        {currentStep === 'main_app' && (
          <div className="w-full h-full flex flex-col justify-between overflow-hidden relative bg-background">
            
            {/* Top Micro-Bar with Luxury Branding */}
            <div className="w-full px-5 py-2.5 bg-surface/90 backdrop-blur-xl flex items-center justify-between border-b border-surface-variant/40 z-20 text-[11px]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-primary-light p-1 flex items-center justify-center shadow-emerald shadow-xs">
                  <img src="/icon.svg" alt="Qurab" className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-base tracking-tight text-on-surface">
                    Qurab
                  </span>
                  <span className="font-arabic text-primary text-sm font-bold leading-none">
                    قُرب
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.isVip && (
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-amber-300/40">
                    <span className="material-symbols-outlined text-[11px]">workspace_premium</span>
                    <span>VIP</span>
                  </span>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-secondary hover:text-error transition-colors text-[10px] font-medium px-2 py-1 rounded-lg hover:bg-error/10"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'discover' && (
                <DiscoverFeed onOpenChat={handleOpenChat} />
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
                <SettingsPrivacy currentUser={currentUser} />
              )}
            </div>

            {/* FLOATING FROSTED GLASS BOTTOM NAVIGATION BAR */}
            <nav className="w-full bg-surface/90 backdrop-blur-2xl border-t border-surface-variant/40 px-3 py-2 flex items-center justify-around z-30 shadow-[0_-8px_25px_rgba(0,0,0,0.03)]">
              {[
                { id: 'discover', label: 'Discover', icon: 'explore' },
                { id: 'matches', label: 'Matches', icon: 'favorite' },
                { id: 'chat', label: 'Chat', icon: 'chat' },
                { id: 'my_profile', label: 'Profile', icon: 'account_circle' },
                { id: 'settings', label: 'Settings', icon: 'tune' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as MainTab);
                      if (tab.id !== 'chat') setActiveConvId(null);
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all duration-300 relative ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 w-7 h-1 rounded-full bg-primary shadow-emerald" />
                    )}
                    <span className={`material-symbols-outlined text-[23px] transition-transform duration-200 ${isActive ? 'fill scale-110' : 'scale-100'}`}>
                      {tab.icon}
                    </span>
                    <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                      {tab.label}
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

