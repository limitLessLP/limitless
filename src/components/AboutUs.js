import { Users, Target, TrendingUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer/Footer';

export default function AboutUsPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)]"></div>
        </div>
        
        <div className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Reimagining Venture Capital
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Where innovation meets inclusivity, creating unprecedented opportunities for investors and founders alike.
          </p>
          
          <div className="flex justify-center">
            <a href="#vision" className="animate-bounce inline-flex items-center gap-2 mt-8">
              <span>Discover Our Vision</span>
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Vision Section */}
      <section id="vision" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-20">
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium">
              OUR VISION
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Building The Future of Venture Capital</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We&lsquo;re creating a new paradigm where innovative technology meets inclusive access, 
              revolutionizing how venture capital works for everyone involved.
            </p>
          </div>
          
          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Target,
                title: "Democratizing Access",
                description: "Opening the private market to ordinary accredited investors, breaking down barriers that have kept venture capital exclusive for too long.",
                color: "from-blue-500 to-blue-700",
                delay: 0
              },
              {
                icon: Users,
                title: "Community-Powered Returns",
                description: "Building diverse LP bases where investors become customers and advocates, creating a virtuous cycle of growth and opportunity.",
                color: "from-purple-500 to-purple-700",
                delay: 200
              },
              {
                icon: TrendingUp,
                title: "Performance Revolution",
                description: "Delivering access to high-IRR investments with minimized monitoring needs, redefining what's possible in the GP-LP relationship.",
                color: "from-green-500 to-green-700",
                delay: 400
              }
            ].map((pillar, index) => (
              <div 
                key={index}
                className={`transform transition-all duration-1000 delay-${pillar.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="relative h-full backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${pillar.color} bg-opacity-10 mb-6`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                  
                  <p className="text-gray-300">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "40%", label: "Higher Returns" },
              { value: "200+", label: "Accredited Investors" },
              { value: "$45M", label: "Assets Under Management" },
              { value: "24", label: "Portfolio Companies" }
            ].map((stat, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 rounded-xl p-6 transform transition hover:scale-105 duration-300">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Future of Venture Capital?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Discover how our innovative approach to venture capital can transform your investment strategy and open doors to unprecedented opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
              Become an Investor
            </button>
            <button className="px-8 py-3 bg-transparent border border-white/20 rounded-lg text-white font-medium hover:bg-white/5 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}