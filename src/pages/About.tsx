import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, GraduationCap, Heart, Lightbulb, Target, Users } from 'lucide-react';

const instructors = [
    {
        name: '김수학',
        title: '원장 / 수학 전문 강사',
        desc: '서울대 수학교육과 졸업 | 15년 경력\n수능 수학 1등급 배출 다수',
        avatar: 'https://i.pravatar.cc/300?u=inst1',
        color: 'from-indigo-500 to-blue-600',
    },
    {
        name: '박미적',
        title: '고등부 전문 강사',
        desc: '연세대 수학과 졸업 | 8년 경력\n미적분·기하 전문',
        avatar: 'https://i.pravatar.cc/300?u=inst2',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        name: '이함수',
        title: '중등부 전문 강사',
        desc: '고려대 수학과 졸업 | 10년 경력\n내신 집중 관리 전문',
        avatar: 'https://i.pravatar.cc/300?u=inst3',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        name: '최연산',
        title: '초등부 전문 강사',
        desc: '이화여대 수학교육과 졸업 | 7년 경력\n사고력·연산 능력 개발',
        avatar: 'https://i.pravatar.cc/300?u=inst4',
        color: 'from-amber-500 to-orange-600',
    },
];

const facilities = [
    'https://picsum.photos/seed/fac1/600/400',
    'https://picsum.photos/seed/fac2/600/400',
    'https://picsum.photos/seed/fac3/600/400',
    'https://picsum.photos/seed/fac4/600/400',
    'https://picsum.photos/seed/fac5/600/400',
    'https://picsum.photos/seed/fac6/600/400',
];

export function About() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">학원 소개</h1>
                        <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                            수학의 본질을 꿰뚫는 교육, 진접 수학전문학원
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 원장 인사말 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                <h2 className="text-3xl font-bold text-slate-900">원장 인사말</h2>
                            </div>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    안녕하세요, 진접 수학전문학원 원장 <strong className="text-slate-900">김수학</strong>입니다.
                                </p>
                                <p>
                                    수학은 단순히 공식을 외우는 것이 아니라, <span className="text-indigo-600 font-semibold">
                                        논리적 사고력</span>을 키우는 과정입니다. 저희 학원은 학생 한 명 한 명의
                                    수준에 맞춘 맞춤형 교육으로, 수학에 대한 자신감과 실력을 동시에 키워갑니다.
                                </p>
                                <p>
                                    진접읍 최고의 강사진과 함께 <span className="text-indigo-600 font-semibold">
                                        확실한 성적 향상</span>을 경험해보세요.
                                    초등부터 수능까지, 여러분의 수학 여정을 함께 하겠습니다.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-4">
                                <img src="https://i.pravatar.cc/100?u=principal" alt="원장" className="w-14 h-14 rounded-full border-2 border-indigo-200" />
                                <div>
                                    <p className="font-bold text-slate-900">김수학</p>
                                    <p className="text-sm text-slate-500">진접 수학전문학원 원장</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-2xl p-8 border border-indigo-100">
                                <img src="https://picsum.photos/seed/principal/600/500" alt="학원 수업 풍경" className="rounded-xl shadow-lg w-full" referrerPolicy="no-referrer" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 교육 철학 */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">교육 철학 & 커리큘럼</h2>
                        <p className="text-slate-500 text-lg">학생 중심의 체계적인 교육 시스템</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Target, title: '맞춤형 교육', desc: '학생별 수준 진단 후 개인 맞춤 커리큘럼 설계', color: 'bg-rose-500' },
                            { icon: Lightbulb, title: '개념 중심', desc: '단순 풀이가 아닌 수학적 사고력과 개념 이해 중점', color: 'bg-amber-500' },
                            { icon: BookOpen, title: '반복 학습', desc: '체계적인 오답 관리와 단계별 반복 학습 시스템', color: 'bg-blue-500' },
                            { icon: Heart, title: '소수정예', desc: '반당 최대 12명 소수정예로 꼼꼼한 밀착 관리', color: 'bg-emerald-500' },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 강사진 소개 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">강사진 소개</h2>
                        <p className="text-slate-500 text-lg">검증된 실력과 열정의 강사진</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {instructors.map((inst, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group"
                            >
                                <div className={`bg-gradient-to-br ${inst.color} p-6 flex justify-center`}>
                                    <img src={inst.avatar} alt={inst.name} className="w-32 h-32 rounded-full border-4 border-white/50 shadow-lg group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                                </div>
                                <div className="p-5 text-center">
                                    <h3 className="text-lg font-bold text-slate-900">{inst.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium mb-2">{inst.title}</p>
                                    <p className="text-sm text-slate-500 whitespace-pre-line">{inst.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 시설 갤러리 */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">시설 갤러리</h2>
                        <p className="text-slate-500 text-lg">쾌적한 학습 환경을 제공합니다</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((img, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
                                className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={img} alt={`시설 ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 수상 실적 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl">
                        <Award className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">진접읍 수학 교육의 중심</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                            {[
                                { num: '15+', label: '교육 경력(년)' },
                                { num: '500+', label: '졸업생 수' },
                                { num: '95%', label: '내신 향상률' },
                                { num: '1:12', label: '소수정예 비율' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className="text-4xl font-bold mb-1">{stat.num}</p>
                                    <p className="text-indigo-200 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
