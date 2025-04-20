// src/pages/admin/CustomersManagement.jsx
import { useState } from "react";
import { Edit, Trash2, MoreVertical, Plus, Filter, CreditCard, Calendar } from "lucide-react";
import CustomerModal from "../../components/modal/CustomerModal";
import EditCustomerModal from "../../components/modal/EditCustomerModal";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";

// Static mock data
const MOCK_CUSTOMERS = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 555-123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    currentPlan: {
      planId: "plan1",
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2025-01-01T00:00:00Z",
      autoRenew: true
    },
    balance: 0.00,
    status: "active"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1 555-987-6543",
    address: {
      street: "456 Park Ave",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "USA"
    },
    currentPlan: {
      planId: "plan2",
      startDate: "2024-02-15T00:00:00Z",
      endDate: "2024-08-15T00:00:00Z",
      autoRenew: false
    },
    balance: 299.99,
    status: "active"
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    phoneNumber: "+1 555-234-5678",
    address: {
      street: "789 Oak St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94107",
      country: "USA"
    },
    currentPlan: null,
    balance: 49.99,
    status: "inactive"
  },
  {
    id: "4",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phoneNumber: "+1 555-876-5432",
    address: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "USA"
    },
    currentPlan: {
      planId: "plan3",
      startDate: "2024-03-10T00:00:00Z",
      endDate: "2024-06-10T00:00:00Z",
      autoRenew: true
    },
    balance: 0.00,
    status: "active"
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    phoneNumber: "+1 555-345-6789",
    address: {
      street: "654 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA"
    },
    currentPlan: null,
    balance: 149.50,
    status: "pending"
  }
];

// Static mock plans
const MOCK_PLANS = [
  { id: "plan1", name: "Basic", price: 9.99 },
  { id: "plan2", name: "Premium", price: 19.99 },
  { id: "plan3", name: "Enterprise", price: 49.99 }
];

function CustomersManagement() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [plans] = useState(MOCK_PLANS);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddCustomer = async (customerData) => {
    // Create a new customer with a fake ID
    const newCustomer = {
      ...customerData,
      id: `customer-${Date.now()}`
    };
    
    setCustomers([...customers, newCustomer]);
    setIsModalOpen(false);
  };

  const handleEditCustomer = async (id, customerData) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customerData, id } : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditModalOpen(false);
  };

  const handleDeleteCustomer = async (id) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    // Ensure we have a valid customer object
    if (!customer) return false;
    
    const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = (customer.phoneNumber || "").toLowerCase();
    const address = customer.address ? Object.values(customer.address).join(" ").toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    
    // Status filter - make it case insensitive
    if (statusFilter !== "all") {
      const customerStatus = (customer.status || "").toLowerCase();
      if (customerStatus !== statusFilter.toLowerCase()) {
        return false;
      }
    }
    
    return fullName.includes(search) || 
           email.includes(search) || 
           phone.includes(search) ||
           address.includes(search);
  });

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customers Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customers Management</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers Management</h1>
          <p className="text-gray-600">
            Manage customer profiles, subscriptions and billing
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Customer
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between flex-wrap gap-3">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-4 py-2 rounded-md text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <button className="border px-4 py-2 rounded-md flex items-center text-gray-700">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Customer List</h2>
        {filteredCustomers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No customers matching your search criteria"
              : "No customers found in the database"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subscription
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {customer.firstName
                              ? customer.firstName.charAt(0)
                              : "?"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName && customer.lastName
                              ? `${customer.firstName} ${customer.lastName}`
                              : customer.firstName || customer.lastName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.address ? (
                              <>
                                {customer.address.city}, {customer.address.country}
                              </>
                            ) : (
                              "No address"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email || "N/A"}</div>
                      <div className="text-sm text-gray-500">{customer.phoneNumber || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.currentPlan ? (
                        <div>
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Until: {formatDate(customer.currentPlan.endDate)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.currentPlan.autoRenew ? "Auto-renews" : "Manual renewal"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No active plan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span className={`${parseFloat(customer.balance) > 0 ? "text-red-600" : "text-green-600"}`}>
                          ${typeof customer.balance === 'number' ? customer.balance.toFixed(2) : "0.00"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (customer.status || "").toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : (customer.status || "").toLowerCase() === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {customer.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => openEditModal(customer)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openDeleteModal(customer)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredCustomers.length} of {customers.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="border px-3 py-1 rounded-md text-gray-600">
              Previous
            </button>
            <button className="border px-3 py-1 rounded-md bg-blue-600 text-white">
              1
            </button>
            {customers.length > 10 && (
              <>
                <button className="border px-3 py-1 rounded-md text-gray-600">
                  2
                </button>
                <button className="border px-3 py-1 rounded-md text-gray-600">
                  3
                </button>
              </>
            )}
            <button className="border px-3 py-1 rounded-md text-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={handleAddCustomer}
        plans={plans}
      />

      {/* Edit Customer Modal */}
      {selectedCustomer && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          customer={selectedCustomer}
          onCustomerUpdated={(data) => handleEditCustomer(selectedCustomer.id, data)}
          plans={plans}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedCustomer && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          customer={selectedCustomer}
          onCustomerDeleted={() => handleDeleteCustomer(selectedCustomer.id)}
        />
      )}
    </div>
  );
}

export default CustomersManagement;