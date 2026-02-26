import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import { DollarSign, Plus, Check, AlertTriangle, Clock, Search, ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { getTuition, saveTuition, genId, type TuitionRecord, type PaymentStatus } from '../data/academyData';

const STATUS_MAP: Record<PaymentStatus, { label: string; color: string; icon: string }> = {
    paid: { label: '납부완료', color: 'bg-emerald-100 text-emerald-700', icon: '✅' },
    unpaid: { label: '미납', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
    overdue: { label: '연체', color: 'bg-red-100 text-red-700', icon: '🚨' },
    partial: { label: '부분납부', color: 'bg-blue-100 text-blue-700', icon: '💳' },
};

export function TuitionAdmin() {
    const [records, setRecords] = useState<TuitionRecord[]>([]);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => { setRecords(getTuition()); }, []);

    const filtered = useMemo(() => {
        return records.filter(r => {
            if (filterMonth && r.month !== filterMonth) return false;
            if (filterStatus && r.status !== filterStatus) return false;
            return true;
        });
    }, [records, filterMonth, filterStatus]);

    const totalAmount = filtered.reduce((s, r) => s + r.amount - r.discount, 0);
    const totalPaid = filtered.reduce((s, r) => s + r.paid_amount, 0);
    const unpaidCount = filtered.filter(r => r.status === 'unpaid' || r.status === 'overdue').length;
    const overdueCount = filtered.filter(r => r.status === 'overdue').length;

    const togglePaid = (id: string) => {
        const all = [...records];
        const rec = all.find(r => r.id === id);
        if (!rec) return;
        if (rec.status === 'paid') {
            rec.status = 'unpaid'; rec.paid_amount = 0; rec.paid_at = undefined;
        } else {
            rec.status = 'paid'; rec.paid_amount = rec.amount - rec.discount; rec.paid_at = new Date().toISOString().slice(0, 10);
        }
        saveTuition(all); setRecords([...all]);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" /> 학원비 관리
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">수강료 납부 현황을 관리합니다</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">{(totalAmount).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">총 청구액 (원)</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-600">{(totalPaid).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">납부액 (원)</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <p className="text-lg font-bold text-amber-600">{unpaidCount}</p>
                    <p className="text-[10px] text-slate-500">미납 건수</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <p className="text-lg font-bold text-red-600">{overdueCount}</p>
                    <p className="text-[10px] text-slate-500">연체 건수</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option value="">전체 상태</option>
                    <option value="paid">납부완료</option>
                    <option value="unpaid">미납</option>
                    <option value="overdue">연체</option>
                    <option value="partial">부분납부</option>
                </select>
            </div>

            {/* Records */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {/* Table Header (desktop) */}
                <div className="hidden sm:grid grid-cols-7 gap-2 px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500">
                    <span>학생</span><span>월</span><span>청구액</span><span>할인</span><span>납부액</span><span>상태</span><span>납부 처리</span>
                </div>
                {filtered.length === 0 ? (
                    <div className="p-8 text-center">
                        <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">해당 조건의 기록이 없습니다</p>
                    </div>
                ) : filtered.map(rec => {
                    const st = STATUS_MAP[rec.status];
                    const netAmount = rec.amount - rec.discount;
                    return (
                        <div key={rec.id} className="px-4 py-3">
                            {/* Mobile */}
                            <div className="sm:hidden space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{rec.student_name}</p>
                                        <p className="text-[10px] text-slate-400">{rec.month} • 마감: {rec.due_date}</p>
                                    </div>
                                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", st.color)}>{st.icon} {st.label}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">청구: {netAmount.toLocaleString()}원 {rec.discount > 0 && `(할인 ${rec.discount.toLocaleString()})`}</span>
                                    <button onClick={() => togglePaid(rec.id)}
                                        className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                                            rec.status === 'paid' ? "bg-slate-100 text-slate-500" : "bg-emerald-500 text-white"
                                        )}>
                                        {rec.status === 'paid' ? '납부 취소' : '납부 처리'}
                                    </button>
                                </div>
                            </div>
                            {/* Desktop */}
                            <div className="hidden sm:grid grid-cols-7 gap-2 items-center">
                                <span className="text-sm font-medium text-slate-800">{rec.student_name}</span>
                                <span className="text-sm text-slate-600">{rec.month}</span>
                                <span className="text-sm text-slate-700">{rec.amount.toLocaleString()}</span>
                                <span className="text-sm text-slate-500">{rec.discount > 0 ? `-${rec.discount.toLocaleString()}` : '-'}</span>
                                <span className="text-sm font-medium text-slate-800">{rec.paid_amount.toLocaleString()}</span>
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full w-fit", st.color)}>{st.icon} {st.label}</span>
                                <button onClick={() => togglePaid(rec.id)}
                                    className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors w-fit",
                                        rec.status === 'paid' ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-emerald-500 text-white hover:bg-emerald-600"
                                    )}>
                                    {rec.status === 'paid' ? '취소' : '납부'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
