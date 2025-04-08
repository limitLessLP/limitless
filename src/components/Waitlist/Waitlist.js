import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import introVideo from '../../assets/waitlistEnding.mp4';
import endPage from '../../assets/endPage.gif';

export const Waitlist = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  const handleReturnHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const onEnded = () => {
        setFadeOut(true);
        setTimeout(() => {
          setVideoEnded(true);
        }, 800);
      };
      video.addEventListener('ended', onEnded);
      return () => {
        video.removeEventListener('ended', onEnded);
      };
    }
  }, []);
  
  if (!videoEnded) {
    return (
      // You can remove bg-black here if you want the GIF to be visible immediately in the background,
      // or only use it for the video stage.
      <div
        className={`fixed inset-0 flex items-center bg-black justify-center ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.5s ease-out' }}
      >
        <video 
          ref={videoRef}
          className="h-1/2 w-full object-cover"
          style={{ 
            objectPosition: 'center bottom', 
            clipPath: 'inset(0 0 5px 0)' // crops 5px from the bottom
          }}
          autoPlay
          muted
          playsInline
        >
          <source src={introVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  return (
    // Apply the background GIF to the full page here.
    <div 
      className="flex flex-col min-h-screen items-center justify-start"
      style={{ 
        backgroundImage: `url(${endPage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        className="w-full text-center mt-8 mb-16 animate-fadeIn"
        style={{ animationDelay: '0.5s', paddingTop: '70px' }} // Added paddingTop here
      >
        <p className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight px-4">
          <div className="w-full">
            <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '1s' }}>
              Venture capital, reimagined —{' '}
            </span>
            <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '2s' }}>
              Funded by rebels.{' '}
            </span>
          </div>
          <div className="w-full">
            <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '3s' }}>
              Backed by vision.{' '}
            </span>
            <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '4s' }}>
              Driven by{' '}
            </span>
            <strong className="font-bold opacity-0 animate-fadeIn" style={{ animationDelay: '5s' }}>
              you.
            </strong>
          </div>
        </p>
      </div>

      <div 
        className="w-full max-w-md text-center animate-fadeIn block opacity-0"
        style={{ animationDelay: '6s' }}
      >
        {success === 'true' ? (
          <div>
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white p-3">
                <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-center text-3xl font-bold text-white">You&apos;re on the list!</h1>
            <p className="mb-8 text-center text-black">
              Thank you for joining our community of investors.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white p-3">
                <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-center text-3xl font-bold text-white">Something went wrong</h1>
            <p className="mb-8 text-center text-gray-300">
              We couldn&apos;t complete your registration. Please try again or contact our support team for assistance.
            </p>
          </>
        )}
        
        <button 
          onClick={handleReturnHome}
          className="w-full rounded-md bg-white py-3 text-black font-medium transition-all hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-black"
        >
          Return to Home
        </button>
      </div>

      {/* <div 
        className="w-full text-center mt-16 animate-fadeIn block opacity-0"
        style={{ animationDelay: '7s' }}
      >
        <p className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight px-4">
          {success === 'true' 
            ? "Thank you for joining us in reshaping the future of investing." 
            : "Need help? Contact our support team at roy@limitlessvc.co"}
        </p>
      </div> */}
    </div>
  );
};

// Define animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 1s forwards;
  }
`;
document.head.appendChild(style);

export default Waitlist;
