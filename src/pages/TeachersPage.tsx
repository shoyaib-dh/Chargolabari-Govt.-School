import React, { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherModal } from '../components/TeacherModal';
import { Teacher } from '../types/school';

const CATEGORIES = ['সকল শিক্ষক', 'প্রধান শিক্ষক', 'সহকারী শিক্ষক', 'অন্যান্য শিক্ষক'] as const;

export function TeachersPage() {
  const { teachers, settings } = useSchool();
  const [activeCat, setActiveCat] = useState<string>('সকল শিক্ষক');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const activeTeachers = useMemo(() => {
    return teachers
      .filter((t) => t.isActive)
      .filter((t) => (activeCat === 'সকল শিক্ষক' ? true : t.category === activeCat))
      .filter((t) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.designation.toLowerCase().includes(q) ||
          (t.subject || '').toLowerCase().includes(q)
        );
      });
  }, [teachers, activeCat, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            শিক্ষক মণ্ডলী · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">আমাদের শ্রদ্ধেয় শিক্ষকবৃন্দ</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            শিক্ষার্থীদের আলোকিত মানুষ হিসেবে গড়ে তুলতে নিবেদিতপ্রাণ শিক্ষকমণ্ডলীর পরিচিতি, যোগ্যতা ও বাণী।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeCat === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিক্ষকের নাম বা বিষয় খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        {/* Grid */}
        {activeTeachers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="font-display font-bold text-lg text-slate-800">
              কোনো শিক্ষকের তথ্য পাওয়া যায়নি
            </h2>
            <p className="text-sm text-slate-500">
              অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা অ্যাডমিন প্যানেল থেকে নতুন শিক্ষক যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onSelect={(t) => setSelectedTeacher(t)}
              />
            ))}
          </div>
        )}
      </div>

      <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
    </div>
  );
}
