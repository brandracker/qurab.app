export interface BlogSection {
  heading?: string;
  body: string;
  quote?: string;
  citations?: string;
  keyPoints?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Nikah & Sunnah' | 'Wali & Family' | 'Modesty & Haya' | 'Mahr & Rights' | 'Courtship Etiquette';
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  featured: boolean;
  sections: BlogSection[];
  keyTakeaways: string[];
}

export const blogPostsData: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'etiquette-of-halal-courtship-haya-to-nikah',
    title: 'The Etiquette of Halal Courtship: Moving from Salam to Nikah with Haya',
    excerpt: 'Navigating modern communication while honoring timeless Sunnah boundaries. How to speak with purpose, guard your heart, and avoid aimless texting.',
    category: 'Courtship Etiquette',
    readTime: '6 min read',
    date: 'September 2, 2026',
    author: {
      name: 'Ustadh Luqman Tariq',
      role: 'Family Counselor & Islamic Educator',
      avatar: '/hero_joyful.jpg'
    },
    image: '/hero_matrimony.jpg',
    featured: true,
    sections: [
      {
        heading: '1. Sincerity of Intention (Niyyah)',
        body: 'In Islam, marriage is not merely a social contract—it is an act of worship that completes half of our deen. The first question a believer must ask before sending a Salam is: "Am I ready for the sacred responsibilities of Nikah?" When intentions are pure, Allah guides every step.',
        citations: 'Rasulullah ﷺ said: "Actions are judged by motives, and each person will have only what they intended." (Sahih Bukhari)'
      },
      {
        heading: '2. Purposeful Conversations vs. Idle Flirtation',
        body: 'A common pitfall in digital courtship is falling into endless casual chatter that simulates intimacy without legal commitment. Halal courtship is purposeful: it focuses on shared religious practice, character, family aspirations, financial readiness, and temperament.',
        keyPoints: [
          'Discuss essential values early (Salah habits, Quran routine, financial expectations).',
          'Keep conversations focused and respectful without crossing boundaries of modesty.',
          'Set a mutual timeline to involve families rather than lingering indefinitely.'
        ]
      },
      {
        heading: '3. The Blessing of Guarding One’s Gaze and Modesty',
        body: 'Modesty (Haya) is a branch of faith. Respecting personal boundaries and avoiding inappropriate photographic exchanges protects both parties from spiritual harm and emotional regret should the match not proceed.',
        quote: 'Haya does not bring anything except goodness. When a couple protects each other’s honor before marriage, Allah blesses their union after the contract.'
      }
    ],
    keyTakeaways: [
      'Enter courtship only when sincerely ready for marriage.',
      'Maintain purposeful, goal-oriented discussions.',
      'Involve guardians early to invite Barakah and transparency.'
    ]
  },
  {
    id: 'blog-2',
    slug: 'sacred-role-of-the-wali-guardian-blessing',
    title: 'The Sacred Role of the Wali: Why Guardian Blessing Unlocks Lifelong Barakah',
    excerpt: 'Why Islamic law champions the bride’s guardian—not as a barrier, but as an advocate, protector, and guarantor of dignity and peace.',
    category: 'Wali & Family',
    readTime: '7 min read',
    date: 'August 28, 2026',
    author: {
      name: 'Ustadha Maryam Siddiqui',
      role: 'Pre-Marital Counselor & Author',
      avatar: '/hero_couple_right.jpg'
    },
    image: '/halal_family.jpg',
    featured: true,
    sections: [
      {
        heading: '1. An Advocate, Not an Obstacle',
        body: 'The wisdom behind requiring a Wali in Islamic marriage is to ensure the sister is protected by someone whose primary interest is her lifelong safety, honor, and well-being. A loving father or guardian looks past charm to evaluate a suitor’s dependability, honesty, and readiness.',
        citations: 'The Prophet ﷺ stated: "There is no Nikah without a guardian." (Abu Dawud, Tirmidhi)'
      },
      {
        heading: '2. Chaperoned Communication in the Digital Age',
        body: 'Modern technology often isolates young people from their elders, leading to vulnerable situations. By integrating the Wali into digital introductions, the process remains transparent, preventing manipulation and ensuring that both families are united in goodwill from day one.'
      },
      {
        heading: '3. What Brothers Should Know When Approaching a Guardian',
        body: 'Approaching a Wali with respect, humility, and honest answers about one’s employment, living situation, and character demonstrates masculine maturity. Guardians appreciate candidates who respect their daughter’s dignity by approaching through the front door.',
        keyPoints: [
          'Be transparent about your timeline and circumstances.',
          'Treat the guardian with utmost adab and deference.',
          'Welcome their questions as a sign of love for their daughter.'
        ]
      }
    ],
    keyTakeaways: [
      'The Wali acts as a protective shield and advocate for the bride.',
      'Involving guardians early prevents heartbreak and misunderstandings.',
      'Families united in prayer and mutual respect create resilient marriages.'
    ]
  },
  {
    id: 'blog-3',
    slug: 'understanding-mahr-in-islam-rights-wisdom',
    title: 'Understanding Mahr in Islam: Rights, Wisdom, and Avoiding Extravagance',
    excerpt: 'Demystifying the bridal gift in Islamic jurisprudence. How to approach Mahr discussions with grace, realism, and adherence to the Sunnah.',
    category: 'Mahr & Rights',
    readTime: '5 min read',
    date: 'August 20, 2026',
    author: {
      name: 'Sheikh Dr. Bilal Al-Hussaini',
      role: 'Jurisprudence Researcher & Lecturer',
      avatar: '/hero_sunset.jpg'
    },
    image: '/halal_rings.jpg',
    featured: true,
    sections: [
      {
        heading: '1. The True Meaning of Mahr',
        body: 'The Mahr is a mandatory gift given by the groom to the bride upon marriage. It is her exclusive property, designed to honor her and signify the groom’s financial commitment and willingness to care for her.',
        citations: '"And give the women [upon marriage] their bridal gifts graciously." — Surah An-Nisa (4:4)'
      },
      {
        heading: '2. The Barakah of Simplicity',
        body: 'While Islam does not set an arbitrary maximum limit on Mahr, the Sunnah strongly encourages moderation and ease. When Mahr demands become exorbitant status symbols, marriage becomes unnecessarily difficult for righteous young Muslims.',
        quote: 'Rasulullah ﷺ said: "The best of marriages is that which is easiest." (Sahih Ibn Hibban)'
      },
      {
        heading: '3. Practical Tips for Open Mahr Discussions',
        body: 'Couples should discuss Mahr openly and without embarrassment. Consider the groom’s real financial reality, avoid comparison with social media trends, and remember that real wealth lies in mutual contentment and mercy.',
        keyPoints: [
          'Distinguish between prompt Mahr (Mu’ajjal) and deferred Mahr (Mu’ajjal).',
          'Ensure the gift is meaningful and within the husband’s honorable capacity.',
          'Focus on long-term household stability rather than lavish demands.'
        ]
      }
    ],
    keyTakeaways: [
      'Mahr is an exclusive divine right and gift for the wife.',
      'Modesty and moderation in Mahr invite abundant divine blessings.',
      'Clear, honest discussions prevent financial resentment.'
    ]
  },
  {
    id: 'blog-4',
    slug: 'beyond-appearance-voice-bios-and-values',
    title: 'Beyond Appearance: Why Voice Bios & Shared Values Matter Most in Marriage',
    excerpt: 'Why swiping on photos leads to burnout, and how hearing a person’s spoken voice and evaluating deen unlocks authentic compatibility.',
    category: 'Nikah & Sunnah',
    readTime: '5 min read',
    date: 'August 14, 2026',
    author: {
      name: 'Dr. Fatima Karim, PhD',
      role: 'Behavioral Psychologist & Family Counselor',
      avatar: '/hero_joyful.jpg'
    },
    image: '/hero_ambient_bg.jpg',
    featured: false,
    sections: [
      {
        heading: '1. The Superficiality Trap of Photo-First Apps',
        body: 'Mainstream dating culture reduces complex human souls to two-second visual judgments. This fosters consumerist mindsets, anxiety, and constant grass-is-greener syndrome that directly contradicts Islamic values of taqwa and inner beauty.'
      },
      {
        heading: '2. The Power of Spoken Voice in Assessing Adab',
        body: 'A person’s voice carries warmth, humility, articulation, and emotional maturity. Listening to a candidate speak about their life vision and faith reveals genuine character traits that static images can never convey.'
      }
    ],
    keyTakeaways: [
      'Physical attraction is important, but shared Islamic values sustain marriage.',
      'Audio bios offer authentic insight into emotional maturity.',
      'Modesty shields protect against superficial judgment.'
    ]
  },
  {
    id: 'blog-5',
    slug: '10-essential-questions-before-nikah',
    title: '10 Essential Questions Every Muslim Couple Must Ask Before Nikah',
    excerpt: 'A comprehensive checklist of crucial pre-marital questions covering financial management, prayer habits, family boundaries, and conflict resolution.',
    category: 'Nikah & Sunnah',
    readTime: '8 min read',
    date: 'August 05, 2026',
    author: {
      name: 'Imam Zaid Shakir',
      role: 'Community Chaplain & Nikah Registrar',
      avatar: '/hero_couple_right.jpg'
    },
    image: '/hero_joyful.jpg',
    featured: false,
    sections: [
      {
        heading: 'The Crucial Pillars of Pre-Marital Alignment',
        body: 'Too many couples leave vital questions until after the wedding day. Discussing these 10 areas with honesty and adab ensures you enter the sacred covenant with eyes wide open and hearts united.'
      },
      {
        heading: 'The 10 Topics You Must Cover',
        body: 'Take time across multiple chaperoned meetings to delve into these fundamental aspects of life together:',
        keyPoints: [
          '1. Daily Prayer Routine & Spiritual Aspirations.',
          '2. Financial Roles, Debt Transparency & Budgeting Habits.',
          '3. Relationship with In-Laws & Living Accommodations.',
          '4. Career Ambitions and Work-Life Balance.',
          '5. Children, Parenting Philosophies & Islamic Education.',
          '6. Anger Management and Dispute Resolution Methods.',
          '7. Social Life, Friendships & Gender Interactions.',
          '8. Health History, Dietary Habits & Halal Standards.',
          '9. Expectations of Spousal Rights and Emotional Support.',
          '10. Willingness to Seek Mediation/Counseling in Difficulty.'
        ]
      }
    ],
    keyTakeaways: [
      'Pre-marital transparency prevents post-marital disillusionment.',
      'Address financial and living arrangements explicitly.',
      'Evaluate how potential partners handle frustration and disagreement.'
    ]
  },
  {
    id: 'blog-6',
    slug: 'istikhara-for-marriage-seeking-allahs-guidance',
    title: 'Istikhara for Marriage: How to Seek Allah’s Guidance with Clarity & Sincerity',
    excerpt: 'Clearing widespread misconceptions about dreams and signs. How to properly pray Salat al-Istikhara and recognize divine guidance when choosing a spouse.',
    category: 'Modesty & Haya',
    readTime: '6 min read',
    date: 'July 28, 2026',
    author: {
      name: 'Ustadh Luqman Tariq',
      role: 'Family Counselor & Islamic Educator',
      avatar: '/hero_matrimony.jpg'
    },
    image: '/halal_couple_bg.jpg',
    featured: false,
    sections: [
      {
        heading: '1. What Istikhara Is—and What It Is Not',
        body: 'Many believe Istikhara requires seeing a vivid dream or color code. In reality, Istikhara is a profound prayer asking Allah to facilitate the decision if it brings goodness to your deen, livelihood, and afterlife—or to divert it if it brings harm.',
        citations: 'The Prophet ﷺ taught Istikhara for all matters just as he taught a Surah of the Quran. (Sahih Bukhari)'
      },
      {
        heading: '2. Doing Your Due Diligence (Istishara First)',
        body: 'Before making Istikhara, a believer must do their due diligence: consult trusted mentors, ask about the candidate’s reputation, and evaluate basic compatibility. Istikhara is performed to surrender the outcome to Allah, not to replace thoughtful reflection.'
      }
    ],
    keyTakeaways: [
      'Istikhara does not require dreams; it manifests in ease or natural obstacles.',
      'Combine sincere consultation (Istishara) with prayer (Istikhara).',
      'Trust that whatever Allah decrees contains ultimate wisdom for your soul.'
    ]
  }
];
