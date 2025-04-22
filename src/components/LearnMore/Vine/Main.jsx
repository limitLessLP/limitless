"use client"

import { useEffect, useState, useRef } from "react"
import { Vine } from "./vine.tsx"
import React from "react"

export const VinePage = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollDirection, setScrollDirection] = useState("down")
  const lastScrollTop = useRef(0)
  const maxScroll = 5000 // Total scrollable height
  const steps = 7 // Number of content steps

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      // Determine scroll direction
      const direction = position > lastScrollTop.current ? "down" : "up"

      setScrollPosition(position)
      setScrollDirection(direction)
      lastScrollTop.current = position
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate current step based on scroll position
  const currentStep = Math.min(steps, Math.floor((scrollPosition / maxScroll) * steps) + 1)

  // Content for each step
  const stepContent = [
    { title: "Verify Accreditation", content: "Complete our simple verification process to confirm your accredited investor status." },
    { title: "Choose Your Funds", content: "Browse and select from our curated collection of premium VC funds." },
    { title: "Make Your Investment", content: "Invest with as little as $25k and manage your portfolio through our platform." },
    { title: "Monitor Progress", content: "Track your investments and receive regular updates on fund performance." }
  ];

  return (
    <main className="relative min-h-screen bg-[#f0f7e0]">
      <div className="fixed inset-0 flex justify-center">
        <Vine scrollPosition={scrollPosition} scrollDirection={scrollDirection} maxScroll={maxScroll} steps={steps} />
      </div>

      {/* Content sections */}
      <div className="relative z-10">
        {stepContent.map((step, index) => {
          const isEven = index % 2 === 0
          return (
            <div
              key={index}
              className={`min-h-screen flex items-center transition-opacity duration-500 ${
                currentStep > index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="container mx-auto px-4">
                <div
                  className={`${isEven ? "ml-auto mr-10" : "ml-10 mr-auto"} max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg`}
                >
                  <h2 className="text-2xl font-bold text-green-800 mb-3">{step.title}</h2>
                  <p className="text-green-700">{step.content}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: `${maxScroll}px` }} />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-green-800 text-opacity-70 text-sm">
        Scroll to grow the vine and reveal each step
      </div>
    </main>
  )
}
