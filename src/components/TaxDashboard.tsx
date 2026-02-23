import React, { useState, useEffect } from 'react';
import {
    Receipt, AlertCircle, CheckCircle2, Clock, XCircle,
    ChevronLeft, ChevronRight, TrendingUp, FileText, DollarSign,
} from 'lucide-react';
import {
    TaxMemo, TaxType, TaxStatus, getTaxMemos, saveTaxMemo,
    PaySlip, getPaySlips,
    Teacher, getTeachers,
    getPayments,
} from '../data/mockData';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ── 상수 ── */
const TAX_TYPE_LABELS: Record<TaxType, string> = {
    withholding: '원천세',
    vat: '부가가치세',
    income_tax: '종합소득세',
    local_income: '지방소득세',
    business_status: '사업장현황신고',
};
const TAX_TYPE_COLORS: Record<TaxType, string> = {
    withholding: 'bg-blue-100 text-blue-700 border-blue-200',
    vat: 'bg-violet-100 text-violet-700 border-violet-200',
    income_tax: 'bg-rose-100 text-rose-700 border-rose-200',
    local_income: 'bg-orange-100 text-orange-700 border-orange-200',
    business_status: 'bg-slate-100 text-slate-600 border-slate-200',
};
const STATUS_ICONS: Record<TaxStatus, React.FC<{ className?: string }>> = {
    pending: Clock,
    filed: CheckCircle2,
    paid: CheckCircle2,
};
const STATUS_COLORS: Record<TaxStatus, string> = {
    pending: 'text-amber-500',
    filed: 'text-blue-500',
    paid: 'text-emerald-600',
};
const STATUS_LABELS: Record<TaxStatus, string> = { pending: '신고 예정', filed: '신고 완료', paid: '납부 완료' };
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function fmtMoney(n: number) { return n.toLocaleString('ko-KR'); }
function diffDays(dateStr: string): number {
    const due = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.ceil((due - now) / 86400000);
}

/* ══════════════════════════════════════════════ */
export function TaxDashboard() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [taxMemos, setTaxMemos] = useState<TaxMemo[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [paySlips, setPaySlips] = useState<PaySlip[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyData, setMonthlyData] = useState<{ name: string; 수납: number; 인건비: number }[]>([]);
    const [filterType, setFilterType] = useState<TaxType | 'all'>('all');

    useEffect(() => {
        getTaxMemos(year).then(setTaxMemos);
        getTeachers().then(setTeachers);
        getPaySlips().then(setPaySlips);
        // 수납 데이터
        getPayments().then(payments => {
            const paid = payments.filter(p => p.status === 'paid');
            setTotalRevenue(paid.reduce((s, p) => s + p.amount, 0));
            // 월별 수납 집계
            const byMonth: Record<number, number> = {};
            paid.forEach(p => {
                if (p.paidAt) {
                    const m = parseInt(p.paidAt.slice(5, 7), 10);
                    byMonth[m] = (byMonth[m] || 0) + p.amount;
                }
            });
            const slipsByMonth: Record<number, number> = {};
            // 급여명세는 별도 로드
            getPaySlips().then(slips => {
                slips.filter(s => s.year === year).forEach(s => {
                    slipsByMonth[s.month] = (slipsByMonth[s.month] || 0) + s.grossPay;
                });
                setMonthlyData(MONTH_NAMES.map((name, i) => ({
                    name,
                    수납: byMonth[i + 1] || 0,
                    인건비: slipsByMonth[i + 1] || 0,
                })));
            });
        });
    }, [year]);

    /* 원천세 집계 (발행된 PaySlip 기준) */
    const yearSlips = paySlips.filter(s => s.year === year);
    const totalGross = yearSlips.reduce((s, p) => s + p.grossPay, 0);
    const totalWht = yearSlips.reduce((s, p) => s + p.withholdingTax + p.localIncomeTax, 0);
    const totalInsurance = yearSlips.reduce((s, p) => s + p.insuranceEmployee, 0);

    /* 상태 변경 */
    const toggleStatus = async (memo: TaxMemo) => {
        const next: TaxStatus = memo.status === 'pending' ? 'filed' : memo.status === 'filed' ? 'paid' : 'pending';
        const updated = { ...memo, status: next };
        await saveTaxMemo(updated);
        setTaxMemos(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

    /* 이번 달 기준 임박 일정 (D-0 ~ D+30) */
    const upcoming = taxMemos
        .filter(t => t.status !== 'paid')
        .map(t => ({ ...t, days: diffDays(t.dueDate) }))
        .filter(t => t.days >= -3 && t.days <= 45)
        .sort((a, b) => a.days - b.days);

    const filtered = filterType === 'all' ? taxMemos : taxMemos.filter(t => t.taxType === filterType);

    /* 강사별 원천세 집계 */
    const teacherWht = teachers.map(t => {
        const slips = yearSlips.filter(s => s.teacherId === t.id);
        const gross = slips.reduce((s, p) => s + p.grossPay, 0);
        const wht = slips.reduce((s, p) => s + p.withholdingTax + p.localIncomeTax, 0);
        return { ...t, gross, wht };
    }).filter(t => t.gross > 0);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-rose-600" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">세금·정산 대시보드</h2>
                </div>
                {/* 연도 네비 */}
                <div className="flex items-center gap-2">
                    <button onClick={() => setYear(y => y - 1)} className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
                    <span className="font-semibold text-slate-800 text-sm">{year}년</span>
                    <button onClick={() => setYear(y => y + 1)} className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
                </div>
            </div>

            <div className="p-5 space-y-6">

                {/* ── 요약 카드 ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: DollarSign, label: '연간 수납 (완납)', value: `${fmtMoney(totalRevenue)}원`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { icon: TrendingUp, label: '총 인건비 지급', value: `${fmtMoney(totalGross)}원`, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Receipt, label: '원천세 합계', value: `${fmtMoney(totalWht)}원`, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { icon: FileText, label: '4대보험 (근로자)', value: `${fmtMoney(totalInsurance)}원`, color: 'text-violet-600', bg: 'bg-violet-50' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} className={`${bg} rounded-2xl p-4`}>
                            <Icon className={`w-5 h-5 ${color} mb-2`} />
                            <div className={`text-base font-bold ${color} leading-tight`}>{value}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* ── 임박 세무 일정 ── */}
                {upcoming.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-500" /> 임박 세무 일정
                        </h3>
                        <div className="space-y-2">
                            {upcoming.slice(0, 5).map(t => {
                                const isUrgent = t.days <= 7;
                                return (
                                    <div key={t.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                                        <div className={`text-center leading-none min-w-[48px] ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                                            <div className="text-xs font-medium">{t.days >= 0 ? `D-${t.days}` : `D+${Math.abs(t.days)}`}</div>
                                            <div className="text-xs opacity-70">{t.dueDate.slice(5).replace('-', '/')}</div>
                                        </div>
                                        <div className="flex-1">
                                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${TAX_TYPE_COLORS[t.taxType]}`}>
                                                {TAX_TYPE_LABELS[t.taxType]}
                                            </span>
                                            {t.month && <span className="ml-1.5 text-xs text-slate-500">{t.month}월분</span>}
                                            {t.note && <span className="ml-1.5 text-xs text-slate-400">{t.note}</span>}
                                        </div>
                                        <button onClick={() => toggleStatus(t)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${STATUS_COLORS[t.status]} hover:opacity-80`}>
                                            {STATUS_LABELS[t.status]}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── 월별 수납·인건비 차트 ── */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-500" /> 월별 수납 / 인건비
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }}
                                    tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 10000).toFixed(0)}만`} />
                                <Tooltip formatter={(v: number) => [`${fmtMoney(v)}원`]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="수납" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                                <Bar dataKey="인건비" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── 강사별 원천세 ── */}
                {teacherWht.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-rose-500" /> {year}년 강사별 원천세 현황
                            <span className="text-xs text-slate-400 font-normal ml-1">(발행된 명세서 기준)</span>
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600 text-left">
                                        {['강사', '급여유형', '지급총액', '원천세+지방세', '4대보험', '실지급'].map(h => (
                                            <th key={h} className="px-3 py-2 text-xs font-semibold whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {teacherWht.map(t => {
                                        const slips = yearSlips.filter(s => s.teacherId === t.id);
                                        const net = slips.reduce((s, p) => s + p.netPay, 0);
                                        const ins = slips.reduce((s, p) => s + p.insuranceEmployee, 0);
                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50/50">
                                                <td className="px-3 py-2 font-medium text-slate-800">{t.name}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${{
                                                        freelance: 'bg-violet-100 text-violet-700',
                                                        employee_full: 'bg-blue-100 text-blue-700',
                                                        employee_extra: 'bg-indigo-100 text-indigo-700',
                                                        parttime: 'bg-amber-100 text-amber-700',
                                                    }[t.payType]}`}>{
                                                            { freelance: '프리랜서', employee_full: '정직원', employee_extra: '정직원+수당', parttime: '시급알바' }[t.payType]
                                                        }</span>
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium text-slate-800">{fmtMoney(t.gross)}원</td>
                                                <td className="px-3 py-2 text-right text-rose-600 font-medium">{fmtMoney(t.wht)}원</td>
                                                <td className="px-3 py-2 text-right text-violet-600 font-medium">{fmtMoney(ins)}원</td>
                                                <td className="px-3 py-2 text-right font-bold text-slate-900">{fmtMoney(net)}원</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-slate-50 font-semibold">
                                        <td colSpan={2} className="px-3 py-2 text-xs text-slate-600">합 계</td>
                                        <td className="px-3 py-2 text-right text-slate-800">{fmtMoney(totalGross)}원</td>
                                        <td className="px-3 py-2 text-right text-rose-600">{fmtMoney(totalWht)}원</td>
                                        <td className="px-3 py-2 text-right text-violet-600">{fmtMoney(totalInsurance)}원</td>
                                        <td className="px-3 py-2 text-right text-slate-900">{fmtMoney(yearSlips.reduce((s, p) => s + p.netPay, 0))}원</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── 세무 캘린더 전체 ── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-indigo-500" /> {year}년 세무 체크리스트
                        </h3>
                        {/* 필터 */}
                        <div className="flex gap-1 flex-wrap justify-end">
                            {(['all', 'withholding', 'income_tax', 'vat', 'business_status'] as const).map(type => (
                                <button key={type} onClick={() => setFilterType(type)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {type === 'all' ? '전체' : TAX_TYPE_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                        {filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(t => {
                            const StatusIcon = STATUS_ICONS[t.status];
                            const days = diffDays(t.dueDate);
                            const isPast = days < -3;
                            return (
                                <div key={t.id}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${t.status === 'paid' ? 'border-emerald-100 bg-emerald-50/50 opacity-70' :
                                            isPast ? 'border-red-100 bg-red-50/50' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                                        }`}>
                                    <button onClick={() => toggleStatus(t)} title="클릭하여 상태 변경">
                                        <StatusIcon className={`w-4 h-4 ${STATUS_COLORS[t.status]}`} />
                                    </button>
                                    <span className={`text-xs font-medium w-4 ${TAX_TYPE_COLORS[t.taxType]} px-1.5 py-0.5 rounded`}>
                                    </span>
                                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${TAX_TYPE_COLORS[t.taxType]} whitespace-nowrap`}>
                                        {TAX_TYPE_LABELS[t.taxType]}
                                    </span>
                                    <span className="text-xs text-slate-600 flex-1">
                                        {t.month ? `${t.month}월분` : ''} {t.note || ''}
                                    </span>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{t.dueDate.slice(5).replace('-', '.')}</span>
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ${t.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                            t.status === 'filed' ? 'bg-blue-100 text-blue-700' :
                                                isPast ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {t.status === 'paid' ? '납부완료' : t.status === 'filed' ? '신고완료' : isPast ? '기한초과' : `D-${Math.max(0, days)}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* 면책 문구 */}
                    <div className="flex items-start gap-2 mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            본 대시보드의 세금 계산 및 신고일정은 <strong>참고용</strong>입니다. 실제 세금 신고·납부는 세무사 또는 국세청 홈택스(hometax.go.kr)를 통해 처리하시기 바랍니다.
                            학원 수업료는 부가세 면세 대상이나, 교재·교구 판매 등은 과세될 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
