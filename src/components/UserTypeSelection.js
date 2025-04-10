import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, ArrowLeft } from 'lucide-react';

export const UserTypeSelection = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search)
  const forPage = queryParams.get("for")

  const handleClick = (type) => {
    navigate(`/signup?for=${forPage}&type=${type}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">

      {/* Get Started Button */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="group relative p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white text-black hover:bg-gray-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mx-2" />
          <span className="inline-block pr-3 py-2 rounded-[1.15rem] text-sm font-semibold transition-all duration-300 group-hover:-translate-y-0.5">
            Back To Home
          </span>
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl font-extralight mb-8">
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              I am...
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Select the option that best describes you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* VC Firm Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative bg-neutral-900 border border-neutral-800 p-px rounded-2xl backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleClick("gp")}
          >
            <div className="p-8 rounded-[1.15rem] bg-neutral-900 h-full">
              <Building2 className="w-12 h-12 mb-6" />
              <h2 className="text-2xl font-medium mb-4">A Venture Capital Firm</h2>
              <p className="text-gray-400">
                Looking to expand my investor base and streamline operations
              </p>
            </div>
          </motion.div>

          {/* Investor Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative bg-neutral-900 border border-neutral-800 p-px rounded-2xl backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleClick("lp")}
          >
            <div className="p-8 rounded-[1.15rem] bg-neutral-900 h-full">
              <Users className="w-12 h-12 mb-6" />
              <h2 className="text-2xl font-medium mb-4">An Investor</h2>
              <p className="text-gray-400">
                Seeking access to premium venture capital opportunities
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
