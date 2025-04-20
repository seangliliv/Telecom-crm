import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token in headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('customerId');
      localStorage.removeItem('hasCustomer');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  checkAuth: () => api.get('/auth/check/'),
  register: (userData) => api.post('/api/users/', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  resetPassword: (data) => api.post('/auth/reset-password/', data),
};

// User services
export const userService = {
  getCurrentUser: () => api.get('/api/users/me/'),
  updateUser: (id, data) => api.put(`/api/users/${id}/update/`, data),
  getAllUsers: (params) => api.get('/api/users/all/', { params }),
  getUserById: (id) => api.get(`/api/users/${id}/`),
  createUser: (data) => api.post('/api/users/', data),
  deleteUser: (id) => api.delete(`/api/users/${id}/delete/`),
};

// You can add more service modules as needed for other API endpoints

export default api;