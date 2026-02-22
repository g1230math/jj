import React, { useState } from 'react';
import { addConsultRequest } from '../data/mockData';
import { X, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';

const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-sm font-medium text-slate-700 mb-1";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function ConsultModal({ open, onClose }: Props) {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ studentSchool: '', studentGrade: '', phone: '', preferredDate: '', preferredTime: '', message: '' });

    const reset = () => { setSubmitted(false); setForm({ studentSchool: '', studentGrade: '', phone: '', preferredDate: '', preferredTime: '', message: '' }); onClose(); };

    const handleSubmit = async () => {
        if (!form.studentSchool || !form.studentGrade || !form.phone || !form.preferredDate || !form.preferredTime) return;
        setSending(true);
        await addConsultRequest(form);
        try {
            const svcId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const tplId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const pubKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            if (svcId && tplId && pubKey) {
                await emailjs.send(svcId, tplId, {
                    studentInfo: `${form.studentSchool} ${form.studentGrade}`,
                    phone: form.phone,
                    preferredDate: form.preferredDate,
                    preferredTime: form.preferredTime,
                    message: form.message || '(없음)',
                    createdAt: new Date().toLocaleString('ko-KR'),
                }, pubKey);
            }
        } catch (e) { console.warn('EmailJS 발송 실패 (로컬 저장은 완료됨):', e); }
        setSending(false);
        setSubmitted(true);
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={reset}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">무료 상담 신청</h2>
                        <button onClick={reset} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                    <div className="p-5 max-h-[70vh] overflow-y-auto">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">상담 신청이 접수되었습니다!</h3>
                                <p className="text-sm text-slate-500 mb-6">원장님 확인 후 연락 드리겠습니다.</p>
                                <button onClick={reset} className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">확인</button>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className={labelCls}>학교 <span className="text-red-500">*</span></label>
                                    <input className={inputCls} placeholder="예: 진접중학교, 풍양중학교" value={form.studentSchool} onChange={e => setForm({ ...form, studentSchool: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>학년 <span className="text-red-500">*</span></label>
                                    <select className={inputCls} value={form.studentGrade} onChange={e => setForm({ ...form, studentGrade: e.target.value })}>
                                        <option value="">선택하세요</option>
                                        <option>초3</option><option>초4</option><option>초5</option><option>초6</option>
                                        <option>중1</option><option>중2</option><option>중3</option>
                                        <option>고1</option><option>고2</option><option>고3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>전화번호 <span className="text-red-500">*</span></label>
                                    <input type="tel" className={inputCls} placeholder="010-0000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>희망 날짜 <span className="text-red-500">*</span></label>
                                        <input type="date" className={inputCls} value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>희망 시간 <span className="text-red-500">*</span></label>
                                        <select className={inputCls} value={form.preferredTime} onChange={e => setForm({ ...form, preferredTime: e.target.value })}>
                                            <option value="">선택</option>
                                            <option>14:00</option><option>15:00</option><option>16:00</option>
                                            <option>17:00</option><option>18:00</option><option>19:00</option>
                                            <option>20:00</option><option>21:00</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>추가 메모 (선택)</label>
                                    <textarea className={inputCls} rows={2} placeholder="상담 요청 사항을 입력해주세요." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={sending || !form.studentSchool || !form.studentGrade || !form.phone || !form.preferredDate || !form.preferredTime}
                                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                >
                                    {sending ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 전송 중...</>
                                    ) : (
                                        <><Send className="w-4 h-4" /> 상담 신청하기</>
                                    )}
                                </button>
                                <p className="text-xs text-slate-400 text-center">로그인 없이 신청 가능합니다</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
