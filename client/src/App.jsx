import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { LetsConnectPage } from './pages/LetsConnectPage';
import { RegistrationPage } from './pages/RegistrationPage';

// Authentication Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// User Account Pages (Protected)
import { ProfilePage } from './pages/ProfilePage';
import { MyActivityPage } from './pages/MyActivityPage';

// Admin Pages
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
          <div className="min-h-screen flex flex-col justify-between selection:bg-[var(--orange)] selection:text-white w-full max-w-full overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-18 sm:pt-22 lg:pt-26 w-full max-w-full overflow-x-hidden">
              <Routes>
                {/* Public Routes (Freely Accessible) */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about-me" element={<AboutPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/lets-connect" element={<LetsConnectPage />} />
                
                {/* Protected Registration Route (Requires Signup / Login First) */}
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute redirectTo="/signup">
                      <RegistrationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected User Account Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-activity"
                  element={
                    <ProtectedRoute>
                      <MyActivityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-registrations"
                  element={
                    <ProtectedRoute>
                      <MyActivityPage />
                    </ProtectedRoute>
                  }
                />


                {/* Dedicated Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage />
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
                  path="/admin/footer"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage defaultTab="FOOTER_CMS" />
                    </ProtectedRoute>
                  }
                />

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
