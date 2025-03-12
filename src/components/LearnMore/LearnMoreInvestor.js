import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2,
  PieChart,
  DollarSign,
  Timer,
  TrendingUp,
  Target,
  Users,
  MessageSquare
} from 'lucide-react';


const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm your LimitLess AI assistant. I'm here to help you understand venture capital investment. What would you like to learn about?",
      options: ['What is VC?', 'How to Invest', 'Risks & Returns', 'Qualification Check']
    }
  ]);


  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, { type: 'user', content: option }]);
    setTyping(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant specializing in venture capital investment education. Keep responses concise and focused on VC topics."
            },
            {
              role: "user",
              content: option
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.choices[0].message.content,
        options: ['Ask another question', 'Start Investment Process', 'Talk to a Human']
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        options: ['Ask another question', 'Start Investment Process', 'Talk to a Human']
      }]);
    }
    
    setTyping(false);
  };

  return (
    <div className={`fixed bottom-8 right-8 w-96 bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="font-medium">LimitLess Assistant</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">×</button>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4" ref={chatRef}>
        {messages.map((message, i) => (
          <div key={i} className={`${message.type === 'user' ? 'ml-auto' : ''}`}>
            <div className={`rounded-lg p-3 max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-500 ml-auto' 
                : 'bg-white/10'
            }`}>
              {message.content}
            </div>
            
            {message.options && (
              <div className="mt-2 space-y-2">
                {message.options.map((option, j) => (
                  <button
                    key={j}
                    onClick={() => handleOptionClick(option)}
                    className="block w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {typing && (
          <div className="flex gap-2 text-gray-400">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-full h-full">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 animate-float" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full blur-3xl bg-green-500/10 animate-spin-slow" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />
      </div>

      {Array(50).fill(null).map((_, i) => (
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

const StatsCard = ({ icon: Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-light mb-1">{value}</div>
          <div className="text-gray-400 text-sm">{label}</div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 transition-all duration-500 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className="mb-6">
          <Icon className={`w-8 h-8 text-blue-400 transition-all duration-500 ${
            isHovered ? 'scale-110' : ''
          }`} />
        </div>
        <h3 className="text-xl font-medium mb-4">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

const ProcessStep = ({ icon: Icon, title, description, step }) => (
  <div className="relative group">
    <div className="absolute left-0 w-16 h-16 rounded-full bg-white/5 backdrop-blur-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
      <Icon className="w-8 h-8 text-blue-400" />
    </div>
    
    <div className="ml-24">
      <div className="text-sm text-blue-400 mb-2">Step {step}</div>
      <h3 className="text-xl font-light mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const InvestorEducationPage = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />

      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'py-6'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-light tracking-wider">LimitLess</div>
          <button 
            onClick={() => setShowAssistant(true)}
            className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Get Help
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-20">
            <h1 className="text-6xl font-extralight mb-6">
              Your Journey into<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Venture Capital
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Learn how to invest in premium VC funds and become part of the next generation of technology innovation.
            </p>
          </header>

          <section className="mb-20">
            <h2 className="text-3xl font-light mb-10">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                icon={Target}
                value="$590Bn"
                label="Total Addressable Market"
                delay={0}
              />
              <StatsCard
                icon={Users}
                value="900,000+"
                label="Accredited Investors"
                delay={200}
              />
              <StatsCard
                icon={TrendingUp}
                value="25.3%"
                label="Average Annual Return"
                delay={400}
              />
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-light mb-10">Investment Process</h2>
            <div className="space-y-16">
              <ProcessStep
                icon={CheckCircle2}
                step={1}
                title="Verify Accreditation"
                description="Complete our simple verification process to confirm your accredited investor status."
              />
              <ProcessStep
                icon={PieChart}
                step={2}
                title="Choose Your Funds"
                description="Browse and select from our curated collection of premium VC funds."
              />
              <ProcessStep
                icon={DollarSign}
                step={3}
                title="Make Your Investment"
                description="Invest with as little as $25k and manage your portfolio through our platform."
              />
              <ProcessStep
                icon={Timer}
                step={4}
                title="Monitor Progress"
                description="Track your investments and receive regular updates on fund performance."
              />
            </div>
          </section>
        </div>
      </main>

      <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} />
    </div>
  );
};

export default InvestorEducationPage;