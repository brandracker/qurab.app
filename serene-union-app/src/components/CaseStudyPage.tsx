import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Server,
  Smartphone,
  Shield,
  Users,
  Database,
  Globe,
  Zap,
  Layers,
  HeartHandshake,
  BarChart3,
  Clock,
  Code2,
  Palette,
  Cloud,
  Lock,
  Mic,
  Star,
  Quote,
  Rocket
} from 'lucide-react';

interface Props {
  onBackToLanding: () => void;
  onGetStarted: () => void;
}

export const CaseStudyPage: React.FC<Props> = ({ onBackToLanding, onGetStarted }) => {

  const techStack = [
    { icon: Cloud, label: 'Cloudflare Workers', desc: 'Edge-first serverless API', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { icon: Database, label: 'Cloudflare D1', desc: 'Distributed SQLite database', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: Server, label: 'Hono Framework', desc: 'Ultra-fast TypeScript router', color: 'bg-violet-50 text-violet-600 border-violet-200' },
    { icon: Layers, label: 'React + Vite', desc: 'Lightning-fast SPA frontend', color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
    { icon: Smartphone, label: 'Capacitor (Android)', desc: 'Native Android app wrapper', color: 'bg-green-50 text-green-600 border-green-200' },
    { icon: Globe, label: 'Cloudflare Pages', desc: 'Global CDN deployment', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { icon: Cloud, label: 'Cloudflare R2', desc: 'Object storage for media', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { icon: Lock, label: 'TLS + Amanah Security', desc: 'End-to-end encryption', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  const deliverables = [
    {
      phase: 'Phase 1',
      title: 'Discovery & Brand Strategy',
      duration: '2 Weeks',
      items: [
        'Deep-dive workshops to define Qurb\u2019s Islamic matrimony value proposition',
        'Competitor analysis: Muzz, Salams, MuzMatch — identifying gaps in modesty-first matchmaking',
        'Full brand architecture: logo, identity system, color palette, and typography guide',
        'UX user-journey mapping: Nikah-intent registration to Wali-chaperoned conversations',
      ],
      color: 'border-rose-300 bg-gradient-to-br from-rose-50/80 to-white',
      dotColor: 'bg-rose-500',
    },
    {
      phase: 'Phase 2',
      title: 'System Architecture & Backend',
      duration: '4 Weeks',
      items: [
        'Designed serverless-first architecture on Cloudflare Workers + D1 for zero cold starts',
        'Built modular Hono API with 40+ endpoints: auth, profiles, matching, chat, admin, subscriptions',
        'Cloudflare R2 integration for secure photo/media storage with signed URLs',
        'Real-time heartbeat & presence system for live online member tracking',
        'Google Play Billing 8.0 integration for Qurb Barakah VIP subscriptions',
      ],
      color: 'border-blue-300 bg-gradient-to-br from-blue-50/80 to-white',
      dotColor: 'bg-blue-500',
    },
    {
      phase: 'Phase 3',
      title: 'Frontend App & Mobile Native',
      duration: '4 Weeks',
      items: [
        'Premium React SPA with 30+ screens: onboarding, discovery feed, profile biodata, chat, settings',
        'Modesty Photo Shield: blurred photos by default, mutual 1-to-1 reveal consent system',
        'Voice Bio recording & playback for character-first matching',
        'Wali Chaperone invitation system with guardian visibility into conversations',
        'Capacitor wrapping for Google Play Store native Android release',
        'PWA (Progressive Web App) for iOS Safari with Add-to-Home-Screen flow',
      ],
      color: 'border-emerald-300 bg-gradient-to-br from-emerald-50/80 to-white',
      dotColor: 'bg-emerald-500',
    },
    {
      phase: 'Phase 4',
      title: 'Admin Portal & Launch Operations',
      duration: '2 Weeks',
      items: [
        'Full-featured Admin Portal with real-time Live Monitor dashboard',
        'Seed profile generation system with AI-powered authentic portraits',
        'Content moderation, user management, and analytics dashboards',
        'Google Play Store listing, ASO optimization, and launch readiness',
        'Cloudflare Pages global deployment with custom domain (qurb.app)',
      ],
      color: 'border-amber-300 bg-gradient-to-br from-amber-50/80 to-white',
      dotColor: 'bg-amber-500',
    },
  ];

  const results = [
    { metric: '12 Weeks', label: 'Concept to Live Launch', icon: Clock },
    { metric: '40+', label: 'API Endpoints Delivered', icon: Code2 },
    { metric: '30+', label: 'Premium UI Screens', icon: Palette },
    { metric: '99.9%', label: 'Uptime on Cloudflare Edge', icon: Zap },
    { metric: '< 50ms', label: 'Global API Response Time', icon: Rocket },
    { metric: '55+', label: 'Seed Profiles Generated', icon: Users },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-rose-500/20 selection:text-rose-600 overflow-x-hidden">

      {/* TOP ANNOUNCEMENT BANNER */}
      <aside className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2.5 text-center text-xs font-medium text-slate-300 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Case Study
        </span>
        <span>Qurb × MoveMax Solutions — Full-Stack Islamic Matrimony Platform</span>
      </aside>

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Qurb</span>
          </button>
          <div className="flex items-center gap-3">
            <a
              href="https://movemaxsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <span>movemaxsolutions.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onGetStarted}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
            >
              <span>Try Qurb</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 sm:py-28 border-b border-slate-200/80">
        {/* Ambient background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-rose-200/25 via-amber-100/20 to-blue-100/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-emerald-100/20 via-cyan-50/15 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Partner Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-rose-200 shadow-md p-2.5 flex items-center justify-center">
              <img src="/icon.svg" alt="Qurb Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-300">×</div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-700 shadow-md p-2.5 flex items-center justify-center">
              <span className="text-white font-black text-lg sm:text-xl tracking-tight">M<span className="text-rose-500">X</span></span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-rose-600" />
            <span>Client Success Story • Full Project Delivery</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            How MoveMax Solutions Built{' '}
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              Qurb from Scratch
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From a concept on paper to a production-grade Islamic matrimony platform with 40+ API endpoints, 
            30+ premium screens, native Android app, and global Cloudflare edge deployment — delivered in just 12 weeks.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">12</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Weeks</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-rose-600">Full Stack</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">End-to-End</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">Production</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Live & Deployed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT BRIEF SECTION */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* The Challenge */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>The Challenge</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Build a Modesty-First Matrimony Platform That Honors Islamic Values
              </h2>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Qurb</strong> approached <strong>MoveMax Solutions</strong> with a clear vision: create the world's most 
                  respectful Islamic matrimony platform — one that puts modesty (Haya), family involvement, and genuine Nikah intent 
                  at the core of every feature.
                </p>
                <p>
                  Existing Muslim matchmaking apps were replicating secular swipe culture. Qurb needed a 
                  technology partner who could architect and deliver a complete production system from database schema 
                  to Google Play Store submission — with zero compromise on Islamic principles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Key Requirements</h4>
                <ul className="space-y-2">
                  {[
                    'Modesty Photo Shield with mutual 1-to-1 reveal consent',
                    'Wali (guardian) chaperone system for sister\u2019s conversations',
                    'Voice bio recordings for character-first matching',
                    'Real-time presence tracking and live online indicators',
                    'Google Play Billing integration for premium subscriptions',
                    'Admin portal with live analytics and moderation tools',
                    'Global edge deployment with < 100ms response times',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Solution */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Rocket className="w-3.5 h-3.5" />
                <span>The Solution</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                End-to-End Engineering, Design & Launch by MoveMax Solutions
              </h2>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>MoveMax Solutions</strong> assembled a dedicated cross-functional team spanning brand strategy, 
                  UI/UX design, backend architecture, frontend development, mobile engineering, DevOps, and launch operations.
                </p>
                <p>
                  The team adopted a serverless-first architecture on <strong>Cloudflare's edge network</strong>, ensuring 
                  global ultra-low latency and zero cold-start performance. Every API endpoint, every screen, every database 
                  migration, and every deployment pipeline was designed, built, and shipped by MoveMax.
                </p>
              </div>

              {/* Client Quote */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-amber-50/40 to-white border border-rose-200 relative">
                <Quote className="w-7 h-7 text-rose-300/60 mb-2" />
                <p className="font-serif italic text-sm text-slate-800 leading-relaxed">
                  "MoveMax Solutions didn't just build our app — they understood the sacred responsibility of Islamic matrimony 
                  and engineered every pixel to honor Haya, Adab, and the Sunnah. From concept to Google Play in 12 weeks. 
                  Truly exceptional."
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">Q</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Qurb Founding Team</div>
                    <div className="text-[11px] text-slate-500">qurb.app</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK SECTION */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>Technology Stack</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Built on World-Class Infrastructure
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              MoveMax Solutions selected a modern, serverless-first stack optimized for global scale, 
              security, and developer velocity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.label}
                  className={`p-4 sm:p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all space-y-2.5 ${tech.color.split(' ')[2] ? `border-${tech.color.split(' ')[2].replace('border-', '')}` : 'border-slate-200'}`}
                  style={{ borderColor: undefined }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tech.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tech.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{tech.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECT TIMELINE / DELIVERABLES */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Project Timeline</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              4-Phase Delivery Roadmap
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              MoveMax Solutions executed a structured 4-phase delivery from initial discovery through to 
              production launch in exactly 12 weeks.
            </p>
          </div>

          <div className="space-y-5">
            {deliverables.map((phase) => (
              <div
                key={phase.phase}
                className={`p-5 sm:p-7 rounded-2xl border-2 ${phase.color} relative overflow-hidden`}
              >
                {/* Phase indicator dot */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${phase.dotColor} rounded-r-full`} />
                
                <div className="flex items-start gap-4 sm:gap-6 ml-3">
                  <div className="shrink-0 space-y-1 text-center min-w-[65px]">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900">{phase.phase}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{phase.duration}</div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES BUILT */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Key Features Engineered</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Every Feature, Thoughtfully Engineered
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Modesty Photo Shield', desc: 'Photos blurred by default on the public feed. Unblurred only through mutual 1-to-1 consent — never casual browsing.', color: 'text-emerald-600 bg-emerald-50' },
              { icon: Users, title: 'Wali Chaperone System', desc: 'Sisters can invite their father or guardian to oversee conversations, maintaining Islamic Adab from the very first message.', color: 'text-amber-600 bg-amber-50' },
              { icon: Mic, title: 'Voice Bio Greetings', desc: 'Spoken audio introductions let members evaluate tone, maturity, and sincerity before seeing photos — character first.', color: 'text-rose-600 bg-rose-50' },
              { icon: Zap, title: 'Real-Time Presence', desc: 'Live heartbeat system tracks active members with second-level precision. "Online Now" badges show genuine availability.', color: 'text-blue-600 bg-blue-50' },
              { icon: BarChart3, title: 'Admin Live Monitor', desc: 'Executive dashboard with interactive stat cards, real-time user radar, message streams, and content moderation tools.', color: 'text-violet-600 bg-violet-50' },
              { icon: Star, title: 'AI Seed Profiles', desc: '55+ authentic, AI-generated seed profiles with culturally accurate portraits to ensure a vibrant platform from day one.', color: 'text-cyan-600 bg-cyan-50' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{feature.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESULTS & METRICS */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
              <Rocket className="w-3.5 h-3.5 text-rose-400" />
              <span>Results & Impact</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Delivered at Scale, On Time
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              MoveMax Solutions delivered every milestone on schedule with production-grade quality across every layer.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
            {results.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.label}
                  className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all text-center space-y-2"
                >
                  <Icon className="w-5 h-5 text-rose-400 mx-auto" />
                  <div className="text-xl sm:text-2xl font-black text-white">{r.metric}</div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{r.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT MOVEMAX SOLUTIONS */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gradient-to-bl from-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-white font-black text-lg tracking-tight">M<span className="text-rose-500">X</span></span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">MoveMax Solutions</h3>
                  <p className="text-xs text-slate-400">Digital Branding & Full-Stack Technology Agency</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">MoveMax Solutions</strong> is a premium digital agency specializing in 
                startup brand architecture, high-speed web & mobile development, 3D packaging design, and autonomous AI integration. 
                They serve funded startups, eCommerce brands, and SaaS companies with end-to-end engineering and creative services.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Brand Identity', icon: Palette },
                  { label: 'Web & Mobile Dev', icon: Code2 },
                  { label: '3D Packaging', icon: Layers },
                  { label: 'AI Integration', icon: Zap },
                ].map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <div key={svc.label} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-300">{svc.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://movemaxsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
                >
                  <span>Visit movemaxsolutions.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="mailto:hello@movemaxsolutions.com"
                  className="px-4 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Contact for Your Project
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Ready to Start Your Journey on Qurb?
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Join thousands of practicing Muslims seeking lawful Islamic marriage with modesty, dignity, and Barakah.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToLanding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-200 text-slate-700 hover:bg-white text-sm font-semibold cursor-pointer transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Qurb. All rights reserved.</span>
            <span>•</span>
            <span>Engineered by <a href="https://movemaxsolutions.com" target="_blank" rel="noopener noreferrer" className="text-rose-600 font-semibold hover:underline">MoveMax Solutions</a></span>
          </div>
          <div className="text-slate-400">
            Case Study • Full-Stack Islamic Matrimony Platform
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudyPage;
