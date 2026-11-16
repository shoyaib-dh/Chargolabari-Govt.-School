import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { ArrowLeft, KeyRound, Lock, LogIn, MailCheck, ShieldCheck, User } from 'lucide-react';
import { auth } from '../../firebase';
import { useSchool } from '../../context/SchoolContext';

const DEFAULT_ADMIN_USERNAME = 'shoyaib';
const DEFAULT_ADMIN_EMAIL = 'sheakhsohel307@gmail.com';

export function AdminLoginPage() {
  const { user, authReady, isAdmin, settings } = useSchool();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'credentials' | 'google'>('credentials');
  const [identifier, setIdentifier] = useState(DEFAULT_ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (authReady && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authReady, isAdmin, navigate]);

  const resolveLoginEmail = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (trimmed.toLowerCase() === DEFAULT_ADMIN_USERNAME) {
      return DEFAULT_ADMIN_EMAIL;
    }
    if (trimmed.includes('@')) {
      return trimmed;
    }
    return null;
  };

  const handleGoogleLogin = async () => {
    setError('');
    setInfoMessage('');
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
    setInfoMessage('');

    const resolvedEmail = resolveLoginEmail(identifier);
    if (!resolvedEmail || !password) {
      setError('অনুগ্রহ করে সঠিক ইউজারনেম (যেমন: shoyaib) বা অ্যাডমিন ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, resolvedEmail, password);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setError(
          'Firebase Console-এ Email/Password লগইন এখনো সক্রিয় করা হয়নি। অনুগ্রহ করে Firebase Console → Authentication → Sign-in method থেকে Email/Password চালু করুন, অথবা নিচের Google লগইন ব্যবহার করুন।'
        );
      } else {
        setError(
          'ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। আপনি যদি প্রথমবার পাসওয়ার্ড দিয়ে লগইন করতে চান, তবে নিচের "পাসওয়ার্ড সেট/রিসেট ইমেইল পাঠান" বাটনে ক্লিক করুন অথবা Google দিয়ে প্রবেশ করুন।'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setInfoMessage('');
    const resolvedEmail = resolveLoginEmail(identifier) || DEFAULT_ADMIN_EMAIL;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resolvedEmail);
      setInfoMessage(
        `${resolvedEmail} ঠিকানায় পাসওয়ার্ড সেট/রিসেট লিংক পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার দেখুন।`
      );
    } catch {
      setError(
        'পাসওয়ার্ড সেট/রিসেট ইমেইল পাঠানো যায়নি। অনুগ্রহ করে Firebase Console থেকে Email/Password প্রোভাইডার সক্রিয় আছে কিনা যাচাই করুন বা Google দিয়ে লগইন করুন।'
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

          {infoMessage && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed flex items-start gap-2">
              <MailCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('credentials')}
              className={`py-2 rounded-md transition-colors ${
                mode === 'credentials' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ইউজারনেম ও পাসওয়ার্ড
            </button>
            <button
              type="button"
              onClick={() => setMode('google')}
              className={`py-2 rounded-md transition-colors ${
                mode === 'google' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Google দিয়ে লগইন
            </button>
          </div>

          {mode === 'credentials' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  অ্যাডমিন ইউজারনেম অথবা ইমেইল
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="shoyaib"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">পাসওয়ার্ড</label>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="text-[11px] font-medium text-blue-900 hover:underline"
                  >
                    পাসওয়ার্ড সেট / ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড দিন"
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

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] text-slate-400">
                  <span className="bg-white px-2">অথবা</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-blue-900 text-slate-700 hover:text-blue-900 text-xs font-semibold rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Google অ্যাকাউন্ট দিয়ে দ্রুত প্রবেশ করুন</span>
              </button>
            </form>
          ) : (
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
                Firebase Authentication দ্বারা সুরক্ষিত।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
