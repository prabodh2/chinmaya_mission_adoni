import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Marathon Subdomain Pages
import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyActivityPage } from './pages/MyActivityPage';
import { VerifyPassPage } from './pages/VerifyPassPage';

// Marathon Layout containing Marathon Navbar and Footer
function MarathonLayout() {
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
            <Route element={<MarathonLayout />}>
              {/* Marathon Landing Page */}
              <Route path="/" element={<HomePage />} />

              {/* Marathon Registration Page (Protected - requires authentication) */}
              <Route
                path="/register"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <RegistrationPage />
                  </ProtectedRoute>
                }
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* User Account & Passes */}
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

              {/* Entry Pass Verification Route (Opaque / QR Scan verification) */}
              <Route path="/verify-pass/:passId" element={<VerifyPassPage />} />
              <Route path="/pass/:passId/verify" element={<VerifyPassPage />} />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
