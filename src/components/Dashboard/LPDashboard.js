"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { CurrentOfferings } from "./CurrentOfferings"
import { UpcomingFunds } from "./UpcomingFunds"
import { LearnVC } from "./LearnVC"
import { NewsSection } from "./NewsSection"
import { Footer } from "../Common/Footer"

export const LPDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Investor'

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav />
      
      {/* Hero Section with Animation */}
      <section className="h-screen relative overflow-hidden bg-black">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            background: [
              "radial-gradient(circle at 0% 0%, #e5e4e2 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #b3b6b7 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, #e5e4e2 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 pt-48 relative z-10 flex flex-col items-center text-center">
          <div className="space-y-8 max-w-4xl">
            {/* First line: "Your Venture" */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-light text-gray-300"
            >
              Your Venture
            </motion.h2>

            {/* Second line: "Limitless" */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="text-8xl font-extrabold platinum-shine-chrome"
              style={{ letterSpacing: '-0.03em' }}
            >
              Limitless.
            </motion.h1>

            {/* Third line: "Welcome to the table" */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 4 }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-light text-gray-300">
                Welcome to the table,{" "}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 4.5 }}
                  className="platinum-shine-chrome"
                >
                  {userName}
                </motion.span>
              </h2>
            </motion.div>
          </div>

          {/* Animated line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 5 }}
          />

          {/* Scroll Prompt - now inside content column and centered */}
          <motion.div 
            className="flex flex-col items-center space-y-4 mt-32 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5, duration: 0.8 }}
          >
            <motion.p 
              className="text-gray-400 text-lg font-light tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your Venture Awaits
            </motion.p>
            <motion.div
              className="w-6 h-10 border-2 border-gray-400 rounded-full p-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-auto"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Platinum chrome shine animation CSS */}
        <style>{`
          .platinum-shine-chrome {
            background: linear-gradient(120deg, #e5e4e2 0%, #b3b6b7 30%, #f7f7f7 50%, #b3b6b7 70%, #e5e4e2 100%);
            background-size: 300% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: shine-move-chrome 2.8s cubic-bezier(0.4,0,0.2,1) infinite;
            filter: drop-shadow(0 2px 16px #b3b6b7cc);
          }
          @keyframes shine-move-chrome {
            0% { background-position: 300% center; }
            100% { background-position: 0% center; }
          }
        `}</style>
      </section>

      {/* Available Investments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <CurrentOfferings />
        </div>
      </section>

      {/* Learn More About VC */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <LearnVC />
        </div>
      </section>

      {/* Upcoming Funds */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <UpcomingFunds />
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <NewsSection />
        </div>
      </section>

      <Footer />
    </div>
  )
} 