import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    BookOpen, Clock, CheckCircle, AlertTriangle, BarChart3,
    ChevronRight, Play, FileText, TrendingUp, Award, Filter, School
} from 'lucide-react';
import {
    getExams, getAttempts, getQuestions, getWrongNotes,
    type Exam, type ExamAttempt, type Question, type WrongNote, SCHOOL_LIST
} from '../data/studyData';
import { seedSampleData } from '../data/sampleStudyData';
import { MathRenderer } from '../components/MathRenderer';
import { StudentEngagement } from '../components/StudentEngagement';

export function StudyHub() {
    const { user } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
    const isStudent = user?.role === 'student';
    const [schoolFilter, setSchoolFilter] = useState<string>(isStudent && user?.school ? user.school : '전체');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 예시 데이터 시딩 후 로드
        seedSampleData().then(() =>
            Promise.all([getExams(), getAttempts(), getQuestions(), getWrongNotes()])
        )
            .then(([e, a, q, w]) => { setExams(e); setAttempts(a); setQuestions(q); setWrongNotes(w); })
            .finally(() => setLoading(false));
    }, []);

    // Filter for published exams only (students)
    const visibleExams = useMemo(() => {
        return exams
            .filter(e => e.status === 'published')
            .filter(e => schoolFilter === '전체' || e.school === '전체' || e.school === schoolFilter)
            .sort((a, b) => b.created_at.localeCompare(a.created_at));
    }, [exams, schoolFilter]);

    const myAttempts = useMemo(() => {
        return attempts.filter(a => a.student_id === user?.id);
    }, [attempts, user]);

    const myWrongNotes = useMemo(() => {
        return wrongNotes.filter(w => w.student_id === user?.id && !w.reviewed);
    }, [wrongNotes, user]);

    // Stats
    const totalAttempts = myAttempts.length;
    const completedAttempts = myAttempts.filter(a => a.status === 'submitted' || a.status === 'graded');
    const avgScore = completedAttempts.length > 0
        ? Math.round(completedAttempts.reduce((s, a) => s + (a.score ?? 0), 0) / completedAttempts.length)
        : 0;
    const avgPercent = completedAttempts.length > 0
        ? Math.round(completedAttempts.reduce((s, a) => s + ((a.score ?? 0) / (a.total_points || 1) * 100), 0) / completedAttempts.length)
        : 0;

    const getExamStatus = (exam: Exam) => {
        const myExamAttempts = myAttempts.filter(a => a.exam_id === exam.id);
        if (myExamAttempts.some(a => a.status === 'in_progress')) return 'in_progress';
        if (myExamAttempts.some(a => a.status === 'submitted' || a.status === 'graded')) return 'completed';
        return 'not_started';
    };

    const getLatestScore = (exam: Exam) => {
        const completed = myAttempts
            .filter(a => a.exam_id === exam.id && (a.status === 'submitted' || a.status === 'graded'))
            .sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? ''));
        return completed[0] ?? null;
    };

    if (loading) {
        return (
            <div className="flex flex-col">
                <section className="relative bg-gradient-to-br from-blue-800 via-indigo-800 to-violet-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-8 bg-white/20 rounded-lg w-48 mx-auto mb-4 animate-pulse" />
                        <div className="h-12 bg-white/20 rounded-lg w-64 sm:w-96 mx-auto mb-4 animate-pulse" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* ═══ Hero ═══ */}
            <section className="relative bg-gradient-to-br from-blue-800 via-indigo-800 to-violet-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-20 w-48 h-48 bg-violet-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-badge inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 mb-4 backdrop-blur-sm">
                            STUDY HUB
                        </span>
                        <h1 className="text-hero text-white mb-4">📐 나의 학습</h1>
                        <p className="text-base sm:text-xl text-blue-200 max-w-2xl mx-auto font-light">
                            시험 대비 문제풀이, 오답 복습, 학습 분석을 한 곳에서
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* ═══ School Filter ═══ */}
                {isStudent ? (
                    /* 학생은 자기 학교만 보입니다 */
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
                        <School className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">
                            내 학교: <strong>{user?.school || '미설정'}</strong>
                        </span>
                        <span className="text-[10px] text-indigo-400 sm:ml-auto mt-1 sm:mt-0">학교 변경은 원장님께 문의하세요</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center gap-2">
                            <School className="w-5 h-5 text-indigo-600 shrink-0" />
                            <span className="text-sm font-semibold text-slate-700">학교 선택</span>
                        </div>
                        <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 border border-slate-200">
                            {SCHOOL_LIST.map(school => (
                                <button
                                    key={school}
                                    onClick={() => setSchoolFilter(school)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                                        schoolFilter === school
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    {school === '전체' ? '전체 보기' : school}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ Stats Cards ═══ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: '응시 시험', value: totalAttempts, icon: FileText, color: 'text-blue-600 bg-blue-50' },
                        { label: '평균 점수', value: `${avgScore}점`, icon: Award, color: 'text-amber-600 bg-amber-50' },
                        { label: '평균 정답률', value: `${avgPercent}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
                        { label: '오답 복습', value: `${myWrongNotes.length}개`, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
                    ].map(stat => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.color)}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ═══ Student Engagement Panel ═══ */}
                <div className="mb-8">
                    <StudentEngagement />
                </div>

                {/* ═══ Exam List ═══ */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            시험 목록
                        </h2>
                        {schoolFilter !== '전체' && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <Filter className="w-3 h-3" /> {schoolFilter}
                            </span>
                        )}
                    </div>

                    {visibleExams.length > 0 ? (
                        <div className="grid gap-3">
                            {visibleExams.map((exam, i) => {
                                const status = getExamStatus(exam);
                                const latest = getLatestScore(exam);
                                const qCount = exam.question_ids.length;

                                return (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            to={status === 'completed' && latest
                                                ? `/study/result/${latest.id}`
                                                : `/study/exam/${exam.id}`}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md group bg-white",
                                                status === 'completed' ? 'border-emerald-200' :
                                                    status === 'in_progress' ? 'border-blue-200' :
                                                        'border-slate-200'
                                            )}
                                        >
                                            {/* Status Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                    status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-100 text-slate-400'
                                            )}>
                                                {status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                                    status === 'in_progress' ? <Play className="w-5 h-5" /> :
                                                        <FileText className="w-5 h-5" />}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                                                    <span className="text-xs text-slate-500">{qCount}문제</span>
                                                    {exam.time_limit_minutes && (
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {exam.time_limit_minutes}분
                                                        </span>
                                                    )}
                                                    {exam.school !== '전체' && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{exam.school}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Score / Action */}
                                            <div className="shrink-0 text-right">
                                                {status === 'completed' && latest ? (
                                                    <div>
                                                        <span className="text-lg font-bold text-emerald-600">
                                                            {Math.round((latest.score ?? 0) / (latest.total_points || 1) * 100)}%
                                                        </span>
                                                        <p className="text-[10px] text-slate-400">
                                                            {latest.score}/{latest.total_points}점
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">아직 등록된 시험이 없습니다</p>
                            <p className="text-sm text-slate-400 mt-1">선생님이 시험을 등록하면 여기에 표시됩니다</p>
                        </div>
                    )}
                </div>

                {/* ═══ Quick Links ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        to="/study/wrong-notes"
                        className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-rose-200 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">오답 노트</h3>
                            <p className="text-xs text-slate-500 mt-0.5">틀린 문제 복습하기</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
                    </Link>

                    <Link
                        to="/study/analytics"
                        className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">학습 분석</h3>
                            <p className="text-xs text-slate-500 mt-0.5">성적 추이 & 취약점</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
                    </Link>

                    <Link
                        to="/study/practice"
                        className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <Play className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">자유 연습</h3>
                            <p className="text-xs text-slate-500 mt-0.5">단원별 문제 풀기</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
