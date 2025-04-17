// src/components/DeleteConfirmationModal.jsx
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

function DeleteConfirmationModal({ isOpen, onClose, customer, onCustomerDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onCustomerDeleted();
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-red-600">Delete Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle className="h-12 w-12" />
          </div>
          
          <h3 className="text-lg font-medium text-center mb-2">
            Are you sure you want to delete this customer?
          </h3>
          
          <p className="text-gray-600 text-center mb-4">
            This will permanently delete {customer.firstName} {customer.lastName}'s account
            and all associated data. This action cannot be undone.
          </p>

          {customer.currentPlan && customer.currentPlan.planId && (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-yellow-700 text-sm">
                <strong>Warning:</strong> This customer has an active subscription plan.
                Deleting this customer will also remove all subscription and billing information.
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;