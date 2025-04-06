// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// API configuration
const API_CONFIG = {
  BASE_URL: 'http://45.150.128.165:8000/api',
  TOKEN: '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993',
  TIMEOUT: 10000, // 10 seconds timeout
  USE_MOCK: true // Set to false when API is fully operational
};

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'token': API_CONFIG.TOKEN
  }
});

// Mock data for development
const MOCK_DATA = {
  dashboardMetrics: {
    revenue: { value: '$124,563', percentage: 12.5 },
    activePlans: { value: 1234, percentage: 85 },
    pendingPayments: { value: 45, dueIn: 7 },
    newSubscriptions: { value: 89 },
    openTickets: { value: 156, critical: 12 }
  },
  
  recentActivities: [
    {
      type: 'new_customer',
      details: 'John Doe registered for a new postpaid plan',
      time: '2 mins ago'
    },
    {
      type: 'network_alert',
      details: 'Network outage detected in Phnom Penh central',
      time: '15 mins ago'
    },
    {
      type: 'payment',
      details: '$150 received from customer #12458',
      time: '1 hour ago'
    }
  ],
  
  customerGrowth: [
    { date: '2025-03-25', count: 120 },
    { date: '2025-03-26', count: 125 },
    { date: '2025-03-27', count: 130 },
    { date: '2025-03-28', count: 135 },
    { date: '2025-03-29', count: 142 },
    { date: '2025-03-30', count: 148 },
    { date: '2025-03-31', count: 155 }
  ],
  
  revenueAnalysis: [
    { date: '2025-03-25', amount: 15000 },
    { date: '2025-03-26', amount: 18000 },
    { date: '2025-03-27', amount: 16500 },
    { date: '2025-03-28', amount: 19500 },
    { date: '2025-03-29', amount: 21000 },
    { date: '2025-03-30', amount: 20000 },
    { date: '2025-03-31', amount: 22500 }
  ]
};

// Helper function to simulate API delay
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Safer data access helper
const safeGet = (obj, path, defaultValue = null) => {
  try {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result === undefined || result === null) return defaultValue;
      result = result[key];
    }
    return result === undefined ? defaultValue : result;
  } catch (error) {
    console.error(`Error accessing path ${path}:`, error);
    return defaultValue;
  }
};

// API request with error handling
const apiRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      params
    });
    return response.data;
  } catch (error) {
    const message = safeGet(error, 'response.data.message', 'Something went wrong. Please try again.');
    toast.error(message);
    console.error('API Error:', error);
    throw error;
  }
};

// Dashboard API methods
const dashboardAPI = {
  // Get dashboard metrics
  getDashboardMetrics: async () => {
    if (API_CONFIG.USE_MOCK) {
      await mockDelay();
      return MOCK_DATA.dashboardMetrics;
    }
    
    try {
      const response = await apiRequest('GET', '/dashboard/statistics');
      // Transform API response to match our expected format
      return {
        revenue: { 
          value: `$${safeGet(response, 'totalRevenue', 0).toLocaleString()}`, 
          percentage: safeGet(response, 'revenueGrowth', 0) 
        },
        activePlans: { 
          value: safeGet(response, 'activePlans', 0), 
          percentage: safeGet(response, 'retentionRate', 0) 
        },
        pendingPayments: { 
          value: safeGet(response, 'pendingPayments', 0), 
          dueIn: safeGet(response, 'paymentDueInDays', 0) 
        },
        newSubscriptions: { 
          value: safeGet(response, 'newSubscriptions', 0) 
        },
        openTickets: { 
          value: safeGet(response, 'openTickets', 0), 
          critical: safeGet(response, 'criticalTickets', 0) 
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return MOCK_DATA.dashboardMetrics; // Fallback to mock data on error
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    if (API_CONFIG.USE_MOCK) {
      await mockDelay();
      return MOCK_DATA.recentActivities;
    }
    
    try {
      const response = await apiRequest('GET', '/dashboard/recent-activities');
      // Map API response to expected format
      const activities = safeGet(response, 'activities', []);
      return activities.map(activity => ({
        type: safeGet(activity, 'activityType', ''),
        details: safeGet(activity, 'description', 'No details available'),
        time: safeGet(activity, 'timeAgo', 'Unknown time')
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return MOCK_DATA.recentActivities; // Fallback to mock data on error
    }
  },

  // Get customer growth data
  getCustomerGrowth: async (period = '7days') => {
    if (API_CONFIG.USE_MOCK) {
      await mockDelay();
      return MOCK_DATA.customerGrowth;
    }
    
    try {
      const response = await apiRequest('GET', `/dashboard/customer-growth?period=${period}`);
      // Map API response to expected format
      const data = safeGet(response, 'data', []);
      return data.map(item => ({
        date: safeGet(item, 'date', ''),
        count: safeGet(item, 'customerCount', 0)
      }));
    } catch (error) {
      console.error('Error fetching customer growth data:', error);
      return MOCK_DATA.customerGrowth; // Fallback to mock data on error
    }
  },

  // Get revenue analysis data
  getRevenueAnalysis: async (period = '7days') => {
    if (API_CONFIG.USE_MOCK) {
      await mockDelay();
      return MOCK_DATA.revenueAnalysis;
    }
    
    try {
      const response = await apiRequest('GET', `/dashboard/revenue-analysis?period=${period}`);
      // Map API response to expected format
      const data = safeGet(response, 'data', []);
      return data.map(item => ({
        date: safeGet(item, 'date', ''),
        amount: safeGet(item, 'revenue', 0)
      }));
    } catch (error) {
      console.error('Error fetching revenue analysis data:', error);
      return MOCK_DATA.revenueAnalysis; // Fallback to mock data on error
    }
  }
};

export default dashboardAPI;