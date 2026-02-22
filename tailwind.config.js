/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stitch: {
          dark: '#030712', // deep space black/blue
          blue: '#1e3a8a', // deep blue
          cyan: '#06b6d4', // bright cyan
          lightBlue: '#38bdf8', // lighter highlight
          magenta: '#d946ef', // energetic pink/magenta for chaos/actions
          orange: '#f97316', // bright orange for warnings
          green: '#22c55e', // alien green
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(circle at top, #1e3a8a 0%, #030712 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
