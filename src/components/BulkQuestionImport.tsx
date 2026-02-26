import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
import {
    Upload, Loader2, CheckCircle, XCircle, X, Sparkles, RefreshCw,
    Plus, FileText as FileTextIcon, AlertTriangle, Eye, Save, Image as ImageIcon
} from 'lucide-react';
import {
    addQuestion, genId,
    type Question, type QuestionType, type Difficulty,
    QUESTION_TYPE_LABELS, DIFFICULTY_LABELS, MC_LABELS,
    SCHOOL_LEVEL_GRADES, TEXTBOOK_PRESETS, SCHOOL_LIST
} from '../data/studyData';
import { MathRenderer } from './MathRenderer';
import { uploadBase64ToImgBB, isImgBBConfigured } from '../lib/imgbb';

const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

interface BulkQuestionImportProps {
    onClose: () => void;
    onImportComplete: () => void;
}

interface ExtractedQuestion {
    content: string;
    content_image_base64?: string;
    content_image_url?: string;
    options?: { label: string; text: string }[];
    correct_answer: string;
    explanation: string;
    difficulty: Difficulty;
    chapter: string;
    sub_topic: string;
    type: QuestionType;
    approved: boolean | null;
}

/* ─── Image utilities ─── */
interface ImageData { base64: string; mimeType: string; }

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
    });
}

async function fileToImageDataList(file: File): Promise<ImageData[]> {
    if (file.type === 'application/pdf') {
        const b64 = await fileToBase64(file);
        return [{ base64: b64, mimeType: 'application/pdf' }];
    }
    const b64 = await fileToBase64(file);
    return [{ base64: b64, mimeType: file.type }];
}

/* ─── Gemini call ─── */
async function callGeminiForOCR(images: ImageData[], settings: {
    school_level: string; grade: number; difficulty: Difficulty;
}): Promise<string> {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'undefined') {
        throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
    }

    const parts: any[] = [];
    for (const img of images) {
        parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
    }

    const prompt = `당신은 수학 문제 OCR 전문가입니다. 첨부된 이미지/PDF에서 수학 문제를 추출해주세요.

규칙:
1. 각 문제를 개별 JSON 객체로 만들어 배열로 반환
2. 수식은 반드시 LaTeX 형식 ($..$ 인라인, $$..$$블록)으로 변환
3. 객관식 보기가 있으면 options 배열에 label(①②③④⑤)과 text 포함
4. 정답은 correct_answer에 (객관식: "1"~"5", 단답: 답 텍스트)
5. 해설이 있으면 explanation에 포함 (없으면 빈 문자열)
6. 문제 유형: "mc"(객관식), "short"(주관식/단답), "tf"(O/X)
7. 도형/그래프 설명: 텍스트로 표현할 수 없는 도형이 있으면 content에 [그림: 설명] 형태로 표시
8. 난이도: ${settings.difficulty} (1=하, 2=중, 3=상)
9. 학년: ${settings.school_level} ${settings.grade}학년 수준

JSON 형식:
[{
  "content": "문제 본문 (LaTeX 수식 포함)",
  "type": "mc" | "short" | "tf",
  "options": [{"label":"①","text":"보기1"}, ...] (객관식만),
  "correct_answer": "정답",
  "explanation": "해설",
  "difficulty": ${settings.difficulty},
  "chapter": "단원명 (추정)",
  "sub_topic": "세부유형 (추정)"
}]

주의:
- 이미지에 있는 모든 문제를 빠짐없이 추출하세요
- 수식 표현이 정확해야 합니다 (분수: \\frac{}{}, 제곱: ^{}, 루트: \\sqrt{})
- 그래프나 도표가 포함된 문제는 가능한 한 텍스트로 설명하되, 복잡한 도형은 [그림] 표기
- JSON만 반환하세요 (다른 텍스트 없이)`;

    parts.push({ text: prompt });

    const model = 'gemini-2.0-flash-lite';
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 16384,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        );

        if (res.status === 429) {
            if (attempt < maxRetries - 1) {
                await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
                continue;
            }
            throw new Error('API 요청 한도 초과 — 잠시 후 다시 시도해주세요.');
        }

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini API 오류 (${res.status}): ${err}`);
        }

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    throw new Error('문제 추출에 실패했습니다.');
}

export function BulkQuestionImport({ onClose, onImportComplete }: BulkQuestionImportProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [config, setConfig] = useState({
        school_level: '중등',
        grade: 2,
        school: '전체',
        difficulty: 2 as Difficulty,
    });

    const [extracting, setExtracting] = useState(false);
    const [error, setError] = useState('');
    const [extracted, setExtracted] = useState<ExtractedQuestion[]>([]);
    const [saving, setSaving] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const handleFileSelect = useCallback((fileList: FileList | null) => {
        if (!fileList) return;
        const arr = Array.from(fileList).filter(f =>
            f.type.startsWith('image/') || f.type === 'application/pdf'
        );
        if (arr.length === 0) {
            setError('이미지(PNG, JPG, WEBP) 또는 PDF 파일만 업로드 가능합니다.');
            return;
        }
        setFiles(prev => [...prev, ...arr]);
        arr.forEach(f => {
            if (f.type.startsWith('image/')) {
                setFilePreviews(prev => [...prev, URL.createObjectURL(f)]);
            } else {
                setFilePreviews(prev => [...prev, '']);
            }
        });
    }, []);

    const removeFile = (idx: number) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
        setFilePreviews(prev => {
            const url = prev[idx];
            if (url) URL.revokeObjectURL(url);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    const handleExtract = async () => {
        if (files.length === 0) {
            setError('파일을 업로드해주세요.');
            return;
        }
        setError('');
        setExtracting(true);
        setExtracted([]);

        try {
            const allImages: ImageData[] = [];
            for (const file of files) {
                const imgs = await fileToImageDataList(file);
                allImages.push(...imgs);
            }

            const raw = await callGeminiForOCR(allImages, {
                school_level: config.school_level,
                grade: config.grade,
                difficulty: config.difficulty,
            });

            let parsed: any[];
            try {
                parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) parsed = [parsed];
            } catch {
                const match = raw.match(/\[[\s\S]*\]/);
                if (match) {
                    parsed = JSON.parse(match[0]);
                } else {
                    throw new Error('AI 응답을 파싱할 수 없습니다.');
                }
            }

            const results: ExtractedQuestion[] = parsed.map((item: any) => ({
                content: item.content || '',
                type: (item.type || 'mc') as QuestionType,
                options: item.options,
                correct_answer: String(item.correct_answer || ''),
                explanation: item.explanation || '',
                difficulty: item.difficulty || config.difficulty,
                chapter: item.chapter || '',
                sub_topic: item.sub_topic || '',
                approved: null,
            }));

            setExtracted(results);
        } catch (err: any) {
            setError(err.message || '문제 추출에 실패했습니다.');
        } finally {
            setExtracting(false);
        }
    };

    const approveQuestion = (idx: number) => {
        setExtracted(prev => prev.map((q, i) => i === idx ? { ...q, approved: true } : q));
    };

    const rejectQuestion = (idx: number) => {
        setExtracted(prev => prev.map((q, i) => i === idx ? { ...q, approved: false } : q));
    };

    const saveApproved = async () => {
        setSaving(true);
        const approved = extracted.filter(q => q.approved === true);

        for (const gq of approved) {
            const question: Question = {
                id: genId('q'),
                type: gq.type,
                school: config.school,
                grade: config.grade,
                school_level: config.school_level as '초등' | '중등' | '고등',
                textbook: '',
                chapter: gq.chapter,
                sub_topic: gq.sub_topic,
                difficulty: gq.difficulty,
                content: gq.content,
                content_image_url: gq.content_image_url,
                options: gq.options,
                correct_answer: gq.correct_answer,
                explanation: gq.explanation,
                source: 'ai_generated',
                tags: ['대량가져오기'],
                created_by: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            await addQuestion(question);
        }

        setSaving(false);
        alert(`${approved.length}개 문제가 문제 은행에 저장되었습니다.`);
        onImportComplete();
    };

    const approvedCount = extracted.filter(q => q.approved === true).length;
    const rejectedCount = extracted.filter(q => q.approved === false).length;
    const pendingCount = extracted.filter(q => q.approved === null).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-amber-500" />
                            대량 문제 가져오기
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">PDF/이미지 파일에서 AI가 문제를 자동 추출합니다</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Step 1: File Upload */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            파일 업로드
                        </h4>

                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                                isDragging
                                    ? 'border-amber-400 bg-amber-50'
                                    : 'border-slate-300 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                            )}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={e => { handleFileSelect(e.target.files); e.target.value = ''; }}
                                className="hidden"
                            />
                            <Upload className={cn('w-8 h-8 mx-auto mb-2', isDragging ? 'text-amber-500' : 'text-slate-400')} />
                            <p className="text-sm font-medium text-slate-600">
                                {isDragging ? '여기에 놓으세요!' : '클릭하거나 파일을 드래그하세요'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                                시험지 이미지 (PNG, JPG) 또는 PDF • 여러 파일 가능
                            </p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-3">
                                <p className="text-[10px] font-semibold text-slate-500 mb-2">📎 업로드된 파일 ({files.length}개)</p>
                                <div className="flex flex-wrap gap-2">
                                    {files.map((f, i) => (
                                        <div key={i} className="relative group">
                                            {filePreviews[i] ? (
                                                <img src={filePreviews[i]} alt={f.name} className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg border border-slate-200 bg-red-50 flex flex-col items-center justify-center shadow-sm">
                                                    <FileTextIcon className="w-5 h-5 text-red-500 mb-1" />
                                                    <span className="text-[8px] text-red-600 font-bold">PDF</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            <p className="text-[8px] text-slate-500 truncate w-20 mt-0.5 text-center">{f.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Settings */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            기본 설정 (일괄 적용)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className={labelCls}>학년군</label>
                                <select className={inputCls} value={config.school_level}
                                    onChange={e => setConfig({ ...config, school_level: e.target.value, grade: 1 })}>
                                    <option value="초등">초등</option>
                                    <option value="중등">중등</option>
                                    <option value="고등">고등</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>학년</label>
                                <select className={inputCls} value={config.grade}
                                    onChange={e => setConfig({ ...config, grade: Number(e.target.value) })}>
                                    {SCHOOL_LEVEL_GRADES[config.school_level]?.map(g => (
                                        <option key={g} value={g}>{g}학년</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>대상 학교</label>
                                <select className={inputCls} value={config.school}
                                    onChange={e => setConfig({ ...config, school: e.target.value })}>
                                    {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '공통' : s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>기본 난이도</label>
                                <select className={inputCls} value={config.difficulty}
                                    onChange={e => setConfig({ ...config, difficulty: Number(e.target.value) as Difficulty })}>
                                    {([1, 2, 3] as Difficulty[]).map(d => (
                                        <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Extract button */}
                    <button
                        onClick={handleExtract}
                        disabled={extracting || files.length === 0}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all",
                            extracting || files.length === 0
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm"
                        )}
                    >
                        {extracting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> AI 문제 추출 중... (시간이 걸릴 수 있습니다)</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> {files.length}개 파일에서 문제 추출하기</>
                        )}
                    </button>

                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Step 3: Results */}
                    {extracted.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                    추출된 문제 ({extracted.length}개)
                                </h4>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-emerald-600 font-medium">✓ 승인: {approvedCount}</span>
                                    <span className="text-red-500 font-medium">✗ 거부: {rejectedCount}</span>
                                    <span className="text-slate-500">대기: {pendingCount}</span>
                                </div>
                            </div>

                            {/* Bulk actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setExtracted(prev => prev.map(q => ({ ...q, approved: true })))}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                    <CheckCircle className="w-3 h-3" /> 전체 승인
                                </button>
                                <button
                                    onClick={() => setExtracted(prev => prev.map(q => ({ ...q, approved: null })))}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <RefreshCw className="w-3 h-3" /> 초기화
                                </button>
                            </div>

                            {extracted.map((gq, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "bg-white rounded-xl border-2 overflow-hidden transition-colors",
                                        gq.approved === true ? "border-emerald-300 bg-emerald-50/20" :
                                            gq.approved === false ? "border-red-200 opacity-50" :
                                                "border-slate-200"
                                    )}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <span className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                                gq.approved === true ? "bg-emerald-100 text-emerald-700" :
                                                    gq.approved === false ? "bg-red-100 text-red-600" :
                                                        "bg-amber-100 text-amber-700"
                                            )}>
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                                                        {QUESTION_TYPE_LABELS[gq.type] || gq.type}
                                                    </span>
                                                    {gq.chapter && (
                                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                                                            {gq.chapter}
                                                        </span>
                                                    )}
                                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                                                        gq.difficulty === 3 ? "bg-red-50 text-red-600" : gq.difficulty === 2 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                                                    )}>
                                                        {DIFFICULTY_LABELS[gq.difficulty] || '중'}
                                                    </span>
                                                </div>

                                                <MathRenderer content={gq.content} className="text-sm text-slate-800 leading-relaxed" />

                                                {/* MC Options */}
                                                {gq.options && (
                                                    <div className="mt-2 space-y-1">
                                                        {gq.options.map((opt, j) => (
                                                            <div key={j} className={cn(
                                                                "flex items-center gap-2 text-xs px-2 py-1 rounded",
                                                                String(j + 1) === gq.correct_answer ? "bg-emerald-50 text-emerald-800 font-medium" : "text-slate-600"
                                                            )}>
                                                                <span className="font-bold">{opt.label}</span>
                                                                <MathRenderer content={opt.text} className="inline" />
                                                                {String(j + 1) === gq.correct_answer && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Non-MC answer */}
                                                {!gq.options && (
                                                    <p className="text-xs mt-1 text-emerald-700 font-medium">정답: <MathRenderer content={gq.correct_answer} className="inline" /></p>
                                                )}

                                                {/* Explanation toggle */}
                                                {gq.explanation && (
                                                    <>
                                                        <button
                                                            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                                                            className="text-[10px] text-indigo-600 mt-2 hover:underline"
                                                        >
                                                            {expandedIdx === i ? '해설 숨기기' : '💡 해설 보기'}
                                                        </button>
                                                        {expandedIdx === i && (
                                                            <div className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                                <MathRenderer content={gq.explanation} className="text-xs text-slate-700" />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Approve / Reject */}
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => approveQuestion(i)}
                                                    className={cn("p-1.5 rounded-lg transition-colors",
                                                        gq.approved === true ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"
                                                    )}
                                                    title="승인"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => rejectQuestion(i)}
                                                    className={cn("p-1.5 rounded-lg transition-colors",
                                                        gq.approved === false ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600"
                                                    )}
                                                    title="거부"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Save approved */}
                            {approvedCount > 0 && (
                                <button
                                    onClick={saveApproved}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    승인된 {approvedCount}개 문제 저장
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
