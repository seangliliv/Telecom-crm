import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CreditCard, Clock, TrendingUp, AlertTriangle, UserPlus, WifiOff, DollarSign } from 'lucide-react';
import { 
  fetchCustomers, 
  fetchSubscriptions, 
  fetchInvoices, 
  fetchIssues, 
  fetchPlans,
  fetchServices
} from '../../allApi';
import AuthService from '../../utils/AuthService';

const AdminDashboard = () => {
  // User info state
  const [userData, setUserData] = useState(null);
  
  // State for storing API data
  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [issues, setIssues] = useState([]);
  const [plans, setPlans] = useState([]);
   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7'); // Default to 7 days
  const [chartData, setChartData] = useState({
    customerGrowth: [],
    revenueAnalysis: []
  });

  // Get user data from AuthService
  useEffect(() => {
    const userInfo = AuthService.getUserInfo();
    setUserData(userInfo);
  }, []);
  
  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Create an array of fetch promises with error handling for each
        const fetchPromises = [
          fetchCustomers().catch(err => {
            console.error('Error fetching customers:', err);
            return [];
          }),
          fetchSubscriptions().catch(err => {
            console.error('Error fetching subscriptions:', err);
            return [];
          }),
          fetchInvoices().catch(err => {
            console.error('Error fetching invoices:', err);
            return [];
          }),
          fetchIssues().catch(err => {
            console.error('Error fetching issues:', err);
            return [];
          }),
          fetchPlans().catch(err => {
            console.error('Error fetching plans:', err);
            return [];
          }),
          fetchServices().catch(err => {
            console.error('Error fetching services:', err);
            return [];
          })
        ];
        
        // Fetch all required data in parallel with error handling
        const [customersData, subscriptionsData, invoicesData, issuesData, plansData ] = 
          await Promise.all(fetchPromises);
        
        // Ensure we're setting valid arrays to state
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        setIssues(Array.isArray(issuesData) ? issuesData : []);
        setPlans(Array.isArray(plansData) ? plansData : []);
        
        
        // Generate chart data with valid arrays
        generateChartData(
          Array.isArray(customersData) ? customersData : [], 
          Array.isArray(invoicesData) ? invoicesData : [], 
          timeRange
        );
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Generate chart data based on time range
  const generateChartData = (customersData, invoicesData, range) => {
    try {
      const days = parseInt(range) || 7; // Default to 7 days if parsing fails
      const now = new Date();
      const startDate = new Date();
      startDate.setDate(now.getDate() - days);
      
      // Customer growth chart data
      const customerGrowthData = [];
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Safely count customers for this day
        let customersOnDay = 0;
        if (Array.isArray(customersData)) {
          customersOnDay = customersData.filter(customer => {
            if (!customer || !customer.created_at) return false;
            try {
              const customerDate = new Date(customer.created_at);
              // Check if the date is valid before using toISOString
              if (isNaN(customerDate.getTime())) return false;
              return customerDate.toISOString().split('T')[0] === dateStr;
            } catch (err) {
              // Skip this customer if date processing fails
              return false;
            }
          }).length;
        }
        
        customerGrowthData.push({
          date: dateStr,
          count: customersOnDay
        });
      }
      
      // Revenue analysis chart data
      const revenueData = [];
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Safely calculate revenue for this day
        let revenueOnDay = 0;
        if (Array.isArray(invoicesData)) {
          revenueOnDay = invoicesData
            .filter(invoice => {
              if (!invoice) return false;
              try {
                const dateToUse = invoice.issueDate || invoice.payment_date;
                if (!dateToUse) return false;
                
                const invoiceDate = new Date(dateToUse);
                // Check if the date is valid before using toISOString
                if (isNaN(invoiceDate.getTime())) return false;
                return invoiceDate.toISOString().split('T')[0] === dateStr;
              } catch (err) {
                // Skip this invoice if date processing fails
                return false;
              }
            })
            .reduce((sum, invoice) => {
              const amount = parseFloat(invoice.amount) || 0;
              return sum + amount;
            }, 0);
        }
        
        revenueData.push({
          date: dateStr,
          amount: revenueOnDay
        });
      }
      
      setChartData({
        customerGrowth: customerGrowthData,
        revenueAnalysis: revenueData
      });
    } catch (err) {
      console.error('Error generating chart data:', err);
      // Set empty chart data in case of error
      setChartData({
        customerGrowth: [],
        revenueAnalysis: []
      });
    }
  };

  // Calculate dashboard metrics
  const calculateMetrics = () => {
    try {
      // Calculate total revenue from invoices
      const totalRevenue = Array.isArray(invoices)
        ? invoices.reduce((sum, invoice) => {
            if (!invoice) return sum;
            const amount = parseFloat(invoice.amount) || 0;
            return sum + amount;
          }, 0)
        : 0;
      
      // Calculate active plans count
      const activePlansCount = Array.isArray(plans)
        ? plans.filter(plan => plan && (
            plan.status === 'active' || 
            plan.status === '1' || 
            plan.status === 1 || 
            plan.status === true ||
            plan.status === 'Active'
          )).length
        : 0;
      
      // Calculate pending payments
      const pendingPayments = Array.isArray(invoices)
        ? invoices.filter(invoice => 
            invoice && (
              invoice.status === 'pending' || 
              invoice.status === 'Pending' ||
              invoice.paymentStatus === 'pending' ||
              invoice.paymentStatus === 'Pending'
            )
          ).length
        : 0;
      
      // Calculate new subscriptions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newSubscriptions = Array.isArray(subscriptions)
        ? subscriptions.filter(sub => {
            if (!sub) return false;
            try {
              const dateField = sub.created_at || sub.startDate || sub.start_date || sub.startDate;
              if (!dateField) return false;
              
              const subDate = new Date(dateField);
              return !isNaN(subDate.getTime()) && subDate >= thirtyDaysAgo;
            } catch (err) {
              return false;
            }
          }).length
        : 0;
      
      // Calculate critical issues
      const criticalIssues = Array.isArray(issues)
        ? issues.filter(issue => 
            issue && (
              issue.priority === 'critical' || 
              issue.priority === 'Critical' || 
              issue.priority === 'High' ||
              issue.priority === 'high'
            )
          ).length
        : 0;
      
      // Calculate total open issues
      const openIssues = Array.isArray(issues)
        ? issues.filter(issue => 
            issue && (
              issue.status === 'open' || 
              issue.status === 'Open' ||
              issue.status === 'new' ||
              issue.status === 'New'
            )
          ).length
        : 0;

      // Calculate average plan cost
      const avgPlanCost = Array.isArray(plans) && plans.length > 0
        ? plans.reduce((sum, plan) => {
            if (!plan) return sum;
            const price = parseFloat(plan.price) || 0;
            return sum + price;
          }, 0) / plans.length
        : 0;

      return {
        totalRevenue,
        activePlansCount,
        pendingPayments,
        newSubscriptions,
        criticalIssues,
        openIssues,
        avgPlanCost,
        totalCustomers: Array.isArray(customers) ? customers.length : 0,
        totalPlans: Array.isArray(plans) ? plans.length : 0
      };
    } catch (err) {
      console.error('Error calculating metrics:', err);
      // Return default metrics in case of error
      return {
        totalRevenue: 0,
        activePlansCount: 0,
        pendingPayments: 0,
        newSubscriptions: 0,
        criticalIssues: 0,
        openIssues: 0,
        avgPlanCost: 0,
        totalCustomers: 0,
        totalPlans: 0
      };
    }
  };

  const metrics = calculateMetrics();

  // Handle time range change for charts
  const handleTimeRangeChange = (e) => {
    const newRange = e.target.value;
    setTimeRange(newRange);
    generateChartData(customers, invoices, newRange);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Get recent activities from various data sources
  const getRecentActivities = () => {
    try {
      // Add new customers (recent)
      const recentCustomers = Array.isArray(customers) && customers.length > 0
        ? [...customers]
            .filter(customer => customer) // Filter out null/undefined
            .sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
              const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
              return dateB - dateA;
            })
            .slice(0, 2)
            .map(customer => ({
              type: 'new_customer',
              icon: <UserPlus className="h-5 w-5 text-blue-500" />,
              bgColor: "bg-blue-100",
              title: "New Customer Registration",
              description: `${customer.name || customer.firstName || 'Customer'} ${customer.lastName || ''} registered`,
              time: getTimeAgo(customer.created_at || Date.now()),
              dateObj: customer.created_at ? new Date(customer.created_at) : new Date(0)
            }))
        : [];
      
      // Add recent payments
      const recentPayments = Array.isArray(invoices) && invoices.length > 0
        ? [...invoices]
            .filter(invoice => invoice && invoice.amount) // Filter out null/undefined or zero amount
            .sort((a, b) => {
              const dateA = a.payment_date || a.issueDate ? new Date(a.payment_date || a.issueDate) : new Date(0);
              const dateB = b.payment_date || b.issueDate ? new Date(b.payment_date || b.issueDate) : new Date(0);
              return dateB - dateA;
            })
            .slice(0, 2)
            .map(invoice => {
              // Safe customer lookup
              let customerName = `Customer #${invoice.customerId || invoice.customer_id || 'Unknown'}`;
              
              if (Array.isArray(customers)) {
                const customer = customers.find(c => c && (c.id === invoice.customerId || c.id === invoice.customer_id));
                if (customer) {
                  customerName = customer.firstName || customer.name || customerName;
                  if (customer.lastName) {
                    customerName += ` ${customer.lastName}`;
                  }
                }
              }
              
              return {
                type: 'payment',
                icon: <DollarSign className="h-5 w-5 text-green-500" />,
                bgColor: "bg-green-100",
                title: "Payment Received",
                description: `${formatCurrency(invoice.amount)} received from ${customerName}`,
                time: getTimeAgo(invoice.payment_date || invoice.issueDate || Date.now()),
                dateObj: invoice.payment_date || invoice.issueDate ? new Date(invoice.payment_date || invoice.issueDate) : new Date(0)
              };
            })
        : [];
      
      // Add recent issues
      const recentIssues = Array.isArray(issues) && issues.length > 0
        ? [...issues]
            .filter(issue => issue && (issue.status === 'open' || issue.status === 'Open'))
            .sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
              const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
              return dateB - dateA;
            })
            .slice(0, 1)
            .map(issue => {
              // Safe customer lookup
              let customerName = `Customer #${issue.customerId || issue.customer_id || 'Unknown'}`;
              
              if (Array.isArray(customers)) {
                const customer = customers.find(c => c && (c.id === issue.customerId || c.id === issue.customer_id));
                if (customer) {
                  customerName = customer.firstName || customer.name || customerName;
                  if (customer.lastName) {
                    customerName += ` ${customer.lastName}`;
                  }
                }
              }
              
              return {
                type: 'issue',
                icon: <WifiOff className="h-5 w-5 text-red-500" />,
                bgColor: "bg-red-100",
                title: issue.type || issue.subject || "Network Alert",
                description: issue.description || `Issue reported by ${customerName}`,
                time: getTimeAgo(issue.created_at || Date.now()),
                dateObj: issue.created_at ? new Date(issue.created_at) : new Date(0)
              };
            })
        : [];
      
      // Combine and sort all activities
      return [...recentCustomers, ...recentPayments, ...recentIssues]
        .sort((a, b) => b.dateObj - a.dateObj)
        .slice(0, 5);
    } catch (err) {
      console.error('Error generating recent activities:', err);
      return []; // Return empty array in case of error
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    
    try {
      const now = new Date();
      const past = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(past.getTime())) {
        return "Unknown time";
      }
      
      const diffMs = Math.max(0, now - past); // Ensure non-negative
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 60) {
        return `${Math.max(1, diffMins)} mins ago`; // At least 1 minute
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        return `${diffDays} days ago`;
      }
    } catch (err) {
      console.error('Error calculating time ago:', err);
      return "Unknown time";
    }
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      {userData && (
        <p className="text-gray-600 mb-6">Welcome back, {userData.name}!</p>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(metrics.totalRevenue)} 
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          subtitle={`Based on ${invoices ? invoices.length : 0} invoices`}
          subtitleColor="text-green-500"
        />
        
        <StatCard 
          title="Active Plans" 
          value={metrics.activePlansCount} 
          icon={<CreditCard className="h-6 w-6 text-blue-500" />}
          subtitle={`${plans && plans.length > 0 ? ((metrics.activePlansCount / plans.length) * 100).toFixed(0) : 0}% of total plans`}
          subtitleColor="text-blue-500"
        />
        
        <StatCard 
          title="Pending Payments" 
          value={metrics.pendingPayments} 
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          subtitle="Due within 7 days"
          subtitleColor="text-yellow-500"
        />
        
        <StatCard 
          title="New Subscriptions" 
          value={metrics.newSubscriptions} 
          icon={<Users className="h-6 w-6 text-purple-500" />}
          subtitle="This month"
          subtitleColor="text-purple-500"
        />
      </div>

      {/* Open Tickets Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Open Tickets</h2>
          <div className="bg-red-100 p-2 rounded-md">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{metrics.openIssues}</span>
        </div>
        <div className="text-sm text-red-500">{metrics.criticalIssues} critical</div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Customer Growth</h2>
            <select 
              className="border rounded p-1 text-sm"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            {chartData.customerGrowth.length > 0 ? (
              <div className="w-full h-full">
                {/* Chart would render here - placeholder for now */}
                <div className="flex flex-col h-full justify-center items-center">
                  <BarChart3 className="h-16 w-16 text-blue-300" />
                  <span className="mt-2 text-gray-500">Customer Growth Chart</span>
                  <span className="text-sm text-gray-400">{chartData.customerGrowth.length} data points available</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <span className="ml-2 text-gray-400">No customer data available for this period</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue Analysis</h2>
            <select 
              className="border rounded p-1 text-sm"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            {chartData.revenueAnalysis.length > 0 ? (
              <div className="w-full h-full">
                {/* Chart would render here - placeholder for now */}
                <div className="flex flex-col h-full justify-center items-center">
                  <TrendingUp className="h-16 w-16 text-green-300" />
                  <span className="mt-2 text-gray-500">Revenue Analysis Chart</span>
                  <span className="text-sm text-gray-400">{chartData.revenueAnalysis.length} data points available</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <TrendingUp className="h-16 w-16 text-gray-300" />
                <span className="ml-2 text-gray-400">No revenue data available for this period</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <a href="#" className="text-blue-500 text-sm">View All</a>
        </div>
        
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <ActivityItem 
                key={index}
                icon={activity.icon}
                bgColor={activity.bgColor}
                title={activity.title}
                description={activity.description}
                time={activity.time}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No recent activities found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

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

const ActivityItem = ({ icon, bgColor, title, description, time }) => {
  return (
    <div className="flex items-start">
      <div className={`${bgColor} p-2 rounded-md mr-3`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
};

export default AdminDashboard;