import React, { useState, useEffect } from 'react';
import {
  getNotices, saveNotices, type NoticeItem,
  getBlogPosts, saveBlogPosts, type BlogPost,
  getGallery, saveGallery, type GalleryItem,
  getResources, saveResources, type ResourceItem,
  getFaqs, saveFaqs, type FaqItem,
  getInquiries, saveInquiries, type InquiryItem,
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { ImageUploader } from '../components/ImageUploader';
import {
  Image as ImageIcon, FileText, MessageCircle, Info, Download, ChevronDown, ChevronUp,
  Eye, Calendar, Tag, BookOpen, Clock, User, Lock, HelpCircle, CheckCircle2,
  Plus, Edit2, Trash2, Save, X, Pin, Send,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

/* ─────────── helpers ─────────── */
const today = () => new Date().toISOString().split('T')[0];
const genId = (prefix: string) => `${prefix}_${Date.now()}`;
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none";
const labelCls = "block text-xs font-medium text-slate-600 mb-1";

/* ═══════════════════════════════════════════
   Top-level sub-components (won't remount on parent state change)
═══════════════════════════════════════════ */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

/* ─────────── COMPONENT ─────────── */
export function Community() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('notice');

  /* ── State for each section ── */
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [resourceList, setResourceList] = useState<ResourceItem[]>([]);
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [inquiryList, setInquiryList] = useState<InquiryItem[]>([]);

  useEffect(() => {
    getNotices().then(setNoticeList);
    getBlogPosts().then(setBlogList);
    getGallery().then(setGalleryList);
    getResources().then(setResourceList);
    getFaqs().then(setFaqList);
    getInquiries().then(setInquiryList);
  }, []);

  /* ── UI states ── */
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openBlog, setOpenBlog] = useState<string | null>(null);
  const [openInquiry, setOpenInquiry] = useState<string | null>(null);
  const [openNotice, setOpenNotice] = useState<string | null>(null);

  /* ── Edit modals ── */
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [replyingInquiry, setReplyingInquiry] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingInquiry, setEditingInquiry] = useState<InquiryItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const tabs = [
    { id: 'notice', name: '공지사항', icon: Info },
    { id: 'blog', name: '블로그', icon: BookOpen },
    { id: 'gallery', name: '학원 갤러리', icon: ImageIcon },
    { id: 'resources', name: '자료실', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: MessageCircle },
    { id: 'inquiry', name: '문의게시판', icon: HelpCircle },
  ];

  /* ── Notice CRUD ── */
  const newNotice = (): NoticeItem => ({ id: '', title: '', content: '', date: today(), isNew: true, isPinned: false });
  const handleSaveNotice = async (item: NoticeItem) => {
    let list: NoticeItem[];
    if (isNew) {
      list = [{ ...item, id: genId('n') }, ...noticeList];
    } else {
      list = noticeList.map(n => n.id === item.id ? item : n);
    }
    await saveNotices(list); setNoticeList(list); setEditingNotice(null); setIsNew(false);
  };
  const deleteNotice = async (id: string) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;
    const list = noticeList.filter(n => n.id !== id);
    await saveNotices(list); setNoticeList(list);
  };

  /* ── Blog CRUD ── */
  const newBlog = (): BlogPost => ({ id: '', title: '', excerpt: '', content: '', author: user?.name || '', date: today(), readTime: '5분', tags: [], image: '' });
  const handleSaveBlog = async (item: BlogPost) => {
    let list: BlogPost[];
    if (isNew) {
      list = [{ ...item, id: genId('blog') }, ...blogList];
    } else {
      list = blogList.map(b => b.id === item.id ? item : b);
    }
    await saveBlogPosts(list); setBlogList(list); setEditingBlog(null); setIsNew(false);
  };
  const deleteBlog = async (id: string) => {
    if (!confirm('이 블로그 글을 삭제하시겠습니까?')) return;
    const list = blogList.filter(b => b.id !== id);
    await saveBlogPosts(list); setBlogList(list);
  };

  /* ── Gallery CRUD ── */
  const newGalleryItem = (): GalleryItem => ({ id: '', title: '', description: '', imageUrl: '', date: today() });
  const handleSaveGallery = async (item: GalleryItem) => {
    let list: GalleryItem[];
    if (isNew) {
      list = [{ ...item, id: genId('gal') }, ...galleryList];
    } else {
      list = galleryList.map(g => g.id === item.id ? item : g);
    }
    await saveGallery(list); setGalleryList(list); setEditingGallery(null); setIsNew(false);
  };
  const deleteGalleryItem = async (id: string) => {
    if (!confirm('이 갤러리 항목을 삭제하시겠습니까?')) return;
    const list = galleryList.filter(g => g.id !== id);
    await saveGallery(list); setGalleryList(list);
  };

  /* ── Resource CRUD ── */
  const newResource = (): ResourceItem => ({ id: '', title: '', category: '학습자료', date: today(), downloads: 0, type: 'PDF', size: '', fileUrl: '' });
  const handleSaveResource = async (item: ResourceItem) => {
    let list: ResourceItem[];
    if (isNew) {
      list = [{ ...item, id: genId('res') }, ...resourceList];
    } else {
      list = resourceList.map(r => r.id === item.id ? item : r);
    }
    await saveResources(list); setResourceList(list); setEditingResource(null); setIsNew(false);
  };
  const deleteResourceItem = async (id: string) => {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return;
    const list = resourceList.filter(r => r.id !== id);
    await saveResources(list); setResourceList(list);
  };

  /* ── FAQ CRUD ── */
  const newFaqItem = (): FaqItem => ({ id: '', category: '일반', question: '', answer: '', order: faqList.length + 1 });
  const handleSaveFaq = async (item: FaqItem) => {
    let list: FaqItem[];
    if (isNew) {
      list = [...faqList, { ...item, id: genId('faq') }];
    } else {
      list = faqList.map(f => f.id === item.id ? item : f);
    }
    await saveFaqs(list); setFaqList(list); setEditingFaq(null); setIsNew(false);
  };
  const deleteFaqItem = async (id: string) => {
    if (!confirm('이 FAQ를 삭제하시겠습니까?')) return;
    const list = faqList.filter(f => f.id !== id);
    await saveFaqs(list); setFaqList(list);
  };

  /* ── Inquiry reply ── */
  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    const list = inquiryList.map(inq =>
      inq.id === id ? { ...inq, answer: replyText.trim(), answerDate: today() } : inq
    );
    await saveInquiries(list); setInquiryList(list); setReplyingInquiry(null); setReplyText('');
  };
  const deleteReply = async (id: string) => {
    const list = inquiryList.map(inq =>
      inq.id === id ? { ...inq, answer: undefined, answerDate: undefined } : inq
    );
    await saveInquiries(list); setInquiryList(list);
  };
  const deleteInquiry = async (id: string) => {
    if (!confirm('이 문의를 삭제하시겠습니까?')) return;
    const list = inquiryList.filter(i => i.id !== id);
    await saveInquiries(list); setInquiryList(list);
  };

  /* ── Inquiry write ── */
  const newInquiry = (): InquiryItem => ({ id: '', title: '', author: '', date: today(), isPrivate: false, category: '일반 문의', content: '', views: 0 });
  const handleSaveInquiry = async (item: InquiryItem) => {
    if (!item.title.trim() || !item.content.trim() || !item.author.trim()) {
      alert('작성자명, 제목, 내용은 필수 입력 항목입니다.');
      return;
    }
    const list = [{ ...item, id: genId('inq') }, ...inquiryList];
    await saveInquiries(list); setInquiryList(list); setEditingInquiry(null);
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-800 via-purple-800 to-indigo-900 text-white py-20 overflow-hidden wave-divider wave-divider-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-badge inline-block px-4 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 mb-4 backdrop-blur-sm">COMMUNITY</span>
            <h1 className="text-hero text-white mb-4">커뮤니티</h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto font-light">학원의 다양한 소식과 자료를 확인하세요</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}>
              <tab.icon className="w-4 h-4 mr-1.5 sm:mr-2" />{tab.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 min-h-[400px]">

          {/* ═══ 공지사항 ═══ */}
          {activeTab === 'notice' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">공지사항</h2>
                {isAdmin && (
                  <button onClick={() => { setEditingNotice(newNotice()); setIsNew(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />글쓰기
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {noticeList.map(notice => (
                  <div key={notice.id} className="group">
                    <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-4 -mx-4 rounded-lg transition-colors"
                      onClick={() => setOpenNotice(openNotice === notice.id ? null : notice.id)}>
                      <div className="flex items-center gap-3 min-w-0">
                        {notice.isPinned && <Pin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        {notice.isNew && <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-600 rounded-full shrink-0">NEW</span>}
                        <span className="text-slate-700 group-hover:text-indigo-600 transition-colors font-medium truncate">{notice.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-slate-400">{notice.date}</span>
                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingNotice(notice); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteNotice(notice.id); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                        {openNotice === notice.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                    {openNotice === notice.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 블로그 ═══ */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">블로그</h2>
                {isAdmin && (
                  <button onClick={() => { setEditingBlog(newBlog()); setIsNew(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />새 글 작성
                  </button>
                )}
              </div>
              <div className="space-y-8">
                {blogList.map(post => (
                  <article key={post.id} className="group rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all">
                    {post.image && (
                      <div className="aspect-[21/9] overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><User className="w-3.5 h-3.5" />{post.author}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5" />{post.date}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" />{post.readTime} 읽기</div>
                        {isAdmin && (
                          <div className="flex items-center gap-1 ml-auto">
                            <button onClick={() => { setEditingBlog(post); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteBlog(post.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{post.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">#{tag}</span>
                          ))}
                        </div>
                        <button onClick={() => setOpenBlog(openBlog === post.id ? null : post.id)}
                          className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                          {openBlog === post.id ? '접기' : '자세히 보기'}
                          {openBlog === post.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {openBlog === post.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-slate-100">
                          <div className="prose prose-sm prose-slate max-w-none">
                            {post.content.split('\n\n').map((paragraph, i) => {
                              if (paragraph.startsWith('## ')) return <h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                              if (paragraph.startsWith('### ')) return <h4 key={i} className="text-base font-semibold text-slate-800 mt-4 mb-2">{paragraph.replace('### ', '')}</h4>;
                              if (paragraph.startsWith('- ')) return (
                                <ul key={i} className="list-disc list-inside space-y-1 text-sm text-slate-600 my-2">
                                  {paragraph.split('\n').map((line, j) => (<li key={j}>{line.replace('- ', '')}</li>))}
                                </ul>
                              );
                              return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{paragraph}</p>;
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 갤러리 ═══ */}
          {activeTab === 'gallery' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">학원 갤러리</h2>
                {isAdmin && (
                  <button onClick={() => { setEditingGallery(newGalleryItem()); setIsNew(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />사진 추가
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryList.map(gal => (
                  <div key={gal.id} className="group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={gal.imageUrl} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-medium text-slate-900">{gal.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{gal.date}</p>
                      {gal.description && <p className="text-xs text-slate-400 mt-1">{gal.description}</p>}
                    </div>
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingGallery(gal); setIsNew(false); }} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                        <button onClick={() => deleteGalleryItem(gal.id)} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 자료실 ═══ */}
          {activeTab === 'resources' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">자료실</h2>
                {isAdmin && (
                  <button onClick={() => { setEditingResource(newResource()); setIsNew(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />자료 추가
                  </button>
                )}
              </div>
              <div className="space-y-8">
                {Array.from(new Set(resourceList.map(r => r.category))).map(category => {
                  const items = resourceList.filter(r => r.category === category);
                  const color = category === '학습자료' ? 'bg-indigo-100 text-indigo-700' : category === '시험 대비' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700';
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={cn("px-3 py-1 text-xs font-bold rounded-full", color)}>{category}</span>
                        <span className="text-sm text-slate-400">{items.length}개 자료</span>
                      </div>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/item cursor-pointer">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-slate-500" /></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 text-sm group-hover/item:text-indigo-700 transition-colors truncate">{item.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.downloads}회 다운로드</span>
                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.type} · {item.size}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {isAdmin && (
                                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingResource(item); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-indigo-100"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></button>
                                  <button onClick={() => deleteResourceItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-100"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                                </div>
                              )}
                              <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors opacity-0 group-hover/item:opacity-100">
                                <Download className="w-3.5 h-3.5" /> 다운로드
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ FAQ ═══ */}
          {activeTab === 'faq' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문</h2>
                {isAdmin && (
                  <button onClick={() => { setEditingFaq(newFaqItem()); setIsNew(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />FAQ 추가
                  </button>
                )}
              </div>
              <div className="space-y-8">
                {Array.from(new Set(faqList.map(f => f.category))).map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />{category}
                    </h3>
                    <div className="space-y-2">
                      {faqList.filter(f => f.category === category).map(faq => {
                        const isOpen = openFaq === faq.id;
                        return (
                          <div key={faq.id} className={cn("rounded-xl border transition-all group",
                            isOpen ? "border-indigo-200 bg-indigo-50/30 shadow-sm" : "border-slate-100 hover:border-slate-200"
                          )}>
                            <button onClick={() => setOpenFaq(isOpen ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left">
                              <span className={cn("font-medium text-sm pr-4", isOpen ? "text-indigo-700" : "text-slate-800")}>Q. {faq.question}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                {isAdmin && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span onClick={(e) => { e.stopPropagation(); setEditingFaq(faq); setIsNew(false); }} className="p-1 rounded hover:bg-indigo-100 cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-indigo-600" /></span>
                                    <span onClick={(e) => { e.stopPropagation(); deleteFaqItem(faq.id); }} className="p-1 rounded hover:bg-red-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-500" /></span>
                                  </div>
                                )}
                                {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                              </div>
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4">
                                <div className="pl-4 border-l-2 border-indigo-300">
                                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
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
            </div>
          )}

          {/* ═══ 문의게시판 ═══ */}
          {activeTab === 'inquiry' && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm text-slate-500">총 <span className="font-semibold text-slate-700">{inquiryList.length}</span>개의 문의</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5" /><span>비밀글은 작성자만 확인할 수 있습니다</span>
                  </div>
                  <button onClick={() => setEditingInquiry(newInquiry())}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />문의하기
                  </button>
                </div>
              </div>

              {/* Table header (desktop) */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-500 mb-2">
                <div className="col-span-1 text-center">번호</div>
                <div className="col-span-2">분류</div>
                <div className="col-span-4">제목</div>
                <div className="col-span-1">작성자</div>
                <div className="col-span-2">날짜</div>
                <div className="col-span-1 text-center">상태</div>
                {isAdmin && <div className="col-span-1 text-center">관리</div>}
              </div>

              <div className="divide-y divide-slate-100">
                {inquiryList.map((post, idx) => {
                  const isOpen = openInquiry === post.id;
                  return (
                    <div key={post.id}>
                      <button onClick={() => setOpenInquiry(isOpen ? null : post.id)}
                        className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors group">
                        {/* Desktop row */}
                        <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-1 text-center text-sm text-slate-400">{inquiryList.length - idx}</div>
                          <div className="col-span-2"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{post.category}</span></div>
                          <div className="col-span-4 flex items-center gap-2">
                            {post.isPrivate && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className={cn("text-sm font-medium truncate", post.isPrivate && !isAdmin ? "text-slate-500" : "text-slate-900 group-hover:text-indigo-600")}>
                              {post.isPrivate && !isAdmin ? '비밀글입니다' : post.title}
                            </span>
                          </div>
                          <div className="col-span-1 text-xs text-slate-500 truncate">{post.author}</div>
                          <div className="col-span-2 text-xs text-slate-400">{post.date}</div>
                          <div className="col-span-1 text-center">
                            {post.answer ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" />답변완료</span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">대기중</span>
                            )}
                          </div>
                          {isAdmin && (
                            <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span onClick={(e) => { e.stopPropagation(); deleteInquiry(post.id); }} className="p-1 rounded hover:bg-red-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-500" /></span>
                            </div>
                          )}
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
                          <p className={cn("text-sm font-medium", post.isPrivate && !isAdmin ? "text-slate-500" : "text-slate-900")}>
                            {post.isPrivate && !isAdmin ? '비밀글입니다' : post.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{post.author} · {post.date}</p>
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isOpen && (isAdmin || !post.isPrivate) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
                          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-semibold text-slate-700">문의 내용</span>
                                {post.isPrivate && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">비밀글</span>}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed pl-6">{post.content}</p>
                            </div>
                            {post.answer && (
                              <div className="border-t border-slate-200 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-semibold text-emerald-700">학원 답변</span>
                                  <span className="text-xs text-slate-400">{post.answerDate}</span>
                                  {isAdmin && (
                                    <button onClick={() => deleteReply(post.id)} className="ml-auto text-xs text-red-500 hover:text-red-700">답변 삭제</button>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed pl-6">{post.answer}</p>
                              </div>
                            )}
                            {/* Admin reply form */}
                            {isAdmin && !post.answer && (
                              <div className="border-t border-slate-200 pt-4">
                                {replyingInquiry === post.id ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="답변을 입력하세요..."
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                                      rows={3}
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => { setReplyingInquiry(null); setReplyText(''); }} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                                      <button onClick={() => submitReply(post.id)} className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
                                        <Send className="w-3.5 h-3.5" />답변 등록
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => { setReplyingInquiry(post.id); setReplyText(''); }}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                                    <Send className="w-3.5 h-3.5" /> 답변 작성
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Private post message for non-admin */}
                      {isOpen && !isAdmin && post.isPrivate && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
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

      {/* ═══════════════════════════════════════════
         EDIT MODALS (using top-level Modal component)
      ═══════════════════════════════════════════ */}

      {/* ── Notice Modal ── */}
      {editingNotice && (
        <Modal title={isNew ? '공지사항 작성' : '공지사항 수정'} onClose={() => { setEditingNotice(null); setIsNew(false); }}>
          <div><label className={labelCls}>제목 *</label><input className={inputCls} value={editingNotice.title} onChange={e => setEditingNotice({ ...editingNotice, title: e.target.value })} /></div>
          <div><label className={labelCls}>내용 *</label><textarea className={cn(inputCls, 'resize-none')} rows={6} value={editingNotice.content} onChange={e => setEditingNotice({ ...editingNotice, content: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>날짜</label><input type="date" className={inputCls} value={editingNotice.date} onChange={e => setEditingNotice({ ...editingNotice, date: e.target.value })} /></div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingNotice.isNew} onChange={e => setEditingNotice({ ...editingNotice, isNew: e.target.checked })} className="rounded" />NEW 표시</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editingNotice.isPinned} onChange={e => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })} className="rounded" />고정글</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setEditingNotice(null); setIsNew(false); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveNotice(editingNotice)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Save className="w-4 h-4" />저장</button>
          </div>
        </Modal>
      )}

      {/* ── Blog Modal ── */}
      {editingBlog && (
        <Modal title={isNew ? '블로그 글 작성' : '블로그 글 수정'} onClose={() => { setEditingBlog(null); setIsNew(false); }}>
          <div><label className={labelCls}>제목 *</label><input className={inputCls} value={editingBlog.title} onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })} /></div>
          <div><label className={labelCls}>요약</label><input className={inputCls} value={editingBlog.excerpt} onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} /></div>
          <div><label className={labelCls}>내용 * (마크다운 지원: ## 제목, ### 소제목, - 목록)</label><textarea className={cn(inputCls, 'resize-none font-mono text-xs')} rows={10} value={editingBlog.content} onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })} /></div>
          <ImageUploader label="대표 이미지" currentImageUrl={editingBlog.image} onUpload={r => setEditingBlog({ ...editingBlog, image: r.displayUrl })} onUrlChange={url => setEditingBlog({ ...editingBlog, image: url })} compact />
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelCls}>작성자</label><input className={inputCls} value={editingBlog.author} onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })} /></div>
            <div><label className={labelCls}>날짜</label><input type="date" className={inputCls} value={editingBlog.date} onChange={e => setEditingBlog({ ...editingBlog, date: e.target.value })} /></div>
            <div><label className={labelCls}>읽기 시간</label><input className={inputCls} value={editingBlog.readTime} onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })} placeholder="5분" /></div>
          </div>
          <div><label className={labelCls}>태그 (쉼표로 구분)</label><input className={inputCls} value={editingBlog.tags.join(', ')} onChange={e => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setEditingBlog(null); setIsNew(false); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveBlog(editingBlog)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Save className="w-4 h-4" />저장</button>
          </div>
        </Modal>
      )}

      {/* ── Gallery Modal ── */}
      {editingGallery && (
        <Modal title={isNew ? '갤러리 사진 추가' : '갤러리 수정'} onClose={() => { setEditingGallery(null); setIsNew(false); }}>
          <ImageUploader label="사진 *" currentImageUrl={editingGallery.imageUrl} onUpload={r => setEditingGallery({ ...editingGallery, imageUrl: r.displayUrl })} onUrlChange={url => setEditingGallery({ ...editingGallery, imageUrl: url })} />
          <div><label className={labelCls}>제목 *</label><input className={inputCls} value={editingGallery.title} onChange={e => setEditingGallery({ ...editingGallery, title: e.target.value })} /></div>
          <div><label className={labelCls}>설명</label><input className={inputCls} value={editingGallery.description} onChange={e => setEditingGallery({ ...editingGallery, description: e.target.value })} /></div>
          <div><label className={labelCls}>날짜</label><input type="date" className={inputCls} value={editingGallery.date} onChange={e => setEditingGallery({ ...editingGallery, date: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setEditingGallery(null); setIsNew(false); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveGallery(editingGallery)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Save className="w-4 h-4" />저장</button>
          </div>
        </Modal>
      )}

      {/* ── Resource Modal ── */}
      {editingResource && (
        <Modal title={isNew ? '자료 추가' : '자료 수정'} onClose={() => { setEditingResource(null); setIsNew(false); }}>
          <div><label className={labelCls}>제목 *</label><input className={inputCls} value={editingResource.title} onChange={e => setEditingResource({ ...editingResource, title: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>카테고리</label>
              <select className={inputCls} value={editingResource.category} onChange={e => setEditingResource({ ...editingResource, category: e.target.value })}>
                <option>학습자료</option><option>시험 대비</option><option>학부모 자료</option>
              </select>
            </div>
            <div><label className={labelCls}>파일 타입</label><input className={inputCls} value={editingResource.type} onChange={e => setEditingResource({ ...editingResource, type: e.target.value })} /></div>
            <div><label className={labelCls}>파일 크기</label><input className={inputCls} value={editingResource.size} onChange={e => setEditingResource({ ...editingResource, size: e.target.value })} placeholder="2.4MB" /></div>
          </div>
          <div><label className={labelCls}>파일 URL (다운로드 링크)</label><input className={inputCls} value={editingResource.fileUrl} onChange={e => setEditingResource({ ...editingResource, fileUrl: e.target.value })} placeholder="https://..." /></div>
          <div><label className={labelCls}>날짜</label><input type="date" className={inputCls} value={editingResource.date} onChange={e => setEditingResource({ ...editingResource, date: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setEditingResource(null); setIsNew(false); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveResource(editingResource)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Save className="w-4 h-4" />저장</button>
          </div>
        </Modal>
      )}

      {/* ── FAQ Modal ── */}
      {editingFaq && (
        <Modal title={isNew ? 'FAQ 추가' : 'FAQ 수정'} onClose={() => { setEditingFaq(null); setIsNew(false); }}>
          <div>
            <label className={labelCls}>카테고리</label>
            <select className={inputCls} value={editingFaq.category} onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value })}>
              <option>입학 상담</option><option>수업 및 커리큘럼</option><option>수강료 및 결제</option><option>차량 및 편의</option><option>일반</option>
            </select>
          </div>
          <div><label className={labelCls}>질문 *</label><input className={inputCls} value={editingFaq.question} onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })} /></div>
          <div><label className={labelCls}>답변 *</label><textarea className={cn(inputCls, 'resize-none')} rows={4} value={editingFaq.answer} onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setEditingFaq(null); setIsNew(false); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveFaq(editingFaq)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Save className="w-4 h-4" />저장</button>
          </div>
        </Modal>
      )}

      {/* ── Inquiry Write Modal ── */}
      {editingInquiry && (
        <Modal title="문의 작성" onClose={() => setEditingInquiry(null)}>
          <div><label className={labelCls}>작성자명 *</label><input className={inputCls} value={editingInquiry.author} onChange={e => setEditingInquiry({ ...editingInquiry, author: e.target.value })} placeholder="이름을 입력하세요" /></div>
          <div>
            <label className={labelCls}>분류</label>
            <select className={inputCls} value={editingInquiry.category} onChange={e => setEditingInquiry({ ...editingInquiry, category: e.target.value })}>
              <option>일반 문의</option><option>입학 상담</option><option>수업 및 커리큘럼</option><option>수강료 및 결제</option><option>차량 및 편의</option><option>기타</option>
            </select>
          </div>
          <div><label className={labelCls}>제목 *</label><input className={inputCls} value={editingInquiry.title} onChange={e => setEditingInquiry({ ...editingInquiry, title: e.target.value })} placeholder="문의 제목을 입력하세요" /></div>
          <div><label className={labelCls}>내용 *</label><textarea className={cn(inputCls, 'resize-none')} rows={5} value={editingInquiry.content} onChange={e => setEditingInquiry({ ...editingInquiry, content: e.target.value })} placeholder="문의 내용을 자세히 작성해주세요" /></div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={editingInquiry.isPrivate} onChange={e => setEditingInquiry({ ...editingInquiry, isPrivate: e.target.checked })} className="rounded" />
              <Lock className="w-3.5 h-3.5" /> 비밀글로 작성
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">비밀글은 관리자만 내용을 확인할 수 있습니다</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditingInquiry(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
            <button onClick={() => handleSaveInquiry(editingInquiry)} className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"><Send className="w-4 h-4" />문의 등록</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
