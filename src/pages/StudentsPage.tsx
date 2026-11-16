import React, { useMemo, useState } from 'react';
import { ShieldAlert, UserCheck, Users } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { toBengaliNumber } from '../components/AnimatedCounter';
import { SafeImage } from '../components/SafeImage';

export function StudentsPage() {
  const { settings, studentClasses, students } = useSchool();
  const [selectedClass, setSelectedClass] = useState<string>('সকল শ্রেণি');

  const activeClasses = useMemo(
    () => studentClasses.filter((c) => c.isActive),
    [studentClasses]
  );

  const totalCount = useMemo(
    () => activeClasses.reduce((sum, c) => sum + (c.totalStudents || 0), 0),
    [activeClasses]
  );

  const approvedStudents = useMemo(
    () =>
      students
        .filter((s) => s.isActive && s.isPublicApproved && s.guardianConsent)
        .filter((s) => (selectedClass === 'সকল শ্রেণি' ? true : s.className === selectedClass)),
    [students, selectedClass]
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            শিক্ষার্থী তথ্য · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            শ্রেণিভিত্তিক শিক্ষার্থী তথ্য
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            প্রথম থেকে পঞ্চম শ্রেণি পর্যন্ত শ্রেণিভিত্তিক শিক্ষার্থীর পরিসংখ্যান ও অনুমোদিত শিক্ষার্থী তালিকা।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Aggregate Summary Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">সর্বমোট নিবন্ধিত শিক্ষার্থী (শ্রেণিভিত্তিক)</p>
              <h2 className="font-display font-bold text-2xl text-blue-950 tabular-nums">
                {toBengaliNumber(totalCount)} জন
              </h2>
            </div>
          </div>
          <div className="text-xs text-slate-500 max-w-md leading-relaxed">
            অপ্রাপ্তবয়স্ক শিক্ষার্থীদের ব্যক্তিগত তথ্য ও ছবি কেবল অভিভাবকের সম্মতি ও অ্যাডমিন অনুমোদন সাপেক্ষেই প্রকাশিত হয়।
          </div>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activeClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-blue-950">{cls.className}</h3>
                {cls.isDemo && (
                  <span className="text-[11px] font-medium text-amber-700">নমুনা</span>
                )}
              </div>
              <div className="text-2xl font-display font-bold text-emerald-700 tabular-nums">
                {toBengaliNumber(cls.totalStudents)} জন
              </div>
              <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-2.5">
                <div className="flex justify-between">
                  <span>ছাত্র:</span>
                  <span className="font-semibold tabular-nums">
                    {toBengaliNumber(cls.boysCount || 0)} জন
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ছাত্রী:</span>
                  <span className="font-semibold tabular-nums">
                    {toBengaliNumber(cls.girlsCount || 0)} জন
                  </span>
                </div>
                {cls.academicYear && (
                  <div className="flex justify-between">
                    <span>শিক্ষাবর্ষ:</span>
                    <span className="font-medium">{cls.academicYear}</span>
                  </div>
                )}
              </div>
              {cls.classTeacher && (
                <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                  শ্রেণি শিক্ষক: {cls.classTeacher}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Privacy-Gated Approved Students List */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  অনুমোদিত শিক্ষার্থী তালিকা
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  অভিভাবকের সম্মতি ও অ্যাডমিন অনুমোদিত শিক্ষার্থীদের তথ্য এখানে প্রদর্শিত হয়।
                </p>
              </div>
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              aria-label="শ্রেণি নির্বাচন করুন"
              className="px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-900"
            >
              <option value="সকল শ্রেণি">সকল শ্রেণি</option>
              {activeClasses.map((c) => (
                <option key={c.id} value={c.className}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          {approvedStudents.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-blue-900/60 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                বর্তমানে কোনো শিক্ষার্থীর ব্যক্তিগত তথ্য জনসাধারণের জন্য প্রকাশিত নয়
              </p>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                শিক্ষার্থীদের নিরাপত্তা ও গোপনীয়তা রক্ষার্থে কেবল অ্যাডমিন প্যানেল থেকে অভিভাবকের সম্মতি ও প্রকাশের অনুমোদন দেওয়া হলে তালিকা প্রদর্শিত হবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {approvedStudents.map((st) => (
                <div
                  key={st.id}
                  className="border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 bg-slate-50"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <SafeImage
                      src={st.photoUrl}
                      alt={st.name}
                      fallbackType="person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm text-slate-900 truncate">
                      {st.name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-medium">{st.className}</p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      রোল: {st.rollNumber} {st.academicYear ? `· ${st.academicYear}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
