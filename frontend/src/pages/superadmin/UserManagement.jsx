import React, { useState, useEffect } from 'react';
import { 
  UserCog, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash, 
  Lock, 
  Shield, 
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown
} from 'lucide-react';

const UserManagement = () => {
  // State for users data and UI controls
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Sample user statistics
  const userStats = {
    total: 24,
    active: 20,
    inactive: 4,
    superAdmins: 2,
    admins: 8,
    managers: 14
  };

  // Sample users data
  const sampleUsers = [
    {
      id: 1,
      name: 'Sophea Chen',
      email: 'sophea.c@telecom.com',
      role: 'Super Admin',
      permissions: ['all'],
      status: 'Active',
      lastActive: '2 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Vannak Pen',
      email: 'vannak.p@telecom.com',
      role: 'Super Admin',
      permissions: ['all'],
      status: 'Active',
      lastActive: '35 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Dara Kim',
      email: 'dara.k@telecom.com',
      role: 'Admin',
      permissions: ['users.view', 'users.create', 'customers.all', 'plans.all'],
      status: 'Active',
      lastActive: '1 hour ago',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: 4,
      name: 'Bopha Ly',
      email: 'bopha.l@telecom.com',
      role: 'Admin',
      permissions: ['users.view', 'customers.all', 'plans.view', 'billing.view'],
      status: 'Active',
      lastActive: '3 hours ago',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    {
      id: 5,
      name: 'Sokha Chea',
      email: 'sokha.c@telecom.com',
      role: 'Support Manager',
      permissions: ['customers.view', 'customers.edit', 'tickets.all'],
      status: 'Active',
      lastActive: '1 day ago',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      id: 6,
      name: 'Chenda Meas',
      email: 'chenda.m@telecom.com',
      role: 'Sales Manager',
      permissions: ['customers.view', 'plans.view', 'marketing.all'],
      status: 'Inactive',
      lastActive: '10 days ago',
      avatar: 'https://randomuser.me/api/portraits/women/56.jpg'
    }
  ];

  // Available roles for the system
  const availableRoles = [
    'Super Admin',
    'Admin',
    'Support Manager',
    'Sales Manager',
    'Billing Manager',
    'Support Agent',
    'Sales Agent'
  ];

  // Available permission groups
  const permissionGroups = [
    {
      name: 'User Management',
      permissions: [
        { id: 'users.view', name: 'View Users' },
        { id: 'users.create', name: 'Create Users' },
        { id: 'users.edit', name: 'Edit Users' },
        { id: 'users.delete', name: 'Delete Users' }
      ]
    },
    {
      name: 'Customer Management',
      permissions: [
        { id: 'customers.view', name: 'View Customers' },
        { id: 'customers.create', name: 'Create Customers' },
        { id: 'customers.edit', name: 'Edit Customers' },
        { id: 'customers.delete', name: 'Delete Customers' }
      ]
    },
    {
      name: 'Plan Management',
      permissions: [
        { id: 'plans.view', name: 'View Plans' },
        { id: 'plans.create', name: 'Create Plans' },
        { id: 'plans.edit', name: 'Edit Plans' },
        { id: 'plans.delete', name: 'Delete Plans' }
      ]
    },
    {
      name: 'Billing',
      permissions: [
        { id: 'billing.view', name: 'View Billing' },
        { id: 'billing.process', name: 'Process Payments' },
        { id: 'billing.refund', name: 'Issue Refunds' }
      ]
    },
    {
      name: 'Support',
      permissions: [
        { id: 'tickets.view', name: 'View Tickets' },
        { id: 'tickets.respond', name: 'Respond to Tickets' },
        { id: 'tickets.escalate', name: 'Escalate Tickets' },
        { id: 'tickets.close', name: 'Close Tickets' }
      ]
    },
    {
      name: 'System',
      permissions: [
        { id: 'system.settings', name: 'System Settings' },
        { id: 'system.logs', name: 'View System Logs' },
        { id: 'system.backup', name: 'Manage Backups' }
      ]
    }
  ];

  // Load users
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    // In a real implementation, you would fetch from your API
    // const fetchUsers = async () => {
    //   try {
    //     const response = await axios.get('/api/users');
    //     setUsers(response.data);
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // Simulate API delay
    setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 800);
  }, []);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    // Search term filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = 
      roleFilter === 'All' || 
      user.role === roleFilter;
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'All' || 
      user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle modal actions
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openPermissionsModal = (user) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
  };

  // Handle role toggle
  const handleRoleChange = (user, newRole) => {
    // In a real implementation, this would call your API
    console.log(`Changing ${user.name}'s role to ${newRole}`);
    
    // Update local state for demo
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
  };

  // Handle status toggle
  const handleStatusToggle = (user) => {
    // In a real implementation, this would call your API
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    console.log(`Changing ${user.name}'s status to ${newStatus}`);
    
    // Update local state for demo
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    // In a real implementation, this would call your API
    setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total Users" value={userStats.total} />
        <StatCard title="Active" value={userStats.active} />
        <StatCard title="Inactive" value={userStats.inactive} />
        <StatCard title="Super Admins" value={userStats.superAdmins} />
        <StatCard title="Admins" value={userStats.admins} />
        <StatCard title="Managers" value={userStats.managers} />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {/* Role Filter */}
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              {availableRoles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">System Users</h2>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RoleBadge role={user.role} />
                          <button className="ml-2 text-gray-400">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusBadge status={user.status} />
                          <div 
                            onClick={() => handleStatusToggle(user)}
                            className="ml-2 w-8 h-4 rounded-full bg-gray-200 flex items-center cursor-pointer"
                          >
                            <div 
                              className={`w-3 h-3 rounded-full transition-all duration-200 mx-0.5 ${
                                user.status === 'Active' ? 'bg-green-500 transform translate-x-4' : 'bg-gray-400'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit User"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openPermissionsModal(user)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Manage Permissions"
                          >
                            <Lock className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No users match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-gray-600 bg-white">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-white bg-blue-600">
              1
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 bg-white">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal 
          title="Add New User" 
          onClose={() => setShowAddModal(false)}
        >
          <UserForm 
            roles={availableRoles} 
            onCancel={() => setShowAddModal(false)}
            onSubmit={(userData) => {
              console.log('Adding new user:', userData);
              setShowAddModal(false);
            }}
          />
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal 
          title={`Edit User: ${selectedUser.name}`} 
          onClose={() => setShowEditModal(false)}
        >
          <UserForm 
            roles={availableRoles} 
            user={selectedUser}
            onCancel={() => setShowEditModal(false)}
            onSubmit={(userData) => {
              console.log('Updating user:', userData);
              setShowEditModal(false);
            }}
          />
        </Modal>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <Modal 
          title="Delete User" 
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-4">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <Shield className="h-12 w-12" />
            </div>
            <p className="text-center mb-4">Are you sure you want to delete the user <strong>{selectedUser.name}</strong>?</p>
            <p className="text-center text-sm text-gray-500 mb-6">This action cannot be undone. All data associated with this user will be permanently removed.</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() => {
                  console.log('Deleting user:', selectedUser);
                  // Remove user from the local state
                  const updatedUsers = users.filter(user => user.id !== selectedUser.id);
                  setUsers(updatedUsers);
                  setShowDeleteModal(false);
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* User Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <Modal 
          title={`Manage Permissions: ${selectedUser.name}`} 
          onClose={() => setShowPermissionsModal(false)}
          size="lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium">User: {selectedUser.name}</h3>
                <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
              </div>
              
              {/* Select Permission Template */}
              <div className="flex items-center">
                <span className="mr-2 text-sm">Template:</span>
                <select className="border rounded-md p-1 text-sm">
                  <option>Custom</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Support Manager</option>
                  <option>Sales Manager</option>
                </select>
              </div>
            </div>
            
            {/* Permission Groups */}
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {permissionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border rounded-md">
                  <div className="p-3 bg-gray-50 border-b font-medium flex items-center justify-between">
                    <span>{group.name}</span>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Select All</span>
                    </label>
                  </div>
                  <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.permissions.map((permission, permIndex) => (
                      <label key={permIndex} className="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600" 
                          defaultChecked={selectedUser.permissions.includes(permission.id) || selectedUser.permissions.includes('all')}
                        />
                        <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPermissionsModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  console.log('Saving permissions for user:', selectedUser);
                  setShowPermissionsModal(false);
                }}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  let bgColor = '';
  
  switch(role) {
    case 'Super Admin':
      bgColor = 'bg-purple-100 text-purple-800';
      break;
    case 'Admin':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'Support Manager':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'Sales Manager':
      bgColor = 'bg-orange-100 text-orange-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {role}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const bgColor = status === 'Active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

// Modal Component
const Modal = ({ title, children, onClose, size = 'md' }) => {
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }[size];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg w-full ${sizeClass} mx-4 overflow-y-auto max-h-[90vh]`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

// User Form Component
const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || roles[0],
    status: user?.status || 'Active',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill in all required fields.');
      return;
    }

    // If this is a new user, validate password
    if (!user && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <select
          name="role"
           value={formData.role}
           onChange={handleChange}
           className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           required
         >
           {roles.map((role, index) => (
             <option key={index} value={role}>{role}</option>
           ))}
         </select>
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
         <select
           name="status"
           value={formData.status}
           onChange={handleChange}
           className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         >
           <option value="Active">Active</option>
           <option value="Inactive">Inactive</option>
         </select>
       </div>
     </div>

     {/* Only show password fields for new users */}
     {!user && (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
           <input
             type="password"
             name="password"
             value={formData.password}
             onChange={handleChange}
             className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
           <input
             type="password"
             name="confirmPassword"
             value={formData.confirmPassword}
             onChange={handleChange}
             className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             required
           />
         </div>
       </div>
     )}

     {/* For existing users, option to reset password */}
     {user && (
       <div className="mb-6">
         <button 
           type="button"
           className="text-sm text-blue-600 hover:text-blue-800"
           onClick={() => alert('Reset password functionality would go here')}
         >
           Reset Password
         </button>
       </div>
     )}

     <div className="flex justify-end space-x-3">
       <button
         type="button"
         onClick={onCancel}
         className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
       >
         Cancel
       </button>
       <button
         type="submit"
         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
       >
         {user ? 'Update User' : 'Create User'}
       </button>
     </div>
   </form>
 );
};

export default UserManagement;
          