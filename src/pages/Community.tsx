import React, { useState } from 'react';
import { notices } from '../data/mockData';
import { Image as ImageIcon, FileText, MessageCircle, Info, Download, ChevronDown, ChevronUp, Eye, Calendar, Tag, BookOpen, Clock, User, Lock, HelpCircle, CheckCircle2 } from 'lucide-react';
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

interface InquiryPost {
  id: number;
  title: string;
  author: string;
  date: string;
  isPrivate: boolean;
  category: string;
  content: string;
  answer?: string;
  answerDate?: string;
  views: number;
}

const inquiries: InquiryPost[] = [
  {
    id: 10, title: '여름 특강 일정이 궁금합니다', author: '김학부모', date: '2025.02.20',
    isPrivate: false, category: '수업 문의', views: 45,
    content: '안녕하세요. 중2 아이 학부모입니다. 여름방학 특강 일정과 커리큘럼이 궁금합니다. 언제부터 신청 가능한가요?',
    answer: '안녕하세요! 여름 특강은 6월 중순부터 접수를 시작하며, 7월 21일~8월 16일(4주) 과정으로 운영됩니다. 개념 정리 + 문제풀이 병행으로 진행되며, 자세한 커리큘럼은 6월 초에 공지사항으로 안내드리겠습니다.',
    answerDate: '2025.02.20',
  },
  {
    id: 9, title: '수학 진단 테스트 결과 문의', author: '이○○맘', date: '2025.02.18',
    isPrivate: true, category: '상담 문의', views: 12,
    content: '지난주 진단 테스트 받았는데 결과가 언제 나오나요? 그리고 결과에 따라 반 배치가 달라지나요?',
    answer: '안녕하세요. 진단 테스트 결과는 보통 2~3일 내에 나옵니다. 결과에 따라 기본반/심화반으로 배치가 달라지며, 상담 시 자세히 안내드립니다. 개별 연락 드리겠습니다.',
    answerDate: '2025.02.19',
  },
  {
    id: 8, title: '주차장 이용 관련 문의드립니다', author: '박학부모', date: '2025.02.17',
    isPrivate: false, category: '시설 문의', views: 38,
    content: '상담 방문 시 주차가 가능한가요? 주변에 주차할 곳이 있는지 궁금합니다.',
    answer: '건물 지하 주차장에 학부모님 전용 주차 공간이 있습니다. 상담 시 30분 무료 주차가 가능하며, 위치는 오시는길 페이지를 참고해 주세요!',
    answerDate: '2025.02.17',
  },
  {
    id: 7, title: '수강료 납부 방법 문의', author: '정○○', date: '2025.02.15',
    isPrivate: true, category: '수강 문의', views: 8,
    content: '수강료 카드 결제나 자동이체가 가능한가요? 납부일은 언제인지도 알려주세요.',
    answer: '카드결제, 계좌이체, 자동이체 모두 가능합니다. 수강료는 매월 25일 전후로 납부하시면 됩니다. 자세한 내용은 원무실(031-123-4567)로 문의해 주세요.',
    answerDate: '2025.02.16',
  },
  {
    id: 6, title: '초등 3학년도 입학 가능한가요?', author: '최맘', date: '2025.02.14',
    isPrivate: false, category: '입학 문의', views: 67,
    content: '초등 3학년 아이인데 수학 학원을 처음 보내려 합니다. 입학이 바로 가능한지, 진단 테스트를 따로 봐야 하는지 궁금합니다.',
    answer: '네, 초3부터 수강 가능합니다! 입학 전 간단한 진단 테스트(약 30분)를 통해 현재 수준을 파악한 후, 적합한 반에 배치됩니다. 전화나 방문 상담으로 예약해 주세요.',
    answerDate: '2025.02.14',
  },
  {
    id: 5, title: '아이 성적 관련 상담 요청합니다', author: '한○○', date: '2025.02.12',
    isPrivate: true, category: '상담 문의', views: 5,
    content: '최근 시험에서 성적이 많이 떨어졌습니다. 담당 선생님과 개별 상담이 가능할까요?',
    answer: '물론입니다. 담당 선생님께 전달하여 상담 일정을 잡아드리겠습니다. 내일 중으로 개별 연락 드리겠습니다.',
    answerDate: '2025.02.13',
  },
  {
    id: 4, title: '셔틀버스 노선 변경 요청', author: '윤학부모', date: '2025.02.10',
    isPrivate: false, category: '차량 문의', views: 52,
    content: '현재 3호차를 이용 중인데, 이사를 하게 되어 노선 변경이 가능한지 문의드립니다. 새 주소는 별내동입니다.',
    answer: '별내동은 현재 2호차 노선에 포함되어 있습니다. 차량 담당자에게 전달하여 다음 달부터 변경 가능하도록 안내드리겠습니다. 상세 정류장은 차량운행 페이지를 참고해 주세요.',
    answerDate: '2025.02.11',
  },
  {
    id: 3, title: '보충 수업 가능 여부', author: '강○○맘', date: '2025.02.08',
    isPrivate: false, category: '수업 문의', views: 41,
    content: '아이가 아파서 2일 빠졌는데, 빠진 수업에 대한 보충이 가능한가요?',
    answer: '네, 결석 시 보충 수업을 무료로 제공합니다. 담당 선생님과 일정을 조율하여 빠른 시일 내에 보충을 진행합니다. 수업 관련 자료도 별도로 전달해 드립니다.',
    answerDate: '2025.02.09',
  },
  {
    id: 2, title: '중3 고등 선행 수업 문의', author: '신학부모', date: '2025.02.05',
    isPrivate: false, category: '수업 문의', views: 78,
    content: '중3 아이가 고등 수학 선행을 시작하려 합니다. 현재 개설된 선행반 시간표와 난이도가 궁금합니다.',
    answer: '고등 선행반은 월/수/금 19:00~21:00에 운영되며, 고1 수학(상) 과정부터 시작합니다. 현재 정원 8명 중 6명이 등록된 상태이니 서둘러 주세요! 수강안내 페이지에서 자세한 내용을 확인하실 수 있습니다.',
    answerDate: '2025.02.06',
  },
  {
    id: 1, title: '형제 할인이 있나요?', author: '송○○', date: '2025.02.03',
    isPrivate: true, category: '수강 문의', views: 15,
    content: '두 아이를 함께 보내려고 하는데, 형제 할인 혜택이 있는지 궁금합니다.',
    answer: '네! 형제·자매가 동시에 등록하실 경우, 둘째 자녀부터 수강료 10% 할인이 적용됩니다. 원무실로 문의 주시면 자세히 안내드리겠습니다.',
    answerDate: '2025.02.04',
  },
];

export function Community() {
  const [activeTab, setActiveTab] = useState('notice');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openBlog, setOpenBlog] = useState<number | null>(null);
  const [openInquiry, setOpenInquiry] = useState<number | null>(null);

  const tabs = [
    { id: 'notice', name: '공지사항', icon: Info },
    { id: 'blog', name: '블로그', icon: BookOpen },
    { id: 'gallery', name: '학원 갤러리', icon: ImageIcon },
    { id: 'resources', name: '자료실', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: MessageCircle },
    { id: 'inquiry', name: '문의게시판', icon: HelpCircle },
  ];

  const blogPosts = [
    {
      id: 1,
      title: '수학 성적을 올리는 5가지 학습 습관',
      excerpt: '수학 성적 향상을 원한다면 단순히 문제를 많이 푸는 것만으로는 부족합니다. 효과적인 학습 습관을 먼저 다져야 합니다.',
      content: `## 1. 오답노트를 활용하세요\n\n틀린 문제를 그냥 넘기지 말고, 반드시 오답노트에 정리하세요. 왜 틀렸는지, 어떤 개념이 부족했는지를 기록하면 같은 실수를 반복하지 않게 됩니다.\n\n## 2. 개념 이해를 우선으로\n\n공식을 외우기 전에 ‘왜 이 공식이 나오는지’를 이해하세요. 개념을 이해하면 응용 문제에서도 유연하게 대응할 수 있습니다.\n\n## 3. 매일 조금씩 꾸준히\n\n주말에 몰아서 하는 것보다 매일 30분~1시간씩 꾸준히 하는 것이 훨씬 효과적입니다. 수학은 누적 학습이 핵심입니다.\n\n## 4. 시간을 정해서 풀기\n\n시험에서는 시간 관리가 중요합니다. 평소에도 타이머를 맞춰놓고 문제를 푸는 연습을 하세요.\n\n## 5. 질문을 두려워하지 마세요\n\n모르는 것이 당연합니다. 수업 중 이해가 안 되는 부분은 바로 질문하세요. 담당 선생님이 친절하게 설명해 드립니다.`,
      author: '김원장',
      date: '2025.02.20',
      readTime: '5분',
      tags: ['학습법', '수학공부', '성적향상'],
      image: 'https://picsum.photos/seed/blog1/800/400',
    },
    {
      id: 2,
      title: '학부모가 알아야 할 중학 수학 → 고등 수학 연계 학습 전략',
      excerpt: '중학교에서 고등학교로 올라가면 수학 난이도가 확 높아집니다. 미리 준비하지 않으면 성적 하락을 경험할 수 있습니다.',
      content: `## 중학 수학과 고등 수학의 차이\n\n중학 수학은 개념 이해와 기본 연산이 중심이지만, 고등 수학은 추상적 사고와 논리적 추론이 핵심입니다.\n\n## 중3 겨울방학 활용법\n\n- **인수분해** 완벽 마스터: 고등 수학의 기초\n- **함수 개념** 깊이 이해: 일차함수 → 이차함수 → 여러 가지 함수\n- **방정식** 심화 학습: 복잡한 방정식 풀이 능력 키우기\n\n## 고등 1학년 첫 시험 대비\n\n고등학교 첫 중간고사는 중학교와 난이도 차이가 큭니다. 여유를 가지고 선행학습을 해두면 자신감을 얻을 수 있습니다.\n\n## 부모님의 역할\n\n자녀에게 “공부해라”고 다그치기보다는, 학습 환경을 만들어 주세요. 규칙적인 시간, 적절한 휴식, 그리고 격려가 중요합니다.`,
      author: '박미적',
      date: '2025.02.15',
      readTime: '7분',
      tags: ['중고연계', '학부모', '선행학습'],
      image: 'https://picsum.photos/seed/blog2/800/400',
    },
    {
      id: 3,
      title: '수학 자신감을 키우는 방법: 수포자에서 수학 우등생으로',
      excerpt: '"나는 수학을 못해"라고 생각하는 학생들이 많습니다. 하지만 올바른 방법으로 접근하면 누구나 수학을 잘할 수 있습니다.',
      content: `## 수포자가 되는 이유\n\n대부분의 수포자는 특정 단원에서 개념이 끊기면서 시작됩니다. 초등학교 분수, 중학교 방정식, 고등학교 함수 등 핵심 단계를 놓치면 그 다음 내용을 이해할 수 없게 됩니다.\n\n## 해결 방법\n\n### 1단계: 끊어진 고리 찾기\n정확히 어떤 단원에서 모르게 됐는지 진단합니다. 우리 학원에서는 입학 시 진단테스트를 통해 정확한 취약점을 파악합니다.\n\n### 2단계: 기초부터 탄탄히\n한 학년 뒤로 돌아가더라도 기초를 다지는 것이 줄요합니다. 단기적으로는 느리지만 장기적으로 큰 효과를 얻습니다.\n\n### 3단계: 성장 경험\n작은 성공을 쌓아가면 자신감이 생깁니다. 쉬운 문제부터 완벽히 맞히고, 점점 난이도를 높여가면 “나도 할 수 있다”는 느낌을 받게 됩니다.\n\n## 실제 사례\n\n진접 G1230에서 수학 30점대였던 학생이 6개월 만에 80점대로 성적이 올랐습니다. 기초 진단 → 취약 단원 보강 → 현행 수업 병행의 3단계 프로그램으로 달성한 결과입니다.`,
      author: '이함수',
      date: '2025.02.10',
      readTime: '6분',
      tags: ['수포자', '자신감', '성적향상', '사례'],
      image: 'https://picsum.photos/seed/blog3/800/400',
    },
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
      <section className="relative bg-gradient-to-br from-violet-800 via-purple-800 to-indigo-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
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

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 min-h-[400px]">
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

          {activeTab === 'blog' && (
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="group rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="aspect-[21/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} 읽기
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setOpenBlog(openBlog === post.id ? null : post.id)}
                        className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                      >
                        {openBlog === post.id ? '접기' : '자세히 보기'}
                        {openBlog === post.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    {openBlog === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-slate-100"
                      >
                        <div className="prose prose-sm prose-slate max-w-none">
                          {post.content.split('\n\n').map((paragraph, i) => {
                            if (paragraph.startsWith('## ')) {
                              return <h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                            }
                            if (paragraph.startsWith('### ')) {
                              return <h4 key={i} className="text-base font-semibold text-slate-800 mt-4 mb-2">{paragraph.replace('### ', '')}</h4>;
                            }
                            if (paragraph.startsWith('- ')) {
                              return (
                                <ul key={i} className="list-disc list-inside space-y-1 text-sm text-slate-600 my-2">
                                  {paragraph.split('\n').map((line, j) => (
                                    <li key={j}>{line.replace('- ', '')}</li>
                                  ))}
                                </ul>
                              );
                            }
                            return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{paragraph}</p>;
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ── 문의게시판 ── */}
          {activeTab === 'inquiry' && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm text-slate-500">총 <span className="font-semibold text-slate-700">{inquiries.length}</span>개의 문의</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>비밀글은 작성자만 확인할 수 있습니다</span>
                </div>
              </div>

              {/* Table header (desktop) */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-500 mb-2">
                <div className="col-span-1 text-center">번호</div>
                <div className="col-span-2">분류</div>
                <div className="col-span-5">제목</div>
                <div className="col-span-1">작성자</div>
                <div className="col-span-2">날짜</div>
                <div className="col-span-1 text-center">상태</div>
              </div>

              <div className="divide-y divide-slate-100">
                {inquiries.map((post) => {
                  const isOpen = openInquiry === post.id;
                  return (
                    <div key={post.id}>
                      <button
                        onClick={() => setOpenInquiry(isOpen ? null : post.id)}
                        className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors group"
                      >
                        {/* Desktop row */}
                        <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-1 text-center text-sm text-slate-400">{post.id}</div>
                          <div className="col-span-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{post.category}</span>
                          </div>
                          <div className="col-span-5 flex items-center gap-2">
                            {post.isPrivate && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className={cn("text-sm font-medium truncate", post.isPrivate ? "text-slate-500" : "text-slate-900 group-hover:text-indigo-600")}>
                              {post.isPrivate ? '비밀글입니다' : post.title}
                            </span>
                          </div>
                          <div className="col-span-1 text-xs text-slate-500 truncate">{post.author}</div>
                          <div className="col-span-2 text-xs text-slate-400">{post.date}</div>
                          <div className="col-span-1 text-center">
                            {post.answer ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />답변완료
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">대기중</span>
                            )}
                          </div>
                        </div>

                        {/* Mobile row */}
                        <div className="sm:hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{post.category}</span>
                            {post.isPrivate && <Lock className="w-3 h-3 text-amber-500" />}
                            {post.answer ? (
                              <span className="text-[10px] font-bold text-emerald-600">답변완료</span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600">대기중</span>
                            )}
                          </div>
                          <p className={cn("text-sm font-medium", post.isPrivate ? "text-slate-500" : "text-slate-900")}>
                            {post.isPrivate ? '비밀글입니다' : post.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{post.author} · {post.date}</p>
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isOpen && !post.isPrivate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-4 pb-4"
                        >
                          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                            {/* Question */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-semibold text-slate-700">문의 내용</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed pl-6">{post.content}</p>
                            </div>
                            {/* Answer */}
                            {post.answer && (
                              <div className="border-t border-slate-200 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-semibold text-emerald-700">학원 답변</span>
                                  <span className="text-xs text-slate-400">{post.answerDate}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed pl-6">{post.answer}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Private post message */}
                      {isOpen && post.isPrivate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-4 pb-4"
                        >
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">비밀글입니다</p>
                              <p className="text-xs text-amber-600">작성자 본인만 내용을 확인할 수 있습니다.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
