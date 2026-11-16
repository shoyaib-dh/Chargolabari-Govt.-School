import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export function CustomDynamicPage() {
  const { pages, settings } = useSchool();
  const { slug } = useParams<{ slug: string }>();

  const page = pages.find((p) => p.isActive && p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <FileText className="w-10 h-10 text-slate-400" />
        <h1 className="font-display font-bold text-2xl text-slate-900">পৃষ্ঠাটি পাওয়া যায়নি</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="text-xs font-medium text-amber-300">{settings.schoolName}</div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">{page.title}</h1>
          {page.subtitle && <p className="text-sm text-blue-100">{page.subtitle}</p>}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-slate-700 leading-relaxed whitespace-pre-line">
          {page.content}
        </article>
      </div>
    </div>
  );
}
