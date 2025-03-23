"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { ArrowRight, Filter } from "lucide-react"
import { Footer } from "../Common/Footer"

export const Offerings = () => {
  const offerings = [
    {
      id: 1,
      name: "Tech Growth Fund III",
      firm: "Sequoia Capital",
      description: "Late-stage technology companies with proven business models",
      target: "$500M",
      minimum: "$250K",
      focus: "Late Stage Technology",
      deadline: "Aug 30, 2024",
      status: "Open",
      tags: ["Technology", "Growth Stage", "Global"]
    },
    // Add more offerings
  ]

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              {/* Add more filter options */}
            </div>
          </div>
        </div>

        {/* Offerings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((offering, index) => (
              <motion.div
                key={offering.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{offering.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{offering.firm}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {offering.status}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-gray-600">{offering.description}</p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Target Size</p>
                      <p className="font-medium">{offering.target}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Minimum Investment</p>
                      <p className="font-medium">{offering.minimum}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {offering.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="mt-6 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 