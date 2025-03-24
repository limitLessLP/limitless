"use client"

import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, LineChart, Globe, Activity, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jackyPhoto from '../assets/jacky.jpg';
import royPhoto from '../assets/roy.JPG';
import { motion } from "framer-motion";
import { IRRChart } from "./irr-chart"
import { InvestmentSlider } from "./investment-slider"
import Navbar from "./Navbar"

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const title = "The Future Of Venture Capital";
  const words = title.split(" ");

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <Navbar scrolled={scrolled} />

      <div className="flex items-center justify-center min-h-screen">
        <header className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-7xl font-extralight mb-8">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                               bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                               dark:from-white dark:to-white/80"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Robinhood for VC. Access premium VC funds as a new asset class. Limitless combines institutional-grade investments with an intuitive platform.
            </p>
            <div className="flex gap-4 justify-center">
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
          </div>
        </header>
      </div>

      <section className="relative z-10 py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10">
              <Shield className="w-8 h-8 mb-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-500" />
              <h3 className="text-lg font-medium mb-4">Premium Access</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Break free from traditional structures with our innovative premium carry model.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <Shield className="w-24 h-24 text-white/10" />
              </div>
            </div>
            
            <div className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10">
              <Activity className="w-8 h-8 mb-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-500" />
              <h3 className="text-lg font-medium mb-4">Portfolio Support</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Direct engagement with portfolio companies through our integrated ecosystem.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <Activity className="w-24 h-24 text-white/10" />
              </div>
            </div>
            
            <div className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10">
              <LineChart className="w-8 h-8 mb-4 text-gray-400 group-hover:text-green-400 transition-colors duration-500" />
              <h3 className="text-lg font-medium mb-4">Superior Returns</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Access the highest IRR asset class with institutional-grade monitoring.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <LineChart className="w-24 h-24 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight mb-8">Our Team</h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              We&apos;re building a more inclusive startup ecosystem by democratizing access to venture capital investments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Team cards */}
            {[
              {
                name: "Jacky Zhao",
                role: "Co-Founder",
                education: "Stanford Econ + BioE",
                experience: "Previously @ NFX Capital (VC), Bregal Sagemount, YC-Healthtech",
                linkedin: "jackyzhao",
                photo: jackyPhoto
              },
              {
                name: "Roy Luo",
                role: "Co-Founder",
                education: "UWaterloo ECE",
                experience: "Previously @ Tesla, AES (Cambridge-based biotech), Lead SWE @ PropTech",
                linkedin: "royluo",
                photo: royPhoto
              }
            ].map((member) => (
              <div key={member.name} className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 relative overflow-hidden">
                <div className="flex items-start gap-8">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-light mb-2">{member.name}</h3>
                    <p className="text-blue-400 mb-4">{member.role}</p>
                    <p className="text-gray-400 font-light mb-2">{member.education}</p>
                    <p className="text-gray-400 font-light mb-4">{member.experience}</p>
                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin size={16} />
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Vision Cards */}
          <div className="mt-32">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-extralight mb-8">Our Vision</h2>
              <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                Building the future of venture capital investment through innovative technology and inclusive access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Democratizing Access",
                  description: "Creating a world where access to venture capital is no longer exclusive—publicizing the private market for ordinary accredited investors.",
                  hoverColor: "text-blue-400"
                },
                {
                  icon: Activity,
                  title: "Revolutionizing Returns",
                  description: "Breaking industry norms with higher premium carry and fees, while diversifying LP bases with individuals who become portcos' customers.",
                  hoverColor: "text-purple-400"
                },
                {
                  icon: LineChart,
                  title: "Superior Performance",
                  description: "Providing access to the highest IRR asset class with minimal monitoring, revolutionizing traditional GP-LP relationships.",
                  hoverColor: "text-green-400"
                }
              ].map((card) => (
                <div key={card.title} className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                  <card.icon className={`w-8 h-8 mb-4 text-gray-400 group-hover:${card.hoverColor} transition-colors duration-500`} />
                  <h3 className="text-lg font-medium mb-4">{card.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why VC As An Asset Section */}
      <section className="min-h-screen flex items-center relative z-10 py-24">
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
      <section className="min-h-screen flex items-center relative z-10 py-24">
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

      {/* Vision Section - Keep but simplified */}
      <section className="min-h-screen flex items-center relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extralight mb-8">Our Vision</h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
              Building the future of venture capital investment through innovative technology and inclusive access.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 Limitless.
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
  );
};

export default LandingPage;
