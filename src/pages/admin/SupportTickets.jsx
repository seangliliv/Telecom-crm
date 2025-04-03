import React, { useState, useEffect } from "react";
import { Filter, Plus, MoreVertical } from "lucide-react";
import { fetchTickets, createTicket } from "../../api";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ customerId: "", issue: "" });

  // Sample ticket stats
  const ticketStats = {
    open: { count: 42, change: "+12% from last week" },
    pending: { count: 27, change: "+5% from last week" },
    closed: { count: 156, change: "+18% from last week" }
  };

  // Sample live support data
  const liveSupport = {
    agents: [
      { name: "Vannak Pen", avatar: "https://randomuser.me/api/portraits/men/32.jpg", activeChats: 3 },
      { name: "Bopha Ly", avatar: "https://randomuser.me/api/portraits/women/44.jpg", activeChats: 2 }
    ]
  };

  // Sample AI assistant stats
  const aiStats = {
    status: "Active & Learning",
    queriesHandled: 247,
    successRate: "89%"
  };

  // Sample SLA data
  const slaData = {
    firstResponseTime: { status: "On Track", value: 80 }, // percentage for progress bar
    resolutionTime: { status: "At Risk", value: 60 } // percentage for progress bar
  };

  // Sample ticket data
  const sampleTickets = [
    {
      id: "TK-2024",
      title: "Network Connectivity Issue",
      description: "Customer reporting complete network outage in Phnom Penh area...",
      priority: "High Priority",
      assignedTo: { name: "Sokha Chea", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      timeAgo: "2 hours ago"
    },
    {
      id: "TK-2023",
      title: "Billing Inquiry",
      description: "Customer requesting clarification on recent charges...",
      priority: "Medium Priority",
      assignedTo: { name: "Dara Kim", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      timeAgo: "4 hours ago"
    }
  ];

  useEffect(() => {
    // For now, we'll use the sample data
    setTickets(sampleTickets);
    setLoading(false);
    
    // Uncomment this when API is working
    /*
    fetchTickets()
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    */
  }, []);

  const handleCreateTicket = () => {
    createTicket(newTicket)
      .then((created) => {
        // Refresh tickets list after creation
        setTickets([...tickets, created]);
        setNewTicket({ customerId: "", issue: "" });
      })
      .catch((error) => {
        console.error("Ticket creation failed:", error);
      });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const StatCard = ({ title, count, change, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        <div className={`${color} rounded-full p-2`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{count}</div>
      <div className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-gray-600">Help ensure that customer issues and service requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Open Tickets" 
          count={ticketStats.open.count} 
          change={ticketStats.open.change} 
          icon={<span className="text-blue-500">📬</span>}
          color="bg-blue-100"
        />
        <StatCard 
          title="Pending Tickets" 
          count={ticketStats.pending.count} 
          change={ticketStats.pending.change} 
          icon={<span className="text-yellow-500">⏳</span>}
          color="bg-yellow-100"
        />
        <StatCard 
          title="Closed Tickets" 
          count={ticketStats.closed.count} 
          change={ticketStats.closed.change} 
          icon={<span className="text-green-500">✓</span>}
          color="bg-green-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Section - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Tickets</h2>
              <div className="flex space-x-2">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  New Ticket
                </button>
                <button className="border p-2 rounded-md">
                  <Filter className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.priority.includes('High') ? 'bg-red-100 text-red-800' : 
                      ticket.priority.includes('Medium') ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.priority}
                    </span>
                    <button className="text-gray-400">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">#{ticket.id} {ticket.title}</h3>
                  <p className="text-gray-500 mb-3">{ticket.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={ticket.assignedTo.avatar} 
                        alt={ticket.assignedTo.name} 
                        className="w-8 h-8 rounded-full mr-2" 
                      />
                      <span className="text-sm text-gray-600">Assigned to {ticket.assignedTo.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{ticket.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Live Support Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Live Support</h2>
            <div className="mb-3">
              <div className="flex items-center text-green-500 mb-3">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                <span>{liveSupport.agents.length} Agents Online</span>
              </div>
              <div className="space-y-4">
                {liveSupport.agents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={agent.avatar} 
                        alt={agent.name} 
                        className="w-10 h-10 rounded-full mr-2" 
                      />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-500">{agent.activeChats} active chats</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-center">
              <a href="#" className="text-blue-600 hover:underline text-sm">View All</a>
            </div>
          </div>

          {/* AI Assistant Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">AI Assistant Status</h2>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <span className="text-blue-500">🤖</span>
              </div>
              <div>
                <div className="font-medium">{aiStats.status}</div>
                <div className="text-xs text-green-500">Online</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Queries Handled Today</span>
                <span className="font-medium">{aiStats.queriesHandled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium">{aiStats.successRate}</span>
              </div>
            </div>
          </div>

          {/* SLA Performance */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">SLA Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">First Response Time</span>
                  <span className="text-green-500">{slaData.firstResponseTime.status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${slaData.firstResponseTime.value}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Resolution Time</span>
                  <span className="text-yellow-500">{slaData.resolutionTime.status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${slaData.resolutionTime.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;