import React, { useState } from 'react';
import { notices } from '../data/mockData';
import { Image as ImageIcon, FileText, MessageCircle, Info } from 'lucide-react';

export function Community() {
  const [activeTab, setActiveTab] = useState('notice');

  const tabs = [
    { id: 'notice', name: '공지사항', icon: Info },
    { id: 'gallery', name: '학원 갤러리', icon: ImageIcon },
    { id: 'resources', name: '자료실', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: MessageCircle },
  ];

  const galleryImages = [
    'https://picsum.photos/seed/gal1/600/400',
    'https://picsum.photos/seed/gal2/600/400',
    'https://picsum.photos/seed/gal3/600/400',
    'https://picsum.photos/seed/gal4/600/400',
    'https://picsum.photos/seed/gal5/600/400',
    'https://picsum.photos/seed/gal6/600/400',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">커뮤니티</h1>
        <p className="text-slate-500 mt-1">학원의 다양한 소식과 자료를 확인하세요.</p>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        {activeTab === 'notice' && (
          <div className="divide-y divide-slate-100">
            {notices.map((notice) => (
              <div key={notice.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 px-4 -mx-4 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  {notice.isNew && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-600 rounded-full">NEW</span>
                  )}
                  <span className="text-slate-700 group-hover:text-indigo-600 transition-colors font-medium">
                    {notice.title}
                  </span>
                </div>
                <span className="text-sm text-slate-400">{notice.date}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <div key={i} className="group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Gallery ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-slate-900">학원 시설 및 행사 {i + 1}</h3>
                  <p className="text-sm text-slate-500 mt-1">2025.02.20</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="text-center py-20 text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>등록된 학습 자료가 없습니다.</p>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="text-center py-20 text-slate-500">
            <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>자주 묻는 질문을 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
