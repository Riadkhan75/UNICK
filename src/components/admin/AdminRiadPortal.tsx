import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import {
  verifyAdminCredentials,
  setSessionAuthenticated,
  isSessionAuthenticated,
  clearAdminSession,
} from '../../utils/adminAuth';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const AdminRiadPortal: React.FC = () => {
  const {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    setView,
    setAdminTab,
    showToast,
    settings,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if session is already active
  const isAuth = isAdminLoggedIn || isSessionAuthenticated();

  // If already authenticated via session, render the Admin Layout
  if (isAuth) {
    return <AdminLayout />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setHasError(true);
      setErrorMessage('অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড পূরণ করুন');
      return;
    }

    setIsVerifying(true);
    setHasError(false);

    try {
      const isValid = await verifyAdminCredentials(email.trim(), password.trim());

      if (isValid) {
        setSessionAuthenticated();
        setIsAdminLoggedIn(true);
        setAdminTab('dashboard');
        showToast('অ্যাডমিন প্যানেলে স্বাগতম!');
      } else {
        setHasError(true);
        setErrorMessage('অ্যাক্সেস ডিনাইড! ভুল ইমেইল বা পাসওয়ার্ড।');
        showToast('অ্যাক্সেস ডিনাইড! সঠিক তথ্য দিন।');
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage('যাচাইকরণে ত্রুটি দেখা দিয়েছে');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToHome = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // fallback
    }
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Admin Portal Header Banner */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 text-center shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center mb-3 ring-8 ring-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-amber-200 tracking-tight">
            অ্যাডমিন প্যানেল পোর্টাল (Admin Portal)
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {settings.storeName} স্টোর ম্যানেজমেন্ট ও অর্ডার প্রসেসিংয়ের জন্য লগইন করুন।
          </p>
        </div>

        {/* Secure JavaScript Login Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-2xs font-semibold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>হিডেন সিকিউরিটি পোর্টাল</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {settings.storeName} অ্যাডমিন লগইন
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              প্রবেশ করতে আপনার অ্যাডমিনিস্ট্রেটর ক্রিডেনশিয়াল দিন
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                অ্যাডমিন ইমেইল (Admin Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setHasError(false);
                  }}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl text-white text-xs outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড (Admin Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHasError(false);
                  }}
                  placeholder="••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-blue-500 rounded-xl text-white text-xs outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>সুরক্ষিত লগইন (Verify & Access)</span>
                </>
              )}
            </button>
          </form>

          {/* Return to website */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleBackToHome}
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটের হোমপেজে ফিরে যান</span>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-2xs">
          সুরক্ষিত ক্রিপ্টোগ্রাফিক সেশন ভেরিফিকেশন সিস্টেম সক্রিয়।
        </p>
      </div>
    </div>
  );
};
