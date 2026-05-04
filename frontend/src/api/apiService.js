import axios from "axios";
const token = process.env.REACT_APP_API_TOKEN;

// Create an enhanced axios instance with better error handling
const createApiClient = () => {
  const client = axios.create({
    baseURL: "/api",   
    headers: {
      "Content-Type": "application/json",
      "Token": token,
    },
    timeout: 15000,
  });

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
  client.interceptors.response.use(
    (response) => {
      console.log(`[API] Response from ${response.config.url}:`, 
        { status: response.status, data: response.data });
      return response;
    },
    (error) => {
      if (error.response) {
        console.error(`[API] Error ${error.response.status} from ${error.config.url}:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          requestData: error.config.data
        });
      } else if (error.request) {
        console.error("[API] No response received:", {
          request: error.request,
          url: error.config.url
        });
      } else {
        console.error("[API] Request setup error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

const customerAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/customers/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch customer ${id}:`, error);
      throw error;
    }
  },

  create: async (customerData) => {
    try {
      const response = await apiClient.post("/customers/", customerData);
      return response.data;
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    }
  },

  update: async (id, customerData) => {
    console.log(`Attempting to update customer ${id} with data:`, customerData);
    try {
      const response = await apiClient.put(`/customers/${id}/`, customerData);
      return response.data;
    } catch (putError) {
      console.error(`PUT method failed for customer ${id}:`, putError);
      if (putError.response && putError.response.status === 405) {
        console.log("PUT method not allowed, trying PATCH...");
        try {
          const response = await apiClient.patch(`/customers/${id}/`, customerData);
          return response.data;
        } catch (patchError) {
          console.error(`PATCH method failed for customer ${id}:`, patchError);
          if (patchError.response && patchError.response.status === 405) {
            console.log("PATCH method not allowed, trying POST to update endpoint...");
            try {
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