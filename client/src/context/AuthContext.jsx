import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load existing session on initial mount / page refresh
  useEffect(() => {
    const initializeAuth = async () => {
      await storageService.init();
      const session = storageService.getAuthSession();
      if (session) {
        setCurrentUser(session);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async ({ name, email, password }) => {
    setError(null);
    try {
      const user = await storageService.registerUser({ name, email, password });
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const user = await storageService.authenticateUser({ email, password });
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    }
  };

  const loginAsDemo = async () => {
    setError(null);
    try {
      const demoUser = await storageService.getDemoUser();
      setCurrentUser(demoUser);
      return demoUser;
    } catch (err) {
      setError('Demo login failed.');
      throw err;
    }
  };

  const logout = () => {
    storageService.clearAuthSession();
    setCurrentUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        loginAsDemo,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
