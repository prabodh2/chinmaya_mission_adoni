import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Shield } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialChecking } = useAdminAuth();
  const location = useLocation();

  if (initialChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B132B] text-white space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#00B4D8] flex items-center justify-center animate-pulse shadow-lg shadow-[#00B4D8]/30">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <p className="text-xs font-bold tracking-widest text-[#94A3B8] uppercase">
          Verifying Administrator Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  return children;
};
