import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homepageService } from '../services/api';
import { LogoGroup, LeftLogo } from './common/LogoGroup';
import {
  Flame,
  Menu,
  X,
  LogOut,
  Shield,
  Award,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
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
      .catch(() => { });
  }, [location.pathname]);

  const allNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Activities', path: '/activities' },
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--glass-bg,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--glass-border,rgba(11,35,64,0.1))] shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">

          {/* LEFT CORNER: Official Logo Emblem */}
          <div className="flex items-center shrink-0">
            <LeftLogo />
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none ${isActive(link.path)
                    ? 'text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] opacity-85'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT CORNER: Action Buttons + Logo 2 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Registration CTA */}
              <Link to="/register" className="btn-primary text-decoration-none py-2 px-4 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>REGISTER NOW</span>
              </Link>

              {/* Active Admin Session Menu */}
              {user && isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/30 text-[var(--cyan)] transition-all font-extrabold text-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50">
                      <div className="px-4 py-2 border-b border-[var(--border-color)]">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{user.fullName || 'Admin User'}</p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[var(--cyan)] hover:bg-[var(--bg-tertiary)] text-decoration-none"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 text-left border-t border-[var(--border-color)] mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Admin</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Controls */}
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
        <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold px-3 py-2 rounded-xl text-decoration-none ${isActive(link.path)
                    ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[var(--border-color)] flex flex-col gap-3">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center text-decoration-none"
            >
              <Award className="w-5 h-5" />
              <span>REGISTER FOR MARATHON</span>
            </Link>

            {user && isAdmin && (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[var(--cyan)]/15 text-sm font-bold text-[var(--cyan)] text-decoration-none"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
