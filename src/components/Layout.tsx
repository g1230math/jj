import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bus, Calendar, Home, Info, LogIn, LogOut, MessageSquare, Video, MapPin, Menu, X, Users, Phone, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '학원소개', path: '/about', icon: Info },
    { name: '수강안내', path: '/courses', icon: BookOpen },
    { name: '동영상강의', path: '/lectures', icon: Video, requiresAuth: true },
    { name: '학사일정', path: '/calendar', icon: Calendar },
    { name: '차량운행', path: '/shuttle', icon: Bus },
    { name: '커뮤니티', path: '/community', icon: MessageSquare },
    { name: '학부모서비스', path: '/parent-service', icon: Users, requiresAuth: true },
    { name: '오시는길', path: '/contact', icon: MapPin },
  ];

  // Mobile bottom nav items (subset for quick access)
  const bottomNavItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '수강안내', path: '/courses', icon: BookOpen },
    { name: '강의', path: '/lectures', icon: Video, requiresAuth: true },
    { name: '커뮤니티', path: '/community', icon: MessageSquare },
    { name: '전체메뉴', path: '__menu__', icon: Menu },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img src="/jj/logo.png" alt="진접 G1230 수학전문학원" className="h-[60px] object-contain" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                      isActive
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {user.name[0]}
                      </div>
                    )}
                    <span className="hidden sm:inline">{user.name} 님</span>
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="p-2 text-slate-400 hover:text-slate-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Link>
              )}

              {/* Mobile Menu Button - hidden on mobile since bottom nav handles it */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Full overlay) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-slate-200 shadow-lg overflow-hidden"
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
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
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
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl mt-2"
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

      <main className="flex-1 pb-16 md:pb-0">
        {/* Page transition animation */}
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

      {/* Floating Contact Buttons (right side) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col gap-3">
        {/* Kakao Talk */}
        <a
          href="https://pf.kakao.com/_xjYourChannel"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#FEE500] text-[#3C1E1E] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title="카카오톡 상담"
        >
          <MessageCircle className="w-6 h-6" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            카카오톡 상담
          </span>
        </a>

        {/* Phone Call */}
        <a
          href="tel:031-123-4567"
          className="group relative flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title="전화 문의"
        >
          <Phone className="w-6 h-6" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            031-123-4567
          </span>
        </a>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-1">
          {bottomNavItems.map((item) => {
            if (item.requiresAuth && !user) {
              return (
                <Link
                  key="login-nav"
                  to="/login"
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-slate-400"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">로그인</span>
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
                  <span className="text-[10px] font-medium">전체메뉴</span>
                </button>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
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

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xl text-white tracking-tight">진접 G1230 수학전문학원</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                경기도 남양주시 진접읍에 위치한 초·중·고 수학 전문 학원입니다.
                체계적인 커리큘럼과 꼼꼼한 관리로 학생들의 수학 실력을 책임집니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">바로가기</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">학원소개</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">수강안내</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">학사일정</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">고객센터</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:031-123-4567" className="hover:text-white transition-colors">전화: 031-123-4567</a></li>
                <li>운영시간: 평일 14:00 - 22:00</li>
                <li>주소: 경기도 남양주시 진접읍 해밀예당1로</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2025 진접 G1230 수학전문학원. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
