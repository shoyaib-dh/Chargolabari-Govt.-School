import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Newspaper, Search, User } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SafeImage } from '../components/SafeImage';

export function NewsPage() {
  const { news, settings } = useSchool();
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('সকল');

  const activeNews = useMemo(() => news.filter((n) => n.isActive), [news]);

  const categories = useMemo(
    () => ['সকল', ...Array.from(new Set(activeNews.map((n) => n.category)))],
    [activeNews]
  );

  const filtered = useMemo(() => {
    return activeNews
      .filter((n) => (category === 'সকল' ? true : n.category === category))
      .filter((n) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      });
  }, [activeNews, category, search]);

  if (id) {
    const post = activeNews.find((n) => n.id === id);
    if (!post) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Newspaper className="w-10 h-10 text-slate-400" />
          <h1 className="font-display font-bold text-2xl text-slate-900">সংবাদটি পাওয়া যায়নি</h1>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> সকল সংবাদে ফিরে যান
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" /> সকল সংবাদ ও কার্যক্রম
          </Link>

          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {post.featuredImageUrl && (
              <div className="aspect-[16/9] bg-slate-100">
                <SafeImage
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="space-y-3 border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" /> {post.publishDate}
                  </span>
                  {post.author && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {post.author}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-blue-950 leading-snug">
                  {post.title}
                </h1>
              </div>

              <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-blue-950 text-white py-14 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="text-xs font-medium text-amber-300">
            সংবাদ ও অনুষ্ঠান · {settings.schoolName}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">সংবাদ ও কার্যক্রম</h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            বিদ্যালয়ের ক্রীড়া প্রতিযোগিতা, জাতীয় দিবস, সাংস্কৃতিক অনুষ্ঠান ও বিশেষ কার্যক্রমের প্রতিবেদন।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  category === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সংবাদ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-slate-100">
                <SafeImage
                  src={item.featuredImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    {item.category} · <span className="tabular-nums">{item.publishDate}</span>
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary || item.content}
                  </p>
                </div>
                <Link
                  to={`/news/${item.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-emerald-700"
                >
                  বিস্তারিত পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
