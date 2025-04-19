// src/utils/userService.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const TOKEN_KEY = "token";

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common["Content-Type"] = "application/json";

const UserService = {
  getAuthHeader: () => {
    const tok = localStorage.getItem(TOKEN_KEY);
    return tok ? { Authorization: `Bearer ${tok}` } : {};
  },

  /**
   * GET /users/all/
   */
  getAll: async () => {
    console.log("📥 UserService.getAll → GET /users/all/");
    const res = await axios.get("/users/all/", {
      headers: UserService.getAuthHeader(),
    });
    console.log("📦 UserService.getAll →", res.data);
    return res.data.data;
  },

  /**
   * GET /users/:id/
   */
  getById: async (userId) => {
    console.log("📥 UserService.getById → GET /users/", userId);
    const res = await axios.get(`/users/${userId}/`, {
      headers: UserService.getAuthHeader(),
    });
    console.log("📦 UserService.getById →", res.data);
    return res.data.data ?? res.data;
  },
};

export default UserService;
