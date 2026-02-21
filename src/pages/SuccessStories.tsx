import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, GraduationCap, Star, TrendingUp, ChevronDown, ChevronUp, Quote, Sparkles, Award, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';

type YearFilter = '전체' | '2025' | '2024' | '2023';
type CategoryFilter = '전체' | '서울권' | '경기권' | '의약학' | '교대';

interface SuccessStory {
    id: string;
    name: string;
    school: string;
    department: string;
    admissionType: string;
    region: '서울권' | '경기권' | '의약학' | '교대';
    year: '2025' | '2024' | '2023';
    previousSchool: string;
    quote: string;
    gradeChange?: { from: number; to: number };
    highlight?: boolean;
    avatar: string;
    color: string;
}

const successStories: SuccessStory[] = [
    // 2025
    {
        id: 's1', name: '김○○', school: '서울대학교', department: '수학교육과',
        admissionType: '수시 학생부종합', region: '서울권', year: '2025', previousSchool: '진접고',
        quote: '수학에 대한 자신감이 부족했지만, G1230에서 개념부터 탄탄히 다지면서 수능 수학 1등급을 받을 수 있었습니다. 선생님들의 세심한 관리 덕분입니다.',
        gradeChange: { from: 4, to: 1 }, highlight: true,
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success1&backgroundColor=c0aede', color: 'from-indigo-600 to-blue-600',
    },
    {
        id: 's2', name: '이○○', school: '연세대학교', department: '전자공학과',
        admissionType: '정시', region: '서울권', year: '2025', previousSchool: '진접고',
        quote: '고2 때 수학이 3등급이었는데, G1230에서 1년 동안 집중적으로 관리 받으면서 수능에서 1등급을 받았습니다.',
        gradeChange: { from: 3, to: 1 }, highlight: true,
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success2&backgroundColor=b6e3f4', color: 'from-blue-600 to-cyan-600',
    },
    {
        id: 's3', name: '박○○', school: '고려대학교', department: '경영학과',
        admissionType: '수시 논술', region: '서울권', year: '2025', previousSchool: '별내고',
        quote: '수학 논술 준비를 여기서 했는데, 기출 분석과 실전 연습이 정말 도움이 됐습니다.',
        gradeChange: { from: 2, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success3&backgroundColor=fef3c7', color: 'from-rose-600 to-pink-600',
    },
    {
        id: 's4', name: '정○○', school: '가천대학교', department: '의예과',
        admissionType: '정시', region: '의약학', year: '2025', previousSchool: '진건고',
        quote: '의대를 목표로 수학 만점을 노렸고, G1230의 킬러 문항 집중 훈련이 결정적이었습니다.',
        gradeChange: { from: 2, to: 1 }, highlight: true,
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success4&backgroundColor=d1fae5', color: 'from-emerald-600 to-teal-600',
    },
    {
        id: 's5', name: '최○○', school: '서울교대', department: '초등교육과',
        admissionType: '수시 학생부교과', region: '교대', year: '2025', previousSchool: '별내고',
        quote: '내신 수학을 끌어올리는 데 G1230이 정말 큰 도움이 됐어요. 오답 클리닉이 최고였습니다.',
        gradeChange: { from: 3, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success5&backgroundColor=ffe4e6', color: 'from-amber-600 to-orange-600',
    },
    {
        id: 's6', name: '한○○', school: '성균관대학교', department: '소프트웨어학과',
        admissionType: '정시', region: '서울권', year: '2025', previousSchool: '진접고',
        quote: '수능 수학 92점으로 성균관대에 합격했습니다. 모의고사 집중 훈련이 실전에서 빛을 발했어요.',
        gradeChange: { from: 3, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success6&backgroundColor=dbeafe', color: 'from-violet-600 to-indigo-600',
    },
    {
        id: 's7', name: '윤○○', school: '경희대학교', department: '한의예과',
        admissionType: '수시 학생부종합', region: '의약학', year: '2025', previousSchool: '진접고',
        quote: '한의대 합격의 핵심은 수학이었습니다. 개념을 깊이 이해하게 해주신 선생님께 감사드립니다.',
        gradeChange: { from: 3, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success7&backgroundColor=fef9c3', color: 'from-teal-600 to-emerald-600',
    },
    // 2024
    {
        id: 's8', name: '강○○', school: '서울시립대학교', department: '수학과',
        admissionType: '정시', region: '서울권', year: '2024', previousSchool: '진접고',
        quote: '수학 4등급에서 시작해 2등급까지 올린 뒤 서울시립대에 합격했습니다. 포기하지 않게 해주셔서 감사합니다.',
        gradeChange: { from: 4, to: 2 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success8&backgroundColor=e0e7ff', color: 'from-blue-500 to-indigo-500',
    },
    {
        id: 's9', name: '조○○', school: '경기대학교', department: '건축학과',
        admissionType: '수시 학생부교과', region: '경기권', year: '2024', previousSchool: '별내고',
        quote: '내신 수학 1등급을 유지할 수 있었던 건 G1230의 체계적인 시험 대비 덕분이에요.',
        gradeChange: { from: 2, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success9&backgroundColor=fce7f3', color: 'from-pink-500 to-rose-500',
    },
    {
        id: 's10', name: '임○○', school: '인하대학교', department: '화학공학과',
        admissionType: '정시', region: '경기권', year: '2024', previousSchool: '진건고',
        quote: '수능 수학에서 예상보다 높은 점수를 받아 인하대에 합격할 수 있었습니다.',
        gradeChange: { from: 3, to: 2 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success10&backgroundColor=d1fae5', color: 'from-emerald-500 to-green-500',
    },
    // 2023
    {
        id: 's11', name: '서○○', school: '한양대학교', department: '기계공학과',
        admissionType: '정시', region: '서울권', year: '2023', previousSchool: '진접고',
        quote: '재수 시절 G1230에서 수학을 다시 시작했고, 한양대에 당당히 합격했습니다.',
        gradeChange: { from: 5, to: 2 }, highlight: true,
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success11&backgroundColor=fef3c7', color: 'from-amber-500 to-yellow-500',
    },
    {
        id: 's12', name: '오○○', school: '중앙대학교', department: '약학과',
        admissionType: '수시 학생부종합', region: '의약학', year: '2023', previousSchool: '별내고',
        quote: '약대를 가려면 수학이 기본이라는 말을 여기서 실감했습니다. 감사합니다.',
        gradeChange: { from: 2, to: 1 },
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=success12&backgroundColor=dbeafe', color: 'from-cyan-500 to-blue-500',
    },
];

const stats = [
    { label: '누적 대입 합격', value: 320, suffix: '+', desc: '명', icon: Trophy, color: 'from-amber-500 to-orange-600' },
    { label: 'SKY 합격', value: 28, suffix: '', desc: '명', icon: Star, color: 'from-indigo-500 to-blue-600' },
    { label: '의약학 합격', value: 15, suffix: '', desc: '명', icon: Award, color: 'from-emerald-500 to-teal-600' },
    { label: '수학 1등급 비율', value: 87, suffix: '', desc: '%', icon: TrendingUp, color: 'from-rose-500 to-pink-600' },
];

const regionColors: Record<string, string> = {
    '서울권': 'bg-indigo-100 text-indigo-700',
    '경기권': 'bg-emerald-100 text-emerald-700',
    '의약학': 'bg-rose-100 text-rose-700',
    '교대': 'bg-amber-100 text-amber-700',
};

export function SuccessStories() {
    const [yearFilter, setYearFilter] = useState<YearFilter>('전체');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('전체');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = successStories.filter(s => {
        if (yearFilter !== '전체' && s.year !== yearFilter) return false;
        if (categoryFilter !== '전체' && s.region !== categoryFilter) return false;
        return true;
    });

    const highlighted = filtered.filter(s => s.highlight);
    const others = filtered.filter(s => !s.highlight);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-amber-800 via-orange-800 to-rose-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-20 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
                </motion.div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-badge inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 mb-4 backdrop-blur-sm">
                            <Trophy className="w-4 h-4" />
                            SUCCESS STORIES
                        </span>
                        <h1 className="text-hero text-white mb-4">대입 성공 스토리</h1>
                        <p className="text-xl text-amber-200 max-w-2xl mx-auto font-light">
                            진접 G1230 수학전문학원에서 꿈을 이룬 학생들의 이야기
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <Section className="bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <ScrollReveal key={stat.label} delay={0.1 * i}>
                            <div className="glass-card rounded-2xl p-5 text-center">
                                <div className={cn("bg-gradient-to-br w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white mb-3", stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
                                    <CountUp end={stat.value} suffix={stat.suffix} />
                                    <span className="text-base text-slate-500 ml-1 font-medium">{stat.desc}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </Section>

            {/* Filters */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Year filter */}
                        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200">
                            {(['전체', '2025', '2024', '2023'] as YearFilter[]).map(year => (
                                <button
                                    key={year}
                                    onClick={() => setYearFilter(year)}
                                    className={cn(
                                        "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        yearFilter === year
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {year === '전체' ? '전체 연도' : `${year}학년도`}
                                </button>
                            ))}
                        </div>
                        {/* Category filter */}
                        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200">
                            {(['전체', '서울권', '경기권', '의약학', '교대'] as CategoryFilter[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={cn(
                                        "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                        categoryFilter === cat
                                            ? "bg-indigo-500 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Highlighted */}
                {highlighted.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-slate-900">주요 합격 스토리</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {highlighted.map((story, i) => (
                                <ScrollReveal key={story.id} delay={0.1 * i}>
                                    <div className="relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
                                        {/* Top gradient bar */}
                                        <div className={cn("h-2 bg-gradient-to-r", story.color)} />
                                        <div className="p-5">
                                            <div className="flex items-start gap-4 mb-4">
                                                <img
                                                    src={story.avatar}
                                                    alt={story.name}
                                                    className="w-14 h-14 rounded-full border-2 border-slate-100 shrink-0"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-slate-900">{story.name}</h3>
                                                        <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full", regionColors[story.region])}>
                                                            {story.region}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-indigo-600 mt-0.5">{story.school} {story.department}</p>
                                                    <p className="text-xs text-slate-500">{story.admissionType} · {story.previousSchool} 출신</p>
                                                </div>
                                            </div>

                                            {story.gradeChange && (
                                                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-slate-50 rounded-xl">
                                                    <span className="text-sm text-slate-500">수학 등급</span>
                                                    <span className="text-lg font-bold text-slate-400">{story.gradeChange.from}등급</span>
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-lg font-bold text-emerald-600">{story.gradeChange.to}등급</span>
                                                </div>
                                            )}

                                            <div className="relative pl-4 border-l-2 border-amber-300">
                                                <Quote className="absolute -left-2 -top-1 w-4 h-4 text-amber-400 bg-white" />
                                                <p className="text-sm text-slate-600 leading-relaxed italic">"{story.quote}"</p>
                                            </div>

                                            <div className="mt-3 text-right">
                                                <span className="text-xs text-slate-400 font-medium">{story.year}학년도 합격</span>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* All results */}
                {others.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <GraduationCap className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-bold text-slate-900">합격 현황</h2>
                            <span className="text-sm text-slate-400 ml-1">총 {filtered.length}명</span>
                        </div>

                        <div className="space-y-3">
                            {others.map(story => {
                                const isExpanded = expandedId === story.id;
                                return (
                                    <motion.div
                                        key={story.id}
                                        layout
                                        className={cn(
                                            "bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow",
                                            isExpanded && "shadow-md"
                                        )}
                                    >
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : story.id)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={story.avatar}
                                                    alt={story.name}
                                                    className="w-10 h-10 rounded-full border border-slate-100 shrink-0"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-sm text-slate-900">{story.name}</span>
                                                        <span className="font-semibold text-sm text-indigo-600">{story.school} {story.department}</span>
                                                        <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full", regionColors[story.region])}>
                                                            {story.region}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {story.admissionType} · {story.previousSchool} · {story.year}학년도
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                {story.gradeChange && (
                                                    <div className="hidden sm:flex items-center gap-1.5 text-xs">
                                                        <span className="text-slate-400 font-bold">{story.gradeChange.from}등급</span>
                                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-emerald-600 font-bold">{story.gradeChange.to}등급</span>
                                                    </div>
                                                )}
                                                {isExpanded
                                                    ? <ChevronUp className="w-5 h-5 text-slate-400" />
                                                    : <ChevronDown className="w-5 h-5 text-slate-400" />
                                                }
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                                                        <div className="flex items-start gap-3 mt-3">
                                                            {story.gradeChange && (
                                                                <div className="sm:hidden flex items-center gap-1.5 text-xs mb-2">
                                                                    <span className="text-slate-400 font-bold">{story.gradeChange.from}등급</span>
                                                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                                    <span className="text-emerald-600 font-bold">{story.gradeChange.to}등급</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative pl-4 border-l-2 border-indigo-300">
                                                            <Quote className="absolute -left-2 -top-1 w-4 h-4 text-indigo-400 bg-white" />
                                                            <p className="text-sm text-slate-600 leading-relaxed italic">"{story.quote}"</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">해당 조건의 합격 스토리가 없습니다.</p>
                        <p className="text-sm text-slate-400 mt-1">다른 필터를 선택해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
