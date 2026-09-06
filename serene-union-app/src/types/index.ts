export type Gender = 'male' | 'female' | 'other';
export type MarriageTimeline = '1_to_3_months' | 'within_1_year' | 'right_person' | 'exploring';
export type PracticeLevel = 'practicing' | 'moderately_practicing' | 'cultural' | 'revert';
export type Sect = 'Sunni' | 'Shia' | 'Just Muslim' | 'Other';
export type Madhhab = 'Hanafi' | 'Shafi\'i' | 'Maliki' | 'Hanbali' | 'Jafari' | 'Prefer not to say';

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  dob: string;
  age: number;
  gender: Gender;
  location: string;
  city?: string;
  country?: string;
  profession: string;
  education: string;
  university?: string;
  height: string;
  ethnicity: string;
  citizenship?: string;
  workArrangement?: 'remote' | 'hybrid' | 'onsite' | 'entrepreneur';
  incomeBracket?: 'under_40k' | '40k_80k' | '80k_150k' | '150k_plus' | 'undisclosed';
  islamicAttire?: 'hijab' | 'abaya' | 'niqab' | 'sunnah_beard' | 'trimmed_beard' | 'modest_contemporary';
  dietaryStandard?: 'zabiha_only' | 'halal_always' | 'halal_home' | 'vegetarian';
  revertStatus?: 'born_muslim' | 'revert';
  housingStatus?: 'independent' | 'family_home' | 'rented';
  dualIncomePreference?: 'career_supportive' | 'homemaker_focused' | 'flexible';
  maritalStatus?: 'never_married' | 'divorced' | 'widowed' | 'single_parent';
  hobbies?: string[];
  personalityTraits?: string[];
  familyStructure?: 'nuclear' | 'joint';
  livingPreference?: 'independent' | 'with_in_laws' | 'flexible';
  siblingsCount?: number;
  willingnessToRelocate?: 'willing' | 'not_willing' | 'open';
  smokingStatus?: 'non_smoker' | 'trying_to_quit' | 'occasional';
  languagesSpoken?: string;
  mahrPhilosophy?: string;
  childrenDesire?: string;
  marriageTimeline: string;
  bio: string;
  blurPhotosByDefault: boolean;
  profileVisibility: string;
  photos: string[];
  religiousProfile: {
    practiceLevel: PracticeLevel;
    sect: Sect;
    madhhab?: string;
    prayerFrequency: string;
    halalDiet: string;
    quranRecitation?: string;
    modestyPractice?: string;
    hajjUmrahStatus?: string;
    deenRelationshipBio?: string;
  };
  wali?: {
    name: string;
    relationship: string;
    phone: string;
    isVerified: boolean;
  };
  photoRevealRequested?: boolean;
  photoRevealApproved?: boolean;
  isPhotoRevealed?: boolean;
  hasRevealedToPartner?: boolean;
  revealedToUserIds?: string[];
  isVip?: boolean;
  isSpotlightActive?: boolean;
  isOnline?: boolean;
  lastActive?: string;
  voiceGreetingUrl?: string;
  voiceGreetingDuration?: number;
  latitude?: number;
  longitude?: number;
  distanceKm?: number | null;
  partnerRequirements?: PartnerRequirements;
  isProfileCompleted?: boolean;
  accountStatus?: 'active' | 'deactivated' | 'deleted';
}

export interface PartnerRequirements {
  minAge?: number;
  maxAge?: number;
  maritalStatus?: string;
  practiceLevel?: string;
  relocation?: string;
  education?: string;
  description?: string;
}


export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  waliNotified: boolean;
}

export interface Conversation {
  id: string;
  participantOne: string;
  participantTwo: string;
  otherUser: UserProfile;
  lastMessageText: string;
  lastMessageSenderId: string;
  lastMessageTime: string;
  unreadCount: number;
  waliObserverId?: string;
  waliName?: string;
  status: 'active' | 'respectfully_closed' | 'blocked';
  messages: ChatMessage[];
  isOnline?: boolean;
  hasRevealedToPartner?: boolean;
  isPhotoRevealed?: boolean;
  lastMessageTimestamp?: number;
}


export interface FilterState {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  sects: string[];
  practiceLevels: string[];
  marriageTimelines: string[];
  livingPreferences?: string[];
  willingnessToRelocate?: string[];
  languages: string[];
}
