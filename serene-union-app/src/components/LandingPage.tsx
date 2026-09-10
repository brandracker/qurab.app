import React, { useState } from 'react';
import { 
  HeartHandshake, 
  EyeOff, 
  Mic, 
  Users, 
  ArrowRight, 
  Download, 
  Smartphone, 
  ChevronDown, 
  CheckCircle2, 
  Lock, 
  Star,
  Compass,
  Heart,
  ExternalLink
} from 'lucide-react';

interface Props {
  onLaunchWebApp: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchWebApp, onGetStarted, onLogin }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoBlurred, setDemoBlurred] = useState(true);

  const faqs = [
    {
      q: "Is Qurb strictly for marriage (Nikah)?",
      a: "Yes, 100%. Qurb is built exclusively for practicing Muslims seeking lawful Islamic marriage. Casual dating, hookups, or non-marital relationships are strictly prohibited and result in an immediate permanent ban."
    },
    {
      q: "How does the Modesty Photo Shield work?",
      a: "In accordance with Islamic modesty principles, members can keep their profile photos blurred by default on the public feed. Photos are only unblurred on a 1-to-1 basis when both members grant mutual reveal approval. Taking screenshots of revealed photos is strictly forbidden."
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
    <div className="w-full min-h-screen bg-[#0B0F17] text-white font-sans selection:bg-rose-500/30 selection:text-rose-400 overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT / PWA BANNER FOR MOBILE BROWSERS */}
      <aside aria-label="App announcement" className="w-full bg-gradient-to-r from-rose-900/90 via-emerald-950/80 to-slate-900 border-b border-white/10 px-4 py-2 text-center text-xs font-medium text-white/90 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Star className="w-3 h-3 fill-rose-400 text-rose-400" /> Web & Android Ready
        </span>
        <span className="hidden sm:inline">Seeking marriage upon the Quran & Sunnah.</span>
        <button 
          onClick={onLaunchWebApp}
          className="underline hover:text-white font-semibold text-rose-300 ml-1 cursor-pointer"
        >
          Launch Web App Now →
        </button>
      </aside>

      {/* 2. STICKY LUXURY NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-[#0B0F17]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 p-2 shadow-lg shadow-rose-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/white-icon.svg" alt="Qurb Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Qurb
                <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Halal
                </span>
              </span>
              <p className="text-[10px] text-white/50 -mt-1 hidden sm:block tracking-wider uppercase font-medium">Muslim Matrimony & Nikah</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#modesty" className="hover:text-white transition-colors">Modesty Shield</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#values" className="hover:text-white transition-colors">Deen Alignment</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onLogin}
              className="text-xs sm:text-sm font-medium text-white/80 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchWebApp}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-[450px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Sacred Bismillah */}
              <div 
                className="text-lg sm:text-xl text-rose-300/80 tracking-widest font-normal"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>

              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Pure Halal Matrimony for Serious Muslims</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Find Your Righteous Spouse <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  The Pure Halal Way
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Marriage (Nikah) is half of your Deen. Qurb provides a dignified, sacred matrimonial experience with 1-to-1 photo modesty, halal voice greetings, and family chaperone (Wali) support.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onLaunchWebApp}
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-2xl shadow-rose-600/40 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Compass className="w-5 h-5" />
                  <span>Launch Web App (Free)</span>
                </button>

                <a
                  href="#download"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm sm:text-base px-6 py-4 rounded-full backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <Download className="w-5 h-5 text-emerald-400" />
                  <span>Get on Android</span>
                </a>
              </div>

              {/* iPhone PWA Smart Callout */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-white/60">
                <Smartphone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>iPhone User?</strong> Tap Launch App in Safari & select <span className="text-white font-semibold">Share 📤 &gt; Add to Home Screen</span>.
                </span>
              </div>

              {/* 3 Quick Proof Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="space-y-0.5">
                  <div className="text-xl font-bold text-white font-serif">100%</div>
                  <div className="text-[11px] text-white/50">Nikah Focused</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xl font-bold text-emerald-400 font-serif">1-to-1</div>
                  <div className="text-[11px] text-white/50">Photo Modesty</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xl font-bold text-rose-400 font-serif">Wali</div>
                  <div className="text-[11px] text-white/50">Family Chaperone</div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Outer Luxury Phone Mockup */}
              <div className="w-full max-w-[340px] rounded-[44px] bg-[#161B26] p-3 shadow-2xl shadow-rose-950/40 border border-white/15 relative">
                
                {/* Simulated Phone Screen */}
                <div className="w-full rounded-[36px] bg-slate-950 overflow-hidden relative border border-white/10 aspect-[9/19] flex flex-col justify-between p-4">
                  
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between text-[11px] text-white/60 pt-1 pb-2">
                    <span className="font-serif font-bold text-white text-xs">Qurb Discover</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Verified Profile
                    </span>
                  </div>

                  {/* Profile Card Mockup */}
                  <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col justify-end p-4">
                    {/* Background Simulated Image */}
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${demoBlurred ? 'blur-md scale-105 opacity-80' : 'blur-none scale-100 opacity-95'}`}
                      style={{ backgroundImage: "url('/halal_couple_bg.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                    {/* Modesty Blur Badge / Toggle Button */}
                    <div className="relative z-10 mb-3 flex items-center justify-between">
                      <button
                        onClick={() => setDemoBlurred(!demoBlurred)}
                        className="bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 cursor-pointer hover:bg-black/80 transition-all"
                      >
                        <EyeOff className="w-3 h-3 text-rose-400" />
                        <span>{demoBlurred ? 'Modesty Shield Active (Click to Reveal)' : 'Mutual Reveal Active'}</span>
                      </button>
                    </div>

                    {/* Candidate Biodata Snippet */}
                    <div className="relative z-10 space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-white">Maryam, 25</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-xs text-white/80">London, UK · Architect</p>
                      
                      {/* Deen Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90">Sunni · Hanafi</span>
                        <span className="text-[10px] bg-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-full">Prays 5x Daily</span>
                        <span className="text-[10px] bg-rose-500/25 text-rose-300 px-2 py-0.5 rounded-full">Wali Connected</span>
                      </div>

                      {/* Simulated Audio Greeting Bar */}
                      <div className="mt-2 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                          <Mic className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 text-[10px] text-white/80 truncate">
                          Halal Voice Greeting (0:12)
                        </div>
                        <div className="flex gap-0.5 items-center">
                          <span className="w-0.5 h-3 bg-rose-400 rounded-full animate-pulse" />
                          <span className="w-0.5 h-4 bg-rose-400 rounded-full animate-pulse delay-75" />
                          <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-pulse delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar inside Mockup */}
                  <div className="pt-3 flex items-center justify-around">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60">
                      ✕
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 shadow-lg shadow-rose-600/30 flex items-center justify-center text-white">
                      <Heart className="w-6 h-6 fill-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-amber-400">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CORE HALAL PILLARS */}
      <section id="features" className="py-20 bg-[#0F1420] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              The Halal Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Designed with Sanctity, Dignity &amp; Family
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              We took away what made mainstream apps toxic and replaced it with Islamic adab, sacred privacy, and transparent family involvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05] transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">100% Nikah Focused</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Zero casual dating, time-wasting, or non-marital friendships. Every profile is created with a sincere intention to seek a marriage partner upon Sunnah.
              </p>
            </div>

            {/* Card 2 */}
            <div id="modesty" className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">1-to-1 Modesty Shield</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Protect your modesty. Photos stay blurred on the public feed by default and are revealed strictly upon mutual 1-to-1 consent. Screenshots are prohibited.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.05] transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Halal Voice Greetings</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Hear their demeanor, speech, and adab before matching. Short 10-15s authentic audio greetings break the ice with dignity and respect.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Wali Chaperone Support</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Sisters can seamlessly invite their father, brother, or legal guardian into conversation threads to provide peace of mind and family blessing from day one.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              The Path to Nikah
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              3 Simple Steps to Your Righteous Spouse
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-400 font-serif font-bold text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Create Verified Deen Profile</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Specify your prayer routine, sect, madhhab, halal diet, education, career, and marriage timeline with honest intention.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-serif font-bold text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Discover &amp; Listen</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Filter prospective matches by lifestyle alignment. Listen to voice greetings and review biodata under Modesty Shield protection.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-400 font-serif font-bold text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Involve Family &amp; Nikah</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Exchange dignified salams, introduce your Wali into the conversation, and progress with family approval towards blessed matrimony.
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={onLaunchWebApp}
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm px-8 py-3.5 rounded-full shadow-xl transition-all cursor-pointer"
            >
              <span>Start Your Search Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. DEEN & SUNNAH VALUES MATRIX */}
      <section id="values" className="py-20 bg-[#0C1019] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Spiritual Compatibility
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Match on What Truly Matters for the Hereafter
              </h2>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Mainstream dating apps match you on shallow swipes. Qurb is built from the ground up around religious values, character, and Sunnah lifestyle alignment.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Salah & Daily Prayer Routine", desc: "Always, usually, or striving — find someone on the same spiritual rhythm." },
                  { title: "Sect & Madhhab Clarity", desc: "Filter transparently across Sunni (Hanafi, Shafi'i, Maliki, Hanbali), Shia, or Just Muslim." },
                  { title: "Halal Dietary & Lifestyle Standard", desc: "Strictly halal eating, non-smoking, and family values." },
                  { title: "Relocation & Nikah Timeline", desc: "Align expectations on when and where you plan to establish your home." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/30 to-slate-900 border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Our Islamic Privacy Promise</h3>
                    <p className="text-xs text-white/50">Amanah &amp; User Data Sanctity</p>
                  </div>
                </div>

                <blockquote className="italic text-sm text-white/80 border-l-2 border-rose-500 pl-4 py-1 leading-relaxed">
                  "A Muslim is the one from whose tongue and hand other Muslims are safe, and the believer is the one with whom people entrust their lives and wealth."
                  <span className="block not-italic text-xs text-white/40 mt-1.5">— Sunan an-Nasa'i 4995</span>
                </blockquote>

                <p className="text-xs text-white/60 leading-relaxed">
                  At Qurb, your data and pictures are never shared with advertising brokers. You maintain full ownership of your account and can permanently delete all data at any moment with 1 click.
                </p>

                <div className="pt-2">
                  <a
                    href="/privacy-policy"
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 underline"
                  >
                    Read our Full Privacy Policy &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. APP DOWNLOAD / PLATFORM SECTION */}
      <section id="download" className="py-20 bg-gradient-to-b from-[#0F1420] to-[#0B0F17] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Universal Access
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Available Everywhere on Web, iPhone &amp; Android
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
              Whether you are on a laptop, tablet, iPhone, or Android device, Qurb runs with zero lag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
            
            {/* Android Option */}
            <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Android Application</h4>
              </div>
              <p className="text-xs text-white/60">
                Official Android bundle with Google Play In-App Billing, 1-tap checkout, and push notifications.
              </p>
              <div className="pt-1">
                <button
                  onClick={onLaunchWebApp}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get on Android (Google Play)</span>
                </button>
              </div>
            </div>

            {/* iOS PWA Option */}
            <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">iPhone &amp; iPad (PWA)</h4>
              </div>
              <p className="text-xs text-white/60">
                Install directly from Safari without App Store hassle: Tap Share 📤 &gt; Add to Home Screen.
              </p>
              <div className="pt-1">
                <button
                  onClick={onLaunchWebApp}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open PWA on iPhone</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#0C1019] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-rose-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. BOTTOM FINAL CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-rose-950/80 via-slate-900 to-emerald-950/80 border-t border-white/10 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <div 
            className="text-base sm:text-lg text-rose-300/80 tracking-widest font-normal"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Begin Your Halal Journey Today
          </h2>

          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            "And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them." [Quran 30:21]
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-500 hover:opacity-95 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Free Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLaunchWebApp}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm px-6 py-3.5 rounded-full transition-all cursor-pointer"
            >
              <span>Open Web App</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE COMPLIANCE FOOTER */}
      <footer className="w-full bg-[#070A10] border-t border-white/10 py-12 text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-600 p-1 flex items-center justify-center">
                  <img src="/white-icon.svg" alt="Qurb" className="w-4 h-4 object-contain" />
                </div>
                <span className="font-serif text-lg font-bold text-white">Qurb</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                The premier halal Islamic matrimony &amp; Nikah platform. Dedicated with sincerity to the global Muslim Ummah.
              </p>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">Access Qurb</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={onLaunchWebApp} className="hover:text-white transition-colors cursor-pointer text-left">
                    Web Application
                  </button>
                </li>
                <li>
                  <a href="#download" className="hover:text-white transition-colors">
                    Android APK / Google Play
                  </a>
                </li>
                <li>
                  <button onClick={onLaunchWebApp} className="hover:text-white transition-colors cursor-pointer text-left">
                    iPhone PWA (Safari)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Standards */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">Policies &amp; Safety</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="/privacy-policy" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                    <span>Privacy Policy</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                    <span>Terms of Service</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a href="/child-safety" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                    <span>Child Safety Standards (CSAE)</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">Community Support</h4>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Have questions, safety concerns, or feedback?
              </p>
              <div className="space-y-1 text-[11px]">
                <div>Email: <a href="mailto:support@qurb.app" className="text-white font-medium hover:underline">support@qurb.app</a></div>
                <div>Safety: <a href="mailto:safety@qurb.app" className="text-white font-medium hover:underline">safety@qurb.app</a></div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <div>
              &copy; 2026 Qurb (Brandracker / Movemax Solutions). All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="/privacy-policy" className="hover:text-white">Privacy</a>
              <a href="/terms" className="hover:text-white">Terms</a>
              <a href="/child-safety" className="hover:text-white">Child Safety</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
