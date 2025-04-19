import AuthService from '../utils/AuthService';
import api from './api';

// User API services
export const userApi = {
  /**
   * Get all users with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} API response
   */
  getAllUsers: (params = {}) => {
    return api.get('/api/users/all/', { params });
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getUserById: (userId) => {
    return api.get(`/api/users/${userId}/`);
  },

  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @returns {Promise} API response
   */
  createUser: (userData) => {
    return api.post('/api/users/', userData);
  },

  /**
   * Update an existing user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  updateUser: (userId, userData) => {
    return api.put(`/api/users/${userId}/update/`, userData);
  },

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  deleteUser: (userId) => {
    return api.delete(`/api/users/${userId}/delete/`);
  },

  /**
   * Get current user profile (based on token)
   * @returns {Promise} API response
   */
  getCurrentUser: () => {
    const userId = AuthService.getUserInfo()?.id;
    if (!userId) {
      return Promise.reject(new Error('User not authenticated'));
    }
    return api.get(`/api/users/${userId}/`);
  },

  /**
   * Process user data from API response
   * @param {Object} userData - Raw user data from API
   * @returns {Object} Normalized user data
   */
  processUserData: (userData) => {
    return {
      id: userData._id || userData.id || '',
      email: userData.email || '',
      firstName: userData.firstName || userData.first_name || '',
      lastName: userData.lastName || userData.last_name || '',
      role: userData.role || 'user',
      phoneNumber: userData.phoneNumber || null,
      profileImage: userData.profile_image || null,
      status: userData.status || 'inactive',
      planId: userData.planId || null,
      lastActive: userData.lastActive || null,
      createdAt: userData.createdAt || null,
      updatedAt: userData.updatedAt || null
    };
  },

  /**
   * Process API response containing user data array
   * @param {Object} response - API response with data array
   * @returns {Array} Normalized user data array
   */
  processUserList: (response) => {
    const users = response.data?.data || response.data || [];
    return Array.isArray(users) 
      ? users.map(user => userApi.processUserData(user))
      : [];
  }
};

export default userApi;