// src/services/autoCustomerService.js
import { createCustomer } from './customerApi';
import { userApi } from './userApi';
import AuthService from '../utils/AuthService';

/**
 * Service for automatically creating a customer record for a user if one doesn't exist
 */
const autoCustomerService = {
  /**
   * Check if the current user has a customer record and create one if not
   * @returns {Promise<string|null>} The customer ID if successful, null if failed
   */
  ensureCustomerExists: async () => {
    try {
      // Check if we already know the user has a customer
      if (localStorage.getItem('hasCustomer') === 'true' && 
          localStorage.getItem('customerId')) {
        console.log('Customer record already exists:', localStorage.getItem('customerId'));
        return localStorage.getItem('customerId');
      }
      
      // Get current user info
      const userId = AuthService.getUserInfo()?.id;
      
      if (!userId) {
        console.error('No user ID found in auth state');
        return null;
      }
      
      console.log('Checking for customer record for user:', userId);
      
      // Get user details
      let userData;
      try {
        const userResponse = await userApi.getUserById(userId);
        userData = userApi.processUserData(userResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Try to use data from localStorage as fallback
        userData = {
          id: userId,
          email: localStorage.getItem('email'),
          firstName: localStorage.getItem('userName')?.split(' ')[0] || 'New',
          lastName: localStorage.getItem('userName')?.split(' ')[1] || 'Customer',
        };
      }
      
      // Create customer record
      console.log('Creating customer record for user:', userData);
      
      const customerData = {
        userId: userId,
        email: userData.email || localStorage.getItem('email') || 'user@example.com',
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'Customer',
        phoneNumber: userData.phoneNumber || '555-555-5555',
        status: 'active'
      };
      
      const response = await createCustomer(customerData);
      console.log('Customer created:', response);
      
      if (response && (response.data || response)) {
        const newCustomer = response.data || response;
        const customerId = newCustomer.id || newCustomer._id;
        
        // Update localStorage
        localStorage.setItem('customerId', customerId);
        localStorage.setItem('hasCustomer', 'true');
        
        console.log('Customer record created with ID:', customerId);
        return customerId;
      }
      
      return null;
    } catch (error) {
      console.error('Error ensuring customer exists:', error);
      return null;
    }
  },
  
  /**
   * Check if customer exists and return customer ID
   * @returns {Promise<string|null>} The customer ID if exists, null if not
   */
  getCustomerId: async () => {
    // First check localStorage
    if (localStorage.getItem('hasCustomer') === 'true' && 
        localStorage.getItem('customerId')) {
      return localStorage.getItem('customerId');
    }
    
    // If not in localStorage, create customer record
    return await autoCustomerService.ensureCustomerExists();
  }
};

export default autoCustomerService;