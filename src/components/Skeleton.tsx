import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg",
                className
            )}
        />
    );
}

export function PageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>

            {/* Content skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
