"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { ArrowRight } from "lucide-react"
import { Footer } from "../Common/Footer"
import { RepublicVC } from "../Funds/republic"
import { PioneerVC } from "../Funds/pioneer"
import { Lola } from "../Funds/lola"
import { useNavigate } from "react-router-dom"

export const Offerings = () => {

  const navigate = useNavigate();

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
              <h1 className="text-4xl font-extralight mb-4">Current Offerings</h1>
              <p className="text-gray-400">Explore available investment opportunities</p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div> */}

        {/* Offerings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              key="republic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <RepublicVC />
                <button className="mt-6 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors" onClick={() => navigate('/republic')}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
            <motion.div
              key="pioneer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <PioneerVC />
                <button className="mt-6 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors" onClick={() => navigate('/pioneer')}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
            <motion.div
              key="lola"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <Lola />
                <button className="mt-6 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors" onClick={() => navigate('/lola')}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 