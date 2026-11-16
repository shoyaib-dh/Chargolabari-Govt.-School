import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { OperationType } from '../types/school';
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
  DEFAULT_TEACHERS,
} from '../data/defaultDemoData';

const ALLOWED_KEYS: Record<string, string[]> = {
  settings: [
    'schoolName', 'address', 'phone', 'email', 'logoUrl', 'faviconUrl',
    'headerNotice', 'footerText', 'facebookUrl', 'youtubeUrl', 'mapEmbedUrl',
    'seoTitle', 'seoDescription', 'statStudents', 'statTeachers',
    'statClassrooms', 'statEstablishedYear', 'showWelcomeSection',
    'showStatsSection', 'showHeadmasterSection', 'showFeaturesSection',
    'showTeachersSection', 'showNoticesSection', 'showGallerySection',
    'showActivitiesSection', 'isDemoData',
  ],
  schoolInfo: [
    'history', 'introduction', 'establishmentHistory', 'aimsAndObjectives',
    'missionAndVision', 'infrastructure', 'facilities', 'achievements',
    'nationalDays', 'headmasterName', 'headmasterDesignation',
    'headmasterQualification', 'headmasterPhotoUrl', 'headmasterMessage',
    'headmasterQuote', 'headmasterSignature', 'welcomeImageUrl', 'isDemoContent',
  ],
  sliders: ['title', 'description', 'imageUrl', 'buttonText', 'buttonLink', 'order', 'isActive', 'isDemo'],
  teachers: [
    'name', 'designation', 'category', 'qualification', 'subject',
    'joiningDate', 'experience', 'shortBio', 'statement', 'quote',
    'photoUrl', 'order', 'isActive', 'isDemo',
  ],
  studentClasses: ['className', 'totalStudents', 'boysCount', 'girlsCount', 'classTeacher', 'academicYear', 'order', 'isActive', 'isDemo'],
  students: ['name', 'rollNumber', 'className', 'section', 'academicYear', 'guardianName', 'photoUrl', 'isPublicApproved', 'guardianConsent', 'isActive', 'isDemo'],
  academics: ['title', 'category', 'className', 'academicYear', 'description', 'fileUrl', 'fileType', 'isActive', 'isDemo'],
  notices: ['title', 'category', 'publishDate', 'description', 'attachmentUrl', 'attachmentType', 'isNew', 'isActive', 'isDemo'],
  results: ['title', 'className', 'academicYear', 'examName', 'publishDate', 'fileUrl', 'fileType', 'summary', 'isActive', 'isDemo'],
  galleryPhotos: ['title', 'caption', 'category', 'imageUrl', 'order', 'isActive', 'isDemo'],
  galleryVideos: ['title', 'category', 'videoUrl', 'thumbnailUrl', 'description', 'isActive', 'isDemo'],
  news: ['title', 'category', 'publishDate', 'author', 'featuredImageUrl', 'summary', 'content', 'isActive', 'isDemo'],
  pages: ['slug', 'title', 'subtitle', 'content', 'isActive', 'order'],
  menus: ['label', 'path', 'group', 'order', 'isActive'],
  contactMessages: ['senderName', 'phone', 'email', 'subject', 'message', 'status'],
  admins: ['uid', 'username', 'email', 'displayName', 'role', 'isActive'],
  adminInvites: ['username', 'email', 'role', 'isActive'],
};

function sanitizePayload(collectionName: string, data: Record<string, unknown>): Record<string, unknown> {
  const allowed = ALLOWED_KEYS[collectionName] || [];
  const clean: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in data && data[key] !== undefined) {
      clean[key] = data[key];
    }
  }
  return clean;
}

export function generateValidId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export async function saveDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
  isNew?: boolean
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  const clean = sanitizePayload(collectionName, data);
  try {
    let creating = isNew;
    if (creating === undefined) {
      const existingSnap = await getDoc(ref);
      creating = !existingSnap.exists();
    }
    if (creating) {
      await setDoc(ref, {
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        ...clean,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

export async function removeDocument(collectionName: string, docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}

export async function submitContactMessage(payload: {
  senderName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const id = generateValidId('msg');
  try {
    await setDoc(doc(db, 'contactMessages', id), {
      senderName: payload.senderName.trim().slice(0, 150),
      phone: payload.phone.trim().slice(0, 40),
      email: payload.email.trim().slice(0, 150),
      subject: payload.subject.trim().slice(0, 200),
      message: payload.message.trim().slice(0, 4000),
      status: 'unread',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `contactMessages/${id}`);
  }
}

export async function updateContactMessageStatus(
  messageId: string,
  status: 'unread' | 'read' | 'replied'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'contactMessages', messageId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${messageId}`);
  }
}

export async function seedAllDemoData(): Promise<void> {
  try {
    const batch = writeBatch(db);
    const ts = serverTimestamp();

    const setIfMissingOrReplace = (col: string, id: string, raw: Record<string, unknown>) => {
      const clean = sanitizePayload(col, raw);
      batch.set(doc(db, col, id), { ...clean, createdAt: ts, updatedAt: ts });
    };

    const settingsSnap = await getDoc(doc(db, 'settings', 'site'));
    if (!settingsSnap.exists()) {
      setIfMissingOrReplace('settings', 'site', DEFAULT_SITE_SETTINGS as unknown as Record<string, unknown>);
    }
    const infoSnap = await getDoc(doc(db, 'schoolInfo', 'about'));
    if (!infoSnap.exists()) {
      setIfMissingOrReplace('schoolInfo', 'about', DEFAULT_SCHOOL_INFO as unknown as Record<string, unknown>);
    }

    const seedList = async (col: string, items: Array<{ id: string } & Record<string, unknown>>) => {
      const snap = await getDocs(collection(db, col));
      if (snap.empty) {
        for (const item of items) {
          setIfMissingOrReplace(col, item.id, item);
        }
      }
    };

    await seedList('sliders', DEFAULT_SLIDERS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('teachers', DEFAULT_TEACHERS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('studentClasses', DEFAULT_STUDENT_CLASSES as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('academics', DEFAULT_ACADEMICS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('notices', DEFAULT_NOTICES as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('results', DEFAULT_RESULTS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('galleryPhotos', DEFAULT_GALLERY_PHOTOS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('galleryVideos', DEFAULT_GALLERY_VIDEOS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('news', DEFAULT_NEWS as unknown as Array<{ id: string } & Record<string, unknown>>);
    await seedList('menus', DEFAULT_MENUS as unknown as Array<{ id: string } & Record<string, unknown>>);

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seedAllDemoData');
  }
}
