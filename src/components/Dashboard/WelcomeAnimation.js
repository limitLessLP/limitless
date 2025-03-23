"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const WelcomeAnimation = () => {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Investor'

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-black opacity-80" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          background: "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)"
        }}
      />

      {/* Content positioned at bottom right */}
      <div className="absolute bottom-32 right-32 text-right">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-7xl font-extralight text-white mb-4">
            Welcome to Limitless,
          </h1>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-8xl font-light bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            {userName}
          </motion.span>
        </motion.div>
      </div>

      {/* Animated lines in background */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
        <motion.path
          d="M 0 500 Q 400 300 800 500 T 1600 500"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
} 