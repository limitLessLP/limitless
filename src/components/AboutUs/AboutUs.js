import { useEffect, useRef } from 'react';
import jackyPhoto from '../../assets/jacky.jpg';
import royPhoto from '../../assets/roy.JPG';
import teslaLogo from '../../assets/tesla.png';
import nvidiaLogo from '../../assets/nvidia.png';
import microsoftLogo from '../../assets/microsoft.png';
import stanfordLogo from '../../assets/stanford.png';
import uwaterlooLogo from '../../assets/uwaterloo.png';
import nfxLogo from '../../assets/nfx.png';
import plugAndPlayLogo from '../../assets/plugandplay.png';
import { Linkedin, Globe, Activity, LineChart } from 'lucide-react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer/Footer';
import { motion } from 'framer-motion';

const logos = [
  stanfordLogo,
  nfxLogo,
  plugAndPlayLogo,
  microsoftLogo,
  teslaLogo,
  uwaterlooLogo,
  nvidiaLogo,
];

const SCROLL_SPEED = 0.8; // pixels per frame

export const AboutUsPage = () => {
  const scrollRef = useRef(null);
  const requestRef = useRef();
  const offset = useRef(0);

  useEffect(() => {
    const step = () => {
      if (scrollRef.current) {
        offset.current -= SCROLL_SPEED;
        const width = scrollRef.current.scrollWidth / 2;
        if (Math.abs(offset.current) >= width) {
          offset.current = 0;
        }
        scrollRef.current.style.transform = `translateX(${offset.current}px)`;
      }
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <>
      <Navbar />

      {/* ABOUT SECTION */}
      <section className="relative z-10 pb-32 px-8 border-t border-white/10">
        <div className="text-center mb-20">
          <div className="mt-32">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
              >
                <h2 className="text-5xl font-extralight mb-8">Our Vision</h2>
                <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
                  Building the future of venture capital investment through innovative technology and inclusive access.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Democratizing Access",
                  description:
                    "Creating a world where access to venture capital is no longer exclusive—publicizing the private market for ordinary accredited investors.",
                  hoverColor: "text-blue-400",
                },
                {
                  icon: Activity,
                  title: "Revolutionizing Returns",
                  description:
                    "Breaking industry norms with higher premium carry and fees, while diversifying LP bases with individuals who become portcos' customers.",
                  hoverColor: "text-purple-400",
                },
                {
                  icon: LineChart,
                  title: "Superior Performance",
                  description:
                    "Providing access to the highest IRR asset class with minimal monitoring, revolutionizing traditional GP-LP relationships.",
                  hoverColor: "text-green-400",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10"
                >
                  <card.icon
                    className={`w-8 h-8 mb-4 text-gray-400 group-hover:${card.hoverColor} transition-colors duration-500`}
                  />
                  <h3 className="text-lg font-medium mb-4">{card.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* TEAM SECTION */}
      <section className="bg-black text-white py-32 px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extralight mb-6">Meet the Founders</h2>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
            Driven by vision. Strong background and experience in leading firms. United in building access to world-class venture capital.
          </p>
        </div>

        {/* Logos carousel */}
<div className="relative w-full overflow-hidden mb-12">
  <div
    ref={scrollRef}
    className="flex gap-6 whitespace-nowrap will-change-transform transition-transform duration-75 ease-linear"
  >
    {[...logos, ...logos].map((logo, i) => (
      <div
        key={i}
        className="p-3 rounded-xl border border-white/10 shadow-md backdrop-blur-sm bg-white/5 flex-shrink-0"
      >
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto opacity-100 transition grayscale hover:grayscale-0"
        />
      </div>
    ))}
  </div>
</div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Jacky */}
          <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl hover:scale-[1.015] transition-transform duration-300">
            <div className="flex flex-col items-center text-center p-8 space-y-4 transition-opacity duration-300 group-hover:opacity-20">
              <img
                src={jackyPhoto}
                alt="Jacky Zhao"
                className="w-60 h-60 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
              />
              <h3 className="text-2xl font-semibold text-white">Jacky Zhao</h3>
              <p className="text-med text-gray-400">Co-founder</p>
              <a
                href="https://www.linkedin.com/in/jacky-p-zhao/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm rounded-full font-medium hover:bg-gray-200 transition"
              >
                <Linkedin size={20} />
                Connect on LinkedIn
              </a>
            </div>

            {/* Hover Description */}
            <div className="absolute inset-0 flex items-center justify-center px-6 z-20 pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                <p className="text-lg text-white/90 font-light leading-relaxed drop-shadow-xl px-6 py-4 rounded-2xl">
                  Jacky specializes in operations and investor relations, drawing from experiences at Stanford, NFX, and Plug and Play.
                </p>
              </div>
            </div>
          </div>

          {/* Roy */}
          <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl hover:scale-[1.015] transition-transform duration-300">
            <div className="flex flex-col items-center text-center p-8 space-y-4 transition-opacity duration-300 group-hover:opacity-20">
              <img
                src={royPhoto}
                alt="Roy Luo"
                className="w-60 h-60 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
              />
              <h3 className="text-2xl font-semibold text-white">Roy Luo</h3>
              <p className="text-med text-gray-400">Co-founder</p>
              <a
                href="https://www.linkedin.com/in/ee-royluo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm rounded-full font-medium hover:bg-gray-200 transition"
              >
                <Linkedin size={20} />
                Connect on LinkedIn
              </a>
            </div>

            {/* Hover Description */}
            <div className="absolute inset-0 flex items-center justify-center px-6 z-20 pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                <p className="text-lg text-white/90 font-light leading-relaxed drop-shadow-xl px-6 py-4 rounded-2xl">
                  Roy leads the product and technical vision, with a background at Tesla and Waterloo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="relative z-10">
        <Footer />
      </section>
    </>
  );
};
