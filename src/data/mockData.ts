export const lectures = [
  {
    id: 'l1',
    title: '고2 수학 - 수열의 극한',
    instructor: '박선생',
    level: 3,
    date: '2025-02-20',
    thumbnail: 'https://picsum.photos/seed/math1/400/225',
    category: '고등부',
    videoId: 'dQw4w9WgXcQ',
    watched: true,
  },
  {
    id: 'l2',
    title: '중3 수학 - 이차함수 심화',
    instructor: '이선생',
    level: 4,
    date: '2025-02-18',
    thumbnail: 'https://picsum.photos/seed/math2/400/225',
    category: '중등부',
    videoId: 'dQw4w9WgXcQ',
    watched: false,
  },
  {
    id: 'l3',
    title: '초6 수학 - 비와 비율',
    instructor: '김선생',
    level: 2,
    date: '2025-02-15',
    thumbnail: 'https://picsum.photos/seed/math3/400/225',
    category: '초등부',
    videoId: 'dQw4w9WgXcQ',
    watched: false,
  },
];

export const notices = [
  { id: 'n1', title: '2025학년도 1학기 중간고사 대비 특강 안내', date: '2025-02-20', isNew: true },
  { id: 'n2', title: '3월 학사일정 및 휴원일 안내', date: '2025-02-18', isNew: false },
  { id: 'n3', title: '진접수학학원 방역 수칙 안내', date: '2025-02-10', isNew: false },
];

export const calendarEvents = [
  { id: 'e1', title: '중간고사 대비반 개강', date: new Date(2025, 1, 25), type: 'academy', color: 'bg-blue-500' },
  { id: 'e2', title: '진접중 체육대회', date: new Date(2025, 2, 5), type: 'school', color: 'bg-green-500' },
  { id: 'e3', title: '3월 모의고사', date: new Date(2025, 2, 14), type: 'exam', color: 'bg-red-500' },
];

export const studentGrades = [
  { subject: '1학기 중간', score: 85 },
  { subject: '1학기 기말', score: 92 },
  { subject: '2학기 중간', score: 88 },
  { subject: '2학기 기말', score: 95 },
];
