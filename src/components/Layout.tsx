import React, { useState, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bus, Calendar, Home, Info, LogIn, LogOut, MessageSquare, Video, MapPin, Menu, X, Users, Phone, MessageCircle, Trophy, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { name: '동영상강의', path: '/lectures', icon: Video, requiresAuth: true },
    { name: '학사일정', path: '/calendar', icon: Calendar },
    { name: '차량운행', path: '/shuttle', icon: Bus },
    { name: '커뮤니티', path: '/community', icon: MessageSquare },
    { name: '성공스토리', path: '/success', icon: Trophy },
    { name: '학부모서비스', path: '/parent-service', icon: Users, requiresAuth: true },
    { name: '오시는길', path: '/contact', icon: MapPin },
  ];

  const bottomNavItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '수강안내', path: '/courses', icon: BookOpen },
    { name: '강의', path: '/lectures', icon: Video, requiresAuth: true },
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

            <div className="flex items-center gap-3">
              {/* 수능 D-day */}
              {(() => {
                const csatDate = new Date(2026, 10, 19); // 2026년 11월 19일 (목)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diff = Math.ceil((csatDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (diff <= 0) return null;
                return (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg text-white shadow-sm shadow-rose-500/20">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold whitespace-nowrap">수능 D-{diff}</span>
                  </div>
                );
              })()}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ═══ Floating Contact Buttons ═══ */}
      <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col gap-3">
        <a
          href="https://pf.kakao.com/_xjYourChannel"
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
            if (item.requiresAuth && !user) {
              return (
                <Link key="login-nav" to="/login" className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-slate-400">
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold">로그인</span>
                </Link>
              );
            }

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
                <a href="https://pf.kakao.com/_xjYourChannel" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-[#FEE500] hover:text-[#3C1E1E] rounded-xl flex items-center justify-center transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="tel:031-123-4567"
                  className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">바로가기</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">학원소개</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">수강안내</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">학사일정</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
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
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
