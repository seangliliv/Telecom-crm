import React from "react";
import {
  Zap,
  BarChart2,
  Users,
  FileText,
  Inbox,
  Database,
  Settings,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: "Dashboard", icon: BarChart2, tab: "overview" },
    { name: "Customers", icon: Users, tab: "customers" },
    { name: "Billing", icon: FileText, tab: "billing" },
    { name: "Support Tickets", icon: Inbox, tab: "support" },
    { name: "Services", icon: Database, tab: "services" },
    { name: "Users & Roles", icon: Users, tab: "users" },
    { name: "Settings", icon: Settings, tab: "settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="flex items-center p-4 border-b">
        <div className="text-orange-500 font-bold text-xl flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          KH Telecom CRM
        </div>
      </div>

      <nav className="mt-4">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500">
          MAIN
        </div>
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`w-full text-left flex items-center px-4 py-3 ${
              activeTab === item.tab
                ? "text-gray-800 bg-blue-50 border-r-4 border-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`w-5 h-5 mr-3 ${
                activeTab === item.tab ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
