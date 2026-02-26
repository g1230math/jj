import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { CalendarCheck, Send, CheckCircle, Phone, Clock } from 'lucide-react';
import { getTrialBookings, saveTrialBookings, genId, type TrialBooking as TBType } from '../data/academyData';

export function TrialBooking() {
    const [form, setForm] = useState({ parent_name: '', student_name: '', phone: '', student_grade: '중2', preferred_date: '', preferred_time: '16:00', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!form.parent_name || !form.student_name || !form.phone || !form.preferred_date) {
            alert('필수 항목을 모두 입력해주세요.'); return;
        }
        const booking: TBType = {
            id: genId('tb'), ...form, status: 'pending', created_at: new Date().toISOString(),
        };
        const all = [...getTrialBookings(), booking]; saveTrialBookings(all);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">예약 완료!</h2>
                    <p className="text-sm text-slate-500 mb-6">체험 수업 예약이 접수되었습니다.<br />확인 후 연락드리겠습니다.</p>
                    <a href="/jj/" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">홈으로 돌아가기</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8 text-center">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-80" />
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">무료 체험 수업 예약</h2>
                    <p className="text-sm text-emerald-100">직접 경험해보세요! 부담 없이 체험해 볼 수 있습니다.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">학부모 이름 *</label>
                            <input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="홍길동" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">학생 이름 *</label>
                            <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="홍길순" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">연락처 *</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" placeholder="010-0000-0000" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">학년</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['중1', '중2', '중3'].map(g => (
                                <button key={g} onClick={() => setForm({ ...form, student_grade: g })}
                                    className={cn("py-2 rounded-lg text-sm font-bold border-2 transition-all",
                                        form.student_grade === g ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-400"
                                    )}>{g}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">희망 날짜 *</label>
                            <input type="date" value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })}
                                min={new Date().toISOString().slice(0, 10)}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">희망 시간</label>
                            <select value={form.preferred_time} onChange={e => setForm({ ...form, preferred_time: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm">
                                {['15:00', '16:00', '17:00', '18:00', '19:00'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">메모 (선택)</label>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm h-16" placeholder="궁금한 점이나 참고 사항을 적어주세요" />
                    </div>

                    <button onClick={handleSubmit}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> 예약 신청하기
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">예약 접수 후 1영업일 이내 확인 전화를 드립니다.</p>
                </div>
            </div>
        </div>
    );
}
