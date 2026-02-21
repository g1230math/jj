import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, BookOpen, GraduationCap, Flag, Sparkles } from 'lucide-react';
import { calendarEvents } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const categories = [
    { id: 'academy', name: '학원 일정', color: 'bg-blue-500' },
    { id: 'school', name: '학교 행사', color: 'bg-green-500' },
    { id: 'exam', name: '시험 일정', color: 'bg-red-500' },
    { id: 'holiday', name: '공휴일', color: 'bg-purple-500' },
  ];

  // Get events for current month
  const monthlyEvents = useMemo(() => {
    return calendarEvents
      .filter(event => {
        const eventMonth = event.date.getMonth();
        const eventYear = event.date.getFullYear();
        return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [currentDate]);

  const importantEvents = monthlyEvents.filter(e => e.type !== 'holiday');
  const holidayEvents = monthlyEvents.filter(e => e.type === 'holiday');

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

        {/* Monthly Highlights */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {format(currentDate, 'M월', { locale: ko })} 주요 일정
            </h2>
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
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm",
                      typeBgColors[event.type]
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", typeIconColors[event.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500 font-medium">
                          {format(event.date, 'M/d (EEE)', { locale: ko })}
                        </span>
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
              const dayEvents = calendarEvents.filter(
                event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );
              const dayOfWeek = getDay(day);
              const hasHoliday = dayEvents.some(e => e.type === 'holiday');

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[120px] p-2 border-b border-r border-slate-100 relative group",
                    !isSameMonth(day, currentDate) && "bg-slate-50/50 text-slate-400",
                    dayIdx % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
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
                          "px-1.5 py-0.5 text-[10px] rounded truncate font-medium",
                          event.type === 'holiday'
                            ? "bg-purple-100 text-purple-700"
                            : `text-white ${event.color}`
                        )}
                        title={event.description || event.title}
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
    </div>
  );
}
