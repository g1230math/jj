import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import {
    Check, X, Clock, AlertTriangle, UserCheck, UserX, Calendar,
    Search, Filter, ChevronLeft, ChevronRight, QrCode, Hash
} from 'lucide-react';
import {
    getAttendance, saveAttendance, addAttendance, genId,
    type AttendanceRecord, type AttendanceStatus
} from '../data/academyData';

const STATUS_MAP: Record<AttendanceStatus, { label: string; icon: string; color: string }> = {
    present: { label: '출석', icon: '✅', color: 'bg-emerald-100 text-emerald-700' },
    absent: { label: '결석', icon: '❌', color: 'bg-red-100 text-red-700' },
    late: { label: '지각', icon: '⏰', color: 'bg-amber-100 text-amber-700' },
    excused: { label: '사유결석', icon: '📋', color: 'bg-blue-100 text-blue-700' },
};

const STUDENTS = [
    { id: '1', name: '김지훈' }, { id: 's2', name: '이수진' }, { id: 's3', name: '박민수' },
    { id: 's4', name: '최유진' }, { id: 's5', name: '정다은' },
];

export function AttendanceAdmin() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [checkinMode, setCheckinMode] = useState(false);
    const [checkinCode, setCheckinCode] = useState('');

    useEffect(() => { setRecords(getAttendance()); }, []);

    const todayRecords = useMemo(() => records.filter(r => r.date === selectedDate), [records, selectedDate]);

    const quickCheckin = (studentId: string, status: AttendanceStatus) => {
        const student = STUDENTS.find(s => s.id === studentId);
        if (!student) return;
        const existing = todayRecords.find(r => r.student_id === studentId);
        if (existing) {
            const updated = { ...existing, status, check_in_time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
            const all = records.map(r => r.id === existing.id ? updated : r);
            saveAttendance(all);
            setRecords(all);
        } else {
            const rec: AttendanceRecord = {
                id: genId('att'), student_id: studentId, student_name: student.name,
                date: selectedDate, status, check_in_time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            };
            addAttendance(rec);
            setRecords(getAttendance());
        }
    };

    const changeDate = (delta: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + delta);
        setSelectedDate(d.toISOString().slice(0, 10));
    };

    const presentCount = todayRecords.filter(r => r.status === 'present').length;
    const lateCount = todayRecords.filter(r => r.status === 'late').length;
    const absentCount = todayRecords.filter(r => r.status === 'absent').length;

    // Monthly stats
    const monthStr = selectedDate.slice(0, 7);
    const monthRecords = records.filter(r => r.date.startsWith(monthStr));
    const monthPresent = monthRecords.filter(r => r.status === 'present').length;
    const monthTotal = monthRecords.length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-600" /> 출결 관리
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">오늘 출석 현황을 관리합니다</p>
                </div>
            </div>

            {/* Date Selector + Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                    <div className="text-center">
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                            className="text-sm font-bold text-slate-900 bg-transparent border-none text-center cursor-pointer" />
                        <p className="text-[10px] text-slate-400">
                            {new Date(selectedDate).toLocaleDateString('ko-KR', { weekday: 'long' })}
                        </p>
                    </div>
                    <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-emerald-700">{presentCount}</p>
                        <p className="text-[10px] text-emerald-600">출석</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-amber-700">{lateCount}</p>
                        <p className="text-[10px] text-amber-600">지각</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-red-700">{absentCount}</p>
                        <p className="text-[10px] text-red-600">결석</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-indigo-700">{monthTotal > 0 ? Math.round(monthPresent / monthTotal * 100) : 0}%</p>
                        <p className="text-[10px] text-indigo-600">이달 출석률</p>
                    </div>
                </div>
            </div>

            {/* Checkin List */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">학생 목록</span>
                    <span className="text-[10px] text-slate-400">{STUDENTS.length}명</span>
                </div>
                {STUDENTS.map(student => {
                    const rec = todayRecords.find(r => r.student_id === student.id);
                    const st = rec ? STATUS_MAP[rec.status] : null;
                    return (
                        <div key={student.id} className="px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {student.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800">{student.name}</p>
                                {rec && <p className="text-[10px] text-slate-400">{rec.check_in_time && `입실: ${rec.check_in_time}`}</p>}
                            </div>
                            {st ? (
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", st.color)}>
                                    {st.icon} {st.label}
                                </span>
                            ) : (
                                <span className="text-[10px] text-slate-400">미체크</span>
                            )}
                            <div className="flex gap-1">
                                {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(s => (
                                    <button key={s} onClick={() => quickCheckin(student.id, s)}
                                        className={cn("w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-colors",
                                            rec?.status === s ? STATUS_MAP[s].color + " ring-2 ring-offset-1" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                        )} title={STATUS_MAP[s].label}>
                                        {STATUS_MAP[s].icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
