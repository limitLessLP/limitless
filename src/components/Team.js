import jackyPhoto from '../assets/jacky.jpg';
import royPhoto from '../assets/roy.JPG';
import teslaLogo from '../assets/tesla.png';
import stanfordLogo from '../assets/stanford.png';
import uwaterlooLogo from '../assets/uwaterloo.png';
import nfxLogo from '../assets/nfx.png';
import ycLogo from '../assets/yc.png';
import plugAndPlayLogo from '../assets/plugandplay.png';
import { Linkedin } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer/Footer';

export const TeamPage = () => {
  const logos = [
    { src: teslaLogo, alt: 'Tesla', style: 'top-24 left-24' },
    { src: stanfordLogo, alt: 'Stanford', style: 'top-32 right-24' },
    { src: uwaterlooLogo, alt: 'Waterloo', style: 'bottom-24 left-32' },
    { src: nfxLogo, alt: 'NFX', style: 'top-1/2 left-32' },
    { src: ycLogo, alt: 'Y Combinator', style: 'bottom-24 right-24' },
    { src: plugAndPlayLogo, alt: 'Plug and Play', style: 'bottom-1/2 right-24' },
  ];
  

  const backgroundItems = [
    { src: jackyPhoto, alt: 'Jacky BG', style: 'top-10 left-1/3' },
    { src: royPhoto, alt: 'Roy BG', style: 'bottom-10 right-1/4' },
    { src: teslaLogo, alt: 'Tesla BG', style: 'top-1/4 right-1/3' },
    { src: nfxLogo, alt: 'NFX BG', style: 'bottom-1/4 left-1/3' },
  ];

  return (
    <>
      <Navbar/>

      <section className="relative w-full h-screen bg-black text-white overflow-hidden flex items-center justify-center mt-20">
      {/* BACKGROUND Blur Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {backgroundItems.map((item, idx) => (
            <img
              key={idx}
              src={item.src}
              alt={item.alt}
              className={`absolute ${item.style} w-40 h-40 object-contain opacity-25 blur-lg brightness-75`}
            />
          ))}
        </div>

        {/* FOREGROUND Logos */}
        <div className="z-10">
          {logos.map((item, idx) => (
            <img
              key={idx}
              src={item.src}
              alt={item.alt}
              className={`absolute w-24 h-24 object-contain shadow-lg ${item.style}`}
            />
          ))}
        </div>

        {/* Jacky Foreground Photo */}
        <div className="absolute top-1/4 left-1/4 group z-10">
          <img
            src={jackyPhoto}
            alt="Jacky Zhao"
            className="w-36 h-36 rounded-xl object-cover shadow-xl"
          />
          <a
            href="https://linkedin.com/in/jackyzhao"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white rounded-xl transition duration-300"
          >
            <Linkedin className="mx-2" size={16} />
            Connect on LinkedIn
          </a>
        </div>

        {/* Roy Foreground Photo */}
        <div className="absolute bottom-1/4 right-1/4 group z-10">
          <img
            src={royPhoto}
            alt="Roy Luo"
            className="w-36 h-36 rounded-xl object-cover shadow-xl"
          />
          <a
            href="https://linkedin.com/in/royluo"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white rounded-xl transition duration-300"
          >
            <Linkedin className="mx-2" size={16} />
            Connect on LinkedIn
          </a>
        </div>

        {/* Center Quote */}
        <div className="z-10 text-center max-w-2xl px-6 py-2">
          <p className="text-2xl sm:text-3xl font-light mb-6 leading-relaxed">
            We are building a platform that allows retail investors to access the best venture capital funds in the world.
          </p>
        </div>
      </section>

      <section className="snap-start relative z-10">
        <Footer />
      </section>
    </>
  );
};
