/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SchoolProvider } from './context/SchoolContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TeachersPage } from './pages/TeachersPage';
import { StudentsPage } from './pages/StudentsPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { NoticesPage } from './pages/NoticesPage';
import { ResultsPage } from './pages/ResultsPage';
import { GalleryPage } from './pages/GalleryPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { CustomDynamicPage } from './pages/CustomDynamicPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SchoolProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/teachers" element={<PublicLayout><TeachersPage /></PublicLayout>} />
            <Route path="/students" element={<PublicLayout><StudentsPage /></PublicLayout>} />
            <Route path="/academics" element={<PublicLayout><AcademicsPage /></PublicLayout>} />
            <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
            <Route path="/notices/:id" element={<PublicLayout><NoticesPage /></PublicLayout>} />
            <Route path="/results" element={<PublicLayout><ResultsPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/news" element={<PublicLayout><NewsPage /></PublicLayout>} />
            <Route path="/news/:id" element={<PublicLayout><NewsPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/page/:slug" element={<PublicLayout><CustomDynamicPage /></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </SchoolProvider>
    </ErrorBoundary>
  );
}
