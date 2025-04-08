import React, { useState } from 'react';
import { 
  BarChart2, 
  Download, 
  Calendar, 
  Filter, 
  Printer, 
  RefreshCw, 
  ChevronDown, 
  PieChart, 
  TrendingUp, 
  DollarSign,
  Users,
  Database,
  Activity
} from 'lucide-react';

const SuperAdminReports = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedReport, setSelectedReport] = useState('revenue');

  // Sample report data
  const reports = [
    { id: 'revenue', name: 'Revenue Report', icon: <DollarSign className="h-5 w-5 text-green-600" /> },
    { id: 'users', name: 'User Activity', icon: <Users className="h-5 w-5 text-blue-600" /> },
    { id: 'system', name: 'System Performance', icon: <Database className="h-5 w-5 text-purple-600" /> },
    { id: 'usage', name: 'Resource Usage', icon: <Activity className="h-5 w-5 text-orange-600" /> }
  ];

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', amount: 25000 },
    { month: 'Feb', amount: 28000 },
    { month: 'Mar', amount: 32000 },
    { month: 'Apr', amount: 38000 },
    { month: 'May', amount: 42000 },
    { month: 'Jun', amount: 48000 },
    { month: 'Jul', amount: 50000 },
    { month: 'Aug', amount: 54000 },
  ];

  const userData = [
    { month: 'Jan', newUsers: 120, activeUsers: 850 },
    { month: 'Feb', newUsers: 150, activeUsers: 950 },
    { month: 'Mar', newUsers: 180, activeUsers: 1050 },
    { month: 'Apr', newUsers: 210, activeUsers: 1200 },
    { month: 'May', newUsers: 250, activeUsers: 1350 },
    { month: 'Jun', newUsers: 280, activeUsers: 1500 },
    { month: 'Jul', newUsers: 350, activeUsers: 1750 },
    { month: 'Aug', newUsers: 400, activeUsers: 2000 },
  ];

  const generateReport = () => {
    // In a real application, this would fetch data based on date range
    console.log('Generating report with date range:', dateRange);
  };

  const exportReport = (format) => {
    // In a real application, this would generate a file
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view detailed system reports</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
            onClick={() => generateReport()}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Data
          </button>
          <div className="relative">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
              <div className="py-1">
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => exportReport('pdf')}
                >
                  Export as PDF
                </button>
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => exportReport('excel')}
                >
                  Export as Excel
                </button>
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => exportReport('csv')}
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {reports.map(report => (
                <option key={report.id} value={report.id}>{report.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full bg-blue-600 text-white p-2 rounded-md flex justify-center items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-600">Total Revenue</h2>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-1">$428,750</div>
          <div className="text-sm text-green-500">↑ 12.5% vs previous period</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-600">Active Subscribers</h2>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mb-1">2,485</div>
          <div className="text-sm text-blue-500">↑ 8.3% vs previous period</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-600">Average Response Time</h2>
            <Activity className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mb-1">245ms</div>
          <div className="text-sm text-green-500">↓ 18.2% improvement</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-gray-600">System Uptime</h2>
            <Database className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mb-1">99.98%</div>
          <div className="text-sm text-orange-500">↓ 0.01% vs target</div>
        </div>
      </div>
      
      {/* Main Report Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center">
            {reports.find(r => r.id === selectedReport)?.icon}
            <h2 className="text-lg font-semibold ml-2">{reports.find(r => r.id === selectedReport)?.name}</h2>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Printer className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {selectedReport === 'revenue' && (
            <div>
              <div className="h-80 flex items-center justify-center bg-gray-50 mb-4">
                <BarChart2 className="h-16 w-16 text-gray-300" />
                <span className="ml-2 text-gray-400">Revenue chart will render here</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueData.map((item, index) => (
                      <tr key={item.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index > 0 ? (
                            <div className="flex items-center">
                              <span className={`text-sm ${
                                item.amount > revenueData[index-1].amount 
                                  ? 'text-green-500' 
                                  : 'text-red-500'
                              }`}>
                                {item.amount > revenueData[index-1].amount ? '↑' : '↓'}
                                {Math.abs(((item.amount - revenueData[index-1].amount) / revenueData[index-1].amount) * 100).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {selectedReport === 'users' && (
            <div>
              <div className="h-80 flex items-center justify-center bg-gray-50 mb-4">
                <TrendingUp className="h-16 w-16 text-gray-300" />
                <span className="ml-2 text-gray-400">User growth chart will render here</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Users</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.map((item, index) => (
                      <tr key={item.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.newUsers}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.activeUsers}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index > 0 ? (
                            <div className="flex items-center">
                              <span className={`text-sm ${
                                item.activeUsers > userData[index-1].activeUsers 
                                  ? 'text-green-500' 
                                  : 'text-red-500'
                              }`}>
                                {item.activeUsers > userData[index-1].activeUsers ? '↑' : '↓'}
                                {Math.abs(((item.activeUsers - userData[index-1].activeUsers) / userData[index-1].activeUsers) * 100).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {selectedReport === 'system' && (
            <div className="flex items-center justify-center h-80">
              <Database className="h-16 w-16 text-gray-300" />
              <span className="ml-2 text-gray-400">System performance report will render here</span>
            </div>
          )}
          
          {selectedReport === 'usage' && (
            <div className="flex items-center justify-center h-80">
              <PieChart className="h-16 w-16 text-gray-300" />
              <span className="ml-2 text-gray-400">Resource usage report will render here</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-lg mb-3">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Monthly recurring revenue has increased by 14.2% compared to the previous quarter.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">User retention rate has improved to 92%, up from 87% last quarter.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">System performance optimizations have reduced average API response time by 18.2%.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Resource usage in the East Asia region is approaching 80% capacity. Consider scaling up resources.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-lg mb-3">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Consider implementing promotional campaigns in regions with lower conversion rates.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Implement database optimizations to improve query performance for large customer datasets.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Scale up server resources in the East Asia region to accommodate growing user base.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Consider introducing a new premium tier based on feature usage patterns of enterprise customers.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;