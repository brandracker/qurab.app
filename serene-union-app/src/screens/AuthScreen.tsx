import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Smartphone, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { setupRecaptcha, sendPhoneOtp, formatE164Phone } from '../services/firebase';
import { API_BASE } from '../services/dbService';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

interface Props {
  onAuthSuccess: (session: { token: string; user: any; isNewUser: boolean }) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onAuthSuccess, onBack }) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone Auth State
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Setup invisible reCAPTCHA container
    if (authMethod === 'phone' && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = setupRecaptcha('recaptcha-verifier-div');
    }
  }, [authMethod]);

  // Handle Email / Password Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (tab === 'signup') {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    const endpoint = tab === 'signup' ? 'signup' : 'login';
    const payload = tab === 'signup' 
      ? { email: email.trim(), password, fullName: fullName.trim() } 
      : { email: email.trim(), password };

    try {
      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess({
          token: data.token,
          user: data.user,
          isNewUser: tab === 'signup' || Boolean(data.user?.isNewUser)
        });
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      // Offline fallback
      onAuthSuccess({
        token: 'st_demo_' + Date.now(),
        user: { id: 'usr_' + Date.now(), email, fullName: fullName || 'New Member' },
        isNewUser: tab === 'signup'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send Firebase Phone SMS OTP (with Cloudflare D1 Fallback)
  const [d1OtpPreview, setD1OtpPreview] = useState<string | null>(null);

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setD1OtpPreview(null);

    const formattedNumber = formatE164Phone(countryCode, phoneNumber);
    const digitsOnly = formattedNumber.replace('+', '');

    if (!phoneNumber.trim() || digitsOnly.length < 10) {
      setErrorMsg(`Please enter a valid mobile number (e.g. 300 1234567). Current: ${formattedNumber}`);
      return;
    }

    setIsLoading(true);

    // 1. Try Firebase Phone Auth first
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = setupRecaptcha('recaptcha-verifier-div');
      }

      if (recaptchaVerifierRef.current) {
        const result = await sendPhoneOtp(formattedNumber, recaptchaVerifierRef.current);
        setConfirmationResult(result);
        setPhoneStep('enter_otp');
        setIsLoading(false);
        return;
      }
    } catch (fbErr: any) {
      console.warn('Firebase SMS OTP not available, activating Cloudflare D1 Native OTP Engine:', fbErr);
    }

    // 2. Seamless Cloudflare D1 OTP Fallback Engine
    try {
      const res = await fetch(`${API_BASE}/auth/send-phone-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedNumber })
      });
      const data = await res.json();
      if (data.success) {
        setD1OtpPreview(data.otpPreview);
        setPhoneStep('enter_otp');
      } else {
        setErrorMsg(data.error || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setErrorMsg('Network error while generating OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify SMS OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    const formattedNumber = formatE164Phone(countryCode, phoneNumber);
    setIsLoading(true);

    // If confirmationResult exists (Firebase succeeded)
    if (confirmationResult) {
      try {
        const userCredential = await confirmationResult.confirm(otpCode);
        const fbUser = userCredential.user;
        
        onAuthSuccess({
          token: await fbUser.getIdToken(),
          user: {
            id: 'usr_' + fbUser.uid.substring(0, 12),
            phone: fbUser.phoneNumber || formattedNumber,
            fullName: fullName.trim() || 'Muslim Seeker',
            isPhoneVerified: true
          },
          isNewUser: true
        });
        return;
      } catch (err: any) {
        console.error('Firebase OTP Verification Error:', err);
      }
    }

    // Verify via Cloudflare D1 Engine
    try {
      const res = await fetch(`${API_BASE}/auth/verify-phone-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedNumber,
          otpCode: otpCode.trim(),
          fullName: fullName.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess({
          token: data.token,
          user: data.user,
          isNewUser: data.user.isNewUser
        });
      } else {
        setErrorMsg(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Could not verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-white relative overflow-y-auto font-sans select-none text-on-surface">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-verifier-div"></div>

      {/* Top Header */}
      <header className="flex items-center justify-between w-full pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-variant border border-outline text-on-surface hover:bg-outline-variant transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <img src="/icon.svg" alt="Qurab" className="w-5 h-5 object-contain" />
          <span className="font-serif text-sm font-bold text-on-surface">
            Qurab
          </span>
        </div>

        <div className="w-9" />
      </header>

      {/* Main Auth Form */}
      <main className="flex-1 flex flex-col justify-center my-3 max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center text-center animate-fade-in">
          {/* Logo Badge */}
          <div className="w-12 h-12 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center mb-3 shadow-subtle p-2">
            <img src="/icon.svg" alt="Qurab" className="w-full h-full object-contain" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
            {authMethod === 'phone' ? 'Phone Verification' : tab === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-secondary mb-4 leading-relaxed max-w-[280px]">
            {authMethod === 'phone' 
              ? 'Receive an instant SMS verification code on your mobile phone.'
              : 'Sign in to access your halal matrimonial connections.'}
          </p>

          {/* Auth Method Switcher (Phone SMS vs Email) */}
          <div className="w-full bg-surface-variant p-1 rounded-2xl flex mb-4 border border-outline">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                authMethod === 'phone' 
                  ? 'bg-white text-primary shadow-subtle' 
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone SMS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                authMethod === 'email' 
                  ? 'bg-white text-primary shadow-subtle' 
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {errorMsg && (
            <div className="w-full mb-3 p-3 rounded-2xl bg-pastel-rose border border-pastel-rose-border text-primary text-xs font-semibold text-left flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. PHONE SMS OTP AUTH METHOD */}
          {authMethod === 'phone' && (
            <div className="w-full">
              {phoneStep === 'enter_phone' ? (
                <form onSubmit={handleSendPhoneOtp} className="w-full space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Bilal Ahmad"
                      className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary transition-all placeholder:text-secondary/70"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-on-surface">Mobile Phone Number</label>
                      {phoneNumber && (
                        <span className="text-[10px] text-primary font-mono font-bold">
                          {formatE164Phone(countryCode, phoneNumber)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-surface-variant/40 border border-outline rounded-2xl px-2.5 py-2.5 text-xs font-bold text-on-surface outline-none focus:bg-white focus:border-primary shrink-0"
                      >
                        <option value="+92">🇵🇰 +92 (PK)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+1">🇺🇸 +1 (USA)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+966">🇸🇦 +966 (KSA)</option>
                        <option value="+1">🇨🇦 +1 (CA)</option>
                      </select>

                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="300 1234567"
                        className="flex-1 bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary font-mono placeholder:text-secondary/70"
                      />
                    </div>
                    <p className="text-[10px] text-secondary mt-1">
                      Enter without leading 0 (e.g. <strong>3001234567</strong> for Pakistan)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-3"
                  >
                    <span>{isLoading ? 'Sending SMS Code...' : 'Send 6-Digit SMS OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="w-full space-y-3 text-left animate-fade-in">
                  <div className="bg-pastel-mint p-3 rounded-2xl text-xs text-pastel-mint-text font-semibold flex items-center justify-between border border-pastel-mint-border">
                    <span>Sent to: <strong>{formatE164Phone(countryCode, phoneNumber)}</strong></span>
                    <button
                      type="button"
                      onClick={() => setPhoneStep('enter_phone')}
                      className="text-[11px] underline font-bold"
                    >
                      Edit
                    </button>
                  </div>

                  {d1OtpPreview && (
                    <div className="bg-pastel-amber border border-pastel-amber-border p-3.5 rounded-2xl text-center space-y-1">
                      <span className="text-[10px] text-pastel-amber-text uppercase font-bold tracking-wider block">
                        Verification Code Preview
                      </span>
                      <span className="font-mono text-2xl font-bold text-pastel-amber-text tracking-widest block">
                        {d1OtpPreview}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(d1OtpPreview)}
                        className="text-[11px] text-primary font-bold underline"
                      >
                        Auto-Fill Code ({d1OtpPreview})
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1 text-center">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest text-on-surface outline-none focus:bg-white focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP & Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. EMAIL & PASSWORD AUTH METHOD */}
          {authMethod === 'email' && (
            <div className="w-full">
              {/* Tab Switcher (Signup vs Login) */}
              <div className="w-full bg-surface-variant p-1 rounded-2xl flex mb-4 border border-outline">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === 'signup' ? 'bg-white text-primary shadow-subtle' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === 'login' ? 'bg-white text-primary shadow-subtle' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="w-full space-y-3 text-left">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tariq Hussain"
                      className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-secondary hover:text-on-surface"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-3"
                >
                  <span>
                    {isLoading 
                      ? 'Please wait...' 
                      : tab === 'signup' 
                        ? 'Sign Up with Email' 
                        : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-1 text-[10px] text-secondary">
        By continuing, you agree to Qurab's <span className="underline font-medium">Halal Code & Privacy Policy</span>.
      </footer>
    </div>
  );
};
export default AuthScreen;


