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

// ═══════ Supabase key-value helpers ═══════
import { supabase } from '../lib/supabase';

async function getData<T>(key: string, defaults: T): Promise<T> {
  if (!supabase) return defaults;
  try {
    const { data, error } = await supabase.from('site_data').select('value').eq('key', key).maybeSingle();
    if (error || !data) return defaults;
    return data.value as T;
  } catch { return defaults; }
}

async function saveData<T>(key: string, value: T): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('site_data').upsert({ key, value: value as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch { /* silent */ }
}

// --- 강의 관리 ---

export async function getLectures(): Promise<Lecture[]> {
  return getData('lectures', defaultLectures);
}

export async function saveLectures(items: Lecture[]) { await saveData('lectures', items); }

// --- 수강 진도 관리 ---
export interface LectureProgress {
  lectureId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0~100
  lastWatched: string;
  bookmarked: boolean;
  notes: Array<{ content: string; createdAt: string }>;
}



export async function getAllProgress(): Promise<Record<string, LectureProgress>> {
  return getData('lecture_progress', {} as Record<string, LectureProgress>);
}

export async function getProgress(lectureId: string): Promise<LectureProgress> {
  const all = await getAllProgress();
  return all[lectureId] || {
    lectureId,
    status: 'not_started',
    progress: 0,
    lastWatched: '',
    bookmarked: false,
    notes: [],
  };
}

export async function saveProgress(lectureId: string, update: Partial<LectureProgress>) {
  const all = await getAllProgress();
  const current = all[lectureId] || {
    lectureId,
    status: 'not_started' as const,
    progress: 0,
    lastWatched: '',
    bookmarked: false,
    notes: [],
  };
  all[lectureId] = { ...current, ...update };
  await saveData('lecture_progress', all);
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

export async function getAssignments(): Promise<InstructorAssignment[]> {
  return getData('instructor_assignments', defaultAssignments);
}

export async function saveAssignments(items: InstructorAssignment[]) { await saveData('instructor_assignments', items); }

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

export async function getNotices(): Promise<NoticeItem[]> {
  return getData('notices', defaultNotices);
}
export async function saveNotices(items: NoticeItem[]) { await saveData('notices', items); }

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

export async function getBlogPosts(): Promise<BlogPost[]> {
  return getData('blog', defaultBlogPosts);
}
export async function saveBlogPosts(items: BlogPost[]) { await saveData('blog', items); }

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

export async function getGallery(): Promise<GalleryItem[]> {
  return getData('gallery', defaultGallery);
}
export async function saveGallery(items: GalleryItem[]) { await saveData('gallery', items); }

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

export async function getResources(): Promise<ResourceItem[]> {
  return getData('resources', defaultResources);
}
export async function saveResources(items: ResourceItem[]) { await saveData('resources', items); }

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

export async function getFaqs(): Promise<FaqItem[]> {
  return getData('faq', defaultFaqs);
}
export async function saveFaqs(items: FaqItem[]) { await saveData('faq', items); }

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
  password?: string;
}

const INQUIRIES_KEY = 'g1230_inquiries';
const defaultInquiries: InquiryItem[] = [
  { id: 'inq1', title: '여름 특강 일정이 궁금합니다', author: '김학부모', date: '2025-02-20', isPrivate: false, category: '수업 문의', views: 45, content: '안녕하세요. 중2 아이 학부모입니다. 여름방학 특강 일정과 커리큘럼이 궁금합니다.', answer: '여름 특강은 7월 21일~8월 16일(4주) 과정으로 운영됩니다. 6월 초에 공지사항으로 안내드리겠습니다.', answerDate: '2025-02-20' },
  { id: 'inq2', title: '수학 진단 테스트 결과 문의', author: '이○○맘', date: '2025-02-18', isPrivate: true, category: '상담 문의', views: 12, content: '진단 테스트 결과가 언제 나오나요?', answer: '결과는 보통 2~3일 내에 나옵니다. 개별 연락 드리겠습니다.', answerDate: '2025-02-19' },
  { id: 'inq3', title: '주차장 이용 관련 문의드립니다', author: '박학부모', date: '2025-02-17', isPrivate: false, category: '시설 문의', views: 38, content: '상담 방문 시 주차가 가능한가요?', answer: '건물 지하 주차장에 학부모님 전용 주차 공간이 있습니다. 30분 무료 주차 가능합니다.', answerDate: '2025-02-17' },
  { id: 'inq4', title: '셔틀버스 노선 변경 요청', author: '윤학부모', date: '2025-02-10', isPrivate: false, category: '차량 문의', views: 52, content: '현재 3호차를 이용 중인데 이사를 하게 되어 노선 변경이 가능한지 문의드립니다.' },
  { id: 'inq5', title: '형제 할인이 있나요?', author: '송○○', date: '2025-02-03', isPrivate: true, category: '수강 문의', views: 15, content: '두 아이를 함께 보내려고 하는데 형제 할인 혜택이 있나요?' },
];

export async function getInquiries(): Promise<InquiryItem[]> {
  return getData('inquiries', defaultInquiries);
}
export async function saveInquiries(items: InquiryItem[]) { await saveData('inquiries', items); }

// --- 학원 히스토리 관리 ---
export interface HistoryItem {
  id: string;
  year: string;
  title: string;
  desc: string;
  icon: string;
  order: number;
}

const defaultHistoryItems: HistoryItem[] = [
  { id: 'hi1', year: '2011', title: '학원 개원', desc: '진접읍 해밀예당 1로 171에 "G1230 수학전문학원" 개원. 중등부 2개 반으로 시작.', icon: '🏫', order: 1 },
  { id: 'hi2', year: '2012', title: '초등부 개설', desc: '초등 3~6학년 대상 기초 연산·사고력 과정 신설. 학생 수 50명 돌파.', icon: '📚', order: 2 },
  { id: 'hi3', year: '2014', title: '고등부 확장', desc: '고등 내신·수능 전문 과정 개설. 첫 수능 수학 1등급 배출.', icon: '🎓', order: 3 },
  { id: 'hi4', year: '2015', title: '100명 돌파', desc: '재원생 100명 돌파. 소수정예 시스템으로 학생별 맞춤 관리 체계 확립.', icon: '🎯', order: 4 },
  { id: 'hi5', year: '2017', title: '셔틀버스 운행 시작', desc: '진접·별내·진건 지역 3개 노선 셔틀버스 운행 개시.', icon: '🚌', order: 5 },
  { id: 'hi6', year: '2018', title: '첫 SKY 합격자 배출', desc: '서울대학교 합격생 배출. 누적 주요 대학 합격자 30명 돌파.', icon: '🏆', order: 6 },
  { id: 'hi7', year: '2019', title: '학원 확장 이전', desc: '증가하는 수요에 맞춰 현 위치(제일프라자)로 확장 이전. 자습실·상담실 신설.', icon: '🏢', order: 7 },
  { id: 'hi8', year: '2020', title: '온라인 강의 시스템 도입', desc: '코로나19 대응 비대면 수업 체계 구축. 동영상 강의실 개설.', icon: '💻', order: 8 },
  { id: 'hi9', year: '2021', title: '10주년 & 200명 돌파', desc: '개원 10주년 기념. 재원생 200명 돌파, 누적 합격자 150명 달성.', icon: '🎉', order: 9 },
  { id: 'hi10', year: '2023', title: '학부모 서비스 런칭', desc: '실시간 출결 확인, 성적표 조회, 온라인 상담 신청 시스템 오픈.', icon: '📱', order: 10 },
  { id: 'hi11', year: '2024', title: '의약학 합격자 다수 배출', desc: '의대·약대·한의대 합격자 15명 돌파. 심화 수학 전문 과정 강화.', icon: '⚕️', order: 11 },
  { id: 'hi12', year: '2025', title: '15주년, 새로운 도약', desc: '누적 합격자 320명 돌파. AI 기반 학습 분석 시스템 도입 예정.', icon: '🚀', order: 12 },
];

export async function getHistoryItems(): Promise<HistoryItem[]> {
  return getData('history_items', defaultHistoryItems);
}
export async function saveHistoryItems(items: HistoryItem[]) { await saveData('history_items', items); }

// --- 수강안내 부서 배너 관리 ---
export interface DepartmentInfo {
  id: 'elementary' | 'middle' | 'high';
  grades: string;
  desc: string;
  highlights: string[];
}

const defaultDepartmentInfo: DepartmentInfo[] = [
  { id: 'elementary', grades: '초3 ~ 초6', desc: '수학적 사고력과 연산 능력의 기초를 탄탄히', highlights: ['연산·사고력 강화', '서술형 문제 훈련', '영재원 대비'] },
  { id: 'middle', grades: '중1 ~ 중3', desc: '내신 완벽 대비, 수학 자신감 UP', highlights: ['교과서·기출 분석', '선행 학습', '월 1회 모의고사'] },
  { id: 'high', grades: '고1 ~ 고3', desc: '수능·내신 1등급을 향한 체계적 관리', highlights: ['EBS 연계 분석', '킬러 문항 훈련', '1:1 첨삭'] },
];

export async function getDepartmentInfo(): Promise<DepartmentInfo[]> {
  return getData('department_info', defaultDepartmentInfo);
}
export async function saveDepartmentInfo(items: DepartmentInfo[]) { await saveData('department_info', items); }

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

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  return getData('calendar_events', defaultCalendarEvents);
}

export async function saveCalendarEvents(items: CalendarEvent[]) { await saveData('calendar_events', items); }

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

export async function getPopups(): Promise<PopupItem[]> {
  return getData('popups', defaultPopups);
}

export async function savePopups(items: PopupItem[]) { await saveData('popups', items); }

export async function getPopupSettings(): Promise<PopupSettings> {
  return getData('popup_settings', defaultPopupSettings);
}

export async function savePopupSettings(settings: PopupSettings) { await saveData('popup_settings', settings); }

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

export async function getInstructorProfiles(): Promise<InstructorProfile[]> {
  return getData('instructors', defaultInstructors);
}
export async function saveInstructorProfiles(items: InstructorProfile[]) { await saveData('instructors', items); }

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

export async function getFacilityPhotos(): Promise<FacilityPhoto[]> {
  return getData('facilities', defaultFacilities);
}
export async function saveFacilityPhotos(items: FacilityPhoto[]) { await saveData('facilities', items); }

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
  // 강사 관리 / 수납 연동용 (optional)
  grade?: string;        // '초등' | '중등' | '고등'
  subject?: string;
  teacherId?: string;
  days?: string[];
  maxStudents?: number;
  fee?: number;          // 월 수강료(숫자)
}

// (수강반 데이터 및 함수는 아래 COURSE CLASSES 섹션에서 통합 관리)


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

export async function getSuccessStories(): Promise<SuccessStoryItem[]> {
  return getData('success_stories', defaultSuccessStories);
}
export async function saveSuccessStories(items: SuccessStoryItem[]) { await saveData('success_stories', items); }

// ── 합격 스토리 통계 ──
export interface SuccessStoryStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  desc: string;
  order: number;
}

const SS_STAT_KEY = 'g1230_success_stats';
const defaultSuccessStats: SuccessStoryStat[] = [
  { id: 'ss1', label: '누적 대입 합격', value: 320, suffix: '+', desc: '명', order: 1 },
  { id: 'ss2', label: 'SKY 합격', value: 28, suffix: '', desc: '명', order: 2 },
  { id: 'ss3', label: '의약학 합격', value: 15, suffix: '', desc: '명', order: 3 },
  { id: 'ss4', label: '수학 1등급 비율', value: 87, suffix: '', desc: '%', order: 4 },
];

export async function getSuccessStats(): Promise<SuccessStoryStat[]> {
  return getData('success_stats', defaultSuccessStats);
}
export async function saveSuccessStats(items: SuccessStoryStat[]) { await saveData('success_stats', items); }

/* ═══════ HOME: Stats ═══════ */
export interface HomeStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  desc: string;
  decimals?: number;
  order: number;
}
const defaultHomeStats: HomeStat[] = [
  { id: 'hs1', label: '누적 수강생', value: 1200, suffix: '+', desc: '명', order: 1 },
  { id: 'hs2', label: '내신 1등급 비율', value: 87, suffix: '', desc: '%', order: 2 },
  { id: 'hs3', label: '수업 만족도', value: 4.9, suffix: '', desc: '/5.0', decimals: 1, order: 3 },
  { id: 'hs4', label: '운영', value: 15, suffix: '', desc: '년', order: 4 },
];
export async function getHomeStats(): Promise<HomeStat[]> {
  return getData('home_stats', defaultHomeStats);
}
export async function saveHomeStats(items: HomeStat[]) { await saveData('home_stats', items); }

/* ═══════ HOME: Testimonials ═══════ */
export interface HomeTestimonial {
  id: string;
  name: string;
  grade: string;
  content: string;
  before: number;
  after: number;
  order: number;
}
const defaultTestimonials: HomeTestimonial[] = [
  { id: 'ht1', name: '김○○ 학부모', grade: '중2', content: '수학 성적이 60점대에서 94점으로 올랐습니다. 선생님의 꼼꼼한 관리와 오답 클리닉 덕분이에요.', before: 62, after: 94, order: 1 },
  { id: 'ht2', name: '이○○ 학생', grade: '고1', content: '수학을 싫어했는데 여기서 개념부터 다시 잡고 나니까 자신감이 생겼어요. 이번 중간고사 1등급!', before: 71, after: 96, order: 2 },
  { id: 'ht3', name: '박○○ 학부모', grade: '초5', content: '아이가 수학 학원을 즐거워합니다. 사고력 수업이 재밌다고 하네요. 영재원 준비도 잘 되고 있어요.', before: 78, after: 97, order: 3 },
  { id: 'ht4', name: '최○○ 학생', grade: '중3', content: '고등 선행까지 탄탄하게 준비할 수 있어서 좋아요. 모의고사 성적도 꾸준히 상승 중입니다.', before: 55, after: 88, order: 4 },
];
export async function getHomeTestimonials(): Promise<HomeTestimonial[]> {
  return getData('home_testimonials', defaultTestimonials);
}
export async function saveHomeTestimonials(items: HomeTestimonial[]) { await saveData('home_testimonials', items); }

/* ═══════ HOME: Program Features ═══════ */
export interface HomeProgramFeature {
  id: string;
  departmentId: 'elementary' | 'middle' | 'high';
  title: string;
  desc: string;
  order: number;
}
const defaultProgramFeatures: HomeProgramFeature[] = [
  { id: 'pf1', departmentId: 'elementary', title: '연산/사고력 강화', desc: '기초 연산 능력과 수학적 사고력 개발에 초점', order: 1 },
  { id: 'pf2', departmentId: 'elementary', title: '서술형 대비', desc: '교과 서술형 문제 풀이 훈련으로 실전 감각 향상', order: 2 },
  { id: 'pf3', departmentId: 'elementary', title: '영재원 준비반', desc: '심화 사고력 및 영재교육원 입시 대비 특별반', order: 3 },
  { id: 'pf4', departmentId: 'middle', title: '내신 완벽 대비', desc: '교과서 분석, 기출 유형 훈련, 오답 클리닉 제공', order: 1 },
  { id: 'pf5', departmentId: 'middle', title: '선행 학습', desc: '다음 학기 내용 미리 준비하여 학교 수업에서 자신감', order: 2 },
  { id: 'pf6', departmentId: 'middle', title: '정기 모의고사', desc: '월 1회 실전 모의고사로 약점 파악 및 보완', order: 3 },
  { id: 'pf7', departmentId: 'high', title: '수능 만점 전략', desc: 'EBS 연계 분석, 킬러 문항 집중 훈련 과정', order: 1 },
  { id: 'pf8', departmentId: 'high', title: '내신 1등급', desc: '학교별 기출 분석 + 내신 직전 집중 대비반 운영', order: 2 },
  { id: 'pf9', departmentId: 'high', title: '1:1 첨삭 관리', desc: '개인별 약점 분석 리포트와 맞춤형 보충 학습', order: 3 },
];
export async function getProgramFeatures(): Promise<HomeProgramFeature[]> {
  return getData('program_features', defaultProgramFeatures);
}
export async function saveProgramFeatures(items: HomeProgramFeature[]) { await saveData('program_features', items); }

/* ═══════════════════════════════════════════
   CONSULT REQUESTS (상담 신청)
═══════════════════════════════════════════ */
export interface ConsultRequest {
  id: string;
  studentSchool: string;
  studentGrade: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

const CONSULT_KEY = 'g1230_consultRequests';

const defaultConsultRequests: ConsultRequest[] = [
  {
    id: 'consult_001',
    studentSchool: '진접중학교',
    studentGrade: '중2',
    phone: '010-1234-5678',
    preferredDate: '2026-02-25',
    preferredTime: '오후 3시~5시',
    message: '수학 내신 점수가 많이 떨어져서 집중 관리가 필요할 것 같습니다. 상담 부탁드립니다.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'consult_002',
    studentSchool: '별내고등학교',
    studentGrade: '고1',
    phone: '010-9876-5432',
    preferredDate: '2026-02-26',
    preferredTime: '오전 10시~12시',
    message: '고등학교 올라와서 수학이 너무 어려워졌어요. 기초부터 다시 잡고 싶습니다.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'consult_003',
    studentSchool: '진접초등학교',
    studentGrade: '초5',
    phone: '010-5555-7777',
    preferredDate: '2026-02-28',
    preferredTime: '주말 오전',
    message: '영재원 준비반 수업 가능한지 알고 싶습니다.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export async function getConsultRequests(): Promise<ConsultRequest[]> {
  return getData('consult_requests', defaultConsultRequests);
}

export async function saveConsultRequests(items: ConsultRequest[]) { await saveData('consult_requests', items); }

export async function addConsultRequest(req: Omit<ConsultRequest, 'id' | 'status' | 'createdAt'>): Promise<ConsultRequest> {
  const list = await getConsultRequests();
  const newReq: ConsultRequest = {
    ...req,
    id: `consult_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  list.unshift(newReq);
  await saveConsultRequests(list);
  return newReq;
}

const COURSE_CLASSES_KEY = 'g1230_course_classes';

const defaultCourseClasses: CourseClass[] = [
  { id: 'cc1', name: '초등 기초반', departmentId: 'elementary', grade: '초등', subject: '수학', teacherId: 'tc3', days: ['화', '목'], time: '15:00~16:30', maxStudents: 12, fee: 220000, price: '220,000원', students: 12, enrolled: 8, level: '초3~4', order: 1 },
  { id: 'cc2', name: '초등 심화반', departmentId: 'elementary', grade: '초등', subject: '수학', teacherId: 'tc3', days: ['월', '수'], time: '16:30~18:00', maxStudents: 10, fee: 260000, price: '260,000원', students: 10, enrolled: 7, level: '초4~5', order: 2 },
  { id: 'cc3', name: '초등 영재반', departmentId: 'elementary', grade: '초등', subject: '수학', teacherId: 'tc3', days: ['토'], time: '10:00~12:00', maxStudents: 8, fee: 300000, price: '300,000원', students: 8, enrolled: 5, level: '초5~6', order: 3 },
  { id: 'cc4', name: '중1 기초반', departmentId: 'middle', grade: '중등', subject: '수학', teacherId: 'tc1', days: ['월', '수', '금'], time: '16:00~18:00', maxStudents: 15, fee: 280000, price: '280,000원', students: 15, enrolled: 10, level: '중1', order: 1 },
  { id: 'cc5', name: '중2 일반반', departmentId: 'middle', grade: '중등', subject: '수학', teacherId: 'tc1', days: ['화', '목'], time: '18:00~20:00', maxStudents: 15, fee: 280000, price: '280,000원', students: 15, enrolled: 11, level: '중2', order: 2 },
  { id: 'cc6', name: '중3 심화반', departmentId: 'middle', grade: '중등', subject: '수학', teacherId: 'tc1', days: ['월', '수', '금'], time: '18:00~20:00', maxStudents: 12, fee: 320000, price: '320,000원', students: 12, enrolled: 9, level: '중3', order: 3 },
  { id: 'cc7', name: '중등 선행반', departmentId: 'middle', grade: '중등', subject: '수학', teacherId: 'tc4', days: ['토'], time: '10:00~13:00', maxStudents: 10, fee: 280000, price: '280,000원', students: 10, enrolled: 6, level: '중3', order: 4 },
  { id: 'cc8', name: '고1 기초반', departmentId: 'high', grade: '고등', subject: '수학', teacherId: 'tc2', days: ['화', '목'], time: '19:00~21:30', maxStudents: 12, fee: 350000, price: '350,000원', students: 12, enrolled: 8, level: '고1', order: 1 },
  { id: 'cc9', name: '고1 심화반', departmentId: 'high', grade: '고등', subject: '수학', teacherId: 'tc2', days: ['월', '수', '금'], time: '19:00~21:30', maxStudents: 10, fee: 390000, price: '390,000원', students: 10, enrolled: 7, level: '고1', order: 2 },
  { id: 'cc10', name: '고2 수학I·II반', departmentId: 'high', grade: '고등', subject: '수학', teacherId: 'tc2', days: ['월', '수', '금'], time: '19:30~22:00', maxStudents: 10, fee: 390000, price: '390,000원', students: 10, enrolled: 8, level: '고2', order: 3 },
  { id: 'cc11', name: '고3 수능반', departmentId: 'high', grade: '고등', subject: '수학', teacherId: 'tc2', days: ['월', '화', '목'], time: '20:00~22:30', maxStudents: 8, fee: 450000, price: '450,000원', students: 8, enrolled: 6, level: '고3', order: 4 },
];

export async function getCourseClasses(): Promise<CourseClass[]> {
  return getData(COURSE_CLASSES_KEY, defaultCourseClasses);
}
export async function saveCourseClasses(items: CourseClass[]) { await saveData(COURSE_CLASSES_KEY, items); }


/* ═══════════════════════════════════════════
   MEMBERS (회원 관리)
═══════════════════════════════════════════ */
export interface Member {
  id: string;
  name: string;
  phone: string;
  parentPhone: string;
  parentRelation?: string;  // '모' | '부' | '조부모' | '기타'
  school: string;
  grade: string;
  classId: string;
  status: 'active' | 'paused' | 'withdrawn';
  enrollDate: string;
  memo: string;
  // 확장 필드 (Phase 2)
  birthDate?: string;
  gender?: 'M' | 'F';
  address?: string;
  email?: string;
  smsConsent?: boolean;
  studentNo?: number;
}

/* ── 학생 상태 변화 이력 ── */
export interface StudentStatusHistory {
  id: string;
  memberId: string;
  memberName: string;
  fromStatus: Member['status'];
  toStatus: Member['status'];
  reason: string;        // 사유
  changedBy: string;     // 변경자 이름 (원장/직원)
  changedAt: string;     // ISO 날짜
}

const STATUS_HISTORY_KEY = 'g1230_status_history';

export async function getStatusHistory(): Promise<StudentStatusHistory[]> {
  return getData(STATUS_HISTORY_KEY, []);
}
export async function saveStatusHistory(items: StudentStatusHistory[]) {
  await saveData(STATUS_HISTORY_KEY, items);
}
export async function addStatusHistory(entry: Omit<StudentStatusHistory, 'id'>) {
  const list = await getStatusHistory();
  list.unshift({ ...entry, id: `sh_${Date.now()}` });
  await saveStatusHistory(list.slice(0, 200)); // 최근 200건 유지
}

const defaultMembers: Member[] = [
  // 초등부
  { id: 'm1', name: '김민준', phone: '010-1111-0001', parentPhone: '010-2222-0001', school: '해밀초', grade: '초3', classId: 'cc1', status: 'active', enrollDate: '2025-03-05', memo: '연산 능력 우수' },
  { id: 'm2', name: '이서연', phone: '010-1111-0002', parentPhone: '010-2222-0002', school: '진접초', grade: '초4', classId: 'cc1', status: 'active', enrollDate: '2025-04-10', memo: '' },
  { id: 'm3', name: '박지호', phone: '010-1111-0003', parentPhone: '010-2222-0003', school: '주곡초', grade: '초4', classId: 'cc2', status: 'active', enrollDate: '2025-05-02', memo: '사고력 심화 필요' },
  { id: 'm4', name: '최수아', phone: '010-1111-0004', parentPhone: '010-2222-0004', school: '해밀초', grade: '초5', classId: 'cc2', status: 'paused', enrollDate: '2025-03-12', memo: '가정 사유 휴원' },
  { id: 'm5', name: '정하윤', phone: '010-1111-0005', parentPhone: '010-2222-0005', school: '진접초', grade: '초5', classId: 'cc3', status: 'active', enrollDate: '2025-06-01', memo: '' },
  { id: 'm6', name: '강도현', phone: '010-1111-0006', parentPhone: '010-2222-0006', school: '해밀초', grade: '초6', classId: 'cc3', status: 'active', enrollDate: '2025-03-08', memo: '중등 진학 준비' },
  // 중등부
  { id: 'm7', name: '윤서준', phone: '010-1111-0007', parentPhone: '010-2222-0007', school: '진접중', grade: '중1', classId: 'cc4', status: 'active', enrollDate: '2025-03-05', memo: '' },
  { id: 'm8', name: '장예은', phone: '010-1111-0008', parentPhone: '010-2222-0008', school: '풍양중', grade: '중1', classId: 'cc4', status: 'active', enrollDate: '2025-04-15', memo: '기초 보충 진행 중' },
  { id: 'm9', name: '임주원', phone: '010-1111-0009', parentPhone: '010-2222-0009', school: '주곡중', grade: '중2', classId: 'cc4', status: 'active', enrollDate: '2025-03-10', memo: '' },
  { id: 'm10', name: '한시우', phone: '010-1111-0010', parentPhone: '010-2222-0010', school: '진접중', grade: '중2', classId: 'cc5', status: 'active', enrollDate: '2025-05-20', memo: '심화 응용 실력 양호' },
  { id: 'm11', name: '오지유', phone: '010-1111-0011', parentPhone: '010-2222-0011', school: '광동중', grade: '중2', classId: 'cc5', status: 'withdrawn', enrollDate: '2025-03-05', memo: '이사로 인한 퇴원 (2025-08)' },
  { id: 'm12', name: '송현서', phone: '010-1111-0012', parentPhone: '010-2222-0012', school: '풍양중', grade: '중3', classId: 'cc5', status: 'active', enrollDate: '2025-03-05', memo: '' },
  { id: 'm13', name: '배건우', phone: '010-1111-0013', parentPhone: '010-2222-0013', school: '주곡중', grade: '중3', classId: 'cc6', status: 'active', enrollDate: '2025-07-01', memo: '내신 대비 특강 수강' },
  { id: 'm14', name: '류지아', phone: '010-1111-0014', parentPhone: '010-2222-0014', school: '진접중', grade: '중3', classId: 'cc7', status: 'active', enrollDate: '2025-03-12', memo: '고등 선행 우수' },
  { id: 'm15', name: '남시현', phone: '010-1111-0015', parentPhone: '010-2222-0015', school: '광동중', grade: '중3', classId: 'cc7', status: 'paused', enrollDate: '2025-04-01', memo: '건강 사유 휴원' },
  { id: 'm16', name: '진수빈', phone: '010-1111-0016', parentPhone: '010-2222-0016', school: '풍양중', grade: '중1', classId: 'cc4', status: 'active', enrollDate: '2025-09-01', memo: '' },
  // 고등부
  { id: 'm17', name: '백승현', phone: '010-1111-0017', parentPhone: '010-2222-0017', school: '진접고', grade: '고1', classId: 'cc8', status: 'active', enrollDate: '2025-03-05', memo: '' },
  { id: 'm18', name: '홍유나', phone: '010-1111-0018', parentPhone: '010-2222-0018', school: '별내고', grade: '고1', classId: 'cc8', status: 'active', enrollDate: '2025-03-10', memo: '수학(상) 보충 필요' },
  { id: 'm19', name: '문태영', phone: '010-1111-0019', parentPhone: '010-2222-0019', school: '진접고', grade: '고2', classId: 'cc9', status: 'active', enrollDate: '2025-03-05', memo: '' },
  { id: 'm20', name: '양하은', phone: '010-1111-0020', parentPhone: '010-2222-0020', school: '별내고', grade: '고2', classId: 'cc9', status: 'active', enrollDate: '2025-05-15', memo: '수Ⅱ 심화 진행' },
  { id: 'm21', name: '서지환', phone: '010-1111-0021', parentPhone: '010-2222-0021', school: '진접고', grade: '고2', classId: 'cc10', status: 'withdrawn', enrollDate: '2025-03-05', memo: '타 학원 이동 (2025-09)' },
  { id: 'm22', name: '권민서', phone: '010-1111-0022', parentPhone: '010-2222-0022', school: '별내고', grade: '고3', classId: 'cc11', status: 'active', enrollDate: '2025-03-05', memo: '수능 1등급 목표' },
  { id: 'm23', name: '조현우', phone: '010-1111-0023', parentPhone: '010-2222-0023', school: '진접고', grade: '고3', classId: 'cc11', status: 'active', enrollDate: '2025-03-10', memo: '미적분 집중' },
  { id: 'm24', name: '황서영', phone: '010-1111-0024', parentPhone: '010-2222-0024', school: '진접고', grade: '고3', classId: 'cc10', status: 'paused', enrollDate: '2025-04-01', memo: '수능 직전 집중 대비 중 휴원' },
];

export async function getMembers(): Promise<Member[]> {
  return getData('members', defaultMembers);
}

export async function saveMembers(items: Member[]) { await saveData('members', items); }

/* ═══════════════════════════════════════════
   ATTENDANCE (출결 관리)
═══════════════════════════════════════════ */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string;        // 'YYYY-MM-DD'
  status: AttendanceStatus;
  note?: string;
  recordedBy?: string; // 기록자 이름
}

const ATTENDANCE_KEY = 'g1230_attendance';

export async function getAttendance(): Promise<AttendanceRecord[]> {
  return getData(ATTENDANCE_KEY, []);
}

export async function saveAttendance(items: AttendanceRecord[]) {
  await saveData(ATTENDANCE_KEY, items);
}

export async function upsertAttendance(record: AttendanceRecord) {
  const all = await getAttendance();
  const idx = all.findIndex(r => r.memberId === record.memberId && r.date === record.date);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  await saveAttendance(all);
}

/* ═══════════════════════════════════════════
   SCHEDULES (수강 스케줄)
═══════════════════════════════════════════ */
export type ScheduleStatus = 'active' | 'pending' | 'completed' | 'cancelled';

export interface MemberSchedule {
  id: string;
  memberId: string;
  classId: string;
  startDate: string;
  endDate: string;
  status: ScheduleStatus;
  note?: string;
}

const SCHEDULES_KEY = 'g1230_schedules';

export async function getMemberSchedules(): Promise<MemberSchedule[]> {
  return getData(SCHEDULES_KEY, []);
}

export async function saveMemberSchedules(items: MemberSchedule[]) {
  await saveData(SCHEDULES_KEY, items);
}

/* ═══════════════════════════════════════════
   PAYMENTS (수납/학원비)
═══════════════════════════════════════════ */
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'pg';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface PaymentRecord {
  id: string;
  memberId: string;
  scheduleId?: string;
  scheduleName: string;  // 스케줄명 직접 저장 (denormalized)
  amount: number;
  paidAt?: string;       // 수납일자
  method?: PaymentMethod;
  status: PaymentStatus;
  note?: string;
  createdBy?: string;    // 원장 이름
  createdAt: string;
}

const PAYMENTS_KEY = 'g1230_payments';

export async function getPayments(): Promise<PaymentRecord[]> {
  return getData(PAYMENTS_KEY, []);
}

export async function savePayments(items: PaymentRecord[]) {
  await saveData(PAYMENTS_KEY, items);
}

/* ═══════════════════════════════════════════
   MEMBER MEMOS (메모 이력)
═══════════════════════════════════════════ */
export interface MemoEntry {
  id: string;
  memberId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const MEMOS_KEY = 'g1230_member_memos';

export async function getMemberMemos(): Promise<MemoEntry[]> {
  return getData(MEMOS_KEY, []);
}

export async function saveMemberMemos(items: MemoEntry[]) {
  await saveData(MEMOS_KEY, items);
}

/* ═══════════════════════════════════════════
   TEACHERS (강사 관리)
═══════════════════════════════════════════ */
export type PayType = 'freelance' | 'employee_full' | 'employee_extra' | 'parttime';
export type TeacherStatus = 'active' | 'leave' | 'resigned';

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;           // 담당 과목
  classIds: string[];        // 담당 반 ID 목록
  hireDate: string;
  status: TeacherStatus;
  payType: PayType;
  basePay: number;           // 월급(freelance/employee) or 시급(parttime)
  extraHourlyRate?: number;  // employee_extra: 수당 시급
  // ── 수당 유형 (신규) ──
  allowanceType?: 'per_student' | 'hourly'; // 학생 1명당 수당 or 단순 시급
  perStudentRate?: number;   // 학생 1명당 수당(원)
  hourlyRate?: number;       // 시급 수당(원) — allowanceType=hourly 시 사용
  bankName?: string;
  bankAccount?: string;
  residentNoMasked?: string; // '901010-1******' 형태
  note?: string;
}

const TEACHERS_KEY = 'g1230_teachers';

const defaultTeachers: Teacher[] = [
  {
    id: 'tc1', name: '박지수', phone: '010-3333-0001', email: 'jisoo@g1230.kr',
    subject: '수학', classIds: ['cc4', 'cc5', 'cc6'], hireDate: '2023-03-01',
    status: 'active', payType: 'employee_full', basePay: 2800000,
    bankName: '국민은행', bankAccount: '123-456-789012',
    residentNoMasked: '890515-2******', note: '중등부 전담',
  },
  {
    id: 'tc2', name: '김현우', phone: '010-3333-0002', email: 'hyunwoo@g1230.kr',
    subject: '수학', classIds: ['cc8', 'cc9', 'cc10', 'cc11'], hireDate: '2022-09-01',
    status: 'active', payType: 'employee_extra', basePay: 3200000, extraHourlyRate: 30000,
    bankName: '신한은행', bankAccount: '234-567-890123',
    residentNoMasked: '870320-1******', note: '고등부 전담',
  },
  {
    id: 'tc3', name: '이소연', phone: '010-3333-0003', email: 'soyeon@g1230.kr',
    subject: '수학', classIds: ['cc1', 'cc2', 'cc3'], hireDate: '2024-03-01',
    status: 'active', payType: 'freelance', basePay: 2500000,
    bankName: '카카오뱅크', bankAccount: '345-678-901234',
    residentNoMasked: '951205-2******', note: '초등부 전담',
  },
  {
    id: 'tc4', name: '최준혁', phone: '010-3333-0004', email: 'junhyuk@g1230.kr',
    subject: '수학', classIds: ['cc7'], hireDate: '2025-09-01',
    status: 'active', payType: 'parttime', basePay: 15000,
    residentNoMasked: '010830-3******', note: '주말 알바, 중등 고등선행반',
  },
];

export async function getTeachers(): Promise<Teacher[]> {
  return getData(TEACHERS_KEY, defaultTeachers);
}
export async function saveTeachers(items: Teacher[]) { await saveData(TEACHERS_KEY, items); }

/* ═══════════════════════════════════════════
   WORK RECORDS (근무 기록)
═══════════════════════════════════════════ */
export type WorkType = 'regular' | 'extra' | 'consult';

export interface WorkRecord {
  id: string;
  teacherId: string;
  date: string;         // 'YYYY-MM-DD'
  startTime: string;    // 'HH:MM'
  endTime: string;      // 'HH:MM'
  breakMinutes: number; // 휴게시간(분)
  type: WorkType;
  note?: string;
}

const WORK_RECORDS_KEY = 'g1230_work_records';

export async function getWorkRecords(): Promise<WorkRecord[]> {
  return getData(WORK_RECORDS_KEY, []);
}
export async function saveWorkRecords(items: WorkRecord[]) { await saveData(WORK_RECORDS_KEY, items); }

/** 근무 시간(분) 계산 헬퍼 */
export function calcWorkMinutes(rec: WorkRecord): number {
  const [sh, sm] = rec.startTime.split(':').map(Number);
  const [eh, em] = rec.endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm) - rec.breakMinutes;
}

/* ═══════════════════════════════════════════
   PAY SLIPS (급여 명세)
═══════════════════════════════════════════ */
export interface PaySlip {
  id: string;
  teacherId: string;
  year: number;
  month: number;
  basePay: number;
  extraPay: number;          // 추가 강의·수당
  allowanceAmount: number;   // 수당 계산액 (per_student or hourly)
  allowanceDetail: string;   // 수당 계산 내역 문자열 (예: '15명 × 5,000원')
  grossPay: number;          // 지급 총액
  insuranceEmployee: number; // 4대보험 근로자 부담분
  withholdingTax: number;    // 원천세
  localIncomeTax: number;    // 지방소득세
  netPay: number;            // 실 지급액
  createdAt: string;
  note?: string;
}

const PAY_SLIPS_KEY = 'g1230_pay_slips';

export async function getPaySlips(): Promise<PaySlip[]> {
  return getData(PAY_SLIPS_KEY, []);
}
export async function savePaySlips(items: PaySlip[]) { await saveData(PAY_SLIPS_KEY, items); }

/**
 * 급여 자동 계산 (2025년 기준 근사치)
 * payType별 세금 산식:
 *   freelance       → 징수세 = grossPay × 3.3%, 4대보험 없음
 *   employee_full   → 4대보험 근로자분 + 간이세액(basePay 기준 약 15만 공제 후 세율)
 *   employee_extra  → basePay는 employee_full 방식 + extraPay는 3.3%
 *   parttime        → 월 급여 1,690,000 이하 비과세, 초과분에만 원천세
 */
export function calcPaySlip(
  teacher: Teacher,
  basePay: number,
  extraPay: number,
  year: number,
  month: number,
  /** 수당: 학생 수 (allowanceType=per_student) or 시간 (allowanceType=hourly) */
  allowanceInput: number = 0,
): Omit<PaySlip, 'id' | 'teacherId' | 'createdAt'> {
  // ── 수당 계산 ──
  let allowanceAmount = 0;
  let allowanceDetail = '';
  if (teacher.allowanceType === 'per_student' && teacher.perStudentRate) {
    allowanceAmount = allowanceInput * teacher.perStudentRate;
    allowanceDetail = `${allowanceInput}명 × ${teacher.perStudentRate.toLocaleString()}원`;
  } else if (teacher.allowanceType === 'hourly' && teacher.hourlyRate) {
    allowanceAmount = Math.round(allowanceInput * teacher.hourlyRate);
    allowanceDetail = `${allowanceInput}시간 × ${teacher.hourlyRate.toLocaleString()}원`;
  }

  const gross = basePay + extraPay + allowanceAmount;
  let insurance = 0;
  let wht = 0; // withholding tax
  let local = 0;

  if (teacher.payType === 'freelance') {
    wht = Math.floor(gross * 0.033);
    local = Math.floor(wht * 0.1);
  } else if (teacher.payType === 'employee_full') {
    // 4대보험 근로자분 (2025 기준): 국민 4.5% + 건강 3.545% + 장기요양(건강×12.95%) + 고용 0.9%
    const healthRate = 0.03545;
    insurance = Math.floor(gross * (0.045 + healthRate + healthRate * 0.1295 + 0.009));
    // 간이세액 (단순화: 공제 후 6% → 15만 이하 거의 0~수만원)
    const taxable = Math.max(0, gross - insurance - 150000);
    wht = taxable < 1400000 ? Math.floor(taxable * 0.06) : Math.floor(taxable * 0.15 - 126000);
    local = Math.floor(wht * 0.1);
  } else if (teacher.payType === 'employee_extra') {
    const healthRate = 0.03545;
    insurance = Math.floor(basePay * (0.045 + healthRate + healthRate * 0.1295 + 0.009));
    const taxable = Math.max(0, basePay - insurance - 150000);
    const whtBase = taxable < 1400000 ? Math.floor(taxable * 0.06) : Math.floor(taxable * 0.15 - 126000);
    const whtExtra = Math.floor(extraPay * 0.033);
    wht = whtBase + whtExtra;
    local = Math.floor(wht * 0.1);
  } else if (teacher.payType === 'parttime') {
    // 월 169만 초과분만 과세
    const taxable = Math.max(0, gross - 1690000);
    wht = Math.floor(taxable * 0.033);
    local = Math.floor(wht * 0.1);
  }

  return {
    year, month,
    basePay, extraPay, allowanceAmount, allowanceDetail,
    grossPay: gross,
    insuranceEmployee: insurance,
    withholdingTax: wht,
    localIncomeTax: local,
    netPay: gross - insurance - wht - local,
  };
}

/* ═══════════════════════════════════════════
   TAX MEMOS (세무 체크리스트)
═══════════════════════════════════════════ */
export type TaxType =
  | 'withholding'     // 원천세
  | 'vat'             // 부가가치세
  | 'income_tax'      // 종합소득세
  | 'local_income'    // 지방소득세
  | 'business_status'; // 사업장현황신고

export type TaxStatus = 'pending' | 'filed' | 'paid';

export interface TaxMemo {
  id: string;
  year: number;
  month?: number;        // 원천세는 매월 → 월 지정
  taxType: TaxType;
  dueDate: string;       // 'YYYY-MM-DD'
  status: TaxStatus;
  amount?: number;       // 납부 금액 (입력 후)
  note?: string;
}

const TAX_MEMOS_KEY = 'g1230_tax_memos';

/** 연도별 기본 세무 일정 생성 */
export function generateTaxSchedule(year: number): TaxMemo[] {
  const items: TaxMemo[] = [];
  // 원천세: 매월 10일
  for (let m = 1; m <= 12; m++) {
    const nextM = m === 12 ? 1 : m + 1;
    const nextY = m === 12 ? year + 1 : year;
    items.push({
      id: `tax_wht_${year}_${m}`,
      year, month: m,
      taxType: 'withholding',
      dueDate: `${nextY}-${String(nextM).padStart(2, '0')}-10`,
      status: 'pending',
    });
  }
  // 부가세 (반기)
  items.push({ id: `tax_vat_${year}_1`, year, taxType: 'vat', dueDate: `${year}-01-25`, status: 'pending', note: '1기 예정신고' });
  items.push({ id: `tax_vat_${year}_2`, year, taxType: 'vat', dueDate: `${year}-07-25`, status: 'pending', note: '2기 예정신고' });
  // 종합소득세 + 지방소득세
  items.push({ id: `tax_income_${year}`, year, taxType: 'income_tax', dueDate: `${year}-05-31`, status: 'pending' });
  items.push({ id: `tax_local_${year}`, year, taxType: 'local_income', dueDate: `${year}-05-31`, status: 'pending' });
  // 사업장 현황 신고
  items.push({ id: `tax_biz_${year}`, year, taxType: 'business_status', dueDate: `${year}-02-10`, status: 'pending' });
  return items;
}

export async function getTaxMemos(year: number): Promise<TaxMemo[]> {
  const all: TaxMemo[] = await getData(TAX_MEMOS_KEY, []);
  const forYear = all.filter(t => t.year === year);
  if (forYear.length === 0) {
    const generated = generateTaxSchedule(year);
    await saveData(TAX_MEMOS_KEY, [...all, ...generated]);
    return generated;
  }
  return forYear;
}

export async function saveTaxMemo(item: TaxMemo) {
  const all: TaxMemo[] = await getData(TAX_MEMOS_KEY, []);
  const idx = all.findIndex(t => t.id === item.id);
  if (idx >= 0) all[idx] = item; else all.push(item);
  await saveData(TAX_MEMOS_KEY, all);
}
