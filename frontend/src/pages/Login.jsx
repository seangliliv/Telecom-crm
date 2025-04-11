// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic field validation
    if (!email || !password || !role) {
      alert("Please fill in all fields and select a role.");
      return;
    }
    // Here you would typically call an API to authenticate.
    // For this example, we'll assume authentication passes.
    localStorage.setItem("userRole", role);
    if (role === "superadmin") {
      navigate("/superadmin/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "user") {
      navigate("/user/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 relative">
          {/* Freepik Illustration Placeholder */}
          <div className="relative w-full">
            
            <img 
              src="/image/team-illustration.png" 
              alt="Team collaboration illustration" 
              className="w-full h-auto"
            />
            
            {/* Decorative floating elements */}
            <div className="absolute top-10 right-5 bg-blue-100 p-2 rounded-lg shadow-sm opacity-80 animate-pulse">
              <div className="w-8 h-1 bg-blue-300 rounded mb-1"></div>
              <div className="w-12 h-1 bg-blue-200 rounded"></div>
            </div>
            
            {/* Decorative plant - you can remove this if your Freepik illustration includes plants */}
            <div className="absolute bottom-2 right-2">
              <div className="w-6 h-10 bg-green-700 rounded-md relative overflow-hidden">
                <div className="absolute -top-8 -left-4 w-14 h-8 bg-green-600 rounded-full"></div>
                <div className="absolute -top-6 -right-4 w-10 h-8 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Header / Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">KH Telecom CRM</h1>
              <p className="text-gray-500">Login to your account</p>
            </div>
            
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Select Role</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <span>Sign in</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Forgot Password Link */}
            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            
            {/* Register Link */}
            <div className="text-center border-t border-gray-100 pt-4 mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;