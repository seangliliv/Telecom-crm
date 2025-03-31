// src/pages/admin/SupportTickets.jsx
import { useState, useEffect } from "react";
import { fetchTickets, createTicket } from "../../api";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ customerId: "", issue: "" });

  useEffect(() => {
    fetchTickets()
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
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

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Support Tickets</h1>
      <div className="mb-6">
        <h2 className="text-xl">Create Ticket</h2>
        <input
          type="text"
          placeholder="Customer ID"
          value={newTicket.customerId}
          onChange={(e) => setNewTicket({ ...newTicket, customerId: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Issue Description"
          value={newTicket.issue}
          onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleCreateTicket} className="bg-blue-600 text-white p-2 rounded">
          Create Ticket
        </button>
      </div>
      <h2 className="text-xl">Tickets List</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} className="mb-2 border-b pb-2">
            <strong>Ticket ID:</strong> {ticket.id} | <strong>Customer ID:</strong> {ticket.customerId} |{" "}
            <strong>Issue:</strong> {ticket.issue}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportTickets;
