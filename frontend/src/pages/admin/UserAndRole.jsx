import React from 'react';
import { 
  UserCog, 
  Headset, 
  BarChart, 
  Users,
  Plus, 
  Settings, 
  Filter,
  Download,
  Edit,
  Trash
} from 'lucide-react';

const UserAndRole = () => {
  // Sample user data
  const users = [
    { 
      name: 'Sophea Chen', 
      email: 'sophea.c@telecom.com', 
      role: 'Super Admin', 
      status: 'Active',
      lastActive: '2 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    { 
      name: 'Dara Kim', 
      email: 'dara.k@telecom.com', 
      role: 'Sales Manager', 
      status: 'Active',
      lastActive: '1 hour ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User & Role</h1>
          <p className="text-gray-600">Manage User and Role</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New User
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Manage Roles
          </button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <UserStatsCard 
          title="Super Admins" 
          count={4} 
          icon={<UserCog className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <UserStatsCard 
          title="Support Agents" 
          count={12} 
          icon={<Headset className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-100"
        />
        <UserStatsCard 
          title="Sales Managers" 
          count={8} 
          icon={<BarChart className="h-6 w-6 text-purple-600" />}
          bgColor="bg-purple-100"
        />
        <UserStatsCard 
          title="Total Users" 
          count={24} 
          icon={<Users className="h-6 w-6 text-orange-600" />}
          bgColor="bg-orange-100"
        />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Search and Filter */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-md">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Support Agent</option>
              <option>Sales Manager</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border rounded-md">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 border rounded-md">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
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
            Showing 1 to 2 of 24 entries
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

// User Stats Card Component
const UserStatsCard = ({ title, count, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  let bgColor = '';
  
  switch(role) {
    case 'Super Admin':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'Sales Manager':
      bgColor = 'bg-purple-100 text-purple-800';
      break;
    case 'Support Agent':
      bgColor = 'bg-green-100 text-green-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {role}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let bgColor = '';
  
  switch(status) {
    case 'Active':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'Inactive':
      bgColor = 'bg-red-100 text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
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

export default UserAndRole;