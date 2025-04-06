import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://45.150.128.165:8000/api/categories/';

// Create an axios instance with default config
const catApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'token': '24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000
});

export default catApi;
