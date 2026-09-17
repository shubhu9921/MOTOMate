import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setRoles(parsedUser.role ? [parsedUser.role] : []);
        setPermissions(parsedUser.permissions || []);
        setIsAuthenticated(true);
      } catch (e) {
        // Handle invalid JSON
      }
    } else {
      setCurrentUser(null);
      setRoles([]);
      setPermissions([]);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Initial check on load
    checkAuthStatus();
    setLoading(false);

    // Listen for changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    setRoles(userData.role ? [userData.role] : []);
    setPermissions(userData.permissions || []);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setRoles([]);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    return roles.includes(role);
  };

  const hasAnyRole = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.some(role => roles.includes(role));
  };

  const hasPermission = (permission) => {
    // SUPER_ADMIN has all permissions implicitly or explicitly, but for safety:
    if (roles.includes('SUPER_ADMIN')) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (allowedPermissions) => {
    if (roles.includes('SUPER_ADMIN')) return true;
    if (!allowedPermissions || allowedPermissions.length === 0) return true;
    return allowedPermissions.some(perm => permissions.includes(perm));
  };

  const hasAllPermissions = (requiredPermissions) => {
    if (roles.includes('SUPER_ADMIN')) return true;
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every(perm => permissions.includes(perm));
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    roles,
    permissions,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
