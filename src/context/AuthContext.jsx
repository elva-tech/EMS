import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check localStorage on initial load to keep user logged in
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_auth') === 'true';
  });
  
  const login = (username, password) => {
    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      // Save to browser storage
      localStorage.setItem('is_auth', 'true');
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    // Clear browser storage
    localStorage.removeItem('is_auth');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};