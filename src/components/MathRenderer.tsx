import React, { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface MathRendererProps {
    content: string;
    className?: string;
}

/**
 * 수식이 포함된 텍스트를 렌더링합니다.
 * - $$...$$ → 블록 수식
 * - $...$ → 인라인 수식
 * - 나머지는 일반 텍스트 (줄바꿈 지원)
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
    const html = useMemo(() => renderMathContent(content), [content]);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function renderMathContent(text: string): string {
    if (!text) return '';

    // 1. Block math: $$...$$
    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
            return `<div class="katex-block my-2">${katex.renderToString(math.trim(), {
                displayMode: true,
                throwOnError: false,
                output: 'html',
            })}</div>`;
        } catch {
            return `<div class="text-red-500 text-sm">[수식 오류: ${math}]</div>`;
        }
    });

    // 2. Inline math: $...$
    result = result.replace(/\$([^$\n]+?)\$/g, (_, math) => {
        try {
            return katex.renderToString(math.trim(), {
                displayMode: false,
                throwOnError: false,
                output: 'html',
            });
        } catch {
            return `<span class="text-red-500 text-sm">[수식 오류]</span>`;
        }
    });

    // 3. Line breaks
    result = result.replace(/\n/g, '<br />');

    return result;
}

/**
 * LaTeX 미리보기 (입력 필드 옆에 실시간 미리보기)
 */
export function MathPreview({ content, label }: { content: string; label?: string }) {
    if (!content.trim()) return null;
    return (
        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            {label && <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">{label}</p>}
            <MathRenderer content={content} className="text-sm text-slate-800" />
        </div>
    );
}
