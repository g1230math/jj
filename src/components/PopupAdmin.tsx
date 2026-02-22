import React, { useState } from 'react';
import { getPopups, savePopups, getPopupSettings, savePopupSettings, type PopupItem, type PopupSettings } from '../data/mockData';
import { Plus, Trash2, Edit2, Save, X, Image, Eye, EyeOff, ChevronUp, ChevronDown, Monitor, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import { ImageUploader } from './ImageUploader';

export function PopupAdmin() {
    const [popups, setPopups] = useState<PopupItem[]>(getPopups());
    const [settings, setSettings] = useState<PopupSettings>(getPopupSettings());
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyForm: Omit<PopupItem, 'id' | 'order'> = {
        imageUrl: '',
        clickAction: 'link',
        linkUrl: '',
        targetPage: '',
        openInNewTab: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().split('T')[0]; })(),
        isActive: true,
        pcWidth: 400,
        pcTop: 100,
        pcLeft: 100,
        pcCenterAlign: true,
        mobileWidth: 300,
        mobileTop: 50,
        mobileCenterAlign: true,
        showCloseToday: true,
        showOverlay: true,
        slideInterval: 5,
    };

    const [form, setForm] = useState(emptyForm);

    const handleToggleEnabled = () => {
        const updated = { ...settings, enabled: !settings.enabled };
        setSettings(updated);
        savePopupSettings(updated);
    };

    const handleSave = () => {
        let updated: PopupItem[];
        if (editingId) {
            updated = popups.map(p =>
                p.id === editingId ? { ...p, ...form } : p
            );
        } else {
            const newPopup: PopupItem = {
                ...form,
                id: `popup_${Date.now()}`,
                order: popups.length + 1,
            };
            updated = [...popups, newPopup];
        }
        savePopups(updated);
        setPopups(updated);
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleEdit = (popup: PopupItem) => {
        const { id, order, ...rest } = popup;
        setForm(rest);
        setEditingId(popup.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
        const updated = popups.filter(p => p.id !== id);
        savePopups(updated);
        setPopups(updated);
    };

    const handleToggleActive = (id: string) => {
        const updated = popups.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        );
        savePopups(updated);
        setPopups(updated);
    };

    const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
        const sorted = [...popups].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex(p => p.id === id);
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        const tempOrder = sorted[idx].order;
        sorted[idx].order = sorted[swapIdx].order;
        sorted[swapIdx].order = tempOrder;
        const updated = popups.map(p => {
            const found = sorted.find(s => s.id === p.id);
            return found ? { ...p, order: found.order } : p;
        });
        savePopups(updated);
        setPopups(updated);
    };

    const sortedPopups = [...popups].sort((a, b) => a.order - b.order);

    const isDateActive = (popup: PopupItem) => {
        const now = new Date().toISOString().split('T')[0];
        return popup.startDate <= now && now <= popup.endDate;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">팝업(POPUP) 관리</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">팝업 사용</span>
                    <button
                        onClick={handleToggleEnabled}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            settings.enabled ? "bg-indigo-600" : "bg-slate-300"
                        )}
                    >
                        <span className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                            settings.enabled ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Popup List Header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600 font-medium">
                        팝업 목록 ({popups.length})
                    </p>
                    {!showForm && (
                        <button
                            onClick={() => {
                                setForm(emptyForm);
                                setEditingId(null);
                                setShowForm(true);
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> 팝업 추가
                        </button>
                    )}
                </div>

                {/* Popup Cards */}
                {sortedPopups.length === 0 && !showForm && (
                    <div className="text-center py-12 text-slate-400">
                        <Image className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">등록된 팝업이 없습니다</p>
                    </div>
                )}

                {sortedPopups.map((popup, idx) => (
                    <div
                        key={popup.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                            popup.isActive && isDateActive(popup)
                                ? "bg-white border-slate-200"
                                : "bg-slate-50 border-slate-200 opacity-60"
                        )}
                    >
                        {/* Order controls */}
                        <div className="flex flex-col items-center gap-0.5 pt-2">
                            <button
                                onClick={() => handleMoveOrder(popup.id, 'up')}
                                disabled={idx === 0}
                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                            >
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                            </button>
                            <span className="text-xs text-slate-400 font-mono">{idx + 1}</span>
                            <button
                                onClick={() => handleMoveOrder(popup.id, 'down')}
                                disabled={idx === sortedPopups.length - 1}
                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                            >
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>

                        {/* Image preview */}
                        <div className="w-20 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {popup.imageUrl ? (
                                <img src={popup.imageUrl} alt="popup" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Image className="w-6 h-6" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                    popup.isActive && isDateActive(popup)
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-200 text-slate-500"
                                )}>
                                    {popup.isActive && isDateActive(popup) ? '게시중' : popup.isActive ? '기간외' : '비활성'}
                                </span>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                    popup.clickAction === 'link' ? "bg-blue-100 text-blue-700"
                                        : popup.clickAction === 'page' ? "bg-purple-100 text-purple-700"
                                            : "bg-slate-100 text-slate-500"
                                )}>
                                    {popup.clickAction === 'link' ? '링크 이동' : popup.clickAction === 'page' ? '페이지 이동' : '동작 없음'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 font-medium truncate mb-1">
                                {popup.imageUrl || '(이미지 미설정)'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {popup.startDate} ~ {popup.endDate} · PC {popup.pcWidth}px · 모바일 {popup.mobileWidth}px
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => handleToggleActive(popup.id)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                title={popup.isActive ? '비활성화' : '활성화'}
                            >
                                {popup.isActive ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                            </button>
                            <button
                                onClick={() => handleEdit(popup)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                title="수정"
                            >
                                <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                                onClick={() => handleDelete(popup.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="삭제"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Form */}
                {showForm && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">
                                {editingId ? '팝업 수정' : '새 팝업 등록'}
                            </h3>
                            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 hover:bg-slate-200 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Image Upload */}
                        <ImageUploader
                            label="팝업 이미지 *"
                            currentImageUrl={form.imageUrl}
                            onUpload={(result) => setForm(f => ({ ...f, imageUrl: result.displayUrl }))}
                            onUrlChange={(url) => setForm(f => ({ ...f, imageUrl: url }))}
                            allowUrlInput={true}
                        />

                        {/* Click Action */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">클릭 동작</label>
                            <div className="flex gap-2">
                                {([
                                    { value: 'link', label: '링크 이동', color: 'bg-blue-500' },
                                    { value: 'page', label: '페이지 이동', color: 'bg-purple-500' },
                                    { value: 'none', label: '없음', color: 'bg-slate-400' },
                                ] as const).map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setForm(f => ({ ...f, clickAction: opt.value }))}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            form.clickAction === opt.value
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Link URL or Target Page */}
                        {form.clickAction === 'link' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">연결 링크 (Link URL)</label>
                                <input
                                    type="text"
                                    value={form.linkUrl}
                                    onChange={(e) => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                    placeholder="https://..."
                                />
                                <label className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={form.openInNewTab}
                                        onChange={(e) => setForm(f => ({ ...f, openInNewTab: e.target.checked }))}
                                        className="rounded border-slate-300"
                                    />
                                    새 창에서 열기
                                </label>
                            </div>
                        )}
                        {form.clickAction === 'page' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">이동할 페이지</label>
                                <select
                                    value={form.targetPage}
                                    onChange={(e) => setForm(f => ({ ...f, targetPage: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                >
                                    <option value="">선택하세요</option>
                                    <option value="/courses">수강 안내</option>
                                    <option value="/about">학원 소개</option>
                                    <option value="/contact">상담 신청</option>
                                    <option value="/community">커뮤니티</option>
                                    <option value="/calendar">일정</option>
                                    <option value="/shuttle">셔틀</option>
                                    <option value="/success">합격수기</option>
                                </select>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">게시 시작일</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">게시 종료일</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            </div>
                        </div>

                        {/* Size Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* PC Settings */}
                            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <Monitor className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-700">PC 화면 설정</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500 w-20">가로 크기 (px)</label>
                                        <input
                                            type="number"
                                            value={form.pcWidth}
                                            onChange={(e) => setForm(f => ({ ...f, pcWidth: Number(e.target.value) }))}
                                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500 w-20">상단 여백 (Top)</label>
                                        <input
                                            type="number"
                                            value={form.pcTop}
                                            onChange={(e) => setForm(f => ({ ...f, pcTop: Number(e.target.value) }))}
                                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500 w-20">좌측 여백 (Left)</label>
                                        <input
                                            type="number"
                                            value={form.pcLeft}
                                            onChange={(e) => setForm(f => ({ ...f, pcLeft: Number(e.target.value) }))}
                                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={form.pcCenterAlign}
                                            onChange={(e) => setForm(f => ({ ...f, pcCenterAlign: e.target.checked }))}
                                            className="rounded border-slate-300 text-indigo-600"
                                        />
                                        가로 중앙 정렬
                                    </label>
                                </div>
                            </div>

                            {/* Mobile Settings */}
                            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <Smartphone className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-700">모바일 화면 설정</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500 w-20">가로 크기 (px)</label>
                                        <input
                                            type="number"
                                            value={form.mobileWidth}
                                            onChange={(e) => setForm(f => ({ ...f, mobileWidth: Number(e.target.value) }))}
                                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500 w-20">상단 여백 (Top)</label>
                                        <input
                                            type="number"
                                            value={form.mobileTop}
                                            onChange={(e) => setForm(f => ({ ...f, mobileTop: Number(e.target.value) }))}
                                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={form.mobileCenterAlign}
                                            onChange={(e) => setForm(f => ({ ...f, mobileCenterAlign: e.target.checked }))}
                                            className="rounded border-slate-300 text-indigo-600"
                                        />
                                        가로 중앙 정렬 (권장)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Slide interval */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">슬라이드 간격 (초) — 팝업 2개 이상일 때</label>
                            <input
                                type="number"
                                value={form.slideInterval}
                                onChange={(e) => setForm(f => ({ ...f, slideInterval: Number(e.target.value) }))}
                                min={2}
                                max={30}
                                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        </div>

                        {/* Extra Options */}
                        <div>
                            <h4 className="text-xs font-medium text-slate-600 mb-2">추가 옵션</h4>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={form.showCloseToday}
                                        onChange={(e) => setForm(f => ({ ...f, showCloseToday: e.target.checked }))}
                                        className="rounded border-slate-300 text-indigo-600"
                                    />
                                    '오늘 하루 보지 않기' 버튼 표시
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={form.showOverlay}
                                        onChange={(e) => setForm(f => ({ ...f, showOverlay: e.target.checked }))}
                                        className="rounded border-slate-300 text-indigo-600"
                                    />
                                    배경 어둡게 하기 (Overlay)
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => { setShowForm(false); setEditingId(null); }}
                                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.imageUrl}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? '수정 저장' : '등록'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
