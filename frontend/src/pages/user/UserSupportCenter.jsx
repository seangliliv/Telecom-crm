import React, { useState } from 'react';
import { 
  Download, 
  Ticket, 
  MessageSquare, 
  Activity, 
  ChevronDown,
  CheckCircle,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import LiveChatPopup from '../../components/LiveChatPopup';
import SpeedTestPopup from '../../components/SpeedTestPopup';
import SupportTicketPopup from '../../components/SupportTicketPopup'; // Import the new component

const UserSupportCenter = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState(false);
  const [isTicketPopupOpen, setIsTicketPopupOpen] = useState(false); // New state for ticket popup
  
  // Sample active tickets
  const activeTickets = [
    {
      id: 'TK-2025001',
      subject: 'Billing Issue',
      status: 'In Progress',
      lastUpdated: '2 hours ago'
    },
    {
      id: 'TK-2025002',
      subject: 'Network Connection',
      status: 'Resolved',
      lastUpdated: '1 day ago'
    }
  ];

  // Sample network status
  const networkServices = [
    { name: '4G Network', status: 'online' },
    { name: 'Voice Services', status: 'online' },
    { name: 'SMS Services', status: 'online' }
  ];

  // Sample FAQ items
  const faqItems = [
    { question: 'How do I check my data usage?' },
    { question: 'How to activate a new plan?' },
    { question: 'What payment methods are accepted?' }
  ];

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  const handleStartSpeedTest = () => {
    setIsSpeedTestOpen(true);
  };

  const handleCreateTicket = () => {
    setIsTicketPopupOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Support Center</h1>
          <p className="text-gray-600">Welcome back, Lii</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700">
          <Download className="h-5 w-5 mr-2" />
          Export
        </button>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SupportOptionCard 
          title="Submit New Ticket"
          icon={<Ticket className="h-6 w-6 text-blue-600" />}
          buttonText="Create Ticket"
          buttonColor="bg-blue-600"
          onClick={handleCreateTicket} // Updated to open the ticket popup
        />
        <SupportOptionCard 
          title="Live Chat Support"
          icon={<MessageSquare className="h-6 w-6 text-green-600" />}
          buttonText="Start Chat"
          buttonColor="bg-green-600"
          onClick={handleStartChat}
        />
        <SupportOptionCard 
          title="Speed Test"
          icon={<Activity className="h-6 w-6 text-purple-600" />}
          buttonText="Test Speed"
          buttonColor="bg-purple-600"
          onClick={handleStartSpeedTest}
        />
      </div>

      {/* Active Support Tickets */}
      <div className="bg-white rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold p-4">Active Support Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTickets.map((ticket, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    #{ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {ticket.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                    <a href="#" className="hover:underline">View Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-white rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold p-4">Network Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
          <div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Current Network Status</p>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Operational
              </span>
            </div>
            
            <div className="space-y-3">
              {networkServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{service.name}</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">Scheduled Maintenance</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <WifiOff className="h-5 w-5 text-gray-500 mt-1 mr-2" />
                <div>
                  <p className="font-medium">Network upgrade in Central District</p>
                  <p className="text-gray-500 text-sm">March 15, 2025 (2:00 AM - 4:00 AM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold p-4">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200">
          {faqItems.map((item, index) => (
            <div key={index} className="p-4">
              <button className="w-full flex justify-between items-center">
                <span className="font-medium text-left">{item.question}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat Popup */}
      <LiveChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Speed Test Popup */}
      <SpeedTestPopup isOpen={isSpeedTestOpen} onClose={() => setIsSpeedTestOpen(false)} />
      
      {/* Support Ticket Popup */}
      <SupportTicketPopup isOpen={isTicketPopupOpen} onClose={() => setIsTicketPopupOpen(false)} />
    </div>
  );
};

// Support Option Card Component
const SupportOptionCard = ({ title, icon, buttonText, buttonColor, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-center mb-3">
        <div className="bg-blue-50 p-3 rounded-full">
          {icon}
        </div>
      </div>
      <h3 className="text-center font-medium mb-4">{title}</h3>
      <button 
        className={`w-full py-2 rounded-md text-white ${buttonColor}`}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let bgColor = '';
  
  switch(status) {
    case 'Resolved':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'In Progress':
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Open':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

export default UserSupportCenter;