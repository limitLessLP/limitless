"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { NewsSection } from "./NewsSection"
import { Footer } from "../Common/Footer"
import { useState } from "react"

export const LPDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Investor'
  const [showAllNews, setShowAllNews] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <DashboardNav />
      
      {/* Hero Section with Animation */}
      <section className="h-screen relative overflow-hidden bg-[#0A0A0A]">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.15, 0],
            background: [
              "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.5, 0],
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
              className="text-4xl font-light text-gray-400"
            >
              Your Venture
            </motion.h2>

            {/* Second line: "Limitless" */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="text-8xl font-extrabold premium-gradient"
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
              <h2 className="text-5xl font-light text-gray-400">
                Welcome to the table,{" "}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 4.5 }}
                  className="premium-gradient"
                >
                  {userName}
                </motion.span>
              </h2>
            </motion.div>
          </div>

          {/* Animated line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 5 }}
          />

          {/* Scroll Prompt */}
          <motion.div 
            className="flex flex-col items-center space-y-4 mt-32 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5, duration: 0.8 }}
          >
            <motion.p 
              className="text-gray-500 text-lg font-light tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your Venture Awaits
            </motion.p>
            <motion.div
              className="w-6 h-10 border-2 border-gray-700 rounded-full p-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-gray-700 rounded-full mx-auto"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Premium gradient animation CSS */}
        <style>{`
          .premium-gradient {
            background: linear-gradient(120deg, #ffffff 0%, #a8b2d1 30%, #ffffff 50%, #a8b2d1 70%, #ffffff 100%);
            background-size: 300% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: shine-move 3s cubic-bezier(0.4,0,0.2,1) infinite;
            filter: drop-shadow(0 2px 16px rgba(168, 178, 209, 0.3));
          }
          @keyframes shine-move {
            0% { background-position: 300% center; }
            100% { background-position: 0% center; }
          }
        `}</style>
      </section>
      
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Cards Section - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Current Offerings Card */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
            <h2 className="text-2xl font-semibold mb-2">Current Offerings</h2>
            <p className="text-gray-400 mb-6">Explore available investment opportunities</p>
            
            {/* Fund Items */}
            <div className="space-y-4">
              <div className="group">
                <div className="flex justify-between items-center mb-1 cursor-pointer">
                  <h3 className="font-medium group-hover:text-white transition">Pioneer VC</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">BioTech & Health</p>
              </div>
              
              <div className="h-px bg-[#222222] my-4"></div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-1 cursor-pointer">
                  <h3 className="font-medium group-hover:text-white transition">Republic VC</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">AI, Fintech & Consumers</p>
              </div>
              
              <div className="h-px bg-[#222222] my-4"></div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-1 cursor-pointer">
                  <h3 className="font-medium group-hover:text-white transition">LoLa Capital</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Life Sciences</p>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                View All Offerings
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Portfolio Summary Card */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
            <h2 className="text-2xl font-semibold mb-2">Portfolio Summary</h2>
            <p className="text-gray-400 mb-6">Track your investment performance</p>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Invested</span>
                <span className="text-white text-xl font-medium">$250,000</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Current Value</span>
                <span className="text-white text-xl font-medium">$325,000</span>
              </div>
              
              <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-gray-400">ROI</span>
                <span className="text-emerald-400 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +30%
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Pioneer VC</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">$100,000</span>
                  <span className="text-sm text-emerald-400">+15%</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Republic VC</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">$75,000</span>
                  <span className="text-sm text-red-400">-5%</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>LoLa Capital</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">$75,000</span>
                  <span className="text-sm text-emerald-400">+22%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                View Portfolio Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
            <h2 className="text-2xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-400 mb-6">Latest updates from your investments</p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 mt-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Investment Confirmed</h3>
                  <p className="text-sm text-gray-400 mt-1">Your $50K investment in LoLa Capital has been confirmed</p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-3 h-3 rounded-full bg-amber-400 mt-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Document Available</h3>
                  <p className="text-sm text-gray-400 mt-1">New quarterly report available for Pioneer VC</p>
                  <p className="text-xs text-gray-500 mt-2">Yesterday</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mt-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Fund Update</h3>
                  <p className="text-sm text-gray-400 mt-1">Republic VC has added 2 new portfolio companies</p>
                  <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                View All Activity
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Learn More About VC Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-10">Learn More About VC</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
              <div className="bg-[#2A2A2A] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">VC Fundamentals</h3>
              <p className="text-gray-400 mb-6">Learn the basics of venture capital investing and fund structures.</p>
              
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
              <div className="bg-[#2A2A2A] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Investment Strategy</h3>
              <p className="text-gray-400 mb-6">Understand different investment strategies and portfolio management.</p>
              
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
              <div className="bg-[#2A2A2A] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Due Diligence</h3>
              <p className="text-gray-400 mb-6">Master the art of evaluating venture capital opportunities.</p>
              
              <a href="#" className="inline-flex items-center text-sm font-medium text-white">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Two Column Layout - Market Insights and Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Insights */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Market Insights</h2>
              <button onClick={() => setShowAllNews(!showAllNews)} className="text-sm font-medium bg-[#222222] px-4 py-2 rounded-md hover:bg-[#333333] transition">{!showAllNews ? "View All" : "Show Less"}</button>
            </div>
            
            {/* Using the original NewsSection component with custom styling */}
            <div className="news-dark-theme">
              <NewsSection customTitle="hidden" showAll={showAllNews} setShowAll={setShowAllNews} />
            </div>
            
            <style>
              {`
                .news-dark-theme {
                  color: white;
                }
                .news-dark-theme h2,
                .news-dark-theme h3, 
                .news-dark-theme a {
                  color: white !important;
                }
                .news-dark-theme a:hover {
                  opacity: 0.8;
                }
                .news-dark-theme hr, 
                .news-dark-theme .divider {
                  border-color: #222222 !important;
                  background-color: #222222 !important;
                }
                /* Hide the original title from NewsSection */
                .news-dark-theme h2:first-child {
                  display: none;
                }
              `}
            </style>
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-[#111111] rounded-xl p-8 border border-[#222222] hover:border-[#333333] transition duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <a href="#" className="text-sm font-medium bg-[#222222] px-4 py-2 rounded-md hover:bg-[#333333] transition">View All</a>
            </div>
            <p className="text-gray-400 mb-6">Your scheduled meetings and events</p>
            
            <div className="space-y-6">
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#222222]">
                <h3 className="text-lg font-medium mb-4">Quarterly Portfolio Review</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">May 15, 2025</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">10:00 AM - 12:00 PM</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">Virtual Meeting</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#222222]">
                <h3 className="text-lg font-medium mb-4">TechCorp Board Meeting</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">May 18, 2025</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">2:00 PM - 4:00 PM</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">VC Headquarters, 12th Floor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 