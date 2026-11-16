import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Download, FileText, Search } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SafeImage } from '../components/SafeImage';

const NOTICE_CATEGORIES = [
  'সকল নোটিশ',
  'সাধারণ নোটিশ',
  'ভর্তি বিজ্ঞপ্তি',
  'পরীক্ষার নোটিশ',
  'ছুটির নোটিশ',
  'অভিভাবক সভা',
  'জরুরি নোটিশ',
];

export function NoticesPage() {
  const { notices, settings } = useSchool();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState('সকল নোটিশ');
  const [search, setSearch] = useState('');

  const activeNotices = useMemo(() => notices.filter((n) => n.isActive), [notices]);

  const filtered = useMemo(() => {
    return activeNotices
      .filter((n) => (category === 'সকল নোটিশ' ? true : n.category === category))
      .filter((n) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
        );
      });
  }, [activeNotices, category, search]);

  if (id) {
    const notice = activeNotices.find((n) => n.id === id);
    if (!notice) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Bell className="w-10 h-10 text-slate-400" />
          <h1 className="font-display font-bold text-2xl text-slate-900">নোটিশটি পাওয়া যায়নি</h1>
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> নোটিশ বোর্ডে ফিরে যান
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" /> সকল নোটিশ দেখুন
          </Link>

          <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="space-y-3 border-b border-slate-200 pb-5">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">{notice.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Calendar className="w-3.5 h-3.5" /> প্রকাশ: {notice.publishDate}
                </span>
                {notice.isNew && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-400 text-blue-950 rounded">
                    NEW
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-blue-950 leading-snug">
                {notice.title}
              </h1>
            </div>

            <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
              {notice.description}
            </div>

            {notice.attachmentUrl && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                {notice.attachmentType === 'image' && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-[540px]">
                    <SafeImage
                      src={notice.attachmentUrl}
                      alt={notice.title}
                      className="w-full h-auto object-contain bg-slate-100"
                    />
                  </div>
                )}
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={notice.title}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>সংযুক্ত ফাইল ডাউনলোড / দেখুন</span>
                </a>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            দাপ্তরিক বিজ্ঞপ্তি · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">নোটিশ বোর্ড</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            বিদ্যালয়ের সকল সাধারণ, ভর্তি, পরীক্ষা, ছুটি ও অভিভাবক সভা সংক্রান্ত সর্বশেষ বিজ্ঞপ্তি।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {NOTICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নোটিশ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="font-display font-bold text-lg text-slate-800">কোনো নোটিশ পাওয়া যায়নি</h2>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-xl overflow-hidden">
            {filtered.map((notice) => (
              <Link
                key={notice.id}
                to={`/notices/${notice.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-blue-50/40 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-700">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{notice.publishDate}</span>
                    {notice.isNew && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-blue-950 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900 leading-snug">
                    {notice.title}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-1">{notice.description}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 whitespace-nowrap shrink-0">
                  <FileText className="w-4 h-4" /> বিস্তারিত দেখুন
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
