import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, BookOpen, GraduationCap, Heart, Lightbulb, Target, Users, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';

const philosophyItems = [
    {
        icon: Target, title: '맞춤형 교육', desc: '학생별 수준 진단 후 개인 맞춤 커리큘럼 설계', color: 'from-rose-500 to-rose-600',
        detail: '입학 시 정밀 진단 테스트를 통해 학생의 강점과 약점을 분석합니다. 이를 바탕으로 개인별 학습 계획서를 작성하고, 매월 정기 평가를 통해 커리큘럼을 지속적으로 조정합니다.',
    },
    {
        icon: Lightbulb, title: '개념 중심', desc: '단순 풀이가 아닌 수학적 사고력과 개념 이해 중점', color: 'from-amber-500 to-amber-600',
        detail: '공식 암기보다 "왜 그렇게 되는지"를 이해하는 것이 진정한 수학 실력입니다. 개념 원리를 시각적으로 설명하고, 다양한 관점에서 접근합니다.',
    },
    {
        icon: BookOpen, title: '반복 학습', desc: '체계적인 오답 관리와 단계별 반복 학습 시스템', color: 'from-blue-500 to-blue-600',
        detail: '3단계 반복 학습: ① 수업 중 개념 학습, ② 오답 노트 작성 및 유사 문제 재풀이, ③ 정기 테스트를 통한 정착 확인. 매주 오답 클리닉도 운영합니다.',
    },
    {
        icon: Heart, title: '소수정예', desc: '반당 최대 12명 소수정예로 꼼꼼한 밀착 관리', color: 'from-emerald-500 to-emerald-600',
        detail: '반당 최대 12명으로 충분한 발문 기회와 개별 피드백을 제공합니다. 하위 30% 학생에게는 추가 보충 수업을 무료로 제공합니다.',
    },
];

const instructors = [
    {
        name: '김수학',
        title: '원장 / 수학 전문 강사',
        desc: '서울대 수학교육과 졸업 | 15년 경력\n수능 수학 1등급 배출 다수',
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=KimMath&backgroundColor=c0aede&skinColor=f2d3b1',
        color: 'from-indigo-500 to-blue-600',
    },
    {
        name: '박미적',
        title: '고등부 전문 강사',
        desc: '연세대 수학과 졸업 | 8년 경력\n미적분·기하 전문',
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ParkMJ&backgroundColor=fef3c7&skinColor=f2d3b1',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        name: '이함수',
        title: '중등부 전문 강사',
        desc: '고려대 수학과 졸업 | 10년 경력\n내신 집중 관리 전문',
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=LeeHS&backgroundColor=b6e3f4&skinColor=f2d3b1',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        name: '최연산',
        title: '초등부 전문 강사',
        desc: '이화여대 수학교육과 졸업 | 7년 경력\n사고력·연산 능력 개발',
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ChoiYS&backgroundColor=d1fae5&skinColor=f2d3b1',
        color: 'from-amber-500 to-orange-600',
    },
];

export function About() {
    const [openPhilosophy, setOpenPhilosophy] = useState<number | null>(null);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-badge inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 mb-4 backdrop-blur-sm">
                            ABOUT US
                        </span>
                        <h1 className="text-hero text-white mb-4">학원 소개</h1>
                        <p className="text-xl text-indigo-200 max-w-2xl mx-auto font-light">
                            수학의 본질을 꿰뚫는 교육, 진접 G1230 수학전문학원
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 원장 인사말 */}
            <Section className="bg-white">
                <ScrollReveal>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-badge inline-block px-4 py-1.5 rounded-full mb-4 bg-indigo-50 text-indigo-600 border border-indigo-100">
                                GREETING
                            </span>
                            <h2 className="text-section-title mb-6">원장 인사말</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    안녕하세요, 진접 G1230 수학전문학원 원장 <strong className="text-slate-900">김수학</strong>입니다.
                                </p>
                                <p>
                                    수학은 단순히 공식을 외우는 것이 아니라, <span className="text-gradient font-semibold">논리적 사고력</span>을 키우는 과정입니다.
                                    저희 학원은 학생 한 명 한 명의 수준에 맞춘 맞춤형 교육으로, 수학에 대한 자신감과 실력을 동시에 키워갑니다.
                                </p>
                                <p>
                                    진접읍 최고의 강사진과 함께 <span className="text-gradient font-semibold">확실한 성적 향상</span>을 경험해보세요.
                                    초등부터 수능까지, 여러분의 수학 여정을 함께 하겠습니다.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=KimMath&backgroundColor=e0e7ff&skinColor=f2d3b1" alt="원장" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">김수학</p>
                                    <p className="text-sm text-slate-500">진접 G1230 수학전문학원 원장</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="glass-card rounded-2xl p-4">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-50">
                                    <img src="https://picsum.photos/seed/principal/600/450" alt="학원 수업 풍경" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-20 -z-10" />
                        </div>
                    </div>
                </ScrollReveal>
            </Section>

            {/* 교육 철학 */}
            <Section className="bg-slate-50">
                <SectionHeader
                    badge="PHILOSOPHY"
                    title="교육 철학 & 커리큘럼"
                    subtitle="학생 중심의 체계적인 교육 시스템 — 각 항목을 클릭해 자세히 알아보세요"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {philosophyItems.map((item, i) => (
                        <ScrollReveal key={i.toString()} delay={0.1 * i}>
                            <div
                                className={cn(
                                    "glass-card rounded-2xl p-6 cursor-pointer transition-all h-full",
                                    openPhilosophy === i ? "ring-2 ring-indigo-300 shadow-lg" : "glass-card-hover"
                                )}
                                onClick={() => setOpenPhilosophy(openPhilosophy === i ? null : i)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("bg-gradient-to-br w-14 h-14 rounded-xl flex items-center justify-center text-white", item.color)}>
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", openPhilosophy === i && "rotate-180 text-indigo-500")} />
                                </div>
                                <h3 className="text-card-title text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-card-desc">{item.desc}</p>
                                <AnimatePresence>
                                    {openPhilosophy === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </Section>

            {/* 강사진 소개 */}
            <Section className="bg-white">
                <SectionHeader
                    badge="INSTRUCTORS"
                    title="강사진 소개"
                    subtitle="검증된 실력과 열정의 강사진"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {instructors.map((inst, i) => (
                        <div key={i}>
                            <ScrollReveal delay={0.1 * i}>
                                <div className="glass-card glass-card-hover rounded-2xl overflow-hidden group">
                                    <div className={cn("bg-gradient-to-br p-6 flex justify-center", inst.color)}>
                                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-lg group-hover:scale-105 transition-transform">
                                            <img src={inst.img} alt={inst.name} className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const el = e.currentTarget;
                                                    el.style.display = 'none';
                                                    el.parentElement!.classList.add('bg-white/20', 'flex', 'items-center', 'justify-center');
                                                    const span = document.createElement('span');
                                                    span.className = 'text-4xl font-bold text-white/80';
                                                    span.textContent = inst.name[0];
                                                    el.parentElement!.appendChild(span);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-5 text-center">
                                        <h3 className="text-card-title text-slate-900">{inst.name}</h3>
                                        <p className="text-sm text-indigo-600 font-semibold mb-2">{inst.title}</p>
                                        <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed">{inst.desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 시설 갤러리 */}
            <Section className="bg-slate-50">
                <SectionHeader
                    badge="FACILITIES"
                    title="시설 갤러리"
                    subtitle="쾌적한 학습 환경을 제공합니다"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        'https://picsum.photos/seed/fac1/600/400',
                        'https://picsum.photos/seed/fac2/600/400',
                        'https://picsum.photos/seed/fac3/600/400',
                        'https://picsum.photos/seed/fac4/600/400',
                        'https://picsum.photos/seed/fac5/600/400',
                        'https://picsum.photos/seed/fac6/600/400',
                    ].map((img, i) => (
                        <ScrollReveal key={i.toString()} delay={0.05 * i} direction="scale">
                            <div className="glass-card rounded-2xl overflow-hidden group">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={img} alt={`시설 ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </Section>

            {/* 수상 실적 / 숫자 */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <ScrollReveal>
                        <Award className="w-14 h-14 mx-auto mb-4 text-white/70" />
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 tracking-tight">
                            진접읍 수학 교육의 중심
                        </h2>
                    </ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { end: 15, suffix: '+', label: '교육 경력(년)' },
                            { end: 500, suffix: '+', label: '졸업생 수' },
                            { end: 95, suffix: '%', label: '내신 향상률' },
                            { end: 12, suffix: '명', prefix: '1:', label: '소수정예 비율' },
                        ].map((stat, i) => (
                            <ScrollReveal key={i.toString()} delay={0.1 * i}>
                                <div className="text-white">
                                    <CountUp end={stat.end} suffix={stat.suffix} prefix={stat.prefix || ''} className="text-4xl md:text-5xl font-extrabold font-display block mb-2" />
                                    <p className="text-indigo-200 text-sm font-medium">{stat.label}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
