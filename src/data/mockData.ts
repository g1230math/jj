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

// --- 기존 데이터 유지 ---
export const notices = [
  { id: 'n1', title: '2025학년도 1학기 중간고사 대비 특강 안내', date: '2025-02-20', isNew: true },
  { id: 'n2', title: '3월 학사일정 및 휴원일 안내', date: '2025-02-18', isNew: false },
  { id: 'n3', title: '진접 G1230 수학전문학원 방역 수칙 안내', date: '2025-02-10', isNew: false },
];

export const calendarEvents = [
  // 2025 한국 공휴일
  { id: 'h1', title: '신정', date: new Date(2025, 0, 1), type: 'holiday', color: 'bg-purple-500', description: '새해 첫날' },
  { id: 'h2', title: '설날 연휴', date: new Date(2025, 0, 28), type: 'holiday', color: 'bg-purple-500', description: '설날 연휴 (1/28~1/30)' },
  { id: 'h3', title: '설날', date: new Date(2025, 0, 29), type: 'holiday', color: 'bg-purple-500', description: '음력 1월 1일' },
  { id: 'h4', title: '설날 연휴', date: new Date(2025, 0, 30), type: 'holiday', color: 'bg-purple-500', description: '설날 연휴 (1/28~1/30)' },
  { id: 'h5', title: '삼일절', date: new Date(2025, 2, 1), type: 'holiday', color: 'bg-purple-500', description: '3·1 독립운동 기념일' },
  { id: 'h6', title: '어린이날', date: new Date(2025, 4, 5), type: 'holiday', color: 'bg-purple-500', description: '' },
  { id: 'h7', title: '부처님오신날', date: new Date(2025, 4, 5), type: 'holiday', color: 'bg-purple-500', description: '음력 4월 8일 (대체휴일 5/6)' },
  { id: 'h8', title: '대체공휴일', date: new Date(2025, 4, 6), type: 'holiday', color: 'bg-purple-500', description: '어린이날·부처님오신날 대체휴일' },
  { id: 'h9', title: '현충일', date: new Date(2025, 5, 6), type: 'holiday', color: 'bg-purple-500', description: '호국영령 추모일' },
  { id: 'h10', title: '광복절', date: new Date(2025, 7, 15), type: 'holiday', color: 'bg-purple-500', description: '제80주년 광복절' },
  { id: 'h11', title: '추석 연휴', date: new Date(2025, 9, 5), type: 'holiday', color: 'bg-purple-500', description: '추석 연휴 (10/5~10/7)' },
  { id: 'h12', title: '추석', date: new Date(2025, 9, 6), type: 'holiday', color: 'bg-purple-500', description: '음력 8월 15일' },
  { id: 'h13', title: '추석 연휴', date: new Date(2025, 9, 7), type: 'holiday', color: 'bg-purple-500', description: '추석 연휴 (10/5~10/7)' },
  { id: 'h14', title: '대체공휴일', date: new Date(2025, 9, 8), type: 'holiday', color: 'bg-purple-500', description: '추석 대체공휴일' },
  { id: 'h15', title: '개천절', date: new Date(2025, 9, 3), type: 'holiday', color: 'bg-purple-500', description: '단군 건국 기념일' },
  { id: 'h16', title: '한글날', date: new Date(2025, 9, 9), type: 'holiday', color: 'bg-purple-500', description: '세종대왕 한글 반포 기념일' },
  { id: 'h17', title: '크리스마스', date: new Date(2025, 11, 25), type: 'holiday', color: 'bg-purple-500', description: '' },
  // 학원 일정
  { id: 'e1', title: '중간고사 대비반 개강', date: new Date(2025, 1, 25), type: 'academy', color: 'bg-blue-500', description: '중등·고등부 중간고사 대비 특강 개강' },
  { id: 'e4', title: '봄학기 개강', date: new Date(2025, 2, 3), type: 'academy', color: 'bg-blue-500', description: '2025학년도 1학기 정규 수업 시작' },
  { id: 'e5', title: '학부모 간담회', date: new Date(2025, 2, 15), type: 'academy', color: 'bg-blue-500', description: '1학기 학습 계획 및 진도 안내' },
  { id: 'e6', title: '월말 정기 테스트', date: new Date(2025, 2, 28), type: 'academy', color: 'bg-blue-500', description: '전 학년 월말 정기 평가' },
  { id: 'e7', title: '중간고사 특강 시작', date: new Date(2025, 3, 7), type: 'academy', color: 'bg-blue-500', description: '중·고등부 1학기 중간고사 대비 집중 특강' },
  { id: 'e8', title: '월말 정기 테스트', date: new Date(2025, 3, 25), type: 'academy', color: 'bg-blue-500', description: '전 학년 월말 정기 평가' },
  { id: 'e9', title: '기말고사 대비반', date: new Date(2025, 5, 2), type: 'academy', color: 'bg-blue-500', description: '1학기 기말고사 대비 특강 개강' },
  { id: 'e10', title: '여름방학 특강', date: new Date(2025, 6, 21), type: 'academy', color: 'bg-blue-500', description: '여름방학 집중 보충 및 선행 프로그램' },
  // 학교 행사
  { id: 'e2', title: '진접중 체육대회', date: new Date(2025, 2, 5), type: 'school', color: 'bg-green-500', description: '진접중학교 봄 체육대회' },
  { id: 'e11', title: '진접중 중간고사', date: new Date(2025, 3, 14), type: 'exam', color: 'bg-red-500', description: '진접중학교 1학기 중간고사 (4/14~4/16)' },
  { id: 'e12', title: '오남중 중간고사', date: new Date(2025, 3, 16), type: 'exam', color: 'bg-red-500', description: '오남중학교 1학기 중간고사 (4/16~4/18)' },
  // 시험 일정
  { id: 'e3', title: '3월 모의고사', date: new Date(2025, 2, 14), type: 'exam', color: 'bg-red-500', description: '고1·2·3 전국연합학력평가' },
  { id: 'e13', title: '6월 모의평가', date: new Date(2025, 5, 4), type: 'exam', color: 'bg-red-500', description: '대학수학능력시험 6월 모의평가' },
  { id: 'e14', title: '9월 모의평가', date: new Date(2025, 8, 3), type: 'exam', color: 'bg-red-500', description: '대학수학능력시험 9월 모의평가' },
  { id: 'e15', title: '수능', date: new Date(2025, 10, 13), type: 'exam', color: 'bg-red-500', description: '2026학년도 대학수학능력시험' },
];

export const studentGrades = [
  { subject: '1학기 중간', score: 85 },
  { subject: '1학기 기말', score: 92 },
  { subject: '2학기 중간', score: 88 },
  { subject: '2학기 기말', score: 95 },
];
