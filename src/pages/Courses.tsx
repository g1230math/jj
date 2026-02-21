import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, Star, Users, ArrowRight, GraduationCap, Sparkles, Calculator, Phone, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, Section, SectionHeader } from '../components/ScrollReveal';

const courses = [
    {
        id: 'elementary',
        name: '초등부',
        icon: Sparkles,
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        grades: '초3 ~ 초6',
        desc: '수학적 사고력과 연산 능력의 기초를 탄탄히',
        highlights: ['연산·사고력 강화', '서술형 문제 훈련', '영재원 대비'],
        classes: [
            { name: '기초 연산반', time: '월/수/금 15:00-16:30', price: '180,000원', students: 8, enrolled: 6, level: '초3~4' },
            { name: '사고력 수학반', time: '화/목 15:00-16:30', price: '160,000원', students: 10, enrolled: 7, level: '초4~5' },
            { name: '중등 준비반', time: '월/수/금 16:30-18:00', price: '200,000원', students: 8, enrolled: 5, level: '초5~6' },
        ],
    },
    {
        id: 'middle',
        name: '중등부',
        icon: Calculator,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        grades: '중1 ~ 중3',
        desc: '내신 완벽 대비, 수학 자신감 UP',
        highlights: ['교과서·기출 분석', '선행 학습', '월 1회 모의고사'],
        classes: [
            { name: '기본 개념반', time: '월/수/금 17:00-19:00', price: '220,000원', students: 12, enrolled: 9, level: '중1~2' },
            { name: '심화 응용반', time: '화/목/토 17:00-19:00', price: '240,000원', students: 10, enrolled: 8, level: '중2~3' },
            { name: '내신 대비 특강', time: '시험 2주 전 집중', price: '120,000원', students: 8, enrolled: 4, level: '중1~3' },
            { name: '고등 선행반', time: '월/수/금 19:00-21:00', price: '260,000원', students: 8, enrolled: 6, level: '중3' },
        ],
    },
    {
        id: 'high',
        name: '고등부',
        icon: GraduationCap,
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200',
        grades: '고1 ~ 고3',
        desc: '수능·내신 1등급을 향한 체계적 관리',
        highlights: ['EBS 연계 분석', '킬러 문항 훈련', '1:1 첨삭'],
        classes: [
            { name: '수학(상)·(하) 반', time: '월/수/금 18:00-20:00', price: '280,000원', students: 10, enrolled: 7, level: '고1' },
            { name: '수학Ⅰ·Ⅱ 반', time: '화/목/토 18:00-20:00', price: '300,000원', students: 8, enrolled: 6, level: '고2' },
            { name: '미적분·기하 반', time: '월/수/금 20:00-22:00', price: '320,000원', students: 8, enrolled: 5, level: '고2~3' },
            { name: '수능 집중반', time: '화/목/토 20:00-22:00', price: '350,000원', students: 6, enrolled: 4, level: '고3' },
        ],
    },
];

export function Courses() {
    const [activeTab, setActiveTab] = useState(0);
    const current = courses[activeTab];

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-badge inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 mb-4 backdrop-blur-sm">
                            2025 봄학기 모집 중
                        </span>
                        <h1 className="text-hero text-white mb-4">수강 안내</h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto font-light">
                            수준별·목표별 맞춤 교육으로 확실한 성적 향상을 약속합니다
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feature cards */}
            <Section className="bg-white !pt-4 !pb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-10">
                    {[
                        { icon: Users, title: '소수정예', desc: '반당 6~12명', color: 'from-blue-500 to-blue-600' },
                        { icon: BookOpen, title: '체계적 교재', desc: '학년별 전문 교재', color: 'from-emerald-500 to-emerald-600' },
                        { icon: Star, title: '개별 관리', desc: '1:1 학습 리포트', color: 'from-amber-500 to-amber-600' },
                        { icon: Clock, title: '자습 지도', desc: '수업 후 자율학습', color: 'from-rose-500 to-rose-600' },
                    ].map((item, i) => (
                        <ScrollReveal key={i.toString()} delay={0.1 * i}>
                            <div className="glass-card glass-card-hover rounded-2xl p-6 text-center">
                                <div className={cn("bg-gradient-to-br w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white mb-3", item.color)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-card-title text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-card-desc text-sm">{item.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </Section>

            {/* Tabbed Course Section */}
            <Section className="bg-slate-50">
                <SectionHeader
                    badge="CLASSES"
                    title="개설 반 & 시간표"
                    subtitle="학년과 수준에 맞는 반을 선택하세요"
                />

                {/* Tab Buttons */}
                <ScrollReveal className="flex justify-center mb-10">
                    <div className="inline-flex bg-white rounded-2xl p-1.5 gap-1 shadow-sm border border-slate-100">
                        {courses.map((c, i) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveTab(i)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all",
                                    activeTab === i
                                        ? "bg-gradient-to-r text-white shadow-md " + c.color
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <c.icon className="w-4 h-4" />
                                {c.name}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Summary banner */}
                        <div className={cn("glass-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4", current.borderColor)}>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{current.name} — {current.grades}</h3>
                                <p className="text-slate-500">{current.desc}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {current.highlights.map(h => (
                                    <span key={h} className={cn("text-badge flex items-center gap-1 px-3 py-1 rounded-full border", current.bgColor, current.textColor, current.borderColor)}>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Class cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {current.classes.map((cls, i) => {
                                const percentage = Math.round((cls.enrolled / cls.students) * 100);
                                const isAlmostFull = percentage >= 75;
                                return (
                                    <div key={i} className="glass-card glass-card-hover rounded-2xl p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-card-title text-slate-900">{cls.name}</h4>
                                                <span className={cn("text-badge px-2 py-0.5 rounded-full mt-1 inline-block", current.bgColor, current.textColor)}>{cls.level}</span>
                                            </div>
                                            <span className="text-xl font-bold text-indigo-600 font-display">월 {cls.price}</span>
                                        </div>

                                        <div className="space-y-3 text-sm text-slate-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium">{cls.time}</span>
                                            </div>
                                        </div>

                                        {/* Capacity bar */}
                                        <div>
                                            <div className="flex justify-between items-center text-xs mb-1.5">
                                                <span className="text-slate-500 font-medium">정원 {cls.enrolled}/{cls.students}명</span>
                                                {isAlmostFull && (
                                                    <span className="text-badge text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">마감 임박</span>
                                                )}
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className={cn("h-2 rounded-full transition-all", isAlmostFull ? "bg-gradient-to-r from-rose-500 to-rose-400" : "bg-gradient-to-r from-indigo-500 to-blue-400")}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                            지금 바로 수강 상담을 받아보세요!
                        </h2>
                        <p className="text-lg text-indigo-100 mb-10 font-light">
                            학생의 현재 수준을 진단하고, 최적의 반을 추천해 드립니다.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="tel:031-123-4567" className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                <Phone className="w-5 h-5 mr-2" />
                                031-123-4567
                            </a>
                            <Link to="/contact" className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                방문 상담 안내 <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
