import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Brain, CheckCircle, ArrowRight, RotateCcw, Trophy, Phone, Loader2 } from 'lucide-react';
import { genId, saveLevelTestResults, type LevelTestResult } from '../data/academyData';
import { MathRenderer } from '../components/MathRenderer';

/* ─── Pre-built questions per grade ─── */
const LEVEL_TEST_QUESTIONS: Record<string, { content: string; options: string[]; answer: number; topic: string }[]> = {
    '중1': [
        { content: '다음 중 음수가 아닌 정수를 모두 고르면? ①−3 ②0 ③$\\frac{1}{2}$ ④5 ⑤−0.7', options: ['①,②', '②,④', '②,③,④', '①,②,④', '②,④,⑤'], answer: 1, topic: '정수와 유리수' },
        { content: '$(-3) \\times (-2) + 4 \\div (-2)$의 값은?', options: ['4', '8', '-4', '2', '-8'], answer: 0, topic: '정수의 사칙연산' },
        { content: '일차방정식 $2x - 5 = 3$의 해는?', options: ['$x=1$', '$x=2$', '$x=3$', '$x=4$', '$x=-1$'], answer: 3, topic: '일차방정식' },
        { content: '좌표평면에서 점 $(-2, 3)$은 제 몇 사분면 위의 점인가?', options: ['제1사분면', '제2사분면', '제3사분면', '제4사분면', '축 위의 점'], answer: 1, topic: '좌표평면' },
        { content: '정비례 관계 $y = 3x$에서 $x = -2$일 때 $y$의 값은?', options: ['6', '-6', '1', '-1', '5'], answer: 1, topic: '정비례와 반비례' },
    ],
    '중2': [
        { content: '다항식 $(2x+3)(x-1)$을 전개하면?', options: ['$2x^2+x-3$', '$2x^2-x-3$', '$2x^2+5x-3$', '$2x^2-2x-3$', '$2x^2+x+3$'], answer: 0, topic: '다항식의 곱셈' },
        { content: '연립방정식 $\\begin{cases} x+y=5 \\\\ 2x-y=1 \\end{cases}$의 해는?', options: ['$x=1, y=4$', '$x=2, y=3$', '$x=3, y=2$', '$x=4, y=1$', '$x=2, y=4$'], answer: 1, topic: '연립방정식' },
        { content: '일차함수 $y = -2x + 5$의 $x$절편은?', options: ['$5$', '$-5$', '$\\frac{5}{2}$', '$-\\frac{5}{2}$', '$2$'], answer: 2, topic: '일차함수' },
        { content: '이등변삼각형의 꼭지각이 $40°$일 때, 밑각의 크기는?', options: ['$60°$', '$70°$', '$80°$', '$50°$', '$40°$'], answer: 1, topic: '삼각형의 성질' },
        { content: '확률에서 주사위를 던져 3의 배수가 나올 확률은?', options: ['$\\frac{1}{6}$', '$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{2}{3}$', '$\\frac{1}{4}$'], answer: 1, topic: '확률' },
    ],
    '중3': [
        { content: '$\\sqrt{48} - 2\\sqrt{3}$의 값은?', options: ['$\\sqrt{3}$', '$2\\sqrt{3}$', '$3\\sqrt{3}$', '$4\\sqrt{3}$', '$6\\sqrt{3}$'], answer: 1, topic: '제곱근' },
        { content: '이차방정식 $x^2 - 5x + 6 = 0$의 두 근의 합은?', options: ['$3$', '$4$', '$5$', '$6$', '$-5$'], answer: 2, topic: '이차방정식' },
        { content: '이차함수 $y = x^2 - 4x + 3$의 꼭짓점의 좌표는?', options: ['$(2, -1)$', '$(2, 1)$', '$(-2, -1)$', '$(1, 0)$', '$(3, 0)$'], answer: 0, topic: '이차함수' },
        { content: '삼각형 ABC에서 $\\sin 30°$의 값은?', options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{2}}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$1$', '$\\frac{\\sqrt{3}}{3}$'], answer: 0, topic: '삼각비' },
        { content: '원에 내접하는 사각형의 대각의 합은?', options: ['$90°$', '$180°$', '$270°$', '$360°$', '알 수 없다'], answer: 1, topic: '원의 성질' },
    ],
};

export function LevelTest() {
    const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [grade, setGrade] = useState('중2');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [result, setResult] = useState<LevelTestResult | null>(null);

    const questions = LEVEL_TEST_QUESTIONS[grade] || LEVEL_TEST_QUESTIONS['중2'];

    const startTest = () => {
        if (!name.trim()) { alert('이름을 입력해주세요.'); return; }
        setAnswers(new Array(questions.length).fill(null));
        setCurrentQ(0);
        setStep('test');
    };

    const selectAnswer = (idx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = idx;
        setAnswers(newAnswers);
    };

    const finishTest = () => {
        let score = 0;
        const weakAreas: string[] = [];
        questions.forEach((q, i) => {
            if (answers[i] === q.answer) score++;
            else weakAreas.push(q.topic);
        });
        const total = questions.length;
        const pct = Math.round((score / total) * 100);
        const recommended = pct >= 80 ? '심화반' : pct >= 60 ? '기본반' : '기초보충반';
        const res: LevelTestResult = {
            id: genId('lt'), taker_name: name, phone, grade,
            score, total, weak_areas: weakAreas, recommended_class: recommended,
            created_at: new Date().toISOString(),
        };
        const all = JSON.parse(localStorage.getItem('academy_level_tests') || '[]');
        all.push(res); localStorage.setItem('academy_level_tests', JSON.stringify(all));
        setResult(res); setStep('result');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            {step === 'intro' && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">무료 수학 레벨 테스트</h2>
                    <p className="text-sm text-slate-500 mb-6">5문제로 현재 수학 실력을 진단하고<br />맞춤 학습 방향을 제안받으세요!</p>

                    <div className="space-y-3 text-left">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">이름 *</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="학생 이름" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">연락처 (선택)</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="010-0000-0000" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">학년 선택 *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['중1', '중2', '중3'].map(g => (
                                    <button key={g} onClick={() => setGrade(g)}
                                        className={cn("py-2.5 rounded-lg text-sm font-bold transition-all border-2",
                                            grade === g ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-indigo-200"
                                        )}>{g}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={startTest}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                        테스트 시작 <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-slate-400 mt-3">약 5분 소요 • 비용 없음 • 결과 즉시 확인</p>
                </div>
            )}

            {step === 'test' && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-8">
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-indigo-600">{grade} 레벨 테스트</span>
                        <span className="text-xs text-slate-500">{currentQ + 1} / {questions.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6">
                        <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                    </div>

                    {/* Question */}
                    <div className="mb-6">
                        <p className="text-xs text-slate-400 mb-2">문제 {currentQ + 1}</p>
                        <MathRenderer content={questions[currentQ].content} className="text-base text-slate-800 font-medium leading-relaxed" />
                    </div>

                    {/* Options */}
                    <div className="space-y-2 mb-6">
                        {questions[currentQ].options.map((opt, i) => (
                            <button key={i} onClick={() => selectAnswer(i)}
                                className={cn("w-full text-left px-4 py-3 rounded-xl border-2 transition-all",
                                    answers[currentQ] === i
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                                        : "border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                                )}>
                                <MathRenderer content={`${i + 1}. ${opt}`} className="text-sm" />
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                            className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30">이전</button>
                        {currentQ < questions.length - 1 ? (
                            <button onClick={() => setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === null}
                                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-30 flex items-center gap-1">
                                다음 <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <button onClick={finishTest} disabled={answers.some(a => a === null)}
                                className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-30 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> 결과 확인
                            </button>
                        )}
                    </div>
                </div>
            )}

            {step === 'result' && result && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{result.taker_name}님의 진단 결과</h2>
                    <p className="text-sm text-slate-500 mb-6">{result.grade} 수학 레벨 테스트</p>

                    {/* Score */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                        <p className="text-4xl font-black text-indigo-600">{Math.round((result.score / result.total) * 100)}점</p>
                        <p className="text-sm text-slate-500 mt-1">{result.score} / {result.total} 정답</p>
                    </div>

                    {/* Weak areas */}
                    {result.weak_areas.length > 0 && (
                        <div className="text-left mb-6">
                            <p className="text-xs font-bold text-slate-600 mb-2">📌 보강이 필요한 영역</p>
                            <div className="flex flex-wrap gap-1.5">
                                {result.weak_areas.map((area, i) => (
                                    <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">{area}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendation */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm font-bold text-emerald-800">🎯 추천 반: {result.recommended_class}</p>
                        <p className="text-xs text-emerald-600 mt-1">
                            {result.recommended_class === '심화반' ? '우수한 실력! 심화 문제로 한 단계 더 성장하세요.' :
                                result.recommended_class === '기본반' ? '기본기가 탄탄합니다. 약점 부분을 보강하면 더 좋을 거예요!' :
                                    '기초부터 차근차근 다져나가면 반드시 성적이 오릅니다!'}
                        </p>
                    </div>

                    {/* CTA */}
                    <a href="/jj/contact" className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all">
                        <Phone className="w-4 h-4 inline mr-2" />무료 상담 신청하기
                    </a>
                    <button onClick={() => { setStep('intro'); setResult(null); setAnswers([]); }}
                        className="mt-3 text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto">
                        <RotateCcw className="w-3.5 h-3.5" /> 다시 테스트
                    </button>
                </div>
            )}
        </div>
    );
}
