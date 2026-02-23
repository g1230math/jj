import React, { useState, useEffect, useMemo } from 'react';
import { getMembers, saveMembers, getCourseClasses, type Member, type CourseClass } from '../data/mockData';
import { Users, UserPlus, Search, Edit3, Trash2, X, Save, ChevronDown, ChevronLeft, ChevronRight, UserCheck, UserX, Pause, Eye } from 'lucide-react';
import { MemberDetailModal } from './MemberDetailModal';

const STATUS_LABELS: Record<Member['status'], string> = {
    active: '재원',
    paused: '휴원',
    withdrawn: '퇴원',
};

const STATUS_COLORS: Record<Member['status'], string> = {
    active: 'bg-emerald-100 text-emerald-700',
    paused: 'bg-amber-100 text-amber-700',
    withdrawn: 'bg-red-100 text-red-700',
};

const GRADE_GROUPS = ['전체', '초등', '중등', '고등'] as const;
const STATUS_FILTERS = ['전체', 'active', 'paused', 'withdrawn'] as const;

const emptyMember: Omit<Member, 'id'> = {
    name: '',
    phone: '',
    parentPhone: '',
    school: '',
    grade: '',
    classId: '',
    status: 'active',
    enrollDate: new Date().toISOString().slice(0, 10),
    memo: '',
};

export function MemberAdmin() {
    const [members, setMembers] = useState<Member[]>([]);
    const [courses, setCourses] = useState<CourseClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [gradeFilter, setGradeFilter] = useState<string>('전체');
    const [statusFilter, setStatusFilter] = useState<string>('전체');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [form, setForm] = useState(emptyMember);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    useEffect(() => {
        Promise.all([getMembers(), getCourseClasses()]).then(([m, c]) => {
            setMembers(m);
            setCourses(c);
            setLoading(false);
        });
    }, []);

    const courseMap = useMemo(() => {
        const map: Record<string, string> = {};
        courses.forEach(c => { map[c.id] = c.name; });
        return map;
    }, [courses]);

    const gradeGroupOf = (grade: string) => {
        if (grade.startsWith('초')) return '초등';
        if (grade.startsWith('중')) return '중등';
        if (grade.startsWith('고')) return '고등';
        return '';
    };

    const filtered = useMemo(() => {
        return members.filter(m => {
            if (search && !m.name.includes(search) && !m.school.includes(search) && !m.phone.includes(search)) return false;
            if (gradeFilter !== '전체' && gradeGroupOf(m.grade) !== gradeFilter) return false;
            if (statusFilter !== '전체' && m.status !== statusFilter) return false;
            return true;
        });
    }, [members, search, gradeFilter, statusFilter]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, gradeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginatedMembers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const stats = useMemo(() => ({
        total: members.length,
        active: members.filter(m => m.status === 'active').length,
        paused: members.filter(m => m.status === 'paused').length,
        withdrawn: members.filter(m => m.status === 'withdrawn').length,
    }), [members]);

    const openAdd = () => {
        setEditingMember(null);
        setForm(emptyMember);
        setShowModal(true);
    };

    const openEdit = (m: Member) => {
        setEditingMember(m);
        setForm({ name: m.name, phone: m.phone, parentPhone: m.parentPhone, school: m.school, grade: m.grade, classId: m.classId, status: m.status, enrollDate: m.enrollDate, memo: m.memo });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.grade.trim()) return;
        let updated: Member[];
        if (editingMember) {
            updated = members.map(m => m.id === editingMember.id ? { ...m, ...form } : m);
        } else {
            const newM: Member = { ...form, id: `m_${Date.now()}` };
            updated = [...members, newM];
        }
        await saveMembers(updated);
        setMembers(updated);
        setShowModal(false);
    };

    const handleDelete = async (id: string) => {
        const updated = members.filter(m => m.id !== id);
        await saveMembers(updated);
        setMembers(updated);
        setDeleteConfirmId(null);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-40" />
                    <div className="h-10 bg-slate-100 rounded" />
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            회원 관리
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">전체 원생 현황을 확인하고 관리합니다.</p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                        <UserPlus className="w-4 h-4" /> 회원 추가
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 sm:py-4 bg-slate-50/50">
                {[
                    { label: '전체', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: '재원', value: stats.active, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: '휴원', value: stats.paused, icon: Pause, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '퇴원', value: stats.withdrawn, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 flex items-center gap-3`}>
                        <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
                        <div>
                            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}명</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 border-b border-slate-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="이름, 학교, 연락처 검색..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            {GRADE_GROUPS.map(g => <option key={g} value={g}>{g === '전체' ? '학년 전체' : `${g}부`}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            {STATUS_FILTERS.map(s => <option key={s} value={s}>{s === '전체' ? '상태 전체' : STATUS_LABELS[s as Member['status']]}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 text-left">
                            <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">이름</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap">학교</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap">학년</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap hidden md:table-cell">수강반</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap">상태</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap hidden lg:table-cell">학생 연락처</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap hidden lg:table-cell">학부모 연락처</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap hidden xl:table-cell">등록일</th>
                            <th className="px-3 py-3 font-semibold whitespace-nowrap hidden xl:table-cell">메모</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-right whitespace-nowrap">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-12 text-slate-400">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            paginatedMembers.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 sm:px-6 py-3 font-medium text-slate-900 whitespace-nowrap">{m.name}</td>
                                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{m.school}</td>
                                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{m.grade}</td>
                                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap hidden md:table-cell">{courseMap[m.classId] || '-'}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[m.status]}`}>
                                            {STATUS_LABELS[m.status]}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap hidden lg:table-cell">{m.phone}</td>
                                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap hidden lg:table-cell">{m.parentPhone}</td>
                                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap hidden xl:table-cell">{m.enrollDate}</td>
                                    <td className="px-3 py-3 text-slate-400 max-w-[150px] truncate hidden xl:table-cell" title={m.memo}>{m.memo || '-'}</td>
                                    <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => setSelectedMember(m)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="상세보기">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="수정">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {deleteConfirmId === m.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleDelete(m.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">삭제</button>
                                                    <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-300 transition-colors">취소</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirmId(m.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="삭제">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="px-4 sm:px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                    총 {filtered.length}명 {filtered.length !== members.length && `(전체 ${members.length}명 중)`}
                </span>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${page === currentPage
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">{editingMember ? '회원 정보 수정' : '신규 회원 등록'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">이름 <span className="text-red-500">*</span></label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="학생 이름" />
                            </div>

                            {/* Grade & School */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">학년 <span className="text-red-500">*</span></label>
                                    <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                        <option value="">선택</option>
                                        {['초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">학교</label>
                                    <input type="text" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="예: 진접중" />
                                </div>
                            </div>

                            {/* Class */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">수강반</label>
                                <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option value="">선택</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
                                </select>
                            </div>

                            {/* Phone numbers */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">학생 연락처</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="010-0000-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">학부모 연락처</label>
                                    <input type="tel" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="010-0000-0000" />
                                </div>
                            </div>

                            {/* Status & Enroll Date */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">상태</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Member['status'] })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                        <option value="active">재원</option>
                                        <option value="paused">휴원</option>
                                        <option value="withdrawn">퇴원</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">등록일</label>
                                    <input type="date" value={form.enrollDate} onChange={e => setForm({ ...form, enrollDate: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            {/* Memo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">메모</label>
                                <textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} rows={2}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="특이사항 등..." />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                                취소
                            </button>
                            <button onClick={handleSave} disabled={!form.name.trim() || !form.grade.trim()}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                                <Save className="w-4 h-4" />
                                {editingMember ? '수정 완료' : '등록'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 학생 상세 모달 */}
            {selectedMember && (
                <MemberDetailModal
                    member={selectedMember}
                    courses={courses}
                    onClose={() => setSelectedMember(null)}
                    onSave={async (updated) => {
                        const updatedList = members.map(m => m.id === updated.id ? updated : m);
                        await saveMembers(updatedList);
                        setMembers(updatedList);
                        setSelectedMember(updated);
                    }}
                />
            )}
        </div>
    );
}
