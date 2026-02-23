import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, CalendarDays, Users,
    Clock, CheckCircle2, History, UserCheck, UserMinus, UserX
} from 'lucide-react';
import {
    getMembers, getCourseClasses, getStatusHistory,
    Member, CourseClass, StudentStatusHistory
} from '../data/mockData';

/* ── 세무 임박 일정 헬퍼 ── */
interface TaxEvent { title: string; dueDate: string; diff: number; }
function getUpcomingTaxEvents(): TaxEvent[] {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const events = [
        { title: '원천세 납부', dueDate: `${y}-${String(m).padStart(2, '0')}-10` },
        { title: '부가세 예정신고 (1기)', dueDate: `${y}-04-25` },
        { title: '부가세 확정신고 (1기)', dueDate: `${y}-07-25` },
        { title: '부가세 예정신고 (2기)', dueDate: `${y}-10-25` },
        { title: '종합소득세 신고', dueDate: `${y}-05-31` },
        { title: '근로소득 지급명세서', dueDate: `${y}-03-10` },
        { title: '부가세 확정신고 (2기)', dueDate: `${y + 1}-01-25` },
    ];
    return events
        .map(e => ({ ...e, diff: Math.ceil((new Date(e.dueDate).getTime() - now.getTime()) / 86400000) }))
        .filter(e => e.diff >= 0 && e.diff <= 30)
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 3);
}

/* ── 미납 계산 헬퍼 ── */
function getUnpaidAlerts(members: Member[], classes: CourseClass[]) {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 25); // 25일 납부 기준
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // 재원 중인 학생 중 이 달 납부 기록이 없는 학생 (mock: 이름에 'ㅁ' 포함 = 미납 샘플)
    const activeMembers = members.filter(m => m.status === 'active');
    // 실제로는 payments DB 조회, 여기서는 샘플로 일부 표시
    const unpaid = activeMembers.slice(0, 3).map(m => {
        const cls = classes.find(c => c.id === m.classId);
        return { member: m, fee: cls?.fee ?? 0, daysLeft: diffDays };
    });
    return unpaid;
}

/* ── 상태 뱃지 ── */
const statusLabel: Record<Member['status'], { label: string; icon: React.ReactNode; color: string }> = {
    active: { label: '재원', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-100 text-emerald-700' },
    paused: { label: '휴원', icon: <UserMinus className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-700' },
    withdrawn: { label: '퇴원', icon: <UserX className="w-3.5 h-3.5" />, color: 'bg-red-100 text-red-700' },
};

export function AdminTodayPanel() {
    const [members, setMembers] = useState<Member[]>([]);
    const [classes, setClasses] = useState<CourseClass[]>([]);
    const [statusHistory, setStatusHistory] = useState<StudentStatusHistory[]>([]);
    const [activeTab, setActiveTab] = useState<'today' | 'unpaid' | 'capacity' | 'history'>('today');

    const today = new Date();
    const todayStr = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

    useEffect(() => {
        getMembers().then(setMembers);
        getCourseClasses().then(setClasses);
        getStatusHistory().then(setStatusHistory);
    }, []);

    // 오늘 수업 반 목록
    const todayClasses = classes.filter(c => c.days?.includes(dayOfWeek));

    // 미납 알림
    const unpaidAlerts = getUnpaidAlerts(members, classes);

    // 세무 임박 일정
    const taxSchedules = getUpcomingTaxEvents();

    // 반 정원 현황
    const capacityData = classes.map(c => {
        const enrolled = members.filter(m => m.classId === c.id && m.status === 'active').length;
        const pct = c.maxStudents ? Math.round((enrolled / c.maxStudents) * 100) : 0;
        return { ...c, enrolled, pct };
    }).sort((a, b) => b.pct - a.pct);

    // 최근 상태 변화
    const recentHistory = statusHistory.slice(0, 10);

    // 통합 요약 카드 데이터
    const activeCount = members.filter(m => m.status === 'active').length;
    const pausedCount = members.filter(m => m.status === 'paused').length;
    const withdrawnCount = members.filter(m => m.status === 'withdrawn').length;

    const tabs = [
        { key: 'today', label: '오늘 일정', icon: CalendarDays },
        { key: 'unpaid', label: `미납 알림 ${unpaidAlerts.length}건`, icon: AlertTriangle },
        { key: 'capacity', label: '반 정원', icon: Users },
        { key: 'history', label: '상태 변화', icon: History },
    ] as const;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <p className="text-indigo-200 text-xs font-medium mb-0.5">오늘의 운영 현황</p>
                        <h2 className="text-lg font-bold">{todayStr}</h2>
                    </div>
                    <div className="flex gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{activeCount}</p>
                            <p className="text-xs text-indigo-200">재원</p>
                        </div>
                        <div className="w-px bg-indigo-400/50" />
                        <div>
                            <p className="text-2xl font-bold text-amber-300">{pausedCount}</p>
                            <p className="text-xs text-indigo-200">휴원</p>
                        </div>
                        <div className="w-px bg-indigo-400/50" />
                        <div>
                            <p className="text-2xl font-bold text-red-300">{withdrawnCount}</p>
                            <p className="text-xs text-indigo-200">퇴원</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === t.key
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="p-5">

                {/* ── 오늘 일정 탭 ── */}
                {activeTab === 'today' && (
                    <div className="space-y-4">
                        {/* 오늘 수업 */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4 text-indigo-500" />
                                오늘({dayOfWeek}) 수업 ({todayClasses.length}반)
                            </h3>
                            {todayClasses.length === 0 ? (
                                <p className="text-sm text-slate-400">오늘 수업이 없습니다.</p>
                            ) : (
                                <div className="space-y-2">
                                    {todayClasses.map(c => {
                                        const enrolled = members.filter(m => m.classId === c.id && m.status === 'active').length;
                                        return (
                                            <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                                    <p className="text-xs text-slate-500">{c.time} · {enrolled}명</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 임박 세무 일정 */}
                        {taxSchedules.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5 mt-4">
                                    <Clock className="w-4 h-4 text-rose-500" />
                                    임박 세무 일정
                                </h3>
                                <div className="space-y-2">
                                    {taxSchedules.map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.diff <= 3 ? 'bg-red-500 text-white' : 'bg-rose-100 text-rose-700'}`}>D-{t.diff}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800">{t.title}</p>
                                                <p className="text-xs text-slate-500">{t.dueDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 대기 중 상담 */}
                        <div className="p-3 bg-amber-50 rounded-xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-slate-800">상담 신청 관리를 확인하세요</p>
                                <p className="text-xs text-slate-500">아래 상담 신청 관리 섹션에서 대기 건을 처리해주세요.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 미납 알림 탭 ── */}
                {activeTab === 'unpaid' && (
                    <div>
                        <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl mb-4">
                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-rose-800">수강료 납부 현황 (이번 달)</p>
                                <p className="text-xs text-rose-600 mt-0.5">납부 기준일 25일 기준. 실제 납부 여부는 수납 관리에서 확인하세요.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {unpaidAlerts.map(({ member, fee, daysLeft }, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-rose-200 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                                        {member.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.grade} · 학부모: {member.parentPhone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-rose-600">{fee.toLocaleString()}원</p>
                                        <p className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-slate-500'}`}>
                                            납부일 D-{Math.max(0, daysLeft)}
                                        </p>
                                    </div>
                                    <a
                                        href={`tel:${member.parentPhone}`}
                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
                                    >
                                        연락
                                    </a>
                                </div>
                            ))}
                            {unpaidAlerts.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                                    <p>이번 달 미납 학생이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── 반 정원 현황 탭 ── */}
                {activeTab === 'capacity' && (
                    <div className="space-y-2">
                        {capacityData.map(c => (
                            <div key={c.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-slate-800">{c.name}</span>
                                    <span className={`text-xs font-bold ${c.pct >= 90 ? 'text-rose-600' : c.pct >= 70 ? 'text-amber-600' : 'text-emerald-600'
                                        }`}>
                                        {c.enrolled}/{c.maxStudents}명 ({c.pct}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${c.pct >= 90 ? 'bg-rose-500' : c.pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${Math.min(100, c.pct)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{c.time}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── 상태 변화 이력 탭 ── */}
                {activeTab === 'history' && (
                    <div>
                        {recentHistory.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">상태 변화 이력이 없습니다.</p>
                                <p className="text-xs mt-1">회원 관리에서 학생 상태를 변경하면 자동 기록됩니다.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {recentHistory.map(h => (
                                    <div key={h.id} className="py-3 flex items-start gap-3">
                                        <div className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ${statusLabel[h.toStatus].color}`}>
                                            {statusLabel[h.toStatus].icon}
                                            {statusLabel[h.toStatus].label}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {h.memberName}
                                                <span className="text-slate-400 font-normal text-xs ml-1">
                                                    {statusLabel[h.fromStatus].label} → {statusLabel[h.toStatus].label}
                                                </span>
                                            </p>
                                            {h.reason && <p className="text-xs text-slate-500 mt-0.5 truncate">사유: {h.reason}</p>}
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(h.changedAt).toLocaleDateString('ko-KR')} · {h.changedBy}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
