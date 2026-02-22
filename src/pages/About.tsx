import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, BookOpen, GraduationCap, Heart, Lightbulb, Target, Users, ChevronDown, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { ImageUploader } from '../components/ImageUploader';
import {
    getInstructorProfiles, saveInstructorProfiles, type InstructorProfile,
    getFacilityPhotos, saveFacilityPhotos, type FacilityPhoto,
} from '../data/mockData';

/* ─── helpers ─── */
const genId = (prefix: string) => `${prefix}_${Date.now()}`;
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

/* ─── Modal (top-level) ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">{children}</div>
            </div>
        </div>
    );
}

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

const colorOptions = [
    { label: '인디고-블루', value: 'from-indigo-500 to-blue-600' },
    { label: '블루-시안', value: 'from-blue-500 to-cyan-600' },
    { label: '에머럴드-틸', value: 'from-emerald-500 to-teal-600' },
    { label: '앰버-오렌지', value: 'from-amber-500 to-orange-600' },
    { label: '로즈-핑크', value: 'from-rose-500 to-pink-600' },
    { label: '바이올렛-퍼플', value: 'from-violet-500 to-purple-600' },
];

export function About() {
    const { isAdmin } = useAuth();
    const [openPhilosophy, setOpenPhilosophy] = useState<number | null>(null);

    // ── 강사진 state ──
    const [instructors, setInstructors] = useState<InstructorProfile[]>(getInstructorProfiles);
    const [instModal, setInstModal] = useState<'add' | 'edit' | null>(null);
    const [editInst, setEditInst] = useState<InstructorProfile | null>(null);

    // ── 시설 갤러리 state ──
    const [facilities, setFacilities] = useState<FacilityPhoto[]>(getFacilityPhotos);
    const [facModal, setFacModal] = useState<'add' | 'edit' | null>(null);
    const [editFac, setEditFac] = useState<FacilityPhoto | null>(null);

    /* ─── 강사 CRUD ─── */
    const emptyInst = (): InstructorProfile => ({
        id: genId('inst'), name: '', title: '', desc: '', img: '', color: colorOptions[0].value, order: instructors.length + 1,
    });

    const openAddInst = () => { setEditInst(emptyInst()); setInstModal('add'); };
    const openEditInst = (inst: InstructorProfile) => { setEditInst({ ...inst }); setInstModal('edit'); };
    const closeInstModal = () => { setInstModal(null); setEditInst(null); };

    const handleSaveInst = () => {
        if (!editInst || !editInst.name.trim()) return;
        let updated: InstructorProfile[];
        if (instModal === 'add') {
            updated = [...instructors, editInst];
        } else {
            updated = instructors.map(i => i.id === editInst.id ? editInst : i);
        }
        updated.sort((a, b) => a.order - b.order);
        setInstructors(updated);
        saveInstructorProfiles(updated);
        closeInstModal();
    };

    const handleDeleteInst = (id: string) => {
        if (!confirm('이 강사를 삭제하시겠습니까?')) return;
        const updated = instructors.filter(i => i.id !== id);
        setInstructors(updated);
        saveInstructorProfiles(updated);
    };

    /* ─── 시설 CRUD ─── */
    const emptyFac = (): FacilityPhoto => ({
        id: genId('fac'), imageUrl: '', title: '', order: facilities.length + 1,
    });

    const openAddFac = () => { setEditFac(emptyFac()); setFacModal('add'); };
    const openEditFac = (fac: FacilityPhoto) => { setEditFac({ ...fac }); setFacModal('edit'); };
    const closeFacModal = () => { setFacModal(null); setEditFac(null); };

    const handleSaveFac = () => {
        if (!editFac || !editFac.title.trim()) return;
        let updated: FacilityPhoto[];
        if (facModal === 'add') {
            updated = [...facilities, editFac];
        } else {
            updated = facilities.map(f => f.id === editFac.id ? editFac : f);
        }
        updated.sort((a, b) => a.order - b.order);
        setFacilities(updated);
        saveFacilityPhotos(updated);
        closeFacModal();
    };

    const handleDeleteFac = (id: string) => {
        if (!confirm('이 시설 사진을 삭제하시겠습니까?')) return;
        const updated = facilities.filter(f => f.id !== id);
        setFacilities(updated);
        saveFacilityPhotos(updated);
    };

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
                                    <img src={instructors[0]?.img || 'https://api.dicebear.com/9.x/adventurer/svg?seed=KimMath&backgroundColor=e0e7ff&skinColor=f2d3b1'} alt="원장" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{instructors[0]?.name || '김수학'}</p>
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

            {/* 학원 히스토리 */}
            <Section className="bg-slate-50">
                <SectionHeader
                    badge="HISTORY"
                    title="학원 히스토리"
                    subtitle="15년간 걸어온 진접 G1230의 발자취"
                />
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-300" />

                    {[
                        { year: '2011', title: '학원 개원', desc: '진접읍 해밀예당 1로 171에 "G1230 수학전문학원" 개원. 중등부 2개 반으로 시작.', icon: '🏫', color: 'from-indigo-500 to-blue-600' },
                        { year: '2012', title: '초등부 개설', desc: '초등 3~6학년 대상 기초 연산·사고력 과정 신설. 학생 수 50명 돌파.', icon: '📚', color: 'from-emerald-500 to-teal-600' },
                        { year: '2014', title: '고등부 확장', desc: '고등 내신·수능 전문 과정 개설. 첫 수능 수학 1등급 배출.', icon: '🎓', color: 'from-blue-500 to-indigo-600' },
                        { year: '2015', title: '100명 돌파', desc: '재원생 100명 돌파. 소수정예 시스템으로 학생별 맞춤 관리 체계 확립.', icon: '🎯', color: 'from-rose-500 to-pink-600' },
                        { year: '2017', title: '셔틀버스 운행 시작', desc: '진접·별내·진건 지역 3개 노선 셔틀버스 운행 개시.', icon: '🚌', color: 'from-amber-500 to-orange-600' },
                        { year: '2018', title: '첫 SKY 합격자 배출', desc: '서울대학교 합격생 배출. 누적 주요 대학 합격자 30명 돌파.', icon: '🏆', color: 'from-yellow-500 to-amber-600' },
                        { year: '2019', title: '학원 확장 이전', desc: '증가하는 수요에 맞춰 현 위치(제일프라자)로 확장 이전. 자습실·상담실 신설.', icon: '🏢', color: 'from-violet-500 to-purple-600' },
                        { year: '2020', title: '온라인 강의 시스템 도입', desc: '코로나19 대응 비대면 수업 체계 구축. 동영상 강의실 개설.', icon: '💻', color: 'from-cyan-500 to-blue-600' },
                        { year: '2021', title: '10주년 & 200명 돌파', desc: '개원 10주년 기념. 재원생 200명 돌파, 누적 합격자 150명 달성.', icon: '🎉', color: 'from-pink-500 to-rose-600' },
                        { year: '2023', title: '학부모 서비스 런칭', desc: '실시간 출결 확인, 성적표 조회, 온라인 상담 신청 시스템 오픈.', icon: '📱', color: 'from-teal-500 to-emerald-600' },
                        { year: '2024', title: '의약학 합격자 다수 배출', desc: '의대·약대·한의대 합격자 15명 돌파. 심화 수학 전문 과정 강화.', icon: '⚕️', color: 'from-red-500 to-rose-600' },
                        { year: '2025', title: '15주년, 새로운 도약', desc: '누적 합격자 320명 돌파. AI 기반 학습 분석 시스템 도입 예정.', icon: '🚀', color: 'from-indigo-600 to-purple-600' },
                    ].map((item, i) => (
                        <ScrollReveal key={item.year} delay={0.05 * i}>
                            <div className={cn(
                                "relative flex items-start gap-4 md:gap-8 mb-8 last:mb-0",
                                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                            )}>
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm z-10 mt-5" />

                                {/* Content card */}
                                <div className={cn(
                                    "ml-10 md:ml-0 md:w-[calc(50%-2rem)] glass-card glass-card-hover rounded-2xl p-5",
                                    i % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto"
                                )}>
                                    <div className={cn(
                                        "flex items-center gap-3 mb-2",
                                        i % 2 === 0 ? "md:flex-row-reverse" : ""
                                    )}>
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <span className={cn(
                                                "inline-block px-2.5 py-0.5 text-xs font-bold text-white rounded-full bg-gradient-to-r mb-1",
                                                item.color
                                            )}>{item.year}</span>
                                            <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
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
                {isAdmin && (
                    <div className="flex justify-end mb-4">
                        <button onClick={openAddInst} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            <Plus className="w-4 h-4" /> 강사 추가
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {instructors.map((inst, i) => (
                        <div key={inst.id}>
                            <ScrollReveal delay={0.1 * i}>
                                <div className="glass-card glass-card-hover rounded-2xl overflow-hidden group relative">
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                                            <button onClick={() => openEditInst(inst)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                                            <button onClick={() => handleDeleteInst(inst.id)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                        </div>
                                    )}
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
                {isAdmin && (
                    <div className="flex justify-end mb-4">
                        <button onClick={openAddFac} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            <Plus className="w-4 h-4" /> 시설 사진 추가
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facilities.map((fac, i) => (
                        <ScrollReveal key={fac.id} delay={0.05 * i} direction="scale">
                            <div className="glass-card rounded-2xl overflow-hidden group relative">
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                                        <button onClick={() => openEditFac(fac)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                                        <button onClick={() => handleDeleteFac(fac.id)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                    </div>
                                )}
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={fac.imageUrl} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                                </div>
                                {fac.title && (
                                    <div className="p-3 text-center">
                                        <p className="text-sm font-medium text-slate-700">{fac.title}</p>
                                    </div>
                                )}
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

            {/* ─── 강사 모달 ─── */}
            {instModal && editInst && (
                <Modal title={instModal === 'add' ? '강사 추가' : '강사 수정'} onClose={closeInstModal}>
                    <div>
                        <label className={labelCls}>이름 *</label>
                        <input className={inputCls} value={editInst.name} onChange={e => setEditInst({ ...editInst, name: e.target.value })} placeholder="강사 이름" />
                    </div>
                    <div>
                        <label className={labelCls}>직책 *</label>
                        <input className={inputCls} value={editInst.title} onChange={e => setEditInst({ ...editInst, title: e.target.value })} placeholder="예: 원장 / 수학 전문 강사" />
                    </div>
                    <div>
                        <label className={labelCls}>설명 (학력·경력)</label>
                        <textarea className={inputCls + " h-20"} value={editInst.desc} onChange={e => setEditInst({ ...editInst, desc: e.target.value })} placeholder="줄바꿈으로 구분" />
                    </div>
                    <div>
                        <label className={labelCls}>프로필 이미지</label>
                        <ImageUploader
                            currentImageUrl={editInst.img}
                            onUpload={(result) => setEditInst({ ...editInst, img: result.url })}
                            onUrlChange={(url) => setEditInst({ ...editInst, img: url })}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>카드 배경 색상</label>
                        <div className="grid grid-cols-3 gap-2">
                            {colorOptions.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setEditInst({ ...editInst, color: c.value })}
                                    className={cn(
                                        "p-2 rounded-lg text-xs font-medium border-2 transition-all",
                                        editInst.color === c.value ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn("h-4 rounded bg-gradient-to-r mb-1", c.value)} />
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>순서</label>
                        <input type="number" className={inputCls} value={editInst.order} onChange={e => setEditInst({ ...editInst, order: Number(e.target.value) })} min={1} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={closeInstModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleSaveInst} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                            <Save className="w-4 h-4" /> 저장
                        </button>
                    </div>
                </Modal>
            )}

            {/* ─── 시설 모달 ─── */}
            {facModal && editFac && (
                <Modal title={facModal === 'add' ? '시설 사진 추가' : '시설 사진 수정'} onClose={closeFacModal}>
                    <div>
                        <label className={labelCls}>제목 *</label>
                        <input className={inputCls} value={editFac.title} onChange={e => setEditFac({ ...editFac, title: e.target.value })} placeholder="예: 강의실, 자습실" />
                    </div>
                    <div>
                        <label className={labelCls}>사진</label>
                        <ImageUploader
                            currentImageUrl={editFac.imageUrl}
                            onUpload={(result) => setEditFac({ ...editFac, imageUrl: result.url })}
                            onUrlChange={(url) => setEditFac({ ...editFac, imageUrl: url })}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>순서</label>
                        <input type="number" className={inputCls} value={editFac.order} onChange={e => setEditFac({ ...editFac, order: Number(e.target.value) })} min={1} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={closeFacModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleSaveFac} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                            <Save className="w-4 h-4" /> 저장
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
