import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Star, MessageSquare, Plus, X, Send, CheckCircle } from 'lucide-react';
import { getReviews, saveReviews, genId, type Review } from '../data/academyData';
import { useAuth } from '../context/AuthContext';

export function ReviewSection() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rating: 5, content: '' });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setReviews(getReviews().filter(r => r.approved)); }, []);

    const handleSubmit = () => {
        if (!formData.content.trim()) { alert('후기 내용을 입력해주세요.'); return; }
        const review: Review = {
            id: genId('rv'), author_name: user?.name || '익명',
            author_role: user?.role === 'parent' ? 'parent' : 'student',
            rating: formData.rating, content: formData.content,
            created_at: new Date().toISOString(), approved: true,
        };
        const all = [...getReviews(), review]; saveReviews(all);
        setReviews(all.filter(r => r.approved));
        setSubmitted(true);
        setTimeout(() => { setShowForm(false); setSubmitted(false); setFormData({ rating: 5, content: '' }); }, 2000);
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

    return (
        <section id="reviews" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-3 tracking-wider">REVIEWS</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">수강 후기</h2>
                    <p className="text-slate-500 text-sm">학생과 학부모님의 실제 후기입니다</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(n => <Star key={n} className={cn("w-5 h-5", Number(avgRating) >= n ? "fill-amber-400 text-amber-400" : "text-slate-300")} />)}
                        </div>
                        <span className="text-lg font-bold text-slate-800">{avgRating}</span>
                        <span className="text-sm text-slate-500">({reviews.length}개)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(n => <Star key={n} className={cn("w-3.5 h-3.5", review.rating >= n ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}
                                </div>
                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                    review.author_role === 'parent' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                                )}>{review.author_role === 'parent' ? '학부모' : '학생'}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">{review.content}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">{review.author_name}</span>
                                <span className="text-[10px] text-slate-400">{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {user && (
                    <div className="text-center">
                        {!showForm ? (
                            <button onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm">
                                <MessageSquare className="w-4 h-4" /> 후기 작성하기
                            </button>
                        ) : submitted ? (
                            <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                                <div className="text-left">
                                    <p className="font-bold text-emerald-800">감사합니다!</p>
                                    <p className="text-sm text-emerald-600">소중한 후기가 등록되었습니다.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-800">후기 작성</span>
                                    <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="flex items-center gap-1 mb-4 justify-center">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} onClick={() => setFormData({ ...formData, rating: n })}>
                                            <Star className={cn("w-8 h-8 transition-colors cursor-pointer",
                                                formData.rating >= n ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-300"
                                            )} />
                                        </button>
                                    ))}
                                </div>
                                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="학원에 대한 솔직한 후기를 남겨주세요" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm h-24 mb-3" />
                                <button onClick={handleSubmit}
                                    className="w-full py-2.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" /> 등록
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
