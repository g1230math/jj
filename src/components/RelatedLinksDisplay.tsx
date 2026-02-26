// ═══════════════════════════════════════════
// 🔗 관련 학습 자료 링크 표시 컴포넌트
// ═══════════════════════════════════════════
import React from 'react';
import { cn } from '../lib/utils';
import { ExternalLink, Video, PlayCircle, FileText, Link2 } from 'lucide-react';
import type { RelatedLink, LinkType } from '../data/studyData';
import { LINK_TYPE_LABELS } from '../data/studyData';

const iconMap: Record<LinkType, React.ElementType> = {
    lecture: Video,
    youtube: PlayCircle,
    blog: FileText,
    other: Link2,
};

interface Props {
    links: RelatedLink[];
    className?: string;
}

export function RelatedLinksDisplay({ links, className }: Props) {
    if (!links || links.length === 0) return null;

    return (
        <div className={cn('mt-3', className)}>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                📚 관련 학습 자료
            </p>
            <div className="flex flex-col gap-1.5">
                {links.map((link, i) => {
                    const meta = LINK_TYPE_LABELS[link.type] || LINK_TYPE_LABELS.other;
                    const Icon = iconMap[link.type] || Link2;

                    return (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all hover:shadow-sm hover:-translate-y-0.5 group',
                                meta.color
                            )}
                        >
                            <div className="w-7 h-7 rounded-md bg-white/60 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate group-hover:underline">
                                    {link.title || link.url}
                                </p>
                                <p className="text-[9px] opacity-60 font-medium">{meta.emoji} {meta.label}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 shrink-0" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
