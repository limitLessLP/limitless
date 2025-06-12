"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { CurrentOfferings } from "./CurrentOfferings"
// import { UpcomingFunds } from "./UpcomingFunds"
import { LearnVC } from "./LearnVC"
import { NewsSection } from "./NewsSection"
import { Footer } from "../Common/Footer"
import { UserInvestments } from "./UserInvestments"

export const LPDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Investor'

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      {/* Enhanced Hero Section with Animation */}
      <section className="h-screen relative overflow-hidden bg-black">
        {/* Enhanced animated background gradient */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0],
            background: [
              "radial-gradient(circle at 0% 0%, #e5e4e2 0%, transparent 60%)",
              "radial-gradient(circle at 100% 100%, #b3b6b7 0%, transparent 60%)",
              "radial-gradient(circle at 0% 0%, #e5e4e2 0%, transparent 60%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-30" />

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

        {/* Enhanced Content */}
        <div className="max-w-7xl mx-auto px-8 pt-40 relative z-10 flex flex-col items-center text-center">
          <div className="space-y-12 max-w-5xl">
            {/* First line: "Your Venture" */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extralight text-gray-300 tracking-wide"
            >
              Your Venture
            </motion.h2>

            {/* Second line: "Limitless" */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="text-8xl md:text-9xl font-extrabold platinum-shine-chrome"
              style={{ letterSpacing: '-0.04em', lineHeight: '0.9' }}
            >
              Limitless.
            </motion.h1>

            {/* Third line: "Welcome to the table" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.5 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-extralight text-gray-300 leading-relaxed">
                Welcome to the table,{" "}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 3 }}
                  className="platinum-shine-chrome font-light"
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

          {/* Enhanced Scroll Prompt */}
          <motion.div 
            className="flex flex-col items-center space-y-6 mt-20 z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5, duration: 0.8 }}
          >
            <motion.p 
              className="text-gray-300 text-xl font-extralight tracking-wider"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Your Venture Awaits
            </motion.p>
            <motion.div
              className="w-7 h-12 border-2 border-gray-300 rounded-full p-1.5 bg-black/20 backdrop-blur-sm"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-2 h-2 bg-gray-300 rounded-full mx-auto"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Platinum chrome shine animation CSS */}
        <style>{`
          .platinum-shine-chrome {
            background: linear-gradient(120deg, #e5e4e2 0%, #b3b6b7 25%, #f7f7f7 45%, #ffffff 55%, #f7f7f7 65%, #b3b6b7 75%, #e5e4e2 100%);
            background-size: 350% auto;
            color: #f7f7f7;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine-move-chrome 3.5s cubic-bezier(0.4,0,0.2,1) infinite;
            filter: drop-shadow(0 4px 20px rgba(179, 182, 183, 0.4));
          }
          @supports not (-webkit-background-clip: text) {
            .platinum-shine-chrome {
              color: #f7f7f7;
              -webkit-text-fill-color: inherit;
            }
          }
          @keyframes shine-move-chrome {
            0% { background-position: 350% center; }
            100% { background-position: -50% center; }
          }
        `}</style>
      </section>

      {/* Your Investments */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <UserInvestments />
          </motion.div>
        </div>
      </section>

      {/* Available Investments */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CurrentOfferings />
          </motion.div>
        </div>
      </section>

      {/* Learn More About VC */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <LearnVC />
          </motion.div>
        </div>
      </section>

      {/* Upcoming Funds */}
      {/* <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <UpcomingFunds />
          </motion.div>
        </div>
      </section> */}

      {/* News Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <NewsSection />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 