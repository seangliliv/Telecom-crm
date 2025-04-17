import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Clipboard, 
  Clock, 
  Users, 
  Plus, 
  RefreshCw, 
  FileText, 
  LayoutGrid, 
  Eye, 
  Edit, 
  Trash, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  fetchSubscriptions, 
  fetchSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  fetchSubscriptionsByCustomer
} from '../../services/subscriptionApi';
import { fetchCustomers } from '../../services/customerApi';
import { fetchPlans } from '../../services/plansApi';

const SubscriptionBilling = () => {
  // State for data and UI
  const [subscriptions, setSubscriptions] = useState([]);
  const [enhancedSubscriptions, setEnhancedSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "startDate",
    direction: "descending",
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form data for new subscription
  const [formData, setFormData] = useState({
    customerId: "",
    planId: "",
    status: "active",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    autoRenew: true
  });

  // Stats for subscription overview
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    expiringSoon: 0,
    revenueThisMonth: 0
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      let subsData = [], cusData = [], planData = [];
      
      try {
        subsData = await fetchSubscriptions();
        console.log("Subscription data:", subsData);
      } catch (subError) {
        console.error("Error fetching subscriptions:", subError);
        setError(`Failed to fetch subscriptions: ${subError.message}`);
      }
      
      try {
        cusData = await fetchCustomers();
        console.log("Customer data:", cusData);
      } catch (cusError) {
        console.error("Error fetching customers:", cusError);
      }
      
      try {
        planData = await fetchPlans();
        console.log("Plan data:", planData);
      } catch (planError) {
        console.error("Error fetching plans:", planError);
      }

      // Ensure we have arrays
      const safeSubsData = Array.isArray(subsData) ? subsData : [];
      const safeCustomersData = Array.isArray(cusData) ? cusData : [];
      const safePlansData = Array.isArray(planData) ? planData : [];

      // Save raw data
      setSubscriptions(safeSubsData);
      setCustomers(safeCustomersData);
      setPlans(safePlansData);

      // Enhance subscription data with customer and plan info
      const enhanced = safeSubsData.map(subscription => {
        const customer = safeCustomersData.find(c => c.id === subscription.customerId || c._id === subscription.customerId);
        const plan = safePlansData.find(p => p.id === subscription.planId || p._id === subscription.planId);

        // Get a displayable customer ID (last 6 chars if possible)
        const shortCustomerId = subscription.customerId 
          ? (typeof subscription.customerId === 'string' && subscription.customerId.length > 6 
              ? subscription.customerId.slice(-6) 
              : subscription.customerId)
          : 'Unknown';

        return {
          ...subscription,
          customerName: customer 
            ? (customer.name || customer.fullName || `Customer ${shortCustomerId}`) 
            : `Customer ${shortCustomerId}`,
          customerEmail: customer 
            ? customer.email 
            : subscription.customerEmail || 'unknown@example.com',
          planName: plan 
            ? (plan.name || 'Unknown Plan') 
            : (subscription.planName || 'Unknown Plan'),
          planPrice: plan 
            ? (plan.price || 0) 
            : (subscription.planPrice || 0),
          billingCycle: plan 
            ? (plan.billingCycle || 'monthly') 
            : (subscription.billingCycle || 'monthly'),
          // Normalize status
          status: normalizeStatus(subscription.status)
        };
      });

      setEnhancedSubscriptions(enhanced);
      
      // Calculate statistics
      calculateStats(enhanced);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message}`);
      setLoading(false);
    }
  };

  // Normalize status values for consistency
  const normalizeStatus = (status) => {
    if (!status) return "Inactive";

    const statusLower = status.toLowerCase();

    if (
      statusLower === "active" ||
      statusLower === "1" ||
      statusLower === "true"
    ) {
      return "Active";
    } else if (
      statusLower === "inactive" ||
      statusLower === "0" ||
      statusLower === "false"
    ) {
      return "Inactive";
    } else if (
      statusLower === "cancelled" ||
      statusLower === "canceled"
    ) {
      return "Cancelled";
    } else if (
      statusLower === "expired"
    ) {
      return "Expired";
    } else if (
      statusLower === "trial"
    ) {
      return "Trial";
    }

    // Default case
    return "Active";
  };

  // Calculate subscription statistics
  const calculateStats = (subsData) => {
    if (!Array.isArray(subsData)) return;

    const total = subsData.length;
    
    // Count active subscriptions
    const active = subsData.filter(
      sub => sub.status === "Active"
    ).length;

    // Count subscriptions expiring in the next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const expiring = subsData.filter(sub => {
      if (!sub.endDate) return false;
      const endDate = new Date(sub.endDate);
      return endDate >= now && endDate <= thirtyDaysFromNow && sub.status === "Active";
    }).length;

    // Calculate revenue this month
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const revenue = subsData.reduce((sum, sub) => {
      if (sub.status !== "Active") return sum;
      
      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      const endDate = sub.endDate ? new Date(sub.endDate) : null;
      
      // Check if subscription is active this month
      if (startDate && 
          (startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear) ||
          (endDate && endDate.getMonth() === thisMonth && endDate.getFullYear() === thisYear) ||
          (startDate < now && (!endDate || endDate > now))
      ) {
        return sum + (parseFloat(sub.planPrice) || 0);
      }
      
      return sum;
    }, 0);

    setStats({
      totalSubscriptions: total,
      activeSubscriptions: active,
      expiringSoon: expiring,
      revenueThisMonth: revenue.toFixed(2)
    });
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter subscriptions based on search term and status
  const filteredSubscriptions = React.useMemo(() => {
    let result = [...enhancedSubscriptions];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (sub) =>
          (sub.customerName &&
            sub.customerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (sub.planName &&
            sub.planName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (sub.id &&
            sub.id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [enhancedSubscriptions, searchTerm, statusFilter, sortConfig]);

  // Create a new subscription
  const handleCreateSubscription = async () => {
    try {
      setLoading(true);

      // Ensure dates are in ISO format
      const apiFormData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };

      await createSubscription(apiFormData);

      setNotification({
        type: "success",
        message: "Subscription created successfully!"
      });

      // Clear form and hide modal
      resetForm();
      setShowAddModal(false);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error creating subscription:", error);
      setNotification({
        type: "error",
        message: `Failed to create subscription: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Update a subscription
  const handleUpdateSubscription = async () => {
    try {
      if (!currentSubscription || !currentSubscription.id) {
        throw new Error("No subscription selected");
      }

      setLoading(true);

      // Ensure dates are in ISO format
      const apiFormData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };

      await updateSubscription(currentSubscription.id, apiFormData);

      setNotification({
        type: "success",
        message: "Subscription updated successfully!"
      });

      // Clear form and hide modal
      resetForm();
      setShowViewModal(false);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error updating subscription:", error);
      setNotification({
        type: "error",
        message: `Failed to update subscription: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a subscription
  const handleDeleteSubscription = async () => {
    try {
      if (!currentSubscription || !currentSubscription.id) {
        throw new Error("No subscription selected");
      }

      setLoading(true);

      await deleteSubscription(currentSubscription.id);

      setNotification({
        type: "success",
        message: "Subscription deleted successfully!"
      });

      // Clear form and hide modal
      setShowDeleteModal(false);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      setNotification({
        type: "error",
        message: `Failed to delete subscription: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // View subscription details
  const viewSubscription = (subscription) => {
    console.log("Viewing subscription:", subscription);
    setCurrentSubscription(subscription);
    
    // Populate form with subscription data
    setFormData({
      customerId: subscription.customerId || "",
      planId: subscription.planId || "",
      status: (subscription.status || "active").toLowerCase(),
      startDate: subscription.startDate 
        ? new Date(subscription.startDate).toISOString().split("T")[0] 
        : new Date().toISOString().split("T")[0],
      endDate: subscription.endDate 
        ? new Date(subscription.endDate).toISOString().split("T")[0] 
        : "",
      autoRenew: subscription.autoRenew || false
    });
    
    setShowViewModal(true);
  };

  // Handle delete confirmation modal
  const confirmDeleteSubscription = (subscription) => {
    setCurrentSubscription(subscription);
    setShowDeleteModal(true);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      customerId: "",
      planId: "",
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      autoRenew: true
    });
    setCurrentSubscription(null);
  };

  // Calculate end date based on billing cycle
  const calculateEndDate = (startDate, billingCycle) => {
    if (!startDate) return "";
    
    const date = new Date(startDate);
    
    switch (billingCycle.toLowerCase()) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'biannual':
      case 'semi-annual':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'annual':
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1); // Default to monthly
    }
    
    return date.toISOString().split("T")[0];
  };

  // Handle plan selection change
  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p.id === planId);
    const billingCycle = selectedPlan ? selectedPlan.billingCycle || 'monthly' : 'monthly';
    
    // Calculate end date based on billing cycle
    const endDate = calculateEndDate(formData.startDate, billingCycle);
    
    setFormData({
      ...formData,
      planId,
      endDate
    });
  };

  // Clear notification after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Formatting functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">View and manage customer subscriptions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Subscription
          </button>
        </div>
      </div>

      {/* Notification Message */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : notification.type === "error"
              ? "bg-red-50 border-red-400 text-red-700"
              : "bg-blue-50 border-blue-400 text-blue-700"
          } border-l-4`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === "success" && (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
              {notification.type === "error" && (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
              {notification.type === "info" && (
                <AlertCircle className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Subscriptions"
          value={loading ? "Loading..." : stats.totalSubscriptions}
          icon={<Clipboard className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Active Subscriptions"
          value={loading ? "Loading..." : stats.activeSubscriptions}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="Expiring Soon"
          value={loading ? "Loading..." : stats.expiringSoon}
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Monthly Revenue"
          value={loading ? "Loading..." : `$${stats.revenueThisMonth}`}
          icon={<DollarSign className="h-6 w-6 text-purple-600" />}
          bgColor="bg-purple-100"
        />
      </div>

      {/* Subscriptions Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="border rounded-md p-2"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
              <option value="Trial">Trial</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center">
                      Subscription ID
                      {getSortIndicator("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("customerName")}
                  >
                    <div className="flex items-center">
                      Customer
                      {getSortIndicator("customerName")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("planName")}
                  >
                    <div className="flex items-center">
                      Plan
                      {getSortIndicator("planName")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("startDate")}
                  >
                    <div className="flex items-center">
                      Start Date
                      {getSortIndicator("startDate")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("endDate")}
                  >
                    <div className="flex items-center">
                      End Date
                      {getSortIndicator("endDate")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIndicator("status")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription, index) => (
                    <tr key={subscription.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clipboard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.id ? subscription.id.slice(-8) : `SUB-${index + 1000}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscription.customerName || "Unknown Customer"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subscription.customerEmail || "unknown@example.com"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscription.planName || "Unknown Plan"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscription.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscription.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={subscription.status || "Inactive"} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewSubscription(subscription)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Subscription"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              viewSubscription(subscription);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Subscription"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteSubscription(subscription)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Subscription"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {searchTerm || statusFilter !== "All"
                        ? "No subscriptions match your search criteria"
                        : "No subscriptions found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredSubscriptions.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredSubscriptions.length} of {enhancedSubscriptions.length} subscriptions
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 border rounded bg-blue-600 text-white">
                1
              </button>
              <button className="px-3 py-1 border rounded bg-white   text-gray-600">
                2
              </button>
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View/Edit Subscription Modal */}
      {showViewModal && currentSubscription && (
        <Modal
          title={`Subscription Details: ${currentSubscription.id ? currentSubscription.id.slice(-8) : 'New'}`}
          onClose={() => setShowViewModal(false)}
          size="large"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full border p-2 rounded-md"
                  disabled={currentSubscription.id} // Don't allow changing customer for existing subscription
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name || customer.fullName || `Customer ${customer.id.slice(-6)}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={formData.planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name || `Plan ${plan.id.slice(-6)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-renew subscription</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowViewModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleUpdateSubscription}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Subscription"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Subscription Modal */}
      {showAddModal && (
        <Modal
          title="Create New Subscription"
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          size="large"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name || customer.fullName || `Customer ${customer.id.slice(-6)}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={formData.planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name || `Plan ${plan.id.slice(-6)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-renew subscription</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleCreateSubscription}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Subscription"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Subscription Modal */}
      {showDeleteModal && currentSubscription && (
        <Modal
          title="Delete Subscription"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-4">
            <p className="mb-4">
              Are you sure you want to delete the subscription for{" "}
              <strong>{currentSubscription.customerName}</strong>?
            </p>
            <p className="mb-6 text-sm text-gray-500">
              This action cannot be undone. This will permanently delete the
              subscription and remove it from our servers.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteSubscription}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Subscription"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color = '';
  switch (status) {
    case 'Active':
      color = 'bg-green-100 text-green-800';
      break;
    case 'Trial':
      color = 'bg-blue-100 text-blue-800';
      break;
    case 'Inactive':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Cancelled':
      color = 'bg-red-100 text-red-800';
      break;
    case 'Expired':
      color = 'bg-gray-100 text-gray-800';
      break;
    default:
      color = 'bg-blue-100 text-blue-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600">{title}</h2>
        <div className={`${bgColor} p-2 rounded-full`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, onClose, size = "medium" }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full mx-4 ${
          size === "large" ? "max-w-4xl" : "max-w-md"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SubscriptionBilling;