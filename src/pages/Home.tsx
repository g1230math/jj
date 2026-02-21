import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar as CalendarIcon, PlayCircle, Users, Star, Trophy, Clock, Sparkles, GraduationCap, Calculator, ChevronLeft, ChevronRight, Quote, Phone } from 'lucide-react';
import { notices, calendarEvents } from '../data/mockData';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ScrollReveal, CountUp, Section, SectionHeader } from '../components/ScrollReveal';

// ─── Data ───────────────────────────────────────────
const programs = [
  {
    id: 'elementary',
    label: '초등부',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-700',
    grades: '초3 ~ 초6',
    features: [
      { title: '연산/사고력 강화', desc: '기초 연산 능력과 수학적 사고력 개발에 초점' },
      { title: '서술형 대비', desc: '교과 서술형 문제 풀이 훈련으로 실전 감각 향상' },
      { title: '영재원 준비반', desc: '심화 사고력 및 영재교육원 입시 대비 특별반' },
    ],
    schedule: '주 2~3회 | 15:00-17:00',
    capacity: '반별 8명 정원',
  },
  {
    id: 'middle',
    label: '중등부',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    grades: '중1 ~ 중3',
    features: [
      { title: '내신 완벽 대비', desc: '교과서 분석, 기출 유형 훈련, 오답 클리닉 제공' },
      { title: '선행 학습', desc: '다음 학기 내용 미리 준비하여 학교 수업에서 자신감' },
      { title: '정기 모의고사', desc: '월 1회 실전 모의고사로 약점 파악 및 보완' },
    ],
    schedule: '주 3회 + 주말 특강 | 17:00-19:30',
    capacity: '반별 8명 정원',
  },
  {
    id: 'high',
    label: '고등부',
    icon: GraduationCap,
    color: 'from-indigo-500 to-purple-600',
    lightBg: 'bg-indigo-50',
    lightText: 'text-indigo-700',
    grades: '고1 ~ 고3',
    features: [
      { title: '수능 만점 전략', desc: 'EBS 연계 분석, 킬러 문항 집중 훈련 과정' },
      { title: '내신 1등급', desc: '학교별 기출 분석 + 내신 직전 집중 대비반 운영' },
      { title: '1:1 첨삭 관리', desc: '개인별 약점 분석 리포트와 맞춤형 보충 학습' },
    ],
    schedule: '주 3~4회 | 19:00-22:00',
    capacity: '반별 6명 정원',
  },
];

const testimonials = [
  {
    name: '김○○ 학부모',
    grade: '중2',
    content: '수학 성적이 60점대에서 94점으로 올랐습니다. 선생님의 꼼꼼한 관리와 오답 클리닉 덕분이에요.',
    before: 62,
    after: 94,
  },
  {
    name: '이○○ 학생',
    grade: '고1',
    content: '수학을 싫어했는데 여기서 개념부터 다시 잡고 나니까 자신감이 생겼어요. 이번 중간고사 1등급!',
    before: 71,
    after: 96,
  },
  {
    name: '박○○ 학부모',
    grade: '초5',
    content: '아이가 수학 학원을 즐거워합니다. 사고력 수업이 재밌다고 하네요. 영재원 준비도 잘 되고 있어요.',
    before: 78,
    after: 97,
  },
  {
    name: '최○○ 학생',
    grade: '중3',
    content: '고등 선행까지 탄탄하게 준비할 수 있어서 좋아요. 모의고사 성적도 꾸준히 상승 중입니다.',
    before: 55,
    after: 88,
  },
];

const instructors = [
  { name: '김수학', role: '원장 / 고등부 총괄', specialty: '수능 수학 15년 강의', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=KimMath&backgroundColor=c0aede&skinColor=f2d3b1' },
  { name: '이정현', role: '중등부 수학', specialty: '내신 만점 전략 전문가', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=LeeJH&backgroundColor=b6e3f4&skinColor=f2d3b1' },
  { name: '박서연', role: '초등부 사고력', specialty: '영재원 대비 전문', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ParkSY&backgroundColor=d1fae5&skinColor=f2d3b1' },
  { name: '정민호', role: '고등부 수학', specialty: '수능 킬러 문항 전문', img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JungMH&backgroundColor=fef3c7&skinColor=f2d3b1' },
];

// ─── Component ──────────────────────────────────────
export function Home() {
  const [activeProgram, setActiveProgram] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const currentProgram = programs[activeProgram];

  return (
    <div className="flex flex-col">

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

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: '누적 수강생', value: 1200, suffix: '+', desc: '명', color: 'from-indigo-500/20 to-indigo-600/10' },
                { label: '내신 1등급 비율', value: 87, suffix: '', desc: '%', color: 'from-emerald-500/20 to-emerald-600/10' },
                { label: '수업 만족도', value: 4.9, suffix: '', desc: '/5.0', color: 'from-amber-500/20 to-amber-600/10', decimals: 1 },
                { label: '운영', value: 15, suffix: '', desc: '년', color: 'from-purple-500/20 to-purple-600/10' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                  className={cn("bg-gradient-to-br border border-white/10 rounded-2xl p-5 backdrop-blur-sm", stat.color)}>
                  <div className="text-stat-label text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-stat-number text-white">
                    <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                    <span className="text-lg text-slate-300 ml-1 font-medium">{stat.desc}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:hidden mt-10 grid grid-cols-3 gap-3">
            {[
              { label: '수강생', value: '1,200+' },
              { label: '1등급 비율', value: '87%' },
              { label: '만족도', value: '4.9/5.0' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white/5 border border-white/10 rounded-xl py-3 backdrop-blur-sm">
                <div className="text-lg font-bold font-display text-white">{stat.value}</div>
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
          <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
            {programs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveProgram(i)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                  activeProgram === i
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <p.icon className="w-4 h-4" />
                {p.label}
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", activeProgram === i ? cn(p.lightBg, p.lightText) : "bg-slate-200 text-slate-500")}>
                  {p.grades}
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tab content */}
        <AnimatePresence>
          <motion.div
            key={currentProgram.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {currentProgram.features.map((f, i) => (
                <div key={i} className="glass-card glass-card-hover rounded-2xl p-7">
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-5", currentProgram.color)}>
                    <span className="text-xl font-bold font-display">{i + 1}</span>
                  </div>
                  <h3 className="text-card-title text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-card-desc">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">{currentProgram.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">{currentProgram.capacity}</span>
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
          {instructors.map((instructor, i) => (
            <div key={instructor.name}>
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
                    <p className="text-sm text-indigo-600 font-medium mb-1">{instructor.role}</p>
                    <p className="text-xs text-slate-500">{instructor.specialty}</p>
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

          <div className="max-w-3xl mx-auto relative">
            <AnimatePresence>
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-dark rounded-3xl p-8 md:p-10"
              >
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
              <Link to="/contact" className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                온라인 상담 신청 <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
