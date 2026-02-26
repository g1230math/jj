import React, { useState, useEffect, useCallback } from 'react';
import {
    X, UserCircle, CalendarDays, BookOpen, CreditCard, MessageSquare, Bell,
    ChevronLeft, ChevronRight, Plus, Trash2, Save, Phone, School,
    MapPin, Mail, CheckCircle, XCircle, Clock, AlertTriangle,
    BarChart3, Video,
} from 'lucide-react';
import {
    Member, CourseClass,
    AttendanceRecord, AttendanceStatus, getAttendance, upsertAttendance,
    MemberSchedule, ScheduleStatus, getMemberSchedules, saveMemberSchedules,
    PaymentRecord, PaymentStatus, PaymentMethod, getPayments, savePayments,
    MemoEntry, getMemberMemos, saveMemberMemos,
    getLectures, getAllProgress, type Lecture, type LectureProgress,
} from '../data/mockData';
import {
    getExams, getAttempts, getWrongNotes,
    type Exam, type ExamAttempt, type WrongNote,
} from '../data/studyData';
import { seedSampleData } from '../data/sampleStudyData';
import { useAuth } from '../context/AuthContext';

/* ─── 타입 ─── */
type Tab = 'info' | 'attendance' | 'schedule' | 'payment' | 'memo' | 'notification' | 'study';

const TABS: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'info', label: '기본정보', icon: UserCircle },
    { id: 'study', label: '학습', icon: BarChart3 },
    { id: 'attendance', label: '출결', icon: CalendarDays },
    { id: 'schedule', label: '스케줄', icon: BookOpen },
    { id: 'payment', label: '수납', icon: CreditCard },
    { id: 'memo', label: '메모', icon: MessageSquare },
    { id: 'notification', label: '알림', icon: Bell },
];

const ATTENDANCE_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: React.FC<{ className?: string }> }> = {
    present: { label: '출석', color: 'text-emerald-600', bg: 'bg-emerald-500', icon: CheckCircle },
    absent: { label: '결석', color: 'text-red-600', bg: 'bg-red-500', icon: XCircle },
    late: { label: '지각', color: 'text-amber-600', bg: 'bg-amber-500', icon: Clock },
    early_leave: { label: '조퇴', color: 'text-orange-600', bg: 'bg-orange-500', icon: AlertTriangle },
};

const ATTENDANCE_CYCLE: AttendanceStatus[] = ['present', 'absent', 'late', 'early_leave'];

const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
    active: '수강中', pending: '예정', completed: '수료', cancelled: '취소',
};
const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-blue-100 text-blue-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = { paid: '완납', unpaid: '미납', partial: '부분납' };
const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-red-100 text-red-700',
    partial: 'bg-amber-100 text-amber-700',
};
const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = { cash: '현금', transfer: '계좌이체', card: '카드', pg: 'PG결제' };

/* ─── 유틸 ─── */
function fmtDate(d: string) { return d.replace(/-/g, '.'); }
function fmtMoney(n: number) { return n.toLocaleString('ko-KR') + '원'; }

function getDaysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function getFirstDayOfWeek(y: number, m: number) { return new Date(y, m - 1, 1).getDay(); }
function toDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/* ─── Props ─── */
interface Props {
    member: Member;
    courses: CourseClass[];
    onClose: () => void;
    onSave: (updated: Member) => void;
}

export function MemberDetailModal({ member, courses, onClose, onSave }: Props) {
    const { user } = useAuth();
    const isDirector = user?.role === 'admin';
    const [activeTab, setActiveTab] = useState<Tab>('info');

    /* ── 기본정보 상태 ── */
    const [infoForm, setInfoForm] = useState({
        name: member.name,
        phone: member.phone,
        parentPhone: member.parentPhone,
        parentRelation: member.parentRelation || '모',
        school: member.school,
        grade: member.grade,
        classId: member.classId,
        status: member.status,
        enrollDate: member.enrollDate,
        birthDate: member.birthDate || '',
        gender: member.gender || '',
        address: member.address || '',
        email: member.email || '',
        smsConsent: member.smsConsent !== false,
        memo: member.memo,
    });
    const [infoSaving, setInfoSaving] = useState(false);

    /* ── 출결 상태 ── */
    const today = new Date();
    const [attYear, setAttYear] = useState(today.getFullYear());
    const [attMonth, setAttMonth] = useState(today.getMonth() + 1);
    const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);

    /* ── 스케줄 상태 ── */
    const [schedules, setSchedules] = useState<MemberSchedule[]>([]);
    const [showSchedForm, setShowSchedForm] = useState(false);
    const [schedForm, setSchedForm] = useState({ classId: '', startDate: '', endDate: '', status: 'active' as ScheduleStatus, note: '' });

    /* ── 수납 상태 ── */
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [showPayForm, setShowPayForm] = useState(false);
    const [payForm, setPayForm] = useState({ scheduleName: '', amount: '', paidAt: '', method: 'transfer' as PaymentMethod, status: 'paid' as PaymentStatus, note: '' });

    /* ── 메모 상태 ── */
    const [memos, setMemos] = useState<MemoEntry[]>([]);
    const [newMemo, setNewMemo] = useState('');

    /* ── 학습 상태 ── */
    const [studyAttempts, setStudyAttempts] = useState<ExamAttempt[]>([]);
    const [studyExams, setStudyExams] = useState<Exam[]>([]);
    const [studyWrongNotes, setStudyWrongNotes] = useState<WrongNote[]>([]);
    const [studyLectures, setStudyLectures] = useState<Lecture[]>([]);
    const [studyProgress, setStudyProgress] = useState<Record<string, LectureProgress>>({});

    /* 데이터 로드 */
    useEffect(() => {
        getAttendance().then(all => setAttendances(all.filter(r => r.memberId === member.id)));
        getMemberSchedules().then(all => setSchedules(all.filter(s => s.memberId === member.id)));
        getPayments().then(all => setPayments(all.filter(p => p.memberId === member.id)));
        getMemberMemos().then(all => setMemos(all.filter(m => m.memberId === member.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
        // 학습 데이터 로드
        seedSampleData().then(() =>
            Promise.all([getAttempts(), getExams() as Promise<Exam[]>, getWrongNotes(), getLectures(), getAllProgress()])
        ).then(([atts, exs, wns, lecs, prog]) => {
            setStudyAttempts(atts.filter(a => a.student_name === member.name));
            setStudyExams(exs);
            setStudyWrongNotes(wns.filter(w => w.student_id === member.id));
            setStudyLectures(lecs);
            setStudyProgress(prog);
        });
    }, [member.id, member.name]);

    /* ── 출결 달력 로직 ── */
    const attMap: Record<string, AttendanceRecord> = {};
    attendances.forEach(r => { attMap[r.date] = r; });

    const daysInMonth = getDaysInMonth(attYear, attMonth);
    const firstDow = getFirstDayOfWeek(attYear, attMonth);
    const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

    const presentCount = attendances.filter(r => r.status === 'present' && r.date.startsWith(`${attYear}-${String(attMonth).padStart(2, '0')}`)).length;
    const absentCount = attendances.filter(r => r.status === 'absent' && r.date.startsWith(`${attYear}-${String(attMonth).padStart(2, '0')}`)).length;

    const toggleAttendance = useCallback(async (day: number) => {
        const dateStr = toDateStr(attYear, attMonth, day);
        const existing = attMap[dateStr];
        const nextStatus: AttendanceStatus = existing
            ? ATTENDANCE_CYCLE[(ATTENDANCE_CYCLE.indexOf(existing.status) + 1) % ATTENDANCE_CYCLE.length]
            : 'present';
        const record: AttendanceRecord = {
            id: existing?.id || `att_${Date.now()}`,
            memberId: member.id,
            date: dateStr,
            status: nextStatus,
            recordedBy: user?.name || '관리자',
        };
        await upsertAttendance(record);
        setAttendances(prev => {
            const next = prev.filter(r => r.date !== dateStr);
            return [...next, record];
        });
    }, [attYear, attMonth, attMap, member.id, user?.name]);

    /* ── 기본정보 저장 ── */
    const handleInfoSave = async () => {
        setInfoSaving(true);
        const updated: Member = { ...member, ...infoForm, gender: infoForm.gender as 'M' | 'F' | undefined };
        onSave(updated);
        setInfoSaving(false);
    };

    /* ── 스케줄 저장 ── */
    const handleSchedSave = async () => {
        if (!schedForm.classId || !schedForm.startDate || !schedForm.endDate) return;
        const newS: MemberSchedule = { id: `sch_${Date.now()}`, memberId: member.id, ...schedForm };
        const allS = await getMemberSchedules();
        await saveMemberSchedules([...allS, newS]);
        setSchedules(prev => [...prev, newS]);
        setShowSchedForm(false);
        setSchedForm({ classId: '', startDate: '', endDate: '', status: 'active', note: '' });
    };

    /* ── 수납 저장 ── */
    const handlePaySave = async () => {
        if (!payForm.scheduleName || !payForm.amount) return;
        const newP: PaymentRecord = {
            id: `pay_${Date.now()}`,
            memberId: member.id,
            scheduleName: payForm.scheduleName,
            amount: parseInt(payForm.amount.replace(/,/g, ''), 10),
            paidAt: payForm.paidAt || undefined,
            method: payForm.method,
            status: payForm.status,
            note: payForm.note || undefined,
            createdBy: user?.name || '원장',
            createdAt: new Date().toISOString(),
        };
        const allP = await getPayments();
        await savePayments([...allP, newP]);
        setPayments(prev => [...prev, newP]);
        setShowPayForm(false);
        setPayForm({ scheduleName: '', amount: '', paidAt: '', method: 'transfer', status: 'paid', note: '' });
    };

    /* ── 메모 저장 ── */
    const handleMemoSave = async () => {
        if (!newMemo.trim()) return;
        const entry: MemoEntry = {
            id: `memo_${Date.now()}`,
            memberId: member.id,
            content: newMemo.trim(),
            authorName: user?.name || '관리자',
            createdAt: new Date().toISOString(),
        };
        const allM = await getMemberMemos();
        await saveMemberMemos([...allM, entry]);
        setMemos(prev => [entry, ...prev]);
        setNewMemo('');
    };

    /* ── 메모 삭제 ── */
    const handleMemoDelete = async (id: string) => {
        const allM = await getMemberMemos();
        await saveMemberMemos(allM.filter(m => m.id !== id));
        setMemos(prev => prev.filter(m => m.id !== id));
    };

    /* 수납 합계 */
    const paidTotal = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const unpaidTotal = payments.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0);

    const courseMap: Record<string, string> = {};
    courses.forEach(c => { courseMap[c.id] = c.name; });

    /* ──────────────────────────────── */
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                            {member.name[0]}
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-none">{member.name}</h2>
                            <p className="text-blue-100 text-sm mt-0.5">{member.grade} · {member.school}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50">
                    {TABS.filter(t => t.id !== 'payment' || isDirector).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600 bg-white'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 shrink-0" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ maxHeight: '65vh' }}>

                    {/* ── Tab: 기본정보 ── */}
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">이름</label>
                                    <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.name} onChange={e => setInfoForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">성별</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.gender} onChange={e => setInfoForm(f => ({ ...f, gender: e.target.value }))}>
                                        <option value="">선택</option>
                                        <option value="M">남</option>
                                        <option value="F">여</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">생년월일</label>
                                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.birthDate} onChange={e => setInfoForm(f => ({ ...f, birthDate: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">상태</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.status} onChange={e => setInfoForm(f => ({ ...f, status: e.target.value as Member['status'] }))}>
                                        <option value="active">재원</option>
                                        <option value="paused">휴원</option>
                                        <option value="withdrawn">퇴원</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1"><Phone className="inline w-3 h-3 mr-0.5" />학생 연락처</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.phone} onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))} placeholder="010-0000-0000" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1"><Phone className="inline w-3 h-3 mr-0.5" />학부모 연락처</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.parentPhone} onChange={e => setInfoForm(f => ({ ...f, parentPhone: e.target.value }))} placeholder="010-0000-0000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">보호자 관계</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.parentRelation} onChange={e => setInfoForm(f => ({ ...f, parentRelation: e.target.value }))}>
                                        {['모', '부', '조부모', '기타'].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">등록일</label>
                                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.enrollDate} onChange={e => setInfoForm(f => ({ ...f, enrollDate: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1"><School className="inline w-3 h-3 mr-0.5" />학교</label>
                                    <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.school} onChange={e => setInfoForm(f => ({ ...f, school: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">학년</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={infoForm.grade} onChange={e => setInfoForm(f => ({ ...f, grade: e.target.value }))}>
                                        {['초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1"><MapPin className="inline w-3 h-3 mr-0.5" />주소</label>
                                <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={infoForm.address} onChange={e => setInfoForm(f => ({ ...f, address: e.target.value }))} placeholder="경기 남양주시..." />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1"><Mail className="inline w-3 h-3 mr-0.5" />이메일</label>
                                <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={infoForm.email} onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">수강반</label>
                                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={infoForm.classId} onChange={e => setInfoForm(f => ({ ...f, classId: e.target.value }))}>
                                    <option value="">선택 안함</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleInfoSave} disabled={infoSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                                    <Save className="w-4 h-4" /> {infoSaving ? '저장 중...' : '변경사항 저장'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Tab: 출결 ── */}
                    {activeTab === 'attendance' && (
                        <div>
                            {/* 월 네비게이션 */}
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => { if (attMonth === 1) { setAttYear(y => y - 1); setAttMonth(12); } else setAttMonth(m => m - 1); }}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                                </button>
                                <span className="font-semibold text-slate-800">{attYear}년 {attMonth}월</span>
                                <button onClick={() => { if (attMonth === 12) { setAttYear(y => y + 1); setAttMonth(1); } else setAttMonth(m => m + 1); }}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            {/* 월 통계 */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {(Object.entries(ATTENDANCE_CONFIG) as [AttendanceStatus, typeof ATTENDANCE_CONFIG['present']][]).map(([st, cfg]) => {
                                    const pfx = `${attYear}-${String(attMonth).padStart(2, '0')}`;
                                    const cnt = attendances.filter(r => r.status === st && r.date.startsWith(pfx)).length;
                                    return (
                                        <div key={st} className="bg-slate-50 rounded-xl p-2 text-center">
                                            <div className={`text-lg font-bold ${cfg.color}`}>{cnt}</div>
                                            <div className="text-xs text-slate-500">{cfg.label}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 달력 */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                                    <div key={d} className={`text-xs font-medium py-1 ${d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-slate-500'}`}>{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: totalCells }).map((_, i) => {
                                    const day = i - firstDow + 1;
                                    if (day < 1 || day > daysInMonth) return <div key={i} />;
                                    const dateStr = toDateStr(attYear, attMonth, day);
                                    const rec = attMap[dateStr];
                                    const dow = (firstDow + day - 1) % 7;
                                    return (
                                        <button key={i} onClick={() => toggleAttendance(day)}
                                            className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105 relative"
                                            style={{ minHeight: 36 }}
                                            title={rec ? ATTENDANCE_CONFIG[rec.status].label : '클릭하여 출결 기록'}>
                                            {rec ? (
                                                <div className={`w-full h-full rounded-lg ${ATTENDANCE_CONFIG[rec.status].bg} flex items-center justify-center text-white font-bold`}>
                                                    {day}
                                                </div>
                                            ) : (
                                                <span className={`${dow === 0 ? 'text-red-400' : dow === 6 ? 'text-blue-400' : 'text-slate-600'}`}>{day}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 범례 */}
                            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100">
                                {(Object.entries(ATTENDANCE_CONFIG) as [AttendanceStatus, typeof ATTENDANCE_CONFIG['present']][]).map(([st, cfg]) => (
                                    <div key={st} className="flex items-center gap-1.5">
                                        <div className={`w-3 h-3 rounded ${cfg.bg}`} />
                                        <span className="text-xs text-slate-600">{cfg.label}</span>
                                    </div>
                                ))}
                                <span className="text-xs text-slate-400 ml-auto">날짜 클릭 시 순환 변경</span>
                            </div>
                        </div>
                    )}

                    {/* ── Tab: 스케줄 ── */}
                    {activeTab === 'schedule' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-slate-800">수강 스케줄</h3>
                                <button onClick={() => setShowSchedForm(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    <Plus className="w-4 h-4" /> 스케줄 추가
                                </button>
                            </div>

                            {showSchedForm && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">수강반</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                                value={schedForm.classId} onChange={e => setSchedForm(f => ({ ...f, classId: e.target.value }))}>
                                                <option value="">선택</option>
                                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">상태</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                                value={schedForm.status} onChange={e => setSchedForm(f => ({ ...f, status: e.target.value as ScheduleStatus }))}>
                                                <option value="active">수강中</option>
                                                <option value="pending">예정</option>
                                                <option value="completed">수료</option>
                                                <option value="cancelled">취소</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">시작일</label>
                                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                value={schedForm.startDate} onChange={e => setSchedForm(f => ({ ...f, startDate: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">종료일</label>
                                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                value={schedForm.endDate} onChange={e => setSchedForm(f => ({ ...f, endDate: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setShowSchedForm(false)} className="px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">취소</button>
                                        <button onClick={handleSchedSave} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">저장</button>
                                    </div>
                                </div>
                            )}

                            {schedules.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">등록된 스케줄이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {schedules.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <div className="font-medium text-slate-800 text-sm">{courseMap[s.classId] || s.classId}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{fmtDate(s.startDate)} ~ {fmtDate(s.endDate)}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SCHEDULE_STATUS_COLORS[s.status]}`}>
                                                {SCHEDULE_STATUS_LABELS[s.status]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Tab: 수납 (원장 전용) ── */}
                    {activeTab === 'payment' && isDirector && (
                        <div>
                            {/* 요약 */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                    <div className="text-sm font-bold text-emerald-700">{fmtMoney(paidTotal)}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">완납 합계</div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-3 text-center">
                                    <div className="text-sm font-bold text-red-600">{fmtMoney(unpaidTotal)}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">미납 합계</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 text-center">
                                    <div className="text-sm font-bold text-slate-700">{payments.length}건</div>
                                    <div className="text-xs text-slate-500 mt-0.5">전체 이력</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-slate-800">수납 이력</h3>
                                <button onClick={() => setShowPayForm(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    <Plus className="w-4 h-4" /> 수납 등록
                                </button>
                            </div>

                            {showPayForm && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">스케줄명</label>
                                            <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                placeholder="예: 중2 정규반" value={payForm.scheduleName}
                                                onChange={e => setPayForm(f => ({ ...f, scheduleName: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">금액 (원)</label>
                                            <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                placeholder="300000" value={payForm.amount}
                                                onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">수납일</label>
                                            <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                value={payForm.paidAt} onChange={e => setPayForm(f => ({ ...f, paidAt: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">수납방법</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                                value={payForm.method} onChange={e => setPayForm(f => ({ ...f, method: e.target.value as PaymentMethod }))}>
                                                <option value="cash">현금</option>
                                                <option value="transfer">계좌이체</option>
                                                <option value="card">카드</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">상태</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                                value={payForm.status} onChange={e => setPayForm(f => ({ ...f, status: e.target.value as PaymentStatus }))}>
                                                <option value="paid">완납</option>
                                                <option value="unpaid">미납</option>
                                                <option value="partial">부분납</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* PG 버튼 (준비중) */}
                                    <div className="flex items-center gap-2 p-3 bg-white border border-dashed border-slate-300 rounded-xl">
                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500 flex-1">카드결제 (PG 연동)</span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs rounded-full font-medium">준비중</span>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setShowPayForm(false)} className="px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">취소</button>
                                        <button onClick={handlePaySave} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">저장</button>
                                    </div>
                                </div>
                            )}

                            {payments.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">수납 이력이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-600 text-left">
                                                <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap">상태</th>
                                                <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap">수납일</th>
                                                <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap">스케줄</th>
                                                <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap text-right">금액</th>
                                                <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap">방법</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payments.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50/50">
                                                    <td className="px-3 py-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[p.status]}`}>
                                                            {PAYMENT_STATUS_LABELS[p.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600 text-xs whitespace-nowrap">{p.paidAt ? fmtDate(p.paidAt) : '—'}</td>
                                                    <td className="px-3 py-2 text-slate-700 text-xs">{p.scheduleName}</td>
                                                    <td className="px-3 py-2 text-slate-800 font-medium text-xs text-right whitespace-nowrap">{fmtMoney(p.amount)}</td>
                                                    <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap">{p.method ? PAYMENT_METHOD_LABELS[p.method] : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Tab: 메모 ── */}
                    {activeTab === 'memo' && (
                        <div>
                            {/* 새 메모 입력 */}
                            <div className="mb-4">
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="메모를 입력하세요..."
                                    value={newMemo}
                                    onChange={e => setNewMemo(e.target.value)}
                                />
                                <div className="flex justify-end mt-2">
                                    <button onClick={handleMemoSave} disabled={!newMemo.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors">
                                        <MessageSquare className="w-4 h-4" /> 메모 추가
                                    </button>
                                </div>
                            </div>

                            {memos.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">작성된 메모가 없습니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {memos.map(m => (
                                        <div key={m.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                        {m.authorName[0]}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-700">{m.authorName}</span>
                                                    <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleDateString('ko-KR')}</span>
                                                </div>
                                                <button onClick={() => handleMemoDelete(m.id)}
                                                    className="p-1 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Tab: 학습 ── */}
                    {activeTab === 'study' && (() => {
                        const completedAtts = studyAttempts.filter(a => a.status === 'submitted' || a.status === 'graded');
                        const avgScore = completedAtts.length > 0
                            ? Math.round(completedAtts.reduce((s, a) => s + (a.score ?? 0), 0) / completedAtts.length) : 0;
                        const avgPct = completedAtts.length > 0
                            ? Math.round(completedAtts.reduce((s, a) => s + ((a.score ?? 0) / (a.total_points || 1) * 100), 0) / completedAtts.length) : 0;
                        return (
                            <div className="space-y-5">
                                {/* 학습 요약 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { label: '응시 시험', value: `${studyAttempts.length}회`, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                                        { label: '평균 점수', value: `${avgScore}점`, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                                        { label: '평균 정답률', value: `${avgPct}%`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                                        { label: '오답 복습 대기', value: `${studyWrongNotes.length}개`, color: 'bg-rose-50 text-rose-700 border-rose-200' },
                                    ].map(s => (
                                        <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                                            <p className="text-[10px] font-medium opacity-70">{s.label}</p>
                                            <p className="text-lg font-bold">{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 시험 결과 */}
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm mb-2">📝 시험 응시 이력</h4>
                                    {completedAtts.length > 0 ? (
                                        <div className="space-y-2">
                                            {completedAtts.map(att => {
                                                const exam = studyExams.find(e => e.id === att.exam_id);
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
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 text-center py-4">아직 응시한 시험이 없습니다</p>
                                    )}
                                </div>

                                {/* 동영상 강의 수강 */}
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm mb-2">🎬 동영상 강의 수강 현황</h4>
                                    {studyLectures.filter(l => l.isPublished).length > 0 ? (
                                        <div className="space-y-2">
                                            {studyLectures.filter(l => l.isPublished).slice(0, 5).map(lec => {
                                                const prog = studyProgress[lec.id];
                                                const done = prog?.status === 'completed';
                                                return (
                                                    <div key={lec.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                        <img src={lec.thumbnail} alt="" className="w-16 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-slate-800 truncate">{lec.title}</p>
                                                            <p className="text-[10px] text-slate-400">{lec.instructor}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {done ? '수강완료' : '미수강'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 text-center py-4">강의 데이터가 없습니다</p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── Tab: 알림 설정 ── */}
                    {activeTab === 'notification' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800">알림 수신 설정</h3>
                            {[
                                { key: 'smsConsent', label: '문자(SMS) 수신', desc: '출결·수납 관련 문자 발송' },
                            ].map(item => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">{item.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                                    </div>
                                    <button
                                        onClick={() => setInfoForm(f => ({ ...f, smsConsent: !f.smsConsent }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${infoForm.smsConsent ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${infoForm.smsConsent ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            ))}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-sm text-amber-700 font-medium">알림톡 연동</p>
                                <p className="text-xs text-amber-600 mt-1">카카오 알림톡 발송은 추후 지원 예정입니다.</p>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button onClick={handleInfoSave}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                    <Save className="w-4 h-4" /> 설정 저장
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
