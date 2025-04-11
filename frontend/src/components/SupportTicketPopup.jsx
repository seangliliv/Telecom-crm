import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';

const SupportTicketPopup = ({ isOpen, onClose }) => {
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'billing',
    priority: 'medium',
    description: '',
    attachments: []
  });

  // List of ticket categories
  const categories = [
    { value: 'billing', label: 'Billing Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'account', label: 'Account Management' },
    { value: 'service', label: 'Service Request' },
    { value: 'other', label: 'Other' }
  ];

  // List of priority levels
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleFileChange = (e) => {
    // In a real implementation, you would handle file uploads here
    const files = Array.from(e.target.files);
    setTicketData({ 
      ...ticketData, 
      attachments: [...ticketData.attachments, ...files] 
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...ticketData.attachments];
    updatedAttachments.splice(index, 1);
    setTicketData({ ...ticketData, attachments: updatedAttachments });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would submit the ticket data to your backend
    console.log('Submitting ticket:', ticketData);
    
    // Display success message
    alert('Ticket created successfully! Your ticket ID is TK-' + Math.floor(2025000 + Math.random() * 1000));
    
    // Reset form and close popup
    setTicketData({
      subject: '',
      category: 'billing',
      priority: 'medium',
      description: '',
      attachments: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Popup Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Create Support Ticket</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Popup Body */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit}>
            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject*
              </label>
              <input
                type="text"
                name="subject"
                value={ticketData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your issue"
                required
              />
            </div>
            
            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  name="category"
                  value={ticketData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority*
                </label>
                <select
                  name="priority"
                  value={ticketData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={ticketData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide details about the issue you're experiencing"
                rows="5"
                required
              />
            </div>
            
            {/* File Attachments */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="flex items-center">
                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200">
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span>Add Files</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  Max 3 files (10MB each)
                </span>
              </div>
              
              {/* Attachment List */}
              {ticketData.attachments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {ticketData.attachments.map((file, index) => (
                    <li 
                      key={index}
                      className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>
        
        {/* Popup Footer */}
        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketPopup;