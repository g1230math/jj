import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import {
    Plus, Save, X, Trash2, Edit2, Search, Eye, GripVertical,
    Clock, Shuffle, RotateCcw, FileText, ChevronDown, Send
} from 'lucide-react';
import {
    getExams, getQuestions, addExam, updateExam,
    genId, type Exam, type Question, type ExamStatus,
    QUESTION_TYPE_LABELS, DIFFICULTY_LABELS, SCHOOL_LIST
} from '../data/studyData';
import { MathRenderer } from './MathRenderer';

const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

export function ExamBuilderAdmin() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [editExam, setEditExam] = useState<Exam | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [qSearch, setQSearch] = useState('');
    const [qFilter, setQFilter] = useState({ school: '전체', level: '', chapter: '' });

    useEffect(() => {
        Promise.all([getExams(), getQuestions()]).then(([e, q]) => {
            setExams(e); setQuestions(q); setLoading(false);
        });
    }, []);

    const reload = () => { Promise.all([getExams(), getQuestions()]).then(([e, q]) => { setExams(e); setQuestions(q); }); };

    const emptyExam = (): Exam => ({
        id: genId('exam'),
        title: '',
        description: '',
        school: '전체',
        grade: 1,
        school_level: '중등',
        question_ids: [],
        time_limit_minutes: null,
        shuffle_questions: false,
        shuffle_options: false,
        show_result_immediately: true,
        allow_retry: true,
        max_attempts: 3,
        available_from: null,
        available_until: null,
        status: 'draft',
        created_by: 'admin',
        created_at: new Date().toISOString(),
    });

    const openAdd = () => { setEditExam(emptyExam()); setShowModal(true); };
    const openEdit = (e: Exam) => { setEditExam({ ...e }); setShowModal(true); };
    const close = () => { setShowModal(false); setEditExam(null); setQSearch(''); };

    const handleSave = async () => {
        if (!editExam) return;
        if (!editExam.title.trim()) { alert('시험 제목을 입력하세요.'); return; }
        if (editExam.question_ids.length === 0) { alert('최소 1개 이상 문제를 추가하세요.'); return; }

        const exists = exams.find(e => e.id === editExam.id);
        if (exists) await updateExam(editExam);
        else await addExam(editExam);
        reload();
        close();
    };

    const toggleQuestion = (qId: string) => {
        if (!editExam) return;
        const ids = editExam.question_ids.includes(qId)
            ? editExam.question_ids.filter(id => id !== qId)
            : [...editExam.question_ids, qId];
        setEditExam({ ...editExam, question_ids: ids });
    };

    const removeQuestion = (qId: string) => {
        if (!editExam) return;
        setEditExam({ ...editExam, question_ids: editExam.question_ids.filter(id => id !== qId) });
    };

    const publishExam = async (examId: string) => {
        const e = exams.find(x => x.id === examId);
        if (!e) return;
        await updateExam({ ...e, status: 'published' });
        reload();
    };

    const closeExam = async (examId: string) => {
        const e = exams.find(x => x.id === examId);
        if (!e) return;
        await updateExam({ ...e, status: 'closed' });
        reload();
    };

    const filteredQs = useMemo(() => {
        return questions.filter(q => {
            if (qFilter.school !== '전체' && q.school !== '전체' && q.school !== qFilter.school) return false;
            if (qFilter.level && q.school_level !== qFilter.level) return false;
            if (qSearch) {
                const s = qSearch.toLowerCase();
                return q.content.toLowerCase().includes(s) || q.chapter.toLowerCase().includes(s);
            }
            return true;
        });
    }, [questions, qFilter, qSearch]);

    const statusColors: Record<ExamStatus, string> = {
        draft: 'bg-slate-100 text-slate-600',
        published: 'bg-emerald-100 text-emerald-700',
        closed: 'bg-red-100 text-red-600',
    };
    const statusLabels: Record<ExamStatus, string> = {
        draft: '초안',
        published: '게시됨',
        closed: '마감',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        시험 관리
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">등록된 시험: {exams.length}개</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus className="w-4 h-4" /> 시험 만들기
                </button>
            </div>

            {/* Exam list */}
            <div className="space-y-3">
                {exams.length > 0 ? exams.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(e => (
                    <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-900 text-sm truncate">{e.title}</h3>
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", statusColors[e.status])}>
                                        {statusLabels[e.status]}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span>{e.question_ids.length}문제</span>
                                    {e.time_limit_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time_limit_minutes}분</span>}
                                    {e.school !== '전체' && <span>{e.school}</span>}
                                    <span>{e.school_level} {e.grade}학년</span>
                                </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                                {e.status === 'draft' && (
                                    <button onClick={() => publishExam(e.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">
                                        게시
                                    </button>
                                )}
                                {e.status === 'published' && (
                                    <button onClick={() => closeExam(e.id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200">
                                        마감
                                    </button>
                                )}
                                <button onClick={() => openEdit(e)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-indigo-100 text-slate-500"><Edit2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">등록된 시험이 없습니다</p>
                    </div>
                )}
            </div>

            {/* ═══ Create/Edit Modal ═══ */}
            {showModal && editExam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
                            <h3 className="text-lg font-bold text-slate-900">
                                {exams.find(e => e.id === editExam.id) ? '시험 수정' : '새 시험 만들기'}
                            </h3>
                            <button onClick={close} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Title & Description */}
                            <div>
                                <label className={labelCls}>시험 제목 *</label>
                                <input className={inputCls} value={editExam.title} onChange={e => setEditExam({ ...editExam, title: e.target.value })} placeholder="예: 중2 1학기 중간고사 대비 - 일차함수" />
                            </div>
                            <div>
                                <label className={labelCls}>설명</label>
                                <textarea className={inputCls + " h-16"} value={editExam.description} onChange={e => setEditExam({ ...editExam, description: e.target.value })} placeholder="시험 설명 (선택)" />
                            </div>

                            {/* School, Level, Grade */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelCls}>대상 학교</label>
                                    <select className={inputCls} value={editExam.school} onChange={e => setEditExam({ ...editExam, school: e.target.value })}>
                                        {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '전체 (공통)' : s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>학년군</label>
                                    <select className={inputCls} value={editExam.school_level} onChange={e => setEditExam({ ...editExam, school_level: e.target.value as any, grade: 1 })}>
                                        <option value="초등">초등</option>
                                        <option value="중등">중등</option>
                                        <option value="고등">고등</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>학년</label>
                                    <select className={inputCls} value={editExam.grade} onChange={e => setEditExam({ ...editExam, grade: Number(e.target.value) })}>
                                        {[1, 2, 3, 4, 5, 6].slice(0, editExam.school_level === '초등' ? 6 : 3).map(g => (
                                            <option key={g} value={g}>{g}학년</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>시간 제한 (분, 0=무제한)</label>
                                    <input type="number" className={inputCls} value={editExam.time_limit_minutes ?? 0} onChange={e => setEditExam({ ...editExam, time_limit_minutes: Number(e.target.value) || null })} />
                                </div>
                                <div>
                                    <label className={labelCls}>최대 응시 횟수</label>
                                    <input type="number" className={inputCls} value={editExam.max_attempts} onChange={e => setEditExam({ ...editExam, max_attempts: Number(e.target.value) || 1 })} min={1} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { key: 'shuffle_questions', label: '문제 셔플' },
                                    { key: 'shuffle_options', label: '보기 셔플' },
                                    { key: 'show_result_immediately', label: '즉시 결과 표시' },
                                    { key: 'allow_retry', label: '재응시 허용' },
                                ].map(opt => (
                                    <label key={opt.key} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(editExam as any)[opt.key]}
                                            onChange={e => setEditExam({ ...editExam, [opt.key]: e.target.checked })}
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>

                            {/* ═══ Question Selection ═══ */}
                            <div>
                                <label className={labelCls}>문제 선택 ({editExam.question_ids.length}개 선택됨)</label>

                                {/* Selected questions */}
                                {editExam.question_ids.length > 0 && (
                                    <div className="mb-3 space-y-1">
                                        {editExam.question_ids.map((qId, i) => {
                                            const q = questions.find(x => x.id === qId);
                                            if (!q) return null;
                                            return (
                                                <div key={qId} className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                                                    <span className="text-xs font-bold text-indigo-600 w-6">{i + 1}</span>
                                                    <span className="text-xs text-slate-700 flex-1 truncate">{q.content.slice(0, 60)}...</span>
                                                    <span className="text-[10px] text-slate-500">{QUESTION_TYPE_LABELS[q.type]}</span>
                                                    <button onClick={() => removeQuestion(qId)} className="p-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Available questions */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="p-2 bg-slate-50 border-b border-slate-200 flex gap-2">
                                        <input
                                            placeholder="문제 검색..."
                                            value={qSearch}
                                            onChange={e => setQSearch(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-200"
                                        />
                                        <select value={qFilter.school} onChange={e => setQFilter({ ...qFilter, school: e.target.value })} className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg">
                                            {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '전체' : s}</option>)}
                                        </select>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                                        {filteredQs.length > 0 ? filteredQs.slice(0, 50).map(q => {
                                            const selected = editExam.question_ids.includes(q.id);
                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => toggleQuestion(q.id)}
                                                    className={cn(
                                                        "w-full flex items-center gap-2 p-2.5 text-left hover:bg-slate-50 transition-colors",
                                                        selected && "bg-indigo-50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                                                        selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                                                    )}>
                                                        {selected && <span className="text-[10px]">✓</span>}
                                                    </div>
                                                    <span className="text-xs text-slate-700 flex-1 truncate">{q.content.slice(0, 80)}</span>
                                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0",
                                                        q.difficulty === 3 ? "bg-red-50 text-red-600" : q.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                                    )}>
                                                        {q.difficulty === 3 ? '상' : q.difficulty === 2 ? '중' : '하'}
                                                    </span>
                                                </button>
                                            );
                                        }) : (
                                            <p className="p-4 text-center text-xs text-slate-400">문제가 없습니다. 먼저 문제 은행에서 문제를 추가하세요.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={close} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                                    <Save className="w-4 h-4" /> 저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
