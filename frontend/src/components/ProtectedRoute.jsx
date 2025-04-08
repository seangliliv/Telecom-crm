// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem("userRole");
  
  // Check if user is logged in
  if (!userRole) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has the required role
  if (userRole !== allowedRole) {
    // Special case: Super Admin has access to all routes
    if (userRole === "superadmin") {
      return children;
    }
    
    toast.error("You don't have permission to access this page");
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;