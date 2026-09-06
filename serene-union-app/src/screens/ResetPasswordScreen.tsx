import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { verifyResetCode, confirmNewPassword } from '../services/firebase';

interface Props {
  oobCode: string;
  onComplete: () => void;
}

export const ResetPasswordScreen: React.FC<Props> = ({ oobCode, onComplete }) => {
  const [verifying, setVerifying] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  // Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Verify code on initial render
  useEffect(() => {
    let isMounted = true;
    const checkCode = async () => {
      if (!oobCode) {
        setValidationError('No reset verification code was found in the link.');
        setVerifying(false);
        return;
      }

      try {
        const email = await verifyResetCode(oobCode);
        if (isMounted) {
          setVerifiedEmail(email);
          setVerifying(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Code verification error:', err);
          if (err.code === 'auth/expired-action-code') {
            setValidationError('This password reset link has expired. Please request a new one.');
          } else if (err.code === 'auth/invalid-action-code') {
            setValidationError('This link is invalid or has already been used. Please request a new link.');
          } else {
            setValidationError('Unable to verify reset link. Please request a new one.');
          }
          setVerifying(false);
        }
      }
    };

    checkCode();
    return () => {
      isMounted = false;
    };
  }, [oobCode]);

  // 2. Handle Password Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmNewPassword(oobCode, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use a stronger combination.');
      } else if (err.code === 'auth/expired-action-code') {
        setErrorMsg('This reset link has expired. Please request a new one.');
      } else {
        setErrorMsg(err.message || 'Could not update password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-white relative overflow-y-auto font-sans select-none text-on-surface">
      {/* Top Header */}
      <header className="flex items-center justify-between w-full pt-1">
        <button
          type="button"
          onClick={onComplete}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-variant border border-outline text-on-surface hover:bg-outline-variant transition-colors"
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

      {/* Main Content Card */}
      <main className="flex-1 flex flex-col justify-center my-3 max-w-sm mx-auto w-full">
        {verifying ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <h2 className="font-serif text-lg font-bold text-on-surface mb-1">Verifying Reset Link</h2>
            <p className="text-xs text-secondary">Securing your session with Qurb...</p>
          </div>
        ) : validationError ? (
          <div className="flex flex-col items-center text-center animate-fade-in py-6">
            <div className="w-12 h-12 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-on-surface mb-1.5">Link Expired or Invalid</h2>
            <p className="text-xs text-secondary mb-6 leading-relaxed max-w-[280px]">
              {validationError}
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center text-center animate-fade-in py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3 shadow-subtle">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">Password Updated!</h2>
            <p className="text-xs text-secondary mb-6 leading-relaxed max-w-[280px]">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-fade-in">
            {/* Header Icon */}
            <div className="w-12 h-12 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center mb-3 shadow-subtle">
              <Lock className="w-5 h-5 text-primary" />
            </div>

            <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
              Reset Your Password
            </h1>
            <p className="text-xs text-secondary mb-1">
              Enter a new secure password for
            </p>
            <p className="text-xs font-bold text-primary mb-4 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              {verifiedEmail}
            </p>

            {errorMsg && (
              <div className="w-full mb-3 p-3 rounded-2xl bg-pastel-rose border border-pastel-rose-border text-primary text-xs font-semibold text-left flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
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

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  className="w-full bg-surface-variant/40 border border-outline rounded-2xl px-4 py-2.5 text-xs text-on-surface outline-none focus:bg-white focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>{isSubmitting ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-1 text-[10px] text-secondary">
        Secured by Qurb Halal Matrimony Authentication
      </footer>
    </div>
  );
};

export default ResetPasswordScreen;
