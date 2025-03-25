import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

export const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "Venture Capital Trends in 2024: What Limited Partners Need to Know",
      source: "Limitless Insights",
      date: "2 hours ago",
      link: "#",
    },
    {
      id: 2,
      title: "Understanding the Impact of AI on Venture Capital Investment Strategies",
      source: "VC Journal",
      date: "1 day ago",
      link: "#",
    },
    {
      id: 3,
      title: "ESG Considerations in Modern Venture Capital",
      source: "Sustainable Investing Today",
      date: "2 days ago",
      link: "#",
    },
  ]

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 ">Latest News & Insights</h2>
        <button className="text-gray-500 hover:text-gray-700">View All</button>
      </div>
      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.a
            key={item.id}
            href={item.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 ">{item.title}</h3>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.source}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{item.date}</span>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
} 