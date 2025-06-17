import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const TalentReferrals = () => {
  const [openings, setOpenings] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPositions, setExpandedPositions] = useState({});

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

      if (!response.ok) {
        throw new Error(`Failed to fetch position details for ${positionId}`);
      }

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

  useEffect(() => {
    const fetchOpeningsAndReferrals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch openings
        const openingsResponse = await fetch('https://limitless-backend.vercel.app/api/get-portco-openings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portco_id: localStorage.getItem("portco_id")
          })
        });
        
        if (!openingsResponse.ok) {
          throw new Error('Failed to fetch openings');
        }
        
        const openingsData = await openingsResponse.json();
        
        if (!openingsData.success) {
          throw new Error(openingsData.message || 'Failed to fetch openings');
        }
        
        const positionIds = openingsData.open_position_ids || [];
        console.log(positionIds, "positionIds");

        // Fetch position details for each opening
        const openingsWithDetails = await Promise.all(
          positionIds.map(async (positionId) => {
            const positionDetails = await fetchPositionDetails(positionId);
            return {
              id: positionId,
              ...positionDetails
            };
          })
        );

        setOpenings(openingsWithDetails);
        
        // Fetch referrals for each opening
        const allReferrals = [];
        for (const opening of positionIds) {
          try {
            const referralsResponse = await fetch('https://limitless-backend.vercel.app/api/get-position-referrals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                position_id: opening,
              })
            });
            
            if (!referralsResponse.ok) {
              console.error(`Failed to fetch referrals for opening ${opening}`);
              continue;
            }
            
            const referralsData = await referralsResponse.json();
            console.log(referralsData, "referralsData");
            
            if (referralsData.success && referralsData.referrals) {
              allReferrals.push(...referralsData.referrals.map(ref => ({
                ...ref,
                positionId: opening,
                position: openingsWithDetails.find(o => o.id === opening)?.title || 'Unknown Position'
              })));
            }
          } catch (err) {
            console.error(`Error fetching referrals for opening ${opening}:`, err);
          }
        }
        console.log(allReferrals, "allReferrals");
        setReferrals(allReferrals);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpeningsAndReferrals();
  }, []);

  const togglePosition = (positionId) => {
    setExpandedPositions(prev => ({
      ...prev,
      [positionId]: !prev[positionId]
    }));
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesFilter = filter === 'all' || referral.status === filter;
    const matchesSearch = referral.candidate_name?.toLowerCase().includes(search.toLowerCase()) ||
                         referral.position?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!openings || openings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-neutral-500">No openings found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light">Talent Referrals</h2>
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-white border-neutral-200 text-black">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-neutral-900">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="text"
              placeholder="Search referrals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        <div className="space-y-4">
          {openings.map((opening) => {
            const openingReferrals = filteredReferrals.filter(ref => ref.positionId === opening.id);
            const isExpanded = expandedPositions[opening.id];
            
            return (
              <div key={opening.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => togglePosition(opening.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium mb-2">{opening.position_title}</h3>
                      <div className="space-y-2 text-neutral-600">
                        <p><span className="font-medium text-neutral-800">Location:</span> {opening.location}</p>
                        <p><span className="font-medium text-neutral-800">Experience:</span> {opening.experience_level}</p>
                        <p><span className="font-medium text-neutral-800">Status:</span> {opening.status || 'open'}</p>
                        <p><span className="font-medium text-neutral-800">Created:</span> {new Date(opening.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-neutral-500 mr-2">
                        {openingReferrals.length} referral{openingReferrals.length !== 1 ? 's' : ''}
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                    <h4 className="text-lg font-medium mb-4">Referrals</h4>
                    {openingReferrals.length > 0 ? (
                      <div className="space-y-4">
                        {openingReferrals.map((referral) => (
                          <motion.div
                            key={referral._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-medium mb-2">{referral.candidate_name}</h3>
                                <div className="space-y-2 text-neutral-600">
                                  <p><span className="font-medium text-neutral-800">Email:</span> {referral.candidate_email}</p>
                                  <p><span className="font-medium text-neutral-800">Date:</span> {new Date(referral.created_at).toLocaleDateString()}</p>
                                  {referral.notes && (
                                    <p><span className="font-medium text-neutral-800">Notes:</span> {referral.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-4">
                                {referral.resume_pdf && (
                                  <a
                                    href={`data:application/pdf;base64,${referral.resume_pdf}`}
                                    download={`${referral.candidate_name}_resume.pdf`}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-4 py-2 rounded-lg hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                      />
                                    </svg>
                                    Download Resume
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500 italic">No referrals for this position</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default TalentReferrals; 