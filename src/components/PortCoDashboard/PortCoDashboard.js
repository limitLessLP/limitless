import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut } from 'lucide-react';
import TalentRequests from './TalentRequests';
import TalentReferrals from './TalentReferrals';
import TeamManagement from './TeamManagement';
import { Footer } from '../Common/Footer.js';

const PortCoDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('portco_id');
    localStorage.removeItem('portco_user_id');
    navigate('/portco-signin');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/portco-dashboard" className="text-2xl font-bold bg-gradient-to-r from-black to-neutral-600 bg-clip-text text-transparent">
                  Limitless
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/portco-dashboard/talent-requests" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Talent Requests
                </Link>
                <Link 
                  to="/portco-dashboard/talent-referrals" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Talent Referrals
                </Link>
                <Link 
                  to="/portco-dashboard/team" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Team Management
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/talent-requests" element={<TalentRequests />} />
            <Route path="/talent-referrals" element={<TalentReferrals />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/" element={<TalentRequests />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortCoDashboard;
