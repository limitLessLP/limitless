"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { PieChart } from "lucide-react"
import { Footer } from "../Common/Footer"

export const Portfolio = () => {
  const portfolioStats = {
    totalInvested: "$2.4M",
    totalValue: "$3.2M",
    totalReturn: "+24.3%",
    activeInvestments: 4
  }

  const investments = [
    {
      id: 1,
      fundName: "Tech Growth Fund III",
      firm: "Sequoia Capital",
      invested: "$800K",
      currentValue: "$1.1M",
      return: "+37.5%",
      exitDate: "Q2 2024"
    },
    {
      id: 2,
      fundName: "Healthcare Innovation Fund",
      firm: "Andreessen Horowitz",
      invested: "$600K",
      currentValue: "$720K",
      return: "+20%",
      exitDate: "Q4 2024"
    },
    // Add more investments as needed
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
              <h1 className="text-4xl font-extralight mb-4">Portfolio Overview</h1>
              <p className="text-gray-400">Track your investments and performance</p>
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Invested</p>
                  <h3 className="text-2xl font-semibold">{portfolioStats.totalInvested}</h3>
                </div>
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>

            {/* Similar stats cards for other metrics */}
          </div>
        </div>

        {/* Active Investments */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Exit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {investments.map((investment) => (
                    <motion.tr
                      key={investment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{investment.fundName}</div>
                          <div className="text-sm text-gray-500">{investment.firm}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{investment.invested}</td>
                      <td className="px-6 py-4 text-gray-900">{investment.currentValue}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600">{investment.return}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{investment.exitDate}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 