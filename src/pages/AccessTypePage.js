import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import Logo from '../assets/logo.png'
import endPageGif from '../assets/endPage.gif'

export const AccessTypePage = () => {
  const navigate = useNavigate()
  const shineRef = useRef(null)

  // Optional: Animate the shine effect on the title
  useEffect(() => {
    const shine = shineRef.current
    if (!shine) return
    let timeout
    const animate = () => {
      shine.classList.remove('shine')
      void shine.offsetWidth // trigger reflow
      shine.classList.add('shine')
      timeout = setTimeout(animate, 3500)
    }
    animate()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Animated GIF background */}
      <img
        src={endPageGif}
        alt="Background animation"
        className="absolute inset-0 w-full h-full object-cover z-0 animate-fadein"
        style={{ pointerEvents: 'none' }}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

      {/* Logo at the top, clickable */}
      <div className="z-20 flex justify-center pt-6 pb-2">
        <button onClick={() => navigate('/')} className="focus:outline-none">
          <img src={Logo} alt="Limitless Logo" className="h-20 w-auto drop-shadow-xl transition-transform hover:scale-105" />
        </button>
      </div>

      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center z-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 60 }}
          className="text-center mb-14"
        >
          <h1
            ref={shineRef}
            className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#e5e4e2] via-[#b3b6b7] to-[#f7f7f7] bg-clip-text text-transparent relative platinum-shine-chrome drop-shadow-xl"
            style={{ position: 'relative', display: 'inline-block', letterSpacing: '-0.03em' }}
          >
            Early Access
            <span className="absolute left-0 top-0 w-full h-full pointer-events-none" />
          </h1>
          <p className="text-2xl text-gray-200 max-w-2xl mx-auto drop-shadow-lg font-light">
            Select your role to access our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl">
          {/* Retail Investor Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 60 }}
            whileHover={{ scale: 1.045, boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)" }}
            className="bg-white/40 dark:bg-white/10 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 flex flex-col glassy-premium"
            style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.13)' }}
          >
            <div className="p-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-serif">Retail Investor</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-8 flex-grow font-light">
                Access premium investment opportunities as an accredited investor with full transparency and lower minimums.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/direct-signin")}
                  className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/direct-signup")}
                  className="w-full py-3 border border-black text-black rounded-xl font-semibold hover:bg-black/5 transition-colors shadow"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>

          {/* GP / VC Firm Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 60 }}
            whileHover={{ scale: 1.045, boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)" }}
            className="bg-white/40 dark:bg-white/10 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 flex flex-col glassy-premium"
            style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.13)' }}
          >
            <div className="p-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-serif">GP / VC Firm</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-8 flex-grow font-light">
                Partner with us to expand your reach, access additional capital, and streamline your fundraising process.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/gp-signin")}
                  className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/gp-signup")}
                  className="w-full py-3 border border-black text-black rounded-xl font-semibold hover:bg-black/5 transition-colors shadow"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Platinum chrome shine animation CSS */}
      <style>{`
        .platinum-shine-chrome {
          background: linear-gradient(120deg, #e5e4e2 0%, #b3b6b7 30%, #f7f7f7 50%, #b3b6b7 70%, #e5e4e2 100%);
          background-size: 300% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: shine-move-chrome 2.8s cubic-bezier(0.4,0,0.2,1) infinite;
          filter: drop-shadow(0 2px 16px #b3b6b7cc);
        }
        @keyframes shine-move-chrome {
          0% { background-position: 300% center; }
          100% { background-position: 0% center; }
        }
        .shine {
          animation: shine-move-chrome 2.8s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .glassy-premium {
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.12) inset;
          border: 1.5px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(18px) saturate(1.2);
        }
      `}</style>
    </div>
  )
}

export default AccessTypePage 