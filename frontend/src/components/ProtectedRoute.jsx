// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
