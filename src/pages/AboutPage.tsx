import React from 'react';
import { Award, Building2, Compass, Flag, History, School, Sparkles, Target, Wrench } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SafeImage } from '../components/SafeImage';

export function AboutPage() {
  const { settings, schoolInfo } = useSchool();

  const sections = [
    { id: 'history', num: '০১', title: 'বিদ্যালয়ের ইতিহাস', body: schoolInfo.history, icon: History },
    { id: 'introduction', num: '০২', title: 'বিদ্যালয়ের পরিচিতি', body: schoolInfo.introduction, icon: School },
    { id: 'establishment', num: '০৩', title: 'প্রতিষ্ঠার ইতিহাস ও সাল', body: schoolInfo.establishmentHistory, icon: Flag },
    { id: 'aims', num: '০৪', title: 'বিদ্যালয়ের লক্ষ্য ও উদ্দেশ্য', body: schoolInfo.aimsAndObjectives, icon: Target },
    { id: 'mission', num: '০৫', title: 'বিদ্যালয়ের মিশন ও ভিশন', body: schoolInfo.missionAndVision, icon: Compass },
    { id: 'infrastructure', num: '০৬', title: 'বিদ্যালয়ের অবকাঠামো', body: schoolInfo.infrastructure, icon: Building2 },
    { id: 'facilities', num: '০৭', title: 'বিদ্যালয়ের সুযোগ-সুবিধা', body: schoolInfo.facilities, icon: Wrench },
    { id: 'achievements', num: '০৮', title: 'বিদ্যালয়ের অর্জন ও সাফল্য', body: schoolInfo.achievements, icon: Award },
    { id: 'national-days', num: '০৯', title: 'জাতীয় দিবস ও বিশেষ কার্যক্রম', body: schoolInfo.nationalDays, icon: Sparkles },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Banner */}
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            আমাদের বিদ্যালয় · {settings.address}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            {settings.schoolName}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            প্রতিষ্ঠানের ইতিহাস, লক্ষ্য ও উদ্দেশ্য, অবকাঠামো, সুযোগ-সুবিধা এবং সামগ্রিক পরিচিতি।
            {schoolInfo.isDemoContent ? ' (প্রদর্শিত নমুনা অংশগুলো অ্যাডমিন প্যানেল থেকে সম্পাদনাযোগ্য)' : ''}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sticky Table of Contents */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 lg:sticky lg:top-24 space-y-4">
            <div className="aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={schoolInfo.welcomeImageUrl}
                alt={settings.schoolName}
                fallbackType="school"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900 mb-3">
                পরিচিতি সূচিপত্র
              </h2>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                  >
                    <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                      {sec.num}
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* 9 Editorial Sections */}
        <div className="lg:col-span-8 space-y-6">
          {sections.map((sec) => (
            <article
              key={sec.id}
              id={sec.id}
              className="scroll-mt-24 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                  <sec.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-700">অধ্যায় {sec.num}</span>
                  <h2 className="font-display font-bold text-xl text-slate-900">{sec.title}</h2>
                </div>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line pt-1">
                {sec.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
