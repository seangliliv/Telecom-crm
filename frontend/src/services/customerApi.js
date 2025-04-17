// src/services/customerApi.js
import api from "./api";

// Get all customers
export const fetchCustomers = async () => {
  try {
    const response = await api.get("/api/customers/all/");
    // Return the data array from the response
    return response.data.data || [];
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
    return response.data.data || [];
  } catch (error) {
    console.error(`Error searching customers:`, error);
    throw error;
  }
};