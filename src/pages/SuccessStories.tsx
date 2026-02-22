import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, GraduationCap, Star, TrendingUp, ChevronDown, ChevronUp, Quote, Sparkles, Award, BookOpen, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { getSuccessStories, saveSuccessStories, type SuccessStoryItem } from '../data/mockData';

type YearFilter = '전체' | '2025' | '2024' | '2023';
type CategoryFilter = '전체' | '서울권' | '경기권' | '의약학' | '교대';

/* ─── helpers ─── */
const genId = (prefix: string) => `${prefix}_${Date.now()}`;
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

/* ─── Modal (top-level) ─── */
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

const colorOptions = [
    { label: '인디고-블루', value: 'from-indigo-600 to-blue-600' },
    { label: '블루-시안', value: 'from-blue-600 to-cyan-600' },
    { label: '로즈-핑크', value: 'from-rose-600 to-pink-600' },
    { label: '에머럴드-틸', value: 'from-emerald-600 to-teal-600' },
    { label: '앰버-오렌지', value: 'from-amber-600 to-orange-600' },
    { label: '바이올렛-인디고', value: 'from-violet-600 to-indigo-600' },
];

export function SuccessStories() {
    const { isAdmin } = useAuth();
    const [yearFilter, setYearFilter] = useState<YearFilter>('전체');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('전체');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // ── 합격 스토리 state ──
    const [stories, setStories] = useState<SuccessStoryItem[]>(getSuccessStories);
    const [storyModal, setStoryModal] = useState<'add' | 'edit' | null>(null);
    const [editStory, setEditStory] = useState<SuccessStoryItem | null>(null);

    const filtered = stories.filter(s => {
        if (yearFilter !== '전체' && s.year !== yearFilter) return false;
        if (categoryFilter !== '전체' && s.region !== categoryFilter) return false;
        return true;
    });

    const highlighted = filtered.filter(s => s.highlight);
    const others = filtered.filter(s => !s.highlight);

    /* ─── CRUD ─── */
    const emptyStory = (): SuccessStoryItem => ({
        id: genId('s'), name: '', school: '', department: '', admissionType: '', region: '서울권',
        year: '2025', previousSchool: '', quote: '', gradeFrom: undefined, gradeTo: undefined,
        highlight: false, avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${Date.now()}&backgroundColor=c0aede`, color: colorOptions[0].value,
    });

    const openAddStory = () => { setEditStory(emptyStory()); setStoryModal('add'); };
    const openEditStory = (story: SuccessStoryItem) => { setEditStory({ ...story }); setStoryModal('edit'); };
    const closeStoryModal = () => { setStoryModal(null); setEditStory(null); };

    const handleSaveStory = () => {
        if (!editStory || !editStory.name.trim() || !editStory.school.trim()) return;
        let updated: SuccessStoryItem[];
        if (storyModal === 'add') {
            updated = [editStory, ...stories];
        } else {
            updated = stories.map(s => s.id === editStory.id ? editStory : s);
        }
        setStories(updated);
        saveSuccessStories(updated);
        closeStoryModal();
    };

    const handleDeleteStory = (id: string) => {
        if (!confirm('이 합격 스토리를 삭제하시겠습니까?')) return;
        const updated = stories.filter(s => s.id !== id);
        setStories(updated);
        saveSuccessStories(updated);
    };

    /* ─── story card renderer (shared between highlighted & others) ─── */
    const renderHighlightedCard = (story: SuccessStoryItem, i: number) => (
        <ScrollReveal key={story.id} delay={0.1 * i}>
            <div className="relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
                {isAdmin && (
                    <div className="absolute top-3 right-3 z-10 flex gap-1">
                        <button onClick={() => openEditStory(story)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                        <button onClick={() => handleDeleteStory(story.id)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                    </div>
                )}
                <div className={cn("h-2 bg-gradient-to-r", story.color)} />
                <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                        <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full border-2 border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-slate-900">{story.name}</h3>
                                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full", regionColors[story.region])}>{story.region}</span>
                            </div>
                            <p className="text-sm font-semibold text-indigo-600 mt-0.5">{story.school} {story.department}</p>
                            <p className="text-xs text-slate-500">{story.admissionType} · {story.previousSchool} 출신</p>
                        </div>
                    </div>
                    {story.gradeFrom != null && story.gradeTo != null && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-slate-50 rounded-xl">
                            <span className="text-sm text-slate-500">수학 등급</span>
                            <span className="text-lg font-bold text-slate-400">{story.gradeFrom}등급</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-lg font-bold text-emerald-600">{story.gradeTo}등급</span>
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
    );

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

            {/* Filters + Admin Add */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Year */}
                        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto">
                            {(['전체', '2025', '2024', '2023'] as YearFilter[]).map(year => (
                                <button
                                    key={year}
                                    onClick={() => setYearFilter(year)}
                                    className={cn(
                                        "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        yearFilter === year ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >{year === '전체' ? '전체 연도' : `${year}학년도`}</button>
                            ))}
                        </div>
                        {/* Category */}
                        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto">
                            {(['전체', '서울권', '경기권', '의약학', '교대'] as CategoryFilter[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={cn(
                                        "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                        categoryFilter === cat ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >{cat}</button>
                            ))}
                        </div>
                        {/* Admin add */}
                        {isAdmin && (
                            <button onClick={openAddStory} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shrink-0 ml-auto">
                                <Plus className="w-4 h-4" /> 스토리 추가
                            </button>
                        )}
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
                            {highlighted.map((story, i) => renderHighlightedCard(story, i))}
                        </div>
                    </div>
                )}

                {/* All results accordion */}
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
                                        className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow", isExpanded && "shadow-md")}
                                    >
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : story.id)}
                                                className="flex-1 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={story.avatar} alt={story.name} className="w-10 h-10 rounded-full border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                                                    <div className="text-left">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-sm text-slate-900">{story.name}</span>
                                                            <span className="font-semibold text-sm text-indigo-600">{story.school} {story.department}</span>
                                                            <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full", regionColors[story.region])}>{story.region}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">{story.admissionType} · {story.previousSchool} · {story.year}학년도</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {story.gradeFrom != null && story.gradeTo != null && (
                                                        <div className="hidden sm:flex items-center gap-1.5 text-xs">
                                                            <span className="text-slate-400 font-bold">{story.gradeFrom}등급</span>
                                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                            <span className="text-emerald-600 font-bold">{story.gradeTo}등급</span>
                                                        </div>
                                                    )}
                                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                                </div>
                                            </button>
                                            {isAdmin && (
                                                <div className="flex gap-1 pr-3">
                                                    <button onClick={() => openEditStory(story)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                                                    <button onClick={() => handleDeleteStory(story.id)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                                </div>
                                            )}
                                        </div>
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
                                                            {story.gradeFrom != null && story.gradeTo != null && (
                                                                <div className="sm:hidden flex items-center gap-1.5 text-xs mb-2">
                                                                    <span className="text-slate-400 font-bold">{story.gradeFrom}등급</span>
                                                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                                    <span className="text-emerald-600 font-bold">{story.gradeTo}등급</span>
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

            {/* ─── 스토리 추가/수정 모달 ─── */}
            {storyModal && editStory && (
                <Modal title={storyModal === 'add' ? '합격 스토리 추가' : '합격 스토리 수정'} onClose={closeStoryModal}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>이름 *</label>
                            <input className={inputCls} value={editStory.name} onChange={e => setEditStory({ ...editStory, name: e.target.value })} placeholder="김○○" />
                        </div>
                        <div>
                            <label className={labelCls}>출신 고교</label>
                            <input className={inputCls} value={editStory.previousSchool} onChange={e => setEditStory({ ...editStory, previousSchool: e.target.value })} placeholder="진접고" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>합격 대학 *</label>
                            <input className={inputCls} value={editStory.school} onChange={e => setEditStory({ ...editStory, school: e.target.value })} placeholder="서울대학교" />
                        </div>
                        <div>
                            <label className={labelCls}>학과</label>
                            <input className={inputCls} value={editStory.department} onChange={e => setEditStory({ ...editStory, department: e.target.value })} placeholder="수학교육과" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>전형 유형</label>
                            <input className={inputCls} value={editStory.admissionType} onChange={e => setEditStory({ ...editStory, admissionType: e.target.value })} placeholder="수시 학생부종합" />
                        </div>
                        <div>
                            <label className={labelCls}>지역 분류</label>
                            <select className={inputCls} value={editStory.region} onChange={e => setEditStory({ ...editStory, region: e.target.value as SuccessStoryItem['region'] })}>
                                <option value="서울권">서울권</option>
                                <option value="경기권">경기권</option>
                                <option value="의약학">의약학</option>
                                <option value="교대">교대</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>합격 연도</label>
                            <input className={inputCls} value={editStory.year} onChange={e => setEditStory({ ...editStory, year: e.target.value })} placeholder="2025" />
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editStory.highlight} onChange={e => setEditStory({ ...editStory, highlight: e.target.checked })} className="rounded border-slate-300" />
                                <span className="text-sm text-slate-700">⭐ 주요 합격 (강조 표시)</span>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>이전 등급 (선택)</label>
                            <input type="number" className={inputCls} value={editStory.gradeFrom ?? ''} onChange={e => setEditStory({ ...editStory, gradeFrom: e.target.value ? Number(e.target.value) : undefined })} placeholder="4" min={1} max={9} />
                        </div>
                        <div>
                            <label className={labelCls}>합격 시 등급</label>
                            <input type="number" className={inputCls} value={editStory.gradeTo ?? ''} onChange={e => setEditStory({ ...editStory, gradeTo: e.target.value ? Number(e.target.value) : undefined })} placeholder="1" min={1} max={9} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>합격 후기</label>
                        <textarea className={inputCls + " h-20"} value={editStory.quote} onChange={e => setEditStory({ ...editStory, quote: e.target.value })} placeholder="학생의 합격 후기를 입력하세요" />
                    </div>
                    <div>
                        <label className={labelCls}>카드 색상</label>
                        <div className="grid grid-cols-3 gap-2">
                            {colorOptions.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setEditStory({ ...editStory, color: c.value })}
                                    className={cn(
                                        "p-2 rounded-lg text-xs font-medium border-2 transition-all",
                                        editStory.color === c.value ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn("h-3 rounded bg-gradient-to-r mb-1", c.value)} />
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={closeStoryModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleSaveStory} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                            <Save className="w-4 h-4" /> 저장
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
