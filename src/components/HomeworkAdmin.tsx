import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import { Plus, Check, X, Clock, BookOpen, AlertTriangle, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import {
    getHomework, saveHomework, addHomework as addHW, getHWSubmissions, saveHWSubmissions, genId,
    type Homework, type HomeworkSubmission, type HomeworkStatus
} from '../data/academyData';

const STATUS_MAP: Record<HomeworkStatus, { label: string; color: string }> = {
    assigned: { label: '미완료', color: 'bg-slate-100 text-slate-600' },
    submitted: { label: '제출', color: 'bg-blue-100 text-blue-700' },
    checked: { label: '확인됨', color: 'bg-emerald-100 text-emerald-700' },
    overdue: { label: '기한초과', color: 'bg-red-100 text-red-700' },
};

const STUDENTS = [
    { id: '1', name: '김지훈' }, { id: 's2', name: '이수진' }, { id: 's3', name: '박민수' },
    { id: 's4', name: '최유진' }, { id: 's5', name: '정다은' },
];

export function HomeworkAdmin() {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [expandedHw, setExpandedHw] = useState<string | null>(null);
    const [newHw, setNewHw] = useState({ title: '', description: '', class_name: '중2-A반', due_date: '', selected_students: [] as string[] });

    useEffect(() => { setHomeworks(getHomework()); setSubmissions(getHWSubmissions()); }, []);

    const handleAdd = () => {
        if (!newHw.title || !newHw.due_date) { alert('제목과 마감일을 입력해주세요.'); return; }
        const selStudents = newHw.selected_students.length > 0 ? newHw.selected_students : STUDENTS.map(s => s.id);
        const hw: Homework = {
            id: genId('hw'), title: newHw.title, description: newHw.description, class_name: newHw.class_name,
            assigned_to: selStudents, assigned_to_names: selStudents.map(id => STUDENTS.find(s => s.id === id)?.name || ''),
            due_date: newHw.due_date, created_at: new Date().toISOString(), created_by: 'admin',
        };
        addHW(hw);
        // create submissions
        const subs = selStudents.map(sid => ({
            id: genId('hs'), homework_id: hw.id, student_id: sid,
            student_name: STUDENTS.find(s => s.id === sid)?.name || '', status: 'assigned' as HomeworkStatus,
        }));
        saveHWSubmissions([...submissions, ...subs]);
        setHomeworks(getHomework()); setSubmissions(getHWSubmissions());
        setShowAdd(false); setNewHw({ title: '', description: '', class_name: '중2-A반', due_date: '', selected_students: [] });
    };

    const toggleStatus = (subId: string) => {
        const all = [...submissions];
        const sub = all.find(s => s.id === subId);
        if (!sub) return;
        const cycle: HomeworkStatus[] = ['assigned', 'submitted', 'checked'];
        const nextIdx = (cycle.indexOf(sub.status) + 1) % cycle.length;
        sub.status = cycle[nextIdx];
        if (sub.status === 'submitted') sub.submitted_at = new Date().toISOString();
        if (sub.status === 'checked') sub.checked_at = new Date().toISOString();
        saveHWSubmissions(all); setSubmissions([...all]);
    };

    const deleteHw = (id: string) => {
        if (!confirm('이 숙제를 삭제하시겠습니까?')) return;
        const all = homeworks.filter(h => h.id !== id);
        saveHomework(all); setHomeworks(all);
        const subs = submissions.filter(s => s.homework_id !== id);
        saveHWSubmissions(subs); setSubmissions(subs);
    };

    const daysUntil = (date: string) => {
        const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
        if (diff < 0) return `D+${Math.abs(diff)}`;
        if (diff === 0) return 'D-Day';
        return `D-${diff}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-600" /> 숙제 관리
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">숙제 배정 및 완료 현황을 관리합니다</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors">
                    <Plus className="w-4 h-4" /> 숙제 추가
                </button>
            </div>

            {/* Add Form */}
            {showAdd && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input value={newHw.title} onChange={e => setNewHw({ ...newHw, title: e.target.value })}
                            placeholder="숙제 제목 *" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        <input type="date" value={newHw.due_date} onChange={e => setNewHw({ ...newHw, due_date: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    </div>
                    <textarea value={newHw.description} onChange={e => setNewHw({ ...newHw, description: e.target.value })}
                        placeholder="설명 (선택)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-16" />
                    <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">대상 학생 (미선택 시 전체)</p>
                        <div className="flex flex-wrap gap-1.5">
                            {STUDENTS.map(s => (
                                <button key={s.id} onClick={() => {
                                    const sel = newHw.selected_students.includes(s.id)
                                        ? newHw.selected_students.filter(id => id !== s.id)
                                        : [...newHw.selected_students, s.id];
                                    setNewHw({ ...newHw, selected_students: sel });
                                }} className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                                    newHw.selected_students.includes(s.id) ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-500"
                                )}>{s.name}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">취소</button>
                        <button onClick={handleAdd} className="px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">저장</button>
                    </div>
                </div>
            )}

            {/* Homework List */}
            <div className="space-y-2">
                {homeworks.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">등록된 숙제가 없습니다</p>
                    </div>
                ) : homeworks.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(hw => {
                    const hwSubs = submissions.filter(s => s.homework_id === hw.id);
                    const completed = hwSubs.filter(s => s.status === 'submitted' || s.status === 'checked').length;
                    const total = hwSubs.length;
                    const dStr = daysUntil(hw.due_date);
                    const isOverdue = dStr.startsWith('D+');

                    return (
                        <div key={hw.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpandedHw(expandedHw === hw.id ? null : hw.id)}>
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                                    isOverdue ? "bg-red-100 text-red-700" : completed === total && total > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                )}>{dStr}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{hw.title}</p>
                                    <p className="text-[10px] text-slate-400">{hw.class_name} • 마감: {hw.due_date} • 완료: {completed}/{total}</p>
                                </div>
                                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
                                </div>
                                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedHw === hw.id && "rotate-180")} />
                                <button onClick={e => { e.stopPropagation(); deleteHw(hw.id); }} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            {expandedHw === hw.id && (
                                <div className="border-t border-slate-100 px-4 py-3 space-y-2">
                                    {hw.description && <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">{hw.description}</p>}
                                    {hwSubs.map(sub => (
                                        <div key={sub.id} className="flex items-center gap-3 py-1">
                                            <span className="text-sm text-slate-700 w-16">{sub.student_name}</span>
                                            <button onClick={() => toggleStatus(sub.id)}
                                                className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors", STATUS_MAP[sub.status].color)}>
                                                {STATUS_MAP[sub.status].label}
                                            </button>
                                            {sub.submitted_at && <span className="text-[10px] text-slate-400">제출: {new Date(sub.submitted_at).toLocaleDateString('ko-KR')}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
