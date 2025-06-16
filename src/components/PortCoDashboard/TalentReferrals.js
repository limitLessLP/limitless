import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const TalentReferrals = () => {
  const [referrals] = useState([
    {
      id: 1,
      candidateName: 'John Doe',
      position: 'Senior Software Engineer',
      referredBy: 'Jane Smith',
      status: 'pending',
      date: '2024-03-15'
    },
    {
      id: 2,
      candidateName: 'Sarah Johnson',
      position: 'Product Manager',
      referredBy: 'Mike Brown',
      status: 'interviewed',
      date: '2024-03-10'
    },
    {
      id: 3,
      candidateName: 'Alex Chen',
      position: 'Data Scientist',
      referredBy: 'Lisa Wang',
      status: 'hired',
      date: '2024-03-05'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'interviewed':
        return 'bg-blue-500/20 text-blue-500';
      case 'hired':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-neutral-500/20 text-neutral-500';
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesFilter = filter === 'all' || referral.status === filter;
    const matchesSearch = referral.candidateName.toLowerCase().includes(search.toLowerCase()) ||
                         referral.position.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          {filteredReferrals.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium mb-2">{referral.candidateName}</h3>
                  <p className="text-neutral-600 mb-4">{referral.position}</p>
                  <div className="space-y-2 text-neutral-600">
                    <p><span className="font-medium text-neutral-800">Referred by:</span> {referral.referredBy}</p>
                    <p><span className="font-medium text-neutral-800">Date:</span> {referral.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                  <button className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-4 py-2 rounded-lg hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TalentReferrals; 