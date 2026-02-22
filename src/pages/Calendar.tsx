import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, BookOpen, GraduationCap, Flag, Sparkles, Plus, Edit2, Trash2, Save, X, School, Filter } from 'lucide-react';
import { getCalendarEvents, saveCalendarEvents, SCHOOL_LIST, type CalendarEvent } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

/* ─── helpers ─── */
const genId = () => `ev_${Date.now()}`;
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

const parseDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

/* ─── Modal (top-level to avoid remount) ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function Calendar() {
  const { isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schoolFilter, setSchoolFilter] = useState<string>('전체');

  // ── Event state (localStorage-backed) ──
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventModal, setEventModal] = useState<'add' | 'edit' | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => { getCalendarEvents().then(setEvents); }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  /* ─── Filter events by school ─── */
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (schoolFilter === '전체') return true;
      return e.school === '전체' || e.school === schoolFilter;
    });
  }, [events, schoolFilter]);

  // Get events for current month
  const monthlyEvents = useMemo(() => {
    return filteredEvents
      .filter(event => {
        const d = parseDate(event.date);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [currentDate, filteredEvents]);

  const importantEvents = monthlyEvents.filter(e => e.type !== 'holiday');
  const holidayEvents = monthlyEvents.filter(e => e.type === 'holiday');

  const categories = [
    { id: 'academy', name: '학원 일정', color: 'bg-blue-500' },
    { id: 'school', name: '학교 행사', color: 'bg-green-500' },
    { id: 'exam', name: '시험 일정', color: 'bg-red-500' },
    { id: 'holiday', name: '공휴일', color: 'bg-purple-500' },
  ];

  const typeIcons: Record<string, typeof BookOpen> = {
    academy: BookOpen,
    school: GraduationCap,
    exam: Flag,
    holiday: Sparkles,
  };

  const typeBgColors: Record<string, string> = {
    academy: 'bg-blue-50 border-blue-200',
    school: 'bg-green-50 border-green-200',
    exam: 'bg-red-50 border-red-200',
    holiday: 'bg-purple-50 border-purple-200',
  };

  const typeIconColors: Record<string, string> = {
    academy: 'text-blue-600 bg-blue-100',
    school: 'text-green-600 bg-green-100',
    exam: 'text-red-600 bg-red-100',
    holiday: 'text-purple-600 bg-purple-100',
  };

  const typeTextColors: Record<string, string> = {
    academy: 'text-blue-700',
    school: 'text-green-700',
    exam: 'text-red-700',
    holiday: 'text-purple-700',
  };

  /* ─── CRUD ─── */
  const emptyEvent = (): CalendarEvent => ({
    id: genId(),
    title: '',
    date: format(currentDate, 'yyyy-MM-dd'),
    type: 'school',
    school: '전체',
    color: 'bg-green-500',
    description: '',
  });

  const typeColorMap: Record<string, string> = {
    academy: 'bg-blue-500',
    school: 'bg-green-500',
    exam: 'bg-red-500',
    holiday: 'bg-purple-500',
  };

  const openAddEvent = () => { setEditEvent(emptyEvent()); setEventModal('add'); };
  const openEditEvent = (ev: CalendarEvent) => { setEditEvent({ ...ev }); setEventModal('edit'); };
  const closeEventModal = () => { setEventModal(null); setEditEvent(null); };

  const handleSaveEvent = async () => {
    if (!editEvent || !editEvent.title.trim() || !editEvent.date) return;
    const withColor = { ...editEvent, color: typeColorMap[editEvent.type] || 'bg-green-500' };
    let updated: CalendarEvent[];
    if (eventModal === 'add') {
      updated = [...events, withColor];
    } else {
      updated = events.map(e => e.id === withColor.id ? withColor : e);
    }
    setEvents(updated);
    await saveCalendarEvents(updated);
    closeEventModal();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    await saveCalendarEvents(updated);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-800 via-emerald-800 to-emerald-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-badge inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 mb-4 backdrop-blur-sm">
              CALENDAR
            </span>
            <h1 className="text-hero text-white mb-4">학사 일정</h1>
            <p className="text-xl text-emerald-200 max-w-2xl mx-auto font-light">
              학원 일정 및 주요 학교 행사를 확인하세요
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ─── School Filter + Admin Add ─── */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-700 shrink-0">학교 필터</span>
            </div>
            {isAdmin && (
              <button onClick={openAddEvent} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shrink-0">
                <Plus className="w-4 h-4" /> 일정 추가
              </button>
            )}
          </div>
          {/* Mobile: pill grid */}
          <div className="sm:hidden grid grid-cols-3 gap-1.5 bg-white rounded-xl p-2 border border-slate-200">
            {SCHOOL_LIST.map(school => (
              <button
                key={school}
                onClick={() => setSchoolFilter(school)}
                className={cn(
                  "px-2 py-2 rounded-lg text-xs font-semibold transition-all text-center",
                  schoolFilter === school
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100"
                )}
              >
                {school === '전체' ? '전체 보기' : school}
              </button>
            ))}
          </div>
          {/* Desktop: button row */}
          <div className="hidden sm:flex flex-wrap gap-1 bg-white rounded-xl p-1 border border-slate-200">
            {SCHOOL_LIST.map(school => (
              <button
                key={school}
                onClick={() => setSchoolFilter(school)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                  schoolFilter === school
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {school === '전체' ? '전체 보기' : school}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Highlights */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {format(currentDate, 'M월', { locale: ko })} 주요 일정
            </h2>
            {schoolFilter !== '전체' && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> {schoolFilter}
              </span>
            )}
            {holidayEvents.length > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                공휴일 {holidayEvents.length}일
              </span>
            )}
          </div>

          {importantEvents.length > 0 || holidayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...importantEvents, ...holidayEvents].map(event => {
                const Icon = typeIcons[event.type] || CalendarDays;
                const eventDate = parseDate(event.date);
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm relative group",
                      typeBgColors[event.type]
                    )}
                  >
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditEvent(event)} className="p-1 bg-white/90 rounded-md hover:bg-white shadow-sm"><Edit2 className="w-3 h-3 text-indigo-600" /></button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-1 bg-white/90 rounded-md hover:bg-white shadow-sm"><Trash2 className="w-3 h-3 text-red-500" /></button>
                      </div>
                    )}
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", typeIconColors[event.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 font-medium">
                          {format(eventDate, 'M/d (EEE)', { locale: ko })}
                        </span>
                        {event.school !== '전체' && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">{event.school}</span>
                        )}
                      </div>
                      <h4 className={cn("font-semibold text-sm", typeTextColors[event.type])}>
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-400 text-sm">
              이번 달에는 등록된 일정이 없습니다.
            </div>
          )}
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
              <span className="text-sm text-slate-600">{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                오늘
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={cn(
                "py-3 text-center text-sm font-medium",
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-slate-500"
              )}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {days.map((day, dayIdx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayEvents = filteredEvents.filter(e => e.date === dayStr);
              const dayOfWeek = getDay(day);
              const hasHoliday = dayEvents.some(e => e.type === 'holiday');

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-b border-r border-slate-100 relative group",
                    !isSameMonth(day, currentDate) && "bg-slate-50/50 text-slate-400",
                    dayIdx % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-medium",
                      isToday(day) ? "bg-indigo-600 text-white" :
                        hasHoliday || dayOfWeek === 0 ? "text-red-500" :
                          dayOfWeek === 6 ? "text-blue-500" : "text-slate-700"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1 md:px-1.5 py-0.5 text-[8px] md:text-[10px] rounded truncate font-medium cursor-default",
                          event.type === 'holiday'
                            ? "bg-purple-100 text-purple-700"
                            : `text-white ${event.color}`
                        )}
                        title={`${event.school !== '전체' ? `[${event.school}] ` : ''}${event.description || event.title}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 일정 추가/수정 모달 ─── */}
      {eventModal && editEvent && (
        <Modal title={eventModal === 'add' ? '일정 추가' : '일정 수정'} onClose={closeEventModal}>
          <div>
            <label className={labelCls}>일정 제목 *</label>
            <input className={inputCls} value={editEvent.title} onChange={e => setEditEvent({ ...editEvent, title: e.target.value })} placeholder="예: 진접중 1학기 중간고사" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>날짜 *</label>
              <input type="date" className={inputCls} value={editEvent.date} onChange={e => setEditEvent({ ...editEvent, date: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>유형</label>
              <select className={inputCls} value={editEvent.type} onChange={e => setEditEvent({ ...editEvent, type: e.target.value as CalendarEvent['type'] })}>
                <option value="school">학교 행사</option>
                <option value="exam">시험 일정</option>
                <option value="academy">학원 일정</option>
                <option value="holiday">공휴일</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>학교</label>
            <select className={inputCls} value={editEvent.school} onChange={e => setEditEvent({ ...editEvent, school: e.target.value })}>
              {SCHOOL_LIST.map(s => (
                <option key={s} value={s}>{s === '전체' ? '전체 (공통)' : s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>설명 (선택)</label>
            <textarea className={inputCls + " h-20"} value={editEvent.description} onChange={e => setEditEvent({ ...editEvent, description: e.target.value })} placeholder="상세 설명을 입력하세요" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeEventModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={handleSaveEvent} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
              <Save className="w-4 h-4" /> 저장
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
