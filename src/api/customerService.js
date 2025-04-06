// src/api/customerService.js
import axiosInstance from "./axiosInstance";

// Get all customers
export const getCustomers = () => axiosInstance.get("/customers/");

// Get one customer
export const getCustomer = (id) => axiosInstance.get(`/customers/${id}/`);

// Create customer
export const createCustomer = (data) => axiosInstance.post("/customers/", data);

// ⚠️ FIXED: Update customer - ensures profileImage is included and error is logged
export const updateCustomer = async (id, data) => {
  try {
    // Make sure all required fields are included
    const updatedData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      status: data.status || "Active",
      profileImage: data.profileImage || "http://example.com/default.jpg", // 👈 required!
    };

    const response = await axiosInstance.put(`/customers/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update customer:", error.response?.data || error.message);
    throw error; // propagate to show error message in UI
  }
};

// Delete customer
export const deleteCustomer = (id) =>
  axiosInstance.delete(`/customers/${id}/`);
