/**
 * ImgBB Image Upload Utility
 * 
 * 이미지를 ImgBB 서버에 업로드하고 URL을 반환합니다.
 * 팝업, 공지사항, 갤러리, 블로그 등 이미지 업로드가 필요한 모든 곳에서 사용합니다.
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
    success: boolean;
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: number;
        height: number;
        size: number;
        time: number;
        expiration: number;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        medium?: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    status: number;
}

export interface UploadResult {
    success: boolean;
    url: string;        // 원본 이미지 URL
    displayUrl: string; // 최적화된 표시용 URL
    thumbUrl: string;   // 썸네일 URL
    deleteUrl: string;  // 삭제 URL
    width: number;
    height: number;
    error?: string;
}

/**
 * 이미지를 WebP 포맷으로 변환 & 용량 최적화
 * - 해상도와 퀄리티를 최대한 유지하면서 용량만 줄임
 * - WebP 지원 시 WebP로, 미지원 시 JPEG로 폴백
 * - 원본보다 커지면 원본을 그대로 사용
 * - 최대 단변 2048px (웹 용도 충분)
 */
const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 0.88;    // 0.85~0.92 → 육안 차이 없음
const JPEG_QUALITY = 0.90;

function optimizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
        // 이미 작은 파일은 최적화 불필요 (200KB 이하)
        if (file.size <= 200 * 1024) {
            resolve(file);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // 최대 크기 제한 (비율 유지)
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(file); return; }

            // 고품질 리사이즈
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // WebP 먼저 시도, 안 되면 JPEG 폴백
            const tryFormat = (mime: string, quality: number) => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) { resolve(file); return; }

                        // 원본보다 큰 경우 → 원본 유지
                        if (blob.size >= file.size) {
                            // WebP가 더 크면 JPEG도 시도
                            if (mime === 'image/webp') {
                                tryFormat('image/jpeg', JPEG_QUALITY);
                                return;
                            }
                            resolve(file);
                            return;
                        }

                        const ext = mime === 'image/webp' ? '.webp' : '.jpg';
                        const baseName = file.name.replace(/\.[^.]+$/, '');
                        const optimized = new File([blob], baseName + ext, { type: mime });

                        console.log(
                            `[ImgBB] 최적화: ${(file.size / 1024).toFixed(0)}KB → ${(optimized.size / 1024).toFixed(0)}KB ` +
                            `(${Math.round((1 - optimized.size / file.size) * 100)}% 감소, ${mime})`
                        );

                        resolve(optimized);
                    },
                    mime,
                    quality
                );
            };

            tryFormat('image/webp', WEBP_QUALITY);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // 실패 시 원본 그대로
        };

        img.src = url;
    });
}

/**
 * File 객체를 ImgBB에 업로드 (자동 최적화 포함)
 */
export async function uploadImageToImgBB(file: File): Promise<UploadResult> {
    if (!IMGBB_API_KEY) {
        return {
            success: false,
            url: '', displayUrl: '', thumbUrl: '', deleteUrl: '',
            width: 0, height: 0,
            error: 'ImgBB API 키가 설정되지 않았습니다.',
        };
    }

    // 업로드 전 이미지 최적화
    const optimizedFile = await optimizeImage(file);

    const formData = new FormData();
    formData.append('image', optimizedFile);
    formData.append('key', IMGBB_API_KEY);

    try {
        const response = await fetch(IMGBB_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result: ImgBBResponse = await response.json();

        if (!result.success) {
            throw new Error('ImgBB upload returned unsuccessful response');
        }

        return {
            success: true,
            url: result.data.image.url,
            displayUrl: result.data.display_url,
            thumbUrl: result.data.thumb.url,
            deleteUrl: result.data.delete_url,
            width: result.data.width,
            height: result.data.height,
        };
    } catch (err) {
        return {
            success: false,
            url: '', displayUrl: '', thumbUrl: '', deleteUrl: '',
            width: 0, height: 0,
            error: err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.',
        };
    }
}

/**
 * Base64 문자열을 ImgBB에 업로드
 */
export async function uploadBase64ToImgBB(base64: string, name?: string): Promise<UploadResult> {
    if (!IMGBB_API_KEY) {
        return {
            success: false,
            url: '', displayUrl: '', thumbUrl: '', deleteUrl: '',
            width: 0, height: 0,
            error: 'ImgBB API 키가 설정되지 않았습니다.',
        };
    }

    // Remove data:image/...;base64, prefix if present
    const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const formData = new FormData();
    formData.append('image', cleanBase64);
    formData.append('key', IMGBB_API_KEY);
    if (name) formData.append('name', name);

    try {
        const response = await fetch(IMGBB_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result: ImgBBResponse = await response.json();

        if (!result.success) {
            throw new Error('ImgBB upload returned unsuccessful response');
        }

        return {
            success: true,
            url: result.data.image.url,
            displayUrl: result.data.display_url,
            thumbUrl: result.data.thumb.url,
            deleteUrl: result.data.delete_url,
            width: result.data.width,
            height: result.data.height,
        };
    } catch (err) {
        return {
            success: false,
            url: '', displayUrl: '', thumbUrl: '', deleteUrl: '',
            width: 0, height: 0,
            error: err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.',
        };
    }
}

/**
 * ImgBB API가 사용 가능한지 확인
 */
export const isImgBBConfigured = !!IMGBB_API_KEY;
