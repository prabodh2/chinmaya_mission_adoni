import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authService, AUTH_KEYS, getAdminToken, getUserToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Admin Session State (Dedicated to /admin panel)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEYS.ADMIN_USER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const role = (parsed?.role || '').toLowerCase();
      return role === 'admin' || role === 'super_admin' ? parsed : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() => getAdminToken());

  // 2. User Session State (Dedicated to public website & user panel)
  const [normalUser, setNormalUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem(AUTH_KEYS.USER_USER) ||
        localStorage.getItem(AUTH_KEYS.LEGACY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [normalToken, setNormalToken] = useState(() => getUserToken());

  const [loading, setLoading] = useState(false);

  // Synchronize state across separate browser tabs via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key || e.key === AUTH_KEYS.ADMIN_TOKEN || e.key === AUTH_KEYS.ADMIN_USER) {
        try {
          const savedAdmin = localStorage.getItem(AUTH_KEYS.ADMIN_USER);
          if (savedAdmin) {
            const parsed = JSON.parse(savedAdmin);
            const role = (parsed?.role || '').toLowerCase();
            setAdminUser(role === 'admin' || role === 'super_admin' ? parsed : null);
          } else {
            setAdminUser(null);
          }
          setAdminToken(getAdminToken());
        } catch {
          setAdminUser(null);
        }
      }

      if (
        !e.key ||
        e.key === AUTH_KEYS.USER_TOKEN ||
        e.key === AUTH_KEYS.USER_USER ||
        e.key === AUTH_KEYS.LEGACY_TOKEN ||
        e.key === AUTH_KEYS.LEGACY_USER
      ) {
        try {
          const savedUser =
            localStorage.getItem(AUTH_KEYS.USER_USER) ||
            localStorage.getItem(AUTH_KEYS.LEGACY_USER);
          setNormalUser(savedUser ? JSON.parse(savedUser) : null);
          setNormalToken(getUserToken());
        } catch {
          setNormalUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check if current active page is within the Admin panel
  const isCurrentTabAdmin = () => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/admin');
  };

  // Strictly segregated context user: Admin panel ONLY gets adminUser, User panel ONLY gets normalUser
  const activeUser = useMemo(() => {
    if (isCurrentTabAdmin()) {
      return adminUser || null;
    }
    return normalUser || null;
  }, [adminUser, normalUser]);

  const activeToken = useMemo(() => {
    if (isCurrentTabAdmin()) {
      return adminToken || '';
    }
    return normalToken || '';
  }, [adminToken, normalToken]);

  // Public User Signup Handler (Always assigns normal user role)
  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.signup(formData);
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...userData } = res.data.data;
        setNormalUser(userData);
        setNormalToken(jwtToken);
        localStorage.setItem(AUTH_KEYS.USER_USER, JSON.stringify(userData));
        localStorage.setItem(AUTH_KEYS.USER_TOKEN, jwtToken);
        localStorage.setItem(AUTH_KEYS.LEGACY_USER, JSON.stringify(userData));
        localStorage.setItem(AUTH_KEYS.LEGACY_TOKEN, jwtToken);
        return { success: true, user: userData, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Signup failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create account. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Public User Login Handler (Phone + Password)
  const login = async ({ phone, email, password }) => {
    setLoading(true);
    try {
      const res = await authService.login({ phone, email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...userData } = res.data.data;
        setNormalUser(userData);
        setNormalToken(jwtToken);
        localStorage.setItem(AUTH_KEYS.USER_USER, JSON.stringify(userData));
        localStorage.setItem(AUTH_KEYS.USER_TOKEN, jwtToken);
        localStorage.setItem(AUTH_KEYS.LEGACY_USER, JSON.stringify(userData));
        localStorage.setItem(AUTH_KEYS.LEGACY_TOKEN, jwtToken);
        return { success: true, user: userData, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials. Please check your details.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Dedicated Admin Login Handler (Strictly verifies admin role)
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.loginAdmin({ email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...adminData } = res.data.data;
        const role = (adminData.role || '').toLowerCase();
        if (role !== 'admin' && role !== 'super_admin') {
          return {
            success: false,
            message: 'Access denied: Administrator permissions are required.',
          };
        }
        setAdminUser(adminData);
        setAdminToken(jwtToken);
        localStorage.setItem(AUTH_KEYS.ADMIN_USER, JSON.stringify(adminData));
        localStorage.setItem(AUTH_KEYS.ADMIN_TOKEN, jwtToken);
        return { success: true, user: adminData };
      }
      return { success: false, message: res.data?.message || 'Admin authentication failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin authentication failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile details for User
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      if (res.data?.success && res.data?.data) {
        const updated = res.data.data;
        setNormalUser((prev) => {
          const next = { ...prev, ...updated };
          localStorage.setItem(AUTH_KEYS.USER_USER, JSON.stringify(next));
          localStorage.setItem(AUTH_KEYS.LEGACY_USER, JSON.stringify(next));
          return next;
        });
        return { success: true, data: updated, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update profile',
      };
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const changePassword = async (passwords) => {
    setLoading(true);
    try {
      const res = await authService.changePassword(passwords);
      return { success: true, message: res.data?.message || 'Password changed successfully' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to change password',
      };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data from server with role verification
  const refreshUser = async () => {
    if (adminToken) {
      try {
        const res = await authService.verifySession('admin');
        if (res.data?.success && res.data?.data) {
          const role = (res.data.data.role || '').toLowerCase();
          if (role === 'admin' || role === 'super_admin') {
            setAdminUser(res.data.data);
            localStorage.setItem(AUTH_KEYS.ADMIN_USER, JSON.stringify(res.data.data));
          } else {
            logoutAdmin();
          }
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutAdmin();
        }
      }
    }

    if (normalToken) {
      try {
        const res = await authService.verifySession('user');
        if (res.data?.success && res.data?.data) {
          setNormalUser(res.data.data);
          localStorage.setItem(AUTH_KEYS.USER_USER, JSON.stringify(res.data.data));
          localStorage.setItem(AUTH_KEYS.LEGACY_USER, JSON.stringify(res.data.data));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          logoutUser();
        }
      }
    }
  };

  // Admin-Specific Logout (Leaves user session untouched)
  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    setAdminToken('');
    try {
      localStorage.removeItem(AUTH_KEYS.ADMIN_USER);
      localStorage.removeItem(AUTH_KEYS.ADMIN_TOKEN);
    } catch {}
  }, []);

  // User-Specific Logout (Leaves admin session untouched)
  const logoutUser = useCallback(() => {
    setNormalUser(null);
    setNormalToken('');
    try {
      localStorage.removeItem(AUTH_KEYS.USER_USER);
      localStorage.removeItem(AUTH_KEYS.USER_TOKEN);
      localStorage.removeItem(AUTH_KEYS.LEGACY_USER);
      localStorage.removeItem(AUTH_KEYS.LEGACY_TOKEN);
    } catch {}
  }, []);

  // Context-aware generic logout
  const logout = useCallback(() => {
    if (isCurrentTabAdmin()) {
      logoutAdmin();
    } else {
      logoutUser();
    }
  }, [logoutAdmin, logoutUser]);

  // Global Full Logout
  const logoutAll = useCallback(() => {
    logoutAdmin();
    logoutUser();
  }, [logoutAdmin, logoutUser]);

  const isAdminAuthenticated = Boolean(
    adminUser &&
    adminToken &&
    ((adminUser.role || '').toLowerCase() === 'admin' || (adminUser.role || '').toLowerCase() === 'super_admin')
  );

  const isUserAuthenticated = Boolean(normalUser && normalToken);

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        token: activeToken,
        adminUser,
        adminToken,
        normalUser,
        normalToken,
        loading,
        signup,
        login,
        loginAdmin,
        updateProfile,
        changePassword,
        refreshUser,
        logout,
        logoutAdmin,
        logoutUser,
        logoutAll,
        isAdminAuthenticated,
        isUserAuthenticated,
        isAuthenticated: isCurrentTabAdmin() ? isAdminAuthenticated : isUserAuthenticated,
        isAdmin: isAdminAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
