import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, ArrowRight } from 'lucide-react';

export const UserTypeSelection = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search)
  const forPage = queryParams.get("for")

  const handleClick = (type) => {
    navigate(`/signup?for=${forPage}&type=${type}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-600/20 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-600/20 animate-float" />
      </div> */}

      <button className="absolute top-4 left-4">
        <motion.a 
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight className="rotate-180 mr-2" />
          <span>Back to Home</span>
        </motion.a>
      </button>

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
