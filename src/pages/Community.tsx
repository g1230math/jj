import React, { useState } from 'react';
import { notices } from '../data/mockData';
import { Image as ImageIcon, FileText, MessageCircle, Info, Download, ChevronDown, ChevronUp, Eye, Calendar, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const resources = [
  {
    category: '학습자료',
    color: 'bg-indigo-100 text-indigo-700',
    items: [
      { id: 1, title: '[중3] 이차방정식 핵심 정리 노트', date: '2025.02.18', downloads: 156, type: 'PDF', size: '2.4MB' },
      { id: 2, title: '[중2] 일차함수 그래프 연습문제 50선', date: '2025.02.15', downloads: 203, type: 'PDF', size: '3.1MB' },
      { id: 3, title: '[고1] 다항식과 인수분해 개념 총정리', date: '2025.02.12', downloads: 189, type: 'PDF', size: '4.7MB' },
      { id: 4, title: '[중1] 정수와 유리수 기초 다지기', date: '2025.02.10', downloads: 134, type: 'PDF', size: '1.8MB' },
      { id: 5, title: '[고2] 수열 공식 모음집', date: '2025.02.08', downloads: 97, type: 'PDF', size: '2.2MB' },
    ],
  },
  {
    category: '시험 대비',
    color: 'bg-rose-100 text-rose-700',
    items: [
      { id: 6, title: '[중3] 2025 1학기 중간고사 대비 모의고사 (1회)', date: '2025.02.20', downloads: 312, type: 'PDF', size: '5.6MB' },
      { id: 7, title: '[중2] 2025 1학기 중간고사 대비 모의고사 (1회)', date: '2025.02.19', downloads: 287, type: 'PDF', size: '5.2MB' },
      { id: 8, title: '[고1] 3월 모의고사 기출문제 해설 (2024)', date: '2025.02.14', downloads: 245, type: 'PDF', size: '8.3MB' },
      { id: 9, title: '[중3] 2024 2학기 기말고사 기출 해설', date: '2025.01.28', downloads: 178, type: 'PDF', size: '6.1MB' },
    ],
  },
  {
    category: '학부모 자료',
    color: 'bg-emerald-100 text-emerald-700',
    items: [
      { id: 10, title: '2025학년도 교육 과정 안내서', date: '2025.02.01', downloads: 89, type: 'PDF', size: '3.5MB' },
      { id: 11, title: '중등 수학 학습 로드맵 가이드', date: '2025.01.20', downloads: 156, type: 'PDF', size: '2.8MB' },
      { id: 12, title: '고등 내신·수능 대비 전략 안내', date: '2025.01.15', downloads: 124, type: 'PDF', size: '4.1MB' },
    ],
  },
];

const faqs = [
  {
    category: '입학 상담',
    questions: [
      {
        q: '입학 상담은 어떻게 받을 수 있나요?',
        a: '전화(031-123-4567)로 상담 예약 후 방문해 주시면 됩니다. 학생의 현재 학습 수준을 파악하기 위한 진단 테스트(약 40분)를 진행한 뒤, 맞춤 반 배정과 학습 계획을 안내해 드립니다. 온라인 상담도 가능하니 편한 방법을 선택해 주세요.',
      },
      {
        q: '중간에 반 변경이 가능한가요?',
        a: '네, 가능합니다. 매월 정기 테스트 결과와 학생의 학습 진도를 종합적으로 판단하여 적절한 반으로 이동할 수 있습니다. 담당 선생님과 상의하시면 원활하게 진행됩니다.',
      },
      {
        q: '무료 체험 수업이 가능한가요?',
        a: '네, 첫 방문 시 1회 무료 체험 수업을 제공합니다. 체험 수업을 통해 학원의 수업 방식과 분위기를 직접 경험해 보실 수 있습니다. 전화 또는 홈페이지를 통해 사전 예약해 주세요.',
      },
    ],
  },
  {
    category: '수업 및 커리큘럼',
    questions: [
      {
        q: '수업 시간과 요일은 어떻게 되나요?',
        a: '학년과 반에 따라 다양한 시간대가 있습니다. 중등부는 주 3회(월·수·금 또는 화·목·토), 고등부는 주 4~5회 수업을 기본으로 합니다. 수강안내 페이지에서 상세 시간표를 확인하실 수 있습니다.',
      },
      {
        q: '온라인 수업도 병행하나요?',
        a: '네, 동영상 강의실을 통해 수업 복습용 영상과 보충 강의를 제공합니다. 또한 보강이 필요한 경우 Zoom을 활용한 실시간 온라인 수업도 진행하고 있습니다.',
      },
      {
        q: '숙제와 과제 관리는 어떻게 하나요?',
        a: '매 수업 후 개별 맞춤 숙제가 부여됩니다. 숙제 완료 여부와 오답 관리는 담당 선생님이 매일 확인하며, 미완료 시 학부모님께 알림이 전송됩니다. 학부모 서비스 페이지에서도 확인 가능합니다.',
      },
    ],
  },
  {
    category: '수강료 및 결제',
    questions: [
      {
        q: '수강료는 얼마인가요?',
        a: '학년과 수강 시간에 따라 상이합니다. 중등 기본반은 월 25만원~35만원, 고등반은 월 30만원~45만원 수준입니다. 정확한 수강료는 수강안내 페이지를 참고하시거나 전화 상담 시 안내해 드립니다.',
      },
      {
        q: '수강료 납부 방법은 어떤 게 있나요?',
        a: '자동이체(CMS), 카드 결제, 계좌이체를 지원합니다. 매월 1일~10일 사이에 납부해 주시면 되며, 자동이체 신청 시 매월 5일에 자동으로 출금됩니다.',
      },
      {
        q: '환불 규정은 어떻게 되나요?',
        a: '학원법에 따라 수업 잔여 기간에 대한 환불이 진행됩니다. 수업 시작 전 전액 환불, 수업 시작 후에는 잔여 수업 일수에 따라 일할 계산하여 환불합니다. 자세한 사항은 학원으로 문의해 주세요.',
      },
    ],
  },
  {
    category: '차량 및 편의',
    questions: [
      {
        q: '학원 차량 운행을 이용하려면 어떻게 하나요?',
        a: '학원 등록 시 차량 이용 신청을 하시면 됩니다. 현재 3개 노선(1호차, 2호차, 3호차)을 운행 중이며, 정류장 및 시간표는 차량운행 페이지에서 확인하실 수 있습니다. 탑승 변경 시 하루 전까지 학원에 연락해 주세요.',
      },
      {
        q: '자습실 이용이 가능한가요?',
        a: '네, 재원생은 평일 14:00~22:00까지 자습실을 무료로 이용할 수 있습니다. 쾌적한 학습 환경과 질문 가능한 보조 선생님이 상주하고 있어 효율적인 자기주도학습이 가능합니다.',
      },
      {
        q: '학원 주변에 주차가 가능한가요?',
        a: '학원 건물 지하 주차장에 학부모님 전용 주차 공간이 마련되어 있습니다. 상담 및 방문 시 30분 무료 주차가 가능하며, 자세한 위치는 오시는길 페이지를 참고해 주세요.',
      },
    ],
  },
];

export function Community() {
  const [activeTab, setActiveTab] = useState('notice');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

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
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-800 via-purple-800 to-indigo-900 text-white py-16 overflow-hidden wave-divider wave-divider-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-badge inline-block px-4 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 mb-4 backdrop-blur-sm">
              COMMUNITY
            </span>
            <h1 className="text-hero text-white mb-4">커뮤니티</h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto font-light">
              학원의 다양한 소식과 자료를 확인하세요
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
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
            <div className="space-y-8">
              {resources.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("px-3 py-1 text-xs font-bold rounded-full", group.color)}>{group.category}</span>
                    <span className="text-sm text-slate-400">{group.items.length}개 자료</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/item cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 text-sm group-hover/item:text-indigo-700 transition-colors truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.downloads}회 다운로드</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.type} · {item.size}</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors opacity-0 group-hover/item:opacity-100 shrink-0">
                          <Download className="w-3.5 h-3.5" /> 다운로드
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-8">
              {faqs.map((group) => (
                <div key={group.category}>
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {group.category}
                  </h3>
                  <div className="space-y-2">
                    {group.questions.map((faq, i) => {
                      const key = `${group.category}-${i}`;
                      const isOpen = openFaq === key;
                      return (
                        <div key={key} className={cn(
                          "rounded-xl border transition-all",
                          isOpen ? "border-indigo-200 bg-indigo-50/30 shadow-sm" : "border-slate-100 hover:border-slate-200"
                        )}>
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : key)}
                            className="w-full flex items-center justify-between p-4 text-left"
                          >
                            <span className={cn("font-medium text-sm pr-4", isOpen ? "text-indigo-700" : "text-slate-800")}>
                              Q. {faq.q}
                            </span>
                            {isOpen
                              ? <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0" />
                              : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                            }
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4">
                              <div className="pl-4 border-l-2 border-indigo-300">
                                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
