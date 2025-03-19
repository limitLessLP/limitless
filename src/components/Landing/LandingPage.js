"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { PerformanceSection } from './PerformanceSection';
import { CurrentOfferings } from './CurrentOfferings';
import { Navbar } from "../Navbar"
import Background from './Background';
import { Footer } from '../Footer/Footer';

const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState('hero');

  const heroRef = useRef(null);
  const performanceRef = useRef(null);
  const offeringsRef = useRef(null);

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

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (performanceRef.current) observer.unobserve(performanceRef.current)
      if (offeringsRef.current) observer.unobserve(offeringsRef.current)
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
              <h2 className="text-5xl fmd:text-2xl my-16 z-10">
                Performance is everything.
              </h2>
            </motion.div>
          </div>
        </section>

        <section
          id="performanceRef"
          ref={performanceRef}
          className="min-h-screen snap-start relative z-1000"
        >
          <PerformanceSection />
        </section>
          
          {/* Current Offerings Section */}
        <section id="offeringsRef" ref={offeringsRef} className="min-h-screen snap-start flex flex-col relative z-10">
          <CurrentOfferings />
        </section>

        <section className="h-screen snap-start relative z-10">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
