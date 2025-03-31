// src/pages/admin/Invoice.jsx
import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getInvoices, addInvoice } from "../../features/invoiceSlice";
// import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
 
const Invoice = () => {
  // Example state for form fields
  const [customerName, setCustomerName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [services, setServices] = useState({
    dataPlus: false,
    premiumMonthly: false,
    professionalPlan: false,
    premium4G: false,
  });
  const [billingStart, setBillingStart] = useState("");
  const [billingEnd, setBillingEnd] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  // Example charges
  const subscriptionFee = 99.0;
  const subTotal = 0.0;
  const tax = 4.90;
  const total = 103.90;

  const handleServiceChange = (e) => {
    const { name, checked } = e.target;
    setServices((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGenerateInvoice = () => {
    // You can implement actual invoice generation logic here
    toast.success("Invoice generated successfully!");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage payments</p>
        </div>
        <button
          onClick={handleGenerateInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Invoice
        </button>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Customer Details & Service Details */}
        <div className="space-y-4">
          {/* Customer Details */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Customer Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account ID
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter account ID"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Service Details</h2>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="dataPlus"
                  checked={services.dataPlus}
                  onChange={handleServiceChange}
                  className="mr-2"
                />
                Data Plus
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="premiumMonthly"
                  checked={services.premiumMonthly}
                  onChange={handleServiceChange}
                  className="mr-2"
                />
                Premium Monthly
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="professionalPlan"
                  checked={services.professionalPlan}
                  onChange={handleServiceChange}
                  className="mr-2"
                />
                Professional Plan
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="premium4G"
                  checked={services.premium4G}
                  onChange={handleServiceChange}
                  className="mr-2"
                />
                Premium 4G
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Billing Period, Payment Status, Charges Summary */}
        <div className="space-y-4">
          {/* Billing Period */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Billing Period</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={billingStart}
                  onChange={(e) => setBillingStart(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={billingEnd}
                  onChange={(e) => setBillingEnd(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Charges Summary */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Charges Summary</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center justify-between">
                <span>Subscription Fee</span>
                <span>${subscriptionFee.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subTotal.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

