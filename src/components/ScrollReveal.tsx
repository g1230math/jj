import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
}

const directionVariants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
};

export function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    once = true,
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-60px 0px' });
    const variants = directionVariants[direction];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Counter animation for stats
interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    decimals?: number;
}

export function CountUp({ end, duration = 2, suffix = '', prefix = '', className = '', decimals = 0 }: CountUpProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(eased * end);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
        </span>
    );
}

// Section wrapper with consistent spacing
interface SectionProps {
    children: React.ReactNode;
    className?: string;
    dark?: boolean;
    id?: string;
}

export function Section({ children, className = '', dark = false, id }: SectionProps) {
    return (
        <section id={id} className={`py-20 md:py-28 ${dark ? 'bg-slate-900 text-white' : ''} ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}

// Section header
interface SectionHeaderProps {
    badge?: string;
    title: string;
    subtitle?: string;
    center?: boolean;
    dark?: boolean;
}

export function SectionHeader({ badge, title, subtitle, center = true, dark = false }: SectionHeaderProps) {
    return (
        <ScrollReveal className={`mb-12 md:mb-16 ${center ? 'text-center' : ''}`}>
            {badge && (
                <span className={`text-badge inline-block px-4 py-1.5 rounded-full mb-4 ${dark
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                    {badge}
                </span>
            )}
            <h2 className="text-section-title">{title}</h2>
            {subtitle && <p className="text-section-subtitle mt-4 max-w-2xl mx-auto">{subtitle}</p>}
        </ScrollReveal>
    );
}
