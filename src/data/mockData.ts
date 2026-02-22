export interface Lecture {
  id: string;
  title: string;
  description: string;
  instructor: string;
  grade: '초등' | '중등' | '고등';
  subject: string;
  level: number;
  date: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  isPublished: boolean;
  order: number;
  tags: string[];
}

export const defaultLectures: Lecture[] = [
  {
    id: 'l1',
    title: '고2 수학 - 수열의 극한',
    description: '수열의 극한의 정의와 기본 성질, 극한값의 계산 방법을 학습합니다. 수렴과 발산의 개념을 이해하고, 다양한 수열의 극한값을 구하는 연습을 합니다.',
    instructor: '박미적',
    grade: '고등',
    subject: '수학II',
    level: 3,
    date: '2025-02-20',
    duration: '42:15',
    thumbnail: 'https://picsum.photos/seed/math1/400/225',
    videoId: 'sZ-F4s9aL4c',
    isPublished: true,
    order: 1,
    tags: ['수열', '극한', '수렴', '발산'],
  },
  {
    id: 'l2',
    title: '고1 수학 - 다항식의 인수분해',
    description: '인수분해의 기본 공식과 다양한 인수분해 방법을 정리합니다. 복잡한 다항식도 체계적으로 인수분해할 수 있는 전략을 배웁니다.',
    instructor: '박미적',
    grade: '고등',
    subject: '수학I',
    level: 2,
    date: '2025-02-18',
    duration: '38:40',
    thumbnail: 'https://picsum.photos/seed/math2/400/225',
    videoId: 'd_kR9g0rF04',
    isPublished: true,
    order: 2,
    tags: ['다항식', '인수분해', '곱셈공식'],
  },
  {
    id: 'l3',
    title: '고3 수학 - 미적분 핵심 총정리',
    description: '수능 대비 미적분 전 단원 핵심 개념을 총정리합니다. 미분법, 적분법, 정적분의 활용까지 빠르게 복습합니다.',
    instructor: '박미적',
    grade: '고등',
    subject: '미적분',
    level: 5,
    date: '2025-02-15',
    duration: '55:20',
    thumbnail: 'https://picsum.photos/seed/math3/400/225',
    videoId: 'r_G_Q2Z2-C4',
    isPublished: true,
    order: 3,
    tags: ['미적분', '미분', '적분', '수능'],
  },
  {
    id: 'l4',
    title: '중3 수학 - 이차함수 심화',
    description: '이차함수의 그래프와 성질을 심층 분석합니다. 꼭짓점, 축, 그래프의 이동과 실생활 문제 풀이까지 다룹니다.',
    instructor: '이함수',
    grade: '중등',
    subject: '중3 수학',
    level: 4,
    date: '2025-02-19',
    duration: '35:50',
    thumbnail: 'https://picsum.photos/seed/math4/400/225',
    videoId: 'x7E-dF-3g0s',
    isPublished: true,
    order: 1,
    tags: ['이차함수', '그래프', '꼭짓점'],
  },
  {
    id: 'l5',
    title: '중2 수학 - 일차함수와 그래프',
    description: '일차함수의 개념, 기울기와 y절편의 의미를 배우고, 그래프를 정확하게 그리는 방법을 연습합니다.',
    instructor: '이함수',
    grade: '중등',
    subject: '중2 수학',
    level: 3,
    date: '2025-02-16',
    duration: '32:10',
    thumbnail: 'https://picsum.photos/seed/math5/400/225',
    videoId: 'y5fQp-W0w_U',
    isPublished: true,
    order: 2,
    tags: ['일차함수', '기울기', 'y절편'],
  },
  {
    id: 'l6',
    title: '중1 수학 - 정수와 유리수',
    description: '정수와 유리수의 개념을 확실히 다지고, 사칙연산과 혼합계산을 정확하게 수행하는 능력을 키웁니다.',
    instructor: '이함수',
    grade: '중등',
    subject: '중1 수학',
    level: 2,
    date: '2025-02-12',
    duration: '28:45',
    thumbnail: 'https://picsum.photos/seed/math6/400/225',
    videoId: 'Ew1Qk6X3o3E',
    isPublished: true,
    order: 3,
    tags: ['정수', '유리수', '사칙연산'],
  },
  {
    id: 'l7',
    title: '초6 수학 - 비와 비율',
    description: '비와 비율의 개념을 실생활 예제로 쉽게 이해합니다. 백분율, 할인율 문제도 함께 연습합니다.',
    instructor: '최연산',
    grade: '초등',
    subject: '초6 수학',
    level: 2,
    date: '2025-02-17',
    duration: '25:30',
    thumbnail: 'https://picsum.photos/seed/math7/400/225',
    videoId: 'z0f7_v3dY6k',
    isPublished: true,
    order: 1,
    tags: ['비', '비율', '백분율'],
  },
  {
    id: 'l8',
    title: '초5 수학 - 분수의 나눗셈',
    description: '분수의 나눗셈 원리를 이해하고, 다양한 유형의 문제를 풀어봅니다. 역수의 개념도 함께 배웁니다.',
    instructor: '최연산',
    grade: '초등',
    subject: '초5 수학',
    level: 2,
    date: '2025-02-14',
    duration: '22:15',
    thumbnail: 'https://picsum.photos/seed/math8/400/225',
    videoId: 'S-3_fS_pS7o',
    isPublished: true,
    order: 2,
    tags: ['분수', '나눗셈', '역수'],
  },
  {
    id: 'l9',
    title: '초4 수학 - 큰 수와 어림하기',
    description: '큰 수의 읽기, 쓰기와 어림하기(반올림, 올림, 버림) 개념을 배웁니다. 실생활에서의 활용도 다룹니다.',
    instructor: '최연산',
    grade: '초등',
    subject: '초4 수학',
    level: 1,
    date: '2025-02-10',
    duration: '20:00',
    thumbnail: 'https://picsum.photos/seed/math9/400/225',
    videoId: 'mY8Q2J_Xb7k',
    isPublished: true,
    order: 3,
    tags: ['큰수', '어림하기', '반올림'],
  },
  {
    id: 'l10',
    title: '고2 수학 - 등비급수의 활용',
    description: '등비급수의 수렴 조건과 합을 구하는 방법을 학습합니다. 순환소수와 도형 문제에서의 활용을 다룹니다.',
    instructor: '박미적',
    grade: '고등',
    subject: '수학II',
    level: 4,
    date: '2025-02-22',
    duration: '45:30',
    thumbnail: 'https://picsum.photos/seed/math10/400/225',
    videoId: 'Ew1Qk6X3o3E',
    isPublished: true,
    order: 4,
    tags: ['등비급수', '급수', '수렴'],
  },
  {
    id: 'l11',
    title: '중3 수학 - 피타고라스 정리',
    description: '피타고라스 정리의 증명과 다양한 활용 문제를 풀어봅니다. 직각삼각형에서의 변의 길이 구하기를 연습합니다.',
    instructor: '이함수',
    grade: '중등',
    subject: '중3 수학',
    level: 3,
    date: '2025-02-21',
    duration: '30:20',
    thumbnail: 'https://picsum.photos/seed/math11/400/225',
    videoId: 'y5fQp-W0w_U',
    isPublished: true,
    order: 4,
    tags: ['피타고라스', '직각삼각형', '정리'],
  },
  {
    id: 'l12',
    title: '초6 수학 - 원의 넓이',
    description: '원의 넓이 공식을 유도하고 다양한 원 관련 문제를 풀어봅니다. 원주율의 개념도 함께 학습합니다.',
    instructor: '최연산',
    grade: '초등',
    subject: '초6 수학',
    level: 2,
    date: '2025-02-21',
    duration: '23:45',
    thumbnail: 'https://picsum.photos/seed/math12/400/225',
    videoId: 'z0f7_v3dY6k',
    isPublished: true,
    order: 4,
    tags: ['원', '넓이', '원주율'],
  },
];

// --- localStorage 기반 강의 관리 ---
const LECTURES_KEY = 'g1230_lectures';

export function getLectures(): Lecture[] {
  const saved = localStorage.getItem(LECTURES_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fallback */ }
  }
  return defaultLectures;
}

export function saveLectures(lectures: Lecture[]) {
  localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures));
}

// --- 수강 진도 관리 ---
export interface LectureProgress {
  lectureId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0~100
  lastWatched: string;
  bookmarked: boolean;
  notes: Array<{ content: string; createdAt: string }>;
}

const PROGRESS_KEY = 'g1230_lecture_progress';

export function getAllProgress(): Record<string, LectureProgress> {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fallback */ }
  }
  return {};
}

export function getProgress(lectureId: string): LectureProgress {
  const all = getAllProgress();
  return all[lectureId] || {
    lectureId,
    status: 'not_started',
    progress: 0,
    lastWatched: '',
    bookmarked: false,
    notes: [],
  };
}

export function saveProgress(lectureId: string, update: Partial<LectureProgress>) {
  const all = getAllProgress();
  const current = all[lectureId] || {
    lectureId,
    status: 'not_started' as const,
    progress: 0,
    lastWatched: '',
    bookmarked: false,
    notes: [],
  };
  all[lectureId] = { ...current, ...update };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

// --- 강사 담당 학년 ---
export interface InstructorAssignment {
  name: string;
  grades: Array<'초등' | '중등' | '고등'>;
}

const ASSIGNMENTS_KEY = 'g1230_instructor_assignments';

const defaultAssignments: InstructorAssignment[] = [
  { name: '김수학', grades: ['초등', '중등', '고등'] },
  { name: '박미적', grades: ['고등'] },
  { name: '이함수', grades: ['중등'] },
  { name: '최연산', grades: ['초등'] },
];

export function getAssignments(): InstructorAssignment[] {
  const saved = localStorage.getItem(ASSIGNMENTS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fallback */ }
  }
  return defaultAssignments;
}

export function saveAssignments(assignments: InstructorAssignment[]) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

// --- 커뮤니티 콘텐츠 관리 ---

// ── 공지사항 ──
export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isNew: boolean;
  isPinned: boolean;
}

const NOTICES_KEY = 'g1230_notices';
const defaultNotices: NoticeItem[] = [
  { id: 'n1', title: '2025학년도 1학기 중간고사 대비 특강 안내', content: '중간고사 대비 특강이 3월 10일부터 시작됩니다. 자세한 일정은 학원으로 문의해 주세요.', date: '2025-02-20', isNew: true, isPinned: true },
  { id: 'n2', title: '3월 학사일정 및 휴원일 안내', content: '3월 학사일정을 안내드립니다. 3월 1일(삼일절) 휴원합니다.', date: '2025-02-18', isNew: false, isPinned: false },
  { id: 'n3', title: '진접 G1230 수학전문학원 방역 수칙 안내', content: '학원 출입 시 손 소독 및 마스크 착용을 권장합니다.', date: '2025-02-10', isNew: false, isPinned: false },
];

export function getNotices(): NoticeItem[] {
  const saved = localStorage.getItem(NOTICES_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultNotices;
}
export function saveNotices(items: NoticeItem[]) { localStorage.setItem(NOTICES_KEY, JSON.stringify(items)); }

// 하위 호환 — 구 코드에서 import { notices } 사용
export const notices = defaultNotices;

// ── 블로그 포스트 ──
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
}

const BLOG_KEY = 'g1230_blog';
const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog1', title: '수학 성적을 올리는 5가지 학습 습관',
    excerpt: '수학 성적 향상을 원한다면 단순히 문제를 많이 푸는 것만으로는 부족합니다.',
    content: '## 1. 오답노트를 활용하세요\n\n틀린 문제를 그냥 넘기지 말고, 반드시 오답노트에 정리하세요.\n\n## 2. 개념 이해를 우선으로\n\n공식을 외우기 전에 \'왜 이 공식이 나오는지\'를 이해하세요.\n\n## 3. 매일 조금씩 꾸준히\n\n매일 30분~1시간씩 꾸준히 하는 것이 훨씬 효과적입니다.\n\n## 4. 시간을 정해서 풀기\n\n평소에도 타이머를 맞춰놓고 문제를 푸는 연습을 하세요.\n\n## 5. 질문을 두려워하지 마세요\n\n모르는 것이 당연합니다. 수업 중 바로 질문하세요.',
    author: '김원장', date: '2025-02-20', readTime: '5분', tags: ['학습법', '수학공부', '성적향상'],
    image: 'https://picsum.photos/seed/blog1/800/400',
  },
  {
    id: 'blog2', title: '학부모가 알아야 할 중학 수학 → 고등 수학 연계 학습 전략',
    excerpt: '중학교에서 고등학교로 올라가면 수학 난이도가 확 높아집니다.',
    content: '## 중학 수학과 고등 수학의 차이\n\n중학 수학은 개념 이해와 기본 연산이 중심이지만, 고등 수학은 추상적 사고와 논리적 추론이 핵심입니다.\n\n## 중3 겨울방학 활용법\n\n- **인수분해** 완벽 마스터\n- **함수 개념** 깊이 이해\n- **방정식** 심화 학습\n\n## 부모님의 역할\n\n학습 환경을 만들어 주세요. 규칙적인 시간, 적절한 휴식, 그리고 격려가 중요합니다.',
    author: '박미적', date: '2025-02-15', readTime: '7분', tags: ['중고연계', '학부모', '선행학습'],
    image: 'https://picsum.photos/seed/blog2/800/400',
  },
  {
    id: 'blog3', title: '수학 자신감을 키우는 방법: 수포자에서 수학 우등생으로',
    excerpt: '"나는 수학을 못해"라고 생각하는 학생들이 많습니다. 하지만 올바른 방법으로 접근하면 누구나 수학을 잘할 수 있습니다.',
    content: '## 수포자가 되는 이유\n\n특정 단원에서 개념이 끊기면서 시작됩니다.\n\n## 해결 방법\n\n### 1단계: 끊어진 고리 찾기\n진단테스트를 통해 정확한 취약점을 파악합니다.\n\n### 2단계: 기초부터 탄탄히\n한 학년 뒤로 돌아가더라도 기초를 다지는 것이 중요합니다.\n\n### 3단계: 성장 경험\n작은 성공을 쌓아가면 자신감이 생깁니다.',
    author: '이함수', date: '2025-02-10', readTime: '6분', tags: ['수포자', '자신감', '성적향상'],
    image: 'https://picsum.photos/seed/blog3/800/400',
  },
];

export function getBlogPosts(): BlogPost[] {
  const saved = localStorage.getItem(BLOG_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultBlogPosts;
}
export function saveBlogPosts(items: BlogPost[]) { localStorage.setItem(BLOG_KEY, JSON.stringify(items)); }

// ── 갤러리 ──
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const GALLERY_KEY = 'g1230_gallery';
const defaultGallery: GalleryItem[] = [
  { id: 'gal1', title: '학원 내부 시설', description: '쾌적한 학습 환경', imageUrl: 'https://picsum.photos/seed/gal1/600/400', date: '2025-02-20' },
  { id: 'gal2', title: '자습실', description: '집중력을 높이는 자습 공간', imageUrl: 'https://picsum.photos/seed/gal2/600/400', date: '2025-02-18' },
  { id: 'gal3', title: '수업 풍경', description: '소수정예 수업 진행 모습', imageUrl: 'https://picsum.photos/seed/gal3/600/400', date: '2025-02-15' },
  { id: 'gal4', title: '학원 로비', description: '깔끔하고 밝은 로비', imageUrl: 'https://picsum.photos/seed/gal4/600/400', date: '2025-02-12' },
  { id: 'gal5', title: '수학 올림피아드 수상', description: '학생 수상 기념 사진', imageUrl: 'https://picsum.photos/seed/gal5/600/400', date: '2025-02-10' },
  { id: 'gal6', title: '학부모 간담회', description: '학부모 간담회 진행 모습', imageUrl: 'https://picsum.photos/seed/gal6/600/400', date: '2025-02-08' },
];

export function getGallery(): GalleryItem[] {
  const saved = localStorage.getItem(GALLERY_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultGallery;
}
export function saveGallery(items: GalleryItem[]) { localStorage.setItem(GALLERY_KEY, JSON.stringify(items)); }

// ── 자료실 ──
export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  date: string;
  downloads: number;
  type: string;
  size: string;
  fileUrl: string;
}

const RESOURCES_KEY = 'g1230_resources';
const defaultResources: ResourceItem[] = [
  { id: 'res1', title: '[중3] 이차방정식 핵심 정리 노트', category: '학습자료', date: '2025-02-18', downloads: 156, type: 'PDF', size: '2.4MB', fileUrl: '' },
  { id: 'res2', title: '[중2] 일차함수 그래프 연습문제 50선', category: '학습자료', date: '2025-02-15', downloads: 203, type: 'PDF', size: '3.1MB', fileUrl: '' },
  { id: 'res3', title: '[고1] 다항식과 인수분해 개념 총정리', category: '학습자료', date: '2025-02-12', downloads: 189, type: 'PDF', size: '4.7MB', fileUrl: '' },
  { id: 'res4', title: '[중3] 2025 1학기 중간고사 대비 모의고사', category: '시험 대비', date: '2025-02-20', downloads: 312, type: 'PDF', size: '5.6MB', fileUrl: '' },
  { id: 'res5', title: '[중2] 2025 1학기 중간고사 대비 모의고사', category: '시험 대비', date: '2025-02-19', downloads: 287, type: 'PDF', size: '5.2MB', fileUrl: '' },
  { id: 'res6', title: '2025학년도 교육 과정 안내서', category: '학부모 자료', date: '2025-02-01', downloads: 89, type: 'PDF', size: '3.5MB', fileUrl: '' },
  { id: 'res7', title: '중등 수학 학습 로드맵 가이드', category: '학부모 자료', date: '2025-01-20', downloads: 156, type: 'PDF', size: '2.8MB', fileUrl: '' },
];

export function getResources(): ResourceItem[] {
  const saved = localStorage.getItem(RESOURCES_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultResources;
}
export function saveResources(items: ResourceItem[]) { localStorage.setItem(RESOURCES_KEY, JSON.stringify(items)); }

// ── FAQ ──
export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

const FAQ_KEY = 'g1230_faq';
const defaultFaqs: FaqItem[] = [
  { id: 'faq1', category: '입학 상담', question: '입학 상담은 어떻게 받을 수 있나요?', answer: '전화(031-123-4567)로 상담 예약 후 방문해 주시면 됩니다. 진단 테스트(약 40분) 후 맞춤 반 배정과 학습 계획을 안내드립니다.', order: 1 },
  { id: 'faq2', category: '입학 상담', question: '중간에 반 변경이 가능한가요?', answer: '네, 가능합니다. 매월 정기 테스트 결과와 학습 진도를 종합적으로 판단하여 적절한 반으로 이동할 수 있습니다.', order: 2 },
  { id: 'faq3', category: '입학 상담', question: '무료 체험 수업이 가능한가요?', answer: '네, 첫 방문 시 1회 무료 체험 수업을 제공합니다. 전화 또는 홈페이지를 통해 사전 예약해 주세요.', order: 3 },
  { id: 'faq4', category: '수업 및 커리큘럼', question: '수업 시간과 요일은 어떻게 되나요?', answer: '학년과 반에 따라 다양한 시간대가 있습니다. 중등부는 주 3회, 고등부는 주 4~5회 수업을 기본으로 합니다.', order: 4 },
  { id: 'faq5', category: '수업 및 커리큘럼', question: '온라인 수업도 병행하나요?', answer: '네, 동영상 강의실을 통해 수업 복습용 영상과 보충 강의를 제공합니다.', order: 5 },
  { id: 'faq6', category: '수강료 및 결제', question: '수강료는 얼마인가요?', answer: '학년과 수강 시간에 따라 상이합니다. 중등 기본반은 월 25만원~35만원, 고등반은 월 30만원~45만원 수준입니다.', order: 6 },
  { id: 'faq7', category: '차량 및 편의', question: '학원 차량 운행을 이용하려면 어떻게 하나요?', answer: '학원 등록 시 차량 이용 신청을 하시면 됩니다. 현재 3개 노선을 운행 중이며, 차량운행 페이지에서 확인하실 수 있습니다.', order: 7 },
  { id: 'faq8', category: '차량 및 편의', question: '자습실 이용이 가능한가요?', answer: '네, 재원생은 평일 14:00~22:00까지 자습실을 무료로 이용할 수 있습니다.', order: 8 },
];

export function getFaqs(): FaqItem[] {
  const saved = localStorage.getItem(FAQ_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultFaqs;
}
export function saveFaqs(items: FaqItem[]) { localStorage.setItem(FAQ_KEY, JSON.stringify(items)); }

// ── 문의게시판 ──
export interface InquiryItem {
  id: string;
  title: string;
  author: string;
  date: string;
  isPrivate: boolean;
  category: string;
  content: string;
  answer?: string;
  answerDate?: string;
  views: number;
}

const INQUIRIES_KEY = 'g1230_inquiries';
const defaultInquiries: InquiryItem[] = [
  { id: 'inq1', title: '여름 특강 일정이 궁금합니다', author: '김학부모', date: '2025-02-20', isPrivate: false, category: '수업 문의', views: 45, content: '안녕하세요. 중2 아이 학부모입니다. 여름방학 특강 일정과 커리큘럼이 궁금합니다.', answer: '여름 특강은 7월 21일~8월 16일(4주) 과정으로 운영됩니다. 6월 초에 공지사항으로 안내드리겠습니다.', answerDate: '2025-02-20' },
  { id: 'inq2', title: '수학 진단 테스트 결과 문의', author: '이○○맘', date: '2025-02-18', isPrivate: true, category: '상담 문의', views: 12, content: '진단 테스트 결과가 언제 나오나요?', answer: '결과는 보통 2~3일 내에 나옵니다. 개별 연락 드리겠습니다.', answerDate: '2025-02-19' },
  { id: 'inq3', title: '주차장 이용 관련 문의드립니다', author: '박학부모', date: '2025-02-17', isPrivate: false, category: '시설 문의', views: 38, content: '상담 방문 시 주차가 가능한가요?', answer: '건물 지하 주차장에 학부모님 전용 주차 공간이 있습니다. 30분 무료 주차 가능합니다.', answerDate: '2025-02-17' },
  { id: 'inq4', title: '셔틀버스 노선 변경 요청', author: '윤학부모', date: '2025-02-10', isPrivate: false, category: '차량 문의', views: 52, content: '현재 3호차를 이용 중인데 이사를 하게 되어 노선 변경이 가능한지 문의드립니다.' },
  { id: 'inq5', title: '형제 할인이 있나요?', author: '송○○', date: '2025-02-03', isPrivate: true, category: '수강 문의', views: 15, content: '두 아이를 함께 보내려고 하는데 형제 할인 혜택이 있나요?' },
];

export function getInquiries(): InquiryItem[] {
  const saved = localStorage.getItem(INQUIRIES_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultInquiries;
}
export function saveInquiries(items: InquiryItem[]) { localStorage.setItem(INQUIRIES_KEY, JSON.stringify(items)); }

// --- 학사일정 관리 ---
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO 'YYYY-MM-DD'
  type: 'holiday' | 'academy' | 'school' | 'exam';
  school: string; // '전체', '해밀초', '진접초', '주곡초', '풍양중', '주곡중', '진접중', '광동중', or any custom
  color: string;
  description: string;
}

export const SCHOOL_LIST = [
  '전체', '해밀초', '진접초', '주곡초', '풍양중', '주곡중', '진접중', '광동중', '진접고', '별내고',
] as const;

const defaultCalendarEvents: CalendarEvent[] = [
  // ═══════ 2026 한국 공휴일 ═══════
  { id: 'h1', title: '신정', date: '2026-01-01', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '새해 첫날' },
  { id: 'h2', title: '설날 연휴', date: '2026-02-16', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '설날 연휴 (2/16~2/18)' },
  { id: 'h3', title: '설날', date: '2026-02-17', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '음력 1월 1일' },
  { id: 'h4', title: '설날 연휴', date: '2026-02-18', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '설날 연휴 (2/16~2/18)' },
  { id: 'h5', title: '삼일절', date: '2026-03-01', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '3·1 독립운동 기념일' },
  { id: 'h6', title: '대체공휴일', date: '2026-03-02', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '삼일절 대체공휴일 (일→월)' },
  { id: 'h7', title: '어린이날', date: '2026-05-05', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '' },
  { id: 'h8', title: '부처님오신날', date: '2026-05-24', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '음력 4월 8일' },
  { id: 'h9', title: '현충일', date: '2026-06-06', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '호국영령 추모일' },
  { id: 'h10', title: '광복절', date: '2026-08-15', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '제81주년 광복절' },
  { id: 'h11', title: '추석 연휴', date: '2026-09-24', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '추석 연휴 (9/24~9/26)' },
  { id: 'h12', title: '추석', date: '2026-09-25', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '음력 8월 15일' },
  { id: 'h13', title: '추석 연휴', date: '2026-09-26', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '추석 연휴 (9/24~9/26)' },
  { id: 'h14', title: '개천절', date: '2026-10-03', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '단군 건국 기념일' },
  { id: 'h15', title: '한글날', date: '2026-10-09', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '세종대왕 한글 반포 기념일' },
  { id: 'h16', title: '크리스마스', date: '2026-12-25', type: 'holiday', school: '전체', color: 'bg-purple-500', description: '' },

  // ═══════ 학원 일정 ═══════
  { id: 'e0', title: '설 연휴 휴원', date: '2026-02-16', type: 'academy', school: '전체', color: 'bg-blue-500', description: '설날 연휴 휴원 (2/16~2/18)' },
  { id: 'e1', title: '중간고사 대비반 개강', date: '2026-02-25', type: 'academy', school: '전체', color: 'bg-blue-500', description: '중등·고등부 중간고사 대비 특강 개강' },
  { id: 'e4', title: '봄학기 개강', date: '2026-03-02', type: 'academy', school: '전체', color: 'bg-blue-500', description: '2026학년도 1학기 정규 수업 시작' },
  { id: 'e5', title: '학부모 간담회', date: '2026-03-14', type: 'academy', school: '전체', color: 'bg-blue-500', description: '1학기 학습 계획 및 진도 안내' },
  { id: 'e6', title: '월말 정기 테스트', date: '2026-03-28', type: 'academy', school: '전체', color: 'bg-blue-500', description: '전 학년 월말 정기 평가' },
  { id: 'e7', title: '중간고사 특강 시작', date: '2026-04-06', type: 'academy', school: '전체', color: 'bg-blue-500', description: '중·고등부 1학기 중간고사 대비 집중 특강' },
  { id: 'e8', title: '월말 정기 테스트', date: '2026-04-25', type: 'academy', school: '전체', color: 'bg-blue-500', description: '전 학년 월말 정기 평가' },
  { id: 'e9', title: '기말고사 대비반', date: '2026-06-01', type: 'academy', school: '전체', color: 'bg-blue-500', description: '1학기 기말고사 대비 특강 개강' },
  { id: 'e10', title: '여름방학 특강', date: '2026-07-20', type: 'academy', school: '전체', color: 'bg-blue-500', description: '여름방학 집중 보충 및 선행 프로그램' },

  // ═══════ 시험 일정 (전국) ═══════
  { id: 'e3', title: '3월 모의고사', date: '2026-03-12', type: 'exam', school: '전체', color: 'bg-red-500', description: '고1·2·3 전국연합학력평가' },
  { id: 'e13', title: '6월 모의평가', date: '2026-06-04', type: 'exam', school: '전체', color: 'bg-red-500', description: '대학수학능력시험 6월 모의평가' },
  { id: 'e14', title: '9월 모의평가', date: '2026-09-02', type: 'exam', school: '전체', color: 'bg-red-500', description: '대학수학능력시험 9월 모의평가' },
  { id: 'e15', title: '수능', date: '2026-11-19', type: 'exam', school: '전체', color: 'bg-red-500', description: '2027학년도 대학수학능력시험' },

  // ═══════ 초등학교 2026 학사일정 (예상) ═══════
  // --- 해밀초 ---
  { id: 'sc_he1', title: '해밀초 입학/개학', date: '2026-03-02', type: 'school', school: '해밀초', color: 'bg-green-500', description: '2026학년도 1학기 입학식 및 개학' },
  { id: 'sc_he2', title: '해밀초 학부모 상담주간', date: '2026-03-30', type: 'school', school: '해밀초', color: 'bg-green-500', description: '학부모 상담주간 (3/30~4/3)' },
  { id: 'sc_he3', title: '해밀초 봄 재량휴업일', date: '2026-05-04', type: 'school', school: '해밀초', color: 'bg-green-500', description: '봄 재량휴업일' },
  { id: 'sc_he4', title: '해밀초 여름방학식', date: '2026-07-17', type: 'school', school: '해밀초', color: 'bg-green-500', description: '1학기 여름방학 시작' },
  { id: 'sc_he5', title: '해밀초 2학기 개학', date: '2026-08-24', type: 'school', school: '해밀초', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_he6', title: '해밀초 가을 재량휴업일', date: '2026-10-12', type: 'school', school: '해밀초', color: 'bg-green-500', description: '가을 재량휴업일 (한글날 연계)' },
  { id: 'sc_he7', title: '해밀초 겨울방학/졸업식', date: '2027-01-05', type: 'school', school: '해밀초', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // --- 진접초 ---
  { id: 'sc_ji1', title: '진접초 입학/개학', date: '2026-03-02', type: 'school', school: '진접초', color: 'bg-green-500', description: '2026학년도 1학기 입학식 및 개학' },
  { id: 'sc_ji2', title: '진접초 학부모 상담주간', date: '2026-03-30', type: 'school', school: '진접초', color: 'bg-green-500', description: '학부모 상담주간 (3/30~4/3)' },
  { id: 'sc_ji3', title: '진접초 봄 재량휴업일', date: '2026-05-04', type: 'school', school: '진접초', color: 'bg-green-500', description: '봄 재량휴업일' },
  { id: 'sc_ji4', title: '진접초 여름방학식', date: '2026-07-17', type: 'school', school: '진접초', color: 'bg-green-500', description: '1학기 여름방학 시작' },
  { id: 'sc_ji5', title: '진접초 2학기 개학', date: '2026-08-24', type: 'school', school: '진접초', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_ji6', title: '진접초 가을 재량휴업일', date: '2026-10-12', type: 'school', school: '진접초', color: 'bg-green-500', description: '가을 재량휴업일 (한글날 연계)' },
  { id: 'sc_ji7', title: '진접초 겨울방학/졸업식', date: '2027-01-05', type: 'school', school: '진접초', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // --- 주곡초 ---
  { id: 'sc_ju1', title: '주곡초 입학/개학', date: '2026-03-02', type: 'school', school: '주곡초', color: 'bg-green-500', description: '2026학년도 1학기 입학식 및 개학' },
  { id: 'sc_ju2', title: '주곡초 학부모 상담주간', date: '2026-03-30', type: 'school', school: '주곡초', color: 'bg-green-500', description: '학부모 상담주간 (3/30~4/3)' },
  { id: 'sc_ju3', title: '주곡초 봄 재량휴업일', date: '2026-05-04', type: 'school', school: '주곡초', color: 'bg-green-500', description: '봄 재량휴업일' },
  { id: 'sc_ju4', title: '주곡초 여름방학식', date: '2026-07-17', type: 'school', school: '주곡초', color: 'bg-green-500', description: '1학기 여름방학 시작' },
  { id: 'sc_ju5', title: '주곡초 2학기 개학', date: '2026-08-24', type: 'school', school: '주곡초', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_ju6', title: '주곡초 가을 재량휴업일', date: '2026-10-12', type: 'school', school: '주곡초', color: 'bg-green-500', description: '가을 재량휴업일 (한글날 연계)' },
  { id: 'sc_ju7', title: '주곡초 겨울방학/졸업식', date: '2027-01-05', type: 'school', school: '주곡초', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // ═══════ 중학교 2026 학사일정 (예상) ═══════
  // --- 풍양중 ---
  { id: 'sc_py1', title: '풍양중 개학식', date: '2026-03-02', type: 'school', school: '풍양중', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_py2', title: '풍양중 1학기 중간고사', date: '2026-04-27', type: 'exam', school: '풍양중', color: 'bg-red-500', description: '1학기 중간고사 (4/27~4/30)' },
  { id: 'sc_py3', title: '풍양중 1학기 기말고사', date: '2026-07-01', type: 'exam', school: '풍양중', color: 'bg-red-500', description: '1학기 기말고사 (7/1~7/3)' },
  { id: 'sc_py4', title: '풍양중 여름방학식', date: '2026-07-17', type: 'school', school: '풍양중', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_py5', title: '풍양중 2학기 개학', date: '2026-08-17', type: 'school', school: '풍양중', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_py6', title: '풍양중 2학기 중간고사', date: '2026-10-12', type: 'exam', school: '풍양중', color: 'bg-red-500', description: '2학기 중간고사 (10/12~10/15)' },
  { id: 'sc_py7', title: '풍양중 2학기 기말고사', date: '2026-12-09', type: 'exam', school: '풍양중', color: 'bg-red-500', description: '2학기 기말고사 (12/9~12/11)' },
  { id: 'sc_py8', title: '풍양중 겨울방학/졸업식', date: '2026-12-31', type: 'school', school: '풍양중', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // --- 주곡중 ---
  { id: 'sc_jm1', title: '주곡중 개학식', date: '2026-03-02', type: 'school', school: '주곡중', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_jm2', title: '주곡중 1학기 중간고사', date: '2026-04-27', type: 'exam', school: '주곡중', color: 'bg-red-500', description: '1학기 중간고사 (4/27~4/30)' },
  { id: 'sc_jm3', title: '주곡중 1학기 기말고사', date: '2026-07-01', type: 'exam', school: '주곡중', color: 'bg-red-500', description: '1학기 기말고사 (7/1~7/3)' },
  { id: 'sc_jm4', title: '주곡중 여름방학식', date: '2026-07-17', type: 'school', school: '주곡중', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_jm5', title: '주곡중 2학기 개학', date: '2026-08-17', type: 'school', school: '주곡중', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_jm6', title: '주곡중 2학기 중간고사', date: '2026-10-12', type: 'exam', school: '주곡중', color: 'bg-red-500', description: '2학기 중간고사 (10/12~10/15)' },
  { id: 'sc_jm7', title: '주곡중 2학기 기말고사', date: '2026-12-09', type: 'exam', school: '주곡중', color: 'bg-red-500', description: '2학기 기말고사 (12/9~12/11)' },
  { id: 'sc_jm8', title: '주곡중 겨울방학/졸업식', date: '2026-12-31', type: 'school', school: '주곡중', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // --- 진접중 ---
  { id: 'sc_jj1', title: '진접중 개학식', date: '2026-03-02', type: 'school', school: '진접중', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_jj2', title: '진접중 1학기 중간고사', date: '2026-04-27', type: 'exam', school: '진접중', color: 'bg-red-500', description: '1학기 중간고사 (4/27~4/30)' },
  { id: 'sc_jj3', title: '진접중 1학기 기말고사', date: '2026-07-01', type: 'exam', school: '진접중', color: 'bg-red-500', description: '1학기 기말고사 (7/1~7/3)' },
  { id: 'sc_jj4', title: '진접중 여름방학식', date: '2026-07-17', type: 'school', school: '진접중', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_jj5', title: '진접중 2학기 개학', date: '2026-08-17', type: 'school', school: '진접중', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_jj6', title: '진접중 2학기 중간고사', date: '2026-10-12', type: 'exam', school: '진접중', color: 'bg-red-500', description: '2학기 중간고사 (10/12~10/15)' },
  { id: 'sc_jj7', title: '진접중 2학기 기말고사', date: '2026-12-09', type: 'exam', school: '진접중', color: 'bg-red-500', description: '2학기 기말고사 (12/9~12/11)' },
  { id: 'sc_jj8', title: '진접중 겨울방학/졸업식', date: '2026-12-31', type: 'school', school: '진접중', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },
  { id: 'e2', title: '진접중 체육대회', date: '2026-05-08', type: 'school', school: '진접중', color: 'bg-green-500', description: '진접중학교 봄 체육대회' },

  // --- 광동중 ---
  { id: 'sc_gd1', title: '광동중 개학식', date: '2026-03-02', type: 'school', school: '광동중', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_gd2', title: '광동중 1학기 중간고사', date: '2026-04-27', type: 'exam', school: '광동중', color: 'bg-red-500', description: '1학기 중간고사 (4/27~4/30)' },
  { id: 'sc_gd3', title: '광동중 1학기 기말고사', date: '2026-07-01', type: 'exam', school: '광동중', color: 'bg-red-500', description: '1학기 기말고사 (7/1~7/3)' },
  { id: 'sc_gd4', title: '광동중 여름방학식', date: '2026-07-17', type: 'school', school: '광동중', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_gd5', title: '광동중 2학기 개학', date: '2026-08-17', type: 'school', school: '광동중', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_gd6', title: '광동중 2학기 중간고사', date: '2026-10-12', type: 'exam', school: '광동중', color: 'bg-red-500', description: '2학기 중간고사 (10/12~10/15)' },
  { id: 'sc_gd7', title: '광동중 2학기 기말고사', date: '2026-12-09', type: 'exam', school: '광동중', color: 'bg-red-500', description: '2학기 기말고사 (12/9~12/11)' },
  { id: 'sc_gd8', title: '광동중 겨울방학/졸업식', date: '2026-12-31', type: 'school', school: '광동중', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // ═══════ 고등학교 2026 학사일정 (예상) ═══════
  // --- 진접고 ---
  { id: 'sc_jg1', title: '진접고 개학식', date: '2026-03-02', type: 'school', school: '진접고', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_jg2', title: '진접고 1학기 중간고사', date: '2026-04-22', type: 'exam', school: '진접고', color: 'bg-red-500', description: '1학기 중간고사 (4/22~4/24)' },
  { id: 'sc_jg3', title: '진접고 1학기 기말고사', date: '2026-06-29', type: 'exam', school: '진접고', color: 'bg-red-500', description: '1학기 기말고사 (6/29~7/1)' },
  { id: 'sc_jg4', title: '진접고 여름방학식', date: '2026-07-17', type: 'school', school: '진접고', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_jg5', title: '진접고 2학기 개학', date: '2026-08-17', type: 'school', school: '진접고', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_jg6', title: '진접고 2학기 중간고사', date: '2026-10-05', type: 'exam', school: '진접고', color: 'bg-red-500', description: '2학기 중간고사 (10/5~10/8)' },
  { id: 'sc_jg7', title: '진접고 2학기 기말고사', date: '2026-12-02', type: 'exam', school: '진접고', color: 'bg-red-500', description: '2학기 기말고사 (12/2~12/4)' },
  { id: 'sc_jg8', title: '진접고 겨울방학/졸업식', date: '2026-12-30', type: 'school', school: '진접고', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },

  // --- 별내고 ---
  { id: 'sc_bn1', title: '별내고 개학식', date: '2026-03-02', type: 'school', school: '별내고', color: 'bg-green-500', description: '2026학년도 1학기 개학' },
  { id: 'sc_bn2', title: '별내고 1학기 중간고사', date: '2026-04-22', type: 'exam', school: '별내고', color: 'bg-red-500', description: '1학기 중간고사 (4/22~4/24)' },
  { id: 'sc_bn3', title: '별내고 1학기 기말고사', date: '2026-06-29', type: 'exam', school: '별내고', color: 'bg-red-500', description: '1학기 기말고사 (6/29~7/1)' },
  { id: 'sc_bn4', title: '별내고 여름방학식', date: '2026-07-17', type: 'school', school: '별내고', color: 'bg-green-500', description: '여름방학 시작' },
  { id: 'sc_bn5', title: '별내고 2학기 개학', date: '2026-08-17', type: 'school', school: '별내고', color: 'bg-green-500', description: '2학기 개학식' },
  { id: 'sc_bn6', title: '별내고 2학기 중간고사', date: '2026-10-05', type: 'exam', school: '별내고', color: 'bg-red-500', description: '2학기 중간고사 (10/5~10/8)' },
  { id: 'sc_bn7', title: '별내고 2학기 기말고사', date: '2026-12-02', type: 'exam', school: '별내고', color: 'bg-red-500', description: '2학기 기말고사 (12/2~12/4)' },
  { id: 'sc_bn8', title: '별내고 겨울방학/졸업식', date: '2026-12-30', type: 'school', school: '별내고', color: 'bg-green-500', description: '겨울방학식 및 졸업식' },
];

// legacy compat — for Home.tsx that reads calendarEvents directly
export const calendarEvents = defaultCalendarEvents.map(e => ({
  ...e,
  date: (() => { const [y, m, d] = e.date.split('-').map(Number); return new Date(y, m - 1, d); })(),
}));

export function getCalendarEvents(): CalendarEvent[] {
  const raw = localStorage.getItem('g1230_calendarEvents');
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fall through */ }
  }
  return defaultCalendarEvents;
}

export function saveCalendarEvents(items: CalendarEvent[]) {
  localStorage.setItem('g1230_calendarEvents', JSON.stringify(items));
}

export const studentGrades = [
  { subject: '1학기 중간', score: 85 },
  { subject: '1학기 기말', score: 92 },
  { subject: '2학기 중간', score: 88 },
  { subject: '2학기 기말', score: 95 },
];

// --- 팝업 관리 ---
export interface PopupItem {
  id: string;
  imageUrl: string;
  clickAction: 'link' | 'page' | 'none';
  linkUrl: string;
  targetPage: string;
  openInNewTab: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
  pcWidth: number;
  pcTop: number;
  pcLeft: number;
  pcCenterAlign: boolean;
  mobileWidth: number;
  mobileTop: number;
  mobileCenterAlign: boolean;
  showCloseToday: boolean;
  showOverlay: boolean;
  slideInterval: number;
}

export interface PopupSettings {
  enabled: boolean;
  defaultSlideInterval: number;
}

const POPUPS_KEY = 'g1230_popups';
const POPUP_SETTINGS_KEY = 'g1230_popup_settings';

const defaultPopups: PopupItem[] = [
  {
    id: 'popup_default_1',
    imageUrl: 'https://picsum.photos/seed/g1230popup/400/500',
    clickAction: 'page',
    linkUrl: '',
    targetPage: '/courses',
    openInNewTab: false,
    startDate: '2026-02-22',
    endDate: '2026-03-31',
    isActive: true,
    order: 1,
    pcWidth: 400,
    pcTop: 100,
    pcLeft: 100,
    pcCenterAlign: true,
    mobileWidth: 300,
    mobileTop: 50,
    mobileCenterAlign: true,
    showCloseToday: true,
    showOverlay: true,
    slideInterval: 5,
  },
];

const defaultPopupSettings: PopupSettings = {
  enabled: true,
  defaultSlideInterval: 5,
};

export function getPopups(): PopupItem[] {
  const saved = localStorage.getItem(POPUPS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fallback */ }
  }
  return defaultPopups;
}

export function savePopups(popups: PopupItem[]) {
  localStorage.setItem(POPUPS_KEY, JSON.stringify(popups));
}

export function getPopupSettings(): PopupSettings {
  const saved = localStorage.getItem(POPUP_SETTINGS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fallback */ }
  }
  return defaultPopupSettings;
}

export function savePopupSettings(settings: PopupSettings) {
  localStorage.setItem(POPUP_SETTINGS_KEY, JSON.stringify(settings));
}

// ── 강사진 프로필 ──
export interface InstructorProfile {
  id: string;
  name: string;
  title: string;
  desc: string;
  img: string;
  color: string;
  order: number;
}

const INSTRUCTORS_KEY = 'g1230_instructors';
const defaultInstructors: InstructorProfile[] = [
  { id: 'inst1', name: '김수학', title: '원장 / 수학 전문 강사', desc: '서울대 수학교육과 졸업 | 15년 경력\n수능 수학 1등급 배출 다수', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=KimMath&backgroundColor=c0aede&skinColor=f2d3b1', color: 'from-indigo-500 to-blue-600', order: 1 },
  { id: 'inst2', name: '박미적', title: '고등부 전문 강사', desc: '연세대 수학과 졸업 | 8년 경력\n미적분·기하 전문', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ParkMJ&backgroundColor=fef3c7&skinColor=f2d3b1', color: 'from-blue-500 to-cyan-600', order: 2 },
  { id: 'inst3', name: '이함수', title: '중등부 전문 강사', desc: '고려대 수학과 졸업 | 10년 경력\n내신 집중 관리 전문', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=LeeHS&backgroundColor=b6e3f4&skinColor=f2d3b1', color: 'from-emerald-500 to-teal-600', order: 3 },
  { id: 'inst4', name: '최연산', title: '초등부 전문 강사', desc: '이화여대 수학교육과 졸업 | 7년 경력\n사고력·연산 능력 개발', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ChoiYS&backgroundColor=d1fae5&skinColor=f2d3b1', color: 'from-amber-500 to-orange-600', order: 4 },
];

export function getInstructorProfiles(): InstructorProfile[] {
  const saved = localStorage.getItem(INSTRUCTORS_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultInstructors;
}
export function saveInstructorProfiles(items: InstructorProfile[]) { localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(items)); }

// ── 시설 갤러리 (About 페이지) ──
export interface FacilityPhoto {
  id: string;
  imageUrl: string;
  title: string;
  order: number;
}

const FACILITIES_KEY = 'g1230_facilities';
const defaultFacilities: FacilityPhoto[] = [
  { id: 'fac1', imageUrl: 'https://picsum.photos/seed/fac1/600/400', title: '강의실', order: 1 },
  { id: 'fac2', imageUrl: 'https://picsum.photos/seed/fac2/600/400', title: '자습실', order: 2 },
  { id: 'fac3', imageUrl: 'https://picsum.photos/seed/fac3/600/400', title: '로비', order: 3 },
  { id: 'fac4', imageUrl: 'https://picsum.photos/seed/fac4/600/400', title: '상담실', order: 4 },
  { id: 'fac5', imageUrl: 'https://picsum.photos/seed/fac5/600/400', title: '교재실', order: 5 },
  { id: 'fac6', imageUrl: 'https://picsum.photos/seed/fac6/600/400', title: '휴게 공간', order: 6 },
];

export function getFacilityPhotos(): FacilityPhoto[] {
  const saved = localStorage.getItem(FACILITIES_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultFacilities;
}
export function saveFacilityPhotos(items: FacilityPhoto[]) { localStorage.setItem(FACILITIES_KEY, JSON.stringify(items)); }

// ── 수강 반 (개설 반 & 시간표) ──
export interface CourseClass {
  id: string;
  departmentId: 'elementary' | 'middle' | 'high';
  name: string;
  time: string;
  price: string;
  students: number;
  enrolled: number;
  level: string;
  order: number;
}

const COURSES_KEY = 'g1230_courses';
const defaultCourseClasses: CourseClass[] = [
  // 초등부
  { id: 'cc1', departmentId: 'elementary', name: '기초 연산반', time: '월/수/금 15:00-16:30', price: '180,000원', students: 8, enrolled: 6, level: '초3~4', order: 1 },
  { id: 'cc2', departmentId: 'elementary', name: '사고력 수학반', time: '화/목 15:00-16:30', price: '160,000원', students: 10, enrolled: 7, level: '초4~5', order: 2 },
  { id: 'cc3', departmentId: 'elementary', name: '중등 준비반', time: '월/수/금 16:30-18:00', price: '200,000원', students: 8, enrolled: 5, level: '초5~6', order: 3 },
  // 중등부
  { id: 'cc4', departmentId: 'middle', name: '기본 개념반', time: '월/수/금 17:00-19:00', price: '220,000원', students: 12, enrolled: 9, level: '중1~2', order: 1 },
  { id: 'cc5', departmentId: 'middle', name: '심화 응용반', time: '화/목/토 17:00-19:00', price: '240,000원', students: 10, enrolled: 8, level: '중2~3', order: 2 },
  { id: 'cc6', departmentId: 'middle', name: '내신 대비 특강', time: '시험 2주 전 집중', price: '120,000원', students: 8, enrolled: 4, level: '중1~3', order: 3 },
  { id: 'cc7', departmentId: 'middle', name: '고등 선행반', time: '월/수/금 19:00-21:00', price: '260,000원', students: 8, enrolled: 6, level: '중3', order: 4 },
  // 고등부
  { id: 'cc8', departmentId: 'high', name: '수학(상)·(하) 반', time: '월/수/금 18:00-20:00', price: '280,000원', students: 10, enrolled: 7, level: '고1', order: 1 },
  { id: 'cc9', departmentId: 'high', name: '수학Ⅰ·Ⅱ 반', time: '화/목/토 18:00-20:00', price: '300,000원', students: 8, enrolled: 6, level: '고2', order: 2 },
  { id: 'cc10', departmentId: 'high', name: '미적분·기하 반', time: '월/수/금 20:00-22:00', price: '320,000원', students: 8, enrolled: 5, level: '고2~3', order: 3 },
  { id: 'cc11', departmentId: 'high', name: '수능 집중반', time: '화/목/토 20:00-22:00', price: '350,000원', students: 6, enrolled: 4, level: '고3', order: 4 },
];

export function getCourseClasses(): CourseClass[] {
  const saved = localStorage.getItem(COURSES_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultCourseClasses;
}
export function saveCourseClasses(items: CourseClass[]) { localStorage.setItem(COURSES_KEY, JSON.stringify(items)); }

// ── 합격 스토리 ──
export interface SuccessStoryItem {
  id: string;
  name: string;
  school: string;
  department: string;
  admissionType: string;
  region: '서울권' | '경기권' | '의약학' | '교대';
  year: string;
  previousSchool: string;
  quote: string;
  gradeFrom?: number;
  gradeTo?: number;
  highlight: boolean;
  avatar: string;
  color: string;
}

const SUCCESS_KEY = 'g1230_success_stories';
const defaultSuccessStories: SuccessStoryItem[] = [
  { id: 's1', name: '김○○', school: '서울대학교', department: '수학교육과', admissionType: '수시 학생부종합', region: '서울권', year: '2025', previousSchool: '진접고', quote: '수학에 대한 자신감이 부족했지만, G1230에서 개념부터 탄탄히 다지면서 수능 수학 1등급을 받을 수 있었습니다. 선생님들의 세심한 관리 덕분입니다.', gradeFrom: 4, gradeTo: 1, highlight: true, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success1&backgroundColor=c0aede', color: 'from-indigo-600 to-blue-600' },
  { id: 's2', name: '이○○', school: '연세대학교', department: '전자공학과', admissionType: '정시', region: '서울권', year: '2025', previousSchool: '진접고', quote: '고2 때 수학이 3등급이었는데, G1230에서 1년 동안 집중적으로 관리 받으면서 수능에서 1등급을 받았습니다.', gradeFrom: 3, gradeTo: 1, highlight: true, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success2&backgroundColor=b6e3f4', color: 'from-blue-600 to-cyan-600' },
  { id: 's3', name: '박○○', school: '고려대학교', department: '경영학과', admissionType: '수시 논술', region: '서울권', year: '2025', previousSchool: '별내고', quote: '수학 논술 준비를 여기서 했는데, 기출 분석과 실전 연습이 정말 도움이 됐습니다.', gradeFrom: 2, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success3&backgroundColor=fef3c7', color: 'from-rose-600 to-pink-600' },
  { id: 's4', name: '정○○', school: '가천대학교', department: '의예과', admissionType: '정시', region: '의약학', year: '2025', previousSchool: '진건고', quote: '의대를 목표로 수학 만점을 노렸고, G1230의 킬러 문항 집중 훈련이 결정적이었습니다.', gradeFrom: 2, gradeTo: 1, highlight: true, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success4&backgroundColor=d1fae5', color: 'from-emerald-600 to-teal-600' },
  { id: 's5', name: '최○○', school: '서울교대', department: '초등교육과', admissionType: '수시 학생부교과', region: '교대', year: '2025', previousSchool: '별내고', quote: '내신 수학을 끌어올리는 데 G1230이 정말 큰 도움이 됐어요. 오답 클리닉이 최고였습니다.', gradeFrom: 3, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success5&backgroundColor=ffe4e6', color: 'from-amber-600 to-orange-600' },
  { id: 's6', name: '한○○', school: '성균관대학교', department: '소프트웨어학과', admissionType: '정시', region: '서울권', year: '2025', previousSchool: '진접고', quote: '수능 수학 92점으로 성균관대에 합격했습니다. 모의고사 집중 훈련이 실전에서 빛을 발했어요.', gradeFrom: 3, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success6&backgroundColor=dbeafe', color: 'from-violet-600 to-indigo-600' },
  { id: 's7', name: '윤○○', school: '경희대학교', department: '한의예과', admissionType: '수시 학생부종합', region: '의약학', year: '2025', previousSchool: '진접고', quote: '한의대 합격의 핵심은 수학이었습니다. 개념을 깊이 이해하게 해주신 선생님께 감사드립니다.', gradeFrom: 3, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success7&backgroundColor=fef9c3', color: 'from-teal-600 to-emerald-600' },
  { id: 's8', name: '강○○', school: '서울시립대학교', department: '수학과', admissionType: '정시', region: '서울권', year: '2024', previousSchool: '진접고', quote: '수학 4등급에서 시작해 2등급까지 올린 뒤 서울시립대에 합격했습니다.', gradeFrom: 4, gradeTo: 2, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success8&backgroundColor=e0e7ff', color: 'from-blue-500 to-indigo-500' },
  { id: 's9', name: '조○○', school: '경기대학교', department: '건축학과', admissionType: '수시 학생부교과', region: '경기권', year: '2024', previousSchool: '별내고', quote: '내신 수학 1등급을 유지할 수 있었던 건 G1230의 체계적인 시험 대비 덕분이에요.', gradeFrom: 2, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success9&backgroundColor=fce7f3', color: 'from-pink-500 to-rose-500' },
  { id: 's10', name: '임○○', school: '인하대학교', department: '화학공학과', admissionType: '정시', region: '경기권', year: '2024', previousSchool: '진건고', quote: '수능 수학에서 예상보다 높은 점수를 받아 인하대에 합격할 수 있었습니다.', gradeFrom: 3, gradeTo: 2, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success10&backgroundColor=d1fae5', color: 'from-emerald-500 to-green-500' },
  { id: 's11', name: '서○○', school: '한양대학교', department: '기계공학과', admissionType: '정시', region: '서울권', year: '2023', previousSchool: '진접고', quote: '재수 시절 G1230에서 수학을 다시 시작했고, 한양대에 당당히 합격했습니다.', gradeFrom: 5, gradeTo: 2, highlight: true, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success11&backgroundColor=fef3c7', color: 'from-amber-500 to-yellow-500' },
  { id: 's12', name: '오○○', school: '중앙대학교', department: '약학과', admissionType: '수시 학생부종합', region: '의약학', year: '2023', previousSchool: '별내고', quote: '약대를 가려면 수학이 기본이라는 말을 여기서 실감했습니다.', gradeFrom: 2, gradeTo: 1, highlight: false, avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success12&backgroundColor=dbeafe', color: 'from-cyan-500 to-blue-500' },
];

export function getSuccessStories(): SuccessStoryItem[] {
  const saved = localStorage.getItem(SUCCESS_KEY);
  if (saved) { try { return JSON.parse(saved); } catch { /* fallback */ } }
  return defaultSuccessStories;
}
export function saveSuccessStories(items: SuccessStoryItem[]) { localStorage.setItem(SUCCESS_KEY, JSON.stringify(items)); }
