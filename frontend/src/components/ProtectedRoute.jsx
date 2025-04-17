// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../utils/AuthService';

const ProtectedRoute = ({ children, userRole, allowedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Use AuthService to check authentication status
    const isLoggedIn = AuthService.isAuthenticated();
    const storedUserRole = AuthService.getUserRole();
    
    if (!isLoggedIn || !storedUserRole) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // User is authenticated
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access
  if (userRole !== allowedRole && 
      !(userRole === 'superadmin' && (allowedRole === 'admin' || allowedRole === 'user')) && 
      !(userRole === 'admin' && allowedRole === 'user')) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }
  
  // If authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;