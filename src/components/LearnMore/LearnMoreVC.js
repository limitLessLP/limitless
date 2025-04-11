import React, { useState, useEffect, useRef } from 'react';
import { Globe, Activity, Users } from 'lucide-react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer/Footer';

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

const MarketCard = ({ title, value, subtitle, delay = 0 }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
  <div 
    className="group bg-white/5 backdrop-blur-lg rounded-lg p-4 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h1 className="text-2xl mb-2">{title}</h1>
    <div className={`${isMobile ? "text-4xl" : "text-6xl"} text-green-900 mb-2`}>
      {typeof value === 'number' ? <NumberCounter end={value} /> : value}
    </div>
    <p className="text-black">{subtitle}</p>
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
  </div>
)};

const FeatureCard = ({ icon: Icon, title, description }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-500 hover:scale-105 overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-8 h-8 text-green-900 group-hover:scale-110 transition-transform" />
          <h3 className={`${isMobile ? "text-l" : "text-xl"} font-medium`}>{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-green-500/10 to-green-700/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:translate-x-2">
        <Icon className="w-full h-full text-white/10" />
      </div>
    </div>
  );
};

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
        className="h-full bg-gradient-to-r from-green-500 to-green-700"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const LearnMorePage = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll bg-white text-black relative">
      <ScrollProgress />
      <header className={`relative z-10 ${isMobile ? "" : "pt-32"} snap-start text-center py-4`}>
        <Navbar section="learn-more-vc" />
        <h1 className="text-7xl font-extralight text-green-900 mb-6 bg-gradient-to-r from-black to-gray-400 bg-clip-text text-transparent">
          Partner With Limitless
        </h1>
        <p className="text-xl text-black max-w-2xl mx-auto mb-4 leading-relaxed">
          Join our network of premium VC funds and access a broader pool of <strong>qualified investors</strong> through our innovative platform.
        </p>
      </header>

      <section className="relative z-10 pt-8 pb-4  border-t border-black/10 snap-start">
        <div className="container mx-auto px-4">
            <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} tracking-tight`}>Partnership Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
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

        <section className="relative z-10 pt-8 pb-4 border-t border-black/10 snap-start">
          <div className="container mx-auto px-4">
            <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} tracking-tight my-1`}>Why Partner With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <FeatureCard
                icon={Users}
                title="Investor Access"
                description="Connect with our network of qualified, accredited investors actively seeking VC opportunities."
              />
              <FeatureCard
                icon={Activity}
                title="Streamline Value"
                description="Highlight the value LPs can deliver after investment, fostering growth and collaboration."
              />
              <FeatureCard
                icon={Globe}
                title="Wider Reach"
                description="Expand beyond institutional LPs to include domain experts, operators, and engineers."
              />
            </div>
          </div>
        </section>

      <section className="snap-start relative z-10">
          <Footer />
        </section>
    </div>
  );
};