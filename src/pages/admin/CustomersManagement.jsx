import React, { useState, useEffect } from "react";
import { Edit, Trash2, MoreVertical, Plus, Filter } from "lucide-react";
import axios from "axios";
import CustomerModal from "../../components/CustomerModal";
import EditCustomerModal from "../../components/EditCustomerModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const CustomersManagement = () => {
  const [Client, setClient] = useState([]);
  const [Plans, setPlans] = useState([]);
  const [Cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getPlans = async () => {
    try {
      const resp = await axios.get("http://45.150.128.165:8000/api/plans/", {
        headers: {
          token: "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993",
        },
      });
      console.log(resp.data);
      setPlans(resp.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  
  const getCats = async () => {
    try {
      const resp = await axios.get("http://45.150.128.165:8000/api/categories/", {
        headers: {
          token: "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993",
        },
      });
      console.log(resp.data);
      setCats(resp.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getClient = async () => {
    setLoading(true);
    try {
      const resp = await axios.get("http://45.150.128.165:8000/api/customers/", {
        headers: {
          token: "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993",
        },
      });
      console.log("API Response:", resp.data);
      
      // Log the first customer object to inspect its structure
      if (resp.data && resp.data.length > 0) {
        console.log("First customer object structure:", resp.data[0]);
      }
      
      setClient(resp.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load customers. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getClient();
    getPlans();
    getCats();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = searchTerm 
    ? Client.filter(customer => {
        const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim().toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : Client;

  // Handler functions for CRUD operations
  const handleAddCustomer = (newCustomer) => {
    // Add the new customer to the Client state
    setClient([...Client, newCustomer]);
  };
  
  const handleEditCustomer = (updatedCustomer) => {
    // Update the customer in the Client state
    setClient(Client.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };
  
  const handleDeleteCustomer = (customerId) => {
    // Remove the customer from the Client state
    setClient(Client.filter(customer => customer.id !== customerId));
  };
  
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

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
            Manage customer profiles and activities
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
          <div className="ml-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="font-medium">A</span>
          </div>
          <span className="ml-2 font-medium">Admin</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between">
          <div className="relative w-full mr-4">
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
          <button className="border px-4 py-2 rounded-md flex items-center text-gray-700">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Customer List</h2>
        {filteredCustomers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? "No customers matching your search" : "No customers found in the database"}
          </div>
        ) : (
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
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone Number
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
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {customer.firstName ? customer.firstName.charAt(0) : "?"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName && customer.lastName ? 
                            `${customer.firstName} ${customer.lastName}` : 
                            customer.firstName || customer.lastName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === "Active" ? "bg-green-100 text-green-800" :
                      customer.status === "Inactive" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
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
        )}

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredCustomers.length} of {Client.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="border px-3 py-1 rounded-md text-gray-600">
              Previous
            </button>
            <button className="border px-3 py-1 rounded-md bg-blue-600 text-white">
              1
            </button>
            {Client.length > 10 && (
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
      />
      
      {/* Edit Customer Modal */}
      {selectedCustomer && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          customer={selectedCustomer}
          onCustomerUpdated={handleEditCustomer}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {selectedCustomer && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          customer={selectedCustomer}
          onCustomerDeleted={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

export default CustomersManagement;