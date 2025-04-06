 

// File: src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://45.150.128.165:8000/api';
const TOKEN = '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Token': TOKEN,
    'Content-Type': 'application/json'
  }
});

// API service functions for each endpoint
export const fetchCustomers = async () => {
  try {
    const response = await api.get('/customers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const fetchPlans = async () => {
  try {
    const response = await api.get('/plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const fetchInvoices = async () => {
  try {
    const response = await api.get('/invoices/');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const fetchIssues = async () => {
  try {
    const response = await api.get('/issues/');
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

export const fetchCampaigns = async () => {
  try {
    const response = await api.get('/campaigns/');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const fetchLeads = async () => {
  try {
    const response = await api.get('/leads/');
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const fetchServices = async () => {
  try {
    const response = await api.get('/services/');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchCustomerServices = async () => {
  try {
    const response = await api.get('/customerservices/');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer services:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchRoles = async () => {
  try {
    const response = await api.get('/roles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchCommunications = async () => {
  try {
    const response = await api.get('/communications/');
    return response.data;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

export const fetchIssueComments = async () => {
  try {
    const response = await api.get('/issuecomments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching issue comments:', error);
    throw error;
  }
};

export const fetchCampaignActivities = async () => {
  try {
    const response = await api.get('/campaignactivities/');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign activities:', error);
    throw error;
  }
};

// Export all API functions
export default {
  fetchCustomers,
  fetchPlans,
  fetchCategories,
  fetchSubscriptions,
  fetchInvoices,
  fetchIssues,
  fetchCampaigns,
  fetchLeads,
  fetchServices,
  fetchCustomerServices,
  fetchUsers,
  fetchRoles,
  fetchCommunications,
  fetchIssueComments,
  fetchCampaignActivities
};