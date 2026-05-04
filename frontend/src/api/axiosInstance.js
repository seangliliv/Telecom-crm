import axios from "axios";
const token = import.meta.env.VITE_API_TOKEN;

const axiosInstance = axios.create({
  // Use relative URL for the API to leverage Vite's proxy
  baseURL: "/api",
  headers: {
    Token: token,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication error: Token may be invalid or expired");
    }
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