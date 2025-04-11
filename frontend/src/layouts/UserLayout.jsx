import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you would implement your actual logout logic
    // For example, clearing localStorage, cookies, or calling an auth service
    localStorage.removeItem('auth_token'); // Remove any auth tokens
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <LogoIcon className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold text-orange-500">KH Telecom CRM</span>
              </div>
              <nav className="ml-10 flex items-center space-x-8">
                <NavItem to="/user/dashboard" label="Dashboard" />
                <NavItem to="/user/billing" label="Billing" />
                <NavItem to="/user/support" label="Support" />
              </nav>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center">
              <div className="relative mr-4">
                <Bell className="h-6 w-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden mr-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-1 text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          isActive
            ? 'border-orange-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`
      }
    >
      {label}
    </NavLink>
  );
};

// Logo Icon Component
const LogoIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M3.34 14.66A7.97 7.97 0 0 0 12 22a7.97 7.97 0 0 0 8.66-7.34c.23-3.46-2.11-6.38-4.97-7.66l.87-1.42c3.57 1.56 6.37 5.32 6.01 9.62A9.98 9.98 0 0 1 12 24a9.98 9.98 0 0 1-9.57-9.8c-.36-4.3 2.44-8.06 6.01-9.62l.87 1.42c-2.86 1.28-5.2 4.2-4.97 7.66z"/>
    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    <path d="M12 12V2h2l2 4-2 4M12 12V2h-2l-2 4 2 4"/>
  </svg>
);

export default UserLayout;