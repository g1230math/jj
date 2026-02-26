import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    Play, ArrowLeft, CheckCircle, XCircle, ChevronRight, Filter,
    BookOpen, RotateCcw, Award, School
} from 'lucide-react';
import {
    getQuestions, type Question, type QuestionType, type Difficulty,
    QUESTION_TYPE_LABELS, DIFFICULTY_LABELS, MC_LABELS, SCHOOL_LIST
} from '../data/studyData';
import { MathRenderer } from '../components/MathRenderer';
import { RelatedLinksDisplay } from '../components/RelatedLinksDisplay';

export function Practice() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterChapter, setFilterChapter] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [filterType, setFilterType] = useState('');

    // Practice state
    const [currentIdx, setCurrentIdx] = useState<number | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState({ correct: 0, wrong: 0 });

    useEffect(() => {
        getQuestions().then(qs => { setQuestions(qs); setLoading(false); });
    }, []);

    const chapters = useMemo(() => {
        const set = new Set<string>();
        questions.forEach(q => { if (q.chapter) set.add(q.chapter); });
        return Array.from(set).sort();
    }, [questions]);

    const filtered = useMemo(() => {
        return questions.filter(q => {
            if (filterChapter && q.chapter !== filterChapter) return false;
            if (filterDifficulty && q.difficulty !== Number(filterDifficulty)) return false;
            if (filterType && q.type !== filterType) return false;
            return true;
        });
    }, [questions, filterChapter, filterDifficulty, filterType]);

    const currentQ = currentIdx !== null ? filtered[currentIdx] : null;

    const handleSubmit = () => {
        if (!currentQ || !userAnswer.trim()) return;
        setSubmitted(true);

        let isCorrect = false;
        if (currentQ.type === 'mc') {
            isCorrect = userAnswer === currentQ.correct_answer;
        } else if (currentQ.type === 'tf') {
            isCorrect = userAnswer.toUpperCase() === currentQ.correct_answer.toUpperCase();
        } else {
            isCorrect = userAnswer.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
        }

        setScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            wrong: prev.wrong + (isCorrect ? 0 : 1),
        }));
    };

    const nextQuestion = () => {
        if (currentIdx !== null && currentIdx < filtered.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            setCurrentIdx(null); // back to list
        }
        setUserAnswer('');
        setSubmitted(false);
    };

    const startPractice = (idx: number) => {
        setCurrentIdx(idx);
        setUserAnswer('');
        setSubmitted(false);
    };

    const resetPractice = () => {
        setCurrentIdx(null);
        setUserAnswer('');
        setSubmitted(false);
        setScore({ correct: 0, wrong: 0 });
    };

    const isCorrect = currentQ
        ? currentQ.type === 'mc'
            ? userAnswer === currentQ.correct_answer
            : currentQ.type === 'tf'
                ? userAnswer.toUpperCase() === currentQ.correct_answer.toUpperCase()
                : userAnswer.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase()
        : false;

    if (loading) {
        return (
            <div className="flex flex-col">
                <section className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto animate-pulse" />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 mb-4 backdrop-blur-sm text-sm">
                            FREE PRACTICE
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-3">🏃 자유 연습</h1>
                        <p className="text-lg text-emerald-200 max-w-xl mx-auto font-light">
                            단원별 문제를 자유롭게 풀어보세요
                        </p>
                        {(score.correct > 0 || score.wrong > 0) && (
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4">
                                <span className="text-sm text-emerald-200">✅ 정답: <strong className="text-white">{score.correct}</strong></span>
                                <span className="text-sm text-emerald-200">❌ 오답: <strong className="text-white">{score.wrong}</strong></span>
                                <span className="text-sm text-emerald-200">정답률: <strong className="text-white">
                                    {Math.round(score.correct / (score.correct + score.wrong) * 100)}%
                                </strong></span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                <Link to="/study" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 학습 허브로
                </Link>

                {/* ── 문제 풀기 모드 ── */}
                {currentQ ? (
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm"
                    >
                        {/* Header */}
                        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">
                                    #{(currentIdx ?? 0) + 1} / {filtered.length}
                                </span>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                                    currentQ.difficulty === 3 ? "bg-red-50 text-red-600" :
                                        currentQ.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                )}>
                                    {DIFFICULTY_LABELS[currentQ.difficulty]}
                                </span>
                                {currentQ.chapter && (
                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                                        {currentQ.chapter}
                                    </span>
                                )}
                            </div>
                            <button onClick={resetPractice} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                                <RotateCcw className="w-3 h-3" /> 목록으로
                            </button>
                        </div>

                        {/* Question */}
                        <div className="p-5">
                            <MathRenderer content={currentQ.content} className="text-base text-slate-800 leading-relaxed mb-5" />

                            {/* MC Options */}
                            {currentQ.type === 'mc' && currentQ.options && (
                                <div className="space-y-2 mb-4">
                                    {currentQ.options.map((opt, i) => {
                                        const optIdx = String(i + 1);
                                        const isSelected = userAnswer === optIdx;
                                        const isAnswer = currentQ.correct_answer === optIdx;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => !submitted && setUserAnswer(optIdx)}
                                                disabled={submitted}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all",
                                                    submitted
                                                        ? isAnswer
                                                            ? "border-emerald-400 bg-emerald-50"
                                                            : isSelected && !isAnswer
                                                                ? "border-red-400 bg-red-50"
                                                                : "border-slate-200 opacity-50"
                                                        : isSelected
                                                            ? "border-indigo-500 bg-indigo-50"
                                                            : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                                                )}
                                            >
                                                <span className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                                    submitted && isAnswer ? "bg-emerald-500 text-white" :
                                                        submitted && isSelected ? "bg-red-500 text-white" :
                                                            isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                                                )}>
                                                    {submitted && isAnswer ? <CheckCircle className="w-4 h-4" /> :
                                                        submitted && isSelected ? <XCircle className="w-4 h-4" /> :
                                                            MC_LABELS[i]}
                                                </span>
                                                <MathRenderer content={opt.text} className="text-sm text-slate-700" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* TF */}
                            {currentQ.type === 'tf' && (
                                <div className="flex gap-3 mb-4">
                                    {['O', 'X'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => !submitted && setUserAnswer(val)}
                                            disabled={submitted}
                                            className={cn(
                                                "flex-1 py-4 rounded-xl border-2 text-2xl font-bold transition-all",
                                                submitted
                                                    ? val === currentQ.correct_answer
                                                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                                        : userAnswer === val
                                                            ? "border-red-400 bg-red-50 text-red-700"
                                                            : "border-slate-200 text-slate-300"
                                                    : userAnswer === val
                                                        ? val === 'O' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700"
                                                        : "border-slate-200 text-slate-400 hover:border-slate-300"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Short/Essay */}
                            {(currentQ.type === 'short' || currentQ.type === 'essay') && (
                                <div className="mb-4">
                                    {currentQ.type === 'essay' ? (
                                        <textarea
                                            value={userAnswer}
                                            onChange={e => setUserAnswer(e.target.value)}
                                            disabled={submitted}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none h-32 font-mono"
                                            placeholder="답안을 입력하세요..."
                                        />
                                    ) : (
                                        <input
                                            value={userAnswer}
                                            onChange={e => setUserAnswer(e.target.value)}
                                            disabled={submitted}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none font-mono"
                                            placeholder="정답을 입력하세요..."
                                            onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmit()}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Submit / Result */}
                            {!submitted ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!userAnswer.trim()}
                                    className={cn(
                                        "w-full py-3 rounded-xl text-sm font-bold transition-all",
                                        userAnswer.trim()
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    정답 확인
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border-2",
                                        isCorrect ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"
                                    )}>
                                        {isCorrect ? (
                                            <>
                                                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                                                <p className="text-sm font-bold text-emerald-700">🎉 정답입니다!</p>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-red-700">❌ 오답입니다</p>
                                                    <p className="text-xs text-red-500 mt-0.5">
                                                        정답: {currentQ.type === 'mc' && currentQ.options
                                                            ? `${MC_LABELS[parseInt(currentQ.correct_answer) - 1]} ${currentQ.options[parseInt(currentQ.correct_answer) - 1]?.text}`
                                                            : currentQ.correct_answer}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Explanation */}
                                    {currentQ.explanation && (
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">💡 해설</p>
                                            <MathRenderer content={currentQ.explanation} className="text-sm text-slate-700 leading-relaxed" />
                                        </div>
                                    )}

                                    {/* Related Links */}
                                    {currentQ.related_links && currentQ.related_links.length > 0 && (
                                        <RelatedLinksDisplay links={currentQ.related_links} />
                                    )}

                                    <button
                                        onClick={nextQuestion}
                                        className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {currentIdx !== null && currentIdx < filtered.length - 1
                                            ? <><ChevronRight className="w-4 h-4" /> 다음 문제</>
                                            : <><RotateCcw className="w-4 h-4" /> 목록으로</>
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* ── 문제 목록 모드 ── */
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-600">단원/유형 필터</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <select
                                    value={filterChapter}
                                    onChange={e => setFilterChapter(e.target.value)}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                                >
                                    <option value="">전체 단원</option>
                                    {chapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                                </select>
                                <select
                                    value={filterDifficulty}
                                    onChange={e => setFilterDifficulty(e.target.value)}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                                >
                                    <option value="">전체 난이도</option>
                                    <option value="1">하</option>
                                    <option value="2">중</option>
                                    <option value="3">상</option>
                                </select>
                                <select
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                                >
                                    <option value="">전체 유형</option>
                                    {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Start All button */}
                        {filtered.length > 0 && (
                            <button
                                onClick={() => startPractice(0)}
                                className="w-full mb-4 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4" /> 전체 {filtered.length}문제 연습 시작
                            </button>
                        )}

                        {/* Question List */}
                        <div className="space-y-2">
                            {filtered.length > 0 ? filtered.map((q, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                >
                                    <button
                                        onClick={() => startPractice(i)}
                                        className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all text-left group"
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                                            q.type === 'mc' ? "bg-blue-100 text-blue-700" :
                                                q.type === 'short' ? "bg-emerald-100 text-emerald-700" :
                                                    q.type === 'tf' ? "bg-amber-100 text-amber-700" :
                                                        "bg-purple-100 text-purple-700"
                                        )}>
                                            {QUESTION_TYPE_LABELS[q.type]?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <MathRenderer
                                                content={q.content.length > 80 ? q.content.slice(0, 80) + '...' : q.content}
                                                className="text-sm text-slate-800"
                                            />
                                            <div className="flex gap-1.5 mt-1">
                                                {q.chapter && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">{q.chapter}</span>}
                                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                                                    q.difficulty === 3 ? "bg-red-50 text-red-600" : q.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                                )}>
                                                    {DIFFICULTY_LABELS[q.difficulty]}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0" />
                                    </button>
                                </motion.div>
                            )) : (
                                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">문제가 없습니다</p>
                                    <p className="text-sm text-slate-400 mt-1">필터를 변경해보세요</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
