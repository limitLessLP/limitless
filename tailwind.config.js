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
    'text-green-400'
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200%)" }
        }
      },
      animation: {
        shine: "shine 4s linear infinite"
      }
    }
  },
  plugins: [],
};