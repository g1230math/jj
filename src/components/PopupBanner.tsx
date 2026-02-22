import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups, getPopupSettings, type PopupItem } from '../data/mockData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const CLOSE_TODAY_KEY = 'g1230_popup_close_today';

function getClosedToday(): string[] {
    const saved = localStorage.getItem(CLOSE_TODAY_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const today = new Date().toISOString().split('T')[0];
            if (data.date === today) return data.ids || [];
        } catch { /* fallback */ }
    }
    return [];
}

function setClosedToday(ids: string[]) {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(CLOSE_TODAY_KEY, JSON.stringify({ date: today, ids }));
}

export function PopupBanner() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [activePopups, setActivePopups] = useState<PopupItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        (async () => {
            const settings = await getPopupSettings();
            if (!settings.enabled) return;

            const allPopups = await getPopups();
            const today = new Date().toISOString().split('T')[0];
            const closedIds = getClosedToday();

            const filtered = allPopups
                .filter(p => p.isActive && p.startDate <= today && today <= p.endDate)
                .filter(p => !closedIds.includes(p.id))
                .sort((a, b) => a.order - b.order);

            if (filtered.length > 0) {
                setActivePopups(filtered);
                setVisible(true);
            }
        })();
    }, []);

    // Auto-slide for 2+ popups
    useEffect(() => {
        if (activePopups.length <= 1) return;
        const interval = (activePopups[currentIndex]?.slideInterval || 5) * 1000;
        const timer = setInterval(() => {
            goToNext();
        }, interval);
        return () => clearInterval(timer);
    }, [activePopups, currentIndex]);

    const goToNext = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % activePopups.length);
            setIsTransitioning(false);
        }, 300);
    }, [activePopups.length]);

    const goToPrev = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => (prev - 1 + activePopups.length) % activePopups.length);
            setIsTransitioning(false);
        }, 300);
    }, [activePopups.length]);

    const handleClose = () => {
        setVisible(false);
    };

    const handleCloseToday = () => {
        const closedIds = getClosedToday();
        const ids = [...new Set([...closedIds, ...activePopups.map(p => p.id)])];
        setClosedToday(ids);
        setVisible(false);
    };

    const handleClick = (popup: PopupItem) => {
        if (popup.clickAction === 'link' && popup.linkUrl) {
            if (popup.openInNewTab) {
                window.open(popup.linkUrl, '_blank');
            } else {
                window.location.href = popup.linkUrl;
            }
        } else if (popup.clickAction === 'page' && popup.targetPage) {
            setVisible(false);
            navigate(popup.targetPage);
        }
    };

    if (!visible || activePopups.length === 0) return null;

    const current = activePopups[currentIndex];
    const isMobile = window.innerWidth < 768;
    const popupWidth = isMobile ? current.mobileWidth : current.pcWidth;
    const popupTop = isMobile ? current.mobileTop : current.pcTop;
    const centerAlign = isMobile ? current.mobileCenterAlign : current.pcCenterAlign;
    const showAnyCloseToday = activePopups.some(p => p.showCloseToday);
    const showOverlay = activePopups.some(p => p.showOverlay);

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center" style={{ pointerEvents: 'auto' }}>
            {/* Overlay */}
            {showOverlay && (
                <div
                    className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                    onClick={handleClose}
                />
            )}

            {/* Popup Container */}
            <div
                className="relative"
                style={{
                    width: `${popupWidth}px`,
                    maxWidth: '95vw',
                    marginTop: `${popupTop}px`,
                    ...(centerAlign ? {} : { marginLeft: isMobile ? 'auto' : `${current.pcLeft}px`, marginRight: isMobile ? 'auto' : 'unset' }),
                }}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
                >
                    <X className="w-4 h-4 text-slate-600" />
                </button>

                {/* Image */}
                <div
                    className={cn(
                        "relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transition-all duration-300",
                        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    )}
                    onClick={() => handleClick(current)}
                >
                    <img
                        src={current.imageUrl}
                        alt="popup"
                        className="w-full h-auto block"
                        style={{ maxHeight: '80vh' }}
                    />
                </div>

                {/* Slide Navigation — only for 2+ popups */}
                {activePopups.length > 1 && (
                    <>
                        {/* Left/Right arrows */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors backdrop-blur-sm"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-700" />
                        </button>

                        {/* Dots indicator */}
                        <div className="flex items-center justify-center gap-1.5 mt-3">
                            {activePopups.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setTimeout(() => {
                                            setCurrentIndex(i);
                                            setIsTransitioning(false);
                                        }, 300);
                                    }}
                                    className={cn(
                                        "rounded-full transition-all duration-300",
                                        i === currentIndex
                                            ? "w-6 h-2.5 bg-white shadow-sm"
                                            : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Close Today Button */}
                {showAnyCloseToday && (
                    <div className="flex justify-center mt-3">
                        <button
                            onClick={handleCloseToday}
                            className="text-sm text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                        >
                            오늘 하루 보지 않기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
