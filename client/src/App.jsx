import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { LearningPaths } from './pages/LearningPaths';
import { LearningPathDetail } from './pages/LearningPathDetail';
import { Modules } from './pages/Modules';
import { ModuleDetail } from './pages/ModuleDetail';
import { NotesDetail } from './pages/NotesDetail';
import { QuizPage } from './pages/QuizPage';
import { QuizResults } from './pages/QuizResults';
import { Analytics } from './pages/Analytics';
import { Revision } from './pages/Revision';
import { Leaderboard } from './pages/Leaderboard';
import { Certificates } from './pages/Certificates';
import { CertificateDetail } from './pages/CertificateDetail';
import { CertificateVerify } from './pages/CertificateVerify';
import { AITutor } from './pages/AITutor';
import { Search } from './pages/Search';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Public Certificate Verification Route */}
              <Route path="/verify/:certificateId" element={<CertificateVerify />} />

              {/* Protected Application Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/paths" element={<LearningPaths />} />
                <Route path="/paths/:id" element={<LearningPathDetail />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/modules/:id" element={<ModuleDetail />} />
                <Route path="/notes/:moduleId" element={<NotesDetail />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
                <Route path="/quiz/:id/results" element={<QuizResults />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/revision" element={<Revision />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/certificates/:id" element={<CertificateDetail />} />
                <Route path="/ai-tutor" element={<AITutor />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/404" element={<NotFound />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
