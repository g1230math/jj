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
 * File 객체를 ImgBB에 업로드
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

    const formData = new FormData();
    formData.append('image', file);
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
