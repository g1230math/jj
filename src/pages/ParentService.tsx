import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Clock, Calendar, FileText, MessageSquare, TrendingUp, Download, Send } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const attendanceData = [
    { date: '02.17 (월)', status: '출석', time: '17:02' },
    { date: '02.18 (화)', status: '출석', time: '16:58' },
    { date: '02.19 (수)', status: '출석', time: '17:05' },
    { date: '02.20 (목)', status: '결석', time: '-' },
    { date: '02.21 (금)', status: '출석', time: '17:00' },
];

const gradeData = [
    { exam: '1학기 중간', score: 78, avg: 65 },
    { exam: '1학기 기말', score: 85, avg: 68 },
    { exam: '2학기 중간', score: 88, avg: 70 },
    { exam: '2학기 기말', score: 95, avg: 72 },
];

const resources = [
    { name: '중3 수학 기출문제 모음 (2024)', type: 'PDF', size: '2.3MB', date: '2025.02.15' },
    { name: '고1 수학(상) 오답노트 양식', type: 'PDF', size: '0.5MB', date: '2025.02.10' },
    { name: '중간고사 범위 요약 프린트', type: 'PDF', size: '1.1MB', date: '2025.02.05' },
    { name: '수능 수학 기출 30선', type: 'PDF', size: '4.8MB', date: '2025.01.20' },
];

export function ParentService() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('attendance');
    const [consultForm, setConsultForm] = useState({ date: '', time: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    if (!user) return <Navigate to="/login" replace />;

    const tabs = [
        { id: 'attendance', name: '출결 확인', icon: CheckCircle },
        { id: 'grades', name: '성적표 조회', icon: TrendingUp },
        { id: 'resources', name: '자료실', icon: FileText },
        { id: 'consult', name: '상담 신청', icon: MessageSquare },
    ];

    const handleConsultSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-rose-800 via-pink-800 to-purple-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-pink-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-badge inline-block px-4 py-1.5 bg-pink-500/20 border border-pink-400/30 rounded-full text-pink-300 mb-4 backdrop-blur-sm">
                            PARENT SERVICE
                        </span>
                        <h1 className="text-hero text-white mb-4">학부모 서비스</h1>
                        <p className="text-xl text-pink-200 max-w-2xl mx-auto font-light">
                            자녀의 학습 현황을 확인하고 상담을 신청하세요
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Student Info Banner */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/80?u=child1" alt="학생" className="w-14 h-14 rounded-full border-2 border-white/50" />
                        <div>
                            <h2 className="text-xl font-bold">김지훈 학생</h2>
                            <p className="text-indigo-100 text-sm">진접중학교 3학년 | 심화 응용반 수강</p>
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <div className="text-center">
                            <p className="text-2xl font-bold">96%</p>
                            <p className="text-indigo-200">출석률</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">95점</p>
                            <p className="text-indigo-200">최근 성적</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 bg-slate-100 p-1 rounded-xl mb-8">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-1.5 sm:mr-2" /> {tab.name}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
                    {/* 출결 확인 */}
                    {activeTab === 'attendance' && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" /> 이번 주 출결 현황
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">날짜</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">상태</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">입실 시간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-800">{row.date}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${row.status === '출석' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {row.status === '출석' ? '✓ ' : '✗ '}{row.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{row.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-sm text-indigo-700 border border-indigo-100">
                                💡 출석률이 80% 미만인 경우 자동으로 알림톡이 발송됩니다.
                            </div>
                        </div>
                    )}

                    {/* 성적표 조회 */}
                    {activeTab === 'grades' && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-600" /> 성적 추이
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={gradeData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} name="내 점수" />
                                            <Line type="monotone" dataKey="avg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#94a3b8' }} name="반 평균" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={gradeData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} name="내 점수" />
                                            <Bar dataKey="avg" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="반 평균" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-sm text-emerald-700 border border-emerald-100">
                                📈 최근 성적이 꾸준히 향상되고 있습니다! 영역별 세부 분석은 상담 시 안내드립니다.
                            </div>
                        </div>
                    )}

                    {/* 자료실 */}
                    {activeTab === 'resources' && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> 학습 자료실
                            </h3>
                            <div className="divide-y divide-slate-100">
                                {resources.map((res, i) => (
                                    <div key={i} className="py-4 flex items-center justify-between hover:bg-slate-50 px-4 -mx-4 rounded-lg transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{res.name}</h4>
                                                <p className="text-xs text-slate-500">{res.type} · {res.size} · {res.date}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 상담 신청 */}
                    {activeTab === 'consult' && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-600" /> 상담 예약 신청
                            </h3>

                            {submitted ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">상담 예약이 접수되었습니다!</h3>
                                    <p className="text-slate-500">원장님 확인 후 연락 드리겠습니다.</p>
                                    <button onClick={() => setSubmitted(false)}
                                        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        다시 신청하기
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleConsultSubmit} className="max-w-lg space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">희망 날짜</label>
                                        <input type="date" value={consultForm.date} onChange={e => setConsultForm({ ...consultForm, date: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">희망 시간</label>
                                        <select value={consultForm.time} onChange={e => setConsultForm({ ...consultForm, time: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required
                                        >
                                            <option value="">선택하세요</option>
                                            <option>14:00</option><option>15:00</option><option>16:00</option>
                                            <option>17:00</option><option>18:00</option><option>19:00</option>
                                            <option>20:00</option><option>21:00</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">상담 내용</label>
                                        <textarea value={consultForm.message} onChange={e => setConsultForm({ ...consultForm, message: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                            rows={4} placeholder="상담 요청 사항을 입력해주세요." required
                                        />
                                    </div>
                                    <button type="submit"
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                                    >
                                        <Send className="w-5 h-5" /> 상담 예약하기
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
