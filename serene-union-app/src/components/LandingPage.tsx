import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  Users, 
  ArrowRight, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Mic, 
  X, 
  Lock, 
  ZoomIn, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  Mail,
  Star,
  Quote,
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { testimonialsData, type TestimonialItem } from '../data/testimonialsData';
import { halalStoriesData, type HalalStory } from '../data/storiesData';
import { blogPostsData, type BlogPost } from '../data/blogData';
import { HalalStoriesPage } from './HalalStoriesPage';
import { BlogPage } from './BlogPage';


// Official Store Icons from D:\Marriage App\logos\icons
const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 640 640" className={className} fill="currentColor">
    <path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z" />
  </svg>
);

const AppStoreIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 640 640" className={className} fill="currentColor">
    <path d="M319.9 184.9L329 169.2C334.6 159.4 347.1 156.1 356.9 161.7C366.7 167.3 370 179.8 364.4 189.6L276.9 341.1L340.2 341.1C360.7 341.1 372.2 365.2 363.3 381.9L177.8 381.9C166.5 381.9 157.4 372.8 157.4 361.5C157.4 350.2 166.5 341.1 177.8 341.1L229.8 341.1L296.4 225.7L275.6 189.6C270 179.8 273.3 167.4 283.1 161.7C292.9 156.1 305.3 159.4 311 169.2L319.9 184.9zM241.2 402.9L221.6 436.9C216 446.7 203.5 450 193.7 444.4C183.9 438.8 180.6 426.3 186.2 416.5L200.8 391.3C217.2 386.2 230.6 390.1 241.2 402.9zM410.1 341.2L463.2 341.2C474.5 341.2 483.6 350.3 483.6 361.6C483.6 372.9 474.5 382 463.2 382L433.7 382L453.6 416.5C459.2 426.3 455.9 438.7 446.1 444.4C436.3 450 423.9 446.7 418.2 436.9C384.7 378.8 359.5 335.3 342.8 306.3C325.7 276.8 337.9 247.2 350 237.2C363.4 260.2 383.4 294.9 410.1 341.2zM320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM104 320C104 200.7 200.7 104 320 104C439.3 104 536 200.7 536 320C536 439.3 439.3 536 320 536C200.7 536 104 439.3 104 320z" />
  </svg>
);

// Vector Icons: Ring, Mosque, Book, Socials
const RingIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="6" />
    <path d="M9 8l3-4 3 4" />
  </svg>
);

const MosqueIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v3" />
    <path d="M12 5c-3 0-5 2-5 5v10h10V10c0-3-2-5-5-5z" />
    <path d="M9 20v-4h6v4" />
  </svg>
);

const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.26 6.26 0 0 0 1.86-4.47V8.78a8.18 8.18 0 0 0 4.91 1.63v-3.72z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface Props {
  onLaunchWebApp: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

interface ScreenshotItem {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
}

export const LandingPage: React.FC<Props> = ({ onLaunchWebApp, onGetStarted, onLogin }) => {
  const [deepLinkSlug, setDeepLinkSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const parts = hash.split('/');
      return parts.length > 1 ? parts[1] : null;
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'home' | 'stories' | 'blog'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#stories') || hash.startsWith('#halal-stories')) return 'stories';
      if (hash.startsWith('#blog') || hash.startsWith('#journal') || hash.startsWith('#blogs')) return 'blog';
    }
    return 'home';
  });

  const [selectedStoryModal, setSelectedStoryModal] = useState<HalalStory | null>(null);
  const [selectedArticleModal, setSelectedArticleModal] = useState<BlogPost | null>(null);
  const [articleCopied, setArticleCopied] = useState<boolean>(false);

  const [selectedTestimonialModal, setSelectedTestimonialModal] = useState<TestimonialItem | null>(null);
  const [selectedTestimonialTag, setSelectedTestimonialTag] = useState<string>('All');
  const [showSubmitStoryModal, setShowSubmitStoryModal] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const filteredTestimonials = selectedTestimonialTag === 'All'
    ? testimonialsData
    : testimonialsData.filter(t => t.tag === selectedTestimonialTag);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotItem | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  // Deep-link Hash Sync for #stories, #blog, and individual article/story slugs
  useEffect(() => {
    const handleHash = () => {
      const fullHash = window.location.hash;
      const hash = fullHash.toLowerCase();
      const parts = fullHash.split('/');
      const slug = parts.length > 1 ? parts[1] : null;
      setDeepLinkSlug(slug);

      if (hash.startsWith('#stories') || hash.startsWith('#halal-stories')) {
        setCurrentView('stories');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#blog') || hash.startsWith('#journal') || hash.startsWith('#blogs')) {
        setCurrentView('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '' || hash === '#') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Capture beforeinstallprompt for 1-click PWA install on Android / Desktop
  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handlePwaClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else {
      setShowIosModal(true);
    }
  };

  const scrollReel = (direction: 'left' | 'right') => {
    if (reelRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      reelRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Interactive 4-Stage Nikah Journey Screens with Professional Vector Icons
  const journeyStages = [
    {
      id: 'discovery',
      tabLabel: 'Halal Discovery',
      badge: 'Intent-Aligned Matching',
      title: 'Match Beyond the Basics',
      tagline: 'Values, Deen, and sincere marriage timelines — never superficial swipe games.',
      screen: '/screenshots/3.png',
      calloutTop: { 
        icon: RingIcon,
        iconColor: 'bg-amber-50 text-amber-600 border border-amber-200',
        title: 'Looking for Nikah', 
        subtitle: 'Timeline: Within 6 Months' 
      },
      calloutBottom: { 
        icon: MosqueIcon,
        iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        title: '5 Daily Prayers', 
        subtitle: 'Values & Modesty Verified' 
      }
    },
    {
      id: 'voice',
      tabLabel: 'Voice Bios',
      badge: 'Character & Adab',
      title: 'Hear Tone, Maturity & Sincerity',
      tagline: 'Listen to spoken audio greetings to evaluate character before appearance.',
      screen: '/screenshots/2.png',
      calloutTop: { 
        icon: Mic,
        iconColor: 'bg-rose-50 text-rose-600 border border-rose-200',
        title: 'Voice Greeting: 1m 24s', 
        subtitle: 'Tone & Maturity with Haya' 
      },
      calloutBottom: { 
        icon: BookOpenIcon,
        iconColor: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
        title: 'Sunnah & Halal Goals', 
        subtitle: 'Family-Oriented Values' 
      }
    },
    {
      id: 'modesty',
      tabLabel: 'Modesty Shield',
      badge: '1-to-1 Mutual Consent',
      title: 'Photos Blurred Until Mutual Approval',
      tagline: 'Protected against random browsing and screenshots. You decide when to unblur.',
      screen: '/screenshots/7.png',
      calloutTop: { 
        icon: ShieldCheck,
        iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        title: 'Photo Modesty Shield', 
        subtitle: 'Blurred on Public Feed' 
      },
      calloutBottom: { 
        icon: Lock,
        iconColor: 'bg-slate-100 text-slate-700 border border-slate-200',
        title: '1-to-1 Mutual Reveal', 
        subtitle: 'Consent Required from Both' 
      }
    },
    {
      id: 'wali',
      tabLabel: 'Wali & Family',
      badge: 'Sacred Guardianship',
      title: 'Chaperoned Conversations with Dignity',
      tagline: 'Sisters can invite their father or guardian to chaperone chats from day one.',
      screen: '/screenshots/8.png',
      calloutTop: { 
        icon: Users,
        iconColor: 'bg-amber-50 text-amber-600 border border-amber-200',
        title: 'Wali Chaperone Added', 
        subtitle: 'Guardian Oversees Chat' 
      },
      calloutBottom: { 
        icon: HeartHandshake,
        iconColor: 'bg-rose-50 text-rose-600 border border-rose-200',
        title: 'Pure Marital Intention', 
        subtitle: 'Aiming for Family Meeting' 
      }
    }
  ];

  // All 11 Marketing Screenshots from D:\Marriage App\logos\Screenshots
  const allScreenshots: ScreenshotItem[] = [
    {
      id: 'screen-1',
      src: '/screenshots/1.png',
      title: 'Find Your Righteous Spouse',
      category: 'Welcome',
      description: 'Welcome screen outlining Qurb’s sacred commitment to modesty and marriage upon the Sunnah.'
    },
    {
      id: 'screen-2',
      src: '/screenshots/2.png',
      title: 'Values That Matter',
      category: 'Biodata & Voice',
      description: 'Detailed Islamic biodata, spoken audio greetings, and intentional relationship goals.'
    },
    {
      id: 'screen-3',
      src: '/screenshots/3.png',
      title: 'Match Beyond the Basics',
      category: 'Discovery',
      description: 'Smart candidate discovery showing religious practice, family plans, and personality.'
    },
    {
      id: 'screen-4',
      src: '/screenshots/4.png',
      title: 'Intentions Made Clear',
      category: 'Matches',
      description: 'View members who have shared direct Salams and align with your marital timeline.'
    },
    {
      id: 'screen-5',
      src: '/screenshots/5.png',
      title: 'Where Halal Love Begins',
      category: 'Nikah',
      description: 'Celebrating completed Nikahs and lawful unions founded on mutual faith and respect.'
    },
    {
      id: 'screen-6',
      src: '/screenshots/6.png',
      title: 'Discover with Purpose',
      category: 'Deen & Practice',
      description: 'Transparent details on daily Salah, Quran habits, dietary standards, and lifestyle.'
    },
    {
      id: 'screen-7',
      src: '/screenshots/7.png',
      title: 'Conversations with Purpose',
      category: 'Modesty Chat',
      description: 'Respectful 1-on-1 conversations with mutual photo reveal request controls.'
    },
    {
      id: 'screen-8',
      src: '/screenshots/8.png',
      title: 'Every Connection Starts Pure',
      category: 'Chaperoned Chat',
      description: 'Dignified messaging where sisters can include their Wali as a chaperone.'
    },
    {
      id: 'screen-9',
      src: '/screenshots/9.png',
      title: 'Stay Connected to What Matters',
      category: 'Notifications',
      description: 'Real-time updates on mutual interests, Salams, and guardian approvals.'
    },
    {
      id: 'screen-10',
      src: '/screenshots/10.png',
      title: 'Your Privacy, Always Protected',
      category: 'Privacy Settings',
      description: 'Granular controls to blur photos, disable discovery, or permanently erase your data.'
    },
    {
      id: 'screen-11',
      src: '/screenshots/11.png',
      title: 'Account Dignity & Security',
      category: 'Security',
      description: 'Amanah privacy architecture with zero commercial ad trackers and strict anti-screenshot rules.'
    }
  ];

  const faqs = [
    {
      q: "Is Qurb strictly for marriage (Nikah)?",
      a: "Yes, 100%. Qurb is built exclusively for practicing Muslims seeking lawful Islamic marriage. Casual dating, hookups, or non-marital relationships are strictly prohibited and result in an immediate permanent ban."
    },
    {
      q: "How does the Modesty Photo Shield work?",
      a: "In accordance with Islamic modesty (Haya), members can keep their profile photos blurred by default on the public feed. Photos are only unblurred on a 1-to-1 basis when both members grant mutual reveal approval. Taking screenshots of revealed photos is strictly forbidden."
    },
    {
      q: "Can sisters include their Wali (family guardian)?",
      a: "Yes! Sisters have the option to add their Wali's name, relationship, and contact details during profile creation. The Wali can be included as a chaperone in conversations to maintain Islamic adab and family blessing from day one."
    },
    {
      q: "How does Qurb differ from conventional Muslim dating apps like Muzz or Salams?",
      a: "Unlike mainstream apps that replicate secular swipe culture, Qurb is engineered exclusively around Islamic jurisprudence and adab. We prioritize spoken voice bios, detailed Islamic practice indicators, strict anti-screenshot protection, default photo modesty shields, and explicit Wali involvement from the very beginning."
    },
    {
      q: "How do I install Qurb on iPhone / iPad?",
      a: "Tap 'Download on App Store (PWA)' above, open qurb.app in Safari on your iPhone, tap the Safari Share button 📤, and select 'Add to Home Screen 📱'. Qurb will install instantly on your iPhone and launch full-screen just like a native app."
    },
    {
      q: "Is Qurb free to use?",
      a: "Yes, registration, profile discovery, and daily likes are completely free. Users can also earn additional likes for free by watching optional rewarded video ads. For members who want priority visibility and instant Salams, we offer optional Qurb Barakah VIP passes."
    },
    {
      q: "How is my personal data protected?",
      a: "Your data is treated as a sacred trust (Amanah). We do not sell your data or monetize your private details with third-party advertisers. All communications are TLS-encrypted and stored on secure Cloudflare infrastructure. You can permanently delete your profile anytime in 1 click."
    },
    {
      q: "What steps does Qurb take against non-serious users and fake accounts?",
      a: "Qurb requires comprehensive Islamic biodata completion, phone and email authentication, active automated moderation, and peer reporting. Inappropriate behavior or non-marital intent results in an instant, unappealable hardware and account ban."
    }
  ];

  const currentStage = journeyStages[activeStageIndex];

  if (currentView === 'stories') {
    return (
      <HalalStoriesPage
        onBackToLanding={() => {
          window.location.hash = '';
          setDeepLinkSlug(null);
          setCurrentView('home');
        }}
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        initialStoryId={deepLinkSlug}
      />
    );
  }

  if (currentView === 'blog') {
    return (
      <BlogPage
        onBackToLanding={() => {
          window.location.hash = '';
          setDeepLinkSlug(null);
          setCurrentView('home');
        }}
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        initialArticleId={deepLinkSlug}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600 overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-b border-slate-200/80 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Nikah Only
        </span>
        <span>Dedicated to lawful Islamic marriage upon the Quran &amp; Sunnah.</span>
        <button 
          onClick={onLaunchWebApp}
          className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
        >
          Open Web App →
        </button>
      </aside>

      {/* MOBILE QUICK NAVIGATION STRIP */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-center gap-3 text-xs font-semibold">
        <button
          onClick={() => {
            window.location.hash = '#stories';
            setCurrentView('stories');
          }}
          className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          <span>Halal Stories</span>
        </button>
        <button
          onClick={() => {
            window.location.hash = '#blog';
            setCurrentView('blog');
          }}
          className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Blogs</span>
        </button>
      </div>

      {/* 2. CLEAN LUXURY LIGHT NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Name (Bigger Icon + Raleway Font) */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xs border border-rose-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Qurb Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex items-center">
              <span style={{ fontFamily: "'Raleway', sans-serif" }} className="text-3xl font-extrabold tracking-tight text-slate-900">
                Qurb
              </span>
            </div>
          </a>

          {/* Navigation Links - Exclusive: Blogs & Halal Stories */}
          <nav className="hidden md:flex items-center gap-3.5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                window.location.hash = '#stories';
                setCurrentView('stories');
              }}
              className="px-4 py-2 rounded-full border border-rose-200/90 bg-rose-50/70 hover:bg-rose-100/90 text-rose-800 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-sm group"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>Halal Stories</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 shadow-2xs">
                Real Nikahs
              </span>
            </button>

            <button
              onClick={() => {
                window.location.hash = '#blog';
                setCurrentView('blog');
              }}
              className="px-4 py-2 rounded-full border border-amber-200/90 bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-sm group"
            >
              <BookOpen className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
              <span>Blogs</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-800 border border-amber-200 shadow-2xs">
                Sunnah Guide
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onLogin}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. CENTRALIZED HERO SECTION: 2 FLANKING WEDDING IMAGES + SOLID IDENTITY BUTTONS + AMBIENT TEXTURE */}
      <section className="relative overflow-hidden bg-[#FAF9F6] pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-200/80">
        
        {/* Visible Low-Opacity Islamic Courtyard & Architecture Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src="/hero_ambient_bg.jpg" 
            alt="Islamic Architecture Background" 
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-35 transition-opacity" 
          />
          {/* Subtle soft white gradient overlay preserving pristine text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-[#FAF9F6]/85" />
          {/* Radial mask to ensure center copy stays high-contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]" />
        </div>

        {/* Abstract Ambient Glow Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-rose-200/30 via-amber-100/20 to-emerald-100/15 rounded-full blur-3xl pointer-events-none z-0" />
        
        {/* Subtle Islamic Geometric Star Background Watermarks */}
        <svg className="absolute -top-12 left-6 w-64 h-64 text-rose-900/[0.035] pointer-events-none z-0" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,0 63,35 100,50 63,65 50,100 37,65 0,50 37,35" />
        </svg>
        <svg className="absolute -bottom-10 right-8 w-72 h-72 text-amber-900/[0.035] pointer-events-none z-0" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,0 63,35 100,50 63,65 50,100 37,65 0,50 37,35" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Flanking Image 1: Left Side on Desktop (Joyful Muslim Wedding Couple) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white transform -rotate-2 hover:rotate-0 hover:scale-102 transition-all duration-500 group">
                <img 
                  src="/hero_joyful.jpg" 
                  alt="Joyful Muslim Wedding Couple with Floral Arch" 
                  className="w-full h-[390px] object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 text-white">
                  <p className="font-serif font-bold text-xs text-white">Joyful Nikah</p>
                  <p className="text-white/80 text-[10px]">Pure Intentions &amp; Sunnah</p>
                </div>
              </div>
            </div>

            {/* Centralized Hero Content (Center Column) */}
            <div className="col-span-1 lg:col-span-6 text-center space-y-6 max-w-2xl mx-auto">
              
              {/* Professional Clean Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>Pure Halal Matrimony • 100% Nikah Only</span>
              </div>

              {/* High-Impact Clean Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Where Halal Love <br />
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                  Begins with Barakah.
                </span>
              </h1>

              {/* Subheading: Minimal, Exactly ONE Line */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
                Modest, dignified, and intentional matchmaking crafted for practicing Muslims seeking lifelong Nikah.
              </p>

              {/* Two Official Store Buttons in Solid Qurb Logo Identity Color (No Gradient) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                
                {/* 1. Google Play Store (Native Android App) */}
                <button
                  onClick={() => setShowAndroidModal(true)}
                  className="w-full sm:w-auto min-w-[215px] bg-rose-600 hover:bg-rose-700 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-xl hover:shadow-rose-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <GooglePlayIcon className="w-6 h-6 text-white shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="text-left leading-tight">
                    <div className="text-[9px] text-rose-100 font-medium tracking-wider uppercase">GET IT ON</div>
                    <div className="text-base font-bold text-white tracking-tight">Google Play <span className="text-[10px] text-rose-200 font-normal ml-1">(Native App)</span></div>
                  </div>
                </button>

                {/* 2. Apple App Store (iOS PWA) */}
                <button
                  onClick={handlePwaClick}
                  className="w-full sm:w-auto min-w-[215px] bg-rose-600 hover:bg-rose-700 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-xl hover:shadow-rose-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <AppStoreIcon className="w-6 h-6 text-white shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="text-left leading-tight">
                    <div className="text-[9px] text-rose-100 font-medium tracking-wider uppercase">DOWNLOAD ON</div>
                    <div className="text-base font-bold text-white tracking-tight">App Store <span className="text-[10px] text-rose-200 font-normal ml-1">(iOS PWA)</span></div>
                  </div>
                </button>

              </div>

              {/* Professional Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Modesty Photo Shield</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Wali Chaperone Supported</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 text-rose-700">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>100% Nikah Intent Only</span>
                </div>
              </div>

              {/* Mobile Duo Images Preview (Only on Mobile screens) */}
              <div className="grid grid-cols-2 gap-3 pt-3 lg:hidden">
                <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white aspect-[4/5]">
                  <img src="/hero_joyful.jpg" alt="Nikah Couple 1" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white aspect-[4/5]">
                  <img src="/hero_couple_right.jpg" alt="Nikah Couple 2" className="w-full h-full object-cover" />
                </div>
              </div>

            </div>

            {/* Flanking Image 2: Right Side on Desktop (Blessed Nikah Couple) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white transform rotate-2 hover:rotate-0 hover:scale-102 transition-all duration-500 group">
                <img 
                  src="/hero_couple_right.jpg" 
                  alt="Joyful Nikah Couple in Wedding Attire" 
                  className="w-full h-[390px] object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 text-white">
                  <p className="font-serif font-bold text-xs text-white">Blessed Nikah</p>
                  <p className="text-white/80 text-[10px]">Grace, Modesty &amp; Sunnah</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Abstract Curved Divider at bottom of Hero */}
        <div className="absolute inset-x-0 bottom-0 h-6 overflow-hidden pointer-events-none opacity-40">
          <svg className="w-full h-full text-[#FAF9F6] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,90 800,20 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

      </section>

      {/* 4. PLAYFUL INTERACTIVE 4-STAGE EXPERIENCE: APP TOUR IN A 3D PHONE STAGE */}
      <section id="experience" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive App Experience</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              How Qurb Works: The 4 Sacred Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Click any stage below to see how each screen honors your modesty and speeds up the path to Nikah.
            </p>

            {/* Playful Stage Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {journeyStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeStageIndex === idx
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeStageIndex === idx ? 'bg-rose-500' : 'bg-slate-400'}`} />
                  <span>{stage.tabLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Interactive Showcase Box */}
          <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Side: Stage Story & Features */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
                  <span>{currentStage.badge}</span>
                </div>
                
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {currentStage.title}
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {currentStage.tagline}
                </p>

                {/* Feature Bullets */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      <strong>Sacred Intent:</strong> Every candidate signs our marriage agreement upon registration.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      <strong>Haya First:</strong> Visual privacy remains intact until serious mutual intent is established.
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={onGetStarted}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Experience This on Qurb</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const found = allScreenshots.find(s => s.src === currentStage.screen);
                      if (found) setSelectedScreenshot(found);
                    }}
                    className="px-4 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom Screen</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Realistic Phone Mockup with Dynamic Floating Cards */}
              <div className="lg:col-span-6 flex items-center justify-center relative">
                
                {/* Floating Callout 1 (Top) */}
                {(() => {
                  const TopIcon = currentStage.calloutTop.icon;
                  return (
                    <div className="hidden sm:flex absolute -top-3 -left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 max-w-[220px] animate-fade-in">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${currentStage.calloutTop.iconColor}`}>
                        <TopIcon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left leading-tight">
                        <div className="text-xs font-bold text-slate-900">{currentStage.calloutTop.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{currentStage.calloutTop.subtitle}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Floating Callout 2 (Bottom) */}
                {(() => {
                  const BottomIcon = currentStage.calloutBottom.icon;
                  return (
                    <div className="hidden sm:flex absolute -bottom-3 -right-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 max-w-[230px] animate-fade-in">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${currentStage.calloutBottom.iconColor}`}>
                        <BottomIcon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left leading-tight">
                        <div className="text-xs font-bold text-slate-900">{currentStage.calloutBottom.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{currentStage.calloutBottom.subtitle}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* iPhone Frame */}
                <div 
                  onClick={() => {
                    const found = allScreenshots.find(s => s.src === currentStage.screen);
                    if (found) setSelectedScreenshot(found);
                  }}
                  className="w-[260px] sm:w-[290px] rounded-[42px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-700 relative group cursor-pointer hover:scale-102 transition-transform duration-300"
                >
                  {/* Speaker Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  </div>

                  {/* Screen Content */}
                  <div className="rounded-[32px] overflow-hidden aspect-[9/19] bg-white relative">
                    <img 
                      src={currentStage.screen} 
                      alt={currentStage.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Hint */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-lg">
                        <ZoomIn className="w-3.5 h-3.5 text-rose-600" />
                        <span>Tap to Zoom</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. PLAYFUL HORIZONTAL PERSPECTIVE MARQUEE: ALL 11 REAL SCREENSHOTS */}
      <section id="screens" className="py-20 bg-[#FCFBF9] border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
                <span>The Complete Experience</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                Gallery of All 11 Marketing Screens
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Scroll horizontally or tap any screen for a high-resolution lightbox view.
              </p>
            </div>

            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollReel('left')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollReel('right')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Horizontal Scroll Reel */}
        <div 
          ref={reelRef}
          className="flex items-center gap-5 overflow-x-auto px-6 sm:px-12 py-6 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allScreenshots.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedScreenshot(item)}
              className="shrink-0 w-[210px] sm:w-[240px] bg-white rounded-3xl p-3 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Phone Device Frame */}
              <div className="rounded-2xl overflow-hidden aspect-[9/19] bg-slate-100 border border-slate-200 relative shadow-inner">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-800 shadow-xs border border-slate-100">
                  #{index + 1} • {item.category}
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/95 p-2 rounded-full shadow-md">
                    <ZoomIn className="w-4 h-4 text-rose-600" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="pt-2.5 px-1">
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.1 BLESSED TESTIMONIALS SECTION (4 INSPIRING TESTIMONIALS) */}
      <section id="testimonials" className="py-20 sm:py-28 bg-[#FAF9F6] border-b border-slate-200/80 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-200/20 via-amber-100/20 to-emerald-100/15 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
              <span>Blessed Testimonials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Words from Real Muslim Couples
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Read how practicing brothers and sisters completed half their deen through Qurb’s sacred, modesty-first matchmaking.
            </p>
          </div>

          {/* Trust Social Proof Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-amber-200 transition-colors">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900">4.9 / 5.0</div>
              <div className="text-[11px] text-slate-500 font-medium">Verified Nikah Reviews</div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-emerald-200 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900">100% Chaperoned</div>
              <div className="text-[11px] text-slate-500 font-medium">Wali Involved from Day 1</div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-rose-200 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900">4.2 Months Avg.</div>
              <div className="text-[11px] text-slate-500 font-medium">Salam to Blessed Nikah</div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1 hover:border-slate-300 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center mb-1">
                <Lock className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900">Modesty Shield</div>
              <div className="text-[11px] text-slate-500 font-medium">1-to-1 Mutual Photo Reveal</div>
            </div>
          </div>

          {/* Interactive Tag Filter Bar */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            {['All', 'Wali Chaperoned', 'Spoken Voice Bio Match', 'Modesty Shield First', 'Family Blessing & Sunnah'].map((category) => {
              const count = category === 'All' ? testimonialsData.length : testimonialsData.filter(t => t.tag === category).length;
              const isSelected = selectedTestimonialTag === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedTestimonialTag(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/25 ring-2 ring-rose-600/30' 
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span>{category === 'All' ? 'All Reviews' : category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                {/* Subtle Islamic Star Watermark */}
                <svg className="absolute top-6 right-6 w-28 h-28 text-slate-100/70 pointer-events-none -z-0 group-hover:text-rose-100/40 transition-colors" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,0 63,35 100,50 63,65 50,100 37,65 0,50 37,35" />
                </svg>

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: Stars + Category Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <div className="flex items-center">
                        {[...Array(item.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 ml-1">5.0</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                        Verified
                      </span>
                    </div>

                    <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {item.tag}
                    </span>
                  </div>

                  {/* Primary Quote */}
                  <div className="relative pt-2">
                    <Quote className="w-10 h-10 text-rose-200/50 absolute -top-2 -left-3 pointer-events-none" />
                    <p className="relative z-10 font-serif text-base sm:text-lg text-slate-800 italic leading-relaxed font-medium">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Full Story Callout */}
                  <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <HeartHandshake className="w-3 h-3 text-rose-600" />
                        Nikah Journey Note
                      </span>
                      <span className="text-emerald-700 font-semibold">{item.timeline}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.fullStory}
                    </p>
                    <button
                      onClick={() => setSelectedTestimonialModal(item)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 inline-flex items-center gap-1 pt-1 cursor-pointer transition-colors"
                    >
                      <span>Read Full Journey Details</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Bottom Author Card */}
                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      <img src={item.avatar} alt={item.coupleNames} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{item.coupleNames}</span>
                        {item.verified && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Nikah
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11.5px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{item.timeline}</span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5">{item.weddingDate}</div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Community CTA Card */}
          <div className="mt-14 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200/80 p-6 sm:p-8 text-center space-y-3.5 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
              <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
              <span>Did You Find Your Spouse on Qurb?</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Share Your Nikah Journey with the Ummah
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Every Halal marriage brings immense Barakah. Share your story to inspire sincere singles, and receive an exclusive engraved Nikah gift from the Qurb team.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowSubmitStoryModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Share Your Blessing</span>
                <HeartHandshake className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5.2 HALAL STORIES SECTION (FEATURED STORIES & DEDICATED PAGE LINK) */}
      <section id="halal-stories" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>Real Nikah Journeys</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Halal Stories: Sincere Hearts, Blessed Unions
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Inspiring journeys of couples who chose Haya, guardian chaperoning, and intentional marriage upon the Sunnah.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.hash = '#stories';
                setCurrentView('stories');
              }}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              <span>Explore All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Featured Story Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {halalStoriesData.slice(0, 3).map((story) => (
              <div
                key={story.id}
                className="bg-[#FAF9F6] rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={story.image}
                      alt={story.coupleNames}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-900 shadow-xs">
                      {story.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-serif text-base font-bold drop-shadow-xs">{story.coupleNames}</h4>
                      <div className="text-[11px] text-white/90">{story.location}</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{story.timeToNikah}</span>
                      <span>•</span>
                      <span>{story.weddingDate}</span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      "{story.quote}"
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0 border-t border-slate-200/70 mt-2 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedStoryModal(story)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Sunnah Nikah
                  </span>
                </div>

              </div>
            ))}
          </div>

          {/* Callout Strip to Dedicated Halal Stories Page */}
          <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                Want to read all journeys &amp; pre-marital lessons?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Explore our full dedicated Halal Stories page with Wali perspectives, timeline milestones, and heartfelt advice for singles.
              </p>
            </div>
            <button
              onClick={() => {
                window.location.hash = '#stories';
                setCurrentView('stories');
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Explore All Halal Stories Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5.3 MATRIMONY JOURNAL & BLOG SECTION (FEATURED GUIDES & DEDICATED BLOG LINK) */}
      <section id="blog" className="py-20 sm:py-28 bg-[#FCFBF9] border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Wisdom &amp; Sunnah Guidance</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                The Qurb Matrimony Journal
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Essential pre-marital guides, jurisprudential advice on Mahr &amp; Wali, and courtship etiquette for practicing Muslims.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.hash = '#blog';
                setCurrentView('blog');
              }}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              <span>Visit Full Blog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Featured Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPostsData.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedArticleModal(post)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-900 shadow-xs">
                      {post.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-rose-600" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-700">
                    By {post.author.name}
                  </div>
                  <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>

          {/* Callout Strip to Dedicated Blog Page */}
          <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-rose-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                Explore our full library of Islamic matrimony articles
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Topics on Istikhara, 10 essential pre-marital questions, voice bios, and building homes filled with Sakinah.
              </p>
            </div>
            <button
              onClick={() => {
                window.location.hash = '#blog';
                setCurrentView('blog');
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Visit Dedicated Blog Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. SACRED NIKAH COVENANT: FEATURING GENERATED WEDDING RINGS IMAGE & SURAH AR-RUM */}
      <section id="nikah" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Generated Wedding Rings Image */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-lg group">
                <img 
                  src="/halal_rings.jpg" 
                  alt="Sacred Halal Nikah Rings" 
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <p className="font-serif text-sm font-bold">Mithaqan Ghalidha (A Sacred Covenant)</p>
                  <p className="text-white/80 text-[11px] mt-0.5">Marriage built upon affection, mercy, and mutual trust.</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Halal Principles</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Built Strictly for Nikah, <br />
                Blessed by Pure Intention
              </h2>

              {/* Quranic Verse */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div 
                  className="text-base sm:text-xl text-amber-950 font-serif leading-relaxed"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </div>
                <p className="text-xs text-slate-700 italic font-serif leading-relaxed">
                  "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."
                </p>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  Surah Ar-Rum (30:21)
                </p>
              </div>

              {/* 3 Halal Commitments */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Transparent Mahr Discussions:</strong> State expectations openly without awkwardness.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Zero Ghosting Culture:</strong> Prompt, respectful communication etiquette is enforced.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Sunnah Etiquette:</strong> Dignity, modesty, and family blessing prioritized at every step.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. VISUAL STORY SPLIT: FAMILY BLESSING & WALI CHAPERONE */}
      <section id="family" className="py-20 sm:py-28 bg-[#FCFBF9] border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Content Side */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Family-Centered Matrimony</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Family Blessing &amp; <br />
                Wali Chaperone Support
              </h2>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Islam places immense honor on family involvement in marriage. Qurb empowers sisters to include their father or guardian directly in the process, ensuring adab, peace of mind, and barakah from the first interaction.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Direct Guardian Inclusion:</strong> Register your Wali's contact during onboarding so he can oversee conversations.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Respectful Intent:</strong> Encourages candidates to communicate with sincere matrimonial purpose without aimless chatting.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    <strong>Seamless Family Introduction:</strong> Fast-track lawful meetings between both families when mutual interest aligns.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Create Protected Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Halal Family Image */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-lg group">
                <img 
                  src="/halal_family.jpg" 
                  alt="Islamic Family Blessing and Wali Support" 
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
                  <p className="font-serif text-sm font-bold">"Nikah is a sacred union of two righteous families."</p>
                  <p className="text-white/80 text-[11px] mt-0.5">Honoring the Sunnah with guardian involvement.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOUR CORE HALAL PILLARS */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              The Four Pillars of Qurb
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Crafted from the ground up to uphold Islamic dignity and protect your modesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-rose-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">100% Nikah Intent Only</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every member commits strictly to lawful marriage. Casual dating, flirtatious small talk, and dishonest intentions result in an immediate permanent ban.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Modesty Photo Shield</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Keep photos blurred on the public feed. Candidate likenesses are only revealed 1-to-1 upon explicit, mutual approval by both parties.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-amber-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Wali &amp; Family Involvement</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Islam honors family adab. Sisters can register their Wali's contact details so guardians can chaperone conversations from the outset.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Spoken Voice Bios</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hear authentic spoken voice introductions to evaluate a candidate's maturity, articulation, and demeanor respectfully.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-[#FAF9F6]" itemScope itemType="https://schema.org/FAQPage">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Answers regarding our Islamic ethics, privacy, and verification.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span itemProp="name">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div 
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="px-5 pb-4 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3"
                    >
                      <div itemProp="text">{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. PRE-FOOTER CALL TO ACTION WITH STORE BUTTONS */}
      <section className="py-20 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Complete Half Your Deen with Qurb
          </h2>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Join thousands of practicing Muslims searching for marriage with Barakah, modesty, and family blessing.
          </p>
          
          {/* Two Official Store Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            
            {/* Google Play (Native App) */}
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full sm:w-auto min-w-[215px] bg-white hover:bg-slate-50 text-slate-900 px-5 py-3.5 rounded-2xl shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer border border-white/60 group"
            >
              <GooglePlayIcon className="w-6 h-6 text-rose-600 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">GET IT ON</div>
                <div className="text-base font-bold text-slate-900 tracking-tight">Google Play <span className="text-[10px] text-rose-600 font-normal ml-0.5">(Native App)</span></div>
              </div>
            </button>

            {/* Apple App Store (iOS PWA) */}
            <button
              onClick={handlePwaClick}
              className="w-full sm:w-auto min-w-[215px] bg-white hover:bg-slate-50 text-slate-900 px-5 py-3.5 rounded-2xl shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer border border-white/60 group"
            >
              <AppStoreIcon className="w-6 h-6 text-rose-600 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">DOWNLOAD ON</div>
                <div className="text-base font-bold text-slate-900 tracking-tight">App Store <span className="text-[10px] text-rose-600 font-normal ml-0.5">(iOS PWA)</span></div>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* 11. LUXURY MODERN LIGHT FOOTER */}
      <footer className="w-full bg-[#FAF9F6] text-slate-700 border-t border-slate-200/90 pt-16 pb-12 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Main Footer Grid: 5 Balanced Columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-slate-200">
            
            {/* Col 1: Brand Identity & Mission */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white p-1.5 shadow-xs border border-rose-200 flex items-center justify-center shrink-0">
                  <img src="/icon.svg" alt="Qurb Logo" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <span style={{ fontFamily: "'Raleway', sans-serif" }} className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Qurb
                  </span>
                  <div className="text-rose-600 text-[11px] font-semibold">Pure Halal Matrimony</div>
                </div>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed">
                Dedicated to lawful Islamic marriage with modesty (Haya), guardian chaperoning, and lifelong Barakah.
              </p>

              {/* Trust & Safety Highlights */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[10.5px] font-medium shadow-2xs w-fit">
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>256-bit TLS Encrypted</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[10.5px] font-medium shadow-2xs w-fit">
                  <ShieldCheck className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Modesty Photo Shield</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Follow Our Journey
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.tiktok.com/@qurb.love" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-2xs"
                    title="Follow Qurb on TikTok (@qurb.love)"
                    aria-label="TikTok @qurb.love"
                  >
                    <TikTokIcon className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/qurb.love" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 rounded-xl bg-white hover:bg-rose-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-2xs"
                    title="Follow Qurb on Instagram (@qurb.love)"
                    aria-label="Instagram @qurb.love"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="mailto:support@qurb.app"
                    className="w-8 h-8 rounded-xl bg-white hover:bg-rose-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-2xs"
                    title="Email Support"
                    aria-label="Support Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Product Tour & Features */}
            <div className="space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Product Tour</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="#experience" className="hover:text-rose-600 transition-colors">
                    How Qurb Works
                  </a>
                </li>
                <li>
                  <a href="#screens" className="hover:text-rose-600 transition-colors">
                    Live App Showcase
                  </a>
                </li>
                <li>
                  <a href="#nikah" className="hover:text-rose-600 transition-colors">
                    Nikah Covenant
                  </a>
                </li>
                <li>
                  <a href="#family" className="hover:text-rose-600 transition-colors">
                    Family &amp; Wali Support
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-rose-600 transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Stories & Blog */}
            <div className="space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Stories &amp; Wisdom</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <button
                    onClick={() => {
                      window.location.hash = '#stories';
                      setCurrentView('stories');
                    }}
                    className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                  >
                    Halal Stories (Real Unions)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      window.location.hash = '#blog';
                      setCurrentView('blog');
                    }}
                    className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                  >
                    Matrimony Journal &amp; Blog
                  </button>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-rose-600 transition-colors">
                    Couple Testimonials
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      window.location.hash = '#blog';
                      setCurrentView('blog');
                    }}
                    className="hover:text-rose-600 transition-colors text-left cursor-pointer"
                  >
                    Sunnah Courtship Guides
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Get the App */}
            <div className="space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Get the App</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <button 
                    onClick={() => setShowAndroidModal(true)} 
                    className="hover:text-rose-600 transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <GooglePlayIcon className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                    <span>Google Play (Android)</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handlePwaClick} 
                    className="hover:text-rose-600 transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <AppStoreIcon className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                    <span>App Store (iOS PWA)</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onLaunchWebApp} 
                    className="hover:text-rose-600 transition-colors flex items-center gap-2 text-left cursor-pointer font-semibold text-slate-900"
                  >
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Launch Web App</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onLogin} 
                    className="hover:text-rose-600 transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Sign In to Account</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-rose-700 transition-colors flex items-center gap-2 text-left cursor-pointer text-rose-600 font-bold"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                    <span>Create Profile Free</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Trust, Safety & Legal */}
            <div className="space-y-3">
              <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Trust &amp; Legal</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="/privacy-policy" className="hover:text-rose-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-rose-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/child-safety" className="hover:text-rose-600 transition-colors">
                    Child Safety Standards
                  </a>
                </li>
                <li>
                  <a href="#nikah" className="hover:text-rose-600 transition-colors">
                    Matrimony Charter
                  </a>
                </li>
                <li>
                  <a href="mailto:support@qurb.app" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
                    <span>support@qurb.app</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright, Islamic Blessing & System Status */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()} Qurb. All rights reserved.</span>
              <span>•</span>
              <span>Brandracker / Movemax Solutions</span>
            </div>
            
            <div className="text-slate-400 text-center">
              Built with Barakah for practicing Muslims worldwide • Honoring Haya &amp; Modesty
            </div>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 text-[10px] font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Amanah Protected &amp; Verified</span>
            </div>
          </div>

        </div>
      </footer>

      {/* LIGHTBOX MODAL: FULL SCREENSHOT PREVIEW */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[9/19] bg-slate-100 border border-slate-200">
              <img 
                src={selectedScreenshot.src} 
                alt={selectedScreenshot.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-3 px-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{selectedScreenshot.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                  {selectedScreenshot.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedScreenshot.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FULL HALAL STORY READER */}
      {selectedStoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedStoryModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left my-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStoryModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close Story"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {selectedStoryModal.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Sacred Nikah</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {selectedStoryModal.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <strong>{selectedStoryModal.coupleNames}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {selectedStoryModal.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {selectedStoryModal.weddingDate}
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
                <img
                  src={selectedStoryModal.image}
                  alt={selectedStoryModal.coupleNames}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <Quote className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-serif text-sm text-slate-800 italic leading-relaxed">
                  "{selectedStoryModal.quote}"
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>How They Connected</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedStoryModal.theMatch}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>The Wali’s Chaperoning &amp; Family Blessing</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedStoryModal.waliRole}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>From Salam to Nikah: The Timeline</span>
                </h3>
                <div className="space-y-2">
                  {selectedStoryModal.timelineMilestones.map((m: { time: string; event: string }, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-slate-200/80">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900 font-semibold">{m.time}:</strong> {m.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Their Advice to Marriage Seekers</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{selectedStoryModal.adviceForSingles}"
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedStoryModal(null);
                    onGetStarted();
                  }}
                  className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-2xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Start Your Own Halal Story on Qurb</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedStoryModal(null)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FULL ARTICLE READER */}
      {selectedArticleModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedArticleModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-9 shadow-2xl relative text-left my-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close Article"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    {selectedArticleModal.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedArticleModal.readTime}
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setArticleCopied(true);
                    setTimeout(() => setArticleCopied(false), 2000);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  {articleCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {selectedArticleModal.title}
              </h1>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img src={selectedArticleModal.author.avatar} alt={selectedArticleModal.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{selectedArticleModal.author.name}</div>
                  <div className="text-[11px] text-slate-500">{selectedArticleModal.author.role} • {selectedArticleModal.date}</div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
                <img src={selectedArticleModal.image} alt={selectedArticleModal.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-6 pt-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                {selectedArticleModal.sections.map((sec: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    {sec.heading && (
                      <h2 className="font-serif text-lg font-bold text-slate-900">
                        {sec.heading}
                      </h2>
                    )}
                    <p className="leading-relaxed">{sec.body}</p>

                    {sec.citations && (
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 font-serif italic space-y-1">
                        <Quote className="w-5 h-5 text-amber-600 mb-1" />
                        <p>{sec.citations}</p>
                      </div>
                    )}

                    {sec.quote && (
                      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950 font-serif italic">
                        "{sec.quote}"
                      </div>
                    )}

                    {sec.keyPoints && (
                      <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Key Considerations:
                        </div>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
                          {sec.keyPoints.map((point: string, pIdx: number) => (
                            <li key={pIdx} className="leading-relaxed">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Summary Takeaways</span>
                </div>
                <div className="space-y-1.5">
                  {selectedArticleModal.keyTakeaways.map((takeaway: string, tIdx: number) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white space-y-3 text-center">
                <h3 className="font-serif text-lg font-bold">Apply These Principles on Qurb</h3>
                <p className="text-white/90 text-xs max-w-md mx-auto">
                  Find a spouse who shares your religious dedication, values family adab, and seeks a blessed marriage.
                </p>
                <button
                  onClick={() => {
                    setSelectedArticleModal(null);
                    onGetStarted();
                  }}
                  className="bg-white text-rose-700 font-bold px-6 py-2.5 rounded-full text-xs shadow-md hover:bg-slate-50 cursor-pointer"
                >
                  Join Qurb Free
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setSelectedArticleModal(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: iOS PWA INSTALLATION GUIDE */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 relative text-left">
            <button 
              onClick={() => setShowIosModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <AppStoreIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">Install on iPhone / iPad</h3>
                <p className="text-xs text-slate-500">Progressive Web App (PWA)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-900">Open in Safari:</strong> Visit <span className="text-rose-600 font-semibold">qurb.app</span> in Apple Safari on your iPhone.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-900">Tap Share:</strong> Tap the Safari <strong className="text-slate-900">Share icon 📤</strong> at the bottom.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-900">Add to Home Screen:</strong> Scroll down and select <strong className="text-rose-700">Add to Home Screen 📱</strong>.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowIosModal(false);
                  onLaunchWebApp();
                }}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:opacity-95 text-white font-bold py-3 px-5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch iOS Web App Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Qurb will install to your home screen and run full-screen.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ANDROID DOWNLOAD */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative text-left">
            <button 
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <GooglePlayIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">Download for Android</h3>
                <p className="text-xs text-slate-500">Official Android App</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="leading-relaxed">
                Native Android app with Google Play Billing 8.0 support, instant push notifications, and verified modesty safeguards.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                <Check className="w-3.5 h-3.5" />
                <span>Google Play Release (v1.0.1)</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://play.google.com/store/apps/details?id=app.qurb.serene"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <GooglePlayIcon className="w-4 h-4" />
                <span>Open on Google Play Store</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
              <button
                onClick={() => {
                  setShowAndroidModal(false);
                  onLaunchWebApp();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Or Launch Web App Immediately in Browser</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: BLESSED NIKAH TESTIMONIAL MODAL */}
      {selectedTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6 relative text-left">
            <button 
              onClick={() => setSelectedTestimonialModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
              aria-label="Close Testimonial"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Couple Header Banner */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-md shrink-0">
                <img 
                  src={selectedTestimonialModal.avatar} 
                  alt={selectedTestimonialModal.coupleNames} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    {selectedTestimonialModal.coupleNames}
                  </h3>
                  {selectedTestimonialModal.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Nikah</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedTestimonialModal.location}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedTestimonialModal.timeline}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedTestimonialModal.weddingDate}
                </div>
              </div>
            </div>

            {/* Rating & Tag Pill */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(selectedTestimonialModal.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-1.5">5.0 Out of 5.0</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {selectedTestimonialModal.tag}
              </span>
            </div>

            {/* Featured Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/60 to-amber-50/40 border border-rose-100 relative">
              <Quote className="w-8 h-8 text-rose-300/60 mb-1" />
              <p className="font-serif italic text-sm sm:text-base text-slate-800 leading-relaxed">
                "{selectedTestimonialModal.quote}"
              </p>
            </div>

            {/* Full Story Journey */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>The Sacred Journey to Marriage</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200">
                {selectedTestimonialModal.fullStory}
              </p>
            </div>

            {/* Islamic Matrimonial Blessing Dua */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1">
              <div className="font-serif text-sm font-semibold text-emerald-900">
                بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
              </div>
              <p className="text-[11px] text-emerald-800 italic">
                "May Allah bless you, shower His blessings upon you, and join you together in goodness."
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setSelectedTestimonialModal(null);
                  onGetStarted();
                }}
                className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Find Your Spouse on Qurb</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedTestimonialModal(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SUBMIT NIKAH STORY */}
      {showSubmitStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative text-left">
            <button 
              onClick={() => {
                setShowSubmitStoryModal(false);
                setSubmitSuccess(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Share Your Nikah Story</h3>
                <p className="text-xs text-slate-500">Inspire the Ummah with your Halal Union</p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm text-emerald-900">Alhamdulillah! Story Received</div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  May Allah grant immense Barakah in your union. Our editorial team will review your testimony and reach out to deliver your honorary Qurb Nikah gift!
                </p>
                <button
                  onClick={() => {
                    setShowSubmitStoryModal(false);
                    setSubmitSuccess(false);
                  }}
                  className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitSuccess(true);
                }} 
                className="space-y-3.5 text-xs text-slate-700"
              >
                <div>
                  <label className="block font-semibold mb-1 text-slate-800">Couple Names</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Zaid & Ayesha" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-800">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="youremail@domain.com" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-800">Wedding Date & City</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. London, UK (Shawwal 1447)" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-800">Your Testimonial / Story</label>
                  <textarea 
                    required
                    rows={3} 
                    placeholder="Tell us how Qurb helped you connect with Haya and family blessing..." 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-rose-600 text-xs resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all cursor-pointer"
                >
                  Submit Nikah Testimony
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
