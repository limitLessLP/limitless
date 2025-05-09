import { motion } from "framer-motion"
import { Bell } from "lucide-react"

export const UpcomingFunds = () => {
  const upcomingFunds = [
    {
      id: 1,
      name: "Fintech Opportunities Fund",
      firm: "Accel Partners",
      expectedLaunch: "Q3 2025",
      targetSize: "$400M",
    },
    {
      id: 2,
      name: "AI & ML Fund II",
      firm: "Benchmark Capital",
      expectedLaunch: "Q4 2025",
      targetSize: "$600M",
    },
  ]

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 ">Upcoming Funds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingFunds.map((fund, index) => (
          <motion.div
            key={fund.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 ">{fund.name}</h3>
                <p className="text-sm text-gray-600">{fund.firm}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600" title="Get notified">
                <Bell className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Expected Launch</p>
                <p className="text-sm font-medium">{fund.expectedLaunch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Size</p>
                <p className="text-sm font-medium">{fund.targetSize}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 