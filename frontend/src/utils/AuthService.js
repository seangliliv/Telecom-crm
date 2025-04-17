// src/utils/AuthService.js

/**
 * Service for managing authentication state
 */
const AuthService = {
    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated: () => {
      return localStorage.getItem('isLoggedIn') === 'true';
    },
  
    /**
     * Get current user role
     * @returns {string|null} User role or null if not authenticated
     */
    getUserRole: () => {
      return localStorage.getItem('userRole');
    },
  
    /**
     * Get current user information
     * @returns {Object} User information
     */
    getUserInfo: () => {
      if (!AuthService.isAuthenticated()) {
        return null;
      }
  
      return {
        id: localStorage.getItem('userId'),
        name: localStorage.getItem('userName'),
        role: localStorage.getItem('userRole')
      };
    },
  
    /**
     * Log out current user
     */
    logout: () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/login';
    },
  
    /**
     * Save authentication state after successful login
     * @param {Object} user - User data from API
     * @param {string} token - Authentication token (optional)
     */
    saveAuthState: (user, token = null) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', user.role.toLowerCase());
      localStorage.setItem('userId', user.id || '');
      
      // Handle different name formats
      const userName = user.name || 
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                      user.email || 
                      'User';
      
      localStorage.setItem('userName', userName);
      
      if (token) {
        localStorage.setItem('token', token);
      }
    }
  };
  
  export default AuthService;