import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Lock,
  LogIn,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { auth } from '../../firebase';
import { useSchool } from '../../context/SchoolContext';

const DEFAULT_ADMIN_USERNAME = 'shoyaib';
const DEFAULT_ADMIN_EMAIL = 'sheakhsohel307@gmail.com';

export function AdminLoginPage() {
  const { user, authReady, isAdmin, settings, refreshAuthSession } = useSchool();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'credentials' | 'google'>('credentials');
  const [credentialAction, setCredentialAction] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState(DEFAULT_ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showOpenNewTabHint, setShowOpenNewTabHint] = useState(false);

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
    setShowOpenNewTabHint(false);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      const rawMsg = err instanceof Error ? err.message : '';
      const host = typeof window !== 'undefined' ? window.location.hostname : '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setShowOpenNewTabHint(true);
        setError(
          `Google লগইন পপআপটি বন্ধ হয়ে গেছে (${code})। প্রিভিউ আইফ্রেমের ভেতরে সমস্যা হলে নিচের লিংক থেকে নতুন ট্যাবে খুলে লগইন করুন।`
        );
      } else if (code === 'auth/popup-blocked') {
        setShowOpenNewTabHint(true);
        setError(
          'ব্রাউজার বা প্রিভিউ আইফ্রেম Google লগইন পপআপটি ব্লক করেছে (auth/popup-blocked)। ব্রাউজারে Pop-ups অনুমতি দিন অথবা নিচের লিংক থেকে নতুন ট্যাবে ওয়েবসাইটটি খুলে লগইন করুন।'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setShowOpenNewTabHint(true);
        setError(
          `বর্তমান ডোমেইনটি (${host}) Firebase-এ অনুমোদিত নয় (auth/unauthorized-domain)। Firebase Console → Authentication → Settings → Authorized domains-এ "${host}" যোগ করুন।`
        );
      } else if (code === 'auth/operation-not-allowed') {
        setError(
          'Firebase Console-এ Google Sign-In প্রোভাইডার চালু নেই (auth/operation-not-allowed)। Firebase Console → Authentication → Sign-in method → Add new provider থেকে Google সক্রিয় করে Save করুন।'
        );
      } else if (code === 'auth/network-request-failed') {
        setShowOpenNewTabHint(true);
        setError(
          'নেটওয়ার্ক বা ব্রাউজার এক্সটেনশনের কারণে Google সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে (auth/network-request-failed)। অনুগ্রহ করে ইন্টারনেট সংযোগ বা অ্যাড-ব্লকার পরীক্ষা করুন।'
        );
      } else {
        setShowOpenNewTabHint(true);
        setError(
          `Google লগইন ত্রুটি (${code || 'unknown'}): ${rawMsg || 'অনুগ্রহ করে নতুন ট্যাবে খুলে আবার চেষ্টা করুন।'}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const resolvedEmail = resolveLoginEmail(identifier);
    if (!resolvedEmail || !password) {
      setError('অনুগ্রহ করে সঠিক ইউজারনেম (যেমন: shoyaib) বা অ্যাডমিন ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }

    if (credentialAction === 'register' && password.length < 6) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);
    try {
      if (credentialAction === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, resolvedEmail, password);
        try {
          await sendEmailVerification(cred.user);
          setInfoMessage(
            `অ্যাকাউন্ট তৈরি হয়েছে এবং ${resolvedEmail} ঠিকানায় একটি ভেরিফিকেশন ইমেইল পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার থেকে লিংকে ক্লিক করে নিচের "ভেরিফাই করেছি — প্রবেশ করুন" বাটনে চাপ দিন।`
          );
        } catch {
          setInfoMessage(
            `অ্যাকাউন্ট তৈরি হয়েছে। নিরাপত্তা নিশ্চিত করতে নিচের বাটন থেকে ${resolvedEmail}-এ ভেরিফিকেশন ইমেইল পাঠান।`
          );
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, resolvedEmail, password);
        if (!cred.user.emailVerified) {
          setInfoMessage(
            'লগইন সফল হয়েছে, তবে অ্যাডমিন ড্যাশবোর্ডে প্রবেশের জন্য আপনার ইমেইল ভেরিফাই করা প্রয়োজন। নিচের বাটন থেকে ভেরিফিকেশন লিংক পাঠান।'
          );
        }
      }
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setError(
          'Firebase Console-এ Email/Password লগইন এখনো সক্রিয় করা হয়নি (auth/operation-not-allowed)। Authentication → Sign-in method থেকে Email/Password চালু করে Save করুন।'
        );
      } else if (code === 'auth/email-already-in-use') {
        setCredentialAction('login');
        setError(
          'এই ইমেইলে ইতিমধ্যেই একটি অ্যাকাউন্ট রয়েছে (auth/email-already-in-use)। আপনার পাসওয়ার্ড দিয়ে লগইন করুন, অথবা ভুলে গেলে "পাসওয়ার্ড ভুলে গেছেন?" বাটনে ক্লিক করে রিসেট ইমেইল পাঠান।'
        );
      } else if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setError(
          `ইউজারনেম/ইমেইল বা পাসওয়ার্ড মেলেনি (${code})। আপনি যদি এখনো পাসওয়ার্ড অ্যাকাউন্ট তৈরি না করে থাকেন, তবে উপরের "প্রথমবার পাসওয়ার্ড সেট করুন" বাটনে ক্লিক করে নতুন পাসওয়ার্ড তৈরি করুন।`
        );
      } else if (code === 'auth/weak-password') {
        setError('পাসওয়ার্ডটি খুবই দুর্বল (auth/weak-password)। অনুগ্রহ করে কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।');
      } else if (code === 'auth/too-many-requests') {
        setError('অনেকবার ভুল চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে (auth/too-many-requests)। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      } else {
        setError(`লগইনে সমস্যা হয়েছে (${code || 'error'})। অনুগ্রহ করে আবার চেষ্টা করুন।`);
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
        `${resolvedEmail} ঠিকানায় পাসওয়ার্ড রিসেট রিকোয়েস্ট পাঠানো হয়েছে। তবে আগে থেকে অ্যাকাউন্ট তৈরি না থাকলে Firebase কোনো ইমেইল পাঠায় না — সেক্ষেত্রে উপরের "প্রথমবার পাসওয়ার্ড সেট করুন" অপশন ব্যবহার করে অ্যাকাউন্ট তৈরি করুন।`
      );
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      setError(
        `পাসওয়ার্ড রিসেট ইমেইল পাঠানো যায়নি (${code || 'error'})। আগে থেকে পাসওয়ার্ড অ্যাকাউন্ট না থাকলে "প্রথমবার পাসওয়ার্ড সেট করুন" অপশন ব্যবহার করুন।`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setInfoMessage(
        `${user.email} ঠিকানায় ভেরিফিকেশন ইমেইল পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার থেকে লিংকে ক্লিক করে "ভেরিফাই করেছি — প্রবেশ করুন" বাটনে চাপ দিন।`
      );
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      setError(`ভেরিফিকেশন ইমেইল পাঠানো যায়নি (${code || 'error'})। একটু পরে আবার চেষ্টা করুন।`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCheck = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await refreshAuthSession();
      if (!auth.currentUser?.emailVerified) {
        setError('ইমেইল এখনো ভেরিফাই হয়নি। অনুগ্রহ করে ইমেইলের ভেরিফিকেশন লিংকে ক্লিক করার পর এই বাটনে চাপ দিন।');
      }
    } catch {
      setError('সেশন রিফ্রেশ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
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
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-3">
              {!user.emailVerified ? (
                <>
                  <p className="font-semibold">
                    আপনি ({user.email}) দিয়ে লগইন করেছেন, তবে আপনার ইমেইল এখনো ভেরিফাই করা হয়নি।
                  </p>
                  <p className="leading-relaxed">
                    নিরাপত্তার কারণে Firebase নিয়ম অনুযায়ী ইমেইল ভেরিফিকেশন ছাড়া অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করা যায় না।
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white font-semibold rounded-lg disabled:opacity-60"
                    >
                      <MailCheck className="w-3.5 h-3.5" /> ভেরিফিকেশন ইমেইল পাঠান
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyCheck}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফাই করেছি — প্রবেশ করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => signOut(auth)}
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 font-semibold rounded-lg"
                    >
                      লগআউট
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold">
                    আপনি বর্তমানে ({user.email}) হিসেবে লগইন আছেন, তবে এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই।
                  </p>
                  <p>
                    অনুগ্রহ করে প্রধান অ্যাডমিন ইমেইল ({DEFAULT_ADMIN_EMAIL}) দিয়ে সাইন-ইন করুন অথবা বর্তমান সেশন থেকে লগআউট করুন।
                  </p>
                  <button
                    type="button"
                    onClick={() => signOut(auth)}
                    className="px-3 py-1.5 bg-amber-700 text-white font-semibold rounded-lg"
                  >
                    লগআউট করুন
                  </button>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed space-y-2">
              <p>{error}</p>
              {showOpenNewTabHint && typeof window !== 'undefined' && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-blue-900 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> নতুন ব্রাউজার ট্যাবে খুলুন
                </a>
              )}
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
              onClick={() => {
                setMode('credentials');
                setError('');
              }}
              className={`py-2 rounded-md transition-colors ${
                mode === 'credentials' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ইউজারনেম ও পাসওয়ার্ড
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('google');
                setError('');
              }}
              className={`py-2 rounded-md transition-colors ${
                mode === 'google' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Google দিয়ে লগইন
            </button>
          </div>

          {mode === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-blue-50/70 border border-blue-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setCredentialAction('login');
                    setError('');
                    setInfoMessage('');
                  }}
                  className={`py-1.5 px-2 rounded-md transition-colors ${
                    credentialAction === 'login'
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-900 hover:bg-blue-100/70'
                  }`}
                >
                  লগইন করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCredentialAction('register');
                    setError('');
                    setInfoMessage('');
                  }}
                  className={`py-1.5 px-2 rounded-md transition-colors ${
                    credentialAction === 'register'
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 hover:bg-emerald-100/70'
                  }`}
                >
                  প্রথমবার পাসওয়ার্ড সেট করুন
                </button>
              </div>
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
                <p className="text-[11px] text-slate-500">
                  ডিফল্ট অ্যাডমিন ইউজারনেম: <span className="font-semibold text-slate-700">shoyaib</span> ({DEFAULT_ADMIN_EMAIL})
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    {credentialAction === 'register' ? 'নতুন পাসওয়ার্ড সেট করুন (কমপক্ষে ৬ অক্ষর)' : 'পাসওয়ার্ড'}
                  </label>
                  {credentialAction === 'login' && (
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="text-[11px] font-medium text-blue-900 hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      credentialAction === 'register'
                        ? 'আপনার পছন্দের নতুন পাসওয়ার্ড দিন'
                        : 'আপনার পাসওয়ার্ড দিন'
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {credentialAction === 'register' ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>
                  {loading
                    ? 'অপেক্ষা করুন...'
                    : credentialAction === 'register'
                      ? 'পাসওয়ার্ড অ্যাকাউন্ট তৈরি করুন'
                      : 'লগইন করুন'}
                </span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCredentialAction(credentialAction === 'login' ? 'register' : 'login');
                    setError('');
                    setInfoMessage('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {credentialAction === 'login'
                    ? 'প্রথমবার? ইউজারনেম (shoyaib) এর জন্য নতুন পাসওয়ার্ড অ্যাকাউন্ট তৈরি করুন'
                    : 'ইতিমধ্যেই অ্যাকাউন্ট আছে? সরাসরি লগইন করুন'}
                </button>
              </div>

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
                অনুমোদিত ইমেইল: <span className="font-semibold text-slate-700">{DEFAULT_ADMIN_EMAIL}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
