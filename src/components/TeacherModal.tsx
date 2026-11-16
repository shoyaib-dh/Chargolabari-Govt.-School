import React, { useEffect } from 'react';
import { Award, BookOpen, Calendar, Clock, Quote, X } from 'lucide-react';
import { Teacher } from '../types/school';
import { SafeImage } from './SafeImage';

interface TeacherModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export function TeacherModal({ teacher, onClose }: TeacherModalProps) {
  useEffect(() => {
    if (!teacher) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [teacher, onClose]);

  if (!teacher) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${teacher.name} প্রোফাইল`}
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold text-blue-900">
            শিক্ষক প্রোফাইল · {teacher.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={teacher.photoUrl}
                alt={teacher.name}
                fallbackType="person"
                fallbackLabel={teacher.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="md:col-span-8 space-y-5">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">{teacher.name}</h2>
              <p className="text-sm font-medium text-emerald-700 mt-1">{teacher.designation}</p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              {teacher.qualification && (
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">শিক্ষাগত যোগ্যতা</dt>
                    <dd className="font-medium text-slate-900">{teacher.qualification}</dd>
                  </div>
                </div>
              )}
              {teacher.subject && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">পাঠদানের বিষয়</dt>
                    <dd className="font-medium text-slate-900">{teacher.subject}</dd>
                  </div>
                </div>
              )}
              {teacher.joiningDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">যোগদানের তারিখ</dt>
                    <dd className="font-medium text-slate-900">{teacher.joiningDate}</dd>
                  </div>
                </div>
              )}
              {teacher.experience && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">অভিজ্ঞতা</dt>
                    <dd className="font-medium text-slate-900">{teacher.experience}</dd>
                  </div>
                </div>
              )}
            </dl>

            {teacher.shortBio && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-500">সংক্ষিপ্ত পরিচিতি</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{teacher.shortBio}</p>
              </div>
            )}

            {teacher.statement && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-500">শিক্ষকের বক্তব্য</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{teacher.statement}</p>
              </div>
            )}

            {teacher.quote && (
              <div className="border-t border-b border-slate-200 py-3 flex items-start gap-2.5 text-blue-950">
                <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                <p className="text-sm italic font-medium">“{teacher.quote}”</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
