import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Plus, 
  MoreVertical, 
  DollarSign,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { fetchPaymentMethods, createPaymentMethod, deletePaymentMethod } from '../../services/billingApi';

const UserBilling = ({ customerId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [newCard, setNewCard] = useState({
    card_number: '',
    card_holder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: ''
  });

  // Fetch payment methods for the customer
  useEffect(() => {
    const getPaymentMethods = async () => {
      // Don't attempt to fetch if customerId is undefined or null
      if (!customerId) {
        setError("Invalid customer ID. Please check your configuration.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchPaymentMethods(customerId);
        setPaymentMethods(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
        setError("Failed to load payment methods. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    getPaymentMethods();
  }, [customerId]);

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    // Don't attempt to create if customerId is undefined or null
    if (!customerId) {
      showNotification('Invalid customer ID. Cannot add payment method.', 'error');
      return;
    }
    
    try {
      const data = await createPaymentMethod({
        customer_id: customerId,
        ...newCard
      });
      
      // Add the new payment method to the list
      setPaymentMethods([...paymentMethods, data]);
      
      // Clear the form and hide it
      setNewCard({
        card_number: '',
        card_holder_name: '',
        expiry_month: '',
        expiry_year: '',
        cvv: ''
      });
      setShowAddForm(false);
      
      // Show success notification
      showNotification('Payment method added successfully', 'success');
    } catch (err) {
      console.error("Error adding payment method:", err);
      showNotification('Failed to add payment method', 'error');
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    // Don't attempt to delete if paymentMethodId is undefined or null
    if (!paymentMethodId) {
      showNotification('Invalid payment method ID', 'error');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(paymentMethodId);
        
        // Remove the deleted payment method from the list
        setPaymentMethods(paymentMethods.filter(method => method.id !== paymentMethodId));
        
        // Show success notification
        showNotification('Payment method deleted successfully', 'success');
      } catch (err) {
        console.error("Error deleting payment method:", err);
        showNotification('Failed to delete payment method', 'error');
      }
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  // Helper function to format card number with spaces
  const formatCardNumber = (number) => {
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Helper function to determine card type from number
  const getCardType = (number) => {
    if (!number) return '';
    
    // Visa
    if (number.startsWith('4')) {
      return 'Visa';
    }
    // Mastercard
    else if (/^5[1-5]/.test(number)) {
      return 'Mastercard';
    }
    // Amex
    else if (/^3[47]/.test(number)) {
      return 'Amex';
    }
    // Discover
    else if (/^6(?:011|5)/.test(number)) {
      return 'Discover';
    }
    
    return 'Unknown';
  };

  return (
    <div className="p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-gray-600">Manage your payment options</p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Payment Methods</h2>
          <button 
            className="bg-blue-600 text-white flex items-center px-4 py-2 rounded-md"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add New'}
          </button>
        </div>
        
        {/* Loading and Error States */}
        {loading && <div className="text-center py-4">Loading payment methods...</div>}
        {error && !loading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Add Payment Method Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Payment Method</h3>
            <form onSubmit={handleAddPaymentMethod}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="card_number"
                    value={newCard.card_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="card_holder_name"
                    value={newCard.card_holder_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Month
                    </label>
                    <select
                      name="expiry_month"
                      value={newCard.expiry_month}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Year
                    </label>
                    <select
                      name="expiry_year"
                      value={newCard.expiry_year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Year</option>
                      {[...Array(10)].map((_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Payment Methods List */}
        {!loading && paymentMethods.length === 0 && !error && (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No payment methods found</h3>
            <p className="text-gray-500 mb-4">Add a payment method to manage your billing</p>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div className="flex items-center">
                {getCardType(method.card_number) === 'Visa' ? (
                  <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                ) : getCardType(method.card_number) === 'Mastercard' ? (
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <div className="flex">
                      <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-gray-700 text-xs font-bold">
                    {getCardType(method.card_number)}
                  </div>
                )}
                <div className="ml-4">
                  <p className="font-medium">
                    {getCardType(method.card_number)} ending in {method.card_number.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiry_month}/{method.expiry_year.toString().slice(-2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {method.is_default && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-3">
                    Default
                  </span>
                )}
                <button 
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleDeletePaymentMethod(method.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <BillingInfoCard 
            title="Current Balance"
            value="$0.00"
            subtitle="Last updated: Today"
            icon={<DollarSign className="h-6 w-6 text-gray-700" />}
          />
          <BillingInfoCard 
            title="Next Payment"
            value="$29.99"
            subtitle="Due on: May 1, 2025"
            icon={<Calendar className="h-6 w-6 text-gray-700" />}
          />
          <BillingInfoCard 
            title="Current Plan"
            value="Premium"
            subtitle="Monthly subscription"
            icon={<CreditCard className="h-6 w-6 text-gray-700" />}
          />
        </div>
      </div>
    </div>
  );
};

// Billing Info Card Component
const BillingInfoCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
};

export default UserBilling;