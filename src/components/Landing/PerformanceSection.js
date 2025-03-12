"use client"

import { motion } from "framer-motion"
import { IRRChart } from "./IRRChart"

export function PerformanceSection() {
  return (
    <div className="w-full pt-40 bg-white z-1000">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <IRRChart /> {/* Adjust the height as needed */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center pt-10"
        >
          <p className="text-xl text-black font-light leading-relaxed max-w-3xl mx-auto">
            Only top-quartile funds consistently outperform public indexes. Identifying and accessing those top
            managers, therefore, is critical to your success.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
