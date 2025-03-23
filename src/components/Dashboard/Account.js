"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { User, Bell, Shield } from "lucide-react"
import { Footer } from "../Common/Footer"

export const Account = () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    accreditationStatus: "Verified",
    joinDate: "January 2024"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-extralight mb-4">Account Settings</h1>
              <p className="text-gray-400">Manage your profile and preferences</p>
            </motion.div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">First Name</label>
                <input
                  type="text"
                  value={user.firstName}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                <input
                  type="text"
                  value={user.lastName}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={user.phone}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors mb-4">
              Change Password
            </button>
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors">
              Enable Two-Factor Authentication
            </button>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            {/* Add notification preferences */}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 