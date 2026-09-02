import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFonts, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const { width } = Dimensions.get('window');

// THEME PALETTE
const COLORS = {
  primary: '#154212',
  primaryContainer: '#2d5a27',
  onPrimary: '#ffffff',
  secondary: '#4f6073',
  tertiary: '#cca730',
  background: '#fbf9f4',
  surface: '#fbf9f4',
  surfaceCard: '#f5f3ee',
  surfaceVariant: '#e4e2dd',
  onSurface: '#1b1c19',
  onSurfaceVariant: '#42493e',
  outline: '#72796e',
  white: '#ffffff',
};

// INITIAL MOCK PROFILES WITH GEOGRAPHIC COORDINATES
const PROFILES = [
  {
    id: 'usr_001',
    name: 'Aisha Al-Mansoor',
    age: 26,
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    profession: 'Data Analyst',
    education: 'MSc Data Science, UCL',
    sect: 'Sunni · Hanafi',
    practice: 'Practicing',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    blur: true,
    bio: 'Family-oriented, love weekend nature walks, reading, and Quran circles. Seeking a practicing companion with kindness and good humor.',
    wali: 'Tariq Al-Mansoor (Father)',
  },
  {
    id: 'usr_006',
    name: 'Fatima Zahra',
    age: 27,
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'United Kingdom',
    latitude: 53.4808,
    longitude: -2.2426,
    profession: 'Speech Therapist',
    education: 'BSc Speech Sciences, Manchester',
    sect: 'Sunni · Maliki',
    practice: 'Practicing',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    blur: true,
    bio: 'Calm and patient temperament. Love baking, charity projects, and striving to learn classical Arabic.',
    wali: 'Omar Zahra (Father)',
  },
  {
    id: 'usr_002',
    name: 'Maryam Khan',
    age: 25,
    location: 'Dubai, UAE',
    city: 'Dubai',
    country: 'UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    profession: 'Architect',
    education: 'B.Arch, AUS Dubai',
    sect: 'Sunni · Hanafi',
    practice: 'Practicing',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    blur: true,
    bio: 'Creative soul passionate about Islamic architecture, art, and family gatherings. Wali actively involved.',
    wali: 'Bilal Khan (Brother)',
  },
  {
    id: 'usr_003',
    name: 'Zayn Malik',
    age: 28,
    location: 'Toronto, Canada',
    city: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    profession: 'Software Engineer',
    education: 'BSc Computer Science, Waterloo',
    sect: 'Sunni · Shafi\'i',
    practice: 'Practicing',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    blur: false,
    bio: 'Tech enthusiast, love soccer, specialty coffee, and mosque community work. Striving for 5 daily prayers.',
    wali: null,
  }
];

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'chat' | 'settings'>('discover');
  const [profileIndex, setProfileIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'Aisha', text: 'Assalamu alaikum, Tariq. It’s nice to connect with you. I read in your profile that you enjoy hiking.', time: '2:30 PM', isMe: false },
    { id: '2', sender: 'You', text: 'Wa alaikum assalam, Aisha. Yes, I find peace in nature. It helps me disconnect and reflect.', time: '2:34 PM', isMe: true },
    { id: '3', sender: 'Aisha', text: 'Family is very important to me too. How often do you get to see your family?', time: '2:40 PM', isMe: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [blurPhotosState, setBlurPhotosState] = useState(true);

  // USER LOCATION & DISTANCE FILTER STATE
  const [userLocation, setUserLocation] = useState<{
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  }>({
    city: 'London',
    country: 'UK',
    latitude: 51.5074,
    longitude: -0.1278,
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number | null>(null);

  // Native Location Auto-Detection via OS Geocoder
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Needed',
          'Please grant location access so Serene Union can display nearby matrimonial profiles and calculate distances.'
        );
        setIsDetectingLocation(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding via Native phone geocoder (free, fast, zero server load)
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      let detectedCity = 'Current Location';
      let detectedCountry = '';

      if (places && places.length > 0) {
        const p = places[0];
        detectedCity = p.city || p.subregion || p.region || 'City';
        detectedCountry = p.country || '';
      }

      setUserLocation({
        city: detectedCity,
        country: detectedCountry,
        latitude,
        longitude
      });

      Alert.alert(
        'Location Detected 📍',
        `Successfully set your location to ${detectedCity}${detectedCountry ? ', ' + detectedCountry : ''}.`
      );
    } catch (err: any) {
      console.log('Location detection fallback:', err);
      Alert.alert('Notice', 'Could not detect GPS location. You can enter your city manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Spherical Haversine Distance Helper
  const getDistanceToProfile = (pLat?: number, pLon?: number) => {
    if (
      userLocation.latitude === null ||
      userLocation.longitude === null ||
      pLat === undefined ||
      pLon === undefined
    ) {
      return null;
    }
    const R = 6371;
    const dLat = ((pLat - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((pLon - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((pLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist >= 10 ? Math.round(dist) : Math.round(dist * 10) / 10;
  };

  if (!fontsLoaded) {
    return null;
  }

  // Active profiles filtered by maxDistanceFilter
  const activeProfiles = PROFILES.filter((p) => {
    if (maxDistanceFilter === null) return true;
    const dist = getDistanceToProfile(p.latitude, p.longitude);
    return dist !== null && dist <= maxDistanceFilter;
  });

  const currentProfile = activeProfiles.length > 0 
    ? activeProfiles[profileIndex % activeProfiles.length]
    : null;

  const handleLike = () => {
    if (currentProfile && currentProfile.id === 'usr_001') {
      setShowMatchModal(true);
    } else {
      setProfileIndex(prev => prev + 1);
    }
  };

  const handlePass = () => {
    setProfileIndex(prev => prev + 1);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'You',
      text: chatInput.trim(),
      time: 'Just now',
      isMe: true,
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Aisha',
          text: 'JazakAllah Khair! That is very thoughtful and aligns with our family values.',
          time: 'Just now',
          isMe: false,
        }
      ]);
    }, 1800);
  };

  // ONBOARDING STEPPER
  if (onboardingStep !== null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        {/* Onboarding Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => setOnboardingStep(onboardingStep > 1 ? onboardingStep - 1 : null)}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Serene Union</Text>
          <Text style={styles.stepBadge}>Step {onboardingStep} of 5</Text>
        </View>

        {/* Step 1: Welcome */}
        {onboardingStep === 1 && (
          <ImageBackground
            source={require('./assets/halal_couple_bg.jpg')}
            style={styles.welcomeHeroBg}
            resizeMode="cover"
          >
            <View style={styles.welcomeHeroOverlay} />
            <View style={styles.welcomeHeroInner}>
              <View style={styles.logoBadge}>
                <MaterialIcons name="favorite" size={40} color={COLORS.onPrimary} />
              </View>
              <Text style={styles.arabicHeaderWhite}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
              <Text style={styles.heroTitleWhite}>Serene Union</Text>
              <Text style={styles.heroSubtitleWhite}>Finding your spouse, the pure halal way.</Text>
              
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setOnboardingStep(2)}>
                <Text style={styles.primaryBtnText}>Begin with Bismillah</Text>
                <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}

        {/* Step 2: Intent */}
        {onboardingStep === 2 && (
          <View style={styles.onboardingContent}>
            <Text style={styles.sectionTitle}>What are you looking for?</Text>
            <Text style={styles.sectionSubtitle}>Your intention helps us find meaningful connections.</Text>
            
            <TouchableOpacity style={[styles.cardOption, styles.cardSelected]} onPress={() => setOnboardingStep(3)}>
              <Text style={styles.optionTitle}>Marriage within 1 year</Text>
              <Text style={styles.optionDesc}>I am ready to settle down soon in a halal union.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardOption} onPress={() => setOnboardingStep(3)}>
              <Text style={styles.optionTitle}>Marriage when I find right person</Text>
              <Text style={styles.optionDesc}>I am intentional, not rushing the process.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardOption} onPress={() => setOnboardingStep(3)}>
              <Text style={styles.optionTitle}>Just exploring / Open-minded</Text>
              <Text style={styles.optionDesc}>Open to seeing where Allah guides.</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Basic Info */}
        {onboardingStep === 3 && (
          <ScrollView style={styles.scrollForm}>
            <Text style={styles.sectionTitle}>Tell us about yourself</Text>
            <Text style={styles.sectionSubtitle}>Personalize your matrimonial profile.</Text>

            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput style={styles.input} defaultValue="Tariq Hussain" />

            <Text style={styles.inputLabel}>GENDER</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity style={[styles.genderBtn, styles.genderActive]}>
                <Text style={styles.genderActiveText}>Brother (Male)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.genderBtn}>
                <Text style={styles.genderText}>Sister (Female)</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>LOCATION / CITY</Text>
            <View style={styles.locationInputRow}>
              <TextInput 
                style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                value={userLocation.city ? `${userLocation.city}${userLocation.country ? ', ' + userLocation.country : ''}` : ''}
                onChangeText={(val) => setUserLocation(prev => ({ ...prev, city: val }))}
                placeholder="e.g. Lahore, Pakistan"
              />
              <TouchableOpacity 
                style={styles.detectLocationBtn} 
                onPress={handleDetectLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <MaterialIcons name="my-location" size={16} color={COLORS.white} />
                )}
                <Text style={styles.detectLocationText}>
                  {isDetectingLocation ? 'Detecting...' : 'Auto-Detect'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.locationHelpText}>
              🔒 Privacy-first: Only your general city & distance are shown to others, never your street address.
            </Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setOnboardingStep(4)}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Step 4: Religious Practice */}
        {onboardingStep === 4 && (
          <View style={styles.onboardingContent}>
            <Text style={styles.sectionTitle}>Religious Practice</Text>
            <Text style={styles.sectionSubtitle}>Ensure spiritual alignment and shared values.</Text>

            {['Practicing (5 Daily Prayers)', 'Moderately Practicing', 'Cultural Muslim', 'Revert to Islam'].map((item, idx) => (
              <TouchableOpacity key={idx} style={[styles.cardOption, idx === 0 && styles.cardSelected]} onPress={() => setOnboardingStep(5)}>
                <Text style={styles.optionTitle}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 5: Profile & Modesty Blur */}
        {onboardingStep === 5 && (
          <View style={styles.onboardingContent}>
            <Text style={styles.sectionTitle}>Islamic Privacy</Text>
            <Text style={styles.sectionSubtitle}>Protect your modesty in the Discover feed.</Text>

            <View style={styles.privacyRow}>
              <View>
                <Text style={styles.optionTitle}>Blur My Photos</Text>
                <Text style={styles.optionDesc}>Unblur only on mutual approval</Text>
              </View>
              <TouchableOpacity
                onPress={() => setBlurPhotosState(!blurPhotosState)}
                style={[styles.toggleBtn, blurPhotosState && styles.toggleActive]}
              >
                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>{blurPhotosState ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setOnboardingStep(null)}>
              <Text style={styles.primaryBtnText}>Enter Serene Union</Text>
              <MaterialIcons name="check" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top App Header */}
      <View style={styles.mainHeader}>
        <View style={styles.brandRow}>
          <View style={styles.miniLogo}>
            <MaterialIcons name="favorite" size={16} color={COLORS.onPrimary} />
          </View>
          <Text style={styles.mainBrandText}>Serene Union</Text>
        </View>

        <TouchableOpacity onPress={() => setOnboardingStep(1)} style={styles.onboardingChip}>
          <MaterialIcons name="restart-alt" size={14} color={COLORS.primary} />
          <Text style={styles.onboardingChipText}>Flow</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Views */}
      <View style={styles.body}>
        {/* TAB 1: DISCOVER FEED */}
        {activeTab === 'discover' && (
          <View style={styles.discoverContainer}>
            {/* Distance Filter Horizontal Bar */}
            <View style={styles.distanceFilterRow}>
              <Text style={styles.distanceFilterLabel}>DISTANCE:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.distanceFilterScroll}>
                {[
                  { label: 'Anywhere', value: null },
                  { label: 'Within 50 km', value: 50 },
                  { label: 'Within 150 km', value: 150 },
                  { label: 'Within 300 km', value: 300 },
                  { label: 'Within 1000 km', value: 1000 },
                ].map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.filterPill,
                      maxDistanceFilter === opt.value && styles.filterPillActive
                    ]}
                    onPress={() => {
                      setMaxDistanceFilter(opt.value);
                      setProfileIndex(0);
                    }}
                  >
                    <Text style={[
                      styles.filterPillText,
                      maxDistanceFilter === opt.value && styles.filterPillTextActive
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {currentProfile ? (
              <View style={styles.cardContainer}>
                <View style={styles.cardPhotoWrapper}>
                  <Image
                    source={{ uri: currentProfile.photo }}
                    style={[styles.cardPhoto, currentProfile.blur && blurPhotosState && styles.blurredImage]}
                    blurRadius={currentProfile.blur && blurPhotosState ? 20 : 0}
                  />
                  
                  {/* Modesty Photo Notice */}
                  {currentProfile.blur && blurPhotosState && (
                    <View style={styles.blurOverlay}>
                      <MaterialIcons name="visibility-off" size={28} color={COLORS.white} />
                      <Text style={styles.blurText}>Modesty Mode Active</Text>
                      <TouchableOpacity
                        style={styles.requestPhotoBtn}
                        onPress={() => Alert.alert('Request Sent', 'Photo reveal request sent to ' + currentProfile.name)}
                      >
                        <Text style={styles.requestPhotoText}>Request Photo</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Wali Badge */}
                  {currentProfile.wali && (
                    <View style={styles.waliPill}>
                      <MaterialIcons name="verified-user" size={12} color={COLORS.primary} />
                      <Text style={styles.waliPillText}>Wali Verified</Text>
                    </View>
                  )}
                </View>

                {/* Card Details */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{currentProfile.name}, {currentProfile.age}</Text>
                  
                  {/* Location & Dynamic Distance Pill */}
                  <View style={styles.locationBadgeRow}>
                    <MaterialIcons name="place" size={14} color={COLORS.primary} />
                    <Text style={styles.cardMetaLocation}>{currentProfile.city || currentProfile.location}</Text>
                    {getDistanceToProfile(currentProfile.latitude, currentProfile.longitude) !== null && (
                      <View style={styles.distanceBadge}>
                        <MaterialIcons name="near-me" size={10} color={COLORS.primary} />
                        <Text style={styles.distanceBadgeText}>
                          {getDistanceToProfile(currentProfile.latitude, currentProfile.longitude)} km away
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cardSectMeta}>{currentProfile.sect} · {currentProfile.profession}</Text>
                  <Text style={styles.cardBio} numberOfLines={2}>{currentProfile.bio}</Text>

                  {/* Action Buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.passBtn} onPress={handlePass}>
                      <MaterialIcons name="close" size={26} color={COLORS.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
                      <MaterialIcons name="favorite" size={28} color={COLORS.onPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyDistanceState}>
                <MaterialIcons name="explore-off" size={44} color={COLORS.secondary} />
                <Text style={styles.emptyTitle}>No Profiles Within {maxDistanceFilter} km</Text>
                <Text style={styles.emptyDesc}>
                  Try expanding your distance radius or exploring worldwide to discover more intentional candidates.
                </Text>
                <TouchableOpacity style={styles.clearFilterBtn} onPress={() => setMaxDistanceFilter(null)}>
                  <Text style={styles.clearFilterText}>Show All Distances</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* TAB 2: MATCHES */}
        {activeTab === 'matches' && (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabHeading}>Mutual Matches</Text>
            <View style={styles.matchRow}>
              <TouchableOpacity style={styles.matchAvatar} onPress={() => setActiveTab('chat')}>
                <Image source={{ uri: PROFILES[0].photo }} style={styles.avatarImg} />
                <Text style={styles.avatarName}>Aisha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.matchAvatar} onPress={() => setActiveTab('chat')}>
                <Image source={{ uri: PROFILES[1].photo }} style={styles.avatarImg} />
                <Text style={styles.avatarName}>Maryam</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.tabHeading, { marginTop: 24 }]}>Recent Connections</Text>
            <TouchableOpacity style={styles.convCard} onPress={() => setActiveTab('chat')}>
              <Image source={{ uri: PROFILES[0].photo }} style={styles.convImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.convName}>Aisha Al-Mansoor</Text>
                <Text style={styles.convLastMsg} numberOfLines={1}>Family is very important to me too...</Text>
                <Text style={styles.convWaliTag}>Wali: Tariq Al-Mansoor (Observing)</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* TAB 3: CHAT SCREEN */}
        {activeTab === 'chat' && (
          <View style={styles.chatContainer}>
            {/* Wali Observer Banner */}
            <View style={styles.waliBanner}>
              <MaterialIcons name="supervisor-account" size={16} color={COLORS.primary} />
              <Text style={styles.waliBannerText}>Wali Chaperone: Tariq Al-Mansoor is observing</Text>
            </View>

            {/* Chat Thread */}
            <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 12 }}>
              {chatMessages.map(msg => (
                <View key={msg.id} style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={msg.isMe ? styles.bubbleTextMe : styles.bubbleTextThem}>{msg.text}</Text>
                  <Text style={styles.bubbleTime}>{msg.time}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Chat Input */}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Write an intentional message..."
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <MaterialIcons name="send" size={18} color={COLORS.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabHeading}>Settings & Privacy</Text>

            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>Modesty Photo Blur</Text>
              <TouchableOpacity
                onPress={() => setBlurPhotosState(!blurPhotosState)}
                style={[styles.toggleBtn, blurPhotosState && styles.toggleActive]}
              >
                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>{blurPhotosState ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsCard}>
              <View>
                <Text style={styles.settingsLabel}>Wali / Guardian Details</Text>
                <Text style={styles.optionDesc}>Father: Tariq Al-Mansoor (+44 7700 900077)</Text>
              </View>
              <MaterialIcons name="verified" size={20} color={COLORS.primary} />
            </View>

            <View style={styles.guidelineCard}>
              <Text style={styles.guidelineTitle}>Halal Matrimony Code of Conduct</Text>
              <Text style={styles.guidelineDesc}>
                Serene Union is designed for sincere faith-first marriage intentions. Maintain respect, transparency, and dignity.
              </Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('discover')}>
          <MaterialIcons name="explore" size={24} color={activeTab === 'discover' ? COLORS.primary : COLORS.secondary} />
          <Text style={[styles.navText, activeTab === 'discover' && styles.navTextActive]}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('matches')}>
          <MaterialIcons name="favorite" size={24} color={activeTab === 'matches' ? COLORS.primary : COLORS.secondary} />
          <Text style={[styles.navText, activeTab === 'matches' && styles.navTextActive]}>Matches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('chat')}>
          <MaterialIcons name="chat-bubble" size={24} color={activeTab === 'chat' ? COLORS.primary : COLORS.secondary} />
          <Text style={[styles.navText, activeTab === 'chat' && styles.navTextActive]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
          <MaterialIcons name="settings" size={24} color={activeTab === 'settings' ? COLORS.primary : COLORS.secondary} />
          <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Match Celebration Modal */}
      {showMatchModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.matchModal}>
            <Text style={styles.arabicHeader}>الحمد لله</Text>
            <Text style={styles.matchModalTitle}>Mutual Interest!</Text>
            <Text style={styles.matchModalDesc}>You and Aisha have both expressed interest in a halal union.</Text>
            
            <View style={styles.matchPhotosRow}>
              <Image source={{ uri: PROFILES[2].photo }} style={styles.matchCirclePhoto} />
              <Image source={{ uri: currentProfile?.photo || PROFILES[0].photo }} style={styles.matchCirclePhoto} />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                setShowMatchModal(false);
                setActiveTab('chat');
              }}
            >
              <Text style={styles.primaryBtnText}>Begin Halal Conversation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowMatchModal(false)}>
              <Text style={{ color: COLORS.secondary, fontSize: 12 }}>Keep Exploring</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  stepBadge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.secondary,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
    backgroundColor: COLORS.surface,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBrandText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  onboardingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(21, 66, 18, 0.08)',
  },
  onboardingChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.primary,
  },
  body: {
    flex: 1,
  },
  onboardingContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  arabicHeader: {
    fontSize: 13,
    color: COLORS.tertiary,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    letterSpacing: 2,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.onPrimary,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: COLORS.onSurface,
    marginBottom: 6,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardOption: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceCard,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(21, 66, 18, 0.05)',
  },
  optionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  optionDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  scrollForm: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceCard,
    alignItems: 'center',
  },
  genderActive: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.secondary,
  },
  genderActiveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.onPrimary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    marginBottom: 24,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  discoverContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceVariant,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardPhotoWrapper: {
    width: '100%',
    height: 320,
    position: 'relative',
    backgroundColor: COLORS.surfaceCard,
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  blurredImage: {
    opacity: 0.8,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurText: {
    color: COLORS.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  requestPhotoBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  requestPhotoText: {
    color: COLORS.primary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  waliPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 249, 244, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  waliPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.primary,
  },
  cardInfo: {
    padding: 16,
  },
  cardName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: COLORS.onSurface,
  },
  cardMeta: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.secondary,
    marginVertical: 4,
  },
  cardBio: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceVariant,
  },
  passBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  tabHeading: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 12,
  },
  matchRow: {
    flexDirection: 'row',
    gap: 16,
  },
  matchAvatar: {
    alignItems: 'center',
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.onSurface,
    marginTop: 4,
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
  },
  convImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  convName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.onSurface,
  },
  convLastMsg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  convWaliTag: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  waliBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(21, 66, 18, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  waliBannerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.primary,
  },
  chatScroll: {
    flex: 1,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 2,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceCard,
    borderTopLeftRadius: 2,
  },
  bubbleTextMe: {
    color: COLORS.onPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextThem: {
    color: COLORS.onSurface,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceVariant,
    backgroundColor: COLORS.surface,
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 13,
    color: COLORS.onSurface,
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    marginBottom: 12,
  },
  settingsLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.onSurface,
  },
  guidelineCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 66, 18, 0.06)',
    marginTop: 12,
  },
  guidelineTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 4,
  },
  guidelineDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceVariant,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 2,
  },
  navTextActive: {
    color: COLORS.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  matchModal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  matchModalTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 6,
  },
  matchModalDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  matchPhotosRow: {
    flexDirection: 'row',
    gap: -16,
    marginBottom: 20,
  },
  matchCirclePhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  // GEO & DISTANCE STYLES
  distanceFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  distanceFilterLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: COLORS.secondary,
    letterSpacing: 0.8,
    marginRight: 8,
  },
  distanceFilterScroll: {
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.surfaceVariant,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  filterPillTextActive: {
    color: COLORS.white,
    fontFamily: 'Inter_600SemiBold',
  },
  locationBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
    gap: 4,
  },
  cardMetaLocation: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.primary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf4e8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
    marginLeft: 4,
  },
  distanceBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.primary,
  },
  cardSectMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detectLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 5,
  },
  detectLocationText: {
    color: COLORS.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  locationHelpText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.secondary,
    marginBottom: 16,
    marginTop: 4,
  },
  emptyDistanceState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: COLORS.onSurface,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  clearFilterBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearFilterText: {
    color: COLORS.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  // WELCOME HERO IMAGE STYLES
  welcomeHeroBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  welcomeHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 12, 0.65)',
  },
  welcomeHeroInner: {
    padding: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  arabicHeaderWhite: {
    fontSize: 14,
    color: '#cca730',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroTitleWhite: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitleWhite: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
