import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardStatsPage } from './pages/DashboardStatsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AdminProfilePage } from './pages/AdminProfilePage';
import { RegistrationsPage } from './pages/RegistrationsPage';
import { EventConfigPage } from './pages/EventConfigPage';
import { ImagesMediaPage } from './pages/ImagesMediaPage';
import { HomePageCmsPage } from './pages/HomePageCmsPage';
import { AboutPageCmsPage } from './pages/AboutPageCmsPage';
import { ActivitiesCmsPage } from './pages/ActivitiesCmsPage';
import { BannersPage } from './pages/BannersPage';
import { LetsConnectPage } from './pages/LetsConnectPage';
import { FooterCmsPage } from './pages/FooterCmsPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';

export function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public Administrator Login */}
          <Route path="/login" element={<AdminLoginPage />} />

          {/* Protected Administrator Dashboard & CMS Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Navigate to="/dashboard" replace />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <DashboardStatsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserManagementPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProfilePage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/registrations"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <RegistrationsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/event-config"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <EventConfigPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/images"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ImagesMediaPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-cms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HomePageCmsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about-cms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AboutPageCmsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities-cms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ActivitiesCmsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/banners"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <BannersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lets-connect"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <LetsConnectPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/footer-cms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <FooterCmsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ChangePasswordPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
