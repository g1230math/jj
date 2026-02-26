import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    Clock, ChevronLeft, ChevronRight, Send, AlertCircle, CheckCircle,
    Flag
} from 'lucide-react';
import {
    getExams, getQuestions, getAttempts, addAttempt, updateAttempt,
    getWrongNotes, saveWrongNotes,
    gradeAnswer, genId,
    type Exam, type Question, type ExamAttempt, type ExamAttemptAnswer,
    MC_LABELS
} from '../data/studyData';
import { MathRenderer } from '../components/MathRenderer';

export function ExamTaking() {
    const { examId } = useParams<{ examId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load exam & questions
    useEffect(() => {
        if (!examId) return;
        Promise.all([getExams(), getQuestions()]).then(([exams, qs]) => {
            const e = exams.find(x => x.id === examId);
            if (!e) return;
            setExam(e);

            let examQs = e.question_ids.map(id => qs.find(q => q.id === id)).filter(Boolean) as Question[];
            if (e.shuffle_questions) {
                examQs = [...examQs].sort(() => Math.random() - 0.5);
            }
            setQuestions(examQs);

            if (e.time_limit_minutes) {
                setTimeLeft(e.time_limit_minutes * 60);
            }
            setLoading(false);
        });
    }, [examId]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || submitted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [timeLeft, submitted]);

    // Auto-save to localStorage
    useEffect(() => {
        if (examId && Object.keys(answers).length > 0) {
            localStorage.setItem(`exam_answers_${examId}`, JSON.stringify(answers));
        }
    }, [answers, examId]);

    // Restore from localStorage
    useEffect(() => {
        if (examId) {
            const saved = localStorage.getItem(`exam_answers_${examId}`);
            if (saved) {
                try { setAnswers(JSON.parse(saved)); } catch { }
            }
        }
    }, [examId]);

    const currentQ = questions[currentIdx];

    const setAnswer = useCallback((qId: string, val: string) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    }, []);

    const toggleFlag = useCallback((qId: string) => {
        setFlagged(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId); else next.add(qId);
            return next;
        });
    }, []);

    const handleSubmit = async () => {
        if (!exam || !user || submitted) return;
        if (!confirm('시험을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) return;

        setSubmitted(true);
        if (timerRef.current) clearInterval(timerRef.current);

        // Grade
        const graded: ExamAttemptAnswer[] = questions.map(q => {
            const userAns = answers[q.id] || '';
            const result = gradeAnswer(q, userAns);
            return {
                question_id: q.id,
                answer: userAns,
                is_correct: result.correct,
                points_earned: result.correct === true ? 1 : 0,
            };
        });

        const totalPoints = questions.length;
        const score = graded.reduce((s, a) => s + a.points_earned, 0);

        const newAttempt: ExamAttempt = {
            id: genId('att'),
            exam_id: exam.id,
            student_id: user.id,
            student_name: user.name,
            started_at: new Date().toISOString(),
            submitted_at: new Date().toISOString(),
            score,
            total_points: totalPoints,
            status: 'graded',
            answers: graded,
        };

        await addAttempt(newAttempt);
        setAttempt(newAttempt);

        // Save wrong notes
        const wrongItems = graded
            .filter(a => a.is_correct === false)
            .map(a => ({
                id: genId('wn'),
                student_id: user.id,
                question_id: a.question_id,
                attempt_id: newAttempt.id,
                student_answer: a.answer,
                reviewed: false,
                reviewed_at: null,
                created_at: new Date().toISOString(),
            }));

        if (wrongItems.length > 0) {
            const existing = await getWrongNotes();
            await saveWrongNotes([...existing, ...wrongItems]);
        }

        // Clean localStorage
        localStorage.removeItem(`exam_answers_${examId}`);

        // Navigate to result
        navigate(`/study/result/${newAttempt.id}`);
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading || !exam || !currentQ) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">시험을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    const progress = ((currentIdx + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ═══ Top Bar ═══ */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-slate-900 text-sm">{exam.title}</h1>
                            <p className="text-xs text-slate-500">
                                문제 {currentIdx + 1} / {questions.length} · {answeredCount}개 답안 작성
                            </p>
                        </div>
                        {timeLeft !== null && (
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold",
                                timeLeft <= 60 ? "bg-red-100 text-red-700 animate-pulse" :
                                    timeLeft <= 300 ? "bg-amber-100 text-amber-700" :
                                        "bg-slate-100 text-slate-700"
                            )}>
                                <Clock className="w-4 h-4" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 flex gap-6">
                {/* ═══ Question Area ═══ */}
                <div className="flex-1">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                    >
                        {/* Question number & difficulty */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                Q{currentIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded font-medium",
                                    currentQ.difficulty === 3 ? "bg-red-100 text-red-700" :
                                        currentQ.difficulty === 2 ? "bg-amber-100 text-amber-700" :
                                            "bg-green-100 text-green-700"
                                )}>
                                    {currentQ.difficulty === 3 ? '상' : currentQ.difficulty === 2 ? '중' : '하'}
                                </span>
                                <button
                                    onClick={() => toggleFlag(currentQ.id)}
                                    className={cn(
                                        "p-1 rounded-md transition-colors",
                                        flagged.has(currentQ.id) ? "bg-amber-100 text-amber-600" : "text-slate-300 hover:text-slate-500"
                                    )}
                                    title="나중에 확인"
                                >
                                    <Flag className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Question content */}
                        <MathRenderer content={currentQ.content} className="text-slate-800 leading-relaxed mb-4" />

                        {currentQ.content_image_url && (
                            <img src={currentQ.content_image_url} alt="문제 이미지" className="max-w-full rounded-lg border border-slate-200 mb-4" />
                        )}

                        {/* Answer input */}
                        <div className="mt-6">
                            {currentQ.type === 'mc' && currentQ.options && (
                                <div className="space-y-2">
                                    {currentQ.options.map((opt, i) => {
                                        const val = String(i + 1);
                                        const selected = answers[currentQ.id] === val;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setAnswer(currentQ.id, val)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                                                    selected
                                                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                <span className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                                                    selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {MC_LABELS[i]}
                                                </span>
                                                <MathRenderer content={opt.text} className="text-sm text-slate-700 flex-1" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {currentQ.type === 'tf' && (
                                <div className="flex gap-3">
                                    {['O', 'X'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setAnswer(currentQ.id, val)}
                                            className={cn(
                                                "flex-1 py-4 rounded-xl border-2 text-2xl font-bold transition-all",
                                                answers[currentQ.id] === val
                                                    ? val === 'O' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700"
                                                    : "border-slate-200 text-slate-400 hover:border-slate-300"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'short' && (
                                <input
                                    type="text"
                                    value={answers[currentQ.id] || ''}
                                    onChange={e => setAnswer(currentQ.id, e.target.value)}
                                    placeholder="정답을 입력하세요"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                />
                            )}

                            {currentQ.type === 'essay' && (
                                <textarea
                                    value={answers[currentQ.id] || ''}
                                    onChange={e => setAnswer(currentQ.id, e.target.value)}
                                    placeholder="풀이를 작성하세요"
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                            disabled={currentIdx === 0}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> 이전
                        </button>

                        {currentIdx === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all"
                            >
                                <Send className="w-4 h-4" /> 제출하기
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                            >
                                다음 <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ═══ Question Navigator (Desktop) ═══ */}
                <div className="hidden lg:block w-56 shrink-0">
                    <div className="sticky top-28 bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">문제 목록</h3>
                        <div className="grid grid-cols-5 gap-1.5">
                            {questions.map((q, i) => {
                                const answered = !!answers[q.id]?.trim();
                                const isCurrent = i === currentIdx;
                                const isFlagged = flagged.has(q.id);
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIdx(i)}
                                        className={cn(
                                            "w-8 h-8 rounded-lg text-xs font-bold transition-all relative",
                                            isCurrent ? "bg-indigo-600 text-white ring-2 ring-indigo-300" :
                                                answered ? "bg-emerald-100 text-emerald-700" :
                                                    "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        {i + 1}
                                        {isFlagged && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 space-y-1.5 text-[10px] text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-emerald-100 rounded" /> 답안 작성 ({answeredCount})
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-slate-100 rounded" /> 미작성 ({questions.length - answeredCount})
                            </div>
                            {flagged.size > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-amber-500 rounded-full" /> 확인 필요 ({flagged.size})
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            시험 제출
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
