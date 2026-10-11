import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LeftLogo } from './common/LogoGroup';
import {
  Menu,
  X,
  LogOut,
  Award,
  ChevronDown,
  User,
  Activity,
  LogIn,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173';

export const Navbar = () => {
  const {
    normalUser,
    logoutUser,
    logout,
    isUserAuthenticated,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown and drawer on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Route Map', path: '/#marathon-map' },
    { name: 'FAQs', path: '/#faq' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  const handleRegisterClick = (e) => {
    if (!isUserAuthenticated) {
      e.preventDefault();
      navigate('/login?redirect=/register');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--glass-bg,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--glass-border,rgba(11,35,64,0.1))] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-4">
          
          {/* LEFT CORNER: Official Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 h-full py-2">
            <LeftLogo />
            <div className="hidden sm:block border-l border-[var(--border-color)] pl-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-[var(--orange)] block">
                MARATHON 2026
              </span>
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                Anti-Drug Movement Run
              </span>
            </div>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none ${
                  isActive(link.path)
                    ? 'text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] opacity-85'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Link back to Main Chinmaya Mission website */}
            <a
              href={MAIN_SITE_URL}
              className="text-xs xl:text-sm font-bold tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)] text-decoration-none flex items-center gap-1 transition-colors"
              title="Return to Chinmaya Mission Adoni main website"
            >
              <span>Main Mission Site</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </nav>

          {/* RIGHT CORNER: Actions & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Registration CTA */}
              <Link
                to="/register"
                onClick={handleRegisterClick}
                className="btn-primary text-decoration-none py-2 px-4 text-xs font-extrabold shadow-md flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
              >
                <Award className="w-4 h-4" />
                <span>REGISTER NOW</span>
              </Link>

              {/* Logged in User Dropdown */}
              {isUserAuthenticated && normalUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] transition-all font-bold text-xs shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-[11px]">
                      {normalUser.fullName ? normalUser.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{normalUser.fullName || 'Account'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 animate-in fade-in">
                      {/* User Card */}
                      <div className="px-4 py-2.5 border-b border-[var(--border-color)]">
                        <p className="text-xs font-black text-[var(--text-primary)] truncate">{normalUser.fullName}</p>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {normalUser.phone}</p>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-1">
                        <Link
                          to="/my-activity"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5 text-emerald-500" />
                          <span>My Passes & Activity</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t border-[var(--border-color)]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (logoutUser) logoutUser();
                            else logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 text-left transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated state */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] text-xs font-bold transition-all text-decoration-none shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[var(--orange)]" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white text-xs font-bold transition-all text-decoration-none"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
          
          {/* User Status in Mobile */}
          {isUserAuthenticated && normalUser ? (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-sm">
                  {normalUser.fullName ? normalUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-[var(--text-primary)] truncate">{normalUser.fullName}</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {normalUser.phone}</p>
                </div>
              </div>
              <Link
                to="/my-activity"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] text-[11px] font-bold text-decoration-none"
              >
                My Passes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] text-decoration-none"
              >
                <LogIn className="w-4 h-4 text-[var(--orange)]" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-xs font-bold text-[var(--orange)] text-decoration-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 pt-2 border-t border-[var(--border-color)]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold px-3 py-2 rounded-xl text-decoration-none text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                {link.name}
              </a>
            ))}

            {/* Main Mission Site link */}
            <a
              href={MAIN_SITE_URL}
              className="text-sm font-bold px-3 py-2 rounded-xl text-decoration-none text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] flex items-center justify-between"
            >
              <span>Main Mission Website</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </nav>

          {/* Mobile Bottom CTAs */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            <Link
              to="/register"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleRegisterClick(e);
              }}
              className="btn-primary w-full justify-center text-decoration-none py-3 font-extrabold text-xs flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER FOR MARATHON</span>
            </Link>

            {isUserAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (logoutUser) logoutUser();
                  else logout();
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
