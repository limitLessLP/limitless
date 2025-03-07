"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { PerformanceSection } from './PerformanceSection';
import { InvestmentSlider } from "../investment-slider"
import { Navbar } from "../Navbar"
import Background from './Background';

const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState('hero');

  const heroRef = useRef(null);
  const performanceRef = useRef(null);
  const offeringsRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id)
        }
      })
    }, options)

    if (heroRef.current) observer.observe(heroRef.current)
    if (performanceRef.current) observer.observe(performanceRef.current)
    if (offeringsRef.current) observer.observe(offeringsRef.current)
    if (footerRef.current) observer.observe(footerRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (performanceRef.current) observer.unobserve(performanceRef.current)
      if (offeringsRef.current) observer.unobserve(offeringsRef.current)
      if (footerRef.current) observer.unobserve(footerRef.current)
    }
  }, [])


  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">


      <Navbar section={currentSection} />


      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {/* Hero Section - Full height */}
        <section
          id="hero"
          ref={heroRef}
          className="h-screen snap-start relative flex flex-col"
        >
          <div className="flex-grow flex flex-col items-center">
            <Background />
          </div>
          {/* Sticky transition effect now inside hero section */}
          <div className="sticky bottom-0 bg-white text-black text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-4"
            >
              <h2 className="text-5xl fmd:text-2xl my-16">
                Performance is everything
              </h2>
            </motion.div>
          </div>
        </section>

        {/* Performance Section */}
        <section
          id="performanceRef"
          ref={performanceRef}
          className="h-screen snap-start relative z-10"
        >
          <PerformanceSection />
        </section>
        
        {/* Current Offerings Section */}
        <section id="offeringsRef" ref={offeringsRef} className="min-h-screen snap-start flex flex-col relative z-10">
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
        </section>

        {/* vision */}
        <footer
          id="footerRef"
          ref={footerRef}
          className="snap-start relative z-10 border-t border-white/10 h-screen flex items-center"
        >
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
