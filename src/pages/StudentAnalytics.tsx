import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    BarChart3, TrendingUp, Award, ArrowLeft, Target, BookOpen,
    Calendar, AlertTriangle, CheckCircle, PieChart
} from 'lucide-react';
import {
    getAttempts, getExams, getQuestions, getWrongNotes,
    type ExamAttempt, type Exam, type Question, type WrongNote,
    DIFFICULTY_LABELS, QUESTION_TYPE_LABELS
} from '../data/studyData';

export function StudentAnalytics() {
    const { user } = useAuth();
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        Promise.all([getAttempts(), getExams(), getQuestions(), getWrongNotes()]).then(([a, e, q, w]) => {
            setAttempts(a.filter(x => x.student_id === user.id && (x.status === 'submitted' || x.status === 'graded')));
            setExams(e);
            setQuestions(q);
            setWrongNotes(w.filter(x => x.student_id === user.id));
            setLoading(false);
        });
    }, [user]);

    // ─── 성적 추이 데이터 ───
    const scoreHistory = useMemo(() => {
        return attempts
            .sort((a, b) => (a.submitted_at ?? '').localeCompare(b.submitted_at ?? ''))
            .map(att => {
                const exam = exams.find(e => e.id === att.exam_id);
                const percent = Math.round((att.score ?? 0) / (att.total_points || 1) * 100);
                return {
                    exam_title: exam?.title?.slice(0, 12) || '시험',
                    score: att.score ?? 0,
                    total: att.total_points,
                    percent,
                    date: att.submitted_at ? new Date(att.submitted_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : '',
                };
            });
    }, [attempts, exams]);

    // ─── 단원별 정답률 ───
    const chapterStats = useMemo(() => {
        const map = new Map<string, { correct: number; total: number }>();
        attempts.forEach(att => {
            att.answers.forEach(ans => {
                const q = questions.find(x => x.id === ans.question_id);
                if (!q) return;
                const ch = q.chapter || '기타';
                const cur = map.get(ch) || { correct: 0, total: 0 };
                cur.total += 1;
                if (ans.is_correct) cur.correct += 1;
                map.set(ch, cur);
            });
        });
        return Array.from(map.entries())
            .map(([chapter, stats]) => ({
                chapter,
                correct: stats.correct,
                total: stats.total,
                rate: Math.round(stats.correct / stats.total * 100),
            }))
            .sort((a, b) => a.rate - b.rate); // 약점 순서
    }, [attempts, questions]);

    // ─── 난이도별 정답률 ───
    const difficultyStats = useMemo(() => {
        const map: Record<number, { correct: number; total: number }> = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } };
        attempts.forEach(att => {
            att.answers.forEach(ans => {
                const q = questions.find(x => x.id === ans.question_id);
                if (!q) return;
                map[q.difficulty].total += 1;
                if (ans.is_correct) map[q.difficulty].correct += 1;
            });
        });
        return Object.entries(map).map(([d, stats]) => ({
            difficulty: Number(d),
            label: DIFFICULTY_LABELS[Number(d) as 1 | 2 | 3],
            rate: stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0,
            total: stats.total,
        }));
    }, [attempts, questions]);

    // ─── 문제 유형별 정답률 ───
    const typeStats = useMemo(() => {
        const map: Record<string, { correct: number; total: number }> = {};
        attempts.forEach(att => {
            att.answers.forEach(ans => {
                const q = questions.find(x => x.id === ans.question_id);
                if (!q) return;
                if (!map[q.type]) map[q.type] = { correct: 0, total: 0 };
                map[q.type].total += 1;
                if (ans.is_correct) map[q.type].correct += 1;
            });
        });
        return Object.entries(map).map(([type, stats]) => ({
            type,
            label: QUESTION_TYPE_LABELS[type as keyof typeof QUESTION_TYPE_LABELS] || type,
            rate: stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0,
            total: stats.total,
        }));
    }, [attempts, questions]);

    // ─── 전체 통계 요약 ───
    const totalAnswers = attempts.reduce((s, a) => s + a.answers.length, 0);
    const totalCorrect = attempts.reduce((s, a) => s + a.answers.filter(x => x.is_correct === true).length, 0);
    const overallRate = totalAnswers > 0 ? Math.round(totalCorrect / totalAnswers * 100) : 0;
    const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / attempts.length)
        : 0;
    const bestScore = attempts.length > 0
        ? Math.max(...attempts.map(a => Math.round((a.score ?? 0) / (a.total_points || 1) * 100)))
        : 0;

    // ─── 약점 단원 Top 3 ───
    const weakChapters = chapterStats.filter(c => c.total >= 2).slice(0, 3);

    if (loading) {
        return (
            <div className="flex flex-col">
                <section className="relative bg-gradient-to-br from-indigo-800 via-blue-800 to-violet-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto animate-pulse" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* ═══ Hero ═══ */}
            <section className="relative bg-gradient-to-br from-indigo-800 via-blue-800 to-violet-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-20 w-64 h-64 bg-violet-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 mb-4 backdrop-blur-sm text-sm">
                            ANALYTICS
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-3">📊 학습 분석</h1>
                        <p className="text-lg text-blue-200 max-w-xl mx-auto font-light">
                            나의 학습 현황과 취약점을 분석합니다
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 py-8 w-full">
                <Link to="/study" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 학습 허브로
                </Link>

                {attempts.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">아직 응시한 시험이 없습니다</p>
                        <p className="text-sm text-slate-400 mt-1">시험을 응시하면 학습 분석이 표시됩니다</p>
                    </div>
                ) : (
                    <>
                        {/* ═══ Overview Stats ═══ */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: '전체 정답률', value: `${overallRate}%`, icon: Target, color: 'text-indigo-600 bg-indigo-50' },
                                { label: '평균 점수', value: `${avgScore}점`, icon: Award, color: 'text-amber-600 bg-amber-50' },
                                { label: '최고 정답률', value: `${bestScore}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
                                { label: '총 문제 수', value: `${totalAnswers}`, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
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

                        {/* ═══ Score History (Bar Chart simulation) ═══ */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-indigo-600" />
                                시험 성적 추이
                            </h3>
                            <div className="flex items-end gap-2 h-40 overflow-x-auto pb-1" style={{ minWidth: 0 }}>
                                {scoreHistory.map((entry, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className={cn(
                                            "text-[10px] font-bold",
                                            entry.percent >= 80 ? "text-emerald-600" : entry.percent >= 60 ? "text-amber-600" : "text-rose-600"
                                        )}>
                                            {entry.percent}%
                                        </span>
                                        <div
                                            className={cn(
                                                "w-full rounded-t-lg transition-all",
                                                entry.percent >= 80 ? "bg-gradient-to-t from-emerald-500 to-emerald-400" :
                                                    entry.percent >= 60 ? "bg-gradient-to-t from-amber-500 to-amber-400" :
                                                        "bg-gradient-to-t from-rose-500 to-rose-400"
                                            )}
                                            style={{ height: `${Math.max(entry.percent, 5)}%` }}
                                        />
                                        <span className="text-[9px] text-slate-400 text-center leading-tight">
                                            {entry.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* ═══ Chapter Analysis ═══ */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                    <BookOpen className="w-4 h-4 text-indigo-600" />
                                    단원별 정답률
                                </h3>
                                {chapterStats.length > 0 ? (
                                    <div className="space-y-3">
                                        {chapterStats.map(ch => (
                                            <div key={ch.chapter}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-slate-700">{ch.chapter}</span>
                                                    <span className={cn("text-xs font-bold",
                                                        ch.rate >= 80 ? "text-emerald-600" : ch.rate >= 60 ? "text-amber-600" : "text-rose-600"
                                                    )}>
                                                        {ch.rate}% ({ch.correct}/{ch.total})
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all",
                                                            ch.rate >= 80 ? "bg-emerald-500" : ch.rate >= 60 ? "bg-amber-500" : "bg-rose-500"
                                                        )}
                                                        style={{ width: `${ch.rate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-4">데이터 없음</p>
                                )}
                            </div>

                            {/* ═══ Difficulty & Type Analysis ═══ */}
                            <div className="space-y-6">
                                {/* Difficulty */}
                                <div className="bg-white rounded-xl border border-slate-200 p-5">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                        <Target className="w-4 h-4 text-indigo-600" />
                                        난이도별 정답률
                                    </h3>
                                    <div className="space-y-3">
                                        {difficultyStats.map(d => (
                                            <div key={d.difficulty}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-slate-700">{d.label}</span>
                                                    <span className={cn("text-xs font-bold",
                                                        d.rate >= 80 ? "text-emerald-600" : d.rate >= 60 ? "text-amber-600" : "text-rose-600"
                                                    )}>
                                                        {d.total > 0 ? `${d.rate}%` : '-'}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all",
                                                            d.rate >= 80 ? "bg-emerald-500" : d.rate >= 60 ? "bg-amber-500" : "bg-rose-500"
                                                        )}
                                                        style={{ width: `${d.rate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="bg-white rounded-xl border border-slate-200 p-5">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                        <PieChart className="w-4 h-4 text-indigo-600" />
                                        유형별 정답률
                                    </h3>
                                    <div className="space-y-3">
                                        {typeStats.map(t => (
                                            <div key={t.type}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-slate-700">{t.label}</span>
                                                    <span className={cn("text-xs font-bold",
                                                        t.rate >= 80 ? "text-emerald-600" : t.rate >= 60 ? "text-amber-600" : "text-rose-600"
                                                    )}>
                                                        {t.rate}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all",
                                                            t.rate >= 80 ? "bg-emerald-500" : t.rate >= 60 ? "bg-amber-500" : "bg-rose-500"
                                                        )}
                                                        style={{ width: `${t.rate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══ Weak Areas ═══ */}
                        {weakChapters.length > 0 && (
                            <div className="mt-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl border border-rose-200 p-5">
                                <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4" />
                                    취약 단원 분석
                                </h3>
                                <div className="space-y-2">
                                    {weakChapters.map((ch, i) => (
                                        <div key={ch.chapter} className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                            <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                            <span className="text-sm text-slate-800 font-medium flex-1">{ch.chapter}</span>
                                            <span className="text-sm font-bold text-rose-600">{ch.rate}%</span>
                                            <span className="text-[10px] text-slate-500">({ch.total}문제 중 {ch.correct}개 정답)</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-rose-600 mt-3">💡 위 단원을 집중적으로 복습하면 성적 향상에 도움이 됩니다!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
