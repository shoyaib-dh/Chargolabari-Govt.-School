import React, { useMemo, useState } from 'react';
import { Award, Download, ExternalLink, FileSpreadsheet, FileText } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export function ResultsPage() {
  const { results, settings } = useSchool();
  const [selectedClass, setSelectedClass] = useState('সকল শ্রেণি');
  const [selectedYear, setSelectedYear] = useState('সকল শিক্ষাবর্ষ');
  const [selectedExam, setSelectedExam] = useState('সকল পরীক্ষা');

  const activeResults = useMemo(() => results.filter((r) => r.isActive), [results]);

  const classOptions = useMemo(
    () => ['সকল শ্রেণি', ...Array.from(new Set(activeResults.map((r) => r.className)))],
    [activeResults]
  );
  const yearOptions = useMemo(
    () => ['সকল শিক্ষাবর্ষ', ...Array.from(new Set(activeResults.map((r) => r.academicYear)))],
    [activeResults]
  );
  const examOptions = useMemo(
    () => ['সকল পরীক্ষা', ...Array.from(new Set(activeResults.map((r) => r.examName)))],
    [activeResults]
  );

  const filtered = useMemo(() => {
    return activeResults
      .filter((r) => (selectedClass === 'সকল শ্রেণি' ? true : r.className === selectedClass))
      .filter((r) => (selectedYear === 'সকল শিক্ষাবর্ষ' ? true : r.academicYear === selectedYear))
      .filter((r) => (selectedExam === 'সকল পরীক্ষা' ? true : r.examName === selectedExam));
  }, [activeResults, selectedClass, selectedYear, selectedExam]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            ফলাফল পোর্টাল · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">পরীক্ষার ফলাফল</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            শ্রেণি, শিক্ষাবর্ষ ও পরীক্ষার নাম নির্বাচন করে প্রকাশিত ফলাফলের নথি ডাউনলোড করুন।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">শ্রেণি নির্বাচন</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-900"
            >
              {classOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">শিক্ষাবর্ষ</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-900"
            >
              {yearOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">পরীক্ষার নাম</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-900"
            >
              {examOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table / Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="font-display font-bold text-lg text-slate-800">
              নির্বাচিত ফিল্টারে কোনো ফলাফল পাওয়া যায়নি
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((res) => (
              <article
                key={res.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium text-emerald-700">
                    {res.className} · {res.examName} · শিক্ষাবর্ষ {res.academicYear}
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-900">{res.title}</h2>
                  <p className="text-xs text-slate-500 tabular-nums">
                    প্রকাশের তারিখ: {res.publishDate}
                  </p>
                  {res.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed pt-1">{res.summary}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 uppercase">
                    {res.fileType === 'excel' ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-900" />
                    )}
                    {res.fileType === 'excel' ? 'Excel ফাইল' : res.fileType === 'link' ? 'বাহ্যিক লিংক' : 'PDF নথি'}
                  </span>

                  {res.fileUrl ? (
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={res.fileType !== 'link' ? res.title : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {res.fileType === 'link' ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>ফলাফল ডাউনলোড</span>
                    </a>
                  ) : (
                    <span className="text-xs text-amber-700 font-medium">
                      ফাইল এখনো সংযুক্ত হয়নি
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
