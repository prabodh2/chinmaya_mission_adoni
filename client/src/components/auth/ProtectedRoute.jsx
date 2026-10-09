import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false, redirectTo = '/signup' }) => {
  const { isAdminAuthenticated, isUserAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin Routes Guard
  if (requireAdmin) {
    if (!isAdminAuthenticated) {
      const returnUrl = encodeURIComponent(location.pathname + location.search + location.hash);
      return <Navigate to={`/admin/login?redirect=${returnUrl}`} replace />;
    }
    return children;
  }

  // Normal User Routes Guard
  if (!isUserAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`${redirectTo}?redirect=${returnUrl}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
