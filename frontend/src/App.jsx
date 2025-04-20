// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "./utils/AuthService";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomersManagement from "./pages/admin/CustomersManagement";
import Invoice from "./pages/admin/Invoice";
import NetworkStatus from "./pages/admin/NetworkStatus";
import SalesMarketing from "./pages/admin/SalesMarketing";
import PlansManagement from "./pages/admin/PlansManagement";
import SubscriptionBilling from "./pages/admin/SubscriptionBilling";
import UserAndRole from "./pages/admin/UserAndRole";
import SupportTickets from "./pages/admin/SupportTickets";
import Settings from "./pages/admin/setting";

// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import UserManagement from "./pages/superadmin/UserManagement";
import SystemSettings from "./pages/superadmin/SystemSettings";
import AuditLogs from "./pages/superadmin/AuditLogs";
import SuperAdminReports from "./pages/superadmin/SuperAdminReports";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserBilling from "./pages/user/UserBilling";
import UserSupportCenter from "./pages/user/UserSupportCenter";
import UserServices from "./pages/user/UserServices";
import UserReports from "./pages/user/UserReports";

const App = () => {
  // Log initial auth state on app load for debugging
  useEffect(() => {
    const isLoggedIn = AuthService.isAuthenticated();
    const userRole = AuthService.getUserRole();
    console.log("App initialized with auth state:", { isLoggedIn, userRole });
    
    // If the role is invalid or null but user is logged in, fix it
    if (isLoggedIn && (!userRole || userRole === "null" || userRole === "undefined")) {
      console.log("Invalid role detected, setting to default 'user'");
      localStorage.setItem('userRole', 'user');
    }
  }, []);

  // Get safe role (handle null/undefined cases)
  const getSafeRole = () => {
    const role = AuthService.getUserRole();
    if (!role || role === "null" || role === "undefined") {
      return "user"; // Default to user if role is missing or invalid
    }
    return role;
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            AuthService.isAuthenticated() ? 
            <Navigate to={`/${getSafeRole()}/dashboard`} replace /> : 
            <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            AuthService.isAuthenticated() ? 
            <Navigate to={`/${getSafeRole()}/dashboard`} replace /> : 
            <Register />
          } 
        /> 
        <Route 
          path="/forgot-password" 
          element={
            AuthService.isAuthenticated() ? 
            <Navigate to={`/${getSafeRole()}/dashboard`} replace /> : 
            <ForgotPassword />
          } 
        />
        
        {/* Super Admin Routes */}
        <Route path="/superadmin/*" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="reports" element={<SuperAdminReports />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="invoices" element={<Invoice />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="network" element={<NetworkStatus />} />
          <Route path="sales" element={<SalesMarketing />} />
          <Route path="plans" element={<PlansManagement />} />
          <Route path="subscription" element={<SubscriptionBilling />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="invoices" element={<Invoice />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="network" element={<NetworkStatus />} />
          <Route path="sales" element={<SalesMarketing />} />
          <Route path="plans" element={<PlansManagement />} />
          <Route path="subscription" element={<SubscriptionBilling />} />
          <Route path="users" element={<UserAndRole />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* User Routes */}
        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="billing" element={<UserBilling />} />
          <Route path="support" element={<UserSupportCenter />} />
          <Route path="services" element={<UserServices />} />
          <Route path="reports" element={<UserReports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Handle null/invalid role case */}
        <Route path="/null/*" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/undefined/*" element={<Navigate to="/user/dashboard" replace />} />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            AuthService.isAuthenticated() 
              ? <Navigate to={`/${getSafeRole()}/dashboard`} replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all other routes */}
        <Route 
          path="*" 
          element={
            AuthService.isAuthenticated() 
              ? <Navigate to={`/${getSafeRole()}/dashboard`} replace /> 
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

export default App;