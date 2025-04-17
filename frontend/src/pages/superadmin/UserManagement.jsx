import React, { useState, useEffect } from "react";
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
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const UserManagement = () => {
  // State for users data and UI controls
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    superAdmins: 0,
    admins: 0,
    users: 0,
  });
  const [error, setError] = useState(null);

  // Available roles for the system that match your database values
  const availableRoles = ["superAdmin", "admin", "user"];

  // Available permission groups
  const permissionGroups = [
    {
      name: "User Management",
      permissions: [
        { id: "users.view", name: "View Users" },
        { id: "users.create", name: "Create Users" },
        { id: "users.edit", name: "Edit Users" },
        { id: "users.delete", name: "Delete Users" },
      ],
    },
    {
      name: "Customer Management",
      permissions: [
        { id: "customers.view", name: "View Customers" },
        { id: "customers.create", name: "Create Customers" },
        { id: "customers.edit", name: "Edit Customers" },
        { id: "customers.delete", name: "Delete Customers" },
      ],
    },
    {
      name: "Plan Management",
      permissions: [
        { id: "plans.view", name: "View Plans" },
        { id: "plans.create", name: "Create Plans" },
        { id: "plans.edit", name: "Edit Plans" },
        { id: "plans.delete", name: "Delete Plans" },
      ],
    },
    {
      name: "Billing",
      permissions: [
        { id: "billing.view", name: "View Billing" },
        { id: "billing.process", name: "Process Payments" },
        { id: "billing.refund", name: "Issue Refunds" },
      ],
    },
    {
      name: "Support",
      permissions: [
        { id: "tickets.view", name: "View Tickets" },
        { id: "tickets.respond", name: "Respond to Tickets" },
        { id: "tickets.escalate", name: "Escalate Tickets" },
        { id: "tickets.close", name: "Close Tickets" },
      ],
    },
    {
      name: "System",
      permissions: [
        { id: "system.settings", name: "System Settings" },
        { id: "system.logs", name: "View System Logs" },
        { id: "system.backup", name: "Manage Backups" },
      ],
    },
  ];

  // Load users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make direct API call
      const response = await axios.get("http://127.0.0.1:8000/api/users/all/");
      console.log("API Response:", response);

      // Check if data is in the expected format
      if (response && response.data && Array.isArray(response.data.data)) {
        // User data is in response.data.data array
        processUserData(response.data.data);
      } else if (response && response.data && Array.isArray(response.data)) {
        // User data is directly in response.data array
        processUserData(response.data);
      } else {
        console.warn("No users found or invalid format", response.data);
        setError(
          "No users found. The response from the API did not contain any user data."
        );
        setUsers([]);
        setUserStats({
          total: 0,
          active: 0,
          inactive: 0,
          superAdmins: 0,
          admins: 0,
          users: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please check if the API is running.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Process user data from API
  const processUserData = (userData) => {
    console.log("Processing user data:", userData);

    if (!userData || !Array.isArray(userData) || userData.length === 0) {
      console.warn("No users to process");
      setUsers([]);
      return;
    }

    // Format the user data
    const formattedUsers = userData.map((user) => ({
      id: user._id || user.id,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.name || user.email.split("@")[0],
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || "user",
      permissions: user.permissions || [],
      status: user.status || "active",
      lastActive: user.lastActive || user.updatedAt || "Unknown",
      avatar:
        user.profile_image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.firstName || ""
        )}+${encodeURIComponent(user.lastName || "")}&background=random`,
    }));

    console.log("Formatted Users:", formattedUsers);
    setUsers(formattedUsers);

    // Calculate stats
    const stats = {
      total: formattedUsers.length,
      active: formattedUsers.filter(
        (user) => user.status === "Active" || user.status === "active"
      ).length,
      inactive: formattedUsers.filter(
        (user) => user.status === "Inactive" || user.status === "inactive"
      ).length,
      superAdmins: formattedUsers.filter((user) => user.role === "superAdmin")
        .length,
      admins: formattedUsers.filter((user) => user.role === "admin").length,
      users: formattedUsers.filter((user) => user.role === "user").length,
    };

    setUserStats(stats);
  };

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    // Search term filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "All" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

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
  const handleRoleChange = async (user, newRole) => {
    try {
      setLoading(true);

      // Prepare user data for update
      const userData = {
        ...user,
        role: newRole,
      };

      // Call the API to update the user
      await axios.put(
        `http://localhost:8000/api/users/${user.id}/update/`,
        userData
      );

      // Update local state
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers);

      toast.success(`${user.name}'s role updated to ${newRole}`);
    } catch (error) {
      console.error(`Error updating ${user.name}'s role:`, error);
      toast.error(`Failed to update ${user.name}'s role. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      setLoading(true);

      // Prepare user data for update
      const userData = {
        ...user,
        status: newStatus,
      };

      // Call the API to update the user
      await axios.put(
        `http://localhost:8000/api/users/${user.id}/update/`,
        userData
      );

      // Update local state
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);

      toast.success(`${user.name}'s status updated to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating ${user.name}'s status:`, error);
      toast.error(`Failed to update ${user.name}'s status. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
    toast.info("Refreshing user data...");
  };

  // Handle create user
  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);

      // Format the data for API
      const apiUserData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.name.split(" ")[0],
        lastName: userData.name.split(" ").slice(1).join(" "),
        role: userData.role,
        status: userData.status.toLowerCase(),
      };

      // Call the API to create the user
      const response = await axios.post(
        "http://localhost:8000/api/users/",
        apiUserData
      );
      const newUser = response.data;

      // Format the new user for our state
      const formattedNewUser = {
        id: newUser._id || newUser.id,
        name: userData.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions || [],
        status: newUser.status,
        lastActive: "Just now",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&background=random`,
      };

      // Update local state
      setUsers([...users, formattedNewUser]);

      toast.success(`New user ${userData.name} created successfully`);
      setShowAddModal(false);

      // Refresh the user list to ensure we have the latest data
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle update user
  const handleUpdateUser = async (userData) => {
    try {
      setLoading(true);

      // Format the data for API
      const apiUserData = {
        email: userData.email,
        firstName: userData.name.split(" ")[0],
        lastName: userData.name.split(" ").slice(1).join(" "),
        role: userData.role,
        status: userData.status.toLowerCase(),
      };

      // Call the API to update the user
      await axios.put(
        `http://localhost:8000/api/users/${selectedUser.id}/update/`,
        apiUserData
      );

      // Update local state
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, ...userData } : u
      );
      setUsers(updatedUsers);

      toast.success(`User ${userData.name} updated successfully`);
      setShowEditModal(false);

      // Refresh the user list to ensure we have the latest data
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      setLoading(true);

      // Call the API to delete the user
      await axios.delete(
        `http://localhost:8000/api/users/${selectedUser.id}/delete/`
      );

      // Update local state
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);

      toast.success(`User ${selectedUser.name} deleted successfully`);
      setShowDeleteModal(false);

      // Refresh the user list to ensure we have the latest data
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle permissions update
  const handleUpdatePermissions = async (permissions) => {
    try {
      setLoading(true);

      // Update the user with new permissions
      const userData = {
        ...selectedUser,
        permissions: permissions,
      };

      // Call the API to update the user
      await axios.put(
        `http://localhost:8000/api/users/${selectedUser.id}/update/`,
        userData
      );

      // Update local state
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, permissions } : u
      );
      setUsers(updatedUsers);

      toast.success(`Permissions updated for ${selectedUser.name}`);
      setShowPermissionsModal(false);
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <StatCard title="Users" value={userStats.users} />
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
                <option key={index} value={role}>
                  {role}
                </option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found. Please try a different filter or refresh the data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Active
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
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
                              user.status === "active"
                                ? "bg-green-500 transform translate-x-4"
                                : "bg-gray-400"
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 1 to {filteredUsers.length} of {filteredUsers.length}{" "}
              entries
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
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <UserForm
            roles={availableRoles}
            onCancel={() => setShowAddModal(false)}
            onSubmit={handleCreateUser}
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
            onSubmit={handleUpdateUser}
          />
        </Modal>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <Modal title="Delete User" onClose={() => setShowDeleteModal(false)}>
          <div className="p-4">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <Shield className="h-12 w-12" />
            </div>
            <p className="text-center mb-4">
              Are you sure you want to delete the user{" "}
              <strong>{selectedUser.name}</strong>?
            </p>
            <p className="text-center text-sm text-gray-500 mb-6">
              This action cannot be undone. All data associated with this user
              will be permanently removed.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteUser}
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
                <p className="text-sm text-gray-500">
                  Role: {selectedUser.role}
                </p>
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
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={group.permissions.every(
                          (perm) =>
                            selectedUser.permissions &&
                            (selectedUser.permissions.includes(perm.id) ||
                              selectedUser.permissions.includes("all"))
                        )}
                        onChange={(e) => {
                          // Logic to select/deselect all permissions in this group
                          const updatedPermissions = [
                            ...(selectedUser.permissions || []),
                          ];

                          if (e.target.checked) {
                            // Add all permissions from this group that aren't already included
                            group.permissions.forEach((perm) => {
                              if (!updatedPermissions.includes(perm.id)) {
                                updatedPermissions.push(perm.id);
                              }
                            });
                          } else {
                            // Remove all permissions from this group
                            const newPermissions = updatedPermissions.filter(
                              (p) =>
                                !group.permissions.some(
                                  (groupPerm) => groupPerm.id === p
                                )
                            );
                            return setSelectedUser({
                              ...selectedUser,
                              permissions: newPermissions,
                            });
                          }

                          setSelectedUser({
                            ...selectedUser,
                            permissions: updatedPermissions,
                          });
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Select All
                      </span>
                    </label>
                  </div>
                  <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.permissions.map((permission, permIndex) => (
                      <label
                        key={permIndex}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={
                            selectedUser.permissions &&
                            (selectedUser.permissions.includes(permission.id) ||
                              selectedUser.permissions.includes("all"))
                          }
                          onChange={(e) => {
                            const updatedPermissions = [
                              ...(selectedUser.permissions || []),
                            ];

                            if (e.target.checked) {
                              // Add this permission if it's not already included
                              if (!updatedPermissions.includes(permission.id)) {
                                updatedPermissions.push(permission.id);
                              }
                            } else {
                              // Remove this permission
                              const permIndex = updatedPermissions.indexOf(
                                permission.id
                              );
                              if (permIndex !== -1) {
                                updatedPermissions.splice(permIndex, 1);
                              }
                            }

                            setSelectedUser({
                              ...selectedUser,
                              permissions: updatedPermissions,
                            });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.name}
                        </span>
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
                  // Call handleUpdatePermissions with new permissions array
                  handleUpdatePermissions(selectedUser.permissions);
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
  let bgColor = "";
  let displayRole = role;

  switch (role) {
    case "superAdmin":
      bgColor = "bg-purple-100 text-purple-800";
      displayRole = "Super Admin";
      break;
    case "admin":
      bgColor = "bg-blue-100 text-blue-800";
      displayRole = "Admin";
      break;
    case "user":
      bgColor = "bg-green-100 text-green-800";
      displayRole = "User";
      break;
    default:
      bgColor = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
    >
      {displayRole}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const bgColor =
    status === "Active" || status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  const displayStatus =
    status === "active"
      ? "Active"
      : status === "inactive"
      ? "Inactive"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
    >
      {displayStatus}
    </span>
  );
};

// Modal Component
const Modal = ({ title, children, onClose, size = "md" }) => {
  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }[size];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${sizeClass} mx-4 overflow-y-auto max-h-[90vh]`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// User Form Component
const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || roles[0],
    status: user?.status || "active",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // If this is a new user, validate password
    if (!user && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Only show password fields for new users */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
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
            onClick={() => {
              // Implement password reset functionality
              toast.info("Password reset email sent to user");
            }}
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
          {user ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
};

export default UserManagement;
