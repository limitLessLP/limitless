import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TalentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingRequests, setFetchingRequests] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 3;
  const [formData, setFormData] = useState({
    position_title: '',
    location: '',
    experience_level: '',
    description: '',
    portco_id: localStorage.getItem("portco_id"),
  });

  const fetchPositionDetails = async (positionId) => {
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'GET',
          position_id: positionId,
          portco_id: localStorage.getItem("portco_id")
        })
      });

      const data = await response.json();
      if (data.success) {
        return data.position;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching position ${positionId}:`, err);
      return null;
    }
  };

  const fetchActiveRequests = async () => {
    setFetchingRequests(true);
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-openings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portco_id: localStorage.getItem("portco_id")
        })
      });

      const data = await response.json();
      if (data.success && data.open_position_ids) {
        // Fetch details for each position ID
        const positionDetails = await Promise.all(
          data.open_position_ids.map(id => fetchPositionDetails(id))
        );
        
        // Filter out any null results and update state
        setRequests(positionDetails.filter(position => position !== null));
      } else {
        setError(data.message || 'Failed to fetch positions');
      }
    } catch (err) {
      setError('An error occurred while fetching positions');
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
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
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
          position_title: '',
          location: '',
          experience_level: '',
          description: '',
          portco_id: formData.portco_id // Keep the portco_id
        });
      } else {
        setError(data.message || 'Failed to create position');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the position');
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
          <h2 className="text-2xl font-light mb-6">Create Talent Request</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="position_title" className="block text-sm font-medium text-neutral-600 mb-1">
                Position Title
              </label>
              <input
                type="text"
                id="position_title"
                name="position_title"
                value={formData.position_title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-600 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-neutral-600 mb-1">
                Required Experience
              </label>
              <input
                type="text"
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-600 mb-1">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 min-h-[150px]"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-3 rounded-lg transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-neutral-800 hover:to-neutral-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </form>
        </div>

        {/* Active Requests Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light">Active Requests</h2>
            <button
              onClick={fetchActiveRequests}
              disabled={fetchingRequests}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {fetchingRequests ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div className="space-y-4">
            {fetchingRequests && requests.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">No active requests found</div>
            ) : (
              <>
                <div className="space-y-4">
                  {displayedRequests.map(request => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-medium mb-4">{request.position_title}</h3>
                      <div className="space-y-2 text-neutral-600">
                        <p><span className="font-medium text-neutral-800">Location:</span> {request.location}</p>
                        <p><span className="font-medium text-neutral-800">Experience:</span> {request.experience_level}</p>
                        <p><span className="font-medium text-neutral-800">Status:</span> {request.status || 'open'}</p>
                        <p><span className="font-medium text-neutral-800">Created:</span> {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-neutral-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TalentRequests; 