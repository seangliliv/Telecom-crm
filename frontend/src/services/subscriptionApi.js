// src/services/subscriptionApi.js
import api from "./api";

// Get all subscriptions
export const fetchSubscriptions = async () => {
  try {
    const response = await api.get("/api/sub/all/");
    // Return the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

// Get a single subscription by ID
export const fetchSubscriptionById = async (subscriptionId) => {
  try {
    const response = await api.get(`/api/sub/${subscriptionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// Get subscriptions by customer ID
export const fetchSubscriptionsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/api/sub/customer/${customerId}/`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching subscriptions for customer ${customerId}:`, error);
    throw error;
  }
};

// Get subscriptions by plan ID
export const fetchSubscriptionsByPlan = async (planId) => {
  try {
    const response = await api.get(`/api/sub/plan/${planId}/`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching subscriptions for plan ${planId}:`, error);
    throw error;
  }
};

// Create a new subscription
export const createSubscription = async (subscriptionData) => {
  try {
    const response = await api.post("/api/sub/", subscriptionData);
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// Update an existing subscription
export const updateSubscription = async (subscriptionId, subscriptionData) => {
  try {
    const response = await api.put(`/api/sub/update/${subscriptionId}/`, subscriptionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// Delete a subscription
export const deleteSubscription = async (subscriptionId) => {
  try {
    const response = await api.delete(`/api/sub/delete/${subscriptionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId, cancellationDetails = {}) => {
  try {
    const response = await api.put(`/api/sub/${subscriptionId}/cancel/`, cancellationDetails);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// Renew a subscription
export const renewSubscription = async (subscriptionId, renewalDetails = {}) => {
  try {
    const response = await api.put(`/api/sub/${subscriptionId}/renew/`, renewalDetails);
    return response.data;
  } catch (error) {
    console.error(`Error renewing subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// Change subscription plan
export const changeSubscriptionPlan = async (subscriptionId, planId, changeDetails = {}) => {
  try {
    const response = await api.put(`/api/sub/${subscriptionId}/change-plan/`, {
      planId,
      ...changeDetails
    });
    return response.data;
  } catch (error) {
    console.error(`Error changing plan for subscription ${subscriptionId}:`, error);
    throw error;
  }
};