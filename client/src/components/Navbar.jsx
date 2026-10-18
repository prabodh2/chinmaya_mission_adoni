import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LeftLogo } from './common/LogoGroup';
import {
  Menu,
  X,
  Flame,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const MARATHON_PORTAL_URL =
  import.meta.env.VITE_MARATHON_URL || 'https://marathon-chinmaya-mission-adoni.vercel.app/';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [desktopTemplesOpen, setDesktopTemplesOpen] = useState(false);
  const [mobileTemplesOpen, setMobileTemplesOpen] = useState(false);

  const aboutTimeoutRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const templesTimeoutRef = useRef(null);
  const templesDropdownRef = useRef(null);
  const location = useLocation();

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopAboutOpen(false);
    setMobileAboutOpen(false);
    setDesktopTemplesOpen(false);
    setMobileTemplesOpen(false);
  }, [location.pathname]);

  // Click outside listener for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setDesktopAboutOpen(false);
      }
      if (templesDropdownRef.current && !templesDropdownRef.current.contains(event.target)) {
        setDesktopTemplesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    setDesktopAboutOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setDesktopAboutOpen(false);
    }, 150);
  };

  const handleTemplesMouseEnter = () => {
    if (templesTimeoutRef.current) {
      clearTimeout(templesTimeoutRef.current);
    }
    setDesktopTemplesOpen(true);
  };

  const handleTemplesMouseLeave = () => {
    templesTimeoutRef.current = setTimeout(() => {
      setDesktopTemplesOpen(false);
    }, 150);
  };

  const isTempleActive = (path) => {
    if (path === '/chinmaya-sanjeevaraya-temple') {
      return (
        location.pathname === '/chinmaya-sanjeevaraya-temple' ||
        location.pathname === '/chinmaya-sanjeevaraya' ||
        location.pathname === '/sanjeevaraya-temple'
      );
    }
    if (path === '/sri-shantha-mamleshwara-swami-temple') {
      return (
        location.pathname === '/sri-shantha-mamleshwara-swami-temple' ||
        location.pathname === '/shri-shantamalleshwara-swami-temple' ||
        location.pathname === '/shantamalleshwara-temple' ||
        location.pathname === '/shanta-malleshwara-temple'
      );
    }
    return location.pathname === path;
  };

  const isAnyTempleActive =
    isTempleActive('/chinmaya-sanjeevaraya-temple') ||
    isTempleActive('/sri-shantha-mamleshwara-swami-temple');

  const isWhoAreWeActive =
    location.pathname === '/who-are-we' ||
    location.pathname === '/who-we-are' ||
    location.pathname === '/whoarewe';

  const isAboutActive =
    location.pathname === '/about' ||
    location.pathname === '/about-us' ||
    location.pathname === '/aboutus' ||
    location.pathname === '/about-me' ||
    isWhoAreWeActive;

  const navItems = [
    { name: 'Home', shortName: 'Home', path: '/' },
    {
      name: 'About',
      shortName: 'About',
      path: '/about',
      type: 'dropdown',
      id: 'about',
      items: [
        {
          name: 'Who Are We',
          path: '/who-are-we',
        },
      ],
    },
    { name: 'Events', shortName: 'Events', path: '/events' },
    {
      name: 'Temples',
      shortName: 'Temples',
      type: 'dropdown',
      id: 'temples',
      items: [
        {
          name: 'Chinmaya Sanjeevaraya Temple',
          path: '/chinmaya-sanjeevaraya-temple',
        },
        {
          name: 'Shri Shantamalleshwara Swami Temple',
          path: '/shri-shantamalleshwara-swami-temple',
        },
      ],
    },
    { name: 'Gallery', shortName: 'Gallery', path: '/gallery' },
    { name: "Let's Connect", shortName: "Let's Connect", path: '/lets-connect' },
    {
      name: 'Support our mission',
      shortName: 'Support',
      path: '/support-our-mission',
    },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.hash === path.substring(1);
    }
    if (path === '/about') {
      return isAboutActive;
    }
    if (path === '/who-are-we') {
      return isWhoAreWeActive;
    }
    if (path === '/events') {
      return location.pathname === '/events' || location.pathname === '/activities';
    }
    if (path === '/support-our-mission') {
      return (
        location.pathname === '/support-our-mission' ||
        location.pathname === '/support-mission' ||
        location.pathname === '/supportourmission'
      );
    }
    if (path === '/gallery') {
      return (
        location.pathname === '/gallery' ||
        location.pathname === '/images' ||
        location.pathname === '/image' ||
        location.pathname === '/sacred-gallery'
      );
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--glass-bg,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--glass-border,rgba(11,35,64,0.1))] shadow-sm transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-4">
          {/* LEFT CORNER: Official Chinmaya Mission Emblem */}
          <div className="flex items-center shrink-0 h-full py-2">
            <LeftLogo />
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 2xl:gap-6">
            {navItems.map((item) => {
              if (item.id === 'about') {
                return (
                  <div
                    key={item.name}
                    ref={aboutDropdownRef}
                    className="relative flex items-center h-full py-2"
                    onMouseEnter={handleAboutMouseEnter}
                    onMouseLeave={handleAboutMouseLeave}
                  >
                    <Link
                      to="/about"
                      onClick={() => setDesktopAboutOpen(false)}
                      className={`flex items-center gap-1 text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none whitespace-nowrap ${
                        isAboutActive
                          ? 'text-[var(--orange)] font-extrabold border-b-2 border-[var(--orange)] pb-1'
                          : 'text-[var(--text-primary)] opacity-85'
                      }`}
                      aria-expanded={desktopAboutOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          desktopAboutOpen ? 'rotate-180 text-[var(--orange)]' : 'text-current'
                        }`}
                      />
                    </Link>

                    {/* Desktop About Dropdown Menu Panel */}
                    {desktopAboutOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 min-w-[200px] sm:min-w-[220px] bg-white rounded-xl shadow-xl border border-[var(--border-color,#EBD6A2)]/70 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {item.items.map((subItem) => {
                          const active = isWhoAreWeActive;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={() => setDesktopAboutOpen(false)}
                              className={`block px-4 py-2.5 text-xs xl:text-sm font-bold transition-colors text-decoration-none whitespace-normal leading-snug ${
                                active
                                  ? 'text-[var(--orange)] bg-[var(--orange)]/10 font-extrabold'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary,#FFF5E5)] hover:text-[var(--orange)]'
                              }`}
                              role="menuitem"
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'temples') {
                return (
                  <div
                    key={item.name}
                    ref={templesDropdownRef}
                    className="relative flex items-center h-full py-2"
                    onMouseEnter={handleTemplesMouseEnter}
                    onMouseLeave={handleTemplesMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setDesktopTemplesOpen((prev) => !prev)}
                      className={`flex items-center gap-1 text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] bg-transparent border-none p-0 cursor-pointer whitespace-nowrap focus:outline-none ${
                        isAnyTempleActive
                          ? 'text-[var(--orange)] font-extrabold border-b-2 border-[var(--orange)] pb-1'
                          : 'text-[var(--text-primary)] opacity-85'
                      }`}
                      aria-expanded={desktopTemplesOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          desktopTemplesOpen ? 'rotate-180 text-[var(--orange)]' : 'text-current'
                        }`}
                      />
                    </button>

                    {/* Desktop Dropdown Menu Panel */}
                    {desktopTemplesOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 min-w-[280px] sm:min-w-[310px] bg-white rounded-xl shadow-xl border border-[var(--border-color,#EBD6A2)]/70 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {item.items.map((subItem) => {
                          const active = isTempleActive(subItem.path);
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={() => setDesktopTemplesOpen(false)}
                              className={`block px-4 py-2.5 text-xs xl:text-sm font-bold transition-colors text-decoration-none whitespace-normal leading-snug ${
                                active
                                  ? 'text-[var(--orange)] bg-[var(--orange)]/10 font-extrabold'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary,#FFF5E5)] hover:text-[var(--orange)]'
                              }`}
                              role="menuitem"
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none whitespace-nowrap ${
                    isActive(item.path)
                      ? 'text-[var(--orange)] font-extrabold border-b-2 border-[var(--orange)] pb-1'
                      : 'text-[var(--text-primary)] opacity-85'
                  }`}
                >
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">{item.shortName || item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT CORNER: Direct Link to Marathon Subdomain */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={MARATHON_PORTAL_URL}
              className="btn-primary text-decoration-none py-2 px-3.5 xl:px-4 text-xs font-bold shadow-md hover:scale-[1.02] transition-transform flex items-center gap-1.5 whitespace-nowrap"
              title="Visit Anti-Drug Movement Marathon Run 2026 Portal"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-white shrink-0" />
              <span>MARATHON 2026</span>
              <ExternalLink className="w-3 h-3 text-white/80 shrink-0" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => {
                  if (!mobileMenuOpen) {
                    if (isAnyTempleActive) {
                      setMobileTemplesOpen(true);
                    }
                    if (isWhoAreWeActive) {
                      setMobileAboutOpen(true);
                    }
                  }
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none cursor-pointer"
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
        <div className="lg:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              if (item.id === 'about') {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between text-sm font-bold px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                        isAboutActive
                          ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                      aria-expanded={mobileAboutOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileAboutOpen ? 'rotate-180 text-[var(--orange)]' : 'text-current'
                        }`}
                      />
                    </button>
                    {mobileAboutOpen && (
                      <div className="pl-3 pr-1 py-1.5 flex flex-col space-y-1 ml-2 my-1 border-l-2 border-[var(--orange)]/30">
                        {item.items.map((subItem) => {
                          const active = isWhoAreWeActive;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={() => {
                                setMobileAboutOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-lg text-decoration-none transition-colors ${
                                active
                                  ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'temples') {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileTemplesOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between text-sm font-bold px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                        isAnyTempleActive
                          ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                      aria-expanded={mobileTemplesOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileTemplesOpen ? 'rotate-180 text-[var(--orange)]' : 'text-current'
                        }`}
                      />
                    </button>
                    {mobileTemplesOpen && (
                      <div className="pl-3 pr-1 py-1.5 flex flex-col space-y-1 ml-2 my-1 border-l-2 border-[var(--orange)]/30">
                        {item.items.map((subItem) => {
                          const active = isTempleActive(subItem.path);
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={() => {
                                setMobileTemplesOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-lg text-decoration-none transition-colors ${
                                active
                                  ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold px-3 py-2.5 rounded-xl text-decoration-none transition-colors ${
                    isActive(item.path)
                      ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
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


