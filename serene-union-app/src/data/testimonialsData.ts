export interface TestimonialItem {
  id: string;
  coupleNames: string;
  location: string;
  weddingDate: string;
  timeline: string;
  quote: string;
  fullStory: string;
  tag: string;
  verified: boolean;
  avatar: string;
  stars: number;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'test-1',
    coupleNames: 'Zaid & Ayesha',
    location: 'London, United Kingdom',
    weddingDate: 'Nikah: Shawwal 1447 (April 2026)',
    timeline: 'Connected to Nikah in 4 Months',
    quote: 'The Wali chaperone feature gave my father complete peace of mind. For the first time, an app respected our Islamic traditions without compromising privacy.',
    fullStory: 'Ayesha registered her father as her chaperone from day one. When Zaid sent his Salam, my father was able to observe our conversations, ensuring dignified adab. We met as families within 6 weeks and celebrated our Nikah with immense Barakah.',
    tag: 'Wali Chaperoned',
    verified: true,
    avatar: '/stories/story_zaid_ayesha.jpg',
    stars: 5
  },
  {
    id: 'test-2',
    coupleNames: 'Tariq & Dr. Fatima',
    location: 'Dallas, Texas, USA',
    weddingDate: 'Nikah: Dhul Hijjah 1447 (June 2026)',
    timeline: 'Connected to Nikah in 5 Months',
    quote: 'Hearing Fatima’s spoken voice bio was the turning point. Her articulation, values, and deen resonated far deeper than any written text or photo ever could.',
    fullStory: 'Tariq was drawn to Fatima’s sincerity in her audio bio where she spoke about her balance of medical residency and Quran memorization. No endless messaging games—just clear mutual goals toward lawful marriage upon the Sunnah.',
    tag: 'Spoken Voice Bio Match',
    verified: true,
    avatar: '/stories/story_tariq_fatima.jpg',
    stars: 5
  },
  {
    id: 'test-3',
    coupleNames: 'Hamza & Maryam',
    location: 'Toronto, Canada',
    weddingDate: 'Nikah: Muharram 1448 (July 2026)',
    timeline: 'Connected to Nikah in 3 Months',
    quote: 'The Modesty Photo Shield allowed us to evaluate character and Islamic practice before looks. When we mutually revealed photos, our hearts were already aligned.',
    fullStory: 'Maryam appreciated keeping her pictures blurred on the public feed. We connected over our shared commitment to five daily prayers, community service, and halal living. Our Nikah was simple, blessed, and full of peace.',
    tag: 'Modesty Shield First',
    verified: true,
    avatar: '/stories/story_hamza_maryam.jpg',
    stars: 5
  },
  {
    id: 'test-4',
    coupleNames: 'Bilal & Sarah',
    location: 'Lahore, Pakistan',
    weddingDate: 'Nikah: Safar 1448 (August 2026)',
    timeline: 'Connected to Nikah in 6 Months',
    quote: 'Transparent Mahr expectations and living preferences saved us months of awkwardness. Qurb makes intentional conversations natural and respectful.',
    fullStory: 'Both our families wanted a transparent, halal matchmaking process without the commercial pressures of traditional marriage bureaus. Qurb provided the modern dignity and Islamic ethics we needed.',
    tag: 'Family Blessing & Sunnah',
    verified: true,
    avatar: '/stories/story_bilal_sarah.jpg',
    stars: 5
  }
];
