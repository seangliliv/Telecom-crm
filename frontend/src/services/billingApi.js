// src/services/billingApi.js
import api from "./api";

// Get all payment methods for a customer
export const fetchPaymentMethods = async (customerId) => {
  try {
    // Fix the URL path to include /api/ prefix
    const response = await api.get(`/api/customers/${customerId}/payment-methods/`);
    return response.data.payment_methods || response.data;
  } catch (error) {
    console.error(`Error fetching payment methods for customer ${customerId}:`, error);
    throw error;
  }
};

// Create a new payment method
export const createPaymentMethod = async (paymentMethodData) => {
  try {
    const response = await api.post("/api/payment-methods/", paymentMethodData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await api.delete(`/api/payment-methods/${paymentMethodId}/delete/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting payment method ${paymentMethodId}:`, error);
    throw error;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (customerId, paymentMethodId) => {
  try {
    const response = await api.put(`/api/customers/${customerId}/payment-methods/${paymentMethodId}/set-default/`);
    return response.data;
  } catch (error) {
    console.error(`Error setting payment method ${paymentMethodId} as default:`, error);
    throw error;
  }
};

// Fetch customer billing details
export const fetchCustomerBillingDetails = async (customerId) => {
  try {
    const response = await api.get(`/api/customers/${customerId}/billing-details/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching billing details for customer ${customerId}:`, error);
    throw error;
  }
};

// Update customer billing address
export const updateBillingAddress = async (customerId, addressData) => {
  try {
    const response = await api.put(`/api/customers/${customerId}/billing-address/`, addressData);
    return response.data;
  } catch (error) {
    console.error(`Error updating billing address for customer ${customerId}:`, error);
    throw error;
  }
};

// Fetch billing history
export const fetchBillingHistory = async (customerId, params = {}) => {
  try {
    const response = await api.get(`/api/customers/${customerId}/billing-history/`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching billing history for customer ${customerId}:`, error);
    throw error;
  }
};

// Download invoice
export const downloadInvoice = async (invoiceId) => {
  try {
    const response = await api.get(`/api/invoices/${invoiceId}/download/`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Process manual payment
export const processManualPayment = async (customerId, paymentData) => {
  try {
    const response = await api.post(`/api/customers/${customerId}/process-payment/`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`Error processing payment for customer ${customerId}:`, error);
    throw error;
  }
};

// Update auto-payment settings
export const updateAutoPaymentSettings = async (customerId, settings) => {
  try {
    const response = await api.put(`/api/customers/${customerId}/auto-payment-settings/`, settings);
    return response.data;
  } catch (error) {
    console.error(`Error updating auto-payment settings for customer ${customerId}:`, error);
    throw error;
  }
};