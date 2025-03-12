import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Globe, Activity, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlowingButton = ({ children, className = "" }) => (
  <button 
    className={`group relative px-8 py-3 bg-transparent overflow-hidden rounded-lg ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
    <div className="relative z-10 flex items-center gap-2">
      {children}
    </div>
  </button>
);

const AnimatedBackground = () => {
  const particles = Array(30).fill(null);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-full">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 animate-float" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full blur-3xl bg-green-500/10 animate-spin-slow" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />
        
        {/* Floating particles */}
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ParallaxSection = ({ children, className = "" }) => {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      setOffset(window.scrollY - top);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      <div style={{ transform: `translateY(${offset * 0.3}px)` }}>
        {children}
      </div>
    </div>
  );
};

const NumberCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = end / (duration / 16);
          const handle = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(handle);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

const MarketCard = ({ title, value, subtitle, delay = 0 }) => (
  <div 
    className="group bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-2xl font-light mb-2">{title}</h3>
    <div className="text-4xl font-light text-blue-400 mb-2">
      {typeof value === 'number' ? <NumberCounter end={value} /> : value}
    </div>
    <p className="text-gray-400">{subtitle}</p>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 overflow-hidden">
    <div className="relative z-10">
      <div className="mb-6">
        <Icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
    
    {/* Background decoration */}
    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:translate-x-2">
      <Icon className="w-full h-full text-white/10" />
    </div>
  </div>
);

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const LearnMorePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'py-6'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-xl font-light tracking-wider hover:text-blue-400 transition-colors"
          >
            ← Back to Home
          </button>
          <GlowingButton className="text-sm font-medium">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </GlowingButton>
        </div>
      </nav>

      <ParallaxSection className="pt-32 pb-20 text-center">
        <header className="relative z-10">
          <h1 className="text-7xl font-extralight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Partner With<br />LimitLess
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Join our network of premium VC funds and access a broader pool of qualified investors through our innovative platform.
          </p>
        </header>
      </ParallaxSection>

      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light mb-16 tracking-tight">Partnership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MarketCard
              title="Network Growth"
              value="10x"
              subtitle="Expand your investor reach"
              delay={0}
            />
            <MarketCard
              title="Average Fund Size"
              value="$50M+"
              subtitle="Typical partner fund size"
              delay={200}
            />
            <MarketCard
              title="Time Saved"
              value="40%"
              subtitle="In investor relations"
              delay={400}
            />
          </div>
        </div>
      </section>

      <ParallaxSection className="border-t border-white/10">
        <section className="relative z-10 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-light mb-16 tracking-tight">Why Partner With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Users}
                title="Investor Access"
                description="Connect with our network of qualified, accredited investors actively seeking VC opportunities."
              />
              <FeatureCard
                icon={Activity}
                title="Streamlined Process"
                description="Efficient investor onboarding and management through our advanced platform."
              />
              <FeatureCard
                icon={Globe}
                title="Global Reach"
                description="Expand your fund's presence beyond traditional geographic boundaries."
              />
            </div>
          </div>
        </section>
      </ParallaxSection>

      <section className="relative z-10 py-24 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light mb-16 tracking-tight">For Investors</h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 md:p-12 hover:bg-white/10 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-light">Ideal Profile</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>$200k+ Individual Income</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>$300k+ Household Income</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>$1M+ in Assets</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-light">Benefits</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>Direct Access to Premium VC Funds</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>Portfolio Company Support Options</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    <span>Institutional-Grade Analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 LimitLess. All rights reserved.
            </div>
            <div className="flex gap-6">
            <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMorePage;