import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Users, Calendar, MapPin, Building } from 'lucide-react';

const CustomerReferrals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingRequests, setFetchingRequests] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 3;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_audience: '',
    location: '',
    deadline: '',
    contact_email: '',
    portco_id: localStorage.getItem("portco_id"),
  });

  const fetchRequestDetails = async (requestId) => {
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-customer-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'GET',
          request_id: requestId,
          portco_id: localStorage.getItem("portco_id")
        })
      });

      const data = await response.json();
      if (data.success) {
        return data.request;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching request ${requestId}:`, err);
      return null;
    }
  };

  const fetchActiveRequests = async () => {
    setFetchingRequests(true);
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-customer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portco_id: localStorage.getItem("portco_id")
        })
      });

      const data = await response.json();
      if (data.success && data.request_ids) {
        // Fetch details for each request ID
        const requestDetails = await Promise.all(
          data.request_ids.map(id => fetchRequestDetails(id))
        );
        
        // Filter out any null results and update state
        setRequests(requestDetails.filter(request => request !== null));
      } else {
        setError(data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('An error occurred while fetching requests');
    } finally {
      setFetchingRequests(false);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-customer-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ADD',
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the requests list after adding a new one
        await fetchActiveRequests();
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          target_audience: '',
          location: '',
          deadline: '',
          contact_email: '',
          portco_id: formData.portco_id // Keep the portco_id
        });
      } else {
        setError(data.message || 'Failed to create request');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const displayedRequests = requests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Create Form Section */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-light mb-6">Make a Request</h2>
          <p className="text-sm text-neutral-500 mb-6">Looking for customers, partners, or just want to share something? Put it out there!</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-600 mb-1">
                What are you looking for?
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Anyone know good enterprise customers for AI tools?"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-600 mb-1">
                Tell us more
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="What's your product/service? What kind of customers are you hoping to connect with? Any specific requirements?"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
              />
            </div>

            <div>
              <label htmlFor="target_audience" className="block text-sm font-medium text-neutral-600 mb-1">
                Who should reach out?
              </label>
              <input
                type="text"
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                required
                placeholder="e.g., Enterprise companies, SMBs, Healthcare, anyone with connections"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-600 mb-1">
                Location preference (optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., North America, Remote, San Francisco, anywhere"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-neutral-600 mb-1">
                Timeline (optional)
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-neutral-600 mb-1">
                Where should people reach you?
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                placeholder="your-email@company.com"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Request'}
            </button>
          </form>
        </div>

        {/* Active Requests Section */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-light mb-6">Your Requests</h2>
          
          {fetchingRequests ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : displayedRequests.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p>No requests posted yet.</p>
              <p className="text-sm">Make your first request to start connecting with potential customers!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-black">{request.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {request.description}
                  </p>
                  
                  <div className="space-y-1 text-xs text-neutral-500">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Looking for: {request.target_audience}</span>
                    </div>
                    {request.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{request.location}</span>
                      </div>
                    )}
                    {request.deadline && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Timeline: {new Date(request.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      <span>Contact: {request.contact_email}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-neutral-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerReferrals; 