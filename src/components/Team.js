import jackyPhoto from '../assets/jacky.jpg';
import royPhoto from '../assets/roy.JPG';
import { Linkedin } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer/Footer';

export const TeamPage = () => {
    return (
        <>
        <Navbar />
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
          </div>
          </section>

          <section className="snap-start relative z-10">
            <Footer />
          </section>
        </>
        
    )
    }