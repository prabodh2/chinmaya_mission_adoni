import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homepageService } from '../services/api';
import { LeftLogo } from './common/LogoGroup';
import {
  Menu,
  X,
  LogOut,
  Shield,
  Award,
  ChevronDown,
  User,
  Activity,
  HeartHandshake,
  LogIn,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isHomeEnabled, setIsHomeEnabled] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    homepageService
      .getPublicHomepage()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setIsHomeEnabled(res.data.data.isEnabled !== false);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const allNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Activities', path: '/activities' },
    { name: 'Services', path: '/services' },
    { name: "Let's Connect", path: '/lets-connect' },
  ];

  const navLinks = isHomeEnabled ? allNavLinks : allNavLinks.filter((link) => link.path !== '/');

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--glass-bg,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--glass-border,rgba(11,35,64,0.1))] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-4">
          {/* LEFT CORNER: Official Logo Emblem */}
          <div className="flex items-center shrink-0 h-full py-2">
            <LeftLogo />
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none ${
                  isActive(link.path)
                    ? 'text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] opacity-85'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT CORNER: Actions & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Registration CTA */}
              <Link to="/register" className="btn-primary text-decoration-none py-2 px-4 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>REGISTER NOW</span>
              </Link>

              {/* Logged in User Dropdown */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] transition-all font-bold text-xs shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-[11px]">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{user.fullName || 'Account'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 animate-in fade-in">
                      {/* User Card */}
                      <div className="px-4 py-2.5 border-b border-[var(--border-color)]">
                        <p className="text-xs font-black text-[var(--text-primary)] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {user.phone}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[var(--cyan)]/20 text-[var(--cyan)] text-[9px] font-black uppercase">
                            Admin Access
                          </span>
                        )}
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/my-activity"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5 text-emerald-500" />
                          <span>My Activity & Passes</span>
                        </Link>

                        <Link
                          to="/services?offer=true"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--cyan)] text-decoration-none transition-colors"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-[var(--cyan)]" />
                          <span>Offer a Service</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--cyan)] hover:bg-[var(--bg-tertiary)] text-decoration-none transition-colors border-t border-[var(--border-color)] mt-1"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t border-[var(--border-color)]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
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
                /* Logged out state */
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] text-xs font-bold transition-all text-decoration-none shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-[var(--orange)]" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-2 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* User Status in Mobile */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-[var(--text-primary)] truncate">{user.fullName}</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {user.phone}</p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] text-[11px] font-bold text-decoration-none"
              >
                Profile
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
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold px-3 py-2 rounded-xl text-decoration-none ${
                  isActive(link.path)
                    ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/my-activity"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold px-3 py-2 rounded-xl text-decoration-none flex items-center gap-2 ${
                    isActive('/my-activity')
                      ? 'bg-emerald-500/15 text-emerald-500 font-extrabold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>My Activity & Passes</span>
                </Link>

                <Link
                  to="/services?offer=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold px-3 py-2 rounded-xl text-decoration-none flex items-center gap-2 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  <HeartHandshake className="w-4 h-4 text-[var(--cyan)]" />
                  <span>Offer A Service</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Bottom CTAs */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center text-decoration-none py-3 font-bold text-xs"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER FOR MARATHON</span>
            </Link>

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--cyan)]/15 text-xs font-bold text-[var(--cyan)] text-decoration-none"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
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

export default Navbar;
