// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomersManagement from "./pages/admin/CustomersManagement";
import Invoice from "./pages/admin/Invoice";
import NetworkStatus from "./pages/admin/NetworkStatus";
import SalesMarketing from "./pages/admin/SalesMarketing";
import PlansManagement from "./pages/admin/PlansManagement";
import SubscriptionBilling from "./pages/admin/SubscriptionBilling";
import UserAndRole from "./pages/admin/UserAndRole";
import UserDashboard from "./pages/user/UserDashboard";
import UserBilling from "./pages/user/UserBilling";
import UserSupportCenter from "./pages/user/UserSupportCenter";
import UserServices from "./pages/user/UserServices";
import UserReports from "./pages/user/UserReports";
import SupportTickets from "./pages/admin/SupportTickets";

const App = () => {
  // For simplicity, assume role is stored in localStorage
  const userRole = localStorage.getItem("userRole");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute userRole={userRole} allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="invoices" element={<Invoice />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="network" element={<NetworkStatus />} />
          <Route path="sales" element={<SalesMarketing />} />
          <Route path="plans" element={<PlansManagement />} />
          <Route path="subscription" element={<SubscriptionBilling />} />
          <Route path="users" element={<UserAndRole />} />
        </Route>
        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute userRole={userRole} allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="billing" element={<UserBilling />} />
          <Route path="support" element={<UserSupportCenter />} />
          <Route path="services" element={<UserServices />} />
          <Route path="reports" element={<UserReports />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

export default App;
