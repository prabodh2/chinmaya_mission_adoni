import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Website Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { LetsConnectPage } from './pages/LetsConnectPage';
import { RegistrationPage } from './pages/RegistrationPage';

// Public Authentication Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// User Account Pages (Protected)
import { ProfilePage } from './pages/ProfilePage';
import { MyActivityPage } from './pages/MyActivityPage';

// Admin Pages (Standalone Layout & Isolated Authentication)
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL ||
  (import.meta.env.DEV ? 'http://localhost:5175' : 'https://marathon-chinmaya-mission-adoni.netlify.app');

function MarathonPortalRedirect({ path = '' }) {
  useEffect(() => {
    window.location.href = `${MARATHON_PORTAL_URL}${path}`;
  }, [path]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-[var(--text-primary)]">
        Redirecting to Anti-Drug Marathon Run 2026 Portal...
      </p>
      <a
        href={`${MARATHON_PORTAL_URL}${path}`}
        className="mt-3 text-xs font-bold text-[var(--orange)] underline"
      >
        Click here if not redirected automatically
      </a>
    </div>
  );
}

// Public Layout containing Public Navbar and Footer
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[var(--orange)] selection:text-white w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

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
          <Routes>
            {/* 1. Main Chinmaya Mission Website Pages */}
            <Route element={<PublicLayout />}>
              {/* Home page is not required for now; redirect root to About */}
              <Route path="/" element={<Navigate to="/about" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-me" element={<AboutPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/lets-connect" element={<LetsConnectPage />} />
              
              {/* Marathon portal redirects (marathon is hosted separately) */}
              <Route path="/register" element={<MarathonPortalRedirect path="/register" />} />
              <Route path="/login" element={<MarathonPortalRedirect path="/login" />} />
              <Route path="/signup" element={<MarathonPortalRedirect path="/signup" />} />
              <Route path="/profile" element={<MarathonPortalRedirect path="/profile" />} />
              <Route path="/my-activity" element={<MarathonPortalRedirect path="/my-activity" />} />
              <Route path="/my-registrations" element={<MarathonPortalRedirect path="/my-activity" />} />
            </Route>

            {/* 2. Standalone Admin Login (NO Public Navbar, NO Public Footer, NO Normal User Pill) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* 3. Standalone Admin Control Panel (Strict RBAC, Dedicated Admin Navigation) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="STATS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="STATS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="USERS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="ADMIN_PROFILE" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="REGISTRATIONS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/event-config"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="EVENT_CONFIG" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/images"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="IMAGES" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/home"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="HOME_PAGE" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/about"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="ABOUT_CMS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activities"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="ACTIVITIES" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/banners"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="BANNERS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/lets-connect"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="LETS_CONNECT" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/footer"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="FOOTER_CMS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/change-password"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage defaultTab="PASSWORD" />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect to About */}
            <Route path="*" element={<Navigate to="/about" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
