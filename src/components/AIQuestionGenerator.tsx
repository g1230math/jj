import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import {
    Sparkles, Send, Loader2, CheckCircle, XCircle, Eye, Plus,
    AlertTriangle, Copy, Settings2, RefreshCw
} from 'lucide-react';
import {
    addQuestion, genId, type Question, type QuestionType, type Difficulty,
    QUESTION_TYPE_LABELS, DIFFICULTY_LABELS, MC_LABELS,
    SCHOOL_LEVEL_GRADES, TEXTBOOK_PRESETS, SCHOOL_LIST
} from '../data/studyData';
import { MathRenderer, MathPreview } from './MathRenderer';

const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

interface GeneratedQuestion {
    content: string;
    options?: { label: string; text: string }[];
    correct_answer: string;
    explanation: string;
    difficulty: Difficulty;
    sub_topic: string;
    approved: boolean | null; // null = pending
}

async function callGemini(prompt: string): Promise<string> {
    // API 키는 vite.config.ts의 define에서 빌드 시 주입됨
    // .env 파일은 .gitignore에 포함되어 절대 git에 올라가지 않음
    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY ?? '' : '';

    if (!apiKey || apiKey === 'undefined') {
        throw new Error(
            'GEMINI_API_KEY가 설정되지 않았습니다.\n' +
            '.env 파일에 GEMINI_API_KEY=your_key를 추가한 후 서버를 재시작하세요.'
        );
    }

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 4096,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        );

        if (res.status === 429) {
            // 무료 요금제 속도 제한 — 잠시 후 재시도
            if (attempt < maxRetries - 1) {
                const waitMs = (attempt + 1) * 5000; // 5초, 10초, 15초...
                await new Promise(r => setTimeout(r, waitMs));
                continue;
            }
            throw new Error('API 요청 한도 초과 — 잠시 후 다시 시도해주세요. (무료 요금제는 분당 요청 수가 제한됩니다)');
        }

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini API 오류 (${res.status}): ${err}`);
        }

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    throw new Error('AI 문제 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
}

function buildPrompt(config: {
    type: QuestionType;
    school_level: string;
    grade: number;
    chapter: string;
    sub_topic: string;
    difficulty: Difficulty;
    count: number;
    seedQuestion?: string;
}): string {
    const diffLabel = config.difficulty === 1 ? '쉬운' : config.difficulty === 2 ? '보통' : '어려운';
    const typeLabel = QUESTION_TYPE_LABELS[config.type];

    let seedPart = '';
    if (config.seedQuestion) {
        seedPart = `\n\n다음 문제를 참고하여 유사한 유형의 새로운 문제를 만들어주세요:\n${config.seedQuestion}`;
    }

    return `당신은 한국 수학 교육 전문가입니다. ${config.school_level} ${config.grade}학년 수학 문제를 생성해주세요.

조건:
- 단원: ${config.chapter || '자유'}
- 세부 유형: ${config.sub_topic || '일반'}
- 문제 유형: ${typeLabel}
- 난이도: ${diffLabel} (${config.difficulty}/3)
- 생성 개수: ${config.count}개
${seedPart}

JSON 배열로 응답해주세요. 수학 수식은 LaTeX 문법(예: $x^2 + 3x - 5 = 0$)을 사용하세요.

${config.type === 'mc' ? `
각 문제의 형식:
{
  "content": "문제 내용 (LaTeX 지원)",
  "options": [
    {"label": "①", "text": "보기1"},
    {"label": "②", "text": "보기2"},
    {"label": "③", "text": "보기3"},
    {"label": "④", "text": "보기4"},
    {"label": "⑤", "text": "보기5"}
  ],
  "correct_answer": "1",
  "explanation": "풀이 해설 (LaTeX 지원)",
  "difficulty": ${config.difficulty},
  "sub_topic": "세부 유형명"
}` : config.type === 'tf' ? `
각 문제의 형식:
{
  "content": "문제 내용 (LaTeX 지원)",
  "correct_answer": "O" 또는 "X",
  "explanation": "풀이 해설 (LaTeX 지원)",
  "difficulty": ${config.difficulty},
  "sub_topic": "세부 유형명"
}` : `
각 문제의 형식:
{
  "content": "문제 내용 (LaTeX 지원)",
  "correct_answer": "정답",
  "explanation": "풀이 해설 (LaTeX 지원)",
  "difficulty": ${config.difficulty},
  "sub_topic": "세부 유형명"
}`}`;
}

export function AIQuestionGenerator() {
    const [config, setConfig] = useState({
        type: 'mc' as QuestionType,
        school_level: '중등',
        grade: 2,
        school: '전체',
        chapter: '',
        sub_topic: '',
        textbook: '',
        difficulty: 2 as Difficulty,
        count: 3,
        seedQuestion: '',
    });

    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);
    const [saving, setSaving] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const handleGenerate = async () => {
        setError('');
        setGenerating(true);
        setGenerated([]);

        try {
            const prompt = buildPrompt(config);
            const raw = await callGemini(prompt);

            let parsed: any[];
            try {
                parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) parsed = [parsed];
            } catch {
                // Try to extract JSON array from response
                const match = raw.match(/\[[\s\S]*\]/);
                if (match) {
                    parsed = JSON.parse(match[0]);
                } else {
                    throw new Error('AI 응답을 파싱할 수 없습니다.');
                }
            }

            const results: GeneratedQuestion[] = parsed.map((item: any) => ({
                content: item.content || '',
                options: item.options,
                correct_answer: String(item.correct_answer || ''),
                explanation: item.explanation || '',
                difficulty: item.difficulty || config.difficulty,
                sub_topic: item.sub_topic || config.sub_topic,
                approved: null,
            }));

            setGenerated(results);
        } catch (err: any) {
            setError(err.message || 'AI 문제 생성에 실패했습니다.');
        } finally {
            setGenerating(false);
        }
    };

    const approveQuestion = (idx: number) => {
        setGenerated(prev => prev.map((q, i) => i === idx ? { ...q, approved: true } : q));
    };

    const rejectQuestion = (idx: number) => {
        setGenerated(prev => prev.map((q, i) => i === idx ? { ...q, approved: false } : q));
    };

    const saveApproved = async () => {
        setSaving(true);
        const approved = generated.filter(q => q.approved === true);

        for (const gq of approved) {
            const question: Question = {
                id: genId('q'),
                type: config.type,
                school: config.school,
                grade: config.grade,
                school_level: config.school_level as '초등' | '중등' | '고등',
                textbook: config.textbook,
                chapter: config.chapter,
                sub_topic: gq.sub_topic || config.sub_topic,
                difficulty: gq.difficulty,
                content: gq.content,
                options: gq.options,
                correct_answer: gq.correct_answer,
                explanation: gq.explanation,
                source: 'ai_generated',
                tags: ['AI생성'],
                created_by: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            await addQuestion(question);
        }

        setSaving(false);
        alert(`${approved.length}개 문제가 문제 은행에 저장되었습니다.`);
        setGenerated([]);
    };

    const approvedCount = generated.filter(q => q.approved === true).length;
    const rejectedCount = generated.filter(q => q.approved === false).length;
    const pendingCount = generated.filter(q => q.approved === null).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    AI 문제 생성
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Gemini AI를 활용하여 수학 문제를 자동 생성합니다</p>
            </div>

            {/* Config Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">생성 설정</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className={labelCls}>문제 유형</label>
                        <select className={inputCls} value={config.type} onChange={e => setConfig({ ...config, type: e.target.value as QuestionType })}>
                            {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>학년군</label>
                        <select className={inputCls} value={config.school_level} onChange={e => setConfig({ ...config, school_level: e.target.value, grade: 1 })}>
                            <option value="초등">초등</option>
                            <option value="중등">중등</option>
                            <option value="고등">고등</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>학년</label>
                        <select className={inputCls} value={config.grade} onChange={e => setConfig({ ...config, grade: Number(e.target.value) })}>
                            {SCHOOL_LEVEL_GRADES[config.school_level]?.map(g => (
                                <option key={g} value={g}>{g}학년</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>난이도</label>
                        <select className={inputCls} value={config.difficulty} onChange={e => setConfig({ ...config, difficulty: Number(e.target.value) as Difficulty })}>
                            {([1, 2, 3] as Difficulty[]).map(d => (
                                <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className={labelCls}>대상 학교</label>
                        <select className={inputCls} value={config.school} onChange={e => setConfig({ ...config, school: e.target.value })}>
                            {SCHOOL_LIST.map(s => <option key={s} value={s}>{s === '전체' ? '공통' : s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>교과서</label>
                        <input className={inputCls} list="ai-textbook-list" value={config.textbook} onChange={e => setConfig({ ...config, textbook: e.target.value })} placeholder="선택 또는 입력" />
                        <datalist id="ai-textbook-list">
                            {TEXTBOOK_PRESETS.filter(t => t !== '직접입력').map(t => <option key={t} value={t} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className={labelCls}>단원</label>
                        <input className={inputCls} value={config.chapter} onChange={e => setConfig({ ...config, chapter: e.target.value })} placeholder="예: 일차함수" />
                    </div>
                    <div>
                        <label className={labelCls}>생성 개수</label>
                        <select className={inputCls} value={config.count} onChange={e => setConfig({ ...config, count: Number(e.target.value) })}>
                            {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n}개</option>)}
                        </select>
                    </div>
                </div>

                {/* Seed question (optional) */}
                <div>
                    <label className={labelCls}>참고 문제 (선택 — 유사 문제 생성 시)</label>
                    <textarea
                        className={inputCls + " h-20 font-mono"}
                        value={config.seedQuestion}
                        onChange={e => setConfig({ ...config, seedQuestion: e.target.value })}
                        placeholder="기존 문제를 입력하면 유사한 유형으로 새 문제를 생성합니다 (LaTeX 지원)"
                    />
                    {config.seedQuestion && <MathPreview content={config.seedQuestion} label="참고 문제 미리보기" />}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all",
                        generating
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm"
                    )}
                >
                    {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> AI 생성 중...</>
                    ) : (
                        <><Sparkles className="w-4 h-4" /> 문제 생성하기</>
                    )}
                </button>

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>

            {/* Generated Results */}
            {generated.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-600" />
                            생성된 문제 ({generated.length}개)
                        </h3>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-emerald-600 font-medium">✓ 승인: {approvedCount}</span>
                            <span className="text-red-500 font-medium">✗ 거부: {rejectedCount}</span>
                            <span className="text-slate-500">대기: {pendingCount}</span>
                        </div>
                    </div>

                    {/* Bulk actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setGenerated(prev => prev.map(q => ({ ...q, approved: true })))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <CheckCircle className="w-3 h-3" /> 전체 승인
                        </button>
                        <button
                            onClick={() => setGenerated(prev => prev.map(q => ({ ...q, approved: null })))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" /> 초기화
                        </button>
                    </div>

                    {generated.map((gq, i) => (
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
                                                "bg-violet-100 text-violet-700"
                                    )}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
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
                                        <button
                                            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                                            className="text-[10px] text-indigo-600 mt-2 hover:underline"
                                        >
                                            {expandedIdx === i ? '해설 숨기기' : '해설 보기'}
                                        </button>
                                        {expandedIdx === i && gq.explanation && (
                                            <div className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                <MathRenderer content={gq.explanation} className="text-xs text-slate-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Approve / Reject buttons */}
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
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            승인된 {approvedCount}개 문제 저장
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
