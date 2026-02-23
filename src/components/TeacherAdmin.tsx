import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, UserPlus, X, Save, ChevronRight, Phone, Mail, Briefcase,
    Clock, CreditCard, Edit3, Trash2, Plus, ChevronLeft, ChevronDown,
    Building2, Calendar, AlertCircle,
} from 'lucide-react';
import {
    Teacher, PayType, TeacherStatus,
    WorkRecord, WorkType, calcWorkMinutes,
    PaySlip, calcPaySlip,
    getTeachers, saveTeachers,
    getWorkRecords, saveWorkRecords,
    getPaySlips, savePaySlips,
    getCourseClasses, CourseClass,
} from '../data/mockData';

/* ── 상수 ── */
const PAY_TYPE_LABELS: Record<PayType, string> = {
    freelance: '프리랜서 (3.3%)',
    employee_full: '정직원 (4대보험)',
    employee_extra: '정직원+수당',
    parttime: '시급 알바',
};
const PAY_TYPE_COLORS: Record<PayType, string> = {
    freelance: 'bg-violet-100 text-violet-700',
    employee_full: 'bg-blue-100 text-blue-700',
    employee_extra: 'bg-indigo-100 text-indigo-700',
    parttime: 'bg-amber-100 text-amber-700',
};
const STATUS_LABELS: Record<TeacherStatus, string> = { active: '재직', leave: '휴직', resigned: '퇴직' };
const STATUS_COLORS: Record<TeacherStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    leave: 'bg-amber-100 text-amber-700',
    resigned: 'bg-red-100 text-red-600',
};
const WORK_TYPE_LABELS: Record<WorkType, string> = { regular: '정규', extra: '추가강의', consult: '상담' };
const WORK_TYPE_COLORS: Record<WorkType, string> = {
    regular: 'bg-slate-100 text-slate-600',
    extra: 'bg-blue-100 text-blue-700',
    consult: 'bg-emerald-100 text-emerald-700',
};

function fmtMoney(n: number) { return n.toLocaleString('ko-KR') + '원'; }
function fmtHours(minutes: number) { return `${Math.floor(minutes / 60)}h ${minutes % 60}m`; }

const emptyForm = (): Partial<Teacher> => ({
    name: '', phone: '', email: '', subject: '수학', classIds: [],
    hireDate: new Date().toISOString().slice(0, 10), status: 'active',
    payType: 'freelance', basePay: 0, note: '',
});

type DetailTab = 'info' | 'work' | 'payslip';

/* ══════════════════════════════════════════════ */
export function TeacherAdmin() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<CourseClass[]>([]);
    const [selected, setSelected] = useState<Teacher | null>(null);
    const [detailTab, setDetailTab] = useState<DetailTab>('info');

    /* 강사 폼 */
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<Teacher>>(emptyForm());
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    /* 근무 기록 */
    const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
    const [workYear, setWorkYear] = useState(new Date().getFullYear());
    const [workMonth, setWorkMonth] = useState(new Date().getMonth() + 1);
    const [showWorkForm, setShowWorkForm] = useState(false);
    const [workForm, setWorkForm] = useState({ date: '', startTime: '14:00', endTime: '20:00', breakMinutes: 30, type: 'regular' as WorkType, note: '' });

    /* 급여 명세 */
    const [paySlips, setPaySlips] = useState<PaySlip[]>([]);
    const [payYear, setPayYear] = useState(new Date().getFullYear());
    const [payMonth, setPayMonth] = useState(new Date().getMonth() + 1);
    const [extraPayInput, setExtraPayInput] = useState('0');
    const [allowanceInput, setAllowanceInput] = useState('0'); // 학생수 or 시간
    const [preview, setPreview] = useState<ReturnType<typeof calcPaySlip> | null>(null);

    useEffect(() => {
        getTeachers().then(setTeachers);
        getCourseClasses().then(setCourses);
    }, []);

    /* 강사 선택 시 데이터 로드 */
    useEffect(() => {
        if (!selected) return;
        getWorkRecords().then(all => setWorkRecords(all.filter(r => r.teacherId === selected.id)));
        getPaySlips().then(all => setPaySlips(all.filter(p => p.teacherId === selected.id)));
    }, [selected]);

    /* 급여 미리보기 */
    useEffect(() => {
        if (!selected) return;
        const extra = parseInt(extraPayInput.replace(/,/g, ''), 10) || 0;
        const allowance = parseFloat(allowanceInput) || 0;
        setPreview(calcPaySlip(selected, selected.basePay, extra, payYear, payMonth, allowance));
    }, [selected, extraPayInput, allowanceInput, payYear, payMonth]);

    /* ── 현재 월 근무 데이터 ── */
    const pfx = `${workYear}-${String(workMonth).padStart(2, '0')}`;
    const monthRecords = workRecords.filter(r => r.date.startsWith(pfx));
    const totalMinutes = monthRecords.reduce((s, r) => s + Math.max(0, calcWorkMinutes(r)), 0);
    const extraMinutes = monthRecords.filter(r => r.type === 'extra').reduce((s, r) => s + Math.max(0, calcWorkMinutes(r)), 0);

    /* ── 강사 저장 ── */
    const handleSave = async () => {
        if (!form.name?.trim()) return;
        const now = Date.now();
        let updated: Teacher[];
        if (editingId) {
            updated = teachers.map(t => t.id === editingId ? { ...t, ...form } as Teacher : t);
        } else {
            const newT: Teacher = { id: `tc_${now}`, ...form } as Teacher;
            updated = [...teachers, newT];
        }
        await saveTeachers(updated);
        setTeachers(updated);
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm());
    };

    const openEdit = (t: Teacher) => { setForm({ ...t }); setEditingId(t.id); setShowForm(true); };

    const handleDelete = async (id: string) => {
        const updated = teachers.filter(t => t.id !== id);
        await saveTeachers(updated);
        setTeachers(updated);
        if (selected?.id === id) setSelected(null);
        setDeleteConfirmId(null);
    };

    /* ── 근무기록 저장 ── */
    const handleWorkSave = async () => {
        if (!workForm.date || !selected) return;
        const rec: WorkRecord = { id: `wr_${Date.now()}`, teacherId: selected.id, ...workForm };
        const all = await getWorkRecords();
        await saveWorkRecords([...all, rec]);
        setWorkRecords(prev => [...prev, rec]);
        setShowWorkForm(false);
        setWorkForm({ date: '', startTime: '14:00', endTime: '20:00', breakMinutes: 30, type: 'regular', note: '' });
    };

    /* ── 급여명세 발행 ── */
    const handlePaySlipIssue = async () => {
        if (!selected || !preview) return;
        const existing = paySlips.find(p => p.year === payYear && p.month === payMonth);
        if (existing) { alert(`${payYear}년 ${payMonth}월 명세서가 이미 존재합니다.`); return; }
        const slip: PaySlip = {
            id: `ps_${Date.now()}`, teacherId: selected.id, ...preview, createdAt: new Date().toISOString(),
        };
        const all = await getPaySlips();
        await savePaySlips([...all, slip]);
        setPaySlips(prev => [slip, ...prev]);
        setAllowanceInput('0');
        setExtraPayInput('0');
    };

    const courseMap: Record<string, string> = {};
    courses.forEach(c => { courseMap[c.id] = c.name; });

    /* ─────────────────────────── RENDER ─────────────────────────── */
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">강사 관리</h2>
                    <span className="ml-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {teachers.filter(t => t.status === 'active').length}명 재직
                    </span>
                </div>
                <button onClick={() => { setForm(emptyForm()); setEditingId(null); setShowForm(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    <UserPlus className="w-4 h-4" /> 강사 추가
                </button>
            </div>

            <div className="flex" style={{ minHeight: 400 }}>
                {/* 좌측 강사 목록 */}
                <div className="w-64 shrink-0 border-r border-slate-100 overflow-y-auto" style={{ maxHeight: 620 }}>
                    {teachers.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">등록된 강사가 없습니다.</div>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {teachers.map(t => (
                                <li key={t.id}>
                                    <button
                                        onClick={() => { setSelected(t); setDetailTab('info'); }}
                                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${selected?.id === t.id ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''}`}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {t.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-slate-800 text-sm truncate">{t.name}</div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 우측 상세 패널 */}
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: 620 }}>
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                            <Users className="w-12 h-12 opacity-30" />
                            <p className="text-sm">좌측에서 강사를 선택하세요</p>
                        </div>
                    ) : (
                        <div className="p-5">
                            {/* 강사 헤더 */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                        {selected.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-lg leading-none">{selected.name}</div>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAY_TYPE_COLORS[selected.payType]}`}>{PAY_TYPE_LABELS[selected.payType]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => openEdit(selected)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                                    {deleteConfirmId === selected.id ? (
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleDelete(selected.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg">삭제</button>
                                            <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-200 text-xs rounded-lg">취소</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setDeleteConfirmId(selected.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </div>

                            {/* 탭 */}
                            <div className="flex border-b border-slate-100 mb-5">
                                {([['info', '기본정보'], ['work', '근무기록'], ['payslip', '급여명세']] as [DetailTab, string][]).map(([id, label]) => (
                                    <button key={id} onClick={() => setDetailTab(id)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${detailTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* 기본정보 탭 */}
                            {detailTab === 'info' && (
                                <div className="space-y-3">
                                    {[
                                        { icon: Phone, label: '연락처', value: selected.phone },
                                        { icon: Mail, label: '이메일', value: selected.email },
                                        { icon: Briefcase, label: '담당 과목', value: selected.subject },
                                        { icon: Calendar, label: '입사일', value: selected.hireDate },
                                        { icon: Building2, label: '급여 계좌', value: selected.bankName ? `${selected.bankName} ${selected.bankAccount}` : '—' },
                                        { icon: CreditCard, label: '기본급 / 시급', value: fmtMoney(selected.basePay) },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
                                            <span className="text-sm text-slate-800 font-medium">{value}</span>
                                        </div>
                                    ))}
                                    {selected.extraHourlyRate && (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="text-xs text-slate-500 w-20 shrink-0">수당 시급</span>
                                            <span className="text-sm text-slate-800 font-medium">{fmtMoney(selected.extraHourlyRate)}</span>
                                        </div>
                                    )}
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="text-xs text-slate-500 w-20 shrink-0">담당 반</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 ml-7">
                                            {selected.classIds.map(cid => (
                                                <span key={cid} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{courseMap[cid] || cid}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {selected.note && (
                                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">{selected.note}</div>
                                    )}
                                </div>
                            )}

                            {/* 근무기록 탭 */}
                            {detailTab === 'work' && (
                                <div>
                                    {/* 월 네비 */}
                                    <div className="flex items-center justify-between mb-3">
                                        <button onClick={() => { if (workMonth === 1) { setWorkYear(y => y - 1); setWorkMonth(12); } else setWorkMonth(m => m - 1); }}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
                                        <span className="font-semibold text-slate-800 text-sm">{workYear}년 {workMonth}월</span>
                                        <button onClick={() => { if (workMonth === 12) { setWorkYear(y => y + 1); setWorkMonth(1); } else setWorkMonth(m => m + 1); }}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
                                    </div>

                                    {/* 통계 */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                                            <div className="text-base font-bold text-slate-800">{monthRecords.length}일</div>
                                            <div className="text-xs text-slate-500">근무일</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                                            <div className="text-base font-bold text-blue-700">{fmtHours(totalMinutes)}</div>
                                            <div className="text-xs text-slate-500">총 근무</div>
                                        </div>
                                        <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
                                            <div className="text-base font-bold text-indigo-700">{fmtHours(extraMinutes)}</div>
                                            <div className="text-xs text-slate-500">추가강의</div>
                                        </div>
                                    </div>

                                    <button onClick={() => setShowWorkForm(v => !v)}
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 mb-3 transition-colors">
                                        <Plus className="w-4 h-4" /> 근무 추가
                                    </button>

                                    {showWorkForm && (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-3 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">날짜</label>
                                                    <input type="date" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400"
                                                        value={workForm.date} onChange={e => setWorkForm(f => ({ ...f, date: e.target.value }))} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">유형</label>
                                                    <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400"
                                                        value={workForm.type} onChange={e => setWorkForm(f => ({ ...f, type: e.target.value as WorkType }))}>
                                                        <option value="regular">정규</option>
                                                        <option value="extra">추가강의</option>
                                                        <option value="consult">상담</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">출근</label>
                                                    <input type="time" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400"
                                                        value={workForm.startTime} onChange={e => setWorkForm(f => ({ ...f, startTime: e.target.value }))} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">퇴근</label>
                                                    <input type="time" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400"
                                                        value={workForm.endTime} onChange={e => setWorkForm(f => ({ ...f, endTime: e.target.value }))} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">휴게(분)</label>
                                                    <input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400"
                                                        value={workForm.breakMinutes} onChange={e => setWorkForm(f => ({ ...f, breakMinutes: parseInt(e.target.value) || 0 }))} />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setShowWorkForm(false)} className="px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">취소</button>
                                                <button onClick={handleWorkSave} className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">저장</button>
                                            </div>
                                        </div>
                                    )}

                                    {monthRecords.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-sm"><Clock className="w-7 h-7 mx-auto mb-2 opacity-30" />근무 기록이 없습니다.</div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {monthRecords.sort((a, b) => a.date.localeCompare(b.date)).map(r => {
                                                const mins = calcWorkMinutes(r);
                                                return (
                                                    <div key={r.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="text-xs font-semibold text-slate-500 w-10">{r.date.slice(8)}</div>
                                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${WORK_TYPE_COLORS[r.type]}`}>{WORK_TYPE_LABELS[r.type]}</span>
                                                        <div className="text-xs text-slate-600">{r.startTime} ~ {r.endTime}</div>
                                                        <div className="ml-auto text-xs font-medium text-slate-700">{fmtHours(mins)}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 급여명세 탭 */}
                            {detailTab === 'payslip' && (
                                <div>
                                    {/* 월 선택 */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button onClick={() => { if (payMonth === 1) { setPayYear(y => y - 1); setPayMonth(12); } else setPayMonth(m => m - 1); }}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
                                        <span className="font-semibold text-slate-800 text-sm">{payYear}년 {payMonth}월 급여명세</span>
                                        <button onClick={() => { if (payMonth === 12) { setPayYear(y => y + 1); setPayMonth(1); } else setPayMonth(m => m + 1); }}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
                                    </div>

                                    {/* 수당 입력 */}
                                    <div className="mb-4 space-y-2">
                                        {/* 수당 유형별 입력 */}
                                        {selected.allowanceType === 'per_student' && (
                                            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                                                <label className="block text-xs font-semibold text-violet-800 mb-1">
                                                    👤 학생 1명당 수당 — 이번 달 담당 학생 수 입력
                                                </label>
                                                <p className="text-xs text-violet-600 mb-2">
                                                    단가: {(selected.perStudentRate || 0).toLocaleString()}원/명
                                                </p>
                                                <input type="number" min="0"
                                                    className="w-full px-3 py-2 border border-violet-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-400"
                                                    value={allowanceInput}
                                                    onChange={e => setAllowanceInput(e.target.value)}
                                                    placeholder="학생 수 입력" />
                                                <p className="text-xs text-violet-500 mt-1">
                                                    예상 수당: {((parseFloat(allowanceInput) || 0) * (selected.perStudentRate || 0)).toLocaleString()}원
                                                </p>
                                            </div>
                                        )}
                                        {selected.allowanceType === 'hourly' && (
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                                <label className="block text-xs font-semibold text-amber-800 mb-1">
                                                    ⏱ 시급 수당 — 이번 달 수당 시간 입력
                                                </label>
                                                <p className="text-xs text-amber-600 mb-2">
                                                    시급: {(selected.hourlyRate || 0).toLocaleString()}원/시간
                                                </p>
                                                <input type="number" min="0" step="0.5"
                                                    className="w-full px-3 py-2 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                                                    value={allowanceInput}
                                                    onChange={e => setAllowanceInput(e.target.value)}
                                                    placeholder="수당 시간 입력 (예: 4.5)" />
                                                <p className="text-xs text-amber-500 mt-1">
                                                    예상 수당: {Math.round((parseFloat(allowanceInput) || 0) * (selected.hourlyRate || 0)).toLocaleString()}원
                                                </p>
                                            </div>
                                        )}
                                        {!selected.allowanceType && (
                                            <div className="text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl">
                                                수당 유형이 설정되지 않았습니다. 강사 정보에서 수당 유형을 설정하세요.
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">기타 추가금액 (직접 입력, 원)</label>
                                            <input type="number"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={extraPayInput} onChange={e => setExtraPayInput(e.target.value)} placeholder="0" />
                                        </div>
                                    </div>

                                    {/* 미리보기 */}
                                    {preview && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 mb-4">
                                            <div className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> 급여명세 미리보기
                                                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${PAY_TYPE_COLORS[selected.payType]}`}>{PAY_TYPE_LABELS[selected.payType]}</span>
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    { label: '기본급', value: preview.basePay, color: '' },
                                                    { label: '기타 추가금액', value: preview.extraPay, color: '' },
                                                    ...(preview.allowanceAmount > 0 ? [{ label: `수당 (${preview.allowanceDetail})`, value: preview.allowanceAmount, color: 'text-violet-700' }] : []),
                                                    { label: '지급 총액', value: preview.grossPay, color: 'font-bold' },
                                                    { label: '4대보험 (근로자)', value: -preview.insuranceEmployee, color: 'text-rose-600' },
                                                    { label: '원천세', value: -preview.withholdingTax, color: 'text-rose-600' },
                                                    { label: '지방소득세', value: -preview.localIncomeTax, color: 'text-rose-600' },
                                                ].map(({ label, value, color }) => (
                                                    <div key={label} className="flex justify-between text-sm">
                                                        <span className="text-slate-600">{label}</span>
                                                        <span className={`font-medium ${color}`}>
                                                            {value < 0 ? `−${fmtMoney(Math.abs(value))}` : fmtMoney(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-indigo-200 pt-2 flex justify-between">
                                                    <span className="font-bold text-slate-900">실 지급액</span>
                                                    <span className="font-bold text-indigo-700 text-base">{fmtMoney(preview.netPay)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 mt-3 p-2 bg-amber-50 border border-amber-200 rounded-xl">
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-700">세금 계산은 참고용입니다. 실제 신고 시 세무사 또는 국세청 홈택스를 이용하세요.</p>
                                            </div>
                                            <button onClick={handlePaySlipIssue}
                                                className="w-full mt-3 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                                                이번 달 명세서 발행
                                            </button>
                                        </div>
                                    )}

                                    {/* 이력 */}
                                    {paySlips.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 mb-2">발행 이력</h4>
                                            <div className="space-y-2">
                                                {paySlips.sort((a, b) => `${b.year}${String(b.month).padStart(2, '0')}`.localeCompare(`${a.year}${String(a.month).padStart(2, '0')}`)).map(p => (
                                                    <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-semibold text-slate-800">{p.year}년 {p.month}월</span>
                                                            <span className="font-bold text-indigo-700 text-sm">지급 {fmtMoney(p.netPay)}</span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 space-y-0.5">
                                                            <div className="flex justify-between">
                                                                <span>기본급</span><span>{fmtMoney(p.basePay)}</span>
                                                            </div>
                                                            {(p.allowanceAmount ?? 0) > 0 && (
                                                                <div className="flex justify-between text-violet-600">
                                                                    <span>수당 ({p.allowanceDetail})</span>
                                                                    <span>{fmtMoney(p.allowanceAmount)}</span>
                                                                </div>
                                                            )}
                                                            {p.extraPay > 0 && (
                                                                <div className="flex justify-between">
                                                                    <span>기타 추가금</span><span>{fmtMoney(p.extraPay)}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between text-rose-500">
                                                                <span>공제 합계</span><span>−{fmtMoney(p.insuranceEmployee + p.withholdingTax + p.localIncomeTax)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 강사 추가/수정 모달 */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">{editingId ? '강사 수정' : '강사 추가'}</h3>
                            <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                {[['name', '이름'], ['phone', '연락처'], ['email', '이메일'], ['subject', '과목']].map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                                        <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                            value={(form as any)[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">급여 유형</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                                        value={form.payType || 'freelance'} onChange={e => setForm(f => ({ ...f, payType: e.target.value as PayType }))}>
                                        {(Object.entries(PAY_TYPE_LABELS) as [PayType, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                        {form.payType === 'parttime' ? '시급 (원)' : '기본 월급 (원)'}
                                    </label>
                                    <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={form.basePay || ''} onChange={e => setForm(f => ({ ...f, basePay: parseInt(e.target.value) || 0 }))} />
                                </div>
                            </div>
                            {form.payType === 'employee_extra' && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">추가 수당 시급 (원)</label>
                                    <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={form.extraHourlyRate || ''} onChange={e => setForm(f => ({ ...f, extraHourlyRate: parseInt(e.target.value) || 0 }))} />
                                </div>
                            )}
                            {/* 수당 유형 설정 (신규) */}
                            <div className="border-t border-slate-100 pt-3">
                                <p className="text-xs font-semibold text-slate-600 mb-2">수당 설정</p>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    {(['none', 'per_student', 'hourly'] as const).map(t => (
                                        <button key={t} type="button"
                                            onClick={() => setForm(f => ({ ...f, allowanceType: t === 'none' ? undefined : t }))}
                                            className={`px-2 py-1.5 text-xs rounded-lg border font-medium transition-colors ${(form.allowanceType ?? 'none') === t
                                                    ? 'bg-violet-600 text-white border-violet-600'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                                                }`}>
                                            {t === 'none' ? '수당 없음' : t === 'per_student' ? '1인당 수당' : '시급 수당'}
                                        </button>
                                    ))}
                                </div>
                                {form.allowanceType === 'per_student' && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">학생 1명당 수당 (원)</label>
                                        <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                            value={form.perStudentRate || ''} onChange={e => setForm(f => ({ ...f, perStudentRate: parseInt(e.target.value) || 0 }))} placeholder="예: 5000" />
                                    </div>
                                )}
                                {form.allowanceType === 'hourly' && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">시급 (원)</label>
                                        <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                            value={form.hourlyRate || ''} onChange={e => setForm(f => ({ ...f, hourlyRate: parseInt(e.target.value) || 0 }))} placeholder="예: 15000" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">입사일</label>
                                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={form.hireDate || ''} onChange={e => setForm(f => ({ ...f, hireDate: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">재직 상태</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                                        value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as TeacherStatus }))}>
                                        <option value="active">재직</option>
                                        <option value="leave">휴직</option>
                                        <option value="resigned">퇴직</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">은행명</label>
                                    <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={form.bankName || ''} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="국민은행" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">계좌번호</label>
                                    <input className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={form.bankAccount || ''} onChange={e => setForm(f => ({ ...f, bankAccount: e.target.value }))} placeholder="123-456-789012" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">메모</label>
                                <textarea rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                                    value={form.note || ''} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">취소</button>
                            <button onClick={handleSave} disabled={!form.name?.trim()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                                <Save className="w-4 h-4" /> 저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
