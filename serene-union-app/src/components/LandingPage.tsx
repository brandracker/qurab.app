import React, { useState } from 'react';
import { 
  HeartHandshake, 
  EyeOff, 
  Users, 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Mic, 
  X,
  Lock
} from 'lucide-react';

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
      a: "In accordance with Islamic modesty (Haya), members can keep their profile photos blurred by default on the public feed. Photos are only unblurred on a 1-to-1 basis when both members grant mutual reveal approval."
    },
    {
      q: "Can sisters include their Wali (family guardian)?",
      a: "Yes! Sisters have the option to add their Wali's name, relationship, and contact details during profile creation. The Wali can be included as a chaperone in conversations to maintain Islamic adab and family blessing."
    },
    {
      q: "How do I install Qurb on iPhone / iPad?",
      a: "Tap 'Download on App Store (PWA)' above, open qurb.app in Safari, tap the Share button 📤, and select 'Add to Home Screen 📱'. Qurb will install full-screen directly on your iPhone."
    },
    {
      q: "Is Qurb free to use?",
      a: "Yes, registration, profile discovery, and daily likes are completely free. Users can also earn additional likes for free. Optional VIP passes are available for members who want priority visibility."
    },
    {
      q: "How is my personal data protected?",
      a: "Your data is treated as a sacred trust (Amanah). We never sell your data or monetize private details with ad networks. All communications are TLS-encrypted on secure infrastructure."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FCFBF9] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600 overflow-x-hidden">
      
      {/* 1. TOP MINIMAL ANNOUNCEMENT */}
      <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-emerald-50/80 border-b border-slate-200/60 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          New
        </span>
        <span>Seeking righteous marriage upon the Quran &amp; Sunnah.</span>
        <button 
          onClick={onLaunchWebApp}
          className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
        >
          Open Web App →
        </button>
      </aside>

      {/* 2. CLEAN MINIMAL NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white p-1.5 shadow-xs border border-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Qurb Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                Qurb
              </span>
              <span className="text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Nikah
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Halal Pillars</a>
            <a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-rose-600 transition-colors">FAQ</a>
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
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. MINIMAL HERO SECTION WITH GENERATED BACKGROUND & OFFICIAL STORE ICONS */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden bg-white">
        
        {/* Background Matrimonial Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/hero_matrimony.jpg')" }}
        />

        {/* Soft Warm Light Luxury Gradient Overlay for Clean Readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(252, 251, 249, 0.90) 0%, rgba(252, 251, 249, 0.76) 45%, rgba(252, 251, 249, 0.98) 100%)'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6 py-16 sm:py-24">
          
          {/* Sacred Bismillah */}
          <div 
            className="text-xl sm:text-2xl text-amber-900/80 tracking-widest font-normal"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          {/* Minimal Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>Pure Halal Matrimony • Guardian (Wali) Supported</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.14]">
            Where Pure Intentions Meet <br />
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              Sacred Unions
            </span>
          </h1>

          {/* Minimal 2-Line Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Finding your righteous spouse upon the Quran and Sunnah. Guard your modesty with 1-to-1 photo privacy, listen to authentic voice bios, and complete half your Deen with family blessing.
          </p>

          {/* TWO OFFICIAL STORE BADGE BUTTONS (Google Play & App Store) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            
            {/* 1. Google Play Store Button */}
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full sm:w-auto min-w-[210px] bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-800 group"
            >
              <GooglePlayIcon className="w-6 h-6 text-white shrink-0 group-hover:scale-105 transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[9.5px] text-slate-300 font-medium tracking-wider uppercase">GET IT ON</div>
                <div className="text-base font-bold text-white tracking-tight">Google Play</div>
              </div>
            </button>

            {/* 2. Apple App Store (PWA) Button */}
            <button
              onClick={() => setShowIosModal(true)}
              className="w-full sm:w-auto min-w-[210px] bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-800 group"
            >
              <AppStoreIcon className="w-6 h-6 text-white shrink-0 group-hover:scale-105 transition-transform" />
              <div className="text-left leading-tight">
                <div className="text-[9.5px] text-slate-300 font-medium tracking-wider uppercase">DOWNLOAD ON</div>
                <div className="text-base font-bold text-white tracking-tight">App Store <span className="text-[10.5px] text-rose-400 font-normal">(PWA)</span></div>
              </div>
            </button>

          </div>

          {/* Subtle Direct Browser Link */}
          <div className="pt-1">
            <button
              onClick={onLaunchWebApp}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline underline-offset-4 cursor-pointer transition-colors"
            >
              Or continue in browser on desktop →
            </button>
          </div>

        </div>

      </section>

      {/* 4. MINIMAL TRUST TICKER */}
      <section className="w-full bg-white border-y border-slate-200/70 py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rose-600" />
              <span>100% Nikah Intent</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold">
              <EyeOff className="w-4 h-4 text-emerald-600" />
              <span>1-to-1 Photo Privacy</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Wali Chaperoned</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Privacy as Amanah</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOUR CORE HALAL PILLARS */}
      <section id="features" className="py-16 sm:py-24 bg-[#FCFBF9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              The Pillars of Islamic Matrimony
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Engineered from the ground up to uphold Islamic dignity and protect your modesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-rose-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">100% Nikah Intent</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every member commits strictly to lawful marriage. Casual dating, flirtatious small talk, and dishonest intentions result in an immediate permanent ban.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Modesty Photo Shield</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Keep photos blurred on the public feed. Candidate likenesses are only revealed 1-to-1 upon explicit, mutual approval by both parties.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-amber-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Wali &amp; Family Involvement</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Islam honors family adab. Sisters can register their Wali's contact details so guardians can chaperone conversations from the outset.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Halal Voice Bios</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hear authentic spoken voice introductions to evaluate a candidate's maturity, articulation, and demeanor respectfully.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. MINIMAL 3-STEP JOURNEY */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              The Path to Nikah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A straightforward, transparent process adhering to Islamic principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#FCFBF9] rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Create Profile</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Specify your Deen commitment, prayer routine, education, and Mahr expectations. Sisters can optionally invite their Wali.
              </p>
            </div>

            <div className="bg-[#FCFBF9] rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Connect with Adab</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Discover intent-matched candidates. Listen to spoken voice bios. Photos unblur only when mutual consent is granted.
              </p>
            </div>

            <div className="bg-[#FCFBF9] rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Involve Families</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Communicate respectfully with Wali oversight, arrange a lawful family meeting, and complete half your Deen.
              </p>
            </div>

          </div>

          {/* Quranic Verse Box */}
          <div className="mt-12 p-6 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-center space-y-2">
            <div 
              className="text-lg sm:text-xl text-amber-900 font-serif leading-relaxed"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic font-serif">
              "And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy."
            </p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Surah Ar-Rum (30:21)
            </p>
          </div>

        </div>
      </section>

      {/* 7. MINIMAL FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-24 bg-[#FCFBF9]">
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
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. MINIMAL BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Complete Half Your Deen Today
          </h2>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Join practicing Muslims searching for marriage with Barakah, modesty, and family blessing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            
            {/* Google Play */}
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full sm:w-auto min-w-[200px] bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-800"
            >
              <GooglePlayIcon className="w-5 h-5 text-white shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-slate-300 font-medium tracking-wider uppercase">GET IT ON</div>
                <div className="text-sm font-bold text-white tracking-tight">Google Play</div>
              </div>
            </button>

            {/* App Store (PWA) */}
            <button
              onClick={() => setShowIosModal(true)}
              className="w-full sm:w-auto min-w-[200px] bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-800"
            >
              <AppStoreIcon className="w-5 h-5 text-white shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-slate-300 font-medium tracking-wider uppercase">DOWNLOAD ON</div>
                <div className="text-sm font-bold text-white tracking-tight">App Store <span className="text-[10px] text-rose-400 font-normal">(PWA)</span></div>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* 9. MINIMAL LUXURY FOOTER */}
      <footer className="w-full bg-[#F7F6F2] border-t border-slate-200/80 py-10 text-slate-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white p-1 shadow-2xs border border-rose-100 flex items-center justify-center">
                <img src="/icon.svg" alt="Qurb" className="w-4 h-4 object-contain" />
              </div>
              <span className="font-serif font-bold text-lg text-slate-900">Qurb</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 text-[11px]">Pure Halal Islamic Matrimony &amp; Nikah</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
              <a href="/privacy-policy" className="hover:text-slate-900">Privacy Policy</a>
              <a href="/terms" className="hover:text-slate-900">Terms of Service</a>
              <a href="/child-safety" className="hover:text-slate-900">Child Safety Standards</a>
              <a href="mailto:support@qurb.app" className="hover:text-slate-900">Support</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>&copy; 2026 Qurb (Brandracker / Movemax Solutions). All rights reserved.</div>
            <div>Built for practicing Muslims upon the Quran and Sunnah.</div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: iOS PWA INSTALLATION GUIDE MODAL */}
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
                  <strong className="text-slate-900">Open Safari:</strong> Visit <span className="text-rose-600 font-semibold">qurb.app</span> in Apple Safari on your iPhone.
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

      {/* MODAL 2: ANDROID DOWNLOAD MODAL */}
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

    </div>
  );
};

export default LandingPage;
