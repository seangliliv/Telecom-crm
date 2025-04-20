// src/services/invoiceApi.js
import api from "./api";

// Get all invoices
export const fetchInvoices = async () => {
  try {
    const response = await api.get("/api/invoices/all/");
    // Return the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Get a single invoice by ID
export const fetchInvoiceById = async (invoiceId) => {
  try {
    const response = await api.get(`/api/invoices/${invoiceId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Get payment methods associated with an invoice
export const fetchInvoicePaymentMethods = async (invoiceId) => {
  try {
    const response = await api.get(`/api/invoices/${invoiceId}/payment-methods/`);
    return response.data.payment_methods || [];
  } catch (error) {
    console.error(`Error fetching payment methods for invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await api.post("/api/invoices/", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await api.put(`/api/invoices/update/${invoiceId}/`, invoiceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await api.delete(`/api/invoices/delete/${invoiceId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Add a payment method to an invoice
export const addPaymentMethodToInvoice = async (invoiceId, paymentMethodData) => {
  try {
    // Add the invoiceId to the payment method data
    const data = {
      ...paymentMethodData,
      invoiceId: invoiceId
    };
    const response = await api.post("/api/payment-methods/", data);
    return response.data;
  } catch (error) {
    console.error(`Error adding payment method to invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Get invoices by customer ID
export const fetchInvoicesByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/api/invoices/customer/${customerId}/`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching invoices for customer ${customerId}:`, error);
    throw error;
  }
};

// Get invoices by status
export const fetchInvoicesByStatus = async (status) => {
  try {
    const response = await api.get(`/api/invoices/status/${status}/`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching invoices with status ${status}:`, error);
    throw error;
  }
};

// Mark invoice as paid
export const markInvoiceAsPaid = async (invoiceId, paymentDetails = {}) => {
  try {
    const response = await api.put(`/api/invoices/${invoiceId}/pay/`, paymentDetails);
    return response.data;
  } catch (error) {
    console.error(`Error marking invoice ${invoiceId} as paid:`, error);
    throw error;
  }
};

// Send invoice by email
export const sendInvoiceByEmail = async (invoiceId, emailDetails = {}) => {
  try {
    const response = await api.post(`/api/invoices/${invoiceId}/send-email/`, emailDetails);
    return response.data;
  } catch (error) {
    console.error(`Error sending invoice ${invoiceId} by email:`, error);
    throw error;
  }
};

// Process invoice data from API response
export const processInvoiceData = (invoiceData) => {
  return {
    id: invoiceData._id || invoiceData.id || '',
    customerId: invoiceData.customerId || '',
    subscriptionId: invoiceData.subscriptionId || '',
    amount: invoiceData.amount || 0,
    status: invoiceData.status || 'unpaid',
    issueDate: invoiceData.issueDate || null,
    dueDate: invoiceData.dueDate || null,
    paidDate: invoiceData.paidDate || null,
    items: invoiceData.items || [],
    paymentMethod: invoiceData.paymentMethod || null,
    createdAt: invoiceData.createdAt || null,
    updatedAt: invoiceData.updatedAt || null
  };
};