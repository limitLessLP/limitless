import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2,
  PieChart,
  DollarSign,
  Timer,
  TrendingUp,
  Target,
  Users,
  // MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer/Footer';

// const AIAssistant = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([
//     {
//       type: 'bot',
//       content: "Hi! I'm your LimitLess AI assistant. I'm here to help you understand venture capital investment. What would you like to learn about?",
//       options: ['What is VC?', 'How to Invest', 'Risks & Returns', 'Qualification Check']
//     }
//   ]);

//   const [typing, setTyping] = useState(false);
//   const chatRef = useRef(null);

//   const handleOptionClick = async (option) => {
//     setMessages(prev => [...prev, { type: 'user', content: option }]);
//     setTyping(true);

//     try {
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo",
//           messages: [
//             { role: "system", content: "You are a helpful assistant specializing in venture capital investment education. Keep responses concise and focused on VC topics." },
//             { role: "user", content: option }
//           ],
//           temperature: 0.7,
//           max_tokens: 200
//         })
//       });
//       const data = await response.json();
      
//       setMessages(prev => [...prev, {
//         type: 'bot',
//         content: data.choices[0].message.content,
//         options: ['Ask another question', 'Start Investment Process', 'Talk to a Human']
//       }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         type: 'bot',
//         content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
//         options: ['Ask another question', 'Start Investment Process', 'Talk to a Human']
//       }]);
//     }
    
//     setTyping(false);
//   };

//   return (
//     <div 
//       className={`fixed bottom-8 right-8 w-96 bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl transition-all duration-500 transform 
//       ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
//     >
//       <div className="p-4 border-b border-white/10 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <MessageSquare className="w-5 h-5 text-blue-400" />
//           <span className="font-medium">LimitLess Assistant</span>
//         </div>
//         <button onClick={onClose} className="text-gray-400 hover:text-white transition">×</button>
//       </div>
      
//       <div className="h-96 overflow-y-auto p-4 space-y-4" ref={chatRef}>
//         {messages.map((message, i) => (
//           <div key={i} className={`${message.type === 'user' ? 'ml-auto' : ''}`}>
//             <div className={`rounded-lg p-3 max-w-[80%] ${
//               message.type === 'user' 
//                 ? 'bg-blue-500 ml-auto'
//                 : 'bg-white/10'
//             }`}>
//               {message.content}
//             </div>
            
//             {message.options && (
//               <div className="mt-2 space-y-2">
//                 {message.options.map((option, j) => (
//                   <button
//                     key={j}
//                     onClick={() => handleOptionClick(option)}
//                     className="block w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
        
//         {typing && (
//           <div className="flex gap-2 text-gray-400">
//             <span className="animate-bounce">●</span>
//             <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
//             <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const StatsCard = ({ icon: Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
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
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <Icon className="w-6 h-6 text-green-900" />
        </div>
        <div>
          <div className="text-4xl text-black mb-1">{value}</div>
          <div className="text-black text-xl">{label}</div>
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ icon: Icon, title, description, step }) => (
  <div className="relative group snap-start">
    <div className="absolute left-0 w-16 h-16 rounded-full bg-white/5 backdrop-blur-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
      <Icon className="w-8 h-8 text-green-900" />
    </div>
    <div className="ml-24">
      <div className="text-sm text-green-900 mb-2">Step {step}</div>
      <h3 className="text-xl font-light text-green-900 mb-3">{title}</h3>
      <p className="text-black">{description}</p>
    </div>
  </div>
);

export const InvestorEducationPage = () => {
  // const [showAssistant, setShowAssistant] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll bg-white text-black">
      <main className={`relative pb-20 snap-start ${isMobile ? "" : "pt-32"}`}>
        <Navbar />
        <div className="container mx-auto px-4">
          <section className="mb-20 snap-y snap-start mt-10 text-center">
            <h1 className="text-6xl font-extralight text-green-900 mb-6">
              Your Journey into{' '}
              <strong className="bg-gradient-to-r from-green-900 to-green-900 bg-clip-text text-transparent">
                Venture Capital
              </strong>
            </h1>
            <p className="text-4xl text-black max-w-2xl mx-auto">
              To Consumers: The <strong>first</strong> marketplace to offer access to established VC funds
            </p>
          </section>

          <section className="mb-20 snap-y snap-start mt-10">
            <h2 className="text-3xl text-green-900 my-5">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <StatsCard
              icon={TrendingUp}
              value="25.3%"
              label="Avg. Annual Returns from VC Investments"
              delay={400}
            />
            <StatsCard
              icon={Target}
              value="55%"
              label="Nasdaq Success Stories Funded by VC"
              delay={0}
            />
            <StatsCard
              icon={Users}
              value="70%"
              label="Unicorn Companies Backed by VC Funds"
              delay={200}
            />
            </div>
          </section>

          <section className="my-10 snap-y snap-start">
            <h2 className="text-3xl text-green-900 mb-5">Investment Process</h2>
            <div className={`${isMobile ? "space-y-4" : "space-y-16"} bg-white text-black`}>
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

      {/* <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} /> */}

      <section className="relative z-10 py-4 snap-start">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl mb-4 tracking-tight text-green-900">Investors</h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 md:p-12 hover:bg-white/10 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
              < h2 className="text-4xl mb-4 tracking-tight">Ideal Profile</h2>
                <ul className="space-y-4 text-black text-3xl">
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>$200k+ Individual Income</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>$300k+ Household Income</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>$1M+ in Assets</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2 snap-start">
                <h2 className={`text-4xl ${isMobile ? "my-4" : "mb-4"} tracking-tight`}>Benefits</h2>
                <ul className="space-y-4 text-black text-3xl">
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>Direct Access to Premium VC Funds</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>Portfolio Company Support Options</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <ArrowRight className="text-green-900 group-hover:translate-x-1 transition-transform" />
                    <span>Institutional-Grade Analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      <section className="snap-start relative z-10">
          <Footer />
        </section>
    </div>
  );
};