// src/services/mockApiService.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create a configurable instance for API calls
const API_INSTANCE = axios.create({
  baseURL: 'http://45.150.128.165:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'token': '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993'
  },
});

// Add response interceptor for common error handling
API_INSTANCE.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Mock data for development
const MOCK_DATA = {
  dashboard: {
    metrics: {
      revenue: { value: '$124,563', percentage: 12.5 },
      activePlans: { value: 1234, percentage: 85 },
      pendingPayments: { value: 45, dueIn: 7 },
      newSubscriptions: { value: 89 },
      openTickets: { value: 156, critical: 12 }
    },
    activities: [
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
    customerGrowth: {
      '7days': [
        { date: '2025-03-25', customers: 120 },
        { date: '2025-03-26', customers: 122 },
        { date: '2025-03-27', customers: 125 },
        { date: '2025-03-28', customers: 130 },
        { date: '2025-03-29', customers: 138 },
        { date: '2025-03-30', customers: 145 },
        { date: '2025-03-31', customers: 152 }
      ],
      '30days': [
        // 30-day data would be here
      ],
      '90days': [
        // 90-day data would be here
      ]
    },
    revenueAnalysis: {
      '7days': [
        { date: '2025-03-25', revenue: 12000 },
        { date: '2025-03-26', revenue: 15000 },
        { date: '2025-03-27', revenue: 10000 },
        { date: '2025-03-28', revenue: 18000 },
        { date: '2025-03-29', revenue: 20000 },
        { date: '2025-03-30', revenue: 17000 },
        { date: '2025-03-31', revenue: 22000 }
      ],
      '30days': [
        // 30-day data would be here
      ],
      '90days': [
        // 90-day data would be here
      ]
    }
  }
};

// Flag to enable/disable mock mode
const USE_MOCK_DATA = true;

// Dashboard API service
const dashboardService = {
  // Get dashboard metrics
  getMetrics: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_DATA.dashboard.metrics;
    }
    
    const response = await API_INSTANCE.get('/dashboard/metrics');
    return response.data;
  },
  
  // Get recent activities
  getActivities: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_DATA.dashboard.activities;
    }
    
    const response = await API_INSTANCE.get('/dashboard/activities');
    return response.data;
  },
  
  // Get customer growth data
  getCustomerGrowth: async (timeRange = '7days') => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 700));
      return MOCK_DATA.dashboard.customerGrowth[timeRange] || [];
    }
    
    const response = await API_INSTANCE.get(`/dashboard/customer-growth?range=${timeRange}`);
    return response.data;
  },
  
  // Get revenue analysis data
  getRevenueAnalysis: async (timeRange = '7days') => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 750));
      return MOCK_DATA.dashboard.revenueAnalysis[timeRange] || [];
    }
    
    const response = await API_INSTANCE.get(`/dashboard/revenue-analysis?range=${timeRange}`);
    return response.data;
  }
};

export default dashboardService;