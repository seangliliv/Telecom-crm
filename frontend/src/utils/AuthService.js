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
      email: localStorage.getItem('email'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      customerId: localStorage.getItem('customerId')
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
    localStorage.removeItem('email');
    localStorage.removeItem('customerId');
    localStorage.removeItem('hasCustomer');
    
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
    localStorage.setItem('userRole', user.role?.toLowerCase() || 'user');
    
    // Store both formats of userId for compatibility
    localStorage.setItem('userId', user.id || user.userId || user.user_id || '');
    localStorage.setItem('email', user.email || '');
    
    // Store customerId if available
    if (user.customerIds && user.customerIds.length > 0) {
      localStorage.setItem('customerId', user.customerIds[0]);
      localStorage.setItem('hasCustomer', 'true');
    } else {
      localStorage.setItem('hasCustomer', 'false');
    }
    
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

    console.log('Auth state saved:', {
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email'),
      userName: localStorage.getItem('userName'),
      customerId: localStorage.getItem('customerId'),
      hasCustomer: localStorage.getItem('hasCustomer')
    });
  }
};

export default AuthService;