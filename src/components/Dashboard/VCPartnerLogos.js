import { motion } from "framer-motion"

export const VCPartnerLogos = () => {
  const logos = [
    { id: 1, name: "Sequoia", src: "/vc-logos/sequoia.png" },
    { id: 2, name: "Andreessen", src: "/vc-logos/andreessen.png" },
    { id: 3, name: "Accel", src: "/vc-logos/accel.png" },
    { id: 4, name: "Benchmark", src: "/vc-logos/benchmark.png" },
  ]

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured VC Partners</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {logos.map((logo, index) => (
          <motion.div
            key={logo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-center p-4 bg-gray-50 rounded-lg"
          >
            <img
              src={logo.src}
              alt={`${logo.name} logo`}
              className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 