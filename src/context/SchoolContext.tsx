import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  isTransientFirestoreError,
  testFirestoreConnection,
} from '../firebase';
import {
  AcademicItem,
  AdminInvite,
  AdminUser,
  ContactMessage,
  CustomPage,
  GalleryPhoto,
  GalleryVideo,
  MenuItem,
  NewsItem,
  Notice,
  OperationType,
  ResultItem,
  SchoolInfo,
  SiteSettings,
  SliderItem,
  Student,
  StudentClass,
  Teacher,
} from '../types/school';
import {
  DEFAULT_ACADEMICS,
  DEFAULT_GALLERY_PHOTOS,
  DEFAULT_GALLERY_VIDEOS,
  DEFAULT_MENUS,
  DEFAULT_NEWS,
  DEFAULT_NOTICES,
  DEFAULT_RESULTS,
  DEFAULT_SCHOOL_INFO,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SLIDERS,
  DEFAULT_STUDENT_CLASSES,
  DEFAULT_STUDENTS,
  DEFAULT_TEACHERS,
} from '../data/defaultDemoData';

const BOOTSTRAP_ADMIN_EMAIL = 'sheakhsohel307@gmail.com';

interface SchoolContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminProfile: AdminUser | null;
  loading: boolean;
  settings: SiteSettings;
  schoolInfo: SchoolInfo;
  sliders: SliderItem[];
  teachers: Teacher[];
  studentClasses: StudentClass[];
  students: Student[];
  academics: AcademicItem[];
  notices: Notice[];
  results: ResultItem[];
  galleryPhotos: GalleryPhoto[];
  galleryVideos: GalleryVideo[];
  news: NewsItem[];
  pages: CustomPage[];
  menus: MenuItem[];
  contactMessages: ContactMessage[];
  admins: AdminUser[];
  adminInvites: AdminInvite[];
  refreshAuthSession: () => Promise<void>;
  usingDemoFallback: {
    sliders: boolean;
    teachers: boolean;
    notices: boolean;
    galleryPhotos: boolean;
    news: boolean;
  };
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(DEFAULT_SCHOOL_INFO);
  const [rawSliders, setRawSliders] = useState<SliderItem[] | null>(null);
  const [rawTeachers, setRawTeachers] = useState<Teacher[] | null>(null);
  const [rawStudentClasses, setRawStudentClasses] = useState<StudentClass[] | null>(null);
  const [rawStudents, setRawStudents] = useState<Student[] | null>(null);
  const [rawAcademics, setRawAcademics] = useState<AcademicItem[] | null>(null);
  const [rawNotices, setRawNotices] = useState<Notice[] | null>(null);
  const [rawResults, setRawResults] = useState<ResultItem[] | null>(null);
  const [rawGalleryPhotos, setRawGalleryPhotos] = useState<GalleryPhoto[] | null>(null);
  const [rawGalleryVideos, setRawGalleryVideos] = useState<GalleryVideo[] | null>(null);
  const [rawNews, setRawNews] = useState<NewsItem[] | null>(null);
  const [rawPages, setRawPages] = useState<CustomPage[] | null>(null);
  const [rawMenus, setRawMenus] = useState<MenuItem[] | null>(null);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminInvites, setAdminInvites] = useState<AdminInvite[]>([]);

  // Initial connection test
  useEffect(() => {
    void testFirestoreConnection();
  }, []);

  const verifyAdminStatus = useCallback(
    async (currentUser: User | null, isMounted?: () => boolean) => {
      const stillMounted = () => (isMounted ? isMounted() : true);
      if (!currentUser) {
        if (!stillMounted()) return;
        setIsAdmin(false);
        setAdminProfile(null);
        return;
      }

      try {
        const adminRef = doc(db, 'admins', currentUser.uid);
        const adminSnap = await getDoc(adminRef);
        if (!stillMounted()) return;
        const normalizedEmail = (currentUser.email || '').toLowerCase();
        const isBootstrap =
          Boolean(currentUser.emailVerified) && normalizedEmail === BOOTSTRAP_ADMIN_EMAIL;

        if (adminSnap.exists()) {
          const data = adminSnap.data() as AdminUser;
          setAdminProfile({ ...data, id: adminSnap.id });
          setIsAdmin(Boolean(data.isActive) && Boolean(currentUser.emailVerified));
        } else if (isBootstrap) {
          const bootstrapProfile: AdminUser = {
            uid: currentUser.uid,
            username: 'shoyaib',
            email: currentUser.email || BOOTSTRAP_ADMIN_EMAIL,
            displayName: currentUser.displayName || 'প্রধান অ্যাডমিন (shoyaib)',
            role: 'super_admin',
            isActive: true,
          };
          try {
            await setDoc(adminRef, {
              ...bootstrapProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (writeErr) {
            if (!isTransientFirestoreError(writeErr)) {
              console.warn('Bootstrap admin profile sync warning:', writeErr);
            }
          }
          if (!stillMounted()) return;
          setAdminProfile({ ...bootstrapProfile, id: currentUser.uid });
          setIsAdmin(true);
        } else {
          setAdminProfile(null);
          setIsAdmin(false);
        }
      } catch (err) {
        if (!stillMounted()) return;
        if (!isTransientFirestoreError(err)) {
          console.error('Admin verification check error:', err);
        }
        setAdminProfile(null);
        setIsAdmin(false);
      }
    },
    []
  );

  const refreshAuthSession = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) {
      setUser(null);
      setIsAdmin(false);
      setAdminProfile(null);
      return;
    }
    await current.reload();
    await current.getIdToken(true);
    setUser(auth.currentUser);
    await verifyAdminStatus(auth.currentUser);
  }, [verifyAdminStatus]);

  // Auth listener & Admin RBAC check
  useEffect(() => {
    let mounted = true;
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!mounted) return;
      setUser(currentUser);
      await verifyAdminStatus(currentUser, () => mounted);
      if (mounted) {
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [verifyAdminStatus]);

  // Public + Role-aware Firestore subscriptions
  useEffect(() => {
    if (!authReady) return;

    const unsubscribers: Array<() => void> = [];
    const onListenerError = (err: unknown, op: OperationType, path: string) => {
      setLoading(false);
      if (isTransientFirestoreError(err)) {
        return;
      }
      handleFirestoreError(err, op, path);
    };

    // 1. Settings
    unsubscribers.push(
      onSnapshot(
        doc(db, 'settings', 'site'),
        (snap) => {
          if (snap.exists()) {
            setSettings({ ...DEFAULT_SITE_SETTINGS, ...(snap.data() as SiteSettings), id: snap.id });
          } else {
            setSettings(DEFAULT_SITE_SETTINGS);
          }
          setLoading(false);
        },
        (err) => onListenerError(err, OperationType.GET, 'settings/site')
      )
    );

    // 2. SchoolInfo
    unsubscribers.push(
      onSnapshot(
        doc(db, 'schoolInfo', 'about'),
        (snap) => {
          if (snap.exists()) {
            setSchoolInfo({ ...DEFAULT_SCHOOL_INFO, ...(snap.data() as SchoolInfo), id: snap.id });
          } else {
            setSchoolInfo(DEFAULT_SCHOOL_INFO);
          }
        },
        (err) => onListenerError(err, OperationType.GET, 'schoolInfo/about')
      )
    );

    const subscribePublicOrAdmin = <T extends { id: string }>(
      colName: string,
      setter: React.Dispatch<React.SetStateAction<T[] | null>>
    ) => {
      const refOrQuery = isAdmin
        ? collection(db, colName)
        : query(collection(db, colName), where('isActive', '==', true));

      unsubscribers.push(
        onSnapshot(
          refOrQuery,
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<T, 'id'>) }) as T);
            setter(list.length > 0 ? list : []);
          },
          (err) => onListenerError(err, OperationType.LIST, colName)
        )
      );
    };

    subscribePublicOrAdmin<SliderItem>('sliders', setRawSliders);
    subscribePublicOrAdmin<Teacher>('teachers', setRawTeachers);
    subscribePublicOrAdmin<StudentClass>('studentClasses', setRawStudentClasses);
    subscribePublicOrAdmin<AcademicItem>('academics', setRawAcademics);
    subscribePublicOrAdmin<Notice>('notices', setRawNotices);
    subscribePublicOrAdmin<ResultItem>('results', setRawResults);
    subscribePublicOrAdmin<GalleryPhoto>('galleryPhotos', setRawGalleryPhotos);
    subscribePublicOrAdmin<GalleryVideo>('galleryVideos', setRawGalleryVideos);
    subscribePublicOrAdmin<NewsItem>('news', setRawNews);
    subscribePublicOrAdmin<CustomPage>('pages', setRawPages);
    subscribePublicOrAdmin<MenuItem>('menus', setRawMenus);

    // Students (strict privacy gate for public queries)
    const studentQuery = isAdmin
      ? collection(db, 'students')
      : query(
          collection(db, 'students'),
          where('isActive', '==', true),
          where('isPublicApproved', '==', true),
          where('guardianConsent', '==', true)
        );
    unsubscribers.push(
      onSnapshot(
        studentQuery,
        (snap) => {
          setRawStudents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, 'id'>) })));
        },
        (err) => onListenerError(err, OperationType.LIST, 'students')
      )
    );

    // Admin-only collections
    if (isAdmin) {
      unsubscribers.push(
        onSnapshot(
          collection(db, 'contactMessages'),
          (snap) => {
            setContactMessages(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }))
            );
          },
          (err) => onListenerError(err, OperationType.LIST, 'contactMessages')
        )
      );
      unsubscribers.push(
        onSnapshot(
          collection(db, 'admins'),
          (snap) => {
            setAdmins(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminUser, 'id'>) })));
          },
          (err) => onListenerError(err, OperationType.LIST, 'admins')
        )
      );
      unsubscribers.push(
        onSnapshot(
          collection(db, 'adminInvites'),
          (snap) => {
            setAdminInvites(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminInvite, 'id'>) }))
            );
          },
          (err) => onListenerError(err, OperationType.LIST, 'adminInvites')
        )
      );
    } else {
      setContactMessages([]);
      setAdmins([]);
      setAdminInvites([]);
    }

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
  }, [authReady, isAdmin]);

  // Dynamic SEO title & meta sync
  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && settings.seoDescription) {
      descMeta.setAttribute('content', settings.seoDescription);
    }
    if (settings.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  }, [settings.seoTitle, settings.seoDescription, settings.faviconUrl]);

  const sortByOrder = <T extends { order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const sortByDateDesc = <T extends { publishDate?: string }>(arr: T[]) =>
    [...arr].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));

  const sliders = rawSliders && rawSliders.length > 0 ? sortByOrder(rawSliders) : DEFAULT_SLIDERS;
  const teachers = rawTeachers && rawTeachers.length > 0 ? sortByOrder(rawTeachers) : DEFAULT_TEACHERS;
  const studentClasses =
    rawStudentClasses && rawStudentClasses.length > 0
      ? sortByOrder(rawStudentClasses)
      : DEFAULT_STUDENT_CLASSES;
  const students = rawStudents || DEFAULT_STUDENTS;
  const academics = rawAcademics && rawAcademics.length > 0 ? rawAcademics : DEFAULT_ACADEMICS;
  const notices = rawNotices && rawNotices.length > 0 ? sortByDateDesc(rawNotices) : DEFAULT_NOTICES;
  const results = rawResults && rawResults.length > 0 ? sortByDateDesc(rawResults) : DEFAULT_RESULTS;
  const galleryPhotos =
    rawGalleryPhotos && rawGalleryPhotos.length > 0
      ? sortByOrder(rawGalleryPhotos)
      : DEFAULT_GALLERY_PHOTOS;
  const galleryVideos =
    rawGalleryVideos && rawGalleryVideos.length > 0 ? rawGalleryVideos : DEFAULT_GALLERY_VIDEOS;
  const news = rawNews && rawNews.length > 0 ? sortByDateDesc(rawNews) : DEFAULT_NEWS;
  const pages = rawPages ? sortByOrder(rawPages) : [];
  const menus = rawMenus && rawMenus.length > 0 ? sortByOrder(rawMenus) : DEFAULT_MENUS;

  const value: SchoolContextValue = {
    user,
    authReady,
    isAdmin,
    adminProfile,
    loading,
    settings,
    schoolInfo,
    sliders,
    teachers,
    studentClasses,
    students,
    academics,
    notices,
    results,
    galleryPhotos,
    galleryVideos,
    news,
    pages,
    menus,
    contactMessages,
    admins,
    adminInvites,
    refreshAuthSession,
    usingDemoFallback: {
      sliders: !rawSliders || rawSliders.length === 0,
      teachers: !rawTeachers || rawTeachers.length === 0,
      notices: !rawNotices || rawNotices.length === 0,
      galleryPhotos: !rawGalleryPhotos || rawGalleryPhotos.length === 0,
      news: !rawNews || rawNews.length === 0,
    },
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within SchoolProvider');
  return ctx;
}
