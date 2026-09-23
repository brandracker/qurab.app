import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE } from '../../services/dbService';

interface Props {
  onLoginSuccess: (token: string, admin: any) => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both administrative username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('qurb_admin_token', data.token);
        sessionStorage.setItem('qurb_admin_profile', JSON.stringify(data.admin));
        onLoginSuccess(data.token, data.admin);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Unable to connect to administrative gateway. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090D16] p-4 text-white relative overflow-hidden font-sans">
      {/* Brand Ambiance Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[520px] h-[520px] bg-[#FF2560]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-[#D8134B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/90">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF2560] to-[#FF4D7D] p-0.5 shadow-xl shadow-[#FF2560]/30 mb-4">
            <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#FF2560]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">Qurb Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Pure Halal Matrimony Operations</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FF2560]/10 border border-[#FF2560]/30 flex items-start space-x-3 text-rose-200 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FF2560]" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3 bg-[#162038] border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF2560]/50 focus:border-[#FF2560] transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-11 pr-11 py-3 bg-[#162038] border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF2560]/50 focus:border-[#FF2560] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF2560] to-[#D8134B] hover:from-[#FF4D7D] hover:to-[#FF2560] text-white font-semibold rounded-xl shadow-lg shadow-[#FF2560]/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Access Administration</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          Strict Zero-Access Perimeter • All Access Audited
        </div>
      </div>
    </div>
  );
};
