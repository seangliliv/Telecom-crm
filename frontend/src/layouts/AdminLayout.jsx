import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  HeadphonesIcon, 
  TrendingUp, 
  Settings, 
  Network, 
  UserCog,
  LogOut
} from 'lucide-react';
import { Bell } from 'lucide-react';
import AuthService from '../utils/AuthService';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user information from AuthService only once
    const userDetails = AuthService.getUserInfo();
    
    if (!userDetails) {
      // If no user details, set loading to false to handle redirect
      setIsLoading(false);
      return;
    }
    
    setUserInfo(userDetails);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    // Use AuthService to handle logout
    AuthService.logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!userInfo || !userInfo.name) return 'AD';
    
    const nameParts = userInfo.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#f1f3d8] text-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#ff6b00]">
            <span className="text-yellow-600"> </span>KH Telecom CRM
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem to="/admin/customers" icon={<Users />} label="Customers Management" />
            <NavItem to="/admin/subscription" icon={<CreditCard />} label="Subscription & Billing" />
            <NavItem to="/admin/invoices" icon={<FileText />} label="Invoices" />
            <NavItem to="/admin/support" icon={<HeadphonesIcon />} label="Support Tickets" />
            <NavItem to="/admin/sales" icon={<TrendingUp />} label="Sales & Marketing" />
            <NavItem to="/admin/plans" icon={<Settings />} label="Plans Management" />
            <NavItem to="/admin/network" icon={<Network />} label="Network Status" />
            <NavItem to="/admin/users" icon={<UserCog />} label="User & Roles" />
            <NavItem to="/admin/settings" icon={<Settings />} label="Settings" />
          </ul>
        </nav>
        
        {/* Logout Button in Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-orange-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="absolute left-2 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center">
              <span className="mr-1">EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Bell className="h-6 w-6 cursor-pointer" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>
            
            {/* User Profile with Dropdown */}
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {getUserInitials()}
              </div>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            isActive 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-orange-100'
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        {label}
      </NavLink>
    </li>
  );
};

export default AdminLayout;