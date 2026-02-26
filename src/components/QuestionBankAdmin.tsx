import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import {
    Plus, Search, Trash2, Edit2, Save, X, Eye, Sparkles, Filter,
    ChevronDown, BookOpen, FileText, Link2, Video
} from 'lucide-react';
import {
    getQuestions, addQuestion, updateQuestion, deleteQuestion,
    genId, type Question, type QuestionType, type Difficulty, type LinkType, type RelatedLink,
    QUESTION_TYPE_LABELS, DIFFICULTY_LABELS, MC_LABELS,
    SCHOOL_LEVEL_GRADES, TEXTBOOK_PRESETS, SCHOOL_LIST, LINK_TYPE_LABELS
} from '../data/studyData';
import { MathRenderer, MathPreview } from './MathRenderer';

const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";
const selectCls = inputCls;

export function QuestionBankAdmin() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [editQ, setEditQ] = useState<Question | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSchool, setFilterSchool] = useState('전체');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => { loadQuestions(); }, []);

    const loadQuestions = () => {
        setLoading(true);
        getQuestions().then(qs => { setQuestions(qs); setLoading(false); });
    };

    const filtered = useMemo(() => {
        return questions.filter(q => {
            if (filterSchool !== '전체' && q.school !== '전체' && q.school !== filterSchool) return false;
            if (filterLevel && q.school_level !== filterLevel) return false;
            if (filterType && q.type !== filterType) return false;
            if (filterDifficulty && q.difficulty !== Number(filterDifficulty)) return false;
            if (searchTerm) {
                const s = searchTerm.toLowerCase();
                return q.content.toLowerCase().includes(s)
                    || q.chapter.toLowerCase().includes(s)
                    || q.sub_topic.toLowerCase().includes(s)
                    || q.tags.some(t => t.toLowerCase().includes(s));
            }
            return true;
        }).sort((a, b) => b.created_at.localeCompare(a.created_at));
    }, [questions, filterSchool, filterLevel, filterType, filterDifficulty, searchTerm]);

    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const emptyQuestion = (): Question => ({
        id: genId('q'),
        type: 'mc',
        school: '전체',
        grade: 1,
        school_level: '중등',
        textbook: '',
        chapter: '',
        sub_topic: '',
        difficulty: 2,
        content: '',
        options: [
            { label: '①', text: '' },
            { label: '②', text: '' },
            { label: '③', text: '' },
            { label: '④', text: '' },
            { label: '⑤', text: '' },
        ],
        correct_answer: '1',
        explanation: '',
        source: 'manual',
        tags: [],
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    const openAddModal = () => { setEditQ(emptyQuestion()); setShowModal(true); setShowPreview(false); };
    const openEditModal = (q: Question) => { setEditQ({ ...q, options: q.options ? [...q.options] : undefined }); setShowModal(true); setShowPreview(false); };
    const closeModal = () => { setShowModal(false); setEditQ(null); };

    const handleSave = async () => {
        if (!editQ) return;
        if (!editQ.content.trim()) { alert('문제 내용을 입력해주세요.'); return; }
        if (!editQ.correct_answer.trim()) { alert('정답을 입력해주세요.'); return; }

        editQ.updated_at = new Date().toISOString();

        const exists = questions.find(q => q.id === editQ.id);
        if (exists) {
            await updateQuestion(editQ);
        } else {
            await addQuestion(editQ);
        }
        loadQuestions();
        closeModal();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('이 문제를 삭제하시겠습니까?')) return;
        await deleteQuestion(id);
        loadQuestions();
    };

    const updateField = <K extends keyof Question>(key: K, val: Question[K]) => {
        if (!editQ) return;
        setEditQ({ ...editQ, [key]: val });
    };

    const updateOption = (idx: number, text: string) => {
        if (!editQ || !editQ.options) return;
        const opts = [...editQ.options];
        opts[idx] = { ...opts[idx], text };
        setEditQ({ ...editQ, options: opts });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        문제 은행
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">등록된 문제: {questions.length}개</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus className="w-4 h-4" /> 문제 추가
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">필터 & 검색</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <input
                        placeholder="검색 (내용, 단원, 태그)"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                        className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <select value={filterSchool} onChange={e => { setFilterSchool(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '전체 학교' : s}</option>)}
                    </select>
                    <select value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">전체 학년군</option>
                        <option value="초등">초등</option>
                        <option value="중등">중등</option>
                        <option value="고등">고등</option>
                    </select>
                    <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">전체 유형</option>
                        {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                    <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setPage(0); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">전체 난이도</option>
                        <option value="1">하</option>
                        <option value="2">중</option>
                        <option value="3">상</option>
                    </select>
                </div>
            </div>

            {/* Question List */}
            <div className="space-y-2">
                {paged.length > 0 ? paged.map(q => (
                    <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow group">
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                                q.type === 'mc' ? "bg-blue-100 text-blue-700" :
                                    q.type === 'short' ? "bg-emerald-100 text-emerald-700" :
                                        q.type === 'tf' ? "bg-amber-100 text-amber-700" :
                                            "bg-purple-100 text-purple-700"
                            )}>
                                {QUESTION_TYPE_LABELS[q.type]?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <MathRenderer content={q.content.length > 100 ? q.content.slice(0, 100) + '...' : q.content} className="text-sm text-slate-800" />
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {q.school !== '전체' && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{q.school}</span>}
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{q.school_level} {q.grade}학년</span>
                                    {q.chapter && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">{q.chapter}</span>}
                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                                        q.difficulty === 3 ? "bg-red-50 text-red-600" : q.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                    )}>
                                        난이도: {q.difficulty === 3 ? '상' : q.difficulty === 2 ? '중' : '하'}
                                    </span>
                                    {q.source === 'ai_generated' && <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded font-medium">🤖 AI 생성</span>}
                                    {q.related_links && q.related_links.length > 0 && (
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                                            <Video className="w-2.5 h-2.5" /> {q.related_links.length}개 자료
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button onClick={() => openEditModal(q)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-indigo-100 text-slate-500 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(q.id)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-red-100 text-slate-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">등록된 문제가 없습니다</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setPage(i)} className={cn(
                            "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                            i === page ? "bg-indigo-600 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                        )}>{i + 1}</button>
                    ))}
                </div>
            )}

            {/* ═══ Add/Edit Modal ═══ */}
            {showModal && editQ && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
                            <h3 className="text-lg font-bold text-slate-900">
                                {questions.find(q => q.id === editQ.id) ? '문제 수정' : '문제 추가'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowPreview(!showPreview)} className={cn(
                                    "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                                    showPreview ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                                )}>
                                    <Eye className="w-3.5 h-3.5" /> 미리보기
                                </button>
                                <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Row: Type + Difficulty */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>문제 유형 *</label>
                                    <select className={selectCls} value={editQ.type} onChange={e => {
                                        const type = e.target.value as QuestionType;
                                        const opts = type === 'mc' ? [
                                            { label: '①', text: '' }, { label: '②', text: '' },
                                            { label: '③', text: '' }, { label: '④', text: '' }, { label: '⑤', text: '' },
                                        ] : undefined;
                                        setEditQ({ ...editQ, type, options: opts, correct_answer: type === 'tf' ? 'O' : '' });
                                    }}>
                                        {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>난이도 *</label>
                                    <select className={selectCls} value={editQ.difficulty} onChange={e => updateField('difficulty', Number(e.target.value) as Difficulty)}>
                                        {([1, 2, 3] as Difficulty[]).map(d => (
                                            <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row: School + Level + Grade */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelCls}>학교</label>
                                    <select className={selectCls} value={editQ.school} onChange={e => updateField('school', e.target.value)}>
                                        {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '공통 (전체)' : s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>학년군 *</label>
                                    <select className={selectCls} value={editQ.school_level} onChange={e => {
                                        const level = e.target.value as '초등' | '중등' | '고등';
                                        setEditQ({ ...editQ, school_level: level, grade: 1 });
                                    }}>
                                        <option value="초등">초등</option>
                                        <option value="중등">중등</option>
                                        <option value="고등">고등</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>학년 *</label>
                                    <select className={selectCls} value={editQ.grade} onChange={e => updateField('grade', Number(e.target.value))}>
                                        {SCHOOL_LEVEL_GRADES[editQ.school_level]?.map(g => (
                                            <option key={g} value={g}>{g}학년</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row: Textbook + Chapter + SubTopic */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelCls}>교과서/출판사</label>
                                    <input className={inputCls} list="textbook-list" value={editQ.textbook} onChange={e => updateField('textbook', e.target.value)} placeholder="선택 또는 입력" />
                                    <datalist id="textbook-list">
                                        {TEXTBOOK_PRESETS.filter(t => t !== '직접입력').map(t => <option key={t} value={t} />)}
                                    </datalist>
                                </div>
                                <div>
                                    <label className={labelCls}>단원</label>
                                    <input className={inputCls} value={editQ.chapter} onChange={e => updateField('chapter', e.target.value)} placeholder="예: 일차함수" />
                                </div>
                                <div>
                                    <label className={labelCls}>세부 유형</label>
                                    <input className={inputCls} value={editQ.sub_topic} onChange={e => updateField('sub_topic', e.target.value)} placeholder="예: 그래프 해석" />
                                </div>
                            </div>

                            {/* Question content */}
                            <div>
                                <label className={labelCls}>
                                    문제 내용 * <span className="font-normal text-slate-400">(LaTeX: $수식$ 또는 $$수식$$)</span>
                                </label>
                                <textarea
                                    className={inputCls + " h-32 font-mono"}
                                    value={editQ.content}
                                    onChange={e => updateField('content', e.target.value)}
                                    placeholder="일차함수 $y = 2x - 3$의 그래프가 $x$축과 만나는 점의 좌표를 구하시오."
                                />
                                {showPreview && <MathPreview content={editQ.content} label="문제 미리보기" />}
                            </div>

                            {/* MC Options */}
                            {editQ.type === 'mc' && editQ.options && (
                                <div>
                                    <label className={labelCls}>보기 *</label>
                                    <div className="space-y-2">
                                        {editQ.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateField('correct_answer', String(i + 1))}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                                        editQ.correct_answer === String(i + 1) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                                                    )}
                                                    title="정답으로 설정"
                                                >
                                                    {MC_LABELS[i]}
                                                </button>
                                                <input
                                                    className={inputCls}
                                                    value={opt.text}
                                                    onChange={e => updateOption(i, e.target.value)}
                                                    placeholder={`${MC_LABELS[i]} 보기 내용 (LaTeX 가능)`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">정답으로 설정할 보기의 번호 버튼을 클릭하세요</p>
                                </div>
                            )}

                            {/* TF Answer */}
                            {editQ.type === 'tf' && (
                                <div>
                                    <label className={labelCls}>정답 *</label>
                                    <div className="flex gap-3">
                                        {['O', 'X'].map(val => (
                                            <button key={val} onClick={() => updateField('correct_answer', val)}
                                                className={cn("flex-1 py-3 rounded-xl border-2 text-lg font-bold transition-all",
                                                    editQ.correct_answer === val
                                                        ? val === 'O' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700"
                                                        : "border-slate-200 text-slate-300"
                                                )}>
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Short answer */}
                            {editQ.type === 'short' && (
                                <div>
                                    <label className={labelCls}>정답 *</label>
                                    <input className={inputCls} value={editQ.correct_answer} onChange={e => updateField('correct_answer', e.target.value)} placeholder="정답 입력" />
                                </div>
                            )}

                            {/* Explanation */}
                            <div>
                                <label className={labelCls}>
                                    해설 <span className="font-normal text-slate-400">(LaTeX 지원)</span>
                                </label>
                                <textarea
                                    className={inputCls + " h-24 font-mono"}
                                    value={editQ.explanation}
                                    onChange={e => updateField('explanation', e.target.value)}
                                    placeholder="풀이 과정 및 해설을 입력하세요"
                                />
                                {showPreview && editQ.explanation && <MathPreview content={editQ.explanation} label="해설 미리보기" />}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className={labelCls}>태그 (쉼표로 구분)</label>
                                <input
                                    className={inputCls}
                                    value={editQ.tags.join(', ')}
                                    onChange={e => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    placeholder="일차함수, 그래프, 중간고사"
                                />
                            </div>

                            {/* ═══ Related Links ═══ */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className={labelCls + ' mb-0 flex items-center gap-1'}>
                                        <Link2 className="w-3.5 h-3.5" /> 관련 학습 자료 링크
                                    </label>
                                    <button
                                        onClick={() => updateField('related_links', [
                                            ...(editQ.related_links || []),
                                            { url: '', title: '', type: 'youtube' as LinkType }
                                        ])}
                                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> 링크 추가
                                    </button>
                                </div>
                                {(editQ.related_links || []).length === 0 ? (
                                    <p className="text-[10px] text-slate-400 italic">동영상 강의, YouTube, 블로그 등 관련 자료 링크를 추가하세요</p>
                                ) : (
                                    <div className="space-y-2">
                                        {(editQ.related_links || []).map((link, li) => (
                                            <div key={li} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="flex gap-2">
                                                        <select
                                                            className="px-2 py-1 border border-slate-300 rounded text-xs"
                                                            value={link.type}
                                                            onChange={e => {
                                                                const links = [...(editQ.related_links || [])];
                                                                links[li] = { ...links[li], type: e.target.value as LinkType };
                                                                updateField('related_links', links);
                                                            }}
                                                        >
                                                            {(Object.entries(LINK_TYPE_LABELS) as [LinkType, any][]).map(([k, v]) => (
                                                                <option key={k} value={k}>{v.emoji} {v.label}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                                                            value={link.title}
                                                            onChange={e => {
                                                                const links = [...(editQ.related_links || [])];
                                                                links[li] = { ...links[li], title: e.target.value };
                                                                updateField('related_links', links);
                                                            }}
                                                            placeholder="제목 (예: 일차함수 개념 정리)"
                                                        />
                                                    </div>
                                                    <input
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                                                        value={link.url}
                                                        onChange={e => {
                                                            const links = [...(editQ.related_links || [])];
                                                            links[li] = { ...links[li], url: e.target.value };
                                                            updateField('related_links', links);
                                                        }}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const links = (editQ.related_links || []).filter((_, i) => i !== li);
                                                        updateField('related_links', links);
                                                    }}
                                                    className="p-1 bg-red-50 text-red-400 rounded hover:bg-red-100 hover:text-red-600 transition-colors shrink-0 mt-1"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
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
