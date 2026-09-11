import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HeartHandshake, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Quote, 
  ShieldCheck
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
  const [activeStory, setActiveStory] = useState<HalalStory | null>(() => {
    if (initialStoryId) {
      return halalStoriesData.find(s => s.id === initialStoryId || s.slug === initialStoryId) || null;
    }
    return null;
  });

  const categories = ['All', 'Wali Chaperoned', 'Voice Bio Match', 'Sunnah Aligned', 'Cross-Cultural', 'Revert Journey'];

  const filteredStories = selectedCategory === 'All'
    ? halalStoriesData
    : halalStoriesData.filter(s => s.category === selectedCategory);

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
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col group"
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
                    onClick={() => setActiveStory(story)}
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

      {/* 5. INTERACTIVE FULL STORY READER MODAL */}
      {activeStory && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveStory(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left my-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close Story"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {activeStory.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Sacred Nikah</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {activeStory.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <strong>{activeStory.coupleNames}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {activeStory.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {activeStory.weddingDate}
                </span>
              </div>

              {/* Story Photo */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
                <img
                  src={activeStory.image}
                  alt={activeStory.coupleNames}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Featured Quote Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <Quote className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-serif text-sm text-slate-800 italic leading-relaxed">
                  "{activeStory.quote}"
                </p>
              </div>

              {/* Section 1: The Match */}
              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>How They Connected</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeStory.theMatch}
                </p>
              </div>

              {/* Section 2: The Wali's Role */}
              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>The Wali’s Chaperoning &amp; Family Blessing</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeStory.waliRole}
                </p>
              </div>

              {/* Section 3: Journey Milestones */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>From Salam to Nikah: The Timeline</span>
                </h3>
                <div className="space-y-2">
                  {activeStory.timelineMilestones.map((m, idx) => (
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

              {/* Section 4: Advice for Singles */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Their Advice to Marriage Seekers</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{activeStory.adviceForSingles}"
                </p>
              </div>

              {/* Quranic Dua */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                <p 
                  className="text-base text-slate-900 font-serif leading-relaxed"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {activeStory.dua}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setActiveStory(null);
                    onGetStarted();
                  }}
                  className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-2xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Start Your Own Halal Story on Qurb</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Close Story
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM CTA */}
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

      {/* 7. FOOTER */}
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
