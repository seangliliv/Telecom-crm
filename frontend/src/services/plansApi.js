// src/services/planApi.js
import api from "./api";

// Get all plans
export const fetchPlans = async () => {
  try {
    const response = await api.get("/api/plans/all/");
    // Return the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

// Get a single plan by ID
export const fetchPlanById = async (planId) => {
  try {
    const response = await api.get(`/api/plans/${planId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan ${planId}:`, error);
    throw error;
  }
};

// Create a new plan
export const createPlan = async (planData) => {
  try {
    const response = await api.post("/api/plans/", planData);
    return response.data;
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

// Update an existing plan
export const updatePlan = async (planId, planData) => {
  try {
    const response = await api.put(`/api/plans/update/${planId}/`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating plan ${planId}:`, error);
    throw error;
  }
};

// Delete a plan
export const deletePlan = async (planId) => {
  try {
    const response = await api.delete(`/api/plans/delete/${planId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting plan ${planId}:`, error);
    throw error;
  }
};
