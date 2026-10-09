import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('marathon_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('marathon_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Public User Signup Handler
  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.signup(formData);
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...userData } = res.data.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('marathon_user', JSON.stringify(userData));
        localStorage.setItem('marathon_token', jwtToken);
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

  // Centralized User Login Handler (Phone + Password)
  const login = async ({ phone, email, password }) => {
    setLoading(true);
    try {
      const res = await authService.login({ phone, email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...userData } = res.data.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('marathon_user', JSON.stringify(userData));
        localStorage.setItem('marathon_token', jwtToken);
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

  // Dedicated Admin Login Handler
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.loginAdmin({ email, password });
      if (res.data?.success && res.data?.data) {
        const { token: jwtToken, ...adminData } = res.data.data;
        setUser(adminData);
        setToken(jwtToken);
        localStorage.setItem('marathon_user', JSON.stringify(adminData));
        localStorage.setItem('marathon_token', jwtToken);
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

  // Update Profile details
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      if (res.data?.success && res.data?.data) {
        const updated = res.data.data;
        setUser((prev) => ({ ...prev, ...updated }));
        localStorage.setItem('marathon_user', JSON.stringify({ ...user, ...updated }));
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
    if (!token) return;
    try {
      const res = await authService.getMe();
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('marathon_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      // If token expired, clear session
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('marathon_user');
    localStorage.removeItem('marathon_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        loginAdmin,
        updateProfile,
        changePassword,
        refreshUser,
        logout,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
