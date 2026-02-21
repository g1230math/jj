import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, TrendingUp, Users, CreditCard } from 'lucide-react';
import { ShuttleAdmin } from '../components/ShuttleAdmin';
import { LectureAdmin } from '../components/LectureAdmin';
import { studentGrades, getLectures, getAllProgress } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">수강 중인 강의</p>
              <p className="text-2xl font-bold text-slate-900">3개</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">이번 주 출석률</p>
              <p className="text-2xl font-bold text-slate-900">100%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">미완료 과제</p>
              <p className="text-2xl font-bold text-slate-900">1건</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            성적 추이
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentGrades}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            최근 수강 강의
          </h3>
          <div className="space-y-4">
            {getLectures().filter(l => l.isPublished).slice(0, 3).map(lecture => {
              const progress = getAllProgress()[lecture.id];
              const isCompleted = progress?.status === 'completed';
              return (
                <div key={lecture.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <img src={lecture.thumbnail} alt={lecture.title} className="w-24 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 text-sm mb-1">{lecture.title}</h4>
                    <p className="text-xs text-slate-500">{lecture.instructor} • {lecture.date}</p>
                  </div>
                  {isCompleted ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">수강완료</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">미수강</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderParentDashboard = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 mb-1">김지훈 학생 (중3)</h2>
          <p className="text-indigo-700 text-sm">현재 진접중학교 3학년 심화반 수강 중입니다.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          상담 신청하기
        </button>
      </div>
      {renderStudentDashboard()}
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '전체 원생', value: '128명', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: '오늘 출석률', value: '96%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: '미납 원비', value: '3건', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-100' },
          { title: '신규 상담', value: '2건', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-64 flex items-center justify-center text-slate-500">
        관리자 상세 통계 대시보드 영역
      </div>

      {/* Lecture Admin */}
      <LectureAdmin />

      {/* Shuttle Admin */}
      <ShuttleAdmin />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="text-slate-500 mt-1">
          {user.role === 'student' && '나의 학습 현황을 확인하세요.'}
          {user.role === 'parent' && '자녀의 학습 현황을 확인하세요.'}
          {user.role === 'teacher' && '담당 반 학생들의 현황입니다.'}
          {user.role === 'admin' && '학원 전체 운영 현황입니다.'}
        </p>
      </div>

      {user.role === 'student' && renderStudentDashboard()}
      {user.role === 'parent' && renderParentDashboard()}
      {(user.role === 'admin' || user.role === 'teacher') && renderAdminDashboard()}
    </div>
  );
}
