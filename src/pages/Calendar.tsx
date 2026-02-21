import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-800 via-emerald-800 to-emerald-900 text-white py-16 overflow-hidden wave-divider wave-divider-white">
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">학사 일정</h1>
            <p className="text-slate-500 mt-1">학원 일정 및 주요 학교 행사를 확인하세요.</p>
          </div>
          <div className="flex gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                <span className="text-sm text-slate-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex space-x-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-slate-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {days.map((day, dayIdx) => {
              const dayEvents = calendarEvents.filter(
                event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );

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
                      isToday(day) ? "bg-indigo-600 text-white" : "text-slate-700"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md truncate font-medium text-white",
                          event.color
                        )}
                        title={event.title}
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
