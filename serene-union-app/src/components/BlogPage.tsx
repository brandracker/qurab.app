import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  Share2, 
  Check
} from 'lucide-react';
import { blogPostsData, type BlogPost } from '../data/blogData';

interface Props {
  onBackToLanding: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
  initialArticleId?: string | null;
}

export const BlogPage: React.FC<Props> = ({
  onBackToLanding,
  onGetStarted,
  onLogin,
  initialArticleId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(() => {
    if (initialArticleId) {
      return blogPostsData.find(b => b.id === initialArticleId || b.slug === initialArticleId) || null;
    }
    return null;
  });

  // Sync when initialArticleId prop updates
  useEffect(() => {
    if (initialArticleId) {
      const found = blogPostsData.find(b => b.id === initialArticleId || b.slug === initialArticleId);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [initialArticleId]);

  // Sync on direct hash changes (e.g. forward/back buttons or manual link navigation)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const parts = hash.split('/');
      const slug = parts.length > 1 ? parts[1] : null;
      if (slug) {
        const found = blogPostsData.find(b => b.id === slug || b.slug === slug);
        if (found) {
          setActiveArticle(found);
        }
      } else if (hash === '#blog' || hash === '#blogs' || hash === '#journal') {
        setActiveArticle(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const categories = [
    'All',
    'Courtship Etiquette',
    'Wali & Family',
    'Mahr & Rights',
    'Nikah & Sunnah',
    'Modesty & Haya'
  ];

  const filteredPosts = blogPostsData.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPostsData.find(p => p.featured) || blogPostsData[0];

  const handleShareArticle = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2500);
    }
  };

  // =========================================================================
  // DEDICATED FULL-PAGE ARTICLE READER (No Modals, Distraction-Free Reading)
  // =========================================================================
  if (activeArticle) {
    const relatedPosts = blogPostsData
      .filter(p => p.id !== activeArticle.id)
      .slice(0, 3);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://qurb.app/#blog/${activeArticle.slug}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeArticle.title} - Read more on Qurb: ${shareUrl}`)}`;

    return (
      <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600">
        
        {/* 1. Top Announcement Bar */}
        <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-b border-slate-200/80 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Sunnah Wisdom
          </span>
          <span>Guided by Islamic scholars and pre-marital counselors.</span>
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
                  setActiveArticle(null);
                  window.location.hash = '#blog';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Close Article"
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>All Articles</span>
              </button>

              <button 
                onClick={() => {
                  setActiveArticle(null);
                  window.location.hash = '#blog';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white p-1.5 shadow-2xs border border-rose-200 flex items-center justify-center">
                  <img src="/icon.svg" alt="Qurb Logo" className="w-6 h-6 object-contain" />
                </div>
                <span style={{ fontFamily: "'Raleway', sans-serif" }} className="text-xl font-extrabold tracking-tight text-slate-900 hidden sm:inline">
                  Qurb Journal
                </span>
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

        {/* 3. Full Article Body */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button 
              onClick={() => {
                setActiveArticle(null);
                window.location.hash = '#blog';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-rose-600 cursor-pointer"
            >
              Journal
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{activeArticle.category}</span>
          </nav>

          {/* Meta Pill Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs uppercase tracking-wider">
              {activeArticle.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-rose-600" />
              {activeArticle.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              {activeArticle.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-6">
            {activeArticle.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-base sm:text-xl text-slate-600 font-light leading-relaxed mb-8 border-l-4 border-rose-400 pl-4 bg-rose-50/30 py-2.5 rounded-r-xl">
            {activeArticle.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-slate-900">{activeArticle.author.name}</div>
                <div className="text-xs text-slate-500">{activeArticle.author.role}</div>
              </div>
            </div>

            <button
              onClick={() => handleShareArticle(activeArticle)}
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
          <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-slate-200/90 mb-12 bg-slate-100">
            <img 
              src={activeArticle.image} 
              alt={activeArticle.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Sections */}
          <article className="max-w-3xl mx-auto space-y-10">
            {activeArticle.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                {section.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-rose-500 pl-4 py-1 leading-snug">
                    {section.heading}
                  </h2>
                )}

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {section.body}
                </p>

                {/* Hadith / Quran Citation Box */}
                {section.citations && (
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-800 space-y-1 my-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Authentic Islamic Reference</span>
                    </div>
                    <blockquote className="font-serif italic text-sm sm:text-base text-emerald-950 pl-6 border-l-2 border-emerald-400 mt-2">
                      {section.citations}
                    </blockquote>
                  </div>
                )}

                {/* Quote Callout */}
                {section.quote && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-slate-800 space-y-1 my-4 flex items-start gap-3">
                    <Quote className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-relaxed">
                      "{section.quote}"
                    </p>
                  </div>
                )}

                {/* Key Points Checklist */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div className="space-y-2.5 my-4">
                    {section.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Summary Takeaways Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-emerald-50/60 border border-rose-200/80 shadow-xs">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-rose-600" />
                <span>Summary Takeaways</span>
              </h3>
              <div className="space-y-3">
                {activeArticle.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Share Strip */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="font-bold text-sm text-slate-900">Benefited from this article?</div>
                <div className="text-xs text-slate-500">Share with family, friends, or someone seeking Nikah.</div>
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
                  onClick={() => handleShareArticle(activeArticle)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* High-Converting App CTA Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white space-y-4 text-center shadow-xl">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Halal Courtship &amp; Nikah
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                Where Halal Love Begins with Barakah
              </h3>
              <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Experience 1-to-1 Modesty Photo Shields, direct Wali chaperone involvement, and purposeful conversations with zero superficial swiping.
              </p>
              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="bg-white text-rose-700 font-extrabold px-8 py-3.5 rounded-full text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Find Your Righteous Spouse Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setActiveArticle(null);
                  window.location.hash = '#blog';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Close Article"
                className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Articles</span>
              </button>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="pt-12 border-t border-slate-200/80 space-y-6">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  More From the Matrimony Journal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setActiveArticle(post);
                        window.location.hash = `#blog/${post.slug}`;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            {post.category}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                      <div className="p-4 pt-0 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <span>Read Article</span>
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
            <p>&copy; {new Date().getFullYear()} Qurb Matrimony Journal. Written upon the Quran and Sunnah.</p>
            <div className="flex items-center justify-center gap-4 text-slate-500">
              <button 
                onClick={() => {
                  setActiveArticle(null);
                  window.location.hash = '#blog';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-rose-600 cursor-pointer"
              >
                All Articles
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

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-b border-slate-200/80 px-4 py-2 text-center text-xs font-medium text-slate-700 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Sunnah Wisdom
        </span>
        <span>Guided by Islamic scholars and pre-marital counselors.</span>
        <button 
          onClick={onGetStarted}
          className="underline font-bold text-rose-700 hover:text-rose-800 ml-1 cursor-pointer transition-colors"
        >
          Find Your Spouse on Qurb →
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
                <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 ml-1.5 border border-amber-200">
                  Journal
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

      {/* 3. HERO & SEARCH SECTION */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-white via-[#FCFBF9] to-[#FAF9F6] border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Islamic Matrimony Journal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Knowledge &amp; Sunnah Wisdom for <br />
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              a Blessed Marriage.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Essential guides, jurisprudential insights, and pre-marital advice crafted for practicing Muslims seeking lawful Nikah upon the Sunnah.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles on Mahr, Wali, courtship, Istikhara..."
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 shadow-2xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED POST SPOTLIGHT (when no active search) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
          <div 
            onClick={() => {
              setActiveArticle(featuredPost);
              window.location.hash = `#blog/${featuredPost.slug}`;
            }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Featured Guide
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                    <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">{featuredPost.author.name}</div>
                    <div className="text-[10px] text-slate-500">{featuredPost.date}</div>
                  </div>
                </div>

                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 5. ARTICLES GRID & CATEGORIES */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Category Pills */}
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

        {/* Article Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-sm">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setActiveArticle(post);
                  window.location.hash = `#blog/${post.slug}`;
                }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-xs">
                      {post.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">{post.author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 6. BOTTOM FOOTER */}
      <footer className="w-full bg-[#F5F4F0] border-t border-slate-200 py-8 text-slate-600 text-xs text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>&copy; {new Date().getFullYear()} Qurb Matrimony Journal. Written upon the Quran and Sunnah.</p>
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
