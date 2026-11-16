import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Teacher } from '../types/school';
import { SafeImage } from './SafeImage';

interface TeacherCardProps {
  teacher: Teacher;
  onSelect: (teacher: Teacher) => void;
}

export function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-blue-300 hover:shadow-md">
      <div className="aspect-[4/4] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100 relative">
        <SafeImage
          src={teacher.photoUrl}
          alt={teacher.name}
          fallbackType="person"
          fallbackLabel={teacher.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 flex-wrap">
            <span>{teacher.designation}</span>
            {teacher.subject && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">{teacher.subject}</span>
              </>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
            {teacher.name}
          </h3>

          {teacher.qualification && (
            <p className="text-xs text-slate-600 leading-relaxed">{teacher.qualification}</p>
          )}

          {teacher.quote && (
            <p className="text-xs text-slate-600 italic border-t border-slate-100 pt-2.5 line-clamp-2">
              “{teacher.quote}”
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(teacher)}
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-900 hover:text-white rounded-lg transition-colors"
        >
          <span>প্রোফাইল দেখুন</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
