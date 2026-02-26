import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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
import { SuccessStories } from './pages/SuccessStories';
import { PageSkeleton } from './components/Skeleton';
import { StudyHub } from './pages/StudyHub';
import { ExamTaking } from './pages/ExamTaking';
import { ExamResult } from './pages/ExamResult';
import { WrongNotes } from './pages/WrongNotes';
import { StudentAnalytics } from './pages/StudentAnalytics';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <PageSkeleton />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
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
        <Route path="success" element={<SuccessStories />} />

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
        <Route path="study" element={
          <ProtectedRoute>
            <StudyHub />
          </ProtectedRoute>
        } />
        <Route path="study/exam/:examId" element={
          <ProtectedRoute>
            <ExamTaking />
          </ProtectedRoute>
        } />
        <Route path="study/result/:attemptId" element={
          <ProtectedRoute>
            <ExamResult />
          </ProtectedRoute>
        } />
        <Route path="study/wrong-notes" element={
          <ProtectedRoute>
            <WrongNotes />
          </ProtectedRoute>
        } />
        <Route path="study/analytics" element={
          <ProtectedRoute>
            <StudentAnalytics />
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
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}
