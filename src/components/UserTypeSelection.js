import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 animate-float" />
      </div>

      <button className="absolute top-4 left-4">
        <motion.a 
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
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
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              I am...
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Select the option that best describes you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* VC Firm Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 
              p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/signup-gp')}
          >
            <div className="p-8 rounded-[1.15rem] backdrop-blur-md bg-white/95 dark:bg-black/95 h-full">
              <Building2 className="w-12 h-12 mb-6 text-blue-500" />
              <h2 className="text-2xl font-medium mb-4">A Venture Capital Firm</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Looking to expand my investor base and streamline operations
              </p>
            </div>
          </motion.div>

          {/* Investor Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 
              p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            <div className="p-8 rounded-[1.15rem] backdrop-blur-md bg-white/95 dark:bg-black/95 h-full">
              <Users className="w-12 h-12 mb-6 text-purple-500" />
              <h2 className="text-2xl font-medium mb-4">An Investor</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Seeking access to premium venture capital opportunities
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection; 