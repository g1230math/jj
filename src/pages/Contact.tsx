import React from 'react';
import { MapPin, Phone, Clock, Bus, Car } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
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
          {/* Left: Map + Address */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
              <div className="flex-1 min-h-[400px] bg-slate-100 relative w-full">
                <iframe
                  src="https://maps.google.com/maps?q=%EC%A0%9C%EC%9D%BC%ED%94%84%EB%9D%BC%EC%9E%90+%EB%82%A8%EC%96%91%EC%A3%BC%EC%8B%9C+%EC%A7%84%EC%A0%91%EC%9D%8D+%ED%95%B4%EB%B0%80%EC%98%88%EB%8B%B91%EB%A1%9C+171&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  className="absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="진접 G1230 수학전문학원 위치 - 제일프라자"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">경기도 남양주시 진접읍 해밀예당1로 171</p>
                    <p className="text-xs text-slate-500">제일프라자</p>
                  </div>
                </div>
                <a
                  href="https://map.naver.com/p/search/%EC%A0%9C%EC%9D%BC%ED%94%84%EB%9D%BC%EC%9E%90%20%EC%A7%84%EC%A0%91"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  네이버 지도로 보기
                </a>
              </div>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">연락처</h3>
              </div>
              <a href="tel:031-123-4567" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">031-123-4567</a>
              <p className="text-xs text-slate-500 mt-1">상담 가능 시간: 평일 14:00 - 22:00</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">운영 시간</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li className="flex justify-between"><span>평일 (월~금)</span><span className="font-medium">14:00 - 22:00</span></li>
                <li className="flex justify-between"><span>토요일</span><span className="font-medium">10:00 - 18:00</span></li>
                <li className="flex justify-between text-slate-400"><span>일요일 · 공휴일</span><span className="font-medium">휴원</span></li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">대중교통</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium shrink-0 text-xs">일반</span>
                  <span>73, 92, 10, 11 (진접역 하차 후 도보 5분)</span>
                </li>
                <li className="flex gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-medium shrink-0 text-xs">광역</span>
                  <span>M2352, 8012 (진접우체국 하차)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">주차 안내</h3>
              </div>
              <p className="text-sm text-slate-700">
                건물 지하 1~2층 주차장 이용 가능합니다.<br />
                <span className="text-indigo-600 font-medium">상담 방문 시 2시간 무료 주차권 지급</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
