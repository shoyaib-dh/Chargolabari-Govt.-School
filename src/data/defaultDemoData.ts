import {
  AcademicItem,
  GalleryPhoto,
  GalleryVideo,
  MenuItem,
  NewsItem,
  Notice,
  ResultItem,
  SchoolInfo,
  SiteSettings,
  SliderItem,
  Student,
  StudentClass,
  Teacher,
} from '../types/school';

export const IMG_CAMPUS = '/src/assets/images/school_hero_campus_1794824845922.jpg';
export const IMG_CLASSROOM = '/src/assets/images/school_hero_classroom_1794824847071.jpg';
export const IMG_LIBRARY = '/src/assets/images/school_hero_library_activity_1794824846808.jpg';
export const IMG_HEADMASTER = '/src/assets/images/school_headmaster_portrait_1794824846773.jpg';
export const IMG_SPORTS = '/src/assets/images/school_gallery_sports_1794824847626.jpg';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'site',
  schoolName: '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয়',
  address: 'চরগোলাবাড়ী, মাদারগঞ্জ, জামালপুর, বাংলাদেশ',
  phone: '০১XXXXXXXXX (নমুনা নম্বর — অ্যাডমিন থেকে পরিবর্তনযোগ্য)',
  email: 'info@chargolabari-gps.demo (নমুনা ইমেইল)',
  logoUrl: '',
  faviconUrl: '',
  headerNotice: 'জরুরি ঘোষণা (নমুনা): ২০২৬ শিক্ষাবর্ষের পাঠদান ও ভর্তি সংক্রান্ত তথ্য অ্যাডমিন প্যানেল থেকে হালনাগাদ করুন।',
  footerText: '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয় — শিশুদের মানসম্মত প্রাথমিক শিক্ষা ও নৈতিক বিকাশে প্রতিশ্রুতিবদ্ধ একটি সরকারি শিক্ষা প্রতিষ্ঠান।',
  facebookUrl: '',
  youtubeUrl: '',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Madarganj,Jamalpur,Bangladesh&t=&z=13&ie=UTF8&iwloc=&output=embed',
  seoTitle: '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয় | মাদারগঞ্জ, জামালপুর',
  seoDescription: '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয় (চরগোলাবাড়ী, মাদারগঞ্জ, জামালপুর)-এর অফিসিয়াল ওয়েবসাইট।',
  statStudents: '২৫০+ (নমুনা)',
  statTeachers: '০৬ জন (নমুনা)',
  statClassrooms: '০৫টি (নমুনা)',
  statEstablishedYear: 'তথ্য যোগ করুন',
  showWelcomeSection: true,
  showStatsSection: true,
  showHeadmasterSection: true,
  showFeaturesSection: true,
  showTeachersSection: true,
  showNoticesSection: true,
  showGallerySection: true,
  showActivitiesSection: true,
  isDemoData: true,
};

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  id: 'about',
  history:
    '[নমুনা ও সম্পাদনাযোগ্য তথ্য] ৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয় জামালপুর জেলার মাদারগঞ্জ উপজেলার চরগোলাবাড়ী এলাকায় প্রাথমিক শিক্ষা বিস্তারের লক্ষ্যে প্রতিষ্ঠিত একটি সরকারি প্রাথমিক বিদ্যালয়। বিদ্যালয়ের প্রকৃত প্রতিষ্ঠাকাল ও ঐতিহাসিক বিবরণ অ্যাডমিন প্যানেল থেকে সংযুক্ত করুন।',
  introduction:
    '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয় এলাকার কোমলমতি শিশুদের জন্য একটি নিরাপদ, আনন্দময় এবং শিক্ষাবান্ধব প্রতিষ্ঠান। জাতীয় শিক্ষাক্রম অনুযায়ী প্রথম শ্রেণি থেকে পঞ্চম শ্রেণি পর্যন্ত পাঠদান পরিচালনা করা হয়।',
  establishmentHistory:
    '[নমুনা তথ্য] বিদ্যালয়ের প্রতিষ্ঠাতা সদস্যবৃন্দ, স্থানীয় শিক্ষানুরাগী ব্যক্তিবর্গ ও সরকারি জাতীয়করণের পূর্ণাঙ্গ ইতিহাস অ্যাডমিন ড্যাশবোর্ডের "বিদ্যালয়ের তথ্য" মডিউল থেকে সম্পাদনা করুন।',
  aimsAndObjectives:
    'প্রাথমিক স্তরের প্রতিটি শিক্ষার্থীর মধ্যে পঠন, লিখন ও গাণিতিক দক্ষতার পাশাপাশি নৈতিক মূল্যবোধ, দেশপ্রেম, পরিচ্ছন্নতা এবং মানবিক গুণাবলি বিকশিত করা।',
  missionAndVision:
    'আমাদের লক্ষ্য হলো চরগোলাবাড়ী ও আশপাশের প্রতিটি শিশুকে শতভাগ প্রাথমিক শিক্ষা নিশ্চিত করা এবং একবিংশ শতাব্দীর উপযোগী সৃজনশীল ও আত্মবিশ্বাসী নাগরিক হিসেবে গড়ে তোলা।',
  infrastructure:
    '[নমুনা তথ্য] বিদ্যালয়ের একাডেমিক ভবন, শ্রেণিকক্ষ সংখ্যা, সুপেয় পানির ব্যবস্থা, ওয়াশ ব্লক ও খেলার মাঠ সংক্রান্ত প্রকৃত তথ্য অ্যাডমিন প্যানেল থেকে যুক্ত করুন।',
  facilities:
    'শ্রেণিকক্ষভিত্তিক পাঠদান, পাঠাগার ও শিক্ষা উপকরণ কর্নার, সহশিক্ষা কার্যক্রম, বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠান এবং সরকারি উপবৃত্তি ও পাঠ্যবই সুবিধা।',
  achievements:
    '[নমুনা তথ্য] সমাপনী/মূল্যায়ন ফলাফল, আন্তঃপ্রাথমিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতায় অর্জিত সাফল্যের প্রকৃত তথ্য এখানে যুক্ত করা যাবে।',
  nationalDays:
    'আন্তর্জাতিক মাতৃভাষা দিবস (২১শে ফেব্রুয়ারি), জাতির পিতার জন্মদিন ও জাতীয় শিশু দিবস, স্বাধীনতা দিবস (২৬শে মার্চ), বাংলা নববর্ষ ও বিজয় দিবস (১৬ই ডিসেম্বর) যথাযোগ্য মর্যাদায় উদযাপন করা হয়।',
  headmasterName: 'প্রধান শিক্ষক (নমুনা নাম — সম্পাদনা করুন)',
  headmasterDesignation: 'প্রধান শিক্ষক',
  headmasterQualification: 'শিক্ষাগত যোগ্যতা (অ্যাডমিন প্যানেল থেকে যুক্ত করুন)',
  headmasterPhotoUrl: IMG_HEADMASTER,
  headmasterMessage:
    '[নমুনা বাণী] প্রিয় অভিভাবক, শিক্ষার্থী ও এলাকাবাসী, ৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয়ের পক্ষ থেকে জানাই আন্তরিক শুভেচ্ছা। প্রাথমিক শিক্ষা একটি শিশুর জীবনের সবচেয়ে গুরুত্বপূর্ণ ভিত্তি। আমাদের লক্ষ্য কেবল পাঠ্যপুস্তকের জ্ঞান নয়, বরং প্রতিটি শিশুর সৃজনশীলতা, শৃঙ্খলা, নৈতিকতা ও মানবিক মূল্যবোধের পরিপূর্ণ বিকাশ। বিদ্যালয়ের আসল প্রধান শিক্ষকের বক্তব্য অ্যাডমিন প্যানেল থেকে পরিবর্তন করুন।',
  headmasterQuote: 'সুশিক্ষা ও নৈতিক মূল্যবোধই একটি আলোকিত প্রজন্ম গড়ে তোলার প্রধান সোপান।',
  headmasterSignature: 'প্রধান শিক্ষক · ৪৪ নং চরগোলাবাড়ী সপ্রাবি',
  welcomeImageUrl: IMG_CAMPUS,
  isDemoContent: true,
};

export const DEFAULT_SLIDERS: SliderItem[] = [
  {
    id: 'demo-slider-1',
    title: '৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয়ে স্বাগতম',
    description: 'চরগোলাবাড়ী, মাদারগঞ্জ, জামালপুর — আনন্দময় ও মানসম্মত প্রাথমিক শিক্ষার বিশ্বস্ত অঙ্গন।',
    imageUrl: IMG_CAMPUS,
    buttonText: 'আমাদের বিদ্যালয়',
    buttonLink: '/about',
    order: 1,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-slider-2',
    title: 'শিশু-বান্ধব ও আধুনিক শ্রেণিকক্ষ পরিবেশ',
    description: 'প্রতিটি শিক্ষার্থীর প্রতি যত্নশীল পাঠদান, নৈতিক শিক্ষা ও সৃজনশীল বিকাশের সমন্বয়।',
    imageUrl: IMG_CLASSROOM,
    buttonText: 'শিক্ষকবৃন্দ দেখুন',
    buttonLink: '/teachers',
    order: 2,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-slider-3',
    title: 'পাঠাগার, ক্রীড়া ও সহশিক্ষা কার্যক্রম',
    description: 'পাঠ্যবইয়ের পাশাপাশি খেলাধুলা, সাংস্কৃতিক চর্চা ও জাতীয় দিবস উদযাপনের মাধ্যমে পরিপূর্ণ বিকাশ।',
    imageUrl: IMG_LIBRARY,
    buttonText: 'ফটো গ্যালারি',
    buttonLink: '/gallery',
    order: 3,
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'demo-teacher-1',
    name: 'প্রধান শিক্ষক (নমুনা প্রোফাইল)',
    designation: 'প্রধান শিক্ষক',
    category: 'প্রধান শিক্ষক',
    qualification: 'স্নাতকোত্তর, সি-ইন-এড / বিটিপিটি (নমুনা)',
    subject: 'প্রাথমিক শিক্ষা ও বিদ্যালয় প্রশাসন',
    joiningDate: 'অ্যাডমিন থেকে যুক্ত করুন',
    experience: 'অভিজ্ঞতা (নমুনা)',
    shortBio: 'বিদ্যালয়ের সার্বিক একাডেমিক ও প্রশাসনিক তত্ত্বাবধানের দায়িত্বে নিয়োজিত (নমুনা প্রোফাইল)।',
    statement: 'প্রতিটি শিশুর সুপ্ত প্রতিভা বিকাশে শিক্ষক ও অভিভাবকের সম্মিলিত প্রচেষ্টাই আমাদের মূল শক্তি।',
    quote: 'শিক্ষাই জাতির মেরুদণ্ড, আর প্রাথমিক শিক্ষা তার মূল ভিত্তি।',
    photoUrl: IMG_HEADMASTER,
    order: 1,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-teacher-2',
    name: 'সহকারী শিক্ষক ১ (নমুনা প্রোফাইল)',
    designation: 'সহকারী শিক্ষক',
    category: 'সহকারী শিক্ষক',
    qualification: 'স্নাতক / স্নাতকোত্তর (নমুনা)',
    subject: 'বাংলা ও বাংলাদেশ ও বিশ্বপরিচয়',
    joiningDate: 'অ্যাডমিন থেকে যুক্ত করুন',
    experience: 'অভিজ্ঞতা (নমুনা)',
    shortBio: 'শিশুদের শুদ্ধ উচ্চারণ, পঠন দক্ষতা এবং সৃজনশীল লেখায় অনুপ্রাণিত করতে কাজ করছেন (নমুনা প্রোফাইল)।',
    statement: 'আনন্দের মাধ্যমে শেখা শিশুর মননকে প্রসারিত করে এবং বিদ্যালয়ের প্রতি ভালোবাসা বাড়ায়।',
    quote: 'ভালোবাসা ও ধৈর্যের মাধ্যমেই শিশুরা সবচেয়ে দ্রুত শেখে।',
    photoUrl: '',
    order: 2,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-teacher-3',
    name: 'সহকারী শিক্ষক ২ (নমুনা প্রোফাইল)',
    designation: 'সহকারী শিক্ষক',
    category: 'সহকারী শিক্ষক',
    qualification: 'বি.এসসি / স্নাতক (নমুনা)',
    subject: 'প্রাথমিক গণিত ও বিজ্ঞান',
    joiningDate: 'অ্যাডমিন থেকে যুক্ত করুন',
    experience: 'অভিজ্ঞতা (নমুনা)',
    shortBio: 'বাস্তব উপকরণের সাহায্যে গণিত ও বিজ্ঞান ভীতি দূর করে আনন্দের সাথে পাঠদান (নমুনা প্রোফাইল)।',
    statement: 'কৌতূহল জাগিয়ে তুলতে পারলে প্রতিটি শিশুই বিজ্ঞানী ও চিন্তাবিদ হয়ে উঠতে পারে।',
    quote: 'প্রশ্ন করতে শেখাই প্রকৃত শিক্ষার প্রথম ধাপ।',
    photoUrl: '',
    order: 3,
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_STUDENT_CLASSES: StudentClass[] = [
  { id: 'class-1', className: 'প্রথম শ্রেণি', totalStudents: 48, boysCount: 23, girlsCount: 25, classTeacher: 'অ্যাডমিন থেকে নির্ধারণ করুন', academicYear: '২০২৬', order: 1, isActive: true, isDemo: true },
  { id: 'class-2', className: 'দ্বিতীয় শ্রেণি', totalStudents: 52, boysCount: 25, girlsCount: 27, classTeacher: 'অ্যাডমিন থেকে নির্ধারণ করুন', academicYear: '২০২৬', order: 2, isActive: true, isDemo: true },
  { id: 'class-3', className: 'তৃতীয় শ্রেণি', totalStudents: 50, boysCount: 24, girlsCount: 26, classTeacher: 'অ্যাডমিন থেকে নির্ধারণ করুন', academicYear: '২০২৬', order: 3, isActive: true, isDemo: true },
  { id: 'class-4', className: 'চতুর্থ শ্রেণি', totalStudents: 49, boysCount: 24, girlsCount: 25, classTeacher: 'অ্যাডমিন থেকে নির্ধারণ করুন', academicYear: '২০২৬', order: 4, isActive: true, isDemo: true },
  { id: 'class-5', className: 'পঞ্চম শ্রেণি', totalStudents: 51, boysCount: 25, girlsCount: 26, classTeacher: 'অ্যাডমিন থেকে নির্ধারণ করুন', academicYear: '২০২৬', order: 5, isActive: true, isDemo: true },
];

export const DEFAULT_STUDENTS: Student[] = [];

export const DEFAULT_ACADEMICS: AcademicItem[] = [
  {
    id: 'demo-acad-1',
    title: 'প্রাথমিক স্তরের শ্রেণিভিত্তিক পাঠ্যক্রম ও পাঠপরিকল্পনা (নমুনা)',
    category: 'পাঠ্যক্রম',
    className: 'প্রথম - পঞ্চম শ্রেণি',
    academicYear: '২০২৬',
    description: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) নির্ধারিত বাংলা, ইংরেজি, গণিত, বিজ্ঞান এবং বাংলাদেশ ও বিশ্বপরিচয় বিষয়ের বার্ষিক পাঠপরিকল্পনা। প্রকৃত PDF অ্যাডমিন প্যানেল থেকে সংযুক্ত করুন।',
    fileUrl: '',
    fileType: 'none',
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-acad-2',
    title: 'দৈনিক ও সাপ্তাহিক ক্লাস রুটিন (নমুনা)',
    category: 'দৈনিক রুটিন',
    className: 'সকল শ্রেণি',
    academicYear: '২০২৬',
    description: 'রবিবার থেকে বৃহস্পতিবার পর্যন্ত সকালের সমাবেশ (অ্যাসেম্বলি) ও শ্রেণিভিত্তিক পিরিয়ডের সময়সূচি। বিদ্যালয়ের প্রকৃত রুটিন PDF বা ছবি হিসেবে আপলোড করুন।',
    fileUrl: '',
    fileType: 'none',
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-acad-3',
    title: 'বার্ষিক ছুটির তালিকা ২০২৬ (নমুনা)',
    category: 'ছুটির তালিকা',
    className: 'সকল শ্রেণি',
    academicYear: '২০২৬',
    description: 'প্রাথমিক শিক্ষা অধিদপ্তর অনুমোদিত বাৎসরিক ছুটির ক্যালেন্ডার ও নির্দেশনা।',
    fileUrl: '',
    fileType: 'none',
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'demo-notice-1',
    title: '২০২৬ শিক্ষাবর্ষের শ্রেণি কার্যক্রম ও উপস্থিতি সংক্রান্ত জরুরি বিজ্ঞপ্তি (নমুনা)',
    category: 'সাধারণ নোটিশ',
    publishDate: '২০২৬-১১-১০',
    description: 'সকল অভিভাবক ও শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে, নিয়মিত বিদ্যালয়ে উপস্থিতি ও পরিচ্ছন্ন পোশাক পরিধান নিশ্চিত করার জন্য অনুরোধ করা হলো। এটি একটি নমুনা নোটিশ — অ্যাডমিন প্যানেল থেকে আসল নোটিশ প্রকাশ করুন।',
    attachmentUrl: '',
    attachmentType: 'none',
    isNew: true,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-notice-2',
    title: 'অভিভাবক সমাবেশ ও শিক্ষার মানোন্নয়ন মতবিনিময় সভা (নমুনা)',
    category: 'অভিভাবক সভা',
    publishDate: '২০২৬-১১-০৫',
    description: 'শিক্ষার্থীদের ধারাবাহিক মূল্যায়ন, নিয়মিত হোমওয়ার্ক ও পুষ্টিকর টিফিন বিষয়ে অভিভাবকদের সাথে মতবিনিময় সভার নমুনা বিজ্ঞপ্তি। তারিখ ও সময় অ্যাডমিন প্যানেল থেকে নির্ধারণ করুন।',
    attachmentUrl: '',
    attachmentType: 'none',
    isNew: true,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-notice-3',
    title: 'বার্ষিক মূল্যায়ন ও পরীক্ষা সংক্রান্ত সময়সূচি প্রকাশ (নমুনা)',
    category: 'পরীক্ষার নোটিশ',
    publishDate: '২০২৬-১০-২৮',
    description: 'প্রথম থেকে পঞ্চম শ্রেণির শিক্ষার্থীদের মূল্যায়ন পরীক্ষার সময়সূচি ও নির্দেশনা সংক্রান্ত নমুনা নোটিশ।',
    attachmentUrl: '',
    attachmentType: 'none',
    isNew: false,
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_RESULTS: ResultItem[] = [
  {
    id: 'demo-result-1',
    title: 'পঞ্চম শ্রেণির বার্ষিক মূল্যায়ন ফলাফল (নমুনা)',
    className: 'পঞ্চম শ্রেণি',
    academicYear: '২০২৫',
    examName: 'বার্ষিক পরীক্ষা',
    publishDate: '২০২৫-১২-৩০',
    fileUrl: '',
    fileType: 'pdf',
    summary: 'অ্যাডমিন ড্যাশবোর্ডের "ফলাফল ব্যবস্থাপনা" থেকে প্রকৃত PDF বা Excel ফাইল যুক্ত করলে অভিভাবকগণ এখান থেকে ডাউনলোড করতে পারবেন।',
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-result-2',
    title: 'চতুর্থ শ্রেণির অর্ধ-বার্ষিক মূল্যায়ন ফলাফল (নমুনা)',
    className: 'চতুর্থ শ্রেণি',
    academicYear: '২০২৬',
    examName: 'অর্ধ-বার্ষিক পরীক্ষা',
    publishDate: '২০২৬-০৭-১৫',
    fileUrl: '',
    fileType: 'pdf',
    summary: 'নমুনা ফলাফল রেকর্ড — অ্যাডমিন প্যানেল থেকে প্রকৃত ফলাফলের নথি আপলোড করুন।',
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'demo-photo-1',
    title: 'বিদ্যালয় প্রাঙ্গণ ও জাতীয় পতাকা (নমুনা ছবি)',
    caption: 'সকালের নির্মল পরিবেশে ৪৪ নং চরগোলাবাড়ী সরকারি প্রাথমিক বিদ্যালয়ের প্রাঙ্গণ।',
    category: 'বিদ্যালয়ের পরিবেশ',
    imageUrl: IMG_CAMPUS,
    order: 1,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-photo-2',
    title: 'শ্রেণিকক্ষে পাঠদান কার্যক্রম (নমুনা ছবি)',
    caption: 'আনন্দময় পরিবেশে শিক্ষার্থীদের সক্রিয় অংশগ্রহণ ও পাঠদান।',
    category: 'শিক্ষা কার্যক্রম',
    imageUrl: IMG_CLASSROOM,
    order: 2,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-photo-3',
    title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও উৎসব (নমুনা ছবি)',
    caption: 'বিদ্যালয়ের খেলার মাঠে শিক্ষার্থীদের ক্রীড়া ও সহশিক্ষা আয়োজন।',
    category: 'বার্ষিক ক্রীড়া প্রতিযোগিতা',
    imageUrl: IMG_SPORTS,
    order: 3,
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-photo-4',
    title: 'পাঠাগার ও সৃজনশীল কর্নার (নমুনা ছবি)',
    caption: 'শিশুদের বই পড়া ও চিত্রাঙ্কন চর্চার নির্ধারিত কক্ষ।',
    category: 'শিক্ষক ও শিক্ষার্থী',
    imageUrl: IMG_LIBRARY,
    order: 4,
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: 'demo-video-1',
    title: 'বিদ্যালয়ের সাংস্কৃতিক ও জাতীয় দিবস আয়োজন (নমুনা ভিডিও)',
    category: 'জাতীয় দিবস',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: IMG_SPORTS,
    description: 'অ্যাডমিন প্যানেল থেকে বিদ্যালয়ের প্রকৃত YouTube ভিডিও লিংক যুক্ত করুন।',
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'demo-news-1',
    title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণী অনুষ্ঠান আয়োজন (নমুনা)',
    category: 'বার্ষিক ক্রীড়া প্রতিযোগিতা',
    publishDate: '২০২৬-১০-২০',
    author: 'বিদ্যালয় প্রশাসন (নমুনা)',
    featuredImageUrl: IMG_SPORTS,
    summary: 'শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশের লক্ষ্যে বিদ্যালয় মাঠে আনন্দঘন পরিবেশে ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা আয়োজিত হয়।',
    content:
      '[নমুনা সংবাদ] শিক্ষার্থীদের শারীরিক সক্ষমতা, দলীয় চেতনা এবং সুস্থ প্রতিযোগিতার মানসিকতা গড়ে তোলার লক্ষ্যে বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতার আয়োজন করা হয়। দৌড়, মোরগ লড়াই, যেমন খুশি তেমন সাজো ও আবৃত্তি প্রতিযোগিতায় শিক্ষার্থীরা অংশগ্রহণ করে। বিদ্যালয়ের আসল অনুষ্ঠানের সংবাদ ও ছবি অ্যাডমিন প্যানেল থেকে প্রকাশ করুন।',
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-news-2',
    title: 'জাতীয় দিবস ও পাঠ্যবই উৎসব উদযাপন (নমুনা)',
    category: 'জাতীয় দিবস',
    publishDate: '২০২৬-০৯-১৫',
    author: 'শিক্ষক মণ্ডলী (নমুনা)',
    featuredImageUrl: IMG_CLASSROOM,
    summary: 'জাতীয় দিবস উপলক্ষে চিত্রাঙ্কন, রচনা ও আলোচনা সভার মধ্য দিয়ে শিশুদের মধ্যে দেশপ্রেমের চেতনা জাগ্রত করা হয়।',
    content:
      '[নমুনা সংবাদ] যথাযোগ্য মর্যাদায় জাতীয় দিবস উদযাপন উপলক্ষে সকালে জাতীয় পতাকা উত্তোলন, শিশুদের চিত্রাঙ্কন ও সাংস্কৃতিক পরিবেশনার আয়োজন করা হয়। প্রকৃত সংবাদ অ্যাডমিন ড্যাশবোর্ড থেকে যোগ করুন।',
    isActive: true,
    isDemo: true,
  },
  {
    id: 'demo-news-3',
    title: 'পাঠাগার ব্যবহার ও সৃজনশীল পঠন অভ্যাস গড়ার উদ্যোগ (নমুনা)',
    category: 'শিক্ষা কার্যক্রম',
    publishDate: '২০২৬-০৮-১০',
    author: 'একাডেমিক কমিটি (নমুনা)',
    featuredImageUrl: IMG_LIBRARY,
    summary: 'শিশুদের বাংলা ও ইংরেজি পঠন দক্ষতা বাড়াতে সাপ্তাহিক গল্প বলা ও বই পড়া সেশন চালু করা হয়েছে।',
    content:
      '[নমুনা সংবাদ] নিয়মিত পাঠ্যবইয়ের পাশাপাশি গল্প, ছড়া ও সাধারণ জ্ঞানের বই পড়ার অভ্যাস গড়ে তুলতে বিদ্যালয়ের পাঠাগার কর্নারে বিশেষ সেশন পরিচালিত হচ্ছে।',
    isActive: true,
    isDemo: true,
  },
];

export const DEFAULT_MENUS: MenuItem[] = [
  { id: 'menu-1', label: 'হোম', path: '/', group: 'primary', order: 1, isActive: true },
  { id: 'menu-2', label: 'আমাদের বিদ্যালয়', path: '/about', group: 'primary', order: 2, isActive: true },
  { id: 'menu-3', label: 'শিক্ষকবৃন্দ', path: '/teachers', group: 'primary', order: 3, isActive: true },
  { id: 'menu-4', label: 'নোটিশ', path: '/notices', group: 'primary', order: 4, isActive: true },
  { id: 'menu-5', label: 'শিক্ষার্থী', path: '/students', group: 'more', order: 5, isActive: true },
  { id: 'menu-6', label: 'একাডেমিক কার্যক্রম', path: '/academics', group: 'more', order: 6, isActive: true },
  { id: 'menu-7', label: 'ফলাফল', path: '/results', group: 'more', order: 7, isActive: true },
  { id: 'menu-8', label: 'ফটো গ্যালারি', path: '/gallery', group: 'more', order: 8, isActive: true },
  { id: 'menu-9', label: 'যোগাযোগ', path: '/contact', group: 'primary', order: 9, isActive: true },
];
