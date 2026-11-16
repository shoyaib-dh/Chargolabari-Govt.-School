import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, MapPin, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export function Header() {
  const { settings, menus, isAdmin } = useSchool();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeMenus = menus.filter((m) => m.isActive);
  const primaryLinks = activeMenus.filter((m) => m.group === 'primary' && m.path !== '/contact');
  const moreLinks = activeMenus.filter((m) => m.group === 'more');

  const isActivePath = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      {/* Non-sticky top institutional utility bar */}
      <div className="bg-blue-950 text-blue-100 text-xs border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{settings.address}</span>
            </span>
            {settings.phone && (
              <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single-line School Brand Wordmark + Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 min-w-0 shrink-0 focus-visible:outline-2 focus-visible:outline-blue-900 rounded"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.schoolName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-lg object-contain border border-slate-200 bg-white shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-display font-bold text-sm shrink-0">
                ৪৪
              </div>
            )}
            <span className="font-display font-bold text-base sm:text-lg text-blue-950 whitespace-nowrap truncate max-w-[230px] sm:max-w-[340px] lg:max-w-none">
              {settings.schoolName}
            </span>
          </Link>

          {/* Zone 2: Clean Single-Line Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {primaryLinks.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActivePath(item.path)
                    ? 'border-blue-900 text-blue-900 font-semibold'
                    : 'border-transparent hover:text-blue-900 hover:border-blue-200'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {moreLinks.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  aria-expanded={moreOpen}
                  className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    moreLinks.some((m) => isActivePath(m.path))
                      ? 'border-blue-900 text-blue-900 font-semibold'
                      : 'border-transparent hover:text-blue-900'
                  }`}
                >
                  <span>একাডেমিক ও তথ্য</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {moreOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                    {moreLinks.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActivePath(item.path)
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-blue-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      to="/news"
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActivePath('/news')
                          ? 'bg-blue-50 text-blue-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-blue-900'
                      }`}
                    >
                      সংবাদ ও কার্যক্রম
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Zone 3: 1 Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              যোগাযোগ
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="মেনু খুলুন"
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {activeMenus.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActivePath(item.path)
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/news"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActivePath('/news')
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              সংবাদ ও কার্যক্রম
            </Link>
            <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500 px-3">
              মোবাইল: {settings.phone}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
