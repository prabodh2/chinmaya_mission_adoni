import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { WhatWeDoPage } from './pages/WhatWeDoPage';
import { LetsConnectPage } from './pages/LetsConnectPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col justify-between selection:bg-[var(--orange)] selection:text-white">
            <Navbar />
            <main className="flex-grow pt-20 sm:pt-24 lg:pt-28">
              <Routes>
                {/* Public Event Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about-me" element={<AboutPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/what-we-do" element={<WhatWeDoPage />} />
                <Route path="/lets-connect" element={<LetsConnectPage />} />
                <Route path="/register" element={<RegistrationPage />} />

                {/* Dedicated Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/images" element={<AdminDashboardPage defaultTab="IMAGES" />} />
                <Route path="/admin/home" element={<AdminDashboardPage defaultTab="HOME_PAGE" />} />
                <Route path="/admin/footer" element={<AdminDashboardPage defaultTab="FOOTER_CMS" />} />

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
