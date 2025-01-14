import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight, Shield, Wallet, LineChart, Globe, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 animate-float" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full blur-3xl bg-green-500/10 animate-spin-slow" />
        
        {/* Remove or comment out this grid overlay div */}
        {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" /> */}

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

const MacBookMockup = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative transition-all duration-500 ${isHovered ? 'transform scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Screen */}
      <div className="relative w-[640px] h-[400px] bg-black rounded-lg border-[8px] border-gray-800 overflow-hidden">
        {children}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
      </div>
      
      {/* Base */}
      <div className="relative w-[640px] h-[30px] bg-gray-800 rounded-b-xl">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120px] h-[8px] bg-gray-700 rounded-b-xl" />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
      </div>
    </div>
  );
};

const IPhoneMockup = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative w-72 h-[600px] bg-black rounded-[60px] border-4 border-gray-800 p-4 shadow-2xl transition-transform duration-500 ${
        isHovered ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl" />
      <div className="w-full h-full bg-black rounded-[48px] overflow-hidden">{children}</div>
      
      <div className={`absolute inset-0 rounded-[60px] transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
      </div>
    </div>
  );
};

const DeviceShowcase = () => {
  const [activeDevice, setActiveDevice] = useState('both');
  
  return (
    <div className="relative flex items-center justify-center gap-8">
      <div className={`transition-all duration-500 transform ${
        activeDevice === 'macbook' ? 'scale-110 opacity-100' :
        activeDevice === 'iphone' ? 'scale-90 opacity-50' :
        'scale-100 opacity-100'
      }`}>
        <MacBookMockup>
          <div className="bg-black w-full h-full p-6">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Portfolio Analytics</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-md bg-white/10 text-sm hover:bg-white/20 transition">Daily</button>
                  <button className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-sm">Monthly</button>
                  <button className="px-3 py-1 rounded-md bg-white/10 text-sm hover:bg-white/20 transition">Yearly</button>
                </div>
              </div>
              
              <div className="flex-1 rounded-lg bg-white/5 p-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1/12 h-full flex items-end px-1">
                      <div 
                        className="w-full bg-blue-400/30 rounded-t-sm transition-all duration-1000"
                        style={{
                          height: `${30 + Math.random() * 50}%`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Total Value</div>
                  <div className="text-xl font-medium">$108,432</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Monthly Return</div>
                  <div className="text-xl font-medium text-green-400">+12.4%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Active Funds</div>
                  <div className="text-xl font-medium">8</div>
                </div>
              </div>
            </div>
          </div>
        </MacBookMockup>
      </div>
      
      <div className={`transition-all duration-500 transform ${
        activeDevice === 'iphone' ? 'scale-110 opacity-100' :
        activeDevice === 'macbook' ? 'scale-90 opacity-50' :
        'scale-100 opacity-100'
      }`}>
        <IPhoneMockup>
          <div className="bg-black w-full h-full p-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-sm text-gray-400">Total Portfolio Value</div>
                <div className="text-2xl font-medium">$108,432</div>
                <div className="text-green-400 text-sm">+2.4% today</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Shield size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Sequoia Capital</div>
                      <div className="text-sm text-gray-400">Fund XXIV</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>$42.5K</div>
                    <div className="text-green-400 text-sm">+3.2%</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Wallet size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">Andreessen Horowitz</div>
                      <div className="text-sm text-gray-400">Growth Fund III</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>$38.2K</div>
                    <div className="text-green-400 text-sm">+1.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </IPhoneMockup>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : ''}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-light tracking-wider">LimitLess</div>
          <button className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-light hover:bg-white/20 transition">
            Get Started
          </button>
        </div>
      </nav>

      <header className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-20">
          <h1 className="text-7xl font-extralight mb-8">
            The future of venture<br />capital investment.
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Access premium VC funds as a new asset class. LimitLess combines institutional-grade investments with an intuitive platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="group bg-white text-black px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2">
              Get Started 
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="group border border-white/20 backdrop-blur-sm px-8 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute left-0 right-0 mt-2 backdrop-blur-md bg-black/80 rounded-lg overflow-hidden transition-all duration-300 ${
                  showDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <button 
                  className="w-full px-6 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  onClick={() => navigate('/for-investors')}
                >
                  For Investors
                  <ChevronRight size={14} className="ml-auto" />
                </button>
                <button 
                  className="w-full px-6 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  onClick={() => navigate('/for-vcs')}
                >
                  For VCs
                  <ChevronRight size={14} className="ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <DeviceShowcase />
      </header>

      <section className="relative z-10 py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10"
            >
              <Shield className="w-8 h-8 mb-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-500" />
              <h3 className="text-lg font-medium mb-4">Premium Access</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Break free from traditional structures with our innovative premium carry model.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <Shield className="w-24 h-24 text-white/10" />
              </div>
            </div>
            
            <div 
              className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10"
            >
              <Activity className="w-8 h-8 mb-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-500" />
              <h3 className="text-lg font-medium mb-4">Portfolio Support</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Direct engagement with portfolio companies through our integrated ecosystem.
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <Activity className="w-24 h-24 text-white/10" />
              </div>
            </div>
            
            <div 
              className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10"
            >
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

      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 LimitLess. For accredited investors only.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
