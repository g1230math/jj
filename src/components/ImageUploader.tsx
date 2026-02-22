import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadImageToImgBB, isImgBBConfigured, type UploadResult } from '../lib/imgbb';
import { cn } from '../lib/utils';

interface ImageUploaderProps {
    /** 업로드 완료 시 URL과 결과를 반환 */
    onUpload: (result: UploadResult) => void;
    /** 현재 이미지 URL (미리보기 표시용) */
    currentImageUrl?: string;
    /** 직접 URL 입력도 허용할지 여부 */
    allowUrlInput?: boolean;
    /** URL 직접 입력 시 콜백 */
    onUrlChange?: (url: string) => void;
    /** 커스텀 클래스 */
    className?: string;
    /** 라벨 텍스트 */
    label?: string;
    /** 컴팩트 모드 (작은 크기) */
    compact?: boolean;
}

export function ImageUploader({
    onUpload,
    currentImageUrl,
    allowUrlInput = true,
    onUrlChange,
    className,
    label = '이미지',
    compact = false,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        if (file.size > 32 * 1024 * 1024) {
            setError('파일 크기는 32MB 이하여야 합니다.');
            return;
        }

        setError(null);
        setUploadSuccess(false);
        setUploading(true);

        const result = await uploadImageToImgBB(file);

        setUploading(false);

        if (result.success) {
            setUploadSuccess(true);
            onUpload(result);
            setTimeout(() => setUploadSuccess(false), 3000);
        } else {
            setError(result.error || '업로드에 실패했습니다.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Upload zone */}
                <div
                    className={cn(
                        "md:col-span-2 relative border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                        compact ? "p-3" : "p-5",
                        dragOver
                            ? "border-indigo-400 bg-indigo-50"
                            : uploading
                                ? "border-amber-300 bg-amber-50"
                                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <div className={cn("flex flex-col items-center gap-2", compact ? "text-xs" : "text-sm")}>
                        {uploading ? (
                            <>
                                <Loader2 className={cn("animate-spin text-indigo-500", compact ? "w-5 h-5" : "w-8 h-8")} />
                                <span className="text-indigo-600 font-medium">업로드 중...</span>
                            </>
                        ) : uploadSuccess ? (
                            <>
                                <CheckCircle className={cn("text-emerald-500", compact ? "w-5 h-5" : "w-8 h-8")} />
                                <span className="text-emerald-600 font-medium">업로드 완료!</span>
                            </>
                        ) : (
                            <>
                                <Upload className={cn("text-slate-400", compact ? "w-5 h-5" : "w-8 h-8")} />
                                <div className="text-center">
                                    <span className="text-slate-600 font-medium">
                                        클릭하여 이미지 선택
                                    </span>
                                    <span className="text-slate-400 block text-xs mt-0.5">
                                        또는 여기에 드래그 & 드롭 (최대 32MB)
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {!isImgBBConfigured && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-sm text-red-500 font-medium">ImgBB API 키가 설정되지 않음</span>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className={cn(
                    "rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center",
                    compact ? "h-16" : "h-24"
                )}>
                    {currentImageUrl ? (
                        <img
                            src={currentImageUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="text-slate-300 text-xs">미리보기</span>
                    )}
                </div>
            </div>

            {/* URL input (optional) */}
            {allowUrlInput && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">또는 URL 직접 입력:</span>
                    <input
                        type="text"
                        value={currentImageUrl || ''}
                        onChange={(e) => onUrlChange?.(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                        placeholder="https://..."
                    />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-sm text-red-600">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto p-0.5 hover:bg-red-100 rounded">
                        <X className="w-3 h-3 text-red-400" />
                    </button>
                </div>
            )}
        </div>
    );
}
