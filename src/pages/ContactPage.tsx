import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { submitContactMessage } from '../services/firestoreService';

export function ContactPage() {
  const { settings } = useSchool();
  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!senderName.trim() || !subject.trim() || !message.trim()) {
      setError('অনুগ্রহ করে আপনার নাম, বিষয় এবং বার্তা পূরণ করুন।');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({ senderName, phone, email, subject, message });
      setSubmitted(true);
      setSenderName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setError('বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            যোগাযোগ ও পরামর্শ · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">যোগাযোগ করুন</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            বিদ্যালয় সংক্রান্ত যেকোনো তথ্য, ভর্তি বা অভিভাবক মতামতের জন্য সরাসরি বার্তা পাঠান।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* School Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-blue-950">
              {settings.schoolName}
            </h2>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">ঠিকানা</div>
                  <div className="font-medium">{settings.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">মোবাইল নম্বর</div>
                  <div className="font-medium">{settings.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">ইমেইল</div>
                  <div className="font-medium">{settings.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden h-72">
            {settings.mapEmbedUrl ? (
              <iframe
                title="বিদ্যালয়ের অবস্থান মানচিত্র"
                src={settings.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 p-6 text-center">
                মাদারগঞ্জ, জামালপুর — গুগল ম্যাপ অ্যাডমিন থেকে যুক্ত করুন।
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-blue-950">বার্তা পাঠান</h2>
              <p className="text-sm text-slate-500 mt-1">
                আপনার পাঠানো বার্তা সরাসরি বিদ্যালয়ের অ্যাডমিন ড্যাশবোর্ডে সংরক্ষিত হবে।
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-950 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">আপনার বার্তা সফলভাবে পাঠানো হয়েছে!</p>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    বিদ্যালয় কর্তৃপক্ষ শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="পূর্ণ নাম লিখুন"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    বিষয় *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="যেমন: ভর্তি সংক্রান্ত তথ্য"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  বিস্তারিত বার্তা *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
