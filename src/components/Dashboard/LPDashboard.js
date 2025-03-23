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
              "radial-gradient(circle at 0% 0%, #1E40AF 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #7E22CE 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, #1E40AF 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 pt-48 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-8xl font-extralight">
              <span className="text-white">Welcome,</span>{" "}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              >
                {userName}
              </motion.span>
            </h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-5xl font-light text-gray-300"
            >
              Discover Investments
            </motion.h2>
          </motion.div>

          {/* Animated line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </div>
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