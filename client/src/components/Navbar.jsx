import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LeftLogo } from './common/LogoGroup';
import {
  Menu,
  X,
  Flame,
  ExternalLink,
} from 'lucide-react';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL ||
  (import.meta.env.DEV ? 'http://localhost:5175' : 'https://marathon-chinmaya-mission-adoni.netlify.app');

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Activities', path: '/activities' },
    { name: "Let's Connect", path: '/lets-connect' },
  ];

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
          {/* LEFT CORNER: Official Chinmaya Mission Emblem */}
          <div className="flex items-center shrink-0 h-full py-2">
            <LeftLogo />
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none ${
                  isActive(link.path)
                    ? 'text-[var(--orange)] font-extrabold border-b-2 border-[var(--orange)] pb-1'
                    : 'text-[var(--text-primary)] opacity-85'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT CORNER: Direct Link to Marathon Subdomain */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={MARATHON_PORTAL_URL}
              className="btn-primary text-decoration-none py-2 px-4 text-xs font-bold shadow-md hover:scale-[1.02] transition-transform flex items-center gap-1.5"
              title="Visit Anti-Drug Movement Marathon Run 2026 Portal"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-white" />
              <span>MARATHON 2026</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center">
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
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold px-3 py-2.5 rounded-xl text-decoration-none transition-colors ${
                  isActive(link.path)
                    ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Marathon Portal CTA */}
          <div className="pt-3 border-t border-[var(--border-color)]">
            <a
              href={MARATHON_PORTAL_URL}
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center text-decoration-none py-3 font-extrabold text-xs flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>VISIT MARATHON WEBSITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
