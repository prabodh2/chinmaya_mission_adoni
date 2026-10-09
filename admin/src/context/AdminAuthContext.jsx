import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  adminAuthService,
  getStoredAdminToken,
  getStoredAdminUser,
  setStoredAdminSession,
  clearStoredAdminSession,
  ADMIN_AUTH_KEYS,
} from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => getStoredAdminUser());
  const [adminToken, setAdminToken] = useState(() => getStoredAdminToken());
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);

  // Synchronize across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key || e.key === ADMIN_AUTH_KEYS.TOKEN || e.key === ADMIN_AUTH_KEYS.USER) {
        setAdminUser(getStoredAdminUser());
        setAdminToken(getStoredAdminToken());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Validate server session on mount
  useEffect(() => {
    const checkServerAuth = async () => {
      const token = getStoredAdminToken();
      if (!token) {
        setInitialChecking(false);
        return;
      }

      try {
        const res = await adminAuthService.getProfile();
        if (res.data?.success && res.data?.data) {
          const user = res.data.data;
          const role = (user.role || '').toLowerCase();
          if (role === 'admin') {
            setAdminUser(user);
            setStoredAdminSession(token, user);
          } else {
            // Demoted or not an admin
            clearStoredAdminSession();
            setAdminUser(null);
            setAdminToken('');
          }
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearStoredAdminSession();
          setAdminUser(null);
          setAdminToken('');
        }
      } finally {
        setInitialChecking(false);
      }
    };

    checkServerAuth();
  }, []);

  // Admin Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await adminAuthService.loginAdmin({ email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...userData } = res.data.data;
        const role = (userData.role || '').toLowerCase();

        if (role !== 'admin') {
          return {
            success: false,
            message: 'Access denied: Administrator permissions are required.',
          };
        }

        setAdminUser(userData);
        setAdminToken(jwtToken);
        setStoredAdminSession(jwtToken, userData);
        return { success: true, user: userData };
      }
      return {
        success: false,
        message: res.data?.message || 'Administrator authentication failed.',
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Authentication failed. Please verify administrator credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout
  const logout = useCallback(() => {
    clearStoredAdminSession();
    setAdminUser(null);
    setAdminToken('');
  }, []);

  // Update Profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await adminAuthService.updateProfile(profileData);
      if (res.data?.success && res.data?.data) {
        const updated = res.data.data;
        setAdminUser(updated);
        setStoredAdminSession(adminToken, updated);
        return { success: true, user: updated, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Profile update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update admin profile',
      };
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      const res = await adminAuthService.changePassword(passwordData);
      return {
        success: true,
        message: res.data?.message || 'Password changed successfully',
      };
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
  const refreshAdminUser = async () => {
    try {
      const res = await adminAuthService.getProfile();
      if (res.data?.success && res.data?.data) {
        const user = res.data.data;
        setAdminUser(user);
        setStoredAdminSession(adminToken, user);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  const isAdminAuthenticated = Boolean(
    adminUser &&
    adminToken &&
    (adminUser.role || '').toLowerCase() === 'admin'
  );

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAuthenticated: isAdminAuthenticated,
        isAdmin: isAdminAuthenticated,
        loading,
        initialChecking,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshAdminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
export default AdminAuthContext;
