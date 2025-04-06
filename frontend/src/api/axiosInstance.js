//src/api/axiosInstance.js
import axios from "axios";

// The token from the API documentation
const token = "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993";

const axiosInstance = axios.create({
  // Use relative URL for the API to leverage Vite's proxy
  baseURL: "/api",
  headers: {
    // Make sure the token header is formatted exactly as required by the API
    // According to the documentation, the header should be "Token" not "Authorization: Token"
    Token: token,
    "Content-Type": "application/json",
  },
  // Adding timeout and retry config
  timeout: 10000,
});

// Add a request interceptor to log and modify requests if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.error("Authentication error: Token may be invalid or expired");
      // You could add additional handling here, like redirecting to login
    }
    
    // Log detailed error information for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default axiosInstance;