import React, { useState } from 'react';
import { 
  HeartHandshake, 
  EyeOff, 
  Users, 
  ArrowRight, 
  Download, 
  Smartphone, 
  ChevronDown, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Mic, 
  X 
} from 'lucide-react';

interface Props {
  onLaunchWebApp: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchWebApp, onGetStarted, onLogin }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);

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
      q: "How do I install Qurb on my iPhone or iPad?",
      a: "Simply tap 'Download iOS (PWA)', open qurb.app in Safari on your iPhone, tap the Safari Share icon 📤 at the bottom, and select 'Add to Home Screen 📱'. Qurb will install instantly on your iPhone and launch full-screen just like a native app."
    },
    {
      q: "Is Qurb free to use?",
      a: "Yes, registration, profile discovery, and daily likes are completely free. Users can also earn additional likes for free by watching optional rewarded video ads. For members who want priority visibility and instant Salams, we offer optional Qurb Barakah VIP passes."
    },
    {
      q: "How is my personal data protected?",
      a: "Your data is treated as a sacred trust (Amanah). We do not sell your data or monetize your private details with third-party advertisers. All communications are TLS-encrypted and stored on secure Cloudflare infrastructure. You can permanently delete your profile anytime in 1 click."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600 overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50/70 to-emerald-50 border-b border-rose-100 px-4 py-2.5 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider shadow-xs">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> Web &amp; Android Ready
        </span>
        <span className="hidden sm:inline font-medium">Seeking righteous marriage upon the Quran &amp; Sunnah.</span>
        <button 
          onClick={onLaunchWebApp}
          className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
        >
          Open Web App →
        </button>
      </aside>

      {/* 2. STICKY LUXURY LIGHT NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white p-2 shadow-md shadow-rose-500/15 border border-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Qurb Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Qurb
                <span className="text-[10px] font-sans font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Halal Nikah
                </span>
              </span>
              <p className="text-[10.5px] text-slate-500 -mt-0.5 hidden sm:block tracking-wider uppercase font-medium">Dignified Muslim Matrimony</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Halal Pillars</a>
            <a href="#how-it-works" className="hover:text-rose-600 transition-colors">The Journey</a>
            <a href="#comparison" className="hover:text-rose-600 transition-colors">Deen Alignment</a>
            <a href="#faq" className="hover:text-rose-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. SIMPLE, CLEAN, CINEMATIC HERO SECTION WITH GENERATED MATRIMONIAL BACKGROUND */}
      <section className="relative min-h-[620px] sm:min-h-[720px] flex items-center justify-center overflow-hidden bg-white">
        
        {/* Cinematic Generated Matrimonial Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/hero_matrimony.jpg')" }}
        />

        {/* Soft Warm Light Luxury Gradient Overlay for Maximum Readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(253, 251, 247, 0.88) 0%, rgba(253, 251, 247, 0.72) 42%, rgba(253, 251, 247, 0.96) 100%)'
          }}
        />

        {/* Soft Ambient Radial Blur */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Centered, Simple Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 py-16 sm:py-24 animate-fade-in">
          
          {/* Sacred Bismillah Calligraphy */}
          <div 
            className="text-xl sm:text-3xl text-amber-900/90 tracking-widest font-normal"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          {/* Simple Halal Matrimony Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/90 text-rose-900 text-xs font-bold shadow-xs">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span>100% Halal Nikah • Zero Casual Dating • Guardian Supported</span>
          </div>

          {/* Clean Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.14]">
            Where Pure Intentions Meet <br />
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              Sacred Unions
            </span>
          </h1>

          {/* 2-3 Lines Subheading */}
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Finding your righteous spouse upon the Quran and Sunnah. Guard your modesty with 1-to-1 photo privacy, listen to authentic voice introductions, and complete half your Deen with family blessing.
          </p>

          {/* EXACTLY TWO BUTTONS AS REQUESTED: Download Android & Download iOS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            {/* 1. Download Android */}
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3.5 cursor-pointer border border-slate-800 group min-w-[230px]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Available on</div>
                <div className="text-base font-bold">Download Android</div>
              </div>
            </button>

            {/* 2. Download iOS (PWA) */}
            <button
              onClick={() => setShowIosModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-3.5 cursor-pointer border border-rose-500 group min-w-[230px]"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-rose-100 uppercase tracking-wider font-semibold">iPhone &amp; iPad</div>
                <div className="text-base font-bold">Download iOS (PWA)</div>
              </div>
            </button>

          </div>

          {/* Simple Direct Web Browser Fallback Link */}
          <div className="pt-2">
            <button
              onClick={onLaunchWebApp}
              className="text-xs text-slate-600 hover:text-rose-700 font-semibold underline underline-offset-4 cursor-pointer transition-colors"
            >
              Or open web app directly in browser →
            </button>
          </div>

        </div>

      </section>

      {/* 4. HALAL ASSURANCE TRUST TICKER */}
      <section className="w-full bg-white border-y border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">100% Nikah Intent</h4>
              <p className="text-[11px] text-slate-500">Strictly no casual dating or swiping culture</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Modesty Photo Shield</h4>
              <p className="text-[11px] text-slate-500">Mutual consent required to reveal photos</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Wali &amp; Family Involvement</h4>
              <p className="text-[11px] text-slate-500">Guardians welcomed in every conversation</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Halal Voice Bios</h4>
              <p className="text-[11px] text-slate-500">Hear tone &amp; maturity without visual exposure</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOUR CORE HALAL PILLARS */}
      <section id="features" className="py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <span>The Pillars of Barakah</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Built Specifically for the Muslim Seeking Jannah
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Mainstream apps encourage superficial swiping and casual flirting. Qurb is engineered from the ground up to uphold Islamic dignity and protect your modesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(225,29,72,0.08)] hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">100% Nikah Intent Only</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Every member on Qurb commits to the singular goal of lawful Islamic marriage. We ban casual dating, flirtatious small talk, and dishonest intentions with active human moderation.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Zero tolerance for casual dating or hookups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600" />
                  <span>Clear marriage timeline and Mahr expectations up front</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(225,29,72,0.08)] hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">1-to-1 Modesty Photo Shield</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Your face is not a commodity for strangers to browse. Keep your photos blurred to the public feed. Photos are only unblurred individually when you grant explicit mutual consent.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Public feed focuses on character, Deen, and values</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Strict anti-screenshot protection &amp; consent controls</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(225,29,72,0.08)] hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Wali &amp; Guardian Chaperone</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Islam honors the family structure. Sisters can add their Wali's contact details so he is seamlessly included in conversations, ensuring peace of mind and barakah from the outset.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Optional direct Wali contact verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Respectful, supervised communication upholding Islamic adab</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(225,29,72,0.08)] hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Halal Voice Introductions</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Text profiles can be impersonal, while photos can lead to visual compromise. Voice greetings allow you to hear a candidate's maturity, demeanor, and Quranic recitation respectfully.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600" />
                  <span>Authentic 30-second spoken introductions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600" />
                  <span>Verified human voices — zero AI bots or fake profiles</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. THE 3-STEP JOURNEY TO NIKAH */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <span>Simple, Pure &amp; Dignified</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              The Path to Completing Half Your Deen
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Three transparent steps to find your righteous spouse without compromises to your modesty or values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Create Your Dignified Profile</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Detail your Islamic practice (prayers, Quran habits, Halal lifestyle), education, family background, and Mahr expectations. Sisters can optionally register their Wali.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-serif font-bold text-xl">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Values-Based Matching &amp; Reveal</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse candidates aligned with your Deen and geography. Listen to spoken voice bios. When there is mutual interest, photos unblur privately for both of you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-serif font-bold text-xl">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Involve Wali &amp; Seal the Nikah</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Communicate with Islamic adab under chaperone oversight. Transition conversation directly to family elders to arrange a formal meeting and finalize the Nikah with Barakah.
              </p>
            </div>

          </div>

          {/* Quranic Verse Box */}
          <div className="mt-14 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60 border border-amber-200/80 shadow-sm text-center space-y-3">
            <div 
              className="text-xl sm:text-2xl text-amber-900/90 font-serif leading-relaxed"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </div>
            <p className="text-sm sm:text-base text-slate-700 italic font-serif">
              "And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy."
            </p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Surah Ar-Rum (30:21)
            </p>
          </div>

        </div>
      </section>

      {/* 7. COMPARISON TABLE */}
      <section id="comparison" className="py-20 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <span>A Principled Distinction</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Why Qurb is Fundamentally Different
            </h2>
            <p className="text-slate-600 text-base">
              Comparing mainstream dating apps and legacy matrimonial sites with Qurb's Sunnah-first ethos.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto text-left border-collapse bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-slate-400">Casual Dating Apps</th>
                  <th className="p-4 sm:p-5 text-slate-400">Old Matrimonial Sites</th>
                  <th className="p-4 sm:p-5 text-rose-600 bg-rose-50/60 font-serif text-sm">Qurb</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-200">
                <tr>
                  <td className="p-4 font-semibold text-slate-800">100% Exclusive for Nikah</td>
                  <td className="p-4 text-slate-400">✕ Dating / Hookups</td>
                  <td className="p-4 text-slate-600">✓ Marriage focused</td>
                  <td className="p-4 font-bold text-emerald-700 bg-rose-50/30">✓ Strictly Enforced</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Modesty Photo Shield</td>
                  <td className="p-4 text-slate-400">✕ Public browsing</td>
                  <td className="p-4 text-slate-400">✕ Inflexible / Public</td>
                  <td className="p-4 font-bold text-emerald-700 bg-rose-50/30">✓ 1-to-1 Mutual Reveal</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Wali &amp; Family Chaperone</td>
                  <td className="p-4 text-slate-400">✕ Excluded</td>
                  <td className="p-4 text-slate-600">Partial (Parent accounts)</td>
                  <td className="p-4 font-bold text-emerald-700 bg-rose-50/30">✓ Native In-Chat Chaperone</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Halal Voice Bio Greetings</td>
                  <td className="p-4 text-slate-400">✕ Rare / Casual</td>
                  <td className="p-4 text-slate-400">✕ None</td>
                  <td className="p-4 font-bold text-emerald-700 bg-rose-50/30">✓ Authentic Spoken Bios</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800">Data Treated as Amanah</td>
                  <td className="p-4 text-slate-400">✕ Sold to Ad Networks</td>
                  <td className="p-4 text-slate-400">✕ Spam &amp; Telemarketers</td>
                  <td className="p-4 font-bold text-emerald-700 bg-rose-50/30">✓ Zero Ads / TLS Encrypted</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <span>Answers &amp; Guidance</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to know about our Islamic ethics, privacy, and verification.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#FAF9F6] border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. PRE-FOOTER CALL TO ACTION WITH 2 BUTTONS */}
      <section className="py-20 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Begin with Bismillah</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Complete Half Your Deen Today
          </h2>

          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Join thousands of practicing Muslims searching for marriage with Barakah, modesty, and family blessing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Download className="w-5 h-5 text-emerald-400" />
              <span>Download Android</span>
            </button>
            <button
              onClick={() => setShowIosModal(true)}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-rose-600 font-bold px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Smartphone className="w-5 h-5 text-rose-600" />
              <span>Download iOS (PWA)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. LUXURY LIGHT FOOTER */}
      <footer className="w-full bg-[#F7F6F2] border-t border-slate-200/80 pt-16 pb-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white p-1.5 shadow-xs border border-rose-100 flex items-center justify-center">
                  <img src="/icon.svg" alt="Qurb" className="w-5 h-5 object-contain" />
                </div>
                <span className="font-serif font-bold text-xl text-slate-900">Qurb</span>
              </div>
              <p className="text-slate-500 text-[11.5px] leading-relaxed">
                The premier Islamic matrimonial platform crafted for practicing Muslims seeking lawful marriage (Nikah) upon the Quran &amp; Sunnah.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Platform</h4>
              <ul className="space-y-1.5 text-[11.5px]">
                <li><a href="#features" className="hover:text-rose-600 transition-colors">Halal Pillars</a></li>
                <li><a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a></li>
                <li><button onClick={() => setShowAndroidModal(true)} className="hover:text-rose-600 transition-colors text-left cursor-pointer">Download Android</button></li>
                <li><button onClick={() => setShowIosModal(true)} className="hover:text-rose-600 transition-colors text-left cursor-pointer">Download iOS (PWA)</button></li>
                <li><button onClick={onLaunchWebApp} className="hover:text-rose-600 transition-colors text-left cursor-pointer">Open Web App</button></li>
              </ul>
            </div>

            {/* Col 3: Legal & Standards */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Policies &amp; Safety</h4>
              <ul className="space-y-1.5 text-[11.5px]">
                <li>
                  <a href="/privacy-policy" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                    <span>Privacy Policy</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                    <span>Terms of Service</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="/child-safety" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                    <span>Child Safety Standards (CSAE)</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Community Support</h4>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Have questions, safety concerns, or feedback?
              </p>
              <div className="space-y-1 text-[11.5px]">
                <div>Email: <a href="mailto:support@qurb.app" className="text-slate-900 font-semibold hover:underline">support@qurb.app</a></div>
                <div>Safety: <a href="mailto:safety@qurb.app" className="text-slate-900 font-semibold hover:underline">safety@qurb.app</a></div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; 2026 Qurb (Brandracker / Movemax Solutions). All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="/privacy-policy" className="hover:text-slate-900">Privacy</a>
              <a href="/terms" className="hover:text-slate-900">Terms</a>
              <a href="/child-safety" className="hover:text-slate-900">Child Safety</a>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL 1: iOS PWA INSTALLATION GUIDE MODAL */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6 relative text-left">
            <button 
              onClick={() => setShowIosModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Install Qurb on iPhone / iPad</h3>
                <p className="text-xs text-slate-500">Progressive Web App (PWA) • No App Store needed</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-900">Open in Safari:</strong> Ensure you are viewing <span className="text-rose-600 font-semibold">qurb.app</span> in Apple Safari on your iPhone.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-900">Tap Share:</strong> Tap the Safari <strong className="text-slate-900">Share icon 📤</strong> at the bottom bar of your screen.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-900">Add to Home Screen:</strong> Scroll down and select <strong className="text-rose-700">Add to Home Screen 📱</strong>.
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowIosModal(false);
                  onLaunchWebApp();
                }}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-600/25 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch iOS Web App Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Qurb will install to your home screen and run full-screen without browser address bars.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ANDROID DOWNLOAD MODAL */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative text-left">
            <button 
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Download Qurb for Android</h3>
                <p className="text-xs text-slate-500">Official Android Application</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <p className="leading-relaxed">
                Qurb is built natively for Android with Google Play Billing 8.0 support, instant push notifications, and verified modesty safeguards.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Play Release Bundle (v1.0.1)</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href="https://play.google.com/store/apps/details?id=app.qurb.serene"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Open on Google Play Store</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setShowAndroidModal(false);
                  onLaunchWebApp();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Or Launch Web App Immediately in Browser</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
