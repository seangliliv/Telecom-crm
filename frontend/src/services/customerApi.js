// src/services/customerApi.js
import api from "./api";

// Get all customers
export const fetchCustomers = async () => {
  try {
    const response = await api.get("/api/customers/all/");
    console.log("Raw API response:", response.data); // Debug log
    
    // Return the data array from the response
    // Handle different possible API response structures
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      // This is the actual structure returned by the API based on the screenshot
      return response.data.results;
    } else {
      console.error("Unexpected API response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Get a single customer by ID
export const fetchCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/api/customers/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/api/customers/", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update an existing customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await api.put(`/api/customers/update/${customerId}/`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/api/customers/delete/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    throw error;
  }
};

// Search customers
export const searchCustomers = async (searchQuery) => {
  try {
    const response = await api.get(`/api/customers/search/`, {
      params: { query: searchQuery }
    });
    
    // Handle different possible API response structures
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      // This is the actual structure based on the API response
      return response.data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error searching customers:`, error);
    throw error;
  }
};