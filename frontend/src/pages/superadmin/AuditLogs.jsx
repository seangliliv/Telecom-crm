// src/pages/super-admin/AuditLogs.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  User,
  Edit,
  Trash,
  FileText,
  Shield,
  Key,
  Settings
} from 'lucide-react';

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
  const [expandedLogId, setExpandedLogId] = useState(null);
  
  // Sample audit logs data
  const [logs] = useState([
    { 
      id: 1, 
      timestamp: '2025-04-08T09:32:15', 
      user: 'john.admin@example.com', 
      userType: 'Admin',
      action: 'User Update', 
      details: 'Changed user role from "Standard" to "Admin" for user: sarah.kim@example.com',
      ip: '192.168.1.102',
      severity: 'normal'
    },
    { 
      id: 2, 
      timestamp: '2025-04-08T08:45:22', 
      user: 'system', 
      userType: 'System',
      action: 'API Key Generated', 
      details: 'New API key generated for integration with external billing system',
      ip: 'Internal',
      severity: 'normal'
    },
    { 
      id: 3, 
      timestamp: '2025-04-07T23:15:48', 
      user: 'lisa.super@example.com', 
      userType: 'Super Admin',
      action: 'Configuration Change', 
      details: 'Modified system security settings: Enabled two-factor authentication requirement for all admin users',
      ip: '192.168.1.105',
      severity: 'high'
    },
    { 
      id: 4, 
      timestamp: '2025-04-07T18:22:33', 
      user: 'unknown', 
      userType: 'Anonymous',
      action: 'Failed Login Attempt', 
      details: 'Multiple failed login attempts for admin account "admin@example.com". Account temporarily locked.',
      ip: '203.45.78.192',
      severity: 'critical'
    },
    { 
      id: 5, 
      timestamp: '2025-04-07T14:05:12', 
      user: 'david.sales@example.com', 
      userType: 'Admin',
      action: 'Customer Record Deleted', 
      details: 'Customer ID #12458 (John Smith) record permanently deleted from the system',
      ip: '192.168.1.110',
      severity: 'high'
    }
  ]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Apply filters and sorting
  const filteredAndSortedLogs = React.useMemo(() => {
    let filteredLogs = [...logs];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.user.toLowerCase().includes(lowerSearchTerm) ||
        log.action.toLowerCase().includes(lowerSearchTerm) ||
        log.details.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply severity filter
    if (selectedSeverity !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === selectedSeverity);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(dateRange.start)
      );
    }
    
    if (dateRange.end) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(`${dateRange.end}T23:59:59`)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredLogs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredLogs;
  }, [logs, searchTerm, selectedSeverity, dateRange, sortConfig]);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Toggle expanded log details
  const toggleLogDetails = (logId) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(logId);
    }
  };

  // Get icon for log action
  const getActionIcon = (action) => {
    switch(action) {
      case 'User Update':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'API Key Generated':
        return <Key className="h-5 w-5 text-purple-500" />;
      case 'Configuration Change':
        return <Settings className="h-5 w-5 text-green-500" />;
      case 'Failed Login Attempt':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'Customer Record Deleted':
        return <Trash className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color for severity
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-gray-600">Track and monitor all system activities</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md">
          <Download className="h-5 w-5 mr-2" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Severity Filter */}
          <div className="flex space-x-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            <button className="p-2 border rounded-md">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('timestamp')}
                >
                  <div className="flex items-center">
                    Timestamp
                    {getSortIndicator('timestamp')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('user')}
                >
                  <div className="flex items-center">
                    User
                    {getSortIndicator('user')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('action')}
                >
                  <div className="flex items-center">
                    Action
                    {getSortIndicator('action')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('severity')}
                >
                  <div className="flex items-center">
                    Severity
                    {getSortIndicator('severity')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedLogs.length > 0 ? (
                filteredAndSortedLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{log.user}</div>
                            <div className="text-xs text-gray-500">{log.userType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {getActionIcon(log.action)}
                          </div>
                          <span className="text-sm text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => toggleLogDetails(log.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                    {expandedLogId === log.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="text-sm text-gray-800">
                            <div className="font-medium mb-2">Full Details:</div>
                            <p className="mb-2">{log.details}</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 text-gray-600">
                              <div>
                                <span className="font-medium">IP Address:</span> {log.ip}
                              </div>
                              <div>
                                <span className="font-medium">Log ID:</span> {log.id}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No logs match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;