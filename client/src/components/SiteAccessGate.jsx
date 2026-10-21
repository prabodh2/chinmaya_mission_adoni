import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { getAdminToken } from '../services/api';

const COMING_SOON_PATHS = ['/coming-soon', '/comming-soon', '/launch', '/teaser'];

export function SiteAccessGate({ children }) {
  const { isLive, loading, toggleLive } = useSiteSettings();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Always allow Admin routes unconditionally so admins can manage and toggle the site
  if (pathname.startsWith('/admin')) {
    return (
      <>
        {children}
        <AdminStatusToggle isLive={isLive} onToggle={toggleLive} />
      </>
    );
  }

  // 2. Loading state while checking site settings from API
  if (loading) {
    return (
      <div className="min-h-screen bg-[#161a33] flex flex-col items-center justify-center text-amber-200">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-light tracking-widest text-[#efe8dc]">CHINMAYA MISSION ADONI</p>
      </div>
    );
  }

  const isComingSoonRoute = COMING_SOON_PATHS.includes(pathname);

  // 3. When isLive === false (Coming Soon mode active):
  //    Block all public routes and display the Coming Soon page
  if (!isLive) {
    if (isComingSoonRoute) {
      return (
        <>
          <ComingSoonPage />
          <AdminStatusToggle isLive={isLive} onToggle={toggleLive} />
        </>
      );
    }
    // Blocked: Any attempt to access public routes redirects to /coming-soon
    return <Navigate to="/coming-soon" replace />;
  }

  // 4. When isLive === true (Live mode active):
  //    Display everything EXCEPT the coming soon page (which redirects to /)
  if (isLive && isComingSoonRoute) {
    return <Navigate to="/" replace />;
  }

  // Normal live website rendering
  return (
    <>
      {children}
      <AdminStatusToggle isLive={isLive} onToggle={toggleLive} />
    </>
  );
}

/**
 * Floating quick-toggle badge visible to administrators or for testing.
 */
function AdminStatusToggle({ isLive, onToggle }) {
  const hasAdmin = Boolean(getAdminToken());
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Only render if an admin session token is found
  if (!hasAdmin) return null;

  const handleToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle();
    } catch (err) {
      alert('Failed to toggle status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999999] flex items-center gap-2 bg-[#0d1322] border border-amber-500/40 text-white px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono">
      <span className="flex items-center gap-1.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="font-semibold text-slate-200">
          Mode: <strong className={isLive ? 'text-emerald-400' : 'text-amber-300'}>{isLive ? 'LIVE' : 'COMING SOON'}</strong>
        </span>
      </span>
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full transition-colors cursor-pointer text-[11px]"
      >
        {isUpdating ? '...' : isLive ? 'Switch to Coming Soon' : 'Switch to Live'}
      </button>
    </div>
  );
}

export default SiteAccessGate;
