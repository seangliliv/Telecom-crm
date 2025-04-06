// src/pages/admin/Billing.jsx
import { useState, useEffect } from "react";
import { fetchInvoices, createInvoice } from "../../api";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInvoice, setNewInvoice] = useState({ customerId: "", amount: 0 });

  useEffect(() => {
    fetchInvoices()
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleCreateInvoice = () => {
    createInvoice(newInvoice)
      .then((created) => {
        // Refresh invoices list after creation
        setInvoices([...invoices, created]);
        setNewInvoice({ customerId: "", amount: 0 });
      })
      .catch((error) => {
        console.error("Invoice creation failed:", error);
      });
  };

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Billing</h1>
      <div className="mb-6">
        <h2 className="text-xl">Create Invoice</h2>
        <input
          type="text"
          placeholder="Customer ID"
          value={newInvoice.customerId}
          onChange={(e) => setNewInvoice({ ...newInvoice, customerId: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newInvoice.amount}
          onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })}
          className="border p-2 mr-2"
        />
        <button onClick={handleCreateInvoice} className="bg-blue-600 text-white p-2 rounded">
          Create Invoice
        </button>
      </div>
      <h2 className="text-xl">Invoices List</h2>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id} className="mb-2 border-b pb-2">
            <strong>Invoice ID:</strong> {invoice.id} | <strong>Customer ID:</strong> {invoice.customerId} |{" "}
            <strong>Amount:</strong> ${invoice.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Billing;
