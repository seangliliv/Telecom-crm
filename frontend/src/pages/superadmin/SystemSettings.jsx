import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Server, 
  Database, 
  Mail, 
  Bell,
  Key,
  Shield,
  CloudUpload,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';

const SystemSettings = () => {
  // System settings state
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'KH Telecom CRM',
    companyName: 'KH Telecom Co., Ltd.',
    timezone: 'Asia/Phnom_Penh',
    dateFormat: 'MM/DD/YYYY',
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.khtelecom.com',
    smtpPort: '587',
    smtpUsername: 'noreply@khtelecom.com',
    smtpPassword: '********',
    emailFromName: 'KH Telecom Support',
    emailFromAddress: 'support@khtelecom.com'
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maximumLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    twoFactorAuth: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    backupStorage: 'cloud'
  });

  // Handle form submission
  const handleSubmit = (formName, e) => {
    e.preventDefault();
    toast.success(`${formName} settings saved successfully!`);
  };

  // Handle toggle for maintenance mode
  const toggleMaintenanceMode = () => {
    if (!generalSettings.maintenanceMode) {
      // Confirmation before enabling maintenance mode
      if (window.confirm("Enabling maintenance mode will log out all users except super admins. Are you sure?")) {
        setGeneralSettings({
          ...generalSettings,
          maintenanceMode: true
        });
        toast.warning("Maintenance mode enabled. All users have been logged out.");
      }
    } else {
      setGeneralSettings({
        ...generalSettings,
        maintenanceMode: false
      });
      toast.success("Maintenance mode disabled. Users can now access the system.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <p className="text-gray-600">Configure global system parameters and services</p>

      {/* Warning for active status */}
      {generalSettings.maintenanceMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>System is in maintenance mode.</strong> Only super administrators can access the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          <button 
            className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
              generalSettings.maintenanceMode ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            onClick={toggleMaintenanceMode}
          >
            {generalSettings.maintenanceMode ? 'Maintenance Mode' : 'Active'}
          </button>
        </div>
        
        <form onSubmit={(e) => handleSubmit('General', e)} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
              <input
                type="text"
                value={generalSettings.systemName}
                onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
                <option value="Asia/Bangkok">Asia/Bangkok</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={generalSettings.dateFormat}
                onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center p-4 border-b">
          <Mail className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Email Configuration</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit('Email', e)} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
              <input
                type="text"
                value={emailSettings.smtpServer}
                onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input
                type="text"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
              <input
                type="text"
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
              <input
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                value={emailSettings.emailFromName}
                onChange={(e) => setEmailSettings({...emailSettings, emailFromName: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                value={emailSettings.emailFromAddress}
                onChange={(e) => setEmailSettings({...emailSettings, emailFromAddress: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
              onClick={() => toast.info("Test email sent to admin@khtelecom.com")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Test Email
            </button>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center p-4 border-b">
          <Shield className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit('Security', e)} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
              <input
                type="number"
                min="6"
                max="32"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Login Attempts</label>
              <input
                type="number"
                min="1"
                max="10"
                value={securitySettings.maximumLoginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, maximumLoginAttempts: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Duration (minutes)</label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securitySettings.lockoutDuration}
                onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                min="15"
                max="1440"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecial"
                checked={securitySettings.passwordRequireSpecial}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecial: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requireSpecial" className="ml-2 block text-sm text-gray-700">
                Require special characters in password
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                checked={securitySettings.passwordRequireNumbers}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-700">
                Require numbers in password
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireUppercase"
                checked={securitySettings.passwordRequireUppercase}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-700">
                Require uppercase letters in password
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                Enable two-factor authentication
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Key className="h-4 w-4 mr-2" />
              Save Security Settings
            </button>
          </div>
        </form>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center p-4 border-b">
          <Database className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Backup Configuration</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit('Backup', e)} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                checked={backupSettings.autoBackup}
                onChange={(e) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                Enable automatic backups
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
              <select
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                className="w-full p-2 border rounded-md"
                disabled={!backupSettings.autoBackup}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Time</label>
              <input
                type="time"
                value={backupSettings.backupTime}
                onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                className="w-full p-2 border rounded-md"
                disabled={!backupSettings.autoBackup || backupSettings.backupFrequency === 'hourly'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={backupSettings.retentionDays}
                onChange={(e) => setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
                disabled={!backupSettings.autoBackup}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Storage Location</label>
              <select
                value={backupSettings.backupStorage}
                onChange={(e) => setBackupSettings({...backupSettings, backupStorage: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="local">Local Server</option>
                <option value="cloud">Cloud Storage</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => toast.success("Backup process started. This may take a few minutes.")}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              Backup Now
            </button>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Backup Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;