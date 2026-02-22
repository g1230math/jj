import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type UserRole = 'guest' | 'student' | 'parent' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ error?: string }>;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
  isDemo: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  guest: { id: '0', name: 'Guest', role: 'guest' },
  student: { id: '1', name: '김지훈', role: 'student', avatar: 'https://i.pravatar.cc/150?u=1' },
  parent: { id: '2', name: '이영희', role: 'parent', studentId: '1', avatar: 'https://i.pravatar.cc/150?u=2' },
  teacher: { id: '3', name: '박선생', role: 'teacher', avatar: 'https://i.pravatar.cc/150?u=3' },
  admin: { id: '4', name: '원장님', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=4' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          id: session.user.id,
          name: meta?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          role: (meta?.role as UserRole) || 'student',
          avatar: meta?.avatar || `https://i.pravatar.cc/150?u=${session.user.id}`,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          id: session.user.id,
          name: meta?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          role: (meta?.role as UserRole) || 'student',
          avatar: meta?.avatar || `https://i.pravatar.cc/150?u=${session.user.id}`,
        });
        setIsDemo(false);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!supabase) return { error: 'Supabase가 설정되지 않았습니다. 데모 로그인을 이용해주세요.' };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<{ error?: string }> => {
    if (!supabase) return { error: 'Supabase가 설정되지 않았습니다.' };

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const demoLogin = (role: UserRole) => {
    setUser(mockUsers[role]);
    setIsDemo(true);
  };

  const logout = async () => {
    if (supabase && !isDemo) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemo(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, demoLogin, logout, isDemo, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
