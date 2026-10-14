export type AdminTab = 'overview' | 'users' | 'photos' | 'seeds';

export interface SeedProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  location: string;
  profession: string;
  education: string;
  university?: string;
  height?: string;
  ethnicity?: string;
  bio?: string;
  seedActive: number | boolean;
  seedPassword?: string;
  isSeed: number | boolean;
  photoUrl?: string;
  sect?: string;
  practiceLevel?: string;
  modestyPractice?: string;
  waliName?: string;
  waliRelationship?: string;
  waliPhone?: string;
  likesReceivedCount?: number;
  mutualMatchesCount?: number;
  conversationsCount?: number;
  createdAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  maleRatio: number;
  femaleRatio: number;
  vipSubscribers: number;
  bannedUsers: number;
  activeMatches: number;
  totalConversations: number;
  growth: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  topCities: { city: string; count: number }[];
  systemStatus: string;
}

export interface AdminProfile {
  id?: string;
  name?: string;
  username?: string;
  role?: string;
}

export interface CityStat {
  city: string;
  count: number;
}

export interface CandidatePhoto {
  id: string;
  user_id?: string;
  full_name?: string;
  city?: string;
  gender?: string;
  photo_url: string;
  is_primary: number | boolean;
  created_at?: string;
}

export interface CandidateUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  gender: string;
  city?: string;
  location?: string;
  age?: number;
  dob?: string;
  height?: string;
  ethnicity?: string;
  marriage_timeline?: string;
  profession?: string;
  education?: string;
  sect?: string;
  marital_status?: string;
  bio?: string;
  about_me?: string;
  values?: string;
  looking_for?: string;
  is_vip: number | boolean;
  account_status: string;
  is_banned: number | boolean;
  ban_reason?: string;
  photo_count?: number;
  primary_photo?: string;
  photos?: CandidatePhoto[];
  religious_profile?: {
    practice_level?: string;
    sect?: string;
    madhhab?: string;
    prayer_frequency?: string;
    halal_diet?: string;
    deen_relationship_bio?: string;
  } | null;
  wali_details?: {
    wali_name?: string;
    wali_phone?: string;
    wali_relationship?: string;
    is_verified?: number | boolean;
  } | null;
  wallet?: {
    subscription_tier?: string;
    direct_salams_balance?: number;
    daily_messages_quota?: number;
    is_spotlight_active?: number | boolean;
  } | null;
  created_at?: string;
}
