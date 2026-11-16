import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  Award,
  Bell,
  BookOpen,
  Database,
  ExternalLink,
  FileText,
  Film,
  GraduationCap,
  Image as ImageIcon,
  Images,
  KeyRound,
  LayoutDashboard,
  ListTree,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  School,
  Settings,
  SlidersHorizontal,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { auth } from '../../firebase';
import { useSchool } from '../../context/SchoolContext';
import { seedAllDemoData } from '../../services/firestoreService';
import { AnimatedCounter, toBengaliNumber } from '../../components/AnimatedCounter';
import { ToastContainer, ToastMessage } from '../../components/Toast';
import { AdminGenericCrud } from '../../components/admin/AdminGenericCrud';
import {
  AdminBackupModule,
  AdminMessagesModule,
  AdminPasswordModule,
  AdminSchoolInfoModule,
  AdminSettingsModule,
  AdminStudentsModule,
  AdminUsersModule,
} from '../../components/admin/AdminExtraModules';

type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'schoolInfo'
  | 'logo'
  | 'sliders'
  | 'teachers'
  | 'students'
  | 'academics'
  | 'notices'
  | 'results'
  | 'photos'
  | 'videos'
  | 'news'
  | 'pages'
  | 'messages'
  | 'menus'
  | 'users'
  | 'password'
  | 'backup';

const SIDEBAR_ITEMS: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'dashboard', label: '১. ড্যাশবোর্ড', icon: LayoutDashboard },
  { id: 'settings', label: '২. ওয়েবসাইট সেটিংস', icon: Settings },
  { id: 'schoolInfo', label: '৩. বিদ্যালয়ের তথ্য', icon: School },
  { id: 'logo', label: '৪. লোগো ও ফ্যাভিকন', icon: ImageIcon },
  { id: 'sliders', label: '৫. হোমপেজ স্লাইডার', icon: SlidersHorizontal },
  { id: 'teachers', label: '৬. শিক্ষক ব্যবস্থাপনা', icon: GraduationCap },
  { id: 'students', label: '৭. শিক্ষার্থী ব্যবস্থাপনা', icon: Users },
  { id: 'academics', label: '৮. একাডেমিক ব্যবস্থাপনা', icon: BookOpen },
  { id: 'notices', label: '৯. নোটিশ ব্যবস্থাপনা', icon: Bell },
  { id: 'results', label: '১০. ফলাফল ব্যবস্থাপনা', icon: Award },
  { id: 'photos', label: '১১. ফটো গ্যালারি', icon: Images },
  { id: 'videos', label: '১২. ভিডিও গ্যালারি', icon: Film },
  { id: 'news', label: '১৩. সংবাদ ও কার্যক্রম', icon: Newspaper },
  { id: 'pages', label: '১৪. পেজ ব্যবস্থাপনা', icon: FileText },
  { id: 'messages', label: '১৫. যোগাযোগ বার্তা', icon: Mail },
  { id: 'menus', label: '১৬. মেনু ব্যবস্থাপনা', icon: ListTree },
  { id: 'users', label: '১৭. ইউজার ব্যবস্থাপনা', icon: UserCog },
  { id: 'password', label: '১৮. পাসওয়ার্ড পরিবর্তন', icon: KeyRound },
  { id: 'backup', label: '১৯. ব্যাকআপ ও এক্সপোর্ট', icon: Database },
];

export function AdminDashboardPage() {
  const ctx = useSchool();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [seeding, setSeeding] = useState(false);

  const notify = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    if (ctx.authReady && !ctx.isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [ctx.authReady, ctx.isAdmin, navigate]);

  if (!ctx.authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-600">
        অ্যাডমিন সেশন যাচাই করা হচ্ছে...
      </div>
    );
  }

  if (!ctx.isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login', { replace: true });
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await seedAllDemoData();
      notify('success', 'প্রাথমিক নমুনা তথ্য ডাটাবেসে সংরক্ষণ করা হয়েছে। এখন সবকিছু সম্পাদনা করতে পারবেন।');
    } catch {
      notify('error', 'ডাটাবেসে তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setSeeding(false);
    }
  };

  const totalStudentsCount = ctx.studentClasses.reduce(
    (sum, c) => sum + (c.totalStudents || 0),
    0
  );

  const hasDemoFallback = Object.values(ctx.usingDemoFallback).some(Boolean);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-blue-950 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="font-display font-bold text-sm truncate">অ্যাডমিন ড্যাশবোর্ড</div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="p-1.5 rounded-lg bg-blue-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'fixed inset-0 z-40 block' : 'hidden'
        } lg:block lg:w-72 shrink-0 bg-blue-950 text-slate-200 flex flex-col border-r border-blue-900`}
      >
        <div className="p-5 border-b border-blue-900 flex items-center justify-between">
          <div className="min-w-0">
            <div className="font-display font-bold text-base text-white truncate">
              অ্যাডমিন প্যানেল
            </div>
            <div className="text-xs text-blue-200 truncate">
              {ctx.adminProfile?.username || 'shoyaib'} · {ctx.user?.email}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-blue-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-500 text-blue-950 font-bold'
                  : 'text-blue-100 hover:bg-blue-900/70'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          {/* 20. Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-red-300 hover:bg-red-950/50 transition-colors mt-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>২০. লগআউট</span>
          </button>
        </nav>

        <div className="p-4 border-t border-blue-900">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-900 hover:bg-blue-800 text-xs font-semibold text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> মূল ওয়েবসাইট দেখুন
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-blue-950">
                  স্বাগতম, {ctx.adminProfile?.displayName || 'shoyaib'}
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">{ctx.settings.schoolName}</p>
              </div>
              {hasDemoFallback && (
                <button
                  type="button"
                  onClick={handleSeedDemo}
                  disabled={seeding}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap"
                >
                  <Database className="w-4 h-4" />
                  {seeding ? 'সংরক্ষণ হচ্ছে...' : 'ডাটাবেসে নমুনা তথ্য সংরক্ষণ করুন'}
                </button>
              )}
            </div>

            {/* 6 Animated Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                { label: 'মোট শিক্ষক', val: ctx.teachers.length, icon: GraduationCap, tab: 'teachers' as AdminTab },
                { label: 'মোট শিক্ষার্থী (শ্রেণিভিত্তিক)', val: totalStudentsCount, icon: Users, tab: 'students' as AdminTab },
                { label: 'মোট নোটিশ', val: ctx.notices.length, icon: Bell, tab: 'notices' as AdminTab },
                { label: 'মোট গ্যালারি ছবি', val: ctx.galleryPhotos.length, icon: Images, tab: 'photos' as AdminTab },
                { label: 'মোট সংবাদ', val: ctx.news.length, icon: Newspaper, tab: 'news' as AdminTab },
                { label: 'মোট যোগাযোগ বার্তা', val: ctx.contactMessages.length, icon: Mail, tab: 'messages' as AdminTab },
              ].map((card) => (
                <button
                  key={card.label}
                  type="button"
                  onClick={() => setActiveTab(card.tab)}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-500">{card.label}</div>
                    <div className="font-display font-bold text-3xl text-blue-950 mt-1">
                      <AnimatedCounter value={card.val} />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                    <card.icon className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Overview Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-blue-950">সাম্প্রতিক নোটিশ</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notices')}
                    className="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    সবগুলো পরিচালনা করুন
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {ctx.notices.slice(0, 4).map((n) => (
                    <div key={n.id} className="py-2.5 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-slate-800 truncate">{n.title}</span>
                      <span className="text-xs text-slate-500 tabular-nums shrink-0">
                        {n.publishDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-blue-950">
                    যোগাযোগ বার্তা ({toBengaliNumber(ctx.contactMessages.filter((m) => m.status === 'unread').length)} অপঠিত)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    ইনবক্স দেখুন
                  </button>
                </div>
                {ctx.contactMessages.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">এখনো কোনো বার্তা আসেনি।</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {ctx.contactMessages.slice(0, 4).map((m) => (
                      <div key={m.id} className="py-2.5 text-sm">
                        <div className="font-semibold text-slate-900 truncate">{m.subject}</div>
                        <div className="text-xs text-slate-500">{m.senderName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && <AdminSettingsModule mode="settings" onNotify={notify} />}
        {activeTab === 'logo' && <AdminSettingsModule mode="logo" onNotify={notify} />}
        {activeTab === 'schoolInfo' && <AdminSchoolInfoModule onNotify={notify} />}
        {activeTab === 'students' && <AdminStudentsModule onNotify={notify} />}
        {activeTab === 'messages' && <AdminMessagesModule onNotify={notify} />}
        {activeTab === 'users' && <AdminUsersModule onNotify={notify} />}
        {activeTab === 'password' && <AdminPasswordModule onNotify={notify} />}
        {activeTab === 'backup' && <AdminBackupModule onNotify={notify} />}

        {activeTab === 'sliders' && (
          <AdminGenericCrud
            title="হোমপেজ স্লাইডার ব্যবস্থাপনা"
            subtitle="হোমপেজের প্রধান স্লাইডারের ছবি, শিরোনাম, বাটন ও ক্রম নিয়ন্ত্রণ করুন।"
            collectionName="sliders"
            idPrefix="slider"
            items={ctx.sliders}
            fields={[
              { key: 'title', label: 'শিরোনাম *', type: 'text', required: true },
              { key: 'description', label: 'সংক্ষিপ্ত বিবরণ', type: 'textarea' },
              { key: 'imageUrl', label: 'স্লাইডারের ছবি *', type: 'image', required: true, folder: 'sliders' },
              { key: 'buttonText', label: 'বাটনের লেখা', type: 'text', placeholder: 'বিস্তারিত দেখুন' },
              { key: 'buttonLink', label: 'বাটনের লিংক', type: 'text', placeholder: '/about' },
              { key: 'order', label: 'প্রদর্শনের ক্রম (Order)', type: 'number', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ title: '', description: '', imageUrl: '', buttonText: '', buttonLink: '/about', order: ctx.sliders.length + 1, isActive: true }}
            primaryField="title"
            secondaryField="order"
            imageField="imageUrl"
            onNotify={notify}
          />
        )}

        {activeTab === 'teachers' && (
          <AdminGenericCrud
            title="শিক্ষক ব্যবস্থাপনা"
            subtitle="নতুন শিক্ষক যুক্ত, ছবি আপলোড, বক্তব্য, বাণী এবং ক্রম পরিবর্তন করুন।"
            collectionName="teachers"
            idPrefix="teacher"
            items={ctx.teachers}
            fields={[
              { key: 'name', label: 'শিক্ষকের পূর্ণ নাম *', type: 'text', required: true },
              { key: 'designation', label: 'পদবি *', type: 'text', required: true },
              { key: 'category', label: 'বিভাগ *', type: 'select', required: true, options: ['প্রধান শিক্ষক', 'সহকারী শিক্ষক', 'অন্যান্য শিক্ষক'] },
              { key: 'qualification', label: 'শিক্ষাগত যোগ্যতা', type: 'text' },
              { key: 'subject', label: 'পাঠদানের বিষয়', type: 'text' },
              { key: 'joiningDate', label: 'যোগদানের তারিখ', type: 'text' },
              { key: 'experience', label: 'অভিজ্ঞতা', type: 'text' },
              { key: 'photoUrl', label: 'শিক্ষকের ছবি (Portrait)', type: 'image', folder: 'teachers' },
              { key: 'shortBio', label: 'সংক্ষিপ্ত পরিচিতি', type: 'textarea' },
              { key: 'statement', label: 'শিক্ষকের বক্তব্য', type: 'textarea' },
              { key: 'quote', label: 'শিক্ষকের বাণী', type: 'text' },
              { key: 'order', label: 'প্রদর্শনের ক্রম', type: 'number', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{
              name: '',
              designation: 'সহকারী শিক্ষক',
              category: 'সহকারী শিক্ষক',
              qualification: '',
              subject: '',
              joiningDate: '',
              experience: '',
              photoUrl: '',
              shortBio: '',
              statement: '',
              quote: '',
              order: ctx.teachers.length + 1,
              isActive: true,
            }}
            filterKey="category"
            filterOptions={['প্রধান শিক্ষক', 'সহকারী শিক্ষক', 'অন্যান্য শিক্ষক']}
            primaryField="name"
            secondaryField="designation"
            imageField="photoUrl"
            onNotify={notify}
          />
        )}

        {activeTab === 'academics' && (
          <AdminGenericCrud
            title="একাডেমিক ব্যবস্থাপনা"
            subtitle="পাঠ্যক্রম, ক্লাস রুটিন, পরীক্ষার সময়সূচি ও ছুটির তালিকার নথি যুক্ত করুন।"
            collectionName="academics"
            idPrefix="acad"
            items={ctx.academics}
            fields={[
              { key: 'title', label: 'শিরোনাম *', type: 'text', required: true },
              {
                key: 'category',
                label: 'বিভাগ *',
                type: 'select',
                required: true,
                options: ['পাঠ্যক্রম', 'দৈনিক রুটিন', 'সাপ্তাহিক রুটিন', 'পরীক্ষার সময়সূচি', 'শিক্ষাবর্ষ', 'ছুটির তালিকা', 'পাঠদান কার্যক্রম', 'সহশিক্ষা কার্যক্রম'],
              },
              { key: 'className', label: 'শ্রেণি', type: 'text', placeholder: 'সকল শ্রেণি' },
              { key: 'academicYear', label: 'শিক্ষাবর্ষ', type: 'text', placeholder: '২০২৬' },
              { key: 'description', label: 'বিস্তারিত বিবরণ', type: 'textarea' },
              { key: 'fileType', label: 'ফাইলের ধরন *', type: 'select', required: true, options: ['pdf', 'image', 'doc', 'link', 'none'] },
              { key: 'fileUrl', label: 'PDF / ছবি / ডকুমেন্ট আপলোড বা লিংক', type: 'file', folder: 'academics' },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ title: '', category: 'পাঠ্যক্রম', className: 'সকল শ্রেণি', academicYear: '২০২৬', description: '', fileType: 'pdf', fileUrl: '', isActive: true }}
            filterKey="category"
            filterOptions={['পাঠ্যক্রম', 'দৈনিক রুটিন', 'সাপ্তাহিক রুটিন', 'পরীক্ষার সময়সূচি', 'শিক্ষাবর্ষ', 'ছুটির তালিকা', 'পাঠদান কার্যক্রম', 'সহশিক্ষা কার্যক্রম']}
            primaryField="title"
            secondaryField="category"
            onNotify={notify}
          />
        )}

        {activeTab === 'notices' && (
          <AdminGenericCrud
            title="নোটিশ ব্যবস্থাপনা"
            subtitle="বিদ্যালয়ের ডায়নামিক নোটিশ প্রকাশ, সম্পাদনা ও সংযুক্তি আপলোড করুন।"
            collectionName="notices"
            idPrefix="notice"
            items={ctx.notices}
            fields={[
              { key: 'title', label: 'নোটিশের শিরোনাম *', type: 'text', required: true },
              {
                key: 'category',
                label: 'ক্যাটাগরি *',
                type: 'select',
                required: true,
                options: ['সাধারণ নোটিশ', 'ভর্তি বিজ্ঞপ্তি', 'পরীক্ষার নোটিশ', 'ছুটির নোটিশ', 'অভিভাবক সভা', 'জরুরি নোটিশ'],
              },
              { key: 'publishDate', label: 'প্রকাশের তারিখ *', type: 'date', required: true },
              { key: 'description', label: 'বিস্তারিত বিবরণ *', type: 'textarea', required: true },
              { key: 'attachmentType', label: 'সংযুক্তির ধরন *', type: 'select', required: true, options: ['none', 'pdf', 'image'] },
              { key: 'attachmentUrl', label: 'নোটিশের ছবি বা PDF', type: 'file', folder: 'notices' },
              { key: 'isNew', label: 'NEW চিহ্ন দেখান', type: 'checkbox' },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{
              title: '',
              category: 'সাধারণ নোটিশ',
              publishDate: new Date().toISOString().slice(0, 10),
              description: '',
              attachmentType: 'none',
              attachmentUrl: '',
              isNew: true,
              isActive: true,
            }}
            filterKey="category"
            filterOptions={['সাধারণ নোটিশ', 'ভর্তি বিজ্ঞপ্তি', 'পরীক্ষার নোটিশ', 'ছুটির নোটিশ', 'অভিভাবক সভা', 'জরুরি নোটিশ']}
            primaryField="title"
            secondaryField="publishDate"
            onNotify={notify}
          />
        )}

        {activeTab === 'results' && (
          <AdminGenericCrud
            title="ফলাফল ব্যবস্থাপনা"
            subtitle="শ্রেণি ও শিক্ষাবর্ষ অনুযায়ী পরীক্ষার ফলাফলের PDF বা Excel ফাইল প্রকাশ করুন।"
            collectionName="results"
            idPrefix="result"
            items={ctx.results}
            fields={[
              { key: 'title', label: 'ফলাফলের শিরোনাম *', type: 'text', required: true },
              { key: 'className', label: 'শ্রেণি *', type: 'select', required: true, options: ['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি', 'সকল শ্রেণি'] },
              { key: 'academicYear', label: 'শিক্ষাবর্ষ *', type: 'text', required: true, placeholder: '২০২৬' },
              { key: 'examName', label: 'পরীক্ষার নাম *', type: 'text', required: true, placeholder: 'বার্ষিক পরীক্ষা' },
              { key: 'publishDate', label: 'প্রকাশের তারিখ *', type: 'date', required: true },
              { key: 'fileType', label: 'ফাইলের ধরন *', type: 'select', required: true, options: ['pdf', 'excel', 'link'] },
              { key: 'fileUrl', label: 'ফলাফলের PDF / Excel ফাইল', type: 'file', folder: 'results' },
              { key: 'summary', label: 'সংক্ষিপ্ত মন্তব্য', type: 'textarea' },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{
              title: '',
              className: 'পঞ্চম শ্রেণি',
              academicYear: '২০২৬',
              examName: 'বার্ষিক পরীক্ষা',
              publishDate: new Date().toISOString().slice(0, 10),
              fileType: 'pdf',
              fileUrl: '',
              summary: '',
              isActive: true,
            }}
            filterKey="className"
            filterOptions={['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি', 'সকল শ্রেণি']}
            primaryField="title"
            secondaryField="className"
            onNotify={notify}
          />
        )}

        {activeTab === 'photos' && (
          <AdminGenericCrud
            title="ফটো গ্যালারি ব্যবস্থাপনা"
            subtitle="বিদ্যালয়ের অনুষ্ঠানের ছবি আপলোড, ক্যাপশন ও ক্যাটাগরি পরিবর্তন করুন।"
            collectionName="galleryPhotos"
            idPrefix="photo"
            items={ctx.galleryPhotos}
            fields={[
              { key: 'title', label: 'ছবির শিরোনাম *', type: 'text', required: true },
              {
                key: 'category',
                label: 'ক্যাটাগরি *',
                type: 'select',
                required: true,
                options: ['বিদ্যালয়ের পরিবেশ', 'শিক্ষক ও শিক্ষার্থী', 'বার্ষিক ক্রীড়া প্রতিযোগিতা', 'জাতীয় দিবস', 'সাংস্কৃতিক অনুষ্ঠান', 'পুরস্কার বিতরণী', 'শিক্ষা কার্যক্রম', 'অন্যান্য অনুষ্ঠান'],
              },
              { key: 'imageUrl', label: 'ছবি আপলোড বা URL *', type: 'image', required: true, folder: 'gallery' },
              { key: 'caption', label: 'ক্যাপশন', type: 'textarea' },
              { key: 'order', label: 'ক্রম', type: 'number', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ title: '', category: 'বিদ্যালয়ের পরিবেশ', imageUrl: '', caption: '', order: ctx.galleryPhotos.length + 1, isActive: true }}
            filterKey="category"
            filterOptions={['বিদ্যালয়ের পরিবেশ', 'শিক্ষক ও শিক্ষার্থী', 'বার্ষিক ক্রীড়া প্রতিযোগিতা', 'জাতীয় দিবস', 'সাংস্কৃতিক অনুষ্ঠান', 'পুরস্কার বিতরণী', 'শিক্ষা কার্যক্রম', 'অন্যান্য অনুষ্ঠান']}
            primaryField="title"
            secondaryField="category"
            imageField="imageUrl"
            onNotify={notify}
          />
        )}

        {activeTab === 'videos' && (
          <AdminGenericCrud
            title="ভিডিও গ্যালারি ব্যবস্থাপনা"
            subtitle="YouTube ভিডিও লিংক যুক্ত ও পরিচালনা করুন।"
            collectionName="galleryVideos"
            idPrefix="video"
            items={ctx.galleryVideos}
            fields={[
              { key: 'title', label: 'ভিডিও শিরোনাম *', type: 'text', required: true },
              {
                key: 'category',
                label: 'ক্যাটাগরি *',
                type: 'select',
                required: true,
                options: ['বিদ্যালয়ের পরিবেশ', 'বার্ষিক ক্রীড়া প্রতিযোগিতা', 'জাতীয় দিবস', 'সাংস্কৃতিক অনুষ্ঠান', 'পুরস্কার বিতরণী', 'শিক্ষা কার্যক্রম', 'অন্যান্য অনুষ্ঠান'],
              },
              { key: 'videoUrl', label: 'YouTube ভিডিও লিংক *', type: 'text', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
              { key: 'description', label: 'বিবরণ', type: 'textarea' },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ title: '', category: 'জাতীয় দিবস', videoUrl: '', description: '', isActive: true }}
            primaryField="title"
            secondaryField="category"
            onNotify={notify}
          />
        )}

        {activeTab === 'news' && (
          <AdminGenericCrud
            title="সংবাদ ও কার্যক্রম ব্যবস্থাপনা"
            subtitle="বিদ্যালয়ের অনুষ্ঠান, ক্রীড়া ও জাতীয় দিবসের প্রতিবেদন প্রকাশ করুন।"
            collectionName="news"
            idPrefix="news"
            items={ctx.news}
            fields={[
              { key: 'title', label: 'সংবাদের শিরোনাম *', type: 'text', required: true },
              { key: 'category', label: 'বিভাগ *', type: 'text', required: true, placeholder: 'বার্ষিক ক্রীড়া প্রতিযোগিতা' },
              { key: 'publishDate', label: 'প্রকাশের তারিখ *', type: 'date', required: true },
              { key: 'author', label: 'প্রতিবেদক / লেখক', type: 'text', placeholder: 'বিদ্যালয় প্রশাসন' },
              { key: 'featuredImageUrl', label: 'প্রচ্ছদ ছবি', type: 'image', folder: 'news' },
              { key: 'summary', label: 'সংক্ষিপ্ত সারসংক্ষেপ', type: 'textarea' },
              { key: 'content', label: 'বিস্তারিত সংবাদ *', type: 'textarea', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{
              title: '',
              category: 'শিক্ষা কার্যক্রম',
              publishDate: new Date().toISOString().slice(0, 10),
              author: 'বিদ্যালয় প্রশাসন',
              featuredImageUrl: '',
              summary: '',
              content: '',
              isActive: true,
            }}
            primaryField="title"
            secondaryField="publishDate"
            imageField="featuredImageUrl"
            onNotify={notify}
          />
        )}

        {activeTab === 'pages' && (
          <AdminGenericCrud
            title="কাস্টম পেজ ব্যবস্থাপনা"
            subtitle="/page/[slug] ঠিকানায় নতুন তথ্যভিত্তিক পৃষ্ঠা তৈরি করুন।"
            collectionName="pages"
            idPrefix="page"
            items={ctx.pages}
            fields={[
              { key: 'slug', label: 'URL Slug (ইংরেজি অক্ষর/হাইফেন) *', type: 'text', required: true, placeholder: 'admission-rules' },
              { key: 'title', label: 'পৃষ্ঠার শিরোনাম *', type: 'text', required: true },
              { key: 'subtitle', label: 'উপ-শিরোনাম', type: 'text' },
              { key: 'content', label: 'মূল কনটেন্ট *', type: 'textarea', required: true },
              { key: 'order', label: 'ক্রম', type: 'number', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ slug: '', title: '', subtitle: '', content: '', order: ctx.pages.length + 1, isActive: true }}
            primaryField="title"
            secondaryField="slug"
            onNotify={notify}
          />
        )}

        {activeTab === 'menus' && (
          <AdminGenericCrud
            title="নেভিগেশন মেনু ব্যবস্থাপনা"
            subtitle="হেডারের মূল ও ড্রপডাউন মেনু লিংক নিয়ন্ত্রণ করুন।"
            collectionName="menus"
            idPrefix="menu"
            items={ctx.menus}
            fields={[
              { key: 'label', label: 'মেনু নাম *', type: 'text', required: true },
              { key: 'path', label: 'রুট পাথ *', type: 'text', required: true, placeholder: '/about' },
              { key: 'group', label: 'মেনু অবস্থান *', type: 'select', required: true, options: ['primary', 'more'] },
              { key: 'order', label: 'ক্রম *', type: 'number', required: true },
              { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
            ]}
            defaultValues={{ label: '', path: '/', group: 'more', order: ctx.menus.length + 1, isActive: true }}
            primaryField="label"
            secondaryField="path"
            onNotify={notify}
          />
        )}
      </main>

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
