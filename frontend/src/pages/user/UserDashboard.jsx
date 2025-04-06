import React from 'react';
import { 
  Wifi, 
  Computer, 
  Calendar, 
  Download,
  CreditCard,
  Headphones
} from 'lucide-react';

const UserDashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Lii</p>
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
            <h2 className="text-lg font-semibold">Current Plan: Premium 8GB</h2>
            <p className="text-gray-500">Valid until March 15, 2025</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Quick Top-Up
          </button>
        </div>

        {/* Usage Bars */}
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Internet Speed" 
          value="85.2" 
          unit="Mbps" 
          subtitle="Download Speed" 
          icon={<Wifi className="h-6 w-6 text-gray-800" />} 
        />
        <StatCard 
          title="Active Devices" 
          value="3" 
          subtitle="Connected Now" 
          icon={<Computer className="h-6 w-6 text-gray-800" />} 
        />
        <StatCard 
          title="Next Bill" 
          value="$29.99" 
          subtitle="Due in 15 days" 
          icon={<Calendar className="h-6 w-6 text-gray-800" />} 
        />
      </div>

      {/* Recent Activity */}
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