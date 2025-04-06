// src/pages/user/UserReports.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const UserReports = () => {
  // Example user data (replace with real data)
  const userName = "Li";

  // Example date range filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Example metrics (replace with real data)
  const [reportMetrics] = useState({
    totalUsage: "185 GB",
    totalSpent: "$199.99",
    ticketsResolved: 5,
  });

  // Example table data (replace with real data)
  const [reportData] = useState([
    {
      id: 1,
      period: "Jan 2025",
      usage: "80 GB",
      amount: "$59.99",
      tickets: 2,
    },
    {
      id: 2,
      period: "Feb 2025",
      usage: "65 GB",
      amount: "$39.99",
      tickets: 1,
    },
    {
      id: 3,
      period: "Mar 2025",
      usage: "40 GB",
      amount: "$99.99",
      tickets: 2,
    },
  ]);

  const handleGenerateReport = () => {
    // Placeholder logic for generating a report
    toast.info("Generating report for selected date range...");
  };

  const handleDownload = () => {
    // Placeholder logic for downloading the report
    toast.success("Report downloaded!");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-500">Hello, {userName}! Generate and view detailed reports below.</p>
      </div>

      {/* Date Range & Generate Button */}
      <div className="bg-white shadow p-4 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600" htmlFor="startDate">
            Start Date:
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="text-sm text-gray-600" htmlFor="endDate">
            End Date:
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Generate Report
        </button>
      </div>

      {/* Chart / Visualization Placeholder */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Usage & Billing Overview</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          {/* Replace this with a real chart component (e.g., Chart.js, Recharts) */}
          Chart Placeholder
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Total Usage</p>
          <h2 className="text-2xl font-bold">{reportMetrics.totalUsage}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Total Spent</p>
          <h2 className="text-2xl font-bold">{reportMetrics.totalSpent}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded flex flex-col">
          <p className="text-sm text-gray-500">Tickets Resolved</p>
          <h2 className="text-2xl font-bold">{reportMetrics.ticketsResolved}</h2>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white shadow p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Detailed Reports</h2>
          <button
            onClick={handleDownload}
            className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm"
          >
            Download
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 font-medium text-gray-600">Period</th>
                <th className="p-2 font-medium text-gray-600">Usage</th>
                <th className="p-2 font-medium text-gray-600">Amount</th>
                <th className="p-2 font-medium text-gray-600">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-2">{item.period}</td>
                  <td className="p-2">{item.usage}</td>
                  <td className="p-2">{item.amount}</td>
                  <td className="p-2">{item.tickets}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No report data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
