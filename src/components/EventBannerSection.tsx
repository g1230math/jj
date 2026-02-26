import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Sparkles, Clock, ArrowRight, X } from 'lucide-react';
import { getEvents, type EventBanner as EventBannerType } from '../data/academyData';

function useCountdown(endDate: string) {
    const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0 });
    useEffect(() => {
        const update = () => {
            const diff = new Date(endDate).getTime() - Date.now();
            if (diff <= 0) { setRemaining({ days: 0, hours: 0, mins: 0 }); return; }
            setRemaining({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                mins: Math.floor((diff % 3600000) / 60000),
            });
        };
        update();
        const timer = setInterval(update, 60000);
        return () => clearInterval(timer);
    }, [endDate]);
    return remaining;
}

function EventCard({ event }: { event: EventBannerType }) {
    const cd = useCountdown(event.end_date);
    const isEnding = cd.days <= 3;

    return (
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 sm:p-6 text-white overflow-hidden group">
            {/* Decorative */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black mb-1">{event.title}</h3>
                        <p className="text-sm text-white/80">{event.description}</p>
                    </div>
                    <Sparkles className="w-6 h-6 text-yellow-300 shrink-0 animate-pulse" />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    {/* Countdown */}
                    <div className="flex items-center gap-2">
                        <Clock className={cn("w-4 h-4", isEnding ? "text-yellow-300" : "text-white/60")} />
                        <div className="flex gap-1.5">
                            {[{ v: cd.days, l: '일' }, { v: cd.hours, l: '시' }, { v: cd.mins, l: '분' }].map((t, i) => (
                                <div key={i} className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                                    <p className="text-sm font-black">{t.v}</p>
                                    <p className="text-[8px] text-white/70">{t.l}</p>
                                </div>
                            ))}
                        </div>
                        {isEnding && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold animate-pulse">마감 임박!</span>}
                    </div>

                    <a href="/jj/contact" className="inline-flex items-center gap-1 px-4 py-2 bg-white text-indigo-700 font-bold text-sm rounded-lg hover:bg-white/90 transition-colors sm:ml-auto">
                        자세히 보기 <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export function EventBannerSection() {
    const [events, setEvents] = useState<EventBannerType[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        const now = new Date().toISOString().slice(0, 10);
        setEvents(getEvents().filter(e => e.active && e.start_date <= now && e.end_date >= now));
    }, []);

    const visible = events.filter(e => !dismissed.includes(e.id));
    if (visible.length === 0) return null;

    return (
        <section className="py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 space-y-4">
                {visible.map(event => (
                    <div key={event.id} className="relative">
                        <EventCard event={event} />
                        <button onClick={() => setDismissed(prev => [...prev, event.id])}
                            className="absolute top-2 right-2 p-1 bg-white/20 rounded-full hover:bg-white/40 text-white/80 transition-colors z-20">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
