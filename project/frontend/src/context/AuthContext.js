import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // ── Fetch current user from /api/users/me whenever token changes ──────────
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          // Token invalid / expired — clear everything
          logout();
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback((authData) => {
    localStorage.setItem('token', authData.accessToken);
    setToken(authData.accessToken);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
