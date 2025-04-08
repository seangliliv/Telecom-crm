import React from 'react';
import { BarChart3, Users, CreditCard, Clock, TrendingUp, AlertTriangle, UserPlus, WifiOff, DollarSign, Server, Shield } from 'lucide-react';
 
const SuperAdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value="$248,963" 
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          subtitle="+18.2% from last month"
          subtitleColor="text-green-500"
        />
        
        <StatCard 
          title="Active Plans" 
          value="2,458" 
          icon={<CreditCard className="h-6 w-6 text-blue-500" />}
          subtitle="92% retention rate"
          subtitleColor="text-blue-500"
        />
        
        <StatCard 
          title="Server Status" 
          value="99.99%" 
          icon={<Server className="h-6 w-6 text-purple-500" />}
          subtitle="Uptime this month"
          subtitleColor="text-purple-500"
        />
        
        <StatCard 
          title="Security Alerts" 
          value="2" 
          icon={<Shield className="h-6 w-6 text-red-500" />}
          subtitle="Needs attention"
          subtitleColor="text-red-500"
        />
      </div>

      {/* System Status Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">System Health</h2>
          <div className="bg-green-100 p-2 rounded-md">
            <Server className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div>
            <div className="text-sm text-gray-500 mb-1">CPU Load</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Disk Space</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        <div className="text-sm text-green-600">All systems operating normally</div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Global User Growth</h2>
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
            <h2 className="text-lg font-semibold">Revenue by Region</h2>
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

      {/* Admin Activities & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Admin Activities</h2>
            <a href="#" className="text-blue-500 text-sm">View All</a>
          </div>
          
          <div className="space-y-4">
            <ActivityItem 
              icon={<UserPlus className="h-5 w-5 text-blue-500" />}
              bgColor="bg-blue-100"
              title="New Admin Created"
              description="Sarah Kim was assigned admin privileges"
              time="15 mins ago"
              user="David Chen"
            />
            
            <ActivityItem 
              icon={<Settings className="h-5 w-5 text-purple-500" />}
              bgColor="bg-purple-100"
              title="System Settings Updated"
              description="Email notification settings were changed"
              time="2 hours ago"
              user="Michael Wong"
            />
            
            <ActivityItem 
              icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
              bgColor="bg-yellow-100"
              title="Security Alert Acknowledged"
              description="Multiple failed login attempts addressed"
              time="4 hours ago"
              user="You"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Audit Logs</h2>
            <a href="#" className="text-blue-500 text-sm">Export Logs</a>
          </div>
          
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 text-sm">admin@example.com</td>
                <td className="py-2 text-sm">Plan price updated</td>
                <td className="py-2 text-sm text-gray-500">10:32 AM</td>
              </tr>
              <tr>
                <td className="py-2 text-sm">lisa@example.com</td>
                <td className="py-2 text-sm">Customer data modified</td>
                <td className="py-2 text-sm text-gray-500">9:47 AM</td>
              </tr>
              <tr>
                <td className="py-2 text-sm">system</td>
                <td className="py-2 text-sm">Daily backup completed</td>
                <td className="py-2 text-sm text-gray-500">2:15 AM</td>
              </tr>
              <tr>
                <td className="py-2 text-sm">david@example.com</td>
                <td className="py-2 text-sm">Customer account deleted</td>
                <td className="py-2 text-sm text-gray-500">Yesterday</td>
              </tr>
            </tbody>
          </table>
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

const ActivityItem = ({ icon, bgColor, title, description, time, user }) => {
  return (
    <div className="flex items-start">
      <div className={`${bgColor} p-2 rounded-md mr-3 mt-1`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400">By: {user}</p>
      </div>
      <div className="text-xs text-gray-400 whitespace-nowrap">{time}</div>
    </div>
  );
};

export default SuperAdminDashboard;