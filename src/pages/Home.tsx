import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorProfiles, getHomeStats, saveHomeStats, getHomeTestimonials, saveHomeTestimonials, getProgramFeatures, saveProgramFeatures, addConsultRequest, type HomeStat, type HomeTestimonial, type HomeProgramFeature, type NoticeItem } from '../data/mockData';
import { ArrowRight, BookOpen, Calendar as CalendarIcon, PlayCircle, Users, Star, Trophy, Clock, Sparkles, GraduationCap, Calculator, ChevronLeft, ChevronRight, Quote, Phone, Plus, Edit2, Trash2, Save, X, CheckCircle, Send } from 'lucide-react';
import { getNotices, calendarEvents } from '../data/mockData';
import emailjs from '@emailjs/browser';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';
import { PopupBanner } from '../components/PopupBanner';
import { useAuth } from '../context/AuthContext';

/* ─── helpers ─── */
const genId = (p: string) => `${p}_${Date.now()}`;

/* ─── Modal ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

// ─── Static program shell (styling only) ───
const programShells = [
  { id: 'elementary' as const, label: '초등부', icon: Sparkles, color: 'from-emerald-500 to-teal-600', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700', grades: '초3 ~ 초6', schedule: '주 2~3회 | 15:00-17:00', capacity: '반별 8명 정원' },
  { id: 'middle' as const, label: '중등부', icon: Calculator, color: 'from-blue-500 to-indigo-600', lightBg: 'bg-blue-50', lightText: 'text-blue-700', grades: '중1 ~ 중3', schedule: '주 3회 + 주말 특강 | 17:00-19:30', capacity: '반별 8명 정원' },
  { id: 'high' as const, label: '고등부', icon: GraduationCap, color: 'from-indigo-500 to-purple-600', lightBg: 'bg-indigo-50', lightText: 'text-indigo-700', grades: '고1 ~ 고3', schedule: '주 3~4회 | 19:00-22:00', capacity: '반별 6명 정원' },
];

const statColors = [
  'from-indigo-500/20 to-indigo-600/10',
  'from-emerald-500/20 to-emerald-600/10',
  'from-amber-500/20 to-amber-600/10',
  'from-purple-500/20 to-purple-600/10',
];

// ─── Component ──────────────────────────────────────
export function Home() {
  const { isAdmin } = useAuth();
  const [activeProgram, setActiveProgram] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const currentShell = programShells[activeProgram];

  // Dynamic data
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>([]);
  const [programFeatures, setProgramFeatures] = useState<HomeProgramFeature[]>([]);
  const [instructorProfiles, setInstructorProfiles] = useState<any[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    getHomeStats().then(setStats);
    getHomeTestimonials().then(t => setTestimonials(t.sort((a, b) => a.order - b.order)));
    getProgramFeatures().then(setProgramFeatures);
    getInstructorProfiles().then(setInstructorProfiles);
    getNotices().then(setNotices);
  }, []);

  const currentFeatures = programFeatures.filter(f => f.departmentId === currentShell.id).sort((a, b) => a.order - b.order);

  // ── Stats CRUD ──
  const [statModal, setStatModal] = useState<'add' | 'edit' | null>(null);
  const [editStat, setEditStat] = useState<HomeStat | null>(null);
  const openAddStat = () => { setEditStat({ id: genId('hs'), label: '', value: 0, suffix: '', desc: '', order: stats.length + 1 }); setStatModal('add'); };
  const openEditStat = (s: HomeStat) => { setEditStat({ ...s }); setStatModal('edit'); };
  const closeStat = () => { setStatModal(null); setEditStat(null); };
  const handleSaveStat = async () => {
    if (!editStat || !editStat.label.trim()) return;
    let updated = statModal === 'add' ? [...stats, editStat] : stats.map(s => s.id === editStat.id ? editStat : s);
    updated.sort((a, b) => a.order - b.order);
    setStats(updated); await saveHomeStats(updated); closeStat();
  };
  const handleDeleteStat = async (id: string) => { if (!confirm('삭제하시겠습니까?')) return; const u = stats.filter(s => s.id !== id); setStats(u); await saveHomeStats(u); };

  // ── Testimonial CRUD ──
  const [testModal, setTestModal] = useState<'add' | 'edit' | null>(null);
  const [editTest, setEditTest] = useState<HomeTestimonial | null>(null);
  const openAddTest = () => { setEditTest({ id: genId('ht'), name: '', grade: '', content: '', before: 0, after: 0, order: testimonials.length + 1 }); setTestModal('add'); };
  const openEditTest = (t: HomeTestimonial) => { setEditTest({ ...t }); setTestModal('edit'); };
  const closeTest = () => { setTestModal(null); setEditTest(null); };
  const handleSaveTest = async () => {
    if (!editTest || !editTest.content.trim()) return;
    let updated = testModal === 'add' ? [...testimonials, editTest] : testimonials.map(t => t.id === editTest.id ? editTest : t);
    updated.sort((a, b) => a.order - b.order);
    setTestimonials(updated); await saveHomeTestimonials(updated); closeTest();
    if (testimonialIdx >= updated.length) setTestimonialIdx(0);
  };
  const handleDeleteTest = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const u = testimonials.filter(t => t.id !== id); setTestimonials(u); await saveHomeTestimonials(u);
    if (testimonialIdx >= u.length) setTestimonialIdx(Math.max(0, u.length - 1));
  };

  // ── Program Feature CRUD ──
  const [featModal, setFeatModal] = useState<'add' | 'edit' | null>(null);
  const [editFeat, setEditFeat] = useState<HomeProgramFeature | null>(null);
  const openAddFeat = () => { setEditFeat({ id: genId('pf'), departmentId: currentShell.id, title: '', desc: '', order: currentFeatures.length + 1 }); setFeatModal('add'); };
  const openEditFeat = (f: HomeProgramFeature) => { setEditFeat({ ...f }); setFeatModal('edit'); };
  const closeFeat = () => { setFeatModal(null); setEditFeat(null); };
  const handleSaveFeat = async () => {
    if (!editFeat || !editFeat.title.trim()) return;
    let updated = featModal === 'add' ? [...programFeatures, editFeat] : programFeatures.map(f => f.id === editFeat.id ? editFeat : f);
    setProgramFeatures(updated); await saveProgramFeatures(updated); closeFeat();
  };
  const handleDeleteFeat = async (id: string) => { if (!confirm('삭제하시겠습니까?')) return; const u = programFeatures.filter(f => f.id !== id); setProgramFeatures(u); await saveProgramFeatures(u); };

  // ── Consult Request ──
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultSending, setConsultSending] = useState(false);
  const [consultForm, setConsultForm] = useState({ studentSchool: '', studentGrade: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
  const resetConsult = () => { setConsultOpen(false); setConsultSubmitted(false); setConsultForm({ studentSchool: '', studentGrade: '', phone: '', preferredDate: '', preferredTime: '', message: '' }); };
  const handleConsultSubmit = async () => {
    if (!consultForm.studentSchool || !consultForm.studentGrade || !consultForm.phone || !consultForm.preferredDate || !consultForm.preferredTime) return;
    setConsultSending(true);
    await addConsultRequest(consultForm);
    // EmailJS
    try {
      const svcId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const tplId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const pubKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (svcId && tplId && pubKey) {
        await emailjs.send(svcId, tplId, {
          studentInfo: `${consultForm.studentSchool} ${consultForm.studentGrade}`,
          phone: consultForm.phone,
          preferredDate: consultForm.preferredDate,
          preferredTime: consultForm.preferredTime,
          message: consultForm.message || '(없음)',
          createdAt: new Date().toLocaleString('ko-KR'),
        }, pubKey);
      }
    } catch (e) { console.warn('EmailJS 발송 실패 (로컬 저장은 완료됨):', e); }
    setConsultSending(false);
    setConsultSubmitted(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <PopupBanner />

        {/* ═══════ HERO ═══════ */}
        <section className="relative bg-slate-900 text-white overflow-hidden min-h-[560px] flex items-center wave-divider wave-divider-white">
          <div className="absolute inset-0">
            <img src="https://picsum.photos/seed/mathclass2025/1920/1080" alt="" className="w-full h-full object-cover opacity-10" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/85 to-purple-900/70" />
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 2 }} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="text-badge inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  2025년 봄학기 수강생 모집 중
                </motion.div>

                <h1 className="text-hero text-white mb-6">
                  수학의 <span className="text-gradient-blue">본질</span>을 꿰뚫는<br />
                  확실한 성적 향상
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-light">
                  진접 최고의 강사진과 체계적인 관리 시스템으로<br />
                  초등부터 수능까지 완벽하게 대비합니다.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/courses" className="inline-flex items-center px-7 py-3.5 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
                    수강 안내 보기 <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/lectures" className="inline-flex items-center px-7 py-3.5 font-medium rounded-xl text-slate-200 border border-slate-500/50 hover:bg-white/10 transition-all backdrop-blur-sm">
                    <PlayCircle className="w-5 h-5 mr-2" /> 온라인 강의실
                  </Link>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="hidden lg:block relative">
                {isAdmin && (
                  <div className="flex justify-end mb-2 gap-2">
                    <button onClick={openAddStat} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"><Plus className="w-3 h-3" /> 통계 추가</button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {stats.sort((a, b) => a.order - b.order).map((stat, i) => (
                    <motion.div key={stat.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                      className={cn("bg-gradient-to-br border border-white/10 rounded-2xl p-5 backdrop-blur-sm relative group", statColors[i % statColors.length])}>
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditStat(stat)} className="p-1 bg-white/20 hover:bg-white/30 rounded"><Edit2 className="w-3 h-3 text-white" /></button>
                          <button onClick={() => handleDeleteStat(stat.id)} className="p-1 bg-red-500/60 hover:bg-red-500/80 rounded"><Trash2 className="w-3 h-3 text-white" /></button>
                        </div>
                      )}
                      <div className="text-stat-label text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-stat-number text-white">
                        <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                        <span className="text-lg text-slate-300 ml-1 font-medium">{stat.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:hidden mt-10 grid grid-cols-3 gap-3">
              {stats.slice(0, 3).map(stat => (
                <div key={stat.id} className="text-center bg-white/5 border border-white/10 rounded-xl py-3 backdrop-blur-sm">
                  <div className="text-lg font-bold font-display text-white">{stat.value}{stat.suffix}<span className="text-sm">{stat.desc}</span></div>
                  <div className="text-[11px] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════ PROGRAMS (Tabbed) ═══════ */}
        <Section className="bg-white">
          <SectionHeader
            badge="CURRICULUM"
            title="학년별 맞춤 프로그램"
            subtitle="초등부터 고등까지, 수준별·학년별 소수정예 맞춤 수업으로 확실한 성적 향상을 이끕니다."
          />

          {/* Tab buttons */}
          <ScrollReveal className="flex justify-center mb-10">
            <div className="w-full overflow-x-auto flex justify-center">
              <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
                {programShells.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProgram(i)}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                      activeProgram === i
                        ? "bg-white text-slate-900 shadow-md"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <p.icon className="w-4 h-4" />
                    {p.label}
                    <span className={cn("hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full", activeProgram === i ? cn(p.lightBg, p.lightText) : "bg-slate-200 text-slate-500")}>
                      {p.grades}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Tab content */}
          <AnimatePresence>
            <motion.div
              key={currentShell.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {currentFeatures.map((f, i) => (
                  <div key={f.id} className="glass-card glass-card-hover rounded-2xl p-7 relative group">
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditFeat(f)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded"><Edit2 className="w-3 h-3 text-slate-500" /></button>
                        <button onClick={() => handleDeleteFeat(f.id)} className="p-1 bg-red-100 hover:bg-red-200 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                      </div>
                    )}
                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-5", currentShell.color)}>
                      <span className="text-xl font-bold font-display">{i + 1}</span>
                    </div>
                    <h3 className="text-card-title text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-card-desc">{f.desc}</p>
                  </div>
                ))}
                {isAdmin && (
                  <button onClick={openAddFeat} className="glass-card rounded-2xl p-7 border-2 border-dashed border-slate-300 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">항목 추가</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{currentShell.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{currentShell.capacity}</span>
                </div>
                <Link to="/courses" className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700">
                  자세히 보기 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* ═══════ INSTRUCTORS ═══════ */}
        <Section className="bg-slate-50">
          <SectionHeader
            badge="INSTRUCTORS"
            title="검증된 강사진"
            subtitle="풍부한 강의 경험과 전문성을 갖춘 최고의 강사진이 함께합니다."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {instructorProfiles.map((instructor, i) => (
              <div key={instructor.id}>
                <ScrollReveal delay={i * 0.1}>
                  <div className="glass-card glass-card-hover rounded-2xl overflow-hidden group">
                    <div className="aspect-[4/5] bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                      <img
                        src={instructor.img}
                        alt={instructor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = 'none';
                          el.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                          const span = document.createElement('span');
                          span.className = 'text-6xl font-bold text-slate-400/50 font-display';
                          span.textContent = instructor.name[0];
                          el.parentElement!.appendChild(span);
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-card-title text-slate-900">{instructor.name}</h3>
                      <p className="text-sm text-indigo-600 font-medium mb-1">{instructor.title}</p>
                      <p className="text-xs text-slate-500 whitespace-pre-line">{instructor.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════ TESTIMONIALS ═══════ */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden wave-divider wave-divider-white">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,.5) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,.5) 0%, transparent 50%)',
          }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <SectionHeader
              badge="REVIEWS"
              title="학생·학부모 후기"
              subtitle="G1230에서 경험한 실제 성적 변화를 확인해보세요."
              dark
            />
            {isAdmin && (
              <div className="flex justify-center mb-6">
                <button onClick={openAddTest} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"><Plus className="w-4 h-4" /> 후기 추가</button>
              </div>
            )}

            {testimonials.length > 0 && (
              <div className="max-w-3xl mx-auto relative">
                <AnimatePresence>
                  <motion.div
                    key={testimonialIdx}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-dark rounded-3xl p-8 md:p-10 relative"
                  >
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => openEditTest(testimonials[testimonialIdx])} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"><Edit2 className="w-4 h-4 text-white" /></button>
                        <button onClick={() => handleDeleteTest(testimonials[testimonialIdx].id)} className="p-1.5 bg-red-500/40 hover:bg-red-500/60 rounded-lg"><Trash2 className="w-4 h-4 text-white" /></button>
                      </div>
                    )}
                    <Quote className="w-10 h-10 text-indigo-400/40 mb-4" />
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 font-light">
                      "{testimonials[testimonialIdx].content}"
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{testimonials[testimonialIdx].name}</div>
                        <div className="text-sm text-slate-400">{testimonials[testimonialIdx].grade}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-slate-500 mb-1">BEFORE</div>
                          <div className="text-2xl font-bold font-display text-slate-400">{testimonials[testimonialIdx].before}<span className="text-sm">점</span></div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-indigo-400" />
                        <div className="text-center">
                          <div className="text-xs text-emerald-400 mb-1">AFTER</div>
                          <div className="text-2xl font-bold font-display text-emerald-400">{testimonials[testimonialIdx].after}<span className="text-sm">점</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button onClick={() => setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button key={i} onClick={() => setTestimonialIdx(i)}
                        className={cn("w-2.5 h-2.5 rounded-full transition-all", i === testimonialIdx ? "bg-indigo-400 w-6" : "bg-white/30 hover:bg-white/50")} />
                    ))}
                  </div>
                  <button onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════ NOTICES + CALENDAR ═══════ */}
        <Section className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ScrollReveal className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-7">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    공지사항
                  </h2>
                  <Link to="/community" className="text-badge text-indigo-600 hover:text-indigo-700 flex items-center">
                    더보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {notices.map((notice) => (
                    <div key={notice.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-3 px-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        {notice.isNew && (
                          <span className="text-badge px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">NEW</span>
                        )}
                        <span className="text-slate-700 group-hover:text-indigo-600 transition-colors font-medium text-[15px]">
                          {notice.title}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400 font-display">{notice.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="glass-card rounded-2xl p-7 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    이달의 일정
                  </h2>
                  <Link to="/calendar" className="text-badge text-indigo-600 hover:text-indigo-700 flex items-center">
                    전체보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {calendarEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex gap-4 items-start group">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shrink-0 group-hover:border-indigo-200 transition-colors">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase font-display">{format(event.date, 'MMM', { locale: ko })}</span>
                        <span className="text-lg font-bold text-slate-900 leading-none font-display">{format(event.date, 'dd')}</span>
                      </div>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${event.color}`} />
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-display">
                            {event.type === 'academy' ? '학원일정' : event.type === 'school' ? '학교행사' : '시험일정'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-800">{event.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* ═══════ CTA BANNER ═══════ */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                지금 무료 상담을 신청하세요
              </h2>
              <p className="text-lg text-indigo-100 mb-10 font-light max-w-xl mx-auto">
                학생에게 맞는 반 배정과 커리큘럼을 안내드립니다.<br className="hidden sm:block" />
                무료 레벨 테스트도 함께 진행됩니다.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:031-123-4567" className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <Phone className="w-5 h-5 mr-2" />
                  031-123-4567
                </a>
                <button data-consult-btn onClick={() => setConsultOpen(true)} className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                  온라인 상담 신청 <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>

      {/* ═══ ADMIN MODALS ═══ */}
      {
        statModal && editStat && (
          <Modal title={statModal === 'add' ? '통계 추가' : '통계 수정'} onClose={closeStat}>
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={editStat.label} onChange={e => setEditStat({ ...editStat, label: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>숫자 값</label><input type="number" step="0.1" className={inputCls} value={editStat.value} onChange={e => setEditStat({ ...editStat, value: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className={labelCls}>소수점 자릿수</label><input type="number" className={inputCls} value={editStat.decimals || 0} onChange={e => setEditStat({ ...editStat, decimals: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>접미사 (suffix)</label><input className={inputCls} placeholder="예: +" value={editStat.suffix} onChange={e => setEditStat({ ...editStat, suffix: e.target.value })} /></div>
              <div><label className={labelCls}>단위 (desc)</label><input className={inputCls} placeholder="예: 명, %, 년" value={editStat.desc} onChange={e => setEditStat({ ...editStat, desc: e.target.value })} /></div>
            </div>
            <div><label className={labelCls}>순서</label><input type="number" className={inputCls} value={editStat.order} onChange={e => setEditStat({ ...editStat, order: parseInt(e.target.value) || 1 })} /></div>
            <button onClick={handleSaveStat} className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> 저장</button>
          </Modal>
        )
      }

      {
        testModal && editTest && (
          <Modal title={testModal === 'add' ? '후기 추가' : '후기 수정'} onClose={closeTest}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>이름</label><input className={inputCls} value={editTest.name} onChange={e => setEditTest({ ...editTest, name: e.target.value })} /></div>
              <div><label className={labelCls}>학년</label><input className={inputCls} placeholder="예: 중2, 초5" value={editTest.grade} onChange={e => setEditTest({ ...editTest, grade: e.target.value })} /></div>
            </div>
            <div><label className={labelCls}>후기 내용</label><textarea className={inputCls} rows={3} value={editTest.content} onChange={e => setEditTest({ ...editTest, content: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>BEFORE (점수)</label><input type="number" className={inputCls} value={editTest.before} onChange={e => setEditTest({ ...editTest, before: parseInt(e.target.value) || 0 })} /></div>
              <div><label className={labelCls}>AFTER (점수)</label><input type="number" className={inputCls} value={editTest.after} onChange={e => setEditTest({ ...editTest, after: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div><label className={labelCls}>순서</label><input type="number" className={inputCls} value={editTest.order} onChange={e => setEditTest({ ...editTest, order: parseInt(e.target.value) || 1 })} /></div>
            <button onClick={handleSaveTest} className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> 저장</button>
          </Modal>
        )
      }

      {
        featModal && editFeat && (
          <Modal title={featModal === 'add' ? '커리큘럼 항목 추가' : '커리큘럼 항목 수정'} onClose={closeFeat}>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={editFeat.title} onChange={e => setEditFeat({ ...editFeat, title: e.target.value })} /></div>
            <div><label className={labelCls}>설명</label><textarea className={inputCls} rows={2} value={editFeat.desc} onChange={e => setEditFeat({ ...editFeat, desc: e.target.value })} /></div>
            <div><label className={labelCls}>순서</label><input type="number" className={inputCls} value={editFeat.order} onChange={e => setEditFeat({ ...editFeat, order: parseInt(e.target.value) || 1 })} /></div>
            <button onClick={handleSaveFeat} className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> 저장</button>
          </Modal>
        )
      }

      {/* ═══ CONSULT MODAL ═══ */}
      {consultOpen && (
        <Modal title="무료 상담 신청" onClose={resetConsult}>
          {consultSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">상담 신청이 접수되었습니다!</h3>
              <p className="text-sm text-slate-500 mb-6">원장님 확인 후 연락 드리겠습니다.</p>
              <button onClick={resetConsult} className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">확인</button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={labelCls}>학교 <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="예: 진접중학교, 풍양중학교" value={consultForm.studentSchool} onChange={e => setConsultForm({ ...consultForm, studentSchool: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>학년 <span className="text-red-500">*</span></label>
                <select className={inputCls} value={consultForm.studentGrade} onChange={e => setConsultForm({ ...consultForm, studentGrade: e.target.value })}>
                  <option value="">선택하세요</option>
                  <option>초3</option><option>초4</option><option>초5</option><option>초6</option>
                  <option>중1</option><option>중2</option><option>중3</option>
                  <option>고1</option><option>고2</option><option>고3</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>전화번호 <span className="text-red-500">*</span></label>
                <input type="tel" className={inputCls} placeholder="010-0000-0000" value={consultForm.phone} onChange={e => setConsultForm({ ...consultForm, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>희망 날짜 <span className="text-red-500">*</span></label>
                  <input type="date" className={inputCls} value={consultForm.preferredDate} onChange={e => setConsultForm({ ...consultForm, preferredDate: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>희망 시간 <span className="text-red-500">*</span></label>
                  <select className={inputCls} value={consultForm.preferredTime} onChange={e => setConsultForm({ ...consultForm, preferredTime: e.target.value })}>
                    <option value="">선택</option>
                    <option>14:00</option><option>15:00</option><option>16:00</option>
                    <option>17:00</option><option>18:00</option><option>19:00</option>
                    <option>20:00</option><option>21:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>추가 메모 (선택)</label>
                <textarea className={inputCls} rows={2} placeholder="상담 요청 사항을 입력해주세요." value={consultForm.message} onChange={e => setConsultForm({ ...consultForm, message: e.target.value })} />
              </div>
              <button
                onClick={handleConsultSubmit}
                disabled={consultSending || !consultForm.studentSchool || !consultForm.studentGrade || !consultForm.phone || !consultForm.preferredDate || !consultForm.preferredTime}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {consultSending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 전송 중...</>
                ) : (
                  <><Send className="w-4 h-4" /> 상담 신청하기</>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center">로그인 없이 신청 가능합니다</p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
