import React, { useEffect, useState } from 'react';
import { 
  Wifi, 
  Computer, 
  Calendar, 
  Download,
  CreditCard,
  Headphones
} from 'lucide-react';
import { userApi } from '../../services/userApi';
import AuthService from '../../utils/AuthService';
import { createSubscription } from '../../services/subscriptionApi';
import { fetchPlans } from '../../services/plansApi';
import { createCustomer, fetchCustomersByUserId } from '../../services/customerApi';
import { createPaymentMethod } from '../../services/billingApi';
import { createInvoice } from '../../services/invoiceApi';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State variables for customer and subscription management
  const [isCustomer, setIsCustomer] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [processingSubscription, setProcessingSubscription] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.error("User is not authenticated");
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        
        // Try multiple ways to get the current user info
        console.log("Fetching current user data...");
        
        // Option 1: Get from login response stored in localStorage
        const loginEmail = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        
        console.log("User data from localStorage - Email:", loginEmail, "ID:", userId);
        
        // If we have the user ID, try to fetch by ID
        if (userId) {
          try {
            console.log("Attempting to fetch user by ID:", userId);
            const response = await userApi.getUserById(userId);
            
            if (response && response.data) {
              console.log("Successfully retrieved user by ID:", response.data);
              const userData = userApi.processUserData(response.data);
              setUserData(userData);
              
              // Now check if user has associated customers using our new endpoint
              try {
                const customersResponse = await fetchCustomersByUserId(userId);
                console.log("User's customers:", customersResponse);
                
                if (customersResponse && customersResponse.data && customersResponse.data.length > 0) {
                  setIsCustomer(true);
                  setCustomerData(customersResponse.data[0]);
                  console.log("User is a customer, data:", customersResponse.data[0]);
                }
              } catch (customerError) {
                console.error("Error fetching user's customers:", customerError);
              }
              
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error fetching by ID:", error);
            // Continue to next approach
          }
        }
        
        // Option 2: If we have the email, try to fetch by filtering
        if (loginEmail) {
          try {
            console.log("Attempting to fetch user by email:", loginEmail);
            const response = await userApi.getAllUsers();
            
            if (response && response.data) {
              const users = response.data.data || response.data || [];
              const currentUser = users.find(user => user.email === loginEmail);
              
              if (currentUser) {
                console.log("Found user with matching email:", currentUser);
                const userData = userApi.processUserData(currentUser);
                setUserData(userData);
                
                // Now check if user has associated customers using our new endpoint
                try {
                  const customersResponse = await fetchCustomersByUserId(userData.id);
                  console.log("User's customers:", customersResponse);
                  
                  if (customersResponse && customersResponse.data && customersResponse.data.length > 0) {
                    setIsCustomer(true);
                    setCustomerData(customersResponse.data[0]);
                    console.log("User is a customer, data:", customersResponse.data[0]);
                  }
                } catch (customerError) {
                  console.error("Error fetching user's customers:", customerError);
                }
                
                setLoading(false);
                return;
              }
            }
          } catch (error) {
            console.error("Error fetching by email:", error);
            // Continue to next approach
          }
        }
        
        // Option 3: Last resort - get all users and use the first one
        try {
          console.log("Attempting to fetch all users as fallback");
          const response = await userApi.getAllUsers();
          
          if (response && response.data) {
            const users = response.data.data || response.data || [];
            
            if (users.length > 0) {
              console.log("Using first user from list as fallback:", users[0]);
              const userData = userApi.processUserData(users[0]);
              setUserData(userData);
              
              // Now check if user has associated customers using our new endpoint
              try {
                const customersResponse = await fetchCustomersByUserId(userData.id);
                console.log("User's customers:", customersResponse);
                
                if (customersResponse && customersResponse.data && customersResponse.data.length > 0) {
                  setIsCustomer(true);
                  setCustomerData(customersResponse.data[0]);
                  console.log("User is a customer, data:", customersResponse.data[0]);
                }
              } catch (customerError) {
                console.error("Error fetching user's customers:", customerError);
              }
              
              setLoading(false);
              return;
            }
          }
          
          throw new Error("No users found in system");
        } catch (error) {
          console.error("Error in fallback approach:", error);
          setError("Could not retrieve user data");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };
    
    // Fetch available plans
    const fetchAvailablePlans = async () => {
      try {
        console.log("Fetching available plans...");
        const plans = await fetchPlans();
        console.log("Available plans:", plans);
        setAvailablePlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Continue with empty plans array, fallback will be used
      }
    };
    
    // Execute both fetch functions
    fetchUserData();
    fetchAvailablePlans();
  }, []);

  // Handle Quick Top-Up click
  const handleQuickTopUp = () => {
    console.log("Quick Top-Up clicked");
    // If user is already a customer, show top-up modal
    // If user is not a customer yet, show subscription plans
    setShowPlansModal(true);
  };
  
  // Handle plan selection and subscription
  const handleSubscribeToPlan = async (planId) => {
    try {
      console.log("Subscribing to plan:", planId);
      setProcessingSubscription(true);
      
      if (!userData) {
        toast.error("User data not available. Please try again.");
        setProcessingSubscription(false);
        return;
      }
      
      // 1. Create customer record if user is not already a customer
      let customerId;
      if (!isCustomer) {
        const customerData = {
          userId: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber || '555-555-5555',
          status: 'active'
        };
        
        console.log("Creating new customer:", customerData);
        const customerResponse = await createCustomer(customerData);
        console.log("Created new customer:", customerResponse);
        
        if (customerResponse && customerResponse.data) {
          customerId = customerResponse.data.id || customerResponse.data._id;
          setCustomerData(customerResponse.data);
          setIsCustomer(true);
        } else {
          throw new Error("Failed to create customer record");
        }
      } else {
        customerId = customerData.id;
      }
      
      // 2. Create subscription with the selected plan
      const startDate = new Date();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days later
      
      const subscriptionData = {
        customerId: customerId,
        planId: planId,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        autoRenew: true
      };
      
      console.log("Creating subscription:", subscriptionData);
      const subscriptionResponse = await createSubscription(subscriptionData);
      console.log("Created subscription:", subscriptionResponse);
      
      if (subscriptionResponse && subscriptionResponse.data) {
        const subscriptionId = subscriptionResponse.data.id || subscriptionResponse.data._id;
        setActiveSubscription(subscriptionResponse.data);
        
        // 3. Create an invoice for the subscription
        const selectedPlan = availablePlans.find(plan => plan.id === planId) || 
                            { price: 29.99, name: 'Premium Plan' };
        
        const invoiceData = {
          customerId: customerId,
          subscriptionId: subscriptionId,
          amount: selectedPlan.price || 29.99,
          status: 'unpaid',
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          items: [
            {
              description: `Subscription to ${selectedPlan.name || 'Premium'} Plan`,
              amount: selectedPlan.price || 29.99
            }
          ]
        };
        
        console.log("Creating invoice:", invoiceData);
        const invoiceResponse = await createInvoice(invoiceData);
        console.log("Created invoice:", invoiceResponse);
        
        if (invoiceResponse && invoiceResponse.data) {
          const invoiceId = invoiceResponse.data.id || invoiceResponse.data._id;
          
          // 4. Add a payment method linked to the invoice (optional)
          const paymentMethodData = {
            customerId: customerId,
            invoiceId: invoiceId,
            type: 'credit_card',
            cardType: 'visa',
            lastFour: '4242',
            expiryDate: '12/28',
            isDefault: true
          };
          
          try {
            console.log("Creating payment method:", paymentMethodData);
            const paymentMethodResponse = await createPaymentMethod(paymentMethodData);
            console.log("Created payment method:", paymentMethodResponse);
          } catch (paymentError) {
            console.error("Error creating payment method:", paymentError);
            // Continue with subscription flow even if payment method creation fails
          }
        }
      }
      
      toast.success("Subscription successful!");
      setShowPlansModal(false);
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Failed to subscribe to plan. Please try again.");
    } finally {
      setProcessingSubscription(false);
    }
  };

  // Extract user's first name or use default
  const firstName = userData?.firstName || "User";
  
  // Get plan details from active subscription or default values
  const currentPlanDetails = () => {
    if (!isCustomer) return { name: 'No Active Plan', validUntil: '' };
    
    if (customerData && customerData.currentPlan && customerData.currentPlan.planId) {
      const endDate = customerData.currentPlan.endDate ? 
        new Date(customerData.currentPlan.endDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Unknown';
      
      return {
        name: 'Premium 8GB', // This should come from plan details in a real app
        validUntil: endDate
      };
    }
    
    if (activeSubscription) {
      const endDate = activeSubscription.endDate ? 
        new Date(activeSubscription.endDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Unknown';
      
      return {
        name: 'Premium 8GB', // This should come from plan details in a real app
        validUntil: endDate
      };
    }
    
    return { 
      name: 'Basic Plan', 
      validUntil: 'March 15, 2025' // Default placeholder
    };
  };
  
  const planInfo = currentPlanDetails();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {loading ? (
            <p className="text-gray-600">Loading user data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-600">Welcome back, {firstName}</p>
          )}
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700">
          <Download className="h-5 w-5 mr-2" />
          Export
        </button>
      </div>

      {/* Current Plan Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {isCustomer 
                ? `Current Plan: ${planInfo.name}` 
                : `No Active Plan`}
            </h2>
            <p className="text-gray-500">
              {isCustomer 
                ? `Valid until ${planInfo.validUntil}` 
                : `Subscribe to a plan to access our services`}
            </p>
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleQuickTopUp}
            disabled={processingSubscription}
          >
            {processingSubscription ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isCustomer ? 'Quick Top-Up' : 'Subscribe Now'}
          </button>
        </div>

        {/* Usage Bars - Only show if customer */}
        {isCustomer && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UsageBar 
              label="Data" 
              used="5.2GB" 
              total="8GB" 
              percentage={65} 
              color="bg-blue-500" 
            />
            <UsageBar 
              label="Calls" 
              used="45min" 
              total="120min" 
              percentage={37} 
              color="bg-green-500" 
            />
            <UsageBar 
              label="SMS" 
              used="25" 
              total="100" 
              percentage={25} 
              color="bg-purple-500" 
            />
          </div>
        )}
        
        {/* Subscribe prompt if not customer */}
        {!isCustomer && !loading && (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Subscribe to a plan to start enjoying our telecom services.
            </p>
            <button 
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              onClick={handleQuickTopUp}
            >
              View Available Plans
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards - Show for all users, but with different data for non-customers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Internet Speed" 
          value={isCustomer ? "85.2" : "0"} 
          unit="Mbps" 
          subtitle={isCustomer ? "Download Speed" : "No active plan"} 
          icon={<Wifi className="h-6 w-6 text-gray-800" />} 
        />
        <StatCard 
          title="Active Devices" 
          value={isCustomer ? "3" : "0"} 
          subtitle={isCustomer ? "Connected Now" : "No active plan"} 
          icon={<Computer className="h-6 w-6 text-gray-800" />} 
        />
        <StatCard 
          title="Next Bill" 
          value={isCustomer ? "$29.99" : "-"} 
          subtitle={isCustomer ? "Due in 15 days" : "No subscription"} 
          icon={<Calendar className="h-6 w-6 text-gray-800" />} 
        />
      </div>

      {/* Recent Activity - Only show for customers */}
      {isCustomer && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem 
              icon={<Wifi className="h-5 w-5 text-blue-500" />}
              title="Data Usage Alert"
              description="80% of data quota used"
              time="2 hours ago"
              bgColor="bg-blue-100"
            />
            <ActivityItem 
              icon={<CreditCard className="h-5 w-5 text-green-500" />}
              title="Payment Successful"
              description="Monthly plan renewed"
              time="Yesterday"
              bgColor="bg-green-100"
            />
            <ActivityItem 
              icon={<Headphones className="h-5 w-5 text-purple-500" />}
              title="Support Ticket Resolved"
              description="Ticket #45678 closed"
              time="2 days ago"
              bgColor="bg-purple-100"
            />
          </div>
        </div>
      )}
      
      {/* Plans Modal */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isCustomer ? 'Select Top-Up Option' : 'Choose a Subscription Plan'}
              </h2>
              <button 
                onClick={() => setShowPlansModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fallback plan options if API doesn't return any */}
              {(availablePlans.length === 0 ? [
                { id: 'basic', name: 'Basic', data: '2GB', calls: '60min', sms: '50', price: 9.99 },
                { id: 'premium', name: 'Premium', data: '8GB', calls: '120min', sms: '100', price: 29.99 },
                { id: 'ultimate', name: 'Ultimate', data: '20GB', calls: 'Unlimited', sms: 'Unlimited', price: 49.99 }
              ] : availablePlans).map(plan => (
                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <ul className="my-4 space-y-2">
                    <li className="flex items-center">
                      <span className="w-20">Data:</span>
                      <span className="font-medium">{plan.data}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-20">Calls:</span>
                      <span className="font-medium">{plan.calls}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-20">SMS:</span>
                      <span className="font-medium">{plan.sms}</span>
                    </li>
                  </ul>
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="ml-1 text-gray-500">/month</span>
                  </div>
                  <button 
                    onClick={() => handleSubscribeToPlan(plan.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={processingSubscription}
                  >
                    {processingSubscription ? 'Processing...' : isCustomer ? 'Select' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Usage Bar Component
const UsageBar = ({ label, used, total, percentage, color }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-600">{used} / {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, unit, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="ml-1 text-gray-500">{unit}</span>}
      </div>
      <div className="text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ icon, title, description, time, bgColor }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start">
        <div className={`${bgColor} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <span className="text-gray-400 text-sm">{time}</span>
    </div>
  );
};


export default UserDashboard;