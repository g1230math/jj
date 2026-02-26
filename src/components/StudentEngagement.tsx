import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import {
    Trophy, Target, Star, Award, Zap, TrendingUp, ChevronRight, Brain,
    CheckCircle, Flame, BarChart3, Sparkles, BookOpen
} from 'lucide-react';
import {
    getStudentTotalPoints, getStudentLevel, getPoints, getStudentBadges, ALL_BADGES,
    getWeeklyGoals, saveWeeklyGoals, genId,
    type WeeklyGoal, type PointRecord, type Badge, type StudentBadge
} from '../data/academyData';
import { getWrongNotes, type WrongNote } from '../data/studyData';
import { useAuth } from '../context/AuthContext';

const RARITY_COLORS = {
    common: 'from-slate-100 to-slate-200 border-slate-300',
    rare: 'from-blue-50 to-blue-100 border-blue-300',
    epic: 'from-purple-50 to-purple-100 border-purple-300',
    legendary: 'from-amber-50 to-amber-100 border-amber-300',
};

export function StudentEngagement() {
    const { user } = useAuth();
    const studentId = user?.id || '1';

    const [totalPoints, setTotalPoints] = useState(0);
    const [pointHistory, setPointHistory] = useState<PointRecord[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<StudentBadge[]>([]);
    const [goals, setGoals] = useState<WeeklyGoal[]>([]);
    const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'goals' | 'weakness'>('overview');

    useEffect(() => {
        setTotalPoints(getStudentTotalPoints(studentId));
        setPointHistory(getPoints().filter(p => p.student_id === studentId));
        setEarnedBadges(getStudentBadges().filter(b => b.student_id === studentId));
        setGoals(getWeeklyGoals().filter(g => g.student_id === studentId));
        getWrongNotes().then(wn => setWrongNotes(wn.filter(w => w.student_id === studentId)));
    }, [studentId]);

    const level = getStudentLevel(totalPoints);
    const progressToNext = Math.min(100, ((totalPoints - level.min) / (level.max - level.min)) * 100);
    const currentGoal = goals.length > 0 ? goals[goals.length - 1] : null;

    // AI Weakness analysis from wrong notes
    const weakAreas = useMemo(() => {
        const topicCount: Record<string, number> = {};
        wrongNotes.forEach(wn => {
            const topic = (wn as any).chapter || (wn as any).sub_topic || '기타';
            topicCount[topic] = (topicCount[topic] || 0) + 1;
        });
        return Object.entries(topicCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([topic, count]) => ({ topic, count }));
    }, [wrongNotes]);

    const tabs = [
        { key: 'overview', label: '개요', icon: BarChart3 },
        { key: 'badges', label: '배지', icon: Award },
        { key: 'goals', label: '목표', icon: Target },
        { key: 'weakness', label: 'AI분석', icon: Brain },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {level.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base font-bold">{user?.name || '학생'}</span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{level.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${progressToNext}%` }} />
                            </div>
                            <span className="text-xs font-bold">{totalPoints}P</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Nav */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={cn("flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
                            activeTab === tab.key ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"
                        )}>
                        <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-4 sm:p-5">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-indigo-50 rounded-xl p-3 text-center">
                                <Zap className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-indigo-700">{totalPoints}</p>
                                <p className="text-[10px] text-indigo-500">총 포인트</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-3 text-center">
                                <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-amber-700">{earnedBadges.length}</p>
                                <p className="text-[10px] text-amber-500">획득 배지</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <Flame className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-emerald-700">{wrongNotes.filter(w => w.reviewed).length}</p>
                                <p className="text-[10px] text-emerald-500">복습 완료</p>
                            </div>
                        </div>

                        {/* Recent Points */}
                        <div>
                            <p className="text-xs font-bold text-slate-600 mb-2">최근 포인트 활동</p>
                            <div className="space-y-1.5">
                                {pointHistory.slice(-5).reverse().map(p => (
                                    <div key={p.id} className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                                        <span className="text-xs text-slate-600">{p.reason}</span>
                                        <span className={cn("text-xs font-bold", p.type === 'earn' ? "text-emerald-600" : "text-red-500")}>
                                            {p.type === 'earn' ? '+' : '-'}{p.points}P
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Goal Mini */}
                        {currentGoal && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
                                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mb-2">
                                    <Target className="w-3.5 h-3.5" /> 이번 주 목표
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="flex items-center justify-between text-[10px] text-emerald-600 mb-1">
                                            <span>문제풀이</span>
                                            <span>{currentGoal.completed_problems}/{currentGoal.target_problems}</span>
                                        </div>
                                        <div className="h-1.5 bg-emerald-200 rounded-full">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (currentGoal.completed_problems / currentGoal.target_problems) * 100)}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-[10px] text-emerald-600 mb-1">
                                            <span>오답복습</span>
                                            <span>{currentGoal.completed_wrong_review}/{currentGoal.target_wrong_review}</span>
                                        </div>
                                        <div className="h-1.5 bg-emerald-200 rounded-full">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (currentGoal.completed_wrong_review / currentGoal.target_wrong_review) * 100)}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Badges Tab */}
                {activeTab === 'badges' && (
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500">{earnedBadges.length}/{ALL_BADGES.length} 배지 획득</p>
                        <div className="grid grid-cols-2 gap-2">
                            {ALL_BADGES.map(badge => {
                                const earned = earnedBadges.find(eb => eb.badge_id === badge.id);
                                return (
                                    <div key={badge.id} className={cn(
                                        "rounded-xl p-3 border-2 bg-gradient-to-br transition-all",
                                        earned ? RARITY_COLORS[badge.rarity] : "border-slate-100 from-slate-50 to-slate-100 opacity-50"
                                    )}>
                                        <div className="text-2xl mb-1">{badge.icon}</div>
                                        <p className={cn("text-xs font-bold", earned ? "text-slate-800" : "text-slate-400")}>{badge.name}</p>
                                        <p className="text-[10px] text-slate-500">{badge.description}</p>
                                        {earned && <p className="text-[8px] text-slate-400 mt-1">{new Date(earned.earned_at).toLocaleDateString('ko-KR')}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Goals Tab */}
                {activeTab === 'goals' && (
                    <div className="space-y-4">
                        {currentGoal ? (
                            <div className="space-y-3">
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                    <p className="text-sm font-bold text-emerald-800 mb-3">📌 이번 주 학습 목표</p>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-600 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 문제 풀기</span>
                                                <span className="font-bold text-emerald-700">{currentGoal.completed_problems} / {currentGoal.target_problems}</span>
                                            </div>
                                            <div className="h-3 bg-emerald-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${Math.min(100, (currentGoal.completed_problems / currentGoal.target_problems) * 100)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> 오답 복습</span>
                                                <span className="font-bold text-emerald-700">{currentGoal.completed_wrong_review} / {currentGoal.target_wrong_review}</span>
                                            </div>
                                            <div className="h-3 bg-emerald-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${Math.min(100, (currentGoal.completed_wrong_review / currentGoal.target_wrong_review) * 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                    <p className="text-xs text-indigo-700">
                                        {currentGoal.completed_problems >= currentGoal.target_problems && currentGoal.completed_wrong_review >= currentGoal.target_wrong_review
                                            ? '🎉 이번 주 목표를 모두 달성했습니다! 대단해요!'
                                            : `목표 달성까지 문제 ${Math.max(0, currentGoal.target_problems - currentGoal.completed_problems)}개, 복습 ${Math.max(0, currentGoal.target_wrong_review - currentGoal.completed_wrong_review)}개 남았습니다.`}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">이번 주 목표가 설정되지 않았습니다.</p>
                                <p className="text-[10px] text-slate-400 mt-1">선생님이 목표를 설정해주면 여기에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Weakness Analysis Tab */}
                {activeTab === 'weakness' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <Brain className="w-4 h-4 text-amber-600" />
                            <p className="text-xs text-amber-700 font-medium">AI가 오답 패턴을 분석한 결과입니다</p>
                        </div>

                        {weakAreas.length > 0 ? (
                            <>
                                <div className="space-y-2">
                                    {weakAreas.map((area, i) => {
                                        const maxCount = weakAreas[0].count;
                                        const pct = (area.count / maxCount) * 100;
                                        return (
                                            <div key={area.topic} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-700 flex items-center gap-2">
                                                        <span className={cn("text-xs font-bold w-5 h-5 rounded flex items-center justify-center",
                                                            i === 0 ? "bg-red-100 text-red-600" : i === 1 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                                                        )}>{i + 1}</span>
                                                        {area.topic}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{area.count}문제</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={cn("h-full rounded-full",
                                                        i === 0 ? "bg-red-400" : i === 1 ? "bg-amber-400" : "bg-slate-300"
                                                    )} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> 추천
                                    </p>
                                    <p className="text-xs text-indigo-600 mt-1">
                                        <strong>{weakAreas[0]?.topic}</strong> 단원의 오답이 가장 많습니다. 해당 단원의 기본 개념을 복습하고, 유사 문제를 추가로 풀어보세요.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">아직 분석할 오답이 없습니다</p>
                                <p className="text-[10px] text-slate-400 mt-1">시험을 풀면 AI가 취약점을 분석해드립니다</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
