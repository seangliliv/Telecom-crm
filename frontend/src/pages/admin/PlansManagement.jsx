import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp,
  Users,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { fetchPlans, createPlan as createPlanApi, updatePlan as updatePlanApi, deletePlan as deletePlanApi } from '../../allApi'; // Updated imports

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [formData, setFormData] = useState({
    planName: '',
    billingCycle: 'Monthly',
    categoryId: '64a8f5d7e8b4c2a4a1d2f3e5', // Default category
    price: '',
    status: '1',
    speed: '',
    subscribers: 0
  });

  // State for error handling
  const [error, setError] = useState(null);

  // Statistics cards data
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalSubscribers: 0,
    averagePrice: 0
  });
 
  // Fetch plans data
  const getPlans = async () => {
    try {
      setLoading(true); // Set loading state at the beginning
      const data = await fetchPlans(); // Using the fetchPlans function from allapi.js
      console.log("Plans data received:", data);
      setPlans(data);
      updateStats(data);
      setLoading(false); // Turn off loading after data is processed
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError(`Failed to fetch plans: ${error.message}`);
      setLoading(false); // Make sure loading is turned off even in case of error
    }
  };

  // Calculate and update statistics
  const updateStats = (plansData) => {
    const active = plansData.filter(plan => plan.status === "1").length;
    const totalSubs = plansData.reduce((sum, plan) => sum + Number(plan.subscribers || 0), 0);
    const avgPrice = plansData.length > 0 
      ? plansData.reduce((sum, plan) => sum + Number(plan.price || 0), 0) / plansData.length 
      : 0;
    
    setStats({
      totalPlans: plansData.length,
      activePlans: active,
      totalSubscribers: totalSubs,
      averagePrice: avgPrice.toFixed(2)
    });
  };

  // Create a new plan
  const createPlan = async () => {
    try {
      setLoading(true);
      await createPlanApi(formData);
      setShowAddModal(false);
      resetForm();
      await getPlans();
    } catch (error) {
      console.error("Error creating plan:", error);
      setError(`Failed to create plan: ${error.message}`);
      setLoading(false);
    }
  };

  // Update an existing plan
  const updatePlan = async () => {
    try {
      setLoading(true);
      await updatePlanApi(currentPlan.id, formData);
      setShowEditModal(false);
      resetForm();
      await getPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
      setError(`Failed to update plan: ${error.message}`);
      setLoading(false);
    }
  };

  // Delete a plan
  const deletePlan = async () => {
    try {
      setLoading(true);
      await deletePlanApi(currentPlan.id);
      setShowDeleteModal(false);
      await getPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      setError(`Failed to delete plan: ${error.message}`);
      setLoading(false);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      planName: '',
      billingCycle: 'Monthly',
      categoryId: '64a8f5d7e8b4c2a4a1d2f3e5',
      price: '',
      status: '1',
      speed: '',
      subscribers: 0
    });
    setCurrentPlan(null);
  };

  // Handle edit plan button click
  const handleEditClick = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      planName: plan.planName,
      billingCycle: plan.billingCycle,
      categoryId: plan.categoryId,
      price: plan.price,
      status: plan.status,
      speed: plan.speed,
      subscribers: plan.subscribers
    });
    setShowEditModal(true);
  };

  // Handle delete plan button click
  const handleDeleteClick = (plan) => {
    setCurrentPlan(plan);
    setShowDeleteModal(true);
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to plans
  const sortedPlans = React.useMemo(() => {
    let sortablePlans = [...plans];
    if (sortConfig.key) {
      sortablePlans.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlans;
  }, [plans, sortConfig]);

  // Filter plans by search term
  const filteredPlans = sortedPlans.filter(plan => 
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Initial data fetch
  useEffect(() => {
    // Only run getPlans once when component mounts
    getPlans();
    
    // Empty dependency array ensures this only runs on mount
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plans Management</h1>
          <p className="text-gray-600">Manage data and service plans for customers</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={getPlans}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Plan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Plans" 
          value={stats.totalPlans} 
          icon={<Wifi className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="Active Plans" 
          value={stats.activePlans} 
          icon={<Wifi className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-100"
        />
        <StatCard 
          title="Total Subscribers" 
          value={stats.totalSubscribers} 
          icon={<Users className="h-6 w-6 text-purple-600" />}
          bgColor="bg-purple-100"
        />
        <StatCard 
          title="Average Price" 
          value={`$${stats.averagePrice}`} 
          icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          <div className="flex space-x-2">
            <select className="border rounded-md p-2">
              <option>All Categories</option>
              <option>Internet Plans</option>
              <option>Voice Plans</option>
              <option>Combo Plans</option>
            </select>
            <button className="p-2 border rounded-md">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
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
                    onClick={() => requestSort('planName')}
                  >
                    <div className="flex items-center">
                      Plan Name
                      {getSortIndicator('planName')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('billingCycle')}
                  >
                    <div className="flex items-center">
                      Billing Cycle
                      {getSortIndicator('billingCycle')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {getSortIndicator('price')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('speed')}
                  >
                    <div className="flex items-center">
                      Speed (Mbps)
                      {getSortIndicator('speed')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('subscribers')}
                  >
                    <div className="flex items-center">
                      Subscribers
                      {getSortIndicator('subscribers')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIndicator('status')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Wifi className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{plan.planName}</div>
                            <div className="text-xs text-gray-500">ID: {typeof plan.id === 'string' ? plan.id.slice(-8) : plan.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">{plan.billingCycle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{plan.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.speed} Mbps
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">{plan.subscribers}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status === "1" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {plan.status === "1" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditClick(plan)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(plan)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? "No plans match your search" : "No plans found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredPlans.length} of {plans.length} plans
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded bg-white text-gray-600">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded bg-white text-gray-600">
              2
            </button>
            <button className="px-3 py-1 border rounded bg-white text-gray-600">
              3
            </button>
            <button className="px-3 py-1 border rounded bg-white text-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <Modal 
          title="Add New Plan" 
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                value={formData.planName}
                onChange={(e) => setFormData({...formData, planName: e.target.value})}
                className="w-full border p-2 rounded-md"
                placeholder="e.g. Data Plus Pro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}
                className="w-full border p-2 rounded-md"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-8 border p-2 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({...formData, speed: e.target.value})}
                className="w-full border p-2 rounded-md"
                placeholder="e.g. 100"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border p-2 rounded-md"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
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
                onClick={createPlan}
              >
                Create Plan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <Modal 
          title={`Edit Plan: ${currentPlan.planName}`} 
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                value={formData.planName}
                onChange={(e) => setFormData({...formData, planName: e.target.value})}
                className="w-full border p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}
                className="w-full border p-2 rounded-md"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-8 border p-2 rounded-md"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({...formData, speed: e.target.value})}
                className="w-full border p-2 rounded-md"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border p-2 rounded-md"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="pt-3 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={updatePlan}
              >
                Update Plan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Plan Modal */}
      {showDeleteModal && (
        <Modal 
          title="Delete Plan" 
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-4">
            <p className="mb-4">Are you sure you want to delete the plan: <strong>{currentPlan.planName}</strong>?</p>
            <p className="mb-6 text-sm text-gray-500">This action cannot be undone. This will permanently delete the plan and remove it from our servers.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={deletePlan}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600">{title}</h2>
        <div className={`${bgColor} p-2 rounded-full`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlansManagement;