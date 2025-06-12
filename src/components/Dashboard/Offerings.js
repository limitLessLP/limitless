"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { Search, TrendingUp, Users, DollarSign } from "lucide-react"
import { Footer } from "../Common/Footer"
import { RepublicVC } from "../Funds/republic"
import { PioneerVC } from "../Funds/pioneer"
import { Lola } from "../Funds/lola"
import { useState } from "react"

export const Offerings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Fund data with searchable properties
  const funds = [
    {
      id: "pioneer",
      name: "Pioneer VC",
      description: "Bio & Health focused venture capital",
      categories: ["biotech"],
      keywords: ["bio", "health", "biotech", "pioneer", "dave messina"],
      component: PioneerVC
    },
    {
      id: "republic",
      name: "Republic VC",
      description: "AI, Fintech, and Consumer focused investments",
      categories: ["fintech", "ai"],
      keywords: ["ai", "fintech", "consumer", "republic", "sophie liao", "artificial intelligence"],
      component: RepublicVC
    },
    {
      id: "lola",
      name: "LoLa Capital",
      description: "Life Sciences venture capital fund",
      categories: ["biotech"],
      keywords: ["life sciences", "biotech", "lola", "greg verdine", "circe lyu", "sashank reddy"],
      component: Lola
    }
  ]

  const categories = [
    { id: "all", name: "All Funds", count: funds.length },
    { id: "biotech", name: "BioTech", count: funds.filter(f => f.categories.includes("biotech")).length },
    { id: "fintech", name: "FinTech", count: funds.filter(f => f.categories.includes("fintech")).length },
    { id: "ai", name: "AI & ML", count: funds.filter(f => f.categories.includes("ai")).length }
  ]

  // Filtering logic
  const filteredFunds = funds.filter(fund => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === "all" || 
      fund.categories.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav currentPage="offerings" />
      
      <main className="pt-16">
        {/* Pitch Black Hero Section */}
        <div className="relative bg-black text-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-extralight mb-6 tracking-tight" style={{ lineHeight: '1.1' }}>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Investment
                  </span>
                  <br />
                  <span className="text-white">Opportunities</span>
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Explore carefully curated venture capital funds with proven track records and exceptional growth potential
              </motion.p>

              {/* Simplified Key metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex items-center justify-center space-x-12"
              >
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white mb-1">{funds.length}</div>
                  <div className="text-sm text-gray-400">Active Funds</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white mb-1">$7M+</div>
                  <div className="text-sm text-gray-400">AUM</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white mb-1">30%</div>
                  <div className="text-sm text-gray-400">Avg IRR</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="relative -mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Enhanced Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Funds
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by fund name, focus area, or manager..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Enhanced Categories */}
                <div className="lg:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {category.name}
                        <span className={`ml-1.5 text-xs ${
                          selectedCategory === category.id ? 'text-gray-300' : 'text-gray-400'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Offerings Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Available Investment Opportunities
              {filteredFunds.length !== funds.length && (
                <span className="text-base font-normal text-gray-500 ml-2">
                  {filteredFunds.length} of {funds.length} funds
                </span>
              )}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Each fund has been carefully vetted for quality, performance potential, and alignment with our investment philosophy
            </p>
          </motion.div>

          {/* Enhanced Results Grid */}
          {filteredFunds.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredFunds.map((fund, index) => {
                const FundComponent = fund.component
                return (
                  <motion.div
                    key={fund.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden">
                      <div className="p-2">
                        <FundComponent />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            // Enhanced No Results State
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No funds match your criteria</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Try adjusting your search terms or category selection to discover more investment opportunities
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Choose Limitless?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Join a community of sophisticated investors accessing exclusive opportunities
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center group">
                  <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
                    <DollarSign className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-2">$7M+</div>
                  <div className="text-gray-600">Assets Under Management</div>
                  <div className="text-sm text-gray-500 mt-1">Across all fund partnerships</div>
                </div>
                <div className="text-center group">
                  <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-2">150+</div>
                  <div className="text-gray-600">Portfolio Companies</div>
                  <div className="text-sm text-gray-500 mt-1">Across our fund network</div>
                </div>
                <div className="text-center group">
                  <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
                    <TrendingUp className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-2">30%</div>
                  <div className="text-gray-600">VC Average IRR</div>
                  <div className="text-sm text-gray-500 mt-1">Historical performance</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Relaxed CTA Section with Black Background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16"
          >
            <div className="bg-black rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-lg">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative">
                <h3 className="text-xl font-semibold mb-3">Ready to Start Investing?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Join our platform and gain access to exclusive venture capital opportunities with complete transparency
                </p>
                <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md">
                  Start Your Investment Journey
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 