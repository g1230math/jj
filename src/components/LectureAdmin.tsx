import React, { useState } from 'react';
import { getLectures, saveLectures, getAssignments, type Lecture } from '../data/mockData';
import { Plus, Trash2, Edit2, Eye, EyeOff, ChevronUp, ChevronDown, Save, X, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function LectureAdmin() {
    const { user } = useAuth();
    const [lectures, setLectures] = useState<Lecture[]>(getLectures());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [gradeTab, setGradeTab] = useState<'초등' | '중등' | '고등'>('고등');
    const assignments = getAssignments();

    // Determine allowed grades for current user
    const isAdmin = user?.role === 'admin';
    const currentInstructor = user?.name || '';
    const assignment = assignments.find(a => a.name === currentInstructor);
    const allowedGrades = isAdmin
        ? (['초등', '중등', '고등'] as const)
        : (assignment?.grades || []);

    // Default form state
    const emptyForm: Omit<Lecture, 'id' | 'order'> = {
        title: '',
        description: '',
        instructor: currentInstructor,
        grade: gradeTab,
        subject: '',
        level: 3,
        date: new Date().toISOString().split('T')[0],
        duration: '',
        thumbnail: '',
        videoId: '',
        isPublished: true,
        tags: [],
    };
    const [form, setForm] = useState(emptyForm);
    const [tagInput, setTagInput] = useState('');

    const filteredLectures = lectures
        .filter(l => l.grade === gradeTab)
        .filter(l => isAdmin || l.instructor === currentInstructor)
        .sort((a, b) => a.order - b.order);

    const canEditGrade = (grade: '초등' | '중등' | '고등') => {
        return isAdmin || allowedGrades.includes(grade);
    };

    const handleSave = () => {
        let updated: Lecture[];
        if (editingId) {
            updated = lectures.map(l =>
                l.id === editingId
                    ? { ...l, ...form, tags: form.tags }
                    : l
            );
        } else {
            const newLecture: Lecture = {
                ...form,
                id: `l_${Date.now()}`,
                order: filteredLectures.length + 1,
                grade: gradeTab,
                thumbnail: form.thumbnail || `https://picsum.photos/seed/${Date.now()}/400/225`,
            };
            updated = [...lectures, newLecture];
        }
        saveLectures(updated);
        setLectures(updated);
        setShowForm(false);
        setEditingId(null);
        setForm({ ...emptyForm, grade: gradeTab });
        setTagInput('');
    };

    const handleEdit = (lecture: Lecture) => {
        setForm({
            title: lecture.title,
            description: lecture.description,
            instructor: lecture.instructor,
            grade: lecture.grade,
            subject: lecture.subject,
            level: lecture.level,
            date: lecture.date,
            duration: lecture.duration,
            thumbnail: lecture.thumbnail,
            videoId: lecture.videoId,
            isPublished: lecture.isPublished,
            tags: lecture.tags,
        });
        setTagInput(lecture.tags.join(', '));
        setEditingId(lecture.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm('이 강의를 삭제하시겠습니까?')) return;
        const updated = lectures.filter(l => l.id !== id);
        saveLectures(updated);
        setLectures(updated);
    };

    const handleTogglePublish = (id: string) => {
        const updated = lectures.map(l =>
            l.id === id ? { ...l, isPublished: !l.isPublished } : l
        );
        saveLectures(updated);
        setLectures(updated);
    };

    const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
        const gradeLectures = lectures
            .filter(l => l.grade === gradeTab)
            .sort((a, b) => a.order - b.order);
        const idx = gradeLectures.findIndex(l => l.id === id);
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === gradeLectures.length - 1)) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        const tempOrder = gradeLectures[idx].order;
        gradeLectures[idx].order = gradeLectures[swapIdx].order;
        gradeLectures[swapIdx].order = tempOrder;
        const updated = lectures.map(l => {
            const found = gradeLectures.find(gl => gl.id === l.id);
            return found ? { ...l, order: found.order } : l;
        });
        saveLectures(updated);
        setLectures(updated);
    };

    const handleAddTag = () => {
        const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
        setForm(f => ({ ...f, tags }));
    };

    const gradeLabel: Record<string, string> = { '초등': '초등부', '중등': '중등부', '고등': '고등부' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">강의 관리</h2>
                </div>
                {!isAdmin && allowedGrades.length > 0 && (
                    <span className="text-sm text-slate-500">
                        담당: {allowedGrades.map(g => gradeLabel[g]).join(', ')}
                    </span>
                )}
            </div>

            {/* Grade Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                {(['초등', '중등', '고등'] as const).map(grade => (
                    <button
                        key={grade}
                        onClick={() => { setGradeTab(grade); setShowForm(false); setEditingId(null); }}
                        disabled={!canEditGrade(grade)}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            gradeTab === grade
                                ? "bg-white text-indigo-700 shadow-sm"
                                : canEditGrade(grade)
                                    ? "text-slate-500 hover:text-slate-700"
                                    : "text-slate-300 cursor-not-allowed"
                        )}
                    >
                        {gradeLabel[grade]}
                    </button>
                ))}
            </div>

            {/* Add Button */}
            {canEditGrade(gradeTab) && !showForm && (
                <button
                    onClick={() => {
                        setForm({ ...emptyForm, grade: gradeTab });
                        setEditingId(null);
                        setShowForm(true);
                        setTagInput('');
                    }}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    새 강의 등록
                </button>
            )}

            {/* Form */}
            {showForm && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">
                            {editingId ? '강의 수정' : '새 강의 등록'} — {gradeLabel[gradeTab]}
                        </h3>
                        <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 hover:bg-slate-200 rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">강의 제목 *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="예: 고2 수학 - 수열의 극한"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">YouTube 동영상 ID *</label>
                            <input
                                type="text"
                                value={form.videoId}
                                onChange={(e) => setForm(f => ({ ...f, videoId: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="예: dQw4w9WgXcQ"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">과목</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="예: 수학II, 미적분, 중3 수학"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">강의시간</label>
                            <input
                                type="text"
                                value={form.duration}
                                onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="예: 42:15"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">난이도 (1~5)</label>
                            <select
                                value={form.level}
                                onChange={(e) => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                            >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">날짜</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">강의 설명</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                            placeholder="강의 내용을 설명해주세요..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">태그 (쉼표로 구분)</label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => { setTagInput(e.target.value); }}
                            onBlur={handleAddTag}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                            placeholder="예: 수열, 극한, 수렴"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setShowForm(false); setEditingId(null); }}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!form.title || !form.videoId}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            {editingId ? '수정 저장' : '등록'}
                        </button>
                    </div>
                </div>
            )}

            {/* Lecture List */}
            <div className="space-y-2">
                {filteredLectures.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Video className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">등록된 강의가 없습니다</p>
                    </div>
                ) : (
                    filteredLectures.map((lecture, idx) => (
                        <div
                            key={lecture.id}
                            className={cn(
                                "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors",
                                lecture.isPublished ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-60"
                            )}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex sm:flex-col items-center gap-0.5 shrink-0">
                                    <button
                                        onClick={() => handleMoveOrder(lecture.id, 'up')}
                                        disabled={idx === 0}
                                        className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                                    >
                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                    </button>
                                    <span className="text-xs text-slate-400 font-mono">{idx + 1}</span>
                                    <button
                                        onClick={() => handleMoveOrder(lecture.id, 'down')}
                                        disabled={idx === filteredLectures.length - 1}
                                        className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                                    >
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-slate-900 text-sm truncate">{lecture.title}</h4>
                                        {!lecture.isPublished && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full">비공개</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {lecture.instructor} · {lecture.subject} · {lecture.duration} · {lecture.date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                <button
                                    onClick={() => handleTogglePublish(lecture.id)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    title={lecture.isPublished ? '비공개로 전환' : '공개로 전환'}
                                >
                                    {lecture.isPublished ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                                </button>
                                <button
                                    onClick={() => handleEdit(lecture)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="수정"
                                >
                                    <Edit2 className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                    onClick={() => handleDelete(lecture.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="삭제"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
