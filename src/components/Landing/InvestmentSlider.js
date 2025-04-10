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
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm shadow-lg" style={{ height: '400px' }}>
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2">
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
          className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full h-full items-center justify-center text-center pt-12 pb-4">
            <div className="md:w-1/2 flex flex-col gap-4 text-white min-w-0">
              <h3 className="text-2xl md:text-4xl font-light break-words">
                {currentInvestment.title}
              </h3>
              <p className="font-light text-lg md:text-xl break-words">
                {currentInvestment.description}
              </p>
            </div>
            <div className="md:w-1/2 flex flex-col gap-4 text-white min-w-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm">Target</p>
                <p className="text-xl md:text-2xl font-medium">{currentInvestment.stats.target}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Target IRR</p>
                <p className="text-xl md:text-2xl font-medium">{currentInvestment.stats.irr}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Vintage</p>
                <p className="text-xl md:text-2xl font-medium">{currentInvestment.stats.vintage}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}