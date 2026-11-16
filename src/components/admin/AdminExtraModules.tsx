import React, { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import {
  CheckCircle2,
  Download,
  KeyRound,
  Mail,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { auth } from '../../firebase';
import { useSchool } from '../../context/SchoolContext';
import {
  generateValidId,
  removeDocument,
  saveDocument,
  updateContactMessageStatus,
} from '../../services/firestoreService';
import { AssetUploadField } from './AssetUploadField';
import { AdminGenericCrud, FieldConfig } from './AdminGenericCrud';
import { ConfirmDialog } from '../Toast';
import { SchoolInfo, SiteSettings } from '../../types/school';

type NotifyFn = (type: 'success' | 'error' | 'info', text: string) => void;

export function AdminSettingsModule({
  mode,
  onNotify,
}: {
  mode: 'settings' | 'logo';
  onNotify: NotifyFn;
}) {
  const { settings } = useSchool();
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDocument('settings', 'site', { ...form, isDemoData: false } as unknown as Record<string, unknown>);
      onNotify('success', 'ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।');
    } catch (err) {
      onNotify('error', err instanceof Error ? err.message : 'সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'logo') {
    return (
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display font-bold text-2xl text-blue-950">লোগো ও ফ্যাভিকন</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            বিদ্যালয়ের লোগো এবং ব্রাউজার ট্যাব আইকন (Favicon) পরিবর্তন করুন।
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <AssetUploadField
            label="বিদ্যালয়ের লোগো"
            value={form.logoUrl}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            folder="branding"
            isImage
          />
          <AssetUploadField
            label="ওয়েবসাইট ফ্যাভিকন (Favicon)"
            value={form.faviconUrl}
            onChange={(url) => setForm({ ...form, faviconUrl: url })}
            folder="branding"
            isImage
          />
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg"
            >
              <Save className="w-4 h-4" /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-blue-950">ওয়েবসাইট সেটিংস</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            বিদ্যালয়ের মৌলিক তথ্য, যোগাযোগ, পরিসংখ্যান, হোমপেজ সেকশন এবং SEO নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg whitespace-nowrap"
        >
          <Save className="w-4 h-4" /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">বিদ্যালয়ের নাম *</label>
          <input
            type="text"
            required
            value={form.schoolName}
            onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">ঠিকানা *</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">মোবাইল নম্বর</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">ইমেইল</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">হেডার নোটিশ বার্তা</label>
          <input
            type="text"
            value={form.headerNotice}
            onChange={(e) => setForm({ ...form, headerNotice: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">ফুটার পরিচিতি লেখা</label>
          <textarea
            rows={2}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Homepage Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-blue-950">হোমপেজ পরিসংখ্যান কার্ড</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">মোট শিক্ষার্থী</label>
            <input
              type="text"
              value={form.statStudents}
              onChange={(e) => setForm({ ...form, statStudents: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">মোট শিক্ষক</label>
            <input
              type="text"
              value={form.statTeachers}
              onChange={(e) => setForm({ ...form, statTeachers: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">মোট শ্রেণিকক্ষ</label>
            <input
              type="text"
              value={form.statClassrooms}
              onChange={(e) => setForm({ ...form, statClassrooms: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">প্রতিষ্ঠার সাল</label>
            <input
              type="text"
              value={form.statEstablishedYear}
              onChange={(e) => setForm({ ...form, statEstablishedYear: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Social, Map, SEO */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Facebook পেজ URL</label>
          <input
            type="text"
            value={form.facebookUrl}
            onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">YouTube চ্যানেল URL</label>
          <input
            type="text"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Google Map Embed URL</label>
          <input
            type="text"
            value={form.mapEmbedUrl}
            onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">SEO Title</label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">SEO Description</label>
          <textarea
            rows={2}
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Homepage Sections Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-blue-950">হোমপেজ সেকশন প্রদর্শন নিয়ন্ত্রণ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {[
            ['showWelcomeSection', 'স্বাগতম সেকশন'],
            ['showStatsSection', 'পরিসংখ্যান কার্ড'],
            ['showHeadmasterSection', 'প্রধান শিক্ষকের বাণী'],
            ['showFeaturesSection', 'বিদ্যালয়ের বিশেষত্ব'],
            ['showTeachersSection', 'শিক্ষক প্রিভিউ'],
            ['showNoticesSection', 'নোটিশ বোর্ড'],
            ['showGallerySection', 'ফটো গ্যালারি প্রিভিউ'],
            ['showActivitiesSection', 'সাম্প্রতিক কার্যক্রম'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean((form as unknown as Record<string, unknown>)[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="w-4 h-4 text-blue-900 rounded"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}

export function AdminSchoolInfoModule({ onNotify }: { onNotify: NotifyFn }) {
  const { schoolInfo } = useSchool();
  const [form, setForm] = useState<SchoolInfo>({ ...schoolInfo });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDocument('schoolInfo', 'about', {
        ...form,
        isDemoContent: false,
      } as unknown as Record<string, unknown>);
      onNotify('success', 'বিদ্যালয়ের তথ্য ও প্রধান শিক্ষকের বাণী সংরক্ষণ করা হয়েছে।');
    } catch (err) {
      onNotify('error', err instanceof Error ? err.message : 'সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-blue-950">বিদ্যালয়ের তথ্য ও বাণী</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            "আমাদের বিদ্যালয়" পৃষ্ঠার ৯টি বিভাগ ও প্রধান শিক্ষকের বাণী এখান থেকে সম্পাদনা করুন।
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg whitespace-nowrap"
        >
          <Save className="w-4 h-4" /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
        </button>
      </div>

      {/* Headmaster Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-blue-950">প্রধান শিক্ষকের প্রোফাইল ও বাণী</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">প্রধান শিক্ষকের নাম *</label>
            <input
              type="text"
              required
              value={form.headmasterName}
              onChange={(e) => setForm({ ...form, headmasterName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">পদবি</label>
            <input
              type="text"
              value={form.headmasterDesignation}
              onChange={(e) => setForm({ ...form, headmasterDesignation: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              value={form.headmasterQualification}
              onChange={(e) => setForm({ ...form, headmasterQualification: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">স্বাক্ষর / সিগনেচার স্টাইল</label>
            <input
              type="text"
              value={form.headmasterSignature}
              onChange={(e) => setForm({ ...form, headmasterSignature: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <AssetUploadField
              label="প্রধান শিক্ষকের ছবি"
              value={form.headmasterPhotoUrl}
              onChange={(url) => setForm({ ...form, headmasterPhotoUrl: url })}
              folder="headmaster"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">প্রধান শিক্ষকের উক্তি (Quote)</label>
            <input
              type="text"
              value={form.headmasterQuote}
              onChange={(e) => setForm({ ...form, headmasterQuote: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">বিস্তারিত বক্তব্য</label>
            <textarea
              rows={4}
              value={form.headmasterMessage}
              onChange={(e) => setForm({ ...form, headmasterMessage: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <AssetUploadField
              label="স্বাগতম সেকশনের বিদ্যালয়ের ছবি"
              value={form.welcomeImageUrl}
              onChange={(url) => setForm({ ...form, welcomeImageUrl: url })}
              folder="school"
            />
          </div>
        </div>
      </div>

      {/* 9 About Sections */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <h2 className="font-display font-bold text-lg text-blue-950">বিদ্যালয়ের ৯টি বিস্তারিত বিভাগ</h2>
        {[
          ['history', '১. বিদ্যালয়ের ইতিহাস'],
          ['introduction', '২. বিদ্যালয়ের পরিচিতি'],
          ['establishmentHistory', '৩. প্রতিষ্ঠার ইতিহাস ও সাল'],
          ['aimsAndObjectives', '৪. বিদ্যালয়ের লক্ষ্য ও উদ্দেশ্য'],
          ['missionAndVision', '৫. বিদ্যালয়ের মিশন ও ভিশন'],
          ['infrastructure', '৬. বিদ্যালয়ের অবকাঠামো'],
          ['facilities', '৭. বিদ্যালয়ের সুযোগ-সুবিধা'],
          ['achievements', '৮. বিদ্যালয়ের অর্জন ও সাফল্য'],
          ['nationalDays', '৯. জাতীয় দিবস ও বিশেষ কার্যক্রম'],
        ].map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">{label}</label>
            <textarea
              rows={3}
              required={key === 'history' || key === 'introduction'}
              value={String((form as unknown as Record<string, unknown>)[key] || '')}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        ))}
      </div>
    </form>
  );
}

export function AdminStudentsModule({ onNotify }: { onNotify: NotifyFn }) {
  const { studentClasses, students } = useSchool();
  const [tab, setTab] = useState<'classes' | 'records'>('classes');

  const classFields: FieldConfig[] = [
    { key: 'className', label: 'শ্রেণির নাম', type: 'select', required: true, options: ['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি'] },
    { key: 'totalStudents', label: 'মোট শিক্ষার্থী সংখ্যা', type: 'number', required: true },
    { key: 'boysCount', label: 'ছাত্র সংখ্যা', type: 'number' },
    { key: 'girlsCount', label: 'ছাত্রী সংখ্যা', type: 'number' },
    { key: 'classTeacher', label: 'শ্রেণি শিক্ষক', type: 'text' },
    { key: 'academicYear', label: 'শিক্ষাবর্ষ', type: 'text', placeholder: '২০২৬' },
    { key: 'order', label: 'ক্রম (Order)', type: 'number', required: true },
    { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
  ];

  const studentFields: FieldConfig[] = [
    { key: 'name', label: 'শিক্ষার্থীর নাম', type: 'text', required: true },
    { key: 'rollNumber', label: 'রোল নম্বর', type: 'text', required: true },
    { key: 'className', label: 'শ্রেণি', type: 'select', required: true, options: ['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি'] },
    { key: 'section', label: 'শাখা', type: 'text', placeholder: 'ক' },
    { key: 'academicYear', label: 'শিক্ষাবর্ষ', type: 'text', placeholder: '২০২৬' },
    { key: 'guardianName', label: 'অভিভাবকের নাম', type: 'text' },
    { key: 'photoUrl', label: 'শিক্ষার্থীর ছবি (সতর্কতা: অভিভাবকের সম্মতি আবশ্যক)', type: 'image', folder: 'students' },
    { key: 'guardianConsent', label: 'অভিভাবকের লিখিত/মৌখিক সম্মতি রয়েছে', type: 'checkbox' },
    { key: 'isPublicApproved', label: 'পাবলিক ওয়েবসাইটে প্রকাশের জন্য অ্যাডমিন অনুমোদিত', type: 'checkbox' },
    { key: 'isActive', label: 'সক্রিয় রাখুন', type: 'checkbox' },
  ];

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setTab('classes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'classes' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-700'
          }`}
        >
          শ্রেণিভিত্তিক পরিসংখ্যান
        </button>
        <button
          type="button"
          onClick={() => setTab('records')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'records' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-700'
          }`}
        >
          ব্যক্তিগত শিক্ষার্থী রেকর্ড (অনুমোদনসহ)
        </button>
      </div>

      {tab === 'classes' ? (
        <AdminGenericCrud
          title="শ্রেণিভিত্তিক শিক্ষার্থী সংখ্যা"
          subtitle="প্রথম থেকে পঞ্চম শ্রেণির মোট শিক্ষার্থী ও শ্রেণি শিক্ষকের তথ্য পরিচালনা করুন।"
          collectionName="studentClasses"
          idPrefix="class"
          items={studentClasses}
          fields={classFields}
          defaultValues={{
            className: 'প্রথম শ্রেণি',
            totalStudents: 0,
            boysCount: 0,
            girlsCount: 0,
            classTeacher: '',
            academicYear: '২০২৬',
            order: studentClasses.length + 1,
            isActive: true,
          }}
          primaryField="className"
          secondaryField="totalStudents"
          onNotify={onNotify}
        />
      ) : (
        <AdminGenericCrud
          title="ব্যক্তিগত শিক্ষার্থী ব্যবস্থাপনা"
          subtitle="অপ্রাপ্তবয়স্ক শিক্ষার্থীদের ব্যক্তিগত তথ্য কেবল 'অভিভাবকের সম্মতি' ও 'অ্যাডমিন অনুমোদন' সক্রিয় থাকলেই পাবলিক ওয়েবসাইটে দেখাবে।"
          collectionName="students"
          idPrefix="student"
          items={students}
          fields={studentFields}
          defaultValues={{
            name: '',
            rollNumber: '',
            className: 'প্রথম শ্রেণি',
            section: '',
            academicYear: '২০২৬',
            guardianName: '',
            photoUrl: '',
            guardianConsent: false,
            isPublicApproved: false,
            isActive: true,
          }}
          filterKey="className"
          filterOptions={['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি']}
          primaryField="name"
          secondaryField="className"
          imageField="photoUrl"
          onNotify={onNotify}
        />
      )}
    </div>
  );
}

export function AdminMessagesModule({ onNotify }: { onNotify: NotifyFn }) {
  const { contactMessages } = useSchool();
  const [filter, setFilter] = useState('সকল');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = contactMessages.filter((m) =>
    filter === 'সকল' ? true : m.status === filter
  );

  const handleStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      await updateContactMessageStatus(id, status);
      onNotify('success', 'বার্তার অবস্থা হালনাগাদ হয়েছে।');
    } catch {
      onNotify('error', 'হালনাগাদ করা যায়নি।');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-blue-950">যোগাযোগ বার্তা</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            ওয়েবসাইটের যোগাযোগ ফর্ম থেকে প্রেরিত সকল বার্তা এখানে সংরক্ষিত থাকে।
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
        >
          <option value="সকল">সকল বার্তা</option>
          <option value="unread">অপঠিত</option>
          <option value="read">পঠিত</option>
          <option value="replied">উত্তর দেওয়া হয়েছে</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
          <Mail className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-medium text-slate-600">কোনো যোগাযোগ বার্তা নেই</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500">
                    প্রেরক: <span className="font-semibold text-slate-900">{msg.senderName}</span>
                    {msg.phone ? ` · মোবাইল: ${msg.phone}` : ''}
                    {msg.email ? ` · ইমেইল: ${msg.email}` : ''}
                  </div>
                  <h2 className="font-display font-bold text-lg text-blue-950 mt-1">
                    {msg.subject}
                  </h2>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded ${
                    msg.status === 'unread'
                      ? 'bg-amber-100 text-amber-900'
                      : msg.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {msg.status === 'unread'
                    ? 'অপঠিত'
                    : msg.status === 'replied'
                      ? 'উত্তর দেওয়া হয়েছে'
                      : 'পঠিত'}
                </span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {msg.message}
              </p>
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStatus(msg.id, 'read')}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
                >
                  পঠিত চিহ্নিত করুন
                </button>
                <button
                  type="button"
                  onClick={() => handleStatus(msg.id, 'replied')}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg"
                >
                  উত্তর সম্পন্ন
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(msg.id)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="বার্তা মুছে ফেলুন"
        description="আপনি কি এই যোগাযোগ বার্তাটি স্থায়ীভাবে মুছে ফেলতে চান?"
        onConfirm={async () => {
          if (deleteId) {
            await removeDocument('contactMessages', deleteId);
            onNotify('success', 'বার্তাটি মুছে ফেলা হয়েছে।');
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export function AdminUsersModule({ onNotify }: { onNotify: NotifyFn }) {
  const { admins, adminInvites } = useSchool();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'editor'>('admin');
  const [saving, setSaving] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    setSaving(true);
    try {
      const id = generateValidId('invite');
      await saveDocument('adminInvites', id, {
        username: username.trim(),
        email: email.trim(),
        role,
        isActive: true,
      }, true);
      onNotify('success', 'নতুন অ্যাডমিন আমন্ত্রণ সংরক্ষণ করা হয়েছে।');
      setUsername('');
      setEmail('');
    } catch {
      onNotify('error', 'আমন্ত্রণ যোগ করা যায়নি।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-blue-950">ইউজার ব্যবস্থাপনা (RBAC)</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          অ্যাডমিন ও এডিটর অ্যাকাউন্ট এবং রোল-ভিত্তিক অনুমতি পরিচালনা করুন।
        </p>
      </div>

      {/* Add Invite */}
      <form onSubmit={handleInvite} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-900" /> নতুন অ্যাডমিন/এডিটর যুক্ত করুন
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ইউজারনেম (যেমন: shoyaib)"
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Google ইমেইল"
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'super_admin' | 'admin' | 'editor')}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
          >
            <option value="super_admin">সুপার অ্যাডমিন</option>
            <option value="admin">অ্যাডমিন</option>
            <option value="editor">এডিটর</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" /> {saving ? 'যুক্ত হচ্ছে...' : 'অ্যাডমিন যুক্ত করুন'}
        </button>
      </form>

      {/* Active Admins List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-base text-slate-900">সক্রিয় অ্যাডমিন তালিকা</h2>
        <div className="divide-y divide-slate-100">
          {admins.map((a) => (
            <div key={a.uid} className="py-3 flex items-center justify-between gap-3 text-sm">
              <div>
                <div className="font-semibold text-slate-900">
                  {a.displayName || a.username} ({a.username})
                </div>
                <div className="text-xs text-slate-500">
                  {a.email} · রোল: {a.role}
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> {a.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </span>
            </div>
          ))}
        </div>

        {adminInvites.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500">আমন্ত্রিত ইউজার রেকর্ড</h3>
            {adminInvites.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg"
              >
                <span>
                  {inv.username} · {inv.email} ({inv.role})
                </span>
                <button
                  type="button"
                  onClick={() => removeDocument('adminInvites', inv.id)}
                  className="text-red-600 hover:underline"
                >
                  মুছুন
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminPasswordModule({ onNotify }: { onNotify: NotifyFn }) {
  const { user, adminProfile } = useSchool();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const isPasswordProvider = user?.providerData.some((p) => p.providerId === 'password');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (newPassword.length < 8) {
      onNotify('error', 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      onNotify('error', 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।');
      return;
    }
    setBusy(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onNotify('success', 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
    } catch {
      onNotify('error', 'বর্তমান পাসওয়ার্ড সঠিক নয় অথবা পুনরায় লগইন প্রয়োজন।');
    } finally {
      setBusy(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      onNotify('success', `${user.email} ঠিকানায় পাসওয়ার্ড রিসেট/সেট লিংক পাঠানো হয়েছে।`);
    } catch {
      onNotify('error', 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো যায়নি।');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-blue-950">পাসওয়ার্ড পরিবর্তন ও নিরাপত্তা</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          অ্যাকাউন্ট ইউজারনেম: <span className="font-semibold text-slate-800">{adminProfile?.username || 'shoyaib'}</span> · ইমেইল: {user?.email}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 leading-relaxed">
          নিরাপত্তা নীতি: সোর্স কোড বা ডাটাবেসে কোনো প্লেইন-টেক্সট পাসওয়ার্ড সংরক্ষণ করা হয় না। সমস্ত পাসওয়ার্ড পরিবর্তন Firebase Authentication-এর এনক্রিপ্টেড ব্যবস্থায় সম্পন্ন হয়।
        </div>

        {isPasswordProvider ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">বর্তমান পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg"
            >
              <KeyRound className="w-4 h-4" /> পাসওয়ার্ড পরিবর্তন করুন
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              আপনি বর্তমানে Google Sign-In ব্যবহার করে লগইন করেছেন। ইমেইল/পাসওয়ার্ড দিয়েও লগইন করার জন্য নিচের বাটনে ক্লিক করে আপনার ইমেইলে পাসওয়ার্ড সেট/রিসেট লিংক পাঠাতে পারেন।
            </p>
            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> পাসওয়ার্ড সেট/রিসেট ইমেইল পাঠান
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminBackupModule({ onNotify }: { onNotify: NotifyFn }) {
  const ctx = useSchool();

  const handleExportJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      schoolName: ctx.settings.schoolName,
      settings: ctx.settings,
      schoolInfo: ctx.schoolInfo,
      sliders: ctx.sliders,
      teachers: ctx.teachers,
      studentClasses: ctx.studentClasses,
      students: ctx.students,
      academics: ctx.academics,
      notices: ctx.notices,
      results: ctx.results,
      galleryPhotos: ctx.galleryPhotos,
      galleryVideos: ctx.galleryVideos,
      news: ctx.news,
      pages: ctx.pages,
      menus: ctx.menus,
      contactMessages: ctx.contactMessages,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chargolabari-school-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('success', 'সম্পূর্ণ ওয়েবসাইটের ব্যাকআপ ফাইল ডাউনলোড হয়েছে।');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-blue-950">ব্যাকআপ ও এক্সপোর্ট</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          বিদ্যালয়ের সকল তথ্য নিরাপদ সংরক্ষণের জন্য JSON ফরম্যাটে ডাউনলোড করুন।
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          এই ব্যাকআপে ওয়েবসাইট সেটিংস, বিদ্যালয়ের তথ্য, শিক্ষক, শিক্ষার্থী, নোটিশ, ফলাফল, গ্যালারি, সংবাদ এবং যোগাযোগ বার্তার পূর্ণাঙ্গ কপি অন্তর্ভুক্ত থাকবে।
        </p>
        <button
          type="button"
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg"
        >
          <Download className="w-4 h-4" /> সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড (JSON)
        </button>
      </div>
    </div>
  );
}
