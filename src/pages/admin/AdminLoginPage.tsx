import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { ArrowLeft, KeyRound, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { auth } from '../../firebase';
import { useSchool } from '../../context/SchoolContext';

export function AdminLoginPage() {
  const { user, authReady, isAdmin, settings } = useSchool();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'google' | 'credentials'>('google');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authReady && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authReady, isAdmin, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('popup-closed')) {
        setError('লগইন পপআপটি বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } else {
        setError('Google লগইনে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('অনুগ্রহ করে ইমেইল/ইউজারনেম এবং পাসওয়ার্ড দিন।');
      return;
    }
    if (!identifier.includes('@')) {
      setError(
        'নিরাপত্তার স্বার্থে Firebase Auth-এ সরাসরি আপনার নিবন্ধিত অ্যাডমিন ইমেইল ব্যবহার করুন অথবা Google দিয়ে লগইন করুন।'
      );
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, identifier.trim(), password);
    } catch {
      setError(
        'লগইন ব্যর্থ হয়েছে। ইমেইল/পাসওয়ার্ড যাচাই করুন অথবা Google Sign-In ব্যবহার করুন (Firebase Console থেকে Email/Password চালু থাকলে এটি কাজ করবে)।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-900 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" /> ওয়েবসাইটে ফিরে যান
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-display font-bold text-2xl text-blue-950">অ্যাডমিন প্যানেল লগইন</h1>
            <p className="text-xs text-slate-500">{settings.schoolName}</p>
          </div>

          {user && !isAdmin && authReady && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
              <p className="font-semibold">
                আপনি বর্তমানে ({user.email}) হিসেবে লগইন আছেন, তবে এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই।
              </p>
              <p>
                অনুগ্রহ করে প্রধান অ্যাডমিন ইমেইল দিয়ে সাইন-ইন করুন অথবা বর্তমান সেশন থেকে লগআউট করুন।
              </p>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="px-3 py-1.5 bg-amber-700 text-white font-semibold rounded-lg"
              >
                লগআউট করুন
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('google')}
              className={`py-2 rounded-md transition-colors ${
                mode === 'google' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Google দিয়ে লগইন
            </button>
            <button
              type="button"
              onClick={() => setMode('credentials')}
              className={`py-2 rounded-md transition-colors ${
                mode === 'credentials' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ইমেইল ও পাসওয়ার্ড
            </button>
          </div>

          {mode === 'google' ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'যাচাই করা হচ্ছে...' : 'Google অ্যাকাউন্ট দিয়ে প্রবেশ করুন'}</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                সুপার অ্যাডমিন ইউজারনেম: <span className="font-semibold text-slate-700">shoyaib</span> ·
                Firebase Authentication দ্বারা সুরক্ষিত। কোনো প্লেইন-টেক্সট পাসওয়ার্ড সংরক্ষণ করা হয় না।
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  অ্যাডমিন ইমেইল
                </label>
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'প্রবেশ করছে...' : 'লগইন করুন'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
