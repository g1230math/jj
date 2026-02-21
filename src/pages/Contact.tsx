import React from 'react';
import { MapPin, Phone, Clock, Bus, Car } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 text-white py-16 overflow-hidden wave-divider wave-divider-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-badge inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 mb-4 backdrop-blur-sm">
              LOCATION
            </span>
            <h1 className="text-hero text-white mb-4">오시는 길</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
              진접 G1230 수학전문학원으로 오시는 길을 안내해 드립니다
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Mock Map Area */}
            <div className="h-[400px] bg-slate-100 relative w-full">
              <img
                src="https://picsum.photos/seed/map/1200/800"
                alt="Map placeholder"
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">진접 G1230 수학전문학원</p>
                    <p className="text-sm text-slate-500">해밀예당1로 123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                학원 주소
              </h3>
              <p className="text-slate-700">경기도 남양주시 진접읍 해밀예당1로 123, 진접프라자 4층</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                연락처
              </h3>
              <p className="text-2xl font-bold text-indigo-600 mb-1">031-123-4567</p>
              <p className="text-sm text-slate-500">상담 가능 시간: 평일 14:00 - 22:00</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-indigo-600" />
                대중교통
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium shrink-0">일반</span>
                  <span>73, 92, 10, 11 (진접역 하차 후 도보 5분)</span>
                </li>
                <li className="flex gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-medium shrink-0">광역</span>
                  <span>M2352, 8012 (진접우체국 하차)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-indigo-600" />
                주차 안내
              </h3>
              <p className="text-sm text-slate-700">
                건물 지하 1~2층 주차장 이용 가능합니다.<br />
                (상담 방문 시 2시간 무료 주차권 지급)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
