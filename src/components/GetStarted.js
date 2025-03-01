import React, { useState, useEffect } from 'react';
import { Smartphone, Apple, Mail, Send, Phone, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { motion } from 'framer-motion';
import { FloatingPaths } from './FloatingPaths';

const GetStartedPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notification, setNotification] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !phone) {
      setNotification('Please provide either email or phone number');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          createdAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setNotification('Thanks for signing up! We\'ll keep you updated.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      setNotification(`Failed to subscribe: ${error.message}`);
      console.error('Subscription error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className={`relative z-10 container mx-auto px-4 pt-32 transition-all duration-1000 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl font-extralight mb-8">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              Get Started
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Join the future of venture capital investment
          </p>
        </motion.div>

        {/* Download Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* iOS Download */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 
                p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="flex items-center gap-4 px-8 py-6 rounded-[1.15rem] backdrop-blur-md 
                bg-white/95 dark:bg-black/95 text-black dark:text-white transition-all duration-300">
                <Apple size={32} className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <div className="text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Download for</div>
                  <div className="text-lg font-medium">iOS & iPadOS</div>
                </div>
                <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {/* Android Download - Similar styling to iOS */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 
                p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="flex items-center gap-4 px-8 py-6 rounded-[1.15rem] backdrop-blur-md 
                bg-white/95 dark:bg-black/95 text-black dark:text-white transition-all duration-300">
                <Smartphone size={32} className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <div className="text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Get it on</div>
                  <div className="text-lg font-medium">Google Play</div>
                </div>
                <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto relative bg-gradient-to-b from-black/10 to-white/10 
            dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg mb-32"
        >
          <div className="backdrop-blur-md bg-white/95 dark:bg-black/95 rounded-[1.15rem] p-12">
            <h2 className="text-3xl font-light mb-8 text-center">Stay Updated</h2>
            
            {notification && (
              <Alert className="mb-6 bg-black/5 dark:bg-white/5 border-blue-500/50">
                <AlertDescription className="text-gray-600 dark:text-gray-300">
                  {notification}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Name inputs with updated styling */}
                <div className="group relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                      rounded-xl px-4 py-4 text-black dark:text-white placeholder:text-gray-500
                      focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                {/* Last name input - similar styling */}
                <div className="group relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                      rounded-xl px-4 py-4 text-black dark:text-white placeholder:text-gray-500
                      focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Email and Phone inputs with updated styling */}
              <div className="group relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                    rounded-xl px-12 py-4 text-black dark:text-white placeholder:text-gray-500
                    focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="group relative">
                <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number (optional)"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                    rounded-xl px-12 py-4 text-black dark:text-white placeholder:text-gray-500
                    focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="w-full group relative bg-gradient-to-b from-black/10 to-white/10 
                  dark:from-white/10 dark:to-black/10 p-px rounded-xl backdrop-blur-lg 
                  overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <span className="flex items-center justify-center gap-2 px-6 py-4 rounded-[0.95rem] 
                  backdrop-blur-md bg-white/95 dark:bg-black/95 text-black dark:text-white 
                  transition-all duration-300 font-medium">
                  Subscribe to Updates
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStartedPage;