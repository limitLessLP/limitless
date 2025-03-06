"use client"

import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { IRRChart } from "../irr-chart"
import { InvestmentSlider } from "../investment-slider"
import { Navbar } from "../Navbar"
import Background from './Background';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isFirstSection, setIsFirstSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsFirstSection(window.scrollY < window.innerHeight * 0.5);
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrolled, setIsFirstSection]);

  useEffect(() => {
    console.log(isFirstSection)
  }, [isFirstSection])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">


      <Navbar 
        scrolled={scrolled} 
        isFirstSection={isFirstSection}
      />

      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {/* Hero Section - Full height */}
        <section className="h-screen snap-start flex items-center relative z-10">
          <Background />
        </section>
        

        {/* Why VC As An Asset Section */}
        <section className="h-[150vh] snap-start flex items-center relative z-10">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-extralight mb-8">Performance is everything.</h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
                Only top-quartile funds consistently outperform public indexes. Identifying and accessing those top managers, therefore, is critical to your success.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <IRRChart />
            </div>
          </div>
        </section>

        {/* Current Offerings Section */}
        <section className="h-[100vh] snap-start flex items-center relative z-10">
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
                As trusted industry insiders, we work to source these sought-after funds and make them available to eligible individuals and family offices.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <InvestmentSlider />
            </div>
          </div>
        </section>

        {/* vision */}
        <footer className="snap-start relative z-10 border-t border-white/10 h-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                © 2024 LimitLess.
              </div>
              <div className="flex gap-6">
              <a href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms</a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy</a>
              <a href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
