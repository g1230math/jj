import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups, getPopupSettings, type PopupItem } from '../data/mockData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

/** Preload an image and resolve when ready */
function preloadImage(src: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // don't block popup if image fails
        img.src = src;
    });
}

/** Responsive isMobile hook using matchMedia */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        setIsMobile(mql.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);

    return isMobile;
}

// Slide animation variants
const slideVariants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 80 : -80,
        scale: 0.95,
    }),
    center: {
        opacity: 1,
        x: 0,
        scale: 1,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -80 : 80,
        scale: 0.95,
    }),
};

export function PopupBanner() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [visible, setVisible] = useState(false);
    const [activePopups, setActivePopups] = useState<PopupItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [[slideDirection], setSlideDirection] = useState([0]); // track slide direction for animation

    useEffect(() => {
        (async () => {
            // ✅ Fix #5: Parallel data fetching
            const [settings, allPopups] = await Promise.all([
                getPopupSettings(),
                getPopups(),
            ]);
            if (!settings.enabled) return;

            const today = new Date().toISOString().split('T')[0];
            const closedIds = getClosedToday();

            const filtered = allPopups
                .filter(p => p.isActive && p.startDate <= today && today <= p.endDate)
                .filter(p => !closedIds.includes(p.id))
                .sort((a, b) => a.order - b.order);

            if (filtered.length > 0) {
                // ✅ Fix #4: Preload first image before showing popup
                await preloadImage(filtered[0].imageUrl);
                setActivePopups(filtered);
                setVisible(true);

                // Preload remaining images in background
                filtered.slice(1).forEach(p => preloadImage(p.imageUrl));
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

    // ✅ Fix #3: Direct index change, AnimatePresence handles transition
    const goToNext = useCallback(() => {
        setSlideDirection([1]);
        setCurrentIndex(prev => (prev + 1) % activePopups.length);
    }, [activePopups.length]);

    const goToPrev = useCallback(() => {
        setSlideDirection([-1]);
        setCurrentIndex(prev => (prev - 1 + activePopups.length) % activePopups.length);
    }, [activePopups.length]);

    const goToSlide = useCallback((i: number) => {
        setSlideDirection([i > currentIndex ? 1 : -1]);
        setCurrentIndex(i);
    }, [currentIndex]);

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

    if (activePopups.length === 0) return null;

    const current = activePopups[currentIndex];
    // ✅ Fix #2: Use responsive isMobile hook instead of raw window.innerWidth
    const popupWidth = isMobile ? current.mobileWidth : current.pcWidth;
    const popupTop = isMobile ? current.mobileTop : current.pcTop;
    const centerAlign = isMobile ? current.mobileCenterAlign : current.pcCenterAlign;
    const showAnyCloseToday = activePopups.some(p => p.showCloseToday);
    const showOverlay = activePopups.some(p => p.showOverlay);

    return (
        // ✅ Fix #1: AnimatePresence for entrance/exit animation
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="popup-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed inset-0 z-[9999] flex items-start justify-center"
                    style={{ pointerEvents: 'auto' }}
                >
                    {/* Overlay with fade-in */}
                    {showOverlay && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={handleClose}
                        />
                    )}

                    {/* Popup Container with scale-up entrance */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                        style={{
                            width: `${popupWidth}px`,
                            maxWidth: '95vw',
                            marginTop: `${popupTop}px`,
                            ...(centerAlign ? {} : { marginLeft: isMobile ? 'auto' : `${current.pcLeft}px`, marginRight: isMobile ? 'auto' : 'unset' }),
                        }}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                            onClick={handleClose}
                            className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                            <X className="w-4 h-4 text-slate-600" />
                        </motion.button>

                        {/* Image with AnimatePresence slide transition */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                                <motion.div
                                    key={current.id}
                                    custom={slideDirection}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    className="cursor-pointer"
                                    onClick={() => handleClick(current)}
                                >
                                    <img
                                        src={current.imageUrl}
                                        alt="popup"
                                        className="w-full h-auto block"
                                        style={{ maxHeight: '80vh' }}
                                    />
                                </motion.div>
                            </AnimatePresence>
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
                                            onClick={() => goToSlide(i)}
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
