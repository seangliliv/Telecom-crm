import React from 'react';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Plus, 
  MoreVertical, 
  DollarSign,
  CreditCardIcon
} from 'lucide-react';

const UserBilling = () => {
  // Sample transactions data
  const transactions = [
    { 
      date: 'Mar 1, 2025', 
      description: 'Monthly Plan - Premium', 
      amount: '$29.99', 
      status: 'Paid' 
    },
    { 
      date: 'Feb 1, 2025', 
      description: 'Monthly Plan - Premium', 
      amount: '$29.99', 
      status: 'Paid' 
    }
  ];

  // Sample payment methods data
  const paymentMethods = [
    {
      type: 'Visa',
      number: '4242',
      expiry: '12/2025',
      isDefault: true
    },
    {
      type: 'Mastercard',
      number: '8888',
      expiry: '09/2025',
      isDefault: false
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-gray-600">Welcome back, Lii</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700">
          <Download className="h-5 w-5 mr-2" />
          Export
        </button>
      </div>

      {/* Billing Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BillingInfoCard 
          title="Current Balance"
          value="$45.00"
          subtitle="Last updated: Today, 10:30 AM"
          icon={<DollarSign className="h-6 w-6 text-gray-700" />}
        />
        <BillingInfoCard 
          title="Next Payment"
          value="$29.99"
          subtitle="Due on: March 15, 2025"
          icon={<Calendar className="h-6 w-6 text-gray-700" />}
        />
        <BillingInfoCard 
          title="Payment Method"
          value="•••• 4242"
          subtitle="Expires: 12/2025"
          icon={<CreditCard className="h-6 w-6 text-gray-700" />}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold p-4 border-b">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <button className="bg-blue-600 text-white flex items-center px-4 py-2 rounded-md">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </button>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div className="flex items-center">
                {method.type === 'Visa' ? (
                  <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                ) : (
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <div className="flex">
                      <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                    </div>
                  </div>
                )}
                <div className="ml-4">
                  <p className="font-medium">{method.type} ending in {method.number}</p>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center">
                {method.isDefault && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-3">
                    Default
                  </span>
                )}
                <button>
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Top-Up Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Auto Top-Up Settings</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">Enable Auto Top-Up</p>
              <p className="text-sm text-gray-500">Automatically top up when balance is low</p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                id="toggle"
                className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer focus:outline-none"
              />
              <label
                htmlFor="toggle"
                className="block h-full rounded-full cursor-pointer bg-gray-300"
              ></label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Top-Up Amount</label>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>$10.00</option>
                <option>$20.00</option>
                <option>$30.00</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">When Balance Below</label>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>$5.00</option>
                <option>$3.00</option>
                <option>$1.00</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Billing Info Card Component
const BillingInfoCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
};

export default UserBilling;