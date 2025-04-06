// src/components/dashboard/RevenueAnalysisChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const RevenueAnalysisChart = ({ data }) => {
  // Format date for display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="#1E3A8A" 
          activeDot={{ r: 8 }} 
          name="Daily Revenue"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueAnalysisChart;