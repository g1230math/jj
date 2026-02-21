import React, { useState, useMemo } from 'react';
import { getLectures, getProgress, saveProgress, getAllProgress, type Lecture, type LectureProgress } from '../data/mockData';
import { Play, CheckCircle, Clock, Search, Filter, BookOpen, ChevronDown, ChevronUp, Star, StarOff, ArrowRight, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type GradeFilter = '전체' | '초등' | '중등' | '고등';
type SortOption = 'latest' | 'unwatched' | 'bookmarked';

export function Lectures() {
  const allLectures = getLectures().filter(l => l.isPublished);
  const [activeVideo, setActiveVideo] = useState<Lecture | null>(null);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, LectureProgress>>(getAllProgress());

  // Filter and sort lectures
  const filteredLectures = useMemo(() => {
    let result = allLectures;

    // Grade filter
    if (gradeFilter !== '전체') {
      result = result.filter(l => l.grade === gradeFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.instructor.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q)) ||
        l.subject.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'unwatched') {
        const pa = progressMap[a.id]?.status === 'completed' ? 1 : 0;
        const pb = progressMap[b.id]?.status === 'completed' ? 1 : 0;
        return pa - pb;
      }
      if (sortBy === 'bookmarked') {
        const ba = progressMap[a.id]?.bookmarked ? 0 : 1;
        const bb = progressMap[b.id]?.bookmarked ? 0 : 1;
        return ba - bb;
      }
      return 0;
    });

    return result;
  }, [allLectures, gradeFilter, searchQuery, sortBy, progressMap]);

  // Stats
  const totalLectures = allLectures.length;
  const progressValues = Object.values(progressMap) as LectureProgress[];
  const completedCount = progressValues.filter(p => p.status === 'completed').length;
  const inProgressCount = progressValues.filter(p => p.status === 'in_progress').length;
  const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  // Find last watched lecture
  const lastWatched = useMemo(() => {
    const entries = (Object.values(progressMap) as LectureProgress[]).filter(p => p.lastWatched && p.status !== 'completed');
    if (entries.length === 0) return null;
    entries.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
    return allLectures.find(l => l.id === entries[0].lectureId);
  }, [progressMap, allLectures]);

  const handleSelectLecture = (lecture: Lecture) => {
    setActiveVideo(lecture);
    setExpandedInfo(false);
    saveProgress(lecture.id, {
      status: progressMap[lecture.id]?.status === 'completed' ? 'completed' : 'in_progress',
      lastWatched: new Date().toISOString(),
      progress: progressMap[lecture.id]?.progress || 10,
    });
    setProgressMap(getAllProgress());
  };

  const handleMarkComplete = (lectureId: string) => {
    saveProgress(lectureId, { status: 'completed', progress: 100 });
    setProgressMap(getAllProgress());
  };

  const handleToggleBookmark = (lectureId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = progressMap[lectureId]?.bookmarked || false;
    saveProgress(lectureId, { bookmarked: !current });
    setProgressMap(getAllProgress());
  };

  const getStatusBadge = (lectureId: string) => {
    const p = progressMap[lectureId];
    if (!p || p.status === 'not_started') {
      return <span className="inline-flex items-center text-[10px] font-medium text-slate-400">미수강</span>;
    }
    if (p.status === 'in_progress') {
      return (
        <span className="inline-flex items-center text-[10px] font-medium text-amber-600">
          <Clock className="w-3 h-3 mr-1" />수강중 {p.progress}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-medium text-emerald-600">
        <CheckCircle className="w-3 h-3 mr-1" />수강완료
      </span>
    );
  };

  const getProgressBar = (lectureId: string) => {
    const p = progressMap[lectureId];
    const pct = p?.progress || 0;
    return (
      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct >= 100 ? "bg-emerald-500" : pct > 0 ? "bg-amber-400" : "bg-transparent"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  };

  const gradeColors: Record<string, string> = {
    '초등': 'bg-emerald-100 text-emerald-700',
    '중등': 'bg-blue-100 text-blue-700',
    '고등': 'bg-indigo-100 text-indigo-700',
  };

  const renderDifficulty = (level: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn(
            "w-3 h-3",
            i <= level ? "text-amber-400 fill-amber-400" : "text-slate-200"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-800 via-blue-800 to-blue-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-badge inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 mb-4 backdrop-blur-sm">
              LECTURES
            </span>
            <h1 className="text-hero text-white mb-4">동영상 강의실</h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto font-light">
              로그인한 회원에게만 제공되는 프리미엄 강의입니다
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span className="font-bold">나의 학습 현황</span>
              </div>
              <span className="text-2xl font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-sm text-indigo-100">
              <span>완료 {completedCount}강</span>
              <span>수강중 {inProgressCount}강</span>
              <span>전체 {totalLectures}강</span>
            </div>
          </div>
          {lastWatched ? (
            <div
              className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelectLecture(lastWatched)}
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Clock className="w-4 h-4" />
                최근 수강
              </div>
              <h3 className="font-bold text-slate-900 truncate">{lastWatched.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{lastWatched.instructor} · {lastWatched.subject}</p>
              <div className="flex items-center gap-2 mt-3">
                {getProgressBar(lastWatched.id)}
                <span className="text-xs text-indigo-600 font-semibold flex items-center whitespace-nowrap">
                  이어보기 <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ) : (
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-center text-slate-400">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="text-sm">아직 수강 기록이 없습니다. 강의를 시작해보세요!</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {(['전체', '초등', '중등', '고등'] as GradeFilter[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  gradeFilter === grade
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {grade === '전체' ? '전체' : `${grade}부`}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="강의명, 강사명, 키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          >
            <option value="latest">최신순</option>
            <option value="unwatched">미수강 우선</option>
            <option value="bookmarked">즐겨찾기</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Area */}
          <div className="lg:col-span-2 space-y-4">
            {activeVideo ? (
              <>
                <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video relative">
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={cn("px-2.5 py-0.5 text-xs font-bold rounded-full", gradeColors[activeVideo.grade])}>
                      {activeVideo.grade}부
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {activeVideo.subject}
                    </span>
                    <span className="flex items-center text-xs text-slate-400 ml-auto">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {activeVideo.duration} · {activeVideo.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{activeVideo.title}</h2>
                  <p className="text-sm text-slate-500">강사: {activeVideo.instructor}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">난이도</span>
                    {renderDifficulty(activeVideo.level)}
                  </div>

                  <button
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="flex items-center gap-1 text-xs text-indigo-600 mt-3 hover:text-indigo-700"
                  >
                    강의 상세 정보 {expandedInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <AnimatePresence>
                    {expandedInfo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-sm text-slate-600 leading-relaxed">{activeVideo.description}</p>
                          {activeVideo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {activeVideo.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 rounded-md">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                    {progressMap[activeVideo.id]?.status !== 'completed' ? (
                      <button
                        onClick={() => handleMarkComplete(activeVideo.id)}
                        className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1.5" />
                        수강 완료 표시
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
                        <CheckCircle className="w-4 h-4 inline mr-1.5" />
                        수강 완료됨
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleBookmark(activeVideo.id, e)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      {progressMap[activeVideo.id]?.bookmarked ? (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-100 rounded-2xl aspect-video flex flex-col items-center justify-center text-slate-400">
                <Play className="w-16 h-16 mb-4 opacity-40" />
                <p className="text-lg font-medium"><span className="lg:hidden">아래</span><span className="hidden lg:inline">오른쪽</span> 목록에서 강의를 선택하세요</p>
                <p className="text-sm mt-1">총 {filteredLectures.length}개의 강의가 준비되어 있습니다</p>
              </div>
            )}
          </div>

          {/* Playlist Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">강의 목록</h3>
              <span className="text-xs text-slate-400">{filteredLectures.length}개</span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
              {filteredLectures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Search className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">검색 결과가 없습니다</p>
                </div>
              ) : (
                filteredLectures.map((lecture) => (
                  <button
                    key={lecture.id}
                    onClick={() => handleSelectLecture(lecture)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                      activeVideo?.id === lecture.id
                        ? "bg-indigo-50 border border-indigo-200 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    <div className="relative shrink-0">
                      <img src={lecture.thumbnail} alt={lecture.title} className="w-24 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        {progressMap[lecture.id]?.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Play className="w-5 h-5 text-white opacity-80" />
                        )}
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                        {lecture.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-medium text-slate-900 text-sm leading-tight line-clamp-2">{lecture.title}</h4>
                        <button
                          onClick={(e) => handleToggleBookmark(lecture.id, e)}
                          className="shrink-0 mt-0.5"
                        >
                          {progressMap[lecture.id]?.bookmarked ? (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ) : (
                            <Star className="w-3.5 h-3.5 text-slate-300 hover:text-amber-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{lecture.instructor} · {lecture.subject}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        {getStatusBadge(lecture.id)}
                        <div className="flex items-center gap-1.5">
                          {renderDifficulty(lecture.level)}
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", gradeColors[lecture.grade])}>
                            {lecture.grade}
                          </span>
                        </div>
                      </div>
                      {getProgressBar(lecture.id)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
