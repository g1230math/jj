// ═══════════════════════════════════════════
// 🏫 학원 운영 데이터 레이어
// (알림, 출결, 숙제, 시간표, 학원비, 포인트, 리뷰, 레벨테스트, 체험예약)
// ═══════════════════════════════════════════

/* ─── Generic localStorage helpers ─── */
function getData<T>(key: string, defaults: T): T {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : defaults; }
    catch { return defaults; }
}
function saveData<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); }
export function genId(prefix = 'x') { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

// ═══ 알림 ═══
export type NotificationType = 'exam' | 'homework' | 'attendance' | 'payment' | 'consult' | 'notice' | 'badge' | 'system';
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
    user_id?: string; // null = broadcast
}
const NOTIF_KEY = 'academy_notifications';
export const getNotifications = (): Notification[] => getData(NOTIF_KEY, []);
export const saveNotifications = (items: Notification[]) => saveData(NOTIF_KEY, items);
export const addNotification = (n: Notification) => { const all = getNotifications(); all.unshift(n); saveNotifications(all.slice(0, 100)); };
export const markNotifRead = (id: string) => { const all = getNotifications(); const n = all.find(x => x.id === id); if (n) n.read = true; saveNotifications(all); };
export const markAllNotifsRead = () => { const all = getNotifications(); all.forEach(n => n.read = true); saveNotifications(all); };

// ═══ 출결 ═══
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export interface AttendanceRecord {
    id: string;
    student_id: string;
    student_name: string;
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    check_in_time?: string;
    check_out_time?: string;
    note?: string;
}
const ATT_KEY = 'academy_attendance';
export const getAttendance = (): AttendanceRecord[] => getData(ATT_KEY, []);
export const saveAttendance = (items: AttendanceRecord[]) => saveData(ATT_KEY, items);
export const addAttendance = (r: AttendanceRecord) => { const all = getAttendance(); all.push(r); saveAttendance(all); };
export const updateAttendance = (r: AttendanceRecord) => { const all = getAttendance(); const idx = all.findIndex(x => x.id === r.id); if (idx >= 0) all[idx] = r; saveAttendance(all); };

// ═══ 숙제 ═══
export type HomeworkStatus = 'assigned' | 'submitted' | 'checked' | 'overdue';
export interface Homework {
    id: string;
    title: string;
    description: string;
    assigned_to: string[]; // student IDs or className
    assigned_to_names?: string[];
    class_name?: string;
    due_date: string;
    created_at: string;
    created_by: string;
}
export interface HomeworkSubmission {
    id: string;
    homework_id: string;
    student_id: string;
    student_name: string;
    status: HomeworkStatus;
    submitted_at?: string;
    checked_at?: string;
    score?: number;
    comment?: string;
}
const HW_KEY = 'academy_homework';
const HWSUB_KEY = 'academy_hw_submissions';
export const getHomework = (): Homework[] => getData(HW_KEY, []);
export const saveHomework = (items: Homework[]) => saveData(HW_KEY, items);
export const addHomework = (h: Homework) => { const all = getHomework(); all.push(h); saveHomework(all); };
export const getHWSubmissions = (): HomeworkSubmission[] => getData(HWSUB_KEY, []);
export const saveHWSubmissions = (items: HomeworkSubmission[]) => saveData(HWSUB_KEY, items);

// ═══ 시간표 ═══
export interface ScheduleEntry {
    id: string;
    class_name: string;
    teacher_name: string;
    day_of_week: number; // 0=Mon ~ 4=Fri
    start_time: string; // HH:mm
    end_time: string;
    subject: string;
    room?: string;
    color?: string;
}
const SCHED_KEY = 'academy_schedule';
export const getSchedule = (): ScheduleEntry[] => getData(SCHED_KEY, []);
export const saveSchedule = (items: ScheduleEntry[]) => saveData(SCHED_KEY, items);

// ═══ 학원비 ═══
export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'partial';
export interface TuitionRecord {
    id: string;
    student_id: string;
    student_name: string;
    month: string; // YYYY-MM
    amount: number;
    discount: number;
    discount_reason?: string;
    paid_amount: number;
    status: PaymentStatus;
    paid_at?: string;
    due_date: string;
    note?: string;
}
const TUITION_KEY = 'academy_tuition';
export const getTuition = (): TuitionRecord[] => getData(TUITION_KEY, []);
export const saveTuition = (items: TuitionRecord[]) => saveData(TUITION_KEY, items);

// ═══ 포인트 & 배지 ═══
export interface PointRecord {
    id: string;
    student_id: string;
    student_name: string;
    points: number;
    reason: string;
    type: 'earn' | 'spend';
    created_at: string;
}
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // emoji
    condition: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
export interface StudentBadge {
    badge_id: string;
    student_id: string;
    earned_at: string;
}
const POINTS_KEY = 'academy_points';
const BADGES_KEY = 'academy_student_badges';
export const getPoints = (): PointRecord[] => getData(POINTS_KEY, []);
export const savePoints = (items: PointRecord[]) => saveData(POINTS_KEY, items);
export const addPoints = (r: PointRecord) => { const all = getPoints(); all.push(r); savePoints(all); };
export const getStudentBadges = (): StudentBadge[] => getData(BADGES_KEY, []);
export const saveStudentBadges = (items: StudentBadge[]) => saveData(BADGES_KEY, items);
export const getStudentTotalPoints = (studentId: string): number => {
    return getPoints().filter(p => p.student_id === studentId).reduce((s, p) => s + (p.type === 'earn' ? p.points : -p.points), 0);
};
export const getStudentLevel = (points: number): { level: string; icon: string; min: number; max: number } => {
    if (points >= 5000) return { level: '다이아', icon: '💎', min: 5000, max: 99999 };
    if (points >= 2000) return { level: '골드', icon: '🥇', min: 2000, max: 5000 };
    if (points >= 500) return { level: '실버', icon: '🥈', min: 500, max: 2000 };
    return { level: '브론즈', icon: '🥉', min: 0, max: 500 };
};

export const ALL_BADGES: Badge[] = [
    { id: 'b1', name: '첫 걸음', description: '첫 문제를 풀었습니다', icon: '👣', condition: '문제 1개 풀기', rarity: 'common' },
    { id: 'b2', name: '10문제 돌파', description: '10문제를 풀었습니다', icon: '🎯', condition: '문제 10개 풀기', rarity: 'common' },
    { id: 'b3', name: '100문제 정복', description: '100문제를 풀었습니다', icon: '🔥', condition: '문제 100개 풀기', rarity: 'rare' },
    { id: 'b4', name: '만점왕', description: '시험에서 만점을 받았습니다', icon: '👑', condition: '시험 100점', rarity: 'epic' },
    { id: 'b5', name: '연속 7일', description: '7일 연속 출석했습니다', icon: '⭐', condition: '7일 연속 출석', rarity: 'rare' },
    { id: 'b6', name: '연속 30일', description: '30일 연속 출석했습니다', icon: '🏆', condition: '30일 연속 출석', rarity: 'epic' },
    { id: 'b7', name: '오답 마스터', description: '오답노트 50개를 복습했습니다', icon: '📝', condition: '오답 50개 복습', rarity: 'rare' },
    { id: 'b8', name: '수학의 신', description: '총 포인트 5000점 달성', icon: '🧠', condition: '5000점 달성', rarity: 'legendary' },
];

// ═══ 학습 목표 ═══
export interface WeeklyGoal {
    id: string;
    student_id: string;
    week_start: string; // YYYY-MM-DD (Monday)
    target_problems: number;
    target_wrong_review: number;
    completed_problems: number;
    completed_wrong_review: number;
    created_at: string;
}
const GOALS_KEY = 'academy_weekly_goals';
export const getWeeklyGoals = (): WeeklyGoal[] => getData(GOALS_KEY, []);
export const saveWeeklyGoals = (items: WeeklyGoal[]) => saveData(GOALS_KEY, items);

// ═══ 리뷰 / 평점 ═══
export interface Review {
    id: string;
    author_name: string;
    author_role: 'student' | 'parent';
    rating: number; // 1~5
    content: string;
    image_url?: string;
    created_at: string;
    approved: boolean;
}
const REVIEW_KEY = 'academy_reviews';
export const getReviews = (): Review[] => getData(REVIEW_KEY, []);
export const saveReviews = (items: Review[]) => saveData(REVIEW_KEY, items);

// ═══ 체험 수업 예약 ═══
export interface TrialBooking {
    id: string;
    parent_name: string;
    student_name: string;
    phone: string;
    student_grade: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
}
const TRIAL_KEY = 'academy_trial_bookings';
export const getTrialBookings = (): TrialBooking[] => getData(TRIAL_KEY, []);
export const saveTrialBookings = (items: TrialBooking[]) => saveData(TRIAL_KEY, items);

// ═══ 레벨 테스트 ═══
export interface LevelTestQuestion {
    id: string;
    grade: string; // 중1, 중2, 중3
    content: string; // supports LaTeX
    options: string[]; // 5 options
    answer: number; // 0-indexed correct option
    topic: string; // e.g. '일차방정식', '정수의 사칙연산'
    difficulty: 'easy' | 'medium' | 'hard';
    order: number;
    active: boolean;
}
export interface LevelTestResult {
    id: string;
    taker_name: string;
    phone?: string;
    grade: string;
    score: number;
    total: number;
    weak_areas: string[];
    recommended_class: string;
    created_at: string;
}
const LEVELTEST_KEY = 'academy_level_tests';
const LT_Q_KEY = 'academy_level_test_questions';
export const getLevelTestResults = (): LevelTestResult[] => getData(LEVELTEST_KEY, []);
export const saveLevelTestResults = (items: LevelTestResult[]) => saveData(LEVELTEST_KEY, items);
export const getLevelTestQuestions = (): LevelTestQuestion[] => getData(LT_Q_KEY, []);
export const saveLevelTestQuestions = (items: LevelTestQuestion[]) => saveData(LT_Q_KEY, items);
export const getLevelTestQuestionsByGrade = (grade: string): LevelTestQuestion[] =>
    getLevelTestQuestions().filter(q => q.grade === grade && q.active).sort((a, b) => a.order - b.order);

// ═══ 이벤트/프로모션 ═══
export interface EventBanner {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    link?: string;
    start_date: string;
    end_date: string;
    active: boolean;
    created_at: string;
}
const EVENT_KEY = 'academy_events';
export const getEvents = (): EventBanner[] => getData(EVENT_KEY, []);
export const saveEvents = (items: EventBanner[]) => saveData(EVENT_KEY, items);

// ═══ 데모 데이터 시딩 ═══
export function seedAcademyData() {
    // Notifications
    if (getNotifications().length === 0) {
        saveNotifications([
            { id: 'n1', type: 'notice', title: '3월 학사일정 안내', message: '3월 개강일 및 중간고사 대비 특강 일정을 확인하세요.', read: false, created_at: new Date().toISOString() },
            { id: 'n2', type: 'exam', title: '수학 모의고사 결과', message: '2월 모의고사 결과가 나왔습니다. 확인해보세요!', link: '/study', read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 'n3', type: 'homework', title: '숙제 마감 D-2', message: '일차함수 문제풀이 숙제가 이틀 후 마감입니다.', read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: 'n4', type: 'badge', title: '🎯 배지 획득!', message: '\'10문제 돌파\' 배지를 획득했습니다!', read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
            { id: 'n5', type: 'payment', title: '3월 수강료 안내', message: '3월 수강료 납부 기한은 2월 28일입니다.', read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
        ]);
    }
    // Attendance
    if (getAttendance().length === 0) {
        const today = new Date(); const records: AttendanceRecord[] = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            if (d.getDay() === 0 || d.getDay() === 6) continue;
            const dateStr = d.toISOString().slice(0, 10);
            records.push({ id: `att_${i}_1`, student_id: '1', student_name: '김지훈', date: dateStr, status: i === 3 ? 'late' : 'present', check_in_time: i === 3 ? '16:15' : '15:55' });
            records.push({ id: `att_${i}_2`, student_id: 's2', student_name: '이수진', date: dateStr, status: i === 5 ? 'absent' : 'present', check_in_time: '15:50' });
            records.push({ id: `att_${i}_3`, student_id: 's3', student_name: '박민수', date: dateStr, status: 'present', check_in_time: '15:48' });
        }
        saveAttendance(records);
    }
    // Schedule
    if (getSchedule().length === 0) {
        saveSchedule([
            { id: 'sc1', class_name: '중2-A반', teacher_name: '박선생', day_of_week: 0, start_time: '16:00', end_time: '17:30', subject: '수학(상)', color: '#6366f1' },
            { id: 'sc2', class_name: '중2-A반', teacher_name: '박선생', day_of_week: 2, start_time: '16:00', end_time: '17:30', subject: '수학(상)', color: '#6366f1' },
            { id: 'sc3', class_name: '중2-B반', teacher_name: '김선생', day_of_week: 1, start_time: '16:00', end_time: '17:30', subject: '수학(하)', color: '#10b981' },
            { id: 'sc4', class_name: '중2-B반', teacher_name: '김선생', day_of_week: 3, start_time: '16:00', end_time: '17:30', subject: '수학(하)', color: '#10b981' },
            { id: 'sc5', class_name: '중3-심화', teacher_name: '박선생', day_of_week: 1, start_time: '18:00', end_time: '19:30', subject: '중3심화', color: '#f59e0b' },
            { id: 'sc6', class_name: '중3-심화', teacher_name: '박선생', day_of_week: 3, start_time: '18:00', end_time: '19:30', subject: '중3심화', color: '#f59e0b' },
            { id: 'sc7', class_name: '고1-기본', teacher_name: '이선생', day_of_week: 0, start_time: '18:00', end_time: '20:00', subject: '수학(상)', color: '#ef4444' },
            { id: 'sc8', class_name: '고1-기본', teacher_name: '이선생', day_of_week: 2, start_time: '18:00', end_time: '20:00', subject: '수학(상)', color: '#ef4444' },
            { id: 'sc9', class_name: '고1-기본', teacher_name: '이선생', day_of_week: 4, start_time: '18:00', end_time: '20:00', subject: '수학(상)', color: '#ef4444' },
        ]);
    }
    // Tuition
    if (getTuition().length === 0) {
        saveTuition([
            { id: 't1', student_id: '1', student_name: '김지훈', month: '2026-02', amount: 350000, discount: 0, paid_amount: 350000, status: 'paid', paid_at: '2026-02-01', due_date: '2026-02-05' },
            { id: 't2', student_id: '1', student_name: '김지훈', month: '2026-03', amount: 350000, discount: 0, paid_amount: 0, status: 'unpaid', due_date: '2026-03-05' },
            { id: 't3', student_id: 's2', student_name: '이수진', month: '2026-02', amount: 350000, discount: 50000, discount_reason: '형제 할인', paid_amount: 300000, status: 'paid', paid_at: '2026-02-03', due_date: '2026-02-05' },
            { id: 't4', student_id: 's2', student_name: '이수진', month: '2026-03', amount: 350000, discount: 50000, discount_reason: '형제 할인', paid_amount: 0, status: 'unpaid', due_date: '2026-03-05' },
            { id: 't5', student_id: 's3', student_name: '박민수', month: '2026-02', amount: 400000, discount: 0, paid_amount: 400000, status: 'paid', paid_at: '2026-02-02', due_date: '2026-02-05' },
            { id: 't6', student_id: 's3', student_name: '박민수', month: '2026-03', amount: 400000, discount: 0, paid_amount: 0, status: 'overdue', due_date: '2026-02-25', note: '미납 상태' },
        ]);
    }
    // Points
    if (getPoints().length === 0) {
        savePoints([
            { id: 'p1', student_id: '1', student_name: '김지훈', points: 50, reason: '시험 응시', type: 'earn', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
            { id: 'p2', student_id: '1', student_name: '김지훈', points: 100, reason: '시험 80점 이상', type: 'earn', created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
            { id: 'p3', student_id: '1', student_name: '김지훈', points: 30, reason: '오답 복습 완료', type: 'earn', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
            { id: 'p4', student_id: '1', student_name: '김지훈', points: 10, reason: '출석', type: 'earn', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
            { id: 'p5', student_id: '1', student_name: '김지훈', points: 200, reason: '연속 7일 출석 보너스', type: 'earn', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
            { id: 'p6', student_id: 's2', student_name: '이수진', points: 500, reason: '축적 포인트', type: 'earn', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
            { id: 'p7', student_id: 's3', student_name: '박민수', points: 820, reason: '축적 포인트', type: 'earn', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
        ]);
    }
    // Badges
    if (getStudentBadges().length === 0) {
        saveStudentBadges([
            { badge_id: 'b1', student_id: '1', earned_at: new Date(Date.now() - 86400000 * 10).toISOString() },
            { badge_id: 'b2', student_id: '1', earned_at: new Date(Date.now() - 86400000 * 5).toISOString() },
            { badge_id: 'b5', student_id: '1', earned_at: new Date(Date.now() - 86400000 * 3).toISOString() },
        ]);
    }
    // Reviews
    if (getReviews().length === 0) {
        saveReviews([
            { id: 'r1', author_name: '김OO 학부모', author_role: 'parent', rating: 5, content: '아이가 수학에 자신감이 생겼어요. 선생님들이 정말 꼼꼼하게 지도해주십니다. 특히 오답 노트 시스템이 아이 학습에 큰 도움이 됩니다.', created_at: new Date(Date.now() - 86400000 * 30).toISOString(), approved: true },
            { id: 'r2', author_name: '이OO 학생', author_role: 'student', rating: 5, content: '선생님이 이해될 때까지 설명해주셔서 좋아요. 수학 성적이 20점이나 올랐어요!', created_at: new Date(Date.now() - 86400000 * 20).toISOString(), approved: true },
            { id: 'r3', author_name: '박OO 학부모', author_role: 'parent', rating: 4, content: '체계적인 커리큘럼이 마음에 들어요. 셔틀 운영도 편리합니다. 학원 관리 시스템이 잘 되어 있어서 안심됩니다.', created_at: new Date(Date.now() - 86400000 * 15).toISOString(), approved: true },
            { id: 'r4', author_name: '최OO 학생', author_role: 'student', rating: 5, content: '강의 영상으로 복습할 수 있어서 좋고, AI로 문제도 만들어주니 연습할 게 많아요!', created_at: new Date(Date.now() - 86400000 * 7).toISOString(), approved: true },
        ]);
    }
    // Homework
    if (getHomework().length === 0) {
        saveHomework([
            { id: 'hw1', title: '일차함수 문제풀이', description: '교과서 p.52~55 문제 1~15번', assigned_to: ['1', 's2', 's3'], assigned_to_names: ['김지훈', '이수진', '박민수'], class_name: '중2-A반', due_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), created_at: new Date().toISOString(), created_by: 'admin' },
            { id: 'hw2', title: '연립방정식 복습', description: '프린트 배부 자료 전체', assigned_to: ['1', 's2'], assigned_to_names: ['김지훈', '이수진'], class_name: '중2-A반', due_date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10), created_at: new Date(Date.now() - 86400000).toISOString(), created_by: 'admin' },
        ]);
        saveHWSubmissions([
            { id: 'hs1', homework_id: 'hw1', student_id: '1', student_name: '김지훈', status: 'submitted', submitted_at: new Date().toISOString() },
            { id: 'hs2', homework_id: 'hw1', student_id: 's2', student_name: '이수진', status: 'assigned' },
            { id: 'hs3', homework_id: 'hw1', student_id: 's3', student_name: '박민수', status: 'assigned' },
            { id: 'hs4', homework_id: 'hw2', student_id: '1', student_name: '김지훈', status: 'assigned' },
            { id: 'hs5', homework_id: 'hw2', student_id: 's2', student_name: '이수진', status: 'assigned' },
        ]);
    }
    // Weekly Goals
    if (getWeeklyGoals().length === 0) {
        const mon = new Date(); mon.setDate(mon.getDate() - mon.getDay() + 1);
        saveWeeklyGoals([
            { id: 'g1', student_id: '1', week_start: mon.toISOString().slice(0, 10), target_problems: 20, target_wrong_review: 5, completed_problems: 12, completed_wrong_review: 3, created_at: mon.toISOString() },
        ]);
    }
    // Events
    if (getEvents().length === 0) {
        saveEvents([
            { id: 'ev1', title: '🌸 봄방학 특강 수강생 모집!', description: '3월 봄방학 기간 특별 강좌. 기초부터 심화까지!', start_date: '2026-02-20', end_date: '2026-03-15', active: true, created_at: new Date().toISOString() },
            { id: 'ev2', title: '📝 중간고사 대비 무료 모의고사', description: '3월 말 중간고사 대비 무료 모의고사를 실시합니다.', start_date: '2026-03-10', end_date: '2026-03-25', active: true, created_at: new Date().toISOString() },
        ]);
    }
    // Level Test Questions
    if (getLevelTestQuestions().length === 0) {
        saveLevelTestQuestions([
            { id: 'ltq1', grade: '중1', content: '다음 중 음수가 아닌 정수를 모두 고르면? ①−3 ②0 ③$\\frac{1}{2}$ ④5 ⑤−0.7', options: ['①,②', '②,④', '②,③,④', '①,②,④', '②,④,⑤'], answer: 1, topic: '정수와 유리수', difficulty: 'easy', order: 1, active: true },
            { id: 'ltq2', grade: '중1', content: '$(-3) \\times (-2) + 4 \\div (-2)$의 값은?', options: ['4', '8', '-4', '2', '-8'], answer: 0, topic: '정수의 사칙연산', difficulty: 'medium', order: 2, active: true },
            { id: 'ltq3', grade: '중1', content: '일차방정식 $2x - 5 = 3$의 해는?', options: ['$x=1$', '$x=2$', '$x=3$', '$x=4$', '$x=-1$'], answer: 3, topic: '일차방정식', difficulty: 'medium', order: 3, active: true },
            { id: 'ltq4', grade: '중1', content: '좌표평면에서 점 $(-2, 3)$은 제 몇 사분면 위의 점인가?', options: ['제1사분면', '제2사분면', '제3사분면', '제4사분면', '축 위의 점'], answer: 1, topic: '좌표평면', difficulty: 'easy', order: 4, active: true },
            { id: 'ltq5', grade: '중1', content: '정비례 관계 $y = 3x$에서 $x = -2$일 때 $y$의 값은?', options: ['6', '-6', '1', '-1', '5'], answer: 1, topic: '정비례와 반비례', difficulty: 'easy', order: 5, active: true },
            { id: 'ltq6', grade: '중2', content: '다항식 $(2x+3)(x-1)$을 전개하면?', options: ['$2x^2+x-3$', '$2x^2-x-3$', '$2x^2+5x-3$', '$2x^2-2x-3$', '$2x^2+x+3$'], answer: 0, topic: '다항식의 곱셈', difficulty: 'medium', order: 1, active: true },
            { id: 'ltq7', grade: '중2', content: '연립방정식 $\\begin{cases} x+y=5 \\\\ 2x-y=1 \\end{cases}$의 해는?', options: ['$x=1, y=4$', '$x=2, y=3$', '$x=3, y=2$', '$x=4, y=1$', '$x=2, y=4$'], answer: 1, topic: '연립방정식', difficulty: 'medium', order: 2, active: true },
            { id: 'ltq8', grade: '중2', content: '일차함수 $y = -2x + 5$의 $x$절편은?', options: ['$5$', '$-5$', '$\\frac{5}{2}$', '$-\\frac{5}{2}$', '$2$'], answer: 2, topic: '일차함수', difficulty: 'medium', order: 3, active: true },
            { id: 'ltq9', grade: '중2', content: '이등변삼각형의 꼭지각이 $40°$일 때, 밑각의 크기는?', options: ['$60°$', '$70°$', '$80°$', '$50°$', '$40°$'], answer: 1, topic: '삼각형의 성질', difficulty: 'easy', order: 4, active: true },
            { id: 'ltq10', grade: '중2', content: '확률에서 주사위를 던져 3의 배수가 나올 확률은?', options: ['$\\frac{1}{6}$', '$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{2}{3}$', '$\\frac{1}{4}$'], answer: 1, topic: '확률', difficulty: 'easy', order: 5, active: true },
            { id: 'ltq11', grade: '중3', content: '$\\sqrt{48} - 2\\sqrt{3}$의 값은?', options: ['$\\sqrt{3}$', '$2\\sqrt{3}$', '$3\\sqrt{3}$', '$4\\sqrt{3}$', '$6\\sqrt{3}$'], answer: 1, topic: '제곱근', difficulty: 'medium', order: 1, active: true },
            { id: 'ltq12', grade: '중3', content: '이차방정식 $x^2 - 5x + 6 = 0$의 두 근의 합은?', options: ['$3$', '$4$', '$5$', '$6$', '$-5$'], answer: 2, topic: '이차방정식', difficulty: 'medium', order: 2, active: true },
            { id: 'ltq13', grade: '중3', content: '이차함수 $y = x^2 - 4x + 3$의 꼭짓점의 좌표는?', options: ['$(2, -1)$', '$(2, 1)$', '$(-2, -1)$', '$(1, 0)$', '$(3, 0)$'], answer: 0, topic: '이차함수', difficulty: 'hard', order: 3, active: true },
            { id: 'ltq14', grade: '중3', content: '삼각형 ABC에서 $\\sin 30°$의 값은?', options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{2}}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$1$', '$\\frac{\\sqrt{3}}{3}$'], answer: 0, topic: '삼각비', difficulty: 'medium', order: 4, active: true },
            { id: 'ltq15', grade: '중3', content: '원에 내접하는 사각형의 대각의 합은?', options: ['$90°$', '$180°$', '$270°$', '$360°$', '알 수 없다'], answer: 1, topic: '원의 성질', difficulty: 'easy', order: 5, active: true },
        ]);
    }
}
