import React, { useState } from 'react';
import { 
  HeartHandshake, 
  EyeOff, 
  Eye,
  Mic, 
  Users, 
  ArrowRight, 
  Smartphone, 
  ChevronDown, 
  CheckCircle2, 
  Lock, 
  Star, 
  Compass, 
  Heart, 
  ExternalLink,
  ShieldCheck,
  Check,
  Play,
  Volume2
} from 'lucide-react';

interface Props {
  onLaunchWebApp: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchWebApp, onGetStarted, onLogin }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoBlurred, setDemoBlurred] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

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
      q: "Can I use Qurb on my iPhone or iPad?",
      a: "Absolutely! Qurb is fully optimized as a Progressive Web App (PWA). Simply tap 'Launch Web App' in Safari on your iPhone, tap the Share icon 📤, and select 'Add to Home Screen'. Qurb will install on your iPhone and run full-screen like a native app."
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
          Launch Web App Now →
        </button>
      </aside>

      {/* 2. STICKY LUXURY LIGHT NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
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
            <a href="#modesty" className="hover:text-rose-600 transition-colors">Modesty Shield</a>
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
              onClick={onLaunchWebApp}
              className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#FFF5F6]/60 via-[#FCFBF9] to-white">
        
        {/* Soft Ambient Radial Background Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-rose-500/7 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-[500px] h-[350px] bg-amber-400/6 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-60 left-10 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Sacred Bismillah Calligraphy */}
              <div 
                className="text-lg sm:text-2xl text-amber-900/80 tracking-widest font-normal"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>

              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200/90 text-rose-900 text-xs font-bold shadow-xs">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span>Halal Marriage Only • No Dating • Guardian (Wali) Supported</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Where Pure Intentions Meet <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                  Sacred Matrimony
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Marriage (Nikah) is half of your Deen. Qurb provides a dignified, sacred matrimonial platform crafted for practicing Muslims — with 1-to-1 photo modesty, halal voice introductions, and family chaperone oversight.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onLaunchWebApp}
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold text-base px-8 py-4 rounded-full shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Compass className="w-5 h-5" />
                  <span>Begin Your Halal Search</span>
                </button>

                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/90 font-bold text-base px-7 py-4 rounded-full shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Create Free Profile</span>
                  <ArrowRight className="w-4 h-4 text-rose-600" />
                </button>
              </div>

              {/* iPhone PWA Smart Callout Banner */}
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-600 max-w-xl">
                <Smartphone className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Using an iPhone?</strong> Open in Safari, tap <span className="text-slate-900 font-semibold">Share 📤</span> and select <span className="text-rose-700 font-bold">Add to Home Screen</span> for the native app feel.
                </span>
              </div>

              {/* 3 Quick Proof Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold text-slate-900 font-serif">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Nikah Focused</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold text-emerald-600 font-serif">1-to-1</div>
                  <div className="text-xs text-slate-500 font-medium">Photo Privacy</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold text-rose-600 font-serif">Wali</div>
                  <div className="text-xs text-slate-500 font-medium">Family Chaperone</div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Phone Mockup (Light Luxury Edition) */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Luxury Light Phone Chassis */}
              <div className="w-full max-w-[340px] rounded-[48px] bg-white p-3.5 shadow-[0_25px_60px_-15px_rgba(225,29,72,0.18),0_10px_25px_-5px_rgba(0,0,0,0.06)] border border-slate-200/90 relative">
                
                {/* Simulated iPhone Screen */}
                <div className="w-full rounded-[38px] bg-[#FAF9F7] overflow-hidden relative border border-slate-200 aspect-[9/19] flex flex-col justify-between p-3.5 select-none">
                  
                  {/* Top Status Bar Inside Mockup */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 pb-2">
                    <span className="font-serif font-bold text-slate-900 text-xs flex items-center gap-1">
                      <img src="/icon.svg" className="w-3.5 h-3.5" alt="Qurb" /> Qurb
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>

                  {/* Profile Card Mockup with Interactive Blur */}
                  <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex flex-col justify-between p-3.5 shadow-sm">
                    {/* Background Candidate Image */}
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${demoBlurred ? 'blur-md scale-105 opacity-80' : 'blur-none scale-100 opacity-95'}`}
                      style={{ backgroundImage: "url('/halal_couple_bg.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Top Modesty Blur Toggle Button */}
                    <div className="relative z-10 flex justify-end">
                      <button
                        onClick={() => setDemoBlurred(!demoBlurred)}
                        className="bg-white/90 backdrop-blur-md border border-white/40 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shadow-md hover:bg-white cursor-pointer transition-all"
                      >
                        {demoBlurred ? (
                          <>
                            <Lock className="w-3 h-3 text-rose-600" />
                            <span>Modesty Shield Active</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Photo Revealed</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Candidate Biodata Snippet */}
                    <div className="relative z-10 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-white">Maryam, 25</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-xs text-white/90">London, UK · Architect &amp; Hafidha</p>
                      
                      {/* Deen Tags */}
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9.5px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                          Prayers: 5x Daily
                        </span>
                        <span className="text-[9.5px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                          Mahr: Sunnah
                        </span>
                        <span className="text-[9.5px] bg-emerald-500/80 text-white px-2 py-0.5 rounded-full font-semibold">
                          Wali Chaperoned
                        </span>
                      </div>

                      {/* Interactive Voice Greeting Audio Player */}
                      <div className="pt-1">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-white text-[10px] transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                              {isPlayingAudio ? <Volume2 className="w-3 h-3 animate-pulse" /> : <Play className="w-2.5 h-2.5 fill-white ml-0.5" />}
                            </div>
                            <span className="font-semibold">{isPlayingAudio ? 'Playing Greeting...' : 'Listen to Voice Bio'}</span>
                          </div>
                          <span className="text-[9px] text-white/70">0:18</span>
                        </button>
                      </div>

                      {/* Action buttons inside mockup */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button 
                          onClick={onLaunchWebApp}
                          className="w-full py-1.5 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer"
                        >
                          Respectful Pass
                        </button>
                        <button 
                          onClick={onLaunchWebApp}
                          className="w-full py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-[10.5px] rounded-lg shadow-md transition-colors cursor-pointer"
                        >
                          Send Salam ♡
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive click prompt */}
                  <div className="text-center pt-2 text-[10px] text-slate-500 font-medium">
                    Tap the shield to preview 1-to-1 photo unblurring
                  </div>

                </div>

              </div>

            </div>

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

      {/* 6. MODESTY SPOTLIGHT (BEFORE / AFTER) */}
      <section id="modesty" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Proprietary Modesty Shield</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Character First, <br />
                Appearance with Consent
              </h2>
              
              <p className="text-slate-600 text-base leading-relaxed">
                In mainstream matchmaking apps, personal photos are exposed to thousands of strangers without accountability. On Qurb, sisters and brothers retain complete autonomy over who views their likeness.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Public Blurred State</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Candidates evaluate your prayer commitment, education, family values, and Islamic lifestyle first.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Mutual 1-to-1 Reveal</h4>
                    <p className="text-xs text-slate-500 mt-0.5">When both members express mutual interest, photos unblur privately for that specific match only.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLaunchWebApp}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Experience the Modesty Shield</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Demonstration Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Blurred Card */}
              <div className="bg-[#FAF9F6] p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-inner">
                  <div 
                    className="w-full h-full bg-cover bg-center blur-md scale-105"
                    style={{ backgroundImage: "url('/halal_couple_bg.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
                    <Lock className="w-7 h-7 text-rose-400 mb-1" />
                    <span className="text-xs font-bold">Public Feed View</span>
                    <span className="text-[10px] text-white/80">Modesty Shield Active</span>
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-900">Deen First Evaluation</h4>
                  <p className="text-[11px] text-slate-500">Evaluated on piety, character, and marriage intent.</p>
                </div>
              </div>

              {/* Revealed Card */}
              <div className="bg-[#FAF9F6] p-5 rounded-3xl border border-rose-200/80 shadow-md space-y-3 text-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-inner">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/halal_couple_bg.jpg')" }}
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs">
                    Mutual Approval
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-900">1-to-1 Private Reveal</h4>
                  <p className="text-[11px] text-slate-500">Unlocked only between mutually agreed matches.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. THE 3-STEP JOURNEY TO NIKAH */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#FAF9F6]">
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
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Create Your Dignified Profile</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Detail your Islamic practice (prayers, Quran habits, Halal lifestyle), education, family background, and Mahr expectations. Sisters can optionally register their Wali.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-serif font-bold text-xl">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Values-Based Matching &amp; Reveal</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse candidates aligned with your Deen and geography. Listen to spoken voice bios. When there is mutual interest, photos unblur privately for both of you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative space-y-4">
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

      {/* 8. COMPARISON TABLE */}
      <section id="comparison" className="py-20 bg-white border-y border-slate-200/80">
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
            <table className="w-full max-w-4xl mx-auto text-left border-collapse bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-xs border border-slate-200">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-xs font-bold text-slate-500 uppercase tracking-wider">
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

      {/* 9. UNIVERSAL ACCESS & PWA DOWNLOAD SECTION */}
      <section id="download" className="py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-lg shadow-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <span>Available Everywhere</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Seamless Across All Devices
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Use Qurb directly in your browser on desktop or mobile, install it as an iOS Progressive Web App, or download the native Android app.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={onLaunchWebApp}
                    className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Launch Web App</span>
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-full active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign Up Free</span>
                  </button>
                </div>
              </div>

              {/* iOS PWA Step-by-Step Card */}
              <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-rose-100 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Install on iPhone (PWA)</h4>
                    <p className="text-[11px] text-slate-500">No App Store account needed</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Open <strong className="text-slate-900">qurb.app</strong> in Safari on your iPhone.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Tap the Safari <strong className="text-slate-900">Share icon 📤</strong> at the bottom.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Scroll down and tap <strong className="text-rose-700">Add to Home Screen 📱</strong>.</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 italic">
                  Qurb will appear on your home screen and launch full-screen.
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ) */}
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

      {/* 11. PRE-FOOTER CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Begin with Bismillah</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Complete Half Your Deen Today
          </h2>

          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Join thousands of practicing Muslims searching for marriage with Barakah, modesty, and family blessing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onLaunchWebApp}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-rose-600 font-bold text-base px-8 py-4 rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Web App (Free)</span>
              <ArrowRight className="w-5 h-5 text-rose-600" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto bg-black/20 hover:bg-black/30 border border-white/30 text-white font-semibold text-base px-7 py-4 rounded-full active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Sign In to Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* 12. LUXURY LIGHT FOOTER */}
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
                <li><a href="#modesty" className="hover:text-rose-600 transition-colors">Modesty Photo Shield</a></li>
                <li><a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a></li>
                <li><a href="#download" className="hover:text-rose-600 transition-colors">Download App</a></li>
                <li><button onClick={onLaunchWebApp} className="hover:text-rose-600 transition-colors text-left cursor-pointer">Launch Web App</button></li>
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

    </div>
  );
};

export default LandingPage;
