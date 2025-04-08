import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp,
  Users,
  Calendar,
  FileText,
  Download,
  Printer,
  RefreshCw,
  Mail,
  ExternalLink,
  Clock
} from 'lucide-react';
import { fetchInvoices, fetchCustomers } from '../../allApi';

const Invoice = () => {
  // State for data and loading
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [error, setError] = useState(null);
  
  // State for invoice statistics
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    overduedInvoices: 0
  });

  // Form data for new invoice
  const [formData, setFormData] = useState({
    customerId: '',
    invoiceNumber: '',
    description: '',
    amount: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    status: 'Pending'
  });

  // Fetch invoices data
  const getInvoices = async () => {
    try {
      setLoading(true);
      
      // Fetch invoices and customers data
      let invoicesData = [];
      let customersData = [];
      
      try {
        invoicesData = await fetchInvoices();
        console.log("Invoices data:", invoicesData);
      } catch (invoiceError) {
        console.error("Error fetching invoices:", invoiceError);
        setError(`Failed to fetch invoices: ${invoiceError.message}`);
        invoicesData = [];
      }
      
      try {
        customersData = await fetchCustomers();
        console.log("Customers data:", customersData);
      } catch (customerError) {
        console.error("Error fetching customers:", customerError);
        // Don't set error for customers, as it's secondary data
        customersData = [];
      }
      
      // Ensure we have arrays
      invoicesData = Array.isArray(invoicesData) ? invoicesData : [];
      customersData = Array.isArray(customersData) ? customersData : [];
      
      // Update state with fetched data
      setInvoices(invoicesData);
      setCustomers(customersData);
      
      // Calculate statistics
      calculateStats(invoicesData);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message}`);
      setLoading(false);
    }
  };

  // Calculate invoice statistics
  const calculateStats = (invoicesData) => {
    if (!Array.isArray(invoicesData)) return;
    
    const total = invoicesData.length;
    const paid = invoicesData.filter(invoice => 
      invoice.status === "Paid" || invoice.status === "Completed").length;
    
    const pendingInvoices = invoicesData.filter(invoice =>
      invoice.status === "Pending" || invoice.status === "Processing");
    
    const pendingTotal = pendingInvoices.reduce((sum, invoice) => 
      sum + (parseFloat(invoice.amount) || 0), 0);
      
    const overdue = invoicesData.filter(invoice => 
      invoice.status === "Overdue").length;
    
    setStats({
      totalInvoices: total,
      paidInvoices: paid,
      pendingAmount: pendingTotal.toFixed(2),
      overduedInvoices: overdue
    });
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // View invoice details
  const viewInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setShowViewModal(true);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle date range filter
  const handleDateRangeChange = (e, field) => {
    setDateRange({
      ...dateRange,
      [field]: e.target.value
    });
  };

  // Filter invoices based on search term, status, and date range
  const filteredInvoices = React.useMemo(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(invoice => 
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.dueDate || invoice.issueDate);
        return invoiceDate >= new Date(dateRange.start);
      });
    }
    
    if (dateRange.end) {
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.dueDate || invoice.issueDate);
        return invoiceDate <= new Date(dateRange.end);
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [invoices, searchTerm, statusFilter, dateRange, sortConfig]);

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Handle add item to invoice
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  // Handle remove item from invoice
  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Recalculate total if quantity or unitPrice changed
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Calculate invoice total
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      customerId: '',
      invoiceNumber: '',
      description: '',
      amount: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      status: 'Pending'
    });
  };

  // Initial data fetch
  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-gray-600">View and manage customer invoices</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={getInvoices}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Invoices" 
          value={loading ? "Loading..." : stats.totalInvoices} 
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="Paid Invoices" 
          value={loading ? "Loading..." : stats.paidInvoices} 
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-100"
        />
        <StatCard 
          title="Pending Amount" 
          value={loading ? "Loading..." : `$${stats.pendingAmount}`} 
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          bgColor="bg-yellow-100"
        />
        <StatCard 
          title="Overdue Invoices" 
          value={loading ? "Loading..." : stats.overduedInvoices} 
          icon={<Calendar className="h-6 w-6 text-red-600" />}
          bgColor="bg-red-100"
        />
      </div>

      {/* Invoices Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              className="border rounded-md p-2"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              placeholder="From"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange(e, 'start')}
              className="border rounded-md p-2"
            />
            <input
              type="date"
              placeholder="To"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange(e, 'end')}
              className="border rounded-md p-2"
            />
            <button className="p-2 border rounded-md">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('invoiceNumber')}
                  >
                    <div className="flex items-center">
                      Invoice #
                      {getSortIndicator('invoiceNumber')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('customerName')}
                  >
                    <div className="flex items-center">
                      Customer
                      {getSortIndicator('customerName')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('issueDate')}
                  >
                    <div className="flex items-center">
                      Issue Date
                      {getSortIndicator('issueDate')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('dueDate')}
                  >
                    <div className="flex items-center">
                      Due Date
                      {getSortIndicator('dueDate')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      {getSortIndicator('amount')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIndicator('status')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber || `INV-${index + 1000}`}</div>
                            <div className="text-xs text-gray-500">ID: {typeof invoice.id === 'string' ? invoice.id.slice(-8) : index}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.customerName || "Customer Name"}</div>
                        <div className="text-xs text-gray-500">{invoice.customerEmail || "customer@example.com"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{invoice.amount || "0.00"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <InvoiceStatusBadge status={invoice.status || "Pending"} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Invoice"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            title="Print Invoice"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-purple-600 hover:text-purple-900"
                            title="Send Email"
                          >
                            <Mail className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            title="More Actions"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'All' || dateRange.start || dateRange.end
                        ? "No invoices match your search criteria"
                        : "No invoices found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 border rounded bg-blue-600 text-white">
                1
              </button>
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                2
              </button>
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                3
              </button>
              <button className="px-3 py-1 border rounded bg-white text-gray-600">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {showViewModal && (
        <Modal 
          title={`Invoice: ${currentInvoice.invoiceNumber || 'N/A'}`} 
          onClose={() => setShowViewModal(false)}
          size="large"
        >
          <div className="p-4">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">Invoice Details</h3>
                  <p className="text-gray-600">Invoice #: {currentInvoice.invoiceNumber || 'N/A'}</p>
                </div>
                <InvoiceStatusBadge status={currentInvoice.status || "Pending"} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p>{currentInvoice.customerName || 'N/A'}</p>
                <p>{currentInvoice.customerEmail || 'N/A'}</p>
                <p>{currentInvoice.customerPhone || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Invoice Information</h4>
                <p>Issue Date: {currentInvoice.issueDate ? new Date(currentInvoice.issueDate).toLocaleDateString() : 'N/A'}</p>
                <p>Due Date: {currentInvoice.dueDate ? new Date(currentInvoice.dueDate).toLocaleDateString() : 'N/A'}</p>
                <p>Payment Method: {currentInvoice.paymentMethod || 'N/A'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Items</h4>
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(currentInvoice.items && currentInvoice.items.length > 0) ? (
                    currentInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.description}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">${item.unitPrice}</td>
                        <td className="px-4 py-2 text-sm">${item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-sm text-center">No items available</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right font-semibold">Total:</td>
                    <td className="px-4 py-2 font-semibold">${currentInvoice.amount || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="border-t pt-4 flex justify-between">
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-gray-600">{currentInvoice.notes || 'No additional notes'}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-600 rounded-md flex items-center">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </button>
                <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-md flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <Modal 
          title="Create New Invoice" 
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          size="large"
        >
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name || customer.fullName || customer.customerName || `Customer ${customer.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  className="w-full border p-2 rounded-md"
                  placeholder="INV-0001"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border p-2 rounded-md"
                rows="2"
                placeholder="Invoice description"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Invoice Items</h4>
                <button 
                  type="button" 
                  onClick={handleAddItem}
                  className="text-blue-600 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>
              
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full border p-1 rounded-md"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full border p-1 rounded-md"
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 border p-1 rounded-md"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            value={item.total}
                            readOnly
                            className="w-full pl-6 border p-1 rounded-md bg-gray-50"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {formData.items.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right font-semibold">Total:</td>
                    <td className="px-4 py-2 font-semibold">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          value={calculateTotal()}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full pl-6 border p-1 rounded-md font-bold"
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border p-2 rounded-md"
                rows="2"
                placeholder="Additional notes"
              ></textarea>
            </div>
            
            <div className="pt-3 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  // Here you would call a function to create the invoice
                  console.log('Creating invoice:', formData);
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Create Invoice
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Invoice Status Badge Component
const InvoiceStatusBadge = ({ status }) => {
  let color = '';
  switch (status) {
    case 'Paid':
    case 'Completed':
      color = 'bg-green-100 text-green-800';
      break;
    case 'Pending':
    case 'Processing':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Overdue':
      color = 'bg-red-100 text-red-800';
      break;
    case 'Cancelled':
      color = 'bg-gray-100 text-gray-800';
      break;
    default:
      color = 'bg-blue-100 text-blue-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600">{title}</h2>
        <div className={`${bgColor} p-2 rounded-full`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, onClose, size = "medium" }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg w-full mx-4 ${size === 'large' ? 'max-w-4xl' : 'max-w-md'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Invoice;