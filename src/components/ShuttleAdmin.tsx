import React, { useState, useEffect } from 'react';
import { Bus, Plus, Trash2, Save, ArrowUp, ArrowDown, RotateCcw, Clock, MapPin, GripVertical, X } from 'lucide-react';
import { ShuttleRoute, ShuttleStop, getShuttleRoutes, saveShuttleRoutes, defaultRoutes } from '../pages/Shuttle';

const vehicleColors = [
    { color: 'from-blue-500 to-blue-600', colorBg: 'bg-blue-50', colorText: 'text-blue-700' },
    { color: 'from-emerald-500 to-emerald-600', colorBg: 'bg-emerald-50', colorText: 'text-emerald-700' },
    { color: 'from-amber-500 to-orange-600', colorBg: 'bg-amber-50', colorText: 'text-amber-700' },
    { color: 'from-rose-500 to-pink-600', colorBg: 'bg-rose-50', colorText: 'text-rose-700' },
    { color: 'from-violet-500 to-purple-600', colorBg: 'bg-violet-50', colorText: 'text-violet-700' },
    { color: 'from-cyan-500 to-teal-600', colorBg: 'bg-cyan-50', colorText: 'text-cyan-700' },
];

export function ShuttleAdmin() {
    const [routes, setRoutes] = useState<ShuttleRoute[]>([]);
    const [activeRouteId, setActiveRouteId] = useState<string>('1');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getShuttleRoutes().then(r => {
            setRoutes(r);
            if (r.length > 0) setActiveRouteId(r[0].id);
        });
    }, []);

    const activeRoute = routes.find(r => r.id === activeRouteId);

    const handleSave = async () => {
        await saveShuttleRoutes(routes);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = async () => {
        if (confirm('기본 노선으로 초기화하시겠습니까? 변경 내용이 모두 사라집니다.')) {
            setRoutes(defaultRoutes);
            await saveShuttleRoutes(defaultRoutes);
        }
    };

    const updateRoute = (id: string, updates: Partial<ShuttleRoute>) => {
        setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addRoute = () => {
        const nextNum = routes.length + 1;
        const palette = vehicleColors[(nextNum - 1) % vehicleColors.length];
        const newRoute: ShuttleRoute = {
            id: `route_${Date.now()}`,
            name: `${nextNum}호차`,
            ...palette,
            driver: '',
            phone: '',
            departureTime: '14:30',
            returnTime: '22:10',
            stops: [{ name: '출발 정류장', time: '14:30' }, { name: '학원 도착', time: '15:00' }],
            returnStops: [{ name: '학원 출발', time: '22:10' }, { name: '도착 정류장', time: '22:30' }],
        };
        const updated = [...routes, newRoute];
        setRoutes(updated);
        setActiveRouteId(newRoute.id);
    };

    const removeRoute = (id: string) => {
        if (routes.length <= 1) { alert('최소 1대의 차량이 필요합니다.'); return; }
        const target = routes.find(r => r.id === id);
        if (!confirm(`"${target?.name ?? ''}" 차량을 삭제하시겠습니까?`)) return;
        const updated = routes.filter(r => r.id !== id);
        setRoutes(updated);
        if (activeRouteId === id) setActiveRouteId(updated[0]?.id || '');
    };

    const updateStop = (routeId: string, direction: 'stops' | 'returnStops', index: number, updates: Partial<ShuttleStop>) => {
        setRoutes(prev => prev.map(r => {
            if (r.id !== routeId) return r;
            const arr = [...r[direction]];
            arr[index] = { ...arr[index], ...updates };
            return { ...r, [direction]: arr };
        }));
    };

    const addStop = (routeId: string, direction: 'stops' | 'returnStops') => {
        setRoutes(prev => prev.map(r => {
            if (r.id !== routeId) return r;
            return { ...r, [direction]: [...r[direction], { name: '새 정류장', time: '00:00' }] };
        }));
    };

    const removeStop = (routeId: string, direction: 'stops' | 'returnStops', index: number) => {
        setRoutes(prev => prev.map(r => {
            if (r.id !== routeId) return r;
            return { ...r, [direction]: r[direction].filter((_, i) => i !== index) };
        }));
    };

    const moveStop = (routeId: string, direction: 'stops' | 'returnStops', index: number, dir: -1 | 1) => {
        setRoutes(prev => prev.map(r => {
            if (r.id !== routeId) return r;
            const arr = [...r[direction]];
            const target = index + dir;
            if (target < 0 || target >= arr.length) return r;
            [arr[index], arr[target]] = [arr[target], arr[index]];
            return { ...r, [direction]: arr };
        }));
    };

    if (!activeRoute) return null;

    const renderStops = (direction: 'stops' | 'returnStops', label: string) => (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    {label}
                </h4>
                <button onClick={() => addStop(activeRoute.id, direction)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> 추가
                </button>
            </div>
            <div className="space-y-2">
                {activeRoute[direction].map((stop, i) => (
                    <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 group">
                        <div className="flex sm:flex-col gap-0.5 shrink-0">
                            <button onClick={() => moveStop(activeRoute.id, direction, i, -1)} disabled={i === 0}
                                className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            ><ArrowUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => moveStop(activeRoute.id, direction, i, 1)} disabled={i === activeRoute[direction].length - 1}
                                className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            ><ArrowDown className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                        </span>
                        <input
                            type="text" value={stop.name}
                            onChange={e => updateStop(activeRoute.id, direction, i, { name: e.target.value })}
                            className="flex-1 min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="정류장 이름"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                            <input
                                type="time" value={stop.time}
                                onChange={e => updateStop(activeRoute.id, direction, i, { time: e.target.value })}
                                className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-mono w-[5.5rem] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <button onClick={() => removeStop(activeRoute.id, direction, i)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        ><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-indigo-600" /> 차량 운행 관리
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    ><RotateCcw className="w-4 h-4" /> 초기화</button>
                    <button onClick={handleSave}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    ><Save className="w-4 h-4" /> {saved ? '✓ 저장 완료!' : '저장하기'}</button>
                </div>
            </div>

            {/* Bus tabs */}
            <div className="flex flex-wrap gap-2 items-center">
                {routes.map(route => (
                    <div key={route.id} className="relative group">
                        <button onClick={() => setActiveRouteId(route.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeRouteId === route.id
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Bus className="w-4 h-4" /> {route.name}
                        </button>
                        {routes.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); removeRoute(route.id); }}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                title="차량 삭제"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addRoute}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border-2 border-dashed border-indigo-200"
                >
                    <Plus className="w-4 h-4" /> 차량 추가
                </button>
            </div>

            {/* Route Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
                <h4 className="font-bold text-slate-900 mb-4">기본 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">차량 이름</label>
                        <input type="text" value={activeRoute.name}
                            onChange={e => updateRoute(activeRoute.id, { name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">기사 이름</label>
                        <input type="text" value={activeRoute.driver}
                            onChange={e => updateRoute(activeRoute.id, { driver: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">기사 연락처</label>
                        <input type="tel" value={activeRoute.phone}
                            onChange={e => updateRoute(activeRoute.id, { phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">등원 출발시간</label>
                            <input type="time" value={activeRoute.departureTime}
                                onChange={e => updateRoute(activeRoute.id, { departureTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">하원 출발시간</label>
                            <input type="time" value={activeRoute.returnTime}
                                onChange={e => updateRoute(activeRoute.id, { returnTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {renderStops('stops', '등원 정류장 (학원 방향)')}
                {renderStops('returnStops', '하원 정류장 (귀가 방향)')}
            </div>
        </div>
    );
}
