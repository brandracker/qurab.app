import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  X, 
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
            onClick={() => setActiveArticle(featuredPost)}
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
                onClick={() => setActiveArticle(post)}
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

      {/* 6. INTERACTIVE FULL ARTICLE READER MODAL */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-9 shadow-2xl relative text-left my-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close Article"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    {activeArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {activeArticle.readTime}
                  </span>
                </div>

                <button
                  onClick={() => handleShareArticle(activeArticle)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  {copiedSlug ? (
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

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {activeArticle.title}
              </h1>

              {/* Author Bar */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{activeArticle.author.name}</div>
                  <div className="text-[11px] text-slate-500">{activeArticle.author.role} • {activeArticle.date}</div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              {/* Article Content Sections */}
              <div className="space-y-6 pt-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                {activeArticle.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    {sec.heading && (
                      <h2 className="font-serif text-lg font-bold text-slate-900">
                        {sec.heading}
                      </h2>
                    )}
                    <p className="leading-relaxed">{sec.body}</p>

                    {/* Citations Quote Box */}
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
                          {sec.keyPoints.map((point, pIdx) => (
                            <li key={pIdx} className="leading-relaxed">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Summary Takeaways</span>
                </div>
                <div className="space-y-1.5">
                  {activeArticle.keyTakeaways.map((takeaway, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white space-y-3 text-center">
                <h3 className="font-serif text-lg font-bold">Apply These Principles on Qurb</h3>
                <p className="text-white/90 text-xs max-w-md mx-auto">
                  Find a spouse who shares your religious dedication, values family adab, and seeks a blessed marriage.
                </p>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onGetStarted();
                  }}
                  className="bg-white text-rose-700 font-bold px-6 py-2.5 rounded-full text-xs shadow-md hover:bg-slate-50 cursor-pointer"
                >
                  Join Qurb Free
                </button>
              </div>

              {/* Close Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Close Article
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM FOOTER */}
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
