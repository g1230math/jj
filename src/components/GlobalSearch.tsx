import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, FileText, Video, Bell, BookOpen, Users, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { getNotices, type NoticeItem } from '../data/mockData';
import { getExams, type Exam } from '../data/studyData';
import { useAuth } from '../context/AuthContext';

interface SearchResult {
    type: 'page' | 'exam' | 'notice';
    title: string;
    desc?: string;
    link: string;
    icon: React.ElementType;
}

const PAGES: SearchResult[] = [
    { type: 'page', title: '홈', link: '/', icon: BookOpen },
    { type: 'page', title: '학원소개', link: '/about', icon: BookOpen },
    { type: 'page', title: '수강안내', link: '/courses', icon: BookOpen },
    { type: 'page', title: '학습 허브', desc: '시험·오답·분석', link: '/study', icon: FileText },
    { type: 'page', title: '동영상강의', link: '/lectures', icon: Video },
    { type: 'page', title: '학사일정', link: '/calendar', icon: BookOpen },
    { type: 'page', title: '커뮤니티', desc: '공지·블로그·갤러리', link: '/community', icon: Users },
    { type: 'page', title: '성공스토리', link: '/success', icon: BookOpen },
    { type: 'page', title: '오시는길', link: '/contact', icon: BookOpen },
    { type: 'page', title: '레벨테스트', desc: '무료 수학 진단', link: '/level-test', icon: FileText },
    { type: 'page', title: '체험예약', desc: '무료 체험수업', link: '/trial', icon: BookOpen },
    { type: 'page', title: '차량운행', link: '/shuttle', icon: BookOpen },
    { type: 'page', title: '마이페이지', desc: '대시보드', link: '/dashboard', icon: Users },
];

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getNotices().then(setNotices);
        getExams().then(setExams);
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // Keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        const filtered: SearchResult[] = [];

        // Pages
        PAGES.forEach(p => {
            if (p.title.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q)) {
                filtered.push(p);
            }
        });

        // Notices
        notices.forEach(n => {
            if (n.title.toLowerCase().includes(q)) {
                filtered.push({ type: 'notice', title: n.title, desc: n.date, link: '/community', icon: Bell });
            }
        });

        // Exams
        exams.filter(e => e.status === 'published').forEach(e => {
            if (e.title.toLowerCase().includes(q)) {
                filtered.push({ type: 'exam', title: e.title, desc: `${e.school} ${e.grade}학년`, link: '/study', icon: FileText });
            }
        });

        return filtered.slice(0, 8);
    }, [query, notices, exams]);

    const handleSelect = (result: SearchResult) => {
        setOpen(false); setQuery('');
        navigate(result.link);
    };

    return (
        <>
            {/* Trigger Button */}
            <button onClick={() => setOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-400 transition-colors">
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs">검색</span>
            </button>

            {/* Mobile trigger */}
            <button onClick={() => setOpen(true)} className="sm:hidden p-2 hover:bg-slate-100 rounded-lg">
                <Search className="w-4.5 h-4.5 text-slate-500" />
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 px-4" onClick={() => setOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="페이지, 시험, 공지 검색..."
                                className="flex-1 text-sm outline-none bg-transparent"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded"><X className="w-3.5 h-3.5 text-slate-400" /></button>
                            )}
                            <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-400">ESC</kbd>
                        </div>

                        {query.trim() && (
                            <div className="max-h-[50vh] overflow-y-auto">
                                {results.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-slate-400">결과가 없습니다</div>
                                ) : (
                                    <div className="py-2">
                                        {results.map((r, i) => (
                                            <button key={i} onClick={() => handleSelect(r)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                    r.type === 'page' ? 'bg-indigo-50 text-indigo-500' :
                                                        r.type === 'exam' ? 'bg-emerald-50 text-emerald-500' :
                                                            'bg-amber-50 text-amber-500'
                                                )}>
                                                    <r.icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                                                    {r.desc && <p className="text-[10px] text-slate-400">{r.desc}</p>}
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!query.trim() && (
                            <div className="p-4">
                                <p className="text-[10px] text-slate-400 font-medium mb-2">빠른 이동</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {PAGES.slice(0, 6).map(p => (
                                        <button key={p.link} onClick={() => handleSelect(p)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left">
                                            <p.icon className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-xs text-slate-600 font-medium">{p.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
