import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  Check, 
  Settings,
  ChevronRight,
  Download,
  HardDrive,
  Zap
} from 'lucide-react';

const DatabaseManagement = () => {
  // Sample database info
  const [databaseInfo] = useState({
    name: 'KH Telecom Production DB',
    type: 'PostgreSQL',
    version: '14.5',
    status: 'Online',
    uptime: '45 days, 6 hours',
    lastBackup: '4 hours ago',
    size: '346.8 GB',
    connections: 124
  });
  
  // Sample database servers
  const [dbServers] = useState([
    {
      id: 'db-primary',
      name: 'Primary DB Node',
      status: 'Online',
      role: 'Primary',
      cpu: 38,
      memory: 62,
      storage: 45
    },
    {
      id: 'db-replica-1',
      name: 'Replica Node 1',
      status: 'Online',
      role: 'Replica',
      cpu: 22,
      memory: 48,
      storage: 40
    },
    {
      id: 'db-replica-2',
      name: 'Replica Node 2',
      status: 'Online',
      role: 'Replica',
      cpu: 18,
      memory: 42,
      storage: 38
    }
  ]);
  
  // Sample backup history
  const [backupHistory] = useState([
    { id: 'bkp-001', date: 'Apr 8, 2025 - 04:00 AM', size: '345.2 GB', status: 'Completed', duration: '28 minutes' },
    { id: 'bkp-002', date: 'Apr 7, 2025 - 04:00 AM', size: '344.8 GB', status: 'Completed', duration: '27 minutes' },
    { id: 'bkp-003', date: 'Apr 6, 2025 - 04:00 AM', size: '344.1 GB', status: 'Completed', duration: '27 minutes' }
  ]);
  
  // Sample system alerts
  const [alerts] = useState([
    { 
      id: 'alrt-001', 
      message: 'High query load detected on primary DB', 
      severity: 'warning', 
      timestamp: '2 hours ago' 
    },
    { 
      id: 'alrt-002', 
      message: 'Scheduled maintenance upcoming', 
      severity: 'info', 
      timestamp: '1 day ago' 
    }
  ]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Database Management</h1>
          <p className="text-gray-600">Monitor and manage system database infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Backup Now
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{databaseInfo.name}</h2>
            <p className="text-gray-500">{databaseInfo.type} v{databaseInfo.version}</p>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {databaseInfo.status}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <InfoCard 
            title="Uptime" 
            value={databaseInfo.uptime} 
            icon={<Clock className="h-5 w-5 text-blue-500" />} 
          />
          <InfoCard 
            title="Last Backup" 
            value={databaseInfo.lastBackup} 
            icon={<Database className="h-5 w-5 text-green-500" />} 
          />
          <InfoCard 
            title="Database Size" 
            value={databaseInfo.size} 
            icon={<HardDrive className="h-5 w-5 text-purple-500" />} 
          />
          <InfoCard 
            title="Active Connections" 
            value={databaseInfo.connections} 
            icon={<Zap className="h-5 w-5 text-yellow-500" />} 
          />
        </div>
      </div>

      {/* Database Servers */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Database Nodes</h2>
          <button className="text-blue-600 flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Configure Cluster
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dbServers.map((server) => (
                <tr key={server.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{server.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          server.cpu > 80 ? 'bg-red-500' : 
                          server.cpu > 60 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} 
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{server.cpu}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          server.memory > 80 ? 'bg-red-500' : 
                          server.memory > 60 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} 
                        style={{ width: `${server.memory}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{server.memory}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          server.storage > 80 ? 'bg-red-500' : 
                          server.storage > 60 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} 
                        style={{ width: `${server.storage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{server.storage}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Backup History and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Backup History */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Backup History</h2>
            <button className="text-blue-600 flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export Log
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-gray-500">Size: {backup.size} • Duration: {backup.duration}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold mr-2">
                      {backup.status}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <button className="text-blue-600 text-sm">View All Backups</button>
          </div>
        </div>
        
        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold p-4 border-b">System Alerts</h2>
          
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    alert.severity === 'critical' ? 'bg-red-100' : 
                    alert.severity === 'warning' ? 'bg-yellow-100' : 
                    'bg-blue-100'
                  }`}>
                    {alert.severity === 'critical' ? 
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-500' : 
                        alert.severity === 'warning' ? 'text-yellow-500' : 
                        'text-blue-500'
                      }`} /> : 
                      alert.severity === 'warning' ? 
                      <AlertTriangle className="h-5 w-5 text-yellow-500" /> : 
                      <Check className="h-5 w-5 text-blue-500" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {alerts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p>No active alerts</p>
            </div>
          )}
          
          <div className="p-4 border-t">
            <button className="text-blue-600 text-sm">View All Alerts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-gray-600 ml-2 text-sm">{title}</h3>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
};

export default DatabaseManagement;