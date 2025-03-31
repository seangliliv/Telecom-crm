// src/api.js
import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance with your backend base URL
const API = axios.get({
  baseURL: "http://45.150.128.165:8000/api/customers", // Adjust the URL as
  headers: {
    "Content-Type": "application/json",
    "4": "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993"
  },
});

// Customer endpoints
export const fetchCustomers = async () => {
  try {
    const response = await API.get("/customers");
    return response.data;
  } catch (error) {
    toast.error("Error fetching customers. Please try again later.");
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Billing endpoints
export const fetchInvoices = async () => {
  try {
    const response = await API.get("/invoices");
    return response.data;
  } catch (error) {
    toast.error("Error fetching invoices. Please try again later.");
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await API.post("/invoices", invoiceData);
    toast.success("Invoice created successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to create invoice. Please check your input.");
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Support ticket endpoints
export const fetchTickets = async () => {
  try {
    const response = await API.get("/tickets");
    return response.data;
  } catch (error) {
    toast.error("Error fetching tickets. Please try again later.");
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await API.post("/tickets", ticketData);
    toast.success("Ticket created successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to create ticket. Please check your input.");
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export default API;
