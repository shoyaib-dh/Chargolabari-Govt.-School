export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SiteSettings {
  id?: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  faviconUrl: string;
  headerNotice: string;
  footerText: string;
  facebookUrl: string;
  youtubeUrl: string;
  mapEmbedUrl: string;
  seoTitle: string;
  seoDescription: string;
  statStudents: string;
  statTeachers: string;
  statClassrooms: string;
  statEstablishedYear: string;
  showWelcomeSection: boolean;
  showStatsSection: boolean;
  showHeadmasterSection: boolean;
  showFeaturesSection: boolean;
  showTeachersSection: boolean;
  showNoticesSection: boolean;
  showGallerySection: boolean;
  showActivitiesSection: boolean;
  isDemoData: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SchoolInfo {
  id?: string;
  history: string;
  introduction: string;
  establishmentHistory: string;
  aimsAndObjectives: string;
  missionAndVision: string;
  infrastructure: string;
  facilities: string;
  achievements: string;
  nationalDays: string;
  headmasterName: string;
  headmasterDesignation: string;
  headmasterQualification: string;
  headmasterPhotoUrl: string;
  headmasterMessage: string;
  headmasterQuote: string;
  headmasterSignature: string;
  welcomeImageUrl: string;
  isDemoContent: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SliderItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type TeacherCategory = 'প্রধান শিক্ষক' | 'সহকারী শিক্ষক' | 'অন্যান্য শিক্ষক';

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  category: TeacherCategory;
  qualification: string;
  subject: string;
  joiningDate: string;
  experience: string;
  shortBio: string;
  statement: string;
  quote: string;
  photoUrl: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StudentClass {
  id: string;
  className: string;
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
  classTeacher: string;
  academicYear: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  academicYear: string;
  guardianName: string;
  photoUrl: string;
  isPublicApproved: boolean;
  guardianConsent: boolean;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AcademicItem {
  id: string;
  title: string;
  category: string;
  className: string;
  academicYear: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'doc' | 'link' | 'none';
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Notice {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  description: string;
  attachmentUrl: string;
  attachmentType: 'none' | 'pdf' | 'image';
  isNew: boolean;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ResultItem {
  id: string;
  title: string;
  className: string;
  academicYear: string;
  examName: string;
  publishDate: string;
  fileUrl: string;
  fileType: 'pdf' | 'excel' | 'link';
  summary: string;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GalleryVideo {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  author: string;
  featuredImageUrl: string;
  summary: string;
  content: string;
  isActive: boolean;
  isDemo?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  isActive: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  group: 'primary' | 'more';
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminUser {
  id?: string;
  uid: string;
  username: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminInvite {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}
