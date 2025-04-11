import React from 'react';
import { 
  Signal, 
  Users, 
  Database, 
  AlertTriangle, 
  Globe, 
  Bell, 
  ZoomIn, 
  Filter, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react';

const NetworkStatus = () => {
  // Sample stats data
  const stats = [
    { 
      title: 'Network Uptime', 
      value: '99.9%', 
      subtitle: '+0.2% from yesterday',
      subtitleColor: 'text-green-500',
      icon: <Signal className="h-6 w-6 text-gray-500" />
    },
    { 
      title: 'Active Users', 
      value: '24,521', 
      subtitle: '+125 in last hour',
      subtitleColor: 'text-green-500',
      icon: <Users className="h-6 w-6 text-gray-500" />
    },
    { 
      title: 'Bandwidth Usage', 
      value: '85.2 TB', 
      subtitle: '72% of capacity',
      subtitleColor: 'text-purple-500',
      icon: <Database className="h-6 w-6 text-gray-500" />
    },
    { 
      title: 'Active Alerts', 
      value: '3', 
      subtitle: '2 critical, 1 warning',
      subtitleColor: 'text-yellow-500',
      icon: <AlertTriangle className="h-6 w-6 text-gray-500" />
    },
  ];

  // Sample alerts data
  const alerts = [
    {
      type: 'Network Outage',
      location: 'Phnom Penh Central Node',
      time: '2 minutes ago',
      severity: 'critical'
    },
    {
      type: 'High Latency',
      location: 'Siem Reap Region',
      time: '15 minutes ago',
      severity: 'critical'
    },
    {
      type: 'Bandwidth Warning',
      location: 'Battambang Node',
      time: '45 minutes ago',
      severity: 'warning'
    }
  ];

  // Sample speed test data
  const speedTests = [
    {
      location: 'Phnom Penh Central',
      speed: '125.4 Mbps',
      status: 'good'
    },
    {
      location: 'Siem Reap Node',
      speed: '98.7 Mbps',
      status: 'good'
    },
    {
      location: 'Battambang Node',
      speed: '45.2 Mbps',
      status: 'fair'
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Network Status</h1>
          <p className="text-gray-600">Manage Services for customer</p>
        </div>
        <div className="flex items-center space-x-4">
           
           
        </div>
      </div>

      {/* Network Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            subtitleColor={stat.subtitleColor}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Network Coverage Map Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Network Coverage Map</h2>
          <div className="flex space-x-2">
            <button className="border px-3 py-1 rounded flex items-center text-gray-600">
              <ZoomIn className="h-4 w-4 mr-1" />
              Zoom
            </button>
            <button className="border px-3 py-1 rounded flex items-center text-gray-600">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-900 relative" style={{ height: '300px' }}>
          {/* This is a placeholder for the network map - would be replaced with actual map component */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            {/* Map visualization would go here - using placeholder overlay to simulate heatmap */}
            <div className="absolute w-full h-full opacity-70">
              {/* This would be your actual map component with heat overlay */}
              <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-red-500 blur-xl"></div>
              <div className="absolute top-1/4 left-1/3 w-28 h-28 rounded-full bg-yellow-500 blur-xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-blue-500 blur-xl opacity-50"></div>
              <div className="absolute bottom-1/4 right-1/3 w-20 h-20 rounded-full bg-green-500 blur-xl opacity-60"></div>
              
              {/* Tower Icons */}
              <div className="absolute top-1/3 left-1/3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Signal className="h-4 w-4 text-orange-500" />
              </div>
              <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Signal className="h-4 w-4 text-orange-500" />
              </div>
              <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Signal className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Speed Tests Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Alerts Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-4 border-b">Active Alerts</h2>
          <div className="p-4 space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard 
                key={index}
                type={alert.type}
                location={alert.location}
                time={alert.time}
                severity={alert.severity}
              />
            ))}
          </div>
        </div>

        {/* Speed Test Results Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Speed Test Results</h2>
            <button className="text-blue-500 flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export Data
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {speedTests.map((test, index) => (
                <SpeedTestCard 
                  key={index}
                  location={test.location}
                  speed={test.speed}
                  status={test.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, subtitleColor, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600">{title}</h2>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${subtitleColor}`}>{subtitle}</div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ type, location, time, severity }) => {
  let bgColor = '';
  let icon = null;

  switch (severity) {
    case 'critical':
      bgColor = 'bg-red-50';
      icon = <AlertCircle className="h-5 w-5 text-red-500" />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-50';
      icon = <AlertOctagon className="h-5 w-5 text-yellow-500" />;
      break;
    default:
      bgColor = 'bg-gray-50';
      icon = <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
  
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{type}</h3>
          <p className="text-sm text-gray-700">{location}</p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
};

// Speed Test Card Component
const SpeedTestCard = ({ location, speed, status }) => {
  let statusIcon = null;
  let statusColor = '';
  
  switch (status) {
    case 'good':
      statusColor = 'text-green-500';
      statusIcon = <TrendingUp className="h-5 w-5" />;
      break;
    case 'fair':
      statusColor = 'text-yellow-500';
      statusIcon = <Minus className="h-5 w-5" />;
      break;
    case 'poor':
      statusColor = 'text-red-500';
      statusIcon = <TrendingDown className="h-5 w-5" />;
      break;
    default:
      statusColor = 'text-gray-500';
      statusIcon = <Minus className="h-5 w-5" />;
  }
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{location}</p>
        <p className="text-lg font-bold">{speed}</p>
      </div>
      <div className={statusColor}>
        {statusIcon}
        <span className="ml-2">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    </div>
  );
};

export default NetworkStatus;