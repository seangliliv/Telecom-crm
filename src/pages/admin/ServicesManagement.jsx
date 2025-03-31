import React from 'react';
import { Wifi, Edit, Trash, Plus, Globe, Bell, Search } from 'lucide-react';

const ServicesManagement = () => {
  // Sample services data
  const serviceCards = [
    { name: 'Data Plus', subscribers: 1247, growth: 12, color: 'bg-blue-100' },
    { name: 'Premium Monthly', subscribers: 856, growth: 8, color: 'bg-purple-100' },
    { name: 'Basic Annual', subscribers: 391, growth: 5, color: 'bg-yellow-100' }
  ];

  // Sample services list data
  const services = [
    { 
      name: 'Data Plus', 
      category: '1 month', 
      price: '$89.99/mo', 
      status: 'Active', 
      subscribers: 458 
    },
    { 
      name: 'Premium Monthly', 
      category: '3 months', 
      price: '$65.00/mo', 
      status: 'Active', 
      subscribers: 312 
    },
    { 
      name: 'Basic Annual', 
      category: 'Yearly', 
      price: '$120.00/mo', 
      status: 'Maintenance', 
      subscribers: 189 
    },
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-gray-600">Manage Services for customer</p>
        </div>
        <div className="flex items-center space-x-4">
              {/* Add New Service Button */}
          <div className="flex justify-end mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Service
            </button>
          </div>
        </div>
      </div>

      

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {serviceCards.map((service, index) => (
          <ServiceCard 
            key={index}
            name={service.name}
            subscribers={service.subscribers}
            growth={service.growth}
            color={service.color}
          />
        ))}
      </div>

      {/* Services List Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Services</h2>
          <div className="flex">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Search services..."
                className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
            <select className="border rounded-md p-2">
              <option>All Categories</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribers
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Wifi className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.subscribers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to 3 of 15 entries
          </div>
          <div className="flex space-x-2">
            <PaginationButton label="Previous" active={false} />
            <PaginationButton label="1" active={true} />
            <PaginationButton label="2" active={false} />
            <PaginationButton label="3" active={false} />
            <PaginationButton label="Next" active={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ name, subscribers, growth, color }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`${color} p-3 rounded-md mr-3`}>
            <Wifi className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-right ml-auto">
            <h3 className="text-lg font-medium">{name}</h3>
          </div>
        </div>
        <div className="text-3xl font-bold mb-2">{subscribers.toLocaleString()}</div>
        <div className="text-green-500 text-sm">↑ {growth}% from last month</div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color = '';
  switch (status) {
    case 'Active':
      color = 'bg-green-100 text-green-800';
      break;
    case 'Maintenance':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Inactive':
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

export default ServicesManagement;