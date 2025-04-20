// src/pages/admin/Settings.jsx
import { useState } from "react";
import { Save, Bell, Lock, CreditCard, User, Globe, Palette, Mail } from "lucide-react";

function Settings() {
  // Static mock data for settings
  const [formData, setFormData] = useState({
    general: {
      companyName: "Acme Corporation",
      websiteUrl: "https://acmecorp.example.com",
      contactEmail: "contact@acmecorp.example.com",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      language: "en-US"
    },
    notifications: {
      emailNotifications: true,
      newCustomerAlerts: true,
      subscriptionAlerts: true,
      paymentReminders: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: true,
      passwordExpiry: "90days",
      sessionTimeout: "30min",
      loginAttempts: "5"
    },
    billing: {
      currency: "USD",
      taxRate: "7.5",
      invoicePrefix: "INV-",
      paymentTerms: "net30"
    },
    appearance: {
      theme: "light",
      primaryColor: "#3B82F6",
      logo: "default",
      compactMode: false
    }
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleCheckboxChange = (section, field) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: !formData[section][field]
      }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!"
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 800);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">
            Configure your application settings and preferences
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-5 w-5 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            saveMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Settings Tabs */}
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 flex items-center ${
              activeTab === "general"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="h-5 w-5 mr-2" />
            <span>General</span>
          </button>
          
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-3 flex items-center ${
              activeTab === "notifications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Bell className="h-5 w-5 mr-2" />
            <span>Notifications</span>
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-3 flex items-center ${
              activeTab === "security"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Lock className="h-5 w-5 mr-2" />
            <span>Security & Privacy</span>
          </button>
          
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-3 flex items-center ${
              activeTab === "billing"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            <span>Billing & Payments</span>
          </button>
          
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-3 flex items-center ${
              activeTab === "appearance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Palette className="h-5 w-5 mr-2" />
            <span>Appearance</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.general.companyName}
                    onChange={(e) => handleChange("general", "companyName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.general.websiteUrl}
                    onChange={(e) => handleChange("general", "websiteUrl", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.general.contactEmail}
                    onChange={(e) => handleChange("general", "contactEmail", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={formData.general.timezone}
                    onChange={(e) => handleChange("general", "timezone", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={formData.general.dateFormat}
                    onChange={(e) => handleChange("general", "dateFormat", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={formData.general.language}
                    onChange={(e) => handleChange("general", "language", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="ja-JP">Japanese</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <p className="text-xs text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications.emailNotifications}
                      onChange={() => handleCheckboxChange("notifications", "emailNotifications")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">New Customer Alerts</h3>
                    <p className="text-xs text-gray-500">
                      Get notified when a new customer signs up
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications.newCustomerAlerts}
                      onChange={() => handleCheckboxChange("notifications", "newCustomerAlerts")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Subscription Alerts</h3>
                    <p className="text-xs text-gray-500">
                      Get notified about subscription changes
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications.subscriptionAlerts}
                      onChange={() => handleCheckboxChange("notifications", "subscriptionAlerts")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Payment Reminders</h3>
                    <p className="text-xs text-gray-500">
                      Get notified about upcoming and overdue payments
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications.paymentReminders}
                      onChange={() => handleCheckboxChange("notifications", "paymentReminders")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Marketing Emails</h3>
                    <p className="text-xs text-gray-500">
                      Receive promotional emails and newsletters
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications.marketingEmails}
                      onChange={() => handleCheckboxChange("notifications", "marketingEmails")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Security & Privacy Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.security.twoFactorAuth}
                      onChange={() => handleCheckboxChange("security", "twoFactorAuth")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Expiry
                  </label>
                  <select
                    value={formData.security.passwordExpiry}
                    onChange={(e) => handleChange("security", "passwordExpiry", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="never">Never</option>
                    <option value="30days">30 Days</option>
                    <option value="60days">60 Days</option>
                    <option value="90days">90 Days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout
                  </label>
                  <select
                    value={formData.security.sessionTimeout}
                    onChange={(e) => handleChange("security", "sessionTimeout", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="15min">15 Minutes</option>
                    <option value="30min">30 Minutes</option>
                    <option value="1hour">1 Hour</option>
                    <option value="4hours">4 Hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Failed Login Attempts
                  </label>
                  <select
                    value={formData.security.loginAttempts}
                    onChange={(e) => handleChange("security", "loginAttempts", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="3">3 Attempts</option>
                    <option value="5">5 Attempts</option>
                    <option value="10">10 Attempts</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-medium mb-2">Security Log</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date/Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Successful login
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          192.168.1.1
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-04-20 09:23:15
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Password changed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          192.168.1.1
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-04-15 14:05:32
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Failed login attempt
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          203.0.113.42
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2024-04-12 22:17:09
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Billing & Payment Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.billing.currency}
                    onChange={(e) => handleChange("billing", "currency", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.billing.taxRate}
                    onChange={(e) => handleChange("billing", "taxRate", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.billing.invoicePrefix}
                    onChange={(e) => handleChange("billing", "invoicePrefix", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={formData.billing.paymentTerms}
                    onChange={(e) => handleChange("billing", "paymentTerms", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="immediate">Due Immediately</option>
                    <option value="net15">Net 15 Days</option>
                    <option value="net30">Net 30 Days</option>
                    <option value="net45">Net 45 Days</option>
                    <option value="net60">Net 60 Days</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-medium mb-2">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Visa ending in 4242</h4>
                        <p className="text-xs text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Mastercard ending in 5678</h4>
                        <p className="text-xs text-gray-500">Expires 09/2024</p>
                      </div>
                    </div>
                    <div>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Make Default
                      </button>
                    </div>
                  </div>
                  
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Appearance Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={formData.appearance.theme === "light"}
                        onChange={(e) => handleChange("appearance", "theme", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Light</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={formData.appearance.theme === "dark"}
                        onChange={(e) => handleChange("appearance", "theme", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Dark</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={formData.appearance.theme === "system"}
                        onChange={(e) => handleChange("appearance", "theme", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">System</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex space-x-2">
                    <div 
                      className={`h-8 w-8 rounded-full border cursor-pointer ${
                        formData.appearance.primaryColor === "#3B82F6" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: "#3B82F6" }}
                      onClick={() => handleChange("appearance", "primaryColor", "#3B82F6")}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full border cursor-pointer ${
                        formData.appearance.primaryColor === "#10B981" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: "#10B981" }}
                      onClick={() => handleChange("appearance", "primaryColor", "#10B981")}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full border cursor-pointer ${
                        formData.appearance.primaryColor === "#F59E0B" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: "#F59E0B" }}
                      onClick={() => handleChange("appearance", "primaryColor", "#F59E0B")}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full border cursor-pointer ${
                        formData.appearance.primaryColor === "#EF4444" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: "#EF4444" }}
                      onClick={() => handleChange("appearance", "primaryColor", "#EF4444")}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full border cursor-pointer ${
                        formData.appearance.primaryColor === "#8B5CF6" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      style={{ backgroundColor: "#8B5CF6" }}
                      onClick={() => handleChange("appearance", "primaryColor", "#8B5CF6")}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                      Upload Logo
                    </button>
                    {formData.appearance.logo !== "default" && (
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compactMode"
                    checked={formData.appearance.compactMode}
                    onChange={() => handleCheckboxChange("appearance", "compactMode")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="compactMode" className="ml-2 text-sm text-gray-700">
                    Compact Mode
                  </label>
                  <span className="ml-2 text-xs text-gray-500">(Reduces spacing in the UI)</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-medium mb-4">Preview</h3>
                <div className="border rounded-md p-4">
                  <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2" style={{ color: formData.appearance.primaryColor }}>
                        Theme Preview
                      </div>
                      <button
                        className="px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: formData.appearance.primaryColor }}
                      >
                        Sample Button
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    This is a simplified preview. Actual appearance may vary across the application.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;