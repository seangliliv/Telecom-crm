// src/pages/user/UserServices.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const UserServices = () => {
  // Example user data (replace with real data)
  const userName = "Li";

  // Example service summary
  const [servicesSummary] = useState({
    totalServices: 3,
    totalUsage: "135 GB / 200 GB",
    nextBillingDate: "Mar 15, 2025",
  });

  // Example list of subscribed services
  const [subscribedServices, setSubscribedServices] = useState([
    {
      id: 1,
      name: "Premium 4G Plan",
      usage: "85 GB / 100 GB",
      status: "Active",
      nextBilling: "Mar 15, 2025",
    },
    {
      id: 2,
      name: "Data Plus Add-On",
      usage: "50 GB / 100 GB",
      status: "Active",
      nextBilling: "Mar 15, 2025",
    },
    {
      id: 3,
      name: "SMS Bundle",
      usage: "200 / 500 SMS",
      status: "Inactive",
      nextBilling: "—",
    },
  ]);

  const handleUpgrade = (serviceId) => {
    // Placeholder logic for upgrading a service
    toast.info(`Upgrade flow for service ID: ${serviceId}`);
  };

  const handleUnsubscribe = (serviceId) => {
    // Placeholder logic for unsubscribing
    toast.warn(`Unsubscribe flow for service ID: ${serviceId}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="text-gray-500">Welcome back, {userName}! Manage your subscribed services below.</p>
      </div>

      {/* Services Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Services */}
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Total Services</p>
          <h2 className="text-2xl font-bold">{servicesSummary.totalServices}</h2>
        </div>
        {/* Total Usage */}
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Total Usage</p>
          <h2 className="text-xl font-bold">{servicesSummary.totalUsage}</h2>
        </div>
        {/* Next Billing Date */}
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Next Billing Date</p>
          <h2 className="text-xl font-bold">{servicesSummary.nextBillingDate}</h2>
        </div>
      </div>

      {/* Subscribed Services Table */}
      <div className="bg-white shadow p-4 rounded overflow-x-auto">
        <h2 className="text-lg font-bold mb-2">Subscribed Services</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 font-medium text-gray-600">Service Name</th>
              <th className="p-2 font-medium text-gray-600">Usage</th>
              <th className="p-2 font-medium text-gray-600">Status</th>
              <th className="p-2 font-medium text-gray-600">Next Billing</th>
              <th className="p-2 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribedServices.map((service) => (
              <tr key={service.id} className="border-b last:border-0">
                <td className="p-2">{service.name}</td>
                <td className="p-2">{service.usage}</td>
                <td className="p-2">
                  {service.status === "Active" ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-2">{service.nextBilling}</td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    {service.status === "Active" && (
                      <button
                        onClick={() => handleUpgrade(service.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Upgrade
                      </button>
                    )}
                    <button
                      onClick={() => handleUnsubscribe(service.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Unsubscribe
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {subscribedServices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  You have no subscribed services.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserServices;
