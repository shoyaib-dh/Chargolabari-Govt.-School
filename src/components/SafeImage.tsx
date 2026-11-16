import React, { useState } from 'react';
import { GraduationCap, Image as ImageIcon, User } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackType?: 'school' | 'person' | 'gallery';
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackType = 'gallery',
  fallbackLabel,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-100 to-emerald-50 text-slate-500 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackType === 'person' ? (
          <User className="w-12 h-12 text-blue-900/40 mb-2" />
        ) : fallbackType === 'school' ? (
          <GraduationCap className="w-12 h-12 text-blue-900/40 mb-2" />
        ) : (
          <ImageIcon className="w-10 h-10 text-blue-900/40 mb-2" />
        )}
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
