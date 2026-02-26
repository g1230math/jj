import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import {
    BarChart3, TrendingUp, Users, Award, Target, BookOpen,
    AlertTriangle, ChevronDown, FileText, Search
} from 'lucide-react';
import {
    getAttempts, getExams, getQuestions, getWrongNotes,
    type ExamAttempt, type Exam, type Question, type WrongNote,
    DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, SCHOOL_LIST
} from '../data/studyData';

export function AdminAnalytics() {
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState('');
    const [searchStudent, setSearchStudent] = useState('');

    useEffect(() => {
        Promise.all([getAttempts(), getExams(), getQuestions(), getWrongNotes()]).then(([a, e, q, w]) => {
            setAttempts(a.filter(x => x.status === 'submitted' || x.status === 'graded'));
            setExams(e); setQuestions(q); setWrongNotes(w);
            setLoading(false);
        });
    }, []);

    // ─── 전체 통계 ───
    const totalStudents = useMemo(() => new Set(attempts.map(a => a.student_id)).size, [attempts]);
    const totalExamsCreated = exams.length;
    const totalAttempts = attempts.length;
    const overallAvg = useMemo(() => {
        if (attempts.length === 0) return 0;
        return Math.round(attempts.reduce((s, a) => s + ((a.score ?? 0) / (a.total_points || 1) * 100), 0) / attempts.length);
    }, [attempts]);

    // ─── 시험별 성적 분석 ───
    const examStats = useMemo(() => {
        return exams.map(e => {
            const examAtts = attempts.filter(a => a.exam_id === e.id);
            const studentCount = new Set(examAtts.map(a => a.student_id)).size;
            const avgPercent = examAtts.length > 0
                ? Math.round(examAtts.reduce((s, a) => s + ((a.score ?? 0) / (a.total_points || 1) * 100), 0) / examAtts.length)
                : 0;
            const maxPercent = examAtts.length > 0
                ? Math.max(...examAtts.map(a => Math.round((a.score ?? 0) / (a.total_points || 1) * 100)))
                : 0;
            const minPercent = examAtts.length > 0
                ? Math.min(...examAtts.map(a => Math.round((a.score ?? 0) / (a.total_points || 1) * 100)))
                : 0;
            return { exam: e, studentCount, avgPercent, maxPercent, minPercent, attempts: examAtts };
        }).sort((a, b) => b.exam.created_at.localeCompare(a.exam.created_at));
    }, [exams, attempts]);

    // ─── 학생 랭킹 ───
    const studentRanking = useMemo(() => {
        const map = new Map<string, { name: string; scores: number[]; totalQ: number; correctQ: number }>();
        attempts.forEach(att => {
            const cur = map.get(att.student_id) || { name: att.student_name, scores: [], totalQ: 0, correctQ: 0 };
            cur.scores.push(Math.round((att.score ?? 0) / (att.total_points || 1) * 100));
            cur.totalQ += att.answers.length;
            cur.correctQ += att.answers.filter(a => a.is_correct === true).length;
            map.set(att.student_id, cur);
        });
        return Array.from(map.entries())
            .map(([id, data]) => ({
                id,
                name: data.name,
                avgScore: Math.round(data.scores.reduce((s, x) => s + x, 0) / data.scores.length),
                examCount: data.scores.length,
                accuracy: data.totalQ > 0 ? Math.round(data.correctQ / data.totalQ * 100) : 0,
            }))
            .filter(s => !searchStudent || s.name.toLowerCase().includes(searchStudent.toLowerCase()))
            .sort((a, b) => b.avgScore - a.avgScore);
    }, [attempts, searchStudent]);

    // ─── 문제별 오답률 (어려운 문제 순) ───
    const questionDifficulty = useMemo(() => {
        const map = new Map<string, { correct: number; total: number }>();
        attempts.forEach(att => {
            att.answers.forEach(ans => {
                const cur = map.get(ans.question_id) || { correct: 0, total: 0 };
                cur.total += 1;
                if (ans.is_correct === true) cur.correct += 1;
                map.set(ans.question_id, cur);
            });
        });
        return Array.from(map.entries())
            .map(([qId, stats]) => {
                const q = questions.find(x => x.id === qId);
                return {
                    question: q,
                    correct: stats.correct,
                    total: stats.total,
                    errorRate: Math.round((1 - stats.correct / stats.total) * 100),
                };
            })
            .filter(x => x.question && x.total >= 2)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);
    }, [attempts, questions]);

    // ─── 선택된 시험의 상세 ───
    const selectedExamData = useMemo(() => {
        if (!selectedExam) return null;
        return examStats.find(s => s.exam.id === selectedExam) ?? null;
    }, [selectedExam, examStats]);

    if (loading) {
        return <div className="flex items-center justify-center p-8"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    학습 분석 (관리자)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">전체 학생 학습 현황 및 시험 결과 분석</p>
            </div>

            {/* ═══ Overview Cards ═══ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: '응시 학생 수', value: totalStudents, icon: Users, color: 'text-blue-600 bg-blue-50' },
                    { label: '총 응시 횟수', value: totalAttempts, icon: FileText, color: 'text-violet-600 bg-violet-50' },
                    { label: '전체 평균 점수', value: `${overallAvg}%`, icon: Award, color: 'text-amber-600 bg-amber-50' },
                    { label: '누적 오답', value: wrongNotes.length, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ═══ 시험별 성적 ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        시험별 성적 요약
                    </h3>
                    {examStats.length > 0 ? (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {examStats.map(es => (
                                <button
                                    key={es.exam.id}
                                    onClick={() => setSelectedExam(selectedExam === es.exam.id ? '' : es.exam.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-colors",
                                        selectedExam === es.exam.id ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 truncate">{es.exam.title}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{es.studentCount}명 응시</p>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className={cn("text-sm font-bold", es.avgPercent >= 70 ? "text-emerald-600" : "text-amber-600")}>
                                                평균 {es.avgPercent}%
                                            </p>
                                            <p className="text-[10px] text-slate-400">최고 {es.maxPercent}% / 최저 {es.minPercent}%</p>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {selectedExam === es.exam.id && es.attempts.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                                            {es.attempts
                                                .sort((a, b) => ((b.score ?? 0) / (b.total_points || 1)) - ((a.score ?? 0) / (a.total_points || 1)))
                                                .map((att, i) => {
                                                    const pct = Math.round((att.score ?? 0) / (att.total_points || 1) * 100);
                                                    return (
                                                        <div key={att.id} className="flex items-center gap-2 text-xs">
                                                            <span className={cn(
                                                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                                                i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                                                            )}>{i + 1}</span>
                                                            <span className="text-slate-700 flex-1 truncate">{att.student_name}</span>
                                                            <span className={cn("font-bold",
                                                                pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-rose-600"
                                                            )}>{pct}%</span>
                                                            <span className="text-slate-400">{att.score}/{att.total_points}</span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-6">응시 데이터가 없습니다</p>
                    )}
                </div>

                {/* ═══ 학생 순위 ═══ */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-amber-600" />
                        학생 성적 순위
                    </h3>
                    <div className="mb-3">
                        <input
                            placeholder="학생 이름 검색..."
                            value={searchStudent}
                            onChange={e => setSearchStudent(e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-200"
                        />
                    </div>
                    {studentRanking.length > 0 ? (
                        <div className="space-y-1.5 max-h-72 overflow-y-auto">
                            {studentRanking.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                        i === 0 ? "bg-yellow-100 text-yellow-700" :
                                            i === 1 ? "bg-slate-200 text-slate-600" :
                                                i === 2 ? "bg-orange-100 text-orange-700" :
                                                    "bg-slate-100 text-slate-400"
                                    )}>
                                        {i + 1}
                                    </span>
                                    <span className="text-xs font-medium text-slate-800 flex-1">{s.name}</span>
                                    <span className="text-[10px] text-slate-400">{s.examCount}회</span>
                                    <span className={cn("text-xs font-bold",
                                        s.avgScore >= 80 ? "text-emerald-600" : s.avgScore >= 60 ? "text-amber-600" : "text-rose-600"
                                    )}>{s.avgScore}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-6">데이터 없음</p>
                    )}
                </div>
            </div>

            {/* ═══ 어려운 문제 TOP 10 ═══ */}
            {questionDifficulty.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        오답률 높은 문제 TOP 10
                    </h3>
                    <div className="space-y-2">
                        {questionDifficulty.map((item, i) => (
                            <div key={item.question?.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-800 truncate">{item.question?.content.slice(0, 80)}</p>
                                    <div className="flex gap-1.5 mt-0.5">
                                        {item.question?.chapter && <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded">{item.question.chapter}</span>}
                                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded">{item.total}명 응시</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-rose-600">{item.errorRate}%</p>
                                    <p className="text-[9px] text-slate-400">오답률</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
