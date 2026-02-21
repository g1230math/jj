import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar as CalendarIcon, PlayCircle, Users, ChevronDown } from 'lucide-react';
import { notices, calendarEvents } from '../data/mockData';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const featureCards = [
  {
    title: '초등부', desc: '기초 탄탄 연산/사고력', icon: BookOpen, color: 'bg-emerald-500',
    detail: '초등 3~6학년 대상. 연산 능력 강화와 수학적 사고력 개발에 초점을 맞춥니다. 교과 과정에 맞춘 개념 학습, 서술형 문제 풀이 훈련, 영재원 대비 심화 수업까지 다양한 프로그램을 운영합니다. 주 2~3회 수업으로 수학에 대한 흥미와 자신감을 키워줍니다.',
    link: '/courses',
  },
  {
    title: '중등부', desc: '내신 완벽 대비', icon: Users, color: 'bg-blue-500',
    detail: '중1~3 학년별 세분화된 반 편성. 학교 내신 시험 완벽 대비를 위한 교과서 분석, 기출 유형 훈련, 오답 클리닉을 운영합니다. 선행 학습으로 다음 학기 내용을 미리 준비하고, 정기 모의고사로 실전 감각을 키웁니다. 주 3회 수업 + 주말 특강.',
    link: '/courses',
  },
  {
    title: '고등부', desc: '수능/내신 1등급', icon: PlayCircle, color: 'bg-indigo-500',
    detail: '고1~3 수준별 맞춤 수업. 내신 1등급과 수능 만점을 목표로 교과 개념 정리, EBS 연계 문제 분석, 킬러 문항 집중 훈련을 진행합니다. 수학I·II, 미적분, 확률과 통계, 기하 전 영역을 체계적으로 커버하며, 1:1 첨삭과 진도 관리를 제공합니다.',
    link: '/courses',
  },
  {
    title: '입학상담', desc: '1:1 맞춤 컨설팅', icon: CalendarIcon, color: 'bg-rose-500',
    detail: '학생의 현재 수학 실력을 정확히 진단하는 무료 레벨 테스트를 실시합니다. 결과를 바탕으로 최적의 반 배정과 학습 계획을 수립하고, 학부모님께 상세한 상담 리포트를 제공합니다. 전화(031-123-4567) 또는 홈페이지를 통해 상담을 예약하세요.',
    link: '/contact',
  },
];

export function Home() {
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <section className="relative bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/mathclass/1920/1080"
            alt="Classroom"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              수학의 <span className="text-indigo-400">본질</span>을 꿰뚫는<br />
              확실한 성적 향상
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-xl leading-relaxed">
              진접 최고의 강사진과 체계적인 관리 시스템으로<br />
              초등부터 수능까지 완벽하게 대비합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-900 bg-white hover:bg-indigo-50 transition-colors shadow-lg">
                수강 안내 보기
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border border-indigo-400 text-base font-medium rounded-lg text-white hover:bg-indigo-800 transition-colors">
                <PlayCircle className="w-5 h-5 mr-2" />
                온라인 강의실
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 -mt-20 relative z-10">
            {featureCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  "bg-white rounded-xl shadow-lg p-6 border transition-all cursor-pointer group",
                  openFeature === i ? "border-indigo-300 shadow-xl ring-2 ring-indigo-100" : "border-slate-100 hover:shadow-xl"
                )}
                onClick={() => setOpenFeature(openFeature === i ? null : i)}
              >
                <div className="flex items-start justify-between">
                  <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", openFeature === i && "rotate-180 text-indigo-500")} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
                <AnimatePresence>
                  {openFeature === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                        <Link to={item.link} className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          자세히 보기 <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  공지사항
                </h2>
                <Link to="/community" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
                  더보기 <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <div key={notice.id} className="py-4 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      {notice.isNew && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-600 rounded-full">NEW</span>
                      )}
                      <span className="text-slate-700 group-hover:text-indigo-600 transition-colors font-medium">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">{notice.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  이달의 일정
                </h2>
                <Link to="/calendar" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
                  전체보기 <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {calendarEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                      <span className="text-xs text-slate-500 font-medium">{format(event.date, 'MMM', { locale: ko })}</span>
                      <span className="text-lg font-bold text-slate-900 leading-none">{format(event.date, 'dd')}</span>
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${event.color}`}></span>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {event.type === 'academy' ? '학원일정' : event.type === 'school' ? '학교행사' : '시험일정'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{event.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
