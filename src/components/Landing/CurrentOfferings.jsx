import { motion } from "framer-motion"
import { InvestmentSlider } from "./InvestmentSlider"

export const CurrentOfferings = () => {
    return (
          <div className="flex-grow flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl font-extralight mb-8">Current Offerings</h2>
                <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
                  As trusted industry insiders, we work to source these sought-after funds and make them available to
                  eligible individuals and family offices.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <InvestmentSlider />
              </div>
            </div>
          </div>
    )
}