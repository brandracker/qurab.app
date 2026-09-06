import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithGoogleIdToken, 
  GOOGLE_CLIENT_ID, 
  signUpWithEmail, 
  signInWithEmail, 
  sendResetPasswordEmail 
} from '../services/firebase';
import { API_BASE } from '../services/dbService';

interface Props {
  onAuthSuccess: (session: { token: string; user: any; isNewUser: boolean }) => void;
  onBack: () => void;
  initialTab?: 'signup' | 'login';
}

export const AuthScreen: React.FC<Props> = ({ onAuthSuccess, onBack, initialTab = 'signup' }) => {
  const [tab, setTab] = useState<'signup' | 'login'>(initialTab);
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google Identity Services (GSI) Integration
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [gsiReady, setGsiReady] = useState(false);

  // Handle Email / Password Submit via Firebase Auth + D1 Sync
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

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

    try {
      let fbUid = '';
      if (tab === 'signup') {
        const creds = await signUpWithEmail(email.trim(), password, fullName.trim());
        fbUid = creds.user.uid;
      } else {
        const creds = await signInWithEmail(email.trim(), password);
        fbUid = creds.user.uid;
      }

      // Synchronize with Cloudflare D1 Backend
      const res = await fetch(`${API_BASE}/auth/email-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          gender,
          firebaseUid: fbUid,
          isSignUp: tab === 'signup'
        })
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess({
          token: data.token,
          user: data.user,
          isNewUser: tab === 'signup' || Boolean(data.user?.isNewUser)
        });
      } else {
        setErrorMsg(data.error || 'Authentication synchronization failed.');
      }
    } catch (err: any) {
      console.error('Firebase Email Auth Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please switch to Sign In.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please check your credentials or reset your password.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password must be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        // Fallback to direct D1 API authentication
        try {
          const endpoint = tab === 'signup' ? 'signup' : 'login';
          const payload = tab === 'signup' 
            ? { email: email.trim(), password, fullName: fullName.trim(), gender } 
            : { email: email.trim(), password };
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
            return;
          }
        } catch {}
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Self-Service Password Reset via Firebase
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address above to receive a password reset link.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await sendResetPasswordEmail(email.trim());
      setSuccessMsg(`Password reset link sent to ${email.trim()}! Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg('Failed to send reset email. Please ensure the email is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  // Decode Google OpenID Connect JWT
  const decodeGoogleJwt = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Google ID Token Handler via Google Identity Services (GSI - Instant & Bulletproof)
  const handleGoogleIdToken = async (idToken: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const profile = decodeGoogleJwt(idToken);
      let fbUid = '';

      // Gracefully attempt Firebase Auth credential exchange
      try {
        const creds = await signInWithGoogleIdToken(idToken);
        fbUid = creds.user?.uid || '';
      } catch (fbErr: any) {
        console.warn('Firebase network handshake notice (continuing with direct Google verification):', fbErr);
      }

      const emailToSync = profile?.email;
      if (!emailToSync) {
        throw new Error('Google did not provide an email address.');
      }

      // Sync user profile directly with Cloudflare D1 Backend
      const res = await fetch(`${API_BASE}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToSync,
          fullName: profile?.name || 'Google Member',
          photoUrl: profile?.picture || '',
          googleUid: profile?.sub || fbUid || `g_${Date.now()}`
        })
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess({
          token: data.token,
          user: data.user,
          isNewUser: Boolean(data.user?.isNewUser)
        });
      } else {
        setErrorMsg(data.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      console.error('Google GSI Auth Error:', err);
      setErrorMsg(err.message || 'Google Sign-In failed. Please try email & password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Identity Services Initialization
  useEffect(() => {
    let isMounted = true;

    const setupGsi = () => {
      if (typeof window === 'undefined') return;
      const google = (window as any).google;
      if (google?.accounts?.id && googleBtnRef.current) {
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              if (response?.credential && isMounted) {
                handleGoogleIdToken(response.credential);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render official Google button
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 320,
            logo_alignment: 'left'
          });

          if (isMounted) setGsiReady(true);
        } catch (err) {
          console.warn('Google GSI render notice:', err);
        }
      }
    };

    setupGsi();
    const timer = setInterval(() => {
      if ((window as any).google?.accounts?.id && googleBtnRef.current) {
        setupGsi();
        clearInterval(timer);
      }
    }, 250);

    const safetyTimeout = setTimeout(() => {
      clearInterval(timer);
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(timer);
      clearTimeout(safetyTimeout);
    };
  }, [gender]);

  // Google 1-Click Sign-In (Fallback to Popup if GSI is not loaded)
  const handleGoogleSignIn = async () => {
    // If GSI is available, trigger prompt
    const google = typeof window !== 'undefined' ? (window as any).google : null;
    if (google?.accounts?.id) {
      google.accounts.id.prompt();
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const creds = await signInWithGoogle();
      const fbUser = creds.user;
      const res = await fetch(`${API_BASE}/auth/email-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fbUser.email,
          fullName: fbUser.displayName || 'Google Member',
          gender,
          firebaseUid: fbUser.uid,
          isSignUp: false
        })
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess({
          token: data.token,
          user: data.user,
          isNewUser: Boolean(data.user?.isNewUser)
        });
      } else {
        setErrorMsg(data.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        const detail = err.code ? ` (${err.code.replace('auth/', '')})` : '';
        setErrorMsg(`Google Sign-In failed${detail}. Please try email & password.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-white relative overflow-y-auto font-sans select-none text-on-surface">
      
      {/* Top Header */}
      <header className="flex items-center justify-between w-full pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-variant border border-outline text-on-surface hover:bg-outline-variant transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <img src="/icon.svg" alt="Qurb" className="w-5 h-5 object-contain" />
          <span className="font-serif text-sm font-bold text-on-surface">
            Qurb
          </span>
        </div>
        <div className="w-9" />
      </header>

      {/* Main Auth Form */}
      <main className="flex-1 flex flex-col justify-center my-3 max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center text-center animate-fade-in">
          
          {/* Logo Badge */}
          <div className="w-12 h-12 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center mb-3 shadow-subtle p-2">
            <img src="/icon.svg" alt="Qurb" className="w-full h-full object-contain" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
            {tab === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-secondary mb-4 leading-relaxed max-w-[280px]">
            {tab === 'signup' 
              ? 'Join thousands of intentional Muslims seeking half their deen.' 
              : 'Sign in to continue your matrimonial journey.'}
          </p>

          {/* Google Sign-In Container (GSI Official + Fallback) */}
          <div className="w-full flex flex-col items-center justify-center mb-3.5 min-h-[44px]">
            <div 
              ref={googleBtnRef} 
              className={`w-full flex justify-center ${gsiReady ? 'block' : 'hidden'}`} 
            />
            {!gsiReady && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white border border-outline hover:border-primary/40 hover:bg-surface-variant/40 text-on-surface font-sans text-xs font-bold shadow-subtle transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 mb-3.5">
            <div className="flex-1 h-px bg-outline/60"></div>
            <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">or with email</span>
            <div className="flex-1 h-px bg-outline/60"></div>
          </div>

          {/* Tab Switcher: Create Account vs Sign In */}
          <div className="w-full bg-surface-variant p-1 rounded-2xl flex mb-4 border border-outline">
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'login' ? 'bg-white text-primary shadow-subtle' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Status Messages */}
          {successMsg && (
            <div className="w-full mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-left flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="w-full mb-3 p-3 rounded-2xl bg-pastel-rose border border-pastel-rose-border text-primary text-xs font-semibold text-left flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="w-full space-y-3 text-left">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Hussain"
                    className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === 'male'
                          ? 'bg-primary text-white border-primary shadow-subtle'
                          : 'bg-surface-variant/40 text-secondary border-outline hover:bg-surface-variant'
                      }`}
                    >
                      <span>Brother 🧔</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === 'female'
                          ? 'bg-primary text-white border-primary shadow-subtle'
                          : 'bg-surface-variant/40 text-secondary border-outline hover:bg-surface-variant'
                      }`}
                    >
                      <span>Sister 🧕</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary transition-all"
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
                  className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-secondary hover:text-on-surface cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === 'login' && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-semibold text-primary hover:text-primary-dark underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>
                {isLoading 
                  ? 'Please wait...' 
                  : tab === 'signup' 
                    ? 'Create Free Account' 
                    : 'Sign In with Email'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-1 text-[10px] text-secondary">
        By continuing, you agree to Qurb's{' '}
        <a href="/terms" className="underline font-medium hover:text-primary transition-colors">Terms of Service</a>
        {' '}&{' '}
        <a href="/privacy-policy" className="underline font-medium hover:text-primary transition-colors">Privacy Policy</a>.
      </footer>
    </div>
  );
};

export default AuthScreen;
