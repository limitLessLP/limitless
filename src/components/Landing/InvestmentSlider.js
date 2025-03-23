"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const investments = [
  {
    id: 1,
    title: "Early Stage Fund I",
    description: "A diversified portfolio of early-stage technology companies focused on AI, blockchain, and enterprise software.",
    stats: {
      target: "$50M",
      irr: "25%",
      vintage: "2024",
    },
    image: "/fund1.jpg",
  },
  {
    id: 2,
    title: "Growth Fund III",
    description: "Investing in high-growth technology companies at Series B and beyond, with a focus on fintech and healthcare.",
    stats: {
      target: "$100M",
      irr: "20%",
      vintage: "2024",
    },
    image: "/fund2.jpg",
  },
  {
    id: 3,
    title: "Seed Fund II",
    description: "Supporting exceptional founders at the earliest stages of company building across emerging technology sectors.",
    stats: {
      target: "$25M",
      irr: "30%",
      vintage: "2024",
    },
    image: "/fund3.jpg",
  },
]

export function InvestmentSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const currentInvestment = investments[currentIndex]

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + investments.length) % investments.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 3000) // Increased interval duration to 8000ms (8 seconds)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm shadow-lg" style={{ height: '400px' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
          className="absolute inset-0 p-16 shadow-lg"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-light mb-4">Early Stage Fund</h3>
              <p className="text-lg font-medium">{currentInvestment.title}</p>
            </div>
           

            <div className="md:col-span-1">
              <p className="text-gray-400 font-light mb-8">{currentInvestment.description}</p>
              <div className="flex gap-4">
                <button className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                  Learn More
                </button>
                <button className="px-6 py-2 bg-green-700 rounded-lg hover:bg-green-800 transition-colors text-white hover:text-white/80">
                  Invest Now
                </button>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <p className="text-xs text-gray-400">Target</p>
                <p className="text-lg font-medium">{currentInvestment.stats.target}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Target IRR</p>
                <p className="text-lg font-medium">{currentInvestment.stats.irr}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Vintage</p>
                <p className="text-lg font-medium">{currentInvestment.stats.vintage}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8 gap-2">
        {investments.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}