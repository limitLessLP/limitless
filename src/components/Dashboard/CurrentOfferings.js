import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const CurrentOfferings = () => {
  const navigate = useNavigate()
  
  const offerings = [
    {
      id: 1,
      name: "Tech Growth Fund III",
      firm: "Sequoia Capital",
      target: "$500M",
      focus: "Late Stage Technology",
      deadline: "Aug 30, 2024",
    },
    {
      id: 2,
      name: "Healthcare Innovation Fund",
      firm: "LOLA Capital Partners",
      target: "$5-10M",
      focus: "Digital Health & Biotech",
      deadline: "Sep 15, 2024",
      redirect: "/lola",
    },
    {
      id: 3,
      name: "Climate Tech Fund I",
      firm: "Breakthrough Energy",
      target: "$200M",
      focus: "Clean Energy & Sustainability",
      deadline: "Oct 1, 2024",
    },
  ]

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 ">Current Offerings</h2>
        <button onClick={() => navigate("/offerings")} className="text-gray-500 hover:text-gray-700">View All</button>
      </div>
      <div className="space-y-4">
        {offerings.map((offering, index) => (
          <motion.div
            key={offering.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 ">{offering.firm}</h3>
                <p className="text-sm text-gray-600">{offering.name}</p>
              </div>
              <button className="text-black hover:bg-gray-50 rounded-full p-2 transition-colors">
                <ArrowRight className="h-5 w-5" onClick={() => navigate(offering.redirect)}/>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Target Size</p>
                <p className="text-sm font-medium">{offering.target}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Focus</p>
                <p className="text-sm font-medium">{offering.focus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-sm font-medium">{offering.deadline}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 