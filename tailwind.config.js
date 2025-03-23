/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-blue-500/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'text-blue-400',
    'text-purple-400',
    'text-green-400',
    'animation-delay-2000',
    'animation-delay-4000'
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200%)" }
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        shine: "shine 4s linear infinite",
        blob: "blob 7s infinite",
      },
      fontFamily: {
        freight: ['Freight Text Pro', 'serif'],
      },
      animationDelay: {
        2000: '2000ms',
        4000: '4000ms',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.animation-delay-2000': {
          'animation-delay': '2s',
        },
        '.animation-delay-4000': {
          'animation-delay': '4s',
        },
      })
    },
  ],
};