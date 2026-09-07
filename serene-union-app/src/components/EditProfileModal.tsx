import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Compass, 
  Heart, 
  Check, 
  Loader2, 
  Sparkles,
  MapPin,
  GraduationCap
} from 'lucide-react';
import type { UserProfile, Sect, PracticeLevel, MarriageTimeline } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSaved?: (updatedUser: UserProfile) => void;
}

type TabType = 'personal' | 'career' | 'deen' | 'lifestyle';

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  user,
  onClose,
  onSaved
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<number>(25);
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [ethnicity, setEthnicity] = useState<string>('');
  const [citizenship, setCitizenship] = useState<string>('');

  // Career & Education
  const [profession, setProfession] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  const [workArrangement, setWorkArrangement] = useState<string>('onsite');
  const [incomeBracket, setIncomeBracket] = useState<string>('undisclosed');

  // Deen
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>('practicing');
  const [sect, setSect] = useState<Sect>('Sunni');
  const [madhhab, setMadhhab] = useState<string>('Hanafi');
  const [prayerFrequency, setPrayerFrequency] = useState<string>('5 times daily');
  const [halalDiet, setHalalDiet] = useState<string>('Strictly Halal');
  const [modestyPractice, setModestyPractice] = useState<string>('');

  // Marriage & Lifestyle
  const [marriageTimeline, setMarriageTimeline] = useState<MarriageTimeline>('within_1_year');
  const [maritalStatus, setMaritalStatus] = useState<string>('never_married');
  const [livingPreference, setLivingPreference] = useState<string>('independent');
  const [willingnessToRelocate, setWillingnessToRelocate] = useState<string>('open');
  const [smokingStatus, setSmokingStatus] = useState<string>('non_smoker');
  const [languagesSpoken, setLanguagesSpoken] = useState<string>('English');
  const [childrenDesire, setChildrenDesire] = useState<string>('wants_children');
  const [bio, setBio] = useState<string>('');

  // Hydrate fields on open or user change
  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || '');
      setAge(user.age || 25);
      setCity(user.city || user.location?.split(',')[0]?.trim() || '');
      setCountry(user.country || user.location?.split(',')[1]?.trim() || '');
      setHeight(user.height || "5'8\" (173 cm)");
      setEthnicity(user.ethnicity || 'Global');
      setCitizenship(user.citizenship || '');

      setProfession(user.profession || '');
      setEducation(user.education || '');
      setUniversity(user.university || '');
      setWorkArrangement(user.workArrangement || 'onsite');
      setIncomeBracket(user.incomeBracket || 'undisclosed');

      setPracticeLevel(user.religiousProfile?.practiceLevel || 'practicing');
      setSect(user.religiousProfile?.sect || 'Sunni');
      setMadhhab(user.religiousProfile?.madhhab || 'Hanafi');
      setPrayerFrequency(user.religiousProfile?.prayerFrequency || '5 times daily');
      setHalalDiet(user.religiousProfile?.halalDiet || 'Strictly Halal');
      setModestyPractice(user.religiousProfile?.modestyPractice || '');

      setMarriageTimeline((user.marriageTimeline as MarriageTimeline) || 'within_1_year');
      setMaritalStatus(user.maritalStatus || 'never_married');
      setLivingPreference(user.livingPreference || 'independent');
      setWillingnessToRelocate(user.willingnessToRelocate || 'open');
      setSmokingStatus(user.smokingStatus || 'non_smoker');
      setLanguagesSpoken(user.languagesSpoken || 'English');
      setChildrenDesire(user.childrenDesire || 'wants_children');
      setBio(user.bio || user.religiousProfile?.deenRelationshipBio || '');
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    const locationString = city && country ? `${city}, ${country}` : (city || country || user.location || 'Global');

    const updatedProfile: Partial<UserProfile> = {
      fullName: fullName.trim() || user.fullName,
      age: Number(age) || user.age,
      city: city.trim(),
      country: country.trim(),
      location: locationString,
      height,
      ethnicity: ethnicity.trim(),
      citizenship: citizenship.trim(),
      profession: profession.trim(),
      education: education.trim(),
      university: university.trim(),
      workArrangement: workArrangement as any,
      incomeBracket: incomeBracket as any,
      marriageTimeline,
      maritalStatus: maritalStatus as any,
      livingPreference: livingPreference as any,
      willingnessToRelocate: willingnessToRelocate as any,
      smokingStatus: smokingStatus as any,
      languagesSpoken: languagesSpoken.trim(),
      childrenDesire,
      bio: bio.trim(),
      religiousProfile: {
        ...(user.religiousProfile || {
          practiceLevel: 'practicing',
          sect: 'Sunni',
          prayerFrequency: '5 times daily',
          halalDiet: 'Strictly Halal'
        }),
        practiceLevel,
        sect,
        madhhab,
        prayerFrequency,
        halalDiet,
        modestyPractice: modestyPractice.trim(),
        deenRelationshipBio: bio.trim()
      }
    };

    try {
      const savedUser = await dbService.updateUserProfileLive(user.id, updatedProfile);
      const mergedUser: UserProfile = savedUser || { ...user, ...updatedProfile } as UserProfile;
      
      setSuccessMessage('Profile details updated successfully!');
      if (onSaved) {
        onSaved(mergedUser);
      }
      
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Failed to update profile live:', err);
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs px-0 sm:px-4 font-sans animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-outline overflow-hidden animate-slide-up">
        
        {/* Header */}
        <header className="sticky top-0 bg-white px-5 py-3.5 border-b border-outline flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 id="edit-profile-modal-title" className="font-serif text-sm font-bold text-on-surface">
                Edit Matrimonial Biodata
              </h2>
              <p className="text-[10px] text-secondary">
                Update personal, career, and Islamic values in-place
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close edit profile dialog"
            className="w-8 h-8 rounded-full bg-surface hover:bg-outline/40 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center justify-between border-b border-outline px-3 bg-surface/30">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'personal'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('career')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'career'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deen')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'deen'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Deen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lifestyle')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'lifestyle'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Lifestyle</span>
          </button>
        </nav>

        {/* Scrollable Form Body */}
        <form id="edit-profile-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-medium animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Zayn Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={"e.g. 5'10\" (178 cm)"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Manchester"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Ethnicity
                  </label>
                  <input
                    type="text"
                    value={ethnicity}
                    onChange={(e) => setEthnicity(e.target.value)}
                    placeholder="e.g. South Asian, Arab"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Citizenship
                  </label>
                  <input
                    type="text"
                    value={citizenship}
                    onChange={(e) => setCitizenship(e.target.value)}
                    placeholder="e.g. British, Canadian"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Career & Education */}
          {activeTab === 'career' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Profession / Job Title
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-primary" />
                  <span>Degree / Qualification</span>
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of Manchester"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                    <option value="entrepreneur">Business / Entrepreneur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Income Bracket
                  </label>
                  <select
                    value={incomeBracket}
                    onChange={(e) => setIncomeBracket(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="undisclosed">Prefer not to say</option>
                    <option value="under_40k">Under $40,000</option>
                    <option value="40k_80k">$40,000 - $80,000</option>
                    <option value="80k_150k">$80,000 - $150,000</option>
                    <option value="150k_plus">$150,000+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Deen & Practice */}
          {activeTab === 'deen' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Sect
                  </label>
                  <select
                    value={sect}
                    onChange={(e) => setSect(e.target.value as Sect)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Sunni">Sunni</option>
                    <option value="Shia">Shia</option>
                    <option value="Just Muslim">Just Muslim</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Madhhab
                  </label>
                  <select
                    value={madhhab}
                    onChange={(e) => setMadhhab(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Hanafi">Hanafi</option>
                    <option value="Shafi'i">Shafi'i</option>
                    <option value="Maliki">Maliki</option>
                    <option value="Hanbali">Hanbali</option>
                    <option value="Jafari">Jafari</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Practice Level
                  </label>
                  <select
                    value={practiceLevel}
                    onChange={(e) => setPracticeLevel(e.target.value as PracticeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="practicing">Practicing</option>
                    <option value="moderately_practicing">Moderately Practicing</option>
                    <option value="cultural">Cultural</option>
                    <option value="revert">Revert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Prayer Frequency
                  </label>
                  <select
                    value={prayerFrequency}
                    onChange={(e) => setPrayerFrequency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="5 times daily">5 times daily</option>
                    <option value="Usually">Usually</option>
                    <option value="Sometimes">Sometimes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Halal Diet
                  </label>
                  <select
                    value={halalDiet}
                    onChange={(e) => setHalalDiet(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Strictly Halal">Strictly Halal</option>
                    <option value="Zabiha Only">Zabiha Only</option>
                    <option value="Halal at Home">Halal at Home</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Modesty Practice
                  </label>
                  <input
                    type="text"
                    value={modestyPractice}
                    onChange={(e) => setModestyPractice(e.target.value)}
                    placeholder="e.g. Hijab / Sunnah Beard"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Lifestyle & Matrimony */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Marriage Timeline
                  </label>
                  <select
                    value={marriageTimeline}
                    onChange={(e) => setMarriageTimeline(e.target.value as MarriageTimeline)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="1_to_3_months">1 - 3 Months</option>
                    <option value="within_1_year">Within 1 Year</option>
                    <option value="right_person">When Right Person</option>
                    <option value="exploring">Exploring Intently</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Marital Status
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="never_married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="single_parent">Single Parent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Living Preference
                  </label>
                  <select
                    value={livingPreference}
                    onChange={(e) => setLivingPreference(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="independent">Independent Home</option>
                    <option value="with_in_laws">With In-Laws</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Relocate Willingness
                  </label>
                  <select
                    value={willingnessToRelocate}
                    onChange={(e) => setWillingnessToRelocate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="open">Open to Relocate</option>
                    <option value="willing">Willing to Move</option>
                    <option value="not_willing">Not Willing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Smoking Status
                  </label>
                  <select
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="non_smoker">Non-Smoker</option>
                    <option value="trying_to_quit">Trying to Quit</option>
                    <option value="occasional">Occasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="e.g. English, Urdu, Arabic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Matrimonial Bio & Aspirations
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your personality, goals, and what you seek in a spouse..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <footer className="sticky bottom-0 bg-white px-5 py-3.5 border-t border-outline flex items-center justify-end gap-2.5 z-10 shadow-subtle">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-full border border-outline text-secondary hover:text-on-surface font-sans text-xs font-bold transition-all active:scale-98"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark transition-all active:scale-98 flex items-center justify-center gap-1.5 min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </footer>

      </div>
    </div>
  );
};

export default EditProfileModal;
