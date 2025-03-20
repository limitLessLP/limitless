import React from 'react';
import { motion } from 'framer-motion';

export const FloatingPaths = ({ position = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
    >
      <svg
        className="w-full h-full opacity-30 dark:opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={`M${50 - position * 20},0 Q${50},50 ${50 + position * 20},100`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-neutral-300 dark:text-neutral-700"
        />
      </svg>
    </motion.div>
  );
};