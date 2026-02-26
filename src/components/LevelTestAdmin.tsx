import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cn } from '../lib/utils';
import {
    Brain, Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon,
    ToggleLeft, ToggleRight, ClipboardList, Users, FileUp, Loader2, CheckCircle, XCircle
} from 'lucide-react';
import {
    getLevelTestQuestions, saveLevelTestQuestions, getLevelTestResults,
    genId, type LevelTestQuestion, type LevelTestResult
} from '../data/academyData';
import { MathRenderer } from './MathRenderer';
import { ImageUploader } from './ImageUploader';

const ALL_GRADES = ['초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'];
const GRADE_GROUPS = [
    { label: '초등', grades: ['초3', '초4', '초5', '초6'], color: 'emerald' },
    { label: '중등', grades: ['중1', '중2', '중3'], color: 'indigo' },
    { label: '고등', grades: ['고1', '고2', '고3'], color: 'rose' },
];
const DIFFICULTIES: { key: LevelTestQuestion['difficulty']; label: string; color: string }[] = [
    { key: 'easy', label: '쉬움', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'medium', label: '보통', color: 'bg-amber-100 text-amber-700' },
    { key: 'hard', label: '어려움', color: 'bg-red-100 text-red-700' },
];

export function LevelTestAdmin() {
    const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
    const [results, setResults] = useState<LevelTestResult[]>([]);
    const [gradeFilter, setGradeFilter] = useState('중2');
    const [view, setView] = useState<'questions' | 'results' | 'bulk'>('questions');
    const [editQ, setEditQ] = useState<LevelTestQuestion | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Bulk import state
    const [bulkFile, setBulkFile] = useState<File | null>(null);
    const [bulkGrade, setBulkGrade] = useState('중2');
    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkResults, setBulkResults] = useState<(LevelTestQuestion & { approved?: boolean })[]>([]);
    const [bulkError, setBulkError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuestions(getLevelTestQuestions());
        setResults(getLevelTestResults());
    }, []);

    const filtered = useMemo(() =>
        questions.filter(q => q.grade === gradeFilter).sort((a, b) => a.order - b.order),
        [questions, gradeFilter]
    );

    const handleSave = () => {
        if (!editQ || !editQ.content.trim() || editQ.options.some(o => !o.trim()) || !editQ.topic.trim()) {
            alert('문제 내용, 선택지 5개, 단원을 모두 입력해주세요.'); return;
        }
        let all = [...questions];
        const idx = all.findIndex(q => q.id === editQ.id);
        if (idx >= 0) all[idx] = editQ;
        else all.push(editQ);
        saveLevelTestQuestions(all); setQuestions(all);
        setEditQ(null); setShowForm(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm('이 문제를 삭제하시겠습니까?')) return;
        const all = questions.filter(q => q.id !== id);
        saveLevelTestQuestions(all); setQuestions(all);
    };

    const handleToggleActive = (id: string) => {
        const all = [...questions];
        const q = all.find(q => q.id === id);
        if (q) q.active = !q.active;
        saveLevelTestQuestions(all); setQuestions([...all]);
    };

    const openAdd = () => {
        const maxOrder = filtered.length > 0 ? Math.max(...filtered.map(q => q.order)) : 0;
        setEditQ({
            id: genId('ltq'), grade: gradeFilter, content: '', options: ['', '', '', '', ''],
            answer: 0, topic: '', difficulty: 'medium', order: maxOrder + 1, active: true,
        });
        setShowForm(true);
    };

    const openEdit = (q: LevelTestQuestion) => {
        setEditQ({ ...q, options: [...q.options] });
        setShowForm(true);
    };

    // ─── Bulk Import via Gemini OCR ───
    const handleBulkImport = async () => {
        if (!bulkFile) return;
        setBulkLoading(true); setBulkError(''); setBulkResults([]);

        try {
            const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
            if (!apiKey) { setBulkError('Gemini API 키가 설정되지 않았습니다. (.env 파일의 VITE_GEMINI_API_KEY)'); setBulkLoading(false); return; }

            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const mimeType = bulkFile.type || 'image/png';

                const prompt = `이 이미지/문서에서 수학 문제를 추출해주세요. 각 문제를 JSON 배열로 반환해주세요.
형식:
[
  {
    "content": "문제 내용 (LaTeX 수식은 $..$ 형태로)",
    "options": ["선택지1", "선택지2", "선택지3", "선택지4", "선택지5"],
    "answer": 0,
    "topic": "단원명",
    "difficulty": "medium"
  }
]

규칙:
- 수식은 반드시 LaTeX로 변환 ($x^2$, $\\frac{a}{b}$ 등)
- answer는 0-indexed (첫 번째 선택지가 정답이면 0)
- options는 반드시 5개
- 선택지가 4개면 "해당없음"을 추가
- difficulty는 easy/medium/hard 중 하나
- topic은 한국 수학 교과 단원명
- 도표나 그래프는 텍스트로 설명
- JSON만 반환, 다른 텍스트 없이`;

                const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { inlineData: { mimeType, data: base64 } },
                                { text: prompt }
                            ]
                        }]
                    })
                });

                if (!resp.ok) { setBulkError(`API 오류: ${resp.status}`); setBulkLoading(false); return; }

                const data = await resp.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                if (!jsonMatch) { setBulkError('문제를 인식하지 못했습니다. 더 선명한 이미지를 사용해주세요.'); setBulkLoading(false); return; }

                const parsed = JSON.parse(jsonMatch[0]);
                const maxOrder = questions.filter(q => q.grade === bulkGrade).length;
                const imported: (LevelTestQuestion & { approved?: boolean })[] = parsed.map((q: any, i: number) => ({
                    id: genId('ltq'),
                    grade: bulkGrade,
                    content: q.content || '',
                    options: (q.options || ['', '', '', '', '']).slice(0, 5),
                    answer: q.answer ?? 0,
                    topic: q.topic || '기타',
                    difficulty: q.difficulty || 'medium',
                    order: maxOrder + i + 1,
                    active: true,
                    approved: undefined,
                }));

                setBulkResults(imported);
                setBulkLoading(false);
            };
            reader.readAsDataURL(bulkFile);
        } catch (err: any) {
            setBulkError(err.message || '오류가 발생했습니다');
            setBulkLoading(false);
        }
    };

    const handleBulkApprove = (id: string, approved: boolean) => {
        setBulkResults(prev => prev.map(q => q.id === id ? { ...q, approved } : q));
    };

    const handleBulkSaveAll = () => {
        const toSave = bulkResults.filter(q => q.approved !== false);
        if (toSave.length === 0) { alert('저장할 문제가 없습니다.'); return; }
        const all = [...questions, ...toSave.map(({ approved, ...q }) => q)];
        saveLevelTestQuestions(all); setQuestions(all);
        setBulkResults([]); setBulkFile(null);
        setView('questions'); setGradeFilter(bulkGrade);
        alert(`${toSave.length}개 문제가 저장되었습니다!`);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" /> 레벨테스트 관리
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">학년별 문제 추가·수정·활성화 및 응시 결과를 관리합니다</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setView('questions')}
                        className={cn("px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors", view === 'questions' ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500")}>
                        <ClipboardList className="w-3.5 h-3.5 inline mr-1" />문제 관리
                    </button>
                    <button onClick={() => setView('bulk')}
                        className={cn("px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors", view === 'bulk' ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500")}>
                        <FileUp className="w-3.5 h-3.5 inline mr-1" />대량 가져오기
                    </button>
                    <button onClick={() => setView('results')}
                        className={cn("px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors", view === 'results' ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500")}>
                        <Users className="w-3.5 h-3.5 inline mr-1" />응시 결과 ({results.length})
                    </button>
                </div>
            </div>

            {/* Grade Tabs */}
            <div className="space-y-2">
                {GRADE_GROUPS.map(group => (
                    <div key={group.label} className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                            group.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                group.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                    'bg-rose-100 text-rose-600'
                        )}>{group.label}</span>
                        {group.grades.map(g => {
                            const cnt = questions.filter(q => q.grade === g).length;
                            const activeCnt = questions.filter(q => q.grade === g && q.active).length;
                            return (
                                <button key={g} onClick={() => setGradeFilter(g)}
                                    className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                        gradeFilter === g ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-200 text-slate-400 hover:border-purple-200"
                                    )}>
                                    {g}{cnt > 0 && <span className="text-[9px] font-normal ml-0.5">({activeCnt}/{cnt})</span>}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* ═══ Questions View ═══ */}
            {view === 'questions' && (
                <>
                    <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                        <Plus className="w-4 h-4" /> 문제 추가
                    </button>

                    <div className="space-y-2">
                        {filtered.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-sm">
                                <Brain className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                이 학년에 등록된 문제가 없습니다
                            </div>
                        ) : filtered.map((q) => (
                            <div key={q.id} className={cn("bg-white rounded-xl border p-4 transition-all",
                                q.active ? "border-slate-200" : "border-slate-100 opacity-50"
                            )}>
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 w-6 h-6 rounded flex items-center justify-center shrink-0">{q.order}</span>
                                    <div className="flex-1 min-w-0">
                                        <MathRenderer content={q.content} className="text-sm text-slate-800 mb-2" />
                                        {q.image_url && (
                                            <img src={q.image_url} alt="문제 이미지" className="max-w-[200px] max-h-[120px] rounded-lg border border-slate-200 mb-2 object-contain" />
                                        )}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {q.options.map((opt, oi) => (
                                                <span key={oi} className={cn("text-[11px] px-2 py-0.5 rounded-full border",
                                                    oi === q.answer ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-500"
                                                )}>
                                                    {oi + 1}. {opt.length > 20 ? opt.slice(0, 20) + '…' : opt} {oi === q.answer && '✓'}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{q.topic}</span>
                                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", DIFFICULTIES.find(d => d.key === q.difficulty)?.color)}>
                                                {DIFFICULTIES.find(d => d.key === q.difficulty)?.label}
                                            </span>
                                            {q.image_url && <ImageIcon className="w-3 h-3 text-slate-400" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => handleToggleActive(q.id)} title={q.active ? '비활성화' : '활성화'} className="p-1.5 hover:bg-slate-100 rounded-lg">
                                            {q.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-300" />}
                                        </button>
                                        <button onClick={() => openEdit(q)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit/Add Modal */}
                    {showForm && editQ && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowForm(false); setEditQ(null); }}>
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {questions.find(q => q.id === editQ.id) ? '문제 수정' : '문제 추가'}
                                    </h3>
                                    <button onClick={() => { setShowForm(false); setEditQ(null); }} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">학년 *</label>
                                            <select value={editQ.grade} onChange={e => setEditQ({ ...editQ, grade: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                                                {ALL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">난이도</label>
                                            <select value={editQ.difficulty} onChange={e => setEditQ({ ...editQ, difficulty: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                                                {DIFFICULTIES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">순서</label>
                                            <input type="number" value={editQ.order} onChange={e => setEditQ({ ...editQ, order: parseInt(e.target.value) || 1 })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">단원 (토픽) *</label>
                                        <input value={editQ.topic} onChange={e => setEditQ({ ...editQ, topic: e.target.value })}
                                            placeholder="예: 일차방정식, 이차함수" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">문제 내용 * <span className="text-slate-400">(LaTeX 수식 가능: $수식$)</span></label>
                                        <textarea value={editQ.content} onChange={e => setEditQ({ ...editQ, content: e.target.value })}
                                            placeholder="문제를 입력하세요. 수식은 $x^2 + 2x + 1$ 형태로 입력"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20" />
                                        {editQ.content && (
                                            <div className="mt-1 p-2 bg-slate-50 rounded-lg">
                                                <p className="text-[10px] text-slate-400 mb-1">미리보기:</p>
                                                <MathRenderer content={editQ.content} className="text-sm text-slate-800" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">
                                            <ImageIcon className="w-3.5 h-3.5 inline mr-1" />문제 이미지 (도표/수식)
                                        </label>
                                        <ImageUploader
                                            currentImageUrl={editQ.image_url || ''}
                                            onUpload={(result) => { if (result.success && result.url) setEditQ({ ...editQ, image_url: result.url }); }}
                                            onUrlChange={(url) => setEditQ({ ...editQ, image_url: url || undefined })}
                                            label="도표·수식 이미지 업로드"
                                            compact
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">선택지 (5개) * <span className="text-slate-400">정답 ✓ 클릭</span></label>
                                        <div className="space-y-2">
                                            {editQ.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <button onClick={() => setEditQ({ ...editQ, answer: i })}
                                                        className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                                            editQ.answer === i ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-slate-400 hover:border-emerald-300"
                                                        )}>{i + 1}</button>
                                                    <input value={opt}
                                                        onChange={e => { const opts = [...editQ.options]; opts[i] = e.target.value; setEditQ({ ...editQ, options: opts }); }}
                                                        placeholder={`선택지 ${i + 1}`}
                                                        className={cn("flex-1 px-3 py-2 border rounded-lg text-sm",
                                                            editQ.answer === i ? "border-emerald-300 bg-emerald-50" : "border-slate-300"
                                                        )} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={handleSave}
                                        className="w-full py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" /> 저장
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══ Bulk Import View ═══ */}
            {view === 'bulk' && (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-purple-800 mb-1 flex items-center gap-2">
                            <FileUp className="w-4 h-4" /> PDF / 이미지에서 문제 대량 가져오기
                        </h3>
                        <p className="text-xs text-purple-600 mb-4">수학 문제가 포함된 파일을 업로드하면 AI(Gemini)가 자동으로 문제를 추출합니다.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">파일 선택</label>
                                <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                                    onChange={e => setBulkFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">대상 학년</label>
                                <select value={bulkGrade} onChange={e => setBulkGrade(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                                    {ALL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        <button onClick={handleBulkImport} disabled={!bulkFile || bulkLoading}
                            className="px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                            {bulkLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> AI 분석 중...</> : <><Upload className="w-4 h-4" /> 문제 추출 시작</>}
                        </button>
                    </div>

                    {bulkError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{bulkError}</div>
                    )}

                    {bulkResults.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-800">추출된 문제 ({bulkResults.length}개)</p>
                                <button onClick={handleBulkSaveAll}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1">
                                    <Save className="w-4 h-4" /> 선택 문제 저장
                                </button>
                            </div>

                            {bulkResults.map((q, i) => (
                                <div key={q.id} className={cn("bg-white rounded-xl border p-4",
                                    q.approved === false ? "opacity-40 border-red-200" : "border-slate-200"
                                )}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-bold bg-purple-100 text-purple-600 w-6 h-6 rounded flex items-center justify-center shrink-0">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <MathRenderer content={q.content} className="text-sm text-slate-800 mb-2" />
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {q.options.map((opt, oi) => (
                                                    <span key={oi} className={cn("text-[11px] px-2 py-0.5 rounded-full border",
                                                        oi === q.answer ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold" : "bg-slate-50 border-slate-200 text-slate-500"
                                                    )}>
                                                        {oi + 1}. {opt} {oi === q.answer && '✓'}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{q.topic}</span>
                                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", DIFFICULTIES.find(d => d.key === q.difficulty)?.color)}>
                                                    {DIFFICULTIES.find(d => d.key === q.difficulty)?.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => handleBulkApprove(q.id, true)} title="승인"
                                                className={cn("p-1.5 rounded-lg", q.approved === true ? "bg-emerald-100 text-emerald-600" : "hover:bg-emerald-50 text-slate-400")}>
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleBulkApprove(q.id, false)} title="제외"
                                                className={cn("p-1.5 rounded-lg", q.approved === false ? "bg-red-100 text-red-600" : "hover:bg-red-50 text-slate-400")}>
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══ Results View ═══ */}
            {view === 'results' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500">
                        <span>이름</span><span>연락처</span><span>학년</span><span>점수</span><span>추천반</span><span>응시일</span>
                    </div>
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            아직 응시 결과가 없습니다
                        </div>
                    ) : results.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(r => (
                        <div key={r.id} className="px-4 py-3 border-t border-slate-100">
                            <div className="sm:hidden space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">{r.taker_name}</span>
                                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{r.recommended_class}</span>
                                </div>
                                <p className="text-xs text-slate-500">{r.grade} • {r.score}/{r.total}점 ({Math.round(r.score / r.total * 100)}%) • {r.phone || '-'}</p>
                                {r.weak_areas.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {r.weak_areas.map((a, i) => <span key={i} className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">{a}</span>)}
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <div className="hidden sm:grid grid-cols-6 gap-2 items-center">
                                <span className="text-sm font-medium text-slate-800">{r.taker_name}</span>
                                <span className="text-sm text-slate-500">{r.phone || '-'}</span>
                                <span className="text-sm text-slate-600">{r.grade}</span>
                                <span className="text-sm font-bold text-slate-800">{r.score}/{r.total} ({Math.round(r.score / r.total * 100)}%)</span>
                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium w-fit">{r.recommended_class}</span>
                                <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
