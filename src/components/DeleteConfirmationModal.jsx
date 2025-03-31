import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, customer, onCustomerDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Log what we're trying to delete for debugging
      console.log("Deleting customer with ID:", customer.id);
      
      // Try alternative API endpoint format
      await axios.delete(`http://45.150.128.165:8000/api/customers`, {
        headers: {
          'Content-Type': 'application/json',
          'token': "24ad193a650d5a824asdasdfsa9d84ffasdfasdf212ab43993",
        },
        data: { id: customer.id }  // Send ID in request body
      });

      setLoading(false);
      onCustomerDeleted(customer.id);
      onClose();
    } catch (error) {
      setLoading(false);
      // More detailed error logging
      console.error("Error deleting customer:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      setError(error.response?.data?.message || "Failed to delete customer. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">Delete Customer</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <p className="mb-6">
          Are you sure you want to delete <span className="font-semibold">{customer?.firstName} {customer?.lastName}</span>? 
          This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;