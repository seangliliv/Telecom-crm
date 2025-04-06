// File: src/context/CrmContext.jsx
import { createContext, useContext, useState } from 'react';
import * as apiService from '../services/adminDashboardApi';

const CrmContext = createContext();
export const useCrm = () => useContext(CrmContext);

export const CrmProvider = ({ children }) => {
  const [state, setState] = useState({
    customers: [], plans: [], categories: [], subscriptions: [], invoices: [],
    issues: [], campaigns: [], leads: [], services: [], customerServices: [],
    users: [], roles: [], communications: [], issueComments: [], campaignActivities: []
  });

  const [loading, setLoading] = useState(Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
  const [errors, setErrors] = useState(Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: null }), {}));

  const fetchers = {
    customers: apiService.fetchCustomers,
    plans: apiService.fetchPlans,
    categories: apiService.fetchCategories,
    subscriptions: apiService.fetchSubscriptions,
    invoices: apiService.fetchInvoices,
    issues: apiService.fetchIssues,
    campaigns: apiService.fetchCampaigns,
    leads: apiService.fetchLeads,
    services: apiService.fetchServices,
    customerServices: apiService.fetchCustomerServices,
    users: apiService.fetchUsers,
    roles: apiService.fetchRoles,
    communications: apiService.fetchCommunications,
    issueComments: apiService.fetchIssueComments,
    campaignActivities: apiService.fetchCampaignActivities
  };

  const fetchData = async (key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const data = await fetchers[key]();
      setState(prev => ({ ...prev, [key]: data }));
      setErrors(prev => ({ ...prev, [key]: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const fetchAllData = () => {
    Object.keys(fetchers).forEach(fetchData);
  };

  const value = {
    ...state,
    loading,
    errors,
    fetchAllData,
    ...Object.keys(fetchers).reduce((acc, key) => {
      acc[`fetch${key.charAt(0).toUpperCase() + key.slice(1)}`] = () => fetchData(key);
      return acc;
    }, {})
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};
