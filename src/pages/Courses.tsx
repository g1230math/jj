import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Clock, Star, Users, ChevronDown, ChevronUp, ArrowRight, GraduationCap, Sparkles, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';

const courses = [
    {
        id: 'elementary',
        name: '초등부',
        icon: Sparkles,
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        grades: '초3 ~ 초6',
        desc: '수학적 사고력과 연산 능력의 기초를 탄탄히',
        classes: [
            { name: '기초 연산반', time: '월/수/금 15:00-16:30', price: '180,000원', students: '8명 정원', level: '초3~4' },
            { name: '사고력 수학반', time: '화/목 15:00-16:30', price: '160,000원', students: '10명 정원', level: '초4~5' },
            { name: '중등 준비반', time: '월/수/금 16:30-18:00', price: '200,000원', students: '8명 정원', level: '초5~6' },
        ],
    },
    {
        id: 'middle',
        name: '중등부',
        icon: Calculator,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        grades: '중1 ~ 중3',
        desc: '내신 완벽 대비, 수학 자신감 UP',
        classes: [
            { name: '기본 개념반', time: '월/수/금 17:00-19:00', price: '220,000원', students: '12명 정원', level: '중1~2' },
            { name: '심화 응용반', time: '화/목/토 17:00-19:00', price: '240,000원', students: '10명 정원', level: '중2~3' },
            { name: '내신 대비 특강', time: '시험 2주 전 집중', price: '120,000원', students: '8명 정원', level: '중1~3' },
            { name: '고등 선행반', time: '월/수/금 19:00-21:00', price: '260,000원', students: '8명 정원', level: '중3' },
        ],
    },
    {
        id: 'high',
        name: '고등부',
        icon: GraduationCap,
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        grades: '고1 ~ 고3',
        desc: '수능·내신 1등급을 향한 체계적 관리',
        classes: [
            { name: '수학(상)·(하) 반', time: '월/수/금 18:00-20:00', price: '280,000원', students: '10명 정원', level: '고1' },
            { name: '수학Ⅰ·Ⅱ 반', time: '화/목/토 18:00-20:00', price: '300,000원', students: '8명 정원', level: '고2' },
            { name: '미적분·기하 반', time: '월/수/금 20:00-22:00', price: '320,000원', students: '8명 정원', level: '고2~3' },
            { name: '수능 집중반', time: '화/목/토 20:00-22:00', price: '350,000원', students: '6명 정원', level: '고3' },
        ],
    },
];

export function Courses() {
    const [openSection, setOpenSection] = useState<string>('middle');

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">수강 안내</h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                            수준별·목표별 맞춤 교육으로 확실한 성적 향상을 약속합니다
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 특징 카드 */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-10">
                        {[
                            { icon: Users, title: '소수정예', desc: '반당 6~12명', color: 'bg-blue-500' },
                            { icon: BookOpen, title: '체계적 교재', desc: '학년별 전문 교재', color: 'bg-emerald-500' },
                            { icon: Star, title: '개별 관리', desc: '1:1 학습 리포트', color: 'bg-amber-500' },
                            { icon: Clock, title: '자습 지도', desc: '수업 후 자율학습', color: 'bg-rose-500' },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                                className="bg-white rounded-xl shadow-lg p-5 border border-slate-100 text-center hover:shadow-xl transition-shadow"
                            >
                                <div className={`${item.color} w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-white mb-3`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 개설 반 & 시간표 */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">개설 반 & 시간표</h2>
                        <p className="text-slate-500">학년과 수준에 맞는 반을 선택하세요</p>
                    </div>

                    <div className="space-y-6">
                        {courses.map(course => (
                            <motion.div key={course.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenSection(openSection === course.id ? '' : course.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`bg-gradient-to-br ${course.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm`}>
                                            <course.icon className="w-7 h-7" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-slate-900">{course.name}</h3>
                                            <p className="text-sm text-slate-500">{course.grades} | {course.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn("px-3 py-1 text-sm font-medium rounded-full", course.bgColor, course.textColor)}>
                                            {course.classes.length}개 반
                                        </span>
                                        {openSection === course.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                    </div>
                                </button>

                                {openSection === course.id && (
                                    <div className="px-6 pb-6 border-t border-slate-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {course.classes.map((cls, i) => (
                                                <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-bold text-slate-900">{cls.name}</h4>
                                                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded-full">{cls.level}</span>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            <span>{cls.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Users className="w-4 h-4 text-slate-400" />
                                                            <span>{cls.students}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-indigo-600">월 {cls.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-10 md:p-14 text-white shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">지금 바로 수강 상담을 받아보세요!</h2>
                        <p className="text-indigo-100 mb-8 text-lg">
                            학생의 현재 수준을 진단하고, 최적의 반을 추천해 드립니다.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="tel:031-123-4567" className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors">
                                📞 전화 상담: 031-123-4567
                            </a>
                            <Link to="/contact" className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                                방문 상담 안내 <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
