import React, { useMemo, useState } from 'react';
import { BookOpen, Download, ExternalLink, FileText, Search } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

const ACADEMIC_CATEGORIES = [
  'সকল',
  'পাঠ্যক্রম',
  'দৈনিক রুটিন',
  'সাপ্তাহিক রুটিন',
  'পরীক্ষার সময়সূচি',
  'শিক্ষাবর্ষ',
  'ছুটির তালিকা',
  'পাঠদান কার্যক্রম',
  'সহশিক্ষা কার্যক্রম',
];

export function AcademicsPage() {
  const { academics, settings } = useSchool();
  const [category, setCategory] = useState('সকল');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return academics
      .filter((a) => a.isActive)
      .filter((a) => (category === 'সকল' ? true : a.category === category))
      .filter((a) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.className || '').toLowerCase().includes(q)
        );
      });
  }, [academics, category, search]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            একাডেমিক পোর্টাল · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">একাডেমিক কার্যক্রম</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            শ্রেণিভিত্তিক পাঠ্যক্রম, দৈনিক ও সাপ্তাহিক ক্লাস রুটিন, পরীক্ষার সময়সূচি, শিক্ষাবর্ষ, ছুটির তালিকা ও সহশিক্ষা কার্যক্রম।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {ACADEMIC_CATEGORIES.map((cat) => (
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
              placeholder="শিরোনাম বা শ্রেণি লিখুন..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="font-display font-bold text-lg text-slate-800">
              এই বিভাগে কোনো একাডেমিক তথ্য পাওয়া যায়নি
            </h2>
            <p className="text-sm text-slate-500">
              অ্যাডমিন প্যানেলের "একাডেমিক ব্যবস্থাপনা" থেকে নতুন রুটিন বা নথি যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="text-xs font-medium text-emerald-700">
                    {item.category}
                    {item.className ? ` · ${item.className}` : ''}
                    {item.academicYear ? ` · ${item.academicYear}` : ''}
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {item.fileUrl ? (
                  <div className="pt-3 border-t border-slate-100">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={item.fileType === 'pdf' || item.fileType === 'doc' ? item.title : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-900 text-blue-900 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {item.fileType === 'link' ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>নথি দেখুন / ডাউনলোড</span>
                    </a>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>সংযুক্ত ফাইল এখনো আপলোড করা হয়নি</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
