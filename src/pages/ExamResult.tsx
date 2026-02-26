import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    CheckCircle, XCircle, Award, ArrowLeft, BarChart3, BookOpen, RotateCcw
} from 'lucide-react';
import {
    getAttempts, getQuestions, getExams,
    type ExamAttempt, type Question, type Exam, MC_LABELS, DIFFICULTY_LABELS
} from '../data/studyData';
import { MathRenderer } from '../components/MathRenderer';

export function ExamResult() {
    const { attemptId } = useParams<{ attemptId: string }>();
    const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!attemptId) return;
        Promise.all([getAttempts(), getExams(), getQuestions()]).then(([atts, exams, qs]) => {
            const att = atts.find(a => a.id === attemptId);
            if (!att) return;
            setAttempt(att);
            setExam(exams.find(e => e.id === att.exam_id) ?? null);
            setQuestions(qs);
            setLoading(false);
        });
    }, [attemptId]);

    if (loading || !attempt || !exam) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const scorePercent = Math.round((attempt.score ?? 0) / (attempt.total_points || 1) * 100);
    const correctCount = attempt.answers.filter(a => a.is_correct === true).length;
    const wrongCount = attempt.answers.filter(a => a.is_correct === false).length;
    const pendingCount = attempt.answers.filter(a => a.is_correct === null).length;

    const getGrade = (percent: number) => {
        if (percent >= 90) return { label: '🏆 우수', color: 'text-emerald-600', bg: 'bg-emerald-50' };
        if (percent >= 70) return { label: '👍 양호', color: 'text-blue-600', bg: 'bg-blue-50' };
        if (percent >= 50) return { label: '📝 보통', color: 'text-amber-600', bg: 'bg-amber-50' };
        return { label: '💪 분발', color: 'text-rose-600', bg: 'bg-rose-50' };
    };

    const grade = getGrade(scorePercent);

    return (
        <div className="flex flex-col">
            {/* ═══ Hero ═══ */}
            <section className={cn(
                "relative text-white py-16 overflow-hidden wave-divider wave-divider-white",
                scorePercent >= 70 ? "bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800" :
                    "bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800"
            )}>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-6xl mb-4">{scorePercent >= 90 ? '🎉' : scorePercent >= 70 ? '👏' : scorePercent >= 50 ? '👍' : '💪'}</div>
                        <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
                        <div className="flex items-center justify-center gap-6 text-lg opacity-90">
                            <span>{attempt.score}/{attempt.total_points}점</span>
                            <span className="text-4xl font-black">{scorePercent}%</span>
                            <span className={cn("px-3 py-1 rounded-full text-sm font-bold", grade.bg, grade.color)}>
                                {grade.label}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                {/* ═══ Summary Stats ═══ */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
                        <p className="text-xs text-slate-500">정답</p>
                    </div>
                    <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
                        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
                        <p className="text-xs text-slate-500">오답</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <BookOpen className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-slate-600">{questions.length}</p>
                        <p className="text-xs text-slate-500">총 문제</p>
                    </div>
                </div>

                {/* ═══ Question Review ═══ */}
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    문제별 결과
                </h2>
                <div className="space-y-4">
                    {attempt.answers.map((ans, i) => {
                        const q = questions.find(x => x.id === ans.question_id);
                        if (!q) return null;
                        const isCorrect = ans.is_correct === true;
                        const isWrong = ans.is_correct === false;
                        const showExp = showExplanation[q.id];

                        return (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={cn(
                                    "bg-white rounded-xl border-2 overflow-hidden",
                                    isCorrect ? "border-emerald-200" : isWrong ? "border-red-200" : "border-slate-200"
                                )}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                            isCorrect ? "bg-emerald-100 text-emerald-600" :
                                                isWrong ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {isCorrect ? <CheckCircle className="w-4 h-4" /> : isWrong ? <XCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <MathRenderer content={q.content} className="text-sm text-slate-800 leading-relaxed" />

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {isWrong && (
                                                    <>
                                                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                                            내 답: {q.type === 'mc' && q.options ? MC_LABELS[parseInt(ans.answer) - 1] || ans.answer : ans.answer || '미작성'}
                                                        </span>
                                                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                                            정답: {q.type === 'mc' && q.options ? MC_LABELS[parseInt(q.correct_answer) - 1] || q.correct_answer : q.correct_answer}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Explanation toggle */}
                                {q.explanation && (
                                    <>
                                        <button
                                            onClick={() => setShowExplanation(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                            className="w-full px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-t border-slate-100"
                                        >
                                            {showExp ? '해설 숨기기' : '해설 보기'}
                                        </button>
                                        {showExp && (
                                            <div className="px-4 pb-4 bg-slate-50/50">
                                                <div className="p-3 bg-white rounded-lg border border-slate-200">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">💡 해설</p>
                                                    <MathRenderer content={q.explanation} className="text-sm text-slate-700 leading-relaxed" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Link
                        to="/study"
                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> 학습 허브로
                    </Link>
                    {exam.allow_retry && (
                        <Link
                            to={`/study/exam/${exam.id}`}
                            className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" /> 다시 풀기
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
