import React from 'react';
import { 
  Send, 
  Users, 
  Calendar, 
  Plus, 
  MoreVertical, 
  Globe, 
  Bell 
} from 'lucide-react';

const SalesMarketing = () => {
  // Sample campaign data
  const campaigns = [
    { name: 'New Year Promo', scheduledDate: 'Jan 1, 2025' },
    { name: 'Data Package', scheduledDate: 'Feb 15, 2025' }
  ];

  // Sample activities data
  const activities = [
    { 
      type: 'Summer Campaign Sent', 
      details: 'Sent to 15,000 subscribers', 
      time: '2 hours ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    { 
      type: 'Campaign Scheduled', 
      details: 'Khmer New Year Special', 
      time: '5 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales & Marketing</h1>
          <p className="text-gray-600">Manage sales service and promotions</p>
        </div>
        
          {/* "New Campaign" button */}
        <div className="flex justify-end mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

     

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Promotions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Promotions</h2>
            <div className="bg-blue-100 p-2 rounded-full">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-8">
            Send targeted offers via email to customers
          </p>
          <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-md">
            Send Email Campaign
          </button>
        </div>

        {/* Lead Management Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Lead Management</h2>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Total Leads</p>
              <p className="font-bold text-xl">2,456</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">New Today</p>
              <p className="text-green-500 font-medium">+48</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md">
            View All Leads
          </button>
        </div>

        {/* Campaign Scheduler Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Campaign Scheduler</h2>
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-gray-500 text-sm">Scheduled: {campaign.scheduledDate}</p>
                </div>
                <button>
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-md">
            Schedule New Campaign
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                  <img src={activity.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-gray-500">{activity.details}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesMarketing;