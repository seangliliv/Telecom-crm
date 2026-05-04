import axiosInstance from "./axiosInstance";

export const getCustomers = () => axiosInstance.get("/customers/");
export const getCustomer = (id) => axiosInstance.get(`/customers/${id}/`);
export const createCustomer = (data) => axiosInstance.post("/customers/", data);

// ⚠️ FIXED: Update customer - ensures profileImage is included and error is logged
export const updateCustomer = async (id, data) => {
  try {
    const updatedData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      status: data.status || "Active",
      profileImage: data.profileImage || "http://example.com/default.jpg", 
    };

    const response = await axiosInstance.put(`/customers/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update customer:", error.response?.data || error.message);
    throw error; 
  }
};

export const deleteCustomer = (id) =>
  axiosInstance.delete(`/customers/${id}/`);
