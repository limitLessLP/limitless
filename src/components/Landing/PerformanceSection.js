"use client"

import { motion } from "framer-motion"
import { IRRChart } from "./IRRChart"

export function PerformanceSection() {
  return (
    <div className="w-full pt-40 bg-black z-20 text-white">
      <div className="container mx-auto relative z-30">
        <div className="max-w-4xl mx-auto z-20">
          <IRRChart /> {/* Adjust the height as needed */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center pt-10"
        >
          <p className="text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Only top-quartile funds consistently outperform public indexes. Identifying and accessing those top
            managers, therefore, is critical to your success.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
