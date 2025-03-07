"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import landingBackground from '../../assets/landingBackground.jpg';

const title = "The Future Of Venture Capital";

export default function Background() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false)

    const dataPoints = [15, 25, 20, 35, 30, 45, 55, 50, 70, 90]

    const calculateLinePath = () => {
        const width = 1000
        const height = 400
        const xStep = width / (dataPoints.length - 1)

        return dataPoints
            .map((point, index) => {
                const normalizedY = height - (point / 100) * height
                return `${index === 0 ? "M" : "L"} ${index * xStep} ${normalizedY}`
            })
            .join(" ")
    }

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const [showAxes, setShowAxes] = useState(true);

    useEffect(() => {
        if (!isVisible) {
            setShowAxes(true); 
        }
    }, [isVisible]);

    return (
        <div className="relative w-full h-screen flex flex-col overflow-hidden">
            {/* Mountain background image */}
            <img
                src={landingBackground}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Mountain landscape with trees"
            />

            {/* Overlay with slight transparency */}
            <div className="absolute inset-0 bg-black/40" />

            {/* SVG for the graph */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {showAxes && (
                    <>
                        {/* Y-axis */}
                        <motion.line
                            x1="0%"
                            y1="100%"
                            x2="0%"
                            y2="0%"
                            stroke="white"
                            strokeWidth="2"
                            initial={{ pathLength: 0, strokeOpacity: 1 }}
                            animate={{ pathLength: isVisible ? 1 : 0, strokeOpacity: isVisible ? 1 : 0 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            onAnimationComplete={() => setShowAxes(false)}
                        />

                        {/* X-axis */}
                        <motion.line
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="100%"
                            stroke="white"
                            strokeWidth="2"
                            initial={{ pathLength: 0, strokeOpacity: 1 }}
                            animate={{ pathLength: isVisible ? 1 : 0, strokeOpacity: isVisible ? 1 : 0 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            onAnimationComplete={() => setShowAxes(false)}
                        />
                    </>
                )}

                {/* Graph line */}
                <motion.path
                    d={calculateLinePath()}
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{
                        pathLength: 0,
                        y: 400,
                        x: 0
                    }}
                    animate={{
                        pathLength: isVisible ? 1 : 0,
                        y: 0,
                        x: 0
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeOut",
                        delay: 0.5
                    }}
                />

                {/* Area under the graph */}
                <motion.path
                    d={`${calculateLinePath()} L ${window.innerWidth},400 L 0,400 Z`}
                    fill="url(#areaGradient)"
                    opacity="0.2"
                    initial={{
                        opacity: 0,
                        y: 400,
                        x: 0
                    }}
                    animate={{
                        opacity: isVisible ? 0.2 : 0,
                        y: 0,
                        x: 0
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeOut",
                        delay: 0.5
                    }}
                />

                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Centered text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 3 }}
                >
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 2.2 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 2.4 }}
                    >
                        Access premium VC funds as a new asset class. Limitless combines institutional-grade investments with an intuitive platform.
                    </motion.p>
                    <div className="flex gap-4 justify-center mt-6">
                        <button
                            onClick={() => navigate('/select-type')}
                            className="group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <span className="inline-block px-8 py-3 rounded-[1.15rem] text-sm font-semibold 
                            backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 
                            dark:hover:bg-black/100 text-black dark:text-white transition-all 
                            duration-300 group-hover:-translate-y-0.5">
                                Discover Excellence
                                <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
