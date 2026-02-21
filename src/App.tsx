import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Lectures } from './pages/Lectures';
import { Calendar } from './pages/Calendar';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { ParentService } from './pages/ParentService';
import { Shuttle } from './pages/Shuttle';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
        <Route path="courses" element={<Courses />} />
        <Route path="community" element={<Community />} />
        <Route path="contact" element={<Contact />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="shuttle" element={<Shuttle />} />

        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="lectures" element={
          <ProtectedRoute>
            <Lectures />
          </ProtectedRoute>
        } />
        <Route path="parent-service" element={
          <ProtectedRoute>
            <ParentService />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL || '/';
  return (
    <AuthProvider>
      <Router basename={basename}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
