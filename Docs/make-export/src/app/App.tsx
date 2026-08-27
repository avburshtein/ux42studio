import { startTransition, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider } from './contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext';
import { ModalContainer } from './components/ModalContainer';
import { DarkModeStyler } from './components/DarkModeStyler';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FloatingButtons } from './components/FloatingButtons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/slick-custom.css';

// Direct imports — no lazy, no suspend in Figma Make preview
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import CaseStudyTemplate from './pages/CaseStudyTemplate';
import { ProjectDetail } from './components/ProjectDetail';
import Portfolio from './pages/Portfolio';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiesSettings from './pages/CookiesSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';

// Only HomeDesktop stays lazy — it has figma:asset imports that are preview-safe when deferred
const HomeDesktop = lazy(() => import('../imports/HomeDesktop'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#0b6e4f] border-r-transparent" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <DarkModeStyler />
          <BrowserRouter>
            <div className="w-full min-h-screen relative overflow-x-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
              <Routes>
                <Route path="/" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/case-template" element={<CaseStudyTemplate />} />
                <Route
                  path="/studio"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <HomeDesktop />
                    </Suspense>
                  }
                />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<ProjectDetail />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiesSettings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ModalContainer />
              <FloatingButtons />
            </div>
          </BrowserRouter>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
