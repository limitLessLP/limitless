import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  ExternalLink, 
  Users, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Mail,
  Megaphone,
  UserPlus,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { DashboardNav } from './DashboardNav';
import { Footer } from '../Common/Footer';

const PortCoDetail = () => {
  const { portcoId } = useParams();
  console.log(portcoId);
  const navigate = useNavigate();
  const [portco, setPortco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [talentRequests, setTalentRequests] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'talent', 'customers'
  const [talentLoading, setTalentLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [referralForm, setReferralForm] = useState({
    candidate_name: '',
    candidate_email: '',
    notes: '',
    resume_file: null
  });
  const [submittingReferral, setSubmittingReferral] = useState(false);

  useEffect(() => {
    fetchPortcoDetails();
  }, [portcoId]);

  const fetchPortcoDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portco_id: portcoId
        })
      });

      const data = await response.json();
      if (data.success) {
        setPortco(data.portco);
      } else {
        setError(data.message || 'Failed to fetch portfolio company details');
      }
    } catch (err) {
      setError('An error occurred while fetching portfolio company details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerRequests = async () => {
    try {
      setCustomerLoading(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-customer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portco_id: portcoId
        })
      });

      const data = await response.json();
      if (data.success && data.request_ids) {
        // Fetch details for each request ID
        const requestDetails = await Promise.all(
          data.request_ids.map(id => fetchRequestDetails(id))
        );
        
        // Filter out any null results and update state
        setCustomerRequests(requestDetails.filter(request => request !== null));
      } else {
        console.error('Failed to fetch customer requests:', data.message);
        setCustomerRequests([]);
      }
    } catch (err) {
      console.error('Error fetching customer requests:', err);
      setCustomerRequests([]);
    } finally {
      setCustomerLoading(false);
    }
  };

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
          portco_id: portcoId
        })
      });

      const data = await response.json();
      if (data.success) {
        return data.request;
      } else {
        console.error('Failed to fetch request details:', data.message);
        return null;
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      return null;
    }
  };

  const fetchTalentRequests = async () => {
    try {
      setTalentLoading(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-openings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portco_id: portcoId
        })
      });

      const data = await response.json();
      if (data.success && data.open_position_ids) {
        // Fetch details for each position ID using the portco-handle-position endpoint
        const requestDetails = await Promise.all(
          data.open_position_ids.map(id => fetchTalentRequestDetails(id))
        );
        
        // Filter out any null results and update state
        setTalentRequests(requestDetails.filter(request => request !== null));
      } else {
        console.error('Failed to fetch talent requests:', data.message);
        setTalentRequests([]);
      }
    } catch (err) {
      console.error('Error fetching talent requests:', err);
      setTalentRequests([]);
    } finally {
      setTalentLoading(false);
    }
  };

  const fetchTalentRequestDetails = async (requestId) => {
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-handle-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'GET',
          position_id: requestId,
          portco_id: portcoId
        })
      });

      const data = await response.json();
      if (data.success) {
        return data.position;
      } else {
        console.error('Failed to fetch talent request details:', data.message);
        return null;
      }
    } catch (err) {
      console.error('Error fetching talent request details:', err);
      return null;
    }
  };

  const openReferralModal = (position) => {
    setSelectedPosition(position);
    setReferralForm({
      candidate_name: '',
      candidate_email: '',
      notes: '',
      resume_file: null
    });
    setIsReferralModalOpen(true);
  };

  const closeReferralModal = () => {
    setIsReferralModalOpen(false);
    setSelectedPosition(null);
    setReferralForm({
      candidate_name: '',
      candidate_email: '',
      notes: '',
      resume_file: null
    });
  };

  const handleReferralFormChange = (e) => {
    const { name, value } = e.target;
    setReferralForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setReferralForm(prev => ({
        ...prev,
        resume_file: file
      }));
    } else {
      alert('Please select a PDF file for the resume.');
    }
  };

  const submitTalentReferral = async (e) => {
    e.preventDefault();
    if (!selectedPosition) return;

    setSubmittingReferral(true);
    try {
      // Convert file to base64 if present
      let resumeBase64 = null;
      if (referralForm.resume_file) {
        const reader = new FileReader();
        resumeBase64 = await new Promise((resolve) => {
          reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
            resolve(base64);
          };
          reader.readAsDataURL(referralForm.resume_file);
        });
      }

      const response = await fetch('https://limitless-backend.vercel.app/api/submit-position-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position_id: selectedPosition._id,
          candidate_name: referralForm.candidate_name,
          candidate_email: referralForm.candidate_email,
          notes: referralForm.notes,
          resume_pdf: resumeBase64,
          referrer_id: localStorage.getItem('userId')
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Talent referral submitted successfully!');
        closeReferralModal();
      } else {
        alert(data.message || 'Failed to submit referral');
      }
    } catch (err) {
      console.error('Error submitting referral:', err);
      alert('An error occurred while submitting the referral');
    } finally {
      setSubmittingReferral(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'talent' && talentRequests.length === 0) {
      fetchTalentRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'customers' && customerRequests.length === 0) {
      fetchCustomerRequests();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNav currentPage="Portfolio" />
        <main className="flex-grow pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !portco) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNav currentPage="Portfolio" />
        <main className="flex-grow pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Company Not Found</h2>
              <p className="text-gray-500 mb-6">{error || 'The portfolio company you\'re looking for doesn\'t exist.'}</p>
              <button
                onClick={() => navigate('/lp-portfolio')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav currentPage="Portfolio" />
      
      <main className="flex-grow pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/lp-portfolio')}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{portco.name}</h1>
                  <p className="text-sm text-gray-500">Portfolio Company</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {portco.website && (
                  <a
                    href={portco.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </a>
                )}
                {portco.linkedin && (
                  <a
                    href={portco.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('talent')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'talent'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Talent Requests
                </div>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Customer Requests
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1 text-gray-900">{portco.description || 'No description available.'}</p>
                    </div>
                    {portco.industry && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                        <p className="mt-1 text-gray-900">{portco.industry}</p>
                      </div>
                    )}
                    {portco.stage && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                        <p className="mt-1 text-gray-900">{portco.stage}</p>
                      </div>
                    )}
                    {portco.founded && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                        <p className="mt-1 text-gray-900">{new Date(portco.founded).getFullYear()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Talent Requests</span>
                      <span className="text-sm font-medium text-gray-900">
                        {talentRequests.length > 0 ? talentRequests.length : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Customer Requests</span>
                      <span className="text-sm font-medium text-gray-900">
                        {customerRequests.length > 0 ? customerRequests.length : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    {portco.contact_email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${portco.contact_email}`} className="hover:text-black">
                          {portco.contact_email}
                        </a>
                      </div>
                    )}
                    {portco.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {portco.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'talent' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Talent Requests</h2>
                
                {talentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : talentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No talent requests available</p>
                    <p className="text-sm text-gray-400 mt-1">Talent requests will appear here when posted</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {talentRequests.map((request, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{request.position_title}</h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{request.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>Experience: {request.experience_level}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => openReferralModal(request)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Refer Talent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Requests</h2>
                
                {customerLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : customerRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No customer requests available</p>
                    <p className="text-sm text-gray-400 mt-1">Customer requests will appear here when posted</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerRequests.map((request, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{request.title}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                        <div className="space-y-1 text-xs text-gray-500">
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
                            <Mail className="w-3 h-3 mr-1" />
                            <span>Contact: {request.contact_email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Talent Referral Modal */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Refer Talent</h2>
              <button
                onClick={closeReferralModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {selectedPosition && (
              <div className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedPosition.position_title}</h3>
                  <p className="text-sm text-gray-600">{selectedPosition.location} • {selectedPosition.experience_level}</p>
                </div>
                
                <form onSubmit={submitTalentReferral} className="space-y-4">
                  <div>
                    <label htmlFor="candidate_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Name *
                    </label>
                    <input
                      type="text"
                      id="candidate_name"
                      name="candidate_name"
                      value={referralForm.candidate_name}
                      onChange={handleReferralFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter candidate's full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="candidate_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Email *
                    </label>
                    <input
                      type="email"
                      id="candidate_email"
                      name="candidate_email"
                      value={referralForm.candidate_email}
                      onChange={handleReferralFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter candidate's email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={referralForm.notes}
                      onChange={handleReferralFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Any additional notes about the candidate..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="resume_file" className="block text-sm font-medium text-gray-700 mb-1">
                      Resume (PDF)
                    </label>
                    <input
                      type="file"
                      id="resume_file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeReferralModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReferral}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReferral ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Referral
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PortCoDetail; 