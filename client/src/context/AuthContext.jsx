import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { authService, AUTH_KEYS, getAdminToken, getUserToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Admin Session State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEYS.ADMIN_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() => getAdminToken());

  // User Session State
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
          setAdminUser(savedAdmin ? JSON.parse(savedAdmin) : null);
          setAdminToken(getAdminToken());
        } catch {}
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
        } catch {}
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

  // Dynamic context user: returns adminUser if on /admin, otherwise normalUser (with smart fallbacks)
  const activeUser = useMemo(() => {
    if (isCurrentTabAdmin()) {
      return adminUser || normalUser || null;
    }
    return normalUser || adminUser || null;
  }, [adminUser, normalUser]);

  const activeToken = useMemo(() => {
    if (isCurrentTabAdmin()) {
      return adminToken || normalToken || '';
    }
    return normalToken || adminToken || '';
  }, [adminToken, normalToken]);

  // Public User Signup Handler
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

  // User Login Handler (Phone + Password)
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

  // Dedicated Admin Login Handler (Does NOT overwrite user session)
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.loginAdmin({ email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...adminData } = res.data.data;
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
        message: err.response?.data?.message || 'Admin authentication failed',
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

  // Refresh user data from server
  const refreshUser = async () => {
    if (adminToken) {
      try {
        const res = await authService.verifySession('admin');
        if (res.data?.success && res.data?.data) {
          setAdminUser(res.data.data);
          localStorage.setItem(AUTH_KEYS.ADMIN_USER, JSON.stringify(res.data.data));
        }
      } catch (err) {
        if (err.response?.status === 401) {
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

  const isAdminAuthenticated = Boolean(adminUser && adminToken && adminUser.role === 'admin');
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
        isAuthenticated: isCurrentTabAdmin() ? isAdminAuthenticated : (isUserAuthenticated || isAdminAuthenticated),
        isAdmin: isCurrentTabAdmin() ? isAdminAuthenticated : Boolean(adminUser?.role === 'admin'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
