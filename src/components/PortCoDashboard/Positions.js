import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    position_title: '',
    location: '',
    experience_level: '',
    description: '',
    open_position: true
  });
  const [editingPosition, setEditingPosition] = useState(null);

  const portcoId = localStorage.getItem('portco_user_id');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const action = editingPosition ? 'UPDATE' : 'ADD';
      const payload = {
        action,
        portco_id: portcoId,
        ...formData
      };

      if (editingPosition) {
        payload.position_id = editingPosition._id;
      }

      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh positions list
        fetchPositions();
        // Reset form
        setFormData({
          position_title: '',
          location: '',
          experience_level: '',
          description: '',
          open_position: true
        });
        setEditingPosition(null);
      } else {
        setError(data.message || 'Failed to save position');
      }
    } catch (err) {
      setError('Failed to save position. Please try again.');
      console.error('Error saving position:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'GET',
          portco_id: portcoId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPositions(data.positions || []);
      } else {
        setError(data.message || 'Failed to fetch positions');
      }
    } catch (err) {
      setError('Failed to fetch positions. Please try again.');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({
      position_title: position.position_title,
      location: position.location,
      experience_level: position.experience_level,
      description: position.description,
      open_position: position.open_position
    });
  };

  const handleDelete = async (positionId) => {
    if (!window.confirm('Are you sure you want to delete this position?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'DELETE',
          portco_id: portcoId,
          position_id: positionId
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPositions();
      } else {
        setError(data.message || 'Failed to delete position');
      }
    } catch (err) {
      setError('Failed to delete position. Please try again.');
      console.error('Error deleting position:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-neutral-900 mb-4">
            {editingPosition ? 'Edit Position' : 'Add New Position'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-neutral-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="position_title" className="block text-sm font-medium text-neutral-700">
                  Position Title
                </label>
                <input
                  type="text"
                  id="position_title"
                  name="position_title"
                  required
                  value={formData.position_title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-neutral-700">
                Experience Level
              </label>
              <select
                id="experience_level"
                name="experience_level"
                required
                value={formData.experience_level}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="open_position"
                name="open_position"
                checked={formData.open_position}
                onChange={(e) => setFormData(prev => ({ ...prev, open_position: e.target.checked }))}
                className="h-4 w-4 text-neutral-600 focus:ring-neutral-500 border-neutral-300 rounded"
              />
              <label htmlFor="open_position" className="ml-2 block text-sm text-neutral-700">
                Position is open
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              {editingPosition && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPosition(null);
                    setFormData({
                      position_title: '',
                      location: '',
                      experience_level: '',
                      description: '',
                      open_position: true
                    });
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                {loading ? 'Saving...' : editingPosition ? 'Update Position' : 'Add Position'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-light text-neutral-900 mb-6">Current Positions</h3>
          
          {loading && !positions.length ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading positions...</p>
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <p className="text-neutral-600">No positions added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {positions.map((position) => (
                <motion.div
                  key={position._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg border border-neutral-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-neutral-900">{position.position_title}</h4>
                      <p className="text-sm text-neutral-600 mt-1">{position.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(position)}
                        className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(position._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {position.experience_level}
                    </span>
                    {!position.open_position && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Closed
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-neutral-600">{position.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Positions; 