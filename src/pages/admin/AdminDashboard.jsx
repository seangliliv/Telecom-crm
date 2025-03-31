import React from 'react';
import { BarChart3, Users, CreditCard, Clock, TrendingUp, AlertTriangle, UserPlus, WifiOff, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value="$124,563" 
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          subtitle="+12.5% from last month"
          subtitleColor="text-green-500"
        />
        
        <StatCard 
          title="Active Plans" 
          value="1,234" 
          icon={<CreditCard className="h-6 w-6 text-blue-500" />}
          subtitle="85% retention rate"
          subtitleColor="text-blue-500"
        />
        
        <StatCard 
          title="Pending Payments" 
          value="45" 
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          subtitle="Due within 7 days"
          subtitleColor="text-yellow-500"
        />
        
        <StatCard 
          title="New Subscriptions" 
          value="89" 
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
          <span className="text-3xl font-bold">156</span>
        </div>
        <div className="text-sm text-red-500">12 critical</div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Customer Growth</h2>
            <select className="border rounded p-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            <BarChart3 className="h-16 w-16 text-gray-300" />
            <span className="ml-2 text-gray-400">Chart will render here</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue Analysis</h2>
            <select className="border rounded p-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            <TrendingUp className="h-16 w-16 text-gray-300" />
            <span className="ml-2 text-gray-400">Chart will render here</span>
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
          <ActivityItem 
            icon={<UserPlus className="h-5 w-5 text-blue-500" />}
            bgColor="bg-blue-100"
            title="New Customer Registration"
            description="John Doe registered for a new postpaid plan"
            time="2 mins ago"
          />
          
          <ActivityItem 
            icon={<WifiOff className="h-5 w-5 text-red-500" />}
            bgColor="bg-red-100"
            title="Network Alert"
            description="Network outage detected in Phnom Penh central"
            time="15 mins ago"
          />
          
          <ActivityItem 
            icon={<DollarSign className="h-5 w-5 text-green-500" />}
            bgColor="bg-green-100"
            title="Payment Received"
            description="$150 received from customer #12458"
            time="1 hour ago"
          />
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