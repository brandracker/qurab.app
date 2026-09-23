export type AdminTab = 'overview' | 'users' | 'photos';

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
  photo_count?: number;
  primary_photo?: string;
  photos?: CandidatePhoto[];
  created_at?: string;
}
