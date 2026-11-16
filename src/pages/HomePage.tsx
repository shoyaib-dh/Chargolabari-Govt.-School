import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Laptop,
  Palette,
  Quote,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSchool } from '../context/SchoolContext';
import { SafeImage } from '../components/SafeImage';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherModal } from '../components/TeacherModal';
import { HeroNoticeBoard } from '../components/HeroNoticeBoard';
import { Teacher } from '../types/school';

const SCHOOL_FEATURES = [
  {
    icon: BookOpen,
    title: 'মানসম্মত প্রাথমিক শিক্ষা',
    description: 'জাতীয় শিক্ষাক্রম অনুসরণ করে প্রতিটি শিশুর পঠন, লিখন ও গাণিতিক দক্ষতার সুদৃঢ় ভিত্তি গঠন।',
  },
  {
    icon: Palette,
    title: 'শিশুদের সৃজনশীল বিকাশ',
    description: 'চিত্রাঙ্কন, আবৃত্তি, গল্প বলা ও হস্তশিল্প চর্চার মাধ্যমে শিশুদের সুপ্ত প্রতিভার বিকাশ।',
  },
  {
    icon: HeartHandshake,
    title: 'নৈতিক ও মানবিক শিক্ষা',
    description: 'শৃঙ্খলা, সততা, বড়দের প্রতি শ্রদ্ধা এবং দেশপ্রেমের মানবিক মূল্যবোধ চর্চা।',
  },
  {
    icon: Trophy,
    title: 'খেলাধুলা ও সাংস্কৃতিক কার্যক্রম',
    description: 'বার্ষিক ক্রীড়া প্রতিযোগিতা, জাতীয় দিবস উদযাপন এবং নিয়মিত সহশিক্ষা আয়োজন।',
  },
  {
    icon: ShieldCheck,
    title: 'পরিচ্ছন্ন ও সুন্দর শিক্ষার পরিবেশ',
    description: 'নিরাপদ, শিশু-বান্ধব, সবুজ ও স্বাস্থ্যসম্মত শ্রেণিকক্ষ এবং বিদ্যালয় প্রাঙ্গণ।',
  },
  {
    icon: Laptop,
    title: 'প্রযুক্তিনির্ভর শিক্ষা',
    description: 'ডিজিটাল কনটেন্ট ও আধুনিক শিক্ষা উপকরণের মাধ্যমে সহজ ও আনন্দদায়ক পাঠদান।',
  },
];

export function HomePage() {
  const {
    settings,
    schoolInfo,
    sliders,
    teachers,
    notices,
    galleryPhotos,
    news,
  } = useSchool();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const activeSliders = sliders.filter((s) => s.isActive);
  const activeTeachers = teachers.filter((t) => t.isActive).slice(0, 4);
  const allActiveNotices = notices.filter((n) => n.isActive);
  const activeNotices = allActiveNotices.slice(0, 5);
  const activePhotos = galleryPhotos.filter((p) => p.isActive).slice(0, 6);
  const activeNews = news.filter((n) => n.isActive).slice(0, 3);

  useEffect(() => {
    if (activeSliders.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSliders.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSliders.length, paused]);

  const safeSlideIndex = activeSliders.length > 0 ? currentSlide % activeSliders.length : 0;

  return (
    <div>
      {/* 1. Hero Full-Width Image Slider */}
      <section
        className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] overflow-hidden bg-blue-950"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="প্রধান স্লাইডার"
      >
        {activeSliders.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === safeSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <SafeImage
              src={slide.imageUrl}
              alt={slide.title}
              fallbackType="school"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/25" />

            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14 sm:pb-0">
                <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl lg:pr-8 space-y-4 text-white">
                  <p className="text-xs sm:text-sm font-medium text-amber-300 tracking-wide">
                    {settings.address}
                    {slide.isDemo ? ' · নমুনা স্লাইড' : ''}
                  </p>
                  <h1
                    className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    {slide.title}
                  </h1>
                  {slide.description && (
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>
                  )}
                  {slide.buttonText && (
                    <div className="pt-2">
                      <Link
                        to={slide.buttonLink || '/about'}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-blue-950 font-semibold text-sm rounded-lg transition-colors"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Desktop Floating Bottom-Right Live Notice Board (aligned with screenshot placement) */}
        {allActiveNotices.length > 0 && settings.showNoticesSection !== false && (
          <div className="hidden lg:block absolute inset-x-0 bottom-5 z-20 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
              <div className="pointer-events-auto w-[360px] xl:w-[390px]">
                <HeroNoticeBoard notices={allActiveNotices} />
              </div>
            </div>
          </div>
        )}

        {activeSliders.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + activeSliders.length) % activeSliders.length)
              }
              aria-label="পূর্ববর্তী স্লাইড"
              className="absolute left-3 sm:left-6 top-1/2 lg:top-[28%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSliders.length)}
              aria-label="পরবর্তী স্লাইড"
              className="absolute right-3 sm:right-6 top-1/2 lg:top-[28%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 lg:left-8 lg:translate-x-0 -translate-x-1/2 z-20 flex items-center gap-2">
              {activeSliders.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`স্লাইড ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === safeSlideIndex ? 'w-7 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Mobile/Tablet Prominent Live Notice Board */}
      {allActiveNotices.length > 0 && settings.showNoticesSection !== false && (
        <div className="lg:hidden bg-slate-100 border-b border-slate-200 py-5 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <HeroNoticeBoard notices={allActiveNotices} compact />
          </div>
        </div>
      )}

      {/* 2. Welcome Section */}
      {settings.showWelcomeSection && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 flex flex-col justify-center space-y-5"
            >
              <div className="text-xs font-semibold text-emerald-700">
                বিদ্যালয় পরিচিতি · সরকারি প্রাথমিক বিদ্যালয়
              </div>
              <h2
                className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-blue-950 leading-snug"
                style={{ textWrap: 'balance' }}
              >
                স্বাগতম {settings.schoolName}-এ
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">{schoolInfo.introduction}</p>
              <p className="text-slate-600 leading-relaxed text-sm">{schoolInfo.missionAndVision}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <span>বিস্তারিত জানুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/academics"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:border-blue-900 text-slate-800 hover:text-blue-900 text-sm font-medium rounded-lg transition-colors"
                >
                  একাডেমিক কার্যক্রম
                </Link>
              </div>
            </motion.div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-full min-h-[280px] sm:min-h-[340px]">
                <SafeImage
                  src={schoolInfo.welcomeImageUrl}
                  alt={settings.schoolName}
                  fallbackType="school"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. School Statistics Strip */}
      {settings.showStatsSection && (
        <section className="py-12 bg-blue-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'মোট শিক্ষার্থী', value: settings.statStudents, icon: Users },
                { label: 'মোট শিক্ষক', value: settings.statTeachers, icon: Sparkles },
                { label: 'মোট শ্রেণিকক্ষ', value: settings.statClassrooms, icon: Building2 },
                { label: 'প্রতিষ্ঠার সাল', value: settings.statEstablishedYear, icon: Calendar },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-blue-900/50 border border-blue-800/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-3"
                >
                  <stat.icon className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="font-display font-bold text-2xl sm:text-3xl text-white">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-xs sm:text-sm text-blue-200 mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. প্রধান শিক্ষকের বাণী */}
      {settings.showHeadmasterSection && (
        <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4">
                <div className="aspect-[3/4] max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <SafeImage
                    src={schoolInfo.headmasterPhotoUrl}
                    alt={schoolInfo.headmasterName}
                    fallbackType="person"
                    fallbackLabel={schoolInfo.headmasterName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div>
                  <span className="text-xs font-semibold text-emerald-700">
                    প্রধান শিক্ষকের বাণী
                    {schoolInfo.isDemoContent ? ' · নমুনা ও সম্পাদনাযোগ্য' : ''}
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-blue-950 mt-1">
                    {schoolInfo.headmasterName}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {schoolInfo.headmasterDesignation}
                    {schoolInfo.headmasterQualification
                      ? ` · ${schoolInfo.headmasterQualification}`
                      : ''}
                  </p>
                </div>

                {schoolInfo.headmasterQuote && (
                  <blockquote className="py-3 border-y border-slate-200 flex items-start gap-3 text-blue-950">
                    <Quote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="font-display text-base sm:text-lg italic font-medium leading-relaxed">
                      “{schoolInfo.headmasterQuote}”
                    </p>
                  </blockquote>
                )}

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {schoolInfo.headmasterMessage}
                </p>

                {schoolInfo.headmasterSignature && (
                  <div className="pt-2">
                    <div className="font-display text-lg font-semibold italic text-blue-900">
                      {schoolInfo.headmasterSignature}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. বিদ্যালয়ের বিশেষত্ব */}
      {settings.showFeaturesSection && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold text-emerald-700">আমাদের অঙ্গীকার</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-blue-950">
                বিদ্যালয়ের বিশেষত্ব ও শিক্ষার পরিবেশ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCHOOL_FEATURES.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 space-y-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Teacher Preview */}
      {settings.showTeachersSection && (
        <section className="py-16 sm:py-20 bg-blue-50/50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700">শিক্ষক মণ্ডলী</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-blue-950 mt-1">
                  আমাদের শ্রদ্ধেয় শিক্ষকবৃন্দ
                </h2>
              </div>
              <Link
                to="/teachers"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-emerald-700"
              >
                <span>সকল শিক্ষক দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onSelect={(t) => setSelectedTeacher(t)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Notice Board & 8. Photo Gallery Preview */}
      {(settings.showNoticesSection || settings.showGallerySection) && (
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {settings.showNoticesSection && (
              <div className={settings.showGallerySection ? 'lg:col-span-6 space-y-6' : 'lg:col-span-12 space-y-6'}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700">সর্বশেষ ঘোষণা</span>
                    <h2 className="font-display font-bold text-2xl text-blue-950 mt-1">
                      নোটিশ বোর্ড
                    </h2>
                  </div>
                  <Link
                    to="/notices"
                    className="text-sm font-semibold text-blue-900 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    সকল নোটিশ <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  {activeNotices.map((notice) => (
                    <Link
                      key={notice.id}
                      to={`/notices/${notice.id}`}
                      className="block p-4 sm:p-5 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                        <span>
                          {notice.category} · <span className="tabular-nums">{notice.publishDate}</span>
                        </span>
                        {notice.isNew && (
                          <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-400 text-blue-950 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-base text-slate-900 leading-snug">
                        {notice.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {settings.showGallerySection && (
              <div className={settings.showNoticesSection ? 'lg:col-span-6 space-y-6' : 'lg:col-span-12 space-y-6'}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700">স্মৃতি ও আয়োজন</span>
                    <h2 className="font-display font-bold text-2xl text-blue-950 mt-1">
                      ফটো গ্যালারি
                    </h2>
                  </div>
                  <Link
                    to="/gallery"
                    className="text-sm font-semibold text-blue-900 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    সম্পূর্ণ গ্যালারি <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activePhotos.map((photo) => (
                    <Link
                      key={photo.id}
                      to="/gallery"
                      className="group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative"
                    >
                      <SafeImage
                        src={photo.imageUrl}
                        alt={photo.title}
                        fallbackType="gallery"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9. Latest Activities & News */}
      {settings.showActivitiesSection && (
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700">সাম্প্রতিক কার্যক্রম</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-blue-950 mt-1">
                  সংবাদ, অনুষ্ঠান ও সহশিক্ষা কার্যক্রম
                </h2>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-emerald-700"
              >
                <span>সকল সংবাদ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-blue-300 transition-colors"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <SafeImage
                      src={item.featuredImageUrl}
                      alt={item.title}
                      fallbackType="gallery"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">
                        {item.category} · <span className="tabular-nums">{item.publishDate}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <Link
                      to={`/news/${item.id}`}
                      className="text-xs font-semibold text-blue-900 hover:text-emerald-700 inline-flex items-center gap-1 pt-2"
                    >
                      বিস্তারিত পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
    </div>
  );
}
