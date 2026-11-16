import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Pause, Play, Sparkles } from 'lucide-react';
import { Notice } from '../types/school';
import { toBengaliNumber } from './AnimatedCounter';

interface HeroNoticeBoardProps {
  notices: Notice[];
  className?: string;
  compact?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

export function HeroNoticeBoard({
  notices,
  className = '',
  compact = false,
  activeIndex,
  onActiveIndexChange,
}: HeroNoticeBoardProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [internalIndex, setInternalIndex] = useState(0);

  const highlightIndex = activeIndex !== undefined ? activeIndex : internalIndex;

  useEffect(() => {
    if (notices.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      const next = (highlightIndex + 1) % notices.length;
      if (onActiveIndexChange) {
        onActiveIndexChange(next);
      } else {
        setInternalIndex(next);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [notices.length, isPaused, highlightIndex, onActiveIndexChange]);

  if (notices.length === 0) return null;

  const safeHighlightIdx = highlightIndex % notices.length;
  const highlightedNotice = notices[safeHighlightIdx];
  const shouldLoop = notices.length > 1;
  const scrollItems = shouldLoop ? [...notices, ...notices] : notices;
  const durationSeconds = Math.max(14, notices.length * 4.5);

  return (
    <aside
      aria-label="হোমপেজ লাইভ নোটিশ বোর্ড"
      className={`rounded-2xl border-2 border-amber-400 bg-white overflow-hidden flex flex-col ${className}`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-900 text-white px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
          <Bell className="w-4 h-4 text-amber-300 shrink-0" />
          <h2 className="font-display font-bold text-sm sm:text-base tracking-wide truncate">
            নোটিশ বোর্ড
          </h2>
          <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-400 text-blue-950 rounded-full tabular-nums shrink-0">
            {toBengaliNumber(notices.length)}টি
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? 'স্ক্রল চালু করুন' : 'স্ক্রল থামান'}
          title={isPaused ? 'স্ক্রল চালু করুন' : 'স্ক্রল থামান'}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors shrink-0"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Live Highlight Spotlight Strip */}
      {highlightedNotice && (
        <Link
          to={`/notices/${highlightedNotice.id}`}
          className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/90 flex items-center justify-between gap-2 hover:bg-amber-100/80 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              হাইলাইট
            </span>
            <span className="text-xs font-bold text-blue-950 truncate">
              {highlightedNotice.title}
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        </Link>
      )}

      {/* Bottom-to-Top Auto-Scrolling Ticker List */}
      <div
        className={`notice-scroll-container relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-blue-50/50 ${
          compact ? 'h-[200px]' : 'h-[210px] sm:h-[225px]'
        }`}
      >
        <div
          className={shouldLoop ? 'notice-scroll-track' : ''}
          style={
            shouldLoop
              ? {
                  animationDuration: `${durationSeconds}s`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }
              : undefined
          }
        >
          {scrollItems.map((notice, idx) => {
            const realIdx = idx % notices.length;
            const isHighlighted = realIdx === safeHighlightIdx || notice.isNew;

            return (
              <Link
                key={`${notice.id}-${idx}`}
                to={`/notices/${notice.id}`}
                className={`group block px-3.5 py-2.5 border-b border-slate-200/80 transition-all ${
                  isHighlighted
                    ? 'bg-amber-50/85 border-l-4 border-l-amber-500 hover:bg-amber-100/70'
                    : 'bg-white/80 border-l-4 border-l-transparent hover:border-l-blue-800 hover:bg-blue-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1">
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                    <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="tabular-nums">{notice.publishDate}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-blue-900">{notice.category}</span>
                  </span>
                  {notice.isNew && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded animate-pulse shrink-0">
                      নতুন
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-semibold text-[13px] sm:text-sm text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-2">
                    {notice.title}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Soft bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white/95 to-transparent" />
      </div>

      {/* Footer Link */}
      <div className="bg-slate-50 border-t border-slate-200 px-3.5 py-2 flex items-center justify-end text-xs">
        <Link
          to="/notices"
          className="inline-flex items-center gap-1 font-bold text-blue-900 hover:text-emerald-700 transition-colors"
        >
          <span>সব নোটিশ দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
