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
    <div
        className={`fixed inset-0 flex items-center justify-center bg-black ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.5s ease-out' }}
    >
        <div className="w-full max-w-4xl aspect-video flex items-center justify-center">
            <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
            >
            <source src={introVideo} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
    </div>
    );
  }
  
  return (
    // Apply the background GIF to the full page here.
    <div
        className="flex flex-col min-h-screen items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${endPage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-4xl my-12">
          <p className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight space-y-4">
            <div>
              <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '1s' }}>
                Venture capital, reimagined —{' '}
              </span>
              <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '2s' }}>
                Funded by rebels.{' '}
              </span>
            </div>
            <div>
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

        <div className="max-w-md mx-auto my-12 opacity-0 animate-fadeIn" style={{ animationDelay: '6s' }}>
          {success === 'true' ? (
            <>
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-white p-3">
                  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white">You&apos;re on the list!</h1>
              <p className="mb-8 text-white">
                Thank you for joining our community of investors.
              </p>
            </>
          ) : (
            <>
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-white p-3">
                  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white">Something went wrong</h1>
              <p className="mb-8 text-gray-300">
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
