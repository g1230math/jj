import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, Star, Users, ArrowRight, GraduationCap, Sparkles, Calculator, Phone, CheckCircle, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, Section, SectionHeader } from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { getCourseClasses, saveCourseClasses, type CourseClass, getDepartmentInfo, saveDepartmentInfo, type DepartmentInfo } from '../data/mockData';

/* ─── helpers ─── */
const genId = (prefix: string) => `${prefix}_${Date.now()}`;
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

/* ─── Modal (top-level, won't remount) ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">{children}</div>
            </div>
        </div>
    );
}

/* ─── Department meta (icons, colors — rarely change, keep static) ─── */
const departments = [
    {
        id: 'elementary' as const,
        name: '초등부',
        icon: Sparkles,
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        grades: '초3 ~ 초6',
        desc: '수학적 사고력과 연산 능력의 기초를 탄탄히',
        highlights: ['연산·사고력 강화', '서술형 문제 훈련', '영재원 대비'],
    },
    {
        id: 'middle' as const,
        name: '중등부',
        icon: Calculator,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        grades: '중1 ~ 중3',
        desc: '내신 완벽 대비, 수학 자신감 UP',
        highlights: ['교과서·기출 분석', '선행 학습', '월 1회 모의고사'],
    },
    {
        id: 'high' as const,
        name: '고등부',
        icon: GraduationCap,
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200',
        grades: '고1 ~ 고3',
        desc: '수능·내신 1등급을 향한 체계적 관리',
        highlights: ['EBS 연계 분석', '킬러 문항 훈련', '1:1 첨삭'],
    },
];

export function Courses() {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState(0);

    // ── 부서 배너 state ──
    const [deptInfoList, setDeptInfoList] = useState<DepartmentInfo[]>(getDepartmentInfo);
    const [deptModal, setDeptModal] = useState(false);
    const [editDept, setEditDept] = useState<DepartmentInfo | null>(null);
    const [editHighlightsText, setEditHighlightsText] = useState('');

    // merge static styling with dynamic content
    const mergedDepartments = departments.map(d => {
        const info = deptInfoList.find(i => i.id === d.id);
        return { ...d, grades: info?.grades ?? d.grades, desc: info?.desc ?? d.desc, highlights: info?.highlights ?? d.highlights };
    });
    const current = mergedDepartments[activeTab];

    // ── 수강 반 state ──
    const [allClasses, setAllClasses] = useState<CourseClass[]>(getCourseClasses);
    const [classModal, setClassModal] = useState<'add' | 'edit' | null>(null);
    const [editClass, setEditClass] = useState<CourseClass | null>(null);

    const currentClasses = allClasses
        .filter(c => c.departmentId === current.id)
        .sort((a, b) => a.order - b.order);

    /* ─── CRUD ─── */
    const emptyClass = (): CourseClass => ({
        id: genId('cc'), departmentId: current.id, name: '', time: '', price: '', students: 8, enrolled: 0, level: '', order: currentClasses.length + 1,
    });

    const openAddClass = () => { setEditClass(emptyClass()); setClassModal('add'); };
    const openEditClass = (cls: CourseClass) => { setEditClass({ ...cls }); setClassModal('edit'); };
    const closeClassModal = () => { setClassModal(null); setEditClass(null); };

    const handleSaveClass = () => {
        if (!editClass || !editClass.name.trim()) return;
        let updated: CourseClass[];
        if (classModal === 'add') {
            updated = [...allClasses, editClass];
        } else {
            updated = allClasses.map(c => c.id === editClass.id ? editClass : c);
        }
        setAllClasses(updated);
        saveCourseClasses(updated);
        closeClassModal();
    };

    const handleDeleteClass = (id: string) => {
        if (!confirm('이 반을 삭제하시겠습니까?')) return;
        const updated = allClasses.filter(c => c.id !== id);
        setAllClasses(updated);
        saveCourseClasses(updated);
    };

    /* ─── 부서 배너 수정 ─── */
    const openEditDept = () => {
        const info = deptInfoList.find(i => i.id === current.id) ?? { id: current.id as DepartmentInfo['id'], grades: current.grades, desc: current.desc, highlights: current.highlights };
        setEditDept({ ...info });
        setEditHighlightsText(info.highlights.join(', '));
        setDeptModal(true);
    };

    const handleSaveDept = () => {
        if (!editDept) return;
        const updatedInfo: DepartmentInfo = { ...editDept, highlights: editHighlightsText.split(',').map(s => s.trim()).filter(Boolean) };
        const updated = deptInfoList.map(d => d.id === updatedInfo.id ? updatedInfo : d);
        if (!updated.find(d => d.id === updatedInfo.id)) updated.push(updatedInfo);
        setDeptInfoList(updated);
        saveDepartmentInfo(updated);
        setDeptModal(false);
        setEditDept(null);
    };

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
            <Section className="bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
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
                        {departments.map((c, i) => (
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
                <AnimatePresence>
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Summary banner */}
                        <div className={cn("glass-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 relative group", current.borderColor)}>
                            {isAdmin && (
                                <button onClick={openEditDept} className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-lg hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                                </button>
                            )}
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

                        {/* Admin add button */}
                        {isAdmin && (
                            <div className="flex justify-end mb-4">
                                <button onClick={openAddClass} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Plus className="w-4 h-4" /> 반 추가
                                </button>
                            </div>
                        )}

                        {/* Class cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {currentClasses.map((cls) => {
                                const percentage = cls.students > 0 ? Math.round((cls.enrolled / cls.students) * 100) : 0;
                                const isAlmostFull = percentage >= 75;
                                return (
                                    <div key={cls.id} className="glass-card glass-card-hover rounded-2xl p-6 relative">
                                        {isAdmin && (
                                            <div className="absolute top-3 right-3 flex gap-1">
                                                <button onClick={() => openEditClass(cls)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                                                <button onClick={() => handleDeleteClass(cls.id)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                            </div>
                                        )}
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

                        {currentClasses.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>개설된 반이 없습니다.</p>
                                {isAdmin && <p className="text-sm mt-1">위의 "반 추가" 버튼으로 새 반을 추가하세요.</p>}
                            </div>
                        )}
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

            {/* ─── 반 추가/수정 모달 ─── */}
            {classModal && editClass && (
                <Modal title={classModal === 'add' ? '반 추가' : '반 수정'} onClose={closeClassModal}>
                    <div>
                        <label className={labelCls}>반 이름 *</label>
                        <input className={inputCls} value={editClass.name} onChange={e => setEditClass({ ...editClass, name: e.target.value })} placeholder="예: 기초 연산반" />
                    </div>
                    <div>
                        <label className={labelCls}>학부</label>
                        <select className={inputCls} value={editClass.departmentId} onChange={e => setEditClass({ ...editClass, departmentId: e.target.value as CourseClass['departmentId'] })}>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>대상 학년</label>
                        <input className={inputCls} value={editClass.level} onChange={e => setEditClass({ ...editClass, level: e.target.value })} placeholder="예: 초3~4, 중1~2" />
                    </div>
                    <div>
                        <label className={labelCls}>수업 시간</label>
                        <input className={inputCls} value={editClass.time} onChange={e => setEditClass({ ...editClass, time: e.target.value })} placeholder="예: 월/수/금 15:00-16:30" />
                    </div>
                    <div>
                        <label className={labelCls}>수강료 (월)</label>
                        <input className={inputCls} value={editClass.price} onChange={e => setEditClass({ ...editClass, price: e.target.value })} placeholder="예: 180,000원" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>정원</label>
                            <input type="number" className={inputCls} value={editClass.students} onChange={e => setEditClass({ ...editClass, students: Number(e.target.value) })} min={1} />
                        </div>
                        <div>
                            <label className={labelCls}>현재 등록 수</label>
                            <input type="number" className={inputCls} value={editClass.enrolled} onChange={e => setEditClass({ ...editClass, enrolled: Number(e.target.value) })} min={0} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>순서</label>
                        <input type="number" className={inputCls} value={editClass.order} onChange={e => setEditClass({ ...editClass, order: Number(e.target.value) })} min={1} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={closeClassModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleSaveClass} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                            <Save className="w-4 h-4" /> 저장
                        </button>
                    </div>
                </Modal>
            )}

            {/* ─── 부서 배너 수정 모달 ─── */}
            {deptModal && editDept && (
                <Modal title={`${departments.find(d => d.id === editDept.id)?.name ?? ''} 배너 수정`} onClose={() => { setDeptModal(false); setEditDept(null); }}>
                    <div>
                        <label className={labelCls}>대상 학년 *</label>
                        <input className={inputCls} value={editDept.grades} onChange={e => setEditDept({ ...editDept, grades: e.target.value })} placeholder="예: 초3 ~ 초6" />
                    </div>
                    <div>
                        <label className={labelCls}>설명 *</label>
                        <input className={inputCls} value={editDept.desc} onChange={e => setEditDept({ ...editDept, desc: e.target.value })} placeholder="예: 수학적 사고력과 연산 능력의 기초를 탄탄히" />
                    </div>
                    <div>
                        <label className={labelCls}>하이라이트 (쉼표로 구분)</label>
                        <input className={inputCls} value={editHighlightsText} onChange={e => setEditHighlightsText(e.target.value)} placeholder="예: 연산·사고력 강화, 서술형 문제 훈련, 영재원 대비" />
                        <p className="text-xs text-slate-400 mt-1">배지로 표시됩니다. 쉼표(,)로 구분해주세요.</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => { setDeptModal(false); setEditDept(null); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleSaveDept} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                            <Save className="w-4 h-4" /> 저장
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
