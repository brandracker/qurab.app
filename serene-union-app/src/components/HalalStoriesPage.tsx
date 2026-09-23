import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HeartHandshake, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  ShieldCheck,
  Share2,
  Check,
  Heart
} from 'lucide-react';
import { halalStoriesData, type HalalStory } from '../data/storiesData';

interface Props {
  onBackToLanding: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
  initialStoryId?: string | null;
}

export const HalalStoriesPage: React.FC<Props> = ({
  onBackToLanding,
  onGetStarted,
  onLogin,
  initialStoryId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [activeStory, setActiveStory] = useState<HalalStory | null>(() => {
    if (initialStoryId) {
      return halalStoriesData.find(s => s.id === initialStoryId || s.slug === initialStoryId) || null;
    }
    return null;
  });

  // Sync on direct hash changes (e.g. forward/back buttons or manual link navigation)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const parts = hash.split('/');
      const slug = parts.length > 1 ? parts[1] : null;
      if (slug) {
        const found = halalStoriesData.find(s => s.id === slug || s.slug === slug);
        if (found) {
          setActiveStory(found);
        }
      } else if (hash === '#stories' || hash === '#halal-stories') {
        setActiveStory(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const categories = ['All', 'Wali Chaperoned', 'Voice Bio Match', 'Sunnah Aligned', 'Cross-Cultural', 'Revert Journey'];

  const filteredStories = selectedCategory === 'All'
    ? halalStoriesData
    : halalStoriesData.filter(s => s.category === selectedCategory);

  const handleShareStory = (story: HalalStory) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://qurb.app/#stories/${story.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `${story.coupleNames} - ${story.title}`,
        text: story.quote,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2500);
    }
  };

  // =========================================================================
  // DEDICATED FULL-PAGE STORY READER (No Modals, Distraction-Free Reading)
  // =========================================================================
  if (activeStory) {
    const relatedStories = halalStoriesData
      .filter(s => s.id !== activeStory.id)
      .slice(0, 3);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://qurb.app/#stories/${activeStory.slug}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeStory.coupleNames}: ${activeStory.title} - Read their Nikah journey on Qurb: ${shareUrl}`)}`;

    return (
      <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600">
        
        {/* 1. Top Announcement Bar */}
        <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-b border-slate-200/80 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Nikah Testimony
          </span>
          <span>A lawful union founded upon Haya, guardian chaperoning, and Barakah.</span>
          <button 
            onClick={onGetStarted}
            className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
          >
            Find Your Spouse on Qurb →
          </button>
        </aside>

        {/* 2. Sticky Header */}
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveStory(null);
                  window.location.hash = '#stories';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Close Story"
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>All Stories</span>
              </button>

              <button 
                onClick={() => {
                  setActiveStory(null);
                  window.location.hash = '#stories';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white p-1.5 shadow-2xs border border-rose-200 flex items-center justify-center">
                  <img src="/icon.svg" alt="Qurb Logo" className="w-6 h-6 object-contain" />
                </div>
                <div className="hidden sm:block">
                  <span style={{ fontFamily: "'Raleway', sans-serif" }} className="text-xl font-extrabold tracking-tight text-slate-900">
                    Qurb
                  </span>
                  <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 ml-1.5 border border-rose-200">
                    Stories
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Share on WhatsApp</span>
              </a>

              <button
                onClick={onGetStarted}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Join Qurb
              </button>
            </div>
          </div>
        </header>

        {/* 3. Full Story Main Body */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button 
              onClick={() => {
                setActiveStory(null);
                window.location.hash = '#stories';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-rose-600 cursor-pointer"
            >
              Halal Stories
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{activeStory.category}</span>
          </nav>

          {/* Meta Pill Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs uppercase tracking-wider">
              {activeStory.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Sacred Nikah</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-emerald-600" />
              {activeStory.timeToNikah}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-amber-600" />
              {activeStory.weddingDate}
            </span>
          </div>

          {/* Story Title */}
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-6">
            {activeStory.title}
          </h1>

          {/* Couple Bar & Location */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-1.5">
                  <span>{activeStory.coupleNames}</span>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeStory.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShareStory(activeStory)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              {copiedSlug ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>

          {/* Large Hero Image */}
          <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-slate-200/90 mb-10 bg-slate-100">
            <img 
              src={activeStory.image} 
              alt={activeStory.coupleNames} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Featured Quote Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-amber-50/70 border border-amber-200/80 mb-10 flex items-start gap-4">
            <Quote className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
            <p className="font-serif italic text-base sm:text-xl text-slate-900 leading-relaxed">
              "{activeStory.quote}"
            </p>
          </div>

          {/* Story Narrative Sections */}
          <article className="max-w-3xl mx-auto space-y-10">
            
            {/* 1. How They Connected */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-rose-500 pl-4 py-1 leading-snug flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-rose-600 shrink-0" />
                <span>How They Connected</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {activeStory.theMatch}
              </p>
            </section>

            {/* 2. The Wali's Chaperoning & Family Blessing */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-emerald-500 pl-4 py-1 leading-snug flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>The Wali’s Chaperoning &amp; Family Blessing</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {activeStory.waliRole}
              </p>
            </section>

            {/* 3. Timeline Milestones */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-amber-500 pl-4 py-1 leading-snug flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                <span>From Salam to Nikah: The Timeline</span>
              </h2>
              <div className="space-y-3 pt-2">
                {activeStory.timelineMilestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 text-slate-700">
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        {m.time}
                      </div>
                      <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                        {m.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Their Advice to Marriage Seekers */}
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-3 shadow-2xs">
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
                <span>Their Advice to Marriage Seekers</span>
              </div>
              <p className="font-serif text-base sm:text-lg text-slate-800 italic leading-relaxed">
                "{activeStory.adviceForSingles}"
              </p>
            </div>

            {/* 5. Islamic Matrimonial Dua */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-center space-y-3 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Sacred Sunnah Nikah Dua
              </div>
              <p 
                className="text-xl sm:text-2xl text-emerald-950 font-serif leading-relaxed"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                {activeStory.dua}
              </p>
              <p className="text-xs sm:text-sm text-emerald-800 italic max-w-md mx-auto">
                "May Allah bless you, shower His blessings upon you, and join you together in goodness."
              </p>
            </div>

            {/* Social Share Strip */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="font-bold text-sm text-slate-900">Inspired by their Halal journey?</div>
                <div className="text-xs text-slate-500">Share with family, friends, or a loved one seeking marriage.</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share via WhatsApp</span>
                </a>
                <button
                  onClick={() => handleShareStory(activeStory)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* High-Converting App CTA Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white space-y-4 text-center shadow-xl">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Begin Your Own Journey
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                Where Halal Love Begins with Barakah
              </h3>
              <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Connect with practicing Muslim singles who share your values, involve your Wali with dignity, and keep conversations modest and intentional.
              </p>
              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="bg-white text-rose-700 font-extrabold px-8 py-3.5 rounded-full text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Start Your Own Halal Story Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setActiveStory(null);
                  window.location.hash = '#stories';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Close Story"
                className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Stories</span>
              </button>
            </div>

            {/* Related Stories */}
            {relatedStories.length > 0 && (
              <div className="pt-12 border-t border-slate-200/80 space-y-6">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  More Halal Nikah Journeys
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedStories.map(story => (
                    <div
                      key={story.id}
                      onClick={() => {
                        setActiveStory(story);
                        window.location.hash = `#stories/${story.slug}`;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                          <img src={story.image} alt={story.coupleNames} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            {story.category}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                            {story.coupleNames}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            "{story.quote}"
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-0 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <span>Read Journey</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#F5F4F0] border-t border-slate-200 py-8 text-slate-600 text-xs text-center mt-16">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <p>&copy; {new Date().getFullYear()} Qurb Halal Matrimony. Honoring the Sacred Sunnah of Nikah.</p>
            <div className="flex items-center justify-center gap-4 text-slate-500">
              <button 
                onClick={() => {
                  setActiveStory(null);
                  window.location.hash = '#stories';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-rose-600 cursor-pointer"
              >
                All Stories
              </button>
              <span>•</span>
              <button onClick={onBackToLanding} className="hover:text-rose-600 cursor-pointer">Landing Page</button>
              <span>•</span>
              <a href="/privacy-policy" className="hover:text-rose-600">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-rose-600">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    );
  }

  // =========================================================================
  // MAIN STORIES LISTING PAGE
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-b border-slate-200/80 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Nikah Success
        </span>
        <span>Every story began with sincere intention and Allah’s Barakah.</span>
        <button 
          onClick={onGetStarted}
          className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
        >
          Begin Your Halal Story →
        </button>
      </aside>

      {/* 2. STICKY LUXURY HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Back & Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToLanding}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <button onClick={onBackToLanding} className="flex items-center gap-2.5 text-left cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-2xs border border-rose-200 flex items-center justify-center">
                <img src="/icon.svg" alt="Qurb Logo" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <span style={{ fontFamily: "'Raleway', sans-serif" }} className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Qurb
                </span>
                <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 ml-1.5 border border-rose-200">
                  Stories
                </span>
              </div>
            </button>
          </div>

          {/* Right Actions */}
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

      {/* 3. HERO SECTION */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-white via-[#FCFBF9] to-[#FAF9F6] border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>Honoring Pure Intentions &amp; Sunnah</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Halal Stories: <br />
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              Sincere Hearts, Blessed Unions.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real practicing Muslim couples who chose the path of Haya, guardian chaperoning, and intentional marriage upon the Quran and Sunnah.
          </p>

          {/* Key Impact Stats Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <div className="font-serif text-2xl font-bold text-slate-900">1,200+</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Halal Nikahs Completed</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <div className="font-serif text-2xl font-bold text-emerald-700">100%</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Wali-Chaperone Supported</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <div className="font-serif text-2xl font-bold text-amber-700">4.5 Mo</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Avg. Time to Nikah</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
              <div className="font-serif text-2xl font-bold text-rose-700">0%</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Casual Dating Tolerance</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STORIES BROWSER SECTION */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                setActiveStory(story);
                window.location.hash = `#stories/${story.slug}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={story.image}
                  alt={story.coupleNames}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-xs">
                  {story.category}
                </div>

                {/* Couple Names */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-lg font-bold drop-shadow-xs">{story.coupleNames}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/90 drop-shadow-xs mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-300" />
                    <span>{story.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{story.weddingDate}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{story.timeToNikah}</span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    "{story.quote}"
                  </p>
                </div>

                {/* Read Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStory(story);
                      window.location.hash = `#stories/${story.slug}`;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Full Halal Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Nikah
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. BOTTOM CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            Your Halal Love Story Begins with a Single Sincere Step
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Join brothers and sisters seeking marriage with Haya, family respect, and Allah’s blessings.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-7 py-3.5 rounded-full shadow-xl transition-all cursor-pointer text-sm"
            >
              Create Free Protected Profile
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="w-full bg-[#F5F4F0] border-t border-slate-200 py-8 text-slate-600 text-xs text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>&copy; {new Date().getFullYear()} Qurb Halal Matrimony. Honoring the Sacred Sunnah of Nikah.</p>
          <div className="flex items-center justify-center gap-4 text-slate-500">
            <button onClick={onBackToLanding} className="hover:text-rose-600 cursor-pointer">Landing Page</button>
            <span>•</span>
            <a href="/privacy-policy" className="hover:text-rose-600">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-rose-600">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
