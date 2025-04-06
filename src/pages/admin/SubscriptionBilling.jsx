import React, { useState, useEffect } from 'react';
import { DollarSign, Clipboard, Clock, Users, Plus, RefreshCw, FileText, LayoutGrid, Eye } from 'lucide-react';
import { fetchInvoices, fetchSubscriptions } from '../../allApi';

const SubscriptionBilling = () => {
  // State for data and loading
  const [invoices, setInvoices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activePlans: 0,
    pendingPayments: 0,
    newSubscriptions: 0
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch invoices and subscriptions concurrently
      let invoicesData = [];
      let subscriptionsData = [];
      
      try {
        invoicesData = await fetchInvoices();
        console.log("Invoices data:", invoicesData);
      } catch (invoiceError) {
        console.error("Error fetching invoices:", invoiceError);
        invoicesData = [];
      }
      
      try {
        subscriptionsData = await fetchSubscriptions();
        console.log("Subscriptions data:", subscriptionsData);
      } catch (subscriptionError) {
        console.error("Error fetching subscriptions:", subscriptionError);
        subscriptionsData = [];
      }
      
      // Ensure we have arrays
      invoicesData = Array.isArray(invoicesData) ? invoicesData : [];
      subscriptionsData = Array.isArray(subscriptionsData) ? subscriptionsData : [];
      
      // Update state with fetched data
      setInvoices(invoicesData);
      setSubscriptions(subscriptionsData);
      
      // Generate transactions from the latest invoices
      const recentTransactions = invoicesData
        .slice(0, 5)
        .map(invoice => ({
          id: invoice.id || `INV-${Math.floor(Math.random() * 1000000)}`,
          type: invoice.description || 'Plan Payment',
          amount: `${invoice.amount || 0}`
        }));
        
      setTransactions(recentTransactions);
      
      // Calculate statistics
      calculateStats(invoicesData, subscriptionsData);
      
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message}`);
      setLoading(false);
    }
  };
  
  // Calculate statistics based on fetched data
  const calculateStats = (invoicesData, subscriptionsData) => {
    // Default values in case data is empty
    let stats = {
      totalRevenue: 0,
      activePlans: 0,
      pendingPayments: 0,
      newSubscriptions: 0
    };
    
    // Ensure data arrays exist
    const safeInvoicesData = Array.isArray(invoicesData) ? invoicesData : [];
    const safeSubscriptionsData = Array.isArray(subscriptionsData) ? subscriptionsData : [];
    
    if (safeInvoicesData.length > 0) {
      // Calculate total revenue from all invoices
      stats.totalRevenue = safeInvoicesData.reduce((sum, invoice) => 
        sum + (parseFloat(invoice.amount) || 0), 0);
        
      // Count pending payments
      stats.pendingPayments = safeInvoicesData.filter(
        invoice => invoice.status === "Pending" || invoice.status === "Overdue"
      ).length;
    }
    
    if (safeSubscriptionsData.length > 0) {
      // Count active plans
      stats.activePlans = safeSubscriptionsData.filter(
        sub => sub.status === "Active" || sub.status === "1"
      ).length;
      
      // Count new subscriptions (created in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      stats.newSubscriptions = safeSubscriptionsData.filter(sub => {
        if (!sub.createdAt) return false;
        const createdDate = new Date(sub.createdAt);
        return createdDate >= thirtyDaysAgo;
      }).length;
    }
    
    setStats({
      totalRevenue: `$${stats.totalRevenue.toFixed(2)}`,
      activePlans: stats.activePlans,
      pendingPayments: stats.pendingPayments,
      newSubscriptions: stats.newSubscriptions
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription & Billing</h1>
          <p className="text-gray-600">Manage customer subscriptions and payments</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <div className="relative ml-4">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>
          <div className="ml-4 w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://via.placeholder.com/150" alt="Profile" className="h-full w-full object-cover" />
          </div>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value={loading ? "Loading..." : stats.totalRevenue} 
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          subtitle="+12.5% from last month"
          subtitleColor="text-green-500"
        />
        
        <StatCard 
          title="Active Plans" 
          value={loading ? "Loading..." : stats.activePlans} 
          icon={<Clipboard className="h-6 w-6 text-blue-500" />}
          subtitle="85% retention rate"
          subtitleColor="text-blue-500"
        />
        
        <StatCard 
          title="Pending Payments" 
          value={loading ? "Loading..." : stats.pendingPayments} 
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          subtitle="Due within 7 days"
          subtitleColor="text-yellow-500"
        />
        
        <StatCard 
          title="New Subscriptions" 
          value={loading ? "Loading..." : stats.newSubscriptions} 
          icon={<Users className="h-6 w-6 text-purple-500" />}
          subtitle="This month"
          subtitleColor="text-purple-500"
        />
      </div>

      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction 
              icon={<Plus className="h-5 w-5 text-blue-500" />} 
              label="New Invoice" 
              bgColor="bg-blue-50"
            />
            <QuickAction 
              icon={<RefreshCw className="h-5 w-5 text-green-500" />} 
              label="Process Renewal" 
              bgColor="bg-green-50"
            />
            <QuickAction 
              icon={<FileText className="h-5 w-5 text-blue-500" />} 
              label="Add Plan" 
              bgColor="bg-blue-50"
            />
            <QuickAction 
              icon={<LayoutGrid className="h-5 w-5 text-purple-500" />} 
              label="Batch Bills" 
              bgColor="bg-purple-50"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {loading ? (
            <div className="py-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-gray-500">ID: {transaction.id}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold">{transaction.amount}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent transactions found</p>
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-lg font-semibold p-4 border-b">Recent Invoices</h2>
        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : invoices.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.slice(0, 5).map((invoice, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id || `INV-${index + 1000}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.customer || invoice.customerName || "Customer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.plan || invoice.planName || "Standard Plan"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${invoice.amount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status || "Pending"} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-gray-500">No invoices found</div>
        )}
        
        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 1 to {Math.min(5, invoices.length)} of {invoices.length} entries
            </div>
            <div className="flex space-x-2">
              <PaginationButton label="Previous" active={false} />
              <PaginationButton label="1" active={true} />
              <PaginationButton label="2" active={false} />
              <PaginationButton label="3" active={false} />
              <PaginationButton label="Next" active={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color = '';
  switch (status) {
    case 'Paid':
    case 'Completed':
      color = 'bg-green-100 text-green-800';
      break;
    case 'Pending':
    case 'Processing':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Overdue':
    case 'Failed':
      color = 'bg-red-100 text-red-800';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

// Pagination Button Component
const PaginationButton = ({ label, active }) => {
  return (
    <button
      className={`px-3 py-1 border rounded ${
        active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
      }`}
    >
      {label}
    </button>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, subtitle, subtitleColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600">{title}</h2>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <div className={`text-sm ${subtitleColor}`}>{subtitle}</div>}
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ icon, label, bgColor }) => {
  return (
    <button className={`${bgColor} flex items-center justify-center p-3 rounded-lg`}>
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    </button>
  );
};

// Missing icons that need to be defined
const Bell = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const Globe = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default SubscriptionBilling;