import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Image as ImageIcon, Maximize2, Play, X } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SafeImage } from '../components/SafeImage';

const GALLERY_CATEGORIES = [
  'সকল',
  'বিদ্যালয়ের পরিবেশ',
  'শিক্ষক ও শিক্ষার্থী',
  'বার্ষিক ক্রীড়া প্রতিযোগিতা',
  'জাতীয় দিবস',
  'সাংস্কৃতিক অনুষ্ঠান',
  'পুরস্কার বিতরণী',
  'শিক্ষা কার্যক্রম',
  'অন্যান্য অনুষ্ঠান',
];

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function GalleryPage() {
  const { galleryPhotos, galleryVideos, settings } = useSchool();
  const [tab, setTab] = useState<'photos' | 'videos'>('photos');
  const [category, setCategory] = useState('সকল');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const activePhotos = useMemo(
    () =>
      galleryPhotos
        .filter((p) => p.isActive)
        .filter((p) => (category === 'সকল' ? true : p.category === category)),
    [galleryPhotos, category]
  );

  const activeVideos = useMemo(
    () =>
      galleryVideos
        .filter((v) => v.isActive)
        .filter((v) => (category === 'সকল' ? true : v.category === category)),
    [galleryVideos, category]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight')
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % activePhotos.length));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + activePhotos.length) % activePhotos.length
        );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, activePhotos.length]);

  const currentPhoto = lightboxIdx !== null ? activePhotos[lightboxIdx] : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            ফটো ও ভিডিও আর্কাইভ · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">ফটো ও ভিডিও গ্যালারি</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            বিদ্যালয়ের শিক্ষা কার্যক্রম, জাতীয় দিবস, বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের স্মরণীয় মুহূর্তসমূহ।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Tabs & Category Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTab('photos')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  tab === 'photos'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> ফটো গ্যালারি
              </button>
              <button
                type="button"
                onClick={() => setTab('videos')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                  tab === 'videos'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-700 hover:text-blue-900'
                }`}
              >
                <Film className="w-4 h-4" /> ভিডিও গ্যালারি
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Masonry / Grid */}
        {tab === 'photos' &&
          (activePhotos.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
              <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">এই বিভাগে কোনো ছবি নেই</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {activePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIdx(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setLightboxIdx(index);
                  }}
                  className="break-inside-avoid group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <div className="relative overflow-hidden bg-slate-100">
                    <SafeImage
                      src={photo.imageUrl}
                      alt={photo.title}
                      fallbackType="gallery"
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="text-xs font-medium text-emerald-700">{photo.category}</div>
                    <h2 className="font-display font-bold text-base text-slate-900">
                      {photo.title}
                    </h2>
                    {photo.caption && (
                      <p className="text-xs text-slate-600 leading-relaxed">{photo.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Video Gallery */}
        {tab === 'videos' &&
          (activeVideos.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
              <Film className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">এই বিভাগে কোনো ভিডিও নেই</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeVideos.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.videoUrl);
                return (
                  <article
                    key={video.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-video bg-slate-900">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-full flex flex-col items-center justify-center text-white gap-2 hover:bg-slate-800 transition-colors"
                        >
                          <Play className="w-10 h-10 text-amber-400" />
                          <span className="text-xs font-medium">ভিডিওটি দেখুন</span>
                        </a>
                      )}
                    </div>
                    <div className="p-5 space-y-1.5">
                      <div className="text-xs font-medium text-emerald-700">{video.category}</div>
                      <h2 className="font-display font-bold text-lg text-slate-900">
                        {video.title}
                      </h2>
                      {video.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">{video.description}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
      </div>

      {/* Full-Screen Lightbox */}
      {currentPhoto && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="flex items-center justify-between text-white">
            <div className="text-xs sm:text-sm text-slate-300">
              {currentPhoto.category} · {lightboxIdx + 1} / {activePhotos.length}
            </div>
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="বন্ধ করুন"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activePhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((lightboxIdx - 1 + activePhotos.length) % activePhotos.length)
                }
                aria-label="পূর্ববর্তী ছবি"
                className="absolute left-2 sm:left-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
            />

            {activePhotos.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % activePhotos.length)}
                aria-label="পরবর্তী ছবি"
                className="absolute right-2 sm:right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="text-center text-white max-w-2xl mx-auto space-y-1">
            <h3 className="font-display font-bold text-lg">{currentPhoto.title}</h3>
            {currentPhoto.caption && (
              <p className="text-xs sm:text-sm text-slate-300">{currentPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
