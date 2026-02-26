import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Clock, Plus, Trash2, X, Save, Calendar } from 'lucide-react';
import { getSchedule, saveSchedule, genId, type ScheduleEntry } from '../data/academyData';

const DAYS = ['월', '화', '수', '목', '금'];
const HOURS = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function ScheduleAdmin() {
    const [entries, setEntries] = useState<ScheduleEntry[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ class_name: '', teacher_name: '', day_of_week: 0, start_time: '16:00', end_time: '17:30', subject: '', color: COLORS[0] });

    useEffect(() => { setEntries(getSchedule()); }, []);

    const handleAdd = () => {
        if (!form.class_name || !form.subject) { alert('반 이름과 과목을 입력해주세요.'); return; }
        const entry: ScheduleEntry = { id: genId('sc'), ...form };
        const all = [...entries, entry];
        saveSchedule(all); setEntries(all); setShowAdd(false);
        setForm({ class_name: '', teacher_name: '', day_of_week: 0, start_time: '16:00', end_time: '17:30', subject: '', color: COLORS[entries.length % COLORS.length] });
    };

    const handleDelete = (id: string) => {
        if (!confirm('삭제하시겠습니까?')) return;
        const all = entries.filter(e => e.id !== id);
        saveSchedule(all); setEntries(all);
    };

    const getTimeRow = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return (h - 15) * 2 + (m >= 30 ? 1 : 0);
    };

    const getEntryStyle = (entry: ScheduleEntry) => {
        const startRow = getTimeRow(entry.start_time);
        const endRow = getTimeRow(entry.end_time);
        return { gridRow: `${startRow + 2} / ${endRow + 2}`, gridColumn: `${entry.day_of_week + 2}` };
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" /> 수업 시간표
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">반별 수업 시간표를 관리합니다</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus className="w-4 h-4" /> 수업 추가
                </button>
            </div>

            {showAdd && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })}
                            placeholder="반 이름 *" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        <input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })}
                            placeholder="담당 강사" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                            placeholder="과목/내용 *" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: Number(e.target.value) })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                            {DAYS.map((d, i) => <option key={i} value={i}>{d}요일</option>)}
                        </select>
                        <select value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                            {HOURS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                            {HOURS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">색상:</span>
                        {COLORS.map(c => (
                            <button key={c} onClick={() => setForm({ ...form, color: c })}
                                className={cn("w-6 h-6 rounded-full border-2 transition-all", form.color === c ? "border-slate-900 scale-110" : "border-transparent")}
                                style={{ backgroundColor: c }} />
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleAdd} className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">추가</button>
                    </div>
                </div>
            )}

            {/* Timetable Grid (mobile: card list, desktop: grid) */}
            {/* Mobile: Card List */}
            <div className="sm:hidden space-y-2">
                {DAYS.map((day, dayIdx) => {
                    const dayEntries = entries.filter(e => e.day_of_week === dayIdx).sort((a, b) => a.start_time.localeCompare(b.start_time));
                    if (dayEntries.length === 0) return null;
                    return (
                        <div key={dayIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                                <span className="text-sm font-bold text-slate-700">{day}요일</span>
                            </div>
                            {dayEntries.map(entry => (
                                <div key={entry.id} className="px-4 py-3 flex items-center gap-3 border-b border-slate-50 last:border-0">
                                    <div className="w-1 h-10 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">{entry.class_name}</p>
                                        <p className="text-xs text-slate-500">{entry.start_time}~{entry.end_time} • {entry.subject} • {entry.teacher_name}</p>
                                    </div>
                                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Desktop: Timetable Grid */}
            <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-auto">
                <div className="grid min-w-[600px]" style={{ gridTemplateColumns: '60px repeat(5, 1fr)', gridTemplateRows: `auto repeat(${HOURS.length}, 48px)` }}>
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-r border-slate-200 p-2" />
                    {DAYS.map((day, i) => (
                        <div key={i} className="bg-slate-50 border-b border-r border-slate-200 p-2 text-center text-sm font-bold text-slate-700">{day}</div>
                    ))}
                    {/* Time labels */}
                    {HOURS.map((t, i) => (
                        <div key={t} className="border-r border-b border-slate-100 p-1 text-[10px] text-slate-400 text-right pr-2" style={{ gridRow: i + 2, gridColumn: 1 }}>{t}</div>
                    ))}
                    {/* Grid cells */}
                    {HOURS.map((_, ri) => DAYS.map((_, ci) => (
                        <div key={`${ri}-${ci}`} className="border-r border-b border-slate-50" style={{ gridRow: ri + 2, gridColumn: ci + 2 }} />
                    )))}
                    {/* Schedule blocks */}
                    {entries.map(entry => (
                        <div key={entry.id} className="relative rounded-lg m-0.5 p-1.5 text-white text-[10px] font-medium overflow-hidden cursor-pointer group"
                            style={{ ...getEntryStyle(entry), backgroundColor: entry.color, opacity: 0.9, zIndex: 10 }}>
                            <p className="font-bold truncate">{entry.class_name}</p>
                            <p className="truncate opacity-80">{entry.teacher_name}</p>
                            <p className="opacity-70">{entry.start_time}~{entry.end_time}</p>
                            <button onClick={() => handleDelete(entry.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/30 rounded p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
