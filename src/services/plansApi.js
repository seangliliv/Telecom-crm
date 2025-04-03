// src/services/apiService.js
import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://45.150.128.165:8000/api';

// Create an axios instance with default config
const plansApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'token': '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000
});

export default plansApi;

// // API service methods
// const plansApi = {
//   // Plans
//   getPlans: async () => {
//     try {
//       const response = await apiClient.get('/plans');
//       return response.data;
//     } catch (error) {
//       handleApiError(error, 'fetching plans');
//       throw error;
//     }
//   },
  
//   createPlan: async (planData) => {
//     try {
//       const response = await apiClient.post('/plans', planData);
//       return response.data;
//     } catch (error) {
//       handleApiError(error, 'creating plan');
//       throw error;
//     }
//   },
  
//   updatePlan: async (planId, planData) => {
//     try {
//       console.log(`Updating plan with ID: ${planId}`, planData);
//       const response = await apiClient.put(`/plans/${planId}`, planData);
//       return response.data;
//     } catch (error) {
//       handleApiError(error, 'updating plan');
//       throw error;
//     }
//   },
  
//   deletePlan: async (planId) => {
//     try {
//       const response = await apiClient.delete(`/plans/${planId}`);
//       return response.data;
//     } catch (error) {
//       handleApiError(error, 'deleting plan');
//       throw error;
//     }
//   }
// };

// // Helper function to handle API errors with better logging
// function handleApiError(error, operation) {
//   if (error.response) {
//     // The request was made and the server responded with a status code
//     // that falls out of the range of 2xx
//     console.error(`Error ${operation} - Status: ${error.response.status}`, error.response.data);
//   } else if (error.request) {
//     // The request was made but no response was received
//     console.error(`Error ${operation} - No response received:`, error.request);
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     console.error(`Error ${operation}:`, error.message);
//   }
  
//   // Check for CORS issues
//   if (error.message && error.message.includes('Network Error')) {
//     console.error('This might be a CORS issue. Check if the API allows requests from your domain.');
//   }
// }

// export default plansApi;