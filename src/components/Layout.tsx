import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bus, Calendar, Home, Info, LogIn, LogOut, MessageSquare, Video, MapPin, Menu, X, Users } from 'lucide-react';
import { cn } from '../lib/utils';

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">진</span>
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">진접 G1230 수학전문학원</span>
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

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
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
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">진</span>
                </div>
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
                <li>전화: 031-123-4567</li>
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
