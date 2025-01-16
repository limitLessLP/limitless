import React, { useState, useEffect } from 'react';
import { Smartphone, Apple, Mail, Send, Phone, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 animate-float" />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 container mx-auto px-4 pt-32 transition-all duration-1000 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-8xl font-extralight mb-8 bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-2xl text-gray-400 mb-16 font-light max-w-3xl mx-auto">
            Join the future of venture capital investment
          </p>
        </div>

        {/* Download Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* iOS Download */}
            <button className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 
              hover:scale-105 hover:bg-white/10 flex items-center justify-center gap-4">
              <Apple size={32} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="text-left">
                <div className="text-sm text-gray-400">Download for</div>
                <div className="text-lg font-medium">iOS & iPadOS</div>
              </div>
              <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Android Download */}
            <button className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 
              hover:scale-105 hover:bg-white/10 flex items-center justify-center gap-4">
              <Smartphone size={32} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="text-left">
                <div className="text-sm text-gray-400">Get it on</div>
                <div className="text-lg font-medium">Google Play</div>
              </div>
              <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl p-12 mb-32">
          <h2 className="text-3xl font-light mb-8 text-center">Stay Updated</h2>
          
          {notification && (
            <Alert className="mb-6 bg-white/10 border-blue-500/50">
              <AlertDescription className="text-gray-300">
                {notification}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-500
                    focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="group relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-500
                    focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="group relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-gray-500
                  focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <div className="group relative">
              <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number (optional)"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-gray-500
                  focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full group bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-6 py-4 text-white font-medium
                hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Subscribe to Updates
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;