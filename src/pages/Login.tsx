import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Users, GraduationCap, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type Mode = 'select' | 'login' | 'signup' | 'demo';

export function Login() {
  const { login, signup, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup(email, password, name, role);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
    }
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    demoLogin(selectedRole);
    navigate('/dashboard');
  };

  const roles = [
    { id: 'student' as const, name: '학생', icon: User, color: 'bg-blue-500' },
    { id: 'parent' as const, name: '학부모', icon: Users, color: 'bg-emerald-500' },
    { id: 'teacher' as const, name: '강사', icon: GraduationCap, color: 'bg-indigo-500' },
    { id: 'admin' as const, name: '관리자', icon: ShieldCheck, color: 'bg-slate-800' },
  ];

  const demoRoles = [
    { id: 'student' as const, name: '학생 로그인', icon: User, color: 'bg-blue-500', desc: '내 강의, 성적, 출결 확인' },
    { id: 'parent' as const, name: '학부모 로그인', icon: Users, color: 'bg-emerald-500', desc: '자녀 학습 현황, 수납 관리' },
    { id: 'teacher' as const, name: '강사 로그인', icon: GraduationCap, color: 'bg-indigo-500', desc: '강의 업로드, 학생 관리' },
    { id: 'admin' as const, name: '원장/관리자', icon: ShieldCheck, color: 'bg-slate-800', desc: '학원 전체 통합 관리' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
      >
        <div>
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">진</span>
          </div>

          {mode === 'select' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 tracking-tight">로그인</h2>
              <p className="mt-2 text-center text-sm text-slate-500">진접 G1230 수학전문학원에 오신 것을 환영합니다.</p>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setMode('login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Mail className="w-5 h-5" />
                  이메일로 로그인
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-indigo-200 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                >
                  회원가입
                </button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-400">또는</span>
                  </div>
                </div>
                <button
                  onClick={() => setMode('demo')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors text-sm"
                >
                  🎮 데모 체험하기
                </button>
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('select'); setError(''); }} className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> 뒤로
              </button>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">이메일 로그인</h2>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </form>
            </>
          )}

          {mode === 'signup' && (
            <>
              <button onClick={() => { setMode('select'); setError(''); setSuccessMessage(''); }} className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> 뒤로
              </button>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">회원가입</h2>

              {successMessage ? (
                <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                  ✅ {successMessage}
                  <button onClick={() => { setMode('login'); setSuccessMessage(''); }}
                    className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    로그인하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)} required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="6자 이상"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">역할 선택</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map(r => (
                        <button key={r.id} type="button" onClick={() => setRole(r.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${role === r.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          <r.icon className="w-4 h-4" /> {r.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? '처리 중...' : '가입하기'}
                  </button>
                </form>
              )}
            </>
          )}

          {mode === 'demo' && (
            <>
              <button onClick={() => setMode('select')} className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> 뒤로
              </button>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">데모 체험</h2>
              <p className="mt-2 text-sm text-slate-500">원하시는 역할을 선택하면 즉시 체험할 수 있습니다.</p>
              <div className="mt-6 space-y-3">
                {demoRoles.map((r) => (
                  <button key={r.id} onClick={() => handleDemoLogin(r.id)}
                    className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group text-left"
                  >
                    <div className={`${r.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                      <r.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
                      <p className="text-sm text-slate-500">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
