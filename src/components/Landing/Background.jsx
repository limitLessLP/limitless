"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const title = "The Future Of Venture Capital";

// eslint-disable-next-line react/display-name
const Background = React.memo(() => {
    const navigate = useNavigate();

    const handleNavigate = useCallback(() => {
        navigate('/select-type?for=waitlist');
    }, [navigate]);

    return (
        <div className="relative w-full h-screen flex flex-col overflow-hidden">
            {/* Background GIF */}
            <img
                src="/home.gif"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Background animation"
            />

            {/* Overlay with slight transparency */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Centered text */}
            <div className="absolute inset-0 flex items-center justify-center -mt-20 md:-mt-32">
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
                            onClick={handleNavigate}
                            className="group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <span className="inline-block px-8 py-3 rounded-[1.15rem] text-sm font-semibold 
                            backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 
                            dark:hover:bg-black/100 text-black dark:text-white transition-all 
                            duration-300 group-hover:-translate-y-0.5">
                                Join Waitlist
                                <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
});

export default Background;