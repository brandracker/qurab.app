export type AdminTab = 'overview' | 'live' | 'daily' | 'subscriptions' | 'users' | 'photos' | 'seeds' | 'referrals' | 'announcements';

export interface OfficialAnnouncement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string | null;
  actionUrl?: string | null;
  actionLabel?: string | null;
  createdAt: number;
}

export interface DailyUserItem {
  id: string;
  fullName: string;
  gender: string;
  age: number;
  dob: string;
  city: string;
  country: string;
  profession: string;
  isVip: boolean;
  isSeed: boolean;
  photoUrl: string;
  totalActiveSeconds: number;
  activeDurationFormatted: string;
  firstActiveAt: string;
  lastActiveAt: string;
  secondsAgo: number;
  status: 'online' | 'away' | 'recent' | 'offline';
  matchesCountToday: number;
  likesCountToday: number;
  messagesSentCount: number;
  ip: string;
  isp: string;
  userAgent: string;
}

export interface DailyActivitySummary {
  activeUsersCount: number;
  totalActiveHours: string;
  matchesCountToday: number;
  likesCountToday: number;
  messagesCountToday: number;
  topCities: { name: string; count: number }[];
}

export interface DailyActivityResponse {
  success: boolean;
  targetDate: string;
  summary: DailyActivitySummary;
  users: DailyUserItem[];
}

export interface UserAuditDetail {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    city: string;
    country: string;
    profession: string;
    education: string;
    isVip: boolean;
    isSeed: boolean;
    photos: string[];
    waliName?: string;
    waliRelationship?: string;
    waliPhone?: string;
  };
  telemetry: {
    ip: string;
    city: string;
    country: string;
    isp: string;
    userAgent: string;
    totalActiveSeconds: number;
    activeDurationFormatted: string;
    firstActiveAt: string;
    lastActiveAt: string;
  };
  matchesToday: {
    matchId: string;
    matchedAt: string;
    matchType: string;
    partner: {
      id: string;
      fullName: string;
      city: string;
      profession: string;
      gender: string;
      photoUrl: string;
    };
  }[];
  likesToday: {
    likeId: string;
    likedAt: string;
    recipient: {
      id: string;
      fullName: string;
      city: string;
      profession: string;
      gender: string;
      photoUrl: string;
    };
  }[];
  conversationsToday: {
    conversationId: string;
    lastMessageText: string;
    lastMessageTime: string;
    partner: {
      id: string;
      fullName: string;
      city: string;
      profession: string;
      gender: string;
      photoUrl: string;
    };
    messages: {
      id: string;
      senderId: string;
      senderName: string;
      text: string;
      createdAt: string;
      isFromCurrentUser: boolean;
      waliNotified: boolean;
    }[];
  }[];
}

export interface LiveUser {
  id: string;
  fullName: string;
  gender: string;
  city: string;
  country: string;
  profession: string;
  isVip: boolean;
  isSeed: boolean;
  photoUrl: string;
  lastActiveAt: string;
  secondsAgo: number;
  status: 'online' | 'away' | 'recent' | 'offline';
  currentAction: string;
}

export interface LiveConversationParticipant {
  id: string;
  fullName: string;
  gender: string;
  city: string;
  isVip: boolean;
  photoUrl: string;
}

export interface LiveConversation {
  id: string;
  lastMessageText: string;
  lastMessageSenderId?: string;
  lastMessageTime: string;
  secondsAgo: number;
  status: string;
  messageCount: number;
  waliObserver?: string | null;
  participantOne: LiveConversationParticipant;
  participantTwo: LiveConversationParticipant;
}

export interface LiveActivityData {
  summary: {
    onlineUsers: number;
    activeUsersToday: number;
    activeConversations: number;
    totalMessages: number;
    messagesToday: number;
  };
  liveUsers: LiveUser[];
  liveConversations: LiveConversation[];
  timestamp: string;
}

export interface ConversationTranscriptMessage {
  id: string;
  conversation_id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface RecentMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderCity: string;
  senderGender: string;
  senderVip: boolean;
  photoUrl: string;
  text: string;
  timestamp: string;
  secondsAgo: number;
  recipientName?: string;
}

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

export interface DailyBreakdownItem {
  date: string;
  signups: number;
  male: number;
  female: number;
  matches?: number;
  messages?: number;
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
    yesterday?: number;
    yesterdayStats?: {
      date: string;
      signups: number;
      male: number;
      female: number;
    };
    diffFromYesterday?: number;
    diffPctFromYesterday?: number;
    thisWeek: number;
    thisMonth: number;
    dates?: {
      todayDate: string;
      yesterdayDate?: string;
      weekStart: string;
      monthStart: string;
    };
    dailyBreakdown?: DailyBreakdownItem[];
    selectedDate?: string;
    selectedDateStats?: {
      date: string;
      signups: number;
      male: number;
      female: number;
      matches?: number;
      messages?: number;
    };
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
    subscription_expiry?: string | null;
    daysRemaining?: number | null;
    direct_salams_balance?: number;
    daily_messages_quota?: number;
    is_spotlight_active?: number | boolean;
    subscriptionStartedAt?: string | null;
  } | null;
  purchases?: InAppPurchaseRecord[];
  created_at?: string;
}

export interface InAppPurchaseRecord {
  id: string;
  product_id: string;
  platform: string;
  purchase_token?: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
}
