import { useEffect, useRef, useState } from 'react';

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const EN_DIGITS: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export function toBengaliNumber(num: number): string {
  return String(num)
    .split('')
    .map((ch) => BENGALI_DIGITS[ch] ?? ch)
    .join('');
}

export function AnimatedCounter({ value }: { value: string | number }) {
  const str = String(value);
  const normalized = str
    .split('')
    .map((ch) => EN_DIGITS[ch] ?? ch)
    .join('');
  const match = normalized.match(/^(\d+)(.*)$/);

  const [displayNum, setDisplayNum] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!match) return;
    const target = parseInt(match[1], 10);
    if (Number.isNaN(target)) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setDisplayNum(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const duration = 700;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayNum(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [str]);

  if (!match) {
    return <span className="tabular-nums">{str}</span>;
  }

  const suffix = str.slice(match[1].length);
  return (
    <span ref={elRef} className="tabular-nums">
      {toBengaliNumber(displayNum)}
      {suffix}
    </span>
  );
}
