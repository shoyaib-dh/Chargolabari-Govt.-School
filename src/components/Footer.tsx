import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export function Footer() {
  const { settings } = useSchool();

  return (
    <footer className="bg-blue-950 text-slate-200 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* School Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.schoolName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-contain bg-white p-1 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-blue-950 flex items-center justify-center font-display font-bold shrink-0">
                ৪৪
              </div>
            )}
            <h3 className="font-display font-bold text-lg text-white leading-snug">
              {settings.schoolName}
            </h3>
          </div>
          <p className="text-sm text-blue-100/80 leading-relaxed">{settings.footerText}</p>
          <div className="space-y-2 text-sm text-blue-100/90 pt-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            {settings.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
            )}
            {settings.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <span>{settings.email}</span>
              </div>
            )}
          </div>
          {(settings.facebookUrl || settings.youtubeUrl) && (
            <div className="flex items-center gap-3 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-100 hover:text-amber-300 border border-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  ফেসবুক <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-100 hover:text-amber-300 border border-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  ইউটিউব <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Important Links */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-display font-semibold text-white text-base">গুরুত্বপূর্ণ লিংক</h4>
          <ul className="space-y-2 text-sm text-blue-100/80">
            <li><Link to="/about" className="hover:text-amber-300 transition-colors">আমাদের বিদ্যালয়</Link></li>
            <li><Link to="/teachers" className="hover:text-amber-300 transition-colors">শিক্ষকবৃন্দ</Link></li>
            <li><Link to="/students" className="hover:text-amber-300 transition-colors">শিক্ষার্থী তথ্য</Link></li>
            <li><Link to="/academics" className="hover:text-amber-300 transition-colors">একাডেমিক কার্যক্রম</Link></li>
            <li><Link to="/notices" className="hover:text-amber-300 transition-colors">নোটিশ বোর্ড</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-display font-semibold text-white text-base">অন্যান্য পাতা</h4>
          <ul className="space-y-2 text-sm text-blue-100/80">
            <li><Link to="/results" className="hover:text-amber-300 transition-colors">পরীক্ষার ফলাফল</Link></li>
            <li><Link to="/gallery" className="hover:text-amber-300 transition-colors">ফটো ও ভিডিও গ্যালারি</Link></li>
            <li><Link to="/news" className="hover:text-amber-300 transition-colors">সংবাদ ও কার্যক্রম</Link></li>
            <li><Link to="/contact" className="hover:text-amber-300 transition-colors">যোগাযোগ</Link></li>
            <li><Link to="/admin/login" className="hover:text-amber-300 transition-colors">অ্যাডমিন প্যানেল</Link></li>
          </ul>
        </div>

        {/* Embedded Google Map */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="font-display font-semibold text-white text-base">বিদ্যালয়ের অবস্থান</h4>
          <div className="rounded-xl overflow-hidden border border-blue-800 bg-blue-900/40 h-44">
            {settings.mapEmbedUrl ? (
              <iframe
                title="বিদ্যালয়ের মানচিত্র"
                src={settings.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-blue-200 p-4 text-center">
                মাদারগঞ্জ, জামালপুর — মানচিত্র অ্যাডমিন প্যানেল থেকে যুক্ত করুন।
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900/80 bg-blue-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200/75">
          <p>
            © {new Date().getFullYear()} {settings.schoolName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p>চরগোলাবাড়ী, মাদারগঞ্জ, জামালপুর, বাংলাদেশ</p>
        </div>
      </div>
    </footer>
  );
}
