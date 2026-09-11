export interface HalalStory {
  id: string;
  slug: string;
  coupleNames: string;
  title: string;
  tagline: string;
  category: 'Wali Chaperoned' | 'Voice Bio Match' | 'Cross-Cultural' | 'Revert Journey' | 'Sunnah Aligned';
  image: string;
  weddingDate: string;
  location: string;
  timeToNikah: string;
  featured: boolean;
  quote: string;
  theMatch: string;
  waliRole: string;
  timelineMilestones: { time: string; event: string }[];
  adviceForSingles: string;
  dua: string;
}

export const halalStoriesData: HalalStory[] = [
  {
    id: 'story-1',
    slug: 'zaid-and-ayesha-wali-guided-nikah',
    coupleNames: 'Zaid & Ayesha',
    title: 'Dignity First: How Ayesha’s Father Chaperoned Their Path to a Blessed Nikah',
    tagline: 'When mutual respect and family involvement replace modern dating games, Nikah happens with Barakah.',
    category: 'Wali Chaperoned',
    image: '/stories/story_zaid_ayesha.jpg',
    weddingDate: 'Shawwal 1447 / April 2026',
    location: 'London, United Kingdom',
    timeToNikah: '4 Months from Salam to Nikah',
    featured: true,
    quote: 'My father was initially skeptical of apps, but when he saw that he was included in the chat from the very first message, his heart was completely at ease.',
    theMatch: 'Ayesha was seeking someone who took his five daily prayers seriously and honored family traditions. Zaid, an educator in London, was looking for a practicing sister with a passion for community work. Neither wanted endless texting or superficial swiping. Zaid sent a respectful Direct Salam referencing Ayesha’s bio answers regarding charitable goals.',
    waliRole: 'Ayesha’s father, Uncle Farooq, was linked as her chaperone. When Zaid requested a family video call after two weeks of chaperoned conversation, Uncle Farooq hosted the meeting. Both families found instant warmth, adab, and mutual understanding.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Zaid sent a Direct Salam on Qurb with respectful matrimonial intentions.' },
      { time: 'Week 2', event: 'Ayesha and her Wali reviewed Zaid’s biodata; mutual photo reveal was granted.' },
      { time: 'Week 4', event: 'First chaperoned family video call between both sets of parents.' },
      { time: 'Month 2', event: 'Formal in-person family dinner in London; Mahr agreed upon easily.' },
      { time: 'Month 4', event: 'Blessed Nikah solemnized at Regent’s Park Mosque.' }
    ],
    adviceForSingles: 'Do not fear involving your parents or Wali early. When your intention is pure and aligned with the Sunnah, Allah puts ease into matters that people usually make difficult.',
    dua: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا — "Our Lord! Grant unto us in our spouses and offspring the coolness of our eyes."'
  },
  {
    id: 'story-2',
    slug: 'tariq-and-fatima-spoken-voice-match',
    coupleNames: 'Tariq & Dr. Fatima',
    title: 'A Connection of Character: When Tariq Heard Fatima’s Spoken Voice Greeting',
    tagline: 'Hearing vocal inflection, humility, and sincerity brought a connection that text could never convey.',
    category: 'Voice Bio Match',
    image: '/stories/story_tariq_fatima.jpg',
    weddingDate: 'Dhul Hijjah 1447 / June 2026',
    location: 'Dallas, Texas, USA',
    timeToNikah: '5 Months from Salam to Nikah',
    featured: true,
    quote: 'Her 60-second voice intro was about balancing late hospital shifts with Quran revision. The composure and tranquility in her voice told me everything about her character.',
    theMatch: 'Tariq, a software architect in Austin, and Fatima, a pediatric resident in Dallas, both had demanding schedules. Fatima’s profile photos were modestly blurred. What caught Tariq’s attention was Fatima’s Spoken Voice Bio. Fatima listened to Tariq’s audio greeting where he described his family values and love for community service.',
    waliRole: 'Fatima’s older brother served as her Wali and point of contact. Tariq initiated contact with her brother early, respecting the sacred boundaries of Islamic courtship.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Tariq listened to Fatima’s audio greeting and sent a thoughtful voice reply.' },
      { time: 'Week 3', event: 'Mutual photo reveal agreed upon after in-depth discussion of religious values.' },
      { time: 'Month 2', event: 'Families met in Dallas for an official tea and conversation.' },
      { time: 'Month 3', event: 'Istikhara prayed by both; hearts settled with immense peace.' },
      { time: 'Month 5', event: 'Nikah held surrounded by close family and friends.' }
    ],
    adviceForSingles: 'Focus on character, adab, and how someone speaks about their faith and parents. Looks fade, but upright character builds a home of peace.',
    dua: 'اللَّهُمَّ بَارِكْ لَهُمَا وَبَارِكْ عَلَيْهِمَا وَاجْمَعْ بَيْنَهُمَا فِي خَيْرٍ — "O Allah, bless them, shower blessings upon them, and unite them in goodness."'
  },
  {
    id: 'story-3',
    slug: 'hamza-and-maryam-modesty-shield',
    coupleNames: 'Hamza & Maryam',
    title: 'Modesty First: Finding Sacred Love Through Haya and Shared Islamic Goals',
    tagline: 'Keeping photos protected until serious mutual alignment created an environment free of superficial judgment.',
    category: 'Sunnah Aligned',
    image: '/stories/story_hamza_maryam.jpg',
    weddingDate: 'Muharram 1448 / July 2026',
    location: 'Toronto, Canada',
    timeToNikah: '3 Months from Salam to Nikah',
    featured: true,
    quote: 'Qurb was the only platform where I did not feel like a catalog item. My modesty was respected, and Hamza appreciated that deeply.',
    theMatch: 'Maryam is an Islamic school educator, and Hamza is an environmental engineer. Both had experienced frustration on mainstream apps where casual conversations led nowhere. Qurb’s commitment to Nikah-only intentions and Modesty Photo Shield created an instant filter for sincerity.',
    waliRole: 'Maryam’s father accompanied every stage of communication, providing fatherly wisdom and ensuring that conversations stayed focused on life goals and marital compatibility.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Matched based on shared religious practice and lifestyle preferences.' },
      { time: 'Week 2', event: 'Discussed Mahr, career plans, and living arrangements with clarity.' },
      { time: 'Month 1', event: 'In-person meeting at Maryam’s family residence in Mississauga.' },
      { time: 'Month 3', event: 'Simple Sunnah Nikah followed by community Walima.' }
    ],
    adviceForSingles: 'Keep your standards high for piety and good manners, but keep worldly demands simple. Barakah enters when you follow the guidance of Rasulullah ﷺ.',
    dua: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ — "My Lord, indeed I am, for whatever good You would send down to me, in need."'
  },
  {
    id: 'story-4',
    slug: 'zainab-and-omar-cross-cultural-barakah',
    coupleNames: 'Zainab & Omar',
    title: 'One Ummah: A Cross-Cultural Nikah Blessed by Faith and Shared Principles',
    tagline: 'Bridging cultural backgrounds through the universal beauty of Islamic character and family openness.',
    category: 'Cross-Cultural',
    image: '/stories/story_zainab_omar.jpg',
    weddingDate: 'Rabi al-Awwal 1448 / September 2026',
    location: 'Chicago, Illinois, USA',
    timeToNikah: '6 Months from Salam to Nikah',
    featured: false,
    quote: 'Our backgrounds were different—Zainab is Moroccan-American and I am Pakistani-American—but our understanding of Islam and family was completely identical.',
    theMatch: 'They connected over their mutual dedication to daily Quran study and mutual desire to build a peaceful, faith-centered household. Qurb’s transparent deen filters made cultural differences a source of beauty rather than confusion.',
    waliRole: 'Both families connected early and bonded over their shared love for the Sunnah. The fathers became close friends before the wedding day.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Connected via Qurb’s global halal discovery feed.' },
      { time: 'Month 1', event: 'Families met virtually to introduce traditions and discuss logistics.' },
      { time: 'Month 3', event: 'Family visit to Chicago; celebrated a joyful engagement.' },
      { time: 'Month 6', event: 'Beautiful cross-cultural Nikah blending North African and South Asian traditions.' }
    ],
    adviceForSingles: 'Do not let cultural rigidities prevent you from marrying someone of righteous character and sound deen. The Prophet ﷺ reminded us of the equality of all believers.',
    dua: 'وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا — "And We made you peoples and tribes that you may know one another."'
  },
  {
    id: 'story-5',
    slug: 'yusuf-and-aminah-revert-journey',
    coupleNames: 'Brother Yusuf & Sister Aminah',
    title: 'Welcomed with Open Arms: A Revert Brother’s Journey to Halal Matrimony',
    tagline: 'Finding understanding, family warmth, and righteous companionship after embracing Islam.',
    category: 'Revert Journey',
    image: '/stories/story_yusuf_aminah.jpg',
    weddingDate: 'Rajab 1447 / January 2026',
    location: 'Manchester, United Kingdom',
    timeToNikah: '5 Months from Salam to Nikah',
    featured: false,
    quote: 'As a revert to Islam, navigating marriage can be intimidating. On Qurb, my journey was respected and Aminah’s family welcomed me with open hearts.',
    theMatch: 'Yusuf embraced Islam four years ago and was dedicated to deepening his knowledge. Aminah was seeking a husband who loved learning and living the deen sincerely. They connected through Qurb’s verified practicing filter.',
    waliRole: 'Aminah’s local Imam and father acted as supportive chaperones, guiding Yusuf through traditional cultural nuances with compassion and brotherhood.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Matched with full alignment on Islamic growth and home environment.' },
      { time: 'Week 3', event: 'Meeting with the local mosque Imam and Aminah’s father.' },
      { time: 'Month 2', event: 'Yusuf invited to family gatherings to get to know her family.' },
      { time: 'Month 5', event: 'Nikah performed at the Central Manchester Mosque.' }
    ],
    adviceForSingles: 'Have sabr (patience) and trust Allah’s divine timing. What is written for you by the Most Merciful will never pass you by.',
    dua: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ — "O Turner of the hearts, keep our hearts firm upon Your religion."'
  },
  {
    id: 'story-6',
    slug: 'bilal-and-sarah-sunnah-alignment',
    coupleNames: 'Bilal & Dr. Sarah',
    title: 'Transparent from Day One: How Clear Intentions Led to an Effortless Nikah',
    tagline: 'Avoiding months of guesswork through upfront questions on Mahr, family, and shared life priorities.',
    category: 'Sunnah Aligned',
    image: '/stories/story_bilal_sarah.jpg',
    weddingDate: 'Safar 1448 / August 2026',
    location: 'Lahore, Pakistan',
    timeToNikah: '4 Months from Salam to Nikah',
    featured: false,
    quote: 'We discussed living arrangements, financial responsibilities, and Islamic parenting upfront without awkwardness. Qurb set the perfect respectful framework.',
    theMatch: 'Bilal is an entrepreneur and Sarah is an academic researcher. Both valued clarity and intentionality above all else. They utilized Qurb’s structured biodata fields to verify common vision before taking the next step.',
    waliRole: 'Sarah’s guardian ensured a completely honorable process, coordinating directly with Bilal’s parents for an auspicious family union.',
    timelineMilestones: [
      { time: 'Day 1', event: 'Connected after reviewing detailed lifestyle biodata.' },
      { time: 'Week 2', event: 'Transparent discussion of Mahr and future career aspirations.' },
      { time: 'Month 1', event: 'Parents met over a formal family luncheon.' },
      { time: 'Month 4', event: 'Nikah completed in accordance with the blessed Sunnah.' }
    ],
    adviceForSingles: 'Be honest and clear about your expectations from day one. Sincerity attracts sincerity.',
    dua: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ — "O Allah, I ask You for the good in her and the good with which You have created her."'
  }
];
