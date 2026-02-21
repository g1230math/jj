import React, { useState } from 'react';
import { lectures } from '../data/mockData';
import { Play, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export function Lectures() {
  const [activeVideo, setActiveVideo] = useState(lectures[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">동영상 강의실</h1>
        <p className="text-slate-500 mt-1">로그인한 회원에게만 제공되는 프리미엄 강의입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video relative">
            {/* Mock YouTube Embed */}
            <iframe 
              className="w-full h-full absolute inset-0"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {activeVideo.category}
              </span>
              <span className="flex items-center text-sm text-slate-500">
                <Clock className="w-4 h-4 mr-1" />
                {activeVideo.date}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeVideo.title}</h2>
            <p className="text-slate-600">강사: {activeVideo.instructor}</p>
          </div>
        </div>

        {/* Playlist Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">내 강의 목록</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {lectures.map((lecture) => (
              <button
                key={lecture.id}
                onClick={() => setActiveVideo(lecture)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors",
                  activeVideo.id === lecture.id 
                    ? "bg-indigo-50 border border-indigo-100" 
                    : "hover:bg-slate-50 border border-transparent"
                )}
              >
                <div className="relative shrink-0">
                  <img src={lecture.thumbnail} alt={lecture.title} className="w-24 h-16 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white opacity-80" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm truncate mb-1">{lecture.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{lecture.instructor}</p>
                  {lecture.watched ? (
                    <span className="inline-flex items-center text-[10px] font-medium text-emerald-600">
                      <CheckCircle className="w-3 h-3 mr-1" /> 수강완료
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-medium text-slate-400">
                      미수강
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
