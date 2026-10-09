import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  Award,
  Calendar,
  Image as ImageIcon,
  Layout,
  Settings,
  MessageSquare,
  KeyRound,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, logoutAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'OVERVIEW & USERS',
      items: [
        { name: 'Dashboard Stats', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Admin Profile', path: '/admin/profile', icon: UserCheck },
      ],
    },
    {
      title: 'EVENT & REGISTRATIONS',
      items: [
        { name: 'Registrations', path: '/admin/registrations', icon: Award },
        { name: 'Event Control', path: '/admin/event-config', icon: Calendar },
      ],
    },
    {
      title: 'CONTENT MANAGEMENT (CMS)',
      items: [
        { name: 'Images & Media', path: '/admin/images', icon: ImageIcon },
        { name: 'Home Page CMS', path: '/admin/home', icon: Layout },
        { name: 'About Page CMS', path: '/admin/about', icon: Settings },
        { name: 'Activities CMS', path: '/admin/activities', icon: Sparkles },
        { name: 'Banner Uploads', path: '/admin/banners', icon: ImageIcon },
        { name: "Let's Connect", path: '/admin/lets-connect', icon: MessageSquare },
        { name: 'Footer CMS', path: '/admin/footer', icon: Settings },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { name: 'Change Password', path: '/admin/change-password', icon: KeyRound },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#0B132B)] flex flex-col selection:bg-[var(--cyan,#00B4D8)] selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary,#1C2541)]/95 backdrop-blur-md border-b border-[var(--border-color,rgba(255,255,255,0.1))] px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-[var(--bg-tertiary,#243054)] text-white lg:hidden hover:bg-[var(--cyan,#00B4D8)]/20 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--cyan,#00B4D8)] to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-[var(--cyan,#00B4D8)]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-[var(--cyan,#00B4D8)] uppercase">
                  ADMIN CONTROL PANEL
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-extrabold text-[10px]">
                  LIVE SYSTEM
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold font-heading text-white truncate max-w-[200px] sm:max-w-none">
                CHINMAYA MISSION ADONI
              </h1>
            </div>
          </div>
        </div>

        {/* Right Admin Profile & Quick Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary,#243054)]/70 border border-[var(--border-color,rgba(255,255,255,0.1))]">
            <div className="w-7 h-7 rounded-lg bg-[var(--cyan,#00B4D8)] text-white flex items-center justify-center font-black text-xs">
              {adminUser?.fullName ? adminUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">
                {adminUser?.fullName || 'Administrator'}
              </p>
              <p className="text-[10px] text-[var(--cyan,#00B4D8)] font-mono leading-tight">
                {adminUser?.email || adminUser?.phone || 'admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-xs font-bold transition-colors shadow-sm"
            title="Log out of Administrator Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main App Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[var(--bg-secondary,#1C2541)]/70 border-r border-[var(--border-color,rgba(255,255,255,0.1))] py-6 px-4 space-y-6 overflow-y-auto shrink-0">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary,#243054)]/80 border border-[var(--border-color,rgba(255,255,255,0.1))] space-y-1">
            <span className="text-[10px] font-extrabold text-[var(--text-muted,#94A3B8)] uppercase tracking-wider block">
              AUTHENTICATED AS
            </span>
            <p className="text-xs font-black text-white truncate">
              {adminUser?.fullName || 'Chinmaya Administrator'}
            </p>
            <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--cyan,#00B4D8)]/20 text-[var(--cyan,#00B4D8)] text-[10px] font-bold">
              ROLE: ADMIN
            </span>
          </div>

          <nav className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase px-3 block mb-1.5">
                  {section.title}
                </span>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[var(--cyan,#00B4D8)] to-blue-600 text-white shadow-md font-extrabold'
                              : 'text-[var(--text-muted,#94A3B8)] hover:text-white hover:bg-[var(--bg-tertiary,#243054)]/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-[var(--border-color,rgba(255,255,255,0.1))] text-center">
            <p className="text-[11px] text-[#64748B]">
              Chinmaya Mission Adoni © 2026
            </p>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[var(--bg-secondary,#1C2541)] border-r border-white/10 p-5 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--cyan,#00B4D8)]" />
                  <span className="font-heading font-black text-sm text-white">ADMIN MENU</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--bg-tertiary,#243054)] text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-tertiary,#243054)] border border-white/10">
                <p className="text-xs font-bold text-white truncate">{adminUser?.fullName}</p>
                <p className="text-[10px] text-[var(--cyan,#00B4D8)] font-mono">{adminUser?.email || adminUser?.phone}</p>
              </div>

              <nav className="space-y-5">
                {navSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase px-2 block mb-1">
                      {section.title}
                    </span>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const IconComp = item.icon;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                isActive
                                  ? 'bg-[var(--cyan,#00B4D8)] text-white'
                                  : 'text-[var(--text-muted,#94A3B8)] hover:text-white hover:bg-[var(--bg-tertiary,#243054)]'
                              }`
                            }
                          >
                            <IconComp className="w-4 h-4" />
                            <span>{item.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
