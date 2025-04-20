// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/api";
import AuthService from "../utils/AuthService";
import autoCustomerService from "../services/autoCustomerService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const userRole = AuthService.getUserRole();
      if (userRole) {
        console.log("User already logged in, redirecting to:", `/${userRole}/dashboard`);
        // Use a timeout to prevent immediate redirection which can cause render loops
        setTimeout(() => {
          navigate(`/${userRole}/dashboard`);
        }, 100);
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic field validation
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make the API call for login
      console.log("Attempting login with:", { email });
      const response = await authService.login({
        email,
        password,
      });
  
      console.log("Login response:", response.data);
  
      // Get user data from the response - adjust based on your API response structure
      const userData = response.data.user || response.data;
      const token = response.data.token || response.data.access || '';
      
      // Store both versions of user ID for compatibility
      const userId = userData.id || userData.user_id || userData.userId || '';
      
      // Create user object from response data
      const user = {
        id: userId,
        userId: userId, // Ensure both formats are available
        firstName: userData.firstName || userData.first_name || '',
        lastName: userData.lastName || userData.last_name || '',
        role: (userData.role || 'user'),
        email: userData.email || email, // Make sure to include email
        customerIds: userData.customerIds || [],
        hasCustomer: userData.hasCustomer || false
      };
      
      console.log("Processed user data:", user);
      
      // Use AuthService to save authentication state
      AuthService.saveAuthState(user, token);
      
      // Store email in localStorage for direct access
      localStorage.setItem('email', email);
      
      // Check for customer account or create one if needed
      setIsProcessing(true);
      if (!user.hasCustomer) {
        toast.info("Setting up your customer profile...");
        try {
          // Use our auto customer service to ensure a customer exists
          const customerId = await autoCustomerService.ensureCustomerExists();
          if (customerId) {
            console.log("Created/found customer account:", customerId);
            // Store the customer ID now that we have it
            localStorage.setItem('customerId', customerId);
            localStorage.setItem('hasCustomer', 'true');
          }
        } catch (customerError) {
          console.error("Error setting up customer account:", customerError);
          // Continue anyway - the user can create a customer later
        }
      }
      
      toast.success("Login successful!");
      
      // Redirect based on role
      const role = user.role.toLowerCase();
      console.log("Redirecting to role:", role);
      
      // Use setTimeout to delay navigation slightly to prevent render loops
      setTimeout(() => {
        if (role === "superadmin") {
          console.log("Navigating to superadmin dashboard");
          navigate("/superadmin/dashboard", { replace: true });
        } else if (role === "admin") {
          console.log("Navigating to admin dashboard");
          navigate("/admin/dashboard", { replace: true });
        } else {
          console.log("Navigating to user dashboard");
          navigate("/user/dashboard", { replace: true });
        }
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
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
                disabled={isLoading || isProcessing}
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
                disabled={isLoading || isProcessing}
              />
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center ${
                (isLoading || isProcessing) ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || isProcessing}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Setting up your account...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
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
          
          {/* Debug information in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 border-t border-gray-100 pt-4">
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-blue-500">Debug Info</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
                  <p><strong>Auth State:</strong></p>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {JSON.stringify({
                      isAuthenticated: localStorage.getItem('isLoggedIn') === 'true',
                      userId: localStorage.getItem('userId'),
                      email: localStorage.getItem('email'),
                      customerId: localStorage.getItem('customerId'),
                      hasCustomer: localStorage.getItem('hasCustomer')
                    }, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;