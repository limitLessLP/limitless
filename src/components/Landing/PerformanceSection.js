"use client"

import { motion } from "framer-motion"
import { IRRChart } from "./IRRChart"

export function PerformanceSection() {
  return (
    <div className="w-full pt-60 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
            Only top-quartile funds consistently outperform public indexes. Identifying and accessing those top
            managers, therefore, is critical to your success.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <IRRChart />
        </div>
      </div>
    </div>
  )
}

