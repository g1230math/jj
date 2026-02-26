import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, CheckCircle, Clock, TrendingUp, Users, CreditCard,
  LayoutDashboard, UserCog, Receipt, Settings, BusFront, MessageSquare,
  PenTool, FileCheck, Sparkles, BarChart3
} from 'lucide-react';
import { ShuttleAdmin } from '../components/ShuttleAdmin';
import { PopupAdmin } from '../components/PopupAdmin';
import { LectureAdmin } from '../components/LectureAdmin';
import { ConsultAdmin } from '../components/ConsultAdmin';
import { MemberAdmin } from '../components/MemberAdmin';
import { TeacherAdmin } from '../components/TeacherAdmin';
import { TaxDashboard } from '../components/TaxDashboard';
import { AdminTodayPanel } from '../components/AdminTodayPanel';
import { QuestionBankAdmin } from '../components/QuestionBankAdmin';
import { ExamBuilderAdmin } from '../components/ExamBuilderAdmin';
import { AIQuestionGenerator } from '../components/AIQuestionGenerator';
import { AdminAnalytics } from '../components/AdminAnalytics';
import {
  studentGrades, getLectures, getAllProgress, getConsultRequests, getMembers,
  Lecture, LectureProgress, ConsultRequest
} from '../data/mockData';
import {
  getExams, getAttempts, getWrongNotes,
  type Exam, type ExamAttempt, type WrongNote
} from '../data/studyData';
import { seedSampleData } from '../data/sampleStudyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ─── 관리자 탭 정의 ─── */
type AdminTab = 'overview' | 'members' | 'lecture' | 'questions' | 'ai_gen' | 'exams' | 'analytics' | 'teacher' | 'tax' | 'site';

const ADMIN_TABS: { key: AdminTab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: 'overview', label: '운영 현황', icon: LayoutDashboard, desc: '오늘 일정·미납·반 정원' },
  { key: 'members', label: '회원·상담', icon: Users, desc: '회원 목록 및 상담 신청' },
  { key: 'questions', label: '문제 은행', icon: PenTool, desc: '문제 등록·수정·AI 생성' },
  { key: 'ai_gen', label: 'AI 생성', icon: Sparkles, desc: 'Gemini AI 문제 자동 생성' },
  { key: 'exams', label: '시험 관리', icon: FileCheck, desc: '시험 생성·게시·결과' },
  { key: 'analytics', label: '학습 분석', icon: BarChart3, desc: '전체 학생 성적·순위·취약점' },
  { key: 'lecture', label: '강의·셔틀', icon: BookOpen, desc: '강의 및 셔틀 관리' },
  { key: 'teacher', label: '강사·급여', icon: UserCog, desc: '강사 정보 및 급여 명세' },
  { key: 'tax', label: '세금·정산', icon: Receipt, desc: '원천세·부가세·인건비' },
  { key: 'site', label: '사이트 관리', icon: Settings, desc: '공지·팝업·콘텐츠' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [progress, setProgress] = useState<Record<string, LectureProgress>>({});
  const [pendingConsults, setPendingConsults] = useState(0);
  const [activeMemberCount, setActiveMemberCount] = useState(0);
  // Study data for student dashboard
  const [myAttempts, setMyAttempts] = useState<ExamAttempt[]>([]);
  const [myExams, setMyExams] = useState<Exam[]>([]);
  const [myWrongNotes, setMyWrongNotes] = useState<WrongNote[]>([]);

  useEffect(() => {
    getLectures().then(setLectures);
    getAllProgress().then(setProgress);
    getConsultRequests().then(list => setPendingConsults(list.filter(r => r.status === 'pending').length));
    getMembers().then(list => setActiveMemberCount(list.filter(m => m.status === 'active').length));
    // Load study data for student
    if (user?.role === 'student') {
      seedSampleData().then(() =>
        Promise.all([getAttempts(), getExams(), getWrongNotes()])
      ).then(([atts, exs, wns]) => {
        setMyAttempts(atts.filter(a => a.student_id === user.id));
        setMyExams(exs);
        setMyWrongNotes(wns.filter(w => w.student_id === user.id && !w.reviewed));
      });
    }
  }, [user]);

  if (!user) return null;

  /* ─── 학생 대시보드 ─── */
  const renderStudentDashboard = () => {
    const completedAtts = myAttempts.filter(a => a.status === 'submitted' || a.status === 'graded');
    const avgScore = completedAtts.length > 0
      ? Math.round(completedAtts.reduce((s, a) => s + (a.score ?? 0), 0) / completedAtts.length)
      : 0;
    const avgPercent = completedAtts.length > 0
      ? Math.round(completedAtts.reduce((s, a) => s + ((a.score ?? 0) / (a.total_points || 1) * 100), 0) / completedAtts.length)
      : 0;

    return (
      <div className="space-y-6">
        {/* 기본 정보 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: '수강 중인 강의', value: '3개', icon: BookOpen, color: 'indigo' },
            { label: '이번 주 출석률', value: '100%', icon: CheckCircle, color: 'emerald' },
            { label: '미완료 과제', value: '1건', icon: Clock, color: 'rose' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-${s.color}-100 text-${s.color}-600 rounded-xl flex items-center justify-center`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 학습 현황 ═══ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-600" /> 나의 학습 현황
            </h3>
            <a href="/jj/study" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              학습 허브 →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: '응시 시험', value: `${myAttempts.length}회`, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: '평균 점수', value: `${avgScore}점`, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { label: '평균 정답률', value: `${avgPercent}%`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { label: '오답 복습 대기', value: `${myWrongNotes.length}개`, color: 'bg-rose-50 text-rose-700 border-rose-200' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
                <p className="text-xl font-bold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
          {/* 최근 시험 결과 */}
          {completedAtts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase">최근 시험 결과</p>
              {completedAtts.slice(0, 3).map(att => {
                const exam = myExams.find(e => e.id === att.exam_id);
                const pct = Math.round((att.score ?? 0) / (att.total_points || 1) * 100);
                return (
                  <div key={att.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${pct >= 80 ? 'bg-emerald-100 text-emerald-700' : pct >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{exam?.title || '시험'}</p>
                      <p className="text-[10px] text-slate-400">{att.score}/{att.total_points}점 • {new Date(att.submitted_at || '').toLocaleDateString('ko-KR')}</p>
                    </div>
                    <a href={`/jj/study/result/${att.id}`} className="text-[10px] text-indigo-600 font-medium hover:underline shrink-0">상세보기</a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">아직 응시한 시험이 없습니다</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> 성적 추이
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentGrades}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3}
                    dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> 최근 수강 강의
            </h3>
            <div className="space-y-4">
              {lectures.filter(l => l.isPublished).slice(0, 3).map(lecture => {
                const prog = progress[lecture.id];
                const isCompleted = prog?.status === 'completed';
                return (
                  <div key={lecture.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <img src={lecture.thumbnail} alt={lecture.title} className="w-24 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm mb-1">{lecture.title}</h4>
                      <p className="text-xs text-slate-500">{lecture.instructor} • {lecture.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{isCompleted ? '수강완료' : '미수강'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─── 학부모 대시보드 ─── */
  const renderParentDashboard = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 mb-1">김지훈 학생 (중3)</h2>
          <p className="text-indigo-700 text-sm">현재 진접중학교 3학년 심화반 수강 중입니다.</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          상담 신청하기
        </button>
      </div>
      {renderStudentDashboard()}
    </div>
  );

  /* ─── 관리자 대시보드 (탭 구조) ─── */
  const renderAdminDashboard = () => (
    <div className="space-y-5">
      {/* 상단 요약 카드 — 항상 표시 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: '재원생', value: `${activeMemberCount}명`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { title: '미납 원비', value: '3건', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { title: '대기 상담', value: `${pendingConsults}건`, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { title: '오늘 출석률', value: '96%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-4 rounded-2xl border ${stat.border} flex items-center gap-3`}>
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/60">
          {ADMIN_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 min-w-0 ${adminTab === tab.key
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60'
                }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 탭 설명 바 */}
        <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100/50 flex items-center gap-2">
          {(() => {
            const cur = ADMIN_TABS.find(t => t.key === adminTab)!;
            return (
              <>
                <cur.icon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs text-indigo-700 font-medium">{cur.label}</span>
                <span className="text-xs text-slate-400">— {cur.desc}</span>
              </>
            );
          })()}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-5 space-y-5">
          {adminTab === 'overview' && <AdminTodayPanel />}

          {adminTab === 'members' && (
            <>
              <MemberAdmin />
              <ConsultAdmin />
            </>
          )}

          {adminTab === 'lecture' && (
            <>
              <LectureAdmin />
              <ShuttleAdmin />
            </>
          )}

          {adminTab === 'teacher' && <TeacherAdmin />}

          {adminTab === 'questions' && <QuestionBankAdmin />}

          {adminTab === 'ai_gen' && <AIQuestionGenerator />}

          {adminTab === 'exams' && <ExamBuilderAdmin />}

          {adminTab === 'analytics' && <AdminAnalytics />}

          {adminTab === 'tax' && <TaxDashboard />}

          {adminTab === 'site' && <PopupAdmin />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="text-slate-500 mt-1 text-sm">
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
