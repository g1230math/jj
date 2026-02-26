import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, ExternalLink, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import {
    getNotifications, markNotifRead, markAllNotifsRead,
    type Notification, type NotificationType
} from '../data/academyData';

const TYPE_STYLES: Record<NotificationType, { icon: string; bg: string }> = {
    exam: { icon: '📝', bg: 'bg-blue-50' },
    homework: { icon: '📚', bg: 'bg-amber-50' },
    attendance: { icon: '✅', bg: 'bg-emerald-50' },
    payment: { icon: '💰', bg: 'bg-pink-50' },
    consult: { icon: '💬', bg: 'bg-indigo-50' },
    notice: { icon: '📢', bg: 'bg-orange-50' },
    badge: { icon: '🏆', bg: 'bg-yellow-50' },
    system: { icon: '⚙️', bg: 'bg-slate-50' },
};

export function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => { setNotifications(getNotifications()); }, []);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unread = notifications.filter(n => !n.read).length;

    const handleRead = (id: string) => {
        markNotifRead(id);
        setNotifications(getNotifications());
    };

    const handleReadAll = () => {
        markAllNotifsRead();
        setNotifications(getNotifications());
    };

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}분 전`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}시간 전`;
        return `${Math.floor(hrs / 24)}일 전`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-[70vh] flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">알림 {unread > 0 && <span className="text-indigo-600">({unread})</span>}</h3>
                        {unread > 0 && (
                            <button onClick={handleReadAll} className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                <Check className="w-3 h-3" /> 전체 읽음
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">알림이 없습니다</p>
                            </div>
                        ) : (
                            notifications.slice(0, 20).map(n => {
                                const style = TYPE_STYLES[n.type] || TYPE_STYLES.system;
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleRead(n.id)}
                                        className={cn(
                                            "px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3",
                                            !n.read && "bg-indigo-50/30"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm", style.bg)}>
                                            {style.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2">
                                                <p className={cn("text-sm leading-tight", !n.read ? "font-semibold text-slate-900" : "text-slate-600")}>
                                                    {n.title}
                                                </p>
                                                {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
