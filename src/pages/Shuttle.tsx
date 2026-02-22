import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bus, Clock, MapPin, Navigation, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export interface ShuttleStop {
    name: string;
    time: string;
}

export interface ShuttleRoute {
    id: string;
    name: string;
    color: string;
    colorBg: string;
    colorText: string;
    driver: string;
    phone: string;
    departureTime: string;
    returnTime: string;
    stops: ShuttleStop[];
    returnStops: ShuttleStop[];
}


export const defaultRoutes: ShuttleRoute[] = [
    {
        id: '1',
        name: '1호차',
        color: 'from-blue-500 to-blue-600',
        colorBg: 'bg-blue-50',
        colorText: 'text-blue-700',
        driver: '김기사',
        phone: '010-1234-5678',
        departureTime: '14:30',
        returnTime: '22:10',
        stops: [
            { name: '진접역 2번 출구', time: '14:30' },
            { name: '해밀예당 아파트 정문', time: '14:35' },
            { name: '진접 뉴타운 106동 앞', time: '14:40' },
            { name: '부평리 마을회관', time: '14:45' },
            { name: '학원 도착', time: '14:55' },
        ],
        returnStops: [
            { name: '학원 출발', time: '22:10' },
            { name: '부평리 마을회관', time: '22:15' },
            { name: '진접 뉴타운 106동 앞', time: '22:20' },
            { name: '해밀예당 아파트 정문', time: '22:25' },
            { name: '진접역 2번 출구', time: '22:30' },
        ],
    },
    {
        id: '2',
        name: '2호차',
        color: 'from-emerald-500 to-emerald-600',
        colorBg: 'bg-emerald-50',
        colorText: 'text-emerald-700',
        driver: '이기사',
        phone: '010-2345-6789',
        departureTime: '16:30',
        returnTime: '22:10',
        stops: [
            { name: '오남읍사무소 앞', time: '16:30' },
            { name: '양지마을 입구', time: '16:35' },
            { name: '진건 이마트 앞', time: '16:42' },
            { name: '진접초등학교 후문', time: '16:48' },
            { name: '학원 도착', time: '16:55' },
        ],
        returnStops: [
            { name: '학원 출발', time: '22:10' },
            { name: '진접초등학교 후문', time: '22:15' },
            { name: '진건 이마트 앞', time: '22:20' },
            { name: '양지마을 입구', time: '22:27' },
            { name: '오남읍사무소 앞', time: '22:32' },
        ],
    },
    {
        id: '3',
        name: '3호차',
        color: 'from-amber-500 to-orange-600',
        colorBg: 'bg-amber-50',
        colorText: 'text-amber-700',
        driver: '박기사',
        phone: '010-3456-7890',
        departureTime: '17:30',
        returnTime: '22:10',
        stops: [
            { name: '장현지구 중앙공원', time: '17:30' },
            { name: '별내별가람역 3번 출구', time: '17:38' },
            { name: '퇴계원 중앙시장', time: '17:45' },
            { name: '진접중학교 정문', time: '17:52' },
            { name: '학원 도착', time: '17:58' },
        ],
        returnStops: [
            { name: '학원 출발', time: '22:10' },
            { name: '진접중학교 정문', time: '22:15' },
            { name: '퇴계원 중앙시장', time: '22:22' },
            { name: '별내별가람역 3번 출구', time: '22:30' },
            { name: '장현지구 중앙공원', time: '22:38' },
        ],
    },
];

export async function getShuttleRoutes(): Promise<ShuttleRoute[]> {
    if (!supabase) return defaultRoutes;
    try {
        const { data, error } = await supabase.from('site_data').select('value').eq('key', 'shuttle_routes').single();
        if (error || !data) return defaultRoutes;
        return data.value as ShuttleRoute[];
    } catch { return defaultRoutes; }
}

export async function saveShuttleRoutes(routes: ShuttleRoute[]) {
    if (!supabase) return;
    try {
        await supabase.from('site_data').upsert({ key: 'shuttle_routes', value: routes as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    } catch { /* silent */ }
}

export function Shuttle() {
    const [routes, setRoutes] = useState<ShuttleRoute[]>(defaultRoutes);
    const [openBus, setOpenBus] = useState<string>('1');
    const [direction, setDirection] = useState<'depart' | 'return'>('depart');

    useEffect(() => { getShuttleRoutes().then(setRoutes); }, []);

    useEffect(() => {
        const handleStorage = () => setRoutes(getShuttleRoutes());
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Bus className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">학원 차량 운행</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            안전하고 편리한 등·하원 차량 서비스를 운행합니다
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Direction Toggle */}
            <section className="py-6 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setDirection('depart')}
                            className={cn("px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                                direction === 'depart' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            🚌 등원 (학원 방향)
                        </button>
                        <button
                            onClick={() => setDirection('return')}
                            className={cn("px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                                direction === 'return' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            🏠 하원 (귀가 방향)
                        </button>
                    </div>
                </div>
            </section>

            {/* Bus Routes */}
            <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {routes.map(route => {
                            const isOpen = openBus === route.id;
                            const stops = direction === 'depart' ? route.stops : route.returnStops;
                            return (
                                <motion.div key={route.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    {/* Header */}
                                    <button
                                        onClick={() => setOpenBus(isOpen ? '' : route.id)}
                                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`bg-gradient-to-br ${route.color} w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>
                                                <Bus className="w-5 h-5 sm:w-7 sm:h-7" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-base sm:text-xl font-bold text-slate-900">{route.name}</h3>
                                                <p className="text-sm text-slate-500">
                                                    {direction === 'depart' ? `등원 ${route.departureTime} 출발` : `하원 ${route.returnTime} 출발`}
                                                    {' '}· 기사 {route.driver}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn("hidden sm:inline-block px-3 py-1 text-sm font-medium rounded-full", route.colorBg, route.colorText)}>
                                                {stops.length}개 정류장
                                            </span>
                                            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                        </div>
                                    </button>

                                    {/* Route Detail */}
                                    {isOpen && (
                                        <div className="px-6 pb-6 border-t border-slate-100">
                                            {/* Driver info */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                                                    <Navigation className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">{route.driver} 기사님</p>
                                                    <p className="text-sm text-slate-500">차량 문의</p>
                                                </div>
                                                <a href={`tel:${route.phone}`}
                                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Phone className="w-4 h-4" /> {route.phone}
                                                </a>
                                            </div>

                                            {/* Stops Timeline */}
                                            <div className="relative pl-8">
                                                <div className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-slate-200" />
                                                {stops.map((stop, i) => {
                                                    const isFirst = i === 0;
                                                    const isLast = i === stops.length - 1;
                                                    return (
                                                        <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                                                            {/* Dot */}
                                                            <div className={cn(
                                                                "absolute -left-8 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10",
                                                                isFirst || isLast
                                                                    ? `bg-gradient-to-br ${route.color} border-white text-white shadow-sm`
                                                                    : "bg-white border-slate-300 text-slate-500"
                                                            )}>
                                                                {isFirst ? <Bus className="w-3.5 h-3.5" /> : isLast ? <MapPin className="w-3.5 h-3.5" /> : <span className="w-2 h-2 bg-slate-400 rounded-full" />}
                                                            </div>
                                                            {/* Content */}
                                                            <div className="flex-1 flex items-center justify-between min-h-[28px]">
                                                                <div>
                                                                    <p className={cn("font-medium", isFirst || isLast ? "text-slate-900 text-base" : "text-slate-700 text-sm")}>
                                                                        {stop.name}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm font-mono">
                                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span className={cn(isFirst || isLast ? "font-bold text-indigo-600" : "text-slate-500")}>{stop.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Notice */}
                    <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
                        <p className="font-bold mb-2">📌 차량 운행 안내</p>
                        <ul className="space-y-1 list-disc list-inside text-amber-700">
                            <li>차량 운행 시간은 교통 상황에 따라 5~10분 차이가 날 수 있습니다.</li>
                            <li>정류장에서 출발 시간 5분 전까지 대기해주세요.</li>
                            <li>차량 탑승 변경 시 사전에 학원으로 연락 부탁드립니다.</li>
                            <li>안전벨트는 반드시 착용해주세요.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
