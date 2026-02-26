// ═══════════════════════════════════════════
// 📐 학습 플랫폼 데이터 레이어
// ═══════════════════════════════════════════
import { supabase } from '../lib/supabase';
import { SCHOOL_LIST } from './mockData';

// Re-export school list for study features
export { SCHOOL_LIST };

// ─── Generic Supabase KV helpers (with localStorage fallback) ───
async function getData<T>(key: string, defaults: T): Promise<T> {
    // 1) Try Supabase first
    if (supabase) {
        try {
            const { data, error } = await supabase.from('site_data').select('value').eq('key', key).maybeSingle();
            if (!error && data) {
                // Sync to localStorage as cache
                try { localStorage.setItem(`study_${key}`, JSON.stringify(data.value)); } catch { }
                return data.value as T;
            }
        } catch { /* fall through to localStorage */ }
    }
    // 2) Fallback to localStorage
    try {
        const raw = localStorage.getItem(`study_${key}`);
        if (raw) return JSON.parse(raw) as T;
    } catch { }
    return defaults;
}

async function saveData<T>(key: string, value: T): Promise<void> {
    // Always save to localStorage (immediate, reliable)
    try { localStorage.setItem(`study_${key}`, JSON.stringify(value)); } catch { }
    // Also try Supabase
    if (supabase) {
        try {
            await supabase.from('site_data').upsert(
                { key, value: value as any, updated_at: new Date().toISOString() },
                { onConflict: 'key' }
            );
        } catch { /* silent */ }
    }
}

// ═══════════════════════════════════════════
// 타입 정의
// ═══════════════════════════════════════════

export type QuestionType = 'mc' | 'short' | 'tf' | 'essay';
export type Difficulty = 1 | 2 | 3; // 1=하, 2=중, 3=상
export type ExamStatus = 'draft' | 'published' | 'closed';
export type AttemptStatus = 'in_progress' | 'submitted' | 'graded';

export interface MCOption {
    label: string; // "①", "②", ...
    text: string;
    image_url?: string;
}

export type LinkType = 'lecture' | 'youtube' | 'blog' | 'other';

export interface RelatedLink {
    url: string;
    title: string;
    type: LinkType;
}

export const LINK_TYPE_LABELS: Record<LinkType, { label: string; emoji: string; color: string }> = {
    lecture: { label: '동영상 강의', emoji: '🎬', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    youtube: { label: 'YouTube', emoji: '▶️', color: 'bg-red-50 text-red-600 border-red-200' },
    blog: { label: '블로그/글', emoji: '📝', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    other: { label: '기타 자료', emoji: '🔗', color: 'bg-slate-50 text-slate-600 border-slate-200' },
};

export interface Question {
    id: string;
    type: QuestionType;
    school: string;        // SCHOOL_LIST 에서 선택 ('전체' 포함)
    grade: number;         // 1~6(초), 1~3(중), 1~3(고)
    school_level: '초등' | '중등' | '고등';
    textbook: string;      // 출판사/교과서 (자유 입력)
    chapter: string;       // 단원
    sub_topic: string;     // 세부 유형
    difficulty: Difficulty;
    content: string;       // 문제 본문 (LaTeX 지원)
    content_image_url?: string;
    options?: MCOption[];   // 객관식 보기
    correct_answer: string; // MC: '1'~'5', Short: '42', TF: 'O'/'X'
    answer_tolerance?: number;
    explanation: string;    // 풀이 해설 (LaTeX 지원)
    explanation_image_url?: string;
    related_links?: RelatedLink[]; // 관련 학습 자료 링크
    source: 'manual' | 'ai_generated';
    seed_question_id?: string;
    tags: string[];
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    school: string;
    grade: number;
    school_level: '초등' | '중등' | '고등';
    question_ids: string[];
    time_limit_minutes: number | null; // null = 무제한
    shuffle_questions: boolean;
    shuffle_options: boolean;
    show_result_immediately: boolean;
    allow_retry: boolean;
    max_attempts: number;
    available_from: string | null;
    available_until: string | null;
    status: ExamStatus;
    created_by: string;
    created_at: string;
}

export interface ExamAttemptAnswer {
    question_id: string;
    answer: string;
    is_correct: boolean | null;  // null = 서술형 미채점
    points_earned: number;
}

export interface ExamAttempt {
    id: string;
    exam_id: string;
    student_id: string;
    student_name: string;
    started_at: string;
    submitted_at: string | null;
    score: number | null;
    total_points: number;
    status: AttemptStatus;
    answers: ExamAttemptAnswer[];
}

export interface WrongNote {
    id: string;
    student_id: string;
    question_id: string;
    attempt_id: string;
    student_answer: string;
    reviewed: boolean;
    reviewed_at: string | null;
    created_at: string;
}

// ═══════════════════════════════════════════
// 문제 은행 CRUD
// ═══════════════════════════════════════════

const QUESTIONS_KEY = 'study_questions';
const EXAMS_KEY = 'study_exams';
const ATTEMPTS_KEY = 'study_attempts';
const WRONG_NOTES_KEY = 'study_wrong_notes';

// --- 문제 ---
export async function getQuestions(): Promise<Question[]> {
    return getData(QUESTIONS_KEY, [] as Question[]);
}
export async function saveQuestions(items: Question[]) {
    await saveData(QUESTIONS_KEY, items);
}
export async function addQuestion(q: Question) {
    const all = await getQuestions();
    all.push(q);
    await saveQuestions(all);
}
export async function updateQuestion(q: Question) {
    const all = await getQuestions();
    const idx = all.findIndex(x => x.id === q.id);
    if (idx >= 0) { all[idx] = q; await saveQuestions(all); }
}
export async function deleteQuestion(id: string) {
    const all = await getQuestions();
    await saveQuestions(all.filter(x => x.id !== id));
}

// --- 시험 ---
export async function getExams(): Promise<Exam[]> {
    return getData(EXAMS_KEY, [] as Exam[]);
}
export async function saveExams(items: Exam[]) {
    await saveData(EXAMS_KEY, items);
}
export async function addExam(e: Exam) {
    const all = await getExams();
    all.push(e);
    await saveExams(all);
}
export async function updateExam(e: Exam) {
    const all = await getExams();
    const idx = all.findIndex(x => x.id === e.id);
    if (idx >= 0) { all[idx] = e; await saveExams(all); }
}

// --- 시험 응시 ---
export async function getAttempts(): Promise<ExamAttempt[]> {
    return getData(ATTEMPTS_KEY, [] as ExamAttempt[]);
}
export async function saveAttempts(items: ExamAttempt[]) {
    await saveData(ATTEMPTS_KEY, items);
}
export async function addAttempt(a: ExamAttempt) {
    const all = await getAttempts();
    all.push(a);
    await saveAttempts(all);
}
export async function updateAttempt(a: ExamAttempt) {
    const all = await getAttempts();
    const idx = all.findIndex(x => x.id === a.id);
    if (idx >= 0) { all[idx] = a; await saveAttempts(all); }
}

// --- 오답 노트 ---
export async function getWrongNotes(): Promise<WrongNote[]> {
    return getData(WRONG_NOTES_KEY, [] as WrongNote[]);
}
export async function saveWrongNotes(items: WrongNote[]) {
    await saveData(WRONG_NOTES_KEY, items);
}

// ═══════════════════════════════════════════
// 채점 유틸리티
// ═══════════════════════════════════════════

function normalize(s: string): string {
    return s.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function gradeAnswer(question: Question, userAnswer: string): { correct: boolean | null; } {
    const ans = userAnswer.trim();
    switch (question.type) {
        case 'mc':
        case 'tf':
            return { correct: ans === question.correct_answer };
        case 'short': {
            if (question.answer_tolerance != null) {
                const userNum = parseFloat(ans);
                const correctNum = parseFloat(question.correct_answer);
                if (isNaN(userNum) || isNaN(correctNum)) {
                    return { correct: normalize(ans) === normalize(question.correct_answer) };
                }
                return { correct: Math.abs(userNum - correctNum) <= question.answer_tolerance };
            }
            return { correct: normalize(ans) === normalize(question.correct_answer) };
        }
        case 'essay':
            return { correct: null }; // 수동 채점
        default:
            return { correct: false };
    }
}

// ═══════════════════════════════════════════
// 유틸리티
// ═══════════════════════════════════════════

export function genId(prefix = 'q') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    1: '하 (기본)',
    2: '중 (보통)',
    3: '상 (심화)',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    mc: '객관식',
    short: '단답형',
    tf: '진위형 (O/X)',
    essay: '서술형',
};

export const SCHOOL_LEVEL_GRADES: Record<string, number[]> = {
    '초등': [1, 2, 3, 4, 5, 6],
    '중등': [1, 2, 3],
    '고등': [1, 2, 3],
};

export const MC_LABELS = ['①', '②', '③', '④', '⑤'];

// 교과서 프리셋 (자유 입력도 가능)
export const TEXTBOOK_PRESETS = [
    '동아출판', '미래엔', '비상교육', '신사고', '천재교육',
    'YBM', '지학사', '금성출판', '교학사', '직접입력',
];
