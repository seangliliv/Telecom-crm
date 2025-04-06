// src/api/apiService.js
import axios from "axios";

// Define API token
const token = "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993";

// Create an enhanced axios instance with better error handling
const createApiClient = () => {
  const client = axios.create({
    baseURL: "/api",  // Use relative URL for proxy support
    headers: {
      "Content-Type": "application/json",
      "Token": token,
    },
    timeout: 15000,
  });

  // Add request interceptor for logging and debugging
  client.interceptors.request.use(
    (config) => {
      console.log(`[API] ${config.method.toUpperCase()} Request to: ${config.url}`, 
        config.data ? { data: config.data } : "");
      return config;
    },
    (error) => {
      console.error("[API] Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for detailed error handling
  client.interceptors.response.use(
    (response) => {
      console.log(`[API] Response from ${response.config.url}:`, 
        { status: response.status, data: response.data });
      return response;
    },
    (error) => {
      if (error.response) {
        // Server responded with an error status
        console.error(`[API] Error ${error.response.status} from ${error.config.url}:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          requestData: error.config.data
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error("[API] No response received:", {
          request: error.request,
          url: error.config.url
        });
      } else {
        // Error setting up the request
        console.error("[API] Request setup error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Create API client instance
const apiClient = createApiClient();

// Customer API functions
const customerAPI = {
  // Get all customers
  getAll: async () => {
    try {
      const response = await apiClient.get("/customers/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      throw error;
    }
  },

  // Get single customer by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch customer ${id}:`, error);
      throw error;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await apiClient.post("/customers/", customerData);
      return response.data;
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    }
  },

  // Update customer - try multiple methods if needed
  update: async (id, customerData) => {
    console.log(`Attempting to update customer ${id} with data:`, customerData);
    
    // Try PUT method (standard RESTful approach)
    try {
      const response = await apiClient.put(`/customers/${id}/`, customerData);
      return response.data;
    } catch (putError) {
      console.error(`PUT method failed for customer ${id}:`, putError);
      
      // If PUT fails with 405, try PATCH
      if (putError.response && putError.response.status === 405) {
        console.log("PUT method not allowed, trying PATCH...");
        try {
          const response = await apiClient.patch(`/customers/${id}/`, customerData);
          return response.data;
        } catch (patchError) {
          console.error(`PATCH method failed for customer ${id}:`, patchError);
          
          // If PATCH also fails, try POST to a specific update endpoint
          if (patchError.response && patchError.response.status === 405) {
            console.log("PATCH method not allowed, trying POST to update endpoint...");
            try {
              // Some APIs use POST to a specific endpoint for updates
              const response = await apiClient.post(`/customers/${id}/update/`, customerData);
              return response.data;
            } catch (postError) {
              console.error(`POST to update endpoint failed for customer ${id}:`, postError);
              throw postError;
            }
          } else {
            throw patchError;
          }
        }
      } else {
        throw putError;
      }
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete customer ${id}:`, error);
      throw error;
    }
  }
};

export default {
  customer: customerAPI,
  // You can add other API modules here (plans, subscriptions, etc.)
};