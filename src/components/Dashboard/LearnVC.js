import { motion } from "framer-motion"
import { BookOpen, TrendingUp, Users } from "lucide-react"

export const LearnVC = () => {
  const topics = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "VC Fundamentals",
      description: "Learn the basics of venture capital investing and fund structures.",
      link: "https://www.investopedia.com/terms/v/venturecapital.asp#:~:text=Venture%20capital%20(VC)%20is%20a,as%20technical%20or%20managerial%20expertise."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Investment Strategy",
      description: "Understand different investment strategies and portfolio management.",
      link: "https://www.deutschewealth.com/en/insights/investing-insights/asset-class-insights/venture-capital-investing-closer-look/what-is-venture-capital-investing.html"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Due Diligence",
      description: "Master the art of evaluating venture capital opportunities.",
      link: "https://hbr.org/2021/03/how-venture-capitalists-make-decisions"
    }
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Learn More About VC</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => window.open(topic.link, "_blank")}
          >
            <div className="text-gray-600 mb-4">{topic.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
            <p className="text-gray-600">{topic.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 