"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { PerformanceSection } from './PerformanceSection';
import { CurrentOfferings } from './CurrentOfferings';
import { Navbar } from "../Navbar"
import Background from './Background';
import { Footer } from '../Footer/Footer';
import { FloatingPaths } from '../Animations/FloatingPaths';

const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isBackgroundRendered, setIsBackgroundRendered] = useState(false);
  // const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsBackgroundRendered(true);
      }, 4000);

      return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-black dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">


      <Navbar section={"hero"} />


      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        <section
          id="hero"
          ref={heroRef}
          className="h-screen snap-start relative flex flex-col"
        >
          <div className="flex-grow flex flex-col items-center">
            <Background />
          </div>
          {/* Sticky transition effect now inside hero section */}
          <div className="sticky bottom-0 bg-black text-black text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isBackgroundRendered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-center mb-4"
            >
              {isBackgroundRendered ? (
                <h2 className="text-4xl md:text-5xl sm:text-2xl my-8 md:my-16 z-10 text-white">
                  Performance is everything.
                </h2>
              ) : (
                <p className="h-40"></p>
              )}
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
          
        <div className={`${currentSection === "hero" ? 'hidden' : ''} z-2000`}>
          <FloatingPaths position={1} />
        </div>

        <section 
          id="offerings" 
          ref={offeringsRef} 
          className="min-h-screen snap-start flex flex-col relative"
        >
          <CurrentOfferings />
        </section>

        <section className="snap-start relative z-10">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;