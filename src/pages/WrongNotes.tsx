import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import {
    AlertTriangle, CheckCircle, BookOpen, ArrowLeft, RotateCcw,
    Filter, ChevronDown, Eye, Trash2
} from 'lucide-react';
import {
    getWrongNotes, getQuestions, getAttempts, saveWrongNotes,
    type WrongNote, type Question, type ExamAttempt,
    MC_LABELS, QUESTION_TYPE_LABELS, DIFFICULTY_LABELS
} from '../data/studyData';
import { MathRenderer } from '../components/MathRenderer';
import { RelatedLinksDisplay } from '../components/RelatedLinksDisplay';

export function WrongNotes() {
    const { user } = useAuth();
    const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterReviewed, setFilterReviewed] = useState<'all' | 'pending' | 'reviewed'>('pending');
    const [filterChapter, setFilterChapter] = useState('');
    const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!user) return;
        Promise.all([getWrongNotes(), getQuestions(), getAttempts()]).then(([wn, qs, atts]) => {
            setWrongNotes(wn.filter(w => w.student_id === user.id));
            setQuestions(qs);
            setAttempts(atts);
            setLoading(false);
        });
    }, [user]);

    const chapters = useMemo(() => {
        const set = new Set<string>();
        wrongNotes.forEach(wn => {
            const q = questions.find(x => x.id === wn.question_id);
            if (q?.chapter) set.add(q.chapter);
        });
        return Array.from(set).sort();
    }, [wrongNotes, questions]);

    const filtered = useMemo(() => {
        return wrongNotes.filter(wn => {
            if (filterReviewed === 'pending' && wn.reviewed) return false;
            if (filterReviewed === 'reviewed' && !wn.reviewed) return false;
            if (filterChapter) {
                const q = questions.find(x => x.id === wn.question_id);
                if (q?.chapter !== filterChapter) return false;
            }
            return true;
        }).sort((a, b) => b.created_at.localeCompare(a.created_at));
    }, [wrongNotes, filterReviewed, filterChapter, questions]);

    const markReviewed = async (wnId: string) => {
        const updated = wrongNotes.map(wn =>
            wn.id === wnId ? { ...wn, reviewed: true, reviewed_at: new Date().toISOString() } : wn
        );
        setWrongNotes(updated);
        // Save all wrong notes (not just this user's)
        const all = await getWrongNotes();
        const merged = all.map(wn => {
            const u = updated.find(x => x.id === wn.id);
            return u || wn;
        });
        await saveWrongNotes(merged);
    };

    const markAllReviewed = async () => {
        if (!confirm('모든 오답을 복습 완료로 표시하시겠습니까?')) return;
        const updated = wrongNotes.map(wn => ({
            ...wn, reviewed: true, reviewed_at: new Date().toISOString()
        }));
        setWrongNotes(updated);
        const all = await getWrongNotes();
        const myIds = new Set(updated.map(u => u.id));
        const merged = all.map(wn => myIds.has(wn.id) ? updated.find(u => u.id === wn.id)! : wn);
        await saveWrongNotes(merged);
    };

    const pendingCount = wrongNotes.filter(w => !w.reviewed).length;
    const reviewedCount = wrongNotes.filter(w => w.reviewed).length;

    if (loading) {
        return (
            <div className="flex flex-col">
                <section className="relative bg-gradient-to-br from-rose-700 via-pink-700 to-red-800 text-white py-20 overflow-hidden wave-divider wave-divider-white">
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
            <section className="relative bg-gradient-to-br from-rose-700 via-pink-700 to-red-800 text-white py-16 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-64 h-64 bg-rose-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-4 py-1.5 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 mb-4 backdrop-blur-sm text-sm">
                            WRONG NOTES
                        </span>
                        <h1 className="text-3xl font-bold mb-3">📝 오답 노트</h1>
                        <p className="text-lg text-rose-200 max-w-xl mx-auto font-light">
                            틀린 문제를 다시 풀고 약점을 극복하세요
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <span className="text-sm text-rose-200">복습 대기: <strong className="text-white">{pendingCount}개</strong></span>
                            <span className="text-sm text-rose-200">복습 완료: <strong className="text-white">{reviewedCount}개</strong></span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                {/* Back link */}
                <Link to="/study" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 학습 허브로
                </Link>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex bg-white rounded-xl border border-slate-200 p-0.5">
                        {([
                            { key: 'pending', label: '복습 대기', count: pendingCount },
                            { key: 'reviewed', label: '복습 완료', count: reviewedCount },
                            { key: 'all', label: '전체', count: wrongNotes.length },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterReviewed(tab.key)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                    filterReviewed === tab.key
                                        ? "bg-rose-600 text-white"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>

                    {chapters.length > 0 && (
                        <select
                            value={filterChapter}
                            onChange={e => setFilterChapter(e.target.value)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                            <option value="">전체 단원</option>
                            {chapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                        </select>
                    )}

                    {pendingCount > 0 && (
                        <button
                            onClick={markAllReviewed}
                            className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <CheckCircle className="w-3 h-3" /> 전체 복습 완료
                        </button>
                    )}
                </div>

                {/* Wrong Note List */}
                {filtered.length > 0 ? (
                    <div className="space-y-4">
                        {filtered.map((wn, i) => {
                            const q = questions.find(x => x.id === wn.question_id);
                            if (!q) return null;
                            const showExp = showExplanation[wn.id];

                            return (
                                <motion.div
                                    key={wn.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn(
                                        "bg-white rounded-xl border-2 overflow-hidden transition-colors",
                                        wn.reviewed ? "border-slate-200 opacity-70" : "border-rose-200"
                                    )}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                wn.reviewed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                            )}>
                                                {wn.reviewed ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <MathRenderer content={q.content} className="text-sm text-slate-800 leading-relaxed" />

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                                        내 답: {q.type === 'mc' && q.options ? MC_LABELS[parseInt(wn.student_answer) - 1] || wn.student_answer : wn.student_answer || '미작성'}
                                                    </span>
                                                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                                        정답: {q.type === 'mc' && q.options ? MC_LABELS[parseInt(q.correct_answer) - 1] || q.correct_answer : q.correct_answer}
                                                    </span>
                                                    {q.chapter && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{q.chapter}</span>
                                                    )}
                                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                                                        q.difficulty === 3 ? "bg-red-50 text-red-600" : q.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                                    )}>
                                                        난이도: {q.difficulty === 3 ? '상' : q.difficulty === 2 ? '중' : '하'}
                                                    </span>
                                                </div>
                                            </div>

                                            {!wn.reviewed && (
                                                <button
                                                    onClick={() => markReviewed(wn.id)}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
                                                >
                                                    복습 완료
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    {q.explanation && (
                                        <>
                                            <button
                                                onClick={() => setShowExplanation(prev => ({ ...prev, [wn.id]: !prev[wn.id] }))}
                                                className="w-full px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-t border-slate-100"
                                            >
                                                {showExp ? '해설 숨기기' : '💡 해설 보기'}
                                            </button>
                                            {showExp && (
                                                <div className="px-4 pb-4 bg-slate-50/50">
                                                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                                                        <MathRenderer content={q.explanation} className="text-sm text-slate-700 leading-relaxed" />
                                                    </div>
                                                    {q.related_links && q.related_links.length > 0 && (
                                                        <RelatedLinksDisplay links={q.related_links} />
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                            {filterReviewed === 'pending' ? '복습할 오답이 없습니다! 🎉' :
                                filterReviewed === 'reviewed' ? '복습 완료된 문제가 없습니다' : '오답 노트가 비어있습니다'}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">시험을 응시하면 오답이 자동으로 수집됩니다</p>
                    </div>
                )}
            </div>
        </div>
    );
}
