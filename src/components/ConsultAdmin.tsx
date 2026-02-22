import React, { useState, useEffect } from 'react';
import { getConsultRequests, saveConsultRequests, type ConsultRequest } from '../data/mockData';
import { Phone, Calendar, Clock, CheckCircle, Trash2, User, School, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const statusMap = {
    pending: { label: '대기중', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    confirmed: { label: '확인됨', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    completed: { label: '완료', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

export function ConsultAdmin() {
    const [requests, setRequests] = useState<ConsultRequest[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    const updateStatus = async (id: string, status: ConsultRequest['status']) => {
        const updated = requests.map(r => r.id === id ? { ...r, status } : r);
        setRequests(updated);
        await saveConsultRequests(updated);
    };

    const deleteRequest = async (id: string) => {
        if (!confirm('이 상담 요청을 삭제하시겠습니까?')) return;
        const updated = requests.filter(r => r.id !== id);
        setRequests(updated);
        await saveConsultRequests(updated);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">상담 신청 관리</h3>
                        <p className="text-xs text-slate-500">온라인 상담 요청을 확인하세요</p>
                    </div>
                </div>
                {pendingCount > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full animate-pulse">
                        {pendingCount}건 대기
                    </span>
                )}
            </div>

            {/* List */}
            {requests.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">상담 신청이 없습니다.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {requests.map(req => {
                        const st = statusMap[req.status];
                        const isExpanded = expandedId === req.id;
                        return (
                            <div key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                    className="w-full px-5 py-3.5 flex items-center gap-3 text-left"
                                >
                                    <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", st.dot)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-slate-800 text-sm">{req.studentSchool} {req.studentGrade}</span>
                                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", st.color)}>{st.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                            {req.preferredDate} {req.preferredTime} · {req.phone}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{formatDate(req.createdAt)}</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-4 space-y-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <School className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">학교/학년:</span>
                                                        <span className="font-medium text-slate-800">{req.studentSchool} {req.studentGrade}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">전화번호:</span>
                                                        <a href={`tel:${req.phone}`} className="font-medium text-indigo-600 hover:underline">{req.phone}</a>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">희망 날짜:</span>
                                                        <span className="font-medium text-slate-800">{req.preferredDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600">희망 시간:</span>
                                                        <span className="font-medium text-slate-800">{req.preferredTime}</span>
                                                    </div>
                                                </div>

                                                {req.message && (
                                                    <div className="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-700">
                                                        💬 {req.message}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {req.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(req.id, 'confirmed')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" /> 확인 완료
                                                        </button>
                                                    )}
                                                    {req.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateStatus(req.id, 'completed')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" /> 상담 완료
                                                        </button>
                                                    )}
                                                    {req.status !== 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(req.id, 'pending')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                                                        >
                                                            되돌리기
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteRequest(req.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors ml-auto"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> 삭제
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-400">신청 시각: {formatDate(req.createdAt)}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
