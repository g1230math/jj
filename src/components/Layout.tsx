import React, { useState, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bus, Calendar, Home, Info, LogIn, LogOut, MessageSquare, Video, MapPin, Menu, X, Users, Phone, MessageCircle, Trophy, Flame, PenTool, Brain, CalendarCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ConsultModal } from './ConsultModal';
import { NotificationCenter } from './NotificationCenter';
import { GlobalSearch } from './GlobalSearch';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [consultOpen, setConsultOpen] = useState(false);

  // Scroll-aware header
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll-aware header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '학원소개', path: '/about', icon: Info },
    { name: '수강안내', path: '/courses', icon: BookOpen },
    { name: '학습', path: '/study', icon: PenTool },
    { name: '동영상강의', path: '/lectures', icon: Video },
    { name: '학사일정', path: '/calendar', icon: Calendar },
    { name: '차량운행', path: '/shuttle', icon: Bus },
    { name: '커뮤니티', path: '/community', icon: MessageSquare },
    { name: '성공스토리', path: '/success', icon: Trophy },
    { name: '학부모서비스', path: '/parent-service', icon: Users, requiresAuth: true },
    { name: '레벨테스트', path: '/level-test', icon: Brain },
    { name: '체험예약', path: '/trial', icon: CalendarCheck },
    { name: '오시는길', path: '/contact', icon: MapPin },
  ];

  const bottomNavItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '학습', path: '/study', icon: PenTool },
    { name: '강의', path: '/lectures', icon: Video },
    { name: '커뮤니티', path: '/community', icon: MessageSquare },
    { name: '전체메뉴', path: '__menu__', icon: Menu },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ═══ Header ═══ */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
          : "bg-white border-b border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/jj/logo.png" alt="진접 G1230 수학전문학원" className="h-[54px] object-contain" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors",
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <GlobalSearch />
              {/* 수능 D-day */}
              {(() => {
                const csatDate = new Date(2026, 10, 19); // 2026년 11월 19일 (목)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diff = Math.ceil((csatDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (diff <= 0) return null;
                return (
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg text-white shadow-sm shadow-rose-500/20">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">수능 D-{diff}</span>
                  </div>
                );
              })()}
              {user && <NotificationCenter />}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-indigo-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        {user.name[0]}
                      </div>
                    )}
                    <span className="hidden sm:inline font-semibold">{user.name} 님</span>
                  </Link>
                  <button onClick={() => logout()} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Link>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-lg overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
                {!user && (
                  <Link to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl mt-2"
                  >
                    <LogIn className="w-5 h-5" />
                    로그인
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ═══ Floating Contact Buttons ═══ */}
      <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col gap-3">
        <a
          href="http://pf.kakao.com/_TxoxeIX/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#FEE500] text-[#3C1E1E] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title="카카오톡 상담"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            카카오톡 상담
          </span>
        </a>
      </div>

      {/* ═══ Mobile Bottom Nav ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-1">
          {bottomNavItems.map((item) => {

            if (item.path === '__menu__') {
              return (
                <button
                  key="menu-toggle"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                    mobileMenuOpen ? "text-indigo-600" : "text-slate-400"
                  )}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span className="text-[10px] font-semibold">전체메뉴</span>
                </button>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 w-10 h-0.5 bg-indigo-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ═══ Footer ═══ */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img src="/jj/logo.png" alt="로고" className="h-10 brightness-0 invert opacity-90" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                경기도 남양주시 진접읍에 위치한 초·중·고 수학 전문 학원입니다.
                체계적인 커리큘럼과 꼼꼼한 관리로 학생들의 수학 실력을 책임집니다.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="http://pf.kakao.com/_TxoxeIX/chat" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-[#FEE500] hover:text-[#3C1E1E] rounded-xl flex items-center justify-center transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="tel:031-123-4567"
                  className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">바로가기</h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">학원소개</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">수강안내</Link></li>
                <li><Link to="/lectures" className="hover:text-white transition-colors">동영상 강의</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">학사일정</Link></li>
                <li><Link to="/success" className="hover:text-white transition-colors">합격 현황</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
                <li><Link to="/parent-service" className="hover:text-white transition-colors">학부모 서비스</Link></li>
                <li><Link to="/shuttle" className="hover:text-white transition-colors">셔틀버스</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">오시는 길</Link></li>
                <li>
                  <button onClick={() => setConsultOpen(true)} className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-left">
                    온라인 상담 신청
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">고객센터</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="tel:031-123-4567" className="hover:text-white transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="font-display font-semibold text-white">031-123-4567</span>
                  </a>
                </li>
                <li className="text-slate-400">평일 14:00 - 22:00</li>
                <li className="text-slate-400">경기도 남양주시 진접읍 해밀예당1로</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p className="font-display">&copy; 2025 진접 G1230 수학전문학원. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors">이용약관</button>
              <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors">개인정보처리방침</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  {legalModal === 'terms' ? '이용약관' : '개인정보처리방침'}
                </h2>
                <button onClick={() => setLegalModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
                {legalModal === 'terms' ? (
                  <>
                    <p className="text-xs text-slate-400">시행일: 2025년 1월 1일</p>

                    <h3 className="text-base font-bold text-slate-900">제1조 (목적)</h3>
                    <p>이 약관은 진접 G1230 수학전문학원(이하 "학원")이 제공하는 교육 서비스 및 웹사이트(이하 "서비스")의 이용 조건 및 절차, 학원과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제2조 (용어의 정의)</h3>
                    <p>① "회원"이란 학원에 개인정보를 제공하여 회원 등록을 한 학생 및 학부모를 말합니다.<br />② "서비스"란 학원이 제공하는 오프라인 수업, 온라인 강의실, 학습 자료 다운로드, 출결 확인, 성적 관리 등 일체의 교육 관련 서비스를 의미합니다.<br />③ "콘텐츠"란 학원이 제작·제공하는 강의 영상, 학습 자료, 시험 문제 등을 의미합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제3조 (약관의 효력과 변경)</h3>
                    <p>① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.<br />② 학원은 필요한 경우 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며, 변경 시 7일 전 공지합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제4조 (회원가입 및 서비스 이용)</h3>
                    <p>① 회원가입은 학부모 또는 법정대리인의 동의 하에 이루어집니다.<br />② 회원은 가입 시 정확한 정보를 제공해야 하며, 허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.<br />③ 만 14세 미만 아동의 경우 법정대리인의 동의를 받아 가입합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제5조 (서비스의 제공 및 변경)</h3>
                    <p>① 학원은 다음과 같은 서비스를 제공합니다: 수학 교과 수업(초·중·고), 온라인 강의실, 학습 자료 제공, 출결 관리, 성적표 조회, 학부모 상담 서비스.<br />② 학원은 운영상 필요한 경우 서비스의 내용을 변경할 수 있으며, 변경 시 사전에 공지합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제6조 (수강료 및 환불)</h3>
                    <p>① 수강료는 학원 원무실에서 안내하며, 카드결제·계좌이체·자동이체로 납부 가능합니다.<br />② 환불은 학원의 설립·운영 및 과외교습에 관한 법률에 따라 처리합니다.<br />③ 수강 시작 전 전액 환불, 수강 후에는 경과일수에 따라 일할 계산하여 환불합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제7조 (지식재산권)</h3>
                    <p>① 학원이 제공하는 모든 콘텐츠(강의 영상, 학습 자료, 시험 문제 등)의 저작권은 학원에 있습니다.<br />② 회원은 학원의 사전 동의 없이 콘텐츠를 복제, 배포, 방송, 전시할 수 없습니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제8조 (회원의 의무)</h3>
                    <p>① 회원은 학원의 수업 규칙과 안전 수칙을 준수해야 합니다.<br />② 타인의 개인정보를 도용하거나 학원 시설을 고의로 훼손하는 행위를 금지합니다.<br />③ 온라인 서비스 이용 시 타인의 학습을 방해하는 행위를 금지합니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제9조 (면책조항)</h3>
                    <p>① 학원은 천재지변, 전쟁, 감염병 등 불가항력 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.<br />② 회원의 귀책사유로 인한 서비스 이용 장애에 대해 학원은 책임지지 않습니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제10조 (분쟁 해결)</h3>
                    <p>이 약관과 관련된 분쟁은 대한민국 법률에 따르며, 관할법원은 학원 소재지를 관할하는 법원으로 합니다.</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400">시행일: 2025년 1월 1일</p>

                    <h3 className="text-base font-bold text-slate-900">제1조 (개인정보의 수집 및 이용 목적)</h3>
                    <p>진접 G1230 수학전문학원(이하 "학원")은 다음 목적을 위해 개인정보를 수집·이용합니다.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>회원 가입, 본인 확인, 서비스 제공</li>
                      <li>수업 배정, 출결 관리, 성적 관리 및 학부모 알림</li>
                      <li>수강료 결제 및 환불 처리</li>
                      <li>셔틀버스 운행 및 안전 관리</li>
                      <li>상담 신청 및 문의 응대</li>
                      <li>교육 서비스 개선 및 통계 분석</li>
                    </ul>

                    <h3 className="text-base font-bold text-slate-900">제2조 (수집하는 개인정보 항목)</h3>
                    <p><strong>필수항목:</strong> 학생 이름, 학년, 학교, 학부모 이름, 연락처(휴대전화), 주소<br /><strong>선택항목:</strong> 이메일, 이전 학원 수강 이력, 학습 수준 진단 결과<br /><strong>자동수집:</strong> 서비스 이용 기록, 접속 로그, IP 주소, 브라우저 정보</p>

                    <h3 className="text-base font-bold text-slate-900">제3조 (개인정보의 보유 및 이용 기간)</h3>
                    <p>① 회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.<br />② 수강료 결제 기록: 5년 (전자상거래법)<br />③ 출결 및 성적 기록: 수강 종료 후 1년<br />④ 상담 기록: 상담 종료 후 1년</p>

                    <h3 className="text-base font-bold text-slate-900">제4조 (개인정보의 제3자 제공)</h3>
                    <p>학원은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우 예외로 합니다.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>법령에 의거하여 수사 목적으로 관계기관의 요청이 있는 경우</li>
                      <li>이용자가 사전에 동의한 경우</li>
                    </ul>

                    <h3 className="text-base font-bold text-slate-900">제5조 (개인정보의 처리 위탁)</h3>
                    <p>학원은 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁할 수 있습니다.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>결제 처리: PG사 (수강료 결제 처리)</li>
                      <li>문자 발송: SMS 발송 대행업체 (출결 알림, 공지 전달)</li>
                    </ul>

                    <h3 className="text-base font-bold text-slate-900">제6조 (개인정보의 파기 절차 및 방법)</h3>
                    <p>① 전자적 파일: 복구 불가능한 방법으로 영구 삭제<br />② 종이 문서: 분쇄기로 파쇄 또는 소각</p>

                    <h3 className="text-base font-bold text-slate-900">제7조 (이용자의 권리)</h3>
                    <p>① 이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.<br />② 만 14세 미만 아동의 법정대리인은 아동의 개인정보에 대한 열람, 수정, 삭제를 요청할 수 있습니다.<br />③ 개인정보 수집·이용 동의를 철회할 수 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제8조 (개인정보의 안전성 확보 조치)</h3>
                    <p>학원은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>개인정보 접근 권한 제한 및 관리</li>
                      <li>개인정보의 암호화 저장 및 전송</li>
                      <li>해킹 등에 대비한 보안 시스템 운영</li>
                      <li>개인정보 취급 직원의 교육 실시</li>
                    </ul>

                    <h3 className="text-base font-bold text-slate-900">제9조 (개인정보 보호책임자)</h3>
                    <p>성명: 김수학 (원장)<br />연락처: 031-123-4567<br />이메일: g1230math@naver.com</p>
                    <p>개인정보 관련 문의, 불만, 피해 구제 등은 위 담당자에게 연락해 주시기 바랍니다.</p>

                    <h3 className="text-base font-bold text-slate-900">제10조 (고지의 의무)</h3>
                    <p>이 개인정보처리방침은 법령·정책 변경 또는 학원 내부 방침 변경에 따라 수정될 수 있으며, 변경 시 웹사이트 공지사항을 통해 안내합니다.</p>
                  </>
                )}
              </div>
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={() => setLegalModal(null)}
                  className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConsultModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
